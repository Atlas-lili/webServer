module.exports = {
  devServer: {
    // 设置主机地址
    host: 'localhost',
    // 设置默认端口
    port: 8080,
    // 设置代理
    proxy: {
      '/api': {
        // 目标 API 地址
        target: 'http://19253c69g1.51mypc.cn:9999/',
        pathRewrite: {
          '^/api': 'xuntec'
        }
      }
    }
  }
}
