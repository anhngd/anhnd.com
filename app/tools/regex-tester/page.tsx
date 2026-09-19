import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import RegexTool from './RegexTool'

const name = 'Regex Tester'
const description =
  'Test JavaScript regular expressions with live match highlighting, capture and named groups, flags and a replace preview. Protected against catastrophic backtracking.'
const path = '/tools/regex-tester'

export const metadata = toolMetadata({ name, description, path })

export default function RegexPage() {
  return (
    <ToolPage
      name={name}
      tagline="Test JavaScript regular expressions with live highlighting, groups and a replace preview."
      description={description}
      path={path}
    >
      <RegexTool />
    </ToolPage>
  )
}
