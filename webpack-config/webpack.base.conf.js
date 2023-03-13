const path = require('path');
const webpack = require('webpack');

const HTMLWebpackPlagin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const SRC_PATH = 'src';
const DIST_PATH = 'dist';

const PATHS = {
    src: path.resolve(__dirname, `../${SRC_PATH}`),
    dist: path.resolve(__dirname, `../${DIST_PATH}`),
};

const entries = {
        'common': `${PATHS.src}/`,
    }

module.exports = {
    externals: {
        paths: PATHS
    },
    entry: entries,
    output: {
        filename: 'js/[name].js',
        path: PATHS.dist,
        publicPath: '/',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/].*\.js$/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 20,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.svg/,
                type: 'asset/inline',
                generator: {
                    dataUrl: content => {
                        content = content.toString();
                        return svgToMiniDataURI(content);
                    }
                }
            },
            {

                test: /\.js$/i,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                // Sass
                test: /\.s[c|a]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: path.resolve(__dirname, '../postcss.config.js'),
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {sourceMap: true}
                    }
                ]
            },
        ]
    },
    resolve: {
        alias: {
            '~': PATHS.src,
        }
    },
    plugins: [
        new HTMLWebpackPlagin({
            template: './src/index.html',
        }),
        // new SVGSpritemapPlugin(`frontend/common/sprite/*.svg`, {
        //     output: {
        //         filename: `svg/spritemap.svg`
        //     },
        //     sprite: {
        //         prefix: 'i-',
        //         generate: {
        //             title: false,
        //         }
        //     }
        // }),
        // Provide utils
        new webpack.ProvidePlugin({
            utils: 'utils',
        }),
        // CSS
        new MiniCssExtractPlugin({
            filename: `css/[name].css`
        }),
        // Copy files
        new CopyWebpackPlugin({
                patterns: [
                    {from: `${PATHS.src}/assets/images`, to: `img`},
                    // {from: `${PATHS.src}/common/svg`, to: `svg`},
                ]
            }
        ),
    ],
    cache: {
        type: 'filesystem',
    }
};
