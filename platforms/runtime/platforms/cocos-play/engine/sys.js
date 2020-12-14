const sys = cc.sys;
const originInit = sys.__init;;

Object.assign(sys, {
    __init () {
        originInit.call(this);
        this.platform = this.COCOSPLAY;
    },
});