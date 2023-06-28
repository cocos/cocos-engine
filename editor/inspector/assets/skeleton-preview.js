'use strict';

exports.template = /* html */`
<div class="preview">
    <div class="info">
        <ui-label value="JointCount:0" class="joint-count"></ui-label>
    </div>
    <div class="image">
        <canvas class="canvas"></canvas>
    </div>
</div>
`;

exports.style = /* css */`
.preview {
    border-top: 1px solid var(--color-normal-border);
}
.preview > .info {
    padding: 4px 4px 0 4px;
}
.preview > .info > ui-label {
    margin-right: 6px;
}
.preview > .image {
    height: 200px;
    overflow: hidden;
    display: flex;
    flex: 1;
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

async function callSkeletonPreviewFunction(funcName, ...args) {
    return await Editor.Message.request('scene', 'call-preview-function', 'scene:skeleton-preview', funcName, ...args);
}

const Elements = {
    preview: {
        ready() {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', async (event) => {
                await callSkeletonPreviewFunction('onMouseDown', { x: event.x, y: event.y });

                async function mousemove(event) {
                    await callSkeletonPreviewFunction('onMouseMove', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                async function mouseup(event) {
                    await callSkeletonPreviewFunction('onMouseUp', {
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
            const info = await callSkeletonPreviewFunction('setSkeleton', panel.asset.uuid);
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
            callSkeletonPreviewFunction('hide');
        },
    },
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

                    await panel.glPreview.initGL(canvas, { width, height });
                    await panel.glPreview.resizeGL(width, height);
                }

                const info = await panel.glPreview.queryPreviewData({
                    width: canvas.width,
                    height: canvas.height,
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
};

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
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

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};
