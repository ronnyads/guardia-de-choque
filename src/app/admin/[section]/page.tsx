import { notFound } from 'next/navigation'
import { WorkspacePage } from '@/components/job-ppo/workspace-page'
import { adminSections } from '@/lib/job-ppo/mock-data'

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const config = adminSections[section]

  if (!config) {
    notFound()
  }

  return <WorkspacePage section={config} />
}
