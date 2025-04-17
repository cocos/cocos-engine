/**
 * Hide or show an HTML element based on the value.
 * 根据值隐藏或显示 HTML 元素。
 *
 * @param {HTMLElement} element - The HTML element to hide or show. 要隐藏或显示的 HTML 元素。
 * @param {boolean} value - If true, the element is hidden; otherwise, it is shown. 如果为 true，则隐藏元素；否则显示。
 */
function hideElement(element, value) {
    element.style.display = value ? 'none' : 'block';
}

/**
 * get panel frame element
 * 获取 panel frame 元素
 * @param container
 * @returns {*}
 */
function getPanelFrameElement(container) {
    let element = container;
    while (element) {
        element = element.parentElement || element.getRootNode().host;
        if (element && element.tagName === 'PANEL-FRAME' && element.getAttribute('name') === 'inspector') {
            break;
        }
    }
    return element;
}

const UI_SECTION_BAR_HEIGHT = 26;

/**
 * 处理展示预览以及操作预览面板的辅助类
 * Helper classes that handle the Showcase Preview and Manipulation Preview panels
 */
class PreviewControl {
    _gLPreviewConfig = {
        name: '',
        method: '',
    };

    _animationId = -1;
    _isDirty = false;
    _glPreview = null;

    // html element
    _container = null;

    _image = null;
    _canvas = null;

    _resetCamera = null;
    _viewToggleButton = null;

    _resizeObserver = null;

    _observerBind = this._observer.bind(this);
    _onMouseDownBind = this._onMouseDown.bind(this);
    _onMouseWheelBind = this._onMouseWheel.bind(this);

    _onResetCameraBind = this._onResetCamera.bind(this);
    _onViewToggleBind = this._onViewToggle.bind(this);

    async _updateToolElements() {
        if (!this._container) { return; }

        this.queryPreviewFunction('queryViewToolState')
            .then(state => {
                if (!state) { return; }

                let toolRight = 10;
                if (state.enableResetCamera) {
                    this._resetCamera = this._container.querySelector('.reset-camera');
                    if (!this._resetCamera) {
                        this._resetCamera = document.createElement('ui-button');
                        this._resetCamera.classList.add('reset-camera');
                        this._container.appendChild(this._resetCamera);
                        this._resetCamera.setAttribute('type', 'icon');
                        this._resetCamera.setAttribute('tooltip', 'i18n:ENGINE.inspector.preview.resetCameraView');
                        this._resetCamera.innerHTML = `<ui-icon value="reset"></ui-icon>`;
                        this._resetCamera.addEventListener('click', this._onResetCameraBind);
                    }
                    this._resetCamera.style = `
                        position: absolute;
                        right: ${toolRight}px;
                        bottom: 10px;
                        height: 24px;
                        width: 24px;
                    `;
                    toolRight += 28;
                }

                if (state.enableViewToggle) {
                    this._viewToggleButton = this._container.querySelector('.view-toggle');
                    if (!this._viewToggleButton) {
                        this._viewToggleButton = document.createElement('ui-button');
                        this._container.appendChild(this._viewToggleButton);
                        this._viewToggleButton.classList.add('view-toggle');
                        this._viewToggleButton.setAttribute('type', 'icon');
                        this._viewToggleButton.setAttribute('tooltip', 'i18n:ENGINE.inspector.preview.viewToggle');
                        this._viewToggleButton.addEventListener('click', this._onViewToggleBind);
                    }
                    this._viewToggleButton.style = `
                        position: absolute;
                        right: ${toolRight}px;
                        bottom: 10px;
                        height: 24px;
                        width: 24px;
                    `;
                    this._updateViewToggleIcon();
                }
            });
        this._updateViewToggleIcon();
    }

    _updateViewToggleIcon() {
        if (!this._viewToggleButton) { return; }

        this.queryPreviewFunction('is2DView').then(is2D => {
            this._viewToggleButton.innerHTML = `<ui-icon value="${is2D ? '2D' : '3D'}"></ui-icon>`;
        });
    }

    constructor(name, method, container) {
        this._gLPreviewConfig = {
            name: name,
            method: method,
        };
        this._container = container;
        this._createCanvas();
    }

    async queryPreviewFunction(funcName, ...args) {
        try {
            return await Editor.Message.request('scene', 'call-preview-function', this._gLPreviewConfig.name, funcName, ...args);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async callPreviewFunction(funcName, ...args) {
        try {
            const result = await Editor.Message.request('scene', 'call-preview-function', this._gLPreviewConfig.name, funcName, ...args);
            this.doRefreshDirty();
            return result;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    _createCanvas() {
        if (!this._container) { return; }

        // image for dragging inspector-resize-preview to resize the preview view.
        this._image = document.createElement('div');
        this._image.classList.add('image');
        this._container.appendChild(this._image);
        this._image.style = `
            height: var(--inspector-footer-preview-height, 200px);
            position: absolute;
            overflow: hidden;
            display: flex;
            flex: 1;
            width: 100%;
            pointer-events: none;
        `;

        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('canvas');
        this._canvas.style = `
            flex: 1;
        `;
        this._container.appendChild(this._canvas);

        this._canvas.addEventListener('mousedown', this._onMouseDownBind);
        this._canvas.addEventListener('wheel', this._onMouseWheelBind);
    }

    async init() {
        const GLPreview = Editor._Module.require('PreviewExtends').default;
        this._glPreview = new GLPreview(this._gLPreviewConfig.name, this._gLPreviewConfig.method);
        await this._glPreview.init({
            width: this._canvas.clientWidth,
            height: this._canvas.clientHeight,
        });
        this._resizeObserver = new window.ResizeObserver(this._observerBind);
        this._resizeObserver.observe(this._image);
        await this._refresh();
    }

    doRefreshDirty() {
        this._observer();
        void this._refresh();
    }

    close() {
        this._resizeObserver && this._resizeObserver.unobserve(this._image);
        cancelAnimationFrame(this._animationId);
    }

    _observer() {
        this._isDirty = true;
    }

    /**
     * Calculate canvas max size to avoid overflow when dragging inspector-resize-preview.
     * @returns {number}
     */
    panelFrameElement = null;
    getMaxHeight() {
        if (!this.panelFrameElement) {
            this.panelFrameElement = getPanelFrameElement(this._container);
        }
        if (!this.panelFrameElement) {
            return 0;
        }
        const $content = this._container.querySelector('.content');
        if (!$content) {
            return this.panelFrameElement.clientHeight * 0.7 - UI_SECTION_BAR_HEIGHT;
        } else {
            return this.panelFrameElement.clientHeight * 0.7 - $content.clientHeight - UI_SECTION_BAR_HEIGHT;
        }
    }

    async _refresh() {
        if (this._isDirty) {
            try {
                this._isDirty = false;
                const canvas = this._canvas;
                const image = this._image;

                const width = image.clientWidth;
                let height = image.clientHeight;

                const maxHeight = this.getMaxHeight();
                if (height >= maxHeight) {
                    height = maxHeight;
                }

                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;

                    await this._glPreview.initGL(canvas, {
                        width, height,
                    });
                    await this._glPreview.resizeGL(width, height);
                }

                this._updateToolElements();

                const info = await this._glPreview.queryPreviewData({
                    width: canvas.width,
                    height: canvas.height,
                });

                this._glPreview.drawGL(info);
            } catch (e) {
                console.warn(e);
            }
        }

        cancelAnimationFrame(this._animationId);
        this._animationId = requestAnimationFrame(() => {
            this._refresh();
        });
    }

    async _onMouseDown(event) {
        await this.callPreviewFunction('onMouseDown', {
            x: event.x,
            y: event.y,
            button: event.button,
        });

        const mousemove = async (event) => {
            await this.callPreviewFunction('onMouseMove', {
                movementX: event.movementX,
                movementY: event.movementY,
            });

            this._isDirty = true;
        };

        const mouseup = async (event) => {
            await this.callPreviewFunction('onMouseUp', {
                x: event.x,
                y: event.y,
            });

            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);

            this._isDirty = false;
        };

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        this._isDirty = true;
    }

    async _onMouseWheel(event) {
        await this.callPreviewFunction('onMouseWheel', {
            wheelDeltaY: event.deltaY,
            wheelDeltaX: event.deltaX,
        });

        this._isDirty = true;
    }

    async _onResetCamera() {
        await this.callPreviewFunction('resetCameraView');
    }

    async _onViewToggle() {
        await this.callPreviewFunction('viewToggle');
    }
}

module.exports = {
    hideElement,
    PreviewControl,
};
