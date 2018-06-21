/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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
#include "EditBox.h"
#include "platform/desktop/CCGLView-desktop.h"
#include "platform/CCApplication.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

@interface TextViewDelegate : NSObject<NSTextViewDelegate>
-(void) textDidChange:(NSNotification *)notification;
@end

namespace
{
    NSTextView* g_textView = nil;
    NSScrollView* g_scrollView = nil;
    bool g_isMultiline = false;
    int g_maxLength = 0;
    se::Value g_textInputCallback;
    
    void getTextInputCallback()
    {
        if (! g_textInputCallback.isUndefined())
            return;
        
        auto global = se::ScriptEngine::getInstance()->getGlobalObject();
        se::Value jsbVal;
        if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject())
        {
            jsbVal.toObject()->getProperty("onTextInput", &g_textInputCallback);
        }
    }
    
    void callJSFunc(const std::string& type, const std::string& text)
    {
        getTextInputCallback();
        
        se::AutoHandleScope scope;
        se::ValueArray args;
        args.push_back(se::Value(type));
        args.push_back(se::Value(text));
        g_textInputCallback.toObject()->call(args, nullptr);
    }
    
    void initTextView(const cocos2d::EditBox::ShowInfo& showInfo)
    {
        CGRect rect = CGRectMake(showInfo.x, showInfo.y, showInfo.width, showInfo.height);
        if (! g_textView)
        {
            g_textView = [[NSTextView alloc] initWithFrame:rect];
            g_textView.editable = TRUE;
            g_textView.hidden = FALSE;
            g_textView.delegate = [[TextViewDelegate alloc] init];
            
            g_scrollView = [[NSScrollView alloc] initWithFrame:rect];
            [g_scrollView setBorderType:NSNoBorder];
            [g_scrollView setHasVerticalScroller:TRUE];
            [g_scrollView setAutoresizingMask:NSViewWidthSizable | NSViewHeightSizable];
            [g_scrollView setDocumentView:g_textView];
        }
        g_textView.string =  [NSString stringWithUTF8String:showInfo.defaultValue.c_str()];
        g_textView.frame = rect;
        g_scrollView.frame = rect;
                
        auto glfwWindow = ((cocos2d::GLView*)cocos2d::Application::getInstance()->getView())->getGLFWWindow();
        NSWindow* nsWindow = glfwGetCocoaWindow(glfwWindow);
        [nsWindow.contentView addSubview:g_scrollView];
        [nsWindow makeFirstResponder:g_scrollView];
    }
}

@implementation TextViewDelegate

-(void) textDidChange:(NSNotification *)notification
{
    callJSFunc("input", [[g_textView.textStorage string] UTF8String]);
}

@end

NS_CC_BEGIN

void EditBox::show(const ShowInfo& showInfo)
{
    g_isMultiline = showInfo.isMultiline;
    g_maxLength = showInfo.maxLength;
    
    initTextView(showInfo);
    ((GLView*)Application::getInstance()->getView())->setIsEditboxEditing(true);
}


void EditBox::hide()
{
    if (g_scrollView)
        [g_scrollView removeFromSuperview];
    
    ((GLView*)Application::getInstance()->getView())->setIsEditboxEditing(false);
}

void EditBox::complete()
{
    callJSFunc("complete", [[g_textView.textStorage string] UTF8String]);
    EditBox::hide();
}

NS_CC_END
