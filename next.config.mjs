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
    turbo: {
      asyncWebAssembly: true,
      rules: {
        webassemblyModuleFilename: [
          process.env.NODE_ENV === 'production'
            ? '../public/onigasm.wasm'
            : 'onigasm.wasm',
        ],
      },
      resolveAlias: {
        'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
      },
    },
  },
}

export default nextConfig
