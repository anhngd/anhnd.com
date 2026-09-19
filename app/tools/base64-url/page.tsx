import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import EncoderTool from './EncoderTool'

const name = 'Base64 & URL Encoder'
const description =
  'Encode and decode Base64 (standard or URL-safe) and percent-encoded URLs. UTF-8 safe for accents and emoji. Runs in your browser.'
const path = '/tools/base64-url'

export const metadata = toolMetadata({ name, description, path })

export default function EncoderPage() {
  return (
    <ToolPage
      name={name}
      tagline="Encode and decode Base64 and URLs. Works with any language, emoji included."
      description={description}
      path={path}
    >
      <EncoderTool />
    </ToolPage>
  )
}
