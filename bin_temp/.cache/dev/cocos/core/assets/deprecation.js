(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../utils/index.js", "./mesh.js", "./texture-base.js", "./render-texture.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../utils/index.js"), require("./mesh.js"), require("./texture-base.js"), require("./render-texture.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.index, global.mesh, global.textureBase, global.renderTexture);
    global.deprecation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_index, _mesh, _textureBase, _renderTexture) {
  "use strict";

  /**
   * @hidden
   */
  (0, _index.replaceProperty)(_mesh.Mesh.prototype, 'Mesh.prototype', [{
    name: 'renderingMesh',
    newName: 'renderingSubMeshes'
  }]);
  (0, _index.removeProperty)(_mesh.Mesh.prototype, 'Mesh.prototype', [{
    name: 'hasFlatBuffers'
  }, {
    name: 'destroyFlatBuffers'
  }]);
  (0, _index.removeProperty)(_textureBase.TextureBase.prototype, 'TextureBase.prototype', [{
    name: 'hasPremultipliedAlpha'
  }, {
    name: 'setPremultiplyAlpha'
  }, {
    name: 'setFlipY'
  }]);
  (0, _index.replaceProperty)(_renderTexture.RenderTexture.prototype, 'RenderTexture.prototype', [{
    name: 'getGFXWindow',
    customFunction: function customFunction() {
      // @ts-ignore
      return this._window;
    }
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2RlcHJlY2F0aW9uLnRzIl0sIm5hbWVzIjpbIk1lc2giLCJwcm90b3R5cGUiLCJuYW1lIiwibmV3TmFtZSIsIlRleHR1cmVCYXNlIiwiUmVuZGVyVGV4dHVyZSIsImN1c3RvbUZ1bmN0aW9uIiwiX3dpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQVNBLDhCQUFnQkEsV0FBS0MsU0FBckIsRUFBZ0MsZ0JBQWhDLEVBQWtELENBQzlDO0FBQ0lDLElBQUFBLElBQUksRUFBRSxlQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRTtBQUZiLEdBRDhDLENBQWxEO0FBT0EsNkJBQWVILFdBQUtDLFNBQXBCLEVBQStCLGdCQUEvQixFQUFpRCxDQUM3QztBQUNJQyxJQUFBQSxJQUFJLEVBQUU7QUFEVixHQUQ2QyxFQUk3QztBQUNJQSxJQUFBQSxJQUFJLEVBQUU7QUFEVixHQUo2QyxDQUFqRDtBQVNBLDZCQUFlRSx5QkFBWUgsU0FBM0IsRUFBc0MsdUJBQXRDLEVBQStELENBQzNEO0FBQ0lDLElBQUFBLElBQUksRUFBRTtBQURWLEdBRDJELEVBSTNEO0FBQ0lBLElBQUFBLElBQUksRUFBRTtBQURWLEdBSjJELEVBTzNEO0FBQ0lBLElBQUFBLElBQUksRUFBRTtBQURWLEdBUDJELENBQS9EO0FBWUEsOEJBQWdCRyw2QkFBY0osU0FBOUIsRUFBeUMseUJBQXpDLEVBQW9FLENBQ2hFO0FBQ0lDLElBQUFBLElBQUksRUFBRSxjQURWO0FBRUlJLElBQUFBLGNBRkosNEJBRXNCO0FBQ2Q7QUFDQSxhQUFPLEtBQUtDLE9BQVo7QUFDSDtBQUxMLEdBRGdFLENBQXBFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyByZW1vdmVQcm9wZXJ0eSwgcmVwbGFjZVByb3BlcnR5IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBNZXNoIH0gZnJvbSAnLi9tZXNoJztcclxuaW1wb3J0IHsgVGV4dHVyZUJhc2UgfSBmcm9tICcuL3RleHR1cmUtYmFzZSc7XHJcbmltcG9ydCB7IFJlbmRlclRleHR1cmUgfSBmcm9tICcuL3JlbmRlci10ZXh0dXJlJztcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShNZXNoLnByb3RvdHlwZSwgJ01lc2gucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdyZW5kZXJpbmdNZXNoJyxcclxuICAgICAgICBuZXdOYW1lOiAncmVuZGVyaW5nU3ViTWVzaGVzJyxcclxuICAgIH0sXHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoTWVzaC5wcm90b3R5cGUsICdNZXNoLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnaGFzRmxhdEJ1ZmZlcnMnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnZGVzdHJveUZsYXRCdWZmZXJzJyxcclxuICAgIH0sXHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoVGV4dHVyZUJhc2UucHJvdG90eXBlLCAnVGV4dHVyZUJhc2UucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdoYXNQcmVtdWx0aXBsaWVkQWxwaGEnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnc2V0UHJlbXVsdGlwbHlBbHBoYScsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdzZXRGbGlwWScsXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShSZW5kZXJUZXh0dXJlLnByb3RvdHlwZSwgJ1JlbmRlclRleHR1cmUucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdnZXRHRlhXaW5kb3cnLFxyXG4gICAgICAgIGN1c3RvbUZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93O1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5dKTtcclxuIl19