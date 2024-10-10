/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  // basePath: "/vscode-theme-generator",
  basePath:
    process.env.NODE_ENV === 'production' ? '/vscode-theme-generator' : '',
  images: {
    unoptimized: true,
  },
  webpack: function (config, options) {
    config.options = { ...options, asyncWebAssembly: true }
    return config
  },
  experimental: {
    turbo: {
      resolveAlias: {
        'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
      },
    },
  },
}

export default nextConfig
