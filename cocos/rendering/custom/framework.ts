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
import { Camera, CameraUsage } from '../../render-scene/scene/camera';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Format } from '../../gfx';

function defaultWindowResize (ppl: BasicPipeline, renderWindow: RenderWindow, width: number, height: number): void {
    ppl.addRenderWindow(renderWindow.colorName, Format.UNKNOWN, width, height, renderWindow);
    ppl.addDepthStencil(renderWindow.depthStencilName, Format.DEPTH_STENCIL, width, height);
}

export function dispatchResizeEvents (cameras: Camera[], builder: PipelineBuilder, ppl: BasicPipeline): void {
    for (const camera of cameras) {
        if (!camera.window.isRenderWindowResized()) {
            continue;
        }

        const width = camera.window.width;
        const height = camera.window.height;

        switch (camera.cameraUsage) {
        case CameraUsage.EDITOR:
            if (builder.editorWindowResize) {
                builder.editorWindowResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
            break;
        case CameraUsage.GAME_VIEW: {
            if (builder.editorGameViewResize) {
                builder.editorGameViewResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
            break;
        }
        case CameraUsage.SCENE_VIEW: {
            if (builder.editorSceneViewResize) {
                builder.editorSceneViewResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
            break;
        }
        case CameraUsage.PREVIEW: {
            if (builder.editorPreviewResize) {
                builder.editorPreviewResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
            break;
        }
        case CameraUsage.GAME: {
            if (builder.gameWindowResize) {
                builder.gameWindowResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
            break;
        }
        default:
            if (camera.cameraUsage > CameraUsage.GAME) {
                if (builder.gameWindowResize) {
                    builder.gameWindowResize(ppl, camera.window, width, height);
                } else {
                    defaultWindowResize(ppl, camera.window, width, height);
                }
            } else if (builder.editorWindowResize) {
                builder.editorWindowResize(ppl, camera.window, width, height);
            } else {
                defaultWindowResize(ppl, camera.window, width, height);
            }
        }
        camera.window.setRenderWindowResizeHandled();
    }
}
