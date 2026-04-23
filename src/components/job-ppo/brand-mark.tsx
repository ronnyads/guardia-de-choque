import Link from 'next/link'

type BrandMarkProps = {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span
        aria-hidden
        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-black uppercase tracking-[0.2em]"
      >
        JP
      </span>
      <span className={compact ? 'hidden sm:block' : 'block'}>
        <strong className="display-title block text-2xl">JOB PPO</strong>
        <span className="subtle text-xs uppercase tracking-[0.25em]">
          premium discovery club
        </span>
      </span>
    </Link>
  )
}
