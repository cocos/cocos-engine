'use strict';

exports.template = `
<div class="preview">
    <div class="info">
        <ui-label value="Vertices:0" class="vertices"></ui-label>
        <ui-label value="Triangles:0" class="triangles"></ui-label>
        <ui-label value="" class="uvsLabel"></ui-label>
    </div>
    <div>
        <div>
            <ui-label value="" class="minPosLabel"></ui-label>
        </div>
        <div>
            <ui-label value="" class="maxPosLabel"></ui-label>
        </div>
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
    uvsLabel: '.uvsLabel',
    minPosLabel: '.minPosLabel',
    maxPosLabel: '.maxPosLabel',
};

async function callMeshPreviewFunction(funcName, ...args) {
    return await Editor.Message.request('scene', 'call-preview-function', 'scene:mesh-preview', funcName, ...args);
}

const Elements = {
    preview: {
        ready() {
            const panel = this;

            panel.$.canvas.addEventListener('mousedown', async (event) => {
                await callMeshPreviewFunction('onMouseDown', { x: event.x, y: event.y });

                async function mousemove(event) {
                    await callMeshPreviewFunction('onMouseMove', {
                        movementX: event.movementX,
                        movementY: event.movementY,
                    });

                    panel.isPreviewDataDirty = true;
                }

                async function mouseup(event) {
                    await callMeshPreviewFunction('onMouseUp', {
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
            panel.glPreview = new GlPreview('scene:mesh-preview', 'query-mesh-preview-data');

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
            const info = await callMeshPreviewFunction('setMesh', panel.asset.uuid);
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

            panel.$.vertices.value = 'Vertices: ' + info.vertices;
            panel.$.triangles.value = 'Triangles: ' + info.polygons;

            panel.$.uvsLabel.value = '';
            if (info.uvs.length > 0) {
                panel.$.uvsLabel.value = 'UV: ';
                info.uvs.forEach((uvIndex, index) => {
                    panel.$.uvsLabel.value += uvIndex;
                    if (index !== info.uvs.length - 1) {
                        panel.$.uvsLabel.value += ',';
                    }
                });
            }

            panel.$.minPosLabel.value = '';
            if (info.minPosition) {
                const pos = info.minPosition;
                panel.$.minPosLabel.value = `MinPos: (${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)})`;
            }

            panel.$.maxPosLabel.value = '';
            if (info.maxPosition) {
                const pos = info.maxPosition;
                panel.$.maxPosLabel.value = `MaxPos: (${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)})`;
            }

            panel.isPreviewDataDirty = true;
        },
        close() {
            callMeshPreviewFunction('hide');
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
