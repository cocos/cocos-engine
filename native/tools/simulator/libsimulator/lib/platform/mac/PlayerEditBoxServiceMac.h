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

//
//  EditBoxServiceMac.h
//  player
//

#ifndef __player__EditBoxServiceMac__
#define __player__EditBoxServiceMac__

#include "PlayerEditBoxServiceProtocol.h"

#import <AppKit/AppKit.h>

#include <array>

typedef std::array<uint8_t, 3> Color3B;

@interface EditBoxServiceImplMac : NSObject <NSTextFieldDelegate>
{
    NSTextField* textField_;
    void* editBox_;
    BOOL editState_;
    NSMutableDictionary* placeholderAttributes_;
}

@property(nonatomic, retain) NSTextField* textField;
@property(nonatomic, retain) NSMutableDictionary* placeholderAttributes;
@property(nonatomic, readonly, getter = isEditState) BOOL editState;
@property(nonatomic, assign) void* editBox;

-(id) initWithFrame: (NSRect) frameRect editBox: (void*) editBox;
-(void) doAnimationWhenKeyboardMoveWithDuration:(float)duration distance:(float)distance;
-(void) setPosition:(NSPoint) pos;
-(void) setContentSize:(NSSize) size;
-(void) visit;
-(void) openKeyboard;
-(void) closeKeyboard;

@end


PLAYER_NS_BEGIN
class PlayerEditBoxServiceMac : public PlayerEditBoxServiceProtocol
{
public:
    PlayerEditBoxServiceMac();
    virtual ~PlayerEditBoxServiceMac();
    
    // overwrite
    virtual void showSingleLineEditBox(const cc::Rect &rect) ;
    virtual void showMultiLineEditBox(const cc::Rect &rect)  ;
    virtual void hide() ;
    
    virtual void setText(const std::string &text);
    virtual void setFont(const std::string &name, int size);
    virtual void setFontColor(const Color3B &color);
    
    virtual void setFormator(int formator);
private:
    void show();
    
private:
    EditBoxServiceImplMac*  _sysEdit;
};

PLAYER_NS_END

#endif
