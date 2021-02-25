window.jsb = window.jsb || {};

let isAccelerometerInit = false;
let sysInfo = qg.getSystemInfoSync();
let isLandscape = sysInfo.screenWidth > sysInfo.screenHeight;

// const PORTRAIT = 0;
// const LANDSCAPE_LEFT = -90;
// const PORTRAIT_UPSIDE_DOWN = 180;
// const LANDSCAPE_RIGHT = 90;

Object.assign(jsb, {
    startAccelerometer (cb) {
        qg.subscribeAccelerometer({
            callback: function (res) {
                let resClone = {};
                let x = res.x;
                let y = res.y;    
                let factor = 0.1;            
                
                // KNOWN_ISSUE: don't know LANDSCAPE_RIGHT or LANDSCAPE_LEFT
                // here isLandscape means isLandscapeRight
                if (isLandscape) {
                    let tmp = x;
                    x = -y;
                    y = tmp;
                }
                resClone.x = x * -factor;
                resClone.y = y * -factor;
                resClone.z = res.z * factor;
                cb && cb(resClone);
            }
        });
    },

    stopAccelerometer () {
        qg.unsubscribeAccelerometer();
    },

    setAccelerometerInterval (interval) {
        // TODO
    },
});