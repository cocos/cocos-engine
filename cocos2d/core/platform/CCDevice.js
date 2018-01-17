
/**
 * !#en
 * Network type enumeration
 * !#zh
 * 网络类型枚举
 *
 * @enum NetworkType
 */
cc.NetworkType = {
    /**
     * !#en
     * Network is unreachable.
     * !#zh
     * 网络不通
     *
     * @property {Number} NONE
     */
    NONE: 0,
    /**
     * !#en
     * Network is reachable via WiFi or cable.
     * !#zh
     * 通过无线或者有线本地网络连接因特网
     *
     * @property {Number} LAN
     */
    LAN: 1,
    /**
     * !#en
     * Network is reachable via Wireless Wide Area Network
     * !#zh
     * 通过蜂窝移动网络连接因特网
     *
     * @property {Number} WWAN
     */
    WWAN: 2
};

/**
 * !#en
 * cc.Device is used for getting hardware status of current device.
 * !#zh
 * cc.Device 用于获取当前设备的系统信息
 *
 * @class Device
 */
cc.Device = {
    /**
     * !#en
     * Get the battery level of current device, return 1.0 if failure.
     * !#zh
     * 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     *
     * @method getBatteryLevel
     * @return {Number} - 0.0 ~ 1.0
     * @static
     */
    getBatteryLevel: function() {
        // TODO: need to implement this for mobile phones.
        return 1.0;
    },

    /**
     * !#en
     * Get the network type of current device, return cc.NetworkType.LAN if failure.
     * !#zh
     * 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.NetworkType.LAN
     *
     * @method getNetworkType
     * @return {NetworkType}
     * @static
     */
    getNetworkType: function() {
        // TODO: need to implement this for mobile phones.
        return cc.NetworkType.LAN;
    }
};
