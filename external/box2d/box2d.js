(function()
{
'use strict';

Function.prototype._extend = function(parent)
{
    this.prototype.parent = parent;

    for (var x in parent.prototype)
    {
        if (!this.prototype[x])
            this.prototype[x] = parent.prototype[x];
    }
};

Function.prototype._implement = function(parent)
{
    return this._extend(parent);
};
var b2Profiler = (function()
{
    if (typeof(performance) === 'undefined')
        window['performance'] = { now: function() { return +new Date(); } };

    function profileStruct(name, parent)
    {
        this.name = name;
        this.parent = parent;
        this.children = {};

        this.startTime = 0;
        this.elapsedTime = 0;
        this.totalTime = 0;
        this.running = false;
        this.childrenCount = 0;
    }

    profileStruct.prototype =
    {
        // starts timer.
        start: function()
        {
            this.startTime = performance.now();
            this.running = true;
        },

        // stops timer, accumulates elapsed time.
        // may also reset start time.
        stop: function(reset)
        {
            if (!this.running)
                return;

            this.running = false;
            this.elapsedTime += performance.now() - this.startTime;

            if (reset)
                this.start();

            for (var x in this.children)
                this.children[x].stop();
        },

        // resets timer and pushes elapsed time into total
        reset: function(dontRun)
        {
            if (!dontRun)
            {
                this.running = true;
                this.totalTime += this.elapsedTime;
                this.start();
            }

            this.elapsedTime = 0;

            for (var x in this.children)
                this.children[x].reset(true);
        }
    };

    var profiles = [];
    var root = new profileStruct("root");

    function create(name, parent)
    {
        if (!profiles)
            throw new Error("late profile creation not allowed");

        var s = new profileStruct(name, parent || 'root');
        profiles.push(s);
        return s;
    }

    function destroy(profile)
    {
        profile.childrenCount--;
        delete profile.children[profile.name];
    }

    function recursiveParentCheck(node, profile)
    {
        if (node.name === profile.parent)
            return node;

        for (var x in node.children)
        {
            var n;

            if (n = recursiveParentCheck(node.children[x], profile))
                return n;
        }

        return null;
    }

    // profiles are created statically, so this has to be done
    // once in a place after all profiles are known to have been
    // made.
    function init()
    {
        // do it!
        while (profiles.length)
        {
            var p = profiles.pop();

            if (!(p.parentNode = recursiveParentCheck(root, p)))
                profiles.unshift(p);
            else
            {
                p.parentNode.children[p.name] = p;
                p.parentNode.childrenCount++;
            }
        }

        // prevent additions to it
        profiles = null;
    }

    function resetAll()
    {
        root.reset(true);
    }

    return {
        create: create,
        destroy: destroy,
        init: init,
        reset: resetAll,

        profileRoot: root
    };
}());

/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/


function b2Assert(A)
{
    if (!A)
    {
        console.log("Assertion failed! Pls debug.");
        debugger;
    }
}


var b2_maxFloat     = Number.MAX_VALUE;
var b2_epsilon      = 2.2204460492503131e-016;
var b2_pi           = Math.PI;

/// @file
/// Global tuning constants based on meters-kilograms-seconds (MKS) units.
///

// Collision

/// The maximum number of contact points between two convex shapes. Do
/// not change this value.
var b2_maxManifoldPoints        = 2;

/// The maximum number of vertices on a convex polygon. You cannot increase
/// this too much because b2BlockAllocator has a maximum object size.
var b2_maxPolygonVertices       = 8;

/// This is used to fatten AABBs in the dynamic tree. This allows proxies
/// to move by a small amount without triggering a tree adjustment.
/// This is in meters.
var b2_aabbExtension            = 0.1;

/// This is used to fatten AABBs in the dynamic tree. This is used to predict
/// the future position based on the current displacement.
/// This is a dimensionless multiplier.
var b2_aabbMultiplier           = 2.0;

/// A small length used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
var b2_linearSlop               = 0.005;

/// A small angle used as a collision and constraint tolerance. Usually it is
/// chosen to be numerically significant, but visually insignificant.
var b2_angularSlop              = (2.0 / 180.0 * b2_pi);

/// The radius of the polygon/edge shape skin. This should not be modified. Making
/// this smaller means polygons will have an insufficient buffer for continuous collision.
/// Making it larger may create artifacts for vertex collision.
var b2_polygonRadius            = (2.0 * b2_linearSlop);

/// Maximum number of sub-steps per contact in continuous physics simulation.
var b2_maxSubSteps              = 8;


// Dynamics

/// Maximum number of contacts to be handled to solve a TOI impact.
var b2_maxTOIContacts           = 32;

/// A velocity threshold for elastic collisions. Any collision with a relative linear
/// velocity below this threshold will be treated as inelastic.
var b2_velocityThreshold        = 1.0;

/// The maximum linear position correction used when solving constraints. This helps to
/// prevent overshoot.
var b2_maxLinearCorrection      = 0.2;

/// The maximum angular position correction used when solving constraints. This helps to
/// prevent overshoot.
var b2_maxAngularCorrection     = (8.0 / 180.0 * b2_pi);

/// The maximum linear velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
var b2_maxTranslation           = 2.0;
var b2_maxTranslationSquared    = (b2_maxTranslation * b2_maxTranslation);

/// The maximum angular velocity of a body. This limit is very large and is used
/// to prevent numerical problems. You shouldn't need to adjust this.
var b2_maxRotation              = (0.5 * b2_pi);
var b2_maxRotationSquared       = (b2_maxRotation * b2_maxRotation);

/// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
/// that overlap is removed in one time step. However using values close to 1 often lead
/// to overshoot.
var b2_baumgarte                = 0.2;
var b2_toiBaugarte              = 0.75;


// Sleep

/// The time that a body must be still before it will go to sleep.
var b2_timeToSleep              = 0.5;

/// A body cannot sleep if its linear velocity is above this tolerance.
var b2_linearSleepTolerance     = 0.01;

/// A body cannot sleep if its angular velocity is above this tolerance.
var b2_angularSleepTolerance    = (2.0 / 180.0 * b2_pi);



/// Version numbering scheme.
/// See http://en.wikipedia.org/wiki/Software_versioning
function b2Version(ma, mi, re)
{
    this.major = ma;        ///< significant changes
    this.minor = mi;        ///< incremental changes
    this.revision = re;     ///< bug fixes
}

b2Version.prototype =
{
    toString: function()
    {
        return this.major + '.' + this.minor + '.' + this.revision;
    }
};

/// Current version.
var b2_version = new b2Version(2, 3, 1);
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// This function is used to ensure that a floating point number is not a NaN or infinity.
function b2IsValid(x)
{
    return isFinite(x) && !isNaN(x);
}

var sqrtf = Math.sqrt;
var atan2f = Math.atan2;
var sinf = Math.sin;
var cosf = Math.cos;
var floorf = Math.floor;
var ceilf = Math.ceil;

var b2Sqrt = sqrtf;
var b2Atan2 = atan2f;

/// This is a approximate yet fast inverse square-root.
function b2InvSqrt(x)
{
    return 1.0 / sqrtf(x);
}

/// A 2D column vector.
function b2Vec2(x, y)
{
    if (typeof(x) !== 'undefined')
    {
        this.x = x;
        this.y = y;
    }
    else
        this.x = this.y = 0;
}

b2Vec2.prototype =
{
    Clone: function()
    {
        return new b2Vec2(this.x, this.y);
    },

    /// Set this vector to all zeros.
    SetZero: function() { this.x = 0.0; this.y = 0.0; return this; },

    /// Set this vector to some specified coordinates.
    Set: function(x_, y_) { this.x = x_; this.y = y_; return this; },

    Assign: function(l)
    {
        this.x = l.x;
        this.y = l.y;
        return this;
    },

    /// Negate this vector.
    Negate: function() { var v = new b2Vec2(); v.Set(-this.x, -this.y); return v; },

    /// Read from and indexed element.
    get_i: function(i)
    {
        switch (i)
        {
        case 0:
            return this.x;
        case 1:
            return this.y;
        }
    },

    /// Write to an indexed element.
    set_i: function(i, v)
    {
        switch (i)
        {
        case 0:
            return this.x = v;
        case 1:
            return this.y = v;
        }
    },

    /// Add a vector to this vector.
    Add: function(v)
    {
        this.x += v.x; this.y += v.y;
        return this;
    },

    /// Subtract a vector from this vector.
    Subtract: function(v)
    {
        this.x -= v.x; this.y -= v.y;
        return this;
    },

    /// Multiply this vector by a scalar.
    Multiply: function(a)
    {
        this.x *= a; this.y *= a;
        return this;
    },

    /// Get the length of this vector (the norm).
    Length: function()
    {
        return b2Sqrt(this.x * this.x + this.y * this.y);
    },

    /// Get the length squared. For performance, use this instead of
    /// b2Vec2::Length (if possible).
    LengthSquared: function()
    {
        return this.x * this.x + this.y * this.y;
    },

    /// Convert this vector into a unit vector. Returns the length.
    Normalize: function()
    {
        var length = this.Length();
        if (length < b2_epsilon)
        {
            return 0.0;
        }
        var invLength = 1.0 / length;
        this.x *= invLength;
        this.y *= invLength;

        return length;
    },

    /// Does this vector contain finite coordinates?
    IsValid: function()
    {
        return b2IsValid(this.x) && b2IsValid(this.y);
    },

    /// Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
    Skew: function()
    {
        return new b2Vec2(-this.y, this.x);
    },

    _serialize: function(out)
    {
        var obj = out || [];

        obj[0] = this.x;
        obj[1] = this.y;

        return obj;
    },

    _deserialize: function(data)
    {
        this.x = data[0];
        this.y = data[1];
    }
};

/// Add two vectors component-wise.
b2Vec2.Add = function(a, b)
{
    return new b2Vec2(a.x + b.x, a.y + b.y);
};

/// Subtract two vectors component-wise.
b2Vec2.Subtract = function(a, b)
{
    return new b2Vec2(a.x - b.x, a.y - b.y);
};

b2Vec2.Equals = function(a, b)
{
    return a.x == b.x && a.y == b.y;
};

b2Vec2.Multiply = function(s, a)
{
    return new b2Vec2(s * a.x, s * a.y);
};

b2Vec2.Negate = function(a)
{
    return new b2Vec2(-a.x, -a.y);
};

/// A 2D column vector with 3 elements.
function b2Vec3(x, y, z)
{
    if (typeof(x) !== 'undefined')
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

b2Vec3.prototype =
{
    Clone: function()
    {
        return new b2Vec3(this.x, this.y, this.z);
    },

    /// Set this vector to all zeros.
    SetZero: function() { this.x = 0.0; this.y = 0.0; this.z = 0.0; },

    /// Set this vector to some specified coordinates.
    Set: function(x_, y_, z_) { this.x = x_; this.y = y_; this.z = z_; },

    /// Negate this vector.
    Negate: function() { var v = new b2Vec3(); v.Set(-this.x, -this.y, -this.z); return v; },

    /// Add a vector to this vector.
    Add: function(v)
    {
        this.x += v.x; this.y += v.y; this.z += v.z;
    },

    /// Subtract a vector from this vector.
    Subtract: function(v)
    {
        this.x -= v.x; this.y -= v.y; this.z -= v.z;
    },

    /// Multiply this vector by a scalar.
    Multiply: function(s)
    {
        this.x *= s; this.y *= s; this.z *= s;
    },

    Invert: function()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    x: 0,
    y: 0,
    z: 0
};

b2Vec3.Multiply = function(s, a)
{
    return new b2Vec3(s * a.x, s * a.y, s * a.z);
};

/// Add two vectors component-wise.
b2Vec3.Add = function(a, b)
{
    return new b2Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
};

/// Subtract two vectors component-wise.
b2Vec3.Subtract = function(a, b)
{
    return new b2Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
};

/// A 2-by-2 matrix. Stored in column-major order.
function b2Mat22(c1, c2)
{
    this.ex = c1 ? c1.Clone() : new b2Vec2();
    this.ey = c2 ? c2.Clone() : new b2Vec2();
}

b2Mat22.prototype =
{
    /// Initialize this matrix using columns.
    Set: function(c1, c2)
    {
        this.ex.Assign(c1);
        this.ey.Assign(c2);
    },

    Assign: function(mat)
    {
        this.ex.Assign(mat.ex);
        this.ey.Assign(mat.ey);
    },

    /// Set this to the identity matrix.
    SetIdentity: function()
    {
        this.ex.x = 1.0; this.ey.x = 0.0;
        this.ex.y = 0.0; this.ey.y = 1.0;
    },

    /// Set this matrix to all zeros.
    SetZero: function()
    {
        this.ex.x = 0.0; this.ey.x = 0.0;
        this.ex.y = 0.0; this.ey.y = 0.0;
    },

    GetInverse: function()
    {
        var a = this.ex.x, b = this.ey.x, c = this.ex.y, d = this.ey.y;
        var B = new b2Mat22();
        var det = a * d - b * c;
        if (det != 0.0)
        {
            det = 1.0 / det;
        }
        B.ex.x =  det * d;  B.ey.x = -det * b;
        B.ex.y = -det * c;  B.ey.y =  det * a;
        return B;
    },

    /// Solve A * x = b, where b is a column vector. This is more efficient
    /// than computing the inverse in one-shot cases.
    Solve: function(b)
    {
        var a11 = this.ex.x, a12 = this.ey.x, a21 = this.ex.y, a22 = this.ey.y;
        var det = a11 * a22 - a12 * a21;
        if (det != 0.0)
        {
            det = 1.0 / det;
        }
        var x = new b2Vec2();
        x.x = det * (a22 * b.x - a12 * b.y);
        x.y = det * (a11 * b.y - a21 * b.x);
        return x;
    }
};

b2Mat22.Add = function(A, B)
{
    return new b2Mat22(b2Vec2.Add(A.ex, B.ex), b2Vec2.Add(A.ey, B.ey));
};

/// A 3-by-3 matrix. Stored in column-major order.
function b2Mat33(c1, c2, c3)
{
    this.ex = c1 ? c1.Clone() : new b2Vec3();
    this.ey = c2 ? c2.Clone() : new b2Vec3();
    this.ez = c3 ? c3.Clone() : new b2Vec3();
}

b2Mat33.prototype =
{
    /// Set this matrix to all zeros.
    SetZero: function()
    {
        this.ex.SetZero();
        this.ey.SetZero();
        this.ez.SetZero();
    },

    /// Solve A * x = b, where b is a column vector. This is more efficient
    /// than computing the inverse in one-shot cases.
    Solve33: function(b)
    {
        var det = b2Dot_v3_v3(this.ex, b2Cross_v3_v3(this.ey, this.ez));
        if (det != 0.0)
        {
            det = 1.0 / det;
        }
        var x = new b2Vec3();
        x.x = det * b2Dot_v3_v3(b, b2Cross_v3_v3(this.ey, this.ez));
        x.y = det * b2Dot_v3_v3(this.ex, b2Cross_v3_v3(b, this.ez));
        x.z = det * b2Dot_v3_v3(this.ex, b2Cross_v3_v3(this.ey, b));
        return x;
    },

    /// Solve A * x = b, where b is a column vector. This is more efficient
    /// than computing the inverse in one-shot cases. Solve only the upper
    /// 2-by-2 matrix equation.
    Solve22: function(b)
    {
        var a11 = this.ex.x, a12 = this.ey.x, a21 = this.ex.y, a22 = this.ey.y;
        var det = a11 * a22 - a12 * a21;
        if (det != 0.0)
        {
            det = 1.0 / det;
        }
        var x = new b2Vec2();
        x.x = det * (a22 * b.x - a12 * b.y);
        x.y = det * (a11 * b.y - a21 * b.x);
        return x;
    },

    /// Get the inverse of this matrix as a 2-by-2.
    /// Returns the zero matrix if singular.
    GetInverse22: function(/* b2Mat33* */M)
    {
        var a = this.ex.x, b = this.ey.x, c = this.ex.y, d = this.ey.y;
        var det = a * d - b * c;
        if (det != 0.0)
        {
            det = 1.0 / det;
        }

        M.ex.x =  det * d;  M.ey.x = -det * b; M.ex.z = 0.0;
        M.ex.y = -det * c;  M.ey.y =  det * a; M.ey.z = 0.0;
        M.ez.x = 0.0; M.ez.y = 0.0; M.ez.z = 0.0;
    },

    /// Get the symmetric inverse of this matrix as a 3-by-3.
    /// Returns the zero matrix if singular.
    GetSymInverse33: function(/* b2Mat33* */ M)
    {
        var det = b2Dot_v3_v3(this.ex, b2Cross_v3_v3(this.ey, this.ez));
        if (det != 0.0)
        {
            det = 1.0 / det;
        }

        var a11 = this.ex.x, a12 = this.ey.x, a13 = this.ez.x;
        var a22 = this.ey.y, a23 = this.ez.y;
        var a33 = this.ez.z;

        M.ex.x = det * (a22 * a33 - a23 * a23);
        M.ex.y = det * (a13 * a23 - a12 * a33);
        M.ex.z = det * (a12 * a23 - a13 * a22);

        M.ey.x = M.ex.y;
        M.ey.y = det * (a11 * a33 - a13 * a13);
        M.ey.z = det * (a13 * a12 - a11 * a23);

        M.ez.x = M.ex.z;
        M.ez.y = M.ey.z;
        M.ez.z = det * (a11 * a22 - a12 * a12);
    }
};

/// Rotation
function b2Rot(angle, c)
{
    if (typeof(c) !== 'undefined')
    {
        this.s = angle;
        this.c = c;
    }
    else if (typeof(angle) !== 'undefined')
        this.Set(angle);
}

b2Rot.prototype =
{
    Clone: function()
    {
        return new b2Rot(this.s, this.c);
    },

    Assign: function(l)
    {
        this.s = l.s;
        this.c = l.c;
    },

    /// Set using an angle in radians.
    Set: function(x)
    {
        /// TODO_ERIN optimize
        this.s = sinf(x);
        this.c = cosf(x);
    },

    /// Set to the identity rotation
    SetIdentity: function()
    {
        this.s = 0.0;
        this.c = 1.0;
    },

    /// Get the angle in radians
    GetAngle: function()
    {
        return b2Atan2(this.s, this.c);
    },

    /// Get the x-axis
    GetXAxis: function()
    {
        return new b2Vec2(this.c, this.s);
    },

    /// Get the u-axis
    GetYAxis: function()
    {
        return new b2Vec2(-this.s, this.c);
    },

    /// Sine and cosine
    s: 0,
    c: 1
};

/// A transform contains translation and rotation. It is used to represent
/// the position and orientation of rigid frames.
function b2Transform(position, rotation)
{
    this.p = new b2Vec2();
    this.q = new b2Rot();

    if (position)
    {
        this.p.Assign(position);
        this.q.Assign(rotation);
    }
}

b2Transform.prototype =
{
    Clone: function()
    {
        var xf = new b2Transform(this.p, this.q);
        return xf;
    },

    Assign: function(xf)
    {
        this.p.Assign(xf.p);
        this.q.Assign(xf.q);
    },

    /// Set this to the identity transform.
    SetIdentity: function()
    {
        this.p.SetZero();
        this.q.SetIdentity();
    },

    /// Set this based on the position and angle.
    Set: function(position, angle)
    {
        this.p.Assign(position);
        this.q.Set(angle);
    }
};

/// This describes the motion of a body/shape for TOI computation.
/// Shapes are defined with respect to the body origin, which may
/// no coincide with the center of mass. However, to support dynamics
/// we must interpolate the center of mass position.
function b2Sweep()
{
    this.localCenter = new b2Vec2();
    this.c0 = new b2Vec2();
    this.c = new b2Vec2();
}

b2Sweep.prototype =
{
    Assign: function(sweep)
    {
        this.localCenter.Assign(sweep.localCenter);
        this.c0.Assign(sweep.c0);
        this.c.Assign(sweep.c);
        this.a = sweep.a;
        this.a0 = sweep.a0;
        this.alpha0 = sweep.alpha0;
    },

    Clone: function()
    {
        var sweep = new b2Sweep();
        sweep.localCenter.Assign(this.localCenter);
        sweep.c0.Assign(this.c0);
        sweep.c.Assign(this.c);
        sweep.a = this.a;
        sweep.a0 = this.a0;
        sweep.alpha0 = this.alpha0;
        return sweep;
    },

    /// Get the interpolated transform at a specific time.
    /// @param beta is a factor in [0,1], where 0 indicates alpha0.
    GetTransform: function(/* b2Transform* */ xf, beta)
    {
        //xf.p = b2Vec2.Add(b2Vec2.Multiply((1.0 - beta), this.c0), b2Vec2.Multiply(beta, this.c));
        xf.p.x = ((1.0 - beta) * this.c0.x) + (beta * this.c.x);
        xf.p.y = ((1.0 - beta) * this.c0.y) + (beta * this.c.y);
        var angle = (1.0 - beta) * this.a0 + beta * this.a;
        xf.q.Set(angle);

        // Shift to origin
        //xf.p.Subtract(b2Mul_r_v2(xf.q, this.localCenter));
        xf.p.x -= xf.q.c * this.localCenter.x - xf.q.s * this.localCenter.y;
        xf.p.y -= xf.q.s * this.localCenter.x + xf.q.c * this.localCenter.y;
    },

    /// Advance the sweep forward, yielding a new initial state.
    /// @param alpha the new initial time.
    Advance: function(alpha)
    {

        b2Assert(this.alpha0 < 1.0);

        var beta = (alpha - this.alpha0) / (1.0 - this.alpha0);
        this.c0.Add(b2Vec2.Multiply(beta, b2Vec2.Subtract(this.c, this.c0)));
        this.a0 += beta * (this.a - this.a0);
        this.alpha0 = alpha;
    },

    /// Normalize the angles.
    Normalize: function()
    {
        var twoPi = 2.0 * b2_pi;
        var d = twoPi * floorf(this.a0 / twoPi);
        this.a0 -= d;
        this.a -= d;
    },

    a0: 0,
    a: 0,       ///< world angles

    /// Fraction of the current time step in the range [0,1]
    /// c0 and a0 are the positions at alpha0.
    alpha0: 0
};

/// Perform the dot product on two vectors.
function b2Dot_v2_v2(a, b)
{
    return a.x * b.x + a.y * b.y;
}

/// Perform the cross product on two vectors. In 2D this produces a scalar.
function b2Cross_v2_v2(a, b)
{
    return a.x * b.y - a.y * b.x;
}

/// Perform the cross product on a vector and a scalar. In 2D this produces
/// a vector.
function b2Cross_v2_f(a, s)
{
    return new b2Vec2(s * a.y, -s * a.x);
}

/// Perform the cross product on a scalar and a vector. In 2D this produces
/// a vector.
function b2Cross_f_v2(s, a)
{
    return new b2Vec2(-s * a.y, s * a.x);
}

/// Multiply a matrix times a vector. If a rotation matrix is provided,
/// then this transforms the vector from one frame to another.
function b2Mul_m22_v2(A, v)
{
    return new b2Vec2(A.ex.x * v.x + A.ey.x * v.y, A.ex.y * v.x + A.ey.y * v.y);
}

/// Multiply a matrix transpose times a vector. If a rotation matrix is provided,
/// then this transforms the vector from one frame to another (inverse transform).
function b2MulT_m22_v2(A, v)
{
    return new b2Vec2(b2Dot_v2_v2(v, A.ex), b2Dot_v2_v2(v, A.ey));
}

function b2Distance(a, b)
{
    var c = b2Vec2.Subtract(a, b);
    return c.Length();
}

function b2DistanceSquared(a, b)
{
    var c = b2Vec2.Subtract(a, b);
    return b2Dot_v2_v2(c, c);
}

/// Perform the dot product on two vectors.
function b2Dot_v3_v3(a, b)
{
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

/// Perform the cross product on two vectors.
function b2Cross_v3_v3(a, b)
{
    return new b2Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

// A * B
function b2Mul_m22_m22(A, B)
{
    return new b2Mat22(b2Mul_m22_v2(A, B.ex), b2Mul_m22_v2(A, B.ey));
}

// A^T * B
function b2MulT_m22_m22(A, B)
{
    var c1 = new b2Vec2(b2Dot_v2_v2(A.ex, B.ex), b2Dot_v2_v2(A.ey, B.ex));
    var c2 = new b2Vec2(b2Dot_v2_v2(A.ex, B.ey), b2Dot_v2_v2(A.ey, B.ey));
    return new b2Mat22(c1, c2);
}

/// Multiply a matrix times a vector.
function b2Mul_m33_v3(A, v)
{
    return b2Vec3.Add(b2Vec3.Add(b2Vec3.Multiply(v.x, A.ex), b2Vec3.Multiply(v.y, A.ey)), b2Vec3.Multiply(v.z, A.ez));
}

/// Multiply a matrix times a vector.
function b2Mul22_m33_v2(A, v)
{
    return new b2Vec2(A.ex.x * v.x + A.ey.x * v.y, A.ex.y * v.x + A.ey.y * v.y);
}

/// Multiply two rotations: q * r
function b2Mul_r_r(q, r)
{
    // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
    // [qs  qc]   [rs  rc]   [qs*rc+qc*rs -qs*rs+qc*rc]
    // s = qs * rc + qc * rs
    // c = qc * rc - qs * rs
    var qr = new b2Rot();
    qr.s = q.s * r.c + q.c * r.s;
    qr.c = q.c * r.c - q.s * r.s;
    return qr;
}

/// Transpose multiply two rotations: qT * r
function b2MulT_r_r(q, r)
{
    // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
    // [-qs qc]   [rs  rc]   [-qs*rc+qc*rs qs*rs+qc*rc]
    // s = qc * rs - qs * rc
    // c = qc * rc + qs * rs
    var qr = new b2Rot();
    qr.s = q.c * r.s - q.s * r.c;
    qr.c = q.c * r.c + q.s * r.s;
    return qr;
}

/// Rotate a vector
function b2Mul_r_v2(q, v)
{
    return new b2Vec2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
}

/// Inverse rotate a vector
function b2MulT_r_v2(q, v)
{
    return new b2Vec2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
}

function b2Mul_t_v2(T, v)
{
    return new b2Vec2((T.q.c * v.x - T.q.s * v.y) + T.p.x, (T.q.s * v.x + T.q.c * v.y) + T.p.y);
}

function b2MulT_t_v2(T, v)
{
    var px = v.x - T.p.x;
    var py = v.y - T.p.y;
    var x = (T.q.c * px + T.q.s * py);
    var y = (-T.q.s * px + T.q.c * py);

    return new b2Vec2(x, y);
}

// v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
//    = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
function b2Mul_t_t(A, B)
{
    var C = new b2Transform();
    C.q = b2Mul_r_r(A.q, B.q);
    C.p = b2Vec2.Add(b2Mul_r_v2(A.q, B.p), A.p);
    return C;
}

// v2 = A.q' * (B.q * v1 + B.p - A.p)
//    = A.q' * B.q * v1 + A.q' * (B.p - A.p)
function b2MulT_t_t(A, B)
{
    var C = new b2Transform();
    C.q = b2MulT_r_r(A.q, B.q);
    var tvx = B.p.x - A.p.x;
    var tvy = B.p.y - A.p.y;
    C.p.x = A.q.c * tvx + A.q.s * tvy;// = b2MulT_r_v2(A.q, b2Vec2.Subtract(B.p, A.p));
    C.p.y = -A.q.s * tvx + A.q.c * tvy;
    return C;
}

var b2Abs = Math.abs;

function b2Abs_v2(a)
{
    return new b2Vec2(b2Abs(a.x), b2Abs(a.y));
}

function b2Abs_m22(A)
{
    return new b2Mat22(b2Abs_v2(A.ex), b2Abs_v2(A.ey));
}

var b2Min = Math.min;

function b2Min_v2(a, b)
{
    return new b2Vec2(b2Min(a.x, b.x), b2Min(a.y, b.y));
}

var b2Max = Math.max;

function b2Max_v2(a, b)
{
    return new b2Vec2(b2Max(a.x, b.x), b2Max(a.y, b.y));
}

function b2Clamp(a, low, high)
{
    return b2Max(low, b2Min(a, high));
}

function b2Clamp_v2(a, low, high)
{
    return b2Max_v2(low, b2Min_v2(a, high));
}

/// "Next Largest Power of 2
/// Given a binary integer value x, the next largest power of 2 can be computed by a SWAR algorithm
/// that recursively "folds" the upper bits into the lower bits. This process yields a bit vector with
/// the same most significant 1 as x, but all 1's below it. Adding 1 to that value yields the next
/// largest power of 2. For a 32-bit value:"
function b2NextPowerOfTwo(x)
{
    x |= (x >> 1);
    x |= (x >> 2);
    x |= (x >> 4);
    x |= (x >> 8);
    x |= (x >> 16);
    return x + 1;
}

function b2IsPowerOfTwo(x)
{
    var result = x > 0 && (x & (x - 1)) == 0;
    return result;
}

var RAND_LIMIT  = 32767;

/// Random number in range [-1,1] or [lo,hi]
function b2RandomFloat(lo, hi)
{
    var r = Math.random();

    if (typeof(lo) !== 'undefined')
        r = (hi - lo) * r + lo;
    else
        r = 2.0 * r - 1.0;

    return r;
}
/*
* Copyright (c) 2011 Erin Catto http://box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Color for debug drawing. Each value has the range [0,1].
function b2Color(r, g, b)
{
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
}

b2Color.prototype =
{
    Set: function(r, g, b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }
};

/// Implement and register this class with a b2World to provide debug drawing of physics
/// entities in your game.
function b2Draw()
{
}

b2Draw.prototype =
{
    ClearDraw: function () {},

    /// Set the drawing flags.
    SetFlags: function(flags) { this.m_drawFlags = flags; },

    /// Get the drawing flags.
    GetFlags: function() { return this.m_drawFlags; },

    /// Append flags to the current flags.
    AppendFlags: function(flags) { this.m_drawFlags |= flags; },

    /// Clear flags from the current flags.
    ClearFlags: function(flags) { this.m_drawFlags &= ~flags; },

    /// Toggle flags
    ToggleFlags: function(flags) { this.m_drawFlags ^= flags; },

    /// Draw a closed polygon provided in CCW order.
    DrawPolygon: function(vertices, vertexCount, color) { },

    /// Draw a solid closed polygon provided in CCW order.
    DrawSolidPolygon: function(vertices, vertexCount, color) { },

    /// Draw a circle.
    DrawCircle: function(center, radius, color) { },

    /// Draw a solid circle.
    DrawSolidCircle: function(center, radius, axis, color) { },

    /// Draw a line segment.
    DrawSegment: function(p1, p2, color) { },

    /// Draw a transform. Choose your own length scale.
    /// @param xf a transform.
    DrawTransform: function(xf) { },

//

    m_drawFlags: 0
};

b2Draw.e_shapeBit = 1;  ///< draw shapes
b2Draw.e_jointBit = 2;  ///< draw joint connections
b2Draw.e_aabbBit = 4;   ///< draw axis aligned bounding boxes
b2Draw.e_centerOfMassBit = 8;   ///< draw center of mass frame
b2Draw.e_contactPoints = 16;
b2Draw.e_contactNormals = 32;
b2Draw.e_contactImpulses = 64;
b2Draw.e_frictionImpulses = 128;
b2Draw.e_statistics = 256;
b2Draw.e_profile = 512;
b2Draw.e_pairBit = 1024;
if (typeof(performance) === 'undefined')
{
    window.performance = { now: function() { return +new Date(); } };
}

/// Timer for profiling.
function b2Timer()
{
    this.Reset();
}

b2Timer.prototype =
{
    /// Reset the timer.
    Reset: function ()
    {
        this.m_start = performance.now();
    },

    /// Get the time since construction or the last reset.
    GetMilliseconds: function()
    {
        return performance.now() - this.m_start;
    }
};

/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// This holds the mass data computed for a shape.
function b2MassData()
{
    /// The mass of the shape, usually in kilograms.
    this.mass = 0;

    /// The position of the shape's centroid relative to the shape's origin.
    this.center = new b2Vec2();

    /// The rotational inertia of the shape about the local origin.
    this.I = 0;
}

/// A shape is used for collision detection. You can create a shape however you like.
/// Shapes used for simulation in b2World are created automatically when a b2Fixture
/// is created. Shapes may encapsulate a one or more child shapes.
/**
 * A shape.
 * @constructor
 * @returns {b2Shape}
 */
function b2Shape()
{
    this.m_type = 0;
    this.m_radius = 0;
}

b2Shape.prototype =
{
    /// Clone the concrete shape using the provided allocator.
    Clone: function() { },

    /// Get the type of this shape. You can use this to down cast to the concrete shape.
    /// @return the shape type.
    GetType: function() { return this.m_type; },

    /// Get the number of child primitives.
    GetChildCount: function() { },

    /// Test a point for containment in this shape. This only works for convex shapes.
    /// @param xf the shape world transform.
    /// @param p a point in world coordinates.
    TestPoint: function(xf, p) { },

    /// Cast a ray against a child shape.
    /// @param output the ray-cast results.
    /// @param input the ray-cast input parameters.
    /// @param transform the transform to be applied to the shape.
    /// @param childIndex the child shape index
    RayCast: function(output, input,
                        transform, childIndex) { },

    /// Given a transform, compute the associated axis aligned bounding box for a child shape.
    /// @param aabb returns the axis aligned box.
    /// @param xf the world transform of the shape.
    /// @param childIndex the child shape
    ComputeAABB: function(aabb, xf, childIndex) { },

    /// Compute the mass properties of this shape using its dimensions and density.
    /// The inertia tensor is computed about the local origin.
    /// @param massData returns the mass data for this shape.
    /// @param density the density in kilograms per meter squared.
    ComputeMass: function(massData, density) { },

//

    _serialize: function(out)
    {
        var obj = out || {};

        obj['m_type'] = this.m_type;
        obj['m_radius'] = this.m_radius;

        return obj;
    },

    _deserialize: function(data)
    {
        this.m_radius = data['m_radius'];
    }
};

b2Shape.e_circle = 0;
b2Shape.e_edge = 1;
b2Shape.e_polygon = 2;
b2Shape.e_chain = 3;
b2Shape.e_typeCount = 4;

/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// A circle shape.
function b2CircleShape()
{
    this.parent.call(this);

    this.m_type = b2Shape.e_circle;
    this.m_radius = 0;
    this.m_p = new b2Vec2();

    Object.seal(this);
}

b2CircleShape.prototype =
{
    /// Implement b2Shape.
    Clone: function()
    {
        var shape = new b2CircleShape();
        shape.m_radius = this.m_radius;
        shape.m_p = this.m_p.Clone();
        return shape;
    },

    /// @see b2Shape::GetChildCount
    GetChildCount: function() { return 1; },

    /// Implement b2Shape.
    TestPoint: function(transform, p)
    {
        var center = b2Vec2.Add(transform.p, b2Mul_r_v2(transform.q, this.m_p));
        var d = b2Vec2.Subtract(p, center);
        return b2Dot_v2_v2(d, d) <= this.m_radius * this.m_radius;
    },

    /// Implement b2Shape.
    RayCast: function(output, input,
                transform, childIndex)
    {
        var position = b2Vec2.Add(transform.p, b2Mul_r_v2(transform.q, this.m_p));
        var s = b2Vec2.Subtract(input.p1, position);
        var b = b2Dot_v2_v2(s, s) - this.m_radius * this.m_radius;

        // Solve quadratic equation.
        var r = b2Vec2.Subtract(input.p2, input.p1);
        var c = b2Dot_v2_v2(s, r);
        var rr = b2Dot_v2_v2(r, r);
        var sigma = c * c - rr * b;

        // Check for negative discriminant and short segment.
        if (sigma < 0.0 || rr < b2_epsilon)
        {
            return false;
        }

        // Find the point of intersection of the line with the circle.
        var a = -(c + b2Sqrt(sigma));

        // Is the intersection point on the segment?
        if (0.0 <= a && a <= input.maxFraction * rr)
        {
            a /= rr;
            output.fraction = a;
            output.normal = b2Vec2.Add(s, b2Vec2.Multiply(a, r));
            output.normal.Normalize();
            return true;
        }

        return false;
    },

    /// @see b2Shape::ComputeAABB
    ComputeAABB: function(aabb, transform, childIndex)
    {
        var px = transform.p.x + (transform.q.c * this.m_p.x - transform.q.s * this.m_p.y);//b2Vec2.Add(transform.p, b2Mul_r_v2(transform.q, this.m_p));
        var py = transform.p.y + (transform.q.s * this.m_p.x + transform.q.c * this.m_p.y);
        aabb.lowerBound.x = px - this.m_radius;
        aabb.lowerBound.y = py - this.m_radius;
        aabb.upperBound.x = px + this.m_radius;
        aabb.upperBound.y = py + this.m_radius;
    },

    /// @see b2Shape::ComputeMass
    ComputeMass: function(massData, density)
    {
        massData.mass = density * b2_pi * this.m_radius * this.m_radius;
        massData.center = this.m_p;

        // inertia about the local origin
        massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + b2Dot_v2_v2(this.m_p, this.m_p));
    },

    /// Get the supporting vertex index in the given direction.
    GetSupport: function(d) { return 0; },

    /// Get the supporting vertex in the given direction.
    GetSupportVertex: function(d) { return this.m_p; },

    /// Get the vertex count.
    GetVertexCount: function() { return 1; },

    /// Get a vertex by index. Used by b2Distance.
    GetVertex: function(index)
    {

        b2Assert(index == 0);

        return this.m_p;
    },

//

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['m_p'] = this.m_p._serialize();

        return obj;
    },

    _deserialize: function(data)
    {
        this.parent.prototype._deserialize.call(this, data);

        this.m_p._deserialize(data['m_p']);
    }
};

b2CircleShape._extend(b2Shape);
/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// A line segment (edge) shape. These can be connected in chains or loops
/// to other edge shapes. The connectivity information is used to ensure
/// correct contact normals.
function b2EdgeShape()
{
    this.parent.call(this);

    this.m_type = b2Shape.e_edge;
    this.m_radius = b2_polygonRadius;
    this.m_vertex0 = new b2Vec2();
    this.m_vertex1 = new b2Vec2();
    this.m_vertex2 = new b2Vec2();
    this.m_vertex3 = new b2Vec2();
    this.m_hasVertex0 = false;
    this.m_hasVertex3 = false;

    Object.seal(this);
}

b2EdgeShape.prototype =
{
    /// Set this as an isolated edge.
    Set: function(v1, v2)
    {
        this.m_vertex1.Assign(v1);
        this.m_vertex2.Assign(v2);
        this.m_hasVertex0 = false;
        this.m_hasVertex3 = false;
    },

    /// Implement b2Shape.
    Clone: function()
    {
        var shape = new b2EdgeShape();
        shape.m_vertex0 = this.m_vertex0.Clone();
        shape.m_vertex1 = this.m_vertex1.Clone();
        shape.m_vertex2 = this.m_vertex2.Clone();
        shape.m_vertex3 = this.m_vertex3.Clone();
        shape.m_hasVertex0 = this.m_hasVertex0;
        shape.m_hasVertex3 = this.m_hasVertex3;
        return shape;
    },

    /// @see b2Shape::GetChildCount
    GetChildCount: function()
    {
        return 1;
    },

    /// @see b2Shape::TestPoint
    TestPoint: function(transform, p)
    {
        return false;
    },

    /// Implement b2Shape.
    RayCast: function(output, input,
                xf, childIndex)
    {
        // Put the ray into the edge's frame of reference.
        var p1 = b2MulT_r_v2(xf.q, b2Vec2.Subtract(input.p1, xf.p));
        var p2 = b2MulT_r_v2(xf.q, b2Vec2.Subtract(input.p2, xf.p));
        var d = b2Vec2.Subtract(p2, p1);

        var v1 = this.m_vertex1;
        var v2 = this.m_vertex2;
        var e = b2Vec2.Subtract(v2, v1);
        var normal = new b2Vec2(e.y, -e.x);
        normal.Normalize();

        // q = p1 + t * d
        // dot(normal, q - v1) = 0
        // dot(normal, p1 - v1) + t * dot(normal, d) = 0
        var numerator = b2Dot_v2_v2(normal, b2Vec2.Subtract(v1, p1));
        var denominator = b2Dot_v2_v2(normal, d);

        if (denominator == 0.0)
        {
            return false;
        }

        var t = numerator / denominator;
        if (t < 0.0 || input.maxFraction < t)
        {
            return false;
        }

        var q = b2Vec2.Add(p1, b2Vec2.Multiply(t, d));

        // q = v1 + s * r
        // s = dot(q - v1, r) / dot(r, r)
        var r = b2Vec2.Subtract(v2, v1);
        var rr = b2Dot_v2_v2(r, r);
        if (rr == 0.0)
        {
            return false;
        }

        var s = b2Dot_v2_v2(b2Vec2.Subtract(q, v1), r) / rr;
        if (s < 0.0 || 1.0 < s)
        {
            return false;
        }

        output.fraction = t;
        if (numerator > 0.0)
        {
            output.normal = b2Mul_r_v2(xf.q, normal).Negate();
        }
        else
        {
            output.normal = b2Mul_r_v2(xf.q, normal);
        }
        return true;
    },

    /// @see b2Shape::ComputeAABB
    ComputeAABB: function(aabb, xf, childIndex)
    {
        var v1x = (xf.q.c * this.m_vertex1.x - xf.q.s * this.m_vertex1.y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertex1);
        var v1y = (xf.q.s * this.m_vertex1.x + xf.q.c * this.m_vertex1.y) + xf.p.y;
        var v2x = (xf.q.c * this.m_vertex2.x - xf.q.s * this.m_vertex2.y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertex2);
        var v2y = (xf.q.s * this.m_vertex2.x + xf.q.c * this.m_vertex2.y) + xf.p.y;

        var lowerx = b2Min(v1x, v2x);// = b2Min_v2(v1, v2);
        var lowery = b2Min(v1y, v2y);
        var upperx = b2Max(v1x, v2x); //= b2Max_v2(v1, v2);
        var uppery = b2Max(v1y, v2y);

        //var r = new b2Vec2(this.m_radius, this.m_radius);
        aabb.lowerBound.x = lowerx - this.m_radius; //= b2Vec2.Subtract(lower, r);
        aabb.lowerBound.y = lowery - this.m_radius;
        aabb.upperBound.x = upperx + this.m_radius; //= b2Vec2.Add(upper, r);
        aabb.upperBound.y = uppery + this.m_radius;
    },

    /// @see b2Shape::ComputeMass
    ComputeMass: function(massData, density)
    {
        massData.mass = 0.0;
        massData.center = b2Vec2.Multiply(0.5, b2Vec2.Add(this.m_vertex1, this.m_vertex2));
        massData.I = 0.0;
    },

//

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['m_vertex1'] = this.m_vertex1._serialize();
        obj['m_vertex2'] = this.m_vertex2._serialize();

        obj['m_hasVertex0'] = this.m_hasVertex0;

        if (this.m_hasVertex0)
            obj['m_vertex0'] = this.m_vertex0._serialize();

        obj['m_hasVertex3'] = this.m_hasVertex3;

        if (this.m_hasVertex3)
            obj['m_vertex3'] = this.m_vertex3._serialize();

        return obj;
    },

    _deserialize: function(data)
    {
        this.parent.prototype._deserialize.call(this, data);

        this.m_vertex1._deserialize(data['m_vertex1']);
        this.m_vertex2._deserialize(data['m_vertex2']);

        this.m_hasVertex0 = data['m_hasVertex0'];

        if (this.m_hasVertex0)
            this.m_vertex0._deserialize(data['m_vertex0']);

        this.m_hasVertex3 = data['m_hasVertex3'];

        if (this.m_hasVertex3)
            this.m_vertex3._deserialize(data['m_vertex3']);
    }
};

b2EdgeShape._extend(b2Shape);
/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// A chain shape is a free form sequence of line segments.
/// The chain has two-sided collision, so you can use inside and outside collision.
/// Therefore, you may use any winding order.
/// Since there may be many vertices, they are allocated using b2Alloc.
/// Connectivity information is used to create smooth collisions.
/// WARNING: The chain will not collide properly if there are self-intersections.
function b2ChainShape()
{
    this.parent.call(this);

    this.m_type = b2Shape.e_chain;
    this.m_radius = b2_polygonRadius;
    this.m_prevVertex = new b2Vec2();
    this.m_nextVertex = new b2Vec2();
    this.m_hasPrevVertex = false;
    this.m_hasNextVertex = false;

    this.Clear();

    Object.seal(this);
}

b2ChainShape._tempEdge = new b2EdgeShape();

b2ChainShape.prototype =
{
    /// Clear all data.
    Clear: function()
    {
        this.m_vertices = null;
        this.m_count = 0;
    },

    /// Create a loop. This automatically adjusts connectivity.
    /// @param vertices an array of vertices, these are copied
    /// @param count the vertex count
    CreateLoop: function(vertices, count)
    {

        b2Assert(this.m_vertices == null && this.m_count == 0);
        b2Assert(count >= 3);

        for (var i = 1; i < count; ++i)
            // If the code crashes here, it means your vertices are too close together.
            b2Assert(b2DistanceSquared(vertices[i-1], vertices[i]) > b2_linearSlop * b2_linearSlop);


        this.m_count = count + 1;

        this.m_vertices = new Array(this.m_count);

        for (var i = 0; i < count; ++i)
            this.m_vertices[i] = vertices[i].Clone();

        this.m_vertices[count] = this.m_vertices[0].Clone();
        this.m_prevVertex.Assign(this.m_vertices[this.m_count - 2]);
        this.m_nextVertex.Assign(this.m_vertices[1]);
        this.m_hasPrevVertex = true;
        this.m_hasNextVertex = true;
    },

    /// Create a chain with isolated end vertices.
    /// @param vertices an array of vertices, these are copied
    /// @param count the vertex count
    CreateChain: function(vertices, count)
    {

        b2Assert(this.m_vertices == null && this.m_count == 0);
        b2Assert(count >= 2);

        for (var i = 1; i < count; ++i)
        {
            var v1 = vertices[i-1];
            var v2 = vertices[i];

            // If the code crashes here, it means your vertices are too close together.
            b2Assert(b2DistanceSquared(v1, v2) > b2_linearSlop * b2_linearSlop);
        }


        this.m_count = count;
        this.m_vertices = new Array(count);

        for (var i = 0; i < count; ++i)
            this.m_vertices[i] = vertices[i].Clone();

        this.m_hasPrevVertex = false;
        this.m_hasNextVertex = false;

        this.m_prevVertex.SetZero();
        this.m_nextVertex.SetZero();
    },

    /// Establish connectivity to a vertex that precedes the first vertex.
    /// Don't call this for loops.
    SetPrevVertex: function(prevVertex)
    {
        this.m_prevVertex.Assign(prevVertex);
        this.m_hasPrevVertex = true;
    },

    /// Establish connectivity to a vertex that follows the last vertex.
    /// Don't call this for loops.
    SetNextVertex: function(nextVertex)
    {
        this.m_nextVertex.Assign(nextVertex);
        this.m_hasNextVertex = true;
    },

    /// Implement b2Shape. Vertices are cloned using b2Alloc.
    Clone: function()
    {
        var shape = new b2ChainShape();

        shape.m_count = this.m_count;
        shape.m_vertices = new Array(this.m_count);

        for (var i = 0; i < this.m_count; ++i)
            shape.m_vertices[i] = this.m_vertices[i].Clone();

        shape.m_prevVertex = this.m_prevVertex.Clone();
        shape.m_nextVertex = this.m_nextVertex.Clone();
        shape.m_hasPrevVertex = this.m_hasPrevVertex;
        shape.m_hasNextVertex = this.m_hasNextVertex;

        return shape;
    },

    /// @see b2Shape::GetChildCount
    GetChildCount: function()
    {
        return this.m_count - 1;
    },

    /// Get a child edge.
    GetChildEdge: function(edge, index)
    {

        b2Assert(0 <= index && index < this.m_count - 1);

        edge.m_type = b2Shape.e_edge;
        edge.m_radius = this.m_radius;

        edge.m_vertex1 = this.m_vertices[index + 0];
        edge.m_vertex2 = this.m_vertices[index + 1];

        if (index > 0)
        {
            edge.m_vertex0 = this.m_vertices[index - 1];
            edge.m_hasVertex0 = true;
        }
        else
        {
            edge.m_vertex0 = this.m_prevVertex;
            edge.m_hasVertex0 = this.m_hasPrevVertex;
        }

        if (index < this.m_count - 2)
        {
            edge.m_vertex3 = this.m_vertices[index + 2];
            edge.m_hasVertex3 = true;
        }
        else
        {
            edge.m_vertex3 = this.m_nextVertex;
            edge.m_hasVertex3 = this.m_hasNextVertex;
        }
    },

    /// This always return false.
    /// @see b2Shape::TestPoint
    TestPoint: function(transform, p)
    {
        return false;
    },

    /// Implement b2Shape.
    RayCast: function(output, input,
                    xf, childIndex)
    {

        b2Assert(childIndex < this.m_count);


        var i1 = childIndex;
        var i2 = childIndex + 1;
        if (i2 == this.m_count)
        {
            i2 = 0;
        }

        b2ChainShape._tempEdge.m_vertex1 = this.m_vertices[i1].Clone();
        b2ChainShape._tempEdge.m_vertex2 = this.m_vertices[i2].Clone();

        return b2ChainShape._tempEdge.RayCast(output, input, xf, 0);
    },

    /// @see b2Shape::ComputeAABB
    ComputeAABB: function(aabb, xf, childIndex)
    {

        b2Assert(childIndex < this.m_count);


        var i1 = childIndex;
        var i2 = childIndex + 1;
        if (i2 == this.m_count)
        {
            i2 = 0;
        }

        var v1x = (xf.q.c * this.m_vertices[i1].x - xf.q.s * this.m_vertices[i1].y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertices[i1]);
        var v1y = (xf.q.s * this.m_vertices[i1].x + xf.q.c * this.m_vertices[i1].y) + xf.p.y;
        var v2x = (xf.q.c * this.m_vertices[i2].x - xf.q.s * this.m_vertices[i2].y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertices[i2]);
        var v2y = (xf.q.s * this.m_vertices[i2].x + xf.q.c * this.m_vertices[i2].y) + xf.p.y;

        aabb.lowerBound.x = b2Min(v1x, v2x); //b2Min_v2(v1, v2);
        aabb.lowerBound.y = b2Min(v1y, v2y);
        aabb.upperBound.x = b2Max(v1x, v2x); //b2Max_v2(v1, v2);
        aabb.upperBound.y = b2Max(v1y, v2y);
    },

    /// Chains have zero mass.
    /// @see b2Shape::ComputeMass
    ComputeMass: function(massData, density)
    {
        massData.mass = 0.0;
        massData.center.SetZero();
        massData.I = 0.0;
    },

//

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['m_count'] = this.m_count;

        obj['m_vertices'] = [];

        for (var i = 0; i < this.m_count; ++i)
            obj['m_vertices'].push(this.m_vertices[i]._serialize());

        obj['m_hasPrevVertex'] = this.m_hasPrevVertex;

        if (this.m_hasPrevVertex)
            obj['m_prevVertex'] = this.m_prevVertex._serialize();

        obj['m_hasNextVertex'] = this.m_hasNextVertex;

        if (this.m_hasNextVertex)
            obj['m_nextVertex'] = this.m_nextVertex._serialize();

        return obj;
    },

    _deserialize: function(data)
    {
        this.parent.prototype._deserialize.call(this, data);

        this.m_count = data['m_count'];
        this.m_vertices = [];

        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_vertices[i] = new b2Vec2();
            this.m_vertices[i]._deserialize(data['m_vertices'][i]);
        }

        this.m_hasPrevVertex = data['m_hasPrevVertex'];

        if (this.m_hasPrevVertex)
            this.m_prevVertex._deserialize(data['m_prevVertex']);

        this.m_hasNextVertex = data['m_hasNextVertex'];

        if (this.m_hasNextVertex)
            this.m_nextVertex._deserialize(data['m_nextVertex']);
    }
};

b2ChainShape._extend(b2Shape);
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// A convex polygon. It is assumed that the interior of the polygon is to
/// the left of each edge.
/// Polygons have a maximum number of vertices equal to b2_maxPolygonVertices.
/// In most cases you should not need many vertices for a convex polygon.
function b2PolygonShape()
{
    this.parent.call(this);

    this.m_type = b2Shape.e_polygon;
    this.m_radius = b2_polygonRadius;
    this.m_count = 0;
    this.m_centroid = new b2Vec2();

    this.m_vertices = new Array(b2_maxPolygonVertices);
    this.m_normals = new Array(b2_maxPolygonVertices);

    Object.seal(this);
}

b2PolygonShape.prototype =
{
    /// Implement b2Shape.
    Clone: function()
    {
        var shape = new b2PolygonShape();
        shape.m_count = this.m_count;
        shape.m_centroid = this.m_centroid.Clone();

        for (var i = 0; i < this.m_count; ++i)
        {
            shape.m_vertices[i] = this.m_vertices[i].Clone();
            shape.m_normals[i] = this.m_normals[i].Clone();
        }

        return shape;
    },

    /// @see b2Shape::GetChildCount
    GetChildCount: function()
    {
        return 1;
    },

    /// Create a convex hull from the given array of local points.
    /// The count must be in the range [3, b2_maxPolygonVertices].
    /// @warning the points may be re-ordered, even if they form a convex polygon
    /// @warning collinear points are handled but not removed. Collinear points
    /// may lead to poor stacking behavior.
    Set: function(vertices, count)
    {

        b2Assert(3 <= count && count <= b2_maxPolygonVertices);


        if (count < 3)
        {
            this.SetAsBox(1.0, 1.0);
            return;
        }

        var n = b2Min(count, b2_maxPolygonVertices);

        // Perform welding and copy vertices into local buffer.
        var ps = new Array(b2_maxPolygonVertices);
        var tempCount = 0;

        for (var i = 0; i < n; ++i)
        {
            var v = vertices[i];
            var unique = true;

            for (var j = 0; j < tempCount; ++j)
            {
                if (b2DistanceSquared(v, ps[j]) < 0.5 * b2_linearSlop)
                {
                    unique = false;
                    break;
                }
            }

            if (unique)
            {
                ps[tempCount++] = v.Clone();
            }
        }

        n = tempCount;
        if (n < 3)
        {

            // Polygon is degenerate.
            b2Assert(false);

            this.SetAsBox(1.0, 1.0);
            return;
        }

        // Create the convex hull using the Gift wrapping algorithm
        // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm

        // Find the right most point on the hull
        var i0 = 0;
        var x0 = ps[0].x;
        for (i = 1; i < n; ++i)
        {
            var x = ps[i].x;
            if (x > x0 || (x == x0 && ps[i].y < ps[i0].y))
            {
                i0 = i;
                x0 = x;
            }
        }

        var hull = new Array(b2_maxPolygonVertices);
        var m = 0;
        var ih = i0;

        for (;;)
        {
            hull[m] = ih;

            var ie = 0;
            for (j = 1; j < n; ++j)
            {
                if (ie == ih)
                {
                    ie = j;
                    continue;
                }

                var r = b2Vec2.Subtract(ps[ie], ps[hull[m]]);
                var v = b2Vec2.Subtract(ps[j], ps[hull[m]]);
                var c = b2Cross_v2_v2(r, v);
                if (c < 0.0)
                {
                    ie = j;
                }

                // Collinearity check
                if (c == 0.0 && v.LengthSquared() > r.LengthSquared())
                {
                    ie = j;
                }
            }

            ++m;
            ih = ie;

            if (ie == i0)
            {
                break;
            }
        }

        if (m < 3)
        {
            // Polygon is degenerate.

            b2Assert(false);

            this.SetAsBox(1.0, 1.0);
            return;
        }

        this.m_count = m;

        // Copy vertices.
        for (i = 0; i < m; ++i)
        {
            this.m_vertices[i] = ps[hull[i]].Clone();
        }

        // Compute normals. Ensure the edges have non-zero length.
        for (i = 0; i < m; ++i)
        {
            var i1 = i;
            var i2 = i + 1 < m ? i + 1 : 0;
            var edge = b2Vec2.Subtract(this.m_vertices[i2], this.m_vertices[i1]);

            b2Assert(edge.LengthSquared() > b2_epsilon * b2_epsilon);

            this.m_normals[i] = b2Cross_v2_f(edge, 1.0).Clone();
            this.m_normals[i].Normalize();
        }

        // Compute the polygon centroid.
        this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, m);
    },

    /// Build vertices to represent an axis-aligned box centered on the local origin.
    /// @param hx the half-width.
    /// @param hy the half-height.
    SetAsBox: function(hx, hy, center, angle)
    {
        this.m_count = 4;
        this.m_vertices[0] = new b2Vec2(-hx, -hy);
        this.m_vertices[1] = new b2Vec2( hx, -hy);
        this.m_vertices[2] = new b2Vec2( hx,  hy);
        this.m_vertices[3] = new b2Vec2(-hx,  hy);
        this.m_normals[0] = new b2Vec2(0.0, -1.0);
        this.m_normals[1] = new b2Vec2(1.0, 0.0);
        this.m_normals[2] = new b2Vec2(0.0, 1.0);
        this.m_normals[3] = new b2Vec2(-1.0, 0.0);

        if (!center)
            return;

        this.m_centroid.Assign(center);

        var xf = new b2Transform();
        xf.p = center;
        xf.q.Set(angle);

        // Transform vertices and normals.
        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_vertices[i].Assign(b2Mul_t_v2(xf, this.m_vertices[i]));
            this.m_normals[i].Assign(b2Mul_r_v2(xf.q, this.m_normals[i]));
        }
    },

    /// @see b2Shape::TestPoint
    TestPoint: function(xf, p)
    {
        var pLocal = b2MulT_r_v2(xf.q, b2Vec2.Subtract(p, xf.p));

        for (var i = 0; i < this.m_count; ++i)
        {
            var dot = b2Dot_v2_v2(this.m_normals[i], b2Vec2.Subtract(pLocal, this.m_vertices[i]));
            if (dot > 0.0)
            {
                return false;
            }
        }

        return true;
    },

    /// Implement b2Shape.
    RayCast: function(output, input,
                    xf, childIndex)
    {
        // Put the ray into the polygon's frame of reference.
        var p1 = b2MulT_r_v2(xf.q, b2Vec2.Subtract(input.p1, xf.p));
        var p2 = b2MulT_r_v2(xf.q, b2Vec2.Subtract(input.p2, xf.p));
        var d = b2Vec2.Subtract(p2, p1);

        var lower = 0.0, upper = input.maxFraction;

        var index = -1;

        for (var i = 0; i < this.m_count; ++i)
        {
            // p = p1 + a * d
            // dot(normal, p - v) = 0
            // dot(normal, p1 - v) + a * dot(normal, d) = 0
            var numerator = b2Dot_v2_v2(this.m_normals[i], b2Vec2.Subtract(this.m_vertices[i], p1));
            var denominator = b2Dot_v2_v2(this.m_normals[i], d);

            if (denominator == 0.0)
            {
                if (numerator < 0.0)
                {
                    return false;
                }
            }
            else
            {
                // Note: we want this predicate without division:
                // lower < numerator / denominator, where denominator < 0
                // Since denominator < 0, we have to flip the inequality:
                // lower < numerator / denominator <==> denominator * lower > numerator.
                if (denominator < 0.0 && numerator < lower * denominator)
                {
                    // Increase lower.
                    // The segment enters this half-space.
                    lower = numerator / denominator;
                    index = i;
                }
                else if (denominator > 0.0 && numerator < upper * denominator)
                {
                    // Decrease upper.
                    // The segment exits this half-space.
                    upper = numerator / denominator;
                }
            }

            // The use of epsilon here causes the assert on lower to trip
            // in some cases. Apparently the use of epsilon was to make edge
            // shapes work, but now those are handled separately.
            //if (upper < lower - b2_epsilon)
            if (upper < lower)
            {
                return false;
            }
        }


        b2Assert(0.0 <= lower && lower <= input.maxFraction);


        if (index >= 0)
        {
            output.fraction = lower;
            output.normal = b2Mul_r_v2(xf.q, this.m_normals[index]);
            return true;
        }

        return false;
    },

    /// @see b2Shape::ComputeAABB
    ComputeAABB: function(aabb, xf, childIndex)
    {
        var lowerx = (xf.q.c * this.m_vertices[0].x - xf.q.s * this.m_vertices[0].y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertices[0]);
        var lowery = (xf.q.s * this.m_vertices[0].x + xf.q.c * this.m_vertices[0].y) + xf.p.y;
        var upperx = lowerx;
        var uppery = lowery;

        for (var i = 1; i < this.m_count; ++i)
        {
            var vx = (xf.q.c * this.m_vertices[i].x - xf.q.s * this.m_vertices[i].y) + xf.p.x;//b2Mul_t_v2(xf, this.m_vertices[i]);
            var vy = (xf.q.s * this.m_vertices[i].x + xf.q.c * this.m_vertices[i].y) + xf.p.y;
            lowerx = b2Min(lowerx, vx);//b2Min_v2(lower, v);
            lowery = b2Min(lowery, vy);
            upperx = b2Max(upperx, vx);//b2Max_v2(upper, v);
            uppery = b2Max(uppery, vy);
        }

        //var r = new b2Vec2(this.m_radius, this.m_radius);
        aabb.lowerBound.x = lowerx - this.m_radius; //b2Vec2.Subtract(lower, r);
        aabb.lowerBound.y = lowery - this.m_radius;
        aabb.upperBound.x = upperx + this.m_radius; //b2Vec2.Add(upper, r);
        aabb.upperBound.y = uppery + this.m_radius;
    },

    /// @see b2Shape::ComputeMass
    ComputeMass: function(massData, density)
    {
        // Polygon mass, centroid, and inertia.
        // Let rho be the polygon density in mass per unit area.
        // Then:
        // mass = rho * int(dA)
        // centroid.x = (1/mass) * rho * int(x * dA)
        // centroid.y = (1/mass) * rho * int(y * dA)
        // I = rho * int((x*x + y*y) * dA)
        //
        // We can compute these integrals by summing all the integrals
        // for each triangle of the polygon. To evaluate the integral
        // for a single triangle, we make a change of variables to
        // the (u,v) coordinates of the triangle:
        // x = x0 + e1x * u + e2x * v
        // y = y0 + e1y * u + e2y * v
        // where 0 <= u && 0 <= v && u + v <= 1.
        //
        // We integrate u from [0,1-v] and then v from [0,1].
        // We also need to use the Jacobian of the transformation:
        // D = cross(e1, e2)
        //
        // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
        //
        // The rest of the derivation is handled by computer algebra.

        b2Assert(this.m_count >= 3);


        var center = new b2Vec2(0.0, 0.0);
        var area = 0.0;
        var I = 0.0;

        // s is the reference point for forming triangles.
        // It's location doesn't change the result (except for rounding error).
        var s = new b2Vec2(0.0, 0.0);

        // This code would put the reference point inside the polygon.
        for (var i = 0; i < this.m_count; ++i)
        {
            s.Add(this.m_vertices[i]);
        }
        s.Multiply(1.0 / this.m_count);

        var k_inv3 = 1.0 / 3.0;

        for (var i = 0; i < this.m_count; ++i)
        {
            // Triangle vertices.
            var e1 = b2Vec2.Subtract(this.m_vertices[i], s);
            var e2 = i + 1 < this.m_count ? b2Vec2.Subtract(this.m_vertices[i + 1], s) : b2Vec2.Subtract(this.m_vertices[0], s);

            var D = b2Cross_v2_v2(e1, e2);

            var triangleArea = 0.5 * D;
            area += triangleArea;

            // Area weighted centroid
            center.Add(b2Vec2.Multiply(triangleArea * k_inv3, b2Vec2.Add(e1, e2)));

            var ex1 = e1.x, ey1 = e1.y;
            var ex2 = e2.x, ey2 = e2.y;

            var intx2 = ex1*ex1 + ex2*ex1 + ex2*ex2;
            var inty2 = ey1*ey1 + ey2*ey1 + ey2*ey2;

            I += (0.25 * k_inv3 * D) * (intx2 + inty2);
        }

        // Total mass
        massData.mass = density * area;

        // Center of mass

        b2Assert(area > b2_epsilon);

        center.Multiply(1.0 / area);
        massData.center = b2Vec2.Add(center, s);

        // Inertia tensor relative to the local origin (point s).
        massData.I = density * I;

        // Shift to center of mass then to original body origin.
        massData.I += massData.mass * (b2Dot_v2_v2(massData.center, massData.center) - b2Dot_v2_v2(center, center));
    },

    /// Get the vertex count.
    GetVertexCount: function() { return this.m_count; },

    /// Get a vertex by index.
    GetVertex: function(index)
    {

        b2Assert(0 <= index && index < this.m_count);

        return this.m_vertices[index];
    },

    /// Validate convexity. This is a very time consuming operation.
    /// @returns true if valid
    Validate: function()
    {
        for (var i = 0; i < this.m_count; ++i)
        {
            var i1 = i;
            var i2 = i < this.m_count - 1 ? i1 + 1 : 0;
            var p = this.m_vertices[i1];
            var e = b2Vec2.Subtract(this.m_vertices[i2], p);

            for (var j = 0; j < this.m_count; ++j)
            {
                if (j == i1 || j == i2)
                {
                    continue;
                }

                var v = b2Vec2.Subtract(this.m_vertices[j], p);
                var c = b2Cross_v2_v2(e, v);
                if (c < 0.0)
                {
                    return false;
                }
            }
        }

        return true;
    },

//

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['m_count'] = this.m_count;
        obj['m_centroid'] = this.m_centroid._serialize();

        obj['m_vertices'] = [];
        obj['m_normals'] = [];

        for (var i = 0; i < this.m_count; ++i)
        {
            obj['m_vertices'].push(this.m_vertices[i]._serialize());
            obj['m_normals'].push(this.m_normals[i]._serialize());
        }

        return obj;
    },

    _deserialize: function(data)
    {
        this.parent.prototype._deserialize.call(this, data);

        this.m_count = data['m_count'];
        this.m_centroid._deserialize(data['m_centroid']);

        this.m_vertices = [];
        this.m_normals = [];

        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_vertices[i] = new b2Vec2();
            this.m_vertices[i]._deserialize(data['m_vertices'][i]);
            this.m_normals[i] = new b2Vec2();
            this.m_normals[i]._deserialize(data['m_normals'][i]);
        }
    }
};

b2PolygonShape.ComputeCentroid = function(vs, count)
{

    b2Assert(count >= 3);


    var c = new b2Vec2();
    var area = 0.0;

    // pRef is the reference point for forming triangles.
    // It's location doesn't change the result (except for rounding error).
    var pRef = new b2Vec2(0.0, 0.0);
/*#if 0
    // This code would put the reference point inside the polygon.
    for (int32 i = 0; i < count; ++i)
    {
        pRef += vs[i];
    }
    pRef *= 1.0 / count;
#endif*/

    var inv3 = 1.0 / 3.0;

    for (var i = 0; i < count; ++i)
    {
        // Triangle vertices.
        var p1 = pRef;
        var p2 = vs[i];
        var p3 = i + 1 < count ? vs[i+1] : vs[0];

        var e1 = b2Vec2.Subtract(p2, p1);
        var e2 = b2Vec2.Subtract(p3, p1);

        var D = b2Cross_v2_v2(e1, e2);

        var triangleArea = 0.5 * D;
        area += triangleArea;

        // Area weighted centroid
        c.Add(b2Vec2.Multiply(triangleArea, b2Vec2.Multiply(inv3, b2Vec2.Add(b2Vec2.Add(p1, p2), p3))));
    }

    // Centroid

    b2Assert(area > b2_epsilon);

    c.Multiply(1.0 / area);
    return c;
};

b2PolygonShape._extend(b2Shape);

function b2Pair()
{
    this.proxyIdA = 0;
    this.proxyIdB = 0;
}

/// This is used to sort pairs.
function b2PairLessThan(pair1, pair2)
{
    if (pair1.proxyIdA == pair2.proxyIdA)
    {
        return pair1.proxyIdB - pair2.proxyIdB;
    }

    return pair1.proxyIdA - pair2.proxyIdA;
}

/// The broad-phase is used for computing pairs and performing volume queries and ray casts.
/// This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
/// It is up to the client to consume the new pairs and to track subsequent overlap.
function b2BroadPhase()
{
    this.m_tree = new b2DynamicTree();
    this.m_queryProxyId = 0;

    this.m_proxyCount = 0;

    this.m_pairCount = 0;
    this.m_pairBuffer = [];

    this.m_moveCount = 0;
    this.m_moveBuffer = [];
}

b2BroadPhase.prototype =
{
    /// Create a proxy with an initial AABB. Pairs are not reported until
    /// UpdatePairs is called.
    CreateProxy: function(aabb, userData)
    {
        var proxyId = this.m_tree.CreateProxy(aabb, userData);
        ++this.m_proxyCount;
        this.BufferMove(proxyId);
        return proxyId;
    },

    /// Destroy a proxy. It is up to the client to remove any pairs.
    DestroyProxy: function(proxyId)
    {
        this.UnBufferMove(proxyId);
        --this.m_proxyCount;
        this.m_tree.DestroyProxy(proxyId);
    },

    /// Call MoveProxy as many times as you like, then when you are done
    /// call UpdatePairs to finalized the proxy pairs (for your time step).
    MoveProxy: function(proxyId, aabb, displacement)
    {
        var buffer = this.m_tree.MoveProxy(proxyId, aabb, displacement);
        if (buffer)
        {
            this.BufferMove(proxyId);
        }
    },

    /// Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
    TouchProxy: function(proxyId)
    {
        this.BufferMove(proxyId);
    },

    /// Get the fat AABB for a proxy.
    GetFatAABB: function(proxyId)
    {
        return this.m_tree.GetFatAABB(proxyId);
    },

    /// Get user data from a proxy. Returns null if the id is invalid.
    GetUserData: function(proxyId)
    {
        return this.m_tree.GetUserData(proxyId);
    },

    /// Test overlap of fat AABBs.
    TestOverlap: function(proxyIdA, proxyIdB)
    {
        var aabbA = this.m_tree.GetFatAABB(proxyIdA);
        var aabbB = this.m_tree.GetFatAABB(proxyIdB);
        return b2TestOverlap(aabbA, aabbB);
    },

    /// Get the number of proxies.
    GetProxyCount: function()
    {
        return this.m_proxyCount;
    },

    /// Update the pairs. This results in pair callbacks. This can only add pairs.
    UpdatePairs: function(callback)
    {
        // Reset pair buffer
        this.m_pairCount = 0;
        this.m_pairBuffer.length = 0;

        // Perform tree queries for all moving proxies.
        for (var i = 0; i < this.m_moveCount; ++i)
        {
            this.m_queryProxyId = this.m_moveBuffer[i];
            if (this.m_queryProxyId == b2BroadPhase.e_nullProxy)
            {
                continue;
            }

            // We have to query the tree with the fat AABB so that
            // we don't fail to create a pair that may touch later.
            var fatAABB = this.m_tree.GetFatAABB(this.m_queryProxyId);

            // Query tree, create pairs and add them pair buffer.
            this.m_tree.Query(this, fatAABB);
        }

        // Reset move buffer
        this.m_moveCount = 0;

        // Sort the pair buffer to expose duplicates.
        //std.sort(this.m_pairBuffer, this.m_pairBuffer + this.m_pairCount, b2PairLessThan);
        this.m_pairBuffer.sort(b2PairLessThan);

        // Send the pairs back to the client.
        var i = 0;
        while (i < this.m_pairCount)
        {
            var primaryPair = this.m_pairBuffer[i];
            var userDataA = this.m_tree.GetUserData(primaryPair.proxyIdA);
            var userDataB = this.m_tree.GetUserData(primaryPair.proxyIdB);

            callback.AddPair(userDataA, userDataB);
            ++i;

            // Skip any duplicate pairs.
            while (i < this.m_pairCount)
            {
                var pair = this.m_pairBuffer[i];
                if (pair.proxyIdA != primaryPair.proxyIdA || pair.proxyIdB != primaryPair.proxyIdB)
                {
                    break;
                }
                ++i;
            }
        }

        // Try to keep the tree balanced.
        //this->m_tree.Rebalance(4);
    },

    /// Query an AABB for overlapping proxies. The callback class
    /// is called for each proxy that overlaps the supplied AABB.
    Query: function(callback, aabb)
    {
        this.m_tree.Query(callback, aabb);
    },

    /// Ray-cast against the proxies in the tree. This relies on the callback
    /// to perform a exact ray-cast in the case were the proxy contains a shape.
    /// The callback also performs the any collision filtering. This has performance
    /// roughly equal to k * log(n), where k is the number of collisions and n is the
    /// number of proxies in the tree.
    /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
    /// @param callback a callback class that is called for each proxy that is hit by the ray.
    RayCast: function(callback, input)
    {
        this.m_tree.RayCast(callback, input);
    },

    /// Get the height of the embedded tree.
    GetTreeHeight: function()
    {
        return this.m_tree.GetHeight();
    },

    /// Get the balance of the embedded tree.
    GetTreeBalance: function()
    {
        return this.m_tree.GetMaxBalance();
    },

    /// Get the quality metric of the embedded tree.
    GetTreeQuality: function()
    {
        return this.m_tree.GetAreaRatio();
    },

    /// Shift the world origin. Useful for large worlds.
    /// The shift formula is: position -= newOrigin
    /// @param newOrigin the new origin with respect to the old origin
    ShiftOrigin: function(newOrigin)
    {
        this.m_tree.ShiftOrigin(newOrigin);
    },

    BufferMove: function(proxyId)
    {
        this.m_moveBuffer[this.m_moveCount] = proxyId;
        ++this.m_moveCount;
    },

    UnBufferMove: function(proxyId)
    {
        for (var i = 0; i < this.m_moveCount; ++i)
        {
            if (this.m_moveBuffer[i] == proxyId)
            {
                this.m_moveBuffer[i] = b2BroadPhase.e_nullProxy;
            }
        }
    },

    QueryCallback: function(proxyId)
    {
        // A proxy cannot form a pair with itself.
        if (proxyId == this.m_queryProxyId)
        {
            return true;
        }

        // Grow the pair buffer as needed.
        this.m_pairBuffer[this.m_pairCount] = new b2Pair();
        this.m_pairBuffer[this.m_pairCount].proxyIdA = b2Min(proxyId, this.m_queryProxyId);
        this.m_pairBuffer[this.m_pairCount].proxyIdB = b2Max(proxyId, this.m_queryProxyId);
        ++this.m_pairCount;

        return true;
    }
};

b2BroadPhase.e_nullProxy = -1;
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// A distance proxy is used by the GJK algorithm.
/// It encapsulates any shape.
function b2DistanceProxy()
{
    this.m_vertices = null;
    this.m_count = 0;
    this.m_radius = 0;
}

b2DistanceProxy.prototype =
{
    Assign: function(l)
    {
        this.m_vertices = l.m_vertices;
        this.m_count = l.m_count;
        this.m_radius = l.m_radius;
    },

    /// Initialize the proxy using the given shape. The shape
    /// must remain in scope while the proxy is in use.
    Set: function(shape, index)
    {
        switch (shape.GetType())
        {
        case b2Shape.e_circle:
            {
                var circle = shape;
                this.m_vertices = [ circle.m_p ];
                this.m_count = 1;
                this.m_radius = circle.m_radius;
            }
            break;

        case b2Shape.e_polygon:
            {
                var polygon = shape;

                this.m_vertices = polygon.m_vertices;
                this.m_count = polygon.m_count;
                this.m_radius = polygon.m_radius;
            }
            break;

        case b2Shape.e_chain:
            {
                var chain = shape;

                b2Assert(0 <= index && index < chain.m_count);

                this.m_vertices = [ chain.m_vertices[index] ];
                if (index + 1 < chain.m_count)
                {
                    this.m_vertices[1] = chain.m_vertices[index + 1];
                }
                else
                {
                    this.m_vertices[1] = chain.m_vertices[0];
                }

                this.m_count = 2;
                this.m_radius = chain.m_radius;
            }
            break;

        case b2Shape.e_edge:
            {
                var edge = shape;
                this.m_vertices = [ edge.m_vertex1, edge.m_vertex2 ];
                this.m_count = 2;
                this.m_radius = edge.m_radius;
            }
            break;


        default:
            b2Assert(false);

        }
    },

    /// Get the supporting vertex index in the given direction.
    GetSupport: function(dx, dy)
    {
        var bestIndex = 0;
        var bestValue = this.m_vertices[0].x * dx + this.m_vertices[0].y * dy;//b2Dot_v2_v2(this.m_vertices[0], d);
        for (var i = 1; i < this.m_count; ++i)
        {
            var value = this.m_vertices[i].x * dx + this.m_vertices[i].y * dy;//b2Dot_v2_v2(this.m_vertices[i], d);
            if (value > bestValue)
            {
                bestIndex = i;
                bestValue = value;
            }
        }

        return bestIndex;
    },

    /// Get the supporting vertex in the given direction.
    GetSupportVertex: function(dx, dy)
    {
        return this.m_vertices[this.GetSupport(dx, dy)];
    },

    /// Get the vertex count.
    GetVertexCount: function()
    {
        return this.m_count;
    },

    /// Get a vertex by index. Used by b2Distance.
    GetVertex: function(index)
    {

        b2Assert(0 <= index && index < this.m_count);

        return this.m_vertices[index];
    }
};

/// Used to warm start b2Distance.
/// Set count to zero on first call.
function b2SimplexCache()
{
    this.metric = 0;        ///< length or area
    this.count = 0;
    this.indexA = [0, 0, 0];    ///< vertices on shape A
    this.indexB = [0, 0, 0];    ///< vertices on shape B
};

/// Input for b2Distance.
/// You have to option to use the shape radii
/// in the computation. Even
function b2DistanceInput()
{
    this.proxyA = new b2DistanceProxy();
    this.proxyB = new b2DistanceProxy();
    this.transformA = new b2Transform();
    this.transformB = new b2Transform();
    this.useRadii = false;
};

/// Output for b2Distance.
function b2DistanceOutput()
{
    this.pointA = new b2Vec2();     ///< closest point on shapeA
    this.pointB = new b2Vec2();     ///< closest point on shapeB
    this.distance = 0;
    this.iterations = 0;    ///< number of GJK iterations used
};

function b2SimplexVertex()
{
    this.wA = new b2Vec2();     // support point in proxyA
    this.wB = new b2Vec2();     // support point in proxyB
    this.w = new b2Vec2();      // wB - wA
    this.a = 0;     // barycentric coordinate for closest point
    this.indexA = 0;    // wA index
    this.indexB = 0;    // wB index
}

b2SimplexVertex.prototype =
{
    Assign: function(l)
    {
        this.wA.x = l.wA.x;//.Assign(l.wA);
        this.wA.y = l.wA.y;
        this.wB.x = l.wB.x;//.Assign(l.wB);
        this.wB.y = l.wB.y;
        this.w.x = l.w.x;//.Assign(l.w);
        this.w.y = l.w.y;
        this.a = l.a;
        this.indexA = l.indexA;
        this.indexB = l.indexB;
    }
};

function b2Simplex()
{
    this.m_v = [new b2SimplexVertex(), new b2SimplexVertex(), new b2SimplexVertex()];
    this.m_count = 0;
}

b2Simplex.prototype =
{
    ReadCache: function(cache,
                    proxyA, transformA,
                    proxyB, transformB)
    {

        b2Assert(cache.count <= 3);


        // Copy data from cache.
        this.m_count = cache.count;
        var vertices = this.m_v;
        for (var i = 0; i < this.m_count; ++i)
        {
            var v = vertices[i];
            v.indexA = cache.indexA[i];
            v.indexB = cache.indexB[i];
            var wALocal = proxyA.GetVertex(v.indexA);
            var wBLocal = proxyB.GetVertex(v.indexB);
            //v.wA.Assign(b2Mul_t_v2(transformA, wALocal));
            v.wA.x = (transformA.q.c * wALocal.x - transformA.q.s * wALocal.y) + transformA.p.x;
            v.wA.y = (transformA.q.s * wALocal.x + transformA.q.c * wALocal.y) + transformA.p.y;
            //v.wB.Assign(b2Mul_t_v2(transformB, wBLocal));
            v.wB.x = (transformB.q.c * wBLocal.x - transformB.q.s * wBLocal.y) + transformB.p.x;
            v.wB.y = (transformB.q.s * wBLocal.x + transformB.q.c * wBLocal.y) + transformB.p.y;
            //v.w.Assign(b2Vec2.Subtract(v.wB, v.wA));
            v.w.x = v.wB.x - v.wA.x;
            v.w.y = v.wB.y - v.wA.y;
            v.a = 0.0;
        }

        // Compute the new simplex metric, if it is substantially different than
        // old metric then flush the simplex.
        if (this.m_count > 1)
        {
            var metric1 = cache.metric;
            var metric2 = this.GetMetric();
            if (metric2 < 0.5 * metric1 || 2.0 * metric1 < metric2 || metric2 < b2_epsilon)
            {
                // Reset the simplex.
                this.m_count = 0;
            }
        }

        // If the cache is empty or invalid ...
        if (this.m_count == 0)
        {
            var v = vertices[0];
            v.indexA = 0;
            v.indexB = 0;
            var wALocal = proxyA.GetVertex(0);
            var wBLocal = proxyB.GetVertex(0);
            //v.wA.Assign(b2Mul_t_v2(transformA, wALocal));
            v.wA.x = (transformA.q.c * wALocal.x - transformA.q.s * wALocal.y) + transformA.p.x;
            v.wA.y = (transformA.q.s * wALocal.x + transformA.q.c * wALocal.y) + transformA.p.y;
            //v.wB.Assign(b2Mul_t_v2(transformB, wBLocal));
            v.wB.x = (transformB.q.c * wBLocal.x - transformB.q.s * wBLocal.y) + transformB.p.x;
            v.wB.y = (transformB.q.s * wBLocal.x + transformB.q.c * wBLocal.y) + transformB.p.y;
            //v.w.Assign(b2Vec2.Subtract(v.wB, v.wA));
            v.w.x = v.wB.x - v.wA.x;
            v.w.y = v.wB.y - v.wA.y;
            v.a = 1.0;
            this.m_count = 1;
        }
    },

    WriteCache: function(cache)
    {
        cache.metric = this.GetMetric();
        cache.count = this.m_count;
        var vertices = this.m_v;
        for (var i = 0; i < this.m_count; ++i)
        {
            cache.indexA[i] = vertices[i].indexA;
            cache.indexB[i] = vertices[i].indexB;
        }
    },

    GetSearchDirection: function(p)
    {
        switch (this.m_count)
        {
        case 1:
            //return this.m_v[0].w.Negate();
            p.x = -this.m_v[0].w.x;
            p.y = -this.m_v[0].w.y;
            break;

        case 2:
            {
                var e12x = this.m_v[1].w.x - this.m_v[0].w.x;//b2Vec2.Subtract(this.m_v[1].w, this.m_v[0].w);
                var e12y = this.m_v[1].w.y - this.m_v[0].w.y;
                var sgn = e12x * -this.m_v[0].w.y - e12y * -this.m_v[0].w.x;//b2Cross_v2_v2(e12, this.m_v[0].w.Negate());
                if (sgn > 0.0)
                {
                    // Origin is left of e12.
                    p.x = -1.0 * e12y; p.y = 1.0 * e12x;//b2Cross_f_v2(1.0, e12);
                }
                else
                {
                    // Origin is right of e12.
                    p.x = 1.0 * e12y; p.y = -1.0 * e12x;//b2Cross_v2_f(e12, 1.0);
                }
            }
            break;


        default:
            b2Assert(false);
            p.x = p.y = 0;
            break;

        }
    },

    GetClosestPoint: function(p)
    {
        switch (this.m_count)
        {
        case 1:
            //return this.m_v[0].w;
            p.x = this.m_v[0].w.x;
            p.y = this.m_v[0].w.y;
            break;

        case 2:
            //return b2Vec2.Add(b2Vec2.Multiply(this.m_v[0].a, this.m_v[0].w), b2Vec2.Multiply(this.m_v[1].a, this.m_v[1].w));
            p.x = (this.m_v[0].a * this.m_v[0].w.x) + (this.m_v[1].a *this.m_v[1].w.x);
            p.y = (this.m_v[0].a * this.m_v[0].w.y) + (this.m_v[1].a *this.m_v[1].w.y);
            break;

        case 3:
            p.x = p.y = 0;
            break;


        default:
            b2Assert(false);
            p.x = p.y = 0;
            break;

        }
    },

    GetWitnessPoints: function(pA, pB)
    {
        switch (this.m_count)
        {
        case 1:
            pA.x = this.m_v[0].wA.x;//.Assign(this.m_v[0].wA);
            pA.y = this.m_v[0].wA.y;
            pB.x = this.m_v[0].wB.x;//.Assign(this.m_v[0].wB);
            pB.y = this.m_v[0].wB.y;
            break;

        case 2:
            //pA.Assign(b2Vec2.Add(b2Vec2.Multiply(this.m_v[0].a, this.m_v[0].wA), b2Vec2.Multiply(this.m_v[1].a, this.m_v[1].wA)));
            pA.x = (this.m_v[0].a * this.m_v[0].wA.x) + (this.m_v[1].a * this.m_v[1].wA.x);
            pA.y = (this.m_v[0].a * this.m_v[0].wA.y) + (this.m_v[1].a * this.m_v[1].wA.y);
            //pB.Assign(b2Vec2.Add(b2Vec2.Multiply(this.m_v[0].a, this.m_v[0].wB), b2Vec2.Multiply(this.m_v[1].a, this.m_v[1].wB)));
            pB.x = (this.m_v[0].a * this.m_v[0].wB.x) + (this.m_v[1].a * this.m_v[1].wB.x);
            pB.y = (this.m_v[0].a * this.m_v[0].wB.y) + (this.m_v[1].a * this.m_v[1].wB.y);
            break;

        case 3:
            //pA.Assign(b2Vec2.Add(b2Vec2.Add(b2Vec2.Multiply(this.m_v[0].a, this.m_v[0].wA), b2Vec2.Multiply(this.m_v[1].a, this.m_v[1].wA)), b2Vec2.Multiply(this.m_v[2].a, this.m_v[2].wA)));
            pA.x = (this.m_v[0].a * this.m_v[0].wA.x) + (this.m_v[1].a * this.m_v[1].wA.x) + (this.m_v[2].a * this.m_v[2].wA.x);
            pA.y = (this.m_v[0].a * this.m_v[0].wA.y) + (this.m_v[1].a * this.m_v[1].wA.y) + (this.m_v[2].a * this.m_v[2].wA.y);
            pB.x = pA.x;//.Assign(pA);
            pB.y = pA.y;
            break;


        default:
            b2Assert(false);
            break;

        }
    },

    GetMetric: function()
    {
        switch (this.m_count)
        {
        case 1:
            return 0.0;

        case 2:
            return b2Distance(this.m_v[0].w, this.m_v[1].w);

        case 3:
            //return b2Cross_v2_v2(b2Vec2.Subtract(this.m_v[1].w, this.m_v[0].w), b2Vec2.Subtract(this.m_v[2].w, this.m_v[0].w));
            return (this.m_v[1].w.x - this.m_v[0].w.x) * (this.m_v[2].w.y - this.m_v[0].w.y) - (this.m_v[1].w.y - this.m_v[0].w.y) * (this.m_v[2].w.x - this.m_v[0].w.x);


        default:
            b2Assert(false);
            return 0.0;

        }
    },

    // Solve a line segment using barycentric coordinates.
    //
    // p = a1 * w1 + a2 * w2
    // a1 + a2 = 1
    //
    // The vector from the origin to the closest point on the line is
    // perpendicular to the line.
    // e12 = w2 - w1
    // dot(p, e) = 0
    // a1 * dot(w1, e) + a2 * dot(w2, e) = 0
    //
    // 2-by-2 linear system
    // [1      1     ][a1] = [1]
    // [w1.e12 w2.e12][a2] = [0]
    //
    // Define
    // d12_1 =  dot(w2, e12)
    // d12_2 = -dot(w1, e12)
    // d12 = d12_1 + d12_2
    //
    // Solution
    // a1 = d12_1 / d12
    // a2 = d12_2 / d12
    Solve2: function()
    {
        var w1 = this.m_v[0].w;
        var w2 = this.m_v[1].w;
        //var e12 = b2Vec2.Subtract(w2, w1);
        var e12x = w2.x - w1.x;
        var e12y = w2.y - w1.y;

        // w1 region
        var d12_2 = -(w1.x * e12x + w1.y * e12y);//-b2Dot_v2_v2(w1, e12);
        if (d12_2 <= 0.0)
        {
            // a2 <= 0, so we clamp it to 0
            this.m_v[0].a = 1.0;
            this.m_count = 1;
            return;
        }

        // w2 region
        var d12_1 = w2.x * e12x + w2.y * e12y;//b2Dot_v2_v2(w2, e12);
        if (d12_1 <= 0.0)
        {
            // a1 <= 0, so we clamp it to 0
            this.m_v[1].a = 1.0;
            this.m_count = 1;
            this.m_v[0].Assign(this.m_v[1]);
            return;
        }

        // Must be in e12 region.
        var inv_d12 = 1.0 / (d12_1 + d12_2);
        this.m_v[0].a = d12_1 * inv_d12;
        this.m_v[1].a = d12_2 * inv_d12;
        this.m_count = 2;
    },

    // Possible regions:
    // - points[2]
    // - edge points[0]-points[2]
    // - edge points[1]-points[2]
    // - inside the triangle
    Solve3: function()
    {
        var w1 = this.m_v[0].w;
        var w2 = this.m_v[1].w;
        var w3 = this.m_v[2].w;

        // Edge12
        // [1      1     ][a1] = [1]
        // [w1.e12 w2.e12][a2] = [0]
        // a3 = 0
        //var e12 = b2Vec2.Subtract(w2, w1);
        var e12x = w2.x - w1.x;
        var e12y = w2.y - w1.y;
        var w1e12 = w1.x * e12x + w1.y * e12y;//b2Dot_v2_v2(w1, e12);
        var w2e12 = w2.x * e12x + w2.y * e12y;//b2Dot_v2_v2(w2, e12);
        var d12_1 = w2e12;
        var d12_2 = -w1e12;

        // Edge13
        // [1      1     ][a1] = [1]
        // [w1.e13 w3.e13][a3] = [0]
        // a2 = 0
        //var e13 = b2Vec2.Subtract(w3, w1);
        var e13x = w3.x - w1.x;
        var e13y = w3.y - w1.y;
        var w1e13 = w1.x * e13x + w1.y * e13y;//b2Dot_v2_v2(w1, e13);
        var w3e13 = w3.x * e13x + w3.y * e13y;//b2Dot_v2_v2(w3, e13);
        var d13_1 = w3e13;
        var d13_2 = -w1e13;

        // Edge23
        // [1      1     ][a2] = [1]
        // [w2.e23 w3.e23][a3] = [0]
        // a1 = 0
        //var e23 = b2Vec2.Subtract(w3, w2);
        var e23x = w3.x - w2.x;
        var e23y = w3.y - w2.y;
        var w2e23 = w2.x * e23x + w2.y * e23y;//b2Dot_v2_v2(w2, e23);
        var w3e23 = w3.x * e23x + w3.y * e23y;//b2Dot_v2_v2(w3, e23);
        var d23_1 = w3e23;
        var d23_2 = -w2e23;

        // Triangle123
        var n123 = e12x * e13y - e12y * e13x;//b2Cross_v2_v2(e12, e13);

        var d123_1 = n123 * (w2.x * w3.y - w2.y * w3.x);//b2Cross_v2_v2(w2, w3);
        var d123_2 = n123 * (w3.x * w1.y - w3.y * w1.x);//b2Cross_v2_v2(w3, w1);
        var d123_3 = n123 * (w1.x * w2.y - w1.y * w2.x);//b2Cross_v2_v2(w1, w2);

        // w1 region
        if (d12_2 <= 0.0 && d13_2 <= 0.0)
        {
            this.m_v[0].a = 1.0;
            this.m_count = 1;
            return;
        }

        // e12
        if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0)
        {
            var inv_d12 = 1.0 / (d12_1 + d12_2);
            this.m_v[0].a = d12_1 * inv_d12;
            this.m_v[1].a = d12_2 * inv_d12;
            this.m_count = 2;
            return;
        }

        // e13
        if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0)
        {
            var inv_d13 = 1.0 / (d13_1 + d13_2);
            this.m_v[0].a = d13_1 * inv_d13;
            this.m_v[2].a = d13_2 * inv_d13;
            this.m_count = 2;
            this.m_v[1].Assign(this.m_v[2]);
            return;
        }

        // w2 region
        if (d12_1 <= 0.0 && d23_2 <= 0.0)
        {
            this.m_v[1].a = 1.0;
            this.m_count = 1;
            this.m_v[0].Assign(this.m_v[1]);
            return;
        }

        // w3 region
        if (d13_1 <= 0.0 && d23_1 <= 0.0)
        {
            this.m_v[2].a = 1.0;
            this.m_count = 1;
            this.m_v[0].Assign(this.m_v[2]);
            return;
        }

        // e23
        if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0)
        {
            var inv_d23 = 1.0 / (d23_1 + d23_2);
            this.m_v[1].a = d23_1 * inv_d23;
            this.m_v[2].a = d23_2 * inv_d23;
            this.m_count = 2;
            this.m_v[0].Assign(this.m_v[2]);
            return;
        }

        // Must be in triangle123
        var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
        this.m_v[0].a = d123_1 * inv_d123;
        this.m_v[1].a = d123_2 * inv_d123;
        this.m_v[2].a = d123_3 * inv_d123;
        this.m_count = 3;
    }
};

/// Compute the closest points between two shapes. Supports any combination of:
/// b2CircleShape, b2PolygonShape, b2EdgeShape. The simplex cache is input/output.
/// On the first call set b2SimplexCache.count to zero.
var _b2Distance_simplex = new b2Simplex();
var _b2Distance_normal = new b2Vec2();
var _b2Distance_p = new b2Vec2();
function b2DistanceFunc(output,
                cache,
                input)
{
    ++b2DistanceFunc.b2_gjkCalls;

    var proxyA = input.proxyA;
    var proxyB = input.proxyB;

    var transformA = input.transformA;
    var transformB = input.transformB;

    // Initialize the simplex.
    _b2Distance_simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);

    // Get simplex vertices as an array.
    var vertices = _b2Distance_simplex.m_v;
    var k_maxIters = 20;

    // These store the vertices of the last simplex so that we
    // can check for duplicates and prevent cycling.
    var saveA = [0, 0, 0], saveB = [0, 0, 0];
    var saveCount = 0;

    var distanceSqr1 = b2_maxFloat;
    var distanceSqr2 = distanceSqr1;

    // Main iteration loop.
    var iter = 0;
    while (iter < k_maxIters)
    {
        // Copy simplex so we can identify duplicates.
        saveCount = _b2Distance_simplex.m_count;
        for (var i = 0; i < saveCount; ++i)
        {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
        }

        switch (_b2Distance_simplex.m_count)
        {
        case 1:
            break;

        case 2:
            _b2Distance_simplex.Solve2();
            break;

        case 3:
            _b2Distance_simplex.Solve3();
            break;


        default:
            b2Assert(false);

        }

        // If we have 3 points, then the origin is in the corresponding triangle.
        if (_b2Distance_simplex.m_count == 3)
        {
            break;
        }

        // Compute closest point.
        _b2Distance_simplex.GetClosestPoint(_b2Distance_p);
        distanceSqr2 = _b2Distance_p.LengthSquared();

        // Ensure progress
        if (distanceSqr2 >= distanceSqr1)
        {
            //break;
        }
        distanceSqr1 = distanceSqr2;

        // Get search direction.
        _b2Distance_simplex.GetSearchDirection(_b2Distance_p);

        // Ensure the search direction is numerically fit.
        if (_b2Distance_p.LengthSquared() < b2_epsilon * b2_epsilon)
        {
            // The origin is probably contained by a line segment
            // or triangle. Thus the shapes are overlapped.

            // We can't return zero here even though there may be overlap.
            // In case the simplex is a point, segment, or triangle it is difficult
            // to determine if the origin is contained in the CSO or very close to it.
            break;
        }

        // Compute a tentative new simplex vertex using support points.
        var vertex = vertices[_b2Distance_simplex.m_count];
        vertex.indexA = proxyA.GetSupport(transformA.q.c * -_b2Distance_p.x + transformA.q.s * -_b2Distance_p.y, -transformA.q.s * -_b2Distance_p.x + transformA.q.c * -_b2Distance_p.y);//b2MulT_r_v2(transformA.q, d.Negate()));
        //vertex.wA.Assign(b2Mul_t_v2(transformA, proxyA.GetVertex(vertex.indexA)));
        var pva = proxyA.GetVertex(vertex.indexA);
        vertex.wA.x = (transformA.q.c * pva.x - transformA.q.s * pva.y) + transformA.p.x;
        vertex.wA.y = (transformA.q.s * pva.x + transformA.q.c * pva.y) + transformA.p.y;

        vertex.indexB = proxyB.GetSupport(transformB.q.c * _b2Distance_p.x + transformB.q.s * _b2Distance_p.y, -transformB.q.s * _b2Distance_p.x + transformB.q.c * _b2Distance_p.y);//b2MulT_r_v2(transformB.q, d));
        //vertex.wB.Assign(b2Mul_t_v2(transformB, proxyB.GetVertex(vertex.indexB)));
        var pvb = proxyB.GetVertex(vertex.indexB);
        vertex.wB.x = (transformB.q.c * pvb.x - transformB.q.s * pvb.y) + transformB.p.x;
        vertex.wB.y = (transformB.q.s * pvb.x + transformB.q.c * pvb.y) + transformB.p.y;
        vertex.w.x = vertex.wB.x - vertex.wA.x;//b2Vec2.Subtract(vertex.wB, vertex.wA));
        vertex.w.y = vertex.wB.y - vertex.wA.y;

        // Iteration count is equated to the number of support point calls.
        ++iter;
        ++b2DistanceFunc.b2_gjkIters;

        // Check for duplicate support points. This is the main termination criteria.
        var duplicate = false;
        for (var i = 0; i < saveCount; ++i)
        {
            if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i])
            {
                duplicate = true;
                break;
            }
        }

        // If we found a duplicate support point we must exit to avoid cycling.
        if (duplicate)
        {
            break;
        }

        // New vertex is ok and needed.
        ++_b2Distance_simplex.m_count;
    }

    b2DistanceFunc.b2_gjkMaxIters = b2Max(b2DistanceFunc.b2_gjkMaxIters, iter);

    // Prepare output.
    _b2Distance_simplex.GetWitnessPoints(output.pointA, output.pointB);
    output.distance = b2Distance(output.pointA, output.pointB);
    output.iterations = iter;

    // Cache the simplex.
    _b2Distance_simplex.WriteCache(cache);

    // Apply radii if requested.
    if (input.useRadii)
    {
        var rA = proxyA.m_radius;
        var rB = proxyB.m_radius;

        if (output.distance > rA + rB && output.distance > b2_epsilon)
        {
            // Shapes are still no overlapped.
            // Move the witness points to the outer surface.
            output.distance -= rA + rB;
            //var normal = b2Vec2.Subtract(output.pointB, output.pointA);
            _b2Distance_normal.x = output.pointB.x - output.pointA.x;
            _b2Distance_normal.y = output.pointB.y - output.pointA.y;
            _b2Distance_normal.Normalize();
            output.pointA.x += (rA * _b2Distance_normal.x);//.Add(b2Vec2.Multiply(rA, normal));
            output.pointA.y += (rA * _b2Distance_normal.y);
            output.pointB.x -= (rB * _b2Distance_normal.x);//.Subtract(b2Vec2.Multiply(rB, normal));
            output.pointB.y -= (rB * _b2Distance_normal.y);
        }
        else
        {
            // Shapes are overlapped when radii are considered.
            // Move the witness points to the middle.
            //var p = b2Vec2.Multiply(0.5, b2Vec2.Add(output.pointA, output.pointB));
            var px = (0.5 * (output.pointA.x + output.pointB.x));
            var py = (0.5 * (output.pointA.y + output.pointB.y));
            output.pointA.x = px;//.Assign(p);
            output.pointA.y = py;
            output.pointB.x = px;//.Assign(p);
            output.pointB.y = py;
            output.distance = 0.0;
        }
    }
}

b2DistanceFunc.b2_gjkCalls = 0;
b2DistanceFunc.b2_gjkIters = 0;
b2DistanceFunc.b2_gjkMaxIters = 0;
var b2_nullFeature = 255;

/// The features that intersect to form the contact point
/// This must be 4 bytes or less.
function b2ContactID()
{
}

b2ContactID.prototype =
{
    indexA: 0,      ///< Feature index on shapeA
    indexB: 0,      ///< Feature index on shapeB
    typeA: 0,       ///< The feature type on shapeA
    typeB: 0,       ///< The feature type on shapeB

    Reset: function()
    {
        this.indexA = this.indexB = this.typeA = this.typeB = 0;
    },

    Get: function()
    {
        return this.indexA | (this.indexB << 8) | (this.typeA << 16) | (this.typeB << 24);
    },

    Assign: function(k)
    {
        this.indexA = k.indexA;
        this.indexB = k.indexB;
        this.typeA = k.typeA;
        this.typeB = k.typeB;
    }
};

b2ContactID.e_vertex = 0;
b2ContactID.e_face = 1;

/// A manifold point is a contact point belonging to a contact
/// manifold. It holds details related to the geometry and dynamics
/// of the contact points.
/// The local point usage depends on the manifold type:
/// -e_circles: the local center of circleB
/// -e_faceA: the local center of cirlceB or the clip point of polygonB
/// -e_faceB: the clip point of polygonA
/// This structure is stored across time steps, so we keep it small.
/// Note: the impulses are used for internal caching and may not
/// provide reliable contact forces, especially for high speed collisions.
function b2ManifoldPoint()
{
    this.localPoint = new b2Vec2();     ///< usage depends on manifold type
    this.normalImpulse = 0;             ///< the non-penetration impulse
    this.tangentImpulse = 0;            ///< the friction impulse
    this.id = new b2ContactID();        ///< uniquely identifies a contact point between two shapes
};

b2ManifoldPoint.prototype =
{
    Clone: function()
    {
        var point = new b2ManifoldPoint();
        point.localPoint.x = this.localPoint.x;//.Assign(this.localPoint);
        point.localPoint.y = this.localPoint.y;
        point.normalImpulse = this.normalImpulse;
        point.tangentImpulse = this.tangentImpulse;
        point.id.Assign(this.id);
        return point;
    }
};

/// A manifold for two touching convex shapes.
/// Box2D supports multiple types of contact:
/// - clip point versus plane with radius
/// - point versus point with radius (circles)
/// The local point usage depends on the manifold type:
/// -e_circles: the local center of circleA
/// -e_faceA: the center of faceA
/// -e_faceB: the center of faceB
/// Similarly the local normal usage:
/// -e_circles: not used
/// -e_faceA: the normal on polygonA
/// -e_faceB: the normal on polygonB
/// We store contacts in this way so that position correction can
/// account for movement, which is critical for continuous physics.
/// All contact scenarios must be expressed in one of these types.
/// This structure is stored across time steps, so we keep it small.
function b2Manifold()
{
    this.points = new Array(b2_maxManifoldPoints);  ///< the points of contact
    this.localNormal = new b2Vec2();                ///< not use for Type::e_points
    this.localPoint = new b2Vec2();                     ///< usage depends on manifold type
    this.type = 0;
    this.pointCount = 0;                            ///< the number of manifold points
};

b2Manifold.prototype =
{
    Clone: function()
    {
        var manifold = new b2Manifold();

        manifold.pointCount = this.pointCount;
        manifold.type = this.type;
        manifold.localPoint.x = this.localPoint.x;//.Assign(this.localPoint);
        manifold.localPoint.y = this.localPoint.y;
        manifold.localNormal.x = this.localNormal.x;//.Assign(this.localNormal);
        manifold.localNormal.y = this.localNormal.y;

        for (var i = 0; i < this.pointCount; ++i)
            manifold.points[i] = this.points[i].Clone();

        return manifold;
    },

    // NOTE: this version of assign is very specific and
    // should NOT be used in your own code.
    Assign: function(manifold)
    {
        this.pointCount = manifold.pointCount;
        this.type = manifold.type;
        this.localPoint.x = manifold.localPoint.x;//.Assign(manifold.localPoint);
        this.localPoint.y = manifold.localPoint.y;
        this.localNormal.x = manifold.localNormal.x;//.Assign(manifold.localNormal);
        this.localNormal.y = manifold.localNormal.y;

        for (var i = 0; i < this.pointCount; ++i)
            this.points[i] = manifold.points[i].Clone();
    }
};

b2Manifold.e_circles = 0;
b2Manifold.e_faceA = 1;
b2Manifold.e_faceB = 2;

/// This is used for determining the state of contact points.
b2Manifold.b2_nullState = 0;        ///< point does not exist
b2Manifold.b2_addState = 1;     ///< point was added in the update
b2Manifold.b2_persistState = 2; ///< point persisted across the update
b2Manifold.b2_removeState = 3;      ///< point was removed in the update

/// This is used to compute the current state of a contact manifold.
function b2WorldManifold()
{
    this.normal = new b2Vec2();                         ///< world vector pointing from A to B
    this.points = new Array(b2_maxManifoldPoints);      ///< world contact point (point of intersection)
    this.separations = new Array(b2_maxManifoldPoints); ///< a negative value indicates overlap, in meters
}

b2WorldManifold.prototype =
{
    /// Evaluate the manifold with supplied transforms. This assumes
    /// modest motion from the original state. This does not change the
    /// point count, impulses, etc. The radii must come from the shapes
    /// that generated the manifold.
    Initialize: function(manifold,
                    xfA, radiusA,
                    xfB, radiusB)
    {
        if (manifold.pointCount == 0)
        {
            return;
        }

        switch (manifold.type)
        {
        case b2Manifold.e_circles:
            {
                this.normal.x = 1; this.normal.y = 0;//.Set(1.0, 0.0);
                var pointAx = (xfA.q.c * manifold.localPoint.x - xfA.q.s * manifold.localPoint.y) + xfA.p.x;//b2Mul_t_v2(xfA, manifold.localPoint);
                var pointAy = (xfA.q.s * manifold.localPoint.x + xfA.q.c * manifold.localPoint.y) + xfA.p.y;
                var pointBx = (xfB.q.c * manifold.points[0].localPoint.x - xfB.q.s * manifold.points[0].localPoint.y) + xfB.p.x;//b2Mul_t_v2(xfB, manifold.points[0].localPoint);
                var pointBy = (xfB.q.s * manifold.points[0].localPoint.x + xfB.q.c * manifold.points[0].localPoint.y) + xfB.p.y;

                var cx = pointAx - pointBx;
                var cy = pointAy - pointBy;
                if ((cx * cx + cy * cy)/*b2DistanceSquared(pointA, pointB)*/ > b2_epsilon * b2_epsilon)
                {
                    this.normal.x = pointBx - pointAx;// = b2Vec2.Subtract(pointB, pointA);
                    this.normal.y = pointBy - pointAy;
                    this.normal.Normalize();
                }

                //var cA = b2Vec2.Add(pointA, b2Vec2.Multiply(radiusA, this.normal));
                var cAx = pointAx + (radiusA * this.normal.x);
                var cAy = pointAy + (radiusA * this.normal.y);
                //var cB = b2Vec2.Subtract(pointB, b2Vec2.Multiply(radiusB, this.normal));
                var cBx = pointBx - (radiusB * this.normal.x);
                var cBy = pointBy - (radiusB * this.normal.y);
                //this.points[0] = b2Vec2.Multiply(0.5, b2Vec2.Add(cA, cB));
                this.points[0] = new b2Vec2(0.5 * (cAx + cBx), 0.5 * (cAy + cBy));
                this.separations[0] = (cBx - cAx) * this.normal.x + (cBy - cAy) * this.normal.y;//b2Dot_v2_v2(b2Vec2.Subtract(cB, cA), this.normal);
            }
            break;

        case b2Manifold.e_faceA:
            {
                this.normal.x = xfA.q.c * manifold.localNormal.x - xfA.q.s * manifold.localNormal.y;//b2Mul_r_v2(xfA.q, manifold.localNormal);
                this.normal.y = xfA.q.s * manifold.localNormal.x + xfA.q.c * manifold.localNormal.y;
                var planePointx = (xfA.q.c * manifold.localPoint.x - xfA.q.s * manifold.localPoint.y) + xfA.p.x;//b2Mul_t_v2(xfA, manifold.localPoint);
                var planePointy = (xfA.q.s * manifold.localPoint.x + xfA.q.c * manifold.localPoint.y) + xfA.p.y;

                for (var i = 0; i < manifold.pointCount; ++i)
                {
                    var clipPointx = (xfB.q.c * manifold.points[i].localPoint.x - xfB.q.s * manifold.points[i].localPoint.y) + xfB.p.x;//b2Mul_t_v2(xfB, manifold.points[i].localPoint);
                    var clipPointy = (xfB.q.s * manifold.points[i].localPoint.x + xfB.q.c * manifold.points[i].localPoint.y) + xfB.p.y;
                    //var cA = b2Vec2.Add(clipPoint, b2Vec2.Multiply((radiusA - b2Dot_v2_v2(b2Vec2.Subtract(clipPoint, planePoint), this.normal)), this.normal));
                    var d = (clipPointx - planePointx) * this.normal.x + (clipPointy - planePointy) * this.normal.y;
                    var cAx = clipPointx + ((radiusA - d) * this.normal.x);
                    var cAy = clipPointy + ((radiusA - d) * this.normal.y);
                    //var cB = b2Vec2.Subtract(clipPoint, b2Vec2.Multiply(radiusB, this.normal));
                    var cBx = (clipPointx - (radiusB * this.normal.x));
                    var cBy = (clipPointy - (radiusB * this.normal.y));
                    //this.points[i] = b2Vec2.Multiply(0.5, b2Vec2.Add(cA, cB));
                    this.points[i] = new b2Vec2(0.5 * (cAx + cBx), 0.5 * (cAy + cBy));
                    //this.separations[i] = b2Dot_v2_v2(b2Vec2.Subtract(cB, cA), this.normal);
                    this.separations[i] = (cBx - cAx) * this.normal.x + (cBy - cAy) * this.normal.y;//b2Dot_v2_v2(b2Vec2.Subtract(cB, cA), this.normal);
                }
            }
            break;

        case b2Manifold.e_faceB:
            {
                this.normal.x = xfB.q.c * manifold.localNormal.x - xfB.q.s * manifold.localNormal.y;//b2Mul_r_v2(xfB.q, manifold.localNormal);
                this.normal.y = xfB.q.s * manifold.localNormal.x + xfB.q.c * manifold.localNormal.y;
                var planePointx = (xfB.q.c * manifold.localPoint.x - xfB.q.s * manifold.localPoint.y) + xfB.p.x;//b2Mul_t_v2(xfB, manifold.localPoint);
                var planePointy = (xfB.q.s * manifold.localPoint.x + xfB.q.c * manifold.localPoint.y) + xfB.p.y;

                for (var i = 0; i < manifold.pointCount; ++i)
                {
                    var clipPointx = (xfA.q.c * manifold.points[i].localPoint.x - xfA.q.s * manifold.points[i].localPoint.y) + xfA.p.x;//b2Mul_t_v2(xfA, manifold.points[i].localPoint);
                    var clipPointy = (xfA.q.s * manifold.points[i].localPoint.x + xfA.q.c * manifold.points[i].localPoint.y) + xfA.p.y;
                    //var cB = b2Vec2.Add(clipPoint, b2Vec2.Multiply((radiusB - b2Dot_v2_v2(b2Vec2.Subtract(clipPoint, planePoint), this.normal)), this.normal));
                    var d = (clipPointx - planePointx) * this.normal.x + (clipPointy - planePointy) * this.normal.y;
                    var cBx = clipPointx + ((radiusB - d) * this.normal.x);
                    var cBy = clipPointy + ((radiusB - d) * this.normal.y);
                    //var cA = b2Vec2.Subtract(clipPoint, b2Vec2.Multiply(radiusA, this.normal));
                    var cAx = (clipPointx - (radiusA * this.normal.x));
                    var cAy = (clipPointy - (radiusA * this.normal.y));
                    this.points[i] = new b2Vec2(0.5 * (cAx + cBx), 0.5 * (cAy + cBy));
                    this.separations[i] = (cAx - cBx) * this.normal.x + (cAy - cBy) * this.normal.y;//b2Dot_v2_v2(b2Vec2.Subtract(cA, cB), this.normal);
                }

                // Ensure normal points from A to B.
                this.normal.x = -this.normal.x;// = this.normal.Negate();
                this.normal.y = -this.normal.y;
            }
            break;
        }
    }
};

/// Compute the point states given two manifolds. The states pertain to the transition from manifold1
/// to manifold2. So state1 is either persist or remove while state2 is either add or persist.
function b2GetPointStates(state1, state2,
                      manifold1, manifold2)
{
    for (var i = 0; i < b2_maxManifoldPoints; ++i)
    {
        state1[i] = b2Manifold.b2_nullState;
        state2[i] = b2Manifold.b2_nullState;
    }

    // Detect persists and removes.
    for (var i = 0; i < manifold1.pointCount; ++i)
    {
        var id = manifold1.points[i].id;

        state1[i] = b2Manifold.b2_removeState;

        for (var j = 0; j < manifold2.pointCount; ++j)
        {
            if (manifold2.points[j].id.Get() == id.Get())
            {
                state1[i] = b2Manifold.b2_persistState;
                break;
            }
        }
    }

    // Detect persists and adds.
    for (var i = 0; i < manifold2.pointCount; ++i)
    {
        var id = manifold2.points[i].id;

        state2[i] = b2Manifold.b2_addState;

        for (var j = 0; j < manifold1.pointCount; ++j)
        {
            if (manifold1.points[j].id.Get() == id.Get())
            {
                state2[i] = b2Manifold.b2_persistState;
                break;
            }
        }
    }
}

/// Used for computing contact manifolds.
function b2ClipVertex()
{
    this.v = new b2Vec2();
    this.id = new b2ContactID();
};

/// Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
function b2RayCastInput()
{
    this.p1 = new b2Vec2(), this.p2 = new b2Vec2();
    this.maxFraction = 0;
};

/// Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and p2
/// come from b2RayCastInput.
function b2RayCastOutput()
{
    this.normal = new b2Vec2();
    this.fraction = 0;
};

/// An axis aligned bounding box.
function b2AABB()
{
    this.lowerBound = new b2Vec2(); ///< the lower vertex
    this.upperBound = new b2Vec2(); ///< the upper vertex
}

b2AABB.prototype =
{
    Assign: function(other)
    {
        this.lowerBound.x = other.lowerBound.x;
        this.lowerBound.y = other.lowerBound.y;//.Assign(other.lowerBound);
        this.upperBound.x = other.upperBound.x;//.Assign(other.upperBound);
        this.upperBound.y = other.upperBound.y;
    },

    Clone: function()
    {
        var clone = new b2AABB();
        clone.lowerBound.x = this.lowerBound.x; //.Assign(this.lowerBound);
        clone.lowerBound.y = this.lowerBound.y;
        clone.upperBound.x = this.upperBound.x;//.Assign(this.upperBound);
        clone.upperBound.y = this.upperBound.y;
        return clone;
    },

    /// Verify that the bounds are sorted.
    IsValid: function()
    {
        return (this.upperBound.x - this.lowerBound.x) >= 0.0 && (this.upperBound.y - this.lowerBound.y) >= 0.0 && this.lowerBound.IsValid() && this.upperBound.IsValid();
    },

    /// Get the center of the AABB.
    GetCenter: function()
    {
        return new b2Vec2(0.5 * (this.lowerBound.x + this.upperBound.x), 0.5 * (this.lowerBound.y + this.upperBound.y));
    },

    /// Get the extents of the AABB (half-widths).
    GetExtents: function()
    {
        return new b2Vec2(0.5 * (this.upperBound.x - this.lowerBound.x), 0.5 * (this.upperBound.y - this.lowerBound.y));
    },

    /// Get the perimeter length
    GetPerimeter: function()
    {
        return 2.0 * ((this.upperBound.x - this.lowerBound.x) + (this.upperBound.y - this.lowerBound.y));
    },

    /// Combine one or two AABBs into this one.
    Combine: function(aabb1, aabb2)
    {
        if (aabb2)
        {
            //this.lowerBound.Assign(b2Min_v2(aabb1.lowerBound, aabb2.lowerBound));
            this.lowerBound.x = b2Min(aabb1.lowerBound.x, aabb2.lowerBound.x);
            this.lowerBound.y = b2Min(aabb1.lowerBound.y, aabb2.lowerBound.y);
            //this.upperBound.Assign(b2Max_v2(aabb1.upperBound, aabb2.upperBound));
            this.upperBound.x = b2Max(aabb1.upperBound.x, aabb2.upperBound.x);
            this.upperBound.y = b2Max(aabb1.upperBound.y, aabb2.upperBound.y);
        }
        else
        {
            //this.lowerBound.Assign(b2Min_v2(this.lowerBound, aabb1.lowerBound));
            this.lowerBound.x = b2Min(this.lowerBound.x, aabb1.lowerBound.x);
            this.lowerBound.y = b2Min(this.lowerBound.y, aabb1.lowerBound.y);
            //this.upperBound.Assign(b2Max_v2(this.upperBound, aabb1.upperBound));
            this.upperBound.x = b2Max(this.upperBound.x, aabb1.upperBound.x);
            this.upperBound.y = b2Max(this.upperBound.y, aabb1.upperBound.y);
        }
    },

    /// Does this aabb contain the provided AABB.
    Contains: function(aabb)
    {
        return     this.lowerBound.x <= aabb.lowerBound.x
                && this.lowerBound.y <= aabb.lowerBound.y
                && aabb.upperBound.x <= this.upperBound.x
                && aabb.upperBound.y <= this.upperBound.y;
    },

    RayCast: function(output, input)
    {
        var tmin = -b2_maxFloat;
        var tmax = b2_maxFloat;

        var p = input.p1;
        var d = b2Vec2.Subtract(input.p2, input.p1);
        var absD = b2Abs_v2(d);

        var normal = new b2Vec2();

        for (var i = 0; i < 2; ++i)
        {
            if (absD.get_i(i) < b2_epsilon)
            {
                // Parallel.
                if (p.get_i(i) < this.lowerBound.get_i(i) || this.upperBound.get_i(i) < p.get_i(i))
                {
                    return false;
                }
            }
            else
            {
                var inv_d = 1.0 / d.get_i(i);
                var t1 = (this.lowerBound.get_i(i) - p.get_i(i)) * inv_d;
                var t2 = (this.upperBound.get_i(i) - p.get_i(i)) * inv_d;

                // Sign of the normal vector.
                var s = -1.0;

                if (t1 > t2)
                {
                    var temp = t2;
                    t2 = t1;
                    t1 = temp;
                    s = 1.0;
                }

                // Push the min up
                if (t1 > tmin)
                {
                    normal.x = normal.y = 0;
                    normal.set_i(i, s);
                    tmin = t1;
                }

                // Pull the max down
                tmax = b2Min(tmax, t2);

                if (tmin > tmax)
                {
                    return false;
                }
            }
        }

        // Does the ray start inside the box?
        // Does the ray intersect beyond the max fraction?
        if (tmin < 0.0 || input.maxFraction < tmin)
        {
            return false;
        }

        // Intersection.
        output.fraction = tmin;
        output.normal.x = normal.x;
        output.normal.y = normal.y;
        return true;
    }
};

/// Compute the collision manifold between two circles.
function b2CollideCircles(manifold,
                      circleA, xfA,
                      circleB, xfB)
{
    manifold.pointCount = 0;

    var pA = b2Mul_t_v2(xfA, circleA.m_p);
    var pB = b2Mul_t_v2(xfB, circleB.m_p);

    var dx = pB.x - pA.x;//b2Vec2.Subtract(pB, pA);
    var dy = pB.y - pA.y;
    var distSqr = dx * dx + dy * dy;//b2Dot_v2_v2(d, d);
    var rA = circleA.m_radius, rB = circleB.m_radius;
    var radius = rA + rB;
    if (distSqr > radius * radius)
    {
        return;
    }

    manifold.type = b2Manifold.e_circles;
    manifold.localPoint.x = circleA.m_p.x;
    manifold.localPoint.y = circleA.m_p.y;
    manifold.localNormal.x = manifold.localNormal.y = 0;
    manifold.pointCount = 1;

    manifold.points[0] = new b2ManifoldPoint();
    manifold.points[0].localPoint.x = circleB.m_p.x;
    manifold.points[0].localPoint.y = circleB.m_p.y;
    manifold.points[0].id.Reset();
}

/// Compute the collision manifold between a polygon and a circle.
function b2CollidePolygonAndCircle(manifold,
                               polygonA, xfA,
                               circleB, xfB)
{
    manifold.pointCount = 0;

    // Compute circle position in the frame of the polygon.
    var c = b2Mul_t_v2(xfB, circleB.m_p);
    var cLocal = b2MulT_t_v2(xfA, c);

    // Find the min separating edge.
    var normalIndex = 0;
    var separation = -b2_maxFloat;
    var radius = polygonA.m_radius + circleB.m_radius;
    var vertexCount = polygonA.m_count;
    var vertices = polygonA.m_vertices;
    var normals = polygonA.m_normals;

    for (var i = 0; i < vertexCount; ++i)
    {
        var s = normals[i].x * (cLocal.x - vertices[i].x) + normals[i].y * (cLocal.y - vertices[i].y);//b2Dot_v2_v2(normals[i], b2Vec2.Subtract(cLocal, vertices[i]));

        if (s > radius)
        {
            // Early out.
            return;
        }

        if (s > separation)
        {
            separation = s;
            normalIndex = i;
        }
    }

    // Vertices that subtend the incident face.
    var vertIndex1 = normalIndex;
    var vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
    var v1 = vertices[vertIndex1];
    var v2 = vertices[vertIndex2];

    // If the center is inside the polygon ...
    if (separation < b2_epsilon)
    {
        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_faceA;
        manifold.localNormal.x = normals[normalIndex].x;//.Assign(normals[normalIndex]);
        manifold.localNormal.y = normals[normalIndex].y;
        manifold.localPoint.x = 0.5 * (v1.x + v2.x);//.Assign(b2Vec2.Multiply(0.5, b2Vec2.Add(v1, v2)));
        manifold.localPoint.y = 0.5 * (v1.y + v2.y);
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        manifold.points[0].id.Reset();
        return;
    }

    // Compute barycentric coordinates
    var u1 = (cLocal.x - v1.x) * (v2.x - v1.x) + (cLocal.y - v1.y) * (v2.y - v1.y);//b2Dot_v2_v2(b2Vec2.Subtract(cLocal, v1), b2Vec2.Subtract(v2, v1));
    var u2 = (cLocal.x - v2.x) * (v1.x - v2.x) + (cLocal.y - v2.y) * (v1.y - v2.y);//b2Dot_v2_v2(b2Vec2.Subtract(cLocal, v2), b2Vec2.Subtract(v1, v2));
    if (u1 <= 0.0)
    {
        if (b2DistanceSquared(cLocal, v1) > radius * radius)
        {
            return;
        }

        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_faceA;
        manifold.localNormal.x = cLocal.x - v1.x;//.Assign(b2Vec2.Subtract(cLocal, v1));
        manifold.localNormal.y = cLocal.y - v1.y;
        manifold.localNormal.Normalize();
        manifold.localPoint.x = v1.x;
        manifold.localPoint.y = v1.y;
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        manifold.points[0].id.Reset();
    }
    else if (u2 <= 0.0)
    {
        if (b2DistanceSquared(cLocal, v2) > radius * radius)
        {
            return;
        }

        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_faceA;
        manifold.localNormal.x = cLocal.x - v2.x;//.Assign(b2Vec2.Subtract(cLocal, v2));
        manifold.localNormal.y = cLocal.y - v2.y;
        manifold.localNormal.Normalize();
        manifold.localPoint.x = v2.x;
        manifold.localPoint.y = v2.y;
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        manifold.points[0].id.Reset();
    }
    else
    {
        var faceCenterx = 0.5 * (v1.x + v2.x);//b2Vec2.Multiply(0.5, b2Vec2.Add(v1, v2));
        var faceCentery = 0.5 * (v1.y + v2.y);
        var separation = (cLocal.x - faceCenterx) * normals[vertIndex1].x + (cLocal.y - faceCentery) * normals[vertIndex1].y;//b2Dot_v2_v2(b2Vec2.Subtract(cLocal, faceCenter), normals[vertIndex1]);
        if (separation > radius)
        {
            return;
        }

        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_faceA;
        manifold.localNormal.x = normals[vertIndex1].x;
        manifold.localNormal.y = normals[vertIndex1].y;
        manifold.localPoint.x = faceCenterx;
        manifold.localPoint.y = faceCentery;
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        manifold.points[0].id.Reset();
    }
}

// Find the max separation between poly1 and poly2 using edge normals from poly1.
function b2FindMaxSeparation(edgeIndex,
                                 poly1, xf1,
                                 poly2, xf2)
{
    var count1 = poly1.m_count;
    var count2 = poly2.m_count;
    var n1s = poly1.m_normals;
    var v1s = poly1.m_vertices;
    var v2s = poly2.m_vertices;
    var xf = b2MulT_t_t(xf2, xf1);

    var bestIndex = 0;
    var maxSeparation = -b2_maxFloat;
    for (var i = 0; i < count1; ++i)
    {
        // Get poly1 normal in frame2.
        var nx = xf.q.c * n1s[i].x - xf.q.s * n1s[i].y;//b2Mul_r_v2(xf.q, n1s[i]);
        var ny = xf.q.s * n1s[i].x + xf.q.c * n1s[i].y;
        var v1x = (xf.q.c * v1s[i].x - xf.q.s * v1s[i].y) + xf.p.x;//b2Mul_t_v2(xf, v1s[i]);
        var v1y = (xf.q.s * v1s[i].x + xf.q.c * v1s[i].y) + xf.p.y;

        // Find deepest point for normal i.
        var si = b2_maxFloat;
        for (var j = 0; j < count2; ++j)
        {
            var sij = nx * (v2s[j].x - v1x) + ny * (v2s[j].y - v1y);//b2Dot_v2_v2(n, b2Vec2.Subtract(v2s[j], v1));
            if (sij < si)
            {
                si = sij;
            }
        }

        if (si > maxSeparation)
        {
            maxSeparation = si;
            bestIndex = i;
        }
    }

    edgeIndex[0] = bestIndex;
    return maxSeparation;
}

function b2FindIncidentEdge(c,
                             poly1, xf1, edge1,
                             poly2, xf2)
{
    var normals1 = poly1.m_normals;

    var count2 = poly2.m_count;
    var vertices2 = poly2.m_vertices;
    var normals2 = poly2.m_normals;


    b2Assert(0 <= edge1 && edge1 < poly1.m_count);


    // Get the normal of the reference edge in poly2's frame.
    //var normal1 = b2MulT_r_v2(xf2.q, b2Mul_r_v2(xf1.q, normals1[edge1]));
    var t1x = xf1.q.c * normals1[edge1].x - xf1.q.s * normals1[edge1].y;
    var t1y = xf1.q.s * normals1[edge1].x + xf1.q.c * normals1[edge1].y;
    var normal1x = xf2.q.c * t1x + xf2.q.s * t1y;
    var normal1y = -xf2.q.s * t1x + xf2.q.c * t1y;

    // Find the incident edge on poly2.
    var index = 0;
    var minDot = b2_maxFloat;
    for (var i = 0; i < count2; ++i)
    {
        var dot = normal1x * normals2[i].x + normal1y * normals2[i].y;//b2Dot_v2_v2(normal1, normals2[i]);
        if (dot < minDot)
        {
            minDot = dot;
            index = i;
        }
    }

    // Build the clip vertices for the incident edge.
    var i1 = index;
    var i2 = i1 + 1 < count2 ? i1 + 1 : 0;

    c[0].v.x = (xf2.q.c * vertices2[i1].x - xf2.q.s * vertices2[i1].y) + xf2.p.x;//.Assign(b2Mul_t_v2(xf2, vertices2[i1]));
    c[0].v.y = (xf2.q.s * vertices2[i1].x + xf2.q.c * vertices2[i1].y) + xf2.p.y;
    c[0].id.indexA = edge1;
    c[0].id.indexB = i1;
    c[0].id.typeA = b2ContactID.e_face;
    c[0].id.typeB = b2ContactID.e_vertex;

    c[1].v.x = (xf2.q.c * vertices2[i2].x - xf2.q.s * vertices2[i2].y) + xf2.p.x;//.Assign(b2Mul_t_v2(xf2, vertices2[i2]));
    c[1].v.y = (xf2.q.s * vertices2[i2].x + xf2.q.c * vertices2[i2].y) + xf2.p.y;
    c[1].id.indexA = edge1;
    c[1].id.indexB = i2;
    c[1].id.typeA = b2ContactID.e_face;
    c[1].id.typeB = b2ContactID.e_vertex;
}

/// Compute the collision manifold between two polygons.
function b2CollidePolygons(manifold,
                       polyA, xfA,
                       polyB, xfB)
{
    manifold.pointCount = 0;
    var totalRadius = polyA.m_radius + polyB.m_radius;

    var edgeA = [0];
    var separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
    if (separationA > totalRadius)
        return;

    var edgeB = [0];
    var separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
    if (separationB > totalRadius)
        return;

    var poly1;  // reference polygon
    var poly2;  // incident polygon
    var xf1, xf2;
    var edge1 = 0;                  // reference edge
    var flip = 0;
    var k_tol = 0.1 * b2_linearSlop;

    if (separationB > separationA + k_tol)
    {
        poly1 = polyB;
        poly2 = polyA;
        xf1 = xfB;
        xf2 = xfA;
        edge1 = edgeB[0];
        manifold.type = b2Manifold.e_faceB;
        flip = 1;
    }
    else
    {
        poly1 = polyA;
        poly2 = polyB;
        xf1 = xfA;
        xf2 = xfB;
        edge1 = edgeA[0];
        manifold.type = b2Manifold.e_faceA;
        flip = 0;
    }

    b2FindIncidentEdge(b2CollidePolygons._local_incidentEdges, poly1, xf1, edge1, poly2, xf2);

    var count1 = poly1.m_count;
    var vertices1 = poly1.m_vertices;

    var iv1 = edge1;
    var iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;

    var v11 = vertices1[iv1];
    var v12 = vertices1[iv2];

    b2CollidePolygons._localTangent.x = v12.x - v11.x;
    b2CollidePolygons._localTangent.y = v12.y - v11.y;
    b2CollidePolygons._localTangent.Normalize();

    var localNormalx = 1.0 * b2CollidePolygons._localTangent.y;//b2Cross_v2_f(b2CollidePolygons._localTangent, 1.0);
    var localNormaly = -1.0 * b2CollidePolygons._localTangent.x;
    var planePointx = 0.5 * (v11.x + v12.x);//b2Vec2.Multiply(0.5, b2Vec2.Add(v11, v12));
    var planePointy = 0.5 * (v11.y + v12.y);

    var tangentx = xf1.q.c * b2CollidePolygons._localTangent.x - xf1.q.s * b2CollidePolygons._localTangent.y;//b2Mul_r_v2(xf1.q, b2CollidePolygons._localTangent);
    var tangenty = xf1.q.s * b2CollidePolygons._localTangent.x + xf1.q.c * b2CollidePolygons._localTangent.y;
    var normalx = 1.0 * tangenty;//b2Cross_v2_f(tangent, 1.0);
    var normaly = -1.0 * tangentx;

    v11 = b2Mul_t_v2(xf1, v11);
    v12 = b2Mul_t_v2(xf1, v12);

    // Face offset.
    var frontOffset = normalx * v11.x + normaly * v11.y;//b2Dot_v2_v2(normal, v11);

    // Side offsets, extended by polytope skin thickness.
    var sideOffset1 = /*-b2Dot_v2_v2(tangent, v11)*/-(tangentx * v11.x + tangenty * v11.y) + totalRadius;
    var sideOffset2 = /*b2Dot_v2_v2(tangent, v12)*/(tangentx * v12.x + tangenty * v12.y) + totalRadius;

    // Clip incident edge against extruded edge1 side edges.
    var clipPoints1 = new Array(2);
    var clipPoints2 = new Array(2);
    var np;

    // Clip to box side 1
    np = b2ClipSegmentToLine(clipPoints1, b2CollidePolygons._local_incidentEdges, -tangentx, -tangenty, sideOffset1, iv1);

    if (np < 2)
        return;

    // Clip to negative box side 1
    np = b2ClipSegmentToLine(clipPoints2, clipPoints1, tangentx, tangenty, sideOffset2, iv2);

    if (np < 2)
    {
        return;
    }

    // Now clipPoints2 contains the clipped points.
    manifold.localNormal.x = localNormalx;//.Assign(localNormal);
    manifold.localNormal.y = localNormaly;
    manifold.localPoint.x = planePointx;//.Assign(planePoint);
    manifold.localPoint.y = planePointy;

    var pointCount = 0;
    for (var i = 0; i < b2_maxManifoldPoints; ++i)
    {
        var separation = /*b2Dot_v2_v2(normal, clipPoints2[i].v)*/(normalx * clipPoints2[i].v.x + normaly * clipPoints2[i].v.y) - frontOffset;

        if (separation <= totalRadius)
        {
            var cp = manifold.points[pointCount] = new b2ManifoldPoint();
            cp.localPoint.Assign(b2MulT_t_v2(xf2, clipPoints2[i].v));
            cp.id.Assign(clipPoints2[i].id);
            if (flip)
            {
                // Swap features
                var cf = new b2ContactID();
                cf.Assign(cp.id);
                cp.id.indexA = cf.indexB;
                cp.id.indexB = cf.indexA;
                cp.id.typeA = cf.typeB;
                cp.id.typeB = cf.typeA;
            }
            ++pointCount;
        }
    }

    manifold.pointCount = pointCount;
}

b2CollidePolygons._localTangent = new b2Vec2();

b2CollidePolygons._local_incidentEdges = [new b2ClipVertex(), new b2ClipVertex()];

/// Compute the collision manifold between an edge and a circle.
function b2CollideEdgeAndCircle(manifold,
                               edgeA, xfA,
                               circleB, xfB)
{
    manifold.pointCount = 0;

    // Compute circle in frame of edge
    var Q = b2MulT_t_v2(xfA, b2Mul_t_v2(xfB, circleB.m_p));

    var A = edgeA.m_vertex1, B = edgeA.m_vertex2;
    var ex = B.x - A.x;//b2Vec2.Subtract(B, A);
    var ey = B.y - A.y;

    // Barycentric coordinates
    var u = ex * (B.x - Q.x) + ey * (B.y - Q.y);//b2Dot_v2_v2(e, b2Vec2.Subtract(B, Q));
    var v = ex * (Q.x - A.x) + ey * (Q.y - A.y);//b2Dot_v2_v2(e, b2Vec2.Subtract(Q, A));

    var radius = edgeA.m_radius + circleB.m_radius;

    var cf = new b2ContactID();
    cf.indexB = 0;
    cf.typeB = b2ContactID.e_vertex;

    // Region A
    if (v <= 0.0)
    {
        var P = A;
        var dx = Q.x - P.x;//b2Vec2.Subtract(Q, P);
        var dy = Q.y - P.y;
        var dd = dx * dx + dy * dy;//b2Dot_v2_v2(d, d);
        if (dd > radius * radius)
        {
            return;
        }

        // Is there an edge connected to A?
        if (edgeA.m_hasVertex0)
        {
            var A1 = edgeA.m_vertex0;
            var B1 = A;
            var e1x = B1.x - A1.x;//b2Vec2.Subtract(B1, A1);
            var e1y = B1.y - A1.y;
            var u1 = e1x * (B1.x - Q.x) + e1y * (B1.y - Q.y);//b2Dot_v2_v2(e1, b2Vec2.Subtract(B1, Q));

            // Is the circle in Region AB of the previous edge?
            if (u1 > 0.0)
            {
                return;
            }
        }

        cf.indexA = 0;
        cf.typeA = b2ContactID.e_vertex;
        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_circles;
        manifold.localNormal.x = manifold.localNormal.y = 0;
        manifold.localPoint.x = P.x;
        manifold.localPoint.y = P.y;
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].id.Assign(cf);
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        return;
    }

    // Region B
    if (u <= 0.0)
    {
        var P = B;
        var dx = Q.x - P.x;//b2Vec2.Subtract(Q, P);
        var dy = Q.y - P.y;
        var dd = dx * dx + dy * dy;//b2Dot_v2_v2(d, d);
        if (dd > radius * radius)
        {
            return;
        }

        // Is there an edge connected to B?
        if (edgeA.m_hasVertex3)
        {
            var B2 = edgeA.m_vertex3;
            var A2 = B;
            var e2x = B2.x - A2.x;//b2Vec2.Subtract(B2, A2);
            var e2y = B2.y - A2.y;
            var v2 = e2x * (Q.x - A2.x) + e2y * (Q.y - A2.y);//b2Dot_v2_v2(e2, b2Vec2.Subtract(Q, A2));

            // Is the circle in Region AB of the next edge?
            if (v2 > 0.0)
            {
                return;
            }
        }

        cf.indexA = 1;
        cf.typeA = b2ContactID.e_vertex;
        manifold.pointCount = 1;
        manifold.type = b2Manifold.e_circles;
        manifold.localNormal.x = manifold.localNormal.y = 0;
        manifold.localPoint.x = P.x;
        manifold.localPoint.y = P.y;
        manifold.points[0] = new b2ManifoldPoint();
        manifold.points[0].id.Assign(cf);
        manifold.points[0].localPoint.x = circleB.m_p.x;
        manifold.points[0].localPoint.y = circleB.m_p.y;
        return;
    }

    // Region AB
    var den = ex * ex + ey * ey;//b2Dot_v2_v2(e, e);

    b2Assert(den > 0.0);

    var Px = (1.0 / den) * ((u * A.x) + (v * B.x));
    var Py = (1.0 / den) * ((u * A.y) + (v * B.y));//b2Vec2.Multiply((1.0 / den), b2Vec2.Add(b2Vec2.Multiply(u, A), b2Vec2.Multiply(v, B)));
    var dx = Q.x - Px;//b2Vec2.Subtract(Q, P);
    var dy = Q.y - Py;
    var dd = dx * dx + dy * dy;//b2Dot_v2_v2(d, d);
    if (dd > radius * radius)
    {
        return;
    }

    var nx = -ey;//new b2Vec2(-ey, ex);
    var ny = ex;
    if (nx * (Q.x - A.x) + ny * (Q.y - A.y) < 0.0)//b2Dot_v2_v2(n, b2Vec2.Subtract(Q, A)) < 0.0)
    {
        nx = -nx;//.Set(-n.x, -n.y);
        ny = -ny;
    }
    //n.Normalize();

    cf.indexA = 0;
    cf.typeA = b2ContactID.e_face;
    manifold.pointCount = 1;
    manifold.type = b2Manifold.e_faceA;
    manifold.localNormal.x = nx;
    manifold.localNormal.y = ny;
    manifold.localNormal.Normalize();
    manifold.localPoint.x = A.x;
    manifold.localPoint.y = A.y;
    manifold.points[0] = new b2ManifoldPoint();
    manifold.points[0].id.Assign(cf);
    manifold.points[0].localPoint.x = circleB.m_p.x;
    manifold.points[0].localPoint.y = circleB.m_p.y;
}

// This structure is used to keep track of the best separating axis.
function b2EPAxis()
{
    this.type = 0;
    this.index = 0;
    this.separation = 0;
}

b2EPAxis.e_unknown = 0;
b2EPAxis.e_edgeA = 1;
b2EPAxis.e_edgeB = 2;


// This holds polygon B expressed in frame A.
function b2TempPolygon()
{
    this.vertices = new Array(b2_maxPolygonVertices);
    this.normals = new Array(b2_maxPolygonVertices);
    this.count = 0;
};

// Reference face used for clipping
function b2ReferenceFace()
{
    this.i1 = 0, this.i2 = 0;

    this.v1 = new b2Vec2(), this.v2 = new b2Vec2();

    this.normal = new b2Vec2();

    this.sideNormal1 = new b2Vec2();
    this.sideOffset1 = 0;

    this.sideNormal2 = new b2Vec2();
    this.sideOffset2 = 0;
};

// This class collides and edge and a polygon, taking into account edge adjacency.
function b2EPCollider()
{
    this.m_polygonB = new b2TempPolygon();

    this.m_xf = new b2Transform();
    this.m_centroidB = new b2Vec2();
    this.m_v0 = new b2Vec2(), this.m_v1 = new b2Vec2(), this.m_v2 = new b2Vec2(), this.m_v3 = new b2Vec2();
    this.m_normal0 = new b2Vec2(), this.m_normal1 = new b2Vec2(), this.m_normal2 = new b2Vec2();
    this.m_normal = new b2Vec2();
    this.m_type1 = 0, this.m_type2 = 0;
    this.m_lowerLimit = new b2Vec2(), this.m_upperLimit = new b2Vec2();
    this.m_radius = 0;
    this.m_front = false;
}

b2EPCollider._temp_edge = new b2Vec2();
b2EPCollider._temp_edge0 = new b2Vec2();
b2EPCollider._temp_edge2 = new b2Vec2();

b2EPCollider.prototype =
{
    // Algorithm:
    // 1. Classify v1 and v2
    // 2. Classify polygon centroid as front or back
    // 3. Flip normal if necessary
    // 4. Initialize normal range to [-pi, pi] about face normal
    // 5. Adjust normal range according to adjacent edges
    // 6. Visit each separating axes, only accept axes within the range
    // 7. Return if _any_ axis indicates separation
    // 8. Clip
    Collide: function(manifold, edgeA, xfA,
                 polygonB, xfB)
    {
        this.m_xf.Assign(b2MulT_t_t(xfA, xfB));

        //this.m_centroidB.Assign(b2Mul_t_v2(this.m_xf, polygonB.m_centroid));
        this.m_centroidB.x = (this.m_xf.q.c * polygonB.m_centroid.x - this.m_xf.q.s * polygonB.m_centroid.y) + this.m_xf.p.x;
        this.m_centroidB.y = (this.m_xf.q.s * polygonB.m_centroid.x + this.m_xf.q.c * polygonB.m_centroid.y) + this.m_xf.p.y;

        this.m_v0.x = edgeA.m_vertex0.x;
        this.m_v0.y = edgeA.m_vertex0.y;
        this.m_v1.x = edgeA.m_vertex1.x;
        this.m_v1.y = edgeA.m_vertex1.y;
        this.m_v2.x = edgeA.m_vertex2.x;
        this.m_v2.y = edgeA.m_vertex2.y;
        this.m_v3.x = edgeA.m_vertex3.x;
        this.m_v3.y = edgeA.m_vertex3.y;

        var hasVertex0 = edgeA.m_hasVertex0;
        var hasVertex3 = edgeA.m_hasVertex3;

        b2EPCollider._temp_edge.x = this.m_v2.x - this.m_v1.x;// = b2Vec2.Subtract(this.m_v2, this.m_v1);
        b2EPCollider._temp_edge.y = this.m_v2.y - this.m_v1.y;
        b2EPCollider._temp_edge.Normalize();
        this.m_normal1.x = b2EPCollider._temp_edge.y;
        this.m_normal1.y = -b2EPCollider._temp_edge.x;
        //var offset1 = b2Dot_v2_v2(this.m_normal1, b2Vec2.Subtract(this.m_centroidB, this.m_v1));
        var offset1 = this.m_normal1.x * (this.m_centroidB.x - this.m_v1.x) + this.m_normal1.y * (this.m_centroidB.y - this.m_v1.y);
        var offset0 = 0.0, offset2 = 0.0;
        var convex1 = false, convex2 = false;

        // Is there a preceding edge?
        if (hasVertex0)
        {
            b2EPCollider._temp_edge0.x = this.m_v1.x - this.m_v0.x;
            b2EPCollider._temp_edge0.y = this.m_v1.y - this.m_v0.y;
            b2EPCollider._temp_edge0.Normalize();
            this.m_normal0.x = b2EPCollider._temp_edge0.y;
            this.m_normal0.y = -b2EPCollider._temp_edge0.x;
            //convex1 = b2Cross_v2_v2(b2EPCollider._temp_edge0, b2EPCollider._temp_edge) >= 0.0;
            convex1 = (b2EPCollider._temp_edge0.x * b2EPCollider._temp_edge.y - b2EPCollider._temp_edge0.y * b2EPCollider._temp_edge.x) >= 0;
            //offset0 = b2Dot_v2_v2(this.m_normal0, b2Vec2.Subtract(this.m_centroidB, this.m_v0));
            offset0 = this.m_normal0.x * (this.m_centroidB.x - this.m_v0.x) + this.m_normal0.y * (this.m_centroidB.y - this.m_v0.y);
        }

        // Is there a following edge?
        if (hasVertex3)
        {
            b2EPCollider._temp_edge2.x = this.m_v3.x - this.m_v2.x;
            b2EPCollider._temp_edge2.y = this.m_v3.y - this.m_v2.y;
            b2EPCollider._temp_edge2.Normalize();
            this.m_normal2.x = b2EPCollider._temp_edge2.y;
            this.m_normal2.y = -b2EPCollider._temp_edge2.x;
            //convex2 = b2Cross_v2_v2(b2EPCollider._temp_edge, b2EPCollider._temp_edge2) > 0.0;
            convex2 = (b2EPCollider._temp_edge.x * b2EPCollider._temp_edge2.y - b2EPCollider._temp_edge.y * b2EPCollider._temp_edge2.x) > 0.0;
            //offset2 = b2Dot_v2_v2(this.m_normal2, b2Vec2.Subtract(this.m_centroidB, this.m_v2));
            offset2 = this.m_normal2.x * (this.m_centroidB.x - this.m_v2.x) + this.m_normal2.y * (this.m_centroidB.y - this.m_v2.y);
        }

        // Determine front or back collision. Determine collision normal limits.
        if (hasVertex0 && hasVertex3)
        {
            if (convex1 && convex2)
            {
                this.m_front = offset0 >= 0.0 || offset1 >= 0.0 || offset2 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal0.x;
                    this.m_lowerLimit.y = this.m_normal0.y;
                    this.m_upperLimit.x = this.m_normal2.x;
                    this.m_upperLimit.y = this.m_normal2.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal1.x;
                    this.m_lowerLimit.y = -this.m_normal1.y;
                    this.m_upperLimit.x = -this.m_normal1.x;
                    this.m_upperLimit.y = -this.m_normal1.y;
                }
            }
            else if (convex1)
            {
                this.m_front = offset0 >= 0.0 || (offset1 >= 0.0 && offset2 >= 0.0);
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal0.x;
                    this.m_lowerLimit.y = this.m_normal0.y;
                    this.m_upperLimit.x = this.m_normal1.x;
                    this.m_upperLimit.y = this.m_normal1.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal2.x;
                    this.m_lowerLimit.y = -this.m_normal2.y;
                    this.m_upperLimit.x = -this.m_normal1.x;
                    this.m_upperLimit.y = -this.m_normal1.y;
                }
            }
            else if (convex2)
            {
                this.m_front = offset2 >= 0.0 || (offset0 >= 0.0 && offset1 >= 0.0);
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal1.x;
                    this.m_lowerLimit.y = this.m_normal1.y;
                    this.m_upperLimit.x = this.m_normal2.x;
                    this.m_upperLimit.y = this.m_normal2.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal1.x;
                    this.m_lowerLimit.y = -this.m_normal1.y;
                    this.m_upperLimit.x = -this.m_normal0.x;
                    this.m_upperLimit.y = -this.m_normal0.y;
                }
            }
            else
            {
                this.m_front = offset0 >= 0.0 && offset1 >= 0.0 && offset2 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal1.x;
                    this.m_lowerLimit.y = this.m_normal1.y;
                    this.m_upperLimit.x = this.m_normal1.x;
                    this.m_upperLimit.y = this.m_normal1.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal2.x;
                    this.m_lowerLimit.y = -this.m_normal2.y;
                    this.m_upperLimit.x = -this.m_normal0.x;
                    this.m_upperLimit.y = -this.m_normal0.y;
                }
            }
        }
        else if (hasVertex0)
        {
            if (convex1)
            {
                this.m_front = offset0 >= 0.0 || offset1 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal0.x;
                    this.m_lowerLimit.y = this.m_normal0.y;
                    this.m_upperLimit.x = -this.m_normal1.x;
                    this.m_upperLimit.y = -this.m_normal1.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal1.x;
                    this.m_lowerLimit.y = this.m_normal1.y;
                    this.m_upperLimit.x = -this.m_normal1.x;
                    this.m_upperLimit.y = -this.m_normal1.y;
                }
            }
            else
            {
                this.m_front = offset0 >= 0.0 && offset1 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal1.x;
                    this.m_lowerLimit.y = this.m_normal1.y;
                    this.m_upperLimit.x = -this.m_normal1.x;
                    this.m_upperLimit.y = -this.m_normal1.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = this.m_normal1.x;
                    this.m_lowerLimit.y = this.m_normal1.y;
                    this.m_upperLimit.x = -this.m_normal0.x;
                    this.m_upperLimit.y = -this.m_normal0.y;
                }
            }
        }
        else if (hasVertex3)
        {
            if (convex2)
            {
                this.m_front = offset1 >= 0.0 || offset2 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal1.x;
                    this.m_lowerLimit.y = -this.m_normal1.y;
                    this.m_upperLimit.x = this.m_normal2.x;
                    this.m_upperLimit.y = this.m_normal2.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal1.x;
                    this.m_lowerLimit.y = -this.m_normal1.y;
                    this.m_upperLimit.x = this.m_normal1.x;
                    this.m_upperLimit.y = this.m_normal1.y;
                }
            }
            else
            {
                this.m_front = offset1 >= 0.0 && offset2 >= 0.0;
                if (this.m_front)
                {
                    this.m_normal.x = this.m_normal1.x;
                    this.m_normal.y = this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal1.x;
                    this.m_lowerLimit.y = -this.m_normal1.y;
                    this.m_upperLimit.x = this.m_normal1.x;
                    this.m_upperLimit.y = this.m_normal1.y;
                }
                else
                {
                    this.m_normal.x = -this.m_normal1.x;
                    this.m_normal.y = -this.m_normal1.y;
                    this.m_lowerLimit.x = -this.m_normal2.x;
                    this.m_lowerLimit.y = -this.m_normal2.y;
                    this.m_upperLimit.x = this.m_normal1.x;
                    this.m_upperLimit.y = this.m_normal1.y;
                }
            }
        }
        else
        {
            this.m_front = offset1 >= 0.0;
            if (this.m_front)
            {
                this.m_normal.x = this.m_normal1.x;
                this.m_normal.y = this.m_normal1.y;
                this.m_lowerLimit.x = -this.m_normal1.x;
                this.m_lowerLimit.y = -this.m_normal1.y;
                this.m_upperLimit.x = -this.m_normal1.x;
                this.m_upperLimit.y = -this.m_normal1.y;
            }
            else
            {
                this.m_normal.x = -this.m_normal1.x;
                this.m_normal.y = -this.m_normal1.y;
                this.m_lowerLimit.x = this.m_normal1.x;
                this.m_lowerLimit.y = this.m_normal1.y;
                this.m_upperLimit.x = this.m_normal1.x;
                this.m_upperLimit.y = this.m_normal1.y;
            }
        }

        // Get polygonB in frameA
        this.m_polygonB.count = polygonB.m_count;
        for (var i = 0; i < polygonB.m_count; ++i)
        {
            this.m_polygonB.vertices[i] = b2Mul_t_v2(this.m_xf, polygonB.m_vertices[i]);
            this.m_polygonB.normals[i] = b2Mul_r_v2(this.m_xf.q, polygonB.m_normals[i]);
        }

        this.m_radius = 2.0 * b2_polygonRadius;

        manifold.pointCount = 0;

        var edgeAxis = this.ComputeEdgeSeparation();

        // If no valid normal can be found than this edge should not collide.
        if (edgeAxis.type == b2EPAxis.e_unknown)
        {
            return;
        }

        if (edgeAxis.separation > this.m_radius)
        {
            return;
        }

        var polygonAxis = this.ComputePolygonSeparation();
        if (polygonAxis.type != b2EPAxis.e_unknown && polygonAxis.separation > this.m_radius)
        {
            return;
        }

        // Use hysteresis for jitter reduction.
        var k_relativeTol = 0.98;
        var k_absoluteTol = 0.001;

        var primaryAxis = new b2EPAxis();
        if (polygonAxis.type == b2EPAxis.e_unknown)
        {
            primaryAxis = edgeAxis;
        }
        else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol)
        {
            primaryAxis = polygonAxis;
        }
        else
        {
            primaryAxis = edgeAxis;
        }

        var ie = new Array(2);
        var rf = new b2ReferenceFace();
        if (primaryAxis.type == b2EPAxis.e_edgeA)
        {
            manifold.type = b2Manifold.e_faceA;

            // Search for the polygon normal that is most anti-parallel to the edge normal.
            var bestIndex = 0;
            var bestValue = this.m_normal.x * this.m_polygonB.normals[0].x + this.m_normal.y * this.m_polygonB.normals[0].y;//b2Dot_v2_v2(this.m_normal, this.m_polygonB.normals[0]);
            for (var i = 1; i < this.m_polygonB.count; ++i)
            {
                var value = this.m_normal.x * this.m_polygonB.normals[i].x + this.m_normal.y * this.m_polygonB.normals[i].y;//b2Dot_v2_v2(this.m_normal, this.m_polygonB.normals[i]);
                if (value < bestValue)
                {
                    bestValue = value;
                    bestIndex = i;
                }
            }

            var i1 = bestIndex;
            var i2 = i1 + 1 < this.m_polygonB.count ? i1 + 1 : 0;

            ie[0] = new b2ClipVertex();
            ie[0].v.x = this.m_polygonB.vertices[i1].x;
            ie[0].v.y = this.m_polygonB.vertices[i1].y;
            ie[0].id.indexA = 0;
            ie[0].id.indexB = i1;
            ie[0].id.typeA = b2ContactID.e_face;
            ie[0].id.typeB = b2ContactID.e_vertex;

            ie[1] = new b2ClipVertex();
            ie[1].v.x = this.m_polygonB.vertices[i2].x;
            ie[1].v.y = this.m_polygonB.vertices[i2].y;
            ie[1].id.indexA = 0;
            ie[1].id.indexB = i2;
            ie[1].id.typeA = b2ContactID.e_face;
            ie[1].id.typeB = b2ContactID.e_vertex;

            if (this.m_front)
            {
                rf.i1 = 0;
                rf.i2 = 1;
                rf.v1.x = this.m_v1.x;
                rf.v1.y = this.m_v1.y;
                rf.v2.x = this.m_v2.x;
                rf.v2.y = this.m_v2.y;
                rf.normal.x = this.m_normal1.x;
                rf.normal.y = this.m_normal1.y;
            }
            else
            {
                rf.i1 = 1;
                rf.i2 = 0;
                rf.v1.x = this.m_v2.x;
                rf.v1.y = this.m_v2.y;
                rf.v2.x = this.m_v1.x;
                rf.v2.y = this.m_v1.y;
                rf.normal.x = -this.m_normal1.x;
                rf.normal.y = -this.m_normal1.y;
            }
        }
        else
        {
            manifold.type = b2Manifold.e_faceB;

            ie[0] = new b2ClipVertex();
            ie[0].v = this.m_v1;
            ie[0].id.indexA = 0;
            ie[0].id.indexB = primaryAxis.index;
            ie[0].id.typeA = b2ContactID.e_vertex;
            ie[0].id.typeB = b2ContactID.e_face;

            ie[1] = new b2ClipVertex();
            ie[1].v = this.m_v2;
            ie[1].id.indexA = 0;
            ie[1].id.indexB = primaryAxis.index;
            ie[1].id.typeA = b2ContactID.e_vertex;
            ie[1].id.typeB = b2ContactID.e_face;

            rf.i1 = primaryAxis.index;
            rf.i2 = rf.i1 + 1 < this.m_polygonB.count ? rf.i1 + 1 : 0;
            rf.v1.x = this.m_polygonB.vertices[rf.i1].x;
            rf.v1.y = this.m_polygonB.vertices[rf.i1].y;
            rf.v2.x = this.m_polygonB.vertices[rf.i2].x;
            rf.v2.y = this.m_polygonB.vertices[rf.i2].y;
            rf.normal.x = this.m_polygonB.normals[rf.i1].x;
            rf.normal.y = this.m_polygonB.normals[rf.i1].y;
        }

        rf.sideNormal1.x = rf.normal.y;
        rf.sideNormal1.y = -rf.normal.x;
        rf.sideNormal2.x = -rf.sideNormal1.x;
        rf.sideNormal2.y = -rf.sideNormal1.y;
        rf.sideOffset1 = rf.sideNormal1.x * rf.v1.x + rf.sideNormal1.y * rf.v1.y;//b2Dot_v2_v2(rf.sideNormal1, rf.v1);
        rf.sideOffset2 = rf.sideNormal2.x * rf.v2.x + rf.sideNormal2.y * rf.v2.y;//b2Dot_v2_v2(rf.sideNormal2, rf.v2);

        // Clip incident edge against extruded edge1 side edges.
        var clipPoints1 = new Array(2);
        var clipPoints2 = new Array(2);
        var np;

        // Clip to box side 1
        np = b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1.x, rf.sideNormal1.y, rf.sideOffset1, rf.i1);

        if (np < b2_maxManifoldPoints)
        {
            return;
        }

        // Clip to negative box side 1
        np = b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2.x, rf.sideNormal2.y, rf.sideOffset2, rf.i2);

        if (np < b2_maxManifoldPoints)
        {
            return;
        }

        // Now clipPoints2 contains the clipped points.
        if (primaryAxis.type == b2EPAxis.e_edgeA)
        {
            manifold.localNormal.x = rf.normal.x;
            manifold.localNormal.y = rf.normal.y;
            manifold.localPoint.x = rf.v1.x;
            manifold.localPoint.y = rf.v1.y;
        }
        else
        {
            manifold.localNormal.x = polygonB.m_normals[rf.i1].x;
            manifold.localNormal.y = polygonB.m_normals[rf.i1].y;
            manifold.localPoint.x = polygonB.m_vertices[rf.i1].x;
            manifold.localPoint.y = polygonB.m_vertices[rf.i1].y;
        }

        var pointCount = 0;
        for (var i = 0; i < b2_maxManifoldPoints; ++i)
        {
            //var separation;
            //separation = b2Dot_v2_v2(rf.normal, b2Vec2.Subtract(clipPoints2[i].v, rf.v1));
            var separation = rf.normal.x * (clipPoints2[i].v.x - rf.v1.x) + rf.normal.y * (clipPoints2[i].v.y - rf.v1.y);

            if (separation <= this.m_radius)
            {
                var cp = manifold.points[pointCount] = new b2ManifoldPoint();

                if (primaryAxis.type == b2EPAxis.e_edgeA)
                {
                    cp.localPoint.Assign(b2MulT_t_v2(this.m_xf, clipPoints2[i].v));
                    cp.id.Assign(clipPoints2[i].id);
                }
                else
                {
                    //cp.localPoint.Assign(clipPoints2[i].v);
                    cp.localPoint.x = clipPoints2[i].v.x;
                    cp.localPoint.y = clipPoints2[i].v.y;
                    cp.id.typeA = clipPoints2[i].id.typeB;
                    cp.id.typeB = clipPoints2[i].id.typeA;
                    cp.id.indexA = clipPoints2[i].id.indexB;
                    cp.id.indexB = clipPoints2[i].id.indexA;
                }

                ++pointCount;
            }
        }

        manifold.pointCount = pointCount;
    },

    ComputeEdgeSeparation: function()
    {
        var axis = new b2EPAxis();
        axis.type = b2EPAxis.e_edgeA;
        axis.index = this.m_front ? 0 : 1;
        axis.separation = Number.MAX_VALUE;

        for (var i = 0; i < this.m_polygonB.count; ++i)
        {
            //var s = b2Dot_v2_v2(this.m_normal, b2Vec2.Subtract(this.m_polygonB.vertices[i], this.m_v1));
            var s = this.m_normal.x * (this.m_polygonB.vertices[i].x - this.m_v1.x) + this.m_normal.y * (this.m_polygonB.vertices[i].y - this.m_v1.y);
            if (s < axis.separation)
            {
                axis.separation = s;
            }
        }

        return axis;
    },

    ComputePolygonSeparation: function()
    {
        var axis = new b2EPAxis();
        axis.type = b2EPAxis.e_unknown;
        axis.index = -1;
        axis.separation = -Number.MAX_VALUE;

        var perpx = -this.m_normal.y;// = new b2Vec2(-this.m_normal.y, this.m_normal.x);
        var perpy = this.m_normal.x;

        for (var i = 0; i < this.m_polygonB.count; ++i)
        {
            var nx = -this.m_polygonB.normals[i].x;//this.m_polygonB.normals[i].Negate();
            var ny = -this.m_polygonB.normals[i].y;

            //var s1 = b2Dot_v2_v2(n, b2Vec2.Subtract(this.m_polygonB.vertices[i], this.m_v1));
            var s1 = nx * (this.m_polygonB.vertices[i].x - this.m_v1.x) + ny * (this.m_polygonB.vertices[i].y - this.m_v1.y);
            //var s2 = b2Dot_v2_v2(n, b2Vec2.Subtract(this.m_polygonB.vertices[i], this.m_v2));
            var s2 = nx * (this.m_polygonB.vertices[i].x - this.m_v2.x) + ny * (this.m_polygonB.vertices[i].y - this.m_v2.y);
            var s = b2Min(s1, s2);

            if (s > this.m_radius)
            {
                // No collision
                axis.type = b2EPAxis.e_edgeB;
                axis.index = i;
                axis.separation = s;
                return axis;
            }

            // Adjacency
            if (/*b2Dot_v2_v2(n, perp)*/nx * perpx + ny * perpy >= 0.0)
            {
                if (/*b2Dot_v2_v2(b2Vec2.Subtract(n, this.m_upperLimit), this.m_normal)*/
                    (nx - this.m_upperLimit.x) * this.m_normal.x + (ny - this.m_upperLimit.y) * this.m_normal.y < -b2_angularSlop)
                {
                    continue;
                }
            }
            else
            {
                if (
                    /*b2Dot_v2_v2(b2Vec2.Subtract(n, this.m_lowerLimit), this.m_normal)*/
                    (nx - this.m_lowerLimit.x) * this.m_normal.x + (ny - this.m_lowerLimit.y) * this.m_normal.y< -b2_angularSlop)
                {
                    continue;
                }
            }

            if (s > axis.separation)
            {
                axis.type = b2EPAxis.e_edgeB;
                axis.index = i;
                axis.separation = s;
            }
        }

        return axis;
    }
};

b2EPCollider.e_isolated = 0;
b2EPCollider.e_concave = 1;
b2EPCollider.e_convex = 2;

/// Compute the collision manifold between an edge and a circle.
function b2CollideEdgeAndPolygon(manifold,
                               edgeA, xfA,
                               polygonB, xfB)
{
    b2CollideEdgeAndPolygon.collider.Collide(manifold, edgeA, xfA, polygonB, xfB);
}

b2CollideEdgeAndPolygon.collider = new b2EPCollider();

/// Clipping for contact manifolds.
function b2ClipSegmentToLine(vOut, vIn,
                            normalx, normaly, offset, vertexIndexA)
{
    // Start with no output points
    var numOut = 0;

    // Calculate the distance of end points to the line
    var distance0 = /*b2Dot_v2_v2(normal, vIn[0].v)*/(normalx * vIn[0].v.x + normaly * vIn[0].v.y) - offset;
    var distance1 = /*b2Dot_v2_v2(normal, vIn[1].v)*/(normalx * vIn[1].v.x + normaly * vIn[1].v.y) - offset;

    // If the points are behind the plane
    if (distance0 <= 0.0) vOut[numOut++] = vIn[0];
    if (distance1 <= 0.0) vOut[numOut++] = vIn[1];

    // If the points are on different sides of the plane
    if (distance0 * distance1 < 0.0)
    {
        // Find intersection point of edge and plane
        var interp = distance0 / (distance0 - distance1);
        vOut[numOut] = new b2ClipVertex();
        //vOut[numOut].v.Assign(b2Vec2.Add(vIn[0].v, b2Vec2.Multiply(interp, b2Vec2.Subtract(vIn[1].v, vIn[0].v))));
        vOut[numOut].v.x = vIn[0].v.x + (interp * (vIn[1].v.x - vIn[0].v.x));
        vOut[numOut].v.y = vIn[0].v.y + (interp * (vIn[1].v.y - vIn[0].v.y));

        // VertexA is hitting edgeB.
        vOut[numOut].id.indexA = vertexIndexA;
        vOut[numOut].id.indexB = vIn[0].id.indexB;
        vOut[numOut].id.typeA = b2ContactID.e_vertex;
        vOut[numOut].id.typeB = b2ContactID.e_face;
        ++numOut;
    }

    return numOut;
}

/// Determine if two generic shapes overlap.
function b2TestShapeOverlap(shapeA, indexA,
                    shapeB, indexB,
                    xfA, xfB)
{
    b2TestShapeOverlap.input.proxyA.Set(shapeA, indexA);
    b2TestShapeOverlap.input.proxyB.Set(shapeB, indexB);
    b2TestShapeOverlap.input.transformA = xfA;
    b2TestShapeOverlap.input.transformB = xfB;
    b2TestShapeOverlap.input.useRadii = true;

    b2TestShapeOverlap.cache.count = 0;

    b2DistanceFunc(b2TestShapeOverlap.output, b2TestShapeOverlap.cache, b2TestShapeOverlap.input);

    return b2TestShapeOverlap.output.distance < 10.0 * b2_epsilon;
}

b2TestShapeOverlap.input = new b2DistanceInput();
b2TestShapeOverlap.cache = new b2SimplexCache();
b2TestShapeOverlap.output = new b2DistanceOutput();

function b2TestOverlap(a, b)
{
    return !((b.lowerBound.x - a.upperBound.x) > 0.0 || (b.lowerBound.y - a.upperBound.y) > 0.0 || (a.lowerBound.x - b.upperBound.x) > 0.0 || (a.lowerBound.y - b.upperBound.y) > 0.0);
}
/*
* Copyright (c) 2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

var b2_nullNode = -1;

/// A node in the dynamic tree. The client does not interact with this directly.
function b2TreeNode()
{
    this.aabb = new b2AABB();
    this.userData = null;
    this.parent = 0; // next = parent!!
    this.child1 = this.child2 = this.height = 0;
}

b2TreeNode.prototype =
{
    IsLeaf: function()
    {
        return this.child1 == b2_nullNode;
    }
};

/// A dynamic AABB tree broad-phase, inspired by Nathanael Presson's btDbvt.
/// A dynamic tree arranges data in a binary tree to accelerate
/// queries such as volume queries and ray casts. Leafs are proxies
/// with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor
/// so that the proxy AABB is bigger than the client object. This allows the client
/// object to move by small amounts without triggering a tree update.
///
/// Nodes are pooled and relocatable, so we use node indices rather than pointers.
function b2DynamicTree()
{
    this.m_root = b2_nullNode;

    this.m_nodeCapacity = 16;
    this.m_nodeCount = 0;
    this.m_nodes = new Array(this.m_nodeCapacity);

    // Build a linked list for the free list.
    for (var i = 0; i < this.m_nodeCapacity - 1; ++i)
    {
        this.m_nodes[i] = new b2TreeNode();
        this.m_nodes[i].parent = i + 1;
        this.m_nodes[i].height = -1;
    }

    this.m_nodes[this.m_nodeCapacity-1] = new b2TreeNode();
    this.m_nodes[this.m_nodeCapacity-1].parent = b2_nullNode;
    this.m_nodes[this.m_nodeCapacity-1].height = -1;
    this.m_freeList = 0;

    this.m_path = 0;

    this.m_insertionCount = 0;
}

b2DynamicTree.aabbExtensionFattener = new b2Vec2(b2_aabbExtension, b2_aabbExtension);

b2DynamicTree.prototype =
{
    /// Create a proxy. Provide a tight fitting AABB and a userData pointer.
    CreateProxy: function(aabb, userData)
    {
        var proxyId = this.AllocateNode();

        // Fatten the aabb.
        this.m_nodes[proxyId].aabb.lowerBound.Assign(b2Vec2.Subtract(aabb.lowerBound, b2DynamicTree.aabbExtensionFattener));
        this.m_nodes[proxyId].aabb.upperBound.Assign(b2Vec2.Add(aabb.upperBound, b2DynamicTree.aabbExtensionFattener));
        this.m_nodes[proxyId].userData = userData;
        this.m_nodes[proxyId].height = 0;

        this.InsertLeaf(proxyId);

        return proxyId;
    },

    /// Destroy a proxy. This asserts if the id is invalid.
    DestroyProxy: function(proxyId)
    {

        b2Assert(0 <= proxyId && proxyId < this.m_nodeCapacity);
        b2Assert(this.m_nodes[proxyId].IsLeaf());


        this.RemoveLeaf(proxyId);
        this.FreeNode(proxyId);
    },

    /// Move a proxy with a swepted AABB. If the proxy has moved outside of its fattened AABB,
    /// then the proxy is removed from the tree and re-inserted. Otherwise
    /// the function returns immediately.
    /// @return true if the proxy was re-inserted.
    MoveProxy: function(proxyId, aabb, displacement)
    {

        b2Assert(0 <= proxyId && proxyId < this.m_nodeCapacity);
        b2Assert(this.m_nodes[proxyId].IsLeaf());


        if (this.m_nodes[proxyId].aabb.Contains(aabb))
        {
            return false;
        }

        this.RemoveLeaf(proxyId);

        // Extend AABB.
        this.m_nodes[proxyId].aabb.Assign(aabb);
        this.m_nodes[proxyId].aabb.lowerBound.Subtract(b2DynamicTree.aabbExtensionFattener);
        this.m_nodes[proxyId].aabb.upperBound.Add(b2DynamicTree.aabbExtensionFattener);

        // Predict AABB displacement.
        var d = b2Vec2.Multiply(b2_aabbMultiplier, displacement);

        if (d.x < 0.0)
        {
            this.m_nodes[proxyId].aabb.lowerBound.x += d.x;
        }
        else
        {
            this.m_nodes[proxyId].aabb.upperBound.x += d.x;
        }

        if (d.y < 0.0)
        {
            this.m_nodes[proxyId].aabb.lowerBound.y += d.y;
        }
        else
        {
            this.m_nodes[proxyId].aabb.upperBound.y += d.y;
        }

        this.InsertLeaf(proxyId);
        return true;
    },

    /// Get proxy user data.
    /// @return the proxy user data or 0 if the id is invalid.
    GetUserData: function(proxyId)
    {

        b2Assert(0 <= proxyId && proxyId < this.m_nodeCapacity);

        return this.m_nodes[proxyId].userData;
    },

    /// Get the fat AABB for a proxy.
    GetFatAABB: function(proxyId)
    {

        b2Assert(0 <= proxyId && proxyId < this.m_nodeCapacity);

        return this.m_nodes[proxyId].aabb;
    },

    /// Query an AABB for overlapping proxies. The callback class
    /// is called for each proxy that overlaps the supplied AABB.
    Query: function(callback, aabb)
    {
        var stack = [];
        stack.push(this.m_root);

        while (stack.length > 0)
        {
            var nodeId = stack.pop();
            if (nodeId == b2_nullNode)
            {
                continue;
            }

            var node = this.m_nodes[nodeId];

            if (b2TestOverlap(node.aabb, aabb))
            {
                if (node.IsLeaf())
                {
                    var proceed = callback.QueryCallback(nodeId);
                    if (proceed == false)
                    {
                        return;
                    }
                }
                else
                {
                    stack.push(node.child1);
                    stack.push(node.child2);
                }
            }
        }
    },

    /// Ray-cast against the proxies in the tree. This relies on the callback
    /// to perform a exact ray-cast in the case were the proxy contains a shape.
    /// The callback also performs the any collision filtering. This has performance
    /// roughly equal to k * log(n), where k is the number of collisions and n is the
    /// number of proxies in the tree.
    /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
    /// @param callback a callback class that is called for each proxy that is hit by the ray.
    RayCast: function(callback, input)
    {
        var p1 = input.p1;
        var p2 = input.p2;
        var r = b2Vec2.Subtract(p2, p1);

        b2Assert(r.LengthSquared() > 0.0);

        r.Normalize();

        // v is perpendicular to the segment.
        var v = b2Cross_f_v2(1.0, r);
        var abs_v = b2Abs_v2(v);

        // Separating axis for segment (Gino, p80).
        // |dot(v, p1 - c)| > dot(|v|, h)

        var maxFraction = input.maxFraction;

        // Build a bounding box for the segment.
        var segmentAABB = new b2AABB();
        {
            var t = b2Vec2.Add(p1, b2Vec2.Multiply(maxFraction, b2Vec2.Subtract(p2, p1)));
            segmentAABB.lowerBound.Assign(b2Min_v2(p1, t));
            segmentAABB.upperBound.Assign(b2Max_v2(p1, t));
        }

        var stack = [];
        stack.push(this.m_root);

        while (stack.length > 0)
        {
            var nodeId = stack.pop();
            if (nodeId == b2_nullNode)
            {
                continue;
            }

            var node = this.m_nodes[nodeId];

            if (b2TestOverlap(node.aabb, segmentAABB) == false)
            {
                continue;
            }

            // Separating axis for segment (Gino, p80).
            // |dot(v, p1 - c)| > dot(|v|, h)
            var c = node.aabb.GetCenter();
            var h = node.aabb.GetExtents();
            var separation = b2Abs(b2Dot_v2_v2(v, b2Vec2.Subtract(p1, c))) - b2Dot_v2_v2(abs_v, h);
            if (separation > 0.0)
            {
                continue;
            }

            if (node.IsLeaf())
            {
                var subInput = new b2RayCastInput();
                subInput.p1.Assign(input.p1);
                subInput.p2.Assign(input.p2);
                subInput.maxFraction = maxFraction;

                var value = callback.RayCastCallback(subInput, nodeId);

                if (value == 0.0)
                {
                    // The client has terminated the ray cast.
                    return;
                }

                if (value > 0.0)
                {
                    // Update segment bounding box.
                    maxFraction = value;
                    var t = b2Vec2.Add(p1, b2Vec2.Multiply(maxFraction, b2Vec2.Subtract(p2, p1)));
                    segmentAABB.lowerBound.Assign(b2Min_v2(p1, t));
                    segmentAABB.upperBound.Assign(b2Max_v2(p1, t));
                }
            }
            else
            {
                stack.push(node.child1);
                stack.push(node.child2);
            }
        }
    },

    /// Validate this tree. For testing.
    Validate: function()
    {
        this.ValidateStructure(this.m_root);
        this.ValidateMetrics(this.m_root);

        var freeCount = 0;
        var freeIndex = this.m_freeList;
        while (freeIndex != b2_nullNode)
        {

            b2Assert(0 <= freeIndex && freeIndex < this.m_nodeCapacity);

            freeIndex = this.m_nodes[freeIndex].parent;
            ++freeCount;
        }


        b2Assert(this.GetHeight() == this.ComputeHeight());
        b2Assert(this.m_nodeCount + freeCount == this.m_nodeCapacity);

    },

    /// Compute the height of the binary tree in O(N) time. Should not be
    /// called often.
    GetHeight: function()
    {
        if (this.m_root == b2_nullNode)
        {
            return 0;
        }

        return this.m_nodes[this.m_root].height;
    },

    /// Get the maximum balance of an node in the tree. The balance is the difference
    /// in height of the two children of a node.
    GetMaxBalance: function()
    {
        var maxBalance = 0;
        for (var i = 0; i < this.m_nodeCapacity; ++i)
        {
            var node = this.m_nodes[i];
            if (node.height <= 1)
            {
                continue;
            }


            b2Assert(node.IsLeaf() == false);


            var child1 = node.child1;
            var child2 = node.child2;
            var balance = b2Abs(this.m_nodes[child2].height - this.m_nodes[child1].height);
            maxBalance = b2Max(maxBalance, balance);
        }

        return maxBalance;
    },

    /// Get the ratio of the sum of the node areas to the root area.
    GetAreaRatio: function()
    {
        if (this.m_root == b2_nullNode)
        {
            return 0.0;
        }

        var root = this.m_nodes[this.m_root];
        var rootArea = root.aabb.GetPerimeter();

        var totalArea = 0.0;
        for (var i = 0; i < this.m_nodeCapacity; ++i)
        {
            var node = this.m_nodes[i];
            if (node.height < 0)
            {
                // Free node in pool
                continue;
            }

            totalArea += node.aabb.GetPerimeter();
        }

        return totalArea / rootArea;
    },

    /// Build an optimal tree. Very expensive. For testing.
    RebuildBottomUp: function()
    {
        var nodes = new Array(this.m_nodeCount);
        var count = 0;

        // Build array of leaves. Free the rest.
        for (var i = 0; i < this.m_nodeCapacity; ++i)
        {
            if (this.m_nodes[i].height < 0)
            {
                // free node in pool
                continue;
            }

            if (this.m_nodes[i].IsLeaf())
            {
                this.m_nodes[i].parent = b2_nullNode;
                nodes[count] = i;
                ++count;
            }
            else
            {
                this.FreeNode(i);
            }
        }

        while (count > 1)
        {
            var minCost = b2_maxFloat;
            var iMin = -1, jMin = -1;
            for (i = 0; i < count; ++i)
            {
                var aabbi = this.m_nodes[nodes[i]].aabb;

                for (var j = i + 1; j < count; ++j)
                {
                    var aabbj = this.m_nodes[nodes[j]].aabb;
                    var b = new b2AABB();
                    b.Combine(aabbi, aabbj);
                    var cost = b.GetPerimeter();
                    if (cost < minCost)
                    {
                        iMin = i;
                        jMin = j;
                        minCost = cost;
                    }
                }
            }

            var index1 = nodes[iMin];
            var index2 = nodes[jMin];
            var child1 = this.m_nodes[index1];
            var child2 = this.m_nodes[index2];

            var parentIndex = this.AllocateNode();
            var parent = this.m_nodes[parentIndex];
            parent.child1 = index1;
            parent.child2 = index2;
            parent.height = 1 + b2Max(child1.height, child2.height);
            parent.aabb.Combine(child1.aabb, child2.aabb);
            parent.parent = b2_nullNode;

            child1.parent = parentIndex;
            child2.parent = parentIndex;

            nodes[jMin] = nodes[count-1];
            nodes[iMin] = parentIndex;
            --count;
        }

        this.m_root = nodes[0];

        this.Validate();
    },

    /// Shift the world origin. Useful for large worlds.
    /// The shift formula is: position -= newOrigin
    /// @param newOrigin the new origin with respect to the old origin
    ShiftOrigin: function(newOrigin)
    {
        // Build array of leaves. Free the rest.
        for (var i = 0; i < this.m_nodeCapacity; ++i)
        {
            this.m_nodes[i].aabb.lowerBound.Subtract(newOrigin);
            this.m_nodes[i].aabb.upperBound.Subtract(newOrigin);
        }
    },

    AllocateNode: function()
    {
        // Expand the node pool as needed.
        if (this.m_freeList == b2_nullNode)
        {

            b2Assert(this.m_nodeCount == this.m_nodeCapacity);


            // The free list is empty. Rebuild a bigger pool.
            var oldNodes = this.m_nodes;
            this.m_nodeCapacity *= 2;
            this.m_nodes = oldNodes.concat(new Array(this.m_nodeCapacity - this.m_nodeCount));

            // Build a linked list for the free list. The parent
            // pointer becomes the "next" pointer.
            for (var i = this.m_nodeCount; i < this.m_nodeCapacity - 1; ++i)
            {
                this.m_nodes[i] = new b2TreeNode();
                this.m_nodes[i].parent = i + 1;
                this.m_nodes[i].height = -1;
            }
            this.m_nodes[this.m_nodeCapacity - 1] = new b2TreeNode();
            this.m_nodes[this.m_nodeCapacity - 1].parent = b2_nullNode;
            this.m_nodes[this.m_nodeCapacity-1].height = -1;
            this.m_freeList = this.m_nodeCount;
        }

        // Peel a node off the free list.
        var nodeId = this.m_freeList;
        this.m_freeList = this.m_nodes[nodeId].parent;
        this.m_nodes[nodeId].parent = b2_nullNode;
        this.m_nodes[nodeId].child1 = b2_nullNode;
        this.m_nodes[nodeId].child2 = b2_nullNode;
        this.m_nodes[nodeId].height = 0;
        this.m_nodes[nodeId].userData = null;
        ++this.m_nodeCount;
        return nodeId;
    },

    FreeNode: function(nodeId)
    {

        b2Assert(0 <= nodeId && nodeId < this.m_nodeCapacity);
        b2Assert(0 < this.m_nodeCount);

        this.m_nodes[nodeId].parent = this.m_freeList;
        this.m_nodes[nodeId].height = -1;
        this.m_freeList = nodeId;
        --this.m_nodeCount;
    },

    InsertLeaf: function(leaf)
    {
        ++this.m_insertionCount;

        if (this.m_root == b2_nullNode)
        {
            this.m_root = leaf;
            this.m_nodes[this.m_root].parent = b2_nullNode;
            return;
        }

        // Find the best sibling for this node
        var leafAABB = this.m_nodes[leaf].aabb;
        var index = this.m_root;

        while (this.m_nodes[index].IsLeaf() == false)
        {
            var child1 = this.m_nodes[index].child1;
            var child2 = this.m_nodes[index].child2;

            var area = this.m_nodes[index].aabb.GetPerimeter();

            var combinedAABB = new b2AABB();
            combinedAABB.Combine(this.m_nodes[index].aabb, leafAABB);
            var combinedArea = combinedAABB.GetPerimeter();

            // Cost of creating a new parent for this node and the new leaf
            var cost = 2.0 * combinedArea;

            // Minimum cost of pushing the leaf further down the tree
            var inheritanceCost = 2.0 * (combinedArea - area);

            // Cost of descending into child1
            var cost1;
            var aabb;

            if (this.m_nodes[child1].IsLeaf())
            {
                aabb = new b2AABB();
                aabb.Combine(leafAABB, this.m_nodes[child1].aabb);
                cost1 = aabb.GetPerimeter() + inheritanceCost;
            }
            else
            {
                aabb = new b2AABB();
                aabb.Combine(leafAABB, this.m_nodes[child1].aabb);
                var oldArea = this.m_nodes[child1].aabb.GetPerimeter();
                var newArea = aabb.GetPerimeter();
                cost1 = (newArea - oldArea) + inheritanceCost;
            }

            // Cost of descending into child2
            var cost2;
            if (this.m_nodes[child2].IsLeaf())
            {
                aabb = new b2AABB();
                aabb.Combine(leafAABB, this.m_nodes[child2].aabb);
                cost2 = aabb.GetPerimeter() + inheritanceCost;
            }
            else
            {
                aabb = new b2AABB();
                aabb.Combine(leafAABB, this.m_nodes[child2].aabb);
                var oldArea = this.m_nodes[child2].aabb.GetPerimeter();
                var newArea = aabb.GetPerimeter();
                cost2 = newArea - oldArea + inheritanceCost;
            }

            // Descend according to the minimum cost.
            if (cost < cost1 && cost < cost2)
            {
                break;
            }

            // Descend
            if (cost1 < cost2)
            {
                index = child1;
            }
            else
            {
                index = child2;
            }
        }

        var sibling = index;

        // Create a new parent.
        var oldParent = this.m_nodes[sibling].parent;
        var newParent = this.AllocateNode();
        this.m_nodes[newParent].parent = oldParent;
        this.m_nodes[newParent].userData = null;
        this.m_nodes[newParent].aabb.Combine(leafAABB, this.m_nodes[sibling].aabb);
        this.m_nodes[newParent].height = this.m_nodes[sibling].height + 1;

        if (oldParent != b2_nullNode)
        {
            // The sibling was not the root.
            if (this.m_nodes[oldParent].child1 == sibling)
            {
                this.m_nodes[oldParent].child1 = newParent;
            }
            else
            {
                this.m_nodes[oldParent].child2 = newParent;
            }

            this.m_nodes[newParent].child1 = sibling;
            this.m_nodes[newParent].child2 = leaf;
            this.m_nodes[sibling].parent = newParent;
            this.m_nodes[leaf].parent = newParent;
        }
        else
        {
            // The sibling was the root.
            this.m_nodes[newParent].child1 = sibling;
            this.m_nodes[newParent].child2 = leaf;
            this.m_nodes[sibling].parent = newParent;
            this.m_nodes[leaf].parent = newParent;
            this.m_root = newParent;
        }

        // Walk back up the tree fixing heights and AABBs
        index = this.m_nodes[leaf].parent;
        while (index != b2_nullNode)
        {
            index = this.Balance(index);

            var child1 = this.m_nodes[index].child1;
            var child2 = this.m_nodes[index].child2;


            b2Assert(child1 != b2_nullNode);
            b2Assert(child2 != b2_nullNode);


            this.m_nodes[index].height = 1 + b2Max(this.m_nodes[child1].height, this.m_nodes[child2].height);
            this.m_nodes[index].aabb.Combine(this.m_nodes[child1].aabb, this.m_nodes[child2].aabb);

            index = this.m_nodes[index].parent;
        }

        //this.Validate();
    },
    RemoveLeaf: function(leaf)
    {
        if (leaf == this.m_root)
        {
            this.m_root = b2_nullNode;
            return;
        }

        var parent = this.m_nodes[leaf].parent;
        var grandParent = this.m_nodes[parent].parent;
        var sibling;
        if (this.m_nodes[parent].child1 == leaf)
        {
            sibling = this.m_nodes[parent].child2;
        }
        else
        {
            sibling = this.m_nodes[parent].child1;
        }

        if (grandParent != b2_nullNode)
        {
            // Destroy parent and connect sibling to grandParent.
            if (this.m_nodes[grandParent].child1 == parent)
            {
                this.m_nodes[grandParent].child1 = sibling;
            }
            else
            {
                this.m_nodes[grandParent].child2 = sibling;
            }
            this.m_nodes[sibling].parent = grandParent;
            this.FreeNode(parent);

            // Adjust ancestor bounds.
            var index = grandParent;
            while (index != b2_nullNode)
            {
                index = this.Balance(index);

                var child1 = this.m_nodes[index].child1;
                var child2 = this.m_nodes[index].child2;

                this.m_nodes[index].aabb.Combine(this.m_nodes[child1].aabb, this.m_nodes[child2].aabb);
                this.m_nodes[index].height = 1 + b2Max(this.m_nodes[child1].height, this.m_nodes[child2].height);

                index = this.m_nodes[index].parent;
            }
        }
        else
        {
            this.m_root = sibling;
            this.m_nodes[sibling].parent = b2_nullNode;
            this.FreeNode(parent);
        }

        //this.Validate();
    },

    Balance: function(iA)
    {

        b2Assert(iA != b2_nullNode);


        var A = this.m_nodes[iA];
        if (A.IsLeaf() || A.height < 2)
        {
            return iA;
        }

        var iB = A.child1;
        var iC = A.child2;

        b2Assert(0 <= iB && iB < this.m_nodeCapacity);
        b2Assert(0 <= iC && iC < this.m_nodeCapacity);


        var B = this.m_nodes[iB];
        var C = this.m_nodes[iC];

        var balance = C.height - B.height;

        // Rotate C up
        if (balance > 1)
        {
            var iF = C.child1;
            var iG = C.child2;
            var F = this.m_nodes[iF];
            var G = this.m_nodes[iG];

            b2Assert(0 <= iF && iF < this.m_nodeCapacity);
            b2Assert(0 <= iG && iG < this.m_nodeCapacity);


            // Swap A and C
            C.child1 = iA;
            C.parent = A.parent;
            A.parent = iC;

            // A's old parent should point to C
            if (C.parent != b2_nullNode)
            {
                if (this.m_nodes[C.parent].child1 == iA)
                {
                    this.m_nodes[C.parent].child1 = iC;
                }
                else
                {

                    b2Assert(this.m_nodes[C.parent].child2 == iA);

                    this.m_nodes[C.parent].child2 = iC;
                }
            }
            else
            {
                this.m_root = iC;
            }

            // Rotate
            if (F.height > G.height)
            {
                C.child2 = iF;
                A.child2 = iG;
                G.parent = iA;
                A.aabb.Combine(B.aabb, G.aabb);
                C.aabb.Combine(A.aabb, F.aabb);

                A.height = 1 + b2Max(B.height, G.height);
                C.height = 1 + b2Max(A.height, F.height);
            }
            else
            {
                C.child2 = iG;
                A.child2 = iF;
                F.parent = iA;
                A.aabb.Combine(B.aabb, F.aabb);
                C.aabb.Combine(A.aabb, G.aabb);

                A.height = 1 + b2Max(B.height, F.height);
                C.height = 1 + b2Max(A.height, G.height);
            }

            return iC;
        }

        // Rotate B up
        if (balance < -1)
        {
            var iD = B.child1;
            var iE = B.child2;
            var D = this.m_nodes[iD];
            var E = this.m_nodes[iE];

            b2Assert(0 <= iD && iD < this.m_nodeCapacity);
            b2Assert(0 <= iE && iE < this.m_nodeCapacity);


            // Swap A and B
            B.child1 = iA;
            B.parent = A.parent;
            A.parent = iB;

            // A's old parent should point to B
            if (B.parent != b2_nullNode)
            {
                if (this.m_nodes[B.parent].child1 == iA)
                {
                    this.m_nodes[B.parent].child1 = iB;
                }
                else
                {

                    b2Assert(this.m_nodes[B.parent].child2 == iA);

                    this.m_nodes[B.parent].child2 = iB;
                }
            }
            else
            {
                this.m_root = iB;
            }

            // Rotate
            if (D.height > E.height)
            {
                B.child2 = iD;
                A.child1 = iE;
                E.parent = iA;
                A.aabb.Combine(C.aabb, E.aabb);
                B.aabb.Combine(A.aabb, D.aabb);

                A.height = 1 + b2Max(C.height, E.height);
                B.height = 1 + b2Max(A.height, D.height);
            }
            else
            {
                B.child2 = iE;
                A.child1 = iD;
                D.parent = iA;
                A.aabb.Combine(C.aabb, D.aabb);
                B.aabb.Combine(A.aabb, E.aabb);

                A.height = 1 + b2Max(C.height, D.height);
                B.height = 1 + b2Max(A.height, E.height);
            }

            return iB;
        }

        return iA;
    },

    ComputeHeight: function(nodeId)
    {
        if (typeof(nodeId) === 'undefined')
            nodeId = this.m_root;


        b2Assert(0 <= nodeId && nodeId < this.m_nodeCapacity);

        var node = this.m_nodes[nodeId];

        if (node.IsLeaf())
        {
            return 0;
        }

        var height1 = this.ComputeHeight(node.child1);
        var height2 = this.ComputeHeight(node.child2);
        return 1 + b2Max(height1, height2);
    },

    ValidateStructure: function(index)
    {
        if (index == b2_nullNode)
        {
            return;
        }


        if (index == this.m_root)
        {
            b2Assert(this.m_nodes[index].parent == b2_nullNode);
        }


        var node = this.m_nodes[index];

        var child1 = node.child1;
        var child2 = node.child2;

        if (node.IsLeaf())
        {

            b2Assert(child1 == b2_nullNode);
            b2Assert(child2 == b2_nullNode);
            b2Assert(node.height == 0);

            return;
        }


        b2Assert(0 <= child1 && child1 < this.m_nodeCapacity);
        b2Assert(0 <= child2 && child2 < this.m_nodeCapacity);

        b2Assert(this.m_nodes[child1].parent == index);
        b2Assert(this.m_nodes[child2].parent == index);


        this.ValidateStructure(child1);
        this.ValidateStructure(child2);
    },
    ValidateMetrics: function(index)
    {
        if (index == b2_nullNode)
        {
            return;
        }

        var node = this.m_nodes[index];

        var child1 = node.child1;
        var child2 = node.child2;

        if (node.IsLeaf())
        {

            b2Assert(child1 == b2_nullNode);
            b2Assert(child2 == b2_nullNode);
            b2Assert(node.height == 0);

            return;
        }


        b2Assert(0 <= child1 && child1 < this.m_nodeCapacity);
        b2Assert(0 <= child2 && child2 < this.m_nodeCapacity);


        var height1 = this.m_nodes[child1].height;
        var height2 = this.m_nodes[child2].height;
        var height;
        height = 1 + b2Max(height1, height2);


        b2Assert(node.height == height);


        var aabb = new b2AABB();
        aabb.Combine(this.m_nodes[child1].aabb, this.m_nodes[child2].aabb);


        b2Assert(b2Vec2.Equals(aabb.lowerBound, node.aabb.lowerBound));
        b2Assert(b2Vec2.Equals(aabb.upperBound, node.aabb.upperBound));


        this.ValidateMetrics(child1);
        this.ValidateMetrics(child2);
    }
};
/// Input parameters for b2TimeOfImpact
function b2TOIInput()
{
    this.proxyA = new b2DistanceProxy();
    this.proxyB = new b2DistanceProxy();
    this.sweepA = new b2Sweep();
    this.sweepB = new b2Sweep();
    this.tMax = 0;      // defines sweep interval [0, tMax]
};

// Output parameters for b2TimeOfImpact.
function b2TOIOutput()
{
    this.state = 0;
    this.t = 0;
};

b2TOIOutput.e_unknown = 0;
b2TOIOutput.e_failed = 1;
b2TOIOutput.e_overlapped = 2;
b2TOIOutput.e_touching = 3;
b2TOIOutput.e_separated = 4;

//
function b2SeparationFunction()
{
    this.m_proxyA = null;
    this.m_proxyB = null;
    this.m_sweepA = null;
    this.m_sweepB = null;
    this.m_type = 0;
    this.m_localPoint = new b2Vec2();
    this.m_axis = new b2Vec2();
}

var _local_xfA = new b2Transform();
var _local_xfB = new b2Transform();

b2SeparationFunction.prototype =
{
    // TODO_ERIN might not need to return the separation
    Initialize: function(cache,
        proxyA, sweepA,
        proxyB, sweepB,
        t1)
    {
        this.m_proxyA = proxyA;
        this.m_proxyB = proxyB;
        var count = cache.count;

        b2Assert(0 < count && count < 3);


        this.m_sweepA = sweepA;
        this.m_sweepB = sweepB;

        this.m_sweepA.GetTransform(_local_xfA, t1);
        this.m_sweepB.GetTransform(_local_xfB, t1);

        if (count == 1)
        {
            this.m_type = b2SeparationFunction.e_points;
            var localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
            var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
            var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
            var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;
            var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
            var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;
            this.m_axis.x = pointBx - pointAx;//= b2Vec2.Subtract(pointB, pointA);
            this.m_axis.y = pointBy - pointAy;
            var s = this.m_axis.Normalize();
            return s;
        }
        else if (cache.indexA[0] == cache.indexA[1])
        {
            // Two points on B and one on A.
            this.m_type = b2SeparationFunction.e_faceB;
            var localPointB1 = proxyB.GetVertex(cache.indexB[0]);
            var localPointB2 = proxyB.GetVertex(cache.indexB[1]);

            this.m_axis.x = 1.0 * (localPointB2.y - localPointB1.y);//b2Cross_v2_f(b2Vec2.Subtract(localPointB2, localPointB1), 1.0);
            this.m_axis.y = -1.0 * (localPointB2.x - localPointB1.x);
            this.m_axis.Normalize();
            var normalx = _local_xfB.q.c * this.m_axis.x - _local_xfB.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfB.q, this.m_axis);
            var normaly = _local_xfB.q.s * this.m_axis.x + _local_xfB.q.c * this.m_axis.y;

            this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);//= b2Vec2.Multiply(0.5, b2Vec2.Add(localPointB1, localPointB2));
            this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
            var pointBx = (_local_xfB.q.c * this.m_localPoint.x - _local_xfB.q.s * this.m_localPoint.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, this.m_localPoint);
            var pointBy = (_local_xfB.q.s * this.m_localPoint.x + _local_xfB.q.c * this.m_localPoint.y) + _local_xfB.p.y;

            var localPointA = proxyA.GetVertex(cache.indexA[0]);
            var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
            var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;

            var s = (pointAx - pointBx) * normalx + (pointAy - pointBy) * normaly;//b2Dot_v2_v2(b2Vec2.Subtract(pointA, pointB), normal);
            if (s < 0.0)
            {
                this.m_axis.x = -this.m_axis.x;// = this.m_axis.Negate();
                this.m_axis.y = -this.m_axis.y;
                s = -s;
            }
            return s;
        }
        else
        {
            // Two points on A and one or two points on B.
            this.m_type = b2SeparationFunction.e_faceA;
            var localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
            var localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);

            this.m_axis.x = 1.0 * (localPointA2.y - localPointA1.y);//b2Cross_v2_f(b2Vec2.Subtract(localPointA2, localPointA1), 1.0);
            this.m_axis.y = -1.0 * (localPointA2.x - localPointA1.x);
            this.m_axis.Normalize();
            var normalx = _local_xfA.q.c * this.m_axis.x - _local_xfA.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfA.q, this.m_axis);
            var normaly = _local_xfA.q.s * this.m_axis.x + _local_xfA.q.c * this.m_axis.y;

            this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);//b2Vec2.Multiply(0.5, b2Vec2.Add(localPointA1, localPointA2));
            this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
            var pointAx = (_local_xfA.q.c * this.m_localPoint.x - _local_xfA.q.s * this.m_localPoint.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, this.m_localPoint);
            var pointAy = (_local_xfA.q.s * this.m_localPoint.x + _local_xfA.q.c * this.m_localPoint.y) + _local_xfA.p.y;

            var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
            var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
            var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;

            var s = (pointBx - pointAx) * normalx + (pointBy - pointAy) * normaly;//b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), normal);
            if (s < 0.0)
            {
                this.m_axis.x = -this.m_axis.x;// = this.m_axis.Negate();
                this.m_axis.y = -this.m_axis.y;
                s = -s;
            }
            return s;
        }
    },

    //
    FindMinSeparation: function(indices, t)
    {
        this.m_sweepA.GetTransform(_local_xfA, t);
        this.m_sweepB.GetTransform(_local_xfB, t);

        switch (this.m_type)
        {
        case b2SeparationFunction.e_points:
            {
                var axisAx = _local_xfA.q.c * this.m_axis.x + _local_xfA.q.s * this.m_axis.y;//b2MulT_r_v2(_local_xfA.q, this.m_axis);
                var axisAy = -_local_xfA.q.s * this.m_axis.x + _local_xfA.q.c * this.m_axis.y;
                var axisBx = _local_xfB.q.c * -this.m_axis.x + _local_xfB.q.s * -this.m_axis.y;//b2MulT_r_v2(_local_xfB.q, this.m_axis.Negate());
                var axisBy = -_local_xfB.q.s * -this.m_axis.x + _local_xfB.q.c * -this.m_axis.y;

                indices[0] = this.m_proxyA.GetSupport(axisAx, axisAy);
                indices[1] = this.m_proxyB.GetSupport(axisBx, axisBy);

                var localPointA = this.m_proxyA.GetVertex(indices[0]);
                var localPointB = this.m_proxyB.GetVertex(indices[1]);

                var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
                var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;
                var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
                var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;

                //var separation = b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), this.m_axis);
                //return separation;
                return (pointBx - pointAx) * this.m_axis.x + (pointBy - pointAy) * this.m_axis.y;
            }

        case b2SeparationFunction.e_faceA:
            {
                var normalx = _local_xfA.q.c * this.m_axis.x - _local_xfA.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfA.q, this.m_axis);
                var normaly = _local_xfA.q.s * this.m_axis.x + _local_xfA.q.c * this.m_axis.y;
                var pointAx = (_local_xfA.q.c * this.m_localPoint.x - _local_xfA.q.s * this.m_localPoint.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, this.m_localPoint);
                var pointAy = (_local_xfA.q.s * this.m_localPoint.x + _local_xfA.q.c * this.m_localPoint.y) + _local_xfA.p.y;

                var axisBx = _local_xfB.q.c * -normalx + _local_xfB.q.s * -normaly;//b2MulT_r_v2(_local_xfB.q, normal.Negate());
                var axisBy = -_local_xfB.q.s * -normalx + _local_xfB.q.c * -normaly;

                indices[0] = -1;
                indices[1] = this.m_proxyB.GetSupport(axisBx, axisBy);

                var localPointB = this.m_proxyB.GetVertex(indices[1]);
                var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
                var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;

                //var separation = b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), normal);
                //return separation;
                return (pointBx - pointAx) * normalx + (pointBy - pointAy) * normaly;
            }

        case b2SeparationFunction.e_faceB:
            {
                var normalx = _local_xfB.q.c * this.m_axis.x - _local_xfB.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfB.q, this.m_axis);
                var normaly = _local_xfB.q.s * this.m_axis.x + _local_xfB.q.c * this.m_axis.y;
                var pointBx = (_local_xfB.q.c * this.m_localPoint.x - _local_xfB.q.s * this.m_localPoint.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, this.m_localPoint);
                var pointBy = (_local_xfB.q.s * this.m_localPoint.x + _local_xfB.q.c * this.m_localPoint.y) + _local_xfB.p.y;

                var axisAx = _local_xfA.q.c * -normalx + _local_xfA.q.s * -normaly;//b2MulT_r_v2(_local_xfA.q, normal.Negate());
                var axisBy = -_local_xfA.q.s * -normalx + _local_xfA.q.c * -normaly;

                indices[1] = -1;
                indices[0] = this.m_proxyA.GetSupport(axisAx, axisBy);

                var localPointA = this.m_proxyA.GetVertex(indices[0]);
                var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
                var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;

                //var separation = b2Dot_v2_v2(b2Vec2.Subtract(pointA, pointB), normal);
                //return separation;
                return (pointAx - pointBx) * normalx + (pointAy - pointBy) * normaly;
            }


        default:
            b2Assert(false);
            indices[0] = -1;
            indices[1] = -1;
            return 0.0;

        }
    },

    //
    Evaluate: function(indexA, indexB, t)
    {
        this.m_sweepA.GetTransform(_local_xfA, t);
        this.m_sweepB.GetTransform(_local_xfB, t);

        switch (this.m_type)
        {
        case b2SeparationFunction.e_points:
            {
                var localPointA = this.m_proxyA.GetVertex(indexA);
                var localPointB = this.m_proxyB.GetVertex(indexB);

                var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
                var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;
                var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
                var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;
                var separation = (pointBx - pointAx) * this.m_axis.x + (pointBy - pointAy) * this.m_axis.y;//b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), this.m_axis);

                return separation;
            }

        case b2SeparationFunction.e_faceA:
            {
                var normalx = _local_xfA.q.c * this.m_axis.x - _local_xfA.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfA.q, this.m_axis);
                var normaly = _local_xfA.q.s * this.m_axis.x + _local_xfA.q.c * this.m_axis.y;
                var pointAx = (_local_xfA.q.c * this.m_localPoint.x - _local_xfA.q.s * this.m_localPoint.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, this.m_localPoint);
                var pointAy = (_local_xfA.q.s * this.m_localPoint.x + _local_xfA.q.c * this.m_localPoint.y) + _local_xfA.p.y;

                var localPointB = this.m_proxyB.GetVertex(indexB);
                var pointBx = (_local_xfB.q.c * localPointB.x - _local_xfB.q.s * localPointB.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, localPointB);
                var pointBy = (_local_xfB.q.s * localPointB.x + _local_xfB.q.c * localPointB.y) + _local_xfB.p.y;

                var separation = (pointBx - pointAx) * normalx + (pointBy - pointAy) * normaly;//b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), normal);
                return separation;
            }

        case b2SeparationFunction.e_faceB:
            {
                var normalx = _local_xfB.q.c * this.m_axis.x - _local_xfB.q.s * this.m_axis.y;//b2Mul_r_v2(_local_xfB.q, this.m_axis);
                var normaly = _local_xfB.q.s * this.m_axis.x + _local_xfB.q.c * this.m_axis.y;
                var pointBx = (_local_xfB.q.c * this.m_localPoint.x - _local_xfB.q.s * this.m_localPoint.y) + _local_xfB.p.x;//b2Mul_t_v2(_local_xfB, this.m_localPoint);
                var pointBy = (_local_xfB.q.s * this.m_localPoint.x + _local_xfB.q.c * this.m_localPoint.y) + _local_xfB.p.y;

                var localPointA = this.m_proxyA.GetVertex(indexA);
                var pointAx = (_local_xfA.q.c * localPointA.x - _local_xfA.q.s * localPointA.y) + _local_xfA.p.x;//b2Mul_t_v2(_local_xfA, localPointA);
                var pointAy = (_local_xfA.q.s * localPointA.x + _local_xfA.q.c * localPointA.y) + _local_xfA.p.y;

                var separation = (pointAx - pointBx) * normalx + (pointAy - pointBy) * normaly;//b2Dot_v2_v2(b2Vec2.Subtract(pointA, pointB), normal);
                return separation;
            }


        default:
            b2Assert(false);
            return 0.0;

        }
    }
};

b2SeparationFunction.e_points = 0;
b2SeparationFunction.e_faceA = 1;
b2SeparationFunction.e_faceB = 2;

/// Compute the upper bound on time before two shapes penetrate. Time is represented as
/// a fraction between [0,tMax]. This uses a swept separating axis and may miss some intermediate,
/// non-tunneling collision. If you change the time interval, you should call this function
/// again.
/// Note: use b2Distance to compute the contact point and normal at the time of impact.
var profile_toi = b2Profiler.create("toi", "solveTOI");
function b2TimeOfImpact(output, input)
{
    profile_toi.start();

    ++b2TimeOfImpact.b2_toiCalls;

    output.state = b2TOIOutput.e_unknown;
    output.t = input.tMax;

    var proxyA = input.proxyA;
    var proxyB = input.proxyB;

    b2TimeOfImpact._temp_sweepA.Assign(input.sweepA);
    b2TimeOfImpact._temp_sweepB.Assign(input.sweepB);

    // Large rotations can make the root finder fail, so we normalize the
    // sweep angles.
    b2TimeOfImpact._temp_sweepA.Normalize();
    b2TimeOfImpact._temp_sweepB.Normalize();

    var tMax = input.tMax;

    var totalRadius = proxyA.m_radius + proxyB.m_radius;
    var target = b2Max(b2_linearSlop, totalRadius - 3.0 * b2_linearSlop);
    var tolerance = 0.25 * b2_linearSlop;

    b2Assert(target > tolerance);


    var t1 = 0.0;
    var k_maxIterations = 20;   // TODO_ERIN b2Settings
    var iter = 0;

    // Prepare input for distance query.
    var cache = new b2SimplexCache();
    cache.count = 0;
    var distanceInput = new b2DistanceInput();
    distanceInput.proxyA.Assign(input.proxyA);
    distanceInput.proxyB.Assign(input.proxyB);
    distanceInput.useRadii = false;

    // The outer loop progressively attempts to compute new separating axes.
    // This loop terminates when an axis is repeated (no progress is made).
    for(;;)
    {
        b2TimeOfImpact._temp_sweepA.GetTransform(distanceInput.transformA, t1);
        b2TimeOfImpact._temp_sweepB.GetTransform(distanceInput.transformB, t1);

        // Get the distance between shapes. We can also use the results
        // to get a separating axis.
        var distanceOutput = new b2DistanceOutput();
        b2DistanceFunc(distanceOutput, cache, distanceInput);

        // If the shapes are overlapped, we give up on continuous collision.
        if (distanceOutput.distance <= 0.0)
        {
            // Failure!
            output.state = b2TOIOutput.e_overlapped;
            output.t = 0.0;
            break;
        }

        if (distanceOutput.distance < target + tolerance)
        {
            // Victory!
            output.state = b2TOIOutput.e_touching;
            output.t = t1;
            break;
        }

        // Initialize the separating axis.
        var fcn = new b2SeparationFunction();
        fcn.Initialize(cache, proxyA, b2TimeOfImpact._temp_sweepA, proxyB, b2TimeOfImpact._temp_sweepB, t1);

        // Compute the TOI on the separating axis. We do this by successively
        // resolving the deepest point. This loop is bounded by the number of vertices.
        var done = false;
        var t2 = tMax;
        var pushBackIter = 0;
        for (;;)
        {
            // Find the deepest point at t2. Store the witness point indices.
            var indices = [];
            var s2 = fcn.FindMinSeparation(indices, t2);

            // Is the final configuration separated?
            if (s2 > target + tolerance)
            {
                // Victory!
                output.state = b2TOIOutput.e_separated;
                output.t = tMax;
                done = true;
                break;
            }

            // Has the separation reached tolerance?
            if (s2 > target - tolerance)
            {
                // Advance the sweeps
                t1 = t2;
                break;
            }

            // Compute the initial separation of the witness points.
            var s1 = fcn.Evaluate(indices[0], indices[1], t1);

            // Check for initial overlap. This might happen if the root finder
            // runs out of iterations.
            if (s1 < target - tolerance)
            {
                output.state = b2TOIOutput.e_failed;
                output.t = t1;
                done = true;
                break;
            }

            // Check for touching
            if (s1 <= target + tolerance)
            {
                // Victory! t1 should hold the TOI (could be 0.0).
                output.state = b2TOIOutput.e_touching;
                output.t = t1;
                done = true;
                break;
            }

            // Compute 1D root of: f(x) - target = 0
            var rootIterCount = 0;
            var a1 = t1, a2 = t2;
            for (;;)
            {
                // Use a mix of the secant rule and bisection.
                var t;
                if (rootIterCount & 1)
                {
                    // Secant rule to improve convergence.
                    t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                }
                else
                {
                    // Bisection to guarantee progress.
                    t = 0.5 * (a1 + a2);
                }

                ++rootIterCount;
                ++b2TimeOfImpact.b2_toiRootIters;

                var s = fcn.Evaluate(indices[0], indices[1], t);

                if (b2Abs(s - target) < tolerance)
                {
                    // t2 holds a tentative value for t1
                    t2 = t;
                    break;
                }

                // Ensure we continue to bracket the root.
                if (s > target)
                {
                    a1 = t;
                    s1 = s;
                }
                else
                {
                    a2 = t;
                    s2 = s;
                }

                if (rootIterCount == 50)
                {
                    break;
                }
            }

            b2TimeOfImpact.b2_toiMaxRootIters = b2Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);

            ++pushBackIter;

            if (pushBackIter == b2_maxPolygonVertices)
            {
                break;
            }
        }

        ++iter;
        ++b2TimeOfImpact.b2_toiIters;

        if (done)
        {
            break;
        }

        if (iter == k_maxIterations)
        {
            // Root finder got stuck. Semi-victory.
            output.state = b2TOIOutput.e_failed;
            output.t = t1;
            break;
        }
    }

    b2TimeOfImpact.b2_toiMaxIters = b2Max(b2TimeOfImpact.b2_toiMaxIters, iter);

    profile_toi.stop();
    b2TimeOfImpact.b2_toiMaxTime = b2Max(b2TimeOfImpact.b2_toiMaxTime, profile_toi.elapsedTime);
    b2TimeOfImpact.b2_toiTime += profile_toi.elapsedTime;
}

b2TimeOfImpact._temp_sweepA = new b2Sweep();
b2TimeOfImpact._temp_sweepB = new b2Sweep();

b2TimeOfImpact.b2_toiTime = 0;
b2TimeOfImpact.b2_toiMaxTime = 0;
b2TimeOfImpact.b2_toiCalls = 0;
b2TimeOfImpact.b2_toiIters = 0;
b2TimeOfImpact.b2_toiMaxIters = 0;
b2TimeOfImpact.b2_toiRootIters = 0;
b2TimeOfImpact.b2_toiMaxRootIters = 0;

/// A body definition holds all the data needed to construct a rigid body.
/// You can safely re-use body definitions. Shapes are added to a body after construction.
function b2BodyDef()
{
    /// The body type: static, kinematic, or dynamic.
    /// Note: if a dynamic body would have zero mass, the mass is set to one.
    this.type = b2Body.b2_staticBody;

    /// The world position of the body. Avoid creating bodies at the origin
    /// since this can lead to many overlapping shapes.
    this.position = new b2Vec2(0.0, 0.0);

    /// The world angle of the body in radians.
    this.angle = 0.0;

    /// The linear velocity of the body's origin in world co-ordinates.
    this.linearVelocity = new b2Vec2(0.0, 0.0);

    /// The angular velocity of the body.
    this.angularVelocity = 0.0;

    /// Linear damping is use to reduce the linear velocity. The damping parameter
    /// can be larger than 1.0 but the damping effect becomes sensitive to the
    /// time step when the damping parameter is large.
    this.linearDamping = 0.0;

    /// Angular damping is use to reduce the angular velocity. The damping parameter
    /// can be larger than 1.0 but the damping effect becomes sensitive to the
    /// time step when the damping parameter is large.
    this.angularDamping = 0.0;

    /// Set this flag to false if this body should never fall asleep. Note that
    /// this increases CPU usage.
    this.allowSleep = true;

    /// Is this body initially awake or sleeping?
    this.awake = true;

    /// Should this body be prevented from rotating? Useful for characters.
    this.fixedRotation = false;

    /// Is this a fast moving body that should be prevented from tunneling through
    /// other moving bodies? Note that all bodies are prevented from tunneling through
    /// kinematic and static bodies. This setting is only considered on dynamic bodies.
    /// @warning You should use this flag sparingly since it increases processing time.
    this.bullet = false;

    /// Does this body start out active?
    this.active = true;

    /// Use this to store application specific body data.
    this.userData = null;

    /// Scale the gravity applied to this body.
    this.gravityScale = 1.0;

    Object.seal(this);
}

b2BodyDef.prototype =
{
    _deserialize: function(data)
    {
        this.type = data['type'];
        this.position._deserialize(data['position']);
        this.angle = data['angle'];
        this.linearVelocity._deserialize(data['linearVelocity']);
        this.angularVelocity = data['angularVelocity'];
        this.linearDamping = data['linearDamping'];
        this.angularDamping = data['angularDamping'];
        this.allowSleep = data['allowSleep'];
        this.awake = data['awake'];
        this.fixedRotation = data['fixedRotation'];
        this.bullet = data['bullet'];
        this.active = data['active'];
        this.gravityScale = data['gravityScale'];
    }
};

function b2Body(bd, world)
{

    b2Assert(bd.position.IsValid());
    b2Assert(bd.linearVelocity.IsValid());
    b2Assert(b2IsValid(bd.angle));
    b2Assert(b2IsValid(bd.angularVelocity));
    b2Assert(b2IsValid(bd.angularDamping) && bd.angularDamping >= 0.0);
    b2Assert(b2IsValid(bd.linearDamping) && bd.linearDamping >= 0.0);


    this.m_islandIndex = 0;
    this.m_flags = 0;

    if (bd.bullet)
    {
        this.m_flags |= b2Body.e_bulletFlag;
    }
    if (bd.fixedRotation)
    {
        this.m_flags |= b2Body.e_fixedRotationFlag;
    }
    if (bd.allowSleep)
    {
        this.m_flags |= b2Body.e_autoSleepFlag;
    }
    if (bd.awake)
    {
        this.m_flags |= b2Body.e_awakeFlag;
    }
    if (bd.active)
    {
        this.m_flags |= b2Body.e_activeFlag;
    }

    this.m_world = world;

    this.m_xf = new b2Transform();
    this.m_xf.p.Assign(bd.position);
    this.m_xf.q.Set(bd.angle);


    this.m_sweep = new b2Sweep();
    this.m_sweep.localCenter.SetZero();
    this.m_sweep.c0.Assign(this.m_xf.p);
    this.m_sweep.c.Assign(this.m_xf.p);
    this.m_sweep.a0 = bd.angle;
    this.m_sweep.a = bd.angle;
    this.m_sweep.alpha0 = 0.0;

    this.m_jointList = null;
    this.m_contactList = null;
    this.m_prev = null;
    this.m_next = null;

    this.m_linearVelocity = bd.linearVelocity.Clone();
    this.m_angularVelocity = bd.angularVelocity;

    this.m_linearDamping = bd.linearDamping;
    this.m_angularDamping = bd.angularDamping;
    this.m_gravityScale = bd.gravityScale;

    this.m_force = new b2Vec2();
    this.m_torque = 0.0;

    this.m_sleepTime = 0.0;

    this.m_type = bd.type;

    if (this.m_type == b2Body.b2_dynamicBody)
    {
        this.m_mass = 1.0;
        this.m_invMass = 1.0;
    }
    else
    {
        this.m_mass = 0.0;
        this.m_invMass = 0.0;
    }

    this.m_I = 0.0;
    this.m_invI = 0.0;

    this.m_userData = bd.userData;

    this.m_fixtureList = null;
    this.m_fixtureCount = 0;
}

/// The body type.
/// static: zero mass, zero velocity, may be manually moved
/// kinematic: zero mass, non-zero velocity set by user, moved by solver
/// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
b2Body.b2_staticBody = 0;
b2Body.b2_kinematicBody = 1;
b2Body.b2_dynamicBody = 2;
    // TODO_ERIN
    //b2_bulletBody,

b2Body.e_islandFlag = 0x0001;
b2Body.e_awakeFlag = 0x0002;
b2Body.e_autoSleepFlag = 0x0004;
b2Body.e_bulletFlag = 0x0008;
b2Body.e_fixedRotationFlag = 0x0010;
b2Body.e_activeFlag = 0x0020;
b2Body.e_toiFlag = 0x0040;

b2Body.m_local_oldCenter = new b2Vec2();
b2Body.m_local_xf1 = new b2Transform();

/// A rigid body. These are created via b2World.CreateBody.
b2Body.prototype =
{
    /// Creates a fixture and attach it to this body. Use this function if you need
    /// to set some fixture parameters, like friction. Otherwise you can create the
    /// fixture directly from a shape.
    /// If the density is non-zero, this function automatically updates the mass of the body.
    /// Contacts are not created until the next time step.
    /// @param def the fixture definition.
    /// @warning This function is locked during callbacks.
    CreateFixture: function(def, density)
    {
        if (typeof(density) !== 'undefined')
        {
            var ndef = new b2FixtureDef();
            ndef.shape = def;
            ndef.density = density;

            return this.CreateFixture(ndef);
        }


        b2Assert(this.m_world.IsLocked() == false);

        if (this.m_world.IsLocked() == true)
        {
            return null;
        }

        var fixture = new b2Fixture();
        fixture.Create(this, def);

        if (this.m_flags & b2Body.e_activeFlag)
        {
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.CreateProxies(broadPhase, this.m_xf);
        }

        fixture.m_next = this.m_fixtureList;
        this.m_fixtureList = fixture;
        ++this.m_fixtureCount;

        fixture.m_body = this;

        // Adjust mass properties if needed.
        if (fixture.m_density > 0.0)
        {
            this.ResetMassData();
        }

        // Let the world know we have a new fixture. This will cause new contacts
        // to be created at the beginning of the next time step.
        this.m_world.m_flags |= b2World.e_newFixture;

        return fixture;
    },

    /// Destroy a fixture. This removes the fixture from the broad-phase and
    /// destroys all contacts associated with this fixture. This will
    /// automatically adjust the mass of the body if the body is dynamic and the
    /// fixture has positive density.
    /// All fixtures attached to a body are implicitly destroyed when the body is destroyed.
    /// @param fixture the fixture to be removed.
    /// @warning This function is locked during callbacks.
    DestroyFixture: function(fixture)
    {

        b2Assert(this.m_world.IsLocked() == false);

        if (this.m_world.IsLocked() == true)
        {
            return;
        }


        b2Assert(fixture.m_body == this);

        // Remove the fixture from this body's singly linked list.
        b2Assert(this.m_fixtureCount > 0);

        var node = this.m_fixtureList;
        var found = false;

        while (node != null)
        {
            if (node == fixture)
            {
                this.m_fixtureList = node = fixture.m_next;
                found = true;
                break;
            }

            node = node.m_next;
        }

        // You tried to remove a shape that is not attached to this body.

        b2Assert(found);


        // Destroy any contacts associated with the fixture.
        var edge = this.m_contactList;
        while (edge)
        {
            var c = edge.contact;
            edge = edge.next;

            var fixtureA = c.GetFixtureA();
            var fixtureB = c.GetFixtureB();

            if (fixture == fixtureA || fixture == fixtureB)
            {
                // This destroys the contact and removes it from
                // this body's contact list.
                this.m_world.m_contactManager.Destroy(c);
            }
        }

        if (this.m_flags & b2Body.e_activeFlag)
        {
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.DestroyProxies(broadPhase);
        }

        fixture.Destroy();
        fixture.m_body = null;
        fixture.m_next = null;

        --this.m_fixtureCount;

        // Reset the mass data.
        this.ResetMassData();
    },

    /// Set the position of the body's origin and rotation.
    /// Manipulating a body's transform may cause non-physical behavior.
    /// Note: contacts are updated on the next call to b2World.Step.
    /// @param position the world position of the body's local origin.
    /// @param angle the world rotation in radians.
    SetTransform: function(position, angle)
    {

        b2Assert(this.m_world.IsLocked() == false);

        if (this.m_world.IsLocked() == true)
        {
            return;
        }

        this.m_xf.q.Set(angle);
        this.m_xf.p.Assign(position);


        this.m_sweep.c.Assign(b2Mul_t_v2(this.m_xf, this.m_sweep.localCenter));
        this.m_sweep.a = angle;

        this.m_sweep.c0.Assign(this.m_sweep.c);
        this.m_sweep.a0 = angle;

        var broadPhase = this.m_world.m_contactManager.m_broadPhase;
        for (var f = this.m_fixtureList; f; f = f.m_next)
        {
            f.Synchronize(broadPhase, this.m_xf, this.m_xf);
        }
    },

    /// Get the body transform for the body's origin.
    /// @return the world transform of the body's origin.
    GetTransform: function()
    {
        return this.m_xf;
    },

    /// Get the world body origin position.
    /// @return the world position of the body's origin.
    GetPosition: function()
    {
        return this.m_xf.p;
    },

    /// Get the angle in radians.
    /// @return the current world rotation angle in radians.
    GetAngle: function()
    {
        return this.m_sweep.a;
    },

    /// Get the world position of the center of mass.
    GetWorldCenter: function()
    {
        return this.m_sweep.c;
    },

    /// Get the local position of the center of mass.
    GetLocalCenter: function()
    {
        return this.m_sweep.localCenter;
    },

    /// Set the linear velocity of the center of mass.
    /// @param v the new linear velocity of the center of mass.
    SetLinearVelocity: function(v)
    {
        if (this.m_type == b2Body.b2_staticBody)
        {
            return;
        }

        if (b2Dot_v2_v2(v, v) > 0.0)
        {
            this.SetAwake(true);
        }

        this.m_linearVelocity = v;
    },

    /// Get the linear velocity of the center of mass.
    /// @return the linear velocity of the center of mass.
    GetLinearVelocity: function()
    {
        return this.m_linearVelocity;
    },

    /// Set the angular velocity.
    /// @param omega the new angular velocity in radians/second.
    SetAngularVelocity: function(w)
    {
        if (this.m_type == b2Body.b2_staticBody)
        {
            return;
        }

        if (w * w > 0.0)
        {
            this.SetAwake(true);
        }

        this.m_angularVelocity = w;
    },

    /// Get the angular velocity.
    /// @return the angular velocity in radians/second.
    GetAngularVelocity: function()
    {
        return this.m_angularVelocity;
    },

    /// Apply a force at a world point. If the force is not
    /// applied at the center of mass, it will generate a torque and
    /// affect the angular velocity. This wakes up the body.
    /// @param force the world force vector, usually in Newtons (N).
    /// @param point the world position of the point of application.
    /// @param wake also wake up the body
    ApplyForce: function(force, point, wake)
    {
        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        if (wake && (this.m_flags & b2Body.e_awakeFlag) == 0)
        {
            this.SetAwake(true);
        }

        // Don't accumulate a force if the body is sleeping.
        if (this.m_flags & b2Body.e_awakeFlag)
        {
            this.m_force.Add(force);
            this.m_torque += b2Cross_v2_v2(b2Vec2.Subtract(point, this.m_sweep.c), force);
        }
    },

    /// Apply a force to the center of mass. This wakes up the body.
    /// @param force the world force vector, usually in Newtons (N).
    /// @param wake also wake up the body
    ApplyForceToCenter: function(force, wake)
    {
        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        if (wake && (this.m_flags & b2Body.e_awakeFlag) == 0)
        {
            this.SetAwake(true);
        }

        // Don't accumulate a force if the body is sleeping
        if (this.m_flags & b2Body.e_awakeFlag)
        {
            this.m_force.Add(force);
        }
    },

    /// Apply a torque. This affects the angular velocity
    /// without affecting the linear velocity of the center of mass.
    /// This wakes up the body.
    /// @param torque about the z-axis (out of the screen), usually in N-m.
    /// @param wake also wake up the body
    ApplyTorque: function(torque, wake)
    {
        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        if (wake && (this.m_flags & b2Body.e_awakeFlag) == 0)
        {
            this.SetAwake(true);
        }

        // Don't accumulate a force if the body is sleeping
        if (this.m_flags & b2Body.e_awakeFlag)
        {
            this.m_torque += torque;
        }
    },

    /// Apply an impulse at a point. This immediately modifies the velocity.
    /// It also modifies the angular velocity if the point of application
    /// is not at the center of mass. This wakes up the body.
    /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
    /// @param point the world position of the point of application.
    /// @param wake also wake up the body
    ApplyLinearImpulse: function(impulse, point, wake)
    {
        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        if (wake && (this.m_flags & b2Body.e_awakeFlag) == 0)
        {
            this.SetAwake(true);
        }

        // Don't accumulate velocity if the body is sleeping
        if (this.m_flags & b2Body.e_awakeFlag)
        {
            this.m_linearVelocity.Add(b2Vec2.Multiply(this.m_invMass, impulse));
            this.m_angularVelocity += this.m_invI * b2Cross_v2_v2(b2Vec2.Subtract(point, this.m_sweep.c), impulse);
        }
    },

    /// Apply an angular impulse.
    /// @param impulse the angular impulse in units of kg*m*m/s
    /// @param wake also wake up the body
    ApplyAngularImpulse: function(impulse, wake)
    {
        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        if (wake && (this.m_flags & b2Body.e_awakeFlag) == 0)
        {
            this.SetAwake(true);
        }

        // Don't accumulate velocity if the body is sleeping
        if (this.m_flags & b2Body.e_awakeFlag)
        {
            this.m_angularVelocity += this.m_invI * impulse;
        }
    },

    /// Get the total mass of the body.
    /// @return the mass, usually in kilograms (kg).
    GetMass: function()
    {
        return this.m_mass;
    },

    /// Get the rotational inertia of the body about the local origin.
    /// @return the rotational inertia, usually in kg-m^2.
    GetInertia: function()
    {
        return this.m_I + this.m_mass * b2Dot_v2_v2(this.m_sweep.localCenter, this.m_sweep.localCenter);
    },

    /// Get the mass data of the body.
    /// @return a struct containing the mass, inertia and center of the body.
    GetMassData: function(data)
    {
        data.mass = this.m_mass;
        data.I = this.m_I + this.m_mass * b2Dot_v2_v2(this.m_sweep.localCenter, this.m_sweep.localCenter);
        data.center = this.m_sweep.localCenter;
    },

    /// Set the mass properties to override the mass properties of the fixtures.
    /// Note that this changes the center of mass position.
    /// Note that creating or destroying fixtures can also alter the mass.
    /// This function has no effect if the body isn't dynamic.
    /// @param massData the mass properties.
    SetMassData: function(massData)
    {

        b2Assert(this.m_world.IsLocked() == false);

        if (this.m_world.IsLocked() == true)
        {
            return;
        }

        if (this.m_type != b2Body.b2_dynamicBody)
        {
            return;
        }

        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;

        this.m_mass = massData.mass;
        if (this.m_mass <= 0.0)
        {
            this.m_mass = 1.0;
        }

        this.m_invMass = 1.0 / this.m_mass;

        if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0)
        {
            this.m_I = massData.I - this.m_mass * b2Dot_v2_v2(massData.center, massData.center);

            b2Assert(this.m_I > 0.0);

            this.m_invI = 1.0 / this.m_I;
        }

        // Move center of mass.
        b2Body.m_local_oldCenter.Assign(this.m_sweep.c);
        this.m_sweep.localCenter.Assign(massData.center);
        this.m_sweep.c0.Assign(b2Mul_t_v2(this.m_xf, this.m_sweep.localCenter));
        this.m_sweep.c.Assign(this.m_sweep.c0);

        // Update center of mass velocity.
        this.m_linearVelocity.Add(b2Cross_f_v2(this.m_angularVelocity, b2Vec2.Subtract(this.m_sweep.c, b2Body.m_local_oldCenter)));
    },

    /// This resets the mass properties to the sum of the mass properties of the fixtures.
    /// This normally does not need to be called unless you called SetMassData to override
    /// the mass and you later want to reset the mass.
    ResetMassData: function()
    {
        // Compute mass data from shapes. Each shape has its own density.
        this.m_mass = 0.0;
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_sweep.localCenter.SetZero();

        // Static and kinematic bodies have zero mass.
        if (this.m_type == b2Body.b2_staticBody || this.m_type == b2Body.b2_kinematicBody)
        {
            this.m_sweep.c0.Assign(this.m_xf.p);
            this.m_sweep.c.Assign(this.m_xf.p);
            this.m_sweep.a0 = this.m_sweep.a;
            return;
        }


        b2Assert(this.m_type == b2Body.b2_dynamicBody);


        // Accumulate mass over all fixtures.
        var localCenter = new b2Vec2(0, 0);
        for (var f = this.m_fixtureList; f; f = f.m_next)
        {
            if (f.m_density == 0.0)
            {
                continue;
            }

            var massData = new b2MassData();
            f.GetMassData(massData);
            this.m_mass += massData.mass;
            localCenter.Add(b2Vec2.Multiply(massData.mass, massData.center));
            this.m_I += massData.I;
        }

        // Compute center of mass.
        if (this.m_mass > 0.0)
        {
            this.m_invMass = 1.0 / this.m_mass;
            localCenter.Multiply(this.m_invMass);
        }
        else
        {
            // Force all dynamic bodies to have a positive mass.
            this.m_mass = 1.0;
            this.m_invMass = 1.0;
        }

        if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0)
        {
            // Center the inertia about the center of mass.
            this.m_I -= this.m_mass * b2Dot_v2_v2(localCenter, localCenter);

            b2Assert(this.m_I > 0.0);

            this.m_invI = 1.0 / this.m_I;

        }
        else
        {
            this.m_I = 0.0;
            this.m_invI = 0.0;
        }

        // Move center of mass.
        b2Body.m_local_oldCenter.Assign(this.m_sweep.c);
        this.m_sweep.localCenter.Assign(localCenter);
        this.m_sweep.c0.Assign(b2Mul_t_v2(this.m_xf, this.m_sweep.localCenter));
        this.m_sweep.c.Assign(this.m_sweep.c0);

        // Update center of mass velocity.
        this.m_linearVelocity.Add(b2Cross_f_v2(this.m_angularVelocity, b2Vec2.Subtract(this.m_sweep.c, b2Body.m_local_oldCenter)));
    },

    /// Get the world coordinates of a point given the local coordinates.
    /// @param localPoint a point on the body measured relative the the body's origin.
    /// @return the same point expressed in world coordinates.
    GetWorldPoint: function(localPoint)
    {
        return b2Mul_t_v2(this.m_xf, localPoint);
    },

    /// Get the world coordinates of a vector given the local coordinates.
    /// @param localVector a vector fixed in the body.
    /// @return the same vector expressed in world coordinates.
    GetWorldVector: function(localVector)
    {
        return b2Mul_r_v2(this.m_xf.q, localVector);
    },

    /// Gets a local point relative to the body's origin given a world point.
    /// @param a point in world coordinates.
    /// @return the corresponding local point relative to the body's origin.
    GetLocalPoint: function(worldPoint)
    {
        return b2MulT_t_v2(this.m_xf, worldPoint);
    },

    /// Gets a local vector given a world vector.
    /// @param a vector in world coordinates.
    /// @return the corresponding local vector.
    GetLocalVector: function(worldVector)
    {
        return b2MulT_r_v2(this.m_xf.q, worldVector);
    },

    /// Get the world linear velocity of a world point attached to this body.
    /// @param a point in world coordinates.
    /// @return the world velocity of a point.
    GetLinearVelocityFromWorldPoint: function(worldPoint)
    {
        return b2Vec2.Add(this.m_linearVelocity, b2Cross_f_v2(this.m_angularVelocity, b2Vec2.Subtract(worldPoint, this.m_sweep.c)));
    },

    /// Get the world velocity of a local point.
    /// @param a point in local coordinates.
    /// @return the world velocity of a point.
    GetLinearVelocityFromLocalPoint: function(localPoint)
    {
        return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint));
    },

    /// Get the linear damping of the body.
    GetLinearDamping: function()
    {
        return this.m_linearDamping;
    },

    /// Set the linear damping of the body.
    SetLinearDamping: function(linearDamping)
    {
        this.m_linearDamping = linearDamping;
    },

    /// Get the angular damping of the body.
    GetAngularDamping: function()
    {
        return this.m_angularDamping;
    },

    /// Set the angular damping of the body.
    SetAngularDamping: function(angularDamping)
    {
        this.m_angularDamping = angularDamping;
    },

    /// Get the gravity scale of the body.
    GetGravityScale: function()
    {
        return this.m_gravityScale;
    },

    /// Set the gravity scale of the body.
    SetGravityScale: function(scale)
    {
        this.m_gravityScale = scale;
    },

    /// Set the type of this body. This may alter the mass and velocity.
    SetType: function(type)
    {

        b2Assert(this.m_world.IsLocked() == false);

        if (this.m_world.IsLocked() == true)
        {
            return;
        }

        if (this.m_type == type)
        {
            return;
        }

        this.m_type = type;

        this.ResetMassData();

        if (this.m_type == b2Body.b2_staticBody)
        {
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
            this.m_sweep.a0 = this.m_sweep.a;
            this.m_sweep.c0.Assign(this.m_sweep.c);
            this.SynchronizeFixtures();
        }

        this.SetAwake(true);

        this.m_force.SetZero();
        this.m_torque = 0.0;

        // Delete the attached contacts.
        var ce = this.m_contactList;
        while (ce)
        {
            var ce0 = ce;
            ce = ce.next;
            this.m_world.m_contactManager.Destroy(ce0.contact);
        }
        this.m_contactList = null;

        // Touch the proxies so that new contacts will be created (when appropriate)
        var broadPhase = this.m_world.m_contactManager.m_broadPhase;
        for (var f = this.m_fixtureList; f; f = f.m_next)
        {
            var proxyCount = f.m_proxyCount;
            for (var i = 0; i < proxyCount; ++i)
            {
                broadPhase.TouchProxy(f.m_proxies[i].proxyId);
            }
        }
    },

    /// Get the type of this body.
    GetType: function()
    {
        return this.m_type;
    },

    /// Should this body be treated like a bullet for continuous collision detection?
    SetBullet: function(flag)
    {
        if (flag)
        {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        else
        {
            this.m_flags &= ~b2Body.e_bulletFlag;
        }
    },

    /// Is this body treated like a bullet for continuous collision detection?
    IsBullet: function()
    {
        return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
    },

    /// You can disable sleeping on this body. If you disable sleeping, the
    /// body will be woken.
    SetSleepingAllowed: function(flag)
    {
        if (flag)
        {
            this.m_flags |= b2Body.e_autoSleepFlag;
        }
        else
        {
            this.m_flags &= ~b2Body.e_autoSleepFlag;
            this.SetAwake(true);
        }
    },

    /// Is this body allowed to sleep
    IsSleepingAllowed: function()
    {
        return (this.m_flags & b2Body.e_autoSleepFlag) == b2Body.e_autoSleepFlag;
    },

    /// Set the sleep state of the body. A sleeping body has very
    /// low CPU cost.
    /// @param flag set to true to wake the body, false to put it to sleep.
    SetAwake: function(flag)
    {
        if (flag)
        {
            if ((this.m_flags & b2Body.e_awakeFlag) == 0)
            {
                this.m_flags |= b2Body.e_awakeFlag;
                this.m_sleepTime = 0.0;
            }
        }
        else
        {
            this.m_flags &= ~b2Body.e_awakeFlag;
            this.m_sleepTime = 0.0;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
            this.m_force.SetZero();
            this.m_torque = 0.0;
        }
    },

    /// Get the sleeping state of this body.
    /// @return true if the body is awake.
    IsAwake: function()
    {
        return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
    },

    /// Set the active state of the body. An inactive body is not
    /// simulated and cannot be collided with or woken up.
    /// If you pass a flag of true, all fixtures will be added to the
    /// broad-phase.
    /// If you pass a flag of false, all fixtures will be removed from
    /// the broad-phase and all contacts will be destroyed.
    /// Fixtures and joints are otherwise unaffected. You may continue
    /// to create/destroy fixtures and joints on inactive bodies.
    /// Fixtures on an inactive body are implicitly inactive and will
    /// not participate in collisions, ray-casts, or queries.
    /// Joints connected to an inactive body are implicitly inactive.
    /// An inactive body is still owned by a b2World object and remains
    /// in the body list.
    SetActive: function(flag)
    {

        b2Assert(this.m_world.IsLocked() == false);


        if (flag == this.IsActive())
        {
            return;
        }

        if (flag)
        {
            this.m_flags |= b2Body.e_activeFlag;

            // Create all proxies.
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (var f = this.m_fixtureList; f; f = f.m_next)
            {
                f.CreateProxies(broadPhase, this.m_xf);
            }

            // Contacts are created the next time step.
        }
        else
        {
            this.m_flags &= ~b2Body.e_activeFlag;

            // Destroy all proxies.
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (var f = this.m_fixtureList; f; f = f.m_next)
            {
                f.DestroyProxies(broadPhase);
            }

            // Destroy the attached contacts.
            var ce = this.m_contactList;
            while (ce)
            {
                var ce0 = ce;
                ce = ce.next;
                this.m_world.m_contactManager.Destroy(ce0.contact);
            }
            this.m_contactList = null;
        }
    },

    /// Get the active state of the body.
    IsActive: function()
    {
        return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
    },

    /// Set this body to have fixed rotation. This causes the mass
    /// to be reset.
    SetFixedRotation: function(flag)
    {
        var status = (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
        if (status == flag)
        {
            return;
        }

        if (flag)
        {
            this.m_flags |= b2Body.e_fixedRotationFlag;
        }
        else
        {
            this.m_flags &= ~b2Body.e_fixedRotationFlag;
        }

        this.m_angularVelocity = 0.0;

        this.ResetMassData();
    },

    /// Does this body have fixed rotation?
    IsFixedRotation: function()
    {
        return (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
    },

    /// Get the list of all fixtures attached to this body.
    GetFixtureList: function()
    {
        return this.m_fixtureList;
    },

    /// Get the list of all joints attached to this body.
    GetJointList: function()
    {
        return this.m_jointList;
    },

    /// Get the list of all contacts attached to this body.
    /// @warning this list changes during the time step and you may
    /// miss some collisions if you don't use b2ContactListener.
    GetContactList: function()
    {
        return this.m_contactList;
    },

    /// Get the next body in the world's body list.
    GetNext: function()
    {
        return this.m_next;
    },

    /// Get the user data pointer that was provided in the body definition.
    GetUserData: function()
    {
        return this.m_userData;
    },

    /// Set the user data. Use this to store your application specific data.
    SetUserData: function(data)
    {
        this.m_userData = data;
    },

    /// Get the parent world of this body.
    GetWorld: function()
    {
        return this.m_world;
    },

    SynchronizeFixtures: function()
    {
        b2Body.m_local_xf1.q.Set(this.m_sweep.a0);
        b2Body.m_local_xf1.p.Assign(b2Vec2.Subtract(this.m_sweep.c0, b2Mul_r_v2(b2Body.m_local_xf1.q, this.m_sweep.localCenter)));

        var broadPhase = this.m_world.m_contactManager.m_broadPhase;
        for (var f = this.m_fixtureList; f; f = f.m_next)
        {
            f.Synchronize(broadPhase, b2Body.m_local_xf1, this.m_xf);
        }
    },
    SynchronizeTransform: function()
    {
        this.m_xf.q.Set(this.m_sweep.a);
        this.m_xf.p.Assign(b2Vec2.Subtract(this.m_sweep.c, b2Mul_r_v2(this.m_xf.q, this.m_sweep.localCenter)));
    },

    // This is used to prevent connected bodies from colliding.
    // It may lie, depending on the collideConnected flag.
    ShouldCollide: function(other)
    {
        // At least one body should be dynamic.
        if (this.m_type != b2Body.b2_dynamicBody && other.m_type != b2Body.b2_dynamicBody)
        {
            return false;
        }

        // Does a joint prevent collision?
        for (var jn = this.m_jointList; jn; jn = jn.next)
        {
            if (jn.other == other)
            {
                if (jn.joint.m_collideConnected == false)
                {
                    return false;
                }
            }
        }

        return true;
    },

    Advance: function(alpha)
    {
        // Advance to the new safe time. This doesn't sync the broad-phase.
        this.m_sweep.Advance(alpha);
        this.m_sweep.c.Assign(this.m_sweep.c0);
        this.m_sweep.a = this.m_sweep.a0;
        this.m_xf.q.Set(this.m_sweep.a);
        this.m_xf.p.Assign(b2Vec2.Subtract(this.m_sweep.c, b2Mul_r_v2(this.m_xf.q, this.m_sweep.localCenter)));
    },

    _serialize: function(out)
    {
        var obj = out || {};

        // this will be filled in later by the serializer
        obj['fixtures'] = null;
        obj['type'] = this.m_type;
        obj['position'] = this.GetPosition()._serialize();
        obj['angle'] = this.GetAngle();
        obj['linearVelocity'] = this.GetLinearVelocity()._serialize();
        obj['angularVelocity'] = this.GetAngularVelocity();
        obj['linearDamping'] = this.GetLinearDamping();
        obj['angularDamping'] = this.GetAngularDamping();
        obj['allowSleep'] = this.IsSleepingAllowed();
        obj['awake'] = this.IsAwake();
        obj['fixedRotation'] = this.IsFixedRotation();
        obj['bullet'] = this.IsBullet();
        obj['active'] = this.IsActive();
        obj['gravityScale'] = this.GetGravityScale();

        return obj;
    }
};

/// This holds contact filtering data.
function b2Filter()
{
    /// The collision category bits. Normally you would just set one bit.
    this.categoryBits = 0x0001;

    /// The collision mask bits. This states the categories that this
    /// shape would accept for collision.
    this.maskBits = 0xFFFF;

    /// Collision groups allow a certain group of objects to never collide (negative)
    /// or always collide (positive). Zero means no collision group. Non-zero group
    /// filtering always wins against the mask bits.
    this.groupIndex = 0;
}

b2Filter.prototype =
{
    Clone: function()
    {
        var filter = new b2Filter();
        filter.categoryBits = this.categoryBits;
        filter.maskBits = this.maskBits;
        filter.groupIndex = this.groupIndex;
        return filter;
    },

    Assign: function(filter)
    {
        this.categoryBits = filter.categoryBits;
        this.maskBits = filter.maskBits;
        this.groupIndex = filter.groupIndex;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        obj['categoryBits'] = this.categoryBits;
        obj['maskBits'] = this.maskBits;
        obj['groupIndex'] = this.groupIndex;

        return obj;
    },

    _deserialize: function(data)
    {
        this.categoryBits = data['categoryBits'];
        this.maskBits = data['maskBits'];
        this.groupIndex = data['groupIndex'];
    }
};

/// A fixture definition is used to create a fixture. This class defines an
/// abstract fixture definition. You can reuse fixture definitions safely.
function b2FixtureDef()
{
    /// The shape, this must be set. The shape will be cloned, so you
    /// can create the shape on the stack.
    this.shape = null;

    /// Use this to store application specific fixture data.
    this.userData = null;

    /// The friction coefficient, usually in the range [0,1].
    this.friction = 0.2;

    /// The restitution (elasticity) usually in the range [0,1].
    this.restitution = 0.0;

    /// The density, usually in kg/m^2.
    this.density = 0.0;

    /// A sensor shape collects contact information but never generates a collision
    /// response.
    this.isSensor = false;

    /// Contact filtering data.
    this.filter = new b2Filter();

    Object.seal(this);
}

b2FixtureDef.prototype =
{
    _deserialize: function(data)
    {
        this.friction = data['friction'];
        this.restitution = data['restitution'];
        this.density = data['density'];
        this.isSensor = data['isSensor'];
        this.filter._deserialize(data['filter']);
    }
};

/// This proxy is used internally to connect fixtures to the broad-phase.
function b2FixtureProxy()
{
    this.aabb = new b2AABB();
    this.fixture = null;
    this.childIndex = 0;
    this.proxyId = 0;
};

/// A fixture is used to attach a shape to a body for collision detection. A fixture
/// inherits its transform from its parent. Fixtures hold additional non-geometric data
/// such as friction, collision filters, etc.
/// Fixtures are created via b2Body::CreateFixture.
/// @warning you cannot reuse fixtures.
function b2Fixture()
{
    this.m_userData = null;
    this.m_body = null;
    this.m_next = null;
    this.m_proxies = null;
    this.m_proxyCount = 0;
    this.m_shape = null;
    this.m_density = 0.0;
    this.m_filter = new b2Filter();
    this.m_isSensor = false;
    this.m_friction = 0;
    this.m_restitution = 0;
}

b2Fixture.prototype =
{
    /// Get the type of the child shape. You can use this to down cast to the concrete shape.
    /// @return the shape type.
    GetType: function()
    {
        return this.m_shape.GetType();
    },

    /// Get the child shape. You can modify the child shape, however you should not change the
    /// number of vertices because this will crash some collision caching mechanisms.
    /// Manipulating the shape may lead to non-physical behavior.
    GetShape: function()
    {
        return this.m_shape;
    },

    /// Set if this fixture is a sensor.
    SetSensor: function(sensor)
    {
        if (sensor != this.m_isSensor)
        {
            this.m_body.SetAwake(true);
            this.m_isSensor = sensor;
        }
    },

    /// Is this fixture a sensor (non-solid)?
    /// @return the true if the shape is a sensor.
    IsSensor: function()
    {
        return this.m_isSensor;
    },

    /// Set the contact filtering data. This will not update contacts until the next time
    /// step when either parent body is active and awake.
    /// This automatically calls Refilter.
    SetFilterData: function(filter)
    {
        this.m_filter = filter;

        this.Refilter();
    },

    /// Get the contact filtering data.
    GetFilterData: function()
    {
        return this.m_filter;
    },

    /// Call this if you want to establish collision that was previously disabled by b2ContactFilter::ShouldCollide.
    Refilter: function()
    {
        if (this.m_body == null)
        {
            return;
        }

        // Flag associated contacts for filtering.
        var edge = this.m_body.GetContactList();
        while (edge)
        {
            var contact = edge.contact;
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (fixtureA == this || fixtureB == this)
            {
                contact.FlagForFiltering();
            }

            edge = edge.next;
        }

        var world = this.m_body.GetWorld();

        if (world == null)
        {
            return;
        }

        // Touch each proxy so that new pairs may be created
        var broadPhase = world.m_contactManager.m_broadPhase;
        for (var i = 0; i < this.m_proxyCount; ++i)
        {
            broadPhase.TouchProxy(this.m_proxies[i].proxyId);
        }
    },

    /// Get the parent body of this fixture. This is null if the fixture is not attached.
    /// @return the parent body.
    GetBody: function()
    {
        return this.m_body;
    },

    /// Get the next fixture in the parent body's fixture list.
    /// @return the next shape.
    GetNext: function()
    {
        return this.m_next;
    },

    /// Get the user data that was assigned in the fixture definition. Use this to
    /// store your application specific data.
    GetUserData: function()
    {
        return this.m_userData;
    },

    /// Set the user data. Use this to store your application specific data.
    SetUserData: function(data)
    {
        this.m_userData = data;
    },

    /// Test a point for containment in this fixture.
    /// @param p a point in world coordinates.
    TestPoint: function(p)
    {
        return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
    },

    /// Cast a ray against this shape.
    /// @param output the ray-cast results.
    /// @param input the ray-cast input parameters.
    RayCast: function(output, input, childIndex)
    {
        return this.m_shape.RayCast(output, input, this.m_body.GetTransform(), childIndex);
    },

    /// Get the mass data for this fixture. The mass data is based on the density and
    /// the shape. The rotational inertia is about the shape's origin. This operation
    /// may be expensive.
    GetMassData: function(massData)
    {
        this.m_shape.ComputeMass(massData, this.m_density);
    },

    /// Set the density of this fixture. This will _not_ automatically adjust the mass
    /// of the body. You must call b2Body::ResetMassData to update the body's mass.
    SetDensity: function(density)
    {

        b2Assert(b2IsValid(density) && density >= 0.0);

        this.m_density = density;
    },

    /// Get the density of this fixture.
    GetDensity: function()
    {
        return this.m_density;
    },

    /// Get the coefficient of friction.
    GetFriction: function()
    {
        return this.m_friction;
    },

    /// Set the coefficient of friction. This will _not_ change the friction of
    /// existing contacts.
    SetFriction: function(friction)
    {
        this.m_friction = friction;
    },

    /// Get the coefficient of restitution.
    GetRestitution: function()
    {
        return this.m_restitution;
    },

    /// Set the coefficient of restitution. This will _not_ change the restitution of
    /// existing contacts.
    SetRestitution: function(restitution)
    {
        this.m_restitution = restitution;
    },

    /// Get the fixture's AABB. This AABB may be enlarge and/or stale.
    /// If you need a more accurate AABB, compute it using the shape and
    /// the body transform.
    GetAABB: function(childIndex)
    {

        b2Assert(0 <= childIndex && childIndex < this.m_proxyCount);

        return this.m_proxies[childIndex].aabb;
    },

    // We need separation create/destroy functions from the constructor/destructor because
    // the destructor cannot access the allocator (no destructor arguments allowed by C++).
    Create: function(body, def)
    {
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;

        this.m_body = body;
        this.m_next = null;

        this.m_filter.Assign(def.filter);

        this.m_isSensor = def.isSensor;

        this.m_shape = def.shape.Clone();

        // Reserve proxy space
        var childCount = this.m_shape.GetChildCount();
        this.m_proxies = new Array(childCount);
        for (var i = 0; i < childCount; ++i)
        {
            this.m_proxies[i] = new b2FixtureProxy();
            this.m_proxies[i].fixture = null;
            this.m_proxies[i].proxyId = b2BroadPhase.e_nullProxy;
        }
        this.m_proxyCount = 0;

        this.m_density = def.density;
    },
    Destroy: function()
    {
        // The proxies must be destroyed before calling this.

        b2Assert(this.m_proxyCount == 0);


        // Free the proxy array.
        this.m_proxies = null;
        this.m_shape = null;
    },

    // These support body activation/deactivation.
    CreateProxies: function(broadPhase, xf)
    {

        b2Assert(this.m_proxyCount == 0);


        // Create proxies in the broad-phase.
        this.m_proxyCount = this.m_shape.GetChildCount();

        for (var i = 0; i < this.m_proxyCount; ++i)
        {
            var proxy = this.m_proxies[i];
            this.m_shape.ComputeAABB(proxy.aabb, xf, i);
            proxy.proxyId = broadPhase.CreateProxy(proxy.aabb, proxy);
            proxy.fixture = this;
            proxy.childIndex = i;
        }
    },
    DestroyProxies: function(broadPhase)
    {
        // Destroy proxies in the broad-phase.
        for (var i = 0; i < this.m_proxyCount; ++i)
        {
            var proxy = this.m_proxies[i];
            broadPhase.DestroyProxy(proxy.proxyId);
            proxy.proxyId = b2BroadPhase.e_nullProxy;
        }

        this.m_proxyCount = 0;
    },

    Synchronize: function(broadPhase, transform1, transform2)
    {
        if (this.m_proxyCount == 0)
        {
            return;
        }

        for (var i = 0; i < this.m_proxyCount; ++i)
        {
            var proxy = this.m_proxies[i];

            // Compute an AABB that covers the swept shape (may miss some rotation effect).
            var aabb1 = new b2AABB(), aabb2 = new b2AABB();
            this.m_shape.ComputeAABB(aabb1, transform1, proxy.childIndex);
            this.m_shape.ComputeAABB(aabb2, transform2, proxy.childIndex);

            proxy.aabb.Combine(aabb1, aabb2);

            var displacement = b2Vec2.Subtract(transform2.p, transform1.p);

            broadPhase.MoveProxy(proxy.proxyId, proxy.aabb, displacement);
        }
    },

//

    _serialize: function(out)
    {
        var obj = out || {};

        // this will be filled in later by the serializer
        obj['shape'] = null;
        obj['friction'] = this.m_friction;
        obj['restitution'] = this.m_restitution;
        obj['density'] = this.m_density;
        obj['isSensor'] = this.m_isSensor;
        obj['filter'] = this.m_filter._serialize();

        return obj;
    }
};

/// Joints and fixtures are destroyed when their associated
/// body is destroyed. Implement this listener so that you
/// may nullify references to these joints and shapes.
function b2DestructionListener()
{
}

b2DestructionListener.prototype =
{
    /// Called when any joint is about to be destroyed due
    /// to the destruction of one of its attached bodies.
    SayGoodbyeJoint: function(joint) { },

    /// Called when any fixture is about to be destroyed due
    /// to the destruction of its parent body.
    SayGoodbyeFixture: function(fixture) { }

//
};

/// Implement this class to provide collision filtering. In other words, you can implement
/// this class if you want finer control over contact creation.
function b2ContactFilter()
{
}

b2ContactFilter.prototype =
{
    /// Return true if contact calculations should be performed between these two shapes.
    /// @warning for performance reasons this is only called when the AABBs begin to overlap.
    ShouldCollide: function(fixtureA, fixtureB)
    {
        var filterA = fixtureA.GetFilterData();
        var filterB = fixtureB.GetFilterData();

        if (filterA.groupIndex == filterB.groupIndex && filterA.groupIndex != 0)
        {
            return filterA.groupIndex > 0;
        }

        var collide = (filterA.maskBits & filterB.categoryBits) != 0 && (filterA.categoryBits & filterB.maskBits) != 0;
        return collide;
    }
};

/// Contact impulses for reporting. Impulses are used instead of forces because
/// sub-step forces may approach infinity for rigid body collisions. These
/// match up one-to-one with the contact points in b2Manifold.
function b2ContactImpulse()
{
    this.normalImpulses = new Array(b2_maxManifoldPoints);
    this.tangentImpulses = new Array(b2_maxManifoldPoints);
    this.count = 0;
}


/// Implement this class to get contact information. You can use these results for
/// things like sounds and game logic. You can also get contact results by
/// traversing the contact lists after the time step. However, you might miss
/// some contacts because continuous physics leads to sub-stepping.
/// Additionally you may receive multiple callbacks for the same contact in a
/// single time step.
/// You should strive to make your callbacks efficient because there may be
/// many callbacks per time step.
/// @warning You cannot create/destroy Box2D entities inside these callbacks.
function b2ContactListener()
{
}

b2ContactListener.prototype =
{
    /// Called when two fixtures begin to touch.
    BeginContact: function(contact) { },

    /// Called when two fixtures cease to touch.
    EndContact: function(contact) { },

    /// This is called after a contact is updated. This allows you to inspect a
    /// contact before it goes to the solver. If you are careful, you can modify the
    /// contact manifold (e.g. disable contact).
    /// A copy of the old manifold is provided so that you can detect changes.
    /// Note: this is called only for awake bodies.
    /// Note: this is called even when the number of contact points is zero.
    /// Note: this is not called for sensors.
    /// Note: if you set the number of contact points to zero, you will not
    /// get an EndContact callback. However, you may get a BeginContact callback
    /// the next step.
    PreSolve: function(contact, oldManifold)
    {
    },

    /// This lets you inspect a contact after the solver is finished. This is useful
    /// for inspecting impulses.
    /// Note: the contact manifold does not include time of impact impulses, which can be
    /// arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
    /// in a separate data structure.
    /// Note: this is only called for contacts that are touching, solid, and awake.
    PostSolve: function(contact, impulse)
    {
    }
};

/// Callback class for AABB queries.
/// See b2World::Query
function b2QueryCallback()
{
}

b2QueryCallback.prototype =
{
    /// Called for each fixture found in the query AABB.
    /// @return false to terminate the query.
    ReportFixture: function(fixture) { return false; }

//
};

/// Callback class for ray casts.
/// See b2World::RayCast
function b2RayCastCallback()
{
}

b2RayCastCallback.prototype =
{
    /// Called for each fixture found in the query. You control how the ray cast
    /// proceeds by returning a float:
    /// return -1: ignore this fixture and continue
    /// return 0: terminate the ray cast
    /// return fraction: clip the ray to this point
    /// return 1: don't clip the ray and continue
    /// @param fixture the fixture hit by the ray
    /// @param point the point of initial intersection
    /// @param normal the normal vector at the point of intersection
    /// @return -1 to filter, 0 to terminate, fraction to clip the ray for
    /// closest hit, 1 to continue
    ReportFixture: function(fixture, point, normal, fraction) { }

//
};
/// This is an internal structure.
function b2TimeStep()
{
    this.dt = 0;            // time step
    this.inv_dt = 0;        // inverse time step (0 if dt == 0).
    this.dtRatio = 0;   // dt * inv_dt0
    this.velocityIterations = 0;
    this.positionIterations = 0;
    this.warmStarting = false;
}

/// This is an internal structure.
function b2Position()
{
    this.c = new b2Vec2();
    this.a = 0;
}

/// This is an internal structure.
function b2Velocity()
{
    this.v = new b2Vec2();
    this.w = 0;
}

/// Solver Data
function b2SolverData()
{
    this.step = new b2TimeStep();
    this.positions = null;
    this.velocities = null;
}
var profile_world_step = b2Profiler.create("step");
var profile_world_collide = b2Profiler.create("collide", "step");
var profile_world_solve = b2Profiler.create("solve", "step");
var profile_world_solveTOI = b2Profiler.create("solveTOI", "step");
var profile_world_broadphase = b2Profiler.create("broadphase", "step");

/// The world class manages all physics entities, dynamic simulation,
/// and asynchronous queries. The world also contains efficient memory
/// management facilities.
function b2World(gravity)
{
    this.m_contactManager = new b2ContactManager();

    this.m_destructionListener = null;
    this.g_debugDraw = null;

    this.m_bodyList = null;
    this.m_jointList = null;

    this.m_bodyCount = 0;
    this.m_jointCount = 0;

    this.m_warmStarting = true;
    this.m_continuousPhysics = true;
    this.m_subStepping = false;

    this.m_stepComplete = true;

    this.m_allowSleep = true;
    this.m_gravity = gravity;

    this.m_flags = b2World.e_clearForces;

    this.m_inv_dt0 = 0.0;
    this.p_step = new b2TimeStep();
    this.p_island = new b2Island();


}

function b2WorldQueryWrapper()
{
    this.broadPhase = null;
    this.callback = null;
}

b2WorldQueryWrapper.prototype =
{
    QueryCallback: function(proxyId)
    {
        var proxy = this.broadPhase.GetUserData(proxyId);
        return this.callback.ReportFixture(proxy.fixture);
    }
};

function b2WorldRayCastWrapper()
{
    this.broadPhase = null;
    this.callback = null;
}

b2WorldRayCastWrapper.prototype =
{
    RayCastCallback: function(input, proxyId)
    {
        var userData = this.broadPhase.GetUserData(proxyId);
        var proxy = userData;
        var fixture = proxy.fixture;
        var index = proxy.childIndex;
        var output = new b2RayCastOutput();
        var hit = fixture.RayCast(output, input, index);

        if (hit)
        {
            var fraction = output.fraction;
            var point = b2Vec2.Add(b2Vec2.Multiply((1.0 - fraction), input.p1), b2Vec2.Multiply(fraction, input.p2));
            return this.callback.ReportFixture(fixture, point, output.normal, fraction);
        }

        return input.maxFraction;
    }
};

b2World.m_local_sweep_backupA = new b2Sweep();
b2World.m_local_sweep_backupB = new b2Sweep();
b2World.m_local_sweep_backupC = new b2Sweep();

b2World.prototype =
{
    Destroy: function()
    {
        // Some shapes allocate using b2Alloc.
        var b = this.m_bodyList;
        while (b)
        {
            var bNext = b.m_next;

            var f = b.m_fixtureList;
            while (f)
            {
                var fNext = f.m_next;
                f.m_proxyCount = 0;
                f.Destroy();
                f = fNext;
            }

            b = bNext;
        }
    },

    /// Register a destruction listener. The listener is owned by you and must
    /// remain in scope.
    SetDestructionListener: function(listener)
    {
        this.m_destructionListener = listener;
    },

    /// Register a contact filter to provide specific control over collision.
    /// Otherwise the default filter is used (b2_defaultFilter). The listener is
    /// owned by you and must remain in scope.
    SetContactFilter: function(filter)
    {
        this.m_contactManager.m_contactFilter = filter;
    },

    /// Register a contact event listener. The listener is owned by you and must
    /// remain in scope.
    SetContactListener: function(listener)
    {
        this.m_contactManager.m_contactListener = listener;
    },

    /// Register a routine for debug drawing. The debug draw functions are called
    /// inside with b2World::DrawDebugData method. The debug draw object is owned
    /// by you and must remain in scope.
    SetDebugDraw: function(debugDraw)
    {
        this.g_debugDraw = debugDraw;
    },

    /// Create a rigid body given a definition. No reference to the definition
    /// is retained.
    /// @warning This function is locked during callbacks.
    CreateBody: function(def)
    {

        b2Assert(this.IsLocked() == false);

        if (this.IsLocked())
        {
            return null;
        }

        var b = new b2Body(def, this);

        // Add to world doubly linked list.
        b.m_prev = null;
        b.m_next = this.m_bodyList;
        if (this.m_bodyList)
        {
            this.m_bodyList.m_prev = b;
        }
        this.m_bodyList = b;
        ++this.m_bodyCount;

        return b;
    },

    /// Destroy a rigid body given a definition. No reference to the definition
    /// is retained. This function is locked during callbacks.
    /// @warning This automatically deletes all associated shapes and joints.
    /// @warning This function is locked during callbacks.
    DestroyBody: function(b)
    {

        b2Assert(this.m_bodyCount > 0);
        b2Assert(this.IsLocked() == false);

        if (this.IsLocked())
        {
            return;
        }

        // Delete the attached joints.
        var je = b.m_jointList;
        while (je)
        {
            var je0 = je;
            je = je.next;

            if (this.m_destructionListener)
            {
                this.m_destructionListener.SayGoodbyeJoint(je0.joint);
            }

            this.DestroyJoint(je0.joint);

            b.m_jointList = je;
        }
        b.m_jointList = null;

        // Delete the attached contacts.
        var ce = b.m_contactList;
        while (ce)
        {
            var ce0 = ce;
            ce = ce.next;
            this.m_contactManager.Destroy(ce0.contact);
        }
        b.m_contactList = null;

        // Delete the attached fixtures. This destroys broad-phase proxies.
        var f = b.m_fixtureList;
        while (f)
        {
            var f0 = f;
            f = f.m_next;

            if (this.m_destructionListener)
            {
                this.m_destructionListener.SayGoodbyeFixture(f0);
            }

            f0.DestroyProxies(this.m_contactManager.m_broadPhase);
            f0.Destroy();

            b.m_fixtureList = f;
            b.m_fixtureCount -= 1;
        }
        b.m_fixtureList = null;
        b.m_fixtureCount = 0;

        // Remove world body list.
        if (b.m_prev)
        {
            b.m_prev.m_next = b.m_next;
        }

        if (b.m_next)
        {
            b.m_next.m_prev = b.m_prev;
        }

        if (b == this.m_bodyList)
        {
            this.m_bodyList = b.m_next;
        }

        b.m_destroyed = true;

        --this.m_bodyCount;
    },

    /// Create a joint to constrain bodies together. No reference to the definition
    /// is retained. This may cause the connected bodies to cease colliding.
    /// @warning This function is locked during callbacks.
    CreateJoint: function(def)
    {

        b2Assert(this.IsLocked() == false);

        if (this.IsLocked())
        {
            return null;
        }

        var j = b2Joint.Create(def);

        // Connect to the world list.
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList)
        {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;

        // Connect to the bodies' doubly linked lists.
        j.m_edgeA.joint = j;
        j.m_edgeA.other = j.m_bodyB;
        j.m_edgeA.prev = null;
        j.m_edgeA.next = j.m_bodyA.m_jointList;
        if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
        j.m_bodyA.m_jointList = j.m_edgeA;

        j.m_edgeB.joint = j;
        j.m_edgeB.other = j.m_bodyA;
        j.m_edgeB.prev = null;
        j.m_edgeB.next = j.m_bodyB.m_jointList;
        if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
        j.m_bodyB.m_jointList = j.m_edgeB;

        var bodyA = def.bodyA;
        var bodyB = def.bodyB;

        // If the joint prevents collisions, then flag any contacts for filtering.
        if (def.collideConnected == false)
        {
            var edge = bodyB.GetContactList();
            while (edge)
            {
                if (edge.other == bodyA)
                {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }

                edge = edge.next;
            }
        }

        // Note: creating a joint doesn't wake the bodies.

        return j;
    },

    /// Destroy a joint. This may cause the connected bodies to begin colliding.
    /// @warning This function is locked during callbacks.
    DestroyJoint: function(j)
    {

        b2Assert(this.IsLocked() == false);

        if (this.IsLocked())
        {
            return;
        }

        var collideConnected = j.m_collideConnected;

        // Remove from the doubly linked list.
        if (j.m_prev)
        {
            j.m_prev.m_next = j.m_next;
        }

        if (j.m_next)
        {
            j.m_next.m_prev = j.m_prev;
        }

        if (j == this.m_jointList)
        {
            this.m_jointList = j.m_next;
        }

        // Disconnect from island graph.
        var bodyA = j.m_bodyA;
        var bodyB = j.m_bodyB;

        // Wake up connected bodies.
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);

        // Remove from body 1.
        if (j.m_edgeA.prev)
        {
            j.m_edgeA.prev.next = j.m_edgeA.next;
        }

        if (j.m_edgeA.next)
        {
            j.m_edgeA.next.prev = j.m_edgeA.prev;
        }

        if (j.m_edgeA == bodyA.m_jointList)
        {
            bodyA.m_jointList = j.m_edgeA.next;
        }

        j.m_edgeA.prev = null;
        j.m_edgeA.next = null;

        // Remove from body 2
        if (j.m_edgeB.prev)
        {
            j.m_edgeB.prev.next = j.m_edgeB.next;
        }

        if (j.m_edgeB.next)
        {
            j.m_edgeB.next.prev = j.m_edgeB.prev;
        }

        if (j.m_edgeB == bodyB.m_jointList)
        {
            bodyB.m_jointList = j.m_edgeB.next;
        }

        j.m_edgeB.prev = null;
        j.m_edgeB.next = null;

        b2Joint.Destroy(j);


        b2Assert(this.m_jointCount > 0);

        --this.m_jointCount;

        // If the joint prevents collisions, then flag any contacts for filtering.
        if (collideConnected == false)
        {
            var edge = bodyB.GetContactList();
            while (edge)
            {
                if (edge.other == bodyA)
                {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }

                edge = edge.next;
            }
        }
    },

    /// Take a time step. This performs collision detection, integration,
    /// and constraint solution.
    /// @param timeStep the amount of time to simulate, this should not vary.
    /// @param velocityIterations for the velocity constraint solver.
    /// @param positionIterations for the position constraint solver.
    Step: function(dt,
                velocityIterations,
                positionIterations)
    {
        profile_world_step.start();

        // If new fixtures were added, we need to find the new contacts.
        if (this.m_flags & b2World.e_newFixture)
        {
            this.m_contactManager.FindNewContacts();
            this.m_flags &= ~b2World.e_newFixture;
        }

        this.m_flags |= b2World.e_locked;

        this.p_step.dt = dt;
        this.p_step.velocityIterations= velocityIterations;
        this.p_step.positionIterations = positionIterations;
        if (dt > 0.0)
        {
            this.p_step.inv_dt = 1.0 / dt;
        }
        else
        {
            this.p_step.inv_dt = 0.0;
        }

        this.p_step.dtRatio = this.m_inv_dt0 * dt;

        this.p_step.warmStarting = this.m_warmStarting;

        // Update contacts. This is where some contacts are destroyed.
        {
            profile_world_collide.start();
            this.m_contactManager.Collide();
            profile_world_collide.stop();
        }

        // Integrate velocities, solve velocity constraints, and integrate positions.
        if (this.m_stepComplete && this.p_step.dt > 0.0)
        {
            profile_world_solve.start();

            this.Solve(this.p_step);
            profile_world_solve.stop();
        }

        // Handle TOI events.
        if (this.m_continuousPhysics && this.p_step.dt > 0.0)
        {
            profile_world_solveTOI.start();
            this.SolveTOI(this.p_step);
            profile_world_solveTOI.stop();
        }

        if (this.p_step.dt > 0.0)
        {
            this.m_inv_dt0 = this.p_step.inv_dt;
        }

        if (this.m_flags & b2World.e_clearForces)
        {
            this.ClearForces();
        }

        this.m_flags &= ~b2World.e_locked;

        profile_world_step.stop();
    },

    /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
    /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
    /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
    /// a fixed sized time step under a variable frame-rate.
    /// When you perform sub-stepping you will disable auto clearing of forces and instead call
    /// ClearForces after all sub-steps are complete in one pass of your game loop.
    /// @see SetAutoClearForces
    ClearForces: function()
    {
        for (var body = this.m_bodyList; body; body = body.GetNext())
        {
            body.m_force.x = body.m_force.y = 0;
            body.m_torque = 0.0;
        }
    },

    /// Call this to draw shapes and other debug draw data. This is intentionally non-const.
    DrawDebugData: function()
    {
        if (this.g_debugDraw == null)
        {
            return;
        }

        this.g_debugDraw.ClearDraw();

        var flags = this.g_debugDraw.GetFlags();

        if (flags & b2Draw.e_shapeBit)
        {
            for (var b = this.m_bodyList; b; b = b.GetNext())
            {
                var xf = b.GetTransform();
                for (var f = b.GetFixtureList(); f; f = f.GetNext())
                {
                    if (b.IsActive() == false)
                    {
                        this.DrawShape(f, xf, new b2Color(0.5, 0.5, 0.3));
                    }
                    else if (b.GetType() == b2Body.b2_staticBody)
                    {
                        this.DrawShape(f, xf, new b2Color(0.5, 0.9, 0.5));
                    }
                    else if (b.GetType() == b2Body.b2_kinematicBody)
                    {
                        this.DrawShape(f, xf, new b2Color(0.5, 0.5, 0.9));
                    }
                    else if (b.IsAwake() == false)
                    {
                        this.DrawShape(f, xf, new b2Color(0.6, 0.6, 0.6));
                    }
                    else
                    {
                        this.DrawShape(f, xf, new b2Color(0.9, 0.7, 0.7));
                    }
                }
            }

        }

        if (flags & b2Draw.e_jointBit)
        {
            for (var j = this.m_jointList; j; j = j.GetNext())
            {
                this.DrawJoint(j);
            }
        }

        if (flags & b2Draw.e_pairBit)
        {
            var color = new b2Color(0.3, 0.9, 0.9);

            for (var c = this.m_contactManager.m_contactList; c; c = c.GetNext())
            {
                var fixtureA = c.GetFixtureA();
                var fixtureB = c.GetFixtureB();

                var cA = fixtureA.GetAABB(c.GetChildIndexA()).GetCenter();
                var cB = fixtureB.GetAABB(c.GetChildIndexB()).GetCenter();

                this.g_debugDraw.DrawSegment(cA, cB, color);
            }
        }

        if (flags & b2Draw.e_aabbBit)
        {
            var color = new b2Color(0.9, 0.3, 0.9);
            var color2 = new b2Color(0.3, 0.3, 0.9);
            var bp = this.m_contactManager.m_broadPhase;

            for (var b = this.m_bodyList; b; b = b.GetNext())
            {
                if (b.IsActive() == false)
                {
                    continue;
                }

                for (var f = b.GetFixtureList(); f; f = f.GetNext())
                {
                    for (var i = 0; i < f.m_proxyCount; ++i)
                    {
                        var proxy = f.m_proxies[i];
                        var aabb = bp.GetFatAABB(proxy.proxyId);
                        var vs = [];
                        vs[0] = new b2Vec2(aabb.lowerBound.x, aabb.lowerBound.y);
                        vs[1] = new b2Vec2(aabb.upperBound.x, aabb.lowerBound.y);
                        vs[2] = new b2Vec2(aabb.upperBound.x, aabb.upperBound.y);
                        vs[3] = new b2Vec2(aabb.lowerBound.x, aabb.upperBound.y);

                        this.g_debugDraw.DrawPolygon(vs, 4, color);

                        var realAABB = new b2AABB();
                        f.GetShape().ComputeAABB(realAABB, b.GetTransform(), 0);
                        var vs = [];
                        vs[0] = new b2Vec2(realAABB.lowerBound.x, realAABB.lowerBound.y);
                        vs[1] = new b2Vec2(realAABB.upperBound.x, realAABB.lowerBound.y);
                        vs[2] = new b2Vec2(realAABB.upperBound.x, realAABB.upperBound.y);
                        vs[3] = new b2Vec2(realAABB.lowerBound.x, realAABB.upperBound.y);

                        this.g_debugDraw.DrawPolygon(vs, 4, color2);
                    }
                }
            }
        }

        if (flags & b2Draw.e_centerOfMassBit)
        {
            for (var b = this.m_bodyList; b; b = b.GetNext())
            {
                var xf = b.GetTransform().Clone();
                xf.p = b.GetWorldCenter();
                this.g_debugDraw.DrawTransform(xf);
            }
        }
    },

    /// Query the world for all fixtures that potentially overlap the
    /// provided AABB.
    /// @param callback a user implemented callback class.
    /// @param aabb the query box.
    QueryAABB: function(callback, aabb)
    {
        var wrapper = new b2WorldQueryWrapper();
        wrapper.broadPhase = this.m_contactManager.m_broadPhase;
        wrapper.callback = callback;
        this.m_contactManager.m_broadPhase.Query(wrapper, aabb);

    },

    /// Ray-cast the world for all fixtures in the path of the ray. Your callback
    /// controls whether you get the closest point, any point, or n-points.
    /// The ray-cast ignores shapes that contain the starting point.
    /// @param callback a user implemented callback class.
    /// @param point1 the ray starting point
    /// @param point2 the ray ending point
    RayCast: function(callback, point1, point2)
    {
        var wrapper = new b2WorldRayCastWrapper();
        wrapper.broadPhase = this.m_contactManager.m_broadPhase;
        wrapper.callback = callback;
        var input = new b2RayCastInput();
        input.maxFraction = 1.0;
        input.p1 = point1;
        input.p2 = point2;
        this.m_contactManager.m_broadPhase.RayCast(wrapper, input);

    },

    /// Get the world body list. With the returned body, use b2Body::GetNext to get
    /// the next body in the world list. A null body indicates the end of the list.
    /** @returns {b2Body} the head of the world body list. */
    GetBodyList: function()
    {
        return this.m_bodyList;
    },

    /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
    /// the next joint in the world list. A null joint indicates the end of the list.
    /// @return the head of the world joint list.
    GetJointList: function()
    {
        return this.m_jointList;
    },

    /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
    /// the next contact in the world list. A null contact indicates the end of the list.
    /// @return the head of the world contact list.
    /// @warning contacts are created and destroyed in the middle of a time step.
    /// Use b2ContactListener to avoid missing contacts.
    GetContactList: function()
    {
        return this.m_contactManager.m_contactList;
    },

    /// Enable/disable sleep.
    SetAllowSleeping: function(flag)
    {
        if (flag == this.m_allowSleep)
        {
            return;
        }

        this.m_allowSleep = flag;
        if (this.m_allowSleep == false)
        {
            for (var b = this.m_bodyList; b; b = b.m_next)
            {
                b.SetAwake(true);
            }
        }
    },
    GetAllowSleeping: function() { return this.m_allowSleep; },

    /// Enable/disable warm starting. For testing.
    SetWarmStarting: function(flag) { this.m_warmStarting = flag; },
    GetWarmStarting: function() { return this.m_warmStarting; },

    /// Enable/disable continuous physics. For testing.
    SetContinuousPhysics: function(flag) { this.m_continuousPhysics = flag; },
    GetContinuousPhysics: function() { return this.m_continuousPhysics; },

    /// Enable/disable single stepped continuous physics. For testing.
    SetSubStepping: function(flag) { this.m_subStepping = flag; },
    GetSubStepping: function() { return this.m_subStepping; },

    /// Get the number of broad-phase proxies.
    GetProxyCount: function()
    {
        return this.m_contactManager.m_broadPhase.GetProxyCount();
    },

    /// Get the number of bodies.
    GetBodyCount: function()
    {
        return this.m_bodyCount;
    },

    /// Get the number of joints.
    GetJointCount: function()
    {
        return this.m_jointCount;
    },

    /// Get the number of contacts (each may have 0 or more contact points).
    GetContactCount: function()
    {
        return this.m_contactManager.m_contactCount;
    },

    /// Get the height of the dynamic tree.
    GetTreeHeight: function()
    {
        return this.m_contactManager.m_broadPhase.GetTreeHeight();
    },

    /// Get the balance of the dynamic tree.
    GetTreeBalance: function()
    {
        return this.m_contactManager.m_broadPhase.GetTreeBalance();
    },

    /// Get the quality metric of the dynamic tree. The smaller the better.
    /// The minimum is 1.
    GetTreeQuality: function()
    {
        return this.m_contactManager.m_broadPhase.GetTreeQuality();
    },

    /// Change the global gravity vector.
    SetGravity: function(gravity)
    {
        this.m_gravity = gravity;
    },

    /// Get the global gravity vector.
    GetGravity: function()
    {
        return this.m_gravity;
    },

    /// Is the world locked (in the middle of a time step).
    IsLocked: function()
    {
        return (this.m_flags & b2World.e_locked) == b2World.e_locked;
    },

    /// Set flag to control automatic clearing of forces after each time step.
    SetAutoClearForces: function(flag)
    {
        if (flag)
        {
            this.m_flags |= b2World.e_clearForces;
        }
        else
        {
            this.m_flags &= ~b2World.e_clearForces;
        }
    },

    /// Get the flag that controls automatic clearing of forces after each time step.
    GetAutoClearForces: function()
    {
        return (this.m_flags & b2World.e_clearForces) == b2World.e_clearForces;
    },

    /// Shift the world origin. Useful for large worlds.
    /// The body shift formula is: position -= newOrigin
    /// @param newOrigin the new origin with respect to the old origin
    ShiftOrigin: function(newOrigin)
    {

        b2Assert((this.m_flags & b2World.e_locked) == 0);

        if ((this.m_flags & b2World.e_locked) == b2World.e_locked)
        {
            return;
        }

        for (var b = this.m_bodyList; b; b = b.m_next)
        {
            b.m_xf.p.Subtract(newOrigin);
            b.m_sweep.c0.Subtract(newOrigin);
            b.m_sweep.c.Subtract(newOrigin);
        }

        for (var j = this.m_jointList; j; j = j.m_next)
        {
            j.ShiftOrigin(newOrigin);
        }

        this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
    },

    /// Get the contact manager for testing.
    GetContactManager: function()
    {
        return this.m_contactManager;
    },

    Solve: function(step)
    {


        // Size the island for the worst case.
        this.p_island.Initialize(this.m_bodyCount,
                        this.m_contactManager.m_contactCount,
                        this.m_jointCount,
                        this.m_contactManager.m_contactListener);

        // Clear all the island flags.
        for (var b = this.m_bodyList; b; b = b.m_next)
        {
            b.m_flags &= ~b2Body.e_islandFlag;
        }
        for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
        {
            c.m_flags &= ~b2Contact.e_islandFlag;
        }
        for (var j = this.m_jointList; j; j = j.m_next)
        {
            j.m_islandFlag = false;
        }

        // Build and simulate all awake islands.
        var stackSize = this.m_bodyCount;
        var stack = new Array(stackSize);
        for (var seed = this.m_bodyList; seed; seed = seed.m_next)
        {
            if (seed.m_flags & b2Body.e_islandFlag)
            {
                continue;
            }

            if (seed.IsAwake() == false || seed.IsActive() == false)
            {
                continue;
            }

            // The seed can be dynamic or kinematic.
            if (seed.GetType() == b2Body.b2_staticBody)
            {
                continue;
            }

            // Reset island and stack.
            this.p_island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;

            // Perform a depth first search (DFS) on the constraint graph.
            while (stackCount > 0)
            {
                // Grab the next body off the stack and add it to the island.
                var b = stack[--stackCount];

                b2Assert(b.IsActive() == true);

                this.p_island.AddBody(b);

                // Make sure the body is awake.
                b.SetAwake(true);

                // To keep islands as small as possible, we don't
                // propagate islands across static bodies.
                if (b.GetType() == b2Body.b2_staticBody)
                {
                    continue;
                }

                // Search all contacts connected to this body.
                for (var ce = b.m_contactList; ce; ce = ce.next)
                {
                    var contact = ce.contact;

                    // Has this contact already been added to an island?
                    if (contact.m_flags & b2Contact.e_islandFlag)
                    {
                        continue;
                    }

                    // Is this contact solid and touching?
                    if (contact.IsEnabled() == false ||
                        contact.IsTouching() == false)
                    {
                        continue;
                    }

                    // Skip sensors.
                    var sensorA = contact.m_fixtureA.m_isSensor;
                    var sensorB = contact.m_fixtureB.m_isSensor;
                    if (sensorA || sensorB)
                    {
                        continue;
                    }

                    this.p_island.AddContact(contact);
                    contact.m_flags |= b2Contact.e_islandFlag;

                    var other = ce.other;

                    // Was the other body already added to this island?
                    if (other.m_flags & b2Body.e_islandFlag)
                    {
                        continue;
                    }


                    b2Assert(stackCount < stackSize);

                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }

                // Search all joints connect to this body.
                for (var je = b.m_jointList; je; je = je.next)
                {
                    if (je.joint.m_islandFlag == true)
                    {
                        continue;
                    }

                    var other = je.other;

                    // Don't simulate joints connected to inactive bodies.
                    if (other.IsActive() == false)
                    {
                        continue;
                    }

                    this.p_island.AddJoint(je.joint);
                    je.joint.m_islandFlag = true;

                    if (other.m_flags & b2Body.e_islandFlag)
                    {
                        continue;
                    }


                    b2Assert(stackCount < stackSize);

                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }

            this.p_island.Solve(step, this.m_gravity, this.m_allowSleep);

            // Post solve cleanup.
            for (var i = 0; i < this.p_island.m_bodyCount; ++i)
            {
                // Allow static bodies to participate in other islands.
                var b = this.p_island.m_bodies[i];
                if (b.GetType() == b2Body.b2_staticBody)
                {
                    b.m_flags &= ~b2Body.e_islandFlag;
                }
            }
        }

        {
            profile_world_broadphase.start();
            // Synchronize fixtures, check for out of range bodies.
            for (var b = this.m_bodyList; b; b = b.GetNext())
            {
                // If a body was not in an island then it did not move.
                if ((b.m_flags & b2Body.e_islandFlag) == 0)
                {
                    continue;
                }

                if (b.GetType() == b2Body.b2_staticBody)
                {
                    continue;
                }

                // Update fixtures (for broad-phase).
                b.SynchronizeFixtures();
            }

            // Look for new contacts.
            this.m_contactManager.FindNewContacts();
            profile_world_broadphase.stop();
        }
    },
    SolveTOI: function(step)
    {
        this.p_island.Initialize(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, this.m_contactManager.m_contactListener);

        if (this.m_stepComplete)
        {
            for (var b = this.m_bodyList; b; b = b.m_next)
            {
                b.m_flags &= ~b2Body.e_islandFlag;
                b.m_sweep.alpha0 = 0.0;
            }

            for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
            {
                // Invalidate TOI
                c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
                c.m_toiCount = 0;
                c.m_toi = 1.0;
            }
        }

        // Find TOI events and solve them.
        for (;;)
        {
            // Find the first TOI.
            var minContact = null;
            var minAlpha = 1.0;

            for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
            {
                // Is this contact disabled?
                if (c.IsEnabled() == false)
                {
                    continue;
                }

                // Prevent excessive sub-stepping.
                if (c.m_toiCount > b2_maxSubSteps)
                {
                    continue;
                }

                var alpha = 1.0;
                if (c.m_flags & b2Contact.e_toiFlag)
                {
                    // This contact has a valid cached TOI.
                    alpha = c.m_toi;
                }
                else
                {
                    var fA = c.GetFixtureA();
                    var fB = c.GetFixtureB();

                    // Is there a sensor?
                    if (fA.IsSensor() || fB.IsSensor())
                    {
                        continue;
                    }

                    var bA = fA.GetBody();
                    var bB = fB.GetBody();

                    var typeA = bA.m_type;
                    var typeB = bB.m_type;

                    b2Assert(typeA == b2Body.b2_dynamicBody || typeB == b2Body.b2_dynamicBody);


                    var activeA = bA.IsAwake() && typeA != b2Body.b2_staticBody;
                    var activeB = bB.IsAwake() && typeB != b2Body.b2_staticBody;

                    // Is at least one body active (awake and dynamic or kinematic)?
                    if (activeA == false && activeB == false)
                    {
                        continue;
                    }

                    var collideA = bA.IsBullet() || typeA != b2Body.b2_dynamicBody;
                    var collideB = bB.IsBullet() || typeB != b2Body.b2_dynamicBody;

                    // Are these two non-bullet dynamic bodies?
                    if (collideA == false && collideB == false)
                    {
                        continue;
                    }

                    // Compute the TOI for this contact.
                    // Put the sweeps onto the same time interval.
                    var alpha0 = bA.m_sweep.alpha0;

                    if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0)
                    {
                        alpha0 = bB.m_sweep.alpha0;
                        bA.m_sweep.Advance(alpha0);
                    }
                    else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0)
                    {
                        alpha0 = bA.m_sweep.alpha0;
                        bB.m_sweep.Advance(alpha0);
                    }


                    b2Assert(alpha0 < 1.0);


                    var indexA = c.GetChildIndexA();
                    var indexB = c.GetChildIndexB();

                    // Compute the time of impact in interval [0, minTOI]
                    var input = new b2TOIInput();
                    input.proxyA.Set(fA.GetShape(), indexA);
                    input.proxyB.Set(fB.GetShape(), indexB);
                    input.sweepA.Assign(bA.m_sweep);
                    input.sweepB.Assign(bB.m_sweep);
                    input.tMax = 1.0;

                    var output = new b2TOIOutput();
                    b2TimeOfImpact(output, input);

                    // Beta is the fraction of the remaining portion of the .
                    var beta = output.t;
                    if (output.state == b2TOIOutput.e_touching)
                    {
                        alpha = b2Min(alpha0 + (1.0 - alpha0) * beta, 1.0);
                    }
                    else
                    {
                        alpha = 1.0;
                    }

                    c.m_toi = alpha;
                    c.m_flags |= b2Contact.e_toiFlag;
                }

                if (alpha < minAlpha)
                {
                    // This is the minimum TOI found so far.
                    minContact = c;
                    minAlpha = alpha;
                }
            }

            if (minContact == null || 1.0 - 10.0 * b2_epsilon < minAlpha)
            {
                // No more TOI events. Done!
                this.m_stepComplete = true;
                break;
            }

            // Advance the bodies to the TOI.
            var fA = minContact.GetFixtureA();
            var fB = minContact.GetFixtureB();
            var bA = fA.GetBody();
            var bB = fB.GetBody();

            b2World.m_local_sweep_backupA.Assign(bA.m_sweep);
            b2World.m_local_sweep_backupB.Assign(bB.m_sweep);

            bA.Advance(minAlpha);
            bB.Advance(minAlpha);

            // The TOI contact likely has some new contact points.
            minContact.Update(this.m_contactManager.m_contactListener);
            minContact.m_flags &= ~b2Contact.e_toiFlag;
            ++minContact.m_toiCount;

            // Is the contact solid?
            if (minContact.IsEnabled() == false || minContact.IsTouching() == false)
            {
                // Restore the sweeps.
                minContact.SetEnabled(false);
                bA.m_sweep.Assign(b2World.m_local_sweep_backupA);
                bB.m_sweep.Assign(b2World.m_local_sweep_backupB);
                bA.SynchronizeTransform();
                bB.SynchronizeTransform();
                continue;
            }

            bA.SetAwake(true);
            bB.SetAwake(true);

            // Build the island
            this.p_island.Clear();
            this.p_island.AddBody(bA);
            this.p_island.AddBody(bB);
            this.p_island.AddContact(minContact);

            bA.m_flags |= b2Body.e_islandFlag;
            bB.m_flags |= b2Body.e_islandFlag;
            minContact.m_flags |= b2Contact.e_islandFlag;

            // Get contacts on bodyA and bodyB.
            var bodies = [bA, bB];
            for (var i = 0; i < 2; ++i)
            {
                var body = bodies[i];
                if (body.m_type == b2Body.b2_dynamicBody)
                {
                    for (var ce = body.m_contactList; ce; ce = ce.next)
                    {
                        if (this.p_island.m_bodyCount == this.p_island.m_bodyCapacity)
                        {
                            break;
                        }

                        if (this.p_island.m_contactCount == this.p_island.m_contactCapacity)
                        {
                            break;
                        }

                        var contact = ce.contact;

                        // Has this contact already been added to the island?
                        if (contact.m_flags & b2Contact.e_islandFlag)
                        {
                            continue;
                        }

                        // Only add static, kinematic, or bullet bodies.
                        var other = ce.other;
                        if (other.m_type == b2Body.b2_dynamicBody &&
                            body.IsBullet() == false && other.IsBullet() == false)
                        {
                            continue;
                        }

                        // Skip sensors.
                        var sensorA = contact.m_fixtureA.m_isSensor;
                        var sensorB = contact.m_fixtureB.m_isSensor;
                        if (sensorA || sensorB)
                        {
                            continue;
                        }

                        // Tentatively advance the body to the TOI.
                        b2World.m_local_sweep_backupC.Assign(other.m_sweep);
                        if ((other.m_flags & b2Body.e_islandFlag) == 0)
                        {
                            other.Advance(minAlpha);
                        }

                        // Update the contact points
                        contact.Update(this.m_contactManager.m_contactListener);

                        // Was the contact disabled by the user?
                        if (contact.IsEnabled() == false)
                        {
                            other.m_sweep.Assign(b2World.m_local_sweep_backupC);
                            other.SynchronizeTransform();
                            continue;
                        }

                        // Are there contact points?
                        if (contact.IsTouching() == false)
                        {
                            other.m_sweep.Assign(b2World.m_local_sweep_backupC);
                            other.SynchronizeTransform();
                            continue;
                        }

                        // Add the contact to the island
                        contact.m_flags |= b2Contact.e_islandFlag;
                        this.p_island.AddContact(contact);

                        // Has the other body already been added to the island?
                        if (other.m_flags & b2Body.e_islandFlag)
                        {
                            continue;
                        }

                        // Add the other body to the island.
                        other.m_flags |= b2Body.e_islandFlag;

                        if (other.m_type != b2Body.b2_staticBody)
                        {
                            other.SetAwake(true);
                        }

                        this.p_island.AddBody(other);
                    }
                }
            }

            var subStep = new b2TimeStep();
            subStep.dt = (1.0 - minAlpha) * step.dt;
            subStep.inv_dt = 1.0 / subStep.dt;
            subStep.dtRatio = 1.0;
            subStep.positionIterations = 20;
            subStep.velocityIterations = step.velocityIterations;
            subStep.warmStarting = false;
            this.p_island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);

            // Reset island flags and synchronize broad-phase proxies.
            for (var i = 0; i < this.p_island.m_bodyCount; ++i)
            {
                var body = this.p_island.m_bodies[i];
                body.m_flags &= ~b2Body.e_islandFlag;

                if (body.m_type != b2Body.b2_dynamicBody)
                {
                    continue;
                }

                body.SynchronizeFixtures();

                // Invalidate all contact TOIs on this displaced body.
                for (var ce = body.m_contactList; ce; ce = ce.next)
                {
                    ce.contact.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
                }
            }

            // Commit fixture proxy movements to the broad-phase so that new contacts are created.
            // Also, some contacts can be destroyed.
            this.m_contactManager.FindNewContacts();

            if (this.m_subStepping)
            {
                this.m_stepComplete = false;
                break;
            }
        }
    },

    DrawJoint: function(joint)
    {
        var bodyA = joint.GetBodyA();
        var bodyB = joint.GetBodyB();
        var xf1 = bodyA.GetTransform();
        var xf2 = bodyB.GetTransform();
        var x1 = xf1.p;
        var x2 = xf2.p;
        var p1 = joint.GetAnchorA();
        var p2 = joint.GetAnchorB();

        var color = new b2Color(0.5, 0.8, 0.8);

        switch (joint.GetType())
        {
        case b2Joint.e_distanceJoint:
            this.g_debugDraw.DrawSegment(p1, p2, color);
            break;

        case b2Joint.e_pulleyJoint:
            {
                var pulley = joint;
                var s1 = pulley.GetGroundAnchorA();
                var s2 = pulley.GetGroundAnchorB();
                this.g_debugDraw.DrawSegment(s1, p1, color);
                this.g_debugDraw.DrawSegment(s2, p2, color);
                this.g_debugDraw.DrawSegment(s1, s2, color);
            }
            break;

        case b2Joint.e_mouseJoint:
            // don't draw this
            break;

        case b2Joint.e_motorJoint:
            this.g_debugDraw.DrawPoint(joint.GetLinearOffset(), 5.0, color);

        default:
            this.g_debugDraw.DrawSegment(x1, p1, color);
            this.g_debugDraw.DrawSegment(p1, p2, color);
            this.g_debugDraw.DrawSegment(x2, p2, color);
        }
    },
    DrawShape: function(fixture, xf, color)
    {
        switch (fixture.GetType())
        {
        case b2Shape.e_circle:
            {
                var circle = fixture.GetShape();

                var center = b2Mul_t_v2(xf, circle.m_p);
                var radius = circle.m_radius;
                var axis = b2Mul_r_v2(xf.q, new b2Vec2(1.0, 0.0));

                this.g_debugDraw.DrawSolidCircle(center, radius, axis, color);
            }
            break;

        case b2Shape.e_edge:
            {
                var edge = fixture.GetShape();
                var v1 = b2Mul_t_v2(xf, edge.m_vertex1);
                var v2 = b2Mul_t_v2(xf, edge.m_vertex2);
                this.g_debugDraw.DrawSegment(v1, v2, color);
            }
            break;

        case b2Shape.e_chain:
            {
                var chain = fixture.GetShape();
                var count = chain.m_count;
                var vertices = chain.m_vertices;

                var v1 = b2Mul_t_v2(xf, vertices[0]);
                for (var i = 1; i < count; ++i)
                {
                    var v2 = b2Mul_t_v2(xf, vertices[i]);
                    this.g_debugDraw.DrawSegment(v1, v2, color);
                    //this.g_debugDraw.DrawCircle(v1, 0.05, color);
                    v1 = v2;
                }
            }
            break;

        case b2Shape.e_polygon:
            {
                var poly = fixture.GetShape();
                var vertexCount = poly.m_count;

                b2Assert(vertexCount <= b2_maxPolygonVertices);

                var vertices = new Array(b2_maxPolygonVertices);

                for (var i = 0; i < vertexCount; ++i)
                {
                    vertices[i] = b2Mul_t_v2(xf, poly.m_vertices[i]);
                }

                this.g_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
            }
            break;

        default:
            break;
        }
    }

//
};

b2World.e_newFixture = 0x0001;
b2World.e_locked = 0x0002;
b2World.e_clearForces = 0x0004;



/// Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
/// For example, anything slides on ice.
function b2MixFriction(friction1, friction2)
{
    return b2Sqrt(friction1 * friction2);
}

/// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
/// For example, a superball bounces on anything.
function b2MixRestitution(restitution1, restitution2)
{
    return restitution1 > restitution2 ? restitution1 : restitution2;
}

function b2ContactRegister()
{
    this.fcn = null;
    this.primary = false;
};

/// A contact edge is used to connect bodies and contacts together
/// in a contact graph where each body is a node and each contact
/// is an edge. A contact edge belongs to a doubly linked list
/// maintained in each attached body. Each contact has two contact
/// nodes, one for each attached body.
function b2ContactEdge()
{
    this.other = null;          ///< provides quick access to the other body attached.
    this.contact = null;        ///< the contact
    this.prev = null;           ///< the previous contact edge in the body's contact list
    this.next = null;           ///< the next contact edge in the body's contact list
};

b2ContactEdge.prototype =
{
    Clear: function()
    {
        this.other = this.prev = this.next = null;
    }
};

/// The class manages contact between two shapes. A contact exists for each overlapping
/// AABB in the broad-phase (except if filtered). Therefore a contact object may exist
/// that has no contact points.
function b2Contact()
{
    this.m_nodeA = new b2ContactEdge();
    this.m_nodeB = new b2ContactEdge();

    this.m_manifold = new b2Manifold();
}

b2Contact.m_local_tempManifold = new b2Manifold();

b2Contact.prototype =
{
    Create: function(fA, indexA, fB, indexB)
    {
        // Nodes for connecting bodies.
        this.m_toi = 0;

        this.m_flags = b2Contact.e_enabledFlag;

        this.m_fixtureA = fA || null;
        this.m_fixtureB = fB || null;

        this.m_indexA = indexA || 0;
        this.m_indexB = indexB || 0;

        this.m_manifold.pointCount = 0;

        this.m_prev = null;
        this.m_next = null;

        this.m_nodeA.contact = null;
        this.m_nodeA.prev = null;
        this.m_nodeA.next = null;
        this.m_nodeA.other = null;

        this.m_nodeB.contact = null;
        this.m_nodeB.prev = null;
        this.m_nodeB.next = null;
        this.m_nodeB.other = null;

        this.m_toiCount = 0;

        if (fA)
        {
            this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
            this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
        }
        else
        {
            this.m_friction = 0;
            this.m_restitution = 0;
        }

        this.m_tangentSpeed = 0.0;
    },

    /// Get the contact manifold. Do not modify the manifold unless you understand the
    /// internals of Box2D.
    GetManifold: function()
    {
        return this.m_manifold;
    },

    /// Get the world manifold.
    GetWorldManifold: function(worldManifold)
    {
        var bodyA = this.m_fixtureA.GetBody();
        var bodyB = this.m_fixtureB.GetBody();
        var shapeA = this.m_fixtureA.GetShape();
        var shapeB = this.m_fixtureB.GetShape();

        worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
    },

    /// Is this contact touching?
    IsTouching: function()
    {
        return (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
    },

    /// Enable/disable this contact. This can be used inside the pre-solve
    /// contact listener. The contact is only disabled for the current
    /// time step (or sub-step in continuous collisions).
    SetEnabled: function(flag)
    {
        if (flag)
        {
            this.m_flags |= b2Contact.e_enabledFlag;
        }
        else
        {
            this.m_flags &= ~b2Contact.e_enabledFlag;
        }
    },

    /// Has this contact been disabled?
    IsEnabled: function()
    {
        return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
    },

    /// Get the next contact in the world's contact list.
    GetNext: function()
    {
        return this.m_next;
    },

    /// Get fixture A in this contact.
    GetFixtureA: function()
    {
        return this.m_fixtureA;
    },

    /// Get the child primitive index for fixture A.
    GetChildIndexA: function()
    {
        return this.m_indexA;
    },

    /// Get fixture B in this contact.
    GetFixtureB: function()
    {
        return this.m_fixtureB;
    },

    /// Get the child primitive index for fixture B.
    GetChildIndexB: function()
    {
        return this.m_indexB;
    },

    /// Override the default friction mixture. You can call this in b2ContactListener::PreSolve.
    /// This value persists until set or reset.
    SetFriction: function(friction)
    {
        this.m_friction = friction;
    },

    /// Get the friction.
    GetFriction: function()
    {
        return this.m_friction;
    },

    /// Reset the friction mixture to the default value.
    ResetFriction: function()
    {
        this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
    },

    /// Override the default restitution mixture. You can call this in b2ContactListener::PreSolve.
    /// The value persists until you set or reset.
    SetRestitution: function(restitution)
    {
        this.m_restitution = restitution;
    },

    /// Get the restitution.
    GetRestitution: function()
    {
        return this.m_restitution;
    },

    /// Reset the restitution to the default value.
    ResetRestitution: function()
    {
        this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
    },

    /// Set the desired tangent speed for a conveyor belt behavior. In meters per second.
    SetTangentSpeed: function(speed)
    {
        this.m_tangentSpeed = speed;
    },

    /// Get the desired tangent speed. In meters per second.
    GetTangentSpeed: function()
    {
        return this.m_tangentSpeed;
    },

    /// Evaluate this contact with your own manifold and transforms.
    Evaluate: function(manifold, xfA, xfB) { },

    /// Flag this contact for filtering. Filtering will occur the next time step.
    FlagForFiltering: function()
    {
        this.m_flags |= b2Contact.e_filterFlag;
    },

    m_oldManifold: null,

    Update: function(listener)
    {
        b2Contact.m_local_tempManifold.Assign(this.m_manifold);

        // Re-enable this contact.
        this.m_flags |= b2Contact.e_enabledFlag;

        var touching = false;
        var wasTouching = (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;

        var sensorA = this.m_fixtureA.IsSensor();
        var sensorB = this.m_fixtureB.IsSensor();
        var sensor = sensorA || sensorB;

        var bodyA = this.m_fixtureA.GetBody();
        var bodyB = this.m_fixtureB.GetBody();
        var xfA = bodyA.GetTransform();
        var xfB = bodyB.GetTransform();

        // Is this contact a sensor?
        if (sensor)
        {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            touching = b2TestShapeOverlap(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);

            // Sensors don't generate manifolds.
            this.m_manifold.pointCount = 0;
        }
        else
        {
            this.Evaluate(this.m_manifold, xfA, xfB);
            touching = this.m_manifold.pointCount > 0;

            // Match old contact ids to new contact ids and copy the
            // stored impulses to warm start the solver.
            for (var i = 0; i < this.m_manifold.pointCount; ++i)
            {
                var mp2 = this.m_manifold.points[i];
                mp2.normalImpulse = 0.0;
                mp2.tangentImpulse = 0.0;
                var id2 = mp2.id;

                for (var j = 0; j < b2Contact.m_local_tempManifold.pointCount; ++j)
                {
                    var mp1 = b2Contact.m_local_tempManifold.points[j];

                    if (mp1.id.Get() == id2.Get())
                    {
                        mp2.normalImpulse = mp1.normalImpulse;
                        mp2.tangentImpulse = mp1.tangentImpulse;
                        break;
                    }
                }
            }

            if (touching != wasTouching)
            {
                bodyA.SetAwake(true);
                bodyB.SetAwake(true);
            }
        }

        if (touching)
        {
            this.m_flags |= b2Contact.e_touchingFlag;
        }
        else
        {
            this.m_flags &= ~b2Contact.e_touchingFlag;
        }

        if (wasTouching == false && touching == true && listener)
        {
            listener.BeginContact(this);
        }

        if (wasTouching == true && touching == false && listener)
        {
            listener.EndContact(this);
        }

        if (sensor == false && touching && listener)
        {
            listener.PreSolve(this, b2Contact.m_local_tempManifold);
        }
    }
};

// Used when crawling contact graph when forming islands.
b2Contact.e_islandFlag = 0x0001;

// Set when the shapes are touching.
b2Contact.e_touchingFlag = 0x0002;

// This contact can be disabled (by user)
b2Contact.e_enabledFlag = 0x0004;

// This contact needs filtering because a fixture filter was changed.
b2Contact.e_filterFlag = 0x0008;

// This bullet contact had a TOI event
b2Contact.e_bulletHitFlag = 0x0010;

// This contact has a valid TOI in this->m_toi
b2Contact.e_toiFlag = 0x0020;

function b2CircleContact()
{
    this.parent.call(this);
}

b2CircleContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        b2CollideCircles(manifold,
                        this.m_fixtureA.GetShape(), xfA,
                        this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, unused1, fixtureB, unused2)
    {
        this.parent.prototype.Create.call(this, fixtureA, 0, fixtureB, 0);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_circle);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_circle);

    }
};

b2CircleContact._extend(b2Contact);

var _local_temp_edgeShape = new b2EdgeShape();

function b2ChainAndCircleContact()
{
    this.parent.call(this);
}

b2ChainAndCircleContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        var chain = this.m_fixtureA.GetShape();
        chain.GetChildEdge(_local_temp_edgeShape, this.m_indexA);
        b2CollideEdgeAndCircle( manifold, _local_temp_edgeShape, xfA,
                                this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, indexA, fixtureB, indexB);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_chain);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_circle);

    }
};

b2ChainAndCircleContact._extend(b2Contact);


function b2ChainAndPolygonContact()
{
    this.parent.call(this);
}

b2ChainAndPolygonContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        var chain = this.m_fixtureA.GetShape();
        chain.GetChildEdge(_local_temp_edgeShape, this.m_indexA);
        b2CollideEdgeAndPolygon(    manifold, _local_temp_edgeShape, xfA,
                                    this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, indexA, fixtureB, indexB);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_chain);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_polygon);

    }
};

b2ChainAndPolygonContact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    return new b2ChainAndPolygonContact(fixtureA, indexA, fixtureB, indexB);
};

b2ChainAndPolygonContact._extend(b2Contact);


function b2EdgeAndCircleContact()
{
    this.parent.call(this);
}

b2EdgeAndCircleContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        b2CollideEdgeAndCircle( manifold,
                                this.m_fixtureA.GetShape(), xfA,
                                this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, 0, fixtureB, 0);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_edge);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_circle);

    }
};

b2EdgeAndCircleContact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    return new b2EdgeAndCircleContact(fixtureA, fixtureB);
};

b2EdgeAndCircleContact._extend(b2Contact);


function b2EdgeAndPolygonContact()
{
    this.parent.call(this);
}

b2EdgeAndPolygonContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        b2CollideEdgeAndPolygon(    manifold,
                                    this.m_fixtureA.GetShape(), xfA,
                                    this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, 0, fixtureB, 0);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_edge);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_polygon);

    }
};

b2EdgeAndPolygonContact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    return new b2EdgeAndPolygonContact(fixtureA, fixtureB);
};

b2EdgeAndPolygonContact._extend(b2Contact);


function b2PolygonAndCircleContact()
{
    this.parent.call(this);
}

b2PolygonAndCircleContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        b2CollidePolygonAndCircle(  manifold,
                                    this.m_fixtureA.GetShape(), xfA,
                                    this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, 0, fixtureB, 0);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_polygon);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_circle);

    }
};

b2PolygonAndCircleContact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    return new b2PolygonAndCircleContact(fixtureA, fixtureB);
};

b2PolygonAndCircleContact._extend(b2Contact);



function b2PolygonContact()
{
    this.parent.call(this);
}

b2PolygonContact.prototype =
{
    Evaluate: function(manifold, xfA, xfB)
    {
        b2CollidePolygons(  manifold,
                            this.m_fixtureA.GetShape(), xfA,
                            this.m_fixtureB.GetShape(), xfB);
    },

    Create: function(fixtureA, indexA, fixtureB, indexB)
    {
        this.parent.prototype.Create.call(this, fixtureA, 0, fixtureB, 0);

        b2Assert(this.m_fixtureA.GetType() == b2Shape.e_polygon);
        b2Assert(this.m_fixtureB.GetType() == b2Shape.e_polygon);

    }
};

b2PolygonContact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    return new b2PolygonContact(fixtureA, fixtureB);
};

b2PolygonContact._extend(b2Contact);


b2Contact.AddType = function(fcn,
                        type1, type2)
{

    b2Assert(0 <= type1 && type1 < b2Shape.e_typeCount);
    b2Assert(0 <= type2 && type2 < b2Shape.e_typeCount);


    if (!b2Contact.s_registers[type1])
        b2Contact.s_registers[type1] = [];

    b2Contact.s_registers[type1][type2] = new b2ContactRegister();
    b2Contact.s_registers[type1][type2].fcn = fcn;
    b2Contact.s_registers[type1][type2].primary = true;

    if (type1 != type2)
    {
        if (!b2Contact.s_registers[type2])
            b2Contact.s_registers[type2] = [];

        b2Contact.s_registers[type2][type1] = new b2ContactRegister();
        b2Contact.s_registers[type2][type1].fcn = fcn;
        b2Contact.s_registers[type2][type1].primary = false;
    }

    fcn.garbage = [];
    fcn.alloc = 2;
};

b2Contact.InitializeRegisters = function()
{
    b2Contact.AddType(b2CircleContact, b2Shape.e_circle, b2Shape.e_circle);
    b2Contact.AddType(b2PolygonAndCircleContact, b2Shape.e_polygon, b2Shape.e_circle);
    b2Contact.AddType(b2PolygonContact, b2Shape.e_polygon, b2Shape.e_polygon);
    b2Contact.AddType(b2EdgeAndCircleContact, b2Shape.e_edge, b2Shape.e_circle);
    b2Contact.AddType(b2EdgeAndPolygonContact, b2Shape.e_edge, b2Shape.e_polygon);
    b2Contact.AddType(b2ChainAndCircleContact, b2Shape.e_chain, b2Shape.e_circle);
    b2Contact.AddType(b2ChainAndPolygonContact, b2Shape.e_chain, b2Shape.e_polygon);
};

b2Contact.RetrieveGarbage = function(fcn)
{
    var contact;

    if (contact = fcn.garbage.pop())
        return contact;

    // no more contacts, allocate some more
    for (var i = 0; i < fcn.alloc - 1; ++i)
        fcn.garbage.push(new fcn());

    //if (fcn.alloc < 256)
    {
        fcn.alloc += 32;
        //console.log("Expanded storage for " + fcn.name + " to " + fcn.alloc);
    }

    return new fcn();
};

b2Contact.Create = function(fixtureA, indexA, fixtureB, indexB)
{
    if (b2Contact.s_initialized == false)
    {
        b2Contact.InitializeRegisters();
        b2Contact.s_initialized = true;
    }

    var type1 = fixtureA.GetType();
    var type2 = fixtureB.GetType();


    b2Assert(0 <= type1 && type1 < b2Shape.e_typeCount);
    b2Assert(0 <= type2 && type2 < b2Shape.e_typeCount);


    var fcn = b2Contact.s_registers[type1] ? b2Contact.s_registers[type1][type2] ? b2Contact.s_registers[type1][type2].fcn : null : null;

    if (fcn)
    {
        var contact = b2Contact.RetrieveGarbage(fcn);

        if (b2Contact.s_registers[type1][type2].primary)
            contact.Create(fixtureA, indexA, fixtureB, indexB);
        else
            contact.Create(fixtureB, indexB, fixtureA, indexA);

        return contact;
    }

    return null;
};

b2Contact.Destroy = function(contact)
{

    b2Assert(b2Contact.s_initialized == true);


    var fixtureA = contact.m_fixtureA;
    var fixtureB = contact.m_fixtureB;

    if (contact.m_manifold.pointCount > 0 &&
        fixtureA.IsSensor() == false &&
        fixtureB.IsSensor() == false)
    {
        fixtureA.GetBody().SetAwake(true);
        fixtureB.GetBody().SetAwake(true);
    }

    var typeA = fixtureA.GetType();
    var typeB = fixtureB.GetType();


    b2Assert(0 <= typeA && typeB < b2Shape.e_typeCount);
    b2Assert(0 <= typeA && typeB < b2Shape.e_typeCount);


    contact.m_nodeA.Clear();
    contact.m_nodeB.Clear();

    b2Contact.s_registers[typeA][typeB].fcn.garbage.push(contact);
};

b2Contact.s_registers = [];
b2Contact.s_initialized = false;
var b2_defaultFilter = new b2ContactFilter();
var b2_defaultListener = new b2ContactListener();

// Delegate of b2World.
function b2ContactManager()
{
    this.m_broadPhase = new b2BroadPhase();
    this.m_contactList = null;
    this.m_contactCount = 0;
    this.m_contactFilter = b2_defaultFilter;
    this.m_contactListener = b2_defaultListener;
}

b2ContactManager.prototype =
{
    // Broad-phase callback.
    AddPair: function(proxyUserDataA, proxyUserDataB)
    {
        var proxyA = proxyUserDataA;
        var proxyB = proxyUserDataB;

        var fixtureA = proxyA.fixture;
        var fixtureB = proxyB.fixture;

        var indexA = proxyA.childIndex;
        var indexB = proxyB.childIndex;

        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();

        // Are the fixtures on the same body?
        if (bodyA == bodyB)
        {
            return;
        }

        // TODO_ERIN use a hash table to remove a potential bottleneck when both
        // bodies have a lot of contacts.
        // Does a contact already exist?
        var edge = bodyB.GetContactList();
        while (edge)
        {
            if (edge.other == bodyA)
            {
                var fA = edge.contact.GetFixtureA();
                var fB = edge.contact.GetFixtureB();
                var iA = edge.contact.GetChildIndexA();
                var iB = edge.contact.GetChildIndexB();

                if (fA == fixtureA && fB == fixtureB && iA == indexA && iB == indexB)
                {
                    // A contact already exists.
                    return;
                }

                if (fA == fixtureB && fB == fixtureA && iA == indexB && iB == indexA)
                {
                    // A contact already exists.
                    return;
                }
            }

            edge = edge.next;
        }

        // Does a joint override collision? Is at least one body dynamic?
        if (bodyB.ShouldCollide(bodyA) == false)
        {
            return;
        }

        // Check user filtering.
        if (this.m_contactFilter && this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false)
        {
            return;
        }

        // Call the factory.
        var c = b2Contact.Create(fixtureA, indexA, fixtureB, indexB);
        if (c == null)
        {
            return;
        }

        // Contact creation may swap fixtures.
        fixtureA = c.GetFixtureA();
        fixtureB = c.GetFixtureB();
        indexA = c.GetChildIndexA();
        indexB = c.GetChildIndexB();
        bodyA = fixtureA.GetBody();
        bodyB = fixtureB.GetBody();

        // Insert into the world.
        c.m_prev = null;
        c.m_next = this.m_contactList;
        if (this.m_contactList != null)
        {
            this.m_contactList.m_prev = c;
        }
        this.m_contactList = c;

        // Connect to island graph.

        // Connect to body A
        c.m_nodeA.contact = c;
        c.m_nodeA.other = bodyB;

        c.m_nodeA.prev = null;
        c.m_nodeA.next = bodyA.m_contactList;
        if (bodyA.m_contactList != null)
        {
            bodyA.m_contactList.prev = c.m_nodeA;
        }
        bodyA.m_contactList = c.m_nodeA;

        // Connect to body B
        c.m_nodeB.contact = c;
        c.m_nodeB.other = bodyA;

        c.m_nodeB.prev = null;
        c.m_nodeB.next = bodyB.m_contactList;
        if (bodyB.m_contactList != null)
        {
            bodyB.m_contactList.prev = c.m_nodeB;
        }
        bodyB.m_contactList = c.m_nodeB;

        // Wake up the bodies
        if (fixtureA.IsSensor() == false && fixtureB.IsSensor() == false)
        {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
        }

        ++this.m_contactCount;
    },

    FindNewContacts: function()
    {
        this.m_broadPhase.UpdatePairs(this);
    },

    Destroy: function(c)
    {
        var fixtureA = c.GetFixtureA();
        var fixtureB = c.GetFixtureB();
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();

        if (this.m_contactListener && c.IsTouching())
        {
            this.m_contactListener.EndContact(c);
        }

        // Remove from the world.
        if (c.m_prev)
        {
            c.m_prev.m_next = c.m_next;
        }

        if (c.m_next)
        {
            c.m_next.m_prev = c.m_prev;
        }

        if (c == this.m_contactList)
        {
            this.m_contactList = c.m_next;
        }

        // Remove from body 1
        if (c.m_nodeA.prev)
        {
            c.m_nodeA.prev.next = c.m_nodeA.next;
        }

        if (c.m_nodeA.next)
        {
            c.m_nodeA.next.prev = c.m_nodeA.prev;
        }

        if (c.m_nodeA == bodyA.m_contactList)
        {
            bodyA.m_contactList = c.m_nodeA.next;
        }

        // Remove from body 2
        if (c.m_nodeB.prev)
        {
            c.m_nodeB.prev.next = c.m_nodeB.next;
        }

        if (c.m_nodeB.next)
        {
            c.m_nodeB.next.prev = c.m_nodeB.prev;
        }

        if (c.m_nodeB == bodyB.m_contactList)
        {
            bodyB.m_contactList = c.m_nodeB.next;
        }

        // Call the factory.
        b2Contact.Destroy(c);
        --this.m_contactCount;
    },

    Collide: function()
    {
        // Update awake contacts.
        var c = this.m_contactList;
        while (c)
        {
            var fixtureA = c.GetFixtureA();
            var fixtureB = c.GetFixtureB();
            var indexA = c.GetChildIndexA();
            var indexB = c.GetChildIndexB();
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();

            // Is this contact flagged for filtering?
            if (c.m_flags & b2Contact.e_filterFlag)
            {
                // Should these bodies collide?
                if (bodyB.ShouldCollide(bodyA) == false)
                {
                    var cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }

                // Check user filtering.
                if (this.m_contactFilter && this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false)
                {
                    var cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }

                // Clear the filtering flag.
                c.m_flags &= ~b2Contact.e_filterFlag;
            }

            var activeA = bodyA.IsAwake() && bodyA.m_type != b2Body.b2_staticBody;
            var activeB = bodyB.IsAwake() && bodyB.m_type != b2Body.b2_staticBody;

            // At least one body must be awake and it must be dynamic or kinematic.
            if (activeA == false && activeB == false)
            {
                c = c.GetNext();
                continue;
            }

            var proxyIdA = fixtureA.m_proxies[indexA].proxyId;
            var proxyIdB = fixtureB.m_proxies[indexB].proxyId;
            var overlap = this.m_broadPhase.TestOverlap(proxyIdA, proxyIdB);

            // Here we destroy contacts that cease to overlap in the broad-phase.
            if (overlap == false)
            {
                var cNuke = c;
                c = cNuke.GetNext();
                this.Destroy(cNuke);
                continue;
            }

            // The contact persists.
            c.Update(this.m_contactListener);
            c = c.GetNext();
        }
    }
};

function b2VelocityConstraintPoint()
{
    this.rA = new b2Vec2();
    this.rB = new b2Vec2();
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
    this.normalMass = 0;
    this.tangentMass = 0;
    this.velocityBias = 0;
}

function b2ContactPositionConstraint()
{
    this.localPoints = new Array(b2_maxManifoldPoints);
    this.localNormal = new b2Vec2();
    this.localPoint = new b2Vec2();
    this.indexA = 0;
    this.indexB = 0;
    this.invMassA = 0, this.invMassB = 0;
    this.localCenterA = new b2Vec2(), this.localCenterB = new b2Vec2();
    this.invIA = 0, this.invIB = 0;
    this.type = 0;
    this.radiusA = 0, this.radiusB = 0;
    this.pointCount = 0;
};

function b2ContactVelocityConstraint()
{
    this.points = new Array(b2_maxManifoldPoints);

    for (var i = 0; i < this.points.length; ++i)
        this.points[i] = new b2VelocityConstraintPoint();

    this.normal = new b2Vec2();
    this.normalMass = new b2Mat22();
    this.K = new b2Mat22();
    this.indexA = 0;
    this.indexB = 0;
    this.invMassA = 0, this.invMassB = 0;
    this.invIA = 0, this.invIB = 0;
    this.friction = 0;
    this.restitution = 0;
    this.tangentSpeed = 0;
    this.pointCount = 0;
    this.contactIndex = 0;
}

function b2PositionSolverManifold()
{
    this.normal = new b2Vec2();
    this.point = new b2Vec2();
    this.separation = 0;
}

b2PositionSolverManifold.prototype =
{
    Initialize: function(pc, xfA, xfB, index)
    {

        b2Assert(pc.pointCount > 0);


        switch (pc.type)
        {
        case b2Manifold.e_circles:
            {
                var pointAx = (xfA.q.c * pc.localPoint.x - xfA.q.s * pc.localPoint.y) + xfA.p.x;
                var pointAy = (xfA.q.s * pc.localPoint.x + xfA.q.c * pc.localPoint.y) + xfA.p.y;//b2Mul_t_v2(xfA, pc.localPoint);
                var pointBx = (xfB.q.c * pc.localPoints[0].x - xfB.q.s * pc.localPoints[0].y) + xfB.p.x;
                var pointBy = (xfB.q.s * pc.localPoints[0].x + xfB.q.c * pc.localPoints[0].y) + xfB.p.y;//b2Mul_t_v2(xfB, pc.localPoints[0]);
                this.point.x = 0.5 * (pointAx + pointBx); //.Assign(b2Vec2.Multiply(0.5, b2Vec2.Add(pointA, pointB)));
                this.point.y = 0.5 * (pointAy + pointBy);
                this.normal.x = pointBx - pointAx; //Assign(b2Vec2.Subtract(pointB, pointA));
                this.normal.y = pointBy - pointAy;
                var tempnx = this.normal.x;
                var tempny = this.normal.y;
                this.normal.Normalize();
                this.separation = /*b2Dot_v2_v2(b2Vec2.Subtract(pointB, pointA), this.normal)*/ (tempnx * this.normal.x + tempny * this.normal.y) - pc.radiusA - pc.radiusB;
            }
            break;

        case b2Manifold.e_faceA:
            {
                //this.normal.Assign(b2Mul_r_v2(xfA.q, pc.localNormal));
                this.normal.x = xfA.q.c * pc.localNormal.x - xfA.q.s * pc.localNormal.y;
                this.normal.y = xfA.q.s * pc.localNormal.x + xfA.q.c * pc.localNormal.y;

                //var planePoint = b2Mul_t_v2(xfA, pc.localPoint);
                var planePointx = (xfA.q.c * pc.localPoint.x - xfA.q.s * pc.localPoint.y) + xfA.p.x;
                var planePointy = (xfA.q.s * pc.localPoint.x + xfA.q.c * pc.localPoint.y) + xfA.p.y;

                //var clipPoint = b2Mul_t_v2(xfB, pc.localPoints[index]);
                var clipPointx = (xfB.q.c * pc.localPoints[index].x - xfB.q.s * pc.localPoints[index].y) + xfB.p.x;
                var clipPointy = (xfB.q.s * pc.localPoints[index].x + xfB.q.c * pc.localPoints[index].y) + xfB.p.y;
                this.separation = ((clipPointx - planePointx) * this.normal.x + (clipPointy - planePointy) * this.normal.y) /*b2Dot_v2_v2(b2Vec2.Subtract(clipPoint, planePoint), this.normal)*/ - pc.radiusA - pc.radiusB;

                this.point.x = clipPointx;
                this.point.y = clipPointy;
            }
            break;

        case b2Manifold.e_faceB:
            {
                //this.normal.Assign(b2Mul_r_v2(xfB.q, pc.localNormal));
                this.normal.x = xfB.q.c * pc.localNormal.x - xfB.q.s * pc.localNormal.y;
                this.normal.y = xfB.q.s * pc.localNormal.x + xfB.q.c * pc.localNormal.y;

                //var planePoint = b2Mul_t_v2(xfB, pc.localPoint);
                var planePointx = (xfB.q.c * pc.localPoint.x - xfB.q.s * pc.localPoint.y) + xfB.p.x;
                var planePointy = (xfB.q.s * pc.localPoint.x + xfB.q.c * pc.localPoint.y) + xfB.p.y;

                //var clipPoint = b2Mul_t_v2(xfA, pc.localPoints[index]);
                var clipPointx = (xfA.q.c * pc.localPoints[index].x - xfA.q.s * pc.localPoints[index].y) + xfA.p.x;
                var clipPointy = (xfA.q.s * pc.localPoints[index].x + xfA.q.c * pc.localPoints[index].y) + xfA.p.y;
                this.separation = ((clipPointx - planePointx) * this.normal.x + (clipPointy - planePointy) * this.normal.y) /*b2Dot_v2_v2(b2Vec2.Subtract(clipPoint, planePoint), this.normal)*/ - pc.radiusA - pc.radiusB;

                this.point.x = clipPointx;
                this.point.y = clipPointy;

                // Ensure normal points from A to B
                //this.normal.Assign(this.normal.Negate());
                this.normal.x = -this.normal.x;
                this.normal.y = -this.normal.y;
            }
            break;
        }
    }
};

function b2ContactSolverDef()
{
    this.step = new b2TimeStep();
    this.contacts = null;
    this.count = 0;
    this.positions = null;
    this.velocities = null;
}

function b2ContactSolver()
{
    this.m_positionConstraints = [];
    this.m_velocityConstraints = [];
}

b2ContactSolver.cs_xfA = new b2Transform();
b2ContactSolver.cs_xfB = new b2Transform();

b2ContactSolver.temp_solver_manifold = new b2PositionSolverManifold();

b2ContactSolver.prototype =
{
    Init: function(def)
    {
        this.m_step = def.step;
        this.m_count = def.count;
        this.m_positionConstraints.length = this.m_count;
        this.m_velocityConstraints.length = this.m_count;
        this.m_positions = def.positions;
        this.m_velocities = def.velocities;
        this.m_contacts = def.contacts;

        // Initialize position independent portions of the constraints.
        for (var i = 0; i < this.m_count; ++i)
        {
            var contact = this.m_contacts[i];

            var fixtureA = contact.m_fixtureA;
            var fixtureB = contact.m_fixtureB;
            var shapeA = fixtureA.GetShape();
            var shapeB = fixtureB.GetShape();
            var radiusA = shapeA.m_radius;
            var radiusB = shapeB.m_radius;
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
            var manifold = contact.GetManifold();

            var pointCount = manifold.pointCount;

            b2Assert(pointCount > 0);


            var vc = this.m_velocityConstraints[i] || new b2ContactVelocityConstraint();
            vc.friction = contact.m_friction;
            vc.restitution = contact.m_restitution;
            vc.tangentSpeed = contact.m_tangentSpeed;
            vc.indexA = bodyA.m_islandIndex;
            vc.indexB = bodyB.m_islandIndex;
            vc.invMassA = bodyA.m_invMass;
            vc.invMassB = bodyB.m_invMass;
            vc.invIA = bodyA.m_invI;
            vc.invIB = bodyB.m_invI;
            vc.contactIndex = i;
            vc.pointCount = pointCount;
            vc.K.SetZero();
            vc.normalMass.SetZero();
            this.m_velocityConstraints[i] = vc;

            var pc = this.m_positionConstraints[i] || new b2ContactPositionConstraint();
            pc.indexA = bodyA.m_islandIndex;
            pc.indexB = bodyB.m_islandIndex;
            pc.invMassA = bodyA.m_invMass;
            pc.invMassB = bodyB.m_invMass;
            pc.localCenterA.x = bodyA.m_sweep.localCenter.x;
            pc.localCenterA.y = bodyA.m_sweep.localCenter.y;
            pc.localCenterB.x = bodyB.m_sweep.localCenter.x;
            pc.localCenterB.y = bodyB.m_sweep.localCenter.y;
            pc.invIA = bodyA.m_invI;
            pc.invIB = bodyB.m_invI;
            pc.localNormal.x = manifold.localNormal.x;
            pc.localNormal.y = manifold.localNormal.y;
            pc.localPoint.x = manifold.localPoint.x;
            pc.localPoint.y = manifold.localPoint.y;
            pc.pointCount = pointCount;
            pc.radiusA = radiusA;
            pc.radiusB = radiusB;
            pc.type = manifold.type;
            this.m_positionConstraints[i] = pc;

            for (var j = 0; j < pointCount; ++j)
            {
                var cp = manifold.points[j];
                var vcp = vc.points[j];

                if (this.m_step.warmStarting)
                {
                    vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                    vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
                }
                else
                {
                    vcp.normalImpulse = 0.0;
                    vcp.tangentImpulse = 0.0;
                }

                vcp.rA.SetZero();
                vcp.rB.SetZero();
                vcp.normalMass = 0.0;
                vcp.tangentMass = 0.0;
                vcp.velocityBias = 0.0;

                pc.localPoints[j] = cp.localPoint;
            }
        }
    },

    InitializeVelocityConstraints: function()
    {
        for (var i = 0; i < this.m_count; ++i)
        {
            var vc = this.m_velocityConstraints[i];
            var pc = this.m_positionConstraints[i];

            var radiusA = pc.radiusA;
            var radiusB = pc.radiusB;
            var manifold = this.m_contacts[vc.contactIndex].GetManifold();

            var indexA = vc.indexA;
            var indexB = vc.indexB;

            var mA = vc.invMassA;
            var mB = vc.invMassB;
            var iA = vc.invIA;
            var iB = vc.invIB;
            var localCenterA = pc.localCenterA;
            var localCenterB = pc.localCenterB;

            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;
            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;

            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;


            b2Assert(manifold.pointCount > 0);


            b2ContactSolver.cs_xfA.q.Set(aA);
            b2ContactSolver.cs_xfB.q.Set(aB);
            b2ContactSolver.cs_xfA.p.x = cA.x - (b2ContactSolver.cs_xfA.q.c * localCenterA.x - b2ContactSolver.cs_xfA.q.s * localCenterA.y);//Assign(b2Vec2.Subtract(cA, b2Mul_r_v2(b2ContactSolver.cs_xfA.q, localCenterA)));
            b2ContactSolver.cs_xfA.p.y = cA.y - (b2ContactSolver.cs_xfA.q.s * localCenterA.x + b2ContactSolver.cs_xfA.q.c * localCenterA.y);
            b2ContactSolver.cs_xfB.p.x = cB.x - (b2ContactSolver.cs_xfB.q.c * localCenterB.x - b2ContactSolver.cs_xfB.q.s * localCenterB.y);//.Assign(b2Vec2.Subtract(cB, b2Mul_r_v2(b2ContactSolver.cs_xfB.q, localCenterB)));
            b2ContactSolver.cs_xfB.p.y = cB.y - (b2ContactSolver.cs_xfB.q.s * localCenterB.x + b2ContactSolver.cs_xfB.q.c * localCenterB.y);

            var worldManifold = new b2WorldManifold();
            worldManifold.Initialize(manifold, b2ContactSolver.cs_xfA, radiusA, b2ContactSolver.cs_xfB, radiusB);

            vc.normal.x = worldManifold.normal.x;//.Assign(worldManifold.normal);
            vc.normal.y = worldManifold.normal.y;

            var pointCount = vc.pointCount;
            for (var j = 0; j < pointCount; ++j)
            {
                var vcp = vc.points[j];

                vcp.rA.x = worldManifold.points[j].x - cA.x;// = b2Vec2.Subtract(worldManifold.points[j], cA);
                vcp.rA.y = worldManifold.points[j].y - cA.y;
                vcp.rB.x = worldManifold.points[j].x - cB.x;//b2Vec2.Subtract(worldManifold.points[j], cB);
                vcp.rB.y = worldManifold.points[j].y - cB.y;

                var rnA = vcp.rA.x * vc.normal.y - vcp.rA.y * vc.normal.x;//b2Cross_v2_v2(vcp.rA, vc.normal);
                var rnB = vcp.rB.x * vc.normal.y - vcp.rB.y * vc.normal.x;//b2Cross_v2_v2(vcp.rB, vc.normal);

                var kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;

                vcp.normalMass = kNormal > 0.0 ? 1.0 / kNormal : 0.0;

                var tangentx = 1.0 * vc.normal.y;//b2Cross_v2_f(vc.normal, 1.0);
                var tangenty = -1.0 * vc.normal.x;

                var rtA = vcp.rA.x * tangenty - vcp.rA.y * tangentx;//b2Cross_v2_v2(vcp.rA, tangent);
                var rtB = vcp.rB.x * tangenty - vcp.rB.y * tangentx;//b2Cross_v2_v2(vcp.rB, tangent);

                var kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;

                vcp.tangentMass = kTangent > 0.0 ? 1.0 /  kTangent : 0.0;

                // Setup a velocity bias for restitution.
                vcp.velocityBias = 0.0;
                //var tax = -wB * vcp.rB.y;//b2Cross_f_v2(wB, vcp.rB);
                //var tay = wB * vcp.rB.x;
                //var tbx = -wA * vcp.rA.y;//b2Cross_f_v2(wA, vcp.rA);
                //var tby = wA * vcp.rA.x;

                //var vRel = b2Dot_v2_v2(vc.normal, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, ta), vA), tb));
                var vRel = vc.normal.x * (((vB.x + (-wB * vcp.rB.y)) - vA.x) - (-wA * vcp.rA.y)) + vc.normal.y * (((vB.y + (wB * vcp.rB.x)) - vA.y) - (wA * vcp.rA.x));
                if (vRel < -b2_velocityThreshold)
                {
                    vcp.velocityBias = -vc.restitution * vRel;
                }
            }

            // If we have two points, then prepare the block solver.
            if (vc.pointCount == 2)
            {
                var vcp1 = vc.points[0];
                var vcp2 = vc.points[1];

                var rn1A = vcp1.rA.x * vc.normal.y - vcp1.rA.y * vc.normal.x;//b2Cross_v2_v2(vcp1.rA, vc.normal);
                var rn1B = vcp1.rB.x * vc.normal.y - vcp1.rB.y * vc.normal.x;//b2Cross_v2_v2(vcp1.rB, vc.normal);
                var rn2A = vcp2.rA.x * vc.normal.y - vcp2.rA.y * vc.normal.x;//b2Cross_v2_v2(vcp2.rA, vc.normal);
                var rn2B = vcp2.rB.x * vc.normal.y - vcp2.rB.y * vc.normal.x;//b2Cross_v2_v2(vcp2.rB, vc.normal);

                var k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
                var k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
                var k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;

                // Ensure a reasonable condition number.
                var k_maxConditionNumber = 1000.0;
                if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12))
                {
                    // K is safe to invert.
                    vc.K.ex.x = k11;//.Set(k11, k12);
                    vc.K.ex.y = k12;
                    vc.K.ey.x = k12;//.Set(k12, k22);
                    vc.K.ey.y = k22;
                    vc.normalMass.Assign(vc.K.GetInverse());
                }
                else
                {
                    // The constraints are redundant, just use one.
                    // TODO_ERIN use deepest?
                    vc.pointCount = 1;
                }
            }
        }
    },

    WarmStart: function()
    {
        // Warm start.
        for (var i = 0; i < this.m_count; ++i)
        {
            var vc = this.m_velocityConstraints[i];

            var indexA = vc.indexA;
            var indexB = vc.indexB;
            var mA = vc.invMassA;
            var iA = vc.invIA;
            var mB = vc.invMassB;
            var iB = vc.invIB;
            var pointCount = vc.pointCount;

            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;

            var normal = vc.normal;
            var tangentx = 1.0 * normal.y;
            var tangenty = -1.0 * normal.x;//b2Cross_v2_f(normal, 1.0);

            for (var j = 0; j < pointCount; ++j)
            {
                var vcp = vc.points[j];
                var Px = (vcp.normalImpulse * normal.x) + (vcp.tangentImpulse * tangentx);
                var Py = (vcp.normalImpulse * normal.y) + (vcp.tangentImpulse * tangenty);
                    //b2Vec2.Add(b2Vec2.Multiply(vcp.normalImpulse, normal), b2Vec2.Multiply(vcp.tangentImpulse, tangent));
                wA -= iA * (vcp.rA.x * Py - vcp.rA.y * Px);//b2Cross_v2_v2(vcp.rA, P);
                //vA.Subtract(b2Vec2.Multiply(mA, P));
                vA.x -= mA * Px;
                vA.y -= mA * Py;
                wB += iB * (vcp.rB.x * Py - vcp.rB.y * Px);//b2Cross_v2_v2(vcp.rB, P);
                //vB.Add(b2Vec2.Multiply(mB, P));
                vB.x += mB * Px;
                vB.y += mB * Py;
            }

            this.m_velocities[indexA].w = wA;
            this.m_velocities[indexB].w = wB;
        }
    },
    SolveVelocityConstraints: function()
    {
        for (var i = 0; i < this.m_count; ++i)
        {
            var vc = this.m_velocityConstraints[i];

            var indexA = vc.indexA;
            var indexB = vc.indexB;
            var mA = vc.invMassA;
            var iA = vc.invIA;
            var mB = vc.invMassB;
            var iB = vc.invIB;
            var pointCount = vc.pointCount;

            var vA = this.m_velocities[indexA].v;
            var wA = this.m_velocities[indexA].w;
            var vB = this.m_velocities[indexB].v;
            var wB = this.m_velocities[indexB].w;

            var normal = vc.normal;
            var tangentx = 1.0 * normal.y;//b2Cross_v2_f(normal, 1.0);
            var tangenty = -1.0 * normal.x;
            var friction = vc.friction;


            b2Assert(pointCount == 1 || pointCount == 2);


            // Solve tangent constraints first because non-penetration is more important
            // than friction.
            for (var j = 0; j < pointCount; ++j)
            {
                var vcp = vc.points[j];

                // Relative velocity at contact
                var dvx = vB.x + (-wB * vcp.rB.y) - vA.x - (-wA * vcp.rA.y);
                var dvy = vB.y + (wB * vcp.rB.x) - vA.y - (wA * vcp.rA.x);

                //b2Assert(b2Vec2.Equals(dv, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, vcp.rB)), vA), b2Cross_f_v2(wA, vcp.rA))));

                // Compute tangent force
                var vt = (dvx * tangentx + dvy * tangenty) /*b2Dot_v2_v2(dv, tangent)*/ - vc.tangentSpeed;
                var lambda = vcp.tangentMass * (-vt);

                // b2Clamp the accumulated force
                var maxFriction = friction * vcp.normalImpulse;
                var newImpulse = b2Clamp(vcp.tangentImpulse + lambda, -maxFriction, maxFriction);
                lambda = newImpulse - vcp.tangentImpulse;
                vcp.tangentImpulse = newImpulse;

                // Apply contact impulse
                var Px = lambda * tangentx;
                var Py = lambda * tangenty;

                //b2Assert(b2Vec2.Equals(P, b2Vec2.Multiply(lambda, tangent)));

                //vA.Subtract(b2Vec2.Multiply(mA, P));
                vA.x -= mA * Px;
                vA.y -= mA * Py;
                wA -= iA * (vcp.rA.x * Py - vcp.rA.y * Px);//b2Cross_v2_v2(vcp.rA, P);

                //vB.Add(b2Vec2.Multiply(mB, P));
                vB.x += mB * Px;
                vB.y += mB * Py;
                wB += iB * (vcp.rB.x * Py - vcp.rB.y * Px);//b2Cross_v2_v2(vcp.rB, P);
            }

            // Solve normal constraints
            if (vc.pointCount == 1)
            {
                vcp = vc.points[0];

                // Relative velocity at contact
                dvx = vB.x + (-wB * vcp.rB.y) - vA.x - (-wA * vcp.rA.y);
                dvy = vB.y + (wB * vcp.rB.x) - vA.y - (wA * vcp.rA.x);

                //b2Assert(b2Vec2.Equals(dv, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, vcp.rB)), vA), b2Cross_f_v2(wA, vcp.rA))));

                // Compute normal impulse
                var vn = dvx * normal.x + dvy * normal.y;//b2Dot_v2_v2(dv, normal);
                var lambda = -vcp.normalMass * (vn - vcp.velocityBias);

                // b2Clamp the accumulated impulse
                var newImpulse = b2Max(vcp.normalImpulse + lambda, 0.0);
                lambda = newImpulse - vcp.normalImpulse;
                vcp.normalImpulse = newImpulse;

                // Apply contact impulse
                Px = lambda * normal.x;
                Py = lambda * normal.y;//b2Vec2.Multiply(lambda, normal);
                //vA.Subtract(b2Vec2.Multiply(mA, P));
                vA.x -= mA * Px;
                vA.y -= mA * Py;
                wA -= iA * (vcp.rA.x * Py - vcp.rA.y * Px);//b2Cross_v2_v2(vcp.rA, P);

                //vB.Add(b2Vec2.Multiply(mB, P));
                vB.x += mB * Px;
                vB.y += mB * Py;
                wB += iB * (vcp.rB.x * Py - vcp.rB.y * Px);//b2Cross_v2_v2(vcp.rB, P);
            }
            else
            {
                // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                // Build the mini LCP for this contact patch
                //
                // vn = A * x + b, vn >= 0, , vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
                //
                // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
                // b = vn0 - velocityBias
                //
                // The system is solved using the "Total enumeration method" (s. Murty). The complementary constraint vn_i * x_i
                // implies that we must have in any solution either vn_i = 0 or x_i = 0. So for the 2D contact problem the cases
                // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and vn1 = 0 need to be tested. The first valid
                // solution that satisfies the problem is chosen.
                //
                // In order to account of the accumulated impulse 'a' (because of the iterative nature of the solver which only requires
                // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse variable (x_i).
                //
                // Substitute:
                //
                // x = a + d
                //
                // a := old total impulse
                // x := new total impulse
                // d := incremental impulse
                //
                // For the current iteration we extend the formula for the incremental impulse
                // to compute the new total impulse:
                //
                // vn = A * d + b
                //    = A * (x - a) + b
                //    = A * x + b - A * a
                //    = A * x + b'
                // b' = b - A * a;

                var cp1 = vc.points[0];
                var cp2 = vc.points[1];

                var ax = cp1.normalImpulse;
                var ay = cp2.normalImpulse;

                b2Assert(ax >= 0.0 && ay >= 0.0);


                // Relative velocity at contact
                var dv1x = vB.x + (-wB * cp1.rB.y) - vA.x - (-wA * cp1.rA.y);
                var dv1y = vB.y + (wB * cp1.rB.x) - vA.y - (wA * cp1.rA.x);

                //b2Assert(b2Vec2.Equals(dv1, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, cp1.rB)), vA), b2Cross_f_v2(wA, cp1.rA))));
                var dv2x = vB.x + (-wB * cp2.rB.y) - vA.x - (-wA * cp2.rA.y);
                var dv2y = vB.y + (wB * cp2.rB.x) - vA.y - (wA * cp2.rA.x);
                //b2Assert(b2Vec2.Equals(dv2, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, cp2.rB)), vA), b2Cross_f_v2(wA, cp2.rA))));

                // Compute normal velocity
                var vn1 = dv1x * normal.x + dv1y * normal.y;//b2Dot_v2_v2(dv1, normal);
                var vn2 = dv2x * normal.x + dv2y * normal.y;//b2Dot_v2_v2(dv2, normal);

                var bx = vn1 - cp1.velocityBias;
                var by = vn2 - cp2.velocityBias;

                // Compute b'
                //b.Subtract(b2Mul_m22_v2(vc.K, a));
                bx -= vc.K.ex.x * ax + vc.K.ey.x * ay;
                by -= vc.K.ex.y * ax + vc.K.ey.y * ay;

                //var k_errorTol = 1e-3;

                for (;;)
                {
                    //
                    // Case 1: vn = 0
                    //
                    // 0 = A * x + b'
                    //
                    // Solve for x:
                    //
                    // x = - inv(A) * b'
                    //
                    var xx = -(vc.normalMass.ex.x * bx + vc.normalMass.ey.x * by);
                    var xy = -(vc.normalMass.ex.y * bx + vc.normalMass.ey.y * by);
                        //b2Mul_m22_v2(vc.normalMass, b).Negate();

                    if (xx >= 0.0 && xy >= 0.0)
                    {
                        // Get the incremental impulse
                        var dx = xx - ax;
                        var dy = xy - ay;//b2Vec2.Subtract(x, a);

                        // Apply incremental impulse
                        var P1x = dx * normal.x;
                        var P1y = dx * normal.y;
                        var P2x = dy * normal.x;
                        var P2y = dy * normal.y;
                        //vA.Subtract(b2Vec2.Multiply(mA, b2Vec2.Add(P1, P2)));
                        vA.x -= mA * (P1x + P2x);
                        vA.y -= mA * (P1y + P2y);
                        wA -= iA * ((cp1.rA.x * P1y - cp1.rA.y * P1x) + (cp2.rA.x * P2y - cp2.rA.y * P2x));//(b2Cross_v2_v2(cp1.rA, P1) + b2Cross_v2_v2(cp2.rA, P2));

                        //vB.Add(b2Vec2.Multiply(mB, b2Vec2.Add(P1, P2)));
                        vB.x += mB * (P1x + P2x);
                        vB.y += mB * (P1y + P2y);
                        wB += iB * ((cp1.rB.x * P1y - cp1.rB.y * P1x) + (cp2.rB.x * P2y - cp2.rB.y * P2x));//(b2Cross_v2_v2(cp1.rB, P1) + b2Cross_v2_v2(cp2.rB, P2));

                        // Accumulate
                        cp1.normalImpulse = xx;
                        cp2.normalImpulse = xy;

/*
    #if B2_DEBUG_SOLVER == 1
                        // Postconditions
                        dv1 = vB + b2Cross(wB, cp1.rB) - vA - b2Cross(wA, cp1.rA);
                        dv2 = vB + b2Cross(wB, cp2.rB) - vA - b2Cross(wA, cp2.rA);
                        // Compute normal velocity
                        vn1 = b2Dot(dv1, normal);
                        vn2 = b2Dot(dv2, normal);
                        b2Assert(b2Abs(vn1 - cp1.velocityBias) < k_errorTol);
                        b2Assert(b2Abs(vn2 - cp2.velocityBias) < k_errorTol);
    #endif
*/
                        break;
                    }

                    //
                    // Case 2: vn1 = 0 and x2 = 0
                    //
                    //   0 = a11 * x1 + a12 * 0 + b1'
                    // vn2 = a21 * x1 + a22 * 0 + b2'
                    //
                    xx = - cp1.normalMass * bx;
                    xy = 0.0;
                    vn1 = 0.0;
                    vn2 = vc.K.ex.y * xx + by;

                    if (xx >= 0.0 && vn2 >= 0.0)
                    {
                        // Get the incremental impulse
                        dx = xx - ax;
                        dy = xy - ay;//b2Vec2.Subtract(x, a);

                        // Apply incremental impulse
                        P1x = dx * normal.x;
                        P1y = dx * normal.y;//b2Vec2.Multiply(d.x, normal);
                        P2x = dy * normal.x;
                        P2y = dy * normal.y;//b2Vec2.Multiply(d.y, normal);
                        //vA.Subtract(b2Vec2.Multiply(mA, b2Vec2.Add(P1, P2)));
                        vA.x -= mA * (P1x + P2x);
                        vA.y -= mA * (P1y + P2y);
                        wA -= iA * ((cp1.rA.x * P1y - cp1.rA.y * P1x) + (cp2.rA.x * P2y - cp2.rA.y * P2x));//(b2Cross_v2_v2(cp1.rA, P1) + b2Cross_v2_v2(cp2.rA, P2));

                        //vB.Add(b2Vec2.Multiply(mB, b2Vec2.Add(P1, P2)));
                        vB.x += mB * (P1x + P2x);
                        vB.y += mB * (P1y + P2y);
                        wB += iB * ((cp1.rB.x * P1y - cp1.rB.y * P1x) + (cp2.rB.x * P2y - cp2.rB.y * P2x));//(b2Cross_v2_v2(cp1.rB, P1) + b2Cross_v2_v2(cp2.rB, P2));

                        // Accumulate
                        cp1.normalImpulse = xx;
                        cp2.normalImpulse = xy;

/*  #if B2_DEBUG_SOLVER == 1
                        // Postconditions
                        dv1 = vB + b2Cross(wB, cp1.rB) - vA - b2Cross(wA, cp1.rA);
                        // Compute normal velocity
                        vn1 = b2Dot(dv1, normal);
                        b2Assert(b2Abs(vn1 - cp1.velocityBias) < k_errorTol);
    #endif*/
                        break;
                    }


                    //
                    // Case 3: vn2 = 0 and x1 = 0
                    //
                    // vn1 = a11 * 0 + a12 * x2 + b1'
                    //   0 = a21 * 0 + a22 * x2 + b2'
                    //
                    xx = 0.0;
                    xy = - cp2.normalMass * by;
                    vn1 = vc.K.ey.x * xy + bx;
                    vn2 = 0.0;

                    if (xy >= 0.0 && vn1 >= 0.0)
                    {
                        // Resubstitute for the incremental impulse
                        dx = xx - ax;
                        dy = xy - ay;//b2Vec2.Subtract(x, a);

                        // Apply incremental impulse
                        P1x = dx * normal.x;
                        P1y = dx * normal.y;//b2Vec2.Multiply(d.x, normal);
                        P2x = dy * normal.x;
                        P2y = dy * normal.y;//b2Vec2.Multiply(d.y, normal);
                        //vA.Subtract(b2Vec2.Multiply(mA, b2Vec2.Add(P1, P2)));
                        vA.x -= mA * (P1x + P2x);
                        vA.y -= mA * (P1y + P2y);
                        wA -= iA * ((cp1.rA.x * P1y - cp1.rA.y * P1x) + (cp2.rA.x * P2y - cp2.rA.y * P2x));//(b2Cross_v2_v2(cp1.rA, P1) + b2Cross_v2_v2(cp2.rA, P2));

                        //vB.Add(b2Vec2.Multiply(mB, b2Vec2.Add(P1, P2)));
                        vB.x += mB * (P1x + P2x);
                        vB.y += mB * (P1y + P2y);
                        wB += iB * ((cp1.rB.x * P1y - cp1.rB.y * P1x) + (cp2.rB.x * P2y - cp2.rB.y * P2x));//(b2Cross_v2_v2(cp1.rB, P1) + b2Cross_v2_v2(cp2.rB, P2));

                        // Accumulate
                        cp1.normalImpulse = xx;
                        cp2.normalImpulse = xy;

/*  #if B2_DEBUG_SOLVER == 1
                        // Postconditions
                        dv2 = vB + b2Cross(wB, cp2.rB) - vA - b2Cross(wA, cp2.rA);
                        // Compute normal velocity
                        vn2 = b2Dot(dv2, normal);
                        b2Assert(b2Abs(vn2 - cp2.velocityBias) < k_errorTol);
    #endif*/
                        break;
                    }

                    //
                    // Case 4: x1 = 0 and x2 = 0
                    //
                    // vn1 = b1
                    // vn2 = b2;
                    xx = 0.0;
                    xy = 0.0;
                    vn1 = bx;
                    vn2 = by;

                    if (vn1 >= 0.0 && vn2 >= 0.0 )
                    {
                        // Resubstitute for the incremental impulse
                        dx = xx - ax;
                        dy = xy - ay;//b2Vec2.Subtract(x, a);

                        // Apply incremental impulse
                        P1x = dx * normal.x;
                        P1y = dx * normal.y;//b2Vec2.Multiply(d.x, normal);
                        P2x = dy * normal.x;
                        P2y = dy * normal.y;//b2Vec2.Multiply(d.y, normal);
                        //vA.Subtract(b2Vec2.Multiply(mA, b2Vec2.Add(P1, P2)));
                        vA.x -= mA * (P1x + P2x);
                        vA.y -= mA * (P1y + P2y);
                        wA -= iA * ((cp1.rA.x * P1y - cp1.rA.y * P1x) + (cp2.rA.x * P2y - cp2.rA.y * P2x));//(b2Cross_v2_v2(cp1.rA, P1) + b2Cross_v2_v2(cp2.rA, P2));

                        //vB.Add(b2Vec2.Multiply(mB, b2Vec2.Add(P1, P2)));
                        vB.x += mB * (P1x + P2x);
                        vB.y += mB * (P1y + P2y);
                        wB += iB * ((cp1.rB.x * P1y - cp1.rB.y * P1x) + (cp2.rB.x * P2y - cp2.rB.y * P2x));//(b2Cross_v2_v2(cp1.rB, P1) + b2Cross_v2_v2(cp2.rB, P2));

                        // Accumulate
                        cp1.normalImpulse = xx;
                        cp2.normalImpulse = xy;

                        break;
                    }

                    // No solution, give up. This is hit sometimes, but it doesn't seem to matter.
                    break;
                }
            }

            this.m_velocities[indexA].w = wA;
            this.m_velocities[indexB].w = wB;
        }
    },
    StoreImpulses: function()
    {
        for (var i = 0; i < this.m_count; ++i)
        {
            var vc = this.m_velocityConstraints[i];
            var manifold = this.m_contacts[vc.contactIndex].GetManifold();

            for (var j = 0; j < vc.pointCount; ++j)
            {
                manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
            }
        }
    },

    SolvePositionConstraints: function()
    {
        var minSeparation = 0.0;

        for (var i = 0; i < this.m_count; ++i)
        {
            var pc = this.m_positionConstraints[i];

            var indexA = pc.indexA;
            var indexB = pc.indexB;
            var localCenterA = pc.localCenterA;
            var mA = pc.invMassA;
            var iA = pc.invIA;
            var localCenterB = pc.localCenterB;
            var mB = pc.invMassB;
            var iB = pc.invIB;
            var pointCount = pc.pointCount;

            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;

            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;

            // Solve normal constraints
            for (var j = 0; j < pointCount; ++j)
            {
                b2ContactSolver.cs_xfA.q.Set(aA);
                b2ContactSolver.cs_xfB.q.Set(aB);
                //b2ContactSolver.cs_xfA.p.Assign(b2Vec2.Subtract(cA, b2Mul_r_v2(b2ContactSolver.cs_xfA.q, localCenterA)));
                b2ContactSolver.cs_xfA.p.x = cA.x - (b2ContactSolver.cs_xfA.q.c * localCenterA.x - b2ContactSolver.cs_xfA.q.s * localCenterA.y);
                b2ContactSolver.cs_xfA.p.y = cA.y - (b2ContactSolver.cs_xfA.q.s * localCenterA.x + b2ContactSolver.cs_xfA.q.c * localCenterA.y);
                //b2ContactSolver.cs_xfB.p.Assign(b2Vec2.Subtract(cB, b2Mul_r_v2(b2ContactSolver.cs_xfB.q, localCenterB)));
                b2ContactSolver.cs_xfB.p.x = cB.x - (b2ContactSolver.cs_xfB.q.c * localCenterB.x - b2ContactSolver.cs_xfB.q.s * localCenterB.y);
                b2ContactSolver.cs_xfB.p.y = cB.y - (b2ContactSolver.cs_xfB.q.s * localCenterB.x + b2ContactSolver.cs_xfB.q.c * localCenterB.y);

                b2ContactSolver.temp_solver_manifold.Initialize(pc, b2ContactSolver.cs_xfA, b2ContactSolver.cs_xfB, j);
                var normal = b2ContactSolver.temp_solver_manifold.normal;

                var point = b2ContactSolver.temp_solver_manifold.point;
                var separation = b2ContactSolver.temp_solver_manifold.separation;

                var rAx = point.x - cA.x;
                var rAy = point.y - cA.y; //b2Vec2.Subtract(point, cA);
                var rBx = point.x - cB.x; //b2Vec2.Subtract(point, cB);
                var rBy = point.y - cB.y;

                // Track max constraint error.
                minSeparation = b2Min(minSeparation, separation);

                // Prevent large corrections and allow slop.
                var C = b2Clamp(b2_baumgarte * (separation + b2_linearSlop), -b2_maxLinearCorrection, 0.0);

                // Compute the effective mass.
                var rnA = rAx * normal.y - rAy * normal.x;//b2Cross_v2_v2(rA, normal);
                var rnB = rBx * normal.y - rBy * normal.x;//b2Cross_v2_v2(rB, normal);
                var K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;

                // Compute normal impulse
                var impulse = K > 0.0 ? - C / K : 0.0;

                var Px = impulse * normal.x;
                var Py = impulse * normal.y;//b2Vec2.Multiply(impulse, normal);

                //cA.Subtract(b2Vec2.Multiply(mA, P));
                cA.x -= mA * Px;
                cA.y -= mA * Py;
                aA -= iA * (rAx * Py - rAy * Px);//b2Cross_v2_v2(rA, P);

                //cB.Add(b2Vec2.Multiply(mB, P));
                cB.x += mB * Px;
                cB.y += mB * Py;
                aB += iB * (rBx * Py - rBy * Px);//b2Cross_v2_v2(rB, P);
            }

            this.m_positions[indexA].a = aA;
            this.m_positions[indexB].a = aB;
        }

        // We can't expect minSpeparation >= -b2_linearSlop because we don't
        // push the separation above -b2_linearSlop.
        return minSeparation >= -3.0 * b2_linearSlop;
    },
    SolveTOIPositionConstraints: function(toiIndexA, toiIndexB)
    {
        var minSeparation = 0.0;

        for (var i = 0; i < this.m_count; ++i)
        {
            var pc = this.m_positionConstraints[i];

            var indexA = pc.indexA;
            var indexB = pc.indexB;
            var localCenterA = pc.localCenterA;
            var localCenterB = pc.localCenterB;
            var pointCount = pc.pointCount;

            var mA = 0.0;
            var iA = 0.0;
            if (indexA == toiIndexA || indexA == toiIndexB)
            {
                mA = pc.invMassA;
                iA = pc.invIA;
            }

            var mB = 0.0;
            var iB = 0.0;
            if (indexB == toiIndexA || indexB == toiIndexB)
            {
                mB = pc.invMassB;
                iB = pc.invIB;
            }

            var cA = this.m_positions[indexA].c;
            var aA = this.m_positions[indexA].a;

            var cB = this.m_positions[indexB].c;
            var aB = this.m_positions[indexB].a;

            // Solve normal constraints
            for (var j = 0; j < pointCount; ++j)
            {
                b2ContactSolver.cs_xfA.q.Set(aA);
                b2ContactSolver.cs_xfB.q.Set(aB);
                b2ContactSolver.cs_xfA.p.Assign(b2Vec2.Subtract(cA, b2Mul_r_v2(b2ContactSolver.cs_xfA.q, localCenterA)));
                b2ContactSolver.cs_xfB.p.Assign(b2Vec2.Subtract(cB, b2Mul_r_v2(b2ContactSolver.cs_xfB.q, localCenterB)));

                b2ContactSolver.temp_solver_manifold.Initialize(pc, b2ContactSolver.cs_xfA, b2ContactSolver.cs_xfB, j);
                var normal = b2ContactSolver.temp_solver_manifold.normal;

                var point = b2ContactSolver.temp_solver_manifold.point;
                var separation = b2ContactSolver.temp_solver_manifold.separation;

                var rA = b2Vec2.Subtract(point, cA);
                var rB = b2Vec2.Subtract(point, cB);

                // Track max constraint error.
                minSeparation = b2Min(minSeparation, separation);

                // Prevent large corrections and allow slop.
                var C = b2Clamp(b2_toiBaugarte * (separation + b2_linearSlop), -b2_maxLinearCorrection, 0.0);

                // Compute the effective mass.
                var rnA = b2Cross_v2_v2(rA, normal);
                var rnB = b2Cross_v2_v2(rB, normal);
                var K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;

                // Compute normal impulse
                var impulse = K > 0.0 ? - C / K : 0.0;

                var P = b2Vec2.Multiply(impulse, normal);

                cA.Subtract(b2Vec2.Multiply(mA, P));
                aA -= iA * b2Cross_v2_v2(rA, P);

                cB.Add(b2Vec2.Multiply(mB, P));
                aB += iB * b2Cross_v2_v2(rB, P);
            }

            this.m_positions[indexA].a = aA;

            this.m_positions[indexB].a = aB;
        }

        // We can't expect minSpeparation >= -b2_linearSlop because we don't
        // push the separation above -b2_linearSlop.
        return minSeparation >= -1.5 * b2_linearSlop;
    }
};
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// This is an internal class.
function b2Island()
{
    this.m_bodies = [];
    this.m_contacts = [];
    this.m_joints = [];

    this.m_velocities = [];
    this.m_positions = [];
}

var profile_solve_init = b2Profiler.create("solve initialization", "solve");
var profile_solve_init_warmStarting = b2Profiler.create("warm starting", "solve initialization");
var profile_solve_velocity = b2Profiler.create("solve velocities", "solve");
var profile_solve_position = b2Profiler.create("solve positions", "solve");

b2Island._solverData = new b2SolverData();
b2Island._solverDef = new b2ContactSolverDef();
b2Island._solver = new b2ContactSolver();

b2Island.prototype =
{
    Clear: function()
    {
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
    },

    Initialize: function(bodyCapacity, contactCapacity, jointCapacity, listener)
    {
        this.m_listener = listener;

        this.m_bodyCapacity = bodyCapacity;
        this.m_contactCapacity = contactCapacity;
        this.m_jointCapacity = jointCapacity;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;

        this.m_bodies.length = bodyCapacity;
        this.m_contacts.length = contactCapacity;
        this.m_joints.length = jointCapacity;

        this.m_velocities.length = bodyCapacity;
        this.m_positions.length = bodyCapacity;
    },

    Solve: function(step, gravity, allowSleep)
    {
        profile_solve_init.start();

        var h = step.dt;

        // Integrate velocities and apply damping. Initialize the body state.
        for (var i = 0; i < this.m_bodyCount; ++i)
        {
            var b = this.m_bodies[i];

            this.m_positions[i].c.Assign(b.m_sweep.c);
            var a = b.m_sweep.a;
            this.m_velocities[i].v.Assign(b.m_linearVelocity);
            var w = b.m_angularVelocity;

            // Store positions for continuous collision.
            b.m_sweep.c0.Assign(b.m_sweep.c);
            b.m_sweep.a0 = b.m_sweep.a;

            if (b.m_type == b2Body.b2_dynamicBody)
            {
                // Integrate velocities.
                //this.m_velocities[i].v.Add(b2Vec2.Multiply(h, b2Vec2.Add(b2Vec2.Multiply(b.m_gravityScale, gravity), b2Vec2.Multiply(b.m_invMass, b.m_force))));
                this.m_velocities[i].v.x += h * ((b.m_gravityScale * gravity.x) + (b.m_invMass * b.m_force.x));
                this.m_velocities[i].v.y += h * ((b.m_gravityScale * gravity.y) + (b.m_invMass * b.m_force.y));
                w += h * b.m_invI * b.m_torque;

                // Apply damping.
                // ODE: dv/dt + c * v = 0
                // Solution: v(t) = v0 * exp(-c * t)
                // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
                // v2 = exp(-c * dt) * v1
                // Pade approximation:
                // v2 = v1 * 1 / (1 + c * dt)
                //this.m_velocities[i].v.Multiply(1.0 / (1.0 + h * b.m_linearDamping));
                this.m_velocities[i].v.x *= 1.0 / (1.0 + h * b.m_linearDamping);
                this.m_velocities[i].v.y *= 1.0 / (1.0 + h * b.m_linearDamping);
                w *= 1.0 / (1.0 + h * b.m_angularDamping);
            }

            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;
        }

        // Solver data
        b2Island._solverData.step = step;
        b2Island._solverData.positions = this.m_positions;
        b2Island._solverData.velocities = this.m_velocities;

        // Initialize velocity constraints.
        b2Island._solverDef.step = step;
        b2Island._solverDef.contacts = this.m_contacts;
        b2Island._solverDef.count = this.m_contactCount;
        b2Island._solverDef.positions = this.m_positions;
        b2Island._solverDef.velocities = this.m_velocities;
        b2Island._solverDef.allocator = this.m_allocator;

        b2Island._solver.Init(b2Island._solverDef);
        b2Island._solver.InitializeVelocityConstraints();

        if (step.warmStarting)
        {
            profile_solve_init_warmStarting.start();
            b2Island._solver.WarmStart();
            profile_solve_init_warmStarting.stop();
        }

        for (var i = 0; i < this.m_jointCount; ++i)
        {
            this.m_joints[i].InitVelocityConstraints(b2Island._solverData);
        }

        profile_solve_init.stop();

        // Solve velocity constraints
        profile_solve_velocity.start();
        for (var i = 0; i < step.velocityIterations; ++i)
        {
            for (var j = 0; j < this.m_jointCount; ++j)
            {
                this.m_joints[j].SolveVelocityConstraints(b2Island._solverData);
            }

            b2Island._solver.SolveVelocityConstraints();
        }

        // Store impulses for warm starting
        b2Island._solver.StoreImpulses();

        profile_solve_velocity.stop();
        profile_solve_position.start();

        // Integrate positions
        for (var i = 0; i < this.m_bodyCount; ++i)
        {
            var c = this.m_positions[i].c;
            var a = this.m_positions[i].a;
            var v = this.m_velocities[i].v;
            var w = this.m_velocities[i].w;

            // Check for large velocities
            var translationx = h * v.x;
            var translationy = h * v.y;
            var translationl = translationx * translationx + translationy * translationy;

            if (translationl/*b2Dot_v2_v2(translation, translation)*/ > b2_maxTranslationSquared)
            {
                var ratio = b2_maxTranslation / b2Sqrt(translationl);
                v.x *= ratio;
                v.y *= ratio;
            }

            var rotation = h * w;
            if (rotation * rotation > b2_maxRotationSquared)
            {
                var ratio = b2_maxRotation / b2Abs(rotation);
                w *= ratio;
            }

            // Integrate
            //c.Add(b2Vec2.Multiply(h, v));
            c.x += h * v.x;
            c.y += h * v.y;
            a += h * w;

            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;
        }

        // Solve position constraints
        var positionSolved = false;
        for (var i = 0; i < step.positionIterations; ++i)
        {
            var contactsOkay = b2Island._solver.SolvePositionConstraints();

            var jointsOkay = true;
            for (var j = 0; j < this.m_jointCount; ++j)
            {
                var jointOkay = this.m_joints[j].SolvePositionConstraints(b2Island._solverData);
                jointsOkay = jointsOkay && jointOkay;
            }

            if (contactsOkay && jointsOkay)
            {
                // Exit early if the position errors are small.
                positionSolved = true;
                break;
            }
        }

        // Copy state buffers back to the bodies
        for (var i = 0; i < this.m_bodyCount; ++i)
        {
            var body = this.m_bodies[i];
            body.m_sweep.c.Assign(this.m_positions[i].c);
            body.m_sweep.a = this.m_positions[i].a;
            body.m_linearVelocity.Assign(this.m_velocities[i].v);
            body.m_angularVelocity = this.m_velocities[i].w;
            body.SynchronizeTransform();
        }

        profile_solve_position.stop();

        this.Report(b2Island._solver.m_velocityConstraints);

        if (allowSleep)
        {
            var minSleepTime = b2_maxFloat;

            var linTolSqr = b2_linearSleepTolerance * b2_linearSleepTolerance;
            var angTolSqr = b2_angularSleepTolerance * b2_angularSleepTolerance;

            for (var i = 0; i < this.m_bodyCount; ++i)
            {
                var b = this.m_bodies[i];
                if (b.GetType() == b2Body.b2_staticBody)
                {
                    continue;
                }

                if ((b.m_flags & b2Body.e_autoSleepFlag) == 0 ||
                    b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
                    b2Dot_v2_v2(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr)
                {
                    b.m_sleepTime = 0.0;
                    minSleepTime = 0.0;
                }
                else
                {
                    b.m_sleepTime += h;
                    minSleepTime = b2Min(minSleepTime, b.m_sleepTime);
                }
            }

            if (minSleepTime >= b2_timeToSleep && positionSolved)
            {
                for (var i = 0; i < this.m_bodyCount; ++i)
                {
                    var b = this.m_bodies[i];
                    b.SetAwake(false);
                }
            }
        }
    },

    SolveTOI: function(subStep, toiIndexA, toiIndexB)
    {

        b2Assert(toiIndexA < this.m_bodyCount);
        b2Assert(toiIndexB < this.m_bodyCount);


        // Initialize the body state.
        for (var i = 0; i < this.m_bodyCount; ++i)
        {
            var b = this.m_bodies[i];
            this.m_positions[i].c.Assign(b.m_sweep.c);
            this.m_positions[i].a = b.m_sweep.a;
            this.m_velocities[i].v.Assign(b.m_linearVelocity);
            this.m_velocities[i].w = b.m_angularVelocity;
        }

        b2Island._solverDef.contacts = this.m_contacts;
        b2Island._solverDef.count = this.m_contactCount;
        b2Island._solverDef.step = subStep;
        b2Island._solverDef.positions = this.m_positions;
        b2Island._solverDef.velocities = this.m_velocities;
        b2Island._solver.Init(b2Island._solverDef);

        // Solve position constraints.
        for (var i = 0; i < subStep.positionIterations; ++i)
        {
            var contactsOkay = b2Island._solver.SolveTOIPositionConstraints(toiIndexA, toiIndexB);
            if (contactsOkay)
            {
                break;
            }
        }

        // Leap of faith to new safe state.
        this.m_bodies[toiIndexA].m_sweep.c0.Assign(this.m_positions[toiIndexA].c);
        this.m_bodies[toiIndexA].m_sweep.a0 = this.m_positions[toiIndexA].a;
        this.m_bodies[toiIndexB].m_sweep.c0.Assign(this.m_positions[toiIndexB].c);
        this.m_bodies[toiIndexB].m_sweep.a0 = this.m_positions[toiIndexB].a;

        // No warm starting is needed for TOI events because warm
        // starting impulses were applied in the discrete solver.
        b2Island._solver.InitializeVelocityConstraints();

        // Solve velocity constraints.
        for (var i = 0; i < subStep.velocityIterations; ++i)
        {
            b2Island._solver.SolveVelocityConstraints();
        }

        // Don't store the TOI contact forces for warm starting
        // because they can be quite large.

        var h = subStep.dt;

        // Integrate positions
        for (var i = 0; i < this.m_bodyCount; ++i)
        {
            var c = this.m_positions[i].c;
            var a = this.m_positions[i].a;
            var v = this.m_velocities[i].v;
            var w = this.m_velocities[i].w;

            // Check for large velocities
            var translation = b2Vec2.Multiply(h, v);
            if (b2Dot_v2_v2(translation, translation) > b2_maxTranslationSquared)
            {
                var ratio = b2_maxTranslation / translation.Length();
                v.Multiply(ratio);
            }

            var rotation = h * w;
            if (rotation * rotation > b2_maxRotationSquared)
            {
                var ratio = b2_maxRotation / b2Abs(rotation);
                w *= ratio;
            }

            // Integrate
            c.Add(b2Vec2.Multiply(h, v));
            a += h * w;

            this.m_positions[i].a = a;
            this.m_velocities[i].w = w;

            // Sync bodies
            var body = this.m_bodies[i];
            body.m_sweep.c.Assign(c);
            body.m_sweep.a = a;
            body.m_linearVelocity.Assign(v);
            body.m_angularVelocity = w;
            body.SynchronizeTransform();
        }

        this.Report(b2Island._solver.m_velocityConstraints);
    },

    AddBody: function(body)
    {

        b2Assert(this.m_bodyCount < this.m_bodyCapacity);

        body.m_islandIndex = this.m_bodyCount;
        this.m_bodies[this.m_bodyCount] = body;

        if (!this.m_positions[this.m_bodyCount])
        {
            this.m_positions[this.m_bodyCount] = new b2Position();
            this.m_velocities[this.m_bodyCount] = new b2Velocity();
        }

        ++this.m_bodyCount;
    },

    AddContact: function(contact)
    {

        b2Assert(this.m_contactCount < this.m_contactCapacity);

        this.m_contacts[this.m_contactCount++] = contact;
    },

    AddJoint: function(joint)
    {

        b2Assert(this.m_jointCount < this.m_jointCapacity);

        this.m_joints[this.m_jointCount++] = joint;
    },

    Report: function(constraints)
    {
        if (this.m_listener == null)
        {
            return;
        }

        for (var i = 0; i < this.m_contactCount; ++i)
        {
            var c = this.m_contacts[i];

            var vc = constraints[i];

            var impulse = new b2ContactImpulse();
            impulse.count = vc.pointCount;
            for (var j = 0; j < vc.pointCount; ++j)
            {
                impulse.normalImpulses[j] = vc.points[j].normalImpulse;
                impulse.tangentImpulses[j] = vc.points[j].tangentImpulse;
            }

            this.m_listener.PostSolve(c, impulse);
        }
    }
};

/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

function b2Jacobian()
{
    this.linear = new b2Vec2();
    this.angularA = 0;
    this.angularB = 0;
};

/// A joint edge is used to connect bodies and joints together
/// in a joint graph where each body is a node and each joint
/// is an edge. A joint edge belongs to a doubly linked list
/// maintained in each attached body. Each joint has two joint
/// nodes, one for each attached body.
function b2JointEdge()
{
    this.other = null;          ///< provides quick access to the other body attached.
    this.joint = null;          ///< the joint
    this.prev = null;           ///< the previous joint edge in the body's joint list
    this.next = null;           ///< the next joint edge in the body's joint list
};

/// Joint definitions are used to construct joints.
function b2JointDef()
{
    this.type = b2Joint.e_unknownJoint;
    this.userData = null;
    this.bodyA = null;
    this.bodyB = null;
    this.collideConnected = false;
};

b2JointDef.prototype =
{
    _deserialize: function(data, bodies, joints)
    {
        this.bodyA = bodies[data['bodyA']];
        this.bodyB = bodies[data['bodyB']];
        this.collideConnected = data['collideConnected'];
    }
};

/// The base joint class. Joints are used to constraint two bodies together in
/// various fashions. Some joints also feature limits and motors.
function b2Joint(def)
{

    b2Assert(def.bodyA != def.bodyB);


    this.m_type = def.type;
    this.m_prev = null;
    this.m_next = null;
    this.m_bodyA = def.bodyA;
    this.m_bodyB = def.bodyB;
    this.m_index = 0;
    this.m_collideConnected = def.collideConnected;
    this.m_islandFlag = false;
    this.m_userData = def.userData;

    this.m_edgeA = new b2JointEdge();
    this.m_edgeA.joint = null;
    this.m_edgeA.other = null;
    this.m_edgeA.prev = null;
    this.m_edgeA.next = null;

    this.m_edgeB = new b2JointEdge();
    this.m_edgeB.joint = null;
    this.m_edgeB.other = null;
    this.m_edgeB.prev = null;
    this.m_edgeB.next = null;
}

b2Joint.prototype =
{
    /// Get the type of the concrete joint.
    GetType: function()
    {
        return this.m_type;
    },

    /// Get the first body attached to this joint.
    GetBodyA: function()
    {
        return this.m_bodyA;
    },

    /// Get the second body attached to this joint.
    GetBodyB: function()
    {
        return this.m_bodyB;
    },

    /// Get the anchor point on bodyA in world coordinates.
    GetAnchorA: function() { },

    /// Get the anchor point on bodyB in world coordinates.
    GetAnchorB: function() { },

    /// Get the reaction force on bodyB at the joint anchor in Newtons.
    GetReactionForce: function(inv_dt) { },

    /// Get the reaction torque on bodyB in N*m.
    GetReactionTorque: function(inv_dt) { },

    /// Get the next joint the world joint list.
    GetNext: function()
    {
        return this.m_next;
    },

    /// Get the user data pointer.
    GetUserData: function()
    {
        return this.m_userData;
    },

    /// Set the user data pointer.
    SetUserData: function(data)
    {
        this.m_userData = data;
    },

    /// Short-cut function to determine if either body is inactive.
    IsActive: function()
    {
        return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
    },

    /// Get collide connected.
    /// Note: modifying the collide connect flag won't work correctly because
    /// the flag is only checked when fixture AABBs begin to overlap.
    GetCollideConnected: function()
    {
        return this.m_collideConnected;
    },

    /// Shift the origin for any points stored in world coordinates.
    ShiftOrigin: function(newOrigin) { },

    InitVelocityConstraints: function(data) { },
    SolveVelocityConstraints: function(data) { },

    // This returns true if the position errors are within tolerance.
    SolvePositionConstraints: function(data) { },

    _serialize: function(out)
    {
        var obj = out || {};

        // filled in later by serializer
        obj['bodyA'] = null;
        obj['bodyB'] = null;
        obj['type'] = this.m_type;
        obj['collideConnected'] = this.m_collideConnected;

        return obj;
    }
};

b2Joint.e_inactiveLimit = 0;
b2Joint.e_atLowerLimit = 1;
b2Joint.e_atUpperLimit = 2;
b2Joint.e_equalLimits = 3;

b2Joint.e_unknownJoint = 0;
b2Joint.e_revoluteJoint = 1;
b2Joint.e_prismaticJoint = 2;
b2Joint.e_distanceJoint = 3;
b2Joint.e_pulleyJoint = 4;
b2Joint.e_mouseJoint = 5;
b2Joint.e_gearJoint = 6;
b2Joint.e_wheelJoint = 7;
b2Joint.e_weldJoint = 8;
b2Joint.e_frictionJoint = 9;
b2Joint.e_ropeJoint = 10;
b2Joint.e_motorJoint = 11;

b2Joint.Create = function(def)
{
    var joint = null;

    switch (def.type)
    {
    case b2Joint.e_distanceJoint:
        joint = new b2DistanceJoint(def);
        break;

    case b2Joint.e_mouseJoint:
        joint = new b2MouseJoint(def);
        break;

    case b2Joint.e_prismaticJoint:
        joint = new b2PrismaticJoint(def);
        break;

    case b2Joint.e_revoluteJoint:
        joint = new b2RevoluteJoint(def);
        break;

    case b2Joint.e_pulleyJoint:
        joint = new b2PulleyJoint(def);
        break;

    case b2Joint.e_gearJoint:
        joint = new b2GearJoint(def);
        break;

    case b2Joint.e_wheelJoint:
        joint = new b2WheelJoint(def);
        break;

    case b2Joint.e_weldJoint:
        joint = new b2WeldJoint(def);
        break;

    case b2Joint.e_frictionJoint:
        joint = new b2FrictionJoint(def);
        break;

    case b2Joint.e_ropeJoint:
        joint = new b2RopeJoint(def);
        break;

    case b2Joint.e_motorJoint:
        joint = new b2MotorJoint(def);
        break;
        

    default:
        b2Assert(false);
        break;

    }

    return joint;
};

b2Joint.Destroy = function(joint)
{
};
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Revolute joint definition. This requires defining an
/// anchor point where the bodies are joined. The definition
/// uses local anchor points so that the initial configuration
/// can violate the constraint slightly. You also need to
/// specify the initial relative angle for joint limits. This
/// helps when saving and loading a game.
/// The local anchor points are measured from the body's origin
/// rather than the center of mass because:
/// 1. you might not know where the center of mass will be.
/// 2. if you add/remove shapes from a body and recompute the mass,
///    the joints will be broken.
function b2RevoluteJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_revoluteJoint;
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.referenceAngle = 0.0;
    this.lowerAngle = 0.0;
    this.upperAngle = 0.0;
    this.maxMotorTorque = 0.0;
    this.motorSpeed = 0.0;
    this.enableLimit = false;
    this.enableMotor = false;

    Object.seal(this);
}

b2RevoluteJointDef.prototype =
{
    /// Initialize the bodies, anchors, and reference angle using a world
    /// anchor point.
    Initialize: function(bA, bB, anchor)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.referenceAngle = data['referenceAngle'];
        this.lowerAngle = data['lowerAngle'];
        this.upperAngle = data['upperAngle'];
        this.maxMotorTorque = data['maxMotorTorque'];
        this.motorSpeed = data['motorSpeed'];
        this.enableLimit = data['enableLimit'];
        this.enableMotor = data['enableMotor'];
    }
};

b2RevoluteJointDef._extend(b2JointDef);

/// A revolute joint constrains two bodies to share a common point while they
/// are free to rotate about the point. The relative rotation about the shared
/// point is the joint angle. You can limit the relative rotation with
/// a joint limit that specifies a lower and upper angle. You can use a motor
/// to drive the relative rotation about the shared point. A maximum motor torque
/// is provided so that infinite forces are not generated.
function b2RevoluteJoint(def)
{
    this.parent.call(this, def);

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();
    this.m_referenceAngle = def.referenceAngle;

    this.m_impulse = new b2Vec3();
    this.m_motorImpulse = 0.0;

    this.m_lowerAngle = def.lowerAngle;
    this.m_upperAngle = def.upperAngle;
    this.m_maxMotorTorque = def.maxMotorTorque;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableLimit = def.enableLimit;
    this.m_enableMotor = def.enableMotor;
    this.m_limitState = b2Joint.e_inactiveLimit;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_mass = new b2Mat33();            // effective mass for point-to-point constraint.
    this.m_motorMass = 0;   // effective mass for motor/limit angular constraint.
}

b2RevoluteJoint.prototype =
{
    GetAnchorA: function()
    {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    },
    GetAnchorB: function()
    {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// Get the reference angle.
    GetReferenceAngle: function() { return this.m_referenceAngle; },

    /// Get the current joint angle in radians.
    GetJointAngle: function()
    {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        return bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
    },

    /// Get the current joint angle speed in radians per second.
    GetJointSpeed: function()
    {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        return bB.m_angularVelocity - bA.m_angularVelocity;
    },

    /// Is the joint limit enabled?
    IsLimitEnabled: function()
    {
        return this.m_enableLimit;
    },

    /// Enable/disable the joint limit.
    EnableLimit: function(flag)
    {
        if (flag != this.m_enableLimit)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableLimit = flag;
            this.m_impulse.z = 0.0;
        }
    },

    /// Get the lower joint limit in radians.
    GetLowerLimit: function()
    {
        return this.m_lowerAngle;
    },

    /// Get the upper joint limit in radians.
    GetUpperLimit: function()
    {
        return this.m_upperAngle;
    },

    /// Set the joint limits in radians.
    SetLimits: function(lower, upper)
    {

        b2Assert(lower <= upper);


        if (lower != this.m_lowerAngle || upper != this.m_upperAngle)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_impulse.z = 0.0;
            this.m_lowerAngle = lower;
            this.m_upperAngle = upper;
        }
    },

    /// Is the joint motor enabled?
    IsMotorEnabled: function()
    {
        return this.m_enableMotor;
    },

    /// Enable/disable the joint motor.
    EnableMotor: function(flag)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_enableMotor = flag;
    },

    /// Set the motor speed in radians per second.
    SetMotorSpeed: function(speed)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_motorSpeed = speed;
    },

    /// Get the motor speed in radians per second.
    GetMotorSpeed: function()
    {
        return this.m_motorSpeed;
    },

    /// Set the maximum motor torque, usually in N-m.
    SetMaxMotorTorque: function(torque)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_maxMotorTorque = torque;
    },
    GetMaxMotorTorque: function() { return this.m_maxMotorTorque; },

    /// Get the reaction force given the inverse time step.
    /// Unit is N.
    GetReactionForce: function(inv_dt)
    {
        var P = new b2Vec2(this.m_impulse.x, this.m_impulse.y);
        return b2Vec2.Multiply(inv_dt, P);
    },

    /// Get the reaction torque due to the joint limit given the inverse time step.
    /// Unit is N*m.
    GetReactionTorque: function(inv_dt) { return inv_dt * this.m_impulse.z; },

    /// Get the current motor torque given the inverse time step.
    /// Unit is N*m.
    GetMotorTorque: function(inv_dt)
    {
        return inv_dt * this.m_motorImpulse;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
        this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        this.m_rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        this.m_rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));

        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]

        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var fixedRotation = (iA + iB == 0.0);

        this.m_mass.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
        this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
        this.m_mass.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
        this.m_mass.ex.y = this.m_mass.ey.x;
        this.m_mass.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
        this.m_mass.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
        this.m_mass.ex.z = this.m_mass.ez.x;
        this.m_mass.ey.z = this.m_mass.ez.y;
        this.m_mass.ez.z = iA + iB;

        this.m_motorMass = iA + iB;
        if (this.m_motorMass > 0.0)
        {
            this.m_motorMass = 1.0 / this.m_motorMass;
        }

        if (this.m_enableMotor == false || fixedRotation)
        {
            this.m_motorImpulse = 0.0;
        }

        if (this.m_enableLimit && fixedRotation == false)
        {
            var jointAngle = aB - aA - this.m_referenceAngle;
            if (b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2_angularSlop)
            {
                this.m_limitState = b2Joint.e_equalLimits;
            }
            else if (jointAngle <= this.m_lowerAngle)
            {
                if (this.m_limitState != b2Joint.e_atLowerLimit)
                {
                    this.m_impulse.z = 0.0;
                }
                this.m_limitState = b2Joint.e_atLowerLimit;
            }
            else if (jointAngle >= this.m_upperAngle)
            {
                if (this.m_limitState != b2Joint.e_atUpperLimit)
                {
                    this.m_impulse.z = 0.0;
                }
                this.m_limitState = b2Joint.e_atUpperLimit;
            }
            else
            {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_impulse.z = 0.0;
            }
        }
        else
        {
            this.m_limitState = b2Joint.e_inactiveLimit;
        }

        if (data.step.warmStarting)
        {
            // Scale impulses to support a variable time step.
            this.m_impulse.Multiply(data.step.dtRatio);
            this.m_motorImpulse *= data.step.dtRatio;

            var P = new b2Vec2(this.m_impulse.x, this.m_impulse.y);

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + this.m_motorImpulse + this.m_impulse.z);

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + this.m_motorImpulse + this.m_impulse.z);
        }
        else
        {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var fixedRotation = (iA + iB == 0.0);

        // Solve motor constraint.
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits && fixedRotation == false)
        {
            var Cdot = wB - wA - this.m_motorSpeed;
            var impulse = -this.m_motorMass * Cdot;
            var oldImpulse = this.m_motorImpulse;
            var maxImpulse = data.step.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;

            wA -= iA * impulse;
            wB += iB * impulse;
        }

        // Solve limit constraint.
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && fixedRotation == false)
        {
            var Cdot1 = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB)), vA), b2Cross_f_v2(wA, this.m_rA));
            var Cdot2 = wB - wA;
            var Cdot = new b2Vec3(Cdot1.x, Cdot1.y, Cdot2);

            var impulse = this.m_mass.Solve33(Cdot).Negate();

            if (this.m_limitState == b2Joint.e_equalLimits)
            {
                this.m_impulse.Add(impulse);
            }
            else if (this.m_limitState == b2Joint.e_atLowerLimit)
            {
                var newImpulse = this.m_impulse.z + impulse.z;
                if (newImpulse < 0.0)
                {
                    var rhs = b2Vec2.Add(Cdot1.Negate(), b2Vec2.Multiply(this.m_impulse.z, new b2Vec2(this.m_mass.ez.x, this.m_mass.ez.y)));
                    var reduced = this.m_mass.Solve22(rhs);
                    impulse.x = reduced.x;
                    impulse.y = reduced.y;
                    impulse.z = -this.m_impulse.z;
                    this.m_impulse.x += reduced.x;
                    this.m_impulse.y += reduced.y;
                    this.m_impulse.z = 0.0;
                }
                else
                {
                    this.m_impulse.Add(impulse);
                }
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit)
            {
                var newImpulse = this.m_impulse.z + impulse.z;
                if (newImpulse > 0.0)
                {
                    var rhs = b2Vec2.Add(Cdot1.Negate(), b2Vec2.Multiply(this.m_impulse.z, new b2Vec2(this.m_mass.ez.x, this.m_mass.ez.y)));
                    var reduced = this.m_mass.Solve22(rhs);
                    impulse.x = reduced.x;
                    impulse.y = reduced.y;
                    impulse.z = -this.m_impulse.z;
                    this.m_impulse.x += reduced.x;
                    this.m_impulse.y += reduced.y;
                    this.m_impulse.z = 0.0;
                }
                else
                {
                    this.m_impulse.Add(impulse);
                }
            }

            var P = new b2Vec2(impulse.x, impulse.y);

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + impulse.z);

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + impulse.z);
        }
        else
        {
            // Solve point-to-point constraint
            var Cdot = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB)), vA), b2Cross_f_v2(wA, this.m_rA));
            var impulse = this.m_mass.Solve22(Cdot.Negate());

            this.m_impulse.x += impulse.x;
            this.m_impulse.y += impulse.y;

            vA.Subtract(b2Vec2.Multiply(mA, impulse));
            wA -= iA * b2Cross_v2_v2(this.m_rA, impulse);

            vB.Add(b2Vec2.Multiply(mB, impulse));
            wB += iB * b2Cross_v2_v2(this.m_rB, impulse);
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var angularError = 0.0;
        var positionError = 0.0;

        var fixedRotation = (this.m_invIA + this.m_invIB == 0.0);

        // Solve angular limit constraint.
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && fixedRotation == false)
        {
            var angle = aB - aA - this.m_referenceAngle;
            var limitImpulse = 0.0;

            if (this.m_limitState == b2Joint.e_equalLimits)
            {
                // Prevent large angular corrections
                var C = b2Clamp(angle - this.m_lowerAngle, -b2_maxAngularCorrection, b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * C;
                angularError = b2Abs(C);
            }
            else if (this.m_limitState == b2Joint.e_atLowerLimit)
            {
                var C = angle - this.m_lowerAngle;
                angularError = -C;

                // Prevent large angular corrections and allow some slop.
                C = b2Clamp(C + b2_angularSlop, -b2_maxAngularCorrection, 0.0);
                limitImpulse = -this.m_motorMass * C;
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit)
            {
                var C = angle - this.m_upperAngle;
                angularError = C;

                // Prevent large angular corrections and allow some slop.
                C = b2Clamp(C - b2_angularSlop, 0.0, b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * C;
            }

            aA -= this.m_invIA * limitImpulse;
            aB += this.m_invIB * limitImpulse;
        }

        // Solve point-to-point constraint.
        {
            qA.Set(aA);
            qB.Set(aB);
            var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
            var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));

            var C = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);
            positionError = C.Length();

            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;

            var K = new b2Mat22();
            K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
            K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
            K.ey.x = K.ex.y;
            K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;

            var impulse = K.Solve(C).Negate();

            cA.Subtract(b2Vec2.Multiply(mA, impulse));
            aA -= iA * b2Cross_v2_v2(rA, impulse);

            cB.Add(b2Vec2.Multiply(mB, impulse));
            aB += iB * b2Cross_v2_v2(rB, impulse);
        }

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return positionError <= b2_linearSlop && angularError <= b2_angularSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['referenceAngle'] = this.m_referenceAngle;
        obj['lowerAngle'] = this.m_lowerAngle;
        obj['upperAngle'] = this.m_upperAngle;
        obj['maxMotorTorque'] = this.m_maxMotorTorque;
        obj['motorSpeed'] = this.m_motorSpeed;
        obj['enableLimit'] = this.m_enableLimit;
        obj['enableMotor'] = this.m_enableMotor;

        return obj;
    }
};

b2RevoluteJoint._extend(b2Joint);


/// Mouse joint definition. This requires a world target point,
/// tuning parameters, and the time step.
function b2MouseJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_mouseJoint;
    this.target = new b2Vec2(0.0, 0.0);
    this.maxForce = 0.0;
    this.frequencyHz = 5.0;
    this.dampingRatio = 0.7;

    Object.seal(this);
}

b2MouseJointDef._extend(b2JointDef);

/// A mouse joint is used to make a point on a body track a
/// specified world point. This a soft constraint with a maximum
/// force. This allows the constraint to stretch and without
/// applying huge forces.
/// NOTE: this joint is not documented in the manual because it was
/// developed to be used in the testbed. If you want to learn how to
/// use the mouse joint, look at the testbed.
function b2MouseJoint(def)
{
    this.parent.call(this, def);


    b2Assert(def.target.IsValid());
    b2Assert(b2IsValid(def.maxForce) && def.maxForce >= 0.0);
    b2Assert(b2IsValid(def.frequencyHz) && def.frequencyHz >= 0.0);
    b2Assert(b2IsValid(def.dampingRatio) && def.dampingRatio >= 0.0);


    this.m_targetA = def.target.Clone();
    this.m_localAnchorB = b2MulT_t_v2(this.m_bodyB.GetTransform(), this.m_targetA);

    this.m_maxForce = def.maxForce;
    this.m_impulse = new b2Vec2();

    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_beta = 0.0;
    this.m_gamma = 0.0;

    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_rB = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassB = 0;
    this.m_invIB = 0;
    this.m_mass = new b2Mat22();
    this.m_C = new b2Vec2();
}

b2MouseJoint.prototype =
{
    /// Implements b2Joint.
    GetAnchorA: function()
    {
        return this.m_targetA;
    },

    /// Implements b2Joint.
    GetAnchorB: function()
    {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    },

    /// Implements b2Joint.
    GetReactionForce: function(inv_dt)
    {
        return b2Vec2.Multiply(inv_dt, this.m_impulse);
    },

    /// Implements b2Joint.
    GetReactionTorque: function(inv_dt)
    {
        return inv_dt * 0.0;
    },

    /// Use this to update the target point.
    SetTarget: function(target)
    {
        if (this.m_bodyB.IsAwake() == false)
        {
            this.m_bodyB.SetAwake(true);
        }
        this.m_targetA.Assign(target);
    },
    GetTarget: function()
    {
        return this.m_targetA;
    },

    /// Set/get the maximum force in Newtons.
    SetMaxForce: function(force)
    {
        this.m_maxForce = force;
    },
    GetMaxForce: function()
    {
        return this.m_maxForce;
    },

    /// Set/get the frequency in Hertz.
    SetFrequency: function(hz)
    {
        this.m_frequencyHz = hz;
    },
    GetFrequency: function()
    {
        return this.m_frequencyHz;
    },

    /// Set/get the damping ratio (dimensionless).
    SetDampingRatio: function(ratio)
    {
        this.m_dampingRatio = ratio;
    },
    GetDampingRatio: function()
    {
        return this.m_dampingRatio;
    },

    /// Implement b2Joint::ShiftOrigin
    ShiftOrigin: function(newOrigin)
    {
        this.m_targetA.Subtract(newOrigin);
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIB = this.m_bodyB.m_invI;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qB = new b2Rot(aB);

        var mass = this.m_bodyB.GetMass();

        // Frequency
        var omega = 2.0 * b2_pi * this.m_frequencyHz;

        // Damping coefficient
        var d = 2.0 * mass * this.m_dampingRatio * omega;

        // Spring stiffness
        var k = mass * (omega * omega);

        // magic formulas
        // gamma has units of inverse mass.
        // beta has units of inverse time.
        var h = data.step.dt;

        b2Assert(d + h * k > b2_epsilon);

        this.m_gamma = h * (d + h * k);
        if (this.m_gamma != 0.0)
        {
            this.m_gamma = 1.0 / this.m_gamma;
        }
        this.m_beta = h * k * this.m_gamma;

        // Compute the effective mass matrix.
        this.m_rB.Assign(b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB)));

        // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
        //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
        //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
        var K = new b2Mat22();
        K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
        K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
        K.ey.x = K.ex.y;
        K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;

        this.m_mass.Assign(K.GetInverse());

        this.m_C.Assign(b2Vec2.Subtract(b2Vec2.Add(cB, this.m_rB), this.m_targetA));
        this.m_C.Multiply(this.m_beta);

        // Cheat with some damping
        wB *= 0.98;

        if (data.step.warmStarting)
        {
            this.m_impulse.Multiply(data.step.dtRatio);
            vB.Add(b2Vec2.Multiply(this.m_invMassB, this.m_impulse));
            wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, this.m_impulse);
        }
        else
        {
            this.m_impulse.SetZero();
        }

        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        // Cdot = v + cross(w, r)
        var Cdot = b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB));
        var impulse = b2Mul_m22_v2(this.m_mass, (b2Vec2.Add(b2Vec2.Add(Cdot, this.m_C), b2Vec2.Multiply(this.m_gamma, this.m_impulse))).Negate());

        var oldImpulse = this.m_impulse.Clone();
        this.m_impulse.Add(impulse);
        var maxImpulse = data.step.dt * this.m_maxForce;
        if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse)
        {
            this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
        }
        impulse.Assign(b2Vec2.Subtract(this.m_impulse, oldImpulse));

        vB.Add(b2Vec2.Multiply(this.m_invMassB, impulse));
        wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, impulse);

        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data)
    {
        return true;
    }
};

b2MouseJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Distance joint definition. This requires defining an
/// anchor point on both bodies and the non-zero length of the
/// distance joint. The definition uses local anchor points
/// so that the initial configuration can violate the constraint
/// slightly. This helps when saving and loading a game.
/// @warning Do not use a zero or short length.
function b2DistanceJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_distanceJoint;
    this.localAnchorA = new b2Vec2(0.0, 0.0);
    this.localAnchorB = new b2Vec2(0.0, 0.0);
    this.length = 1.0;
    this.frequencyHz = 0.0;
    this.dampingRatio = 0.0;

    Object.seal(this);
}

b2DistanceJointDef.prototype =
{
    /// Initialize the bodies, anchors, and length using the world
    /// anchors.
    Initialize: function(b1, b2,
                    anchor1, anchor2)
    {
        this.bodyA = b1;
        this.bodyB = b2;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor1);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor2);
        var d = b2Vec2.Subtract(anchor2, anchor1);
        this.length = d.Length();
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.length = data['length'];
        this.frequencyHz = data['frequencyHz'];
        this.dampingRatio = data['dampingRatio'];
    }
};

b2DistanceJointDef._extend(b2JointDef);

/// A distance joint constrains two points on two bodies
/// to remain at a fixed distance from each other. You can view
/// this as a massless, rigid rod.
function b2DistanceJoint(def)
{
    this.parent.call(this, def);

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();
    this.m_length = def.length;
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;
    this.m_impulse = 0.0;
    this.m_gamma = 0.0;
    this.m_bias = 0.0;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_u = new b2Vec2();
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_mass = 0;
}

b2DistanceJoint.prototype =
{
    GetAnchorA: function()
    {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    },
    GetAnchorB: function()
    {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    },

    /// Get the reaction force given the inverse time step.
    /// Unit is N.
    GetReactionForce: function(inv_dt)
    {
        var F = b2Vec2.Multiply((inv_dt * this.m_impulse), this.m_u);
        return F;
    },

    /// Get the reaction torque given the inverse time step.
    /// Unit is N*m. This is always zero for a distance joint.
    GetReactionTorque: function(inv_dt) { return 0.0; },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// Set/get the natural length.
    /// Manipulating the length can lead to non-physical behavior when the frequency is zero.
    SetLength: function(length)
    {
        this.m_length = length;
    },
    GetLength: function()
    {
        return this.m_length;
    },

    /// Set/get frequency in Hz.
    SetFrequency: function(hz)
    {
        this.m_frequencyHz = hz;
    },
    GetFrequency: function()
    {
        return this.m_frequencyHz;
    },

    /// Set/get damping ratio.
    SetDampingRatio: function(ratio)
    {
        this.m_dampingRatio = ratio;
    },
    GetDampingRatio: function()
    {
        return this.m_dampingRatio;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        this.m_rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        this.m_rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        this.m_u = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, this.m_rB), cA), this.m_rA);

        // Handle singularity.
        var length = this.m_u.Length();
        if (length > b2_linearSlop)
        {
            this.m_u.Multiply(1.0 / length);
        }
        else
        {
            this.m_u.Set(0.0, 0.0);
        }

        var crAu = b2Cross_v2_v2(this.m_rA, this.m_u);
        var crBu = b2Cross_v2_v2(this.m_rB, this.m_u);
        var invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;

        // Compute the effective mass matrix.
        this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;

        if (this.m_frequencyHz > 0.0)
        {
            var C = length - this.m_length;

            // Frequency
            var omega = 2.0 * b2_pi * this.m_frequencyHz;

            // Damping coefficient
            var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;

            // Spring stiffness
            var k = this.m_mass * omega * omega;

            // magic formulas
            var h = data.step.dt;
            this.m_gamma = h * (d + h * k);
            this.m_gamma = this.m_gamma != 0.0 ? 1.0 / this.m_gamma : 0.0;
            this.m_bias = C * h * k * this.m_gamma;

            invMass += this.m_gamma;
            this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
        }
        else
        {
            this.m_gamma = 0.0;
            this.m_bias = 0.0;
        }

        if (data.step.warmStarting)
        {
            // Scale the impulse to support a variable time step.
            this.m_impulse *= data.step.dtRatio;

            var P = b2Vec2.Multiply(this.m_impulse, this.m_u);
            vA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
            wA -= this.m_invIA * b2Cross_v2_v2(this.m_rA, P);
            vB.Add(b2Vec2.Multiply(this.m_invMassB, P));
            wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, P);
        }
        else
        {
            this.m_impulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        // Cdot = dot(u, v + cross(w, r))
        var vpA = b2Vec2.Add(vA, b2Cross_f_v2(wA, this.m_rA));
        var vpB = b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB));
        var Cdot = b2Dot_v2_v2(this.m_u, b2Vec2.Subtract(vpB, vpA));

        var impulse = -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
        this.m_impulse += impulse;

        var P = b2Vec2.Multiply(impulse, this.m_u);
        vA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
        wA -= this.m_invIA * b2Cross_v2_v2(this.m_rA, P);
        vB.Add(b2Vec2.Multiply(this.m_invMassB, P));
        wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, P);

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolvePositionConstraints: function(data)
    {
        if (this.m_frequencyHz > 0.0)
        {
            // There is no position correction for soft distance constraints.
            return true;
        }

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var u = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);

        var length = u.Normalize();
        var C = length - this.m_length;
        C = b2Clamp(C, -b2_maxLinearCorrection, b2_maxLinearCorrection);

        var impulse = -this.m_mass * C;
        var P = b2Vec2.Multiply(impulse, u);

        cA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
        aA -= this.m_invIA * b2Cross_v2_v2(rA, P);
        cB.Add(b2Vec2.Multiply(this.m_invMassB, P));
        aB += this.m_invIB * b2Cross_v2_v2(rB, P);

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return b2Abs(C) < b2_linearSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['length'] = this.m_length;
        obj['frequencyHz'] = this.m_frequencyHz;
        obj['dampingRatio'] = this.m_dampingRatio;

        return obj;
    }
};

b2DistanceJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Prismatic joint definition. This requires defining a line of
/// motion using an axis and an anchor point. The definition uses local
/// anchor points and a local axis so that the initial configuration
/// can violate the constraint slightly. The joint translation is zero
/// when the local anchor points coincide in world space. Using local
/// anchors and a local axis helps when saving and loading a game.
function b2PrismaticJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_prismaticJoint;
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.localAxisA = new b2Vec2(1.0, 0.0);
    this.referenceAngle = 0.0;
    this.enableLimit = false;
    this.lowerTranslation = 0.0;
    this.upperTranslation = 0.0;
    this.enableMotor = false;
    this.maxMotorForce = 0.0;
    this.motorSpeed = 0.0;

    Object.seal(this);
}

b2PrismaticJointDef.prototype =
{
    /// Initialize the bodies, anchors, axis, and reference angle using the world
    /// anchor and unit world axis.
    Initialize: function(bA, bB, anchor, axis)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
        this.localAxisA = this.bodyA.GetLocalVector(axis);
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.localAxisA._deserialize(data['localAxisA']);
        this.referenceAngle = data['referenceAngle'];
        this.enableLimit = data['enableLimit'];
        this.lowerTranslation = data['lowerTranslation'];
        this.upperTranslation = data['upperTranslation'];
        this.enableMotor = data['enableMotor'];
        this.maxMotorForce = data['maxMotorForce'];
        this.motorSpeed = data['motorSpeed'];
    }
};

b2PrismaticJointDef._extend(b2JointDef);

/// A prismatic joint. This joint provides one degree of freedom: translation
/// along an axis fixed in bodyA. Relative rotation is prevented. You can
/// use a joint limit to restrict the range of motion and a joint motor to
/// drive the motion or to model joint friction.
function b2PrismaticJoint(def)
{
    this.parent.call(this, def);

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();
    this.m_localXAxisA = def.localAxisA.Clone();
    this.m_localXAxisA.Normalize();
    this.m_localYAxisA = b2Cross_f_v2(1.0, this.m_localXAxisA);
    this.m_referenceAngle = def.referenceAngle;

    this.m_impulse = new b2Vec3();
    this.m_motorMass = 0.0;
    this.m_motorImpulse = 0.0;

    this.m_lowerTranslation = def.lowerTranslation;
    this.m_upperTranslation = def.upperTranslation;
    this.m_maxMotorForce = def.maxMotorForce;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableLimit = def.enableLimit;
    this.m_enableMotor = def.enableMotor;
    this.m_limitState = b2Joint.e_inactiveLimit;

    this.m_axis = new b2Vec2();
    this.m_perp = new b2Vec2();

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_s1 = 0, this.m_s2 = 0;
    this.m_a1 = 0, this.m_a2 = 0;
    this.m_K = new b2Mat33();
    this.m_motorMass = 0;
}

b2PrismaticJoint.prototype =
{
    GetAnchorA: function()
    {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    },
    GetAnchorB: function()
    {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    },

    GetReactionForce: function(inv_dt)
    {
        return b2Vec2.Multiply(inv_dt, b2Vec2.Add(b2Vec2.Multiply(this.m_impulse.x, this.m_perp), b2Vec2.Multiply((this.m_motorImpulse + this.m_impulse.z), this.m_axis)));
    },
    GetReactionTorque: function(inv_dt)
    {
        return inv_dt * this.m_impulse.y;
    },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// The local joint axis relative to bodyA.
    GetLocalAxisA: function() { return this.m_localXAxisA; },

    /// Get the reference angle.
    GetReferenceAngle: function() { return this.m_referenceAngle; },

    /// Get the current joint translation, usually in meters.
    GetJointTranslation: function()
    {
        var pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
        var pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
        var d = b2Vec2.Subtract(pB, pA);
        var axis = this.m_bodyA.GetWorldVector(this.m_localXAxisA);

        var translation = b2Dot_v2_v2(d, axis);
        return translation;
    },

    /// Get the current joint translation speed, usually in meters per second.
    GetJointSpeed: function()
    {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;

        var rA = b2Mul_r_v2(bA.m_xf.q, b2Vec2.Subtract(this.m_localAnchorA, bA.m_sweep.localCenter));
        var rB = b2Mul_r_v2(bB.m_xf.q, b2Vec2.Subtract(this.m_localAnchorB, bB.m_sweep.localCenter));
        var p1 = b2Vec2.Add(bA.m_sweep.c, rA);
        var p2 = b2Vec2.Add(bB.m_sweep.c, rB);
        var d = b2Vec2.Subtract(p2, p1);
        var axis = b2Mul_r_v2(bA.m_xf.q, this.m_localXAxisA);

        var vA = bA.m_linearVelocity;
        var vB = bB.m_linearVelocity;
        var wA = bA.m_angularVelocity;
        var wB = bB.m_angularVelocity;

        var speed = b2Dot_v2_v2(d, b2Cross_f_v2(wA, axis)) + b2Dot_v2_v2(axis, b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, rB)), vA), b2Cross_f_v2(wA, rA)));
        return speed;
    },

    /// Is the joint limit enabled?
    IsLimitEnabled: function()
    {
        return this.m_enableLimit;
    },

    /// Enable/disable the joint limit.
    EnableLimit: function(flag)
    {
        if (flag != this.m_enableLimit)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableLimit = flag;
            this.m_impulse.z = 0.0;
        }
    },

    /// Get the lower joint limit, usually in meters.
    GetLowerLimit: function()
    {
        return this.m_lowerTranslation;
    },

    /// Get the upper joint limit, usually in meters.
    GetUpperLimit: function()
    {
        return this.m_upperTranslation;
    },

    /// Set the joint limits, usually in meters.
    SetLimits: function(lower, upper)
    {

        b2Assert(lower <= upper);


        if (lower != this.m_lowerTranslation || upper != this.m_upperTranslation)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_lowerTranslation = lower;
            this.m_upperTranslation = upper;
            this.m_impulse.z = 0.0;
        }
    },

    /// Is the joint motor enabled?
    IsMotorEnabled: function()
    {
        return this.m_enableMotor;
    },

    /// Enable/disable the joint motor.
    EnableMotor: function(flag)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_enableMotor = flag;
    },

    /// Set the motor speed, usually in meters per second.
    SetMotorSpeed: function(speed)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_motorSpeed = speed;
    },

    /// Get the motor speed, usually in meters per second.
    GetMotorSpeed: function()
    {
        return this.m_motorSpeed;
    },

    /// Set the maximum motor force, usually in N.
    SetMaxMotorForce: function(force)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_maxMotorForce = force;
    },
    GetMaxMotorForce: function() { return this.m_maxMotorForce; },

    /// Get the current motor force given the inverse time step, usually in N.
    GetMotorForce: function(inv_dt)
    {
        return inv_dt * this.m_motorImpulse;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
        this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        // Compute the effective masses.
        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var d = b2Vec2.Add(b2Vec2.Subtract(cB, cA), b2Vec2.Subtract(rB, rA));

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        // Compute motor Jacobian and effective mass.
        {
            this.m_axis = b2Mul_r_v2(qA, this.m_localXAxisA);
            this.m_a1 = b2Cross_v2_v2(b2Vec2.Add(d, rA), this.m_axis);
            this.m_a2 = b2Cross_v2_v2(rB, this.m_axis);

            this.m_motorMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
            if (this.m_motorMass > 0.0)
            {
                this.m_motorMass = 1.0 / this.m_motorMass;
            }
        }

        // Prismatic constraint.
        {
            this.m_perp = b2Mul_r_v2(qA, this.m_localYAxisA);

            this.m_s1 = b2Cross_v2_v2(b2Vec2.Add(d, rA), this.m_perp);
            this.m_s2 = b2Cross_v2_v2(rB, this.m_perp);

            var k11 = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
            var k12 = iA * this.m_s1 + iB * this.m_s2;
            var k13 = iA * this.m_s1 * this.m_a1 + iB * this.m_s2 * this.m_a2;
            var k22 = iA + iB;
            if (k22 == 0.0)
            {
                // For bodies with fixed rotation.
                k22 = 1.0;
            }
            var k23 = iA * this.m_a1 + iB * this.m_a2;
            var k33 = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;

            this.m_K.ex.Set(k11, k12, k13);
            this.m_K.ey.Set(k12, k22, k23);
            this.m_K.ez.Set(k13, k23, k33);
        }

        // Compute motor and limit terms.
        if (this.m_enableLimit)
        {
            var jointTranslation = b2Dot_v2_v2(this.m_axis, d);
            if (b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2_linearSlop)
            {
                this.m_limitState = b2Joint.e_equalLimits;
            }
            else if (jointTranslation <= this.m_lowerTranslation)
            {
                if (this.m_limitState != b2Joint.e_atLowerLimit)
                {
                    this.m_limitState = b2Joint.e_atLowerLimit;
                    this.m_impulse.z = 0.0;
                }
            }
            else if (jointTranslation >= this.m_upperTranslation)
            {
                if (this.m_limitState != b2Joint.e_atUpperLimit)
                {
                    this.m_limitState = b2Joint.e_atUpperLimit;
                    this.m_impulse.z = 0.0;
                }
            }
            else
            {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_impulse.z = 0.0;
            }
        }
        else
        {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
        }

        if (this.m_enableMotor == false)
        {
            this.m_motorImpulse = 0.0;
        }

        if (data.step.warmStarting)
        {
            // Account for variable time step.
            this.m_impulse.Multiply(data.step.dtRatio);
            this.m_motorImpulse *= data.step.dtRatio;

            var P = b2Vec2.Add(b2Vec2.Multiply(this.m_impulse.x, this.m_perp), b2Vec2.Multiply((this.m_motorImpulse + this.m_impulse.z), this.m_axis));
            var LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
            var LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }
        else
        {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        // Solve linear motor constraint.
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits)
        {
            var Cdot = b2Dot_v2_v2(this.m_axis, b2Vec2.Subtract(vB, vA)) + this.m_a2 * wB - this.m_a1 * wA;
            var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
            var oldImpulse = this.m_motorImpulse;
            var maxImpulse = data.step.dt * this.m_maxMotorForce;
            this.m_motorImpulse = b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;

            var P = b2Vec2.Multiply(impulse, this.m_axis);
            var LA = impulse * this.m_a1;
            var LB = impulse * this.m_a2;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }

        var Cdot1 = new b2Vec2();
        Cdot1.x = b2Dot_v2_v2(this.m_perp, b2Vec2.Subtract(vB, vA)) + this.m_s2 * wB - this.m_s1 * wA;
        Cdot1.y = wB - wA;

        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit)
        {
            // Solve prismatic and limit constraint in block form.
            var Cdot2;
            Cdot2 = b2Dot_v2_v2(this.m_axis, b2Vec2.Subtract(vB, vA)) + this.m_a2 * wB - this.m_a1 * wA;
            var Cdot = new b2Vec3(Cdot1.x, Cdot1.y, Cdot2);

            var f1 = this.m_impulse.Clone();
            var df =  this.m_K.Solve33(Cdot.Negate());
            this.m_impulse.Add(df);

            if (this.m_limitState == b2Joint.e_atLowerLimit)
            {
                this.m_impulse.z = b2Max(this.m_impulse.z, 0.0);
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit)
            {
                this.m_impulse.z = b2Min(this.m_impulse.z, 0.0);
            }

            // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) + f1(1:2)
            var b = b2Vec2.Subtract(Cdot1.Negate(), b2Vec2.Multiply((this.m_impulse.z - f1.z), new b2Vec2(this.m_K.ez.x, this.m_K.ez.y)));
            var f2r = b2Vec2.Add(this.m_K.Solve22(b), new b2Vec2(f1.x, f1.y));
            this.m_impulse.x = f2r.x;
            this.m_impulse.y = f2r.y;

            df = b2Vec3.Subtract(this.m_impulse, f1);

            var P = b2Vec2.Add(b2Vec2.Multiply(df.x, this.m_perp), b2Vec2.Multiply(df.z, this.m_axis));
            var LA = df.x * this.m_s1 + df.y + df.z * this.m_a1;
            var LB = df.x * this.m_s2 + df.y + df.z * this.m_a2;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }
        else
        {
            // Limit is inactive, just solve the prismatic constraint in block form.
            var df = this.m_K.Solve22(Cdot1.Negate());
            this.m_impulse.x += df.x;
            this.m_impulse.y += df.y;

            var P = b2Vec2.Multiply(df.x, this.m_perp);
            var LA = df.x * this.m_s1 + df.y;
            var LB = df.x * this.m_s2 + df.y;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        // Compute fresh Jacobians
        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var d = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);

        var axis = b2Mul_r_v2(qA, this.m_localXAxisA);
        var a1 = b2Cross_v2_v2(b2Vec2.Add(d, rA), axis);
        var a2 = b2Cross_v2_v2(rB, axis);
        var perp = b2Mul_r_v2(qA, this.m_localYAxisA);

        var s1 = b2Cross_v2_v2(b2Vec2.Add(d, rA), perp);
        var s2 = b2Cross_v2_v2(rB, perp);

        var impulse = new b2Vec3();
        var C1 = new b2Vec2();
        C1.x = b2Dot_v2_v2(perp, d);
        C1.y = aB - aA - this.m_referenceAngle;

        var linearError = b2Abs(C1.x);
        var angularError = b2Abs(C1.y);

        var active = false;
        var C2 = 0.0;
        if (this.m_enableLimit)
        {
            var translation = b2Dot_v2_v2(axis, d);
            if (b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2_linearSlop)
            {
                // Prevent large angular corrections
                C2 = b2Clamp(translation, -b2_maxLinearCorrection, b2_maxLinearCorrection);
                linearError = b2Max(linearError, b2Abs(translation));
                active = true;
            }
            else if (translation <= this.m_lowerTranslation)
            {
                // Prevent large linear corrections and allow some slop.
                C2 = b2Clamp(translation - this.m_lowerTranslation + b2_linearSlop, -b2_maxLinearCorrection, 0.0);
                linearError = b2Max(linearError, this.m_lowerTranslation - translation);
                active = true;
            }
            else if (translation >= this.m_upperTranslation)
            {
                // Prevent large linear corrections and allow some slop.
                C2 = b2Clamp(translation - this.m_upperTranslation - b2_linearSlop, 0.0, b2_maxLinearCorrection);
                linearError = b2Max(linearError, translation - this.m_upperTranslation);
                active = true;
            }
        }

        if (active)
        {
            var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
            var k12 = iA * s1 + iB * s2;
            var k13 = iA * s1 * a1 + iB * s2 * a2;
            var k22 = iA + iB;
            if (k22 == 0.0)
            {
                // For fixed rotation
                k22 = 1.0;
            }
            var k23 = iA * a1 + iB * a2;
            var k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;

            var K = new b2Mat33();
            K.ex.Set(k11, k12, k13);
            K.ey.Set(k12, k22, k23);
            K.ez.Set(k13, k23, k33);

            var C = new b2Vec3();
            C.x = C1.x;
            C.y = C1.y;
            C.z = C2;

            impulse = K.Solve33(C.Negate());
        }
        else
        {
            var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
            var k12 = iA * s1 + iB * s2;
            var k22 = iA + iB;
            if (k22 == 0.0)
            {
                k22 = 1.0;
            }

            var K = new b2Mat22();
            K.ex.Set(k11, k12);
            K.ey.Set(k12, k22);

            var impulse1 = K.Solve(C1.Negate());
            impulse.x = impulse1.x;
            impulse.y = impulse1.y;
            impulse.z = 0.0;
        }

        var P = b2Vec2.Add(b2Vec2.Multiply(impulse.x, perp), b2Vec2.Multiply(impulse.z, axis));
        var LA = impulse.x * s1 + impulse.y + impulse.z * a1;
        var LB = impulse.x * s2 + impulse.y + impulse.z * a2;

        cA.Subtract(b2Vec2.Multiply(mA, P));
        aA -= iA * LA;
        cB.Add(b2Vec2.Multiply(mB, P));
        aB += iB * LB;

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return linearError <= b2_linearSlop && angularError <= b2_angularSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['localAxisA'] = this.m_localXAxisA._serialize();
        obj['referenceAngle'] = this.m_referenceAngle;
        obj['enableLimit'] = this.m_enableLimit;
        obj['lowerTranslation'] = this.m_lowerTranslation;
        obj['upperTranslation'] = this.m_upperTranslation;
        obj['enableMotor'] = this.m_enableMotor;
        obj['maxMotorForce'] = this.m_maxMotorForce;
        obj['motorSpeed'] = this.m_motorSpeed;

        return obj;
    }
};

b2PrismaticJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Friction joint definition.
function b2FrictionJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_frictionJoint;
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.maxForce = 0.0;
    this.maxTorque = 0.0;

    Object.seal(this);
}

b2FrictionJointDef.prototype =
{
    /// Initialize the bodies, anchors, axis, and reference angle using the world
    /// anchor and world axis.
    Initialize: function(bA, bB, anchor)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.Assign(this.bodyA.GetLocalPoint(anchor));
        this.localAnchorB.Assign(this.bodyB.GetLocalPoint(anchor));
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.maxForce = data['maxForce'];
        this.maxTorque = data['maxTorque'];
    }
};

b2FrictionJointDef._extend(b2JointDef);

/// Friction joint. This is used for top-down friction.
/// It provides 2D translational friction and angular friction.
function b2FrictionJoint(def)
{
    this.parent.call(this, def);

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();

    this.m_linearImpulse = new b2Vec2();
    this.m_angularImpulse = 0.0;

    this.m_maxForce = def.maxForce;
    this.m_maxTorque = def.maxTorque;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_linearMass = new b2Mat22();
    this.m_angularMass = 0;
}

b2FrictionJoint.prototype =
{
    GetAnchorA: function()
    {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    },
    GetAnchorB: function()
    {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    },

    GetReactionForce: function(inv_dt)
    {
        return b2Vec2.Multiply(inv_dt, this.m_linearImpulse);
    },
    GetReactionTorque: function(inv_dt)
    {
        return inv_dt * this.m_angularImpulse;
    },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// Set the maximum friction force in N.
    SetMaxForce: function(force)
    {

        b2Assert(b2IsValid(force) && force >= 0.0);

        this.m_maxForce = force;
    },

    /// Get the maximum friction force in N.
    GetMaxForce: function()
    {
        return this.m_maxForce;
    },

    /// Set the maximum friction torque in N*m.
    SetMaxTorque: function(torque)
    {

        b2Assert(b2IsValid(torque) && torque >= 0.0);

        this.m_maxTorque = torque;
    },

    /// Get the maximum friction torque in N*m.
    GetMaxTorque: function()
    {
        return this.m_maxTorque;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        // Compute the effective mass matrix.
        this.m_rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        this.m_rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));

        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]

        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var K = new b2Mat22();
        K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y * this.m_rB.y;
        K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
        K.ey.x = K.ex.y;
        K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x * this.m_rB.x;

        this.m_linearMass = K.GetInverse();

        this.m_angularMass = iA + iB;
        if (this.m_angularMass > 0.0)
        {
            this.m_angularMass = 1.0 / this.m_angularMass;
        }

        if (data.step.warmStarting)
        {
            // Scale impulses to support a variable time step.
            this.m_linearImpulse.Multiply(data.step.dtRatio);
            this.m_angularImpulse *= data.step.dtRatio;

            var P = new b2Vec2(this.m_linearImpulse.x, this.m_linearImpulse.y);
            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + this.m_angularImpulse);
            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + this.m_angularImpulse);
        }
        else
        {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var h = data.step.dt;

        // Solve angular friction
        {
            var Cdot = wB - wA;
            var impulse = -this.m_angularMass * Cdot;

            var oldImpulse = this.m_angularImpulse;
            var maxImpulse = h * this.m_maxTorque;
            this.m_angularImpulse = b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;

            wA -= iA * impulse;
            wB += iB * impulse;
        }

        // Solve linear friction
        {
            var Cdot = b2Vec2.Add(vB, b2Vec2.Subtract(b2Cross_f_v2(wB, this.m_rB), b2Vec2.Subtract(vA, b2Cross_f_v2(wA, this.m_rA))));

            var impulse = b2Mul_m22_v2(this.m_linearMass, Cdot).Negate();
            var oldImpulse = this.m_linearImpulse.Clone();
            this.m_linearImpulse.Add(impulse);

            var maxImpulse = h * this.m_maxForce;

            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse)
            {
                this.m_linearImpulse.Normalize();
                this.m_linearImpulse.Multiply(maxImpulse);
            }

            impulse = b2Vec2.Subtract(this.m_linearImpulse, oldImpulse);

            vA.Subtract(b2Vec2.Multiply(mA, impulse));
            wA -= iA * b2Cross_v2_v2(this.m_rA, impulse);

            vB.Add(b2Vec2.Multiply(mB, impulse));
            wB += iB * b2Cross_v2_v2(this.m_rB, impulse);
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data) { return true; },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['maxForce'] = this.m_maxForce;
        obj['maxTorque'] = this.m_maxTorque;

        return obj;
    }
};

b2FrictionJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Weld joint definition. You need to specify local anchor points
/// where they are attached and the relative body angle. The position
/// of the anchor points is important for computing the reaction torque.
function b2WeldJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_weldJoint;
    this.localAnchorA = new b2Vec2(0.0, 0.0);
    this.localAnchorB = new b2Vec2(0.0, 0.0);
    this.referenceAngle = 0.0;
    this.frequencyHz = 0.0;
    this.dampingRatio = 0.0;

    Object.seal(this);
}

b2WeldJointDef.prototype =
{
    /// Initialize the bodies, anchors, and reference angle using a world
    /// anchor point.
    Initialize: function(bA, bB, anchor)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.Assign(this.bodyA.GetLocalPoint(anchor));
        this.localAnchorB.Assign(this.bodyB.GetLocalPoint(anchor));
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.referenceAngle = data['referenceAngle'];
        this.frequencyHz = data['frequencyHz'];
        this.dampingRatio = data['dampingRatio'];
    }
};

b2WeldJointDef._extend(b2JointDef);

/// A weld joint essentially glues two bodies together. A weld joint may
/// distort somewhat because the island constraint solver is approximate.
function b2WeldJoint(def)
{
    this.parent.call(this, def);

    this.m_bias = 0;

    // Solver shared
    this.m_gamma = 0;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_mass = new b2Mat33();

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();
    this.m_referenceAngle = def.referenceAngle;
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_impulse = new b2Vec3();
}

b2WeldJoint.prototype =
{
    GetAnchorA: function() { return this.m_bodyA.GetWorldPoint(this.m_localAnchorA); },
    GetAnchorB: function() { return this.m_bodyB.GetWorldPoint(this.m_localAnchorB); },

    GetReactionForce: function(inv_dt)
    {
        var P = new b2Vec2(this.m_impulse.x, this.m_impulse.y);
        return b2Vec2.Multiply(inv_dt, P);
    },
    GetReactionTorque: function(inv_dt) { return inv_dt * this.m_impulse.z; },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// Get the reference angle.
    GetReferenceAngle: function() { return this.m_referenceAngle; },

    /// Set/get frequency in Hz.
    SetFrequency: function(hz) { this.m_frequencyHz = hz; },
    GetFrequency: function() { return this.m_frequencyHz; },

    /// Set/get damping ratio.
    SetDampingRatio: function(ratio) { this.m_dampingRatio = ratio; },
    GetDampingRatio: function() { return this.m_dampingRatio; },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        this.m_rA.Assign(b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA)));
        this.m_rB.Assign(b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB)));

        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]

        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var K = new b2Mat33();
        K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
        K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
        K.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
        K.ex.y = K.ey.x;
        K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
        K.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
        K.ex.z = K.ez.x;
        K.ey.z = K.ez.y;
        K.ez.z = iA + iB;

        if (this.m_frequencyHz > 0.0)
        {
            K.GetInverse22(this.m_mass);

            var invM = iA + iB;
            var m = invM > 0.0 ? 1.0 / invM : 0.0;

            var C = aB - aA - this.m_referenceAngle;

            // Frequency
            var omega = 2.0 * b2_pi * this.m_frequencyHz;

            // Damping coefficient
            var d = 2.0 * m * this.m_dampingRatio * omega;

            // Spring stiffness
            var k = m * omega * omega;

            // magic formulas
            var h = data.step.dt;
            this.m_gamma = h * (d + h * k);
            this.m_gamma = this.m_gamma != 0.0 ? 1.0 / this.m_gamma : 0.0;
            this.m_bias = C * h * k * this.m_gamma;

            invM += this.m_gamma;
            this.m_mass.ez.z = invM != 0.0 ? 1.0 / invM : 0.0;
        }
        else if (K.ez.z == 0.0)
        {
            K.GetInverse22(this.m_mass);
            this.m_gamma = 0.0;
            this.m_bias = 0.0;
        }
        else
        {
            K.GetSymInverse33(this.m_mass);
            this.m_gamma = 0.0;
            this.m_bias = 0.0;
        }

        if (data.step.warmStarting)
        {
            // Scale impulses to support a variable time step.
            this.m_impulse.Multiply(data.step.dtRatio);

            var P = new b2Vec2(this.m_impulse.x, this.m_impulse.y);

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + this.m_impulse.z);

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + this.m_impulse.z);
        }
        else
        {
            this.m_impulse.SetZero();
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        if (this.m_frequencyHz > 0.0)
        {
            var Cdot2 = wB - wA;

            var impulse2 = -this.m_mass.ez.z * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z);
            this.m_impulse.z += impulse2;

            wA -= iA * impulse2;
            wB += iB * impulse2;

            var Cdot1 = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB)), vA), b2Cross_f_v2(wA, this.m_rA));

            var impulse1 = b2Mul22_m33_v2(this.m_mass, Cdot1).Negate();
            this.m_impulse.x += impulse1.x;
            this.m_impulse.y += impulse1.y;

            var P = impulse1.Clone();

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * b2Cross_v2_v2(this.m_rA, P);

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * b2Cross_v2_v2(this.m_rB, P);
        }
        else
        {
            var Cdot1 = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB)), vA), b2Cross_f_v2(wA, this.m_rA));
            var Cdot2 = wB - wA;
            var Cdot = new b2Vec3(Cdot1.x, Cdot1.y, Cdot2);

            var impulse = b2Mul_m33_v3(this.m_mass, Cdot).Negate();
            this.m_impulse.Add(impulse);

            var P = new b2Vec2(impulse.x, impulse.y);

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + impulse.z);

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + impulse.z);
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));

        var positionError, angularError;

        var K = new b2Mat33();
        K.ex.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
        K.ey.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
        K.ez.x = -rA.y * iA - rB.y * iB;
        K.ex.y = K.ey.x;
        K.ey.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
        K.ez.y = rA.x * iA + rB.x * iB;
        K.ex.z = K.ez.x;
        K.ey.z = K.ez.y;
        K.ez.z = iA + iB;

        if (this.m_frequencyHz > 0.0)
        {
            var C1 = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);

            positionError = C1.Length();
            angularError = 0.0;

            var P = K.Solve22(C1).Negate();

            cA.Subtract(b2Vec2.Multiply(mA, P));
            aA -= iA * b2Cross_v2_v2(rA, P);

            cB.Add(b2Vec2.Multiply(mB, P));
            aB += iB * b2Cross_v2_v2(rB, P);
        }
        else
        {
            var C1 = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);
            var C2 = aB - aA - this.m_referenceAngle;

            positionError = C1.Length();
            angularError = b2Abs(C2);

            var C = new b2Vec3(C1.x, C1.y, C2);

            var impulse;
            if (K.ez.z > 0.0)
            {
                impulse = K.Solve33(C).Invert();
            }
            else
            {
                var impulse2 = K.Solve22(C1).Invert();
                impulse = new b2Vec3(impulse2.x, impulse2.y, 0.0);
            }

            var P = new b2Vec2(impulse.x, impulse.y);

            cA.Subtract(b2Vec2.Multiply(mA, P));
            aA -= iA * (b2Cross_v2_v2(rA, P) + impulse.z);

            cB.Add(b2Vec2.Multiply(mB, P));
            aB += iB * (b2Cross_v2_v2(rB, P) + impulse.z);
        }

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return positionError <= b2_linearSlop && angularError <= b2_angularSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['referenceAngle'] = this.m_referenceAngle;
        obj['frequencyHz'] = this.m_frequencyHz;
        obj['dampingRatio'] = this.m_dampingRatio;

        return obj;
    }
};

b2WeldJoint._extend(b2Joint);

/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Wheel joint definition. This requires defining a line of
/// motion using an axis and an anchor point. The definition uses local
/// anchor points and a local axis so that the initial configuration
/// can violate the constraint slightly. The joint translation is zero
/// when the local anchor points coincide in world space. Using local
/// anchors and a local axis helps when saving and loading a game.
function b2WheelJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_wheelJoint;
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.localAxisA = new b2Vec2(1.0, 0.0);
    this.enableMotor = false;
    this.maxMotorTorque = 0.0;
    this.motorSpeed = 0.0;
    this.frequencyHz = 2.0;
    this.dampingRatio = 0.7;

    Object.seal(this);
}

b2WheelJointDef.prototype =
{
    /// Initialize the bodies, anchors, axis, and reference angle using the world
    /// anchor and world axis.
    Initialize: function(bA, bB, anchor, axis)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.Assign(this.bodyA.GetLocalPoint(anchor));
        this.localAnchorB.Assign(this.bodyB.GetLocalPoint(anchor));
        this.localAxisA.Assign(this.bodyA.GetLocalVector(axis));
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.localAxisA._deserialize(data['localAxisA']);
        this.enableMotor = data['enableMotor'];
        this.maxMotorTorque = data['maxMotorTorque'];
        this.motorSpeed = data['motorSpeed'];
        this.frequencyHz = data['frequencyHz'];
        this.dampingRatio = data['dampingRatio'];
    }
};

b2WheelJointDef._extend(b2JointDef);

/// A wheel joint. This joint provides two degrees of freedom: translation
/// along an axis fixed in bodyA and rotation in the plane. In other words, it is a point to
/// line constraint with a rotational motor and a linear spring/damper.
/// This joint is designed for vehicle suspensions.
function b2WheelJoint(def)
{
    this.parent.call(this, def);

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();
    this.m_localXAxisA = def.localAxisA.Clone();
    this.m_localYAxisA = b2Cross_f_v2(1.0, this.m_localXAxisA);

    this.m_mass = 0.0;
    this.m_impulse = 0.0;
    this.m_motorMass = 0.0;
    this.m_motorImpulse = 0.0;
    this.m_springMass = 0.0;
    this.m_springImpulse = 0.0;

    this.m_maxMotorTorque = def.maxMotorTorque;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableMotor = def.enableMotor;

    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_bias = 0.0;
    this.m_gamma = 0.0;

    this.m_ax = new b2Vec2();
    this.m_ay = new b2Vec2();
    this.m_sAx = this.m_sBx = 0;
    this.m_sAy = this.m_sBy = 0;
}

b2WheelJoint.prototype =
{
    GetAnchorA: function() { return this.m_bodyA.GetWorldPoint(this.m_localAnchorA); },
    GetAnchorB: function() { return this.m_bodyB.GetWorldPoint(this.m_localAnchorB); },

    GetReactionForce: function(inv_dt) { return b2Vec2.Multiply(inv_dt, b2Vec2.Add(b2Vec2.Multiply(this.m_impulse, this.m_ay), b2Vec2.Multiply(this.m_springImpulse, this.m_ax))); },
    GetReactionTorque: function(inv_dt) { return inv_dt * this.m_motorImpulse; },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// The local joint axis relative to bodyA.
    GetLocalAxisA: function() { return this.m_localXAxisA; },

    /// Get the current joint translation, usually in meters.
    GetJointTranslation: function()
    {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;

        var pA = bA.GetWorldPoint(this.m_localAnchorA);
        var pB = bB.GetWorldPoint(this.m_localAnchorB);
        var d = b2Vec2.Subtract(pB, pA);
        var axis = bA.GetWorldVector(this.m_localXAxisA);

        var translation = b2Dot_v2_v2(d, axis);
        return translation;
    },

    /// Get the current joint translation speed, usually in meters per second.
    GetJointSpeed: function()
    {
        var wA = this.m_bodyA.m_angularVelocity;
        var wB = this.m_bodyB.m_angularVelocity;
        return wB - wA;
    },

    /// Is the joint motor enabled?
    IsMotorEnabled: function() { return this.m_enableMotor; },

    /// Enable/disable the joint motor.
    EnableMotor: function(flag)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_enableMotor = flag;
    },

    /// Set the motor speed, usually in radians per second.
    SetMotorSpeed: function(speed)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_motorSpeed = speed;
    },

    /// Get the motor speed, usually in radians per second.
    GetMotorSpeed: function()
    {
        return this.m_motorSpeed;
    },

    /// Set/Get the maximum motor force, usually in N-m.
    SetMaxMotorTorque: function(torque)
    {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_maxMotorTorque = torque;
    },
    GetMaxMotorTorque: function()
    {
        return this.m_maxMotorTorque;
    },

    /// Get the current motor torque given the inverse time step, usually in N-m.
    GetMotorTorque: function(inv_dt) { return inv_dt * this.m_motorImpulse; },

    /// Set/Get the spring frequency in hertz. Setting the frequency to zero disables the spring.
    SetSpringFrequencyHz: function(hz)
    {
        this.m_frequencyHz = hz;
    },
    GetSpringFrequencyHz: function()
    {
        return this.m_frequencyHz;
    },

    /// Set/Get the spring damping ratio
    SetSpringDampingRatio: function(ratio)
    {
        this.m_dampingRatio = ratio;
    },
    GetSpringDampingRatio: function()
    {
        return this.m_dampingRatio;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        // Compute the effective masses.
        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var d = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);

        // Point to line constraint
        {
            this.m_ay.Assign(b2Mul_r_v2(qA, this.m_localYAxisA));
            this.m_sAy = b2Cross_v2_v2(b2Vec2.Add(d, rA), this.m_ay);
            this.m_sBy = b2Cross_v2_v2(rB, this.m_ay);

            this.m_mass = mA + mB + iA * this.m_sAy * this.m_sAy + iB * this.m_sBy * this.m_sBy;

            if (this.m_mass > 0.0)
            {
                this.m_mass = 1.0 / this.m_mass;
            }
        }

        // Spring constraint
        this.m_springMass = 0.0;
        this.m_bias = 0.0;
        this.m_gamma = 0.0;
        if (this.m_frequencyHz > 0.0)
        {
            this.m_ax.Assign(b2Mul_r_v2(qA, this.m_localXAxisA));
            this.m_sAx = b2Cross_v2_v2(b2Vec2.Add(d, rA), this.m_ax);
            this.m_sBx = b2Cross_v2_v2(rB, this.m_ax);

            var invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx * this.m_sBx;

            if (invMass > 0.0)
            {
                this.m_springMass = 1.0 / invMass;

                var C = b2Dot_v2_v2(d, this.m_ax);

                // Frequency
                var omega = 2.0 * b2_pi * this.m_frequencyHz;

                // Damping coefficient
                var d = 2.0 * this.m_springMass * this.m_dampingRatio * omega;

                // Spring stiffness
                var k = this.m_springMass * omega * omega;

                // magic formulas
                var h = data.step.dt;
                this.m_gamma = h * (d + h * k);
                if (this.m_gamma > 0.0)
                {
                    this.m_gamma = 1.0 / this.m_gamma;
                }

                this.m_bias = C * h * k * this.m_gamma;

                this.m_springMass = invMass + this.m_gamma;
                if (this.m_springMass > 0.0)
                {
                    this.m_springMass = 1.0 / this.m_springMass;
                }
            }
        }
        else
        {
            this.m_springImpulse = 0.0;
        }

        // Rotational motor
        if (this.m_enableMotor)
        {
            this.m_motorMass = iA + iB;
            if (this.m_motorMass > 0.0)
            {
                this.m_motorMass = 1.0 / this.m_motorMass;
            }
        }
        else
        {
            this.m_motorMass = 0.0;
            this.m_motorImpulse = 0.0;
        }

        if (data.step.warmStarting)
        {
            // Account for variable time step.
            this.m_impulse *= data.step.dtRatio;
            this.m_springImpulse *= data.step.dtRatio;
            this.m_motorImpulse *= data.step.dtRatio;

            var P = b2Vec2.Add(b2Vec2.Multiply(this.m_impulse, this.m_ay), b2Vec2.Multiply(this.m_springImpulse, this.m_ax));
            var LA = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse;
            var LB = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse;

            vA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
            wA -= this.m_invIA * LA;

            vB.Add(b2Vec2.Multiply(this.m_invMassB, P));
            wB += this.m_invIB * LB;
        }
        else
        {
            this.m_impulse = 0.0;
            this.m_springImpulse = 0.0;
            this.m_motorImpulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolveVelocityConstraints: function(data)
    {
        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        // Solve spring constraint
        {
            var Cdot = b2Dot_v2_v2(this.m_ax, b2Vec2.Subtract(vB, vA)) + this.m_sBx * wB - this.m_sAx * wA;
            var impulse = -this.m_springMass * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse);
            this.m_springImpulse += impulse;

            var P = b2Vec2.Multiply(impulse, this.m_ax);
            var LA = impulse * this.m_sAx;
            var LB = impulse * this.m_sBx;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }

        // Solve rotational motor constraint
        {
            var Cdot = wB - wA - this.m_motorSpeed;
            var impulse = -this.m_motorMass * Cdot;

            var oldImpulse = this.m_motorImpulse;
            var maxImpulse = data.step.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;

            wA -= iA * impulse;
            wB += iB * impulse;
        }

        // Solve point to line constraint
        {
            var Cdot = b2Dot_v2_v2(this.m_ay, b2Vec2.Subtract(vB, vA)) + this.m_sBy * wB - this.m_sAy * wA;
            var impulse = -this.m_mass * Cdot;
            this.m_impulse += impulse;

            var P = b2Vec2.Multiply(impulse, this.m_ay);
            var LA = impulse * this.m_sAy;
            var LB = impulse * this.m_sBy;

            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * LA;

            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * LB;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },

    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var d = b2Vec2.Add(b2Vec2.Subtract(cB, cA), b2Vec2.Subtract(rB, rA));

        var ay = b2Mul_r_v2(qA, this.m_localYAxisA);

        var sAy = b2Cross_v2_v2(b2Vec2.Add(d, rA), ay);
        var sBy = b2Cross_v2_v2(rB, ay);

        var C = b2Dot_v2_v2(d, ay);

        var k = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;

        var impulse;
        if (k != 0.0)
        {
            impulse = - C / k;
        }
        else
        {
            impulse = 0.0;
        }

        var P = b2Vec2.Multiply(impulse, ay);
        var LA = impulse * sAy;
        var LB = impulse * sBy;

        cA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
        aA -= this.m_invIA * LA;
        cB.Add(b2Vec2.Multiply(this.m_invMassB, P));
        aB += this.m_invIB * LB;

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return b2Abs(C) <= b2_linearSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['localAxisA'] = this.m_localAxisA._serialize();
        obj['enableMotor'] = this.m_enableMotor;
        obj['maxMotorTorque'] = this.m_maxMotorTorque;
        obj['motorSpeed'] = this.m_motorSpeed;
        obj['frequencyHz'] = this.m_frequencyHz;
        obj['dampingRatio'] = this.m_dampingRatio;

        return obj;
    }
};

b2WheelJoint._extend(b2Joint);

/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Gear joint definition. This definition requires two existing
/// revolute or prismatic joints (any combination will work).
function b2GearJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_gearJoint;
    this.joint1 = null;
    this.joint2 = null;
    this.ratio = 1.0;

    Object.seal(this);
}

b2GearJointDef.prototype =
{
    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        // set up later on
        this.joint1 = data['joint1'];
        this.joint2 = data['joint2'];
        this.ratio = data['ratio'];
    }
};

b2GearJointDef._extend(b2JointDef);

/// A gear joint is used to connect two joints together. Either joint
/// can be a revolute or prismatic joint. You specify a gear ratio
/// to bind the motions together:
/// coordinate1 + ratio * coordinate2 = constant
/// The ratio can be negative or positive. If one joint is a revolute joint
/// and the other joint is a prismatic joint, then the ratio will have units
/// of length or units of 1/length.
/// @warning You have to manually destroy the gear joint if joint1 or joint2
/// is destroyed.
function b2GearJoint(def)
{
    this.parent.call(this, def);

    this.m_joint1 = def.joint1;
    this.m_joint2 = def.joint2;

    this.m_typeA = this.m_joint1.GetType();
    this.m_typeB = this.m_joint2.GetType();


    b2Assert(this.m_typeA == b2Joint.e_revoluteJoint || this.m_typeA == b2Joint.e_prismaticJoint);
    b2Assert(this.m_typeB == b2Joint.e_revoluteJoint || this.m_typeB == b2Joint.e_prismaticJoint);


    var coordinateA, coordinateB;

    // TODO_ERIN there might be some problem with the joint edges in b2Joint.

    this.m_bodyC = this.m_joint1.GetBodyA();
    this.m_bodyA = this.m_joint1.GetBodyB();

    // Get geometry of joint1
    var xfA = this.m_bodyA.m_xf;
    var aA = this.m_bodyA.m_sweep.a;
    var xfC = this.m_bodyC.m_xf;
    var aC = this.m_bodyC.m_sweep.a;

    this.m_localAnchorA = new b2Vec2();
    this.m_localAnchorB = new b2Vec2();
    this.m_localAnchorC = new b2Vec2();
    this.m_localAnchorD = new b2Vec2();

    this.m_localAxisC = new b2Vec2();
    this.m_localAxisD = new b2Vec2();

    if (this.m_typeA == b2Joint.e_revoluteJoint)
    {
        var revolute = def.joint1;
        this.m_localAnchorC.Assign(revolute.m_localAnchorA);
        this.m_localAnchorA.Assign(revolute.m_localAnchorB);
        this.m_referenceAngleA = revolute.m_referenceAngle;
        this.m_localAxisC.SetZero();

        coordinateA = aA - aC - this.m_referenceAngleA;
    }
    else
    {
        var prismatic = def.joint1;
        this.m_localAnchorC.Assign(prismatic.m_localAnchorA);
        this.m_localAnchorA.Assign(prismatic.m_localAnchorB);
        this.m_referenceAngleA = prismatic.m_referenceAngle;
        this.m_localAxisC.Assign(prismatic.m_localXAxisA);

        var pC = this.m_localAnchorC;
        var pA = b2MulT_r_v2(xfC.q, b2Vec2.Add(b2Mul_r_v2(xfA.q, this.m_localAnchorA), b2Vec2.Subtract(xfA.p, xfC.p)));
        coordinateA = b2Dot_v2_v2(b2Vec2.Subtract(pA, pC), this.m_localAxisC);
    }

    this.m_bodyD = this.m_joint2.GetBodyA();
    this.m_bodyB = this.m_joint2.GetBodyB();

    // Get geometry of joint2
    var xfB = this.m_bodyB.m_xf;
    var aB = this.m_bodyB.m_sweep.a;
    var xfD = this.m_bodyD.m_xf;
    var aD = this.m_bodyD.m_sweep.a;

    if (this.m_typeB == b2Joint.e_revoluteJoint)
    {
        var revolute = def.joint2;
        this.m_localAnchorD.Assign(revolute.m_localAnchorA);
        this.m_localAnchorB.Assign(revolute.m_localAnchorB);
        this.m_referenceAngleB = revolute.m_referenceAngle;
        this.m_localAxisD.SetZero();

        coordinateB = aB - aD - this.m_referenceAngleB;
    }
    else
    {
        var prismatic = def.joint2;
        this.m_localAnchorD.Assign(prismatic.m_localAnchorA);
        this.m_localAnchorB.Assign(prismatic.m_localAnchorB);
        this.m_referenceAngleB = prismatic.m_referenceAngle;
        this.m_localAxisD.Assign(prismatic.m_localXAxisA);

        var pD = this.m_localAnchorD;
        var pB = b2MulT_r_v2(xfD.q, b2Vec2.Add(b2Mul_r_v2(xfB.q, this.m_localAnchorB), b2Vec2.Subtract(xfB.p, xfD.p)));
        coordinateB = b2Dot_v2_v2(b2Vec2.Subtract(pB, pD), this.m_localAxisD);
    }

    this.m_ratio = def.ratio;

    this.m_constant = coordinateA + this.m_ratio * coordinateB;

    this.m_impulse = 0.0;

    // Solver temp
    this.m_indexA = this.m_indexB = this.m_indexC = this.m_indexD = 0;
    this.m_lcA = new b2Vec2(); this.m_lcB = new b2Vec2(); this.m_lcC = new b2Vec2(); this.m_lcD = new b2Vec2();
    this.m_mA = this.m_mB = this.m_mC = this.m_mD = 0;
    this.m_iA = this.m_iB = this.m_iC = this.m_iD = 0;
    this.m_JvAC = new b2Vec2(), this.m_JvBD = new b2Vec2();
    this.m_JwA = this.m_JwB = this.m_JwC = this.m_JwD = 0;
    this.m_mass = 0;
}

b2GearJoint.prototype =
{
    GetAnchorA: function() { return this.m_bodyA.GetWorldPoint(this.m_localAnchorA); },
    GetAnchorB: function() { return this.m_bodyB.GetWorldPoint(this.m_localAnchorB); },

    GetReactionForce: function(inv_dt)
    {
        var P = b2Vec2.Multiply(this.m_impulse, this.m_JvAC);
        return b2Vec2.Multiply(inv_dt, P);
    },
    GetReactionTorque: function(inv_dt)
    {
        var L = this.m_impulse * this.m_JwA;
        return inv_dt * L;
    },

    /// Get the first joint.
    GetJoint1: function() { return this.m_joint1; },

    /// Get the second joint.
    GetJoint2: function() { return this.m_joint2; },

    /// Set/Get the gear ratio.
    SetRatio: function(ratio)
    {

        b2Assert(b2IsValid(ratio));

        this.m_ratio = ratio;
    },
    GetRatio: function()
    {
        return this.m_ratio;
    },

    InitVelocityConstraints: function(data)
        {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_indexC = this.m_bodyC.m_islandIndex;
        this.m_indexD = this.m_bodyD.m_islandIndex;
        this.m_lcA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_lcB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_lcC.Assign(this.m_bodyC.m_sweep.localCenter);
        this.m_lcD.Assign(this.m_bodyD.m_sweep.localCenter);
        this.m_mA = this.m_bodyA.m_invMass;
        this.m_mB = this.m_bodyB.m_invMass;
        this.m_mC = this.m_bodyC.m_invMass;
        this.m_mD = this.m_bodyD.m_invMass;
        this.m_iA = this.m_bodyA.m_invI;
        this.m_iB = this.m_bodyB.m_invI;
        this.m_iC = this.m_bodyC.m_invI;
        this.m_iD = this.m_bodyD.m_invI;

        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var aC = data.positions[this.m_indexC].a;
        var vC = data.velocities[this.m_indexC].v.Clone();
        var wC = data.velocities[this.m_indexC].w;

        var aD = data.positions[this.m_indexD].a;
        var vD = data.velocities[this.m_indexD].v.Clone();
        var wD = data.velocities[this.m_indexD].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB), qC = new b2Rot(aC), qD = new b2Rot(aD);

        this.m_mass = 0.0;

        if (this.m_typeA == b2Joint.e_revoluteJoint)
        {
            this.m_JvAC.SetZero();
            this.m_JwA = 1.0;
            this.m_JwC = 1.0;
            this.m_mass += this.m_iA + this.m_iC;
        }
        else
        {
            var u = b2Mul_r_v2(qC, this.m_localAxisC);
            var rC = b2Mul_r_v2(qC, b2Vec2.Subtract(this.m_localAnchorC, this.m_lcC));
            var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_lcA));
            this.m_JvAC.Assign(u);
            this.m_JwC = b2Cross_v2_v2(rC, u);
            this.m_JwA = b2Cross_v2_v2(rA, u);
            this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
        }

        if (this.m_typeB == b2Joint.e_revoluteJoint)
        {
            this.m_JvBD.SetZero();
            this.m_JwB = this.m_ratio;
            this.m_JwD = this.m_ratio;
            this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
        }
        else
        {
            var u = b2Mul_r_v2(qD, this.m_localAxisD);
            var rD = b2Mul_r_v2(qD, b2Vec2.Subtract(this.m_localAnchorD, this.m_lcD));
            var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_lcB));
            this.m_JvBD.Assign(b2Vec2.Multiply(this.m_ratio, u));
            this.m_JwD = this.m_ratio * b2Cross_v2_v2(rD, u);
            this.m_JwB = this.m_ratio * b2Cross_v2_v2(rB, u);
            this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
        }

        // Compute effective mass.
        this.m_mass = this.m_mass > 0.0 ? 1.0 / this.m_mass : 0.0;

        if (data.step.warmStarting)
        {
            vA.Add(b2Vec2.Multiply((this.m_mA * this.m_impulse), this.m_JvAC));
            wA += this.m_iA * this.m_impulse * this.m_JwA;
            vB.Add(b2Vec2.Multiply((this.m_mB * this.m_impulse), this.m_JvBD));
            wB += this.m_iB * this.m_impulse * this.m_JwB;
            vC.Subtract(b2Vec2.Multiply((this.m_mC * this.m_impulse), this.m_JvAC));
            wC -= this.m_iC * this.m_impulse * this.m_JwC;
            vD.Subtract(b2Vec2.Multiply((this.m_mD * this.m_impulse), this.m_JvBD));
            wD -= this.m_iD * this.m_impulse * this.m_JwD;
        }
        else
        {
            this.m_impulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
        data.velocities[this.m_indexC].v.Assign(vC);
        data.velocities[this.m_indexC].w = wC;
        data.velocities[this.m_indexD].v.Assign(vD);
        data.velocities[this.m_indexD].w = wD;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;
        var vC = data.velocities[this.m_indexC].v.Clone();
        var wC = data.velocities[this.m_indexC].w;
        var vD = data.velocities[this.m_indexD].v.Clone();
        var wD = data.velocities[this.m_indexD].w;

        var Cdot = b2Dot_v2_v2(this.m_JvAC, b2Vec2.Subtract(vA, vC)) + b2Dot_v2_v2(this.m_JvBD, b2Vec2.Subtract(vB, vD));
        Cdot += (this.m_JwA * wA - this.m_JwC * wC) + (this.m_JwB * wB - this.m_JwD * wD);

        var impulse = -this.m_mass * Cdot;
        this.m_impulse += impulse;

        vA.Add(b2Vec2.Multiply((this.m_mA * impulse), this.m_JvAC));
        wA += this.m_iA * impulse * this.m_JwA;
        vB.Add(b2Vec2.Multiply((this.m_mB * impulse), this.m_JvBD));
        wB += this.m_iB * impulse * this.m_JwB;
        vC.Subtract(b2Vec2.Multiply((this.m_mC * impulse), this.m_JvAC));
        wC -= this.m_iC * impulse * this.m_JwC;
        vD.Subtract(b2Vec2.Multiply((this.m_mD * impulse), this.m_JvBD));
        wD -= this.m_iD * impulse * this.m_JwD;

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
        data.velocities[this.m_indexC].v.Assign(vC);
        data.velocities[this.m_indexC].w = wC;
        data.velocities[this.m_indexD].v.Assign(vD);
        data.velocities[this.m_indexD].w = wD;
    },
    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var cC = data.positions[this.m_indexC].c.Clone();
        var aC = data.positions[this.m_indexC].a;
        var cD = data.positions[this.m_indexD].c.Clone();
        var aD = data.positions[this.m_indexD].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB), qC = new b2Rot(aC), qD = new b2Rot(aD);

        var linearError = 0.0;

        var coordinateA, coordinateB;

        var JvAC = new b2Vec2(), JvBD = new b2Vec2();
        var JwA, JwB, JwC, JwD;
        var mass = 0.0;

        if (this.m_typeA == b2Joint.e_revoluteJoint)
        {
            JvAC.SetZero();
            JwA = 1.0;
            JwC = 1.0;
            mass += this.m_iA + this.m_iC;

            coordinateA = aA - aC - this.m_referenceAngleA;
        }
        else
        {
            var u = b2Mul_r_v2(qC, this.m_localAxisC);
            var rC = b2Mul_r_v2(qC, b2Vec2.Subtract(this.m_localAnchorC, this.m_lcC));
            var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_lcA));
            JvAC.Assign(u);
            JwC = b2Cross_v2_v2(rC, u);
            JwA = b2Cross_v2_v2(rA, u);
            mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;

            var pC = b2Vec2.Subtract(this.m_localAnchorC, this.m_lcC);
            var pA = b2MulT_r_v2(qC, b2Vec2.Add(rA, b2Vec2.Subtract(cA, cC)));
            coordinateA = b2Dot_v2_v2(b2Vec2.Subtract(pA, pC), this.m_localAxisC);
        }

        if (this.m_typeB == b2Joint.e_revoluteJoint)
        {
            JvBD.SetZero();
            JwB = this.m_ratio;
            JwD = this.m_ratio;
            mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);

            coordinateB = aB - aD - this.m_referenceAngleB;
        }
        else
        {
            var u = b2Mul_r_v2(qD, this.m_localAxisD);
            var rD = b2Mul_r_v2(qD, b2Vec2.Subtract(this.m_localAnchorD, this.m_lcD));
            var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_lcB));
            JvBD.Assign(b2Vec2.Multiply(this.m_ratio, u));
            JwD = this.m_ratio * b2Cross_v2_v2(rD, u);
            JwB = this.m_ratio * b2Cross_v2_v2(rB, u);
            mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;

            var pD = b2Vec2.Subtract(this.m_localAnchorD, this.m_lcD);
            var pB = b2MulT_r_v2(qD, b2Vec2.Add(rB, b2Vec2.Subtract(cB, cD)));
            coordinateB = b2Dot_v2_v2(b2Vec2.Subtract(pB, pD), this.m_localAxisD);
        }

        var C = (coordinateA + this.m_ratio * coordinateB) - this.m_constant;

        var impulse = 0.0;
        if (mass > 0.0)
        {
            impulse = -C / mass;
        }

        cA.Add(b2Vec2.Multiply(this.m_mA, b2Vec2.Multiply(impulse, JvAC)));
        aA += this.m_iA * impulse * JwA;
        cB.Add(b2Vec2.Multiply(this.m_mB, b2Vec2.Multiply(impulse, JvBD)));
        aB += this.m_iB * impulse * JwB;
        cC.Subtract(b2Vec2.Multiply(this.m_mC, b2Vec2.Multiply(impulse, JvAC)));
        aC -= this.m_iC * impulse * JwC;
        cD.Subtract(b2Vec2.Multiply(this.m_mD, b2Vec2.Multiply(impulse, JvBD)));
        aD -= this.m_iD * impulse * JwD;

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;
        data.positions[this.m_indexC].c.Assign(cC);
        data.positions[this.m_indexC].a = aC;
        data.positions[this.m_indexD].c.Assign(cD);
        data.positions[this.m_indexD].a = aD;

        // TODO_ERIN not implemented
        return linearError < b2_linearSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['joint1'] = this.m_joint1.__temp_joint_id;
        obj['joint2'] = this.m_joint2.__temp_joint_id;
        obj['ratio'] = this.m_ratio;

        return obj;
    }
};

b2GearJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

function b2MotorJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_motorJoint;
    this.linearOffset = new b2Vec2();
    this.angularOffset = 0.0;
    this.maxForce = 1.0;
    this.maxTorque = 1.0;
    this.correctionFactor = 0.3;

    Object.seal(this);
}

/// Motor joint definition.
b2MotorJointDef.prototype =
{
    /// Initialize the bodies and offsets using the current transforms.
    Initialize: function(bA, bB)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        var xB = this.bodyB.GetPosition();
        this.linearOffset.Assign(this.bodyA.GetLocalPoint(xB));

        var angleA = this.bodyA.GetAngle();
        var angleB = this.bodyB.GetAngle();
        this.angularOffset = angleB - angleA;
    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.linearOffset._deserialize(data['linearOffset']);
        this.angularOffset = data['angularOffset'];
        this.maxForce = data['maxForce'];
        this.maxTorque = data['maxTorque'];
        this.correctionFactor = data['correctionFactor'];
    }
};

b2MotorJointDef._extend(b2JointDef);

/// A motor joint is used to control the relative motion
/// between two bodies. A typical usage is to control the movement
/// of a dynamic body with respect to the ground.
function b2MotorJoint(def)
{
    this.parent.call(this, def);

    this.m_linearOffset = def.linearOffset.Clone();
    this.m_angularOffset = def.angularOffset;

    this.m_linearImpulse = new b2Vec2();
    this.m_angularImpulse = 0.0;

    this.m_maxForce = def.maxForce;
    this.m_maxTorque = def.maxTorque;
    this.m_correctionFactor = def.correctionFactor;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_linearError = new b2Vec2();
    this.m_angularError = 0;
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_linearMass = new b2Mat22();
    this.m_angularMass = 0;
}

b2MotorJoint.prototype =
{
    GetAnchorA: function()
    {
        return this.m_bodyA.GetPosition();
    },
    GetAnchorB: function()
    {
        return this.m_bodyB.GetPosition();
    },

    GetReactionForce: function(inv_dt)
    {
        return b2Vec2.Multiply(inv_dt, this.m_linearImpulse);
    },
    GetReactionTorque: function(inv_dt)
    {
        return inv_dt * this.m_angularImpulse;
    },

    /// Set/get the target linear offset, in frame A, in meters.
    SetLinearOffset: function(linearOffset)
    {
        if (linearOffset.x != this.m_linearOffset.x || linearOffset.y != this.m_linearOffset.y)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_linearOffset.Assign(linearOffset);
        }
    },
    GetLinearOffset: function()
    {
        return this.m_linearOffset;
    },

    /// Set/get the target angular offset, in radians.
    SetAngularOffset: function(angularOffset)
    {
        if (angularOffset != this.m_angularOffset)
        {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_angularOffset = angularOffset;
        }
    },
    GetAngularOffset: function()
    {
        return this.m_angularOffset;
    },

    /// Set the maximum friction force in N.
    SetMaxForce: function(force)
    {

        b2Assert(b2IsValid(force) && force >= 0.0);

        this.m_maxForce = force;
    },

    /// Get the maximum friction force in N.
    GetMaxForce: function()
    {
        return this.m_maxForce;
    },

    /// Set the maximum friction torque in N*m.
    SetMaxTorque: function(torque)
    {

        b2Assert(b2IsValid(torque) && torque >= 0.0);

        this.m_maxTorque = torque;
    },

    /// Get the maximum friction torque in N*m.
    GetMaxTorque: function()
    {
        return this.m_maxTorque;
    },

    /// Set the position correction factor in the range [0,1].
    SetCorrectionFactor: function(factor)
    {

        b2Assert(b2IsValid(factor) && 0.0 <= factor && factor <= 1.0);

        this.m_correctionFactor = factor;
    },

    /// Get the position correction factor in the range [0,1].
    GetCorrectionFactor: function()
    {
        return this.m_correctionFactor;
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        // Compute the effective mass matrix.
        this.m_rA.Assign(b2Mul_r_v2(qA, this.m_localCenterA.Negate()));
        this.m_rB.Assign(b2Mul_r_v2(qB, this.m_localCenterB.Negate()));

        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]

        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var K = new b2Mat22();
        K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y * this.m_rB.y;
        K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
        K.ey.x = K.ex.y;
        K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x * this.m_rB.x;

        this.m_linearMass.Assign(K.GetInverse());

        this.m_angularMass = iA + iB;
        if (this.m_angularMass > 0.0)
        {
            this.m_angularMass = 1.0 / this.m_angularMass;
        }

        //m_linearError = cB + m_rB - cA - m_rA - b2Mul(qA, m_linearOffset);
        //this.m_linearError.Assign(b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, this.m_rB), cA), this.m_rA), b2Mul_r_v2(qA, this.m_linearOffset)));
        //,
        this.m_linearError.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x - (qA.c * this.m_linearOffset.x - qA.s * this.m_linearOffset.y); //b2Mul_r_v2(qA, m_linearOffset);
        this.m_linearError.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y - (qA.s * this.m_linearOffset.x + qA.c * this.m_linearOffset.y); //b2Mul_r_v2(qA, m_linearOffset);
        this.m_angularError = aB - aA - this.m_angularOffset;

        if (data.step.warmStarting)
        {
            // Scale impulses to support a variable time step.
            this.m_linearImpulse.Multiply(data.step.dtRatio);
            this.m_angularImpulse *= data.step.dtRatio;

            var P = new b2Vec2(this.m_linearImpulse.x, this.m_linearImpulse.y);
            vA.Subtract(b2Vec2.Multiply(mA, P));
            wA -= iA * (b2Cross_v2_v2(this.m_rA, P) + this.m_angularImpulse);
            vB.Add(b2Vec2.Multiply(mB, P));
            wB += iB * (b2Cross_v2_v2(this.m_rB, P) + this.m_angularImpulse);
        }
        else
        {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var mA = this.m_invMassA, mB = this.m_invMassB;
        var iA = this.m_invIA, iB = this.m_invIB;

        var h = data.step.dt;
        var inv_h = data.step.inv_dt;

        // Solve angular friction
        {
            var Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
            var impulse = -this.m_angularMass * Cdot;

            var oldImpulse = this.m_angularImpulse;
            var maxImpulse = h * this.m_maxTorque;
            this.m_angularImpulse = b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;

            wA -= iA * impulse;
            wB += iB * impulse;
        }

        // Solve linear friction
        {
            // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA) + inv_h * m_correctionFactor * m_linearError;
            //var Cdot = b2Vec2.Add(b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB)), vA), b2Cross_f_v2(wA, this.m_rA)), b2Vec2.Multiply(inv_h, b2Vec2.Multiply(this.m_correctionFactor, this.m_linearError)));
            var Cdot = new b2Vec2(
                vB.x + (-wB * this.m_rB.x) - vA.x - (-wA * this.m_rA.x) + inv_h * this.m_correctionFactor * this.m_linearError.x,
                vB.y + (wB * this.m_rB.y) - vA.y - (wA * this.m_rA.y) + inv_h * this.m_correctionFactor * this.m_linearError.y
            );

            var impulse = b2Mul_m22_v2(this.m_linearMass, Cdot).Negate();
            var oldImpulse = this.m_linearImpulse.Clone();
            this.m_linearImpulse.Add(impulse);

            var maxImpulse = h * this.m_maxForce;

            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse)
            {
                this.m_linearImpulse.Normalize();
                this.m_linearImpulse.Multiply(maxImpulse);
            }

            impulse.Assign(b2Vec2.Subtract(this.m_linearImpulse, oldImpulse));

            vA.Subtract(b2Vec2.Multiply(mA, impulse));
            wA -= iA * b2Cross_v2_v2(this.m_rA, impulse);

            vB.Add(b2Vec2.Multiply(mB, impulse));
            wB += iB * b2Cross_v2_v2(this.m_rB, impulse);
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data)
    {
        return true;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['linearOffset'] = this.m_linearOffset._serialize();
        obj['angularOffset'] = this.m_angularOffset;
        obj['maxForce'] = this.m_maxForce;
        obj['maxTorque'] = this.m_maxTorque;
        obj['correctionFactor'] = this.m_correctionFactor;

        return obj;
    }
};

b2MotorJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

var b2_minPulleyLength = 2.0;

/// Pulley joint definition. This requires two ground anchors,
/// two dynamic body anchor points, and a pulley ratio.
function b2PulleyJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_pulleyJoint;
    this.groundAnchorA = new b2Vec2(-1.0, 1.0);
    this.groundAnchorB = new b2Vec2(1.0, 1.0);
    this.localAnchorA = new b2Vec2(-1.0, 0.0);
    this.localAnchorB = new b2Vec2(1.0, 0.0);
    this.lengthA = 0.0;
    this.lengthB = 0.0;
    this.ratio = 1.0;
    this.collideConnected = true;

    Object.seal(this);
}

b2PulleyJointDef.prototype =
{
    /// Initialize the bodies, anchors, lengths, max lengths, and ratio using the world anchors.
    Initialize: function(bA, bB,
                    groundA, groundB,
                    anchorA, anchorB,
                    r)
    {
        this.bodyA = bA;
        this.bodyB = bB;
        this.groundAnchorA.Assign(groundA);
        this.groundAnchorB.Assign(groundB);
        this.localAnchorA.Assign(this.bodyA.GetLocalPoint(anchorA));
        this.localAnchorB.Assign(this.bodyB.GetLocalPoint(anchorB));
        var dA = b2Vec2.Subtract(anchorA, groundA);
        this.lengthA = dA.Length();
        var dB = b2Vec2.Subtract(anchorB, groundB);
        this.lengthB = dB.Length();
        this.ratio = r;

        b2Assert(this.ratio > b2_epsilon);

    },

    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.groundAnchorA._deserialize(data['groundAnchorA']);
        this.groundAnchorB._deserialize(data['groundAnchorB']);
        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.lengthA = data['lengthA'];
        this.lengthB = data['lengthB'];
        this.ratio = data['ratio'];
    }
};

b2PulleyJointDef._extend(b2JointDef);

/// The pulley joint is connected to two bodies and two fixed ground points.
/// The pulley supports a ratio such that:
/// length1 + ratio * length2 <= constant
/// Yes, the force transmitted is scaled by the ratio.
/// Warning: the pulley joint can get a bit squirrelly by itself. They often
/// work better when combined with prismatic joints. You should also cover the
/// the anchor points with static shapes to prevent one side from going to
/// zero length.
function b2PulleyJoint(def)
{
    this.parent.call(this, def);

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_uA = new b2Vec2();
    this.m_uB = new b2Vec2();
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
    this.m_mass = 0;

    this.m_groundAnchorA = def.groundAnchorA.Clone();
    this.m_groundAnchorB = def.groundAnchorB.Clone();
    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();

    this.m_lengthA = def.lengthA;
    this.m_lengthB = def.lengthB;


    b2Assert(def.ratio != 0.0);

    this.m_ratio = def.ratio;

    this.m_constant = def.lengthA + this.m_ratio * def.lengthB;

    this.m_impulse = 0.0;
}

b2PulleyJoint.prototype =
{
    GetAnchorA: function() { return this.m_bodyA.GetWorldPoint(this.m_localAnchorA); },
    GetAnchorB: function() { return this.m_bodyB.GetWorldPoint(this.m_localAnchorB); },

    GetReactionForce: function(inv_dt)
    {
        var P = b2Vec2.Multiply(this.m_impulse, this.m_uB);
        return b2Vec2.Multiply(inv_dt, P);
    },
    GetReactionTorque: function(inv_dt)
    {
        return 0.0;
    },

    /// Get the first ground anchor.
    GetGroundAnchorA: function() { return this.m_groundAnchorA; },

    /// Get the second ground anchor.
    GetGroundAnchorB: function() { return this.m_groundAnchorB; },

    /// Get the current length of the segment attached to bodyA.
    GetLengthA: function() { return this.m_lengthA; },

    /// Get the current length of the segment attached to bodyB.
    GetLengthB: function() { return this.m_lengthB; },

    /// Get the pulley ratio.
    GetRatio: function() { return this.m_ratio; },

    /// Get the current length of the segment attached to bodyA.
    GetCurrentLengthA: function()
    {
        var p = this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
        var s = this.m_groundAnchorA;
        var d = b2Vec2.Subtract(p, s);
        return d.Length();
    },

    /// Get the current length of the segment attached to bodyB.
    GetCurrentLengthB: function()
    {
        var p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
        var s = this.m_groundAnchorB;
        var d = b2Vec2.Subtract(p, s);
        return d.Length();
    },

    /// Implement b2Joint.ShiftOrigin
    ShiftOrigin: function(newOrigin)
    {
        this.m_groundAnchorA.Subtract(newOrigin);
        this.m_groundAnchorB.Subtract(newOrigin);
    },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        this.m_rA.Assign(b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA)));
        this.m_rB.Assign(b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB)));

        // Get the pulley axes.
        this.m_uA.Assign(b2Vec2.Add(cA, b2Vec2.Subtract(this.m_rA, this.m_groundAnchorA)));
        this.m_uB.Assign(b2Vec2.Add(cB, b2Vec2.Subtract(this.m_rB, this.m_groundAnchorB)));

        var lengthA = this.m_uA.Length();
        var lengthB = this.m_uB.Length();

        if (lengthA > 10.0 * b2_linearSlop)
        {
            this.m_uA.Multiply(1.0 / lengthA);
        }
        else
        {
            this.m_uA.SetZero();
        }

        if (lengthB > 10.0 * b2_linearSlop)
        {
            this.m_uB.Multiply(1.0 / lengthB);
        }
        else
        {
            this.m_uB.SetZero();
        }

        // Compute effective mass.
        var ruA = b2Cross_v2_v2(this.m_rA, this.m_uA);
        var ruB = b2Cross_v2_v2(this.m_rB, this.m_uB);

        var mA = this.m_invMassA + this.m_invIA * ruA * ruA;
        var mB = this.m_invMassB + this.m_invIB * ruB * ruB;

        this.m_mass = mA + this.m_ratio * this.m_ratio * mB;

        if (this.m_mass > 0.0)
        {
            this.m_mass = 1.0 / this.m_mass;
        }

        if (data.step.warmStarting)
        {
            // Scale impulses to support variable time steps.
            this.m_impulse *= data.step.dtRatio;

            // Warm starting.
            var PA = b2Vec2.Multiply(-(this.m_impulse), this.m_uA);
            var PB = b2Vec2.Multiply((-this.m_ratio * this.m_impulse), this.m_uB);

            vA.Add(b2Vec2.Multiply(this.m_invMassA, PA));
            wA += this.m_invIA * b2Cross_v2_v2(this.m_rA, PA);
            vB.Add(b2Vec2.Multiply(this.m_invMassB, PB));
            wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, PB);
        }
        else
        {
            this.m_impulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var vpA = b2Vec2.Add(vA, b2Cross_f_v2(wA, this.m_rA));
        var vpB = b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB));

        var Cdot = -b2Dot_v2_v2(this.m_uA, vpA) - this.m_ratio * b2Dot_v2_v2(this.m_uB, vpB);
        var impulse = -this.m_mass * Cdot;
        this.m_impulse += impulse;

        var PA = b2Vec2.Multiply(-impulse, this.m_uA);
        var PB = b2Vec2.Multiply(-this.m_ratio, b2Vec2.Multiply(impulse, this.m_uB));
        vA.Add(b2Vec2.Multiply(this.m_invMassA, PA));
        wA += this.m_invIA * b2Cross_v2_v2(this.m_rA, PA);
        vB.Add(b2Vec2.Multiply(this.m_invMassB, PB));
        wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, PB);

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));

        // Get the pulley axes.
        var uA = b2Vec2.Add(cA, b2Vec2.Subtract(rA, this.m_groundAnchorA));
        var uB = b2Vec2.Add(cB, b2Vec2.Subtract(rB, this.m_groundAnchorB));

        var lengthA = uA.Length();
        var lengthB = uB.Length();

        if (lengthA > 10.0 * b2_linearSlop)
        {
            uA.Multiply(1.0 / lengthA);
        }
        else
        {
            uA.SetZero();
        }

        if (lengthB > 10.0 * b2_linearSlop)
        {
            uB.Multiply(1.0 / lengthB);
        }
        else
        {
            uB.SetZero();
        }

        // Compute effective mass.
        var ruA = b2Cross_v2_v2(rA, uA);
        var ruB = b2Cross_v2_v2(rB, uB);

        var mA = this.m_invMassA + this.m_invIA * ruA * ruA;
        var mB = this.m_invMassB + this.m_invIB * ruB * ruB;

        var mass = mA + this.m_ratio * this.m_ratio * mB;

        if (mass > 0.0)
        {
            mass = 1.0 / mass;
        }

        var C = this.m_constant - lengthA - this.m_ratio * lengthB;
        var linearError = b2Abs(C);

        var impulse = -mass * C;

        var PA = b2Vec2.Multiply(-impulse, uA);
        var PB = b2Vec2.Multiply(-this.m_ratio, b2Vec2.Multiply(impulse, uB));

        cA.Add(b2Vec2.Multiply(this.m_invMassA, PA));
        aA += this.m_invIA * b2Cross_v2_v2(rA, PA);
        cB.Add(b2Vec2.Multiply(this.m_invMassB, PB));
        aB += this.m_invIB * b2Cross_v2_v2(rB, PB);

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return linearError < b2_linearSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['groundAnchorA'] = this.m_groundAnchorA._serialize();
        obj['groundAnchorB'] = this.m_groundAnchorB._serialize();
        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['lengthA'] = this.m_lengthA;
        obj['lengthB'] = this.m_lengthB;
        obj['ratio'] = this.m_ratio;

        return obj;
    }
};

b2PulleyJoint._extend(b2Joint);
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/// Rope joint definition. This requires two body anchor points and
/// a maximum lengths.
/// Note: by default the connected objects will not collide.
/// see collideConnected in b2JointDef.
function b2RopeJointDef()
{
    this.parent.call(this);

    this.type = b2Joint.e_ropeJoint;
    this.localAnchorA = new b2Vec2(-1.0, 0.0);
    this.localAnchorB = new b2Vec2(1.0, 0.0);
    this.maxLength = 0.0;

    Object.seal(this);
}

b2RopeJointDef.prototype =
{
    _deserialize: function(data, bodies, joints)
    {
        this.parent.prototype._deserialize.call(this, data, bodies, joints);

        this.localAnchorA._deserialize(data['localAnchorA']);
        this.localAnchorB._deserialize(data['localAnchorB']);
        this.maxLength = data['maxLength'];
    }
};

b2RopeJointDef._extend(b2JointDef);

/// A rope joint enforces a maximum distance between two points
/// on two bodies. It has no other effect.
/// Warning: if you attempt to change the maximum length during
/// the simulation you will get some non-physical behavior.
/// A model that would allow you to dynamically modify the length
/// would have some sponginess, so I chose not to implement it
/// that way. See b2DistanceJoint if you want to dynamically
/// control length.
function b2RopeJoint(def)
{
    this.parent.call(this, def);

    this.m_localAnchorA = def.localAnchorA.Clone();
    this.m_localAnchorB = def.localAnchorB.Clone();

    this.m_maxLength = def.maxLength;

    this.m_mass = 0.0;
    this.m_impulse = 0.0;
    this.m_state = b2Joint.e_inactiveLimit;
    this.m_length = 0.0;

    // Solver temp
    this.m_indexA = 0;
    this.m_indexB = 0;
    this.m_u = new b2Vec2();
    this.m_rA = new b2Vec2();
    this.m_rB = new b2Vec2();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_invMassA = 0;
    this.m_invMassB = 0;
    this.m_invIA = 0;
    this.m_invIB = 0;
}

b2RopeJoint.prototype =
{
    GetAnchorA: function() { return this.m_bodyA.GetWorldPoint(this.m_localAnchorA); },
    GetAnchorB: function() { return this.m_bodyB.GetWorldPoint(this.m_localAnchorB); },

    GetReactionForce: function(inv_dt)
    {
        var F = b2Vec2.Multiply((inv_dt * this.m_impulse), this.m_u);
        return F;
    },
    GetReactionTorque: function(inv_dt) { return 0.0; },

    /// The local anchor point relative to bodyA's origin.
    GetLocalAnchorA: function() { return this.m_localAnchorA; },

    /// The local anchor point relative to bodyB's origin.
    GetLocalAnchorB: function() { return this.m_localAnchorB; },

    /// Set/Get the maximum length of the rope.
    SetMaxLength: function(length) { this.m_maxLength = length; },
    GetMaxLength: function() { return this.m_maxLength; },

    GetLimitState: function() { return this.m_state; },

    InitVelocityConstraints: function(data)
    {
        this.m_indexA = this.m_bodyA.m_islandIndex;
        this.m_indexB = this.m_bodyB.m_islandIndex;
        this.m_localCenterA.Assign(this.m_bodyA.m_sweep.localCenter);
        this.m_localCenterB.Assign(this.m_bodyB.m_sweep.localCenter);
        this.m_invMassA = this.m_bodyA.m_invMass;
        this.m_invMassB = this.m_bodyB.m_invMass;
        this.m_invIA = this.m_bodyA.m_invI;
        this.m_invIB = this.m_bodyB.m_invI;

        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;

        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        this.m_rA.Assign(b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA)));
        this.m_rB.Assign(b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB)));
        this.m_u.Assign(b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, this.m_rB), cA), this.m_rA));

        this.m_length = this.m_u.Length();

        var C = this.m_length - this.m_maxLength;
        if (C > 0.0)
        {
            this.m_state = b2Joint.e_atUpperLimit;
        }
        else
        {
            this.m_state = b2Joint.e_inactiveLimit;
        }

        if (this.m_length > b2_linearSlop)
        {
            this.m_u.Multiply(1.0 / this.m_length);
        }
        else
        {
            this.m_u.SetZero();
            this.m_mass = 0.0;
            this.m_impulse = 0.0;
            return;
        }

        // Compute effective mass.
        var crA = b2Cross_v2_v2(this.m_rA, this.m_u);
        var crB = b2Cross_v2_v2(this.m_rB, this.m_u);
        var invMass = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB + this.m_invIB * crB * crB;

        this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;

        if (data.step.warmStarting)
        {
            // Scale the impulse to support a variable time step.
            this.m_impulse *= data.step.dtRatio;

            var P = b2Vec2.Multiply(this.m_impulse, this.m_u);
            vA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
            wA -= this.m_invIA * b2Cross_v2_v2(this.m_rA, P);
            vB.Add(b2Vec2.Multiply(this.m_invMassB, P));
            wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, P);
        }
        else
        {
            this.m_impulse = 0.0;
        }

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolveVelocityConstraints: function(data)
    {
        var vA = data.velocities[this.m_indexA].v.Clone();
        var wA = data.velocities[this.m_indexA].w;
        var vB = data.velocities[this.m_indexB].v.Clone();
        var wB = data.velocities[this.m_indexB].w;

        // Cdot = dot(u, v + cross(w, r))
        var vpA = b2Vec2.Add(vA, b2Cross_f_v2(wA, this.m_rA));
        var vpB = b2Vec2.Add(vB, b2Cross_f_v2(wB, this.m_rB));
        var C = this.m_length - this.m_maxLength;
        var Cdot = b2Dot_v2_v2(this.m_u, b2Vec2.Subtract(vpB, vpA));

        // Predictive constraint.
        if (C < 0.0)
        {
            Cdot += data.step.inv_dt * C;
        }

        var impulse = -this.m_mass * Cdot;
        var oldImpulse = this.m_impulse;
        this.m_impulse = b2Min(0.0, this.m_impulse + impulse);
        impulse = this.m_impulse - oldImpulse;

        var P = b2Vec2.Multiply(impulse, this.m_u);
        vA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
        wA -= this.m_invIA * b2Cross_v2_v2(this.m_rA, P);
        vB.Add(b2Vec2.Multiply(this.m_invMassB, P));
        wB += this.m_invIB * b2Cross_v2_v2(this.m_rB, P);

        data.velocities[this.m_indexA].v.Assign(vA);
        data.velocities[this.m_indexA].w = wA;
        data.velocities[this.m_indexB].v.Assign(vB);
        data.velocities[this.m_indexB].w = wB;
    },
    SolvePositionConstraints: function(data)
    {
        var cA = data.positions[this.m_indexA].c.Clone();
        var aA = data.positions[this.m_indexA].a;
        var cB = data.positions[this.m_indexB].c.Clone();
        var aB = data.positions[this.m_indexB].a;

        var qA = new b2Rot(aA), qB = new b2Rot(aB);

        var rA = b2Mul_r_v2(qA, b2Vec2.Subtract(this.m_localAnchorA, this.m_localCenterA));
        var rB = b2Mul_r_v2(qB, b2Vec2.Subtract(this.m_localAnchorB, this.m_localCenterB));
        var u = b2Vec2.Subtract(b2Vec2.Subtract(b2Vec2.Add(cB, rB), cA), rA);

        var length = u.Normalize();
        var C = length - this.m_maxLength;

        C = b2Clamp(C, 0.0, b2_maxLinearCorrection);

        var impulse = -this.m_mass * C;
        var P = b2Vec2.Multiply(impulse, u);

        cA.Subtract(b2Vec2.Multiply(this.m_invMassA, P));
        aA -= this.m_invIA * b2Cross_v2_v2(rA, P);
        cB.Add(b2Vec2.Multiply(this.m_invMassB, P));
        aB += this.m_invIB * b2Cross_v2_v2(rB, P);

        data.positions[this.m_indexA].c.Assign(cA);
        data.positions[this.m_indexA].a = aA;
        data.positions[this.m_indexB].c.Assign(cB);
        data.positions[this.m_indexB].a = aB;

        return length - this.m_maxLength < b2_linearSlop;
    },

    _serialize: function(out)
    {
        var obj = out || {};

        this.parent.prototype._serialize.call(this, obj);

        obj['localAnchorA'] = this.m_localAnchorA._serialize();
        obj['localAnchorB'] = this.m_localAnchorB._serialize();
        obj['maxLength'] = this.m_maxLength;

        return obj;
    }
};

b2RopeJoint._extend(b2Joint);

/*
* Copyright (c) 2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

var expf = Math.exp;

///
function b2RopeDef()
{
    this.vertices = null;
    this.count = 0;
    this.masses = null;
    this.gravity = new b2Vec2();
    this.damping = 0.1;

    /// Stretching stiffness
    this.k2 = 0.9;

    /// Bending stiffness. Values above 0.5 can make the simulation blow up.
    this.k3 = 0.1;
}

///
function b2Rope()
{
    this.m_count = 0;
    this.m_ps = null;
    this.m_p0s = null;
    this.m_vs = null;
    this.m_ims = null;
    this.m_Ls = null;
    this.m_as = null;
    this.m_damping = 0;
    this.m_gravity = new b2Vec2();
    this.m_k2 = 1.0;
    this.m_k3 = 0.1;
}

b2Rope.prototype =
{
    ///
    Initialize: function(def)
    {

        b2Assert(def.count >= 3);

        this.m_count = def.count;
        this.m_ps = new Array(this.m_count);
        this.m_p0s = new Array(this.m_count);
        this.m_vs = new Array(this.m_count);
        this.m_ims = new Array(this.m_count);

        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_ps[i] = def.vertices[i].Clone();
            this.m_p0s[i] = def.vertices[i].Clone();
            this.m_vs[i] = new b2Vec2();

            var m = def.masses[i];
            if (m > 0.0)
            {
                this.m_ims[i] = 1.0 / m;
            }
            else
            {
                this.m_ims[i] = 0.0;
            }
        }

        var count2 = this.m_count - 1;
        var count3 = this.m_count - 2;
        this.m_Ls = new Array(count2);
        this.m_as = new Array(count3);

        for (var i = 0; i < count2; ++i)
        {
            var p1 = this.m_ps[i];
            var p2 = this.m_ps[i+1];
            this.m_Ls[i] = b2Distance(p1, p2);
        }

        for (var i = 0; i < count3; ++i)
        {
            var p1 = this.m_ps[i];
            var p2 = this.m_ps[i + 1];
            var p3 = this.m_ps[i + 2];

            var d1 = b2Vec2.Subtract(p2, p1);
            var d2 = b2Vec2.Subtract(p3, p2);

            var a = b2Cross_v2_v2(d1, d2);
            var b = b2Dot_v2_v2(d1, d2);

            this.m_as[i] = b2Atan2(a, b);
        }

        this.m_gravity = def.gravity.Clone();
        this.m_damping = def.damping;
        this.m_k2 = def.k2;
        this.m_k3 = def.k3;
    },

    ///
    Step: function(h, iterations)
    {
        if (h == 0.0)
        {
            return;
        }

        var d = expf(- h * this.m_damping);

        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_p0s[i].Assign(this.m_ps[i]);
            if (this.m_ims[i] > 0.0)
            {
                this.m_vs[i].Add(b2Vec2.Multiply(h, this.m_gravity));
            }
            this.m_vs[i].Multiply(d);
            this.m_ps[i].Add(b2Vec2.Multiply(h, this.m_vs[i]));

        }

        for (var i = 0; i < iterations; ++i)
        {
            this.SolveC2();
            this.SolveC3();
            this.SolveC2();
        }

        var inv_h = 1.0 / h;
        for (var i = 0; i < this.m_count; ++i)
        {
            this.m_vs[i] = b2Vec2.Multiply(inv_h, b2Vec2.Subtract(this.m_ps[i], this.m_p0s[i]));
        }
    },

    ///
    GetVertexCount: function()
    {
        return this.m_count;
    },

    ///
    GetVertices: function()
    {
        return this.m_ps;
    },

    ///
    Draw: function(draw)
    {
        var c = new b2Color(0.4, 0.5, 0.7);

        for (var i = 0; i < this.m_count - 1; ++i)
        {
            draw.DrawSegment(this.m_ps[i], this.m_ps[i+1], c);
        }
    },

    ///
    SetAngle: function(angle)
    {
        var count3 = this.m_count - 2;
        for (var i = 0; i < count3; ++i)
        {
            this.m_as[i] = angle;
        }
    },

    SolveC2: function()
    {
        var count2 = this.m_count - 1;

        for (var i = 0; i < count2; ++i)
        {
            var p1 = this.m_ps[i];
            var p2 = this.m_ps[i + 1];

            var d = b2Vec2.Subtract(p2, p1);
            var L = d.Normalize();

            var im1 = this.m_ims[i];
            var im2 = this.m_ims[i + 1];

            if (im1 + im2 == 0.0)
            {
                continue;
            }

            var s1 = im1 / (im1 + im2);
            var s2 = im2 / (im1 + im2);

            p1.Subtract(b2Vec2.Multiply(this.m_k2 * s1 * (this.m_Ls[i] - L), d));
            p2.Add(b2Vec2.Multiply(this.m_k2 * s2 * (this.m_Ls[i] - L), d));
        }
    },
    SolveC3: function()
    {
        var count3 = this.m_count - 2;

        for (var i = 0; i < count3; ++i)
        {
            var p1 = this.m_ps[i];
            var p2 = this.m_ps[i + 1];
            var p3 = this.m_ps[i + 2];

            var m1 = this.m_ims[i];
            var m2 = this.m_ims[i + 1];
            var m3 = this.m_ims[i + 2];

            var d1 = b2Vec2.Subtract(p2, p1);
            var d2 = b2Vec2.Subtract(p3, p2);

            var L1sqr = d1.LengthSquared();
            var L2sqr = d2.LengthSquared();

            if (L1sqr * L2sqr == 0.0)
            {
                continue;
            }

            var a = b2Cross_v2_v2(d1, d2);
            var b = b2Dot_v2_v2(d1, d2);

            var angle = b2Atan2(a, b);

            var Jd1 = b2Vec2.Multiply((-1.0 / L1sqr), d1.Skew());
            var Jd2 = b2Vec2.Multiply((1.0 / L2sqr), d2.Skew());

            var J1 = b2Vec2.Negate(Jd1);
            var J2 = b2Vec2.Subtract(Jd1, Jd2);
            var J3 = Jd2;

            var mass = m1 * b2Dot_v2_v2(J1, J1) + m2 * b2Dot_v2_v2(J2, J2) + m3 * b2Dot_v2_v2(J3, J3);
            if (mass == 0.0)
            {
                continue;
            }

            mass = 1.0 / mass;

            var C = angle - this.m_as[i];

            while (C > b2_pi)
            {
                angle -= 2 * b2_pi;
                C = angle - this.m_as[i];
            }

            while (C < -b2_pi)
            {
                angle += 2.0 * b2_pi;
                C = angle - this.m_as[i];
            }

            var impulse = - this.m_k3 * mass * C;

            p1.Add(b2Vec2.Multiply((m1 * impulse), J1));
            p2.Add(b2Vec2.Multiply((m2 * impulse), J2));
            p3.Add(b2Vec2.Multiply((m3 * impulse), J3));
        }
    }
};


// The frontend to the JSON serializer.
var b2JsonSerializer =
{
    /** @param {b2World} world */
    serialize: function(world)
    {
        // compile list of shapes
        // TODO: check for duplicate shapes
        var shapes = [];

        /** @type Number */
        var i;

        /** @type String */
        var serialized;

        /** @type b2Body */
        var b;

        /** @type b2Fixture */
        var f;

        /** @type b2Shape */
        var shape;

        for (b = world.GetBodyList(); b; b = b.GetNext())
        {
            for (f = b.GetFixtureList(); f; f = f.GetNext())
            {
                shape = f.GetShape();
                f.__temp_shape_id = shapes.length;
                shapes.push(shape._serialize());
            }
        }

        // compile list of fixtures
        // TODO: check for duplicate fixtures
        var fixtures = [];

        for (b = world.GetBodyList(); b; b = b.GetNext())
        {
            b.__temp_fixture_ids = [];

            for (f = b.GetFixtureList(); f; f = f.GetNext())
            {
                serialized = f._serialize();
                serialized['shape'] = f.__temp_shape_id;
                delete f.__temp_shape_id;

                b.__temp_fixture_ids.push(fixtures.length);

                fixtures.push(serialized);
            }
        }

        // compile list of bodies
        var bodies = [];

        for (b = world.GetBodyList(); b; b = b.GetNext())
        {
            serialized = b._serialize();
            serialized.fixtures = [];

            for (i = 0; i < b.__temp_fixture_ids.length; ++i)
                serialized.fixtures.push(b.__temp_fixture_ids[i]);

            delete b.__temp_fixture_ids;

            b.__temp_body_id = bodies.length;
            bodies.push(serialized);
        };

        // compile list of joints
        var joints = [];

        /** @type b2Joint */
        var j;

        for (j = world.GetJointList(), i = 0; j; j = j.GetNext(), ++i)
            j.__temp_joint_id = i;

        for (j = world.GetJointList(); j; j = j.GetNext())
        {
            // special case: don't serialize mouse joints
            if (j.GetType() === b2Joint.e_mouseJoint)
                continue;

            serialized = j._serialize();

            serialized['bodyA'] = j.GetBodyA().__temp_body_id;
            serialized['bodyB'] = j.GetBodyB().__temp_body_id;

            joints.push(serialized);
        }

        for (j = world.GetJointList(); j; j = j.GetNext())
            delete j.__temp_joint_id;

        for (b = world.GetBodyList(); b; b = b.GetNext())
            delete b.__temp_body_id;

        return { shapes: shapes, fixtures: fixtures, bodies: bodies, joints: joints };
    },

    /** @param {b2World} world */
    deserialize: function(serialized, world, clear)
    {
        var deserialized = JSON.parse(serialized);

        if (clear)
        {
            for (var b = world.GetBodyList(); b; )
            {
                var next = b.GetNext();
                world.DestroyBody(b);
                b = next;
            }

            for (var j = world.GetJointList(); j; )
            {
                var next = j.GetNext();
                world.DestroyJoint(j);
                j = next;
            }
        }

        // decompile shapes
        var shapes = [];

        for (var i = 0; i < deserialized.shapes.length; ++i)
        {
            var shapeData = deserialized.shapes[i];
            var shape;

            switch (shapeData.m_type)
            {
                case b2Shape.e_circle:
                    shape = new b2CircleShape();
                    break;
                case b2Shape.e_edge:
                    shape = new b2EdgeShape();
                    break;
                case b2Shape.e_chain:
                    shape = new b2ChainShape();
                    break;
                case b2Shape.e_polygon:
                    shape = new b2PolygonShape();
                    break;
            }

            shape._deserialize(shapeData);
            shapes.push(shape);
        }

        // decompile fixtures
        var fixtures = [];

        for (i = 0; i < deserialized.fixtures.length; ++i)
        {
            var fixtureData = deserialized.fixtures[i];
            var fixture = new b2FixtureDef();

            fixture._deserialize(fixtureData);
            fixture.shape = shapes[fixtureData['shape']];

            fixtures.push(fixture);
        }

        // decompile bodies
        var bodies = [];

        for (i = 0; i < deserialized.bodies.length; ++i)
        {
            var bodyData = deserialized.bodies[i];
            var def = new b2BodyDef();

            def._deserialize(bodyData);

            var body = world.CreateBody(def);

            for (var x = 0; x < bodyData.fixtures.length; ++x)
                body.CreateFixture(fixtures[bodyData.fixtures[x]]);

            bodies.push(body);
        }

        // decompile joints
        var joints = [];
        var gears = [];

        for (i = 0; i < deserialized.joints.length; ++i)
        {
            var jointData = deserialized.joints[i];
            var jointDef;

            switch (jointData.type)
            {
                case b2Joint.e_revoluteJoint:
                    jointDef = new b2RevoluteJointDef();
                    break;
                case b2Joint.e_prismaticJoint:
                    jointDef = new b2PrismaticJointDef();
                    break;
                case b2Joint.e_distanceJoint:
                    jointDef = new b2DistanceJointDef();
                    break;
                case b2Joint.e_pulleyJoint:
                    jointDef = new b2PulleyJointDef();
                    break;
                case b2Joint.e_gearJoint:
                    jointDef = new b2GearJointDef();
                    break;
                case b2Joint.e_wheelJoint:
                    jointDef = new b2WheelJointDef();
                    break;
                case b2Joint.e_weldJoint:
                    jointDef = new b2WeldJointDef();
                    break;
                case b2Joint.e_frictionJoint:
                    jointDef = new b2FrictionJointDef();
                    break;
                case b2Joint.e_ropeJoint:
                    jointDef = new b2RopeJointDef();
                    break;
                case b2Joint.e_motorJoint:
                    jointDef = new b2MotorJointDef();
                    break;
                default:
                    throw new Error('unknown joint');
            }

            jointDef._deserialize(jointData, bodies);

            if (jointData.type === b2Joint.e_gearJoint)
            {
                gears.push([jointDef, joints.length]);
                joints.push(null);
            }
            else
            {
                var joint = world.CreateJoint(jointDef);
                joints.push(joint);
            }
        }

        for (i = 0; i < gears.length; ++i)
        {
            gears[i][0].joint1 = joints[gears[i][0].joint1];
            gears[i][0].joint2 = joints[gears[i][0].joint2];

            joint = world.CreateJoint(gears[i][0]);
            joints[gears[i][1]] = joint;
        }
    }
};
// RUBE loader for JSBox2D.
// Unlike built-in serialization, the RUBE method is all contained in this file.

var b2RUBELoader = (function()
{
    function parseVector(obj)
    {
        return new b2Vec2(obj ? (obj.x || 0) : 0, obj ? (obj.y || 0) : 0);
    }

    function parseVectorArray(obj)
    {
        var vals = new Array(obj.x.length);

        for (var i = 0; i < vals.length; ++i)
            vals[i] = new b2Vec2(obj.x[i], obj.y[i]);

        return vals;
    }

    function parseProperty(obj, instance)
    {
        var name = obj.name;
        var val;

        if (typeof(obj['int']) !== 'undefined')
            val = obj['int'];
        else if (typeof(obj['float']) !== 'undefined')
            val = obj['float'];
        else if (typeof(obj['string']) !== 'undefined')
            val = obj['string'];
        else if (typeof(obj['bool']) !== 'undefined')
            val = obj['bool'];
        else if (typeof(obj.vec2) !== 'undefined')
            val = parseVector(obj.vec2);
        else
            throw new Error("unknown property type");

        if (instance.hasOwnProperty(name))
            throw new Error("custom property possibly overwriting an existing one");

        instance[name] = val;
    }

    function parseFixture(obj, body)
    {
        var def = new b2FixtureDef();

        def.density = obj.density || 0;
        def.filter.categoryBits = typeof(obj['filter-categoryBits']) === 'undefined' ? 1 : obj['filter-categoryBits'];
        def.filter.maskBits = typeof(obj['filter-maskBits']) === 'undefined' ? 65535 : obj['filter-maskBits'];
        def.filter.groupIndex = typeof(obj['filter-groupIndex']) === 'undefined' ? 0 : obj['filter-groupIndex'];
        def.friction = obj.friction || 0;
        def.restitution = obj.restitution || 0;
        def.isSensor = obj.sensor || 0;

        var shape;

        if (typeof(obj.circle) !== 'undefined')
        {
            shape = new b2CircleShape();
            shape.m_p = parseVector(obj.circle.center);
            shape.m_radius = obj.circle.radius || 0;
        }
        else if (typeof(obj.polygon) !== 'undefined')
        {
            var vertices = parseVectorArray(obj.polygon.vertices);

            shape = new b2PolygonShape();
            shape.Set(vertices, vertices.length);
        }
        else if (typeof(obj.chain) !== 'undefined')
        {
            var vertices = parseVectorArray(obj.chain.vertices);

            shape = new b2ChainShape();
            shape.m_count = vertices.length;
            shape.m_vertices = vertices;
            if (shape.m_hasNextVertex = obj.chain.hasNextVertex)
                shape.m_nextVertex = parseVector(obj.chain.nextVertex);
            if (shape.m_hasPrevVertex = obj.chain.hasPrevVertex)
                shape.m_prevVertex = parseVector(obj.chain.prevVertex);
        }
        else
            throw new Error("unknown shape type");

        def.shape = shape;

        var fixture = body.CreateFixture(def);

        fixture.name = obj.name; // TODO better place? good idea?

        if (obj.customProperties)
            for (var i = 0; i < obj.customProperties.length; ++i)
                parseProperty(obj, fixture);
    }

    function parseBody(obj, world)
    {
        var def = new b2BodyDef();

        def.type = obj.type || b2Body.b2_staticBody;
        def.angle = obj.angle || 0;
        def.angularDamping = obj.angularDamping || 0;
        def.angularVelocity = obj.angularVelocity || 0;
        def.awake = obj.awake || false;
        def.bullet = obj.bullet || false;
        def.fixedRotation = obj.fixedRotation || false;
        def.linearDamping = obj.linearDamping || false;
        def.linearVelocity = parseVector(obj.linearVelocity);
        def.gravityScale = typeof(obj.gravityScale) !== 'undefined' ? obj.gravityScale : 1; // GRRRRRR

        var md = new b2MassData();
        md.mass = obj['massData-mass'] || 0;
        md.center = parseVector(obj['massData-center']);
        md.I = obj['massData-I'] || 0;

        def.position = parseVector(obj.position);

        var body = world.CreateBody(def);
        body.name = obj.name; // TODO better place? good idea?
        body.SetMassData(md);

        if (obj.fixture)
            for (var i = 0; i < obj.fixture.length; ++i)
                parseFixture(obj.fixture[i], body);

        if (obj.customProperties)
            for (i = 0; i < obj.customProperties.length; ++i)
                parseProperty(obj, body);

        return body;
    }

    var jointsList = {
        'revolute': b2RevoluteJointDef,
        'distance': b2DistanceJointDef,
        'prismatic': b2PrismaticJointDef,
        'wheel': b2WheelJointDef,
        'rope': b2RopeJointDef,
        'motor': b2MotorJointDef,
        'weld': b2WeldJointDef,
        'friction': b2FrictionJointDef
    };

    function parseJoint(obj, world, bodies)
    {
        if (!jointsList[obj.type])
            throw new Error("unknown joint type");

        var jd = new jointsList[obj.type]();

        switch (jd.type)
        {
            case b2Joint.e_revoluteJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.enableLimit = obj.enableLimit || false;
                jd.enableMotor = obj.enableMotor || false;
                //jd.jointSpeed = obj.jointSpeed || 0; // what prop is this..?
                jd.lowerAngle = obj.lowerLimit || 0;
                jd.maxMotorTorque = obj.maxMotorTorque || 0;
                jd.motorSpeed = obj.motorSpeed || 0;
                jd.referenceAngle = obj.refAngle || 0;
                jd.upperAngle = obj.upperLimit || 0;
                break;
            case b2Joint.e_distanceJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.dampingRatio = obj.dampingRatio || 0;
                jd.frequencyHz = obj.frequency || 0;
                jd.length = obj.length || 0;
                break;
            case b2Joint.e_prismaticJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.enableLimit = obj.enableLimit || false;
                jd.enableMotor = obj.enableMotor || false;
                jd.localAxisA = parseVector(obj.localAxisA);
                jd.lowerTranslation = obj.lowerLimit || 0;
                jd.maxMotorForce = obj.maxMotorForce || 0;
                jd.motorSpeed = obj.motorSpeed || 0;
                jd.referenceAngle = obj.refAngle || 0;
                jd.upperTranslation = obj.upperLimit || 0;
                break;
            case b2Joint.e_wheelJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.enableMotor = obj.enableMotor || false;
                jd.localAxisA = parseVector(obj.localAxisA);
                jd.maxMotorTorque = obj.maxMotorTorque || 0;
                jd.motorSpeed = obj.motorSpeed || 0;
                jd.dampingRatio = obj.springDampingRatio || 0;
                jd.frequencyHz = obj.springFrequency || 0;
                break;
            case b2Joint.e_ropeJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.maxLength = obj.maxLength || 0;
                break;
            case b2Joint.e_motorJoint:
                jd.linearOffset = parseVector(obj.anchorA);
                jd.angularOffset = obj.refAngle || 0;
                jd.maxForce = obj.maxForce || 0;
                jd.maxTorque = obj.maxTorque || 0;
                jd.correctionFactor = obj.correctionFactor || 0;
                break;
            case b2Joint.e_weldJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.referenceAngle = obj.refAngle || 0;
                jd.dampingRatio = obj.dampingRatio || 0;
                jd.frequencyHz = obj.frequencyHz || 0;
                break;
            case b2Joint.e_frictionJoint:
                jd.localAnchorA = parseVector(obj.anchorA);
                jd.localAnchorB = parseVector(obj.anchorB);
                jd.maxForce = obj.maxForce || 0;
                jd.maxTorque = obj.maxTorque || 0;
                break;
            default:
                throw new Error("wat?");
        }

        jd.bodyA = bodies[obj.bodyA || 0];
        jd.bodyB = bodies[obj.bodyB || 0];
        jd.collideConnected = obj.collideConnected || false;

        var joint = world.CreateJoint(jd);

        joint.name = obj.name; // TODO better place? good idea?

        if (obj.customProperties)
            for (var i = 0; i < obj.customProperties.length; ++i)
                parseProperty(obj, joint);

        return joint;
    }

    function b2RubeParameters()
    {
        this.world = null;
        this.positionIterations = 0;
        this.velocityIterations = 0;
        this.stepsPerSecond = 0;
        this.fixtures = {};
        this.bodies = {};
        this.joints = {};

        Object.seal(this);
    }

    function parseWorld(obj, world)
    {
        var params = new b2RubeParameters();

        params.world = world = world || new b2World(new b2Vec2(0, 0));

        params.positionIterations = obj.positionIterations || 0;
        params.velocityIterations = obj.velocityIterations || 0;
        params.stepsPerSecond = obj.stepsPerSecond || 0;

        if (obj.gravity)
            world.SetGravity(parseVector(obj.gravity));

        world.SetAllowSleeping(obj.allowSleep || false);
        world.SetAutoClearForces(obj.autoClearForces || false);
        world.SetWarmStarting(obj.warmStarting || false);
        world.SetContinuousPhysics(obj.continuousPhysics || false);
        world.SetSubStepping(obj.subStepping || false);

        var bodies = [];
        var bl = obj.body;

        if (bl)
        {
            for (var i = 0; i < bl.length; ++i)
            {
                var body = parseBody(bl[i], world);
                bodies.push(body);

                for (var f = body.GetFixtureList(); f; f = f.GetNext())
                {
                    if (!params.fixtures[f.name])
                        params.fixtures[f.name] = [];

                    params.fixtures[f.name].push(f);
                }

                if (!params.bodies[body.name])
                    params.bodies[body.name] = [];

                params.bodies[body.name].push(body);
            }
        }

        var joints = [];
        var jl = obj.joint;

        if (jl)
        {
            for (i = 0; i < jl.length; ++i)
            {
                var joint = parseJoint(jl[i], world, bodies);
                joints.push(joint);

                if (!params.joints[joint.name])
                    params.joints[joint.name] = [];

                params.joints[joint.name].push(joint);
            }
        }

        return params;
    }

    return {
        parseWorld: parseWorld
    };
})();





var mappings = [{"trimmed":"version","name":"b2_version","def":b2_version},{"trimmed":"Vec2","name":"b2Vec2","def":b2Vec2},{"trimmed":"Vec3","name":"b2Vec3","def":b2Vec3},{"trimmed":"Mat22","name":"b2Mat22","def":b2Mat22},{"trimmed":"Mat33","name":"b2Mat33","def":b2Mat33},{"trimmed":"Rot","name":"b2Rot","def":b2Rot},{"trimmed":"Transform","name":"b2Transform","def":b2Transform},{"trimmed":"Sweep","name":"b2Sweep","def":b2Sweep},{"trimmed":"Dot_v2_v2","name":"b2Dot_v2_v2","def":b2Dot_v2_v2},{"trimmed":"Cross_v2_v2","name":"b2Cross_v2_v2","def":b2Cross_v2_v2},{"trimmed":"Cross_v2_f","name":"b2Cross_v2_f","def":b2Cross_v2_f},{"trimmed":"Cross_f_v2","name":"b2Cross_f_v2","def":b2Cross_f_v2},{"trimmed":"Mul_m22_v2","name":"b2Mul_m22_v2","def":b2Mul_m22_v2},{"trimmed":"MulT_m22_v2","name":"b2MulT_m22_v2","def":b2MulT_m22_v2},{"trimmed":"Distance","name":"b2Distance","def":b2Distance},{"trimmed":"DistanceSquared","name":"b2DistanceSquared","def":b2DistanceSquared},{"trimmed":"Dot_v3_v3","name":"b2Dot_v3_v3","def":b2Dot_v3_v3},{"trimmed":"Cross_v3_v3","name":"b2Cross_v3_v3","def":b2Cross_v3_v3},{"trimmed":"Mul_m22_m22","name":"b2Mul_m22_m22","def":b2Mul_m22_m22},{"trimmed":"MulT_m22_m22","name":"b2MulT_m22_m22","def":b2MulT_m22_m22},{"trimmed":"Mul_m33_v3","name":"b2Mul_m33_v3","def":b2Mul_m33_v3},{"trimmed":"Mul22_m33_v2","name":"b2Mul22_m33_v2","def":b2Mul22_m33_v2},{"trimmed":"Mul_r_r","name":"b2Mul_r_r","def":b2Mul_r_r},{"trimmed":"MulT_r_r","name":"b2MulT_r_r","def":b2MulT_r_r},{"trimmed":"Mul_r_v2","name":"b2Mul_r_v2","def":b2Mul_r_v2},{"trimmed":"MulT_r_v2","name":"b2MulT_r_v2","def":b2MulT_r_v2},{"trimmed":"Mul_t_v2","name":"b2Mul_t_v2","def":b2Mul_t_v2},{"trimmed":"Min_v2","name":"b2Min_v2","def":b2Min_v2},{"trimmed":"Max_v2","name":"b2Max_v2","def":b2Max_v2},{"trimmed":"Clamp","name":"b2Clamp","def":b2Clamp},{"trimmed":"MulT_t_v2","name":"b2MulT_t_v2","def":b2MulT_t_v2},{"trimmed":"Mul_t_t","name":"b2Mul_t_t","def":b2Mul_t_t},{"trimmed":"MulT_t_t","name":"b2MulT_t_t","def":b2MulT_t_t},{"trimmed":"Clamp_v2","name":"b2Clamp_v2","def":b2Clamp_v2},{"trimmed":"NextPowerOfTwo","name":"b2NextPowerOfTwo","def":b2NextPowerOfTwo},{"trimmed":"Abs_v2","name":"b2Abs_v2","def":b2Abs_v2},{"trimmed":"Abs_m22","name":"b2Abs_m22","def":b2Abs_m22},{"trimmed":"IsPowerOfTwo","name":"b2IsPowerOfTwo","def":b2IsPowerOfTwo},{"trimmed":"RandomFloat","name":"b2RandomFloat","def":b2RandomFloat},{"trimmed":"Timer","name":"b2Timer","def":b2Timer},{"trimmed":"Color","name":"b2Color","def":b2Color},{"trimmed":"Draw","name":"b2Draw","def":b2Draw},{"trimmed":"ContactID","name":"b2ContactID","def":b2ContactID},{"trimmed":"ManifoldPoint","name":"b2ManifoldPoint","def":b2ManifoldPoint},{"trimmed":"Manifold","name":"b2Manifold","def":b2Manifold},{"trimmed":"WorldManifold","name":"b2WorldManifold","def":b2WorldManifold},{"trimmed":"GetPointStates","name":"b2GetPointStates","def":b2GetPointStates},{"trimmed":"ClipVertex","name":"b2ClipVertex","def":b2ClipVertex},{"trimmed":"RayCastInput","name":"b2RayCastInput","def":b2RayCastInput},{"trimmed":"RayCastOutput","name":"b2RayCastOutput","def":b2RayCastOutput},{"trimmed":"AABB","name":"b2AABB","def":b2AABB},{"trimmed":"CollideCircles","name":"b2CollideCircles","def":b2CollideCircles},{"trimmed":"CollidePolygonAndCircle","name":"b2CollidePolygonAndCircle","def":b2CollidePolygonAndCircle},{"trimmed":"FindMaxSeparation","name":"b2FindMaxSeparation","def":b2FindMaxSeparation},{"trimmed":"FindIncidentEdge","name":"b2FindIncidentEdge","def":b2FindIncidentEdge},{"trimmed":"CollidePolygons","name":"b2CollidePolygons","def":b2CollidePolygons},{"trimmed":"CollideEdgeAndCircle","name":"b2CollideEdgeAndCircle","def":b2CollideEdgeAndCircle},{"trimmed":"EPAxis","name":"b2EPAxis","def":b2EPAxis},{"trimmed":"TempPolygon","name":"b2TempPolygon","def":b2TempPolygon},{"trimmed":"ReferenceFace","name":"b2ReferenceFace","def":b2ReferenceFace},{"trimmed":"EPCollider","name":"b2EPCollider","def":b2EPCollider},{"trimmed":"CollideEdgeAndPolygon","name":"b2CollideEdgeAndPolygon","def":b2CollideEdgeAndPolygon},{"trimmed":"ClipSegmentToLine","name":"b2ClipSegmentToLine","def":b2ClipSegmentToLine},{"trimmed":"TestShapeOverlap","name":"b2TestShapeOverlap","def":b2TestShapeOverlap},{"trimmed":"TestOverlap","name":"b2TestOverlap","def":b2TestOverlap},{"trimmed":"Shape","name":"b2Shape","def":b2Shape},{"trimmed":"CircleShape","name":"b2CircleShape","def":b2CircleShape},{"trimmed":"EdgeShape","name":"b2EdgeShape","def":b2EdgeShape},{"trimmed":"ChainShape","name":"b2ChainShape","def":b2ChainShape},{"trimmed":"PolygonShape","name":"b2PolygonShape","def":b2PolygonShape},{"trimmed":"Pair","name":"b2Pair","def":b2Pair},{"trimmed":"PairLessThan","name":"b2PairLessThan","def":b2PairLessThan},{"trimmed":"BroadPhase","name":"b2BroadPhase","def":b2BroadPhase},{"trimmed":"DistanceProxy","name":"b2DistanceProxy","def":b2DistanceProxy},{"trimmed":"SimplexCache","name":"b2SimplexCache","def":b2SimplexCache},{"trimmed":"DistanceInput","name":"b2DistanceInput","def":b2DistanceInput},{"trimmed":"DistanceOutput","name":"b2DistanceOutput","def":b2DistanceOutput},{"trimmed":"SimplexVertex","name":"b2SimplexVertex","def":b2SimplexVertex},{"trimmed":"Simplex","name":"b2Simplex","def":b2Simplex},{"trimmed":"DistanceFunc","name":"b2DistanceFunc","def":b2DistanceFunc},{"trimmed":"TreeNode","name":"b2TreeNode","def":b2TreeNode},{"trimmed":"DynamicTree","name":"b2DynamicTree","def":b2DynamicTree},{"trimmed":"TOIInput","name":"b2TOIInput","def":b2TOIInput},{"trimmed":"TOIOutput","name":"b2TOIOutput","def":b2TOIOutput},{"trimmed":"SeparationFunction","name":"b2SeparationFunction","def":b2SeparationFunction},{"trimmed":"TimeOfImpact","name":"b2TimeOfImpact","def":b2TimeOfImpact},{"trimmed":"BodyDef","name":"b2BodyDef","def":b2BodyDef},{"trimmed":"Body","name":"b2Body","def":b2Body},{"trimmed":"Filter","name":"b2Filter","def":b2Filter},{"trimmed":"FixtureDef","name":"b2FixtureDef","def":b2FixtureDef},{"trimmed":"Fixture","name":"b2Fixture","def":b2Fixture},{"trimmed":"DestructionListener","name":"b2DestructionListener","def":b2DestructionListener},{"trimmed":"ContactFilter","name":"b2ContactFilter","def":b2ContactFilter},{"trimmed":"ContactImpulse","name":"b2ContactImpulse","def":b2ContactImpulse},{"trimmed":"ContactListener","name":"b2ContactListener","def":b2ContactListener},{"trimmed":"QueryCallback","name":"b2QueryCallback","def":b2QueryCallback},{"trimmed":"RayCastCallback","name":"b2RayCastCallback","def":b2RayCastCallback},{"trimmed":"TimeStep","name":"b2TimeStep","def":b2TimeStep},{"trimmed":"Position","name":"b2Position","def":b2Position},{"trimmed":"Velocity","name":"b2Velocity","def":b2Velocity},{"trimmed":"SolverData","name":"b2SolverData","def":b2SolverData},{"trimmed":"World","name":"b2World","def":b2World},{"trimmed":"MixFriction","name":"b2MixFriction","def":b2MixFriction},{"trimmed":"MixRestitution","name":"b2MixRestitution","def":b2MixRestitution},{"trimmed":"ContactRegister","name":"b2ContactRegister","def":b2ContactRegister},{"trimmed":"ContactEdge","name":"b2ContactEdge","def":b2ContactEdge},{"trimmed":"Contact","name":"b2Contact","def":b2Contact},{"trimmed":"CircleContact","name":"b2CircleContact","def":b2CircleContact},{"trimmed":"PolygonContact","name":"b2PolygonContact","def":b2PolygonContact},{"trimmed":"ChainAndCircleContact","name":"b2ChainAndCircleContact","def":b2ChainAndCircleContact},{"trimmed":"ChainAndPolygonContact","name":"b2ChainAndPolygonContact","def":b2ChainAndPolygonContact},{"trimmed":"EdgeAndCircleContact","name":"b2EdgeAndCircleContact","def":b2EdgeAndCircleContact},{"trimmed":"EdgeAndPolygonContact","name":"b2EdgeAndPolygonContact","def":b2EdgeAndPolygonContact},{"trimmed":"PolygonAndCircleContact","name":"b2PolygonAndCircleContact","def":b2PolygonAndCircleContact},{"trimmed":"defaultFilter","name":"b2_defaultFilter","def":b2_defaultFilter},{"trimmed":"defaultListener","name":"b2_defaultListener","def":b2_defaultListener},{"trimmed":"ContactManager","name":"b2ContactManager","def":b2ContactManager},{"trimmed":"VelocityConstraintPoint","name":"b2VelocityConstraintPoint","def":b2VelocityConstraintPoint},{"trimmed":"ContactPositionConstraint","name":"b2ContactPositionConstraint","def":b2ContactPositionConstraint},{"trimmed":"ContactVelocityConstraint","name":"b2ContactVelocityConstraint","def":b2ContactVelocityConstraint},{"trimmed":"PositionSolverManifold","name":"b2PositionSolverManifold","def":b2PositionSolverManifold},{"trimmed":"ContactSolverDef","name":"b2ContactSolverDef","def":b2ContactSolverDef},{"trimmed":"ContactSolver","name":"b2ContactSolver","def":b2ContactSolver},{"trimmed":"Island","name":"b2Island","def":b2Island},{"trimmed":"Jacobian","name":"b2Jacobian","def":b2Jacobian},{"trimmed":"JointEdge","name":"b2JointEdge","def":b2JointEdge},{"trimmed":"JointDef","name":"b2JointDef","def":b2JointDef},{"trimmed":"Joint","name":"b2Joint","def":b2Joint},{"trimmed":"RevoluteJointDef","name":"b2RevoluteJointDef","def":b2RevoluteJointDef},{"trimmed":"RevoluteJoint","name":"b2RevoluteJoint","def":b2RevoluteJoint},{"trimmed":"MouseJointDef","name":"b2MouseJointDef","def":b2MouseJointDef},{"trimmed":"MouseJoint","name":"b2MouseJoint","def":b2MouseJoint},{"trimmed":"DistanceJointDef","name":"b2DistanceJointDef","def":b2DistanceJointDef},{"trimmed":"DistanceJoint","name":"b2DistanceJoint","def":b2DistanceJoint},{"trimmed":"PrismaticJointDef","name":"b2PrismaticJointDef","def":b2PrismaticJointDef},{"trimmed":"PrismaticJoint","name":"b2PrismaticJoint","def":b2PrismaticJoint},{"trimmed":"FrictionJointDef","name":"b2FrictionJointDef","def":b2FrictionJointDef},{"trimmed":"FrictionJoint","name":"b2FrictionJoint","def":b2FrictionJoint},{"trimmed":"WeldJointDef","name":"b2WeldJointDef","def":b2WeldJointDef},{"trimmed":"WeldJoint","name":"b2WeldJoint","def":b2WeldJoint},{"trimmed":"WheelJointDef","name":"b2WheelJointDef","def":b2WheelJointDef},{"trimmed":"WheelJoint","name":"b2WheelJoint","def":b2WheelJoint},{"trimmed":"GearJointDef","name":"b2GearJointDef","def":b2GearJointDef},{"trimmed":"GearJoint","name":"b2GearJoint","def":b2GearJoint},{"trimmed":"MotorJointDef","name":"b2MotorJointDef","def":b2MotorJointDef},{"trimmed":"MotorJoint","name":"b2MotorJoint","def":b2MotorJoint},{"trimmed":"PulleyJointDef","name":"b2PulleyJointDef","def":b2PulleyJointDef},{"trimmed":"PulleyJoint","name":"b2PulleyJoint","def":b2PulleyJoint},{"trimmed":"RopeJointDef","name":"b2RopeJointDef","def":b2RopeJointDef},{"trimmed":"RopeJoint","name":"b2RopeJoint","def":b2RopeJoint},{"trimmed":"RopeDef","name":"b2RopeDef","def":b2RopeDef},{"trimmed":"Rope","name":"b2Rope","def":b2Rope},{"trimmed":"maxManifoldPoints","name":"b2_maxManifoldPoints","def":b2_maxManifoldPoints},{"trimmed":"maxPolygonVertices","name":"b2_maxPolygonVertices","def":b2_maxPolygonVertices},{"trimmed":"aabbExtension","name":"b2_aabbExtension","def":b2_aabbExtension},{"trimmed":"aabbMultiplier","name":"b2_aabbMultiplier","def":b2_aabbMultiplier},{"trimmed":"linearSlop","name":"b2_linearSlop","def":b2_linearSlop},{"trimmed":"angularSlop","name":"b2_angularSlop","def":b2_angularSlop},{"trimmed":"polygonRadius","name":"b2_polygonRadius","def":b2_polygonRadius},{"trimmed":"maxSubSteps","name":"b2_maxSubSteps","def":b2_maxSubSteps},{"trimmed":"maxTOIContacts","name":"b2_maxTOIContacts","def":b2_maxTOIContacts},{"trimmed":"velocityThreshold","name":"b2_velocityThreshold","def":b2_velocityThreshold},{"trimmed":"maxLinearCorrection","name":"b2_maxLinearCorrection","def":b2_maxLinearCorrection},{"trimmed":"maxAngularCorrection","name":"b2_maxAngularCorrection","def":b2_maxAngularCorrection},{"trimmed":"maxTranslation","name":"b2_maxTranslation","def":b2_maxTranslation},{"trimmed":"maxTranslationSquared","name":"b2_maxTranslationSquared","def":b2_maxTranslationSquared},{"trimmed":"maxRotation","name":"b2_maxRotation","def":b2_maxRotation},{"trimmed":"maxRotationSquared","name":"b2_maxRotationSquared","def":b2_maxRotationSquared},{"trimmed":"baumgarte","name":"b2_baumgarte","def":b2_baumgarte},{"trimmed":"toiBaugarte","name":"b2_toiBaugarte","def":b2_toiBaugarte},{"trimmed":"timeToSleep","name":"b2_timeToSleep","def":b2_timeToSleep},{"trimmed":"linearSleepTolerance","name":"b2_linearSleepTolerance","def":b2_linearSleepTolerance},{"trimmed":"angularSleepTolerance","name":"b2_angularSleepTolerance","def":b2_angularSleepTolerance},{"trimmed":"epsilon","name":"b2_epsilon","def":b2_epsilon},{"trimmed":"JsonSerializer","name":"b2JsonSerializer","def":b2JsonSerializer},{"trimmed":"RUBELoader","name":"b2RUBELoader","def":b2RUBELoader},{"trimmed":"Profiler","name":"b2Profiler","def":b2Profiler}];
if (typeof(b2_compatibility) !== "undefined" && typeof(window) !== "undefined")
{
    for (var i = 0; i < mappings.length; ++i)
        window[mappings[i].name] = mappings[i].def;
}
else
{
var b2 = {};

for (var i = 0; i < mappings.length; ++i)
    b2[mappings[i].trimmed] = mappings[i].def;

if (typeof(module) !== "undefined")
    module.exports = b2;
else
    window["b2"] = b2;
}
})();