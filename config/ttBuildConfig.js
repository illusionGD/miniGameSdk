export default {
    publicDir: '', // 静态资源文件
    build: {
        outDir: './public/tt', // 输出目录
        sourcemap: true, // 是否生成 source map
        emptyOutDir: false,
        lib: {
            name: 'WXSDK',
            entry: ['./src/sdk/tt/index.ts'],
            fileName: (format, entryName) => `sdk-wx-1.0.0.${format}.js`,
            formats: ['cjs', 'es', 'umd'],
        },
        watch: {
            clearScreen: false,
        },
    },
}
