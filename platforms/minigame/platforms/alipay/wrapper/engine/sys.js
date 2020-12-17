const sys = cc.sys;
const originInit = sys.__init;
const adapter = window.__globalAdapter;
const env = adapter.getSystemInfoSync();

Object.assign(sys, {
    __init () {
        originInit.call(this);
        this.platform = this.ALIPAY_MINI_GAME;
    },
});