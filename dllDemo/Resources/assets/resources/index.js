System.register("chunks:///_virtual/back-to-asset-loading.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;

      cclegacy._RF.push({}, "f0a37xDA3xHMoLKQ53Qiv0O", "back-to-asset-loading", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let BackToAssetLoading = exports('BackToAssetLoading', (_dec = ccclass('BackToAssetLoading'), _dec(_class = (_class2 = class BackToAssetLoading extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sceneToBack", _descriptor, this);
        }

        start() {// Your initialization goes here.
        }

        onClick() {
          director.loadScene(this.sceneToBack);
        }

      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sceneToBack", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resources", ['./back-to-asset-loading.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/resources', 'chunks:///_virtual/resources'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});