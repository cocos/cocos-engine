(function (root) {
  var exports = undefined,
      module = undefined,
      require = undefined;
  var define = undefined;
  (function () {
    window.JS_LIST_TIPS = '插件脚本加载成功';
  }).call(root);
})( // The environment-specific global.
function () {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  if (typeof this !== 'undefined') return this;
  return {};
}.call(this));