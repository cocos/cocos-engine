var cc = cc || {};

cc.NetworkType = {
    NONE: 0,
    LAN: 1,
    WWAN: 2
};

cc.Device = {
    getBatteryLevel: function() {
        // TODO: need to implement this for mobile phones.
        return 1.0;
    },
    getNetworkType: function() {
        // TODO: need to implement this for mobile phones.
        return cc.NetworkType.LAN;
    }
};
