export default class Navigator {
    platform = "";
    language = "";
    appVersion = '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
    userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 NetType/WIFI Language/zh_CN';
    onLine = true;
    maxTouchPoints = 10;
    geolocation = {
        getCurrentPosition() {
        },
        watchPosition() {
        },
        clearWatch() {
        }
    };

    constructor(platform, language) {
        this.platform = platform;
        this.language = language;
    }
}