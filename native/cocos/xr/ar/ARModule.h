/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

#include <memory>
#include <string>
#include "ar/IARAPI.h"
#include "base/Macros.h"

namespace cc {
namespace ar {

class CC_DLL ARModule final {
public:
    static ARModule* createARModule();
    static ARModule* get();

    ARModule();
    ~ARModule();

    void config(int featureMask);
    int getSupportMask();
    void start();
    void onResume();
    void onPause();
    void update();
    int getAPIState();

    void setCameraId(const std::string& id);
    const std::string& getCameraId() const;
    Pose getCameraPose() const;
    Matrix getCameraViewMatrix() const;
    Matrix getCameraProjectionMatrix() const;
    TexCoords getCameraTexCoords() const;

    void enableCameraAutoFocus(bool enable) const;
    void enableCameraDepth(bool enable) const;
    void setDisplayGeometry(uint32_t rotation, uint32_t width, uint32_t height) const;
    void setCameraClip(float near, float far) const;
    void setCameraTextureName(int id) const;
    void* getCameraTextureRef() const;
    uint8_t* getCameraDepthBuffer() const;
    bool getTexInitFlag() const;
    void resetTexInitFlag();

    void enableLightEstimate(bool enable) const;
    LightVal getMainLightDirection() const;
    LightVal getMainLightIntensity() const;

    int tryHitAttachAnchor(int trackableId) const;
    Pose getAnchorPose(int anchorId) const;

    bool tryHitTest(float xPx, float yPx, uint32_t trackableTypeMask) const;
    Pose getHitResult() const;
    int getHitId() const;
    int getHitType() const;

    // for jsb array
    int getInfoLength() const;

    // plane detection
    void enablePlane(bool enable) const;
    void setPlaneDetectionMode(int mode) const;
    void setPlaneMaxTrackingNumber(int count) const;
    float* getAddedPlanesInfo() const;
    float* getUpdatedPlanesInfo() const;
    float* getRemovedPlanesInfo() const;
    float* getPlanePolygon(int id) const;

    // scene mesh reconstruction
    void enableSceneMesh(bool enable) const;
    float* getAddedSceneMesh() const;
    float* getUpdatedSceneMesh() const;
    float* getRemovedSceneMesh() const;
    int* requireSceneMesh() const;
    float* getSceneMeshVertices(int meshRef) const;
    int* getSceneMeshTriangleIndices(int meshRef) const;
    void endRequireSceneMesh() const;

    // image recognition & tracking
    void enableImageTracking(bool enable) const;
    void addImageToLib(const std::string& name) const;
    void addImageToLibWithSize(const std::string& name, float widthInMeters) const;
    void setImageMaxTrackingNumber(int number) const;
    float* getAddedImagesInfo() const;
    float* getUpdatedImagesInfo() const;
    float* getRemovedImagesInfo() const;

    // object recognition & tracking
    void enableObjectTracking(bool enable) const;
    void addObjectToLib(const std::string& name) const;
    float* getAddedObjectsInfo() const;
    float* getUpdatedObjectsInfo() const;
    float* getRemovedObjectsInfo() const;

    // face detection & tracking
    void enableFaceTracking(bool enable) const;
    float* getAddedFacesInfo() const;
    float* getUpdatedFacesInfo() const;
    float* getRemovedFacesInfo() const;
    float* getFaceBlendShapes(int faceRef) const;

private:
    std::unique_ptr<IARAPI> _impl;
    std::string _cameraId;
    bool _texInitFlag{false};
};

static std::unique_ptr<ARModule> arModuleInstance;

} // namespace ar
} // namespace cc
