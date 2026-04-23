import Link from 'next/link'
import type { CreatorSummary } from '@/lib/job-ppo/types'

type ProfileCardProps = {
  creator: CreatorSummary
}

export function ProfileCard({ creator }: ProfileCardProps) {
  return (
    <article className="surface-card overflow-hidden p-3">
      <div
        className="profile-portrait"
        style={{ ['--portrait-gradient' as string]: creator.portraitGradient }}
      >
        <div className="absolute inset-x-4 bottom-4 z-10 space-y-3">
          <div className="flex flex-wrap gap-2">
            {creator.badges.map((badge) => (
              <span key={badge} className="pill bg-black/25 text-white">
                {badge}
              </span>
            ))}
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">{creator.artisticName}</p>
            <p className="text-sm text-white/78">{creator.tagline}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="pill">{creator.category}</span>
          <strong className="text-lg">R$ {creator.monthlyPrice}/mes</strong>
        </div>
        <p className="muted line-clamp-3 text-sm leading-6">{creator.teaser}</p>
        <div className="flex flex-wrap gap-2">
          {creator.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill text-xs">
              #{tag}
            </span>
          ))}
        </div>
        <Link href={`/criadora/${creator.slug}`} className="button-secondary w-full">
          Ver perfil
        </Link>
      </div>
    </article>
  )
}
