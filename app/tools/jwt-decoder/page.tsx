import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import JwtTool from './JwtTool'

const name = 'JWT Decoder'
const description =
  'Decode a JSON Web Token to read its header, payload and expiry, with expired / not-yet-valid detection. Decoded locally, never uploaded.'
const path = '/tools/jwt-decoder'

export const metadata = toolMetadata({ name, description, path })

export default function JwtPage() {
  return (
    <ToolPage
      name={name}
      tagline="Read a token’s header, payload and expiry. Decoded in your browser, never uploaded."
      description={description}
      path={path}
      category="SecurityApplication"
    >
      <JwtTool />
    </ToolPage>
  )
}
