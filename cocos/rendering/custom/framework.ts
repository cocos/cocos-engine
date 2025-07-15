/*
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { BasicPipeline, PipelineBuilder } from './pipeline';
import { Camera } from '../../render-scene/scene/camera';
import { RenderWindow } from '../../render-scene/core/render-window';
import { supportsR32FloatTexture } from '../define';
import { Format } from '../../gfx/base/define';
import { sys } from '../../core/platform';

export { packRGBE } from '../../core/math/color';

//-----------------------------------------------------------------
// Editor preview begin
//-----------------------------------------------------------------
let editorPipelineSettings: object | null = null;
let forceResize = false;

export function setEditorPipelineSettings (
    settings: object | null,
): void {
    editorPipelineSettings = settings;
    forceResize = true;
}

export function getEditorPipelineSettings (): object | null {
    return editorPipelineSettings;
}

//-----------------------------------------------------------------
// Editor preview end
//-----------------------------------------------------------------

export function forceResizeAllWindows (): void {
    forceResize = true;
}

export function defaultWindowResize (ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void {
    ppl.addRenderWindow(window.colorName, Format.BGRA8, width, height, window);
    ppl.addDepthStencil(window.depthStencilName, Format.DEPTH_STENCIL, width, height);
    // CSM
    const id = window.renderWindowId;
    const shadowFormat = supportsR32FloatTexture(ppl.device) ? Format.R32F : Format.RGBA8;
    const shadowSize = ppl.pipelineSceneData.shadows.size;
    ppl.addRenderTarget(`ShadowMap${id}`, shadowFormat, shadowSize.x, shadowSize.y);
    ppl.addDepthStencil(`ShadowDepth${id}`, Format.DEPTH_STENCIL, shadowSize.x, shadowSize.y);
}

function getRenderWindowSize (window: RenderWindow): [number, number] {
    return [Math.max(Math.floor(window.width), 1), Math.max(Math.floor(window.height), 1)];
}

// Map to store throttle timers by cameraId
const throttleTimers = new Map();
// Map to store last resize time by cameraId
let lastResizeTimes = 0;

// Throttle delay in milliseconds (when detected frequent resizing)
const THROTTLE_DELAY = 500;
// Window time in milliseconds to detect frequent resizing
const FREQUENCY_WINDOW = 200;

// Adaptive throttled version of dispatchResizeEvents function using cameraId
export function dispatchResizeEvents (cameras: Camera[], builder: PipelineBuilder, ppl: BasicPipeline): void {
    if (!builder.windowResize || !cameras.some((camera) => camera.window.isRenderWindowResized())) {
        // No game window resize handler defined.
        // Following old procedure, do nothing
        return;
    }
    const now = Date.now();
    let isFrequentResizing = false;
    if (!sys.isNative && now - lastResizeTimes <= FREQUENCY_WINDOW) {
        isFrequentResizing = true;
    }
    lastResizeTimes = now;
    // Resize all windows.
    // Notice: A window might be resized multiple times with different cameras.
    // User should avoid resource collision between different cameras.
    for (const camera of cameras) {
        if (!camera.window.isRenderWindowResized() && !forceResize) {
            continue;
        }

        const cameraId = camera.cameraId; // Unique identifier for each camera

        // Skip execution if a timer exists and we're in frequent resizing mode
        if (isFrequentResizing && throttleTimers.has(cameraId)) {
            continue;
        }
        if (isFrequentResizing) {
            // Apply throttle only when frequent resizing is detected
            throttleTimers.set(cameraId, setTimeout(() => {
                const [width, height] = getRenderWindowSize(camera.window);
                builder.windowResize!(ppl, camera.window, camera, width, height);
                camera.window.setRenderWindowResizeHandled();
                throttleTimers.delete(cameraId);
            }, THROTTLE_DELAY));
        } else {
            const [width, height] = getRenderWindowSize(camera.window);
            // Normal resize - execute immediately
            builder.windowResize(ppl, camera.window, camera, width, height);
            camera.window.setRenderWindowResizeHandled();
        }
    }
    // For editor preview
    forceResize = false;
}
