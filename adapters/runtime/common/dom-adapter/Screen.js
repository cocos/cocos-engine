window.jsb = window.jsb || {};
export default class Screen {
    availTop = 0;
    availLeft = 0;
    availHeight = jsb.height;
    availWidth = jsb.width;
    colorDepth = 8;
    pixelDepth = 0;
    left = 0;
    top = 0;
    width = jsb.width;
    height = jsb.height;
    orientation = { //FIXME:cjh
        type: 'portrait-primary' // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
    };

    onorientationchange() {
    }
}