type PanelProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function Panel({ title, description, actions, children }: PanelProps) {
  return (
    <section className="surface-card fade-border p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
          {description ? <p className="muted max-w-2xl text-sm leading-6">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}
