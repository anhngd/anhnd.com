// Shared class names for the tool pages, so every tool looks and behaves the same.

export const card = 'bg-white border border-[#F0EEEC] rounded-2xl'

export const label = 'text-xs text-[#8A8886]'

export const field =
  'w-full font-mono text-[13px] leading-relaxed text-[#1A1A1A] bg-white border border-[#E1DFDD] rounded-xl px-4 py-3 ' +
  'placeholder:text-[#B4B2AF] transition-colors focus:outline-none focus:border-[#FF5F00] focus:ring-2 focus:ring-[#FF5F00]/20'

export const readonlyField = field.replace('bg-white', 'bg-[#FAFAF9]')

export const primaryButton =
  'inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-sm rounded-lg hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm text-[#484644] border border-[#E1DFDD] rounded-lg hover:border-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors'

export const chip =
  'px-3 py-1.5 text-xs rounded-full bg-[#F3F2F1] text-[#605E5C] hover:bg-[#E8E6E3] transition-colors'

/** Class for a checkbox rendered as a pill; pair the input (class "peer sr-only") with a label using this. */
export const toggleChip =
  'flex items-center gap-2 px-3 py-1.5 text-xs text-[#605E5C] bg-white border border-[#E1DFDD] rounded-full cursor-pointer select-none transition-colors ' +
  'peer-checked:bg-[#FFF1E8] peer-checked:border-[#FF5F00] peer-checked:text-[#B84400] peer-checked:[&_.dot]:bg-[#FF5F00] ' +
  'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus-visible:ring-2 peer-focus-visible:ring-[#FF5F00] peer-focus-visible:ring-offset-2'
