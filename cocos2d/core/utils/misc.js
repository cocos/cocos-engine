var JS = cc.js;

var misc = {};

misc.propertyDefine = function (ctor, sameNameGetSets, diffNameGetSets) {
    var propName, np = ctor.prototype;
    for (var i = 0; i < sameNameGetSets.length; i++) {
        propName = sameNameGetSets[i];
        var suffix = propName[0].toUpperCase() + propName.slice(1);
        var pd = Object.getOwnPropertyDescriptor(np, propName);
        if (pd) {
            if (pd.get) np['get' + suffix] = pd.get;
            if (pd.set) np['set' + suffix] = pd.set;
        }
        else {
            JS.getset(np, propName, np['get' + suffix], np['set' + suffix]);
        }
    }
    for (propName in diffNameGetSets) {
        var getset = diffNameGetSets[propName];
        var pd = Object.getOwnPropertyDescriptor(np, propName);
        if (pd) {
            np[getset[0]] = pd.get;
            if (getset[1]) np[getset[1]] = pd.set;
        }
        else {
            JS.getset(np, propName, np[getset[0]], np[getset[1]]);
        }
    }
};

var DirtyFlags = misc.DirtyFlags = {
    TRANSFORM: 1 << 0,
    SIZE: 1 << 1,
    //Visible:
    //Color:
    //Opacity
    //Cache
    //Order
    //Text
    //Gradient
    ALL: (1 << 2) - 1
};

DirtyFlags.WIDGET = DirtyFlags.TRANSFORM | DirtyFlags.SIZE;

module.exports = misc;
