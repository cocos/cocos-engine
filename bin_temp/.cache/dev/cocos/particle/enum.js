(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/value-types/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/value-types/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global._enum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ModuleRandSeed = _exports.TextureMode = _exports.TrailMode = _exports.ArcMode = _exports.EmitLocation = _exports.ShapeType = _exports.RenderMode = _exports.Space = void 0;

  /**
   * @category particle
   */
  var Space = (0, _index.Enum)({
    World: 0,
    Local: 1,
    Custom: 2
  });
  /**
   * 粒子的生成模式。
   * @enum ParticleSystemRenderer.RenderMode
   */

  _exports.Space = Space;
  var RenderMode = (0, _index.Enum)({
    /**
     * 粒子始终面向摄像机。
     */
    Billboard: 0,

    /**
     * 粒子始终面向摄像机但会根据参数进行拉伸。
     */
    StrecthedBillboard: 1,

    /**
     * 粒子始终与 XZ 平面平行。
     */
    HorizontalBillboard: 2,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机。
     */
    VerticalBillboard: 3,

    /**
     * 粒子保持模型本身状态。
     */
    Mesh: 4
  });
  /**
   * 粒子发射器类型。
   * @enum shapeModule.ShapeType
   */

  _exports.RenderMode = RenderMode;
  var ShapeType = (0, _index.Enum)({
    /**
     * 立方体类型粒子发射器。
     */
    Box: 0,

    /**
     * 圆形粒子发射器。
     */
    Circle: 1,

    /**
     * 圆锥体粒子发射器。
     */
    Cone: 2,

    /**
     * 球体粒子发射器。
     */
    Sphere: 3,

    /**
     * 半球体粒子发射器。
     */
    Hemisphere: 4
  });
  /**
   * 粒子从发射器的哪个部位发射。
   * @enum shapeModule.EmitLocation
   */

  _exports.ShapeType = ShapeType;
  var EmitLocation = (0, _index.Enum)({
    /**
     * 基础位置发射（仅对 Circle 类型及 Cone 类型的粒子发射器适用）。
     */
    Base: 0,

    /**
     * 边框位置发射（仅对 Box 类型及 Circle 类型的粒子发射器适用）。
     */
    Edge: 1,

    /**
     * 表面位置发射（对所有类型的粒子发射器都适用）。
     */
    Shell: 2,

    /**
     * 内部位置发射（对所有类型的粒子发射器都适用）。
     */
    Volume: 3
  });
  /**
   * 粒子在扇形区域的发射方式。
   * @enum shapeModule.ArcMode
   */

  _exports.EmitLocation = EmitLocation;
  var ArcMode = (0, _index.Enum)({
    /**
     * 随机位置发射。
     */
    Random: 0,

    /**
     * 沿某一方向循环发射，每次循环方向相同。
     */
    Loop: 1,

    /**
     * 循环发射，每次循环方向相反。
     */
    PingPong: 2
  });
  /**
   * 选择如何为粒子系统生成轨迹。
   * @enum trailModule.TrailMode
   */

  _exports.ArcMode = ArcMode;
  var TrailMode = (0, _index.Enum)({
    /**
     * 粒子模式<bg>。
     * 创建一种效果，其中每个粒子在其路径中留下固定的轨迹。
     */
    Particles: 0
    /**
     * 带模式<bg>。
     * 根据其生命周期创建连接每个粒子的轨迹带。
     */
    // Ribbon: 1,

  });
  /**
   * 纹理填充模式。
   * @enum trailModule.TextureMode
   */

  _exports.TrailMode = TrailMode;
  var TextureMode = (0, _index.Enum)({
    /**
     * 拉伸填充纹理。
     */
    Stretch: 0
    /**
     * 重复填充纹理。
     */
    // Repeat: 1,

  });
  _exports.TextureMode = TextureMode;
  var ModuleRandSeed = {
    LIMIT: 23541,
    SIZE: 39825,
    TEXTURE: 90794,
    COLOR: 91041,
    FORCE: 212165,
    ROTATION: 125292,
    VELOCITY_X: 197866,
    VELOCITY_Y: 156497,
    VELOCITY_Z: 984136
  };
  _exports.ModuleRandSeed = ModuleRandSeed;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2VudW0udHMiXSwibmFtZXMiOlsiU3BhY2UiLCJXb3JsZCIsIkxvY2FsIiwiQ3VzdG9tIiwiUmVuZGVyTW9kZSIsIkJpbGxib2FyZCIsIlN0cmVjdGhlZEJpbGxib2FyZCIsIkhvcml6b250YWxCaWxsYm9hcmQiLCJWZXJ0aWNhbEJpbGxib2FyZCIsIk1lc2giLCJTaGFwZVR5cGUiLCJCb3giLCJDaXJjbGUiLCJDb25lIiwiU3BoZXJlIiwiSGVtaXNwaGVyZSIsIkVtaXRMb2NhdGlvbiIsIkJhc2UiLCJFZGdlIiwiU2hlbGwiLCJWb2x1bWUiLCJBcmNNb2RlIiwiUmFuZG9tIiwiTG9vcCIsIlBpbmdQb25nIiwiVHJhaWxNb2RlIiwiUGFydGljbGVzIiwiVGV4dHVyZU1vZGUiLCJTdHJldGNoIiwiTW9kdWxlUmFuZFNlZWQiLCJMSU1JVCIsIlNJWkUiLCJURVhUVVJFIiwiQ09MT1IiLCJGT1JDRSIsIlJPVEFUSU9OIiwiVkVMT0NJVFlfWCIsIlZFTE9DSVRZX1kiLCJWRUxPQ0lUWV9aIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7QUFNTyxNQUFNQSxLQUFLLEdBQUcsaUJBQUs7QUFDdEJDLElBQUFBLEtBQUssRUFBRSxDQURlO0FBRXRCQyxJQUFBQSxLQUFLLEVBQUUsQ0FGZTtBQUd0QkMsSUFBQUEsTUFBTSxFQUFFO0FBSGMsR0FBTCxDQUFkO0FBTVA7Ozs7OztBQUlPLE1BQU1DLFVBQVUsR0FBRyxpQkFBSztBQUUzQjs7O0FBR0FDLElBQUFBLFNBQVMsRUFBRSxDQUxnQjs7QUFPM0I7OztBQUdBQyxJQUFBQSxrQkFBa0IsRUFBRSxDQVZPOztBQVkzQjs7O0FBR0FDLElBQUFBLG1CQUFtQixFQUFFLENBZk07O0FBaUIzQjs7O0FBR0FDLElBQUFBLGlCQUFpQixFQUFFLENBcEJROztBQXNCM0I7OztBQUdBQyxJQUFBQSxJQUFJLEVBQUU7QUF6QnFCLEdBQUwsQ0FBbkI7QUE0QlA7Ozs7OztBQUlPLE1BQU1DLFNBQVMsR0FBRyxpQkFBSztBQUMxQjs7O0FBR0FDLElBQUFBLEdBQUcsRUFBRSxDQUpxQjs7QUFNMUI7OztBQUdBQyxJQUFBQSxNQUFNLEVBQUUsQ0FUa0I7O0FBVzFCOzs7QUFHQUMsSUFBQUEsSUFBSSxFQUFFLENBZG9COztBQWdCMUI7OztBQUdBQyxJQUFBQSxNQUFNLEVBQUUsQ0FuQmtCOztBQXFCMUI7OztBQUdBQyxJQUFBQSxVQUFVLEVBQUU7QUF4QmMsR0FBTCxDQUFsQjtBQTJCUDs7Ozs7O0FBSU8sTUFBTUMsWUFBWSxHQUFHLGlCQUFLO0FBQzdCOzs7QUFHQUMsSUFBQUEsSUFBSSxFQUFFLENBSnVCOztBQU03Qjs7O0FBR0FDLElBQUFBLElBQUksRUFBRSxDQVR1Qjs7QUFXN0I7OztBQUdBQyxJQUFBQSxLQUFLLEVBQUUsQ0Fkc0I7O0FBZ0I3Qjs7O0FBR0FDLElBQUFBLE1BQU0sRUFBRTtBQW5CcUIsR0FBTCxDQUFyQjtBQXNCUDs7Ozs7O0FBSU8sTUFBTUMsT0FBTyxHQUFHLGlCQUFLO0FBQ3hCOzs7QUFHQUMsSUFBQUEsTUFBTSxFQUFFLENBSmdCOztBQU14Qjs7O0FBR0FDLElBQUFBLElBQUksRUFBRSxDQVRrQjs7QUFXeEI7OztBQUdBQyxJQUFBQSxRQUFRLEVBQUU7QUFkYyxHQUFMLENBQWhCO0FBaUJQOzs7Ozs7QUFJTyxNQUFNQyxTQUFTLEdBQUcsaUJBQUs7QUFDMUI7Ozs7QUFJQUMsSUFBQUEsU0FBUyxFQUFFO0FBRVg7Ozs7QUFJQTs7QUFYMEIsR0FBTCxDQUFsQjtBQWNQOzs7Ozs7QUFJTyxNQUFNQyxXQUFXLEdBQUcsaUJBQUs7QUFDNUI7OztBQUdBQyxJQUFBQSxPQUFPLEVBQUU7QUFFVDs7O0FBR0E7O0FBVDRCLEdBQUwsQ0FBcEI7O0FBWUEsTUFBTUMsY0FBYyxHQUFHO0FBQzFCQyxJQUFBQSxLQUFLLEVBQUUsS0FEbUI7QUFFMUJDLElBQUFBLElBQUksRUFBRSxLQUZvQjtBQUcxQkMsSUFBQUEsT0FBTyxFQUFFLEtBSGlCO0FBSTFCQyxJQUFBQSxLQUFLLEVBQUUsS0FKbUI7QUFLMUJDLElBQUFBLEtBQUssRUFBRSxNQUxtQjtBQU0xQkMsSUFBQUEsUUFBUSxFQUFFLE1BTmdCO0FBTzFCQyxJQUFBQSxVQUFVLEVBQUUsTUFQYztBQVExQkMsSUFBQUEsVUFBVSxFQUFFLE1BUmM7QUFTMUJDLElBQUFBLFVBQVUsRUFBRTtBQVRjLEdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGFydGljbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBFbnVtIH0gZnJvbSAnLi4vY29yZS92YWx1ZS10eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgU3BhY2UgPSBFbnVtKHtcclxuICAgIFdvcmxkOiAwLFxyXG4gICAgTG9jYWw6IDEsXHJcbiAgICBDdXN0b206IDIsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOeykuWtkOeahOeUn+aIkOaooeW8j+OAglxyXG4gKiBAZW51bSBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyLlJlbmRlck1vZGVcclxuICovXHJcbmV4cG9ydCBjb25zdCBSZW5kZXJNb2RlID0gRW51bSh7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnspLlrZDlp4vnu4jpnaLlkJHmkYTlg4/mnLrjgIJcclxuICAgICAqL1xyXG4gICAgQmlsbGJvYXJkOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57KS5a2Q5aeL57uI6Z2i5ZCR5pGE5YOP5py65L2G5Lya5qC55o2u5Y+C5pWw6L+b6KGM5ouJ5Ly444CCXHJcbiAgICAgKi9cclxuICAgIFN0cmVjdGhlZEJpbGxib2FyZDogMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeykuWtkOWni+e7iOS4jiBYWiDlubPpnaLlubPooYzjgIJcclxuICAgICAqL1xyXG4gICAgSG9yaXpvbnRhbEJpbGxib2FyZDogMixcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeykuWtkOWni+e7iOS4jiBZIOi9tOW5s+ihjOS4lOacneWQkeaRhOWDj+acuuOAglxyXG4gICAgICovXHJcbiAgICBWZXJ0aWNhbEJpbGxib2FyZDogMyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeykuWtkOS/neaMgeaooeWei+acrOi6q+eKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBNZXNoOiA0LFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiDnspLlrZDlj5HlsITlmajnsbvlnovjgIJcclxuICogQGVudW0gc2hhcGVNb2R1bGUuU2hhcGVUeXBlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgU2hhcGVUeXBlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIOeri+aWueS9k+exu+Wei+eykuWtkOWPkeWwhOWZqOOAglxyXG4gICAgICovXHJcbiAgICBCb3g6IDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlnIblvaLnspLlrZDlj5HlsITlmajjgIJcclxuICAgICAqL1xyXG4gICAgQ2lyY2xlOiAxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ZyG6ZSl5L2T57KS5a2Q5Y+R5bCE5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIENvbmU6IDIsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnkIPkvZPnspLlrZDlj5HlsITlmajjgIJcclxuICAgICAqL1xyXG4gICAgU3BoZXJlOiAzLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y2K55CD5L2T57KS5a2Q5Y+R5bCE5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIEhlbWlzcGhlcmU6IDQsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOeykuWtkOS7juWPkeWwhOWZqOeahOWTquS4qumDqOS9jeWPkeWwhOOAglxyXG4gKiBAZW51bSBzaGFwZU1vZHVsZS5FbWl0TG9jYXRpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCBFbWl0TG9jYXRpb24gPSBFbnVtKHtcclxuICAgIC8qKlxyXG4gICAgICog5Z+656GA5L2N572u5Y+R5bCE77yI5LuF5a+5IENpcmNsZSDnsbvlnovlj4ogQ29uZSDnsbvlnovnmoTnspLlrZDlj5HlsITlmajpgILnlKjvvInjgIJcclxuICAgICAqL1xyXG4gICAgQmFzZTogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi+ueahhuS9jee9ruWPkeWwhO+8iOS7heWvuSBCb3gg57G75Z6L5Y+KIENpcmNsZSDnsbvlnovnmoTnspLlrZDlj5HlsITlmajpgILnlKjvvInjgIJcclxuICAgICAqL1xyXG4gICAgRWRnZTogMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOihqOmdouS9jee9ruWPkeWwhO+8iOWvueaJgOacieexu+Wei+eahOeykuWtkOWPkeWwhOWZqOmDvemAgueUqO+8ieOAglxyXG4gICAgICovXHJcbiAgICBTaGVsbDogMixcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWGhemDqOS9jee9ruWPkeWwhO+8iOWvueaJgOacieexu+Wei+eahOeykuWtkOWPkeWwhOWZqOmDvemAgueUqO+8ieOAglxyXG4gICAgICovXHJcbiAgICBWb2x1bWU6IDMsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOeykuWtkOWcqOaJh+W9ouWMuuWfn+eahOWPkeWwhOaWueW8j+OAglxyXG4gKiBAZW51bSBzaGFwZU1vZHVsZS5BcmNNb2RlXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQXJjTW9kZSA9IEVudW0oe1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmo/mnLrkvY3nva7lj5HlsITjgIJcclxuICAgICAqL1xyXG4gICAgUmFuZG9tOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rK/5p+Q5LiA5pa55ZCR5b6q546v5Y+R5bCE77yM5q+P5qyh5b6q546v5pa55ZCR55u45ZCM44CCXHJcbiAgICAgKi9cclxuICAgIExvb3A6IDEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvqrnjq/lj5HlsITvvIzmr4/mrKHlvqrnjq/mlrnlkJHnm7jlj43jgIJcclxuICAgICAqL1xyXG4gICAgUGluZ1Bvbmc6IDIsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOmAieaLqeWmguS9leS4uueykuWtkOezu+e7n+eUn+aIkOi9qOi/ueOAglxyXG4gKiBAZW51bSB0cmFpbE1vZHVsZS5UcmFpbE1vZGVcclxuICovXHJcbmV4cG9ydCBjb25zdCBUcmFpbE1vZGUgPSBFbnVtKHtcclxuICAgIC8qKlxyXG4gICAgICog57KS5a2Q5qih5byPPGJnPuOAglxyXG4gICAgICog5Yib5bu65LiA56eN5pWI5p6c77yM5YW25Lit5q+P5Liq57KS5a2Q5Zyo5YW26Lev5b6E5Lit55WZ5LiL5Zu65a6a55qE6L2o6L+544CCXHJcbiAgICAgKi9cclxuICAgIFBhcnRpY2xlczogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW4puaooeW8jzxiZz7jgIJcclxuICAgICAqIOagueaNruWFtueUn+WRveWRqOacn+WIm+W7uui/nuaOpeavj+S4queykuWtkOeahOi9qOi/ueW4puOAglxyXG4gICAgICovXHJcbiAgICAvLyBSaWJib246IDEsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOe6ueeQhuWhq+WFheaooeW8j+OAglxyXG4gKiBAZW51bSB0cmFpbE1vZHVsZS5UZXh0dXJlTW9kZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFRleHR1cmVNb2RlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIOaLieS8uOWhq+WFhee6ueeQhuOAglxyXG4gICAgICovXHJcbiAgICBTdHJldGNoOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN5aSN5aGr5YWF57q555CG44CCXHJcbiAgICAgKi9cclxuICAgIC8vIFJlcGVhdDogMSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgTW9kdWxlUmFuZFNlZWQgPSB7XHJcbiAgICBMSU1JVDogMjM1NDEsXHJcbiAgICBTSVpFOiAzOTgyNSxcclxuICAgIFRFWFRVUkU6IDkwNzk0LFxyXG4gICAgQ09MT1I6IDkxMDQxLFxyXG4gICAgRk9SQ0U6IDIxMjE2NSxcclxuICAgIFJPVEFUSU9OOiAxMjUyOTIsXHJcbiAgICBWRUxPQ0lUWV9YOiAxOTc4NjYsXHJcbiAgICBWRUxPQ0lUWV9ZOiAxNTY0OTcsXHJcbiAgICBWRUxPQ0lUWV9aOiA5ODQxMzZcclxufVxyXG4iXX0=