/*
 * Copyright 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ADPF_MANAGER_H_
#define ADPF_MANAGER_H_

#if CC_PLATFORM == CC_PLATFORM_ANDROID && __ANDROID_API__ >= 30
    #include <android/api-level.h>
    #include <android/log.h>
    #include <android/thermal.h>
    #include <jni.h>

    #include <chrono>
    #include <memory>
    #include "3d/models/SkinningModel.h"
    #include "engine/EngineEvents.h"
    #include "platform/java/jni/JniHelper.h"

// Forward declarations of functions that need to be in C decl.

typedef void (*thermalStateChangeListener)(int32_t, int32_t);

/*
 * ADPFManager class anages the ADPF APIs.
 */
class ADPFManager {
public:
    // Singleton function.
    static ADPFManager &getInstance() {
        static ADPFManager instance;
        return instance;
    }

    // Dtor.
    ~ADPFManager() {
        // Remove global reference.
        auto env = cc::JniHelper::getEnv();
        if (env != nullptr) {
            if (obj_power_service_ != nullptr) {
                env->DeleteGlobalRef(obj_power_service_);
            }
            if (obj_perfhint_service_ != nullptr) {
                env->DeleteGlobalRef(obj_perfhint_service_);
            }
            if (obj_perfhint_session_ != nullptr) {
                env->DeleteGlobalRef(obj_perfhint_session_);
            }
            if (thermal_manager_ != nullptr) {
                AThermal_releaseManager(thermal_manager_);
            }
        }
    }

    // Delete copy constructor since the class is used as a singleton.
    ADPFManager(ADPFManager const &) = delete;

    void operator=(ADPFManager const &) = delete;

    // Invoke the method periodically (once a frame) to monitor
    // the device's thermal throttling status.
    void Monitor();

    // Invoke the API first to set the android_app instance.

    // Method to set thermal status. Need to be public since the method
    // is called from C native listener.
    void SetThermalStatus(int32_t i);

    // Get current thermal status and headroom.
    int32_t GetThermalStatus() { return thermal_status_; }
    float GetThermalStatusNormalized() const;

    float GetFrameTimeMS() const { return frame_time_ns_ / 1000000.0F; }

    float GetThermalHeadroom() { return thermal_headroom_; }

    void SetThermalListener(thermalStateChangeListener listener);

    // Indicates the start and end of the performance intensive task.
    // The methods call performance hint API to tell the performance
    // hint to the system.
    void BeginPerfHintSession();

    void EndPerfHintSession(jlong target_duration_ns);

    // Method to retrieve thermal manager. The API is used to register/unregister
    // callbacks from C API.
    AThermalManager *GetThermalManager() { return thermal_manager_; }

    void Initialize();

private:
    // Update thermal headroom each sec.
    static constexpr auto kThermalHeadroomUpdateThreshold = std::chrono::seconds(1);

    // Function pointer from the game, will be invoked when we receive state changed event from Thermal API
    static thermalStateChangeListener thermalListener;

    // Ctor. It's private since the class is designed as a singleton.
    ADPFManager()
    : thermal_manager_(nullptr),
      thermal_status_(0),
      thermal_headroom_(0.f),
      obj_power_service_(nullptr),
      get_thermal_headroom_(0),
      obj_perfhint_service_(nullptr),
      obj_perfhint_session_(nullptr),
      report_actual_work_duration_(0),
      update_target_work_duration_(0),
      preferred_update_rate_(0) {
        last_clock_ = std::chrono::high_resolution_clock::now();
        perfhintsession_start_ = std::chrono::high_resolution_clock::now();
    }

    // Functions to initialize ADPF API's calls.
    bool InitializePowerManager();

    float UpdateThermalStatusHeadRoom();

    bool InitializePerformanceHintManager();

    AThermalManager *thermal_manager_ = nullptr;
    int32_t thermal_status_;
    float thermal_headroom_ = 0;
    float thermal_headroom_valid_ = 0;
    std::chrono::time_point<std::chrono::high_resolution_clock> last_clock_;
    jobject obj_power_service_;
    jmethodID get_thermal_headroom_;

    jobject obj_perfhint_service_;
    jobject obj_perfhint_session_;
    jmethodID report_actual_work_duration_;
    jmethodID update_target_work_duration_;
    jlong preferred_update_rate_;

    cc::events::BeforeTick::Listener beforeTick;
    cc::events::AfterTick::Listener afterTick;

    std::chrono::time_point<std::chrono::high_resolution_clock> perfhintsession_start_;
    int64_t frame_time_ns_{0};
};

    #define CC_SUPPORT_ADPF 1 // NOLINT
#else
    #define CC_SUPPORT_ADPF 0 // NOLINT
#endif                        // ADPF_MANAGER_H_

#endif
