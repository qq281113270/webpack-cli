/*
 * @Author: your name
 * @Date: 2020-12-28 10:56:55
 * @LastEditTime: 2022-06-01 10:28:35
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /webpack-cli/@webpack-cli-cjs/client/config/index.js
 */
const path = require('path')
const fs = require('fs')
const { merge } = require('webpack-merge')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// const           { createVariants } = require( "parallel-webpack";
const clientBaseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const prodConfig = require('./webpack.prod.config')
const testConfig = require('../../webpack.test.config')

// const userDevConfig = require('../../user-webpack-config/webpack.dev.config')
// const userProdConfig = require('../../user-webpack-config/webpack.prod.config')
// const { getArgv } = require("../../utils");
// const webpackEnv = getArgv("webpackEnv"); // 环境参数
// const target = getArgv("target"); // 环境参数

const {
  NODE_ENV, // 环境参数
  webpackEnv, // 环境参数
  target, // 环境参数
} = process.env // 环境参数

//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development'
//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production'

// console.log('webpackEnv=',webpackEnv)
// console.log('isEnvDevelopment=',isEnvDevelopment)
// console.log('target=',target)
// console.log('isEnvProduction=',isEnvProduction)
// console.log('isEnvProduction=',isEnvProduction)

// let isWeb = target == "web";

// // 判断是web环境还是node环境
// let targetConfig = isWeb ? webConfig : nodeConfig;

//添加smp.wrap会有bug 编译缓存出问题
const smp = new SpeedMeasurePlugin()
module.exports = async () => {
  let userDevConfig = {}
  if (
    fs.existsSync(process.cwd() + '/user-webpack-config/webpack.dev.config.js')
  ) {
    userDevConfig = require(process.cwd() +
      '/user-webpack-config/webpack.dev.config.js')
  }

  // let userDevConfig = {}
  // try {
  //   userDevConfig = require(process.cwd() +
  //     '/user-webpack-config/webpack.dev.config.js')
  // } catch (error) {
  //   console.error('userDevConfig error:', error)
  // }

  // let userDevConfig = await new Promise(async (resolve, reject) => {
  //   import(
  //     path.join(process.cwd(), "/user-webpack-config/webpack.dev.config.js")
  //   )
  //     .then((module) => {
  //       resolve(module.default || {});
  //     })
  //     .catch((error) => {
  //       console.error("userDevConfig error:", error);
  //       resolve({});
  //     });
  // });
  let userProdConfig = {}
  if (
    fs.existsSync(process.cwd() + '/user-webpack-config/webpack.prod.config.js')
  ) {
    userProdConfig = require(process.cwd() +
      '/user-webpack-config/webpack.prod.config.js')
  }
  // try {
  //   userProdConfig = require(process.cwd() +
  //     '/user-webpack-config/webpack.prod.config.js')
  // } catch (error) {
  //   console.error('userProdConfig error:', error)
  // }
  // let userProdConfig = await new Promise(async (resolve, reject) => {
  //   import(
  //     path.join(process.cwd(), '/user-webpack-config/webpack.prod.config.js')
  //   )
  //     .then((module) => {
  //       resolve(module.default || {})
  //     })
  //     .catch((error) => {
  //       console.error('userProdConfig error:', error)
  //       resolve({})
  //     })
  // })

  let config = {}
  if (webpackEnv == 'test') {
    //   测试代码打包
    config = merge(
      // baseConfig,
      clientBaseConfig,
      testConfig,
      isEnvDevelopment ? devConfig : prodConfig,
      isEnvDevelopment ? userDevConfig : userProdConfig,
      // prdConfig,
    )
  } else {
    // 源码打包
    config = merge(
      // baseConfig,
      clientBaseConfig,
      isEnvDevelopment ? devConfig : prodConfig,
      isEnvDevelopment ? userDevConfig : userProdConfig,
    )
    const {
      devServer: {
        open: autoOpenBrowser, // 是否自动开启浏览器
        liveReload, // 是否自动刷新
      } = {},
    } = config

    // 开启浏览器重新刷新功能
    if (isEnvDevelopment && liveReload) {
      Object.keys(config.entry).forEach((name) => {
        //在所有js中 添加WebPACK热中间件  https://www.npmjs.com/package/webpack-hot-middleware
        config.entry[name] = [
          // 把中间件打包进去每个js中
          // path.join(__dirname, "../dev-client-reload.js"),
        ].concat(config.entry[name])
      })
    }
  }
  //  console.log('config=',config.entry)
  return config
}
