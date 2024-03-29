'use strict';

const previewParams = {
    shape: 'sphere',
    light: true,
};

exports.template = /* html */`
<div class="section">
    <div class="tools">
        <ui-select class="primitive">
            <option>sphere</option>
            <option>box</option>
            <option>capsule</option>
            <option>cylinder</option>
            <option>torus</option>
            <option>cone</option>
            <option>quad</option>
        </ui-select>
        <ui-checkbox>Light</ui-checkbox>
    </div>
    <canvas></canvas>
</div>
`;

exports.style = /* css */`
:host > .section {
    display: flex;
    flex-direction: column;
    height: var(--inspector-header-preview-height, 200px);
    padding: 4px;
    box-sizing: border-box;
    background: var(--color-normal-fill);
}
:host > .section > canvas { flex: 1; max-height: 100%; aspect-ratio: auto; }
:host > .section > .tools { display: flex; margin-bottom: 4px; }
:host > .section > .tools > ui-select { flex: 1; }
:host > .section > .tools > ui-checkbox { margin-left: 4px; }
`;

exports.$ = {
    container: '.section',
    canvas: 'canvas',
    primitive: 'ui-select',
    light: 'ui-checkbox',
};

async function callMaterialPreviewFunction(funcName, ...args) {
    return await Editor.Message.request('scene', 'call-preview-function', 'scene:material-preview', funcName, ...args);
}

exports.methods = {
    hideAllContent(hide) {
        this.$.container.style = hide ? 'display:none' : '';
    },
    async refreshPreview() {
        const panel = this;

        // After await, the panel no longer exists
        if (!panel.$.canvas) {
            return;
        }

        const doDraw = async function() {
            try {
                const canvas = panel.$.canvas;

                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                if (canvas.width !== width || canvas.height !== height) {
                    // The width and height of the canvas must be set
                    canvas.width = width;
                    canvas.height = height;

                    await panel.glPreview.initGL(canvas, { width, height });
                    await panel.glPreview.resizeGL(width, height);
                }
                const info = await panel.glPreview.queryPreviewData({
                    width,
                    height,
                });
                panel.glPreview.drawGL(info);
            } catch (e) {
                console.warn(e);
            }
        };

        requestAnimationFrame(async () => {
            await doDraw();
            panel.isPreviewDataDirty = false;
        });
    },
    updatePreviewDataDirty() {
        const panel = this;

        panel.isPreviewDataDirty = true;
    },
};

exports.ready = async function() {
    const panel = this;

    let _isPreviewDataDirty = false;
    Object.defineProperty(panel, 'isPreviewDataDirty', {
        get() {
            return _isPreviewDataDirty;
        },
        set(value) {
            if (value !== _isPreviewDataDirty) {
                _isPreviewDataDirty = value;
                value && panel.refreshPreview();
            }
        },
    });

    callMaterialPreviewFunction('resetCamera');

    panel.$.light.value = previewParams.light;
    callMaterialPreviewFunction('setLightEnable', previewParams.light);
    panel.$.light.addEventListener('confirm', async (event) => {
        previewParams.light = event.target.value;
        await callMaterialPreviewFunction('setLightEnable', previewParams.light);
        panel.isPreviewDataDirty = true;
    });

    panel.$.primitive.value = previewParams.shape;
    callMaterialPreviewFunction('setPrimitive', previewParams.shape);
    panel.$.primitive.addEventListener('confirm', async (event) => {
        previewParams.shape = event.target.value;
        await callMaterialPreviewFunction('setPrimitive', previewParams.shape);
        panel.isPreviewDataDirty = true;
    });

    panel.$.canvas.addEventListener('mousedown', async (event) => {
        await callMaterialPreviewFunction('onMouseDown', { x: event.x, y: event.y, button: event.button });

        async function mousemove(event) {
            await callMaterialPreviewFunction('onMouseMove', {
                movementX: event.movementX,
                movementY: event.movementY,
            });

            panel.isPreviewDataDirty = true;
        }

        async function mouseup(event) {
            await callMaterialPreviewFunction('onMouseUp', {
                x: event.x,
                y: event.y,
            });

            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);

            panel.isPreviewDataDirty = false;
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        panel.isPreviewDataDirty = true;
    });

    panel.$.canvas.addEventListener('wheel', async (event) => {
        await callMaterialPreviewFunction('onMouseWheel', {
            wheelDeltaY: event.wheelDeltaY,
            wheelDeltaX: event.wheelDeltaX,
        });
        panel.isPreviewDataDirty = true;
    });

    const GlPreview = Editor._Module.require('PreviewExtends').default;
    panel.glPreview = new GlPreview('scene:material-preview', 'query-material-preview-data');

    function observer() {
        panel.isPreviewDataDirty = true;
    }

    panel.resizeObserver = new window.ResizeObserver(observer);
    panel.resizeObserver.observe(panel.$.container);
    observer();

    this.updatePreviewDataDirtyBind = this.updatePreviewDataDirty.bind(this);
    Editor.Message.addBroadcastListener('material-inspector:change-dump', this.updatePreviewDataDirtyBind);
};

exports.update = async function(assetList, metaList) {
    const panel = this;
    callMaterialPreviewFunction('resetCamera');

    panel.assetList = assetList;
    panel.metaList = metaList;
    panel.asset = assetList[0];
    panel.meta = metaList[0];
    const notOnlyOne = assetList.length !== 1;
    this.hideAllContent(notOnlyOne);
    if (notOnlyOne) {
        return;
    }
    if (!panel.$.canvas) {
        return;
    }

    await panel.glPreview.init({ width: this.$.canvas.clientWidth, height: this.$.canvas.clientHeight });

    panel.isPreviewDataDirty = true;
    panel.refreshPreview();
};

exports.close = function() {
    const panel = this;
    callMaterialPreviewFunction('hide');
    panel.resizeObserver.unobserve(panel.$.container);
    Editor.Message.removeBroadcastListener('material-inspector:change-dump', this.updatePreviewDataDirtyBind);
    // clear the canvas on close hook
    panel.glPreview.destroyGL();
};
