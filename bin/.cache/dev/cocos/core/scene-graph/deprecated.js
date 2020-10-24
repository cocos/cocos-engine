(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./base-node.js", "../utils/deprecated.js", "./layers.js", "./node.js", "../math/vec2.js", "../math/size.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./base-node.js"), require("../utils/deprecated.js"), require("./layers.js"), require("./node.js"), require("../math/vec2.js"), require("../math/size.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.baseNode, global.deprecated, global.layers, global.node, global.vec2, global.size);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_baseNode, _deprecated, _layers, _node, _vec, _size) {
  "use strict";

  /**
   * @hidden
   */
  (0, _deprecated.replaceProperty)(_baseNode.BaseNode.prototype, 'BaseNode', [{
    'name': 'childrenCount',
    'newName': 'children.length',
    'customGetter': function customGetter() {
      return this.children.length;
    }
  }]);
  (0, _deprecated.replaceProperty)(_node.Node.prototype, 'Node', [{
    'name': 'width',
    'targetName': 'node.getComponent(UITransform)',
    'customGetter': function customGetter() {
      return this._uiProps.uiTransformComp.width;
    },
    'customSetter': function customSetter(value) {
      this._uiProps.uiTransformComp.width = value;
    }
  }, {
    'name': 'height',
    'targetName': 'node.getComponent(UITransform)',
    'customGetter': function customGetter() {
      return this._uiProps.uiTransformComp.height;
    },
    'customSetter': function customSetter(value) {
      this._uiProps.uiTransformComp.height = value;
    }
  }, {
    'name': 'anchorX',
    'targetName': 'node.getComponent(UITransform)',
    'customGetter': function customGetter() {
      return this._uiProps.uiTransformComp.anchorX;
    },
    'customSetter': function customSetter(value) {
      this._uiProps.uiTransformComp.anchorX = value;
    }
  }, {
    'name': 'anchorY',
    'targetName': 'node.getComponent(UITransform)',
    'customGetter': function customGetter() {
      return this._uiProps.uiTransformComp.anchorY;
    },
    'customSetter': function customSetter(value) {
      this._uiProps.uiTransformComp.anchorY = value;
    }
  }, {
    'name': 'getAnchorPoint',
    'targetName': 'node.getComponent(UITransform)',
    'customFunction': function customFunction(out) {
      if (!out) {
        out = new _vec.Vec2();
      }

      out.set(this._uiProps.uiTransformComp.anchorPoint);
      return out;
    }
  }, {
    'name': 'setAnchorPoint',
    'targetName': 'node.getComponent(UITransform)',
    'customFunction': function customFunction(point, y) {
      this._uiProps.uiTransformComp.setAnchorPoint(point, y);
    }
  }, {
    'name': 'getContentSize',
    'targetName': 'node.getComponent(UITransform)',
    'customFunction': function customFunction(out) {
      if (!out) {
        out = new _size.Size();
      }

      out.set(this._uiProps.uiTransformComp.contentSize);
      return out;
    }
  }, {
    'name': 'setContentSize',
    'targetName': 'node.getComponent(UITransform)',
    'customFunction': function customFunction(size, height) {
      this._uiProps.uiTransformComp.setContentSize(size, height);
    }
  }]);
  (0, _deprecated.removeProperty)(_node.Node.prototype, 'Node.prototype', [{
    'name': 'addLayer'
  }, {
    'name': 'removeLayer'
  }]);
  (0, _deprecated.removeProperty)(_layers.Layers, 'Layers', [{
    'name': 'All'
  }, {
    'name': 'RaycastMask'
  }, {
    'name': 'check'
  }]);
  (0, _deprecated.replaceProperty)(_layers.Layers, 'Layers', [{
    name: 'Default',
    newName: 'DEFAULT',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'Always',
    newName: 'ALWAYS',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'IgnoreRaycast',
    newName: 'IGNORE_RAYCAST',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'Gizmos',
    newName: 'GIZMOS',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'Editor',
    newName: 'EDITOR',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'UI',
    newName: 'UI_3D',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'UI2D',
    newName: 'UI_2D',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'SceneGizmo',
    newName: 'SCENE_GIZMO',
    target: _layers.Layers.Enum,
    targetName: 'Layers.Enum'
  }, {
    name: 'makeInclusiveMask',
    newName: 'makeMaskInclude',
    target: _layers.Layers,
    targetName: 'Layers'
  }, {
    name: 'makeExclusiveMask',
    newName: 'makeMaskExclude',
    target: _layers.Layers,
    targetName: 'Layers'
  }]);
  (0, _deprecated.removeProperty)(_layers.Layers.Enum, 'Layers.Enum', [{
    'name': 'ALWAYS'
  }]);
  (0, _deprecated.removeProperty)(_layers.Layers.BitMask, 'Layers.BitMask', [{
    'name': 'ALWAYS'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvZGVwcmVjYXRlZC50cyJdLCJuYW1lcyI6WyJCYXNlTm9kZSIsInByb3RvdHlwZSIsImNoaWxkcmVuIiwibGVuZ3RoIiwiTm9kZSIsIl91aVByb3BzIiwidWlUcmFuc2Zvcm1Db21wIiwid2lkdGgiLCJ2YWx1ZSIsImhlaWdodCIsImFuY2hvclgiLCJhbmNob3JZIiwib3V0IiwiVmVjMiIsInNldCIsImFuY2hvclBvaW50IiwicG9pbnQiLCJ5Iiwic2V0QW5jaG9yUG9pbnQiLCJTaXplIiwiY29udGVudFNpemUiLCJzaXplIiwic2V0Q29udGVudFNpemUiLCJMYXllcnMiLCJuYW1lIiwibmV3TmFtZSIsInRhcmdldCIsIkVudW0iLCJ0YXJnZXROYW1lIiwiQml0TWFzayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQVlBLG1DQUFnQkEsbUJBQVNDLFNBQXpCLEVBQW9DLFVBQXBDLEVBQWdELENBQzVDO0FBQ0ksWUFBUSxlQURaO0FBRUksZUFBVyxpQkFGZjtBQUdJLG9CQUFnQix3QkFBMEI7QUFDdEMsYUFBTyxLQUFLQyxRQUFMLENBQWNDLE1BQXJCO0FBQ0g7QUFMTCxHQUQ0QyxDQUFoRDtBQVVBLG1DQUFnQkMsV0FBS0gsU0FBckIsRUFBZ0MsTUFBaEMsRUFBd0MsQ0FDcEM7QUFDSSxZQUFRLE9BRFo7QUFFSSxrQkFBYyxnQ0FGbEI7QUFHSSxvQkFBZ0Isd0JBQXNCO0FBQ2xDLGFBQU8sS0FBS0ksUUFBTCxDQUFjQyxlQUFkLENBQStCQyxLQUF0QztBQUNILEtBTEw7QUFNSSxvQkFBZ0Isc0JBQXNCQyxLQUF0QixFQUFxQztBQUNqRCxXQUFLSCxRQUFMLENBQWNDLGVBQWQsQ0FBK0JDLEtBQS9CLEdBQXVDQyxLQUF2QztBQUNIO0FBUkwsR0FEb0MsRUFXcEM7QUFDSSxZQUFRLFFBRFo7QUFFSSxrQkFBYyxnQ0FGbEI7QUFHSSxvQkFBZ0Isd0JBQXNCO0FBQ2xDLGFBQU8sS0FBS0gsUUFBTCxDQUFjQyxlQUFkLENBQStCRyxNQUF0QztBQUNILEtBTEw7QUFNSSxvQkFBZ0Isc0JBQXNCRCxLQUF0QixFQUFxQztBQUNqRCxXQUFLSCxRQUFMLENBQWNDLGVBQWQsQ0FBK0JHLE1BQS9CLEdBQXdDRCxLQUF4QztBQUNIO0FBUkwsR0FYb0MsRUFxQnBDO0FBQ0ksWUFBUSxTQURaO0FBRUksa0JBQWMsZ0NBRmxCO0FBR0ksb0JBQWdCLHdCQUFzQjtBQUNsQyxhQUFPLEtBQUtILFFBQUwsQ0FBY0MsZUFBZCxDQUErQkksT0FBdEM7QUFDSCxLQUxMO0FBTUksb0JBQWdCLHNCQUFzQkYsS0FBdEIsRUFBcUM7QUFDakQsV0FBS0gsUUFBTCxDQUFjQyxlQUFkLENBQStCSSxPQUEvQixHQUF5Q0YsS0FBekM7QUFDSDtBQVJMLEdBckJvQyxFQStCcEM7QUFDSSxZQUFRLFNBRFo7QUFFSSxrQkFBYyxnQ0FGbEI7QUFHSSxvQkFBZ0Isd0JBQXNCO0FBQ2xDLGFBQU8sS0FBS0gsUUFBTCxDQUFjQyxlQUFkLENBQStCSyxPQUF0QztBQUNILEtBTEw7QUFNSSxvQkFBZ0Isc0JBQXNCSCxLQUF0QixFQUFxQztBQUNqRCxXQUFLSCxRQUFMLENBQWNDLGVBQWQsQ0FBK0JLLE9BQS9CLEdBQXlDSCxLQUF6QztBQUNIO0FBUkwsR0EvQm9DLEVBeUNwQztBQUNJLFlBQVEsZ0JBRFo7QUFFSSxrQkFBYyxnQ0FGbEI7QUFHSSxzQkFBa0Isd0JBQXNCSSxHQUF0QixFQUFrQztBQUNoRCxVQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNOQSxRQUFBQSxHQUFHLEdBQUcsSUFBSUMsU0FBSixFQUFOO0FBQ0g7O0FBQ0RELE1BQUFBLEdBQUcsQ0FBQ0UsR0FBSixDQUFRLEtBQUtULFFBQUwsQ0FBY0MsZUFBZCxDQUErQlMsV0FBdkM7QUFDQSxhQUFPSCxHQUFQO0FBQ0g7QUFUTCxHQXpDb0MsRUFvRHBDO0FBQ0ksWUFBUSxnQkFEWjtBQUVJLGtCQUFjLGdDQUZsQjtBQUdJLHNCQUFrQix3QkFBc0JJLEtBQXRCLEVBQTRDQyxDQUE1QyxFQUF3RDtBQUN0RSxXQUFLWixRQUFMLENBQWNDLGVBQWQsQ0FBK0JZLGNBQS9CLENBQThDRixLQUE5QyxFQUFxREMsQ0FBckQ7QUFDSDtBQUxMLEdBcERvQyxFQTJEcEM7QUFDSSxZQUFRLGdCQURaO0FBRUksa0JBQWMsZ0NBRmxCO0FBR0ksc0JBQWtCLHdCQUFzQkwsR0FBdEIsRUFBd0M7QUFDdEQsVUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDTkEsUUFBQUEsR0FBRyxHQUFHLElBQUlPLFVBQUosRUFBTjtBQUNIOztBQUVEUCxNQUFBQSxHQUFHLENBQUNFLEdBQUosQ0FBUSxLQUFLVCxRQUFMLENBQWNDLGVBQWQsQ0FBK0JjLFdBQXZDO0FBQ0EsYUFBT1IsR0FBUDtBQUNIO0FBVkwsR0EzRG9DLEVBdUVwQztBQUNJLFlBQVEsZ0JBRFo7QUFFSSxrQkFBYyxnQ0FGbEI7QUFHSSxzQkFBa0Isd0JBQXNCUyxJQUF0QixFQUEyQ1osTUFBM0MsRUFBNEQ7QUFDMUUsV0FBS0osUUFBTCxDQUFjQyxlQUFkLENBQStCZ0IsY0FBL0IsQ0FBOENELElBQTlDLEVBQW9EWixNQUFwRDtBQUNIO0FBTEwsR0F2RW9DLENBQXhDO0FBZ0ZBLGtDQUFlTCxXQUFLSCxTQUFwQixFQUErQixnQkFBL0IsRUFBaUQsQ0FDN0M7QUFDSSxZQUFRO0FBRFosR0FENkMsRUFJN0M7QUFDSSxZQUFRO0FBRFosR0FKNkMsQ0FBakQ7QUFTQSxrQ0FBZXNCLGNBQWYsRUFBdUIsUUFBdkIsRUFBaUMsQ0FDN0I7QUFDSSxZQUFRO0FBRFosR0FENkIsRUFJN0I7QUFDSSxZQUFRO0FBRFosR0FKNkIsRUFPN0I7QUFDSSxZQUFRO0FBRFosR0FQNkIsQ0FBakM7QUFZQSxtQ0FBZ0JBLGNBQWhCLEVBQXdCLFFBQXhCLEVBQWtDLENBQzlCO0FBQ0lDLElBQUFBLElBQUksRUFBRSxTQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxTQUZiO0FBR0lDLElBQUFBLE1BQU0sRUFBRUgsZUFBT0ksSUFIbkI7QUFJSUMsSUFBQUEsVUFBVSxFQUFFO0FBSmhCLEdBRDhCLEVBTzlCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxRQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxRQUZiO0FBR0lDLElBQUFBLE1BQU0sRUFBRUgsZUFBT0ksSUFIbkI7QUFJSUMsSUFBQUEsVUFBVSxFQUFFO0FBSmhCLEdBUDhCLEVBYTlCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxlQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxnQkFGYjtBQUdJQyxJQUFBQSxNQUFNLEVBQUVILGVBQU9JLElBSG5CO0FBSUlDLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQWI4QixFQW1COUI7QUFDSUosSUFBQUEsSUFBSSxFQUFFLFFBRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFLFFBRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFSCxlQUFPSSxJQUhuQjtBQUlJQyxJQUFBQSxVQUFVLEVBQUU7QUFKaEIsR0FuQjhCLEVBeUI5QjtBQUNJSixJQUFBQSxJQUFJLEVBQUUsUUFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUUsUUFGYjtBQUdJQyxJQUFBQSxNQUFNLEVBQUVILGVBQU9JLElBSG5CO0FBSUlDLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQXpCOEIsRUErQjlCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxJQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxPQUZiO0FBR0lDLElBQUFBLE1BQU0sRUFBRUgsZUFBT0ksSUFIbkI7QUFJSUMsSUFBQUEsVUFBVSxFQUFFO0FBSmhCLEdBL0I4QixFQXFDOUI7QUFDSUosSUFBQUEsSUFBSSxFQUFFLE1BRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFLE9BRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFSCxlQUFPSSxJQUhuQjtBQUlJQyxJQUFBQSxVQUFVLEVBQUU7QUFKaEIsR0FyQzhCLEVBMkM5QjtBQUNJSixJQUFBQSxJQUFJLEVBQUUsWUFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUUsYUFGYjtBQUdJQyxJQUFBQSxNQUFNLEVBQUVILGVBQU9JLElBSG5CO0FBSUlDLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQTNDOEIsRUFpRDlCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxtQkFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUUsaUJBRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFSCxjQUhaO0FBSUlLLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQWpEOEIsRUF1RDlCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxtQkFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUUsaUJBRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFSCxjQUhaO0FBSUlLLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQXZEOEIsQ0FBbEM7QUErREEsa0NBQWVMLGVBQU9JLElBQXRCLEVBQTJCLGFBQTNCLEVBQXlDLENBQ3JDO0FBQ0ksWUFBUTtBQURaLEdBRHFDLENBQXpDO0FBTUEsa0NBQWVKLGVBQU9NLE9BQXRCLEVBQThCLGdCQUE5QixFQUErQyxDQUMzQztBQUNJLFlBQVE7QUFEWixHQUQyQyxDQUEvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQmFzZU5vZGUgfSBmcm9tICcuL2Jhc2Utbm9kZSc7XHJcbmltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSwgcmVtb3ZlUHJvcGVydHkgfSBmcm9tICcuLi91dGlscy9kZXByZWNhdGVkJztcclxuaW1wb3J0IHsgTGF5ZXJzIH0gZnJvbSAnLi9sYXllcnMnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IHsgVmVjMiB9IGZyb20gJy4uL21hdGgvdmVjMic7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9tYXRoL3NpemUnO1xyXG5pbXBvcnQgeyBTY2VuZSB9IGZyb20gJy4vc2NlbmUnO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KEJhc2VOb2RlLnByb3RvdHlwZSwgJ0Jhc2VOb2RlJywgW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2NoaWxkcmVuQ291bnQnLFxyXG4gICAgICAgICduZXdOYW1lJzogJ2NoaWxkcmVuLmxlbmd0aCcsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBCYXNlTm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJ05vZGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnd2lkdGgnLFxyXG4gICAgICAgICd0YXJnZXROYW1lJzogJ25vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKScsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEud2lkdGg7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnY3VzdG9tU2V0dGVyJzogZnVuY3Rpb24gKHRoaXM6IE5vZGUsIHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLndpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdoZWlnaHQnLFxyXG4gICAgICAgICd0YXJnZXROYW1lJzogJ25vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKScsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuaGVpZ2h0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ2N1c3RvbVNldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlLCB2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5oZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2FuY2hvclgnLFxyXG4gICAgICAgICd0YXJnZXROYW1lJzogJ25vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKScsXHJcbiAgICAgICAgJ2N1c3RvbUdldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuYW5jaG9yWDtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdjdXN0b21TZXR0ZXInOiBmdW5jdGlvbiAodGhpczogTm9kZSwgdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuYW5jaG9yWCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnYW5jaG9yWScsXHJcbiAgICAgICAgJ3RhcmdldE5hbWUnOiAnbm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pJyxcclxuICAgICAgICAnY3VzdG9tR2V0dGVyJzogZnVuY3Rpb24gKHRoaXM6IE5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5hbmNob3JZO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ2N1c3RvbVNldHRlcic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlLCB2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5hbmNob3JZID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdnZXRBbmNob3JQb2ludCcsXHJcbiAgICAgICAgJ3RhcmdldE5hbWUnOiAnbm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pJyxcclxuICAgICAgICAnY3VzdG9tRnVuY3Rpb24nOiBmdW5jdGlvbiAodGhpczogTm9kZSwgb3V0PzogVmVjMikge1xyXG4gICAgICAgICAgICBpZiAoIW91dCkge1xyXG4gICAgICAgICAgICAgICAgb3V0ID0gbmV3IFZlYzIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQuc2V0KHRoaXMuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5hbmNob3JQb2ludCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdzZXRBbmNob3JQb2ludCcsXHJcbiAgICAgICAgJ3RhcmdldE5hbWUnOiAnbm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pJyxcclxuICAgICAgICAnY3VzdG9tRnVuY3Rpb24nOiBmdW5jdGlvbiAodGhpczogTm9kZSwgcG9pbnQ6IFZlYzIgfCBudW1iZXIsIHk/OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLnNldEFuY2hvclBvaW50KHBvaW50LCB5KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ2dldENvbnRlbnRTaXplJyxcclxuICAgICAgICAndGFyZ2V0TmFtZSc6ICdub2RlLmdldENvbXBvbmVudChVSVRyYW5zZm9ybSknLFxyXG4gICAgICAgICdjdXN0b21GdW5jdGlvbic6IGZ1bmN0aW9uICh0aGlzOiBOb2RlLCBvdXQ/OiBTaXplKTogU2l6ZSB7XHJcbiAgICAgICAgICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgPSBuZXcgU2l6ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgb3V0LnNldCh0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuY29udGVudFNpemUpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnc2V0Q29udGVudFNpemUnLFxyXG4gICAgICAgICd0YXJnZXROYW1lJzogJ25vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKScsXHJcbiAgICAgICAgJ2N1c3RvbUZ1bmN0aW9uJzogZnVuY3Rpb24gKHRoaXM6IE5vZGUsIHNpemU6IFNpemUgfCBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCEuc2V0Q29udGVudFNpemUoc2l6ZSwgaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbnJlbW92ZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAnTm9kZS5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnYWRkTGF5ZXInLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdyZW1vdmVMYXllcicsXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoTGF5ZXJzLCAnTGF5ZXJzJywgW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ0FsbCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ1JheWNhc3RNYXNrJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnY2hlY2snLFxyXG4gICAgfVxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShMYXllcnMsICdMYXllcnMnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0RlZmF1bHQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdERUZBVUxUJyxcclxuICAgICAgICB0YXJnZXQ6IExheWVycy5FbnVtLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdMYXllcnMuRW51bScsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdBbHdheXMnLFxyXG4gICAgICAgIG5ld05hbWU6ICdBTFdBWVMnLFxyXG4gICAgICAgIHRhcmdldDogTGF5ZXJzLkVudW0sXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0xheWVycy5FbnVtJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0lnbm9yZVJheWNhc3QnLFxyXG4gICAgICAgIG5ld05hbWU6ICdJR05PUkVfUkFZQ0FTVCcsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnTGF5ZXJzLkVudW0nLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnR2l6bW9zJyxcclxuICAgICAgICBuZXdOYW1lOiAnR0laTU9TJyxcclxuICAgICAgICB0YXJnZXQ6IExheWVycy5FbnVtLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdMYXllcnMuRW51bScsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdFZGl0b3InLFxyXG4gICAgICAgIG5ld05hbWU6ICdFRElUT1InLFxyXG4gICAgICAgIHRhcmdldDogTGF5ZXJzLkVudW0sXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0xheWVycy5FbnVtJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ1VJJyxcclxuICAgICAgICBuZXdOYW1lOiAnVUlfM0QnLFxyXG4gICAgICAgIHRhcmdldDogTGF5ZXJzLkVudW0sXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0xheWVycy5FbnVtJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ1VJMkQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdVSV8yRCcsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnTGF5ZXJzLkVudW0nLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnU2NlbmVHaXptbycsXHJcbiAgICAgICAgbmV3TmFtZTogJ1NDRU5FX0dJWk1PJyxcclxuICAgICAgICB0YXJnZXQ6IExheWVycy5FbnVtLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdMYXllcnMuRW51bScsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdtYWtlSW5jbHVzaXZlTWFzaycsXHJcbiAgICAgICAgbmV3TmFtZTogJ21ha2VNYXNrSW5jbHVkZScsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0xheWVycycsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdtYWtlRXhjbHVzaXZlTWFzaycsXHJcbiAgICAgICAgbmV3TmFtZTogJ21ha2VNYXNrRXhjbHVkZScsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0xheWVycycsXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbnJlbW92ZVByb3BlcnR5KExheWVycy5FbnVtLCdMYXllcnMuRW51bScsW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ0FMV0FZUycsXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoTGF5ZXJzLkJpdE1hc2ssJ0xheWVycy5CaXRNYXNrJyxbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAnQUxXQVlTJyxcclxuICAgIH1cclxuXSk7XHJcbiJdfQ==