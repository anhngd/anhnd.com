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
          <span className="text-[#FF5F00]">1Click</span> Password Generation
        </>
      }
      tagline="Pick a platform. Get a password that fits its rules, graded from Weak to Very strong."
      description={description}
      path={path}
      category="SecurityApplication"
    >
      <div className="max-w-3xl">
        <PasswordGenerator />
      </div>
    </ToolPage>
  )
}
