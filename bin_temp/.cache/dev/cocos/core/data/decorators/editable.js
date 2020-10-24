(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./property.js", "../../default-constants.js", "./utils.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./property.js"), require("../../default-constants.js"), require("./utils.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.property, global.defaultConstants, global.utils);
    global.editable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _property, _defaultConstants, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.disallowAnimation = _exports.multiline = _exports.radian = _exports.unit = _exports.displayOrder = _exports.slide = _exports.rangeStep = _exports.rangeMax = _exports.rangeMin = _exports.range = _exports.tooltip = _exports.displayName = _exports.readOnly = _exports.visible = _exports.editable = _exports.help = _exports.icon = _exports.inspector = _exports.playOnFocus = _exports.menu = _exports.executeInEditMode = void 0;

  /**
   * @category decorator
   */

  /**
   * @en Makes a CCClass that inherit from component execute in edit mode.<br/>
   * By default, all components are only executed in play mode,<br/>
   * which means they will not have their callback functions executed while the Editor is in edit mode.<br/>
   * @zh 允许继承自 Component 的 CCClass 在编辑器里执行。<br/>
   * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, executeInEditMode} = _decorator;
   *
   *  @ccclass
   *  @executeInEditMode
   * class NewScript extends Component {
   *     // ...
   * }
   * ```
   */
  var executeInEditMode = _defaultConstants.DEV ? (0, _utils.makeSmartEditorClassDecorator)('executeInEditMode', true) : _utils.emptySmartClassDecorator;
  /**
   * @en Add the current component to the specific menu path in `Add Component` selector of the inspector panel
   * @zh 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
   * @param path - The path is the menu represented like a pathname. For example the menu could be "Rendering/CameraCtrl".
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, menu} = _decorator;
   *
   * @ccclass
   * @menu("Rendering/CameraCtrl")
   * class NewScript extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.executeInEditMode = executeInEditMode;
  var menu = _defaultConstants.DEV ? (0, _utils.makeEditorClassDecoratorFn)('menu') : _utils.emptyDecoratorFn;
  /**
   * @en When {{executeInEditMode}} is set, this decorator will decide when a node with the component is on focus whether the editor should running in high FPS mode.
   * @zh 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, playOnFocus, executeInEditMode} = _decorator;
   *
   * @ccclass
   * @executeInEditMode
   * @playOnFocus
   * class CameraCtrl extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.menu = menu;
  var playOnFocus = _defaultConstants.DEV ? (0, _utils.makeSmartEditorClassDecorator)('playOnFocus') : _utils.emptySmartClassDecorator;
  /**
   * @en Use a customized inspector page in the **inspector**
   * @zh 自定义当前组件在 **属性检查器** 中渲染时所用的 UI 页面描述。
   * @param url The url of the page definition in js
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, inspector} = _decorator;
   *
   * @ccclass
   * @inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
   * class NewScript extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.playOnFocus = playOnFocus;
  var inspector = _defaultConstants.DEV ? (0, _utils.makeEditorClassDecoratorFn)('inspector') : _utils.emptyDecoratorFn;
  /**
   * @en Define the icon of the component.
   * @zh 自定义当前组件在编辑器中显示的图标 url。
   * @param url
   * @private
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, icon} = _decorator;
   *
   *  @ccclass
   *  @icon("xxxx.png")
   * class NewScript extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.inspector = inspector;
  var icon = _defaultConstants.DEV ? (0, _utils.makeEditorClassDecoratorFn)('icon') : _utils.emptyDecoratorFn;
  /**
   * @en Define the help documentation url, if given, the component section in the **inspector** will have a help documentation icon reference to the web page given. 
   * @zh 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
   * @param url The url of the help documentation
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, help} = _decorator;
   *
   * @ccclass
   * @help("app://docs/html/components/spine.html")
   * class NewScript extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.icon = icon;
  var help = _defaultConstants.DEV ? (0, _utils.makeEditorClassDecoratorFn)('help') : _utils.emptyDecoratorFn;
  /**
   * @en
   * Enables the editor interoperability of the property.
   * @zh
   * 允许该属性与编辑器交互。
   */

  _exports.help = help;
  var editable = !_defaultConstants.DEV ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)(makeEditable({}))(target, propertyKey, descriptor);
  };
  /**
   * @en
   * Sets the condition to show the property.
   * @zh
   * 设置在编辑器展示该属性的条件。
   * @param condition 展示条件，当返回 `true` 时展示；否则不展示。
   */

  _exports.editable = editable;
  var visible = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (condition) {
    return (0, _property.property)(makeEditable({
      visible: condition
    }));
  };
  /**
   * @en
   * Sets the property to be read only in editor.
   * @zh
   * 设置该属性在编辑器中仅是可读的。
   */

  _exports.visible = visible;
  var readOnly = !_defaultConstants.DEV ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)(makeEditable({
      readonly: true
    }))(target, propertyKey, descriptor);
  };
  /**
   * @en
   * Sets the display name of the property in editor.
   * @zh
   * 设置该属性在编辑器中的显示名称。
   * @param text 显示名称。
   */

  _exports.readOnly = readOnly;
  var displayName = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (text) {
    return (0, _property.property)(makeEditable({
      displayName: text
    }));
  };
  /**
   * @en
   * Sets the tooltip content of the property in editor.
   * @zh
   * 设置该属性在编辑器中的工具提示内容。
   * @param text 工具提示。
   */

  _exports.displayName = displayName;
  var tooltip = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (text) {
    return (0, _property.property)(makeEditable({
      tooltip: text
    }));
  };
  /**
   * @en
   * Sets the allowed range of the property in editor.
   * @zh
   * 设置该属性在编辑器中允许设置的范围。
   * @param values 范围。
   */

  _exports.tooltip = tooltip;
  var range = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (values) {
    return (0, _property.property)(makeEditable({
      range: values
    }));
  };
  /**
   * @en
   * Sets the allowed min value of the property in editor.
   * @zh
   * 设置该属性在编辑器中允许的最小值。
   * @param value 最小值。
   */

  _exports.range = range;
  var rangeMin = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (value) {
    return (0, _property.property)(makeEditable({
      min: value
    }));
  };
  /**
   * @en
   * Sets the allowed max value of the property in editor.
   * @zh
   * 设置该属性在编辑器中允许的最大值。
   * @param value 最大值。
   */

  _exports.rangeMin = rangeMin;
  var rangeMax = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (value) {
    return (0, _property.property)(makeEditable({
      max: value
    }));
  };
  /**
   * @en
   * Sets the step of the property in editor.
   * @zh
   * 设置该属性在编辑器中的步进值。
   * @param value 步进值。
   */

  _exports.rangeMax = rangeMax;
  var rangeStep = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (value) {
    return (0, _property.property)(makeEditable({
      step: value
    }));
  };
  /**
   * @en
   * Enable a slider be given to coordinate the property in editor.
   * @zh
   * 允许在编辑器中提供滑动条来调节值
   */

  _exports.rangeStep = rangeStep;
  var slide = !_defaultConstants.DEV ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)(makeEditable({
      slide: true
    }))(target, propertyKey, descriptor);
  };
  /**
   * @en
   * Sets the display order of the property in editor.
   * @zh
   * 设置该属性在编辑器中的显示顺序。
   * @param order 显示顺序。
   */

  _exports.slide = slide;
  var displayOrder = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (order) {
    return (0, _property.property)(makeEditable({
      displayOrder: order
    }));
  };
  /**
   * @en
   * Sets the unit of the property in editor.
   * @zh
   * 设置该属性在编辑器中的计量单位。
   * @param name 计量单位的名称。
   */

  _exports.displayOrder = displayOrder;
  var unit = !_defaultConstants.DEV ? _utils.emptyDecoratorFn : function (name) {
    return (0, _property.property)(makeEditable({
      unit: name
    }));
  };
  /**
   * @en
   * Sets to convert the value into radian before feed it to the property in editor.
   * @zh
   * 设置在编辑器中赋值该属性前将值先转换为弧度制。
   */

  _exports.unit = unit;
  var radian = !_defaultConstants.DEV ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)(makeEditable({
      radian: true
    }))(target, propertyKey, descriptor);
  };
  /**
   * @en
   * Enable multi-line display of the property in editor.
   * @zh
   * 允许在编辑器中对该属性进行多行显示。
   */

  _exports.radian = radian;
  var multiline = !_defaultConstants.DEV ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)(makeEditable({
      multiline: true
    }))(target, propertyKey, descriptor);
  };
  /**
   * @en
   * Sets the property so that it does not interop with the animation parts in editor.
   * @zh
   * 设置该属性不参与编辑器中动画相关的交互。
   */

  _exports.multiline = multiline;
  var disallowAnimation = !_defaultConstants.EDITOR ? _utils.emptyDecorator : function (target, propertyKey, descriptor) {
    return (0, _property.property)({
      __noImplicit: true,
      animatable: false
    })(target, propertyKey, descriptor);
  };
  _exports.disallowAnimation = disallowAnimation;

  function makeEditable(options) {
    options.__noImplicit = true;

    if (!('visible' in options)) {
      options.visible = true;
    }

    return options;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL2VkaXRhYmxlLnRzIl0sIm5hbWVzIjpbImV4ZWN1dGVJbkVkaXRNb2RlIiwiREVWIiwiZW1wdHlTbWFydENsYXNzRGVjb3JhdG9yIiwibWVudSIsImVtcHR5RGVjb3JhdG9yRm4iLCJwbGF5T25Gb2N1cyIsImluc3BlY3RvciIsImljb24iLCJoZWxwIiwiZWRpdGFibGUiLCJlbXB0eURlY29yYXRvciIsInRhcmdldCIsInByb3BlcnR5S2V5IiwiZGVzY3JpcHRvciIsIm1ha2VFZGl0YWJsZSIsInZpc2libGUiLCJjb25kaXRpb24iLCJyZWFkT25seSIsInJlYWRvbmx5IiwiZGlzcGxheU5hbWUiLCJ0ZXh0IiwidG9vbHRpcCIsInJhbmdlIiwidmFsdWVzIiwicmFuZ2VNaW4iLCJ2YWx1ZSIsIm1pbiIsInJhbmdlTWF4IiwibWF4IiwicmFuZ2VTdGVwIiwic3RlcCIsInNsaWRlIiwiZGlzcGxheU9yZGVyIiwib3JkZXIiLCJ1bml0IiwibmFtZSIsInJhZGlhbiIsIm11bHRpbGluZSIsImRpc2FsbG93QW5pbWF0aW9uIiwiRURJVE9SIiwiX19ub0ltcGxpY2l0IiwiYW5pbWF0YWJsZSIsIm9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JPLE1BQU1BLGlCQUF1RSxHQUNoRkMsd0JBQU0sMENBQThCLG1CQUE5QixFQUFtRCxJQUFuRCxDQUFOLEdBQWlFQywrQkFEOUQ7QUFHUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JPLE1BQU1DLElBQXNDLEdBQy9DRix3QkFBTSx1Q0FBMkIsTUFBM0IsQ0FBTixHQUEyQ0csdUJBRHhDO0FBR1A7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCTyxNQUFNQyxXQUFpRSxHQUMxRUosd0JBQU0sMENBQXVDLGFBQXZDLENBQU4sR0FBOERDLCtCQUQzRDtBQUdQ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U0MsV0FBVCxFQUFzQkMsVUFBdEIsRUFBcUM7QUFDakMsV0FBTyx3QkFBU0MsWUFBWSxDQUFDO0FBQ3pCdUIsTUFBQUEsU0FBUyxFQUFFO0FBRGMsS0FBRCxDQUFyQixFQUVIMUIsTUFGRyxFQUVLQyxXQUZMLEVBRWtCQyxVQUZsQixDQUFQO0FBR0gsR0FMRTtBQU9QOzs7Ozs7OztBQU1PLE1BQU15QixpQkFBMEMsR0FBRyxDQUFDQyx3QkFBRCxHQUFVN0IscUJBQVYsR0FBMEIsVUFBQ0MsTUFBRCxFQUFTQyxXQUFULEVBQXNCQyxVQUF0QixFQUFxQztBQUNySCxXQUFPLHdCQUFTO0FBQ1oyQixNQUFBQSxZQUFZLEVBQUUsSUFERjtBQUVaQyxNQUFBQSxVQUFVLEVBQUU7QUFGQSxLQUFULEVBR0o5QixNQUhJLEVBR0lDLFdBSEosRUFHaUJDLFVBSGpCLENBQVA7QUFJSCxHQUxNOzs7QUFRUCxXQUFTQyxZQUFULENBQXVCNEIsT0FBdkIsRUFBa0Q7QUFDOUNBLElBQUFBLE9BQU8sQ0FBQ0YsWUFBUixHQUF1QixJQUF2Qjs7QUFDQSxRQUFJLEVBQUUsYUFBYUUsT0FBZixDQUFKLEVBQTZCO0FBQ3pCQSxNQUFBQSxPQUFPLENBQUMzQixPQUFSLEdBQWtCLElBQWxCO0FBQ0g7O0FBQ0QsV0FBTzJCLE9BQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZGVjb3JhdG9yXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSVByb3BlcnR5T3B0aW9ucyB9IGZyb20gJy4vcHJvcGVydHknO1xyXG5pbXBvcnQgeyBwcm9wZXJ0eSB9IGZyb20gJy4vcHJvcGVydHknO1xyXG5pbXBvcnQgeyBERVYsIEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yLCBlbXB0eURlY29yYXRvciwgbWFrZVNtYXJ0RWRpdG9yQ2xhc3NEZWNvcmF0b3IsIG1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuLCBlbXB0eVNtYXJ0Q2xhc3NEZWNvcmF0b3IsIGVtcHR5RGVjb3JhdG9yRm4gfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBAZW4gTWFrZXMgYSBDQ0NsYXNzIHRoYXQgaW5oZXJpdCBmcm9tIGNvbXBvbmVudCBleGVjdXRlIGluIGVkaXQgbW9kZS48YnIvPlxyXG4gKiBCeSBkZWZhdWx0LCBhbGwgY29tcG9uZW50cyBhcmUgb25seSBleGVjdXRlZCBpbiBwbGF5IG1vZGUsPGJyLz5cclxuICogd2hpY2ggbWVhbnMgdGhleSB3aWxsIG5vdCBoYXZlIHRoZWlyIGNhbGxiYWNrIGZ1bmN0aW9ucyBleGVjdXRlZCB3aGlsZSB0aGUgRWRpdG9yIGlzIGluIGVkaXQgbW9kZS48YnIvPlxyXG4gKiBAemgg5YWB6K6457un5om/6IeqIENvbXBvbmVudCDnmoQgQ0NDbGFzcyDlnKjnvJbovpHlmajph4zmiafooYzjgII8YnIvPlxyXG4gKiDpu5jorqTmg4XlhrXkuIvvvIzmiYDmnIkgQ29tcG9uZW50IOmDveWPquS8muWcqOi/kOihjOaXtuaJjeS8muaJp+ihjO+8jOS5n+WwseaYr+ivtOWug+S7rOeahOeUn+WRveWRqOacn+Wbnuiwg+S4jeS8muWcqOe8lui+keWZqOmHjOinpuWPkeOAglxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBfZGVjb3JhdG9yLCBDb21wb25lbnQgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IHtjY2NsYXNzLCBleGVjdXRlSW5FZGl0TW9kZX0gPSBfZGVjb3JhdG9yO1xyXG4gKlxyXG4gKiAgQGNjY2xhc3NcclxuICogIEBleGVjdXRlSW5FZGl0TW9kZVxyXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gKiAgICAgLy8gLi4uXHJcbiAqIH1cclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZXhlY3V0ZUluRWRpdE1vZGU6IENsYXNzRGVjb3JhdG9yICYgKCh5ZXM/OiBib29sZWFuKSA9PiBDbGFzc0RlY29yYXRvcikgPVxyXG4gICAgREVWID8gbWFrZVNtYXJ0RWRpdG9yQ2xhc3NEZWNvcmF0b3IoJ2V4ZWN1dGVJbkVkaXRNb2RlJywgdHJ1ZSkgOiBlbXB0eVNtYXJ0Q2xhc3NEZWNvcmF0b3I7XHJcblxyXG4vKipcclxuICogQGVuIEFkZCB0aGUgY3VycmVudCBjb21wb25lbnQgdG8gdGhlIHNwZWNpZmljIG1lbnUgcGF0aCBpbiBgQWRkIENvbXBvbmVudGAgc2VsZWN0b3Igb2YgdGhlIGluc3BlY3RvciBwYW5lbFxyXG4gKiBAemgg5bCG5b2T5YmN57uE5Lu25re75Yqg5Yiw57uE5Lu26I+c5Y2V5Lit77yM5pa55L6/55So5oi35p+l5om+44CC5L6L5aaCIFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIuOAglxyXG4gKiBAcGFyYW0gcGF0aCAtIFRoZSBwYXRoIGlzIHRoZSBtZW51IHJlcHJlc2VudGVkIGxpa2UgYSBwYXRobmFtZS4gRm9yIGV4YW1wbGUgdGhlIG1lbnUgY291bGQgYmUgXCJSZW5kZXJpbmcvQ2FtZXJhQ3RybFwiLlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBfZGVjb3JhdG9yLCBDb21wb25lbnQgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IHtjY2NsYXNzLCBtZW51fSA9IF9kZWNvcmF0b3I7XHJcbiAqXHJcbiAqIEBjY2NsYXNzXHJcbiAqIEBtZW51KFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIilcclxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICogICAgIC8vIC4uLlxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG1lbnU6IChwYXRoOiBzdHJpbmcpID0+IENsYXNzRGVjb3JhdG9yID1cclxuICAgIERFViA/IG1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuKCdtZW51JykgOiBlbXB0eURlY29yYXRvckZuO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBXaGVuIHt7ZXhlY3V0ZUluRWRpdE1vZGV9fSBpcyBzZXQsIHRoaXMgZGVjb3JhdG9yIHdpbGwgZGVjaWRlIHdoZW4gYSBub2RlIHdpdGggdGhlIGNvbXBvbmVudCBpcyBvbiBmb2N1cyB3aGV0aGVyIHRoZSBlZGl0b3Igc2hvdWxkIHJ1bm5pbmcgaW4gaGlnaCBGUFMgbW9kZS5cclxuICogQHpoIOW9k+aMh+WumuS6hiBcImV4ZWN1dGVJbkVkaXRNb2RlXCIg5Lul5ZCO77yMcGxheU9uRm9jdXMg5Y+v5Lul5Zyo6YCJ5Lit5b2T5YmN57uE5Lu25omA5Zyo55qE6IqC54K55pe277yM5o+Q6auY57yW6L6R5Zmo55qE5Zy65pmv5Yi35paw6aKR546H5YiwIDYwIEZQU++8jOWQpuWImeWcuuaZr+WwseWPquS8muWcqOW/heimgeeahOaXtuWAmei/m+ihjOmHjee7mOOAglxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBfZGVjb3JhdG9yLCBDb21wb25lbnQgfSBmcm9tICdjYyc7XHJcbiAqIGNvbnN0IHtjY2NsYXNzLCBwbGF5T25Gb2N1cywgZXhlY3V0ZUluRWRpdE1vZGV9ID0gX2RlY29yYXRvcjtcclxuICpcclxuICogQGNjY2xhc3NcclxuICogQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbiAqIEBwbGF5T25Gb2N1c1xyXG4gKiBjbGFzcyBDYW1lcmFDdHJsIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICogICAgIC8vIC4uLlxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHBsYXlPbkZvY3VzOiBDbGFzc0RlY29yYXRvciAmICgoeWVzPzogYm9vbGVhbikgPT4gQ2xhc3NEZWNvcmF0b3IpID1cclxuICAgIERFViA/IG1ha2VTbWFydEVkaXRvckNsYXNzRGVjb3JhdG9yPGJvb2xlYW4+KCdwbGF5T25Gb2N1cycpIDogZW1wdHlTbWFydENsYXNzRGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBVc2UgYSBjdXN0b21pemVkIGluc3BlY3RvciBwYWdlIGluIHRoZSAqKmluc3BlY3RvcioqXHJcbiAqIEB6aCDoh6rlrprkuYnlvZPliY3nu4Tku7blnKggKirlsZ7mgKfmo4Dmn6XlmagqKiDkuK3muLLmn5Pml7bmiYDnlKjnmoQgVUkg6aG16Z2i5o+P6L+w44CCXHJcbiAqIEBwYXJhbSB1cmwgVGhlIHVybCBvZiB0aGUgcGFnZSBkZWZpbml0aW9uIGluIGpzXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IF9kZWNvcmF0b3IsIENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICogY29uc3Qge2NjY2xhc3MsIGluc3BlY3Rvcn0gPSBfZGVjb3JhdG9yO1xyXG4gKlxyXG4gKiBAY2NjbGFzc1xyXG4gKiBAaW5zcGVjdG9yKFwicGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jYW1lcmEtY3RybC5qc1wiKVxyXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gKiAgICAgLy8gLi4uXHJcbiAqIH1cclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW5zcGVjdG9yOiAodXJsOiBzdHJpbmcpID0+IENsYXNzRGVjb3JhdG9yID1cclxuICAgIERFViA/IG1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuKCdpbnNwZWN0b3InKSA6IGVtcHR5RGVjb3JhdG9yRm47XHJcblxyXG4vKipcclxuICogQGVuIERlZmluZSB0aGUgaWNvbiBvZiB0aGUgY29tcG9uZW50LlxyXG4gKiBAemgg6Ieq5a6a5LmJ5b2T5YmN57uE5Lu25Zyo57yW6L6R5Zmo5Lit5pi+56S655qE5Zu+5qCHIHVybOOAglxyXG4gKiBAcGFyYW0gdXJsXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IF9kZWNvcmF0b3IsIENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICogY29uc3Qge2NjY2xhc3MsIGljb259ID0gX2RlY29yYXRvcjtcclxuICpcclxuICogIEBjY2NsYXNzXHJcbiAqICBAaWNvbihcInh4eHgucG5nXCIpXHJcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAqICAgICAvLyAuLi5cclxuICogfVxyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBpY29uOiAodXJsOiBzdHJpbmcpID0+IENsYXNzRGVjb3JhdG9yID1cclxuICAgIERFViA/IG1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuKCdpY29uJykgOiBlbXB0eURlY29yYXRvckZuO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBEZWZpbmUgdGhlIGhlbHAgZG9jdW1lbnRhdGlvbiB1cmwsIGlmIGdpdmVuLCB0aGUgY29tcG9uZW50IHNlY3Rpb24gaW4gdGhlICoqaW5zcGVjdG9yKiogd2lsbCBoYXZlIGEgaGVscCBkb2N1bWVudGF0aW9uIGljb24gcmVmZXJlbmNlIHRvIHRoZSB3ZWIgcGFnZSBnaXZlbi4gXHJcbiAqIEB6aCDmjIflrprlvZPliY3nu4Tku7bnmoTluK7liqnmlofmoaPnmoQgdXJs77yM6K6+572u6L+H5ZCO77yM5ZyoICoq5bGe5oCn5qOA5p+l5ZmoKiog5Lit5bCx5Lya5Ye6546w5LiA5Liq5biu5Yqp5Zu+5qCH77yM55So5oi354K55Ye75bCG5omT5byA5oyH5a6a55qE572R6aG144CCXHJcbiAqIEBwYXJhbSB1cmwgVGhlIHVybCBvZiB0aGUgaGVscCBkb2N1bWVudGF0aW9uXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IF9kZWNvcmF0b3IsIENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICogY29uc3Qge2NjY2xhc3MsIGhlbHB9ID0gX2RlY29yYXRvcjtcclxuICpcclxuICogQGNjY2xhc3NcclxuICogQGhlbHAoXCJhcHA6Ly9kb2NzL2h0bWwvY29tcG9uZW50cy9zcGluZS5odG1sXCIpXHJcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAqICAgICAvLyAuLi5cclxuICogfVxyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBoZWxwOiAodXJsOiBzdHJpbmcpID0+IENsYXNzRGVjb3JhdG9yID1cclxuICAgIERFViA/IG1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuKCdoZWxwJykgOiBlbXB0eURlY29yYXRvckZuO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBFbmFibGVzIHRoZSBlZGl0b3IgaW50ZXJvcGVyYWJpbGl0eSBvZiB0aGUgcHJvcGVydHkuXHJcbiAqIEB6aFxyXG4gKiDlhYHorrjor6XlsZ7mgKfkuI7nvJbovpHlmajkuqTkupLjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBlZGl0YWJsZTogTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAhREVWID8gZW1wdHlEZWNvcmF0b3I6ICh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSA9PiB7XHJcbiAgICByZXR1cm4gcHJvcGVydHkobWFrZUVkaXRhYmxlKHsgfSkpKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTZXRzIHRoZSBjb25kaXRpb24gdG8gc2hvdyB0aGUgcHJvcGVydHkuXHJcbiAqIEB6aFxyXG4gKiDorr7nva7lnKjnvJbovpHlmajlsZXnpLror6XlsZ7mgKfnmoTmnaHku7bjgIJcclxuICogQHBhcmFtIGNvbmRpdGlvbiDlsZXnpLrmnaHku7bvvIzlvZPov5Tlm54gYHRydWVgIOaXtuWxleekuu+8m+WQpuWImeS4jeWxleekuuOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHZpc2libGU6IChjb25kaXRpb246IGJvb2xlYW4gfCAoKCkgPT4gYm9vbGVhbikpID0+IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gIURFViA/IGVtcHR5RGVjb3JhdG9yRm46XHJcbiAgICAoY29uZGl0aW9uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIHZpc2libGU6IGNvbmRpdGlvbixcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTZXRzIHRoZSBwcm9wZXJ0eSB0byBiZSByZWFkIG9ubHkgaW4gZWRpdG9yLlxyXG4gKiBAemhcclxuICog6K6+572u6K+l5bGe5oCn5Zyo57yW6L6R5Zmo5Lit5LuF5piv5Y+v6K+755qE44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVhZE9ubHk6IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gIURFViA/IGVtcHR5RGVjb3JhdG9yOiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgcmVhZG9ubHk6IHRydWUsXHJcbiAgICB9KSkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XHJcbn07XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFNldHMgdGhlIGRpc3BsYXkgbmFtZSBvZiB0aGUgcHJvcGVydHkgaW4gZWRpdG9yLlxyXG4gKiBAemhcclxuICog6K6+572u6K+l5bGe5oCn5Zyo57yW6L6R5Zmo5Lit55qE5pi+56S65ZCN56ew44CCXHJcbiAqIEBwYXJhbSB0ZXh0IOaYvuekuuWQjeensOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGRpc3BsYXlOYW1lOiAodGV4dDogc3RyaW5nKSA9PiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFERVYgPyBlbXB0eURlY29yYXRvckZuOlxyXG4gICAgKHRleHQpID0+IHtcclxuICAgICAgICByZXR1cm4gcHJvcGVydHkobWFrZUVkaXRhYmxlKHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IHRleHQsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0cyB0aGUgdG9vbHRpcCBjb250ZW50IG9mIHRoZSBwcm9wZXJ0eSBpbiBlZGl0b3IuXHJcbiAqIEB6aFxyXG4gKiDorr7nva7or6XlsZ7mgKflnKjnvJbovpHlmajkuK3nmoTlt6Xlhbfmj5DnpLrlhoXlrrnjgIJcclxuICogQHBhcmFtIHRleHQg5bel5YW35o+Q56S644CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdG9vbHRpcDogKHRleHQ6IHN0cmluZykgPT4gTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAhREVWID8gZW1wdHlEZWNvcmF0b3JGbjpcclxuICAgICh0ZXh0KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRleHQsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0cyB0aGUgYWxsb3dlZCByYW5nZSBvZiB0aGUgcHJvcGVydHkgaW4gZWRpdG9yLlxyXG4gKiBAemhcclxuICog6K6+572u6K+l5bGe5oCn5Zyo57yW6L6R5Zmo5Lit5YWB6K646K6+572u55qE6IyD5Zu044CCXHJcbiAqIEBwYXJhbSB2YWx1ZXMg6IyD5Zu044CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmFuZ2U6ICh2YWx1ZXM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IFtudW1iZXIsIG51bWJlcl0pID0+IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gIURFViA/IGVtcHR5RGVjb3JhdG9yRm46XHJcbiAgICAodmFsdWVzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIHJhbmdlOiB2YWx1ZXMsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0cyB0aGUgYWxsb3dlZCBtaW4gdmFsdWUgb2YgdGhlIHByb3BlcnR5IGluIGVkaXRvci5cclxuICogQHpoXHJcbiAqIOiuvue9ruivpeWxnuaAp+WcqOe8lui+keWZqOS4reWFgeiuuOeahOacgOWwj+WAvOOAglxyXG4gKiBAcGFyYW0gdmFsdWUg5pyA5bCP5YC844CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmFuZ2VNaW46ICh2YWx1ZTogbnVtYmVyKSA9PiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFERVYgPyBlbXB0eURlY29yYXRvckZuOlxyXG4gICAgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIG1pbjogdmFsdWUsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0cyB0aGUgYWxsb3dlZCBtYXggdmFsdWUgb2YgdGhlIHByb3BlcnR5IGluIGVkaXRvci5cclxuICogQHpoXHJcbiAqIOiuvue9ruivpeWxnuaAp+WcqOe8lui+keWZqOS4reWFgeiuuOeahOacgOWkp+WAvOOAglxyXG4gKiBAcGFyYW0gdmFsdWUg5pyA5aSn5YC844CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmFuZ2VNYXg6ICh2YWx1ZTogbnVtYmVyKSA9PiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFERVYgPyBlbXB0eURlY29yYXRvckZuOlxyXG4gICAgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIG1heDogdmFsdWUsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2V0cyB0aGUgc3RlcCBvZiB0aGUgcHJvcGVydHkgaW4gZWRpdG9yLlxyXG4gKiBAemhcclxuICog6K6+572u6K+l5bGe5oCn5Zyo57yW6L6R5Zmo5Lit55qE5q2l6L+b5YC844CCXHJcbiAqIEBwYXJhbSB2YWx1ZSDmraXov5vlgLzjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCByYW5nZVN0ZXA6ICh2YWx1ZTogbnVtYmVyKSA9PiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFERVYgPyBlbXB0eURlY29yYXRvckZuOlxyXG4gICAgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIHN0ZXA6IHZhbHVlLFxyXG4gICAgICAgIH0pKTtcclxuICAgIH07XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEVuYWJsZSBhIHNsaWRlciBiZSBnaXZlbiB0byBjb29yZGluYXRlIHRoZSBwcm9wZXJ0eSBpbiBlZGl0b3IuXHJcbiAqIEB6aFxyXG4gKiDlhYHorrjlnKjnvJbovpHlmajkuK3mj5Dkvpvmu5HliqjmnaHmnaXosIPoioLlgLxcclxuICovXHJcbmV4cG9ydCBjb25zdCBzbGlkZTogTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAhREVWID8gZW1wdHlEZWNvcmF0b3I6XHJcbiAgICAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eShtYWtlRWRpdGFibGUoe1xyXG4gICAgICAgICAgICBzbGlkZTogdHJ1ZSxcclxuICAgICAgICB9KSkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTZXRzIHRoZSBkaXNwbGF5IG9yZGVyIG9mIHRoZSBwcm9wZXJ0eSBpbiBlZGl0b3IuXHJcbiAqIEB6aFxyXG4gKiDorr7nva7or6XlsZ7mgKflnKjnvJbovpHlmajkuK3nmoTmmL7npLrpobrluo/jgIJcclxuICogQHBhcmFtIG9yZGVyIOaYvuekuumhuuW6j+OAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGRpc3BsYXlPcmRlcjogKG9yZGVyOiBudW1iZXIpID0+IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gIURFViA/IGVtcHR5RGVjb3JhdG9yRm46XHJcbiAgICAob3JkZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gcHJvcGVydHkobWFrZUVkaXRhYmxlKHtcclxuICAgICAgICAgICAgZGlzcGxheU9yZGVyOiBvcmRlcixcclxuICAgICAgICB9KSk7XHJcbiAgICB9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTZXRzIHRoZSB1bml0IG9mIHRoZSBwcm9wZXJ0eSBpbiBlZGl0b3IuXHJcbiAqIEB6aFxyXG4gKiDorr7nva7or6XlsZ7mgKflnKjnvJbovpHlmajkuK3nmoTorqHph4/ljZXkvY3jgIJcclxuICogQHBhcmFtIG5hbWUg6K6h6YeP5Y2V5L2N55qE5ZCN56ew44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdW5pdDogKG5hbWU6XHJcbnwgJ2xtJ1xyXG58ICdseCdcclxufCAnY2QvbcKyJ1xyXG4pID0+IExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gIURFViA/IGVtcHR5RGVjb3JhdG9yRm46XHJcbiAgICAobmFtZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eShtYWtlRWRpdGFibGUoe1xyXG4gICAgICAgICAgICB1bml0OiBuYW1lLFxyXG4gICAgICAgIH0pKTtcclxuICAgIH07XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFNldHMgdG8gY29udmVydCB0aGUgdmFsdWUgaW50byByYWRpYW4gYmVmb3JlIGZlZWQgaXQgdG8gdGhlIHByb3BlcnR5IGluIGVkaXRvci5cclxuICogQHpoXHJcbiAqIOiuvue9ruWcqOe8lui+keWZqOS4rei1i+WAvOivpeWxnuaAp+WJjeWwhuWAvOWFiOi9rOaNouS4uuW8p+W6puWItuOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHJhZGlhbjogTGVnYWN5UHJvcGVydHlEZWNvcmF0b3IgPSAhREVWID8gZW1wdHlEZWNvcmF0b3I6XHJcbiAgICAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eShtYWtlRWRpdGFibGUoe1xyXG4gICAgICAgICAgICByYWRpYW46IHRydWUsXHJcbiAgICAgICAgfSkpKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogRW5hYmxlIG11bHRpLWxpbmUgZGlzcGxheSBvZiB0aGUgcHJvcGVydHkgaW4gZWRpdG9yLlxyXG4gKiBAemhcclxuICog5YWB6K645Zyo57yW6L6R5Zmo5Lit5a+56K+l5bGe5oCn6L+b6KGM5aSa6KGM5pi+56S644CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbXVsdGlsaW5lOiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFERVYgPyBlbXB0eURlY29yYXRvcjpcclxuICAgICh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KG1ha2VFZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcclxuICAgICAgICB9KSkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTZXRzIHRoZSBwcm9wZXJ0eSBzbyB0aGF0IGl0IGRvZXMgbm90IGludGVyb3Agd2l0aCB0aGUgYW5pbWF0aW9uIHBhcnRzIGluIGVkaXRvci5cclxuICogQHpoXHJcbiAqIOiuvue9ruivpeWxnuaAp+S4jeWPguS4jue8lui+keWZqOS4reWKqOeUu+ebuOWFs+eahOS6pOS6kuOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGRpc2FsbG93QW5pbWF0aW9uOiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICFFRElUT1IgPyBlbXB0eURlY29yYXRvcjogKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpID0+IHtcclxuICAgIHJldHVybiBwcm9wZXJ0eSh7XHJcbiAgICAgICAgX19ub0ltcGxpY2l0OiB0cnVlLFxyXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxyXG4gICAgfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gbWFrZUVkaXRhYmxlIChvcHRpb25zOiBJUHJvcGVydHlPcHRpb25zKSB7XHJcbiAgICBvcHRpb25zLl9fbm9JbXBsaWNpdCA9IHRydWU7XHJcbiAgICBpZiAoISgndmlzaWJsZScgaW4gb3B0aW9ucykpIHtcclxuICAgICAgICBvcHRpb25zLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbn0iXX0=