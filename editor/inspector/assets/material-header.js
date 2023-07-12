'use strict';

exports.template = /* html */`
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

exports.style = /* css */`
:host > .section {
    height: 200px;
    padding: 4px 0 4px 4px;
    box-sizing: border-box;
    display: flex;
    background: var(--color-normal-fill);
    border-bottom: 1px solid var(--color-normal-border);
}
:host > .section > canvas { flex: 1; min-width: 0; }
:host > .section > .tools { display: flex; flex-direction: column; padding: 0 4px; }
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

        if (panel.isPreviewDataDirty) {
            panel.isPreviewDataDirty = false;

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
        }

        cancelAnimationFrame(panel.animationId);
        panel.animationId = requestAnimationFrame(() => {
            panel.refreshPreview();
        });
    },
    updatePreviewDataDirty() {
        const panel = this;

        panel.isPreviewDataDirty = true;
    },
};

exports.ready = async function() {
    const panel = this;

    callMaterialPreviewFunction('setLightEnable', true);
    panel.$.light.addEventListener('confirm', async () => {
        await callMaterialPreviewFunction('setLightEnable', this.$.light.checked);
        panel.isPreviewDataDirty = true;
    });

    callMaterialPreviewFunction('setPrimitive', 'box');
    panel.$.primitive.addEventListener('confirm', async () => {
        await callMaterialPreviewFunction('setPrimitive', this.$.primitive.value);
        panel.isPreviewDataDirty = true;
    });

    panel.$.canvas.addEventListener('mousedown', async (event) => {
        await callMaterialPreviewFunction('onMouseDown', { x: event.x, y: event.y });

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
