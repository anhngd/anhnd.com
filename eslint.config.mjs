import nextConfig from 'eslint-config-next'

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ['.next/**', '.verify/**', 'out/**', 'node_modules/**'],
  },
]

export default eslintConfig
