import { EDITOR } from 'internal:constants';

import { LightInfo, QueueHint, ResourceResidency, SceneFlags } from '../../custom/types';
import { ClearFlagBit, Color, Format, LoadOp, Rect, StoreOp, Viewport } from '../../../gfx';
import { Pipeline, RenderPassBuilder, RenderQueueBuilder } from '../../custom/pipeline';
import { Camera, SKYBOX_FLAG } from '../../../render-scene/scene';
import { Material } from '../../../asset/assets';
import { PostProcess } from '../components';
import { getRenderArea } from '../../custom/define';
import { Vec4, geometry } from '../../../core';

const sphere = geometry.Sphere.create(0, 0, 0, 1);
const boundingBox = new geometry.AABB();
const rangedDirLightBoundingBox = new geometry.AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
export class PassContext {
    clearFlag: ClearFlagBit = ClearFlagBit.COLOR;
    clearColor = new Color();
    clearDepthColor = new Color();
    ppl: Pipeline| undefined;
    camera: Camera| undefined;
    material: Material| undefined;
    pass: RenderPassBuilder| undefined;
    rasterWidth = 0;
    rasterHeight = 0;
    layoutName = '';

    shadingScale = 1;
    viewport = new Rect();
    passViewport = new Rect();

    passPathName = '';
    passVersion = 0;

    isFinalCamera = false;
    isFinalPass = false;

    depthSlotName = '';

    shadowPass: any = undefined;
    forwardPass: any = undefined;
    postProcess: PostProcess | undefined;

    maxSpotLights = 0xFFFFFFFF;
    maxSphereLights = 0xFFFFFFFF;
    maxPointLights = 0xFFFFFFFF;
    maxRangedDirLights = 0xFFFFFFFF;

    setClearFlag (clearFlag: ClearFlagBit): PassContext {
        this.clearFlag = clearFlag;
        return this;
    }

    setClearColor (x: number, y: number, z: number, w: number): PassContext {
        Vec4.set(this.clearColor, x, y, z, w);
        return this;
    }

    setClearDepthColor (x: number, y: number, z: number, w: number): PassContext {
        Vec4.set(this.clearDepthColor, x, y, z, w);
        return this;
    }

    version (): PassContext {
        if (!EDITOR) {
            this.passPathName += `_${this.pass!.name}_${this.layoutName}`;
            this.pass!.setVersion(this.passPathName, this.passVersion);
        }
        return this;
    }

    clearBlack (): void {
        this.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);
    }

    addRenderPass (layoutName: string, passName: string): PassContext {
        const passViewport = this.passViewport;

        const pass = this.ppl!.addRenderPass(passViewport.width, passViewport.height, layoutName);
        pass.name = passName;
        this.pass = pass;
        this.layoutName = layoutName;

        this.rasterWidth = passViewport.width;
        this.rasterHeight = passViewport.height;

        pass.setViewport(new Viewport(passViewport.x, passViewport.y, passViewport.width, passViewport.height));

        return this;
    }

    addSceneLights (queue: RenderQueueBuilder, camera: Camera, flags: SceneFlags = SceneFlags.BLEND): void {
        if (this.maxPointLights === 0
            && this.maxSphereLights === 0
            && this.maxSpotLights === 0
            && this.maxRangedDirLights === 0) {
            return;
        }
        const scene = camera.scene!;
        const spotLights = scene.spotLights;
        const sphereLights = scene.sphereLights;
        const pointLights = scene.pointLights;
        const rangedDirLights = scene.rangedDirLights;

        const numSpotLights = Math.min(spotLights.length, this.maxSpotLights);
        const numSphereLights = Math.min(sphereLights.length, this.maxSphereLights);
        const numPointLights = Math.min(pointLights.length, this.maxPointLights);
        const numRangedDirLights = Math.min(rangedDirLights.length, this.maxRangedDirLights);

        for (let i = 0; i < numSpotLights; i++) {
            const light = spotLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(sphere, camera.frustum)) {
                queue.addSceneOfCamera(camera, new LightInfo(light), flags);
            }
        }
        // sphere lights
        for (let i = 0; i < numSphereLights; i++) {
            const light = sphereLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(sphere, camera.frustum)) {
                queue.addSceneOfCamera(camera, new LightInfo(light), flags);
            }
        }
        // point lights
        for (let i = 0; i < numPointLights; i++) {
            const light = pointLights[i];
            if (light.baked) {
                continue;
            }
            geometry.Sphere.set(sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (geometry.intersect.sphereFrustum(sphere, camera.frustum)) {
                queue.addSceneOfCamera(camera, new LightInfo(light), flags);
            }
        }
        // ranged dir lights
        for (let i = 0; i < numRangedDirLights; i++) {
            const light = rangedDirLights[i];
            geometry.AABB.transform(boundingBox, rangedDirLightBoundingBox, light.node!.getWorldMatrix());
            if (geometry.intersect.aabbFrustum(boundingBox, camera.frustum)) {
                queue.addSceneOfCamera(camera, new LightInfo(light), flags);
            }
        }
    }

    updateViewPort (): void {
        const camera = this.camera;
        if (!camera) {
            return;
        }

        let shadingScale = 1;
        if (this.postProcess && (!EDITOR || this.postProcess.enableShadingScaleInEditor)) {
            shadingScale *= this.postProcess.shadingScale;
        }
        this.shadingScale = shadingScale;

        const area = getRenderArea(camera, camera.window.width * shadingScale, camera.window.height * shadingScale, null, 0, this.viewport);
        area.width = Math.floor(area.width);
        area.height = Math.floor(area.height);
    }
    updatePassViewPort (shadingScale = 1, offsetScale = 0): PassContext {
        this.passViewport.width = this.viewport.width * shadingScale;
        this.passViewport.height = this.viewport.height * shadingScale;

        this.passViewport.x = this.viewport.x * offsetScale;
        this.passViewport.y = this.viewport.y * offsetScale;
        return this;
    }

    // setViewport (x: number, y: number, w: number, h: number) {
    //     this.pass!.setViewport(new Viewport(x, y, w, h));
    //     return this;
    // }

    addRasterView (name: string, format: Format, offscreen = true, residency: ResourceResidency = ResourceResidency.MANAGED): PassContext {
        const ppl = this.ppl;
        const camera = this.camera;
        const pass = this.pass;
        if (!ppl || !camera || !pass) {
            return this;
        }

        if (!ppl.containsResource(name)) {
            if (format === Format.DEPTH_STENCIL) {
                ppl.addDepthStencil(name, format, this.rasterWidth, this.rasterHeight, ResourceResidency.MANAGED);
            } else if (offscreen) {
                ppl.addRenderTarget(name, format, this.rasterWidth, this.rasterHeight, residency || ResourceResidency.MANAGED);
            } else {
                ppl.addRenderWindow(name, format, this.rasterWidth, this.rasterHeight, camera.window);
            }
        }

        if (format !== Format.DEPTH_STENCIL) {
            if (!offscreen) {
                ppl.updateRenderWindow(name, camera.window);
            } else {
                ppl.updateRenderTarget(name, this.rasterWidth, this.rasterHeight);
            }
        } else {
            ppl.updateDepthStencil(name, this.rasterWidth, this.rasterHeight);
        }

        // let view: RasterView;
        if (format === Format.DEPTH_STENCIL) {
            const clearFlag = this.clearFlag & ClearFlagBit.DEPTH_STENCIL;
            let loadOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE) {
                loadOp = LoadOp.LOAD;
            }

            pass.addDepthStencil(name, loadOp, StoreOp.STORE, this.clearDepthColor.x, this.clearDepthColor.y, clearFlag);
        } else {
            const clearColor = new Color();
            clearColor.copy(this.clearColor);

            const clearFlag = this.clearFlag & ClearFlagBit.COLOR;
            let loadOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE && !(this.clearFlag & SKYBOX_FLAG)) {
                loadOp = LoadOp.LOAD;
            } else if (this.clearFlag & SKYBOX_FLAG) {
                clearColor.set(0, 0, 0, 1);
            }
            pass.addRenderTarget(name, loadOp, StoreOp.STORE, clearColor);
        }
        return this;
    }
    setPassInput (inputName: string, shaderName: string): PassContext {
        if (this.ppl!.containsResource(inputName)) {
            this.pass!.addTexture(inputName, shaderName);
        }
        return this;
    }

    blitScreen (passIdx = 0): PassContext {
        this.pass!.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            this.camera!,
this.material!,
passIdx,
SceneFlags.NONE,
        );
        return this;
    }
}

export const passContext = new PassContext();
