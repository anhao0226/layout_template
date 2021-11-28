const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        config.plugin('compressionPlugin')
            .use(new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: productionGzipExtensions,
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            }))
    },
    devServer: {
    }
}