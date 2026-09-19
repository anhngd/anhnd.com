import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import MyIpTool from './MyIpTool'

const name = 'My IP'
const description =
  'See your public IPv4 and IPv6 address, approximate location, ISP and ASN, plus your browser details. Look up any IP address too.'
const path = '/tools/my-ip'

export const metadata = toolMetadata({ name, description, path })

export default function MyIpPage() {
  return (
    <ToolPage
      name={name}
      tagline="Your public IP address, where it appears to be, and what your browser reveals. Look up any other IP too."
      description={description}
      path={path}
      category="UtilitiesApplication"
      note={
        <>
          This is the one tool that talks to outside services: your browser asks <strong style={{ fontWeight: 500 }}>ipify.org</strong> and{' '}
          <strong style={{ fontWeight: 500 }}>ipwho.is</strong> for your address and its details, and they see your IP just as any
          website you visit does. Addresses typed into the lookup box are sent to ipwho.is. Requests carry no cookies or
          referrer, and nothing is saved.
        </>
      }
    >
      <MyIpTool />
    </ToolPage>
  )
}
