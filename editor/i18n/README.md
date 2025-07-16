### 在编辑器里已经做了 ENGINE 的 i18n/en 和 /zh 里文件的数据自动合并

### 所以里面的数据不需要再互相 require

### 新模块 xxx 的 i18n 直接新增一个文件，
### 内容写 module.exports = { xxx: {} }