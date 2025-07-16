const style = require('./render/style')
const template = require('./render/template')
const Layout = require('./engine').default;

let __env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
let sharedCanvas  = __env.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
function draw() {
    Layout.clear();
    Layout.init(template, style);
    Layout.layout(sharedContext);
}

function updateViewPort(data) { 
    Layout.updateViewPort({
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
    });
}

__env.onMessage(data => {
    if ( data.type === 'engine' && data.event === 'viewport' ) {
        updateViewPort(data);
        draw();
    }
});
