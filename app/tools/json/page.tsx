import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import JsonTool from './JsonTool'

const name = 'JSON Formatter & Diff'
const description =
  'Validate, pretty-print, minify and sort JSON with exact error line and column, and compare two JSON documents. Runs in your browser.'
const path = '/tools/json'

export const metadata = toolMetadata({ name, description, path })

export default function JsonPage() {
  return (
    <ToolPage
      name={name}
      tagline="Validate, format or minify JSON with the exact line and column of any error, and compare two documents."
      description={description}
      path={path}
    >
      <JsonTool />
    </ToolPage>
  )
}
