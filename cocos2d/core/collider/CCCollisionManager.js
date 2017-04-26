var Contact = require('./CCContact');
var CollisionType = Contact.CollisionType;

var tempRect = cc.rect();
var tempVec2 = cc.v2();

/**
 * !#en
 * A simple collision manager class. 
 * It will calculate whether the collider collides other colliders, if collides then call the callbacks.
 * !#zh
 * 一个简单的碰撞组件管理类，用于处理节点之间的碰撞组件是否产生了碰撞，并调用相应回调函数。
 *
 * @class CollisionManager
 * @uses EventTarget
 * @example
 *
 * // Get the collision manager.
 * var manager = cc.director.getCollisionManager();
 *
 * // Enabled the colider manager.
 * manager.enabled = true;
 *
 * // Enabled draw collider
 * manager.enabledDebugDraw = true;
 *
 * // Enabled draw collider bounding box
 * manager.enabledDrawBoundingBox = true;
 *
 * 
 * // Collision callback
 * onCollisionEnter: function (other, self) {
 *     this.node.color = cc.Color.RED;
 *     this.touchingNumber ++;
 *
 *     // var world = self.world;
 *     // var aabb = world.aabb;
 *     // var preAabb = world.preAabb;
 *     // var t = world.transform;
 *
 *     // for circle collider
 *     // var r = world.radius;
 *     // var p = world.position;
 *
 *     // for box collider and polygon collider
 *     // var ps = world.points;
 * },
 *   
 * onCollisionStay: function (other, self) {
 *     console.log('on collision stay');
 * },
 *   
 * onCollisionExit: function (other, self) {
 *     this.touchingNumber --;
 *     if (this.touchingNumber === 0) {
 *         this.node.color = cc.Color.WHITE;
 *     }
 * }
 */
var CollisionManager = cc.Class({
    mixins: [cc.EventTarget],

    properties: {
        /**
         * !#en
         * !#zh
         * 是否开启碰撞管理，默认为不开启
         * @property {Boolean} enabled
         * @default false
         */
        enabled: false,
        /**
         * !#en
         * !#zh
         * 是否绘制碰撞组件的包围盒，默认为不绘制
         * @property {Boolean} enabledDrawBoundingBox
         * @default false
         */
        enabledDrawBoundingBox: false
    },

    ctor: function () {
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        this._contacts = [];
        this._colliders = [];

        this._debugDrawer = null;
        this._enabledDebugDraw = false;
    },

    update: function (dt) {
        if (!this.enabled) {
            return;
        }

        var i, l;

        // update collider
        var colliders = this._colliders;
        for (i = 0, l = colliders.length; i < l; i++) {
            this.updateCollider(colliders[i]);
        }

        // do collide
        var contacts = this._contacts;
        var results = [];
        
        for (i = 0, l = contacts.length; i < l; i++) {
            var collisionType = contacts[i].updateState();
            if (collisionType === CollisionType.None) {
                continue;
            }

            results.push([collisionType, contacts[i]]);
        }

        // handle collide results, emit message
        for (i = 0, l = results.length; i < l; i++) {
            var result = results[i];
            this._doCollide(result[0], result[1]);
        }

        // draw colliders
        this.drawColliders();
    },

    _doCollide: function (collisionType, contact) {
        var contactFunc;
        switch (collisionType) {
            case CollisionType.CollisionEnter:
                contactFunc = 'onCollisionEnter';
                break;
            case CollisionType.CollisionStay:
                contactFunc = 'onCollisionStay';
                break;
            case CollisionType.CollisionExit:
                contactFunc = 'onCollisionExit';
                break;
        }

        var collider1 = contact.collider1;
        var collider2 = contact.collider2;

        var comps1 = collider1.node._components;
        var comps2 = collider2.node._components;

        var i, l, comp;
        for (i = 0, l = comps1.length; i < l; i++) {
            comp = comps1[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider2, collider1);
            }
        }

        for (i = 0, l = comps2.length; i < l; i++) {
            comp = comps2[i];
            if (comp[contactFunc]) {
                comp[contactFunc](collider1, collider2);
            }
        }
    }, 

    shouldCollide: function (c1, c2) {
        var node1 = c1.node, node2 = c2.node;
        var collisionMatrix = cc.game.collisionMatrix;
        return node1 !== node2 && collisionMatrix[node1.groupIndex][node2.groupIndex];
    },

    initCollider: function (collider) {
        if (!collider.world) {
            var world = collider.world = {};
            world.aabb = cc.rect();
            world.preAabb = cc.rect();

            world.radius = 0;

            if (collider instanceof cc.BoxCollider) {
                world.position = null;
                world.points = [cc.v2(), cc.v2(), cc.v2(), cc.v2()];
            }
            else if (collider instanceof cc.PolygonCollider) {
                world.position = null;
                world.points = collider.points.map(function (p) {
                    return cc.v2(p.x, p.y);
                });
            }
            else if (collider instanceof cc.CircleCollider) {
                world.position = cc.v2();
                world.points = null;
            }
        }
    },

    updateCollider: function (collider) {
        var offset = collider.offset;
        var world = collider.world;
        var aabb = world.aabb;
        var t = world.transform = collider.node.getNodeToWorldTransformAR();

        var preAabb = world.preAabb;
        preAabb.x = aabb.x;
        preAabb.y = aabb.y;
        preAabb.width = aabb.width;
        preAabb.height = aabb.height;

        if (collider instanceof cc.BoxCollider) {
            var size = collider.size;

            tempRect.x = offset.x - size.width/2;
            tempRect.y = offset.y - size.height/2;
            tempRect.width = size.width;
            tempRect.height = size.height;

            var wps = world.points;
            var wp0 = wps[0];
            var wp1 = wps[1];
            var wp2 = wps[2];
            var wp3 = wps[3];
            cc.obbApplyAffineTransform(tempRect, t, wp0, wp1, wp2, wp3);

            var minx = Math.min(wp0.x, wp1.x, wp2.x, wp3.x);
            var miny = Math.min(wp0.y, wp1.y, wp2.y, wp3.y);
            var maxx = Math.max(wp0.x, wp1.x, wp2.x, wp3.x);
            var maxy = Math.max(wp0.y, wp1.y, wp2.y, wp3.y);

            aabb.x = minx;
            aabb.y = miny;
            aabb.width = maxx - minx;
            aabb.height = maxy - miny;
        }
        else if (collider instanceof cc.CircleCollider) {
            // calculate world position
            var p = cc.pointApplyAffineTransform(collider.offset, t);

            world.position.x = p.x;
            world.position.y = p.y;

            // calculate world radius
            t.tx = t.ty = 0;

            tempVec2.x = collider.radius;
            tempVec2.y = 0;

            var tempP = cc.pointApplyAffineTransform(tempVec2, t);
            var d = Math.sqrt(tempP.x * tempP.x + tempP.y * tempP.y);

            world.radius = d;

            aabb.x = p.x - d;
            aabb.y = p.y - d;
            aabb.width = d * 2;
            aabb.height = d * 2;
        }
        else if (collider instanceof cc.PolygonCollider) {
            var points = collider.points;
            var worldPoints = world.points;

            worldPoints.length = points.length;

            var minx = 1e6, miny = 1e6, maxx = -1e6, maxy = -1e6;
            for (var i = 0, l = points.length; i < l; i++) {
                if (!worldPoints[i]) {
                    worldPoints[i] = cc.v2();
                }

                tempVec2.x = points[i].x + offset.x;
                tempVec2.y = points[i].y + offset.y;
                
                var p = cc.pointApplyAffineTransform(tempVec2, t);
                
                worldPoints[i].x = p.x;
                worldPoints[i].y = p.y;

                if (p.x > maxx) maxx = p.x;
                if (p.x < minx) minx = p.x;
                if (p.y > maxy) maxy = p.y;
                if (p.y < miny) miny = p.y;
            }

            aabb.x = minx;
            aabb.y = miny;
            aabb.width = maxx - minx;
            aabb.height = maxy - miny;
        }
    },

    addCollider: function (collider) {
        var colliders = this._colliders;
        var index = colliders.indexOf(collider);
        if (index === -1) {
            for (var i = 0, l = colliders.length; i < l; i++) {
                var other = colliders[i];
                if (this.shouldCollide(collider, other)) {
                    var contact = new Contact(collider, other);
                    this._contacts.push(contact);
                }
            }

            colliders.push(collider);
            this.initCollider(collider);
        }

        collider.node.on('group-changed', this.onNodeGroupChanged, this);
    },

    removeCollider: function (collider) {
        var colliders = this._colliders;
        var index = colliders.indexOf(collider);
        if (index >= 0) {
            colliders.splice(index, 1);

            var contacts = this._contacts;
            for (var i = contacts.length - 1; i >= 0; i--) {
                var contact = contacts[i];
                if (contact.collider1 === collider || contact.collider2 === collider) {
                    if (contact.touching) {
                        this._doCollide(CollisionType.CollisionExit, contact);
                    }

                    contacts.splice(i, 1);
                }
            }

            collider.node.off('group-changed', this.onNodeGroupChanged, this);
        }
        else {
            cc.errorID(6600);
        }
    },

    attachDebugDrawToCamera: function (camera) {
        if (!this._debugDrawer) return;
        camera.addTarget(this._debugDrawer);
    },
    detachDebugDrawFromCamera: function (camera) {
        if (!this._debugDrawer) return;
        camera.removeTarget(this._debugDrawer);
    },

    onNodeGroupChanged: function (event) {
        var node = event.currentTarget;
        var colliders = node.getComponents(cc.Collider);

        for (var i = 0, l = colliders.length; i < l; i++) {
            this.removeCollider(colliders[i]);
            this.addCollider(colliders[i]);
        }
    },

    drawColliders: function () {
        var debugDrawer = this._debugDrawer;
        if (!this._enabledDebugDraw || !debugDrawer) {
            return;
        }

        debugDrawer.clear();

        var colliders = this._colliders;

        for (var i = 0, l = colliders.length; i < l; i++) {
            var collider = colliders[i];

            if (collider instanceof cc.BoxCollider || collider instanceof cc.PolygonCollider) {
                var ps = collider.world.points;
                if (ps.length > 0) {
                    debugDrawer.strokeColor = cc.Color.WHITE;
                    debugDrawer.moveTo(ps[0].x, ps[0].y);
                    for (var j = 1; j < ps.length; j++) {
                        debugDrawer.lineTo(ps[j].x, ps[j].y);
                    }
                    debugDrawer.close();
                    debugDrawer.stroke();
                }
            }
            else if (collider instanceof cc.CircleCollider) {
                debugDrawer.circle(collider.world.position.x, collider.world.position.y, collider.world.radius);
                debugDrawer.stroke();
            }

            if (this.enabledDrawBoundingBox) {
                var aabb = collider.world.aabb;
                
                debugDrawer.strokeColor = cc.Color.BLUE;
                
                debugDrawer.moveTo(aabb.xMin, aabb.yMin);
                debugDrawer.lineTo(aabb.xMin, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMin);

                debugDrawer.close();
                debugDrawer.stroke();
            }
        }
    },

    onSceneLaunched: function () {
        if (this._enabledDebugDraw && this._debugDrawer) {
            this._debugDrawer.removeFromParent();
            cc.director.getScene()._sgNode.addChild(this._debugDrawer);
        }
    }
});

/**
 * !#en
 * !#zh
 * 是否绘制碰撞组件的形状，默认为不绘制
 * @property {Boolean} enabledDebugDraw
 * @default false
 */
cc.js.getset(CollisionManager.prototype, 'enabledDebugDraw', 
    function () {
        return this._enabledDebugDraw;
    },
    function (value) {
        if (value && !this._enabledDebugDraw) {
            if (!this._debugDrawer) {
                this._debugDrawer = new _ccsg.GraphicsNode();
                this._debugDrawer.retain();
            }

            cc.director.getScene()._sgNode.addChild(this._debugDrawer);
            cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
        }
        else if (!value && this._enabledDebugDraw) {
            this._debugDrawer.clear();
            this._debugDrawer.removeFromParent(false);
            cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
        }

        this._enabledDebugDraw = value;
    }
);


cc.CollisionManager = module.exports = CollisionManager;
