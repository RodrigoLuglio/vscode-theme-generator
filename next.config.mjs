/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  // basePath: "/vscode-theme-generator",
  basePath:
    process.env.NODE_ENV === 'production' ? '/vscode-theme-generator' : '',
  images: {
    unoptimized: true,
  },
  experimental: {
    useWasmBinary: true,
    turbo: {
      rules: {
        '*.wasm': {
          loaders: ['onigasm'],
          as: '*.wasm',
        },
      },
      resolveAlias: {
        'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
      },
    },
  },
}

export default nextConfig
