const nextConfig = {
  // Configure for GitHub Pages deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Set base path for GitHub Pages (will be updated by GitHub Actions)
  basePath: process.env.NODE_ENV === 'production' ? '/todo-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/todo-app/' : '',
}

module.exports = nextConfig
