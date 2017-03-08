
var BodyType = cc.Enum({
    Static: 0,
    Kinematic: 1,
    Dynamic: 2,
    Animated: 3
});

var ContactType = {
    BEGIN_CONTACT: 'begin-contact',
    END_CONTACT: 'end-contact',
    PRE_SOLVE: 'pre-solve',
    POST_SOLVE: 'post-solve'
};

var RayCastType = cc.Enum({
    Closest: 0,
    Any: 1,
    All: 2
});

cc.RayCastType = RayCastType;

module.exports = {
    BodyType: BodyType,
    ContactType: ContactType,
    RayCastType: RayCastType
};
