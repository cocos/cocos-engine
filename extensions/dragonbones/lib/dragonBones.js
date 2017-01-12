var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dragonBones;
(function (dragonBones) {
    /**
     * DragonBones
     */
    var DragonBones = (function () {
        function DragonBones() {
        }
        /**
         * @internal
         * @private
         */
        DragonBones.hasArmature = function (value) {
            return DragonBones._armatures.indexOf(value) >= 0;
        };
        /**
         * @internal
         * @private
         */
        DragonBones.addArmature = function (value) {
            if (value && DragonBones._armatures.indexOf(value) < 0) {
                DragonBones._armatures.push(value);
            }
        };
        /**
         * @internal
         * @private
         */
        DragonBones.removeArmature = function (value) {
            if (value) {
                var index = DragonBones._armatures.indexOf(value);
                if (index >= 0) {
                    DragonBones._armatures.splice(index, 1);
                }
            }
        };
        /**
         * @private
         */
        DragonBones.PI_D = Math.PI * 2;
        /**
         * @private
         */
        DragonBones.PI_H = Math.PI / 2;
        /**
         * @private
         */
        DragonBones.PI_Q = Math.PI / 4;
        /**
         * @private
         */
        DragonBones.ANGLE_TO_RADIAN = Math.PI / 180;
        /**
         * @private
         */
        DragonBones.RADIAN_TO_ANGLE = 180 / Math.PI;
        /**
         * @private
         */
        DragonBones.SECOND_TO_MILLISECOND = 1000;
        /**
         * @internal
         * @private
         */
        DragonBones.NO_TWEEN = 100;
        DragonBones.VERSION = "4.7.2";
        /**
         * @private
         */
        DragonBones.debug = false;
        /**
         * @private
         */
        DragonBones.debugDraw = false;
        /**
         * @internal
         * @private
         */
        DragonBones._armatures = [];
        return DragonBones;
    }());
    dragonBones.DragonBones = DragonBones;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    var BaseObject = (function () {
        /**
         * @internal
         * @private
         */
        function BaseObject() {
            /**
             * @language zh_CN
             * 对象的唯一标识。
             * @version DragonBones 4.5
             */
            this.hashCode = BaseObject._hashCode++;
        }
        BaseObject._returnObject = function (object) {
            var classType = String(object.constructor);
            var maxCount = BaseObject._maxCountMap[classType] == null ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
            var pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
            if (pool.length < maxCount) {
                if (pool.indexOf(object) < 0) {
                    pool.push(object);
                }
                else {
                    throw new Error();
                }
            }
        };
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        BaseObject.setMaxCount = function (objectConstructor, maxCount) {
            if (maxCount < 0 || maxCount != maxCount) {
                maxCount = 0;
            }
            if (objectConstructor) {
                var classType = String(objectConstructor);
                BaseObject._maxCountMap[classType] = maxCount;
                var pool = BaseObject._poolsMap[classType];
                if (pool && pool.length > maxCount) {
                    pool.length = maxCount;
                }
            }
            else {
                BaseObject._defaultMaxCount = maxCount;
                for (var classType in BaseObject._poolsMap) {
                    if (BaseObject._maxCountMap[classType] == null) {
                        continue;
                    }
                    BaseObject._maxCountMap[classType] = maxCount;
                    var pool = BaseObject._poolsMap[classType];
                    if (pool.length > maxCount) {
                        pool.length = maxCount;
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         */
        BaseObject.clearPool = function (objectConstructor) {
            if (objectConstructor === void 0) { objectConstructor = null; }
            if (objectConstructor) {
                var pool = BaseObject._poolsMap[String(objectConstructor)];
                if (pool && pool.length) {
                    pool.length = 0;
                }
            }
            else {
                for (var iP in BaseObject._poolsMap) {
                    var pool = BaseObject._poolsMap[iP];
                    pool.length = 0;
                }
            }
        };
        /**
         * @language zh_CN
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         */
        BaseObject.borrowObject = function (objectConstructor) {
            var pool = BaseObject._poolsMap[String(objectConstructor)];
            if (pool && pool.length) {
                return pool.pop();
            }
            else {
                var object = new objectConstructor();
                object._onClear();
                return object;
            }
        };
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        BaseObject.prototype.returnToPool = function () {
            this._onClear();
            BaseObject._returnObject(this);
        };
        BaseObject._hashCode = 0;
        BaseObject._defaultMaxCount = 5000;
        BaseObject._maxCountMap = {};
        BaseObject._poolsMap = {};
        return BaseObject;
    }());
    dragonBones.BaseObject = BaseObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ColorTransform = (function () {
        function ColorTransform(alphaMultiplier, redMultiplier, greenMultiplier, blueMultiplier, alphaOffset, redOffset, greenOffset, blueOffset) {
            if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
            if (redMultiplier === void 0) { redMultiplier = 1; }
            if (greenMultiplier === void 0) { greenMultiplier = 1; }
            if (blueMultiplier === void 0) { blueMultiplier = 1; }
            if (alphaOffset === void 0) { alphaOffset = 0; }
            if (redOffset === void 0) { redOffset = 0; }
            if (greenOffset === void 0) { greenOffset = 0; }
            if (blueOffset === void 0) { blueOffset = 0; }
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }
        ColorTransform.prototype.copyFrom = function (value) {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.blueOffset;
        };
        ColorTransform.prototype.identity = function () {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        };
        return ColorTransform;
    }());
    dragonBones.ColorTransform = ColorTransform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
        };
        Point.prototype.clear = function () {
            this.x = this.y = 0;
        };
        return Point;
    }());
    dragonBones.Point = Point;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        /**
         * @private
         */
        Matrix.prototype.toString = function () {
            return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
        };
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.copyFrom = function (value) {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
        };
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = 0;
            this.tx = this.ty = 0;
        };
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.concat = function (value) {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var aB = value.a;
            var bB = value.b;
            var cB = value.c;
            var dB = value.d;
            var txB = value.tx;
            var tyB = value.ty;
            this.a = aA * aB + bA * cB;
            this.b = aA * bB + bA * dB;
            this.c = cA * aB + dA * cB;
            this.d = cA * bB + dA * dB;
            this.tx = aB * txA + cB * tyA + txB;
            this.ty = dB * tyA + bB * txA + tyB;
            /*
            [
                this.a,
                this.b,
                this.c,
                this.d,
                this.tx,
                this.ty
            ] = [
                this.a * value.a + this.b * value.c,
                this.a * value.b + this.b * value.d,
                this.c * value.a + this.d * value.c,
                this.c * value.b + this.d * value.d,
                value.a * this.tx + value.c * this.tx + value.tx,
                value.d * this.ty + value.b * this.ty + value.ty
            ];
            */
        };
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.invert = function () {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            var n = aA * dA - bA * cA;
            this.a = dA / n;
            this.b = -bA / n;
            this.c = -cA / n;
            this.d = aA / n;
            this.tx = (cA * tyA - dA * txA) / n;
            this.ty = -(aA * tyA - bA * txA) / n;
        };
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        Matrix.prototype.transformPoint = function (x, y, result, delta) {
            if (delta === void 0) { delta = false; }
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;
            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        };
        return Matrix;
    }());
    dragonBones.Matrix = Matrix;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        };
        Rectangle.prototype.clear = function () {
            this.x = this.y = 0;
            this.width = this.height = 0;
        };
        return Rectangle;
    }());
    dragonBones.Rectangle = Rectangle;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    var Transform = (function () {
        /**
         * @private
         */
        function Transform(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            scaleY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (skewX === void 0) { skewX = 0; }
            if (skewY === void 0) { skewY = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            this.x = x;
            this.y = y;
            this.skewX = skewX;
            this.skewY = skewY;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        /**
         * @private
         */
        Transform.normalizeRadian = function (value) {
            value = (value + Math.PI) % (Math.PI * 2);
            value += value > 0 ? -Math.PI : Math.PI;
            return value;
        };
        /**
         * @private
         */
        Transform.prototype.toString = function () {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180 / Math.PI + " skewY:" + this.skewY * 180 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        };
        /**
         * @private
         */
        Transform.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.skewX = value.skewX;
            this.skewY = value.skewY;
            this.scaleX = value.scaleX;
            this.scaleY = value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.identity = function () {
            this.x = this.y = this.skewX = this.skewY = 0;
            this.scaleX = this.scaleY = 1;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.add = function (value) {
            this.x += value.x;
            this.y += value.y;
            this.skewX += value.skewX;
            this.skewY += value.skewY;
            this.scaleX *= value.scaleX;
            this.scaleY *= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.minus = function (value) {
            this.x -= value.x;
            this.y -= value.y;
            this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
            this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
            this.scaleX /= value.scaleX;
            this.scaleY /= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.fromMatrix = function (matrix) {
            var PI_Q = Math.PI * 0.25;
            var backupScaleX = this.scaleX, backupScaleY = this.scaleY;
            this.x = matrix.tx;
            this.y = matrix.ty;
            this.skewX = Math.atan(-matrix.c / matrix.d);
            this.skewY = Math.atan(matrix.b / matrix.a);
            if (this.skewX != this.skewX)
                this.skewX = 0;
            if (this.skewY != this.skewY)
                this.skewY = 0;
            this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / Math.cos(this.skewX) : -matrix.c / Math.sin(this.skewX);
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);
            if (backupScaleX >= 0 && this.scaleX < 0) {
                this.scaleX = -this.scaleX;
                this.skewY = this.skewY - Math.PI;
            }
            if (backupScaleY >= 0 && this.scaleY < 0) {
                this.scaleY = -this.scaleY;
                this.skewX = this.skewX - Math.PI;
            }
            return this;
        };
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        Transform.prototype.toMatrix = function (matrix) {
            matrix.a = this.scaleX * Math.cos(this.skewY);
            matrix.b = this.scaleX * Math.sin(this.skewY);
            matrix.c = -this.scaleY * Math.sin(this.skewX);
            matrix.d = this.scaleY * Math.cos(this.skewX);
            matrix.tx = this.x;
            matrix.ty = this.y;
            return this;
        };
        Object.defineProperty(Transform.prototype, "rotation", {
            /**
             * @language zh_CN
             * 旋转。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this.skewY;
            },
            set: function (value) {
                var dValue = value - this.skewY;
                this.skewX += dValue;
                this.skewY += dValue;
            },
            enumerable: true,
            configurable: true
        });
        return Transform;
    }());
    dragonBones.Transform = Transform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     * @private
     */
    var TimelineState = (function (_super) {
        __extends(TimelineState, _super);
        function TimelineState() {
            _super.call(this);
        }
        /**
         * @inheritDoc
         */
        TimelineState.prototype._onClear = function () {
            this._isCompleted = false;
            this._currentPlayTimes = 0;
            this._currentTime = -1;
            this._timeline = null;
            this._isReverse = false;
            this._hasAsynchronyTimeline = false;
            this._frameRate = 0;
            this._keyFrameCount = 0;
            this._frameCount = 0;
            this._position = 0;
            this._duration = 0;
            this._animationDutation = 0;
            this._timeScale = 1;
            this._timeOffset = 0;
            this._currentFrame = null;
            this._armature = null;
            this._animationState = null;
        };
        TimelineState.prototype._onUpdateFrame = function (isUpdate) { };
        TimelineState.prototype._onArriveAtFrame = function (isUpdate) { };
        TimelineState.prototype._setCurrentTime = function (value) {
            var self = this;
            var currentPlayTimes = 0;
            if (self._keyFrameCount == 1 && this != self._animationState._timeline) {
                self._isCompleted = self._animationState._fadeState >= 0; // 
                currentPlayTimes = 1;
            }
            else if (self._hasAsynchronyTimeline) {
                var playTimes = self._animationState.playTimes;
                var totalTime = playTimes * self._duration;
                value *= self._timeScale;
                if (self._timeOffset != 0) {
                    value += self._timeOffset * self._animationDutation;
                }
                if (playTimes > 0 && (value >= totalTime || value <= -totalTime)) {
                    self._isCompleted = true;
                    currentPlayTimes = playTimes;
                    if (value < 0) {
                        value = 0;
                    }
                    else {
                        value = self._duration;
                    }
                }
                else {
                    self._isCompleted = false;
                    if (value < 0) {
                        currentPlayTimes = Math.floor(-value / self._duration);
                        value = self._duration - (-value % self._duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(value / self._duration);
                        value %= self._duration;
                    }
                    if (playTimes > 0 && currentPlayTimes > playTimes) {
                        currentPlayTimes = playTimes;
                    }
                }
                value += self._position;
            }
            else {
                self._isCompleted = self._animationState._timeline._isCompleted;
                currentPlayTimes = self._animationState._timeline._currentPlayTimes;
            }
            if (self._currentTime == value) {
                return false;
            }
            self._isReverse = self._currentTime > value && self._currentPlayTimes == currentPlayTimes;
            self._currentTime = value;
            self._currentPlayTimes = currentPlayTimes;
            if (self._animationState._onFadeInComplete) {
                self._currentFrame = null;
            }
            return true;
        };
        TimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            this._armature = armature;
            this._animationState = animationState;
            this._timeline = timelineData;
            var isMainTimeline = this == this._animationState._timeline;
            this._hasAsynchronyTimeline = isMainTimeline || this._animationState.animationData.hasAsynchronyTimeline;
            this._frameRate = this._armature.armatureData.frameRate;
            this._keyFrameCount = this._timeline.frames.length;
            this._frameCount = this._animationState.animationData.frameCount;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._animationDutation = this._animationState.animationData.duration;
            this._timeScale = isMainTimeline ? 1 : (1 / this._timeline.scale);
            this._timeOffset = isMainTimeline ? 0 : this._timeline.offset;
        };
        TimelineState.prototype.fadeOut = function () { };
        TimelineState.prototype.update = function (time) {
            var self = this;
            if (!self._isCompleted && self._setCurrentTime(time)) {
                var currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                var currentFrame = self._timeline.frames[currentFrameIndex];
                if (self._currentFrame != currentFrame) {
                    self._currentFrame = currentFrame;
                    self._onArriveAtFrame(true);
                }
                self._onUpdateFrame(true);
            }
        };
        return TimelineState;
    }(dragonBones.BaseObject));
    dragonBones.TimelineState = TimelineState;
    /**
     * @internal
     * @private
     */
    var TweenTimelineState = (function (_super) {
        __extends(TweenTimelineState, _super);
        function TweenTimelineState() {
            _super.call(this);
        }
        TweenTimelineState._getEasingValue = function (progress, easing) {
            if (progress <= 0) {
                return 0;
            }
            else if (progress >= 1) {
                return 1;
            }
            var value = 1;
            if (easing > 2) {
                return progress;
            }
            else if (easing > 1) {
                value = 0.5 * (1 - Math.cos(progress * Math.PI));
                easing -= 1;
            }
            else if (easing > 0) {
                value = 1 - Math.pow(1 - progress, 2);
            }
            else if (easing >= -1) {
                easing *= -1;
                value = Math.pow(progress, 2);
            }
            else if (easing >= -2) {
                easing *= -1;
                value = Math.acos(1 - progress * 2) / Math.PI;
                easing -= 1;
            }
            else {
                return progress;
            }
            return (value - progress) * easing + progress;
        };
        TweenTimelineState._getEasingCurveValue = function (progress, samples) {
            if (progress <= 0) {
                return 0;
            }
            else if (progress >= 1) {
                return 1;
            }
            var segmentCount = samples.length + 1; // + 2 - 1
            var valueIndex = Math.floor(progress * segmentCount);
            var fromValue = valueIndex == 0 ? 0 : samples[valueIndex - 1];
            var toValue = (valueIndex == segmentCount - 1) ? 1 : samples[valueIndex];
            return fromValue + (toValue - fromValue) * (progress - valueIndex / segmentCount);
        };
        /**
         * @inheritDoc
         */
        TweenTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._tweenProgress = 0;
            this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
            this._curve = null;
        };
        TweenTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this;
            self._tweenEasing = self._currentFrame.tweenEasing;
            self._curve = self._currentFrame.curve;
            if (self._keyFrameCount <= 1 ||
                (self._currentFrame.next == self._timeline.frames[0] &&
                    (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve) &&
                    self._animationState.playTimes > 0 &&
                    self._animationState.currentPlayTimes == self._animationState.playTimes - 1)) {
                self._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                self._curve = null;
            }
        };
        TweenTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            var self = this;
            if (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN) {
                self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
                if (self._tweenEasing != 0) {
                    self._tweenProgress = TweenTimelineState._getEasingValue(self._tweenProgress, self._tweenEasing);
                }
            }
            else if (self._curve) {
                self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
                self._tweenProgress = TweenTimelineState._getEasingCurveValue(self._tweenProgress, self._curve);
            }
            else {
                self._tweenProgress = 0;
            }
        };
        TweenTimelineState.prototype._updateExtensionKeyFrame = function (current, next, result) {
            var tweenType = 0 /* None */;
            if (current.type == next.type) {
                for (var i = 0, l = current.tweens.length; i < l; ++i) {
                    var tweenDuration = next.tweens[i] - current.tweens[i];
                    result.tweens[i] = tweenDuration;
                    if (tweenDuration > 0) {
                        tweenType = 2 /* Always */;
                    }
                }
            }
            if (tweenType == 0 /* None */) {
                if (result.type != current.type) {
                    tweenType = 1 /* Once */;
                    result.type = current.type;
                }
                if (result.tweens.length != current.tweens.length) {
                    tweenType = 1 /* Once */;
                    result.tweens.length = current.tweens.length;
                }
                if (result.keys.length != current.keys.length) {
                    tweenType = 1 /* Once */;
                    result.keys.length = current.keys.length;
                }
                for (var i = 0, l = current.keys.length; i < l; ++i) {
                    var key = current.keys[i];
                    if (result.keys[i] != key) {
                        tweenType = 1 /* Once */;
                        result.keys[i] = key;
                    }
                }
            }
            return tweenType;
        };
        return TweenTimelineState;
    }(TimelineState));
    dragonBones.TweenTimelineState = TweenTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    var Animation = (function (_super) {
        __extends(Animation, _super);
        /**
         * @internal
         * @private
         */
        function Animation() {
            _super.call(this);
            this._animations = {};
            this._animationNames = [];
            this._animationStates = [];
        }
        /**
         * @private
         */
        Animation._sortAnimationState = function (a, b) {
            return a.layer > b.layer ? -1 : 1;
        };
        /**
         * @private
         */
        Animation.toString = function () {
            return "[class dragonBones.Animation]";
        };
        /**
         * @inheritDoc
         */
        Animation.prototype._onClear = function () {
            for (var i in this._animations) {
                delete this._animations[i];
            }
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            this.timeScale = 1;
            this._animationStateDirty = false;
            this._armature = null;
            this._isPlaying = false;
            this._time = 0;
            this._duration = 0;
            this._lastAnimationState = null;
            this._animationNames.length = 0;
            this._animationStates.length = 0;
        };
        Animation.prototype._fadeOut = function (fadeOutTime, layer, group, fadeOutMode, pauseFadeOut) {
            var i = 0, l = this._animationStates.length;
            var animationState = null;
            switch (fadeOutMode) {
                case 1 /* SameLayer */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
                case 2 /* SameGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
                case 4 /* All */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (fadeOutTime == 0) {
                            animationState.returnToPool();
                        }
                        else {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    if (fadeOutTime == 0) {
                        this._animationStates.length = 0;
                    }
                    break;
                case 3 /* SameLayerAndGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer == layer && animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
                case 0 /* None */:
                default:
                    break;
            }
        };
        /**
         * @internal
         * @private
         */
        Animation.prototype._updateFFDTimelineStates = function () {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i]._updateFFDTimelineStates();
            }
        };
        /**
         * @internal
         * @private
         */
        Animation.prototype._advanceTime = function (passedTime) {
            var self = this;
            if (!self._isPlaying) {
                return;
            }
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            var animationStateCount = self._animationStates.length;
            if (animationStateCount == 1) {
                var animationState = self._animationStates[0];
                if (animationState._fadeState > 0 && animationState._fadeProgress <= 0) {
                    animationState.returnToPool();
                    self._animationStates.length = 0;
                    self._animationStateDirty = true;
                    self._lastAnimationState = null;
                }
                else {
                    animationState._advanceTime(passedTime, 1, 0);
                }
            }
            else if (animationStateCount > 1) {
                var prevLayer = self._animationStates[0]._layer;
                var weightLeft = 1;
                var layerTotalWeight = 0;
                var animationIndex = 1; // If has multiply animation state, first index is 1.
                for (var i = 0, r = 0; i < animationStateCount; ++i) {
                    var animationState = self._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._fadeProgress <= 0) {
                        r++;
                        animationState.returnToPool();
                        self._animationStateDirty = true;
                        if (self._lastAnimationState == animationState) {
                            if (i - r >= 0) {
                                self._lastAnimationState = self._animationStates[i - r];
                            }
                            else {
                                self._lastAnimationState = null;
                            }
                        }
                    }
                    else {
                        if (r > 0) {
                            self._animationStates[i - r] = animationState;
                        }
                        if (prevLayer != animationState._layer) {
                            prevLayer = animationState._layer;
                            if (layerTotalWeight >= weightLeft) {
                                weightLeft = 0;
                            }
                            else {
                                weightLeft -= layerTotalWeight;
                            }
                            layerTotalWeight = 0;
                        }
                        animationState._advanceTime(passedTime, weightLeft, animationIndex);
                        if (animationState._weightResult > 0) {
                            layerTotalWeight += animationState._weightResult;
                            animationIndex++;
                        }
                    }
                    if (i == animationStateCount - 1 && r > 0) {
                        self._animationStates.length -= r;
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 清除所有正在播放的动画状态。
         * @version DragonBones 4.5
         */
        Animation.prototype.reset = function () {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            this._isPlaying = false;
            this._lastAnimationState = null;
            this._animationStates.length = 0;
        };
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.stop = function (animationName) {
            if (animationName === void 0) { animationName = null; }
            if (animationName) {
                var animationState = this.getState(animationName);
                if (animationState) {
                    animationState.stop();
                }
            }
            else {
                this._isPlaying = false;
            }
        };
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据的名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.play = function (animationName, playTimes) {
            if (animationName === void 0) { animationName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            var animationState = null;
            if (animationName) {
                animationState = this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
            }
            else if (!this._lastAnimationState) {
                var defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    animationState = this.fadeIn(defaultAnimation.name, 0, playTimes, 0, null, 4 /* All */);
                }
            }
            else if (!this._isPlaying || (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)) {
                this._isPlaying = true;
                this._lastAnimationState.play();
            }
            else {
                animationState = this.fadeIn(this._lastAnimationState.name, 0, playTimes, 0, null, 4 /* All */);
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 淡入播放指定名称的动画。
         * @param animationName 动画数据的名称。
         * @param playTimes 循环播放的次数。 [-1: 使用数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入的时间。 [-1: 使用数据默认值, [0~N]: N 秒淡入完毕] (以秒为单位)
         * @param layer 混合的图层，图层高会优先获取混合权重。
         * @param group 混合的组，用于给动画状态编组，方便混合淡出控制。
         * @param fadeOutMode 淡出的模式。
         * @param additiveBlending 以叠加的形式混合。
         * @param displayControl 是否对显示对象属性可控。
         * @param pauseFadeOut 暂停需要淡出的动画。
         * @param pauseFadeIn 暂停需要淡入的动画，直到淡入结束才开始播放。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.fadeIn = function (animationName, fadeInTime, playTimes, layer, group, fadeOutMode, additiveBlending, displayControl, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            if (additiveBlending === void 0) { additiveBlending = false; }
            if (displayControl === void 0) { displayControl = true; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            var animationData = this._animations[animationName];
            if (!animationData) {
                this._time = 0;
                this._duration = 0;
                console.warn("Non-existent animation.", "DragonBones: " + this._armature.armatureData.parent.name, "Armature: " + this._armature.name, "Animation: " + animationName);
                return null;
            }
            this._isPlaying = true;
            if (this._time != this._time) {
                this._time = 0;
            }
            if (this._duration != this._duration) {
                this._duration = 0;
            }
            if (fadeInTime != fadeInTime || fadeInTime < 0) {
                if (this._lastAnimationState) {
                    fadeInTime = animationData.fadeInTime;
                }
                else {
                    fadeInTime = 0;
                }
            }
            if (playTimes < 0) {
                playTimes = animationData.playTimes;
            }
            this._fadeOut(fadeInTime, layer, group, fadeOutMode, pauseFadeOut);
            var time = this._duration > 0 ? 0 : this._time;
            var position = this._duration > 0 ? this._time : animationData.position;
            var duration = this._duration > 0 ? this._duration : animationData.duration;
            this._lastAnimationState = dragonBones.BaseObject.borrowObject(dragonBones.AnimationState);
            this._lastAnimationState._layer = layer;
            this._lastAnimationState._group = group;
            this._lastAnimationState.additiveBlending = additiveBlending;
            this._lastAnimationState.displayControl = displayControl;
            this._lastAnimationState._fadeIn(this._armature, animationData.animation || animationData, animationName, playTimes, position, duration, time, 1 / animationData.scale, fadeInTime, pauseFadeIn);
            this._animationStates.push(this._lastAnimationState);
            this._animationStateDirty = true;
            this._time = 0;
            this._duration = 0;
            this._armature._cacheFrameIndex = -1;
            if (this._animationStates.length > 1) {
                this._animationStates.sort(Animation._sortAnimationState);
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.inheritAnimation) {
                    var childArmature = slot.childArmature;
                    if (childArmature &&
                        childArmature.animation.hasAnimation(animationName) &&
                        !childArmature.animation.getState(animationName)) {
                        childArmature.animation.fadeIn(animationName);
                    }
                }
            }
            if (fadeInTime <= 0) {
                this._armature.advanceTime(0); // Blend animation state, update armature. (pass actions and events) 
            }
            return this._lastAnimationState;
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定时间开始播放。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @param playTimes 动画循环播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toTime 播放到指定的时间，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByTime = function (animationName, time, playTimes, toTime) {
            if (time === void 0) { time = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            if (toTime === void 0) { toTime = 0; }
            var animationData = this._animations[animationName];
            if (animationData) {
                this._time = time;
                this._duration = toTime - time;
                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定帧开始播放。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toFrame 播放到指定的帧，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByFrame = function (animationName, frame, playTimes, toFrame) {
            if (frame === void 0) { frame = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            if (toFrame === void 0) { toFrame = 0; }
            var animationData = this._animations[animationName];
            if (animationData) {
                this._time = animationData.duration * frame / animationData.frameCount;
                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 指定名称的动画从指定进度开始播放。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param toProgress 播放到指定的进度，如果未设置则播放整个动画。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByProgress = function (animationName, progress, playTimes, toProgress) {
            if (progress === void 0) { progress = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            if (toProgress === void 0) { toProgress = 0; }
            var animationData = this._animations[animationName];
            if (animationData) {
                this._time = animationData.duration * (progress > 0 ? progress : 0);
                if (this._duration < 0) {
                    this._duration = 0;
                }
                else if (this._duration > animationData.duration - this._time) {
                    this._duration = animationData.duration - this._time;
                }
            }
            return this.fadeIn(animationName, 0, playTimes, 0, null, 4 /* All */);
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的时间并停止。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByTime = function (animationName, time) {
            if (time === void 0) { time = 0; }
            var animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的帧并停止。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByFrame = function (animationName, frame) {
            if (frame === void 0) { frame = 0; }
            var animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的进度并停止。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByProgress = function (animationName, progress) {
            if (progress === void 0) { progress = 0; }
            var animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.getState = function (animationName) {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                var animationState = this._animationStates[i];
                if (animationState.name == animationName) {
                    return animationState;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 是否包含指定名称的动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        Animation.prototype.hasAnimation = function (animationName) {
            return this._animations[animationName] != null;
        };
        Object.defineProperty(Animation.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 动画是否处于播放状态。
             * @version DragonBones 3.0
             */
            get: function () {
                if (this._animationStates.length > 1) {
                    return this._isPlaying && !this.isCompleted;
                }
                else if (this._lastAnimationState) {
                    return this._isPlaying && this._lastAnimationState.isPlaying;
                }
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 所有动画状态是否均已播放完毕。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                if (this._lastAnimationState) {
                    if (!this._lastAnimationState.isCompleted) {
                        return false;
                    }
                    for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                        if (!this._animationStates[i].isCompleted) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationName", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态的名称。
             * @see #lastAnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState ? this._lastAnimationState.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationState", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationNames", {
            /**
             * @language zh_CN
             * 所有动画数据名称。
             * @see #animations
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animations", {
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animations;
            },
            set: function (value) {
                if (this._animations == value) {
                    return;
                }
                for (var i in this._animations) {
                    delete this._animations[i];
                }
                this._animationNames.length = 0;
                if (value) {
                    for (var i in value) {
                        this._animations[i] = value[i];
                        this._animationNames.push(i);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        Animation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes, layer, group, fadeOutMode, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (duration === void 0) { duration = -1; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            var animationState = this.fadeIn(animationName, fadeInTime, playTimes, layer, group, fadeOutMode, false, true, pauseFadeOut, pauseFadeIn);
            if (animationState && duration && duration > 0) {
                animationState.timeScale = animationState.totalTime / duration;
            }
            return animationState;
        };
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        Animation.prototype.gotoAndStop = function (animationName, time) {
            if (time === void 0) { time = 0; }
            return this.gotoAndStopByTime(animationName, time);
        };
        Object.defineProperty(Animation.prototype, "animationList", {
            /**
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationDataList", {
            /**
             * @language zh_CN
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                var list = [];
                for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                    list.push(this._animations[this._animationNames[i]]);
                }
                return list;
            },
            enumerable: true,
            configurable: true
        });
        return Animation;
    }(dragonBones.BaseObject));
    dragonBones.Animation = Animation;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    var AnimationState = (function (_super) {
        __extends(AnimationState, _super);
        /**
         * @internal
         * @private
         */
        function AnimationState() {
            _super.call(this);
            /**
             * @private
             */
            this._boneMask = [];
            /**
             * @private
             */
            this._boneTimelines = [];
            /**
             * @private
             */
            this._slotTimelines = [];
            /**
             * @private
             */
            this._ffdTimelines = [];
            /**
             * @deprecated
             */
            this.autoTween = false;
        }
        /**
         * @private
         */
        AnimationState.toString = function () {
            return "[class dragonBones.AnimationState]";
        };
        /**
         * @inheritDoc
         */
        AnimationState.prototype._onClear = function () {
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].returnToPool();
            }
            if (this._timeline) {
                this._timeline.returnToPool();
            }
            if (this._zOrderTimeline) {
                this._zOrderTimeline.returnToPool();
            }
            this.displayControl = true;
            this.additiveBlending = false;
            this.actionEnabled = false;
            this.playTimes = 1;
            this.timeScale = 1;
            this.weight = 1;
            this.autoFadeOutTime = -1;
            this.fadeTotalTime = 0;
            this._onFadeInComplete = false;
            this._fadeState = 0;
            this._layer = 0;
            this._position = 0;
            this._duration = 0;
            this._weightResult = 0;
            this._fadeProgress = 0;
            this._group = null;
            this._timeline = null;
            this._isPlaying = true;
            this._isPausePlayhead = false;
            this._fadeTime = 0;
            this._time = 0;
            this._name = null;
            this._armature = null;
            this._animationData = null;
            this._zOrderTimeline = null;
            this._boneMask.length = 0;
            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._ffdTimelines.length = 0;
        };
        AnimationState.prototype._updateTimelineStates = function () {
            var time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }
            var boneTimelineStates = {};
            var slotTimelineStates = {};
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                var boneTimelineState = this._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneTimelineName = bone.name;
                var boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);
                if (boneTimelineData && this.containsBoneMask(boneTimelineName)) {
                    var boneTimelineState = boneTimelineStates[boneTimelineName];
                    if (boneTimelineState) {
                        delete boneTimelineStates[boneTimelineName];
                    }
                    else {
                        boneTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState.fadeIn(this._armature, this, boneTimelineData, time);
                        this._boneTimelines.push(boneTimelineState);
                    }
                }
            }
            for (var i in boneTimelineStates) {
                var boneTimelineState = boneTimelineStates[i];
                boneTimelineState.bone.invalidUpdate(); //
                this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                var slotTimelineState = this._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                var slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);
                if (slotTimelineData && this.containsBoneMask(parentTimelineName) && this._fadeState <= 0) {
                    var slotTimelineState = slotTimelineStates[slotTimelineName];
                    if (slotTimelineState) {
                        delete slotTimelineStates[slotTimelineName];
                    }
                    else {
                        slotTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState.fadeIn(this._armature, this, slotTimelineData, time);
                        this._slotTimelines.push(slotTimelineState);
                    }
                }
            }
            for (var i in slotTimelineStates) {
                var slotTimelineState = slotTimelineStates[i];
                this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }
            this._updateFFDTimelineStates();
        };
        AnimationState.prototype._advanceFadeTime = function (passedTime) {
            var self = this;
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            self._fadeTime += passedTime;
            var fadeProgress = 0;
            if (self._fadeTime >= self.fadeTotalTime) {
                fadeProgress = self._fadeState > 0 ? 0 : 1;
            }
            else if (self._fadeTime > 0) {
                fadeProgress = self._fadeState > 0 ? (1 - self._fadeTime / self.fadeTotalTime) : (self._fadeTime / self.fadeTotalTime);
            }
            else {
                fadeProgress = self._fadeState > 0 ? 1 : 0;
            }
            if (self._fadeProgress != fadeProgress) {
                self._fadeProgress = fadeProgress;
                var eventDispatcher = self._armature._display;
                if (self._fadeTime <= passedTime) {
                    if (self._fadeState > 0) {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT)) {
                            var event_1 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_1.animationState = this;
                            self._armature._bufferEvent(event_1, dragonBones.EventObject.FADE_OUT);
                        }
                    }
                    else {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN)) {
                            var event_2 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_2.animationState = this;
                            self._armature._bufferEvent(event_2, dragonBones.EventObject.FADE_IN);
                        }
                    }
                }
                if (self._fadeTime >= self.fadeTotalTime) {
                    if (self._fadeState > 0) {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT_COMPLETE)) {
                            var event_3 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_3.animationState = this;
                            self._armature._bufferEvent(event_3, dragonBones.EventObject.FADE_OUT_COMPLETE);
                        }
                    }
                    else {
                        self._onFadeInComplete = true;
                        self._isPausePlayhead = false;
                        self._fadeState = 0;
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN_COMPLETE)) {
                            var event_4 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_4.animationState = this;
                            self._armature._bufferEvent(event_4, dragonBones.EventObject.FADE_IN_COMPLETE);
                        }
                    }
                }
            }
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._isDisabled = function (slot) {
            if (this.displayControl &&
                (!slot.displayController ||
                    slot.displayController == this._name ||
                    slot.displayController == this._group)) {
                return false;
            }
            return true;
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._fadeIn = function (armature, clip, animationName, playTimes, position, duration, time, timeScale, fadeInTime, pausePlayhead) {
            this._armature = armature;
            this._animationData = clip;
            this._name = animationName;
            this.actionEnabled = AnimationState.stateActionEnabled;
            this.playTimes = playTimes;
            this.timeScale = timeScale;
            this.fadeTotalTime = fadeInTime;
            this._fadeState = -1;
            this._position = position;
            this._duration = duration;
            this._time = time;
            this._isPausePlayhead = pausePlayhead;
            if (this.fadeTotalTime <= 0) {
                this._fadeProgress = 0.999999;
            }
            this._timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineState);
            this._timeline.fadeIn(this._armature, this, this._animationData, this._time);
            if (this._animationData.zOrderTimeline) {
                this._zOrderTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderTimelineState);
                this._zOrderTimeline.fadeIn(this._armature, this, this._animationData.zOrderTimeline, this._time);
            }
            this._updateTimelineStates();
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._updateFFDTimelineStates = function () {
            var time = this._time;
            if (!this._animationData.hasAsynchronyTimeline) {
                time = this._timeline._currentTime;
            }
            var ffdTimelineStates = {};
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                var ffdTimelineState = this._ffdTimelines[i];
                ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                var displayData = slot.displayData;
                if (!displayData) {
                    continue;
                }
                if (slot._meshData && slot._meshData == displayData.mesh) {
                    var ffdTimelineData = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName, !displayData.share ? displayData.name : (displayData.inheritAnimation ? displayData.share.name : displayData.name));
                    if (ffdTimelineData && this.containsBoneMask(parentTimelineName)) {
                        var ffdTimelineState = ffdTimelineStates[slotTimelineName];
                        if (ffdTimelineState && ffdTimelineState._timeline == ffdTimelineData) {
                            delete ffdTimelineStates[slotTimelineName];
                        }
                        else {
                            ffdTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(this._armature, this, ffdTimelineData, time);
                            this._ffdTimelines.push(ffdTimelineState);
                        }
                    }
                    else {
                        for (var iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }
                        slot._ffdDirty = true;
                    }
                }
            }
            for (var i in ffdTimelineStates) {
                var ffdTimelineState = ffdTimelineStates[i];
                //ffdTimelineState.slot._ffdDirty = true;
                this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._advanceTime = function (passedTime, weightLeft, index) {
            var self = this;
            // Update fade time. (Still need to be update even if the passedTime is zero)
            self._onFadeInComplete = false;
            if (self._fadeState != 0) {
                self._advanceFadeTime(passedTime);
            }
            // Update time.
            passedTime *= self.timeScale;
            if (passedTime != 0 && self._isPlaying && !self._isPausePlayhead) {
                self._time += passedTime;
            }
            // Blend weight.
            self._weightResult = self.weight * self._fadeProgress * weightLeft;
            if (self._weightResult != 0) {
                var cacheFrameRate = self._animationData.cacheFrameRate;
                var isCacheEnabled = self._fadeProgress >= 1 && index == 0 && cacheFrameRate > 0;
                var isUpdatesTimeline = true;
                var isUpdatesBoneTimeline = true;
                var time = cacheFrameRate * 2;
                time = isCacheEnabled ? (Math.floor(self._time * time) / time) : self._time; // Cache time internval.
                // Update main timeline.                
                self._timeline.update(time);
                if (!self._animationData.hasAsynchronyTimeline) {
                    time = self._timeline._currentTime;
                }
                if (self._zOrderTimeline) {
                    self._zOrderTimeline.update(time);
                }
                if (isCacheEnabled) {
                    var cacheFrameIndex = Math.floor(self._timeline._currentTime * cacheFrameRate); // uint
                    if (self._armature._cacheFrameIndex == cacheFrameIndex) {
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    }
                    else {
                        self._armature._cacheFrameIndex = cacheFrameIndex;
                        if (self._armature._animation._animationStateDirty) {
                            self._armature._animation._animationStateDirty = false;
                            for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                                var boneTimeline = self._boneTimelines[i];
                                boneTimeline.bone._cacheFrames = boneTimeline._timeline.cachedFrames;
                            }
                            for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                                var slotTimeline = self._slotTimelines[i];
                                slotTimeline.slot._cacheFrames = slotTimeline._timeline.cachedFrames;
                            }
                        }
                        if (self._animationData.cachedFrames[cacheFrameIndex]) {
                            isUpdatesBoneTimeline = false;
                        }
                        else {
                            self._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                }
                else {
                    self._armature._cacheFrameIndex = -1;
                }
                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                            self._boneTimelines[i].update(time);
                        }
                    }
                    for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                        self._slotTimelines[i].update(time);
                    }
                    for (var i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                        self._ffdTimelines[i].update(time);
                    }
                }
            }
            if (self.autoFadeOutTime >= 0 && self._fadeProgress >= 1 && self._timeline._isCompleted) {
                self.fadeOut(self.autoFadeOutTime);
            }
        };
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.play = function () {
            this._isPlaying = true;
        };
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.stop = function () {
            this._isPlaying = false;
        };
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        AnimationState.prototype.fadeOut = function (fadeOutTime, pausePlayhead) {
            if (pausePlayhead === void 0) { pausePlayhead = true; }
            if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
                fadeOutTime = 0;
            }
            this._isPausePlayhead = pausePlayhead;
            if (this._fadeState > 0) {
                if (fadeOutTime > fadeOutTime - this._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                if (fadeOutTime <= 0 || this._fadeProgress <= 0) {
                    this._fadeProgress = 0.000001; // Modify _fadeProgress to different value.
                }
                for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].fadeOut();
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].fadeOut();
                }
            }
            this.displayControl = false;
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0;
            this._fadeTime = this.fadeTotalTime * (1 - this._fadeProgress);
        };
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.containsBoneMask = function (name) {
            return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.addBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var currentBone = this._armature.getBone(name);
            if (!currentBone) {
                return;
            }
            if (this._boneMask.indexOf(name) < 0 &&
                this._animationData.getBoneTimeline(name)) {
                this._boneMask.push(name);
            }
            if (recursive) {
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneName = bone.name;
                    if (this._boneMask.indexOf(boneName) < 0 &&
                        this._animationData.getBoneTimeline(boneName) &&
                        currentBone.contains(bone)) {
                        this._boneMask.push(boneName);
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var index = this._boneMask.indexOf(name);
            if (index >= 0) {
                this._boneMask.splice(index, 1);
            }
            if (recursive) {
                var currentBone = this._armature.getBone(name);
                if (currentBone) {
                    var bones = this._armature.getBones();
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        var boneName = bone.name;
                        var index_1 = this._boneMask.indexOf(boneName);
                        if (index_1 >= 0 &&
                            currentBone.contains(bone)) {
                            this._boneMask.splice(index_1, 1);
                        }
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeAllBoneMask = function () {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        };
        Object.defineProperty(AnimationState.prototype, "layer", {
            /**
             * @language zh_CN
             * 动画图层。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "group", {
            /**
             * @language zh_CN
             * 动画组。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "name", {
            /**
             * @language zh_CN
             * 动画名称。
             * @see dragonBones.AnimationData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "animationData", {
            /**
             * @language zh_CN
             * 动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 是否播放完毕。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 是否正在播放。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._isPlaying && !this._timeline._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentPlayTimes", {
            /**
             * @language zh_CN
             * 当前动画的播放次数。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "totalTime", {
            /**
             * @language zh_CN
             * 当前动画的总时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentTime", {
            /**
             * @language zh_CN
             * 当前动画的播放时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._currentTime;
            },
            set: function (value) {
                if (value < 0 || value != value) {
                    value = 0;
                }
                var currentPlayTimes = this._timeline._currentPlayTimes - (this._timeline._isCompleted ? 1 : 0);
                value = (value % this._duration) + currentPlayTimes * this._duration;
                if (this._time == value) {
                    return;
                }
                this._time = value;
                this._timeline.setCurrentTime(this._time);
                if (this._zOrderTimeline) {
                    this._zOrderTimeline._isCompleted = false;
                }
                for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i]._isCompleted = false;
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i]._isCompleted = false;
                }
                for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i]._isCompleted = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "clip", {
            /**
             * @deprecated
             * @see #animationData
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        AnimationState.stateActionEnabled = true;
        return AnimationState;
    }(dragonBones.BaseObject));
    dragonBones.AnimationState = AnimationState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     * @private
     */
    var AnimationTimelineState = (function (_super) {
        __extends(AnimationTimelineState, _super);
        function AnimationTimelineState() {
            _super.call(this);
        }
        AnimationTimelineState.toString = function () {
            return "[class dragonBones.AnimationTimelineState]";
        };
        /**
         * @inheritDoc
         */
        AnimationTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._isStarted = false;
        };
        AnimationTimelineState.prototype._onCrossFrame = function (frame) {
            var self = this;
            if (self._animationState._fadeState < 0) {
                return;
            }
            if (self._animationState.actionEnabled) {
                var actions = frame.actions;
                for (var i = 0, l = actions.length; i < l; ++i) {
                    self._armature._bufferAction(actions[i]);
                }
            }
            var eventDispatcher = self._armature._display;
            var events = frame.events;
            for (var i = 0, l = events.length; i < l; ++i) {
                var eventData = events[i];
                var eventType = "";
                switch (eventData.type) {
                    case 10 /* Frame */:
                        eventType = dragonBones.EventObject.FRAME_EVENT;
                        break;
                    case 11 /* Sound */:
                        eventType = dragonBones.EventObject.SOUND_EVENT;
                        break;
                }
                if ((eventData.type == 11 /* Sound */ ?
                    self._armature._eventManager : eventDispatcher).hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.name = eventData.name;
                    eventObject.animationState = self._animationState;
                    eventObject.frame = frame;
                    eventObject.data = eventData;
                    if (eventData.bone) {
                        eventObject.bone = self._armature.getBone(eventData.bone.name);
                    }
                    if (eventData.slot) {
                        eventObject.slot = self._armature.getSlot(eventData.slot.name);
                    }
                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        AnimationTimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            _super.prototype.fadeIn.call(this, armature, animationState, timelineData, time);
            this._currentTime = time; // Pass first update. (armature.advanceTime(0))
        };
        AnimationTimelineState.prototype.update = function (time) {
            var self = this;
            var prevTime = self._currentTime;
            var prevPlayTimes = self._currentPlayTimes;
            if (!self._isCompleted && self._setCurrentTime(time)) {
                var eventDispatcher = self._armature._display;
                if (!self._isStarted) {
                    self._isStarted = true;
                    if (eventDispatcher.hasEvent(dragonBones.EventObject.START)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, dragonBones.EventObject.START);
                    }
                }
                if (self._keyFrameCount > 0) {
                    var currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                    var currentFrame = self._timeline.frames[currentFrameIndex];
                    if (self._currentFrame != currentFrame) {
                        if (self._keyFrameCount > 1) {
                            var crossedFrame = self._currentFrame;
                            self._currentFrame = currentFrame;
                            if (!crossedFrame) {
                                var prevFrameIndex = Math.floor(prevTime * self._frameRate);
                                crossedFrame = self._timeline.frames[prevFrameIndex];
                                if (self._isReverse) {
                                }
                                else {
                                    if (prevTime <= crossedFrame.position ||
                                        prevPlayTimes != self._currentPlayTimes) {
                                        crossedFrame = crossedFrame.prev;
                                    }
                                }
                            }
                            // TODO 1 2 3 key frame loop, first key frame after loop complete.
                            if (self._isReverse) {
                                while (crossedFrame != currentFrame) {
                                    self._onCrossFrame(crossedFrame);
                                    crossedFrame = crossedFrame.prev;
                                }
                            }
                            else {
                                while (crossedFrame != currentFrame) {
                                    crossedFrame = crossedFrame.next;
                                    self._onCrossFrame(crossedFrame);
                                }
                            }
                        }
                        else {
                            self._currentFrame = currentFrame;
                            self._onCrossFrame(self._currentFrame);
                        }
                    }
                }
                if (prevPlayTimes != self._currentPlayTimes) {
                    if (eventDispatcher.hasEvent(dragonBones.EventObject.LOOP_COMPLETE)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, dragonBones.EventObject.LOOP_COMPLETE);
                    }
                    if (self._isCompleted && eventDispatcher.hasEvent(dragonBones.EventObject.COMPLETE)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = self._animationState;
                        self._armature._bufferEvent(eventObject, dragonBones.EventObject.COMPLETE);
                    }
                    self._currentFrame = null;
                }
            }
        };
        AnimationTimelineState.prototype.setCurrentTime = function (value) {
            this._setCurrentTime(value);
            this._currentFrame = null;
        };
        return AnimationTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.AnimationTimelineState = AnimationTimelineState;
    /**
     * @internal
     * @private
     */
    var ZOrderTimelineState = (function (_super) {
        __extends(ZOrderTimelineState, _super);
        function ZOrderTimelineState() {
            _super.call(this);
        }
        ZOrderTimelineState.toString = function () {
            return "[class dragonBones.ZOrderTimelineState]";
        };
        ZOrderTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            self._armature._sortZOrder(self._currentFrame.zOrder);
        };
        return ZOrderTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.ZOrderTimelineState = ZOrderTimelineState;
    /**
     * @internal
     * @private
     */
    var BoneTimelineState = (function (_super) {
        __extends(BoneTimelineState, _super);
        function BoneTimelineState() {
            _super.call(this);
            this._transform = new dragonBones.Transform();
            this._currentTransform = new dragonBones.Transform();
            this._durationTransform = new dragonBones.Transform();
        }
        BoneTimelineState.toString = function () {
            return "[class dragonBones.BoneTimelineState]";
        };
        /**
         * @inheritDoc
         */
        BoneTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this._tweenTransform = 0 /* None */;
            this._tweenRotate = 0 /* None */;
            this._tweenScale = 0 /* None */;
            this._boneTransform = null;
            this._originalTransform = null;
            this._transform.identity();
            this._currentTransform.identity();
            this._durationTransform.identity();
        };
        BoneTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            self._currentTransform.copyFrom(self._currentFrame.transform);
            self._tweenTransform = 1 /* Once */;
            self._tweenRotate = 1 /* Once */;
            self._tweenScale = 1 /* Once */;
            if (self._keyFrameCount > 1 && (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve)) {
                var nextFrame = self._currentFrame.next;
                var nextTransform = nextFrame.transform;
                // Transform.
                self._durationTransform.x = nextTransform.x - self._currentTransform.x;
                self._durationTransform.y = nextTransform.y - self._currentTransform.y;
                if (self._durationTransform.x != 0 || self._durationTransform.y != 0) {
                    self._tweenTransform = 2 /* Always */;
                }
                // Rotate.
                var tweenRotate = self._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= self._currentTransform.skewY : nextTransform.skewY <= self._currentTransform.skewY) {
                            var rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + dragonBones.DragonBones.PI_D * rotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + dragonBones.DragonBones.PI_D * rotate;
                        }
                        else {
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + dragonBones.DragonBones.PI_D * tweenRotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + dragonBones.DragonBones.PI_D * tweenRotate;
                        }
                    }
                    else {
                        self._durationTransform.skewX = dragonBones.Transform.normalizeRadian(nextTransform.skewX - self._currentTransform.skewX);
                        self._durationTransform.skewY = dragonBones.Transform.normalizeRadian(nextTransform.skewY - self._currentTransform.skewY);
                    }
                    if (self._durationTransform.skewX != 0 || self._durationTransform.skewY != 0) {
                        self._tweenRotate = 2 /* Always */;
                    }
                }
                else {
                    self._durationTransform.skewX = 0;
                    self._durationTransform.skewY = 0;
                }
                // Scale.
                if (self._currentFrame.tweenScale) {
                    self._durationTransform.scaleX = nextTransform.scaleX - self._currentTransform.scaleX;
                    self._durationTransform.scaleY = nextTransform.scaleY - self._currentTransform.scaleY;
                    if (self._durationTransform.scaleX != 0 || self._durationTransform.scaleY != 0) {
                        self._tweenScale = 2 /* Always */;
                    }
                }
                else {
                    self._durationTransform.scaleX = 0;
                    self._durationTransform.scaleY = 0;
                }
            }
            else {
                self._durationTransform.x = 0;
                self._durationTransform.y = 0;
                self._durationTransform.skewX = 0;
                self._durationTransform.skewY = 0;
                self._durationTransform.scaleX = 0;
                self._durationTransform.scaleY = 0;
            }
        };
        BoneTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            var self = this;
            if (self._tweenTransform || self._tweenRotate || self._tweenScale) {
                _super.prototype._onUpdateFrame.call(this, isUpdate);
                var tweenProgress = 0;
                if (self._tweenTransform) {
                    if (self._tweenTransform == 1 /* Once */) {
                        self._tweenTransform = 0 /* None */;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.x = self._currentTransform.x + self._durationTransform.x * tweenProgress;
                        self._transform.y = self._currentTransform.y + self._durationTransform.y * tweenProgress;
                    }
                    else {
                        self._transform.x = self._originalTransform.x + self._currentTransform.x + self._durationTransform.x * tweenProgress;
                        self._transform.y = self._originalTransform.y + self._currentTransform.y + self._durationTransform.y * tweenProgress;
                    }
                }
                if (self._tweenRotate) {
                    if (self._tweenRotate == 1 /* Once */) {
                        self._tweenRotate = 0 /* None */;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.skewX = self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                        self._transform.skewY = self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                    }
                    else {
                        self._transform.skewX = self._originalTransform.skewX + self._currentTransform.skewX + self._durationTransform.skewX * tweenProgress;
                        self._transform.skewY = self._originalTransform.skewY + self._currentTransform.skewY + self._durationTransform.skewY * tweenProgress;
                    }
                }
                if (self._tweenScale) {
                    if (self._tweenScale == 1 /* Once */) {
                        self._tweenScale = 0 /* None */;
                        tweenProgress = 0;
                    }
                    else {
                        tweenProgress = self._tweenProgress;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.scaleX = self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress;
                        self._transform.scaleY = self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress;
                    }
                    else {
                        self._transform.scaleX = self._originalTransform.scaleX * (self._currentTransform.scaleX + self._durationTransform.scaleX * tweenProgress);
                        self._transform.scaleY = self._originalTransform.scaleY * (self._currentTransform.scaleY + self._durationTransform.scaleY * tweenProgress);
                    }
                }
                self.bone.invalidUpdate();
            }
        };
        BoneTimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            _super.prototype.fadeIn.call(this, armature, animationState, timelineData, time);
            this._originalTransform = this._timeline.originalTransform;
            this._boneTransform = this.bone._animationPose;
        };
        BoneTimelineState.prototype.fadeOut = function () {
            this._transform.skewX = dragonBones.Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = dragonBones.Transform.normalizeRadian(this._transform.skewY);
        };
        BoneTimelineState.prototype.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Blend animation state.
            var weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.bone._blendIndex == 0) {
                    self._boneTransform.x = self._transform.x * weight;
                    self._boneTransform.y = self._transform.y * weight;
                    self._boneTransform.skewX = self._transform.skewX * weight;
                    self._boneTransform.skewY = self._transform.skewY * weight;
                    self._boneTransform.scaleX = (self._transform.scaleX - 1) * weight + 1;
                    self._boneTransform.scaleY = (self._transform.scaleY - 1) * weight + 1;
                }
                else {
                    self._boneTransform.x += self._transform.x * weight;
                    self._boneTransform.y += self._transform.y * weight;
                    self._boneTransform.skewX += self._transform.skewX * weight;
                    self._boneTransform.skewY += self._transform.skewY * weight;
                    self._boneTransform.scaleX += (self._transform.scaleX - 1) * weight;
                    self._boneTransform.scaleY += (self._transform.scaleY - 1) * weight;
                }
                self.bone._blendIndex++;
                if (self._animationState._fadeState != 0) {
                    self.bone.invalidUpdate();
                }
            }
        };
        return BoneTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.BoneTimelineState = BoneTimelineState;
    /**
     * @internal
     * @private
     */
    var SlotTimelineState = (function (_super) {
        __extends(SlotTimelineState, _super);
        function SlotTimelineState() {
            _super.call(this);
            this._color = new dragonBones.ColorTransform();
            this._durationColor = new dragonBones.ColorTransform();
        }
        SlotTimelineState.toString = function () {
            return "[class dragonBones.SlotTimelineState]";
        };
        /**
         * @inheritDoc
         */
        SlotTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._colorDirty = false;
            this._tweenColor = 0 /* None */;
            this._slotColor = null;
            this._color.identity();
            this._durationColor.identity();
        };
        SlotTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            if (self._animationState._isDisabled(self.slot)) {
                self._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = 0 /* None */;
                return;
            }
            if (self._animationState._fadeState >= 0) {
                self.slot._setDisplayIndex(self._currentFrame.displayIndex);
                self.slot._updateMeshData(true);
            }
            self._tweenColor = 0 /* None */;
            var currentColor = self._currentFrame.color;
            if (self._keyFrameCount > 1 && (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve)) {
                var nextFrame = self._currentFrame.next;
                var nextColor = nextFrame.color;
                if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                    self._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                    self._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                    self._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                    self._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                    self._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                    self._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                    self._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                    self._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                    if (self._durationColor.alphaMultiplier != 0 ||
                        self._durationColor.redMultiplier != 0 ||
                        self._durationColor.greenMultiplier != 0 ||
                        self._durationColor.blueMultiplier != 0 ||
                        self._durationColor.alphaOffset != 0 ||
                        self._durationColor.redOffset != 0 ||
                        self._durationColor.greenOffset != 0 ||
                        self._durationColor.blueOffset != 0) {
                        self._tweenColor = 2 /* Always */;
                    }
                }
            }
            if (self._tweenColor == 0 /* None */) {
                if (self._slotColor.alphaMultiplier != currentColor.alphaMultiplier ||
                    self._slotColor.redMultiplier != currentColor.redMultiplier ||
                    self._slotColor.greenMultiplier != currentColor.greenMultiplier ||
                    self._slotColor.blueMultiplier != currentColor.blueMultiplier ||
                    self._slotColor.alphaOffset != currentColor.alphaOffset ||
                    self._slotColor.redOffset != currentColor.redOffset ||
                    self._slotColor.greenOffset != currentColor.greenOffset ||
                    self._slotColor.blueOffset != currentColor.blueOffset) {
                    self._tweenColor = 1 /* Once */;
                }
            }
        };
        SlotTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            var tweenProgress = 0;
            if (self._tweenColor) {
                if (self._tweenColor == 1 /* Once */) {
                    self._tweenColor = 0 /* None */;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }
                var currentColor = self._currentFrame.color;
                self._color.alphaMultiplier = currentColor.alphaMultiplier + self._durationColor.alphaMultiplier * tweenProgress;
                self._color.redMultiplier = currentColor.redMultiplier + self._durationColor.redMultiplier * tweenProgress;
                self._color.greenMultiplier = currentColor.greenMultiplier + self._durationColor.greenMultiplier * tweenProgress;
                self._color.blueMultiplier = currentColor.blueMultiplier + self._durationColor.blueMultiplier * tweenProgress;
                self._color.alphaOffset = currentColor.alphaOffset + self._durationColor.alphaOffset * tweenProgress;
                self._color.redOffset = currentColor.redOffset + self._durationColor.redOffset * tweenProgress;
                self._color.greenOffset = currentColor.greenOffset + self._durationColor.greenOffset * tweenProgress;
                self._color.blueOffset = currentColor.blueOffset + self._durationColor.blueOffset * tweenProgress;
                self._colorDirty = true;
            }
        };
        SlotTimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            _super.prototype.fadeIn.call(this, armature, animationState, timelineData, time);
            this._slotColor = this.slot._colorTransform;
        };
        SlotTimelineState.prototype.fadeOut = function () {
            this._tweenColor = 0 /* None */;
        };
        SlotTimelineState.prototype.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Fade animation.
            if (self._tweenColor != 0 /* None */ || self._colorDirty) {
                var weight = self._animationState._weightResult;
                if (weight > 0) {
                    if (self._animationState._fadeState != 0) {
                        var fadeProgress = Math.pow(self._animationState._fadeProgress, 4);
                        self._slotColor.alphaMultiplier += (self._color.alphaMultiplier - self._slotColor.alphaMultiplier) * fadeProgress;
                        self._slotColor.redMultiplier += (self._color.redMultiplier - self._slotColor.redMultiplier) * fadeProgress;
                        self._slotColor.greenMultiplier += (self._color.greenMultiplier - self._slotColor.greenMultiplier) * fadeProgress;
                        self._slotColor.blueMultiplier += (self._color.blueMultiplier - self._slotColor.blueMultiplier) * fadeProgress;
                        self._slotColor.alphaOffset += (self._color.alphaOffset - self._slotColor.alphaOffset) * fadeProgress;
                        self._slotColor.redOffset += (self._color.redOffset - self._slotColor.redOffset) * fadeProgress;
                        self._slotColor.greenOffset += (self._color.greenOffset - self._slotColor.greenOffset) * fadeProgress;
                        self._slotColor.blueOffset += (self._color.blueOffset - self._slotColor.blueOffset) * fadeProgress;
                        self.slot._colorDirty = true;
                    }
                    else if (self._colorDirty) {
                        self._colorDirty = false;
                        self._slotColor.alphaMultiplier = self._color.alphaMultiplier;
                        self._slotColor.redMultiplier = self._color.redMultiplier;
                        self._slotColor.greenMultiplier = self._color.greenMultiplier;
                        self._slotColor.blueMultiplier = self._color.blueMultiplier;
                        self._slotColor.alphaOffset = self._color.alphaOffset;
                        self._slotColor.redOffset = self._color.redOffset;
                        self._slotColor.greenOffset = self._color.greenOffset;
                        self._slotColor.blueOffset = self._color.blueOffset;
                        self.slot._colorDirty = true;
                    }
                }
            }
        };
        return SlotTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.SlotTimelineState = SlotTimelineState;
    /**
     * @internal
     * @private
     */
    var FFDTimelineState = (function (_super) {
        __extends(FFDTimelineState, _super);
        function FFDTimelineState() {
            _super.call(this);
            this._ffdVertices = [];
        }
        FFDTimelineState.toString = function () {
            return "[class dragonBones.FFDTimelineState]";
        };
        /**
         * @inheritDoc
         */
        FFDTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._tweenFFD = 0 /* None */;
            this._slotFFDVertices = null;
            if (this._durationFFDFrame) {
                this._durationFFDFrame.returnToPool();
                this._durationFFDFrame = null;
            }
            this._ffdVertices.length = 0;
        };
        FFDTimelineState.prototype._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            self._tweenFFD = 0 /* None */;
            if (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve) {
                self._tweenFFD = self._updateExtensionKeyFrame(self._currentFrame, self._currentFrame.next, self._durationFFDFrame);
            }
            if (self._tweenFFD == 0 /* None */) {
                var currentFFDVertices = self._currentFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (self._slotFFDVertices[i] != currentFFDVertices[i]) {
                        self._tweenFFD = 1 /* Once */;
                        break;
                    }
                }
            }
        };
        FFDTimelineState.prototype._onUpdateFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            var tweenProgress = 0;
            if (self._tweenFFD != 0 /* None */) {
                if (self._tweenFFD == 1 /* Once */) {
                    self._tweenFFD = 0 /* None */;
                    tweenProgress = 0;
                }
                else {
                    tweenProgress = self._tweenProgress;
                }
                var currentFFDVertices = self._currentFrame.tweens;
                var nextFFDVertices = self._durationFFDFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    self._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * tweenProgress;
                }
                self.slot._ffdDirty = true;
            }
        };
        FFDTimelineState.prototype.fadeIn = function (armature, animationState, timelineData, time) {
            _super.prototype.fadeIn.call(this, armature, animationState, timelineData, time);
            this._slotFFDVertices = this.slot._ffdVertices;
            this._durationFFDFrame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            this._durationFFDFrame.tweens.length = this._slotFFDVertices.length;
            this._ffdVertices.length = this._slotFFDVertices.length;
            for (var i = 0, l = this._durationFFDFrame.tweens.length; i < l; ++i) {
                this._durationFFDFrame.tweens[i] = 0;
            }
            for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0;
            }
        };
        FFDTimelineState.prototype.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Blend animation.
            var weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.slot._blendIndex == 0) {
                    for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] = self._ffdVertices[i] * weight;
                    }
                }
                else {
                    for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] += self._ffdVertices[i] * weight;
                    }
                }
                self.slot._blendIndex++;
                if (self._animationState._fadeState != 0) {
                    self.slot._ffdDirty = true;
                }
            }
        };
        return FFDTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.FFDTimelineState = FFDTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * WorldClock 提供时钟的支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var WorldClock = (function () {
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 可以更灵活的为需要更新的 IAnimateble 实例分组，实现不同组不同速度的动画播放)
         * @version DragonBones 3.0
         */
        function WorldClock() {
            /**
             * @language zh_CN
             * 当前的时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            this.time = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND;
            /**
             * @language zh_CN
             * 时间流逝的速度，用于实现动画的变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 3.0
             */
            this.timeScale = 1;
            this._animatebles = [];
        }
        Object.defineProperty(WorldClock, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局 WorldClock 实例.
             * @version DragonBones 3.0
             */
            get: function () {
                if (!WorldClock._clock) {
                    WorldClock._clock = new WorldClock();
                }
                return WorldClock._clock;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例向前播放一个指定的时间。 (通常这个方法需要在 ENTER_FRAME 事件的响应函数中被调用)
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime != passedTime) {
                passedTime = 0;
            }
            if (passedTime < 0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            passedTime *= this.timeScale;
            if (passedTime < 0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
            if (passedTime) {
                var i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    var animateble = this._animatebles[i];
                    if (animateble) {
                        if (r > 0) {
                            this._animatebles[i - r] = animateble;
                            this._animatebles[i] = null;
                        }
                        animateble.advanceTime(passedTime);
                    }
                    else {
                        r++;
                    }
                }
                if (r > 0) {
                    l = this._animatebles.length;
                    for (; i < l; ++i) {
                        var animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        }
                        else {
                            r++;
                        }
                    }
                    this._animatebles.length -= r;
                }
            }
        };
        /**
         * 是否包含指定的 IAnimatable 实例
         * @param value 指定的 IAnimatable 实例。
         * @returns  [true: 包含，false: 不包含]。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.contains = function (value) {
            return this._animatebles.indexOf(value) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.add = function (value) {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.addArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 移除指定的 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.remove = function (value) {
            var index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.removeArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.clear = function () {
            for (var i = 0, l = this._animatebles.length; i < l; ++i) {
                this._animatebles[i] = null;
            }
        };
        WorldClock._clock = null;
        return WorldClock;
    }());
    dragonBones.WorldClock = WorldClock;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    var TransformObject = (function (_super) {
        __extends(TransformObject, _super);
        /**
         * @internal
         * @private
         */
        function TransformObject() {
            _super.call(this);
            /**
             * @language zh_CN
             * 相对于骨架坐标系的变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.global = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的绑定变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.origin = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的偏移变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            this.offset = new dragonBones.Transform();
            /**
             * @private
             */
            this._globalTransformMatrix = new dragonBones.Matrix();
        }
        /**
         * @inheritDoc
         */
        TransformObject.prototype._onClear = function () {
            this.userData = null;
            this.name = null;
            this.globalTransformMatrix = this._globalTransformMatrix;
            this.global.identity();
            this.origin.identity();
            this.offset.identity();
            this._armature = null;
            this._parent = null;
            this._globalTransformMatrix.identity();
        };
        /**
         * @internal
         * @private
         */
        TransformObject.prototype._setArmature = function (value) {
            this._armature = value;
        };
        /**
         * @internal
         * @private
         */
        TransformObject.prototype._setParent = function (value) {
            this._parent = value;
        };
        Object.defineProperty(TransformObject.prototype, "armature", {
            /**
             * @language zh_CN
             * 所属的骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformObject.prototype, "parent", {
            /**
             * @language zh_CN
             * 所属的父骨骼。
             * @see dragonBones.Bone
             * @version DragonBones 3.0
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        return TransformObject;
    }(dragonBones.BaseObject));
    dragonBones.TransformObject = TransformObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @see dragonBones.IArmatureDisplay
     * @version DragonBones 3.0
     */
    var Armature = (function (_super) {
        __extends(Armature, _super);
        /**
         * @internal
         * @private
         */
        function Armature() {
            _super.call(this);
            this._bones = [];
            this._slots = [];
            this._actions = [];
            this._events = [];
            /**
             * @deprecated
             * @see #cacheFrameRate
             */
            this.enableCache = false;
        }
        /**
         * @private
         */
        Armature.toString = function () {
            return "[class dragonBones.Armature]";
        };
        Armature._onSortSlots = function (a, b) {
            return a._zOrder > b._zOrder ? 1 : -1;
        };
        /**
         * @inheritDoc
         */
        Armature.prototype._onClear = function () {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i].returnToPool();
            }
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].returnToPool();
            }
            for (var i = 0, l = this._events.length; i < l; ++i) {
                this._events[i].returnToPool();
            }
            if (this._animation) {
                this._animation.returnToPool();
            }
            if (this._display) {
                this._display._onClear();
            }
            this.userData = null;
            this._cacheFrameIndex = -1;
            this._armatureData = null;
            this._skinData = null;
            this._animation = null;
            this._display = null;
            this._parent = null;
            this._eventManager = null;
            this._delayDispose = false;
            this._lockDispose = false;
            this._debugDraw = false;
            this._bonesDirty = false;
            this._slotsDirty = false;
            this._replacedTexture = null;
            this._bones.length = 0;
            this._slots.length = 0;
            this._actions.length = 0;
            this._events.length = 0;
        };
        Armature.prototype._sortBones = function () {
            var total = this._bones.length;
            if (total <= 0) {
                return;
            }
            var sortHelper = this._bones.concat();
            var index = 0;
            var count = 0;
            this._bones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._bones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex == bone.ikChain) {
                    this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
                }
                else {
                    this._bones.push(bone);
                }
                count++;
            }
        };
        Armature.prototype._sortSlots = function () {
            this._slots.sort(Armature._onSortSlots);
        };
        Armature.prototype._doAction = function (value) {
            switch (value.type) {
                case 0 /* Play */:
                    this._animation.play(value.data[0], value.data[1]);
                    break;
                case 1 /* Stop */:
                    this._animation.stop(value.data[0]);
                    break;
                case 2 /* GotoAndPlay */:
                    this._animation.gotoAndPlayByTime(value.data[0], value.data[1], value.data[2]);
                    break;
                case 3 /* GotoAndStop */:
                    this._animation.gotoAndStopByTime(value.data[0], value.data[1]);
                    break;
                case 4 /* FadeIn */:
                    this._animation.fadeIn(value.data[0], value.data[1], value.data[2]);
                    break;
                case 5 /* FadeOut */:
                    // TODO fade out
                    break;
                default:
                    break;
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._addBoneToBoneList = function (value) {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones.push(value);
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._removeBoneFromBoneList = function (value) {
            var index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._addSlotToSlotList = function (value) {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots.push(value);
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._removeSlotFromSlotList = function (value) {
            var index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortZOrder = function (slotIndices) {
            var sortedSlots = this._armatureData.sortedSlots;
            var isOriginal = slotIndices.length < 1;
            for (var i = 0, l = sortedSlots.length; i < l; ++i) {
                var slotIndex = isOriginal ? i : slotIndices[i];
                var slotData = sortedSlots[slotIndex];
                var slot = this.getSlot(slotData.name);
                if (slot) {
                    slot._setZorder(i);
                }
            }
            this._slotsDirty = true;
        };
        /**
         * @private
         */
        Armature.prototype._bufferAction = function (value) {
            this._actions.push(value);
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._bufferEvent = function (value, type) {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        };
        /**
         * @language zh_CN
         * 释放骨架。 (会回收到内存池)
         * @version DragonBones 3.0
         */
        Armature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._lockDispose && this._animation) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨架和动画。 (可以使用时钟实例或显示容器来更新)
         * @param passedTime 两帧之前的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @see dragonBones.IArmatureDisplay
         * @version DragonBones 3.0
         */
        Armature.prototype.advanceTime = function (passedTime) {
            var self = this;
            if (!self._animation) {
                throw new Error("The armature has been disposed.");
            }
            var scaledPassedTime = passedTime * self._animation.timeScale;
            // Animations.
            self._animation._advanceTime(scaledPassedTime);
            // Bones and slots.
            if (self._bonesDirty) {
                self._bonesDirty = false;
                self._sortBones();
            }
            if (self._slotsDirty) {
                self._slotsDirty = false;
                self._sortSlots();
            }
            for (var i = 0, l = self._bones.length; i < l; ++i) {
                self._bones[i]._update(self._cacheFrameIndex);
            }
            for (var i = 0, l = self._slots.length; i < l; ++i) {
                var slot = self._slots[i];
                slot._update(self._cacheFrameIndex);
                var childArmature = slot._childArmature;
                if (childArmature) {
                    if (slot.inheritAnimation) {
                        childArmature.advanceTime(scaledPassedTime);
                    }
                    else {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }
            //
            if (dragonBones.DragonBones.debugDraw || self._debugDraw) {
                self._debugDraw = dragonBones.DragonBones.debugDraw;
                self._display._debugDraw(self._debugDraw);
            }
            if (!self._lockDispose) {
                self._lockDispose = true;
                // Actions and events.
                if (self._events.length > 0) {
                    for (var i = 0, l = self._events.length; i < l; ++i) {
                        var event_5 = self._events[i];
                        if (event_5.type == dragonBones.EventObject.SOUND_EVENT) {
                            this._eventManager._dispatchEvent(event_5);
                        }
                        else {
                            self._display._dispatchEvent(event_5);
                        }
                        event_5.returnToPool();
                    }
                    self._events.length = 0;
                }
                if (self._actions.length > 0) {
                    for (var i = 0, l = self._actions.length; i < l; ++i) {
                        var action = self._actions[i];
                        if (action.slot) {
                            var slot = self.getSlot(action.slot.name);
                            if (slot) {
                                var childArmature = slot._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else if (action.bone) {
                            for (var i_1 = 0, l_1 = self._slots.length; i_1 < l_1; ++i_1) {
                                var childArmature = self._slots[i_1]._childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else {
                            this._doAction(action);
                        }
                    }
                    self._actions.length = 0;
                }
                self._lockDispose = false;
            }
            if (self._delayDispose) {
                self.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 判断指定的点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 4.5
         */
        Armature.prototype.containsPoint = function (x, y, color) {
            if (color === void 0) { color = 0; }
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.containsPoint(x, y, color)) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 判断指定的线段与骨架的所有插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
         * @version DragonBones 4.5
         */
        Armature.prototype.intersectsSegment = function (xA, yA, xB, yB, color, intersectionPointA, intersectionPointB, normalRadians) {
            if (color === void 0) { color = 0; }
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var isV = xA == xB;
            var dMin = 0;
            var dMax = 0;
            var intXA = 0;
            var intYA = 0;
            var intXB = 0;
            var intYB = 0;
            var intAN = 0;
            var intBN = 0;
            var intSlotA = null;
            var intSlotB = null;
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                var intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, color, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA || intersectionPointB) {
                        if (intersectionPointA) {
                            var d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0) {
                                d = -d;
                            }
                            if (!intSlotA || d < dMin) {
                                dMin = d;
                                intXA = intersectionPointA.x;
                                intYA = intersectionPointA.y;
                                intSlotA = slot;
                                if (normalRadians) {
                                    intAN = normalRadians.x;
                                }
                            }
                        }
                        if (intersectionPointB) {
                            var d = intersectionPointB.x - xA;
                            if (d < 0) {
                                d = -d;
                            }
                            if (!intSlotB || d > dMax) {
                                dMax = d;
                                intXB = intersectionPointB.x;
                                intYB = intersectionPointB.y;
                                intSlotB = slot;
                                if (normalRadians) {
                                    intBN = normalRadians.y;
                                }
                            }
                        }
                    }
                    else {
                        intSlotA = slot;
                        break;
                    }
                }
            }
            if (intSlotA && intersectionPointA) {
                intersectionPointA.x = intXA;
                intersectionPointA.y = intYA;
                if (normalRadians) {
                    normalRadians.x = intAN;
                }
            }
            if (intSlotB && intersectionPointB) {
                intersectionPointB.x = intXB;
                intersectionPointB.y = intYB;
                if (normalRadians) {
                    normalRadians.y = intBN;
                }
            }
            return intSlotA;
        };
        /**
         * @language zh_CN
         * 更新骨骼和插槽的变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.invalidUpdate = function (boneName, updateSlotDisplay) {
            if (boneName === void 0) { boneName = null; }
            if (updateSlotDisplay === void 0) { updateSlotDisplay = false; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                    if (updateSlotDisplay) {
                        for (var i = 0, l = this._slots.length; i < l; ++i) {
                            var slot = this._slots[i];
                            if (slot.parent == bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].invalidUpdate();
                }
                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBone = function (name) {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                var bone = this._bones[i];
                if (bone.name == name) {
                    return bone;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.name == name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlotByDisplay = function (display) {
            if (display) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    if (slot.display == display) {
                        return slot;
                    }
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @param texture 贴图。
         * @version DragonBones 4.5
         */
        Armature.prototype.replaceTexture = function (texture) {
            this.replacedTexture = texture;
        };
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBones = function () {
            return this._bones;
        };
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlots = function () {
            return this._slots;
        };
        Object.defineProperty(Armature.prototype, "name", {
            /**
             * @language zh_CN
             * 骨架名称。
             * @see dragonBones.ArmatureData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureData ? this._armatureData.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "armatureData", {
            /**
             * @language zh_CN
             * 获取骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "animation", {
            /**
             * @language zh_CN
             * 获得动画控制器。
             * @see dragonBones.Animation
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "display", {
            /**
             * @language zh_CN
             * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "parent", {
            /**
             * @language zh_CN
             * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
             * @see dragonBones.Slot
             * @version DragonBones 4.5
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "cacheFrameRate", {
            /**
             * @language zh_CN
             * 动画缓存的帧率，当设置一个大于 0 的帧率时，将会开启动画缓存。
             * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
             * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
             * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
             * @see dragonBones.DragonBonesData#frameRate
             * @see dragonBones.ArmatureData#frameRate
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData.cacheFrameRate;
            },
            set: function (value) {
                if (this._armatureData.cacheFrameRate != value) {
                    this._armatureData.cacheFrames(value);
                    // Set child armature frameRate.
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];
                        var childArmature = slot.childArmature;
                        if (childArmature && childArmature.cacheFrameRate == 0) {
                            childArmature.cacheFrameRate = value;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "replacedTexture", {
            /**
             * @language zh_CN
             * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._replacedTexture;
            },
            set: function (value) {
                this._display._onReplaceTexture(value);
                this._replacedTexture = value;
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].invalidUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 开启动画缓存。
         * @param frameRate 动画缓存的帧率
         * @see #cacheFrameRate
         * @version DragonBones 4.5
         */
        Armature.prototype.enableAnimationCache = function (frameRate) {
            this.cacheFrameRate = frameRate;
        };
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @returns  [true: 包含, false: 不包含]
         * @version DragonBones 3.0
         */
        Armature.prototype.hasEventListener = function (type) {
            return this._display.hasEvent(type);
        };
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.addEventListener = function (type, listener, target) {
            this._display.addEvent(type, listener, target);
        };
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 3.0
         */
        Armature.prototype.removeEventListener = function (type, listener, target) {
            this._display.removeEvent(type, listener, target);
        };
        /**
         * @deprecated
         */
        Armature.prototype.addBone = function (value, parentName) {
            if (parentName === void 0) { parentName = null; }
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.addSlot = function (value, parentName) {
            var bone = this.getBone(parentName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.removeBone = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.removeSlot = function (value) {
            if (value && value.armature == this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error();
            }
        };
        /**
         * @deprecated
         * @see #display
         */
        Armature.prototype.getDisplay = function () {
            return this._display;
        };
        return Armature;
    }(dragonBones.BaseObject));
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * @internal
         * @private
         */
        function Bone() {
            _super.call(this);
            /**
             * @internal
             * @private
             */
            this._animationPose = new dragonBones.Transform();
            /**
             * @private
             */
            this._bones = [];
            /**
             * @private
             */
            this._slots = [];
        }
        /**
         * @private
         */
        Bone.toString = function () {
            return "[class dragonBones.Bone]";
        };
        /**
         * @inheritDoc
         */
        Bone.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.ikBendPositive = false;
            this.ikWeight = 0;
            this.length = 0;
            this._transformDirty = 2 /* All */; // Update
            this._blendIndex = 0;
            this._cacheFrames = null;
            this._animationPose.identity();
            this._visible = true;
            this._ikChain = 0;
            this._ikChainIndex = 0;
            this._ik = null;
            this._bones.length = 0;
            this._slots.length = 0;
        };
        /**
         * @private
         */
        Bone.prototype._updateGlobalTransformMatrix = function () {
            if (this._parent) {
                var parentRotation = this._parent.global.skewY; // Only inherit skew y.
                var parentMatrix = this._parent.globalTransformMatrix;
                if (this.inheritScale) {
                    if (!this.inheritRotation) {
                        this.global.skewX -= parentRotation;
                        this.global.skewY -= parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                    this.globalTransformMatrix.concat(parentMatrix);
                    if (!this.inheritTranslation) {
                        this.globalTransformMatrix.tx = this.global.x;
                        this.globalTransformMatrix.ty = this.global.y;
                    }
                    this.global.fromMatrix(this.globalTransformMatrix);
                }
                else {
                    if (this.inheritTranslation) {
                        var x = this.global.x;
                        var y = this.global.y;
                        this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }
                    if (this.inheritRotation) {
                        this.global.skewX += parentRotation;
                        this.global.skewY += parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                }
            }
            else {
                this.global.toMatrix(this.globalTransformMatrix);
            }
        };
        /**
         * @private
         */
        Bone.prototype._computeIKA = function () {
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var ikRadian = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
                this.offset.skewY -
                this.global.skewY * 2 +
                Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadian;
            this.global.skewY += ikRadian;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @private
         */
        Bone.prototype._computeIKB = function () {
            var parentGlobal = this._parent.global;
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var lLL = x * x + y * y;
            var lL = Math.sqrt(lLL);
            var dX = this.global.x - parentGlobal.x;
            var dY = this.global.y - parentGlobal.y;
            var lPP = dX * dX + dY * dY;
            var lP = Math.sqrt(lPP);
            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            var lTT = dX * dX + dY * dY;
            var lT = Math.sqrt(lTT);
            var ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            }
            else {
                var h = (lPP - lLL + lTT) / (2 * lTT);
                var r = Math.sqrt(lPP - h * h * lTT) / lT;
                var hX = parentGlobal.x + (dX * h);
                var hY = parentGlobal.y + (dY * h);
                var rX = -dY * r;
                var rY = dX * r;
                if (this.ikBendPositive) {
                    this.global.x = hX - rX;
                    this.global.y = hY - rY;
                }
                else {
                    this.global.x = hX + rX;
                    this.global.y = hY + rY;
                }
                ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            }
            ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;
            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(this._parent.globalTransformMatrix);
            this._parent._transformDirty = 1 /* Self */;
            this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
            var ikRadianB = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
                this.global.skewY * 2 + Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadianB;
            this.global.skewY += ikRadianB;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @inheritDoc
         */
        Bone.prototype._setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            this._ik = null;
            var oldSlots = null;
            var oldBones = null;
            if (this._armature) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }
            this._armature = value;
            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }
            if (oldSlots) {
                for (var i = 0, l = oldSlots.length; i < l; ++i) {
                    var slot = oldSlots[i];
                    if (slot.parent == this) {
                        slot._setArmature(this._armature);
                    }
                }
            }
            if (oldBones) {
                for (var i = 0, l = oldBones.length; i < l; ++i) {
                    var bone = oldBones[i];
                    if (bone.parent == this) {
                        bone._setArmature(this._armature);
                    }
                }
            }
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._setIK = function (value, chain, chainIndex) {
            if (value) {
                if (chain == chainIndex) {
                    var chainEnd = this._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    }
                    else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }
                    if (chainEnd == value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    }
                    else {
                        var ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }
                            ancestor = ancestor.parent;
                        }
                    }
                }
            }
            else {
                chain = 0;
                chainIndex = 0;
            }
            this._ik = value;
            this._ikChain = chain;
            this._ikChainIndex = chainIndex;
            if (this._armature) {
                this._armature._bonesDirty = true;
            }
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._update = function (cacheFrameIndex) {
            var self = this;
            self._blendIndex = 0;
            if (cacheFrameIndex >= 0) {
                var cacheFrame = self._cacheFrames[cacheFrameIndex];
                if (self.globalTransformMatrix == cacheFrame) {
                    self._transformDirty = 0 /* None */;
                }
                else if (cacheFrame) {
                    self._transformDirty = 2 /* All */; // For update children and ik children.
                    self.globalTransformMatrix = cacheFrame;
                }
                else if (self._transformDirty == 2 /* All */ ||
                    (self._parent && self._parent._transformDirty != 0 /* None */) ||
                    (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
                    self._transformDirty = 2 /* All */; // For update children and ik children.
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
                else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                    self._transformDirty = 0 /* None */;
                    self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
                }
                else {
                    self._transformDirty = 2 /* All */;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
            }
            else if (self._transformDirty == 2 /* All */ ||
                (self._parent && self._parent._transformDirty != 0 /* None */) ||
                (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
                self._transformDirty = 2 /* All */; // For update children and ik children.
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            if (self._transformDirty != 0 /* None */) {
                if (self._transformDirty == 2 /* All */) {
                    self._transformDirty = 1 /* Self */;
                    if (self.globalTransformMatrix == self._globalTransformMatrix) {
                        /*self.global.copyFrom(self.origin).add(self.offset).add(self._animationPose);*/
                        self.global.x = self.origin.x + self.offset.x + self._animationPose.x;
                        self.global.y = self.origin.y + self.offset.y + self._animationPose.y;
                        self.global.skewX = self.origin.skewX + self.offset.skewX + self._animationPose.skewX;
                        self.global.skewY = self.origin.skewY + self.offset.skewY + self._animationPose.skewY;
                        self.global.scaleX = self.origin.scaleX * self.offset.scaleX * self._animationPose.scaleX;
                        self.global.scaleY = self.origin.scaleY * self.offset.scaleY * self._animationPose.scaleY;
                        self._updateGlobalTransformMatrix();
                        if (self._ik && self._ikChainIndex == self._ikChain && self.ikWeight > 0) {
                            if (self.inheritTranslation && self._ikChain > 0 && self._parent) {
                                self._computeIKB();
                            }
                            else {
                                self._computeIKA();
                            }
                        }
                        if (cacheFrameIndex >= 0 && !self._cacheFrames[cacheFrameIndex]) {
                            self.globalTransformMatrix = dragonBones.BoneTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                        }
                    }
                }
                else {
                    self._transformDirty = 0 /* None */;
                }
            }
        };
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        Bone.prototype.invalidUpdate = function () {
            this._transformDirty = 2 /* All */;
        };
        /**
         * @language zh_CN
         * 是否包含某个指定的骨骼或插槽。
         * @returns [true: 包含，false: 不包含]
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        Bone.prototype.contains = function (child) {
            if (child) {
                if (child == this) {
                    return false;
                }
                var ancestor = child;
                while (ancestor != this && ancestor) {
                    ancestor = ancestor.parent;
                }
                return ancestor == this;
            }
            return false;
        };
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        Bone.prototype.getBones = function () {
            this._bones.length = 0;
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent == this) {
                    this._bones.push(bone);
                }
            }
            return this._bones;
        };
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Bone.prototype.getSlots = function () {
            this._slots.length = 0;
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.parent == this) {
                    this._slots.push(slot);
                }
            }
            return this._slots;
        };
        Object.defineProperty(Bone.prototype, "ikChain", {
            /**
             * @private
             */
            get: function () {
                return this._ikChain;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ikChainIndex", {
            /**
             * @private
             */
            get: function () {
                return this._ikChainIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ik", {
            /**
             * @language zh_CN
             * 当前的 IK 约束目标。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._ik;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "visible", {
            /**
             * @language zh_CN
             * 控制此骨骼所有插槽的显示。
             * @default true
             * @see dragonBones.Slot
             * @version DragonBones 3.0
             */
            get: function () {
                return this._visible;
            },
            set: function (value) {
                if (this._visible == value) {
                    return;
                }
                this._visible = value;
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot._parent == this) {
                        slot._updateVisible();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "slot", {
            /**
             * @deprecated
             * @see dragonBones.Armature#getSlot()
             */
            get: function () {
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot.parent == this) {
                        return slot;
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        return Bone;
    }(dragonBones.TransformObject));
    dragonBones.Bone = Bone;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        /**
         * @internal
         * @private
         */
        function Slot() {
            _super.call(this);
            /**
             * @private
             */
            this._colorTransform = new dragonBones.ColorTransform();
            /**
             * @private
             */
            this._ffdVertices = [];
            /**
             * @private
             */
            this._replacedDisplayDataSet = [];
            /**
             * @private
             */
            this._localMatrix = new dragonBones.Matrix();
            /**
             * @private
             */
            this._displayList = [];
            /**
             * @private
             */
            this._meshBones = [];
        }
        /**
         * @inheritDoc
         */
        Slot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            var disposeDisplayList = [];
            for (var i = 0, l = this._displayList.length; i < l; ++i) {
                var eachDisplay = this._displayList[i];
                if (eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0) {
                    disposeDisplayList.push(eachDisplay);
                }
            }
            for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                var eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof dragonBones.Armature) {
                    eachDisplay.dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }
            if (this._meshDisplay && this._meshDisplay != this._rawDisplay) {
                this._disposeDisplay(this._meshDisplay);
            }
            if (this._rawDisplay) {
                this._disposeDisplay(this._rawDisplay);
            }
            this.inheritAnimation = true;
            this.displayController = null;
            this._blendIndex = 0;
            this._displayDataSet = null;
            this._meshData = null;
            this._childArmature = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._cacheFrames = null;
            this._colorTransform.identity();
            this._ffdVertices.length = 0;
            this._replacedDisplayDataSet.length = 0;
            this._zOrderDirty = false;
            this._displayDirty = false;
            this._colorDirty = false;
            this._blendModeDirty = false;
            this._originDirty = false;
            this._transformDirty = false;
            this._ffdDirty = false;
            this._zOrder = 0;
            this._displayIndex = -2;
            this._pivotX = 0;
            this._pivotY = 0;
            this._blendMode = 0 /* Normal */;
            this._display = null;
            this._localMatrix.identity();
            this._displayList.length = 0;
            this._meshBones.length = 0;
        };
        Slot.prototype._isMeshBonesUpdate = function () {
            for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._transformDirty != 0 /* None */) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @private
         */
        Slot.prototype._updatePivot = function (rawDisplayData, currentDisplayData, currentTextureData) {
            var isReplaceDisplay = rawDisplayData && rawDisplayData != currentDisplayData && (!this._meshData || this._meshData != rawDisplayData.mesh);
            if (this._meshData && this._display == this._meshDisplay) {
                this._pivotX = 0;
                this._pivotY = 0;
            }
            else {
                var scale = this._armature.armatureData.scale;
                this._pivotX = currentDisplayData.pivot.x;
                this._pivotY = currentDisplayData.pivot.y;
                if (currentDisplayData.isRelativePivot) {
                    var rect = currentTextureData.frame || currentTextureData.region;
                    var width = rect.width * scale;
                    var height = rect.height * scale;
                    if (currentTextureData.rotated) {
                        width = rect.height;
                        height = rect.width;
                    }
                    this._pivotX *= width;
                    this._pivotY *= height;
                }
                if (currentTextureData.frame) {
                    this._pivotX += currentTextureData.frame.x * scale;
                    this._pivotY += currentTextureData.frame.y * scale;
                }
            }
            if (isReplaceDisplay) {
                rawDisplayData.transform.toMatrix(Slot._helpMatrix);
                Slot._helpMatrix.invert();
                Slot._helpMatrix.transformPoint(0, 0, Slot._helpPoint);
                this._pivotX -= Slot._helpPoint.x;
                this._pivotY -= Slot._helpPoint.y;
                currentDisplayData.transform.toMatrix(Slot._helpMatrix);
                Slot._helpMatrix.invert();
                Slot._helpMatrix.transformPoint(0, 0, Slot._helpPoint);
                this._pivotX += Slot._helpPoint.x;
                this._pivotY += Slot._helpPoint.y;
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateDisplay = function () {
            var prevDisplay = this._display || this._rawDisplay;
            var prevChildArmature = this._childArmature;
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display instanceof dragonBones.Armature) {
                    this._childArmature = this._display;
                    this._display = this._childArmature._display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }
            var currentDisplay = this._display || this._rawDisplay;
            if (currentDisplay != prevDisplay) {
                this._onUpdateDisplay();
                if (prevDisplay) {
                    this._replaceDisplay(prevDisplay);
                }
                else {
                    this._addDisplay();
                }
                this._blendModeDirty = true;
                this._colorDirty = true;
            }
            // Update origin.
            if (this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
                this.origin.copyFrom(this._displayDataSet.displays[this._displayIndex].transform);
                this._originDirty = true;
            }
            // Update meshData.
            this._updateMeshData(false);
            // Update frame.
            if (currentDisplay == this._rawDisplay || currentDisplay == this._meshDisplay) {
                this._updateFrame();
            }
            // Update child armature.
            if (this._childArmature != prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    if (this.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }
                if (this._childArmature) {
                    this._childArmature._parent = this; // Update child armature parent.
                    if (this.inheritAnimation) {
                        if (this._childArmature.cacheFrameRate == 0) {
                            var cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate != 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }
                        // Child armature action.                        
                        var slotData = this._armature.armatureData.getSlot(this.name);
                        var actions = slotData.actions.length > 0 ? slotData.actions : this._childArmature.armatureData.actions;
                        if (actions.length > 0) {
                            for (var i = 0, l = actions.length; i < l; ++i) {
                                this._childArmature._bufferAction(actions[i]);
                            }
                        }
                        else {
                            this._childArmature.animation.play();
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateLocalTransformMatrix = function () {
            this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
        };
        /**
         * @private
         */
        Slot.prototype._updateGlobalTransformMatrix = function () {
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
            this.global.fromMatrix(this.globalTransformMatrix);
        };
        /**
         * @internal
         * @inheritDoc
         */
        Slot.prototype._setArmature = function (value) {
            if (this._armature == value) {
                return;
            }
            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }
            this._armature = value;
            this._onUpdateDisplay();
            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._addDisplay();
            }
            else {
                this._removeDisplay();
            }
        };
        /**
         * @internal
         * @private Armature
         */
        Slot.prototype._updateMeshData = function (isTimelineUpdate) {
            var prevMeshData = this._meshData;
            var rawMeshData = null;
            if (this._display && this._display == this._meshDisplay && this._displayIndex >= 0) {
                rawMeshData = (this._displayDataSet && this._displayIndex < this._displayDataSet.displays.length) ? this._displayDataSet.displays[this._displayIndex].mesh : null;
                var replaceDisplayData = (this._displayIndex < this._replacedDisplayDataSet.length) ? this._replacedDisplayDataSet[this._displayIndex] : null;
                var replaceMeshData = replaceDisplayData ? replaceDisplayData.mesh : null;
                this._meshData = replaceMeshData || rawMeshData;
            }
            else {
                this._meshData = null;
            }
            if (this._meshData != prevMeshData) {
                if (this._meshData && this._meshData == rawMeshData) {
                    if (this._meshData.skinned) {
                        this._meshBones.length = this._meshData.bones.length;
                        for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                            this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                        }
                        var ffdVerticesCount = 0;
                        for (var i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                            ffdVerticesCount += this._meshData.boneIndices[i].length;
                        }
                        this._ffdVertices.length = ffdVerticesCount * 2;
                    }
                    else {
                        this._meshBones.length = 0;
                        this._ffdVertices.length = this._meshData.vertices.length;
                    }
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._ffdVertices[i] = 0;
                    }
                    this._ffdDirty = true;
                }
                else {
                    this._meshBones.length = 0;
                    this._ffdVertices.length = 0;
                }
                if (isTimelineUpdate) {
                    this._armature.animation._updateFFDTimelineStates();
                }
            }
        };
        /**
         * @internal
         * @private Armature
         */
        Slot.prototype._update = function (cacheFrameIndex) {
            var self = this;
            self._blendIndex = 0;
            if (self._zOrderDirty) {
                self._zOrderDirty = false;
                self._updateZOrder();
            }
            if (self._displayDirty) {
                self._displayDirty = false;
                self._updateDisplay();
            }
            if (!self._display) {
                return;
            }
            if (self._blendModeDirty) {
                self._blendModeDirty = false;
                self._updateBlendMode();
            }
            if (self._colorDirty) {
                self._colorDirty = false;
                self._updateColor();
            }
            if (self._meshData) {
                if (self._ffdDirty || (self._meshData.skinned && self._isMeshBonesUpdate())) {
                    self._ffdDirty = false;
                    self._updateMesh();
                }
                if (self._meshData.skinned) {
                    return;
                }
            }
            if (self._originDirty) {
                self._originDirty = false;
                self._transformDirty = true;
                self._updateLocalTransformMatrix();
            }
            if (cacheFrameIndex >= 0 && self._cacheFrames) {
                var cacheFrame = self._cacheFrames[cacheFrameIndex];
                if (self.globalTransformMatrix == cacheFrame) {
                    self._transformDirty = false;
                }
                else if (cacheFrame) {
                    self._transformDirty = true;
                    self.globalTransformMatrix = cacheFrame;
                }
                else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
                else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                    self._transformDirty = false;
                    self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
                }
                else {
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
            }
            else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
                self._transformDirty = true;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            if (self._transformDirty) {
                self._transformDirty = false;
                if (self.globalTransformMatrix == self._globalTransformMatrix) {
                    self._updateGlobalTransformMatrix();
                    if (cacheFrameIndex >= 0 && self._cacheFrames && !self._cacheFrames[cacheFrameIndex]) {
                        self.globalTransformMatrix = dragonBones.SlotTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                    }
                }
                self._updateTransform();
            }
        };
        /**
         * @private Factory
         */
        Slot.prototype._setDisplayList = function (value) {
            if (value && value.length > 0) {
                if (this._displayList.length != value.length) {
                    this._displayList.length = value.length;
                }
                for (var i = 0, l = value.length; i < l; ++i) {
                    var eachDisplay = value[i];
                    if (eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                        !(eachDisplay instanceof dragonBones.Armature) && this._displayList.indexOf(eachDisplay) < 0) {
                        this._initDisplay(eachDisplay);
                    }
                    this._displayList[i] = eachDisplay;
                }
            }
            else if (this._displayList.length > 0) {
                this._displayList.length = 0;
            }
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display != this._displayList[this._displayIndex];
            }
            else {
                this._displayDirty = this._display != null;
            }
            return this._displayDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setZorder = function (value) {
            if (this._zOrder == value) {
            }
            this._zOrder = value;
            this._zOrderDirty = true;
            return this._zOrderDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setDisplayIndex = function (value) {
            if (this._displayIndex == value) {
                return false;
            }
            this._displayIndex = value;
            this._displayDirty = true;
            return this._displayDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setBlendMode = function (value) {
            if (this._blendMode == value) {
                return false;
            }
            this._blendMode = value;
            this._blendModeDirty = true;
            return true;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setColor = function (value) {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;
            return true;
        };
        /**
         * @language zh_CN
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 4.5
         */
        Slot.prototype.containsPoint = function (x, y, color) {
            if (color === void 0) { color = 0; }
            var displayData = this.displayData;
            if (!displayData || !displayData.boundingBox || (color && displayData.color != color)) {
                return false;
            }
            if (this._blendIndex == 0) {
                this._blendIndex = 1;
                this._updateLocalTransformMatrix();
                this._updateGlobalTransformMatrix();
            }
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);
            return displayData.boundingBox.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        };
        /**
         * @language zh_CN
         * 判断指定的线段与插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 4.5
         */
        Slot.prototype.intersectsSegment = function (xA, yA, xB, yB, color, intersectionPointA, intersectionPointB, normalRadians) {
            if (color === void 0) { color = 0; }
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var displayData = this.displayData;
            if (!displayData || !displayData.boundingBox || (color && displayData.color != color)) {
                return 0;
            }
            if (this._blendIndex == 0) {
                this._blendIndex = 1;
                this._updateLocalTransformMatrix();
                this._updateGlobalTransformMatrix();
            }
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(xA, yA, Slot._helpPoint);
            xA = Slot._helpPoint.x;
            yA = Slot._helpPoint.y;
            Slot._helpMatrix.transformPoint(xB, yB, Slot._helpPoint);
            xB = Slot._helpPoint.x;
            yB = Slot._helpPoint.y;
            var intersectionCount = displayData.boundingBox.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionCount == 1 || intersectionCount == 2) {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }
                    if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                if (normalRadians) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }
            return intersectionCount;
        };
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        Slot.prototype.invalidUpdate = function () {
            this._displayDirty = true;
        };
        Object.defineProperty(Slot.prototype, "displayData", {
            /**
             * @private
             */
            get: function () {
                if (this._displayIndex < 0 || this._displayIndex >= this._displayDataSet.displays.length) {
                    return null;
                }
                return this._displayDataSet.displays[this._displayIndex];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "rawDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._rawDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "meshDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._meshDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayIndex", {
            /**
             * @language zh_CN
             * 此时显示的显示对象在显示列表中的索引。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._displayIndex;
            },
            set: function (value) {
                if (this._setDisplayIndex(value)) {
                    this._update(-1);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayList", {
            /**
             * @language zh_CN
             * 包含显示对象或子骨架的显示列表。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._displayList.concat();
            },
            set: function (value) {
                var backupDisplayList = this._displayList.concat(); // Copy.
                var disposeDisplayList = [];
                if (this._setDisplayList(value)) {
                    this._update(-1);
                }
                // Release replaced render displays.
                for (var i = 0, l = backupDisplayList.length; i < l; ++i) {
                    var eachDisplay = backupDisplayList[i];
                    if (eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                        this._displayList.indexOf(eachDisplay) < 0 &&
                        disposeDisplayList.indexOf(eachDisplay) < 0) {
                        disposeDisplayList.push(eachDisplay);
                    }
                }
                for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                    var eachDisplay = disposeDisplayList[i];
                    if (eachDisplay instanceof dragonBones.Armature) {
                        eachDisplay.dispose();
                    }
                    else {
                        this._disposeDisplay(eachDisplay);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "display", {
            /**
             * @language zh_CN
             * 此时显示的显示对象。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            set: function (value) {
                if (this._display == value) {
                    return;
                }
                var displayListLength = this._displayList.length;
                if (this._displayIndex < 0 && displayListLength == 0) {
                    this._displayIndex = 0;
                }
                if (this._displayIndex < 0) {
                    return;
                }
                else {
                    var replaceDisplayList = this.displayList; // Copy.
                    if (displayListLength <= this._displayIndex) {
                        replaceDisplayList.length = this._displayIndex + 1;
                    }
                    replaceDisplayList[this._displayIndex] = value;
                    this.displayList = replaceDisplayList;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "childArmature", {
            /**
             * @language zh_CN
             * 此时显示的子骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._childArmature;
            },
            set: function (value) {
                if (this._childArmature == value) {
                    return;
                }
                if (value) {
                    value.display.advanceTimeBySelf(false); // Stop child armature self advanceTime.
                }
                this.display = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.getDisplay = function () {
            return this._display;
        };
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.setDisplay = function (value) {
            this.display = value;
        };
        Slot._helpPoint = new dragonBones.Point();
        Slot._helpMatrix = new dragonBones.Matrix();
        return Slot;
    }(dragonBones.TransformObject));
    dragonBones.Slot = Slot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    var EventObject = (function (_super) {
        __extends(EventObject, _super);
        /**
         * @internal
         * @private
         */
        function EventObject() {
            _super.call(this);
        }
        /**
         * @private
         */
        EventObject.toString = function () {
            return "[class dragonBones.EventObject]";
        };
        /**
         * @inheritDoc
         */
        EventObject.prototype._onClear = function () {
            this.type = null;
            this.name = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.frame = null;
            this.data = null;
            this.userData = null;
        };
        EventObject.prototype.getInt = function (index) {
            return this.data ? this.data.ints[index] : 0;
        };
        EventObject.prototype.getFloat = function (index) {
            return this.data ? this.data.floats[index] : 0;
        };
        EventObject.prototype.getString = function (index) {
            return this.data ? this.data.strings[index] : null;
        };
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        EventObject.START = "start";
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        EventObject.LOOP_COMPLETE = "loopComplete";
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        EventObject.COMPLETE = "complete";
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        EventObject.FADE_IN = "fadeIn";
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        EventObject.FADE_IN_COMPLETE = "fadeInComplete";
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        EventObject.FADE_OUT = "fadeOut";
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        EventObject.FRAME_EVENT = "frameEvent";
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        EventObject.SOUND_EVENT = "soundEvent";
        return EventObject;
    }(dragonBones.BaseObject));
    dragonBones.EventObject = EventObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var TimelineData = (function (_super) {
        __extends(TimelineData, _super);
        function TimelineData() {
            _super.call(this);
            /**
             * @private
             */
            this.frames = [];
        }
        /**
         * @private
         */
        TimelineData.toString = function () {
            return "[class dragonBones.TimelineData]";
        };
        /**
         * @inheritDoc
         */
        TimelineData.prototype._onClear = function () {
            var prevFrame = null;
            for (var i = 0, l = this.frames.length; i < l; ++i) {
                var frame = this.frames[i];
                if (prevFrame && frame != prevFrame) {
                    prevFrame.returnToPool();
                }
                prevFrame = frame;
            }
            this.scale = 1;
            this.offset = 0;
            this.frames.length = 0;
        };
        return TimelineData;
    }(dragonBones.BaseObject));
    dragonBones.TimelineData = TimelineData;
    /**
     * @private
     */
    var ZOrderTimelineData = (function (_super) {
        __extends(ZOrderTimelineData, _super);
        function ZOrderTimelineData() {
            _super.apply(this, arguments);
        }
        ZOrderTimelineData.toString = function () {
            return "[class dragonBones.ZOrderTimelineData]";
        };
        return ZOrderTimelineData;
    }(TimelineData));
    dragonBones.ZOrderTimelineData = ZOrderTimelineData;
    /**
     * @private
     */
    var BoneTimelineData = (function (_super) {
        __extends(BoneTimelineData, _super);
        function BoneTimelineData() {
            _super.call(this);
            this.originalTransform = new dragonBones.Transform();
            this.cachedFrames = [];
        }
        BoneTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        BoneTimelineData.toString = function () {
            return "[class dragonBones.BoneTimelineData]";
        };
        /**
         * @inheritDoc
         */
        BoneTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this.originalTransform.identity();
            this.cachedFrames.length = 0;
        };
        BoneTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return BoneTimelineData;
    }(TimelineData));
    dragonBones.BoneTimelineData = BoneTimelineData;
    /**
     * @private
     */
    var SlotTimelineData = (function (_super) {
        __extends(SlotTimelineData, _super);
        function SlotTimelineData() {
            _super.call(this);
            this.cachedFrames = [];
        }
        SlotTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        SlotTimelineData.toString = function () {
            return "[class dragonBones.SlotTimelineData]";
        };
        /**
         * @inheritDoc
         */
        SlotTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this.cachedFrames.length = 0;
        };
        SlotTimelineData.prototype.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return SlotTimelineData;
    }(TimelineData));
    dragonBones.SlotTimelineData = SlotTimelineData;
    /**
     * @private
     */
    var FFDTimelineData = (function (_super) {
        __extends(FFDTimelineData, _super);
        function FFDTimelineData() {
            _super.call(this);
        }
        FFDTimelineData.toString = function () {
            return "[class dragonBones.FFDTimelineData]";
        };
        /**
         * @inheritDoc
         */
        FFDTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.skin = null;
            this.slot = null;
            this.display = null;
        };
        return FFDTimelineData;
    }(TimelineData));
    dragonBones.FFDTimelineData = FFDTimelineData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    var AnimationData = (function (_super) {
        __extends(AnimationData, _super);
        /**
         * @private
         */
        function AnimationData() {
            _super.call(this);
            /**
             * @private
             */
            this.boneTimelines = {};
            /**
             * @private
             */
            this.slotTimelines = {};
            /**
             * @private
             */
            this.ffdTimelines = {}; // skin slot displayIndex
            /**
             * @private
             */
            this.cachedFrames = [];
        }
        /**
         * @private
         */
        AnimationData.toString = function () {
            return "[class dragonBones.AnimationData]";
        };
        /**
         * @inheritDoc
         */
        AnimationData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.zOrderTimeline) {
                this.zOrderTimeline.returnToPool();
            }
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].returnToPool();
                delete this.boneTimelines[i];
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].returnToPool();
                delete this.slotTimelines[i];
            }
            for (var i in this.ffdTimelines) {
                for (var j in this.ffdTimelines[i]) {
                    for (var k in this.ffdTimelines[i][j]) {
                        this.ffdTimelines[i][j][k].returnToPool();
                    }
                }
                delete this.ffdTimelines[i];
            }
            this.hasAsynchronyTimeline = false;
            this.frameCount = 0;
            this.playTimes = 0;
            this.position = 0;
            this.duration = 0;
            this.fadeInTime = 0;
            this.cacheFrameRate = 0;
            this.name = null;
            this.animation = null;
            this.zOrderTimeline = null;
            this.cachedFrames.length = 0;
        };
        /**
         * @private
         */
        AnimationData.prototype.cacheFrames = function (cacheFrameRate) {
            if (this.animation) {
                return;
            }
            this.cacheFrameRate = Math.max(Math.ceil(cacheFrameRate * this.scale), 1);
            var cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1;
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].cacheFrames(cacheFrameCount);
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].cacheFrames(cacheFrameCount);
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addBoneTimeline = function (value) {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addSlotTimeline = function (value) {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addFFDTimeline = function (value) {
            if (value && value.skin && value.slot && value.display) {
                var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.display.name]) {
                    slot[value.display.name] = value;
                }
                else {
                    throw new Error();
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.getBoneTimeline = function (name) {
            return this.boneTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getSlotTimeline = function (name) {
            return this.slotTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getFFDTimeline = function (skinName, slotName, displayName) {
            var skin = this.ffdTimelines[skinName];
            if (skin) {
                var slot = skin[slotName];
                if (slot) {
                    return slot[displayName];
                }
            }
            return null;
        };
        return AnimationData;
    }(dragonBones.TimelineData));
    dragonBones.AnimationData = AnimationData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var ArmatureData = (function (_super) {
        __extends(ArmatureData, _super);
        /**
         * @private
         */
        function ArmatureData() {
            _super.call(this);
            /**
             * @private
             */
            this.aabb = new dragonBones.Rectangle();
            /**
             * @language zh_CN
             * 所有的骨骼数据。
             * @see dragonBones.BoneData
             * @version DragonBones 3.0
             */
            this.bones = {};
            /**
             * @language zh_CN
             * 所有的插槽数据。
             * @see dragonBones.SlotData
             * @version DragonBones 3.0
             */
            this.slots = {};
            /**
             * @language zh_CN
             * 所有的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 3.0
             */
            this.skins = {};
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            this.animations = {};
            /**
             * @private
             */
            this.actions = [];
            this._sortedBones = [];
            this._sortedSlots = [];
            this._bonesChildren = {};
        }
        ArmatureData._onSortSlots = function (a, b) {
            return a.zOrder > b.zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        ArmatureData.toString = function () {
            return "[class dragonBones.ArmatureData]";
        };
        /**
         * @inheritDoc
         */
        ArmatureData.prototype._onClear = function () {
            for (var i in this.bones) {
                this.bones[i].returnToPool();
                delete this.bones[i];
            }
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
            for (var i in this.skins) {
                this.skins[i].returnToPool();
                delete this.skins[i];
            }
            for (var i in this.animations) {
                this.animations[i].returnToPool();
                delete this.animations[i];
            }
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            this.frameRate = 0;
            this.type = -1 /* None */;
            this.name = null;
            this.parent = null;
            this.userData = null;
            this.aabb.clear();
            this.actions.length = 0;
            this.cacheFrameRate = 0;
            this.scale = 1;
            for (var i in this._bonesChildren) {
                delete this._bonesChildren[i];
            }
            this._boneDirty = false;
            this._slotDirty = false;
            this._defaultSkin = null;
            this._defaultAnimation = null;
            this._sortedBones.length = 0;
            this._sortedSlots.length = 0;
        };
        ArmatureData.prototype._sortBones = function () {
            var total = this._sortedBones.length;
            if (total < 1) {
                return;
            }
            var sortHelper = this._sortedBones.concat();
            var index = 0;
            var count = 0;
            this._sortedBones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
                    this._sortedBones.push(bone);
                }
                count++;
            }
        };
        ArmatureData.prototype._sortSlots = function () {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        };
        /**
         * @private
         */
        ArmatureData.prototype.cacheFrames = function (value) {
            if (this.cacheFrameRate == value) {
                return;
            }
            this.cacheFrameRate = value;
            for (var i in this.animations) {
                this.animations[i].cacheFrames(this.cacheFrameRate);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addBone = function (value, parentName) {
            if (value && value.name && !this.bones[value.name]) {
                if (parentName) {
                    var parent_1 = this.getBone(parentName);
                    if (parent_1) {
                        value.parent = parent_1;
                    }
                    else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }
                var children = this._bonesChildren[value.name];
                if (children) {
                    for (var i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }
                    delete this._bonesChildren[value.name];
                }
                this.bones[value.name] = value;
                this._sortedBones.push(value);
                this._boneDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSlot = function (value) {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSkin = function (value) {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addAnimation = function (value) {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getBone = function (name) {
            return this.bones[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSkin = function (name) {
            return name ? this.skins[name] : this._defaultSkin;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getAnimation = function (name) {
            return name ? this.animations[name] : this._defaultAnimation;
        };
        Object.defineProperty(ArmatureData.prototype, "sortedBones", {
            /**
             * @private
             */
            get: function () {
                if (this._boneDirty) {
                    this._boneDirty = false;
                    this._sortBones();
                }
                return this._sortedBones;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "sortedSlots", {
            /**
             * @private
             */
            get: function () {
                if (this._slotDirty) {
                    this._slotDirty = false;
                    this._sortSlots();
                }
                return this._sortedSlots;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultSkin", {
            /**
             * @language zh_CN
             * 获取默认的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultSkin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultAnimation", {
            /**
             * @language zh_CN
             * 获取默认的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultAnimation;
            },
            enumerable: true,
            configurable: true
        });
        return ArmatureData;
    }(dragonBones.BaseObject));
    dragonBones.ArmatureData = ArmatureData;
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    var BoneData = (function (_super) {
        __extends(BoneData, _super);
        /**
         * @private
         */
        function BoneData() {
            _super.call(this);
            /**
             * @private
             */
            this.transform = new dragonBones.Transform();
        }
        /**
         * @private
         */
        BoneData.toString = function () {
            return "[class dragonBones.BoneData]";
        };
        /**
         * @inheritDoc
         */
        BoneData.prototype._onClear = function () {
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0;
            this.length = 0;
            this.name = null;
            this.parent = null;
            this.ik = null;
            this.transform.identity();
        };
        return BoneData;
    }(dragonBones.BaseObject));
    dragonBones.BoneData = BoneData;
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var SlotData = (function (_super) {
        __extends(SlotData, _super);
        /**
         * @private
         */
        function SlotData() {
            _super.call(this);
            /**
             * @private
             */
            this.actions = [];
        }
        /**
         * @private
         */
        SlotData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        /**
         * @private
         */
        SlotData.toString = function () {
            return "[class dragonBones.SlotData]";
        };
        /**
         * @inheritDoc
         */
        SlotData.prototype._onClear = function () {
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            this.displayIndex = 0;
            this.zOrder = 0;
            this.blendMode = 0 /* Normal */;
            this.name = null;
            this.parent = null;
            this.color = null;
            this.actions.length = 0;
        };
        /**
         * @private
         */
        SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotData;
    }(dragonBones.BaseObject));
    dragonBones.SlotData = SlotData;
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    var SkinData = (function (_super) {
        __extends(SkinData, _super);
        /**
         * @private
         */
        function SkinData() {
            _super.call(this);
            /**
             * @private
             */
            this.slots = {};
        }
        /**
         * @private
         */
        SkinData.toString = function () {
            return "[class dragonBones.SkinData]";
        };
        /**
         * @inheritDoc
         */
        SkinData.prototype._onClear = function () {
            for (var i in this.slots) {
                this.slots[i].returnToPool();
                delete this.slots[i];
            }
            this.name = null;
        };
        /**
         * @private
         */
        SkinData.prototype.addSlot = function (value) {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        SkinData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        return SkinData;
    }(dragonBones.BaseObject));
    dragonBones.SkinData = SkinData;
    /**
     * @private
     */
    var SlotDisplayDataSet = (function (_super) {
        __extends(SlotDisplayDataSet, _super);
        function SlotDisplayDataSet() {
            _super.call(this);
            this.displays = [];
        }
        SlotDisplayDataSet.toString = function () {
            return "[class dragonBones.SlotDisplayDataSet]";
        };
        /**
         * @inheritDoc
         */
        SlotDisplayDataSet.prototype._onClear = function () {
            for (var i = 0, l = this.displays.length; i < l; ++i) {
                this.displays[i].returnToPool();
            }
            this.slot = null;
            this.displays.length = 0;
        };
        return SlotDisplayDataSet;
    }(dragonBones.BaseObject));
    dragonBones.SlotDisplayDataSet = SlotDisplayDataSet;
    /**
     * @private
     */
    var DisplayData = (function (_super) {
        __extends(DisplayData, _super);
        function DisplayData() {
            _super.call(this);
            this.pivot = new dragonBones.Point();
            this.transform = new dragonBones.Transform();
        }
        DisplayData.toString = function () {
            return "[class dragonBones.DisplayData]";
        };
        /**
         * @inheritDoc
         */
        DisplayData.prototype._onClear = function () {
            if (this.mesh && !this.share) {
                this.mesh.returnToPool();
            }
            if (this.boundingBox) {
                this.boundingBox.returnToPool();
            }
            this.isRelativePivot = false;
            this.type = -1 /* None */;
            this.inheritAnimation = true;
            this.color = 0;
            this.name = null;
            this.path = null;
            this.texture = null;
            this.armature = null;
            this.mesh = null;
            this.share = null;
            this.boundingBox = null;
            this.pivot.clear();
            this.transform.identity();
        };
        return DisplayData;
    }(dragonBones.BaseObject));
    dragonBones.DisplayData = DisplayData;
    /**
     * @private
     */
    var MeshData = (function (_super) {
        __extends(MeshData, _super);
        function MeshData() {
            _super.call(this);
            this.slotPose = new dragonBones.Matrix();
            this.uvs = []; // vertices * 2
            this.vertices = []; // vertices * 2
            this.vertexIndices = []; // triangles * 3
            this.boneIndices = []; // vertices bones
            this.weights = []; // vertices bones
            this.boneVertices = []; // vertices bones * 2
            this.bones = []; // bones
            this.inverseBindPose = []; // bones
        }
        MeshData.toString = function () {
            return "[class dragonBones.MeshData]";
        };
        /**
         * @inheritDoc
         */
        MeshData.prototype._onClear = function () {
            this.skinned = false;
            this.slotPose.identity();
            this.uvs.length = 0;
            this.vertices.length = 0;
            this.vertexIndices.length = 0;
            this.boneIndices.length = 0;
            this.weights.length = 0;
            this.boneVertices.length = 0;
            this.bones.length = 0;
            this.inverseBindPose.length = 0;
        };
        return MeshData;
    }(dragonBones.BaseObject));
    dragonBones.MeshData = MeshData;
    /**
     * @private
     */
    var BoundingBoxData = (function (_super) {
        __extends(BoundingBoxData, _super);
        function BoundingBoxData() {
            _super.call(this);
            this.x = 0; // Polygon min x.
            this.y = 0; // Polygon min y.
            this.width = 0;
            this.height = 0;
            this.vertices = [];
        }
        BoundingBoxData.toString = function () {
            return "[class dragonBones.BoundingBoxData]";
        };
        /**
         * Compute the bit code for a point (x, y) using the clip rectangle
         */
        BoundingBoxData._computeOutCode = function (x, y, xMin, yMin, xMax, yMax) {
            var code = 0 /* InSide */; // initialised as being inside of [[clip window]]
            if (x < xMin) {
                code |= 1 /* Left */;
            }
            else if (x > xMax) {
                code |= 2 /* Right */;
            }
            if (y < yMin) {
                code |= 4 /* Top */;
            }
            else if (y > yMax) {
                code |= 8 /* Bottom */;
            }
            return code;
        };
        BoundingBoxData.segmentIntersectsRectangle = function (xA, yA, xB, yB, xMin, yMin, xMax, yMax, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
            var inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;
            if (inSideA && inSideB) {
                return -1;
            }
            var intersectionCount = 0;
            var outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
            var outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
            while (true) {
                if (!(outcode0 | outcode1)) {
                    intersectionCount = 2;
                    break;
                }
                else if (outcode0 & outcode1) {
                    break;
                }
                // failed both tests, so calculate the line segment to clip
                // from an outside point to an intersection with clip edge
                var x = 0;
                var y = 0;
                var normalRadian = 0;
                // At least one endpoint is outside the clip rectangle; pick it.
                var outcodeOut = outcode0 ? outcode0 : outcode1;
                // Now find the intersection point;
                if (outcodeOut & 4 /* Top */) {
                    x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                    y = yMin;
                    if (normalRadians) {
                        normalRadian = -Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & 8 /* Bottom */) {
                    x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                    y = yMax;
                    if (normalRadians) {
                        normalRadian = Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & 2 /* Right */) {
                    y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                    x = xMax;
                    if (normalRadians) {
                        normalRadian = 0;
                    }
                }
                else if (outcodeOut & 1 /* Left */) {
                    y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                    x = xMin;
                    if (normalRadians) {
                        normalRadian = Math.PI;
                    }
                }
                // Now we move outside point to intersection point to clip
                // and get ready for next pass.
                if (outcodeOut == outcode0) {
                    xA = x;
                    yA = y;
                    outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
                    if (normalRadians) {
                        normalRadians.x = normalRadian;
                    }
                }
                else {
                    xB = x;
                    yB = y;
                    outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
                    if (normalRadians) {
                        normalRadians.y = normalRadian;
                    }
                }
            }
            if (intersectionCount) {
                if (inSideA) {
                    intersectionCount = 2; // 10
                    if (intersectionPointA) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = xB;
                    }
                    if (normalRadians) {
                        normalRadians.x = normalRadians.y + Math.PI;
                    }
                }
                else if (inSideB) {
                    intersectionCount = 1; // 01
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }
                    if (normalRadians) {
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                }
            }
            return intersectionCount;
        };
        BoundingBoxData.segmentIntersectsEllipse = function (xA, yA, xB, yB, xC, yC, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var d = widthH / heightH;
            var dd = d * d;
            yA *= d;
            yB *= d;
            var dX = xB - xA;
            var dY = yB - yA;
            var lAB = Math.sqrt(dX * dX + dY * dY);
            var xD = dX / lAB;
            var yD = dY / lAB;
            var a = (xC - xA) * xD + (yC - yA) * yD;
            var aa = a * a;
            var ee = xA * xA + yA * yA;
            var rr = widthH * widthH;
            var dR = rr - ee + aa;
            var intersectionCount = 0;
            if (dR >= 0) {
                var dT = Math.sqrt(dR);
                var sA = a - dT;
                var sB = a + dT;
                var inSideA = sA < 0 ? -1 : (sA <= lAB ? 0 : 1);
                var inSideB = sB < 0 ? -1 : (sB <= lAB ? 0 : 1);
                var sideAB = inSideA * inSideB;
                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB == 0) {
                    if (inSideA == -1) {
                        intersectionCount = 2; // 10
                        xB = xA + sB * xD;
                        yB = (yA + sB * yD) / d;
                        if (intersectionPointA) {
                            intersectionPointA.x = xB;
                            intersectionPointA.y = yB;
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xB;
                            intersectionPointB.y = yB;
                        }
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else if (inSideB == 1) {
                        intersectionCount = 1; // 01
                        xA = xA + sA * xD;
                        yA = (yA + sA * yD) / d;
                        if (intersectionPointA) {
                            intersectionPointA.x = xA;
                            intersectionPointA.y = yA;
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xA;
                            intersectionPointB.y = yA;
                        }
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else {
                        intersectionCount = 3; // 11
                        if (intersectionPointA) {
                            intersectionPointA.x = xA + sA * xD;
                            intersectionPointA.y = (yA + sA * yD) / d;
                            if (normalRadians) {
                                normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                            }
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xA + sB * xD;
                            intersectionPointB.y = (yA + sB * yD) / d;
                            if (normalRadians) {
                                normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                            }
                        }
                    }
                }
            }
            return intersectionCount;
        };
        BoundingBoxData.segmentIntersectsPolygon = function (xA, yA, xB, yB, vertices, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            if (xA == xB) {
                xA = xB + 0.01;
            }
            if (yA == yB) {
                yA = yB + 0.01;
            }
            var l = vertices.length;
            var dXAB = xA - xB;
            var dYAB = yA - yB;
            var llAB = xA * yB - yA * xB;
            var intersectionCount = 0;
            var xC = vertices[l - 2];
            var yC = vertices[l - 1];
            var dMin = 0;
            var dMax = 0;
            var xMin = 0;
            var yMin = 0;
            var xMax = 0;
            var yMax = 0;
            for (var i = 0; i < l; i += 2) {
                var xD = vertices[i];
                var yD = vertices[i + 1];
                if (xC == xD) {
                    xC = xD + 0.01;
                }
                if (yC == yD) {
                    yC = yD + 0.01;
                }
                var dXCD = xC - xD;
                var dYCD = yC - yD;
                var llCD = xC * yD - yC * xD;
                var ll = dXAB * dYCD - dYAB * dXCD;
                var x = (llAB * dXCD - dXAB * llCD) / ll;
                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB == 0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    var y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB == 0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB) {
                            var d = x - xA;
                            if (d < 0) {
                                d = -d;
                            }
                            if (intersectionCount == 0) {
                                dMin = d;
                                dMax = d;
                                xMin = x;
                                yMin = y;
                                xMax = x;
                                yMax = y;
                                if (normalRadians) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    normalRadians.y = normalRadians.x;
                                }
                            }
                            else {
                                if (d < dMin) {
                                    dMin = d;
                                    xMin = x;
                                    yMin = y;
                                    if (normalRadians) {
                                        normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                                if (d > dMax) {
                                    dMax = d;
                                    xMax = x;
                                    yMax = y;
                                    if (normalRadians) {
                                        normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                            }
                            intersectionCount++;
                        }
                        else {
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            intersectionCount++;
                            if (normalRadians) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                            break;
                        }
                    }
                }
                xC = xD;
                yC = yD;
            }
            if (intersectionCount == 1) {
                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xMin;
                    intersectionPointB.y = yMin;
                }
                if (normalRadians) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else if (intersectionCount > 1) {
                intersectionCount++;
                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xMax;
                    intersectionPointB.y = yMax;
                }
            }
            return intersectionCount;
        };
        /**
         * @inheritDoc
         */
        BoundingBoxData.prototype._onClear = function () {
            this.type = -1 /* None */;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.vertices.length = 0;
        };
        BoundingBoxData.prototype.containsPoint = function (x, y) {
            var isInSide = false;
            if (this.type == 2 /* Polygon */) {
                if (x >= this.x && x <= this.width && y >= this.y && y <= this.height) {
                    for (var i = 0, l = this.vertices.length, prevIndex = l - 2; i < l; i += 2) {
                        var yA = this.vertices[prevIndex + 1];
                        var yB = this.vertices[i + 1];
                        if ((yB < y && yA >= y) || (yA < y && yB >= y)) {
                            var xA = this.vertices[prevIndex];
                            var xB = this.vertices[i];
                            if ((y - yB) * (xA - xB) / (yA - yB) + xB < x) {
                                isInSide = !isInSide;
                            }
                        }
                        prevIndex = i;
                    }
                }
            }
            else {
                var widthH = this.width * 0.5;
                if (x >= -widthH && x <= widthH) {
                    var heightH = this.height * 0.5;
                    if (y >= -heightH && y <= heightH) {
                        if (this.type == 1 /* Ellipse */) {
                            y *= widthH / heightH;
                            isInSide = Math.sqrt(x * x + y * y) <= widthH;
                        }
                        else {
                            isInSide = true;
                        }
                    }
                }
            }
            return isInSide;
        };
        BoundingBoxData.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var intersectionCount = 0;
            switch (this.type) {
                case 0 /* Rectangle */:
                    var widthH = this.width * 0.5;
                    var heightH = this.height * 0.5;
                    intersectionCount = BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, -widthH, -heightH, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians);
                    break;
                case 1 /* Ellipse */:
                    intersectionCount = BoundingBoxData.segmentIntersectsEllipse(xA, yA, xB, yB, 0, 0, this.width * 0.5, this.height * 0.5, intersectionPointA, intersectionPointB, normalRadians);
                    break;
                case 2 /* Polygon */:
                    if (BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null) != 0) {
                        intersectionCount = BoundingBoxData.segmentIntersectsPolygon(xA, yA, xB, yB, this.vertices, intersectionPointA, intersectionPointB, normalRadians);
                    }
                    break;
                default:
                    break;
            }
            return intersectionCount;
        };
        return BoundingBoxData;
    }(dragonBones.BaseObject));
    dragonBones.BoundingBoxData = BoundingBoxData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    var DragonBonesData = (function (_super) {
        __extends(DragonBonesData, _super);
        /**
         * @internal
         * @private
         */
        function DragonBonesData() {
            _super.call(this);
            /**
             * @language zh_CN
             * 所有的骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 3.0
             */
            this.armatures = {};
            this._armatureNames = [];
        }
        /**
         * @private
         */
        DragonBonesData.toString = function () {
            return "[class dragonBones.DragonBonesData]";
        };
        /**
         * @inheritDoc
         */
        DragonBonesData.prototype._onClear = function () {
            for (var i in this.armatures) {
                this.armatures[i].returnToPool();
                delete this.armatures[i];
            }
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;
            this._armatureNames.length = 0;
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        DragonBonesData.prototype.getArmature = function (name) {
            return this.armatures[name];
        };
        /**
         * @internal
         * @private
         */
        DragonBonesData.prototype.addArmature = function (value) {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        Object.defineProperty(DragonBonesData.prototype, "armatureNames", {
            /**
             * @language zh_CN
             * 所有的骨架数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureNames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        DragonBonesData.prototype.dispose = function () {
            this.returnToPool();
        };
        return DragonBonesData;
    }(dragonBones.BaseObject));
    dragonBones.DragonBonesData = DragonBonesData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ActionData = (function (_super) {
        __extends(ActionData, _super);
        function ActionData() {
            _super.call(this);
            this.data = [];
        }
        ActionData.toString = function () {
            return "[class dragonBones.ActionData]";
        };
        ActionData.prototype._onClear = function () {
            this.type = -1 /* None */;
            this.bone = null;
            this.slot = null;
            this.data.length = 0;
        };
        return ActionData;
    }(dragonBones.BaseObject));
    dragonBones.ActionData = ActionData;
    /**
     * @private
     */
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            _super.call(this);
            this.ints = [];
            this.floats = [];
            this.strings = [];
        }
        EventData.toString = function () {
            return "[class dragonBones.EventData]";
        };
        EventData.prototype._onClear = function () {
            this.type = -1 /* None */;
            this.name = null;
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
            this.bone = null;
            this.slot = null;
        };
        return EventData;
    }(dragonBones.BaseObject));
    dragonBones.EventData = EventData;
    /**
     * @private
     */
    var FrameData = (function (_super) {
        __extends(FrameData, _super);
        function FrameData() {
            _super.call(this);
        }
        /**
         * @inheritDoc
         */
        FrameData.prototype._onClear = function () {
            this.position = 0;
            this.duration = 0;
            this.prev = null;
            this.next = null;
        };
        return FrameData;
    }(dragonBones.BaseObject));
    dragonBones.FrameData = FrameData;
    /**
     * @private
     */
    var TweenFrameData = (function (_super) {
        __extends(TweenFrameData, _super);
        function TweenFrameData() {
            _super.call(this);
        }
        TweenFrameData._getCurvePoint = function (x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
            var l_t = 1 - t;
            var powA = l_t * l_t;
            var powB = t * t;
            var kA = l_t * powA;
            var kB = 3 * t * powA;
            var kC = 3 * l_t * powB;
            var kD = t * powB;
            result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
            result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
        };
        TweenFrameData.samplingEasingCurve = function (curve, samples) {
            var curveCount = curve.length;
            var result = new dragonBones.Point();
            var stepIndex = -2;
            for (var i = 0, l = samples.length; i < l; ++i) {
                var t = (i + 1) / (l + 1);
                while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) {
                    stepIndex += 6;
                }
                var isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
                var x1 = isInCurve ? curve[stepIndex] : 0;
                var y1 = isInCurve ? curve[stepIndex + 1] : 0;
                var x2 = curve[stepIndex + 2];
                var y2 = curve[stepIndex + 3];
                var x3 = curve[stepIndex + 4];
                var y3 = curve[stepIndex + 5];
                var x4 = isInCurve ? curve[stepIndex + 6] : 1;
                var y4 = isInCurve ? curve[stepIndex + 7] : 1;
                var lower = 0;
                var higher = 1;
                while (higher - lower > 0.01) {
                    var percentage = (higher + lower) / 2;
                    TweenFrameData._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, result);
                    if (t - result.x > 0) {
                        lower = percentage;
                    }
                    else {
                        higher = percentage;
                    }
                }
                samples[i] = result.y;
            }
        };
        /**
         * @inheritDoc
         */
        TweenFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenEasing = 0;
            this.curve = null;
        };
        return TweenFrameData;
    }(FrameData));
    dragonBones.TweenFrameData = TweenFrameData;
    /**
     * @private
     */
    var AnimationFrameData = (function (_super) {
        __extends(AnimationFrameData, _super);
        function AnimationFrameData() {
            _super.call(this);
            this.actions = [];
            this.events = [];
        }
        AnimationFrameData.toString = function () {
            return "[class dragonBones.AnimationFrameData]";
        };
        /**
         * @inheritDoc
         */
        AnimationFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            for (var i = 0, l = this.events.length; i < l; ++i) {
                this.events[i].returnToPool();
            }
            this.actions.length = 0;
            this.events.length = 0;
        };
        return AnimationFrameData;
    }(FrameData));
    dragonBones.AnimationFrameData = AnimationFrameData;
    /**
     * @private
     */
    var ZOrderFrameData = (function (_super) {
        __extends(ZOrderFrameData, _super);
        function ZOrderFrameData() {
            _super.call(this);
            this.zOrder = [];
        }
        /**
         * @inheritDoc
         */
        ZOrderFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.zOrder.length = 0;
        };
        return ZOrderFrameData;
    }(FrameData));
    dragonBones.ZOrderFrameData = ZOrderFrameData;
    /**
     * @private
     */
    var BoneFrameData = (function (_super) {
        __extends(BoneFrameData, _super);
        function BoneFrameData() {
            _super.call(this);
            this.transform = new dragonBones.Transform();
        }
        BoneFrameData.toString = function () {
            return "[class dragonBones.BoneFrameData]";
        };
        /**
         * @inheritDoc
         */
        BoneFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenScale = false;
            this.tweenRotate = 0;
            this.transform.identity();
        };
        return BoneFrameData;
    }(TweenFrameData));
    dragonBones.BoneFrameData = BoneFrameData;
    /**
     * @private
     */
    var SlotFrameData = (function (_super) {
        __extends(SlotFrameData, _super);
        function SlotFrameData() {
            _super.call(this);
        }
        SlotFrameData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        SlotFrameData.toString = function () {
            return "[class dragonBones.SlotFrameData]";
        };
        /**
         * @inheritDoc
         */
        SlotFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.color = null;
        };
        SlotFrameData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotFrameData;
    }(TweenFrameData));
    dragonBones.SlotFrameData = SlotFrameData;
    /**
     * @private
     */
    var ExtensionFrameData = (function (_super) {
        __extends(ExtensionFrameData, _super);
        function ExtensionFrameData() {
            _super.call(this);
            this.tweens = [];
            this.keys = [];
        }
        ExtensionFrameData.toString = function () {
            return "[class dragonBones.ExtensionFrameData]";
        };
        /**
         * @inheritDoc
         */
        ExtensionFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.type = -1 /* None */;
            this.tweens.length = 0;
            this.keys.length = 0;
        };
        return ExtensionFrameData;
    }(TweenFrameData));
    dragonBones.ExtensionFrameData = ExtensionFrameData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var DataParser = (function () {
        function DataParser() {
            this._data = null;
            this._armature = null;
            this._skin = null;
            this._slotDisplayDataSet = null;
            this._animation = null;
            this._timeline = null;
            this._isOldData = false; // For 2.x ~ 3.x
            this._isGlobalTransform = false; // For 2.x ~ 3.x
            this._isAutoTween = false; // For 2.x ~ 3.x
            this._animationTweenEasing = 0; // For 2.x ~ 3.x
            this._timelinePivot = new dragonBones.Point(); // For 2.x ~ 3.x
            this._helpPoint = new dragonBones.Point();
            this._helpTransformA = new dragonBones.Transform();
            this._helpTransformB = new dragonBones.Transform();
            this._helpMatrix = new dragonBones.Matrix();
            this._rawBones = []; // For skinned mesh
        }
        DataParser._getArmatureType = function (value) {
            switch (value.toLowerCase()) {
                case "stage":
                    return 2 /* Stage */;
                case "armature":
                    return 0 /* Armature */;
                case "movieclip":
                    return 1 /* MovieClip */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getDisplayType = function (value) {
            switch (value.toLowerCase()) {
                case "image":
                    return 0 /* Image */;
                case "mesh":
                    return 2 /* Mesh */;
                case "armature":
                    return 1 /* Armature */;
                case "boundingbox":
                    return 3 /* BoundingBox */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getBoundingBoxType = function (value) {
            switch (value.toLowerCase()) {
                case "rectangle":
                    return 0 /* Rectangle */;
                case "ellipse":
                    return 1 /* Ellipse */;
                case "polygon":
                    return 2 /* Polygon */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getBlendMode = function (value) {
            switch (value.toLowerCase()) {
                case "normal":
                    return 0 /* Normal */;
                case "add":
                    return 1 /* Add */;
                case "alpha":
                    return 2 /* Alpha */;
                case "darken":
                    return 3 /* Darken */;
                case "difference":
                    return 4 /* Difference */;
                case "erase":
                    return 5 /* Erase */;
                case "hardlight":
                    return 6 /* HardLight */;
                case "invert":
                    return 7 /* Invert */;
                case "layer":
                    return 8 /* Layer */;
                case "lighten":
                    return 9 /* Lighten */;
                case "multiply":
                    return 10 /* Multiply */;
                case "overlay":
                    return 11 /* Overlay */;
                case "screen":
                    return 12 /* Screen */;
                case "subtract":
                    return 13 /* Subtract */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getActionType = function (value) {
            switch (value.toLowerCase()) {
                case "play":
                    return 0 /* Play */;
                case "stop":
                    return 1 /* Stop */;
                case "gotoandplay":
                    return 2 /* GotoAndPlay */;
                case "gotoandstop":
                    return 3 /* GotoAndStop */;
                case "fadein":
                    return 4 /* FadeIn */;
                case "fadeout":
                    return 5 /* FadeOut */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser.prototype._getTimelineFrameMatrix = function (animation, timeline, position, transform) {
            var frameIndex = Math.floor(position * animation.frameCount / animation.duration);
            if (timeline.frames.length == 1 || frameIndex >= timeline.frames.length) {
                transform.copyFrom(timeline.frames[0].transform);
            }
            else {
                var frame = timeline.frames[frameIndex];
                var tweenProgress = 0;
                if (frame.tweenEasing != dragonBones.DragonBones.NO_TWEEN) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    if (frame.tweenEasing != 0) {
                        tweenProgress = dragonBones.TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                    }
                }
                else if (frame.curve) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    tweenProgress = dragonBones.TweenTimelineState._getEasingCurveValue(tweenProgress, frame.curve);
                }
                var nextFrame = frame.next;
                transform.x = nextFrame.transform.x - frame.transform.x;
                transform.y = nextFrame.transform.y - frame.transform.y;
                transform.skewX = dragonBones.Transform.normalizeRadian(nextFrame.transform.skewX - frame.transform.skewX);
                transform.skewY = dragonBones.Transform.normalizeRadian(nextFrame.transform.skewY - frame.transform.skewY);
                transform.scaleX = nextFrame.transform.scaleX - frame.transform.scaleX;
                transform.scaleY = nextFrame.transform.scaleY - frame.transform.scaleY;
                transform.x = frame.transform.x + transform.x * tweenProgress;
                transform.y = frame.transform.y + transform.y * tweenProgress;
                transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
                transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
                transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
                transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
            }
            transform.add(timeline.originalTransform);
        };
        DataParser.prototype._globalToLocal = function (armature) {
            var keyFrames = new Array();
            var bones = armature.sortedBones.concat().reverse();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent) {
                    bone.parent.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.invert();
                    this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, this._helpPoint);
                    bone.transform.x = this._helpPoint.x;
                    bone.transform.y = this._helpPoint.y;
                    bone.transform.rotation -= bone.parent.transform.rotation;
                }
                for (var i_2 in armature.animations) {
                    var animation = armature.animations[i_2];
                    var timeline = animation.getBoneTimeline(bone.name);
                    if (!timeline) {
                        continue;
                    }
                    var parentTimeline = bone.parent ? animation.getBoneTimeline(bone.parent.name) : null;
                    this._helpTransformB.copyFrom(timeline.originalTransform);
                    keyFrames.length = 0;
                    for (var i_3 = 0, l_2 = timeline.frames.length; i_3 < l_2; ++i_3) {
                        var frame = timeline.frames[i_3];
                        if (keyFrames.indexOf(frame) >= 0) {
                            continue;
                        }
                        keyFrames.push(frame);
                        if (parentTimeline) {
                            this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransformA);
                            frame.transform.add(this._helpTransformB);
                            this._helpTransformA.toMatrix(this._helpMatrix);
                            this._helpMatrix.invert();
                            this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, this._helpPoint);
                            frame.transform.x = this._helpPoint.x;
                            frame.transform.y = this._helpPoint.y;
                            frame.transform.rotation -= this._helpTransformA.rotation;
                        }
                        else {
                            frame.transform.add(this._helpTransformB);
                        }
                        frame.transform.minus(bone.transform);
                        if (i_3 == 0) {
                            timeline.originalTransform.copyFrom(frame.transform);
                            frame.transform.identity();
                        }
                        else {
                            frame.transform.minus(timeline.originalTransform);
                        }
                    }
                }
            }
        };
        DataParser.prototype._mergeFrameToAnimationTimeline = function (framePostion, actions, events) {
            var frameStart = Math.floor(framePostion * this._armature.frameRate); // uint()
            var frames = this._animation.frames;
            if (frames.length == 0) {
                var startFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add start frame.
                startFrame.position = 0;
                if (this._animation.frameCount > 1) {
                    frames.length = this._animation.frameCount + 1; // One more count for zero duration frame.
                    var endFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add end frame to keep animation timeline has two different frames atleast.
                    endFrame.position = this._animation.frameCount / this._armature.frameRate;
                    frames[0] = startFrame;
                    frames[this._animation.frameCount] = endFrame;
                }
            }
            var insertedFrame = null;
            var replacedFrame = frames[frameStart];
            if (replacedFrame && (frameStart == 0 || frames[frameStart - 1] == replacedFrame.prev)) {
                insertedFrame = replacedFrame;
            }
            else {
                insertedFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Create frame.
                insertedFrame.position = frameStart / this._armature.frameRate;
                frames[frameStart] = insertedFrame;
                for (var i = frameStart + 1, l = frames.length; i < l; ++i) {
                    if (replacedFrame && frames[i] == replacedFrame) {
                        frames[i] = null;
                    }
                }
            }
            if (actions) {
                for (var i = 0, l = actions.length; i < l; ++i) {
                    insertedFrame.actions.push(actions[i]);
                }
            }
            if (events) {
                for (var i = 0, l = events.length; i < l; ++i) {
                    insertedFrame.events.push(events[i]);
                }
            }
            // Modify frame link and duration.
            var prevFrame = null;
            var nextFrame = null;
            for (var i = 0, l = frames.length; i < l; ++i) {
                var currentFrame = frames[i];
                if (currentFrame && nextFrame != currentFrame) {
                    nextFrame = currentFrame;
                    if (prevFrame) {
                        nextFrame.prev = prevFrame;
                        prevFrame.next = nextFrame;
                        prevFrame.duration = nextFrame.position - prevFrame.position;
                    }
                    prevFrame = nextFrame;
                }
                else {
                    frames[i] = prevFrame;
                }
            }
            nextFrame.duration = this._animation.duration - nextFrame.position;
            nextFrame = frames[0];
            prevFrame.next = nextFrame;
            nextFrame.prev = prevFrame;
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        DataParser.parseDragonBonesData = function (rawData) {
            return dragonBones.ObjectDataParser.getInstance().parseDragonBonesData(rawData);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        DataParser.parseTextureAtlasData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var textureAtlasData = {};
            var subTextureList = rawData[DataParser.SUB_TEXTURE];
            for (var i = 0, len = subTextureList.length; i < len; i++) {
                var subTextureObject = subTextureList[i];
                var subTextureName = subTextureObject[DataParser.NAME];
                var subTextureRegion = new dragonBones.Rectangle();
                var subTextureFrame = null;
                subTextureRegion.x = subTextureObject[DataParser.X] / scale;
                subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
                subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
                subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;
                if (DataParser.FRAME_WIDTH in subTextureObject) {
                    subTextureFrame = new dragonBones.Rectangle();
                    subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                    subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                    subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                    subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
                }
                textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
            }
            return textureAtlasData;
        };
        DataParser.DATA_VERSION_2_3 = "2.3";
        DataParser.DATA_VERSION_3_0 = "3.0";
        DataParser.DATA_VERSION_4_0 = "4.0";
        DataParser.DATA_VERSION = "4.5";
        DataParser.TEXTURE_ATLAS = "TextureAtlas";
        DataParser.SUB_TEXTURE = "SubTexture";
        DataParser.FORMAT = "format";
        DataParser.IMAGE_PATH = "imagePath";
        DataParser.WIDTH = "width";
        DataParser.HEIGHT = "height";
        DataParser.ROTATED = "rotated";
        DataParser.FRAME_X = "frameX";
        DataParser.FRAME_Y = "frameY";
        DataParser.FRAME_WIDTH = "frameWidth";
        DataParser.FRAME_HEIGHT = "frameHeight";
        DataParser.DRADON_BONES = "dragonBones";
        DataParser.ARMATURE = "armature";
        DataParser.BONE = "bone";
        DataParser.IK = "ik";
        DataParser.SLOT = "slot";
        DataParser.SKIN = "skin";
        DataParser.DISPLAY = "display";
        DataParser.ANIMATION = "animation";
        DataParser.Z_ORDER = "zOrder";
        DataParser.FFD = "ffd";
        DataParser.FRAME = "frame";
        DataParser.EVENTS = "events";
        DataParser.ACTIONS = "actions";
        DataParser.INTS = "ints";
        DataParser.FLOATS = "floats";
        DataParser.STRINGS = "strings";
        DataParser.PIVOT = "pivot";
        DataParser.TRANSFORM = "transform";
        DataParser.AABB = "aabb";
        DataParser.COLOR = "color";
        DataParser.FILTER = "filter";
        DataParser.VERSION = "version";
        DataParser.IS_GLOBAL = "isGlobal";
        DataParser.FRAME_RATE = "frameRate";
        DataParser.TYPE = "type";
        DataParser.SUB_TYPE = "subType";
        DataParser.NAME = "name";
        DataParser.PARENT = "parent";
        DataParser.SHARE = "share";
        DataParser.LENGTH = "length";
        DataParser.DATA = "data";
        DataParser.DISPLAY_INDEX = "displayIndex";
        DataParser.BLEND_MODE = "blendMode";
        DataParser.INHERIT_TRANSLATION = "inheritTranslation";
        DataParser.INHERIT_ROTATION = "inheritRotation";
        DataParser.INHERIT_SCALE = "inheritScale";
        DataParser.INHERIT_ANIMATION = "inheritAnimation";
        DataParser.TARGET = "target";
        DataParser.BEND_POSITIVE = "bendPositive";
        DataParser.CHAIN = "chain";
        DataParser.WEIGHT = "weight";
        DataParser.FADE_IN_TIME = "fadeInTime";
        DataParser.PLAY_TIMES = "playTimes";
        DataParser.SCALE = "scale";
        DataParser.OFFSET = "offset";
        DataParser.POSITION = "position";
        DataParser.DURATION = "duration";
        DataParser.TWEEN_EASING = "tweenEasing";
        DataParser.TWEEN_ROTATE = "tweenRotate";
        DataParser.TWEEN_SCALE = "tweenScale";
        DataParser.CURVE = "curve";
        DataParser.GUIDE_CURVE = "guideCurve";
        DataParser.EVENT = "event";
        DataParser.SOUND = "sound";
        DataParser.ACTION = "action";
        DataParser.DEFAULT_ACTIONS = "defaultActions";
        DataParser.X = "x";
        DataParser.Y = "y";
        DataParser.SKEW_X = "skX";
        DataParser.SKEW_Y = "skY";
        DataParser.SCALE_X = "scX";
        DataParser.SCALE_Y = "scY";
        DataParser.ALPHA_OFFSET = "aO";
        DataParser.RED_OFFSET = "rO";
        DataParser.GREEN_OFFSET = "gO";
        DataParser.BLUE_OFFSET = "bO";
        DataParser.ALPHA_MULTIPLIER = "aM";
        DataParser.RED_MULTIPLIER = "rM";
        DataParser.GREEN_MULTIPLIER = "gM";
        DataParser.BLUE_MULTIPLIER = "bM";
        DataParser.UVS = "uvs";
        DataParser.VERTICES = "vertices";
        DataParser.TRIANGLES = "triangles";
        DataParser.WEIGHTS = "weights";
        DataParser.SLOT_POSE = "slotPose";
        DataParser.BONE_POSE = "bonePose";
        DataParser.TWEEN = "tween";
        DataParser.KEY = "key";
        DataParser.COLOR_TRANSFORM = "colorTransform";
        DataParser.TIMELINE = "timeline";
        DataParser.PIVOT_X = "pX";
        DataParser.PIVOT_Y = "pY";
        DataParser.Z = "z";
        DataParser.LOOP = "loop";
        DataParser.AUTO_TWEEN = "autoTween";
        DataParser.HIDE = "hide";
        return DataParser;
    }());
    dragonBones.DataParser = DataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ObjectDataParser = (function (_super) {
        __extends(ObjectDataParser, _super);
        /**
         * @private
         */
        function ObjectDataParser() {
            _super.call(this);
        }
        /**
         * @private
         */
        ObjectDataParser._getBoolean = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                var valueType = typeof value;
                if (valueType == "boolean") {
                    return value;
                }
                else if (valueType == "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;
                        default:
                            return true;
                    }
                }
                else {
                    return !!value;
                }
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getNumber = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                if (value == null || value == "NaN") {
                    return defaultValue;
                }
                return +value || 0;
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getString = function (rawData, key, defaultValue) {
            if (key in rawData) {
                return String(rawData[key]);
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getParameter = function (rawData, index, defaultValue) {
            if (rawData.length > index) {
                return rawData[index];
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseArmature = function (rawData, scale) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate) || this._data.frameRate;
            armature.scale = scale;
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Armature */);
            }
            this._armature = armature;
            this._rawBones.length = 0;
            if (ObjectDataParser.AABB in rawData) {
                var aabbObject = rawData[ObjectDataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.X, 0);
                armature.aabb.y = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.Y, 0);
                armature.aabb.width = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.WIDTH, 0);
                armature.aabb.height = ObjectDataParser._getNumber(aabbObject, ObjectDataParser.HEIGHT, 0);
            }
            if (ObjectDataParser.BONE in rawData) {
                var bones = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var boneObject = bones[i];
                    var bone = this._parseBone(boneObject);
                    armature.addBone(bone, ObjectDataParser._getString(boneObject, ObjectDataParser.PARENT, null));
                    this._rawBones.push(bone);
                }
            }
            if (ObjectDataParser.IK in rawData) {
                var iks = rawData[ObjectDataParser.IK];
                for (var i = 0, l = iks.length; i < l; ++i) {
                    this._parseIK(iks[i]);
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var slots = rawData[ObjectDataParser.SLOT];
                var zOrder = 0;
                for (var i = 0, l = slots.length; i < l; ++i) {
                    armature.addSlot(this._parseSlot(slots[i], zOrder++));
                }
            }
            if (ObjectDataParser.SKIN in rawData) {
                var skins = rawData[ObjectDataParser.SKIN];
                for (var i = 0, l = skins.length; i < l; ++i) {
                    armature.addSkin(this._parseSkin(skins[i]));
                }
            }
            if (ObjectDataParser.ANIMATION in rawData) {
                var animations = rawData[ObjectDataParser.ANIMATION];
                for (var i = 0, l = animations.length; i < l; ++i) {
                    armature.addAnimation(this._parseAnimation(animations[i]));
                }
            }
            if ((ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, armature.actions, null, null);
            }
            if (this._isOldData && this._isGlobalTransform) {
                this._globalToLocal(armature);
            }
            this._armature = null;
            this._rawBones.length = 0;
            return armature;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBone = function (rawData) {
            var bone = dragonBones.BaseObject.borrowObject(dragonBones.BoneData);
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
            }
            if (this._isOldData) {
                bone.inheritScale = false;
            }
            return bone;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseIK = function (rawData) {
            var bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
            if (bone) {
                bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));
                bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
                bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
                bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1);
                if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                    bone.parent.ik = bone.ik;
                    bone.parent.chainIndex = 0;
                    bone.parent.chain = 0;
                    bone.chainIndex = 1;
                }
                else {
                    bone.chain = 0;
                    bone.chainIndex = 0;
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlot = function (rawData, zOrder) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.SlotData);
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z, zOrder); // Support 2.x ~ 3.x data.
            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
                slot.color = dragonBones.SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
            }
            else {
                slot.color = dragonBones.SlotData.DEFAULT_COLOR;
            }
            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] == "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, 0 /* Normal */);
            }
            if ((ObjectDataParser.ACTIONS in rawData) || (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, slot.actions, null, null);
            }
            if (this._isOldData) {
                if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                    slot.color = dragonBones.SlotData.generateColor();
                    this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
                }
                else {
                    slot.color = dragonBones.SlotData.DEFAULT_COLOR;
                }
            }
            return slot;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSkin = function (rawData) {
            var skin = dragonBones.BaseObject.borrowObject(dragonBones.SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;
                var slots = rawData[ObjectDataParser.SLOT];
                var zOrder = 0;
                for (var i = 0, l = slots.length; i < l; ++i) {
                    if (this._isOldData) {
                        this._armature.addSlot(this._parseSlot(slots[i], zOrder++));
                    }
                    skin.addSlot(this._parseSlotDisplaySet(slots[i]));
                }
                this._skin = null;
            }
            return skin;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotDisplaySet = function (rawData) {
            var slotDisplayDataSet = dragonBones.BaseObject.borrowObject(dragonBones.SlotDisplayDataSet);
            slotDisplayDataSet.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            if (ObjectDataParser.DISPLAY in rawData) {
                var displayObjectSet = rawData[ObjectDataParser.DISPLAY];
                var displayDataSet = slotDisplayDataSet.displays;
                this._slotDisplayDataSet = slotDisplayDataSet;
                for (var i = 0, l = displayObjectSet.length; i < l; ++i) {
                    displayDataSet.push(this._parseDisplay(displayObjectSet[i]));
                }
                this._slotDisplayDataSet = null;
            }
            return slotDisplayDataSet;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseDisplay = function (rawData) {
            var display = dragonBones.BaseObject.borrowObject(dragonBones.DisplayData);
            display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            display.path = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, display.name);
            display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ANIMATION, true);
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Image */);
            }
            display.isRelativePivot = true;
            if (ObjectDataParser.PIVOT in rawData) {
                var pivotObject = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
                display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
            }
            else if (this._isOldData) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                display.isRelativePivot = false;
                display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armature.scale;
                display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armature.scale;
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
            }
            switch (display.type) {
                case 0 /* Image */:
                    break;
                case 1 /* Armature */:
                    break;
                case 2 /* Mesh */:
                    var shareMeshName = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, null);
                    if (shareMeshName) {
                        for (var i = 0, l = this._slotDisplayDataSet.displays.length; i < l; ++i) {
                            var eachDisplay = this._slotDisplayDataSet.displays[i];
                            if (eachDisplay.name == shareMeshName) {
                                display.share = eachDisplay;
                                display.mesh = eachDisplay.mesh;
                                break;
                            }
                        }
                    }
                    else {
                        display.mesh = this._parseMesh(rawData);
                    }
                    break;
                case 3 /* BoundingBox */:
                    display.boundingBox = this._BoundingBox(rawData);
                    break;
                default:
                    break;
            }
            return display;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._BoundingBox = function (rawData) {
            var boundingBox = dragonBones.BaseObject.borrowObject(dragonBones.BoundingBoxData);
            if (ObjectDataParser.SUB_TYPE in rawData && typeof rawData[ObjectDataParser.SUB_TYPE] == "string") {
                boundingBox.type = ObjectDataParser._getBoundingBoxType(rawData[ObjectDataParser.SUB_TYPE]);
            }
            else {
                boundingBox.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.SUB_TYPE, 0 /* Rectangle */);
            }
            switch (boundingBox.type) {
                case 0 /* Rectangle */:
                case 1 /* Ellipse */:
                    boundingBox.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0);
                    break;
                case 2 /* Polygon */:
                    if (ObjectDataParser.VERTICES in rawData) {
                        var rawVertices = rawData[ObjectDataParser.VERTICES];
                        boundingBox.vertices.length = rawVertices.length;
                        for (var i = 0, l = rawVertices.length; i < l; i += 2) {
                            var iN = i + 1;
                            var x = rawVertices[i];
                            var y = rawVertices[iN];
                            boundingBox.vertices[i] = x;
                            boundingBox.vertices[iN] = y;
                            // AABB.
                            if (i == 0) {
                                boundingBox.x = x;
                                boundingBox.y = y;
                                boundingBox.width = x;
                                boundingBox.height = y;
                            }
                            else {
                                if (x < boundingBox.x) {
                                    boundingBox.x = x;
                                }
                                else if (x > boundingBox.width) {
                                    boundingBox.width = x;
                                }
                                if (y < boundingBox.y) {
                                    boundingBox.y = y;
                                }
                                else if (y > boundingBox.height) {
                                    boundingBox.height = y;
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            return boundingBox;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseMesh = function (rawData) {
            var mesh = dragonBones.BaseObject.borrowObject(dragonBones.MeshData);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var rawUVs = rawData[ObjectDataParser.UVS];
            var rawTriangles = rawData[ObjectDataParser.TRIANGLES];
            var numVertices = Math.floor(rawVertices.length / 2); // uint
            var numTriangles = Math.floor(rawTriangles.length / 3); // uint
            var inverseBindPose = new Array(this._armature.sortedBones.length);
            mesh.skinned = (ObjectDataParser.WEIGHTS in rawData) && rawData[ObjectDataParser.WEIGHTS].length > 0;
            mesh.uvs.length = numVertices * 2;
            mesh.vertices.length = numVertices * 2;
            mesh.vertexIndices.length = numTriangles * 3;
            if (mesh.skinned) {
                mesh.boneIndices.length = numVertices;
                mesh.weights.length = numVertices;
                mesh.boneVertices.length = numVertices;
                if (ObjectDataParser.SLOT_POSE in rawData) {
                    var rawSlotPose = rawData[ObjectDataParser.SLOT_POSE];
                    mesh.slotPose.a = rawSlotPose[0];
                    mesh.slotPose.b = rawSlotPose[1];
                    mesh.slotPose.c = rawSlotPose[2];
                    mesh.slotPose.d = rawSlotPose[3];
                    mesh.slotPose.tx = rawSlotPose[4] * this._armature.scale;
                    mesh.slotPose.ty = rawSlotPose[5] * this._armature.scale;
                }
                if (ObjectDataParser.BONE_POSE in rawData) {
                    var rawBonePose = rawData[ObjectDataParser.BONE_POSE];
                    for (var i = 0, l = rawBonePose.length; i < l; i += 7) {
                        var rawBoneIndex = rawBonePose[i]; // uint
                        var boneMatrix = inverseBindPose[rawBoneIndex] = new dragonBones.Matrix();
                        boneMatrix.a = rawBonePose[i + 1];
                        boneMatrix.b = rawBonePose[i + 2];
                        boneMatrix.c = rawBonePose[i + 3];
                        boneMatrix.d = rawBonePose[i + 4];
                        boneMatrix.tx = rawBonePose[i + 5] * this._armature.scale;
                        boneMatrix.ty = rawBonePose[i + 6] * this._armature.scale;
                        boneMatrix.invert();
                    }
                }
            }
            for (var i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
                var iN = i + 1;
                var vertexIndex = i / 2;
                var x = mesh.vertices[i] = rawVertices[i] * this._armature.scale;
                var y = mesh.vertices[iN] = rawVertices[iN] * this._armature.scale;
                mesh.uvs[i] = rawUVs[i];
                mesh.uvs[iN] = rawUVs[iN];
                if (mesh.skinned) {
                    var rawWeights = rawData[ObjectDataParser.WEIGHTS];
                    var numBones = rawWeights[iW]; // uint
                    var indices = mesh.boneIndices[vertexIndex] = new Array(numBones);
                    var weights = mesh.weights[vertexIndex] = new Array(numBones);
                    var boneVertices = mesh.boneVertices[vertexIndex] = new Array(numBones * 2);
                    mesh.slotPose.transformPoint(x, y, this._helpPoint);
                    x = mesh.vertices[i] = this._helpPoint.x;
                    y = mesh.vertices[iN] = this._helpPoint.y;
                    for (var iB = 0; iB < numBones; ++iB) {
                        var iI = iW + 1 + iB * 2;
                        var rawBoneIndex = rawWeights[iI]; // uint
                        var boneData = this._rawBones[rawBoneIndex];
                        var boneIndex = mesh.bones.indexOf(boneData);
                        if (boneIndex < 0) {
                            boneIndex = mesh.bones.length;
                            mesh.bones[boneIndex] = boneData;
                            mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                        }
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);
                        indices[iB] = boneIndex;
                        weights[iB] = rawWeights[iI + 1];
                        boneVertices[iB * 2] = this._helpPoint.x;
                        boneVertices[iB * 2 + 1] = this._helpPoint.y;
                    }
                    iW += numBones * 2 + 1;
                }
            }
            for (var i = 0, l = rawTriangles.length; i < l; ++i) {
                mesh.vertexIndices[i] = rawTriangles[i];
            }
            return mesh;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimation = function (rawData) {
            var animation = dragonBones.BaseObject.borrowObject(dragonBones.AnimationData);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.position = ObjectDataParser._getNumber(rawData, ObjectDataParser.POSITION, 0) / this._armature.frameRate;
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
            this._animation = animation;
            var animationName = ObjectDataParser._getString(rawData, ObjectDataParser.ANIMATION, null);
            if (animationName) {
                animation.animation = this._armature.getAnimation(animationName);
                if (!animation.animation) {
                }
                return animation;
            }
            this._parseTimeline(rawData, animation, this._parseAnimationFrame);
            if (ObjectDataParser.Z_ORDER in rawData) {
                animation.zOrderTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderTimelineData);
                this._parseTimeline(rawData[ObjectDataParser.Z_ORDER], animation.zOrderTimeline, this._parseZOrderFrame);
            }
            if (ObjectDataParser.BONE in rawData) {
                var boneTimelines = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = boneTimelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var slotTimelines = rawData[ObjectDataParser.SLOT];
                for (var i = 0, l = slotTimelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
                }
            }
            if (ObjectDataParser.FFD in rawData) {
                var ffdTimelines = rawData[ObjectDataParser.FFD];
                for (var i = 0, l = ffdTimelines.length; i < l; ++i) {
                    animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
                }
            }
            if (this._isOldData) {
                this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
                this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
                animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);
                if (ObjectDataParser.TIMELINE in rawData) {
                    var timelineObjects = rawData[ObjectDataParser.TIMELINE];
                    for (var i = 0, l = timelineObjects.length; i < l; ++i) {
                        var timelineObject = timelineObjects[i];
                        animation.addBoneTimeline(this._parseBoneTimeline(timelineObject));
                        animation.addSlotTimeline(this._parseSlotTimeline(timelineObject));
                    }
                }
            }
            else {
                this._isAutoTween = false;
                this._animationTweenEasing = 0;
            }
            for (var i in this._armature.bones) {
                var bone = this._armature.bones[i];
                if (!animation.getBoneTimeline(bone.name)) {
                    var boneTimeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
                    var boneFrame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
                    boneTimeline.bone = bone;
                    boneTimeline.frames[0] = boneFrame;
                    animation.addBoneTimeline(boneTimeline);
                }
            }
            for (var i in this._armature.slots) {
                var slot = this._armature.slots[i];
                if (!animation.getSlotTimeline(slot.name)) {
                    var slotTimeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
                    var slotFrame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
                    slotTimeline.slot = slot;
                    slotFrame.displayIndex = slot.displayIndex;
                    if (slot.color == dragonBones.SlotData.DEFAULT_COLOR) {
                        slotFrame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
                    }
                    else {
                        slotFrame.color = dragonBones.SlotFrameData.generateColor();
                        slotFrame.color.copyFrom(slot.color);
                    }
                    slotTimeline.frames[0] = slotFrame;
                    animation.addSlotTimeline(slotTimeline);
                    if (this._isOldData) {
                        slotFrame.displayIndex = -1;
                    }
                }
            }
            this._animation = null;
            return animation;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
            timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseBoneFrame);
            var originalTransform = timeline.originalTransform;
            var prevFrame = null;
            for (var i = 0, l = timeline.frames.length; i < l; ++i) {
                var frame = timeline.frames[i];
                if (!prevFrame) {
                    originalTransform.copyFrom(frame.transform);
                    frame.transform.identity();
                    if (originalTransform.scaleX == 0) {
                        originalTransform.scaleX = 0.001;
                    }
                    if (originalTransform.scaleY == 0) {
                        originalTransform.scaleY = 0.001;
                    }
                }
                else if (prevFrame != frame) {
                    frame.transform.minus(originalTransform);
                }
                prevFrame = frame;
            }
            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }
            if (this._isOldData &&
                ((ObjectDataParser.PIVOT_X in rawData) || (ObjectDataParser.PIVOT_Y in rawData))) {
                this._timelinePivot.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_X, 0);
                this._timelinePivot.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_Y, 0);
            }
            else {
                this._timelinePivot.clear();
            }
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
            timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseSlotFrame);
            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineData);
            timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
            timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null));
            var meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            for (var i = 0, l = timeline.slot.displays.length; i < l; ++i) {
                var display = timeline.slot.displays[i];
                if (display.mesh && display.name == meshName) {
                    timeline.display = display;
                    break;
                }
            }
            this._parseTimeline(rawData, timeline, this._parseFFDFrame);
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimationFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData);
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                this._parseActionData(rawData, frame.actions, null, null);
            }
            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, null, null);
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseZOrderFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderFrameData);
            this._parseFrame(rawData, frame, frameStart, frameCount);
            var rawZOrder = rawData[ObjectDataParser.Z_ORDER];
            if (rawZOrder && rawZOrder.length > 0) {
                var slotCount = this._armature.sortedSlots.length;
                var unchanged = new Array(slotCount - rawZOrder.length / 2);
                frame.zOrder.length = slotCount;
                for (var i_4 = 0; i_4 < slotCount; ++i_4) {
                    frame.zOrder[i_4] = -1;
                }
                var originalIndex = 0;
                var unchangedIndex = 0;
                for (var i_5 = 0, l = rawZOrder.length; i_5 < l; i_5 += 2) {
                    var slotIndex = rawZOrder[i_5];
                    var offset = rawZOrder[i_5 + 1];
                    while (originalIndex != slotIndex) {
                        unchanged[unchangedIndex++] = originalIndex++;
                    }
                    frame.zOrder[originalIndex + offset] = originalIndex++;
                }
                while (originalIndex < slotCount) {
                    unchanged[unchangedIndex++] = originalIndex++;
                }
                var i = slotCount;
                while (i--) {
                    if (frame.zOrder[i] == -1) {
                        frame.zOrder[i] = unchanged[--unchangedIndex];
                    }
                }
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
            frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0);
            frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if (ObjectDataParser.TRANSFORM in rawData) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                this._parseTransform(transformObject, frame.transform);
                if (this._isOldData) {
                    this._helpPoint.x = this._timelinePivot.x + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0);
                    this._helpPoint.y = this._timelinePivot.y + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0);
                    frame.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                    frame.transform.x += this._helpPoint.x;
                    frame.transform.y += this._helpPoint.y;
                }
            }
            var bone = this._timeline.bone;
            var actions = new Array();
            var events = new Array();
            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                var slot = this._armature.getSlot(bone.name);
                this._parseActionData(rawData, actions, bone, slot);
            }
            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, events, bone, null);
            }
            if (actions.length > 0 || events.length > 0) {
                this._mergeFrameToAnimationTimeline(frame.position, actions, events); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
            frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
                frame.color = dragonBones.SlotFrameData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
            }
            else {
                frame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
            }
            if (this._isOldData) {
                if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                    frame.displayIndex = -1;
                }
            }
            else if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                var slot = this._timeline.slot;
                var actions = new Array();
                this._parseActionData(rawData, actions, slot.parent, slot);
                this._mergeFrameToAnimationTimeline(frame.position, actions, null); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDFrame = function (rawData, frameStart, frameCount) {
            var ffdTimeline = this._timeline;
            var mesh = ffdTimeline.display.mesh;
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            frame.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* FFD */);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
            var x = 0;
            var y = 0;
            for (var i = 0, l = mesh.vertices.length; i < l; i += 2) {
                if (!rawVertices || i < offset || i - offset >= rawVertices.length) {
                    x = 0;
                    y = 0;
                }
                else {
                    x = rawVertices[i - offset] * this._armature.scale;
                    y = rawVertices[i + 1 - offset] * this._armature.scale;
                }
                if (mesh.skinned) {
                    mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;
                    var boneIndices = mesh.boneIndices[i / 2];
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var boneIndex = boneIndices[iB];
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                        frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                    }
                }
                else {
                    frame.tweens.push(x, y);
                }
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTweenFrame = function (rawData, frame, frameStart, frameCount) {
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if (frame.duration > 0) {
                if (ObjectDataParser.TWEEN_EASING in rawData) {
                    frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, dragonBones.DragonBones.NO_TWEEN);
                }
                else if (this._isOldData) {
                    frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : dragonBones.DragonBones.NO_TWEEN;
                }
                else {
                    frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                }
                if (this._isOldData && this._animation.scale == 1 && this._timeline.scale == 1 && frame.duration * this._armature.frameRate < 2) {
                    frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                }
                if (frameCount > 0 && (ObjectDataParser.CURVE in rawData)) {
                    frame.curve = new Array(frameCount * 2 - 1);
                    dragonBones.TweenFrameData.samplingEasingCurve(rawData[ObjectDataParser.CURVE], frame.curve);
                }
            }
            else {
                frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                frame.curve = null;
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFrame = function (rawData, frame, frameStart, frameCount) {
            frame.position = frameStart / this._armature.frameRate;
            frame.duration = frameCount / this._armature.frameRate;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTimeline = function (rawData, timeline, frameParser) {
            timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
            timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
            if (ObjectDataParser.FRAME in rawData) {
                this._timeline = timeline;
                var rawFrames = rawData[ObjectDataParser.FRAME];
                if (rawFrames.length == 1) {
                    timeline.frames.length = 1;
                    timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
                }
                else if (rawFrames.length > 1) {
                    timeline.frames.length = this._animation.frameCount + 1;
                    var frameStart = 0;
                    var frameCount = 0;
                    var frame = null;
                    var prevFrame = null;
                    for (var i = 0, iW = 0, l = timeline.frames.length; i < l; ++i) {
                        if (frameStart + frameCount <= i && iW < rawFrames.length) {
                            var frameObject = rawFrames[iW++];
                            frameStart = i;
                            frameCount = ObjectDataParser._getNumber(frameObject, ObjectDataParser.DURATION, 1);
                            frame = frameParser.call(this, frameObject, frameStart, frameCount);
                            if (prevFrame) {
                                prevFrame.next = frame;
                                frame.prev = prevFrame;
                                if (this._isOldData) {
                                    if (prevFrame instanceof dragonBones.TweenFrameData && ObjectDataParser._getNumber(frameObject, ObjectDataParser.DISPLAY_INDEX, 0) == -1) {
                                        prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                                    }
                                }
                            }
                            prevFrame = frame;
                        }
                        timeline.frames[i] = frame;
                    }
                    frame.duration = this._animation.duration - frame.position; // Modify last frame duration.
                    frame = timeline.frames[0];
                    prevFrame.next = frame;
                    frame.prev = prevFrame;
                    if (this._isOldData) {
                        if (prevFrame instanceof dragonBones.TweenFrameData && ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DISPLAY_INDEX, 0) == -1) {
                            prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                        }
                    }
                }
                this._timeline = null;
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseActionData = function (rawData, actions, bone, slot) {
            var actionsObject = rawData[ObjectDataParser.ACTION] || rawData[ObjectDataParser.ACTIONS] || rawData[ObjectDataParser.DEFAULT_ACTIONS];
            if (typeof actionsObject == "string") {
                var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                actionData.type = 4 /* FadeIn */;
                actionData.bone = bone;
                actionData.slot = slot;
                actionData.data[0] = actionsObject;
                actionData.data[1] = -1;
                actionData.data[2] = -1;
                actions.push(actionData);
            }
            else if (actionsObject instanceof Array) {
                for (var i = 0, l = actionsObject.length; i < l; ++i) {
                    var actionObject = actionsObject[i];
                    var isArray = actionObject instanceof Array;
                    var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                    var animationName = isArray ? ObjectDataParser._getParameter(actionObject, 1, null) : ObjectDataParser._getString(actionObject, "gotoAndPlay", null);
                    if (isArray) {
                        var actionType = actionObject[0];
                        if (typeof actionType == "string") {
                            actionData.type = ObjectDataParser._getActionType(actionType);
                        }
                        else {
                            actionData.type = ObjectDataParser._getParameter(actionObject, 0, 4 /* FadeIn */);
                        }
                    }
                    else {
                        actionData.type = 2 /* GotoAndPlay */;
                    }
                    switch (actionData.type) {
                        case 0 /* Play */:
                            actionData.data[0] = animationName;
                            actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, -1) : -1; // playTimes
                            break;
                        case 1 /* Stop */:
                            actionData.data[0] = animationName;
                            break;
                        case 2 /* GotoAndPlay */:
                            actionData.data[0] = animationName;
                            actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // time
                            actionData.data[2] = isArray ? ObjectDataParser._getParameter(actionObject, 3, -1) : -1; // playTimes
                            break;
                        case 3 /* GotoAndStop */:
                            actionData.data[0] = animationName;
                            actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // time
                            break;
                        case 4 /* FadeIn */:
                            actionData.data[0] = animationName;
                            actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, -1) : -1; // fadeInTime
                            actionData.data[2] = isArray ? ObjectDataParser._getParameter(actionObject, 3, -1) : -1; // playTimes
                            break;
                        case 5 /* FadeOut */:
                            actionData.data[0] = animationName;
                            actionData.data[1] = isArray ? ObjectDataParser._getParameter(actionObject, 2, 0) : 0; // fadeOutTime
                            break;
                    }
                    actionData.bone = bone;
                    actionData.slot = slot;
                    actions.push(actionData);
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseEventData = function (rawData, events, bone, slot) {
            if (ObjectDataParser.SOUND in rawData) {
                var soundEventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                soundEventData.type = 11 /* Sound */;
                soundEventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.SOUND, null);
                soundEventData.bone = bone;
                soundEventData.slot = slot;
                events.push(soundEventData);
            }
            if (ObjectDataParser.EVENT in rawData) {
                var eventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                eventData.type = 10 /* Frame */;
                eventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.EVENT, null);
                eventData.bone = bone;
                eventData.slot = slot;
                events.push(eventData);
            }
            if (ObjectDataParser.EVENTS in rawData) {
                var rawEvents = rawData[ObjectDataParser.EVENTS];
                for (var i = 0, l = rawEvents.length; i < l; ++i) {
                    var rawEvent = rawEvents[i];
                    var boneName = ObjectDataParser._getString(rawEvent, ObjectDataParser.BONE, null);
                    var eventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                    eventData.type = 10 /* Frame */;
                    eventData.name = ObjectDataParser._getString(rawEvent, ObjectDataParser.NAME, null);
                    eventData.bone = this._armature.getBone(boneName);
                    if (ObjectDataParser.INTS in rawEvent) {
                        var rawInts = rawEvent[ObjectDataParser.INTS];
                        for (var i_6 = 0, l_3 = rawInts.length; i_6 < l_3; ++i_6) {
                            eventData.ints.push(ObjectDataParser._getParameter(rawInts, i_6, 0));
                        }
                    }
                    if (ObjectDataParser.FLOATS in rawEvent) {
                        var rawFloats = rawEvent[ObjectDataParser.FLOATS];
                        for (var i_7 = 0, l_4 = rawFloats.length; i_7 < l_4; ++i_7) {
                            eventData.floats.push(ObjectDataParser._getParameter(rawFloats, i_7, 0));
                        }
                    }
                    if (ObjectDataParser.STRINGS in rawEvent) {
                        var rawStrings = rawEvent[ObjectDataParser.STRINGS];
                        for (var i_8 = 0, l_5 = rawStrings.length; i_8 < l_5; ++i_8) {
                            eventData.strings.push(ObjectDataParser._getParameter(rawStrings, i_8, null));
                        }
                    }
                    events.push(eventData);
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTransform = function (rawData, transform) {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0) * this._armature.scale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0) * this._armature.scale;
            transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1);
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseColorTransform = function (rawData, color) {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseDragonBonesData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            if (rawData) {
                var version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
                this._isOldData = version == ObjectDataParser.DATA_VERSION_2_3 || version == ObjectDataParser.DATA_VERSION_3_0;
                if (this._isOldData) {
                    this._isGlobalTransform = ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true);
                }
                else {
                    this._isGlobalTransform = false;
                }
                if (version == ObjectDataParser.DATA_VERSION ||
                    version == ObjectDataParser.DATA_VERSION_4_0 ||
                    this._isOldData) {
                    var data = dragonBones.BaseObject.borrowObject(dragonBones.DragonBonesData);
                    data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                    data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24) || 24;
                    if (ObjectDataParser.ARMATURE in rawData) {
                        this._data = data;
                        var armatures = rawData[ObjectDataParser.ARMATURE];
                        for (var i = 0, l = armatures.length; i < l; ++i) {
                            data.addArmature(this._parseArmature(armatures[i], scale));
                        }
                        this._data = null;
                    }
                    return data;
                }
                else {
                    throw new Error("Nonsupport data version.");
                }
            }
            else {
                throw new Error("No data.");
            }
            // return null;
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseTextureAtlasData = function (rawData, textureAtlasData, scale) {
            if (scale === void 0) { scale = 0; }
            if (rawData) {
                textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
                // Texture format.
                if (scale > 0) {
                    textureAtlasData.scale = scale;
                }
                else {
                    scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
                }
                scale = 1 / scale;
                if (ObjectDataParser.SUB_TEXTURE in rawData) {
                    var textures = rawData[ObjectDataParser.SUB_TEXTURE];
                    for (var i = 0, l = textures.length; i < l; ++i) {
                        var textureObject = textures[i];
                        var textureData = textureAtlasData.generateTextureData();
                        textureData.name = ObjectDataParser._getString(textureObject, ObjectDataParser.NAME, null);
                        textureData.rotated = ObjectDataParser._getBoolean(textureObject, ObjectDataParser.ROTATED, false);
                        textureData.region.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.X, 0) * scale;
                        textureData.region.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.Y, 0) * scale;
                        textureData.region.width = ObjectDataParser._getNumber(textureObject, ObjectDataParser.WIDTH, 0) * scale;
                        textureData.region.height = ObjectDataParser._getNumber(textureObject, ObjectDataParser.HEIGHT, 0) * scale;
                        var frameWidth = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_WIDTH, -1);
                        var frameHeight = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_HEIGHT, -1);
                        if (frameWidth > 0 && frameHeight > 0) {
                            textureData.frame = dragonBones.TextureData.generateRectangle();
                            textureData.frame.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_X, 0) * scale;
                            textureData.frame.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_Y, 0) * scale;
                            textureData.frame.width = frameWidth * scale;
                            textureData.frame.height = frameHeight * scale;
                        }
                        textureAtlasData.addTexture(textureData);
                    }
                }
            }
            else {
                throw new Error("No data.");
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        ObjectDataParser.getInstance = function () {
            if (!ObjectDataParser._instance) {
                ObjectDataParser._instance = new ObjectDataParser();
            }
            return ObjectDataParser._instance;
        };
        /**
         * @private
         */
        ObjectDataParser._instance = null;
        return ObjectDataParser;
    }(dragonBones.DataParser));
    dragonBones.ObjectDataParser = ObjectDataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    var TextureAtlasData = (function (_super) {
        __extends(TextureAtlasData, _super);
        /**
         * @internal
         * @private
         */
        function TextureAtlasData() {
            _super.call(this);
            /**
             * @internal
             * @private
             */
            this.textures = {};
        }
        /**
         * @inheritDoc
         */
        TextureAtlasData.prototype._onClear = function () {
            for (var i in this.textures) {
                this.textures[i].returnToPool();
                delete this.textures[i];
            }
            this.autoSearch = false;
            this.scale = 1;
            this.name = null;
            this.imagePath = null;
        };
        /**
         * @internal
         * @private
         */
        TextureAtlasData.prototype.addTexture = function (value) {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.getTexture = function (name) {
            return this.textures[name];
        };
        return TextureAtlasData;
    }(dragonBones.BaseObject));
    dragonBones.TextureAtlasData = TextureAtlasData;
    /**
     * @private
     */
    var TextureData = (function (_super) {
        __extends(TextureData, _super);
        function TextureData() {
            _super.call(this);
            this.region = new dragonBones.Rectangle();
        }
        TextureData.generateRectangle = function () {
            return new dragonBones.Rectangle();
        };
        /**
         * @inheritDoc
         */
        TextureData.prototype._onClear = function () {
            this.rotated = false;
            this.name = null;
            this.frame = null;
            this.parent = null;
            this.region.clear();
        };
        return TextureData;
    }(dragonBones.BaseObject));
    dragonBones.TextureData = TextureData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var BaseFactory = (function () {
        /**
         * @private
         */
        function BaseFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            /**
             * @language zh_CN
             * 是否开启共享搜索。 [true: 开启, false: 不开启]
             * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
             * @see dragonBones.DragonBonesData#autoSearch
             * @see dragonBones.TextureAtlasData#autoSearch
             * @version DragonBones 4.5
             */
            this.autoSearch = false;
            /**
             * @private
             */
            this._dataParser = null;
            /**
             * @private
             */
            this._dragonBonesDataMap = {};
            /**
             * @private
             */
            this._textureAtlasDataMap = {};
            this._dataParser = dataParser;
            if (!this._dataParser) {
                if (!BaseFactory._defaultParser) {
                    BaseFactory._defaultParser = new dragonBones.ObjectDataParser();
                }
                this._dataParser = BaseFactory._defaultParser;
            }
        }
        /**
         * @private
         */
        BaseFactory.prototype._getTextureData = function (textureAtlasName, textureName) {
            var textureAtlasDataList = this._textureAtlasDataMap[textureAtlasName];
            if (textureAtlasDataList) {
                for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    var textureData = textureAtlasDataList[i].getTexture(textureName);
                    if (textureData) {
                        return textureData;
                    }
                }
            }
            if (this.autoSearch) {
                for (var i in this._textureAtlasDataMap) {
                    textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (var j = 0, lJ = textureAtlasDataList.length; j < lJ; ++j) {
                        var textureAtlasData = textureAtlasDataList[j];
                        if (textureAtlasData.autoSearch) {
                            var textureData = textureAtlasData.getTexture(textureName);
                            if (textureData) {
                                return textureData;
                            }
                        }
                    }
                }
            }
            return null;
        };
        /**
         * @private
         */
        BaseFactory.prototype._fillBuildArmaturePackage = function (dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName) {
            var dragonBonesData = null;
            var armatureData = null;
            if (dragonBonesName) {
                dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                if (dragonBonesData) {
                    armatureData = dragonBonesData.getArmature(armatureName);
                }
            }
            if (!armatureData && (!dragonBonesName || this.autoSearch)) {
                for (var eachDragonBonesName in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                    if (!dragonBonesName || dragonBonesData.autoSearch) {
                        armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData) {
                            dragonBonesName = eachDragonBonesName;
                            break;
                        }
                    }
                }
            }
            if (armatureData) {
                dataPackage.dataName = dragonBonesName;
                dataPackage.textureAtlasName = textureAtlasName;
                dataPackage.data = dragonBonesData;
                dataPackage.armature = armatureData;
                dataPackage.skin = armatureData.getSkin(skinName);
                if (!dataPackage.skin) {
                    dataPackage.skin = armatureData.defaultSkin;
                }
                return true;
            }
            return false;
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildBones = function (dataPackage, armature) {
            var bones = dataPackage.armature.sortedBones;
            for (var i = 0, l = bones.length; i < l; ++i) {
                var boneData = bones[i];
                var bone = dragonBones.BaseObject.borrowObject(dragonBones.Bone);
                bone.name = boneData.name;
                bone.inheritTranslation = boneData.inheritTranslation;
                bone.inheritRotation = boneData.inheritRotation;
                bone.inheritScale = boneData.inheritScale;
                bone.length = boneData.length;
                bone.origin.copyFrom(boneData.transform);
                if (boneData.parent) {
                    armature.addBone(bone, boneData.parent.name);
                }
                else {
                    armature.addBone(bone);
                }
                if (boneData.ik) {
                    bone.ikBendPositive = boneData.bendPositive;
                    bone.ikWeight = boneData.weight;
                    bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildSlots = function (dataPackage, armature) {
            var currentSkin = dataPackage.skin;
            var defaultSkin = dataPackage.armature.defaultSkin;
            var slotDisplayDataSetMap = {};
            for (var i in defaultSkin.slots) {
                var slotDisplayDataSet = defaultSkin.slots[i];
                slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
            }
            if (currentSkin != defaultSkin) {
                for (var i in currentSkin.slots) {
                    var slotDisplayDataSet = currentSkin.slots[i];
                    slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
                }
            }
            var slots = dataPackage.armature.sortedSlots;
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slotData = slots[i];
                var slotDisplayDataSet = slotDisplayDataSetMap[slotData.name];
                if (!slotDisplayDataSet) {
                    continue;
                }
                var slot = this._generateSlot(dataPackage, slotDisplayDataSet, armature);
                if (slot) {
                    slot._displayDataSet = slotDisplayDataSet;
                    slot._setDisplayIndex(slotData.displayIndex);
                    slot._setBlendMode(slotData.blendMode);
                    slot._setColor(slotData.color);
                    armature.addSlot(slot, slotData.parent.name);
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._replaceSlotDisplay = function (dataPackage, displayData, slot, displayIndex) {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }
            if (displayIndex >= 0) {
                var displayList = slot.displayList; // Copy.
                if (displayList.length <= displayIndex) {
                    displayList.length = displayIndex + 1;
                }
                if (slot._replacedDisplayDataSet.length <= displayIndex) {
                    slot._replacedDisplayDataSet.length = displayIndex + 1;
                }
                slot._replacedDisplayDataSet[displayIndex] = displayData;
                if (displayData.type == 1 /* Armature */) {
                    var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                    displayList[displayIndex] = childArmature;
                }
                else {
                    if (!displayData.texture || dataPackage.textureAtlasName) {
                        displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                    }
                    if (displayData.mesh ||
                        (displayIndex < slot._displayDataSet.displays.length && slot._displayDataSet.displays[displayIndex].mesh)) {
                        displayList[displayIndex] = slot.meshDisplay;
                    }
                    else {
                        displayList[displayIndex] = slot.rawDisplay;
                    }
                }
                slot.displayList = displayList;
                slot.invalidUpdate();
            }
        };
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseDragonBonesData = function (rawData, name, scale) {
            if (name === void 0) { name = null; }
            if (scale === void 0) { scale = 1; }
            var dragonBonesData = this._dataParser.parseDragonBonesData(rawData, scale);
            this.addDragonBonesData(dragonBonesData, name);
            return dragonBonesData;
        };
        /**
         * @language zh_CN
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图集数据。 (JSON)
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseTextureAtlasData = function (rawData, textureAtlas, name, scale) {
            if (name === void 0) { name = null; }
            if (scale === void 0) { scale = 0; }
            var textureAtlasData = this._generateTextureAtlasData(null, null);
            this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
            this._generateTextureAtlasData(textureAtlasData, textureAtlas);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        };
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getDragonBonesData = function (name) {
            return this._dragonBonesDataMap[name];
        };
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addDragonBonesData = function (data, name) {
            if (name === void 0) { name = null; }
            if (data) {
                name = name || data.name;
                if (name) {
                    if (!this._dragonBonesDataMap[name]) {
                        this._dragonBonesDataMap[name] = data;
                    }
                    else {
                        console.warn("Same name data.", name);
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeDragonBonesData = function (name, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var dragonBonesData = this._dragonBonesDataMap[name];
            if (dragonBonesData) {
                if (disposeData) {
                    if (dragonBones.DragonBones.debug) {
                        for (var i = 0, l = dragonBones.DragonBones._armatures.length; i < l; ++i) {
                            var armature = dragonBones.DragonBones._armatures[i];
                            if (armature.armatureData.parent == dragonBonesData) {
                                throw new Error("ArmatureData: " + armature.armatureData.name + " DragonBonesData: " + name);
                            }
                        }
                    }
                    dragonBonesData.returnToPool();
                }
                delete this._dragonBonesDataMap[name];
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getTextureAtlasData = function (name) {
            return this._textureAtlasDataMap[name];
        };
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addTextureAtlasData = function (data, name) {
            if (name === void 0) { name = null; }
            if (data) {
                name = name || data.name;
                if (name) {
                    var textureAtlasList = this._textureAtlasDataMap[name] = this._textureAtlasDataMap[name] || [];
                    if (textureAtlasList.indexOf(data) < 0) {
                        textureAtlasList.push(data);
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeTextureAtlasData = function (name, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var textureAtlasDataList = this._textureAtlasDataMap[name];
            if (textureAtlasDataList) {
                if (disposeData) {
                    for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[name];
            }
        };
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。 [false: 不释放, true: 释放]
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.clear = function (disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            for (var i in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBonesDataMap[i].returnToPool();
                }
                delete this._dragonBonesDataMap[i];
            }
            for (var i in this._textureAtlasDataMap) {
                if (disposeData) {
                    var textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (var i_9 = 0, l = textureAtlasDataList.length; i_9 < l; ++i_9) {
                        textureAtlasDataList[i_9].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[i];
            }
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.buildArmature = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName)) {
                var armature = this._generateArmature(dataPackage);
                this._buildBones(dataPackage, armature);
                this._buildSlots(dataPackage, armature);
                armature.advanceTime(0); // Update armature pose.
                return armature;
            }
            console.warn("No armature data.", armatureName, dragonBonesName || "");
            return null;
        };
        /**
         * @language zh_CN
         * 将指定骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param ifRemoveOriginalAnimationList 是否移除原有的动画。 [true: 移除, false: 不移除]
         * @returns 是否替换成功。 [true: 成功, false: 不成功]
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.copyAnimationsToArmature = function (toArmature, fromArmatreName, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList) {
            if (fromSkinName === void 0) { fromSkinName = null; }
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (ifRemoveOriginalAnimationList === void 0) { ifRemoveOriginalAnimationList = true; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, fromDragonBonesDataName, fromArmatreName, fromSkinName, null)) {
                var fromArmatureData = dataPackage.armature;
                if (ifRemoveOriginalAnimationList) {
                    toArmature.animation.animations = fromArmatureData.animations;
                }
                else {
                    var animations = {};
                    for (var animationName in toArmature.animation.animations) {
                        animations[animationName] = toArmature.animation.animations[animationName];
                    }
                    for (var animationName in fromArmatureData.animations) {
                        animations[animationName] = fromArmatureData.animations[animationName];
                    }
                    toArmature.animation.animations = animations;
                }
                if (dataPackage.skin) {
                    var slots = toArmature.getSlots();
                    for (var i = 0, l = slots.length; i < l; ++i) {
                        var toSlot = slots[i];
                        var toSlotDisplayList = toSlot.displayList;
                        for (var i_10 = 0, l_6 = toSlotDisplayList.length; i_10 < l_6; ++i_10) {
                            var toDisplayObject = toSlotDisplayList[i_10];
                            if (toDisplayObject instanceof dragonBones.Armature) {
                                var displays = dataPackage.skin.getSlot(toSlot.name).displays;
                                if (i_10 < displays.length) {
                                    var fromDisplayData = displays[i_10];
                                    if (fromDisplayData.type == 1 /* Armature */) {
                                        this.copyAnimationsToArmature(toDisplayObject, fromDisplayData.path, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList);
                                    }
                                }
                            }
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        /**
         * @language zh_CN
         * 将指定插槽的显示对象替换为指定资源创造出的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplay = function (dragonBonesName, armatureName, slotName, displayName, slot, displayIndex) {
            if (displayIndex === void 0) { displayIndex = -1; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, null, null)) {
                var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        var displayData = slotDisplayDataSet.displays[i];
                        if (displayData.path == displayName) {
                            this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                            break;
                        }
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 将指定插槽的显示对象列表替换为指定资源创造出的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplayList = function (dragonBonesName, armatureName, slotName, slot) {
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, null, null)) {
                var slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    var displayIndex = 0;
                    for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        var displayData = slotDisplayDataSet.displays[i];
                        this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex++);
                    }
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype.getAllDragonBonesData = function () {
            return this._dragonBonesDataMap;
        };
        /**
         * @private
         */
        BaseFactory.prototype.getAllTextureAtlasData = function () {
            return this._textureAtlasDataMap;
        };
        BaseFactory._defaultParser = null;
        return BaseFactory;
    }());
    dragonBones.BaseFactory = BaseFactory;
})(dragonBones || (dragonBones = {}));

module.exports = dragonBones;
