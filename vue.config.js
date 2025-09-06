const { defineConfig } = require('@vue/cli-service')

// 检测是否在 GitHub Codespaces 环境中运行
const isCodespaces = process.env.CODESPACES === 'true' || 
                    process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ||
                    process.env.CODESPACE_NAME

// 基础配置
const config = {
  transpileDependencies: true
}

// 仅在 Codespaces 环境中添加特殊的 devServer 配置
if (isCodespaces) {
  config.devServer = {
    // 在 GitHub Codespaces 的 HTTPS 环境中
    // 强制使用安全的 WebSocket 连接
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    },
    // 允许外部访问
    allowedHosts: 'all',
    // 在 Codespaces 中运行时设置正确的主机
    host: '0.0.0.0',
    port: 8080
  }
}

module.exports = defineConfig(config)
