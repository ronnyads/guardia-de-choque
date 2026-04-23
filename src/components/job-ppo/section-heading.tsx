type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="display-title text-4xl sm:text-5xl">{title}</h2>
      <p className="muted text-base leading-7 sm:text-lg">{description}</p>
    </div>
  )
}
