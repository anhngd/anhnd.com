import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import TimestampTool from './TimestampTool'

const name = 'Unix Timestamp Converter'
const description =
  'Convert Unix timestamps (seconds, milliseconds, microseconds, nanoseconds) to readable dates in any time zone, and dates back to timestamps. Runs in your browser.'
const path = '/tools/timestamp'

export const metadata = toolMetadata({ name, description, path })

export default function TimestampPage() {
  return (
    <ToolPage
      name={name}
      tagline="Turn epoch seconds or milliseconds into dates in any time zone, and dates back into timestamps."
      description={description}
      path={path}
    >
      <TimestampTool />
    </ToolPage>
  )
}
