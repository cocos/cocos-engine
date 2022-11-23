/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#ifndef __PLAYER_TASK_SERVICE_MAC_H_
#define __PLAYER_TASK_SERVICE_MAC_H_

#include <sstream>

#include "PlayerTaskServiceProtocol.h"

#import <AppKit/AppKit.h>

#include "cocos/base/RefMap.h"

PLAYER_NS_BEGIN
class PlayerTaskMac;
PLAYER_NS_END

@interface PlayerTaskPrivate : NSObject {
    NSFileHandle *fileHandle;

    NSTask *_buildTask;
    BOOL _isRunning;
    int _exitCode;
    NSString *_output;
}

@property (assign) NSTask *buildTask;
@property (assign) BOOL isRunning;
@property (assign) int exitCode;
@property (retain) NSString *output;

- (void)runScriptAsyn:(NSString *)absScriptPath withArguments:(NSArray *)arguments;
@end

PLAYER_NS_BEGIN

class PlayerTaskMac : public PlayerTask {
public:
    static PlayerTaskMac *create(const std::string &name,
                                 const std::string &executePath,
                                 const std::string &commandLineArguments);

    virtual ~PlayerTaskMac();

    virtual bool run();
    virtual void stop();
    virtual void runInTerminal();

    // check task status
    virtual void update(float dt);

    void appendOutput(const char *data);

protected:
    PlayerTaskMac(const std::string &name,
                  const std::string &executePath,
                  const std::string &commandLineArguments);

    void cleanup();
    std::u16string makeCommandLine() const;

    PlayerTaskPrivate *_taskPrivate;
};

class PlayerTaskServiceMac : public PlayerTaskServiceProtocol {
public:
    PlayerTaskServiceMac();
    virtual ~PlayerTaskServiceMac();

    virtual PlayerTask *createTask(const std::string &name,
                                   const std::string &executePath,
                                   const std::string &commandLineArguments);
    virtual PlayerTask *getTask(const std::string &name);
    virtual void removeTask(const std::string &name);

protected:
    cc::RefMap<std::string, PlayerTaskMac *> _tasks;
};

PLAYER_NS_END

#endif // __PLAYER_TASK_SERVICE_MAC_H_
