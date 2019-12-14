/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en Collider component base class.
 * !#zh 碰撞组件基类
 * @class Collider
 * @extends Component
 */
var Collider = cc.Class({
    name: 'cc.Collider',
    extends: cc.Component,

    properties: {
        editing: {
            default: false,
            serializable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.collider.editing'
        },

        color: {
            type:cc.Color,
            default:cc.Color.WHITE,
            serializable: true
        },
        /**
         * world.aabb:cc.Rect
         * world.preAabb:cc.Rect
         * world.matrix:cc.mat4;
         * 
         * //CircleCollider
         * world.radius:number;
         * world.position:cc.Vec2;
         * 
         * //PolygonCollider && BoxCollider
         * world.points:cc.Vec2[]
         * 
         */
        world: {
            type:Object,
            default: null,
            serializable: false,
            visible: false
        },
        /**
         * !#en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
         * !#zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。
         * @property tag
         * @type {Integer}
         * @default 0
         */
        tag: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.tag',            
            default: 0,
            range: [0, 10e6],
            type: cc.Integer
        }
    },

    onDisable: function () {
        cc.director.getCollisionManager().removeCollider(this);
    },

    onEnable: function () {
        cc.director.getCollisionManager().addCollider(this);
    },

    /**
     * - Check whether a specific point is inside a custom bounding box in the Collider.
     * The coordinate system of the point is the inner coordinate system of the world.
     * @param x - The horizontal coordinate of the point.
     * @param y - The vertical coordinate of the point.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 检查特定点是否在碰撞体的自定义边界框内。
     * 点的坐标系为世界坐标系。
     * @param px - 点的水平坐标。
     * @param py - 点的垂直坐标。
     * @language zh_CN
     */
    containsPoint(px, py) {
        if(!this.world){
            return false;
        }

        var point = cc.v2(px, py);
        if(this instanceof cc.BoxCollider){
            console.log("cc.BoxCollider containsPoint");
            return cc.Intersection.pointInPolygon(point, this.world.points);
        }
        else if(this instanceof cc.CircleCollider){
            console.log("cc.CircleCollider containsPoint");
            let magSqr = point.subSelf(this.world.position).magSqr();
            return (magSqr <= (this.world.radius * this.world.radius));
        }
        else if(this instanceof cc.PolygonCollider){
            console.log("cc.PolygonCollider containsPoint");
            return cc.Intersection.pointInPolygon(point, this.world.points);
        }
        return false;
    }
});

cc.Collider = module.exports = Collider;
