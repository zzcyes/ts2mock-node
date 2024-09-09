// esbuild.config.js

const path = require("path");
const { build } = require("esbuild");

build({
  entryPoints: ["./src/app.js"], // 输入文件
  outfile: "./dist/app.js", // 输出文件
  bundle: true, // 打包所有依赖
  platform: "node", // 设置平台为 Node.js
  target: "node14", // 目标 Node.js 版本
  sourcemap: false, // 生成 source map
  minify: true, // 是否压缩代码
}).catch(() => process.exit(1));
