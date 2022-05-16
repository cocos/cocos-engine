System.register([], function(_export, _context) { return { execute: function () {
System.register("chunks:///_virtual/env", [], function (exports) {
  'use strict';

  return {
    execute: function () {
      const HTML5 = exports('HTML5', false);
      const WECHAT = exports('WECHAT', false);
      const ALIPAY = exports('ALIPAY', false);
      const BAIDU = exports('BAIDU', false);
      const XIAOMI = exports('XIAOMI', false);
      const BYTEDANCE = exports('BYTEDANCE', false);
      const OPPO = exports('OPPO', false);
      const VIVO = exports('VIVO', false);
      const HUAWEI = exports('HUAWEI', false);
      const NATIVE = exports('NATIVE', true);
      const COCOSPLAY = exports('COCOSPLAY', false);
      const LINKSURE = exports('LINKSURE', false);
      const QTT = exports('QTT', false);
      const OPEN_HARMONY = exports('OPEN_HARMONY', false);
      const EDITOR = exports('EDITOR', false);
      const PREVIEW = exports('PREVIEW', false);
      const BUILD = exports('BUILD', true);
      const TEST = exports('TEST', false);
      const DEBUG = exports('DEBUG', true);
      const SERVER_MODE = exports('SERVER_MODE', false);
      const NET_MODE = exports('NET_MODE', 0);
      const UI_GPU_DRIVEN = exports('UI_GPU_DRIVEN', false);
      const DEV = exports('DEV', false);
      const RUNTIME_BASED = exports('RUNTIME_BASED', false);
      const MINIGAME = exports('MINIGAME', false);
      const JSB = exports('JSB', true);
      const SUPPORT_JIT = exports('SUPPORT_JIT', true);
    }
  };
});

System.register("chunks:///_virtual/rollupPluginModLoBabelHelpers.js", [], function (exports) {
  'use strict';

  return {
    execute: function () {
      exports({
        applyDecoratedDescriptor: _applyDecoratedDescriptor,
        initializerDefineProperty: _initializerDefineProperty
      });

      function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          writable: descriptor.writable,
          value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
      }

      function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function (key) {
          desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
          desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
          return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
          desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
          desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
          Object.defineProperty(target, property, desc);
          desc = null;
        }

        return desc;
      }
    }
  };
});

} }; });