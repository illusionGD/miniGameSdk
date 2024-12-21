import { defineConfig } from 'vite'
function getProcessParams() {
    const params = {}
    const index = process.argv.findIndex((str) => str === '--')
    if (index < 0) {
        return params
    }

    const arr = process.argv.slice(index + 1)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (!element) {
            break
        }
        const key = arr[i].replace('--', '')
        params[key] = arr[i + 1]
        i += 1
    }
    return params
}

function getBuildConfig() {
    const params = getProcessParams()
    const channel = params['channel']
    console.log('🚀 ~ channel:', channel)
    if (!channel) {
        return {}
    }
    if (channel === 'wx') {
        return require('./config/wxBuildConfig.js').default
    }

    if (channel === 'tt') {
        return require('./config/ttBuildConfig.js').default
    }
}

const config = getBuildConfig()
console.log('🚀 ~ config:', JSON.stringify(config))

export default defineConfig({
    ...config,
    resolve: {
        alias: {
            '@': '/src', // 配置路径别名
        },
    },
    server: {
        // 跨域配置：https://cn.vite.dev/config/server-options.html#server-proxy
        proxy: {},
        host: true,
        hmr: true,
    },
})
