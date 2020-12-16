const sys = cc.sys;
const originInit = sys.__init;
const adapter = window.__globalAdapter;
const env = adapter.getSystemInfoSync();

Object.assign(sys, {
    __init () {
        originInit.call(this);
        if (env.platform === 'devtools') {
            let system = env.system.toLowerCase();
            if (system.indexOf('android') > -1) {
                this.os = this.OS_ANDROID;
            }
            else if (system.indexOf('ios') > -1) {
                this.os = this.OS_IOS;
            }
        }
        this.platform = this.BYTEDANCE_MINI_GAME;

        // move to common if other platforms support
        this.getSafeAreaRect = function () {
            let view = cc.view;
            let safeArea = adapter.getSafeArea();
            let screenSize = view.getFrameSize(); // Get leftBottom and rightTop point in UI coordinates
            let leftBottom = new cc.Vec2(safeArea.left, safeArea.bottom);
            let rightTop = new cc.Vec2(safeArea.right, safeArea.top); // Returns the real location in view.
            let relatedPos = {
                left: 0,
                top: 0,
                width: screenSize.width,
                height: screenSize.height
            };
            view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
            view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop); // convert view point to design resolution size
            view._convertPointWithScale(leftBottom);
            view._convertPointWithScale(rightTop);
            return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
        };
    },
});