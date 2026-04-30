---
title: "CI/CD for Unity Mobile Games: Lessons From the Trenches"
date: "2026-04-15"
excerpt: "Setting up CI/CD for Unity mobile games is harder than it looks. License servers, 40-minute builds, code signing nightmares — here's what actually works after years of pain."
category: "Engineering"
tags: ["unity", "ci-cd", "mobile", "game-development", "devops"]
author: "AnhND"
---

# CI/CD for Unity Mobile Games: Lessons From the Trenches

I've been shipping mobile games on Unity for the better part of a decade. And if there's one thing I wish someone had told me earlier, it's this: **the build pipeline is half the product**.

Not the gameplay. Not the art. Not even the monetization. The build pipeline.

Because no matter how good your game is, if it takes 45 minutes to produce a build, if the iOS provisioning breaks every other week, if your QA team is waiting hours for a TestFlight invite — your team will move slowly. And in mobile games, slow means dead.

So let's talk about what actually works.

## Why Unity Makes This Hard

Web developers reading this might wonder why CI/CD for Unity is even a topic worth writing about. CI/CD is solved, right? Push code, run tests, ship a container. Done.

Not in Unity. Not even close. Here's why:

- **Build times are brutal.** A clean Unity build of a moderate-sized mobile game easily hits 30-60 minutes. Asset import alone can take 20+ minutes on a fresh checkout.
- **License management is a nightmare.** Unity's licensing system was designed for individual seats, not headless CI runners. Activation, deactivation, floating licenses — every new build agent is a fresh battle.
- **Two ecosystems, two pipelines.** Android needs the Android SDK, NDK, JDK, Gradle. iOS needs Xcode, code signing, provisioning profiles, TestFlight. They share almost nothing except the Unity export step.
- **Massive artifacts.** Asset bundles, OBB files, IL2CPP-compiled binaries — your build outputs can be hundreds of megabytes. Caching matters. A lot.
- **Native dependencies.** Plugins for ads, analytics, IAP, push notifications — each one adds Gradle dependencies, iOS pods, manifest changes. One bad plugin update can break everything silently.

If you treat Unity CI like web CI, you'll burn out fast.

## The Pipeline I Actually Use

After trying every popular option (and getting bruised by most of them), here's the stack I've settled on for solo or small-team Unity mobile projects:

```
┌────────────────────────────────────────────────────────┐
│  GitHub (source + LFS for assets)                      │
└─────────────┬──────────────────────────────────────────┘
              │ push / tag / manual trigger
              ▼
┌────────────────────────────────────────────────────────┐
│  GitHub Actions (orchestration + Linux runners)        │
│  ├── Lint, format, unit tests           [3 min]        │
│  ├── Unity Test Runner (PlayMode)        [8 min]        │
│  └── Build dispatch                                    │
└─────────────┬───────────────────────┬──────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐   ┌──────────────────────────────┐
│  Android (Linux)    │   │  iOS (macOS — self-hosted)   │
│  game-ci/unity-     │   │  Xcode + fastlane            │
│  builder image      │   │                              │
│  Output: .aab       │   │  Output: .ipa                │
└─────────┬───────────┘   └──────────────┬───────────────┘
          │                              │
          ▼                              ▼
┌────────────────────────────────────────────────────────┐
│  Distribution (parallel)                               │
│  ├── Firebase App Distribution (internal QA)           │
│  ├── Google Play Internal Testing (Android)            │
│  └── TestFlight (iOS)                                  │
└────────────────────────────────────────────────────────┘
```

The key choice: **GitHub Actions for orchestration, but iOS builds on a self-hosted Mac mini**.

Why? Because GitHub-hosted macOS runners cost 10x more than Linux runners and your iOS builds will eat through your minutes in days. A used Mac mini M2 sitting in your closet pays for itself in 2-3 months.

## The game-ci Project Saved My Life

If you take one thing from this post, it's this: use [game.ci](https://game.ci/) (also known as `unityci/editor`).

It's an open-source set of pre-built Docker images for Unity that handle the licensing dance, target platform configuration, and build invocation. Without it, you're rolling your own Docker images and fighting Unity's CLI for weeks.

A minimal Android build job looks like this:

```yaml
build-android:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        lfs: true

    - uses: actions/cache@v4
      with:
        path: Library
        key: Library-${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
        restore-keys: |
          Library-

    - uses: game-ci/unity-builder@v4
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}
        UNITY_PASSWORD: ${{ secrets.UNITY_PASSWORD }}
      with:
        targetPlatform: Android
        androidAppBundle: true
        androidKeystoreName: release.keystore
        androidKeystoreBase64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        androidKeystorePass: ${{ secrets.ANDROID_KEYSTORE_PASS }}
        androidKeyaliasName: ${{ secrets.ANDROID_KEY_ALIAS }}
        androidKeyaliasPass: ${{ secrets.ANDROID_KEY_PASS }}
```

That's it. No custom Dockerfiles, no manual Unity activation, no wrestling with `-batchmode -nographics` flags. The image handles it all.

## The Library Cache: Save Yourself 20 Minutes Per Build

This single line is the difference between 12-minute and 35-minute builds:

```yaml
- uses: actions/cache@v4
  with:
    path: Library
    key: Library-${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
    restore-keys: |
      Library-
```

Unity's `Library/` folder contains imported asset metadata, shader caches, and script compilation outputs. On a fresh checkout, Unity has to re-import every single asset — texture atlases, audio compression, shader variants. For a moderate game, this is 15-25 minutes of pure waste.

Cache it. Always.

The `restore-keys` fallback is critical: even if your asset hash changes, you get *most* of the previous Library and only re-import the changed bits. The difference between a perfect cache hit and a partial cache hit is usually small. The difference between a partial cache hit and a cold start is enormous.

**One gotcha:** the cache size limit on GitHub Actions is 10GB per repo (older entries get evicted). For larger games, you may need to selectively cache subdirectories like `Library/Artifacts` and `Library/ShaderCache` instead of the whole thing.

## iOS: Where Pain Lives

iOS builds are where most teams give up and just... build manually on someone's MacBook. Don't. Here's what works.

### Use fastlane. Actually use it.

I resisted fastlane for years because I thought I was too clever for it. I was wrong. Fastlane handles:

- Provisioning profile management (`match`)
- Code signing certificate rotation (`match`)
- TestFlight upload (`pilot`)
- Build number incrementing (`increment_build_number`)
- Slack / Discord notifications

A typical `Fastfile` for Unity iOS builds:

```ruby
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    setup_ci if ENV['CI']

    match(
      type: "appstore",
      readonly: ENV['CI'] != nil
    )

    increment_build_number(
      build_number: ENV['GITHUB_RUN_NUMBER'] || latest_testflight_build_number + 1,
      xcodeproj: "iOSBuild/Unity-iPhone.xcodeproj"
    )

    build_app(
      project: "iOSBuild/Unity-iPhone.xcodeproj",
      scheme: "Unity-iPhone",
      configuration: "Release",
      export_method: "app-store",
      output_directory: "./build",
      clean: false,
      include_bitcode: false,
      include_symbols: true
    )

    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      changelog: ENV['CHANGELOG'] || "Build #{ENV['GITHUB_RUN_NUMBER']}"
    )
  end
end
```

### Use App Store Connect API keys, not 2FA passwords

Apple deprecated app-specific passwords for App Store Connect. Use API keys.

Generate one in App Store Connect → Users and Access → Keys. Store the `.p8` file as a base64-encoded GitHub secret. Then in fastlane:

```ruby
app_store_connect_api_key(
  key_id: ENV['ASC_KEY_ID'],
  issuer_id: ENV['ASC_ISSUER_ID'],
  key_content: ENV['ASC_KEY_CONTENT_BASE64'],
  is_key_content_base64: true,
  duration: 1200
)
```

This single change fixed about 80% of my "iOS upload randomly fails" issues.

## Build Number Strategy

Sounds boring. Isn't.

Here's the rule: **build numbers must be monotonically increasing across all builds, forever**. If you upload build 47 to TestFlight, you can never upload another build with that number — even from a different branch.

What works:

```bash
# Use GitHub run number as build number
BUILD_NUMBER=$GITHUB_RUN_NUMBER
```

GitHub Actions assigns a unique, increasing run number to every workflow run in a repo. It's perfect for this.

What doesn't work:
- Using git commit count (resets per branch)
- Using timestamp (causes weird ordering issues)
- Manual increments in code (breaks on parallel builds)

Version *name* (e.g., "1.2.3") is a separate concern — that's product/marketing. Version *number* / build number is purely technical and should be automated.

## Distribution: The Three-Tier Strategy

Different audiences, different channels:

| Audience | Android | iOS | Frequency |
|---|---|---|---|
| Internal devs | Firebase App Distribution | Firebase App Distribution | Every commit to main |
| QA team | Google Play Internal Testing | TestFlight Internal | Every PR merge |
| Public beta | Google Play Open Testing | TestFlight External | Weekly tag |
| Production | Google Play Production | App Store | Manual release |

Firebase App Distribution is the unsung hero here. It works for both platforms, doesn't require Apple's review queue, and lets you add testers by email. Use it for fast iteration cycles.

```yaml
- name: Upload to Firebase App Distribution
  uses: wzieba/Firebase-Distribution-Github-Action@v1
  with:
    appId: ${{ secrets.FIREBASE_APP_ID }}
    serviceCredentialsFileContent: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
    groups: internal-qa
    file: build/Android/release.aab
    releaseNotes: |
      Build #${{ github.run_number }}
      Branch: ${{ github.ref_name }}
      Commit: ${{ github.sha }}
```

## Tests: Yes, You Need Them

Unity Test Runner is underused. Most studios have approximately zero automated tests, and they pay for it daily.

You don't need 90% coverage. You need:

**EditMode tests** for pure logic:
- Save/load systems
- Inventory calculations
- Damage formulas
- Currency conversions
- Shop pricing logic

These run in milliseconds, no Unity context needed. They catch the bugs that cause real player rage (items disappearing, wrong gold counts, broken upgrades).

**PlayMode tests** for system integration:
- Scene loading
- UI navigation flows
- Network mocks
- Save migration across versions

These are slower but catch the catastrophic regressions.

```yaml
- uses: game-ci/unity-test-runner@v4
  env:
    UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
  with:
    testMode: editmode
    artifactsPath: test-results/editmode

- uses: game-ci/unity-test-runner@v4
  env:
    UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
  with:
    testMode: playmode
    artifactsPath: test-results/playmode
```

If a PR breaks tests, block the merge. No exceptions. The first time you let "I'll fix it in a follow-up" through, it's already too late.

## Asset Pipeline: Addressables + Remote Builds

If your game has more than ~150MB of assets, you need [Addressables](https://docs.unity3d.com/Packages/com.unity.addressables@latest) and you need to build them remotely.

The pattern:

1. Game binary (small, ships to stores) contains only essential assets
2. Addressable bundles (large, served from CDN) contain everything else
3. CI builds the addressable catalog separately and uploads to your CDN
4. Game downloads catalog on first launch, then bundles on demand

This decouples your **release cycle** (binary updates require store review) from your **content cycle** (asset updates can ship instantly).

A minimal addressable build step:

```yaml
- name: Build Addressables
  run: |
    /opt/Unity/Editor/Unity \
      -batchmode -nographics -quit \
      -projectPath . \
      -executeMethod AddressableAssetSettings.BuildPlayerContent

- name: Upload to S3
  run: |
    aws s3 sync ServerData/ s3://your-cdn-bucket/v$VERSION/ \
      --acl public-read \
      --cache-control "public, max-age=31536000"
```

The `BuildPlayerContent` method needs a custom `AddressableAssetSettings` script in your project — Unity's docs cover this.

## Cost Considerations (For Solo Devs)

If you're a solo founder or small studio, here's roughly what you'll pay:

| Service | Plan | Monthly Cost |
|---|---|---|
| GitHub Actions | Linux runners (private repo) | $0 (2,000 min free) |
| GitHub Actions | macOS runners | ~$80 if used for iOS |
| Self-hosted Mac mini | One-time + electricity | ~$5/mo amortized |
| Unity Personal/Pro license | If revenue < $200K | $0 |
| Firebase App Distribution | Free tier sufficient | $0 |
| AWS S3 (Addressables CDN) | 50GB transfer/mo | ~$5 |
| **Total (solo dev)** | | **~$10/mo** |

The biggest gotcha is GitHub macOS minutes. They count at 10x the rate. A 30-minute iOS build = 300 minutes of your quota. Self-hosted runner pays for itself fast.

## What Breaks (And How to Recover)

A few failure modes I've seen, in order of frequency:

**1. "Unity license expired during build"**

Unity's Personal license requires periodic re-activation. If your CI fails with auth errors, regenerate `UNITY_LICENSE` (`unity-builder` documentation explains how) and update the secret.

**2. "Provisioning profile doesn't match"**

Apple silently invalidates profiles for many reasons. Run `fastlane match nuke distribution && fastlane match appstore` locally, then update CI secrets.

**3. "OutOfMemoryError during IL2CPP"**

Unity's IL2CPP compiler is memory-hungry. On Linux, set:
```bash
export UNITY_THISISAHACK_MAX_MEMORY=8192
```

Or scale up your runner.

**4. "Gradle dependency conflict"**

Some plugin pulled in a conflicting Android dependency. Use `External Dependency Manager` (Google's PlayServicesResolver) and pin versions in your manifest.

**5. "Build hangs forever, no output"**

Unity occasionally deadlocks on shader compilation. Add a timeout to your CI step (e.g., 90 minutes) and let it kill itself. Then add `-disable-assembly-updater` to your invocation, which fixes ~70% of these cases.

## The Compounding Effect

Investing in CI/CD doesn't pay off in the first sprint. It barely pays off in the first month.

But by month 6, you'll be running 50 builds a day across the team, shipping content updates weekly, and catching regressions before they hit testers. By month 12, you'll wonder how anyone ships games without it.

The teams that win in mobile games aren't the ones with the best ideas. They're the ones who can iterate fastest. Your build pipeline is the floor of how fast you can move.

Make it a good floor.

---

*If you're starting fresh: clone [game-ci/unity-actions](https://github.com/game-ci/unity-actions) examples, get a basic Android build green, then add iOS. Don't try to build everything at once. Each piece compounds.*
