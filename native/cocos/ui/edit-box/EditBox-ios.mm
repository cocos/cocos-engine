/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "EditBox.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"


#import <UIKit/UIKit.h>

#define TEXT_LINE_HEIGHT         40
#define TEXT_VIEW_MAX_LINE_SHOWN 3
#define BUTTON_HIGHT             (TEXT_LINE_HEIGHT - 2)
#define BUTTON_WIDTH             60

#define TO_TEXT_VIEW(textinput)  ((UITextView *)textinput)
#define TO_TEXT_FIELD(textinput) ((UITextField *)textinput)

/*************************************************************************
 Inner class declarations.
 ************************************************************************/

// MARK: class declaration


/*******************************
 TODO: New implementation of iOS inputbox
 UI Structure:
    ==[|             ][done]== >>> inputAccessoryView
    = q w e r t y u i o p =
    = a s d f g h j k l ; '' =
    = virtual [    ] keyboard = >>> inputView
 
 Further needs:
    Customization of inputbox, developer DIY toolbar.
    The principle idea is to set inputAccessoryView from JS where developer can bind selector with js callback.
    JS API:
        uibutton sendBtn;
        sendBtn.onclick = () => {...}
        uiInputField inputFld;
        inputFld.oninput = () => {...}
        jsb.inputbox ibox;
        ibox.addComponent(sendBtn); //automatically set as the last element.
        ibox.setLayout(sendBtn, inputFld);
    JSB binding:
        jsb_addComponent(se::Value){
            ...
            inputBox.addComponent(cpt);
        }
    Native API:
    class InputBox{
        ...
        addComponent(UIView* cpt);
        setLayout(UIView*[] views);
        createInputBox();
    }

 *******************************/


//TODO: A mecanism to store each customize UITextView or UITextField. For example, if keyboard and toolbar is customized, should give a hash value and store in the map with a hash value calculated.


// Customize inputbox
@interface Inputbox : NSObject {
@public UITextView  *g_inputView;
@public UITextField *g_inputField;
}

- (void) createTextField:   (const cc::EditBox::ShowInfo*)showInfo;
- (void) createTextView:    (const cc::EditBox::ShowInfo*)showInfo;

- (void) addComponent: (UIView*) component;
- (void) setLayout: (UIView*[]) components;
- (void) show: (const cc::EditBox::ShowInfo*)showInfo;
//TODO: move all handlers into inputbox implementation
- (IBAction)buttonTapped:(UIButton *)button;
- (void)keyboardWillShow:(NSNotification *)notification;
- (void)keyboardWillHide:(NSNotification *)notification;
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string;
- (void)textFieldDidChange:(UITextField *)textField;
- (BOOL)textFieldShouldReturn:(UITextField *)textField;
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;
- (void)textViewDidChange:(UITextView *)textView;
@end


static Inputbox *g_inputbox = nil;
/*************************************************************************
 Global variables and functions relative to script engine.
 ************************************************************************/
namespace {

se::Value textInputCallback;

void getTextInputCallback() {
    if (!textInputCallback.isUndefined())
        return;

    auto global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value jsbVal;
    if (global->getProperty("jsb", &jsbVal) && jsbVal.isObject()) {
        jsbVal.toObject()->getProperty("onTextInput", &textInputCallback);
        // free globle se::Value before ScriptEngine clean up
        se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
            textInputCallback.setUndefined();
        });
    }
}

void callJSFunc(const ccstd::string &type, const ccstd::string &text) {
    getTextInputCallback();

    se::AutoHandleScope scope;
    se::ValueArray args;
    args.push_back(se::Value(type));
    args.push_back(se::Value(text));
    textInputCallback.toObject()->call(args, nullptr);
}

int getTextInputHeight(bool isMultiline) {
    if (isMultiline)
        return TEXT_LINE_HEIGHT * TEXT_VIEW_MAX_LINE_SHOWN;
    else
        return TEXT_LINE_HEIGHT;
}


void setTextFieldReturnType(UITextField *textField, const ccstd::string &returnType) {
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

NSString *getConfirmButtonTitle(const ccstd::string &returnType) {
    NSString *titleKey = [NSString stringWithUTF8String:returnType.c_str()];
    return NSLocalizedString(titleKey, nil); // get i18n string to be the title
}

void initTextField(const cc::EditBox::ShowInfo &showInfo) {
    if(!g_inputbox) {
        g_inputbox = [[Inputbox alloc] init];
    }
    [g_inputbox createTextField:&showInfo];
    return;
}

void initTextView(const cc::EditBox::ShowInfo &showInfo) {
    if(!g_inputbox) {
        g_inputbox = [[Inputbox alloc] init];
    }
    [g_inputbox createTextView:&showInfo];
    return;
}

CGRect getSafeAreaRect() {
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    CGRect viewRect = view.frame;

    // safeAreaInsets is avaible since iOS 11.
    if (@available(iOS 11.0, *)) {
        auto safeAreaInsets = view.safeAreaInsets;

        UIInterfaceOrientation sataus = [UIApplication sharedApplication].statusBarOrientation;
        if (UIInterfaceOrientationLandscapeLeft == sataus) {
            viewRect.origin.x = 0;
            viewRect.size.width -= safeAreaInsets.right;
        } else {
            viewRect.origin.x += safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.left;
        }
    }

    return viewRect;
}
UIView *getCurrentView(bool isMultiline) {
    if(isMultiline)
        return g_inputbox->g_inputView;
    return g_inputbox->g_inputField;
}

NSString* getCurrentText(bool isMultiline){
    if(isMultiline)
        return g_inputbox->g_inputView.text;
    return g_inputbox->g_inputField.text;
}
void addTextInput(const cc::EditBox::ShowInfo &showInfo) {
    auto safeAreaRect = getSafeAreaRect();
    int height = getTextInputHeight(showInfo.isMultiline);
    CGRect btnRect = CGRectMake(safeAreaRect.origin.x,
                             safeAreaRect.size.height - height/2,
                             safeAreaRect.size.width,
                             height);
    if (showInfo.isMultiline)
        initTextView(showInfo);
    else
        initTextField(showInfo);

    UIView *textInput = getCurrentView(showInfo.isMultiline);
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    [view addSubview:textInput];
    [textInput becomeFirstResponder];
}

void addKeyboardEventLisnters() {

}

void removeKeyboardEventLisnters() {

}
} // namespace

/*************************************************************************
 Class implementations.
 ************************************************************************/
@implementation Inputbox
{

}
- (void) createTextView:    (const cc::EditBox::ShowInfo *)showInfo{
    g_inputView = [[UITextView alloc]
                   initWithFrame:CGRectMake(showInfo->x,
                                            showInfo->y,
                                            showInfo->width,
                                            showInfo->height)];
    //TODO: bind with specified inputView and inputAccessoryView
    return;
}
- (void) createTextField:    (const cc::EditBox::ShowInfo*)showInfo{
    g_inputField = [[UITextField alloc]
                   initWithFrame:CGRectMake(showInfo->x,
                                            showInfo->y,
                                            showInfo->width,
                                            showInfo->height)];
    //TODO: bind with specified inputView and inputAccessoryView
    return;
}
- (void) show: (const cc::EditBox::ShowInfo*)showInfo {
    if (showInfo->isMultiline) {
        createTextField:showInfo;
    } else {
        createTextView:showInfo;
    }
        
}
- (void) hide {
    
}
- (id) init {
    self = [super init];
    return self;
}
- (void) addComponent:(UIView *)component {
    //TODO: Add component into inputAccessoryView
    return;
}


- (void) setLayout:(UIView *[])components {
    //TODO: Set layout of inputAccessoryView
    return;
}

- (void)keyboardWillShow:(NSNotification *)notification {

}
- (void)keyboardWillHide:(NSNotification *)notification {
    
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
    // REFINE: check length limit before text changed
    return YES;
}

- (void)textFieldDidChange:(UITextField *)textField {
    if (textField.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude
//    if (textField.text.length > g_maxLength) {
//        NSRange rangeIndex = [textField.text rangeOfComposedCharacterSequenceAtIndex:g_maxLength];
//        textField.text = [textField.text substringToIndex:rangeIndex.location];
//    }

    callJSFunc("input", [textField.text UTF8String]);
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    cc::EditBox::complete();
    return YES;
}

- (IBAction)buttonTapped:(UIButton *)button {

    callJSFunc("confirm", "sss");

    cc::EditBox::complete();
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
    // REFINE: check length limit before text changed
    return YES;
}

- (void)textViewDidChange:(UITextView *)textView {
    if (textView.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude

    callJSFunc("input", [textView.text UTF8String]);
}
@end

/*************************************************************************
 Implementation of EditBox.
 ************************************************************************/

// MARK: EditBox

namespace cc{
bool EditBox::_isShown = false;
void EditBox::show(const cc::EditBox::ShowInfo &showInfo) {
    if(!g_inputbox){
        g_inputbox = [[Inputbox alloc] init];
    }
    [g_inputbox show:&showInfo];
}

void EditBox::hide() {
    [g_inputbox hide];
}

bool EditBox::complete() {
    if (!_isShown)
        return false;

    NSString *text = getCurrentText(sinfo.isMultiline);
    callJSFunc("complete", [text UTF8String]);
    EditBox::hide();

    return true;
}

} // namespace cc
