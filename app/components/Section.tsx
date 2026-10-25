/**
 * The page rhythm: a hairline rule, a label in the left margin (sticky on wide
 * screens), content in the main column. Every section on the site uses it, so
 * sparse pages still read as a designed grid rather than a stack of blocks.
 */
export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string
  /** Two-digit counter shown before the title, e.g. "01". */
  index?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={id} className="border-t border-line px-5 sm:px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[11rem_1fr] gap-x-10 gap-y-6 py-12 sm:py-16">
        <h2
          id={id}
          className="flex items-baseline gap-2.5 text-xs uppercase tracking-[0.14em] text-ink-3 md:sticky md:top-20 md:self-start"
          style={{ fontWeight: 600 }}
        >
          {index && (
            <span className="text-ink-4 tabular-nums" aria-hidden="true">
              {index}
            </span>
          )}
          {title}
        </h2>

        <div>{children}</div>
      </div>
    </section>
  )
}
