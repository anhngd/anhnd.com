// Regex testing. Patterns run in a Web Worker so a catastrophic-backtracking pattern can be
// killed on timeout instead of freezing the page.

export const MAX_MATCHES = 1000

export interface RegexRequest {
  pattern: string
  flags: string
  text: string
  /** null skips the replace preview. */
  replacement: string | null
}

export interface RegexMatch {
  index: number
  text: string
  groups: (string | null)[]
  named: Record<string, string | null>
}

export type RegexResponse =
  | { ok: true; matches: RegexMatch[]; truncated: boolean; replaced: string | null }
  | { ok: false; error: string; timedOut?: boolean }

/** Plain JS on purpose: it is loaded into a Blob worker, so it cannot import anything. */
export const REGEX_WORKER_SOURCE = `
self.onmessage = function (event) {
  var request = event.data;
  var reply;
  try {
    var re = new RegExp(request.pattern, request.flags);
    var loops = re.global;
    var matches = [];
    var truncated = false;
    var m;
    while ((m = re.exec(request.text)) !== null) {
      if (matches.length >= ${MAX_MATCHES}) { truncated = true; break; }
      var named = {};
      if (m.groups) {
        for (var key in m.groups) named[key] = m.groups[key] === undefined ? null : m.groups[key];
      }
      matches.push({
        index: m.index,
        text: m[0],
        groups: m.slice(1).map(function (g) { return g === undefined ? null : g; }),
        named: named
      });
      if (!loops) break;
      if (m[0] === '') re.lastIndex++;
    }
    var replaced = null;
    if (request.replacement !== null) {
      replaced = request.text.replace(new RegExp(request.pattern, request.flags), request.replacement);
    }
    reply = { ok: true, matches: matches, truncated: truncated, replaced: replaced };
  } catch (error) {
    reply = { ok: false, error: error && error.message ? error.message : String(error) };
  }
  self.postMessage(reply);
};
`

export interface RegexRunner {
  run(request: RegexRequest): Promise<RegexResponse>
  dispose(): void
}

export function createRegexRunner(timeoutMs = 1500): RegexRunner {
  let worker: Worker | null = null
  let cancelPending: (() => void) | null = null

  const start = () => {
    const url = URL.createObjectURL(new Blob([REGEX_WORKER_SOURCE], { type: 'text/javascript' }))
    worker = new Worker(url)
    URL.revokeObjectURL(url)
  }

  const stop = () => {
    worker?.terminate()
    worker = null
  }

  return {
    run(request) {
      // A newer request replaces whatever is still running.
      cancelPending?.()
      stop()
      start()

      return new Promise<RegexResponse>((resolve) => {
        const current = worker
        const finish = (response: RegexResponse | null) => {
          window.clearTimeout(timer)
          cancelPending = null
          if (response) resolve(response)
        }
        const timer = window.setTimeout(() => {
          stop()
          finish({
            ok: false,
            timedOut: true,
            error: `Stopped after ${timeoutMs / 1000}s. This pattern may be backtracking catastrophically.`,
          })
        }, timeoutMs)

        cancelPending = () => finish(null)
        if (!current) return finish({ ok: false, error: 'Could not start the regex worker.' })
        current.onmessage = (event: MessageEvent<RegexResponse>) => finish(event.data)
        current.onerror = () => finish({ ok: false, error: 'The regex worker crashed.' })
        current.postMessage(request)
      })
    },
    dispose() {
      cancelPending?.()
      stop()
    },
  }
}

export interface Segment {
  text: string
  /** Index into the matches array, or null for text between matches. */
  match: number | null
}

/** Splits text into matched and unmatched pieces for highlighting. Empty matches are skipped. */
export function buildSegments(text: string, matches: RegexMatch[]): Segment[] {
  const segments: Segment[] = []
  let cursor = 0

  matches.forEach((match, index) => {
    if (match.text === '' || match.index < cursor) return
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index), match: null })
    segments.push({ text: match.text, match: index })
    cursor = match.index + match.text.length
  })

  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: null })
  return segments
}
