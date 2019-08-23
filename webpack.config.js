const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/src/js/app.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build'),
    },
    module: {
        rules: [{
            test: /\.(js|ts)$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        '@babel/proposal-class-properties'
                    ]
                }
            }
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
};
