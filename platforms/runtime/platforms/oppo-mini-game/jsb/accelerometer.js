window.jsb = window.jsb || {};

let isAccelerometerInit = false;
let sysInfo = qg.getSystemInfoSync();
let isLandscape = sysInfo.windowWidth > sysInfo.windowHeight;

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;

Object.assign(jsb, {
    startAccelerometer (cb) {
        qg.onAccelerometerChange(function (res) {
            let resClone = {};
            let x = res.x;
            let y = res.y; 
            let factor = 1;         

            // rotate
            let tmp = x;
            x = y;
            y = tmp;
            
            // TODO: 无法判断方向
            // if (isLandscape) {
            //     let tmp = x;
            //     x = -y;
            //     y = tmp;
            // }
            resClone.x = x * factor;
            resClone.y = y * -factor;
            resClone.z = res.z * factor;
            cb && cb(resClone);
        });
    },

    stopAccelerometer () {
        qg.stopAccelerometer();
    },

    setAccelerometerInterval (interval) {
        // TODO
    },
});