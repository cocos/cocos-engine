System.register("chunks:///_virtual/back-to-asset-bundle-zip.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, director, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      director = module.director;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "f41baua30VOAZvJNcu9E9KG", "back-to-asset-bundle-zip", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let BackToAssetBundleZip = exports('BackToAssetBundleZip', (_dec = ccclass('BackToAssetBundleZip'), _dec(_class = class BackToAssetBundleZip extends Component {
        onClick() {
          director.loadScene('asset-bundle-zip');
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TestBundleZip", ['./back-to-asset-bundle-zip.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/TestBundleZip', 'chunks:///_virtual/TestBundleZip'); 
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