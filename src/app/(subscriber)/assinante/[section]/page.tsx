import { notFound } from 'next/navigation'
import { WorkspacePage } from '@/components/job-ppo/workspace-page'
import { subscriberSections } from '@/lib/job-ppo/mock-data'

export default async function SubscriberSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const config = subscriberSections[section]

  if (!config) {
    notFound()
  }

  return <WorkspacePage section={config} />
}
