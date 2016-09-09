var Contact = require('./CCContact');
var CollisionType = Contact.CollisionType;

/**
 * !#en
 * A simple collision manager class. 
 * It will calculate whether the collider collides other colliders, if collides then call the callbacks.
 * !#zh
 * 一个简单的碰撞组件管理类，用于处理节点之间的碰撞组件是否产生了碰撞，并调用相应回调函数。
 *
 * @class CollisionManager
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
});

 * 
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

        this._updating = false;
        this._removeList = [];

        this._debugDrawer = null;
        this._enabledDebugDraw = false;
    },

    update: function (dt) {
        if (!this.enabled) {
            return;
        }

        this._updating = true;
        
        var i, l;

        // update collider
        var colliders = this._colliders;
        for (i = 0, l = colliders.length; i < l; i++) {
            this.updateCollider(colliders[i]);
        }

        // do collide
        var contacts = this._contacts;
        
        for (i = 0, l = contacts.length; i < l; i++) {
            this.collide(contacts[i]);
        }

        this._updating = false;

        // do remove collider
        var removeList = this._removeList;
        for (i = 0, l = removeList.length; i < l; i++) {
            this.removeCollider( removeList[i] );
        }
        removeList.length = 0;

        // draw colliders
        this.drawColliders();
    },

    collide: function (contact) {
        var collisionType = contact.updateState();
        if (collisionType === CollisionType.None) {
            return;
        }

        this._doCollide(collisionType, contact);        
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
                world.points = collider.points.slice(0, collider.points.length);
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
            var rect = cc.rect(offset.x - size.width/2, offset.y - size.height/2, size.width, size.height);
            var wps = world.points;
            var wp0 = wps[0];
            var wp1 = wps[1];
            var wp2 = wps[2];
            var wp3 = wps[3];
            cc.obbApplyAffineTransform(rect, t, wp0, wp1, wp2, wp3);

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
            var p = cc.pointApplyAffineTransform(collider.offset, t);

            var tmpX = t.tx, tmpY = t.ty;
            t.tx = t.ty = 0;

            var tempP = cc.pointApplyAffineTransform(cc.v2(collider.radius, 0), t);
            var d = cc.v2(tempP).mag();

            world.radius = d;
            world.position = cc.v2(p);

            t.tx = tmpX;
            t.ty = tmpY;

            aabb.x = tmpX - d;
            aabb.y = tmpY - d;
            aabb.width = d * 2;
            aabb.height = d * 2;
        }
        else if (collider instanceof cc.PolygonCollider) {
            var points = collider.points;
            var worldPoints = world.points;

            var minx = 1e6, miny = 1e6, maxx = -1e6, maxy = -1e6;
            for (var i = 0, l = points.length; i < l; i++) {
                var p = points[i].add(offset);
                p = cc.pointApplyAffineTransform(p, t);
                worldPoints[i] = p;

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

        index = this._removeList.indexOf(collider);
        if (index !== -1) {
            this._removeList.splice(index, 1);
        }

        collider.node.on('group-changed', this.onNodeGroupChanged, this);
    },

    removeCollider: function (collider) {
        var colliders = this._colliders;
        var index = colliders.indexOf(collider);
        if (index >= 0) {
            if (this._updating) {
                var removeList = this._removeList;
                if (removeList.indexOf(collider) === -1) {
                    removeList.push(collider);
                }
            }
            else {
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
            }

            collider.node.off('group-changed', this.onNodeGroupChanged, this);
        }
        else {
            cc.error('collider not added or already removed');
        }
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
        if (!this._enabledDebugDraw || !this._debugDrawer) {
            return;
        }

        this._debugDrawer.clear();

        var colliders = this._colliders;

        for (var i = 0, l = colliders.length; i < l; i++) {
            var collider = colliders[i];

            if (collider instanceof cc.BoxCollider || collider instanceof cc.PolygonCollider) {
                this._debugDrawer.drawPoly(collider.world.points);
            }
            else if (collider instanceof cc.CircleCollider) {
                this._debugDrawer.drawCircle(collider.world.position, collider.world.radius, 0, 30);
            }

            if (this.enabledDrawBoundingBox) {
                var aabb = collider.world.aabb;
                var points = [cc.v2(aabb.xMin, aabb.yMin), cc.v2(aabb.xMin, aabb.yMax), cc.v2(aabb.xMax, aabb.yMax), cc.v2(aabb.xMax, aabb.yMin)];
                this._debugDrawer.drawPoly(points, null, 1, cc.Color.BLUE);
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
                this._debugDrawer = new cc.DrawNode();
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
