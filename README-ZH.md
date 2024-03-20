# 查找Chrome扩展2
find-chrome-extension2

通过名称或扩展ID查找谷歌Chrome扩展程序,如果查找开发中的扩展程序ID必填.

## 安装

```
npm install --save find-chrome-extension2
```

## 使用方法

```javascript
const findChromeExtension = require('find-chrome-extension2');

const dir = findChromeExtension('FigmaCN');

console.log(dir);
```

`console.log` 语句应输出包含扩展程序（如果找到）的目录。示例：`C:\Users\herzshen\AppData\Local\Google\Chrome\User Data\Default\Extensions\japkpjkpfdakpkbcehooampdjfgefndj\1.6_0`。如果未找到，`findChromeExtension` 函数返回 null。

## 平台

目前，此实用程序适用于Windows，macOS和Linux。它会搜索 `Default` 以及所有 `Profile` 目录。
