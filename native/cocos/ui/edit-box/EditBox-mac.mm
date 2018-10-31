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

/*************************************************************************
 Forward declaration of global functions.
 ************************************************************************/
namespace
{
    void callJSFunc(const std::string& type, const std::string& text);
}

/*************************************************************************
 Global variables.
 ************************************************************************/
namespace
{
    NSTextView* g_textView = nil;
    NSScrollView* g_scrollView = nil;
    NSTextField* g_textField = nil;
    NSSecureTextField* g_secureTextField = nil;
    bool g_isMultiline = false;
    bool g_isPassword = false;
    int g_maxLength = INT_MAX;
    se::Value g_textInputCallback;
}

/*************************************************************************
 TextViewDelegate
 ************************************************************************/
@interface TextViewDelegate : NSObject<NSTextViewDelegate>
@end

@implementation TextViewDelegate
// Get notification when something is input.
- (void) textDidChange:(NSNotification *)notification
{
    callJSFunc("input", [[g_textView.textStorage string] UTF8String]);
}

// Max length limitaion
- (BOOL) textView:(NSTextView *)textView
shouldChangeTextInRange:(NSRange)affectedCharRange
replacementString:(NSString *)replacementString
{
    NSUInteger newLength = [textView.string length] + [replacementString length] - affectedCharRange.length;
    if (newLength > g_maxLength)
        return FALSE;
    
    if (!g_isMultiline && [replacementString containsString:@"\n"])
        return FALSE;
    
    return TRUE;
}
@end

/*************************************************************************
 TextFieldDelegate
 ************************************************************************/
@interface TextFieldDelegate: NSObject<NSTextFieldDelegate>
@end

@implementation TextFieldDelegate
- (void)controlTextDidChange:(NSNotification *)notification
{
    NSTextField *textField = [notification object];
    callJSFunc("input", [textField.stringValue UTF8String]);
}
@end

/*************************************************************************
 TextFieldFormatter: used for textfield length limitation.
 ************************************************************************/
@interface TextFieldFormatter : NSFormatter
{
    int maxLength;
}
- (void)setMaximumLength:(int)len;
@end

@implementation TextFieldFormatter

- (id)init
{
    if(self = [super init])
        maxLength = INT_MAX;
    
    return self;
}

- (void)setMaximumLength:(int)len
{
    maxLength = len;
}

- (NSString *)stringForObjectValue:(id)object
{
    return (NSString *)object;
}

- (BOOL)getObjectValue:(id *)object forString:(NSString *)string errorDescription:(NSString **)error
{
    *object = string;
    return YES;
}

- (BOOL)isPartialStringValid:(NSString **)partialStringPtr
       proposedSelectedRange:(NSRangePointer)proposedSelRangePtr
              originalString:(NSString *)origString
       originalSelectedRange:(NSRange)origSelRange
            errorDescription:(NSString **)error
{
    if ([*partialStringPtr length] > maxLength)
        return NO;
    
    return YES;
}

- (NSAttributedString *)attributedStringForObjectValue:(id)anObject withDefaultAttributes:(NSDictionary *)attributes
{
    return nil;
}
@end

/*************************************************************************
 Implementation of global helper functions.
 ************************************************************************/
namespace
{
    void getTextInputCallback()
    {
        if (! g_textInputCallback.isUndefined())
            return;
        
        auto global = se::ScriptEngine::getInstance()->getGlobalObject();
        se::Value jsbVal;
        if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject())
        {
            jsbVal.toObject()->getProperty("onTextInput", &g_textInputCallback);
            // free globle se::Value before ScriptEngine clean up
            se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
                g_textInputCallback.setUndefined();
            });
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
    
    void doInitTextField(NSTextField* textField, const CGRect& rect, const cocos2d::EditBox::ShowInfo& showInfo)
    {
        textField.editable = TRUE;
        textField.wantsLayer = TRUE;
        textField.frame = rect;
        textField.stringValue = [NSString stringWithUTF8String:showInfo.defaultValue.c_str()];
        [(TextFieldFormatter*)textField.formatter setMaximumLength: showInfo.maxLength];
        
        auto glfwWindow = ((cocos2d::GLView*)cocos2d::Application::getInstance()->getView())->getGLFWWindow();
        NSWindow* nsWindow = glfwGetCocoaWindow(glfwWindow);
        [nsWindow.contentView addSubview:textField];
        [textField becomeFirstResponder];
    }
    
    void initTextField(const cocos2d::EditBox::ShowInfo& showInfo)
    {
        CGRect rect = CGRectMake(showInfo.x, showInfo.y, showInfo.width, showInfo.height);
        
        // Use NSSecureTextField for password, use NSTextField for others.
        if (g_isPassword)
        {
            if (! g_secureTextField)
            {
                g_secureTextField = [[NSSecureTextField alloc] init];
                g_secureTextField.delegate = [[TextFieldDelegate alloc] init];
                g_secureTextField.formatter = [[TextFieldFormatter alloc] init];
            }
            doInitTextField(g_secureTextField, rect, showInfo);
        }
        else
        {
            if (! g_textField)
            {
                g_textField = [[NSTextField alloc] init];
                g_textField.delegate = [[TextFieldDelegate alloc] init];
                g_textField.formatter = [[TextFieldFormatter alloc] init];
            }
            doInitTextField(g_textField, rect, showInfo);
        }
    }
    
    void init(const cocos2d::EditBox::ShowInfo& showInfo)
    {
        if (showInfo.isMultiline)
            initTextView(showInfo);
        else
            initTextField(showInfo);
    }
}

/*************************************************************************
 Implementation of EditBox.
 ************************************************************************/

NS_CC_BEGIN

void EditBox::show(const ShowInfo& showInfo)
{
    g_isMultiline = showInfo.isMultiline;
    g_maxLength = showInfo.maxLength;
    g_isPassword = showInfo.inputType == "password";
    
    init(showInfo);
    ((GLView*)Application::getInstance()->getView())->setIsEditboxEditing(true);
}


void EditBox::hide()
{
    if (g_scrollView)
        [g_scrollView removeFromSuperview];
    
    if (g_textField)
    {
        [g_textField resignFirstResponder];
        [g_textField  removeFromSuperview];
    }
    
    if (g_secureTextField)
    {
        [g_secureTextField resignFirstResponder];
        [g_secureTextField removeFromSuperview];
    }
    
    ((GLView*)Application::getInstance()->getView())->setIsEditboxEditing(false);
}

void EditBox::complete()
{
    if (g_isMultiline)
        callJSFunc("complete", [[g_textView.textStorage string] UTF8String]);
    else
    {
        if (g_isPassword)
            callJSFunc("complete", [g_secureTextField.stringValue UTF8String]);
        else
            callJSFunc("complete", [g_textField.stringValue UTF8String]);
    }
    
    EditBox::hide();
}

NS_CC_END
