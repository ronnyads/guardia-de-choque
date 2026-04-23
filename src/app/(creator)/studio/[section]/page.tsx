import { notFound } from 'next/navigation'
import { WorkspacePage } from '@/components/job-ppo/workspace-page'
import { creatorSections } from '@/lib/job-ppo/mock-data'

export default async function CreatorSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const config = creatorSections[section]

  if (!config) {
    notFound()
  }

  return <WorkspacePage section={config} />
}
