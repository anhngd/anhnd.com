import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import CronTool from './CronTool'

const name = 'Cron Explainer'
const description =
  'Translate a cron expression into plain English and preview its next run times in local time or UTC. Supports ranges, lists, steps, names and @macros.'
const path = '/tools/cron-explainer'

export const metadata = toolMetadata({ name, description, path })

export default function CronPage() {
  return (
    <ToolPage
      name={name}
      tagline="Turn a cron expression into plain English and see exactly when it will run next."
      description={description}
      path={path}
    >
      <CronTool />
    </ToolPage>
  )
}
