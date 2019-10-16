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
#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#import <UIKit/UITextField.h>
#import <UIKit/UITextView.h>

#define TEXT_LINE_HEIGHT  40
#define TEXT_VIEW_MAX_LINE_SHOWN    3
#define BUTTON_HIGHT    (TEXT_LINE_HEIGHT - 2)
#define BUTTON_WIDTH    60

#define TO_TEXT_VIEW(textinput)   ((UITextView*)textinput)
#define TO_TEXT_FIELD(textinput)  ((UITextField*)textinput)

/*************************************************************************
 Inner class declarations.
 ************************************************************************/

// MARK: class declaration

@interface ButtonHandler : NSObject
-(IBAction) buttonTapped:(UIButton *)button;
@end

@interface KeyboardEventHandler : NSObject
-(void)keyboardWillShow: (NSNotification*) notification;
-(void)keyboardWillHide: (NSNotification*) notification;
@end

@interface TextFieldDelegate : NSObject<UITextFieldDelegate>
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string;
- (void)textFieldDidChange:(UITextField *)textField;
- (BOOL)textFieldShouldReturn:(UITextField *)textField;
@end

@interface TextViewDelegate : NSObject<UITextViewDelegate>
- (BOOL) textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;
- (void) textViewDidChange:(UITextView *)textView;
@end

/*************************************************************************
 Global variables and functions.
 ************************************************************************/

// MARK: global variables and functions

namespace
{
    bool g_isMultiline = false;
    bool g_confirmHold = false;
    int g_maxLength = INT_MAX;
    KeyboardEventHandler* g_keyboardHandler = nil;

    // "#1fa014", a color of dark green, was used for confirm button background
    static UIColor* g_darkGreen = [UIColor colorWithRed:31/255.0 green:160/255.0 blue:20/255.0 alpha:0.8];

    UITextField* g_textField = nil;
    TextFieldDelegate* g_textFieldDelegate = nil;
    UIButton* g_textFieldConfirmButton = nil;
    ButtonHandler* g_textFieldConfirmButtonHandler = nil;
    
    UITextView* g_textView = nil;
    TextViewDelegate* g_textViewDelegate = nil;
    UIButton* g_textViewConfirmButton = nil;
    ButtonHandler* g_textViewConfirmButtonHander = nil;

    UIView* getCurrentView()
    {
        if (g_isMultiline)
            return g_textView;
        else
            return g_textField;
    }
    
    NSString* getCurrentText()
    {
        if (g_isMultiline)
            return g_textView.text;
        else
            return g_textField.text;
    }
    
    void setText(NSString* text)
    {
        if (g_isMultiline)
            g_textView.text = text;
        else
            g_textField.text = text;
    }
    
    se::Value textInputCallback;
    
    void getTextInputCallback()
    {
        if (! textInputCallback.isUndefined())
            return;
        
        auto global = se::ScriptEngine::getInstance()->getGlobalObject();
        se::Value jsbVal;
        if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject())
        {
            jsbVal.toObject()->getProperty("onTextInput", &textInputCallback);
            // free globle se::Value before ScriptEngine clean up
            se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
                textInputCallback.setUndefined();
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
        textInputCallback.toObject()->call(args, nullptr);
    }
    
    int getTextInputHeight()
    {
        if (g_isMultiline)
            return TEXT_LINE_HEIGHT * TEXT_VIEW_MAX_LINE_SHOWN;
        else
            return TEXT_LINE_HEIGHT;
    }
    
    void createButton(UIButton** button, ButtonHandler** buttonHandler, const CGRect& viewRect, const std::string& title)
    {
        ButtonHandler *btnHandler = [[ButtonHandler alloc] init];
        UIButton* btn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        [btn addTarget:btnHandler action:@selector(buttonTapped:)
           forControlEvents:UIControlEventTouchUpInside];
        btn.frame = CGRectMake(0, 0, BUTTON_WIDTH, BUTTON_HIGHT);
        btn.backgroundColor = g_darkGreen;
        [btn setTitle: [NSString stringWithUTF8String:title.c_str()]
                forState:UIControlStateNormal];
        [btn setTitleColor: [UIColor whiteColor]
             forState:UIControlStateNormal];
        
        *button = btn;
        *buttonHandler = btnHandler;
    }
    
    void setTexFiledKeyboardType(UITextField* textField, const std::string& inputType)
    {
        if (0 == inputType.compare("password"))
        {
            textField.secureTextEntry = TRUE;
            textField.keyboardType = UIKeyboardTypeDefault;
        }
        else
        {
            textField.secureTextEntry = FALSE;
            if (0 == inputType.compare("email"))
                textField.keyboardType = UIKeyboardTypeEmailAddress;
            else if (0 == inputType.compare("number"))
                textField.keyboardType = UIKeyboardTypeDecimalPad;
            else if (0 == inputType.compare("url"))
                textField.keyboardType = UIKeyboardTypeURL;
            else if (0 == inputType.compare("text"))
                textField.keyboardType = UIKeyboardTypeDefault;
        }
    }
    
    void setTextFieldReturnType(UITextField* textField, const std::string& returnType)
    {
        if (0 == returnType.compare("done"))
            textField.returnKeyType = UIReturnKeyDone;
        else if (0 == returnType.compare("next"))
            textField.returnKeyType = UIReturnKeyNext;
        else if (0 == returnType.compare("search"))
            textField.returnKeyType = UIReturnKeySearch;
        else if (0 == returnType.compare("go"))
            textField.returnKeyType = UIReturnKeyGo;
        else if (0 == returnType.compare("send"))
            textField.returnKeyType = UIReturnKeySend;
    }

    NSString* getConfirmButtonTitle(const std::string& returnType)
    {
        NSString* titleKey = [NSString stringWithUTF8String: returnType.c_str()];
        return NSLocalizedString(titleKey, nil); // get i18n string to be the title
    }
    
    void initTextField(const CGRect& rect, const cocos2d::EditBox::ShowInfo& showInfo)
    {
        if (! g_textField)
        {
            g_textField = [[UITextField alloc] initWithFrame:rect];
            g_textField.textColor = [UIColor blackColor];
            g_textField.backgroundColor = [UIColor whiteColor];
            [g_textField setBorderStyle:UITextBorderStyleLine];
            g_textField.backgroundColor = [UIColor whiteColor];
            
            g_textFieldDelegate = [[TextFieldDelegate alloc] init];
            g_textField.delegate = g_textFieldDelegate;
            
            // Assign the overlay button to a stored text field
            createButton(&g_textFieldConfirmButton, &g_textFieldConfirmButtonHandler, rect, showInfo.confirmType);
            g_textField.rightView = g_textFieldConfirmButton;
            g_textField.rightViewMode = UITextFieldViewModeAlways;
            [g_textField addTarget:g_textFieldDelegate action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
        }

        g_textField.frame = rect;
        setTextFieldReturnType(g_textField, showInfo.confirmType);
        setTexFiledKeyboardType(g_textField, showInfo.inputType);
        g_textField.text = [NSString stringWithUTF8String: showInfo.defaultValue.c_str()];
        [g_textFieldConfirmButton setTitle:getConfirmButtonTitle(showInfo.confirmType) forState:UIControlStateNormal];
    }
    
    void initTextView(const CGRect& viewRect, const CGRect& btnRect, const cocos2d::EditBox::ShowInfo& showInfo)
    {
        if (!g_textView)
        {
            g_textView = [[UITextView alloc] initWithFrame:btnRect];
            g_textView.textColor = [UIColor blackColor];
            g_textView.backgroundColor = [UIColor whiteColor];
            g_textViewDelegate = [[TextViewDelegate alloc] init];
            g_textView.delegate = g_textViewDelegate;
            
            createButton(&g_textViewConfirmButton, &g_textViewConfirmButtonHander, btnRect, showInfo.confirmType);
            g_textViewConfirmButton.frame = CGRectMake(viewRect.size.width - BUTTON_WIDTH, 0, BUTTON_WIDTH, BUTTON_HIGHT);
            [g_textView addSubview:g_textViewConfirmButton];
        }
        
        g_textView.frame = btnRect;
        g_textView.text = [NSString stringWithUTF8String: showInfo.defaultValue.c_str()];
        [g_textViewConfirmButton setTitle:getConfirmButtonTitle(showInfo.confirmType) forState:UIControlStateNormal];
    }

    CGRect getSafeAreaRect()
    {
        UIView* view = (UIView*)cocos2d::Application::getInstance()->getView();
        CGRect viewRect = view.frame;

        // safeAreaInsets is avaible since iOS 11.
        if (@available(iOS 11.0, *))
        {
            auto safeAreaInsets = view.safeAreaInsets;
            viewRect.origin.x += safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.left;
        }

        return viewRect;
    }
    
    void addTextInput(const cocos2d::EditBox::ShowInfo& showInfo)
    {
        auto safeAreaRect = getSafeAreaRect();
        int height = getTextInputHeight();
        CGRect rect = CGRectMake(safeAreaRect.origin.x,
                                 safeAreaRect.size.height - height,
                                 safeAreaRect.size.width,
                                 height);
        if (showInfo.isMultiline)
            initTextView(safeAreaRect, rect, showInfo);
        else
            initTextField(rect, showInfo);
        
        UIView* textInput = getCurrentView();
        UIView* view = (UIView*)cocos2d::Application::getInstance()->getView();
        [view addSubview:textInput];
        [textInput becomeFirstResponder];
    }
    
    void addKeyboardEventLisnters()
    {
        if (!g_keyboardHandler)
            g_keyboardHandler = [[KeyboardEventHandler alloc] init];
        
        [[NSNotificationCenter defaultCenter] addObserver:g_keyboardHandler
                                                 selector:@selector(keyboardWillShow:)
                                                     name:UIKeyboardWillShowNotification
                                                   object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:g_keyboardHandler
                                                 selector:@selector(keyboardWillHide:)
                                                     name:UIKeyboardWillHideNotification
                                                   object:nil];
    }
    
    void removeKeyboardEventLisnters()
    {
        if (!g_keyboardHandler)
            return;
        
        [[NSNotificationCenter defaultCenter] removeObserver:g_keyboardHandler];
    }
}

/*************************************************************************
 Class implementations.
 ************************************************************************/

// MARK: class implementation

@implementation KeyboardEventHandler
-(void)keyboardWillShow: (NSNotification*) notification
{
    UIView* textView = getCurrentView();
    if (!textView)
        return;

    NSDictionary* keyboardInfo = [notification userInfo];
    NSValue* keyboardFrame = [keyboardInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    CGSize kbSize = [keyboardFrame CGRectValue].size;

    int textHeight = getTextInputHeight();

    CGRect screenRect = getSafeAreaRect();
    textView.frame = CGRectMake(screenRect.origin.x,
                                screenRect.size.height - textHeight - kbSize.height,
                                screenRect.size.width,
                                textHeight);
}

-(void)keyboardWillHide: (NSNotification*) notification
{
    cocos2d::EditBox::hide();
}
@end

@implementation TextFieldDelegate
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    // REFINE: check length limit before text changed
    return YES;
}

- (void)textFieldDidChange:(UITextField *)textField
{
    if (textField.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude
    if (textField.text.length > g_maxLength) {
        NSRange rangeIndex = [textField.text rangeOfComposedCharacterSequenceAtIndex:g_maxLength];
        textField.text = [textField.text substringToIndex:rangeIndex.location];
    }

    callJSFunc("input", [textField.text UTF8String]);
    setText(textField.text);
}

-(BOOL) textFieldShouldReturn:(UITextField *)textField
{
    cocos2d::EditBox::complete();
    return YES;
}
@end

@implementation ButtonHandler
-(IBAction) buttonTapped:(UIButton *)button
{
    const std::string text([getCurrentText() UTF8String]);
    callJSFunc("confirm", text);
    if (!g_confirmHold)
        cocos2d::EditBox::complete();
}
@end


@implementation TextViewDelegate
- (BOOL) textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text
{
    // REFINE: check length limit before text changed
    return YES;
}

- (void)textViewDidChange:(UITextView *)textView
{
    if (textView.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude
    if (textView.text.length > g_maxLength)
        textView.text = [textView.text substringToIndex:g_maxLength];

    callJSFunc("input", [textView.text UTF8String]);
    setText(textView.text);
}
@end

/*************************************************************************
 Implementation of EditBox.
 ************************************************************************/

// MARK: EditBox

NS_CC_BEGIN

void EditBox::show(const cocos2d::EditBox::ShowInfo& showInfo)
{
    // Should initialize them at first.
    g_maxLength = showInfo.maxLength;
    g_isMultiline = showInfo.isMultiline;
    g_confirmHold = showInfo.confirmHold;
    
    [(CCEAGLView*)cocos2d::Application::getInstance()->getView() setPreventTouchEvent:true];
    addKeyboardEventLisnters();
    addTextInput(showInfo);
}

void EditBox::hide()
{
    removeKeyboardEventLisnters();
    
    UIView* view = getCurrentView();
    if (view)
    {
        [view removeFromSuperview];
        [view resignFirstResponder];
    }
    
    [(CCEAGLView*)cocos2d::Application::getInstance()->getView() setPreventTouchEvent:false];
}

void EditBox::complete()
{
    NSString* text = getCurrentText();
    callJSFunc("complete", [text UTF8String]);
    EditBox::hide();
}

NS_CC_END
