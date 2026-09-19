import ToolPage, { toolMetadata } from '../../components/tools/ToolPage'
import PasswordGenerator from './PasswordGenerator'

const name = '1Click Password Generation'
const description =
  'Pick a platform — Google, Apple, GitHub, Wi-Fi and more — and get a random password that follows its rules, graded from Weak to Very strong, in one click. Generated in your browser.'
const path = '/tools/password-generator'

export const metadata = toolMetadata({ name, description, path })

export default function PasswordGeneratorPage() {
  return (
    <ToolPage
      name={name}
      heading={
        <>
          <span className="text-brand-ink">1Click</span> Password Generation
        </>
      }
      tagline="Pick a platform. Get a password that fits its rules, graded from Weak to Very strong."
      description={description}
      path={path}
      category="SecurityApplication"
      note="Passwords are generated in your browser with the Web Crypto API and are never sent or stored. Only your Auto-copy preference is remembered on this device. Platform rules change without notice; if a site rejects a password, follow the message on its form."
    >
      <div className="max-w-3xl">
        <PasswordGenerator />
      </div>
    </ToolPage>
  )
}
