// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            '^/': {
                target: 'https://api.deezer.com',
                ws: true,
                changeOrigin: true
            },
            '^/auth/facebook': {
                target: 'http://localhost:3333',
                ws: true,
                changeOrigin: true
            }
        }
      }
  }