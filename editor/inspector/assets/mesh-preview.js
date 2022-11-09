'use strict';


exports.template = /* html */`
<div class="preview">
    <div class="info">
        <ui-label value="Vertices:0" class="vertices"></ui-label>
        <ui-label value="Triangles:0" class="triangles"></ui-label>
        <ui-label value="" class="uvsLabel"></ui-label>
        <div class="select-box">
            <ui-select class="preview-channel" placeholder="choose" value="0">
                <option value="0">channel 0</option>
                <option value="1">channel 1</option>
            </ui-select>
            <ui-select class="preview-type" placeholder="choose" value="shaded">
                <option value="shaded">shaded</option>
                <option value="uv layout">uv layout</option>
            </ui-select>
        </div>
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

exports.style = /* css */`
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
.select-box {
    float: right;
}
.preview-channel {
    visibility: hidden;
}
.preview-channel.show {
    visibility: visible;
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
    previewType: '.preview-type',
    previewChannel: '.preview-channel',
};

async function callMeshPreviewFunction(funcName, ...args) {
    return await Editor.Message.request('scene', 'call-preview-function', 'scene:mesh-preview', funcName, ...args);
}

const Elements = {
    preview: {
        ready() {
            const panel = this;
            panel.previewGLType = 'shaded'

            panel.$.canvas.addEventListener('mousedown', async (event) => {
                // Non-model previews do not respond to events
                if (panel.previewGLType !== 'shaded') return;
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

            const res = await callMeshPreviewFunction('getModelUVs', panel.asset.uuid);
            let innerHTMLText = ''
            res.forEach((e, i) => { innerHTMLText += `<option value="${i}">channel ${i}</option>` })
            panel.$.previewChannel.innerHTML = innerHTMLText
            panel.previewUVs = res
            panel.previewUVsIndex = 0
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
    previewControl: {
        ready() {
            const panel = this;
            panel.$.previewType.addEventListener('confirm', (event) => {
                const value = event.target.value;
                if (value === 'uv layout') {
                    panel.$.previewChannel.classList.add('show');
                    panel.updatePreviewType(value, 0);
                } else {
                    panel.$.previewChannel.classList.remove('show');
                    panel.updatePreviewType(value);
                }
            });
            panel.$.previewChannel.addEventListener('confirm', (event) => {
                const value = event.target.value;
                panel.updatePreviewType('uv layout', value);
            });
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

                    panel.glPreview.initGL(canvas, { width, height });
                    panel.glPreview.resizeGL(width, height);
                }
                const type = panel.previewGLType
                let info
                if (type === 'shaded') {
                    info = await panel.glPreview.queryPreviewData({
                        width: canvas.width,
                        height: canvas.height,
                    });
                }
                if (type === 'uv layout') {
                    info = panel.glPreview.computedUV(panel.previewUVs[panel.previewUVsIndex], canvas.width, canvas.height)
                    info.buffer = info.data
                }


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
    updatePreviewType(type, channel) {
        const panel = this;
        panel.previewGLType = type
        panel.isPreviewDataDirty = true;
        if (type === 'shaded') {
            panel.refreshPreview()
        }
        if (type === 'uv layout') {
            panel.previewUVsIndex = channel
            panel.refreshPreview()
        }
    },
};

exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
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

exports.close = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};
