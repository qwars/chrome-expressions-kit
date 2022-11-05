const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

const MetaTags = { author: "Alexandr Selunin; aka.qwars@gmail.com" };

module.exports = {
    context:  __dirname + '/develop',
    target: 'web',
    cache: {
        type: 'memory',
        cacheUnaffected: true,
    },
    performance: {
        maxEntrypointSize: 1_572_864,
        maxAssetSize: 1_572_864
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Exptession',
            filename: 'popup.html',
            template: 'popup.html',
            inject: false,
	    meta: Object.assign({ viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }, MetaTags )
        }),
        new HtmlWebpackPlugin({
            title: 'Exptession',
            filename: 'options.html',
            template: 'options.html',
            inject: false,
	    meta: Object.assign({ viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }, MetaTags )
        }),
        new MiniCssExtractPlugin({ filename: './styleshets/main.css' }),
        new CopyWebpackPlugin({
            patterns:[ { from: 'icons/*.png' }, { from: 'manifest.json' } ]
        }),
    ],
    optimization: {
        minimize: process.env.npm_lifecycle_event === 'build',
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: { preset: [ 'default', { discardComments: { removeAll: true } } ] }
            }),
            new TerserPlugin({ parallel: true })
        ]
    },
    module: {
	rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|javascripts)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /images.+\.(jpe?g|png|gif|svg|ico)$/,
                type: 'asset/resource',
            },
            {
                test: /fonts.+\.(woff(2)?|ttf|sfd|eot|svg)([?#]+\w+)?$/,
                type: 'asset/resource',
            },
            {
                test: /.+\.(jpe?g|png|gif|svg|ico)$/,
                type: 'asset/resource',
            },
            {
                test: /\.styl$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: '/' }
                    },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions:{ plugins: [ 'postcss-preset-env' ] },
	                    sourceMap: true
	                }
                    },
                    { loader: 'stylus-loader', options: { sourceMap: true } }
                ]
            },
            {
	        test: /\.css$/,
                use: [                    
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions:{ plugins: [ 'postcss-preset-env' ] },
	                    sourceMap: true
	                }
                    }
                ]
	    },
	    {
		test: /\.imba$/,
		loader: 'imba/loader'
	    }
	]
    },
    resolve: {
        alias: {
            path: require.resolve("path-browserify")
        },
        modules: ['node_modules'],
	extensions: [".imba", ".js", ".json"],
    },
    entry: {
        background: './background.imba',
        popup: './popup.imba',
        options: './options.imba'
    },
    output: {
	path: __dirname + "/public",
        filename: "[name].js",
        assetModuleFilename: './assets/[hash][ext][query]'
    }
}
