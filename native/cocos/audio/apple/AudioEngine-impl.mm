/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#import "AVFoundation/AVAudioEngine.h"
#import "AVFoundation/AVAudioPlayerNode.h"
#import "AVFoundation/AVAudioFile.h"
#import "AVFoundation/AVAudioFormat.h"
#include "audio/apple/AudioEngine-impl.h"

/**
 ========== Objective-C implementation for audio management.=========
 */
@interface AudioCache: NSObject
@property(readwrite)AVAudioFile* file;
@property(readwrite)AVAudioPCMBuffer* buffer;
@end
@implementation AudioCache: NSObject

-(id)initWithURL: (NSURL*)fileUrl {
    [super init];
    NSError* err = nil;
    // If err occurs
    if(!file = [[AVAudioFile alloc] initForReading:fileUrl error:&err])
    {
        NSLog(@"%@", [err localizedDescription]);
        [self release];
        return self;
    }
    [self release];
    return self;
}
-(void)readBuffer{
    
    AVAudioFormat *format = file.fileFormat;
    AVAudioFrameCount frameCount = (AVAudioFrameCount)file.length;
}
@end

/**
 ============ C++ implementation ==========
 */

static AVAudioEngine* engine_instance;
namespace cc {
class Scheduler;

#define MAX_AUDIOINSTANCES 24

AudioEngineImpl::AudioEngineImpl(){
    engine_instance = [[AVAudioEngine alloc] init];
}

AudioEngineImpl::~AudioEngineImpl(){
    //TODO: release all player nodes attached?
    [engine_instance release];
}

bool AudioEngineImpl::init() {
    NSError* err;
    if(![engine startAndReturnError: &err]){
        //handle err
    }
    [err release];
}

// return audio id
int AudioEngineImpl::play(const ccstd::string &fileFullPath, bool loop, float volume) {
    AVAudioPlayerNode* player = [[AVAudioPlayerNode alloc] init];
    [engine_instance attachNode:player];
    AVAudioMixerNode *mixer = engine_instance.mainMixerNode;
    
    [engine connect:player to:mixer format:[mixer outputFormatBus:0]];

}

void AudioEngineImpl::setVolume(int audioID, float volume) {
    
}

void AudioEngineImpl::setLoop(int audioID, bool loop) {
    
}

bool AudioEngineImpl::pause(int audioID) {
    
}

bool AudioEngineImpl::resume(int audioID) {
    
}

void AudioEngineImpl::stop(int audioID) {}
void AudioEngineImpl::stopAll() {}
float AudioEngineImpl::getDuration(int audioID) {}
float AudioEngineImpl::getDurationFromFile(const int &fileFullPath){}
float AudioEngineImpl::getCurrentTime(int audioID) {}
bool AudioEngineImpl::setCurrentTime(int audioID, float time){}
void AudioEngineImpl::setFinishCallback(int audioID, const FinishCallback &callback){}

void AudioEngineImpl::uncache(const ccstd::string &filePath){
    
}

void AudioEngineImpl::uncacheAll(AudioCache* cache, int audioID){
    
}
AudioCache* AudioEngineImpl::preload(const ccstd::string &filePath, std::function<void(bool)> callback){
    [[AudioCache alloc] init];
    
    
}
void AudioEngineImpl::update(float dt){}

bool AudioEngineImpl::checkAudioValid(int audioID){}
void AudioEngineImpl::playImpl()




