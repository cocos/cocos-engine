import { frustum, intersect } from '../3d/geom-utils';
import { mat4, quat, vec3 } from '../core/vmath';
import { Camera, Light, Model } from '../renderer';
import { DirectionalLight } from '../renderer/scene/directional-light';
import { SphereLight } from '../renderer/scene/sphere-light';
import { SpotLight } from '../renderer/scene/spot-light';

export function cullLight (light: Light, model: Model) {
    // TODO:to add light mask & lightmapped model check.
    return false;
}

export function cullDirectionalLight (light: DirectionalLight, model: Model) {
    return cullLight(light, model);
}

export function cullSphereLight (light: SphereLight, model: Model) {
    return cullLight(light, model) || !intersect.aabb_aabb(model.worldBounds, light.aabb);
}

export function cullSpotLight (light: SpotLight, model: Model) {
    return cullLight(light, model) || !intersect.aabb_aabb(model.worldBounds, light.aabb) || !intersect.aabb_frustum(model.worldBounds, light.frustum);
}

export const cullSceneWithDirectionalLight = (() => {
    const lightFrustum: frustum = new frustum();
    lightFrustum.accurate = true;
    return (out: Model[], modelToCull: Model[], sceneCamera: Camera, light: DirectionalLight, near: number, far: number) => {
        calcDirectionalLightCullFrustum(lightFrustum, sceneCamera, light, near, far);
        for (const m of modelToCull) {
            if (!m.enabled || !m.worldBounds) {
                continue;
            }
            m.updateTransform();
            if (!intersect.aabb_frustum(m.worldBounds, lightFrustum)) {
                continue;
            }
            m.updateUBOs();
            out.push(m);
        }
    };
})();

export const calcDirectionalLightCullFrustum = (() => {
    const lightPos = cc.v3();
    const lightRot = cc.quat();
    const defaultLightOri = cc.v3(0, 0, -1);
    const camFrustum = new frustum();
    camFrustum.accurate = true;
    const lightViewMat = cc.mat4();
    const lightProjMat = cc.mat4();
    const lightVPMat = cc.mat4();
    const lightVPMatInv = cc.mat4();
    const minBoxCorner = cc.v3();
    const maxBoxCorner = cc.v3();
    return (out: frustum, sceneCamera: Camera, light: DirectionalLight, near: number, far: number) => {
        quat.rotationTo(lightRot, defaultLightOri, light.direction);
        mat4.fromQuat(lightViewMat, lightRot);
        mat4.invert(lightViewMat, lightViewMat);
        sceneCamera.getSplitFrustum(camFrustum, near, far);
        // transform camera frustum to light space
        camFrustum.transform(lightViewMat);
        vec3.set(minBoxCorner, camFrustum.vertices[0].x, camFrustum.vertices[0].y, camFrustum.vertices[0].z);
        vec3.copy(maxBoxCorner, minBoxCorner);
        // calculate the light frustum corner
        for (let i = 1; i < camFrustum.vertices.length; i++) {
            minBoxCorner.x = Math.min(minBoxCorner.x, camFrustum.vertices[i].x);
            minBoxCorner.y = Math.min(minBoxCorner.y, camFrustum.vertices[i].y);
            minBoxCorner.z = Math.min(minBoxCorner.z, camFrustum.vertices[i].z);
            maxBoxCorner.x = Math.max(maxBoxCorner.x, camFrustum.vertices[i].x);
            maxBoxCorner.y = Math.max(maxBoxCorner.y, camFrustum.vertices[i].y);
            maxBoxCorner.z = Math.max(maxBoxCorner.z, camFrustum.vertices[i].z);
        }
        mat4.ortho(lightProjMat, minBoxCorner.x, maxBoxCorner.x, minBoxCorner.y, maxBoxCorner.y, -maxBoxCorner.z, -minBoxCorner.z);
        // move light to frustum near plane center
        vec3.set(lightPos, (minBoxCorner.x + maxBoxCorner.x) / 2, (minBoxCorner.y + maxBoxCorner.y) / 2, maxBoxCorner.z);
        mat4.fromRT(lightViewMat, lightRot, lightPos);

        mat4.mul(lightVPMat, lightProjMat, lightViewMat);
        mat4.invert(lightVPMatInv, lightVPMat);
        out.update(lightVPMat, lightVPMatInv);
    };
})();
