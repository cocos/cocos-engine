'use strict';

const GlPreview = Editor._Module.require('PreviewExtends').default;
const glPreview = new GlPreview('scene:material-preview', 'query-material-preview-data');

exports.style = `
:host > .section { height: 200px; display: flex; }
:host > .section > canvas { flex: 1; min-width: 0; }
:host > .section > .tools { display: flex; flex-direction: column; padding: 6px 4px; }
`;

exports.template = `
<div class="section">
    <canvas></canvas>
    <div class="tools">
        <ui-select value="box" class="primitive">
            <option>box</option>
            <option>sphere</option>
            <option>capsule</option>
            <option>cylinder</option>
            <option>torus</option>
            <option>cone</option>
            <option>quad</option>
        </ui-select>
        <ui-checkbox checked>Light</ui-checkbox>
    </div>
</div>
`;

exports.$ = {
    canvas: 'canvas',
    primitive: 'ui-select',
    light: 'ui-checkbox',
};

exports.methods = {
    async refreshPreview() {

        if (this.waitRefreshNum > 0) {
            this.waitRefreshNum++;
            return;
        }
        this.waitRefreshNum = 1;

        await glPreview.init({ width: this.$.canvas.clientWidth, height: this.$.canvas.clientHeight });
        await Editor.Message.request('scene', 'preview-material', this.asset.uuid);

        const width = this.$.canvas.clientWidth;
        const height = this.$.canvas.clientHeight;
        if (this.$.canvas.width !== width || this.$.canvas.height !== height) {
            glPreview.initGL(this.$.canvas, { width, height });

            // 必须要设置 canvas的宽高
            this.$.canvas.width = width;
            this.$.canvas.height = height;

            glPreview.resizeGL(width, height);
        }
        const info = await glPreview.queryPreviewData({
            width,
            height,
        });
        try {
            glPreview.drawGL(info.buffer, info.width, info.height);
        } catch (e) {
            console.warn(e);
        }
        if (this.waitRefreshNum > 1) {
            this.waitRefreshNum = 0;
            this.refreshPreview();
        } else {
            this.waitRefreshNum = 0;
        }
    },
};

/**
 * 自动渲染组件的方法
 * @param assetList 
 * @param metaList 
 */
exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    this.waitRefreshNum = 0;

    this.refreshPreview();
};

/**
 * 初始化界面的方法
 */
exports.ready = async function() {
    Editor.Message.request('scene', 'set-material-preview-light-enable', true);
    this.$.light.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'set-material-preview-light-enable', this.$.light.checked);
        this.refreshPreview();
    });

    Editor.Message.request('scene', 'set-material-preview-primitive', 'box');
    this.$.primitive.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'set-material-preview-primitive', this.$.primitive.value);
        this.refreshPreview();
    });

    this.$.canvas.addEventListener('mousedown', (event) => {
        Editor.Message.request('scene', 'on-material-preview-mouse-down', { x: event.x, y: event.y });

        event.target.requestPointerLock();
        const panel = this;

        function mousemove(event) {
            Editor.Message.request('scene', 'on-material-preview-mouse-move', { movementX: event.movementX, movementY: event.movementY });
            panel.refreshPreview();
        }
        function mouseup(event) {
            Editor.Message.request('scene', 'on-material-preview-mouse-up', { x: event.x, y: event.y });
            document.exitPointerLock();
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            panel.refreshPreview();
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        this.refreshPreview();
    });
}
