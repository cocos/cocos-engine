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

#include <array>
#include <string>

namespace cc {
namespace ar {

using Pose      = std::array<float, 7>;
using Matrix    = std::array<float, 16>;
using TexCoords = std::array<float, 8>;
using LightVal  = std::array<float, 3>;

class ARModule {
public:
    static ARModule* createARModule();
    static ARModule* get();

    ~ARModule() = default;

    void config(uint32_t featureMask);
    uint32_t getSupportMask() const;
    void start();
    void start(void *env, void *context);
    void stop();
    void resume();
    void resume(void *env, void *context);
    void pause();
    void update();
    int getAPIState();

    void setCameraId(const std::string& id);
    const std::string& getCameraId() const;
    Pose getCameraPose();
    Matrix getCameraViewMatrix();
    Matrix getCameraProjectionMatrix();
    TexCoords getCameraTexCoords();

    void enableCameraAutoFocus(bool enable) const;
    void enableCameraDepth(bool enable) const;
    void setDisplayGeometry(uint32_t rotation, uint32_t width, uint32_t height) const;
    void setCameraClip(float near, float far) const;
    void setCameraTextureName(int id) const;
    void* getCameraTextureRef() const;
    uint8_t* getCameraDepthBuffer();
    bool getTexInitFlag() const;
    void resetTexInitFlag();

    void enableLightEstimate(bool enable) const;
    LightVal getMainLightDirection() const;
    LightVal getMainLightIntensity() const;

    int tryHitAttachAnchor(int id) const;
    Pose getAnchorPose(int id);

    bool tryHitTest(float xPx, float yPx, uint32_t trackableTypeMask) const;
    Pose getHitResult();
    int getHitId() const;
    int getHitType() const;

    // for jsb array
    int getInfoLength() const;

    // plane detection
    void enablePlane(bool enable) const;
    void setPlaneDetectionMode(int mode) const;
    float* getAddedPlanesInfo();
    float* getUpdatedPlanesInfo();
    float* getRemovedPlanesInfo();
    float* getPlanePolygon(int id);

    // scene mesh reconstruction
    void enableSceneMesh(bool enable) const;
    float* getAddedSceneMesh();
    float* getUpdatedSceneMesh();
    float* getRemovedSceneMesh();
    int* requireSceneMesh();
    float* getSceneMeshVertices(int id);
    int* getSceneMeshTriangleIndices(int id);
    void endRequireSceneMesh() const;

    // image recognition & tracking
    void enableImageTracking(bool enable) const;
    void addImageToLibWithSize(const std::string& name, float widthInMeters) const;
    void setImageMaxTrackingNumber(int number) const;
    float* getAddedImagesInfo();
    float* getUpdatedImagesInfo();
    float* getRemovedImagesInfo();

    // object recognition & tracking
    void enableObjectTracking(bool enable) const;
    void addObjectToLib(const std::string& name) const;
    float* getAddedObjectsInfo();
    float* getUpdatedObjectsInfo();
    float* getRemovedObjectsInfo();

    // face detection & tracking
    void enableFaceTracking(bool enable) const;
    float* getAddedFacesInfo();
    float* getUpdatedFacesInfo();
    float* getRemovedFacesInfo();
    float* getFaceBlendShapes(int id);
};

} // namespace ar
} // namespace cc
