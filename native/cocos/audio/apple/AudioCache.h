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
#include "base/std/container/string.h"
#include "audio/include/Common.h"

// Macro: decided by build phase, Variable: decided by running phase
#define MAX_BUFFER_LENGTH 256000 //bytes

typedef std::function<void(bool)> LoadCallback;
namespace cc {
    class AudioCache {

        // ready -> loaded -> unloaded -> loaded again.
        enum State {
            READY, // Ready to load
            LOADED,
            UNLOADED, // Unloaded.
        };
        // Once constructed, state become READY
        AudioCache(ccstd::string& fileFullPath); 
        // If not unloaded, force unload the audio buffer
        ~AudioCache(); 

         // With a single thread to use. once load or unload end, the loadCallback will be triggered.
        bool unload(LoadCallback &cb);
        bool load(LoadCallback &cb);
        bool resample(uint32_t sampleRate);
        
        // Can only be called when state is LOADED
        ccstd::vector<char> getPCMBuffer();
        PCMHeader getPCMHeader();
        State loadState;
    private:
        std::mutex _readDataMutex;
        PCMHeader _pcmHeader;
        ccstd::shared_ptr<std::vector<char>> _pcmBuffer;
    };
}
