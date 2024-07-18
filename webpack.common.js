const path = require('path')

const CopyPlugin = require('copy-webpack-plugin');

const HtmlPlugin = require('html-webpack-plugin')

const tailwindcss = require('tailwindcss')

const autoprefixer = require('autoprefixer')

module.exports = {
    entry: {
        popup: path.resolve('./src/popup/popup.tsx'),
        background: path.resolve('./src/background/background.ts')
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                use : ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'ppostcss',
                            plugins: [tailwindcss, autoprefixer],
                        },
                    }
                }],
                test: /\.css$/i,
            }
        ]
    },

    plugins: [
        new CopyPlugin({
            patterns: [
              { 
                from: path.resolve('src/static'), 
                to: path.resolve('dist') 
              },
            ],
          }),
            ...getHtmlPlugins([
            'popup'
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
    },
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'Salah Times',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}