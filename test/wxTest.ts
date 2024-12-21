import wxGameSdk from '@/sdk/wx/index'

console.log('🚀 ~ wxGameSdk:', wxGameSdk)
wxGameSdk.init({})
const btnList = [
    {
        label: '登录',
        onClick: () => {
            wxGameSdk.login({})
        },
    },
    {
        label: 'banner广告',
        onClick: () => {
            const ad = wxGameSdk.showBannerAd({
                adUnitId: '',
                style: { left: 0, top: 0, width: 100, height: 100 },
            })
            console.log('🚀 ~ ad:', ad)
        },
    },
    {
        label: '激励广告',
        onClick: () => {
            const ad = wxGameSdk.showRewardedVideoAd({
                adUnitId: '',
            })
            console.log('🚀 ~ ad:', ad)
        },
    },
    {
        label: '插屏广告',
        onClick: () => {
            const ad = wxGameSdk.showInterstitialAd({
                adUnitId: '',
            })
            console.log('🚀 ~ ad:', ad)
        },
    },
]
function initBtnList() {
    const width = 100
    const height = 50
    const padding = 20
    const { windowHeight, windowWidth } = wxGameSdk.getSystemInfo()
    const max = Math.floor(windowWidth / width)
    const space = (windowWidth - padding - max * width) / max
    let top = 100
    let col = 0

    btnList.forEach(({ label, onClick }, index) => {
        const _index = index % max
        let left = (width + space) * _index + padding
        if (index && _index === 0) {
            left = padding
            col += 1
            top += height + space
        }

        const button = wx.createUserInfoButton({
            type: 'text', // 文本按钮
            text: label, // 按钮文字
            style: {
                left,
                top,
                width, // 按钮宽度
                height, // 按钮高度
                backgroundColor: '#ff5722', // 按钮背景色
                color: '#ffffff', // 按钮文字颜色
                fontSize: 16, // 按钮文字大小
                borderRadius: 8, // 按钮圆角
                textAlign: 'center', // 按钮文字对齐方式
                lineHeight: 50, // 按钮文字行高
            },
        })
        button.onTap(onClick)
    })
}
initBtnList()
