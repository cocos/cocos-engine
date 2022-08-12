/*
 * Copyright (C) 2015 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ANDROID_BUFFER_PROVIDERS_H
#define ANDROID_BUFFER_PROVIDERS_H

#include <stdint.h>
#include <sys/types.h>

// #include <audio_utils/ChannelMix.h>
#include "audio/android/AudioBufferProvider.h"
#include "audio/android/AudioResamplerPublic.h"
#include "audio.h"
// #include <system/audio_effect.h>
// #include <utils/StrongPointer.h>

// external forward declaration from external/sonic/sonic.h
struct sonicStreamStruct;
typedef struct sonicStreamStruct *sonicStream;

namespace cc {

// class EffectBufferHalInterface;
// class EffectHalInterface;
// class EffectsFactoryHalInterface;

// ----------------------------------------------------------------------------

class PassthruBufferProvider : public AudioBufferProvider {
public:
    PassthruBufferProvider() : mTrackBufferProvider(NULL) { }

    virtual ~PassthruBufferProvider() { }

    // call this to release the buffer to the upstream provider.
    // treat it as an audio discontinuity for future samples.
    virtual void reset() { }

    // set the upstream buffer provider. Consider calling "reset" before this function.
    virtual void setBufferProvider(AudioBufferProvider *p) {
        mTrackBufferProvider = p;
    }

protected:
    AudioBufferProvider *mTrackBufferProvider;
};

// Base AudioBufferProvider class used for DownMixerBufferProvider, RemixBufferProvider,
// and ReformatBufferProvider.
// It handles a private buffer for use in converting format or channel masks from the
// input data to a form acceptable by the mixer.
// TODO: Make a ResamplerBufferProvider when integers are entirely removed from the
// processing pipeline.
//class CopyBufferProvider : public PassthruBufferProvider {
//public:
//    // Use a private buffer of bufferFrameCount frames (each frame is outputFrameSize bytes).
//    // If bufferFrameCount is 0, no private buffer is created and in-place modification of
//    // the upstream buffer provider's buffers is performed by copyFrames().
//    CopyBufferProvider(size_t inputFrameSize, size_t outputFrameSize,
//            size_t bufferFrameCount);
//    virtual ~CopyBufferProvider();
//
//    // Overrides AudioBufferProvider methods
//    virtual int32_t getNextBuffer(Buffer *buffer);
//    virtual void releaseBuffer(Buffer *buffer);
//
//    // Overrides PassthruBufferProvider
//    virtual void reset();
//    void setBufferProvider(AudioBufferProvider *p) override;
//
//    // this function should be supplied by the derived class.  It converts
//    // #frames in the *src pointer to the *dst pointer.  It is public because
//    // some providers will allow this to work on arbitrary buffers outside
//    // of the internal buffers.
//    virtual void copyFrames(void *dst, const void *src, size_t frames) = 0;
//
//protected:
//    const size_t         mInputFrameSize;
//    const size_t         mOutputFrameSize;
//private:
//    AudioBufferProvider::Buffer mBuffer;
//    const size_t         mLocalBufferFrameCount;
//    void                *mLocalBufferData;
//    size_t               mConsumed;
//};

// DownmixerBufferProvider derives from CopyBufferProvider to provide
// position dependent downmixing by an Audio Effect.
// class DownmixerBufferProvider : public CopyBufferProvider {
// public:
//     DownmixerBufferProvider(audio_channel_mask_t inputChannelMask,
//             audio_channel_mask_t outputChannelMask, audio_format_t format,
//             uint32_t sampleRate, int32_t sessionId, size_t bufferFrameCount);
//     virtual ~DownmixerBufferProvider();
//     //Overrides
//     virtual void copyFrames(void *dst, const void *src, size_t frames);

//     bool isValid() const { return mDownmixInterface.get() != NULL; }
//     static status_t init();
//     static bool isMultichannelCapable() { return sIsMultichannelCapable; }

// protected:
//     sp<EffectsFactoryHalInterface> mEffectsFactory;
//     sp<EffectHalInterface> mDownmixInterface;
//     size_t mInFrameSize;
//     size_t mOutFrameSize;
//     sp<EffectBufferHalInterface> mInBuffer;
//     sp<EffectBufferHalInterface> mOutBuffer;
//     effect_config_t    mDownmixConfig;

//     // effect descriptor for the downmixer used by the mixer
//     static effect_descriptor_t sDwnmFxDesc;
//     // indicates whether a downmix effect has been found and is usable by this mixer
//     static bool                sIsMultichannelCapable;
//     // FIXME: should we allow effects outside of the framework?
//     // We need to here. A special ioId that must be <= -2 so it does not map to a session.
//     static const int32_t SESSION_ID_INVALID_AND_IGNORED = -2;
// };

// ChannelMixBufferProvider derives from CopyBufferProvider to perform an
// downmix to the proper channel count and mask.
// class ChannelMixBufferProvider : public CopyBufferProvider {
// public:
//     ChannelMixBufferProvider(audio_channel_mask_t inputChannelMask,
//             audio_channel_mask_t outputChannelMask, audio_format_t format,
//             size_t bufferFrameCount);

//     void copyFrames(void *dst, const void *src, size_t frames) override;

//     bool isValid() const { return mIsValid; }

// protected:
//     audio_utils::channels::ChannelMix mChannelMix;
//     bool mIsValid = false;
// };

// RemixBufferProvider derives from CopyBufferProvider to perform an
// upmix or downmix to the proper channel count and mask.
// class RemixBufferProvider : public CopyBufferProvider {
// public:
//     RemixBufferProvider(audio_channel_mask_t inputChannelMask,
//             audio_channel_mask_t outputChannelMask, audio_format_t format,
//             size_t bufferFrameCount);
//     //Overrides
//     virtual void copyFrames(void *dst, const void *src, size_t frames);

// protected:
//     const audio_format_t mFormat;
//     const size_t         mSampleSize;
//     const size_t         mInputChannels;
//     const size_t         mOutputChannels;
//     int8_t               mIdxAry[sizeof(uint32_t) * 8]; // 32 bits => channel indices
// };

// ReformatBufferProvider derives from CopyBufferProvider to convert the input data
// to an acceptable mixer input format type.
// class ReformatBufferProvider : public CopyBufferProvider {
// public:
//     ReformatBufferProvider(int32_t channelCount,
//             audio_format_t inputFormat, audio_format_t outputFormat,
//             size_t bufferFrameCount);
//     virtual void copyFrames(void *dst, const void *src, size_t frames);

// protected:
//     const uint32_t       mChannelCount;
//     const audio_format_t mInputFormat;
//     const audio_format_t mOutputFormat;
// };

// ClampFloatBufferProvider derives from CopyBufferProvider to clamp floats inside -3db
// class ClampFloatBufferProvider : public CopyBufferProvider {
// public:
//     ClampFloatBufferProvider(int32_t channelCount,
//             size_t bufferFrameCount);
//     virtual void copyFrames(void *dst, const void *src, size_t frames);

// protected:
//     const uint32_t       mChannelCount;
// };

// TimestretchBufferProvider derives from PassthruBufferProvider for time stretching
class TimestretchBufferProvider : public PassthruBufferProvider {
public:
    TimestretchBufferProvider(int32_t channelCount,
            audio_format_t format, uint32_t sampleRate,
            const AudioPlaybackRate &playbackRate);
    ~TimestretchBufferProvider() override;

    // Overrides AudioBufferProvider methods
    status_t getNextBuffer(Buffer* buffer, int64_t pts) override;
    void releaseBuffer(Buffer* buffer) override;

    // Overrides PassthruBufferProvider
    void reset() override;
    void setBufferProvider(AudioBufferProvider *p) override;

    virtual status_t setPlaybackRate(const AudioPlaybackRate &playbackRate);

    // processes frames
    // dstBuffer is where to place the data
    // dstFrames [in/out] is the desired frames (return with actual placed in buffer)
    // srcBuffer is the source data
    // srcFrames [in/out] is the available source frames (return with consumed)
    virtual void processFrames(void *dstBuffer, size_t *dstFrames,
            const void *srcBuffer, size_t *srcFrames);

protected:
    const uint32_t       mChannelCount;
    const audio_format_t mFormat;
    const uint32_t       mSampleRate; // const for now (TODO change this)
    const size_t         mFrameSize;
    AudioPlaybackRate    mPlaybackRate;

private:
    AudioBufferProvider::Buffer mBuffer;          // for upstream request
    size_t               mLocalBufferFrameCount;  // size of local buffer
    void                *mLocalBufferData;        // internally allocated buffer for data returned
                                                  // to caller
    size_t               mRemaining;              // remaining data in local buffer
    sonicStream          mSonicStream;            // handle to sonic timestretch object
    //FIXME: this dependency should be abstracted out
    bool                 mFallbackFailErrorShown; // log fallback error only once
    bool                 mAudioPlaybackRateValid; // flag for current parameters validity
};

// AdjustChannelsBufferProvider derives from CopyBufferProvider to adjust sample data.
// Expands or contracts sample data from one interleaved channel format to another.
// Extra expanded channels are filled with zeros and put at the end of each audio frame.
// Contracted channels are copied to the end of the output buffer(storage should be
// allocated appropriately).
// Contracted channels could be written to output buffer and got adjusted. When the contracted
// channels are adjusted in the contracted buffer, the input channel count will be calculated
// as `inChannelCount - outChannelCount`. The output channel count is provided by caller, which
// is `contractedOutChannelCount`. Currently, adjusting contracted channels is used for audio
// coupled haptic playback. If the device supports two haptic channels while apps only provide
// single haptic channel, the second haptic channel will be duplicated with the first haptic
// channel's data. If the device supports single haptic channels while apps provide two haptic
// channels, the second channel will be contracted.
// class AdjustChannelsBufferProvider : public CopyBufferProvider {
// public:
//     // Contracted data is converted to contractedFormat and put into contractedBuffer.
//     AdjustChannelsBufferProvider(audio_format_t format, size_t inChannelCount,
//             size_t outChannelCount, size_t frameCount,
//             audio_format_t contractedFormat = AUDIO_FORMAT_INVALID,
//             void* contractedBuffer = nullptr,
//             size_t contractedOutChannelCount = 0);
//     //Overrides
//     status_t getNextBuffer(Buffer* pBuffer) override;
//     void copyFrames(void *dst, const void *src, size_t frames) override;
//     void reset() override;

//     void clearContractedFrames() { mContractedWrittenFrames = 0; }

// protected:
//     const audio_format_t mFormat;
//     const size_t         mInChannelCount;
//     const size_t         mOutChannelCount;
//     const size_t         mSampleSizeInBytes;
//     const size_t         mFrameCount;
//     const audio_format_t mContractedFormat;
//     const size_t         mContractedInChannelCount;
//     const size_t         mContractedOutChannelCount;
//     const size_t         mContractedSampleSizeInBytes;
//     const size_t         mContractedInputFrameSize; // contracted input frame size
//     void                *mContractedBuffer;
//     size_t               mContractedWrittenFrames;
//     size_t               mContractedOutputFrameSize; // contracted output frame size
// };
// ----------------------------------------------------------------------------
} // namespace android

#endif // ANDROID_BUFFER_PROVIDERS_H
