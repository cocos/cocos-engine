'use strict';

exports.template = `
<div class="preview">
    <div class="info">
        <ui-label value="JointCount:0" class="joint-count"></ui-label>
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
    jointCount: '.joint-count',
    image: '.image',
    canvas: '.canvas',
};

const Elements = {
    preview: {
        ready() {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', async (event) => {
                await Editor.Message.request('scene', 'on-skeleton-preview-mouse-down', { x: event.x, y: event.y });

                async function mousemove(event) {
                    await Editor.Message.request('scene', 'on-skeleton-preview-mouse-move', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                async function mouseup(event) {
                    await Editor.Message.request('scene', 'on-skeleton-preview-mouse-up', {
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
            panel.glPreview = new GlPreview('scene:skeleton-preview', 'query-skeleton-preview-data');

            function observer() {
                panel.isPreviewDataDirty = true;
            }

            panel.resizeObserver = new window.ResizeObserver(observer);
            panel.resizeObserver.observe(panel.$.image);
            observer();
        },
        async update() {
            const panel = this;

            if (!panel.$.canvas) {
                return;
            }

            await panel.glPreview.init({ width: panel.$.canvas.clientWidth, height: panel.$.canvas.clientHeight });
            const info = await Editor.Message.request('scene', 'set-skeleton-preview-skeleton', panel.asset.uuid);
            panel.infoUpdate(info);
            panel.refreshPreview();
        },
        close() {
            const panel = this;

            panel.resizeObserver.unobserve(panel.$.image);
        },
    },
    info: {
        ready() {
            const panel = this;

            panel.infoUpdate = Elements.info.update.bind(panel);
        },
        update(info) {
            if (!info) {
                return;
            }

            const panel = this;

            panel.$.jointCount.value = 'JointCount:' + info.jointCount;

            panel.isPreviewDataDirty = true;
        },
        close() {
            Editor.Message.request('scene', 'hide-skeleton-preview');
        },
    },
};

exports.update = function(assetList, metaList) {
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

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.close = function() {
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

        // After await, the panel no longer exists
        if (!panel.$.canvas) {
            return;
        }

        if (panel.isPreviewDataDirty) {
            panel.isPreviewDataDirty = false;

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
        }

        cancelAnimationFrame(panel.animationId);
        panel.animationId = requestAnimationFrame(() => {
            panel.refreshPreview();
        });
    },
};
