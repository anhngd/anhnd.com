// Shared class names for the tool pages, so every tool looks and behaves the same.

export const card = 'bg-card border border-line rounded-2xl'

export const label = 'text-xs text-ink-3'

export const field =
  'w-full font-mono text-[13px] leading-relaxed text-ink bg-card border border-line-strong rounded-xl px-4 py-3 ' +
  'placeholder:text-ink-3 transition-colors focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export const readonlyField = field.replace('bg-card', 'bg-page')

export const primaryButton =
  'inline-flex items-center justify-center gap-2 px-4 py-2 bg-invert text-on-invert text-sm rounded-lg hover:bg-invert-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors'

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm text-ink-2 border border-line-strong rounded-lg hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors'

export const chip =
  'px-3 py-1.5 text-xs rounded-full bg-sunken text-ink-2 hover:bg-sunken-2 transition-colors'

/** Class for a checkbox rendered as a pill; pair the input (class "peer sr-only") with a label using this. */
export const toggleChip =
  'flex items-center gap-2 px-3 py-1.5 text-xs text-ink-2 bg-card border border-line-strong rounded-full cursor-pointer select-none transition-colors ' +
  'peer-checked:bg-brand-soft peer-checked:border-brand peer-checked:text-brand-soft-ink peer-checked:[&_.dot]:bg-brand ' +
  'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2'
