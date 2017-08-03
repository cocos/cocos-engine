(function () {


if (!window.b2) {
  window.b2 = {};
}

// Vec2
var Vec2 = b2.Vec2 = function (x_, y_) {
  if (x_ === undefined) x_ = 0;
  if (y_ === undefined) y_ = 0;
  this.x = x_;
  this.y = y_;
};
Vec2.Make = function (x_, y_) {
  if (x_ === undefined) x_ = 0;
  if (y_ === undefined) y_ = 0;
  return new Vec2(x_, y_);
};
Vec2.prototype.SetZero = function () {
  this.x = 0.0;
  this.y = 0.0;
};
Vec2.prototype.Set = function (x_, y_) {
  if (x_ === undefined) x_ = 0;
  if (y_ === undefined) y_ = 0;
  this.x = x_;
  this.y = y_;
};
Vec2.prototype.SetV = function (v) {
  this.x = v.x;
  this.y = v.y;
};
Vec2.prototype.GetNegative = function () {
  return new Vec2((-this.x), (-this.y));
};
Vec2.prototype.NegativeSelf = function () {
  this.x = (-this.x);
  this.y = (-this.y);
};
Vec2.prototype.Copy = function () {
  return new Vec2(this.x, this.y);
};
Vec2.prototype.Add = function (v) {
  this.x += v.x;
  this.y += v.y;
};
Vec2.prototype.Subtract = function (v) {
  this.x -= v.x;
  this.y -= v.y;
};
Vec2.prototype.Multiply = function (a) {
  if (a === undefined) a = 0;
  this.x *= a;
  this.y *= a;
};
// Vec2.prototype.MulM = function (A) {
//   var tX = this.x;
//   this.x = A.col1.x * tX + A.col2.x * this.y;
//   this.y = A.col1.y * tX + A.col2.y * this.y;
// };
// Vec2.prototype.MulTM = function (A) {
//   var tX = b2Math.Dot(this, A.col1);
//   this.y = b2Math.Dot(this, A.col2);
//   this.x = tX;
// };
Vec2.prototype.CrossVF = function (s) {
  if (s === undefined) s = 0;
  var tX = this.x;
  this.x = s * this.y;
  this.y = (-s * tX);
};
Vec2.prototype.CrossFV = function (s) {
  if (s === undefined) s = 0;
  var tX = this.x;
  this.x = (-s * this.y);
  this.y = s * tX;
};
Vec2.prototype.MinV = function (b) {
  this.x = this.x < b.x ? this.x : b.x;
  this.y = this.y < b.y ? this.y : b.y;
};
Vec2.prototype.MaxV = function (b) {
  this.x = this.x > b.x ? this.x : b.x;
  this.y = this.y > b.y ? this.y : b.y;
};
Vec2.prototype.Abs = function () {
  if (this.x < 0) this.x = (-this.x);
  if (this.y < 0) this.y = (-this.y);
};
Vec2.prototype.Length = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vec2.prototype.LengthSquared = function () {
  return (this.x * this.x + this.y * this.y);
};
Vec2.prototype.Normalize = function () {
  var length = Math.sqrt(this.x * this.x + this.y * this.y);
  if (length < Number.MIN_VALUE) {
     return 0.0;
  }
  var invLength = 1.0 / length;
  this.x *= invLength;
  this.y *= invLength;
  return length;
};
Vec2.IsValid = function (x) {
  if (x === undefined) x = 0;
  return isFinite(x);
};
Vec2.prototype.IsValid = function () {
  return Vec2.IsValid(this.x) && Vec2.IsValid(this.y);
};

// AABB
var AABB = b2.AABB = function () {
    this.lowerBound = new Vec2();
    this.upperBound = new Vec2();
};
AABB.prototype.IsValid = function () {
    var dX = this.upperBound.x - this.lowerBound.x;
    var dY = this.upperBound.y - this.lowerBound.y;
    var valid = dX >= 0.0 && dY >= 0.0;
    valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
    return valid;
}
AABB.prototype.GetCenter = function () {
    return new Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
}
AABB.prototype.GetExtents = function () {
    return new Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
}
AABB.prototype.Contains = function (aabb) {
    var result = true;
    result = result && this.lowerBound.x <= aabb.lowerBound.x;
    result = result && this.lowerBound.y <= aabb.lowerBound.y;
    result = result && aabb.upperBound.x <= this.upperBound.x;
    result = result && aabb.upperBound.y <= this.upperBound.y;
    return result;
}
AABB.prototype.RayCast = function (output, input) {
    var tmin = (-Number.MAX_VALUE);
    var tmax = Number.MAX_VALUE;
    var pX = input.p1.x;
    var pY = input.p1.y;
    var dX = input.p2.x - input.p1.x;
    var dY = input.p2.y - input.p1.y;
    var absDX = Math.abs(dX);
    var absDY = Math.abs(dY);
    var normal = output.normal;
    var inv_d = 0;
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var s = 0; {
        if (absDX < Number.MIN_VALUE) {
            if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
        }
        else {
            inv_d = 1.0 / dX;
            t1 = (this.lowerBound.x - pX) * inv_d;
            t2 = (this.upperBound.x - pX) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
                t3 = t1;
                t1 = t2;
                t2 = t3;
                s = 1.0;
            }
            if (t1 > tmin) {
                normal.x = s;
                normal.y = 0;
                tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
        }
    } {
        if (absDY < Number.MIN_VALUE) {
            if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
        }
        else {
            inv_d = 1.0 / dY;
            t1 = (this.lowerBound.y - pY) * inv_d;
            t2 = (this.upperBound.y - pY) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
                t3 = t1;
                t1 = t2;
                t2 = t3;
                s = 1.0;
            }
            if (t1 > tmin) {
                normal.y = s;
                normal.x = 0;
                tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
        }
    }
    output.fraction = tmin;
    return true;
}
AABB.prototype.TestOverlap = function (other) {
    var d1X = other.lowerBound.x - this.upperBound.x;
    var d1Y = other.lowerBound.y - this.upperBound.y;
    var d2X = this.lowerBound.x - other.upperBound.x;
    var d2Y = this.lowerBound.y - other.upperBound.y;
    if (d1X > 0.0 || d1Y > 0.0) return false;
    if (d2X > 0.0 || d2Y > 0.0) return false;
    return true;
}
AABB.Combine = function (aabb1, aabb2) {
    var aabb = new AABB();
    aabb.Combine(aabb1, aabb2);
    return aabb;
}
AABB.prototype.Combine = function (aabb1, aabb2) {
    this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
    this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
    this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
    this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
}

// FilterData
var FilterData = b2.FilterData = function () {
  this.categoryBits = 0x0001;
  this.maskBits = 0xFFFF;
  this.groupIndex = 0;
};
FilterData.prototype.Copy = function () {
  var copy = new FilterData();
  copy.categoryBits = this.categoryBits;
  copy.maskBits = this.maskBits;
  copy.groupIndex = this.groupIndex;
  return copy;
};

// FixtureDef
b2.FixtureDef = function () {
  this.filter = new FilterData();

  this.shape = null;
  this.userData = null;
  this.friction = 0.2;
  this.restitution = 0.0;
  this.density = 0.0;
  this.isSensor = false;
};

// b2BodyDef
b2.BodyDef = function () {
  this.position = new Vec2(0, 0);
  this.linearVelocity = new Vec2(0, 0);

  this.userData = null;
  this.angle = 0.0;
  this.angularVelocity = 0.0;
  this.linearDamping = 0.0;
  this.angularDamping = 0.0;
  this.allowSleep = true;
  this.awake = true;
  this.fixedRotation = false;
  this.bullet = false;
  this.type = b2.Body.b2_staticBody;
  this.active = true;
  this.inertiaScale = 1.0;
  this.gravityScale = 1.0;
};

b2.JointDef = function () {
  this.type = b2.Joint.e_unknownJoint;
  this.userData = null;
  this.bodyA = null;
  this.bodyB = null;
  this.collideConnected = false;
};


b2.DistanceJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_distanceJoint;
  this.localAnchorA = new Vec2();
  this.localAnchorB = new Vec2();
  this.length = 1.0;
  this.frequencyHz = 0.0;
  this.dampingRatio = 0.0;
};

b2.FrictionJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_frictionJoint;
  this.localAnchorA = new Vec2();
  this.localAnchorB = new Vec2();
  this.maxForce = 0.0;
  this.maxTorque = 0.0;
};

b2.GearJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_gearJoint;
  this.joint1 = null;
  this.joint2 = null;
  this.ratio = 1.0;
};

b2.MotorJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_motorJoint;
  this.linearOffset = new Vec2();
  this.angularOffset = 0.0;
  this.maxForce = 1.0;
  this.maxTorque = 1.0;
  this.correctionFactor = 0.3;
};

b2.MouseJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_mouseJoint;
  this.target = new Vec2();
  this.maxForce = 0.0;
  this.frequencyHz = 5.0;
  this.dampingRatio = 0.7;
};

b2.PrismaticJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_prismaticJoint;
  this.localAnchorA = new Vec2();
  this.localAnchorB = new Vec2();
  this.localAxisA = new Vec2(1.0, 0.0);
  this.referenceAngle = 0.0;
  this.enableLimit = false;
  this.lowerTranslation = 0.0;
  this.upperTranslation = 0.0;
  this.enableMotor = false;
  this.maxMotorForce = 0.0;
  this.motorSpeed = 0.0;
};

b2.PulleyJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_pulleyJoint;
  this.groundAnchorA = new Vec2(-1.0, 1.0);
  this.groundAnchorB = new Vec2(1.0, 1.0);
  this.localAnchorA = new Vec2(-1.0, 0.0);
  this.localAnchorB = new Vec2(1.0, 0.0);
  this.lengthA = 0.0;
  this.lengthB = 0.0;
  this.ratio = 1.0;
  this.collideConnected = true;
};

b2.RevoluteJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_revoluteJoint;
  this.localAnchorA = new Vec2(0.0, 0.0);
  this.localAnchorB = new Vec2(0.0, 0.0);
  this.referenceAngle = 0.0;
  this.lowerAngle = 0.0;
  this.upperAngle = 0.0;
  this.maxMotorTorque = 0.0;
  this.motorSpeed = 0.0;
  this.enableLimit = false;
  this.enableMotor = false;
};

b2.RopeJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_ropeJoint;
  this.localAnchorA = new Vec2(-1.0, 0.0);
  this.localAnchorB = new Vec2(1.0, 0.0);
  this.maxLength = 0.0;
};

b2.WeldJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_weldJoint;
  this.localAnchorA = new Vec2(0.0, 0.0);
  this.localAnchorB = new Vec2(0.0, 0.0);
  this.referenceAngle = 0.0;
  this.frequencyHz = 0.0;
  this.dampingRatio = 0.0;
};

b2.WheelJointDef = function () {
  b2.JointDef.apply(this, arguments);

  this.type = b2.Joint.e_wheelJoint;
  this.localAnchorA = new Vec2();
  this.localAnchorB = new Vec2();
  this.localAxisA = new Vec2(1.0, 0.0);
  this.enableMotor = false;
  this.maxMotorTorque = 0.0;
  this.motorSpeed = 0.0;
  this.frequencyHz = 2.0;
  this.dampingRatio = 0.7;
};

b2.WorldManifold = function ()
{
    this.normal = new b2.Vec2();                         ///< world vector pointing from A to B
    this.points = [];      ///< world contact point (point of intersection)
    this.separations = []; ///< a negative value indicates overlap, in meters
}

// b2Shape
var _p = b2.Shape.prototype;
cc.defineGetterSetter(_p, 'm_radius', _p.GetRadius, _p.SetRadius);

// b2CircleShape
_p = b2.CircleShape.prototype;
cc.defineGetterSetter(_p, 'm_p', _p.GetPosition, _p.SetPosition);

// b2Body Type
b2.Body.b2_staticBody = 0;
b2.Body.b2_kinematicBody = 1;
b2.Body.b2_dynamicBody = 2;

// b2Draw
b2.Draw.e_shapeBit              = 0x0001;   ///< draw shapes
b2.Draw.e_jointBit              = 0x0002;   ///< draw joint connections
b2.Draw.e_aabbBit               = 0x0004;   ///< draw axis aligned bounding boxes
b2.Draw.e_pairBit               = 0x0008;   ///< draw broad-phase pairs
b2.Draw.e_centerOfMassBit       = 0x0010;   ///< draw center of mass frame

// b2Joint
b2.Joint.e_unknownJoint = 0;
b2.Joint.e_revoluteJoint = 1;
b2.Joint.e_prismaticJoint = 2;
b2.Joint.e_distanceJoint = 3;
b2.Joint.e_pulleyJoint = 4;
b2.Joint.e_mouseJoint = 5;
b2.Joint.e_gearJoint = 6;
b2.Joint.e_wheelJoint = 7;
b2.Joint.e_weldJoint = 8;
b2.Joint.e_frictionJoint = 9;
b2.Joint.e_ropeJoint = 10;
b2.Joint.e_motorJoint = 11;

b2.Joint.e_inactiveLimit = 0;
b2.Joint.e_atLowerLimit = 1;
b2.Joint.e_atUpperLimit = 2;
b2.Joint.e_equalLimits = 3;

b2.maxPolygonVertices = 8;
b2.maxManifoldPoints = 2;

})();
