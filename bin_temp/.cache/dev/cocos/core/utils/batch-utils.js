(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../3d/framework/mesh-renderer.js", "../assets/mesh.js", "../math/mat4.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../3d/framework/mesh-renderer.js"), require("../assets/mesh.js"), require("../math/mat4.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.meshRenderer, global.mesh, global.mat4);
    global.batchUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _meshRenderer, _mesh, _mat) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BatchingUtility = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function checkMaterialisSame(comp1, comp2) {
    var matNum = comp1.sharedMaterials.length;

    if (matNum !== comp2.sharedMaterials.length) {
      return false;
    }

    for (var i = 0; i < matNum; i++) {
      if (comp1.getRenderMaterial(i) !== comp2.getRenderMaterial(i)) {
        return false;
      }
    }

    return true;
  }

  var BatchingUtility = /*#__PURE__*/function () {
    function BatchingUtility() {
      _classCallCheck(this, BatchingUtility);
    }

    _createClass(BatchingUtility, null, [{
      key: "batchStaticModel",

      /**
       * Collect the Models under `staticModelRoot`,
       * merge all the meshes statically into one (while disabling each component),
       * and attach it to a new Model on `batchedRoot`.
       * The world transform of each model is guaranteed to be preserved.
       *
       * For a more fine-grained control over the process, use `Mesh.merge` directly.
       * @param staticModelRoot root of all the static models to be batched
       * @param batchedRoot the target output node
       */
      value: function batchStaticModel(staticModelRoot, batchedRoot) {
        var models = staticModelRoot.getComponentsInChildren(_meshRenderer.MeshRenderer);

        if (models.length < 2) {
          console.error('the number of static models to batch is less than 2,it needn\'t batch.');
          return false;
        }

        for (var i = 1; i < models.length; i++) {
          if (!models[0].mesh.validateMergingMesh(models[i].mesh)) {
            console.error('the meshes of ' + models[0].node.name + ' and ' + models[i].node.name + ' can\'t be merged');
            return false;
          }

          if (!checkMaterialisSame(models[0], models[i])) {
            console.error('the materials of ' + models[0].node.name + ' and ' + models[i].node.name + ' can\'t be merged');
            return false;
          }
        }

        var batchedMesh = new _mesh.Mesh();
        var worldMat = new _mat.Mat4();
        var rootWorldMatInv = new _mat.Mat4();
        staticModelRoot.getWorldMatrix(rootWorldMatInv);

        _mat.Mat4.invert(rootWorldMatInv, rootWorldMatInv);

        for (var _i = 0; _i < models.length; _i++) {
          var comp = models[_i];
          comp.node.getWorldMatrix(worldMat);

          _mat.Mat4.multiply(worldMat, rootWorldMatInv, worldMat);

          batchedMesh.merge(models[_i].mesh, worldMat);
          comp.enabled = false;
        }

        var batchedModel = batchedRoot.addComponent(_meshRenderer.MeshRenderer);
        batchedModel.mesh = batchedMesh;
        batchedModel.sharedMaterials = models[0].sharedMaterials;
        return true;
      }
      /**
       * Undoes everything `batchStaticModel` did.
       *
       * @param staticModelRoot root of all the static models to be batched
       * @param batchedRoot the target output node
       */

    }, {
      key: "unbatchStaticModel",
      value: function unbatchStaticModel(staticModelRoot, batchedRoot) {
        var models = staticModelRoot.getComponentsInChildren('cc.MeshRenderer');

        for (var i = 0; i < models.length; i++) {
          var comp = models[i];
          comp.enabled = true;
        }

        var batchedModel = batchedRoot.getComponent('cc.MeshRenderer');

        if (batchedModel) {
          batchedModel.destroy();
        }

        return true;
      }
    }]);

    return BatchingUtility;
  }();

  _exports.BatchingUtility = BatchingUtility;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvYmF0Y2gtdXRpbHMudHMiXSwibmFtZXMiOlsiY2hlY2tNYXRlcmlhbGlzU2FtZSIsImNvbXAxIiwiY29tcDIiLCJtYXROdW0iLCJzaGFyZWRNYXRlcmlhbHMiLCJsZW5ndGgiLCJpIiwiZ2V0UmVuZGVyTWF0ZXJpYWwiLCJCYXRjaGluZ1V0aWxpdHkiLCJzdGF0aWNNb2RlbFJvb3QiLCJiYXRjaGVkUm9vdCIsIm1vZGVscyIsImdldENvbXBvbmVudHNJbkNoaWxkcmVuIiwiTWVzaFJlbmRlcmVyIiwiY29uc29sZSIsImVycm9yIiwibWVzaCIsInZhbGlkYXRlTWVyZ2luZ01lc2giLCJub2RlIiwibmFtZSIsImJhdGNoZWRNZXNoIiwiTWVzaCIsIndvcmxkTWF0IiwiTWF0NCIsInJvb3RXb3JsZE1hdEludiIsImdldFdvcmxkTWF0cml4IiwiaW52ZXJ0IiwiY29tcCIsIm11bHRpcGx5IiwibWVyZ2UiLCJlbmFibGVkIiwiYmF0Y2hlZE1vZGVsIiwiYWRkQ29tcG9uZW50IiwiZ2V0Q29tcG9uZW50IiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxXQUFTQSxtQkFBVCxDQUE4QkMsS0FBOUIsRUFBbURDLEtBQW5ELEVBQWlGO0FBQzdFLFFBQU1DLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxlQUFOLENBQXNCQyxNQUFyQzs7QUFDQSxRQUFJRixNQUFNLEtBQUtELEtBQUssQ0FBQ0UsZUFBTixDQUFzQkMsTUFBckMsRUFBNkM7QUFDekMsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSCxNQUFwQixFQUE0QkcsQ0FBQyxFQUE3QixFQUFpQztBQUM3QixVQUFJTCxLQUFLLENBQUNNLGlCQUFOLENBQXdCRCxDQUF4QixNQUErQkosS0FBSyxDQUFDSyxpQkFBTixDQUF3QkQs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d0MsaUJBQXhDLENBQWY7O0FBQ0EsYUFBSyxJQUFJTixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSyxNQUFNLENBQUNOLE1BQTNCLEVBQW1DQyxDQUFDLEVBQXBDLEVBQXdDO0FBQ3BDLGNBQU1xQixJQUFJLEdBQUdoQixNQUFNLENBQUNMLENBQUQsQ0FBbkI7QUFDQXFCLFVBQUFBLElBQUksQ0FBQ0csT0FBTCxHQUFlLElBQWY7QUFDSDs7QUFDRCxZQUFNQyxZQUFZLEdBQUdyQixXQUFXLENBQUN1QixZQUFaLENBQXlCLGlCQUF6QixDQUFyQjs7QUFDQSxZQUFJRixZQUFKLEVBQWtCO0FBQUVBLFVBQUFBLFlBQVksQ0FBQ0csT0FBYjtBQUF5Qjs7QUFDN0MsZUFBTyxJQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tICcuLi8zZC9mcmFtZXdvcmsvbWVzaC1yZW5kZXJlcic7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi9hc3NldHMvbWVzaCc7XHJcbmltcG9ydCB7IE1hdDQgfSBmcm9tICcuLi9tYXRoL21hdDQnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vc2NlbmUtZ3JhcGgvbm9kZSc7XHJcblxyXG5mdW5jdGlvbiBjaGVja01hdGVyaWFsaXNTYW1lIChjb21wMTogTWVzaFJlbmRlcmVyLCBjb21wMjogTWVzaFJlbmRlcmVyKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBtYXROdW0gPSBjb21wMS5zaGFyZWRNYXRlcmlhbHMubGVuZ3RoO1xyXG4gICAgaWYgKG1hdE51bSAhPT0gY29tcDIuc2hhcmVkTWF0ZXJpYWxzLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0TnVtOyBpKyspIHtcclxuICAgICAgICBpZiAoY29tcDEuZ2V0UmVuZGVyTWF0ZXJpYWwoaSkgIT09IGNvbXAyLmdldFJlbmRlck1hdGVyaWFsKGkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhdGNoaW5nVXRpbGl0eSB7XHJcbiAgICAvKipcclxuICAgICAqIENvbGxlY3QgdGhlIE1vZGVscyB1bmRlciBgc3RhdGljTW9kZWxSb290YCxcclxuICAgICAqIG1lcmdlIGFsbCB0aGUgbWVzaGVzIHN0YXRpY2FsbHkgaW50byBvbmUgKHdoaWxlIGRpc2FibGluZyBlYWNoIGNvbXBvbmVudCksXHJcbiAgICAgKiBhbmQgYXR0YWNoIGl0IHRvIGEgbmV3IE1vZGVsIG9uIGBiYXRjaGVkUm9vdGAuXHJcbiAgICAgKiBUaGUgd29ybGQgdHJhbnNmb3JtIG9mIGVhY2ggbW9kZWwgaXMgZ3VhcmFudGVlZCB0byBiZSBwcmVzZXJ2ZWQuXHJcbiAgICAgKlxyXG4gICAgICogRm9yIGEgbW9yZSBmaW5lLWdyYWluZWQgY29udHJvbCBvdmVyIHRoZSBwcm9jZXNzLCB1c2UgYE1lc2gubWVyZ2VgIGRpcmVjdGx5LlxyXG4gICAgICogQHBhcmFtIHN0YXRpY01vZGVsUm9vdCByb290IG9mIGFsbCB0aGUgc3RhdGljIG1vZGVscyB0byBiZSBiYXRjaGVkXHJcbiAgICAgKiBAcGFyYW0gYmF0Y2hlZFJvb3QgdGhlIHRhcmdldCBvdXRwdXQgbm9kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGJhdGNoU3RhdGljTW9kZWwgKHN0YXRpY01vZGVsUm9vdDogTm9kZSwgYmF0Y2hlZFJvb3Q6IE5vZGUpIHtcclxuICAgICAgICBjb25zdCBtb2RlbHMgPSBzdGF0aWNNb2RlbFJvb3QuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oTWVzaFJlbmRlcmVyKTtcclxuICAgICAgICBpZiAobW9kZWxzLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndGhlIG51bWJlciBvZiBzdGF0aWMgbW9kZWxzIHRvIGJhdGNoIGlzIGxlc3MgdGhhbiAyLGl0IG5lZWRuXFwndCBiYXRjaC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIW1vZGVsc1swXS5tZXNoIS52YWxpZGF0ZU1lcmdpbmdNZXNoKG1vZGVsc1tpXS5tZXNoISkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RoZSBtZXNoZXMgb2YgJyArIG1vZGVsc1swXS5ub2RlLm5hbWUgKyAnIGFuZCAnICsgbW9kZWxzW2ldLm5vZGUubmFtZSArICcgY2FuXFwndCBiZSBtZXJnZWQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWNoZWNrTWF0ZXJpYWxpc1NhbWUobW9kZWxzWzBdLCBtb2RlbHNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0aGUgbWF0ZXJpYWxzIG9mICcgKyBtb2RlbHNbMF0ubm9kZS5uYW1lICsgJyBhbmQgJyArIG1vZGVsc1tpXS5ub2RlLm5hbWUgKyAnIGNhblxcJ3QgYmUgbWVyZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYmF0Y2hlZE1lc2ggPSBuZXcgTWVzaCgpO1xyXG4gICAgICAgIGNvbnN0IHdvcmxkTWF0ID0gbmV3IE1hdDQoKTtcclxuICAgICAgICBjb25zdCByb290V29ybGRNYXRJbnYgPSBuZXcgTWF0NCgpO1xyXG4gICAgICAgIHN0YXRpY01vZGVsUm9vdC5nZXRXb3JsZE1hdHJpeChyb290V29ybGRNYXRJbnYpO1xyXG4gICAgICAgIE1hdDQuaW52ZXJ0KHJvb3RXb3JsZE1hdEludiwgcm9vdFdvcmxkTWF0SW52KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wID0gbW9kZWxzW2ldO1xyXG4gICAgICAgICAgICBjb21wLm5vZGUuZ2V0V29ybGRNYXRyaXgod29ybGRNYXQpO1xyXG4gICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KHdvcmxkTWF0LCByb290V29ybGRNYXRJbnYsIHdvcmxkTWF0KTtcclxuICAgICAgICAgICAgYmF0Y2hlZE1lc2gubWVyZ2UobW9kZWxzW2ldLm1lc2ghLCB3b3JsZE1hdCk7XHJcbiAgICAgICAgICAgIGNvbXAuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBiYXRjaGVkTW9kZWwgPSBiYXRjaGVkUm9vdC5hZGRDb21wb25lbnQoTWVzaFJlbmRlcmVyKTtcclxuICAgICAgICBiYXRjaGVkTW9kZWwubWVzaCA9IGJhdGNoZWRNZXNoO1xyXG4gICAgICAgIGJhdGNoZWRNb2RlbC5zaGFyZWRNYXRlcmlhbHMgPSBtb2RlbHNbMF0uc2hhcmVkTWF0ZXJpYWxzO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5kb2VzIGV2ZXJ5dGhpbmcgYGJhdGNoU3RhdGljTW9kZWxgIGRpZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljTW9kZWxSb290IHJvb3Qgb2YgYWxsIHRoZSBzdGF0aWMgbW9kZWxzIHRvIGJlIGJhdGNoZWRcclxuICAgICAqIEBwYXJhbSBiYXRjaGVkUm9vdCB0aGUgdGFyZ2V0IG91dHB1dCBub2RlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdW5iYXRjaFN0YXRpY01vZGVsIChzdGF0aWNNb2RlbFJvb3Q6IE5vZGUsIGJhdGNoZWRSb290OiBOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWxzID0gc3RhdGljTW9kZWxSb290LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKCdjYy5NZXNoUmVuZGVyZXInKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wID0gbW9kZWxzW2ldO1xyXG4gICAgICAgICAgICBjb21wLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBiYXRjaGVkTW9kZWwgPSBiYXRjaGVkUm9vdC5nZXRDb21wb25lbnQoJ2NjLk1lc2hSZW5kZXJlcicpO1xyXG4gICAgICAgIGlmIChiYXRjaGVkTW9kZWwpIHsgYmF0Y2hlZE1vZGVsLmRlc3Ryb3koKTsgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==