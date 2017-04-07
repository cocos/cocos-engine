
var ContactType = {
    BEGIN_CONTACT: 'begin-contact',
    END_CONTACT: 'end-contact',
    PRE_SOLVE: 'pre-solve',
    POST_SOLVE: 'post-solve'
};

var BodyType = cc.Enum({
    Static: 0,
    Kinematic: 1,
    Dynamic: 2,
    Animated: 3
});
cc.RigidBodyType = BodyType;

var RayCastType = cc.Enum({
    Closest: 0,
    Any: 1,
    All: 2
});
cc.RayCastType = RayCastType;

module.exports = {
    BodyType: BodyType,
    ContactType: ContactType,
    RayCastType: RayCastType,

    PTM_RATIO: 32,
    ANGLE_TO_PHYSICS_ANGLE: -Math.PI / 180,
    PHYSICS_ANGLE_TO_ANGLE: -180 / Math.PI,
};
