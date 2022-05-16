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

/************************************************************
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
        ibox.addComponent(sendBtn); automatically set as the last element.
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

 ************************************************************/

#include "EditBox.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"


#import <UIKit/UIKit.h>

#define TEXT_LINE_HEIGHT         40
#define TEXT_VIEW_MAX_LINE_SHOWN 3
#define BUTTON_HIGHT             (TEXT_LINE_HEIGHT - 2)
#define BUTTON_WIDTH             60

/*************************************************************************
 Inner class declarations.
 ************************************************************************/
@interface Editbox_impl : NSObject
+ (instancetype)sharedInstance;
- (void)        show: (const cc::EditBox::ShowInfo*)showInfo;
- (UIView*)     getCurrentViewInUse;
- (NSString*)   getCurrentText;

@end

@interface KeyboardEventHandler : NSObject
- (void)        keyboardWillShow:(NSNotification *)notification;
- (void)        keyboardWillHide:(NSNotification *)notification;
@end

@interface TextFieldDelegate : NSObject <UITextFieldDelegate>
- (BOOL)        textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string;
- (void)        textFieldDidChange:(UITextField *)textField;
- (BOOL)        textFieldShouldReturn:(UITextField *)textField;
@end

@interface TextViewDelegate : NSObject <UITextViewDelegate> //Multiline
- (BOOL)        textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;
- (void)        textViewDidChange:(UITextView *)textView;
@end

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

/*************************************************************************
 Global functions as tools to set values
 ************************************************************************/

int getTextInputHeight(bool isMultiline) {
    if (isMultiline)
        return TEXT_LINE_HEIGHT * TEXT_VIEW_MAX_LINE_SHOWN;
    else
        return TEXT_LINE_HEIGHT;
}

// set textfield input type
void setTexFieldKeyboardType(UITextField *textField, const std::string &inputType) {
    if (0 == inputType.compare("password")) {
        textField.secureTextEntry = TRUE;
        textField.keyboardType = UIKeyboardTypeDefault;
    } else {
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
// change the name of keyboard return btn.
// TODO: Set the process into private method, reduce one layour read write
// TODO: Make type as enum
void setTextFieldReturnType(UITextField *textField, const std::string &returnType) {
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

NSString *getConfirmButtonTitle(const std::string &returnType) {
    NSString *titleKey = [NSString stringWithUTF8String:returnType.c_str()];
    return NSLocalizedString(titleKey, nil); // get i18n string to be the title
}
//
CGRect getSafeAreaRect() {
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    CGRect viewRect = view.frame;

    // safeAreaInsets is avaible since iOS 11.
    if (@available(iOS 11.0, *)) {
        auto safeAreaInsets = view.safeAreaInsets;

        UIInterfaceOrientation orient = [UIApplication sharedApplication].statusBarOrientation;
        if (UIInterfaceOrientationLandscapeLeft == orient) {
            viewRect.origin.x = 0;
            viewRect.size.width -= safeAreaInsets.right;
        } else {
            viewRect.origin.x += safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.left;
        }
    }

    return viewRect;
}

} // namespace

/*************************************************************************
 Class implementations.
 ************************************************************************/
@implementation Editbox_impl
{
    //recently there'ill be only 2 elements
    NSMutableDictionary<NSString*, id>*     textInputDictionnary;
    UIView*                                 curView;
    bool                                    isCurViewMultiline;
}
static Editbox_impl *instance = nil;

+ (instancetype) sharedInstance {
    static dispatch_once_t pred = 0;
    dispatch_once(&pred, ^{
        instance = [[super allocWithZone:NULL] init];
    });
    return instance;
}
+ (id)allocWithZone:(struct _NSZone*)zone {
    return [Editbox_impl sharedInstance];
}

- (id)copyWithZone:(struct _NSZone*)zone {
    return [Editbox_impl sharedInstance];
}
- (id)init {
    self          = [super init];
    textInputDictionnary = [NSMutableDictionary new];
    return self;
}
- (void)dealloc {
    for (id textInput : textInputDictionnary) {
        [textInput release];
    }
    [super dealloc];
}

- (id) createTextView:    (const cc::EditBox::ShowInfo *)showInfo {
    UITextView* ret;
    //TODO: object for key with hash value
    if ((ret = [textInputDictionnary objectForKey:@"0"])) {
        //TODO: Set properties
    } else {
        ret = [[UITextView alloc]
               initWithFrame:CGRectMake(showInfo->x,
                                        showInfo->y,
                                        showInfo->width,
                                        showInfo->height)];
        [textInputDictionnary setValue:ret forKey:@"0"];
    }
    
    // TODO: Bind with specified inputView and inputAccessoryView
    // TODO: Add into textInputDictionnary
    return ret;
}
- (id) createTextField:    (const cc::EditBox::ShowInfo*)showInfo {
    UITextField* ret;
    if ((ret = [textInputDictionnary objectForKey:@"1"])) {
        //TODO: Set properties
    } else {
        ret = [[UITextField alloc]
                initWithFrame:CGRectMake(showInfo->x,
                                         showInfo->y,
                                         showInfo->width,
                                         showInfo->height)];
        [textInputDictionnary setValue:ret forKey:@"1"];
    }
    // TODO: Bind with specified inputView and inputAccessoryView
    // TODO: Add into textInputDictionnary
    return ret;
}
- (void) keyboardWillShow:(NSNotification *)notification {
    UIView* currentView = [[Editbox_impl sharedInstance] getCurrenViewInUse];
    if (!currentView)
        return;

    NSDictionary *keyboardInfo = [notification userInfo];
    NSValue *keyboardFrame = [keyboardInfo objectForKey:UIKeyboardFrameEndUserInfoKey];
    CGSize kbSize = [keyboardFrame CGRectValue].size;

    int textHeight = getTextInputHeight(isCurViewMultiline);

    CGRect screenRect = getSafeAreaRect();
    //reset currentView position.
    currentView.frame = CGRectMake(screenRect.origin.x,
                                screenRect.size.height - textHeight - kbSize.height,
                                screenRect.size.width,
                                textHeight);
}

- (void) keyboardWillHide:(NSNotification *)notification {
    NSDictionary *info = [notification userInfo];
    
    CGRect beginKeyboardRect = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue];
    CGRect endKeyboardRect = [[info objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGFloat yOffset = endKeyboardRect.origin.y - beginKeyboardRect.origin.y;
    
    if (yOffset <= 0) {
        cc::EditBox::hide();
    }
}
- (void) addKeyboardEventListeners {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
}

- (void) removeKeyboardEventListeners {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
- (void) show: (const cc::EditBox::ShowInfo*)showInfo {
    if (showInfo->isMultiline) {
        curView = [self createTextView:showInfo];
        isCurViewMultiline = true;
    } else {
        curView = [self createTextField:showInfo];
        isCurViewMultiline = true;
    }
    [self addKeyboardEventListeners];
}
- (void) hide {
    //TODO: I'm not so sure about what should be hide here.
    [self removeKeyboardEventListeners];
    [curView removeFromSuperview];
    [curView resignFirstResponder];
    
}

- (void) addComponent:(UIView *)component {
    //TODO: Add component into inputAccessoryView
    return;
}


- (void) setLayout:(UIView *[])components {
    //TODO: Set layout of inputAccessoryView
    return;
}

- (UIView*) getCurrentViewInUse {
    return curView;
}
- (NSString*) getCurrentText {
    if (isCurViewMultiline)
        return [(UITextView*)curView text];
    return [(UITextField*)curView text];
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
    [[Editbox_impl sharedInstance] show:&showInfo];
}

void EditBox::hide() {
    [[Editbox_impl sharedInstance] hide];
}

bool EditBox::complete() {
    if (!_isShown)
        return false;

    NSString *text = [[Editbox_impl sharedInstance] getCurrentText];
    callJSFunc("complete", [text UTF8String]);
    EditBox::hide();

    return true;
}
} // namespace cc
