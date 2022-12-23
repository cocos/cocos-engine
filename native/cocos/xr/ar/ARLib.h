/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "ar/IARAPI.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
class _jobject;
#endif

namespace cc {
namespace ar {

class ARLib : public IARAPI{
public:
    ARLib();
    ~ARLib() override;
    void config(int featureMask) override;
    uint32_t getSupportMask() override;
    void start() override;
    void start(void *env, void *context) override;
    void resume() override;
    void resume(void *env, void *context) override;
    void pause() override;
    void update() override;
    int getAPIState() override;
    
    Pose getCameraPose() override;
    Matrix getCameraViewMatrix() override;
    Matrix getCameraProjectionMatrix() override;
    TexCoords getCameraTexCoords() override;

    void enableCameraAutoFocus(bool enable) override;
    void enableCameraDepth(bool enable) override;
    void setDisplayGeometry(uint32_t rotation, uint32_t width, uint32_t height) override;
    void setCameraClip(float near, float far) override;
    void setCameraTextureName(int id) override;
    void* getCameraTextureRef() override;
    uint8_t* getCameraDepthBuffer() override;

    void enableLightEstimate(bool enable) override;
    LightVal getMainLightDirection() override;
    LightVal getMainLightIntensity() override;

    int tryHitAttachAnchor(int planeIndex) override;
    Pose getAnchorPose(int index) override;

    bool raycast(float xPx, float yPx, uint32_t trackableTypeMask) override;
    Pose getRaycastPose() override;
    int getRaycastTrackableId() override;
    int getRaycastTrackableType() override;

    int getInfoLength() override;

    // plane detection
    void enablePlane(bool enable) override;
    void setPlaneDetectionMode(int mode) override;
    void setPlaneMaxTrackingNumber(int count) override;
    float* getAddedPlanesInfo() override;
    float* getUpdatedPlanesInfo() override;
    float* getRemovedPlanesInfo() override;
    float* getPlanePolygon(int id) override;

    // scene mesh reconstruction
    void enableSceneMesh(bool enable) override;
    float* getAddedSceneMesh() override;
    float* getUpdatedSceneMesh() override;
    float* getRemovedSceneMesh() override;
    int* requireSceneMesh() override;
    float* getSceneMeshVertices(int meshRef) override;
    int* getSceneMeshTriangleIndices(int meshRef) override;
    void endRequireSceneMesh() override;

    // image recognition & tracking
    void enableImageTracking(bool enable) override;
    void addImageToLib(const std::string& imageName) override;
    void addImageToLibWithSize(const std::string& name, float widthInMeters) override;
    void setImageMaxTrackingNumber(int number) override;
    float* getAddedImagesInfo() override;
    float* getUpdatedImagesInfo() override;
    float* getRemovedImagesInfo() override;

    // object recognition & tracking
    void enableObjectTracking(bool enable) override;
    void addObjectToLib(const std::string& imageName) override;
    float* getAddedObjectsInfo() override;
    float* getUpdatedObjectsInfo() override;
    float* getRemovedObjectsInfo() override;

    // face detection & tracking
    void enableFaceTracking(bool enable) override;
    float* getAddedFacesInfo() override;
    float* getUpdatedFacesInfo() override;
    float* getRemovedFacesInfo() override;
    float* getFaceBlendShapes(int faceRef) override;
protected:
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    _jobject* _impl{nullptr};
    Pose _cameraPose;
    Matrix _viewMatrix;
    Matrix _projMatrix;
    TexCoords _cameraTexCoords;
    uint8_t* _cameraDepthBuffer{nullptr};

    Pose _hitPose;
    Pose _anchorPose;

    int _infoLength = 0;

    float* _addedPlanesInfo{nullptr};
    float* _updatedPlanesInfo{nullptr};
    float* _removedPlanesInfo{nullptr};
    float* _planePolygon{nullptr};

    float* _sceneMeshVertices{nullptr};
    int* _sceneMeshIndices{nullptr};
    float* _addedSceneMeshInfo{nullptr};
    float* _updatedSceneMeshInfo{nullptr};
    int* _removedSceneMeshRefs{nullptr};
    int* _requiredSceneMeshRefs{nullptr};

    float* _addedImagesInfo{nullptr};
    float* _updatedImagesInfo{nullptr};
    float* _removedImagesInfo{nullptr};

    float* _addedObjsInfo{nullptr};
    float* _updatedObjsInfo{nullptr};
    float* _removedObjsInfo{nullptr};

    float* _addedFacesInfo{nullptr};
    float* _updatedFacesInfo{nullptr};
    float* _removedFacesInfo{nullptr};
    float* _faceBlendShapes{nullptr};
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    void* _impl{nullptr};
    
    int _infoLength = 0;
    
    void* _plane{nullptr};
    void* _sceneMesh{nullptr};
    void* _imageTracking{nullptr};
    void* _objectTracking{nullptr};
    void* _faceTracking{nullptr};
#endif
};

} // namespace ar
} // namespace cc
