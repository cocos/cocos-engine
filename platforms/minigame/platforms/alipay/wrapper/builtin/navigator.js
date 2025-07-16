import { noop } from "./utils/noop";

var systemInfo = my.getSystemInfoSync();

const { system, platform = "android", language } = systemInfo || {};
const android = platform.toLowerCase().indexOf('android') !== -1;

if(my.onNetworkStatusChange){ 
    my.onNetworkStatusChange((res) => {
        navigator.onLine = res.isConnected ? true : false;
    });
}

function getCurrentPosition(cb) {
    if(typeof cb !== "function") {
        throw new TypeError("Failed to execute 'getCurrentPosition' on 'Geolocation': 1 argument required, but only 0 present.");
    }

    my.getLocation({
        success(res) {
            var { accuracy, latitude, longitude } = res;
            cb({
                coords: {
                    accuracy, 
                    latitude, 
                    longitude
                },
                timestamp: (new Date()).valueOf()
            })
        }
    })
}

var uaDesc = android ? 'Android; CPU ' + system : 'iPhone; CPU iPhone OS ' + system + ' like Mac OS X';
var userAgent = `Mozilla/5.0 (${uaDesc}) AliApp(AP/${systemInfo.version}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 AlipayMiniGame NetType/WIFI Language/${language}`;
if(window.navigator) {
    userAgent = window.navigator.userAgent + " AlipayMiniGame";
} 

var navigator = {
    platform,
    language,
    userAgent,
    appVersion: '5.0 (' + uaDesc + ') AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    geolocation: {
        getCurrentPosition,
        watchPositon: noop,
        clearWatch: noop
    }
}

export default navigator;