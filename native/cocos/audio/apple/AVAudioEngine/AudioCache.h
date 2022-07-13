/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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
#include <mutex>
#include "audio/include/AudioDef.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"
#ifdef __OBJC__
#import <AVFoundation/AVAudioFile.h>
//#import <AVFoundation/AVAudioPCMBuffer.h>
#else
#endif
#ifdef __OBJC__
typedef struct AudioFileDescriptor {
    AVAudioFile* audioFile;
    AVAudioPCMBuffer* buffer;
} AudioFileDescriptor;
#else
typedef struct AudioFileDescriptor {
} AudioFileDescriptor;
#endif

// Macro: decided by build phase, Variable: decided by running phase
// By default, memory use of audio data in total is 32 mb, de/increase MAX_BUFFER_LENGTH and MAX_CACHE_COUNT to change memory usage.
#define MAX_BUFFER_LENGTH 262144 // 256 kilo-bytes
#define MAX_CACHE_COUNT 128 // 128 audio cache can be create.
#define MAX_BUFFER_COUNT 3 // Max buffer count that can be stored in memory.
typedef std::function<void(bool)> LoadCallback;
namespace cc {
class AudioCache {
public:

    // ready -> loaded -> unloaded -> loaded again.
    enum State {
        READY, // Ready to load
        LOADED,
        UNLOADED, // Unloaded.
        FAILED
    };
    // Once constructed, state become READY
    AudioCache(std::string& fileFullPath);
    // If not unloaded, force unload the audio buffer
    ~AudioCache();

     // With a single thread to use. once load or unload end, the loadCallback will be triggered.
    bool unload();
    bool load();
    bool isStreaming() const {return _isStreaming;}
    void addLoadCallback(const LoadCallback &callback);
    void addPlayCallback(const std::function<void()> &callback);
    void invokingPlayCallbacks();
    void invokingLoadCallbacks();
#ifdef __OBJC__
    bool loadToBuffer(AVAudioFramePosition &startFramePosition, AVAudioPCMBuffer* buffer, uint32_t frameCount);
#endif
    bool resample(PCMHeader header);
    
    // Can only be called when state is LOADED
    std::vector<uint8_t> getPCMBuffer();
    std::vector<uint8_t> getPCMBuffer(uint32_t channelID);
    AudioFileDescriptor getDescriptor() {return _descriptor;}
    
    PCMHeader getPCMHeader();
    State loadState;
    uint32_t useCount {0};
private:
    ccstd::string _fileFullPath;
    AudioFileDescriptor                     _descriptor;
    std::mutex                              _readDataMutex;
    std::mutex _playCallbackMutex;
    PCMHeader                               _pcmHeader; // Smaller than MAX_BUFFER_LENGTH
    std::shared_ptr<std::vector<char>>      _pcmBuffer {nullptr}; // nullptr when it's on Apple platform.
    bool                                    _isStreaming {false};
    ccstd::vector<std::function<void(bool)>>  _loadCallbacks;
    ccstd::vector<std::function<void()>>      _playCallbacks;
    friend class AudioEngineImpl;
};
}
