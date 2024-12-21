const inputPath =
    process.env.NODE_ENV === 'production'
        ? './src/sdk/wx/index.ts'
        : './test/wxTest.ts'
export default {
    publicDir: '', // 静态资源文件
    build: {
        outDir: './public/wx', // 输出目录
        sourcemap: true, // 是否生成 source map
        emptyOutDir: false,
        lib: {
            name: 'WXSDK',
            entry: [inputPath],
            fileName: (format, entryName) => `sdk-wx-1.0.0.${format}.js`,
            formats: ['cjs', 'es', 'umd'],
        },
        watch: {
            clearScreen: false,
        },
    },
}
