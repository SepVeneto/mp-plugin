module.exports = {
    chainWebpack: (config) => {
        // config.resolveLoader.alias.set(
        //     'custom-uniapp-router-view-loader',
        //     'uniapp-router-view-loader'
        // );

        config.module
            .rule('vue')
            .test(/\.vue$/)
            .use('uniapp-router-view-loader')
            .loader('../dist/webpack.cjs')
            .end();
    }
};