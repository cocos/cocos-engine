System.register("chunks:///_virtual/back-to-asset-bundle.ts", ['cc'], function (exports) {
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

      cclegacy._RF.push({}, "08a78TLL5ZAp5sJNvOPvzaG", "back-to-asset-bundle", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let BackToAssetBundle = exports('BackToAssetBundle', (_dec = ccclass('BackToAssetBundle'), _dec(_class = class BackToAssetBundle extends Component {
        start() {// Your initialization goes here.
        }

        onClick() {
          director.loadScene('asset-bundle');
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TestBundle", ['./back-to-asset-bundle.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/TestBundle', 'chunks:///_virtual/TestBundle'); 
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