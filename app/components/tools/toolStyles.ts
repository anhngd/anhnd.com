// Shared class names for the tool pages, so every tool looks and behaves the same.
// The look is macOS: inset fields, push buttons, hairline panels (see app/globals.css).

export const card = 'bg-card border border-line rounded-xl shadow-[var(--shadow-card)]'

export const label = 'text-xs text-ink-3'

export const field =
  'mac-field w-full font-mono text-[13px] leading-relaxed text-ink px-3.5 py-2.5 ' +
  'placeholder:text-ink-4 focus:outline-none'

export const readonlyField = `${field} bg-sunken`

export const primaryButton =
  'mac-primary inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

export const secondaryButton =
  'mac-push inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm text-ink-2 hover:text-ink ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

export const chip =
  'mac-push px-3 py-1.5 text-xs text-ink-2 rounded-full hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed'

/** Class for a checkbox rendered as a pill; pair the input (class "peer sr-only") with a label using this. */
export const toggleChip =
  'mac-push flex items-center gap-2 px-3 py-1.5 text-xs text-ink-2 rounded-full cursor-pointer select-none ' +
  'peer-checked:bg-brand-soft peer-checked:bg-none peer-checked:border-brand peer-checked:text-brand-soft-ink peer-checked:[&_.dot]:bg-brand ' +
  'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2'
