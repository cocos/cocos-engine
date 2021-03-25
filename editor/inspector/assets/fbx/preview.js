'use strict';

exports.template = `
<div class="preview">
    <div class="info">
        <ui-label value="Vertices:0" class="vertices"></ui-label>
        <ui-label value="Triangles:0" class="triangles"></ui-label>
    </div>
    <div class="image">
        <canvas class="canvas"></canvas>
    </div>
</div>
`;

exports.style = `
.preview {
    margin-top: 10px;
    border-top: 1px solid var(--color-normal-border);
}
.preview > .info {
    padding-top: 8px;
}
.preview > .info > ui-label {
    margin-right: 6px;
}
.preview > .image {
    height: 200px;
    overflow: hidden;
    display: flex;
    flex: 1;
    margin-right: 10px;
}
.preview >.image > .canvas {
    flex: 1;
}
`;

exports.$ = {
    container: '.preview',
    vertices: '.vertices',
    triangles: '.triangles',
    image: '.image',
    canvas: '.canvas',
};

const Elements = {
    preview: {
        ready() {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', (event) => {
                // event.target.requestPointerLock();

                Editor.Message.request('scene', 'on-model-preview-mouse-down', { x: event.x, y: event.y });

                function mousemove(event) {
                    Editor.Message.send('scene', 'on-model-preview-mouse-move', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                function mouseup(event) {
                    // document.exitPointerLock();

                    Editor.Message.send('scene', 'on-model-preview-mouse-up', {
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
            panel.glPreview = new GlPreview('scene:model-preview', 'query-model-preview-data');

            panel.isPreviewDataDirty = true;
        },
        async update() {
            const panel = this;

            await panel.glPreview.init({ width: panel.$.canvas.clientWidth, height: panel.$.canvas.clientHeight });
            if (panel.asset.redirect) {
                await Editor.Message.request('scene', 'set-model-preview-model', panel.asset.redirect.uuid);
            }

            // await 等待后，面板已经不存在了
            if (!panel.$.canvas) {
                return;
            }

            panel.refreshPreview();
        },
    },
    info: {
        ready() {
            const panel = this;

            panel.infoUpdate = Elements.info.update.bind(panel);
            Editor.Message.addBroadcastListener('scene:model-preview-model-info', panel.infoUpdate);
        },
        update(info) {
            if (!info) {
                return;
            }

            const panel = this;

            panel.$.vertices.value = 'Vertices:' + info.vertices;
            panel.$.triangles.value = 'Triangles:' + info.polygons;

            panel.isPreviewDataDirty = true;
        },
        close() {
            const panel = this;
            Editor.Message.removeBroadcastListener('scene:model-preview-model-info', panel.infoUpdate);
            Editor.Message.request('scene', 'hide-model-preview');
        },
    },
};

exports.update = function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};

exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.close = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};

exports.methods = {
    async refreshPreview() {
        const panel = this;

        if (!panel.$.canvas) {
            return;
        }

        if (panel.isPreviewDataDirty) {
            try {
                const canvas = panel.$.canvas;
                const image = panel.$.image;

                const width = image.clientWidth;
                const height = image.clientHeight;
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;

                    panel.glPreview.initGL(canvas, { width, height });
                    panel.glPreview.resizeGL(width, height);
                }

                const info = await panel.glPreview.queryPreviewData({
                    width: canvas.width,
                    height: canvas.height,
                });

                panel.glPreview.drawGL(info.buffer, info.width, info.height);
            } catch (e) {
                console.warn(e);
            }

            panel.isPreviewDataDirty = false;
        }

        cancelAnimationFrame(panel.animationId);
        panel.animationId = requestAnimationFrame(() => {
            panel.refreshPreview();
        });
    },
};
