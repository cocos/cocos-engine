System.register("chunks:///_virtual/sub-pack-01", ['./subScript01.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/subScript01.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;

      cclegacy._RF.push({}, "b7bc1kcej9IAKuEsO63LZ0U", "subScript01", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let subScript01 = exports('subScript01', (_dec = ccclass("subScript01"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = class subScript01 extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tips", _descriptor, this);

          this.backRoot = null;
        }

        start() {
          // Your initialization goes here.
          this.backRoot = this.node.getParent().getChildByName('backRoot');

          if (this.backRoot) {
            this.backRoot.active = false;
          }

          console.log('subScript01 load finish');
          this.tips.string = "subScript01 load finish!";
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        backToList() {
          if (this.backRoot) {
            this.backRoot.active = true;
          }

          director.loadScene('sub-packages');
        }

      }, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "tips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/sub-pack-01', 'chunks:///_virtual/sub-pack-01'); 
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