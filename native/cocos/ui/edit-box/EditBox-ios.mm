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
     ==[Camera][|             ][done]== >>> inputoopeAccessoryView
     = q w e r t y u i o p =
     = a s d f g h j k l ; '' =
     = virtual [    ] keyboard = >>> inputView
    The principle idea is to set inputAccessoryView from JS where developer can bind selector with js callback.
    JS API:
        jsb.InputBox customizeIBox = new jsb.InputBox();
        ibox.addComponent(sendBtn, (ClickEvent: event)=>{...}); automatically set as the last element.
        ibox.addComponent(inputFld, (InputEvent: event)=>{...});
        ibox.setLayout(sendBtn, inputFld);
    JSB binding:
        jsb_addComponent(se::Value){
            ...
            inputBox.addComponent(cpt);
        }
 ************************************************************/

#include "EditBox.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/event/EventDispatcher.h"

#import <UIKit/UIKit.h>

#define ITEM_MARGIN_WIDTH               10
#define ITEM_MARGIN_HEIGHT              10
#define TEXT_LINE_HEIGHT                40
#define TEXT_VIEW_MAX_LINE_SHOWN        1.5
#define BUTTON_HEIGHT                   (TEXT_LINE_HEIGHT - ITEM_MARGIN_HEIGHT)
#define BUTTON_WIDTH                    60

const bool INPUTBOX_HIDDEN = true; // Toggle if Inputbox is visible
/*************************************************************************
 Inner class declarations.
 ************************************************************************/
@interface Editbox_impl : NSObject
+ (instancetype)sharedInstance;
- (void)        show:(const cc::EditBox::ShowInfo*)showInfo;
- (void)        hide;
- (UIView*)     getCurrentViewInUse;
- (NSString*)   getCurrentText;
@end

@interface ButtonHandler : NSObject
- (IBAction)    buttonTapped:(UIButton *)button;
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

static int      g_maxLength = INT_MAX;
static bool     g_isMultiline = true;
se::Value       textInputCallback;

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

void callJSFunc(const std::string &type, const std::string &text) {
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

int getTextInputHeight() {
    if (g_isMultiline)
        return TEXT_LINE_HEIGHT * TEXT_VIEW_MAX_LINE_SHOWN;
    else
        return TEXT_LINE_HEIGHT;
}

// TODO: Make type enum
void setTextFieldKeyboardType(UITextField *textField, const std::string &inputType) {
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

NSString *getHash(const cc::EditBox::ShowInfo* showInfo) {
    //TODO: get hash with different type of showInfo, for example different inputAccessoryView
    return showInfo->isMultiline?@"textView":@"textField";
}
void onParentViewTouched(const cc::CustomEvent &touchEvent){
    [[Editbox_impl sharedInstance] hide];
}
} // namespace

/*************************************************************************
 Class implementations.
 ************************************************************************/
@implementation TextViewDelegate {
    UITextView* tViewOnView;
    UITextView* tViewOnToolbar;
}
- (id) initWithPairs:(UITextView*) inputOnView and:(UITextView*) inputOnToolbar {
    self = [super init];
    tViewOnView = inputOnView;
    tViewOnToolbar = inputOnToolbar;
    return self;
}
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
    // REFINE: check length limit before text changed
    return YES;
}
- (void)textViewDidChange:(UITextView *)textView {
    if (textView.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude
    if (textView.text.length > g_maxLength)
        textView.text = [textView.text substringToIndex:g_maxLength];
    tViewOnView.text = textView.text;
    tViewOnToolbar.text = textView.text;
    callJSFunc("input", [textView.text UTF8String]);
}
@end
@implementation TextFieldDelegate {
    UITextField* textFieldOnView;
    UITextField* textFieldOntoolbar;
}

- (id) initWithPairs:(UITextField*) inputOnView and:(UITextField*) inputOnToolbar {
    self = [super init];
    textFieldOnView = inputOnView;
    textFieldOntoolbar = inputOnToolbar;
    return self;
}
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
    // REFINE: check length limit before text changed
    return YES;
}

- (void)textFieldDidChange:(UITextField *)textField {
    if (textField.markedTextRange != nil)
        return;

    // check length limit after text changed, a little rude
    if (textField.text.length > g_maxLength) {
        NSRange rangeIndex = [textField.text rangeOfComposedCharacterSequenceAtIndex:g_maxLength];
        textField.text = [textField.text substringToIndex:rangeIndex.location];
    }
    textFieldOnView.text = textField.text;
    textFieldOntoolbar.text = textField.text;
    callJSFunc("input", [textField.text UTF8String]);
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    cc::EditBox::complete();
    return YES;
}
@end


static ButtonHandler*           btnHandler = nil;
@interface InputBoxPair : NSObject
@property(readwrite) id inputOnView;
@property(readwrite) id inputOnToolbar;
@end
@implementation InputBoxPair
@end

@implementation Editbox_impl
{
    //recently there'ill be only 2 elements
    NSMutableDictionary<NSString*, InputBoxPair*>*      textInputDictionnary;
    InputBoxPair*                                       curView;
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
- (UIBarButtonItem*) setInputWidthOf: (UIToolbar*)toolbar{
    CGFloat totalItemsWidth = ITEM_MARGIN_WIDTH;
    UIBarButtonItem *textViewBarButtonItem;
    UIView *view;
    for (UIBarButtonItem *barButtonItem in toolbar.items) {
        if ((view = [barButtonItem valueForKey:@"view"])) {
            if ([view isKindOfClass:[UITextView class]] || [view isKindOfClass:[UITextField class]]) {
                textViewBarButtonItem = barButtonItem;
            } else if (view.bounds.size.width > 0) {
                // Docs say width can be negative for variable size items
                totalItemsWidth += view.frame.size.width + ITEM_MARGIN_WIDTH;
            }
        } else {
            totalItemsWidth += barButtonItem.width + ITEM_MARGIN_WIDTH;
        }
        totalItemsWidth += ITEM_MARGIN_WIDTH;
    }
    [[textViewBarButtonItem customView]
        setFrame:CGRectMake(0,
                            0,
                            getSafeAreaRect().size.width - totalItemsWidth,
                            getTextInputHeight())];
    return textViewBarButtonItem;
}
- (void) addInputAccessoryViewForTextView: (InputBoxPair*)inputbox
                                     with:(const cc::EditBox::ShowInfo*)showInfo{
    CGRect safeView = getSafeAreaRect();
    UIToolbar* toolbar = [[UIToolbar alloc]
                          initWithFrame:CGRectMake(0,
                                                   0,
                                                   safeView.size.width,
                                                   getTextInputHeight() + ITEM_MARGIN_HEIGHT)];
    [toolbar setBackgroundColor:[UIColor darkGrayColor]];
    
    UITextView* textView = [[UITextView alloc] init];
    textView.textColor = [UIColor blackColor];
    textView.backgroundColor = [UIColor whiteColor];
    textView.layer.cornerRadius = 5.0;
    textView.clipsToBounds = YES;
    textView.text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    TextViewDelegate* delegate = [[TextViewDelegate alloc] initWithPairs:[inputbox inputOnView] and:textView];
    textView.delegate = delegate;
    UIBarButtonItem *textViewItem = [[UIBarButtonItem alloc] initWithCustomView:textView];
    
    if (!btnHandler){
        btnHandler = [[ButtonHandler alloc] init];
    }
    UIButton *confirmBtn = [[UIButton alloc]
                            initWithFrame:CGRectMake(0,
                                                     0,
                                                     BUTTON_WIDTH,
                                                     BUTTON_HEIGHT)];
    [confirmBtn addTarget:btnHandler
                   action:@selector(buttonTapped:)
         forControlEvents:UIControlEventTouchUpInside];
    [confirmBtn setTitle:[NSString stringWithUTF8String:showInfo->confirmType.c_str()]
             forState:UIControlStateNormal];
    [confirmBtn setTitleColor:[UIColor systemBlueColor]
                  forState:UIControlStateNormal];
    [confirmBtn setTitleColor:[UIColor darkTextColor]
                  forState:UIControlStateHighlighted]; // Hight light state triggered when the button is tapped.
    UIBarButtonItem *confirm = [[UIBarButtonItem alloc]initWithCustomView:confirmBtn];
    
    [toolbar setItems:@[textViewItem, confirm] animated:YES];
    UIBarButtonItem* textViewBarButtonItem = [self setInputWidthOf:toolbar];
    ((UITextView*)[inputbox inputOnView]).inputAccessoryView = toolbar;
    
    [inputbox setInputOnToolbar:textViewBarButtonItem.customView];
    
}
- (void) addInputAccessoryViewForTextField: (InputBoxPair*)inputbox
                                      with: (const cc::EditBox::ShowInfo*)showInfo{
    CGRect safeView = getSafeAreaRect();
    UIToolbar* toolbar = [[UIToolbar alloc]
                          initWithFrame:CGRectMake(0,
                                                   0,
                                                   safeView.size.width,
                                                   TEXT_LINE_HEIGHT + ITEM_MARGIN_HEIGHT)];
    [toolbar setBackgroundColor:[UIColor darkGrayColor]];
    
    UITextField* textField = [[UITextField alloc] init];
    textField.borderStyle = UITextBorderStyleRoundedRect;
    textField.textColor = [UIColor blackColor];
    textField.backgroundColor = [UIColor whiteColor];
    textField.text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    TextFieldDelegate* delegate = [[TextFieldDelegate alloc] initWithPairs:[inputbox inputOnView] and:textField];
    textField.delegate = delegate;
    [textField addTarget:delegate action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
    UIBarButtonItem *textFieldItem = [[UIBarButtonItem alloc] initWithCustomView:textField];
    
    if (!btnHandler){
        btnHandler = [[ButtonHandler alloc] init];
    }
    UIButton *confirmBtn = [[UIButton alloc]
                            initWithFrame:CGRectMake(0,
                                                     0,
                                                     BUTTON_WIDTH,
                                                     BUTTON_HEIGHT)];
    [confirmBtn addTarget:btnHandler
                   action:@selector(buttonTapped:)
         forControlEvents:UIControlEventTouchUpInside];
    [confirmBtn setTitle:[NSString stringWithUTF8String:showInfo->confirmType.c_str()]
             forState:UIControlStateNormal];
    [confirmBtn setTitleColor:[UIColor systemBlueColor]
                  forState:UIControlStateNormal];
    [confirmBtn setTitleColor:[UIColor darkTextColor]
                  forState:UIControlStateHighlighted]; // Hight light state triggered when the button is tapped.
    UIBarButtonItem *confirm = [[UIBarButtonItem alloc]initWithCustomView:confirmBtn];
    
    [toolbar setItems:@[textFieldItem, confirm] animated:YES];
    
    
    UIBarButtonItem* textFieldBarButtonItem = [self setInputWidthOf:toolbar];
    ((UITextField*)[inputbox inputOnView]).inputAccessoryView = toolbar;
    [inputbox setInputOnToolbar:textFieldBarButtonItem.customView];
}

- (id) createTextView:    (const cc::EditBox::ShowInfo *)showInfo {
    InputBoxPair* ret;
    // Visible view rect size of phone
    CGRect viewRect = UIApplication.sharedApplication.delegate.window.rootViewController.view.frame;
    
    //TODO: object for key with real hash value
    NSString* hash = getHash(showInfo);
    
    if ((ret = [textInputDictionnary objectForKey:hash])) {
        [[ret inputOnView] setFrame:CGRectMake(showInfo->x,
                                 viewRect.size.height - showInfo->y - showInfo->height,
                                 showInfo->width,
                                 showInfo->height)];
    } else {
        ret = [[InputBoxPair alloc] init];
        [ret setInputOnView:[[UITextView alloc]
               initWithFrame:CGRectMake(showInfo->x,
                                        viewRect.size.height - showInfo->y - showInfo->height,
                                        showInfo->width,
                                        showInfo->height)]];
        [textInputDictionnary setValue:ret forKey:hash];
        [self addInputAccessoryViewForTextView:ret with:showInfo];
    }
    ((UITextView*)[ret inputOnToolbar]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    ((UITextView*)[ret inputOnView]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    return ret;
}
- (id) createTextField:    (const cc::EditBox::ShowInfo*)showInfo {
    InputBoxPair* ret;
    CGRect viewRect = UIApplication.sharedApplication.delegate.window.rootViewController.view.frame;
    
    //TODO: object for key with real hash value
    NSString* hash = getHash(showInfo);
    
    if ((ret = [textInputDictionnary objectForKey:hash])) {
        [[ret inputOnView] setFrame:CGRectMake(showInfo->x,
                                 viewRect.size.height - showInfo->y - showInfo->height,
                                 showInfo->width,
                                 showInfo->height)];
    } else {
        ret = [[InputBoxPair alloc] init];
        [ret setInputOnView:[[UITextField alloc]
                initWithFrame:CGRectMake(showInfo->x,
                                         viewRect.size.height - showInfo->y - showInfo->height,
                                         showInfo->width,
                                         showInfo->height)]];
        [textInputDictionnary setValue:ret forKey:hash];
        [self addInputAccessoryViewForTextField:ret with:showInfo];
    }
    ((UITextField*)[ret inputOnToolbar]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    ((UITextField*)[ret inputOnView]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    setTextFieldReturnType((UITextField*)[ret inputOnToolbar], showInfo->confirmType);
    setTextFieldKeyboardType((UITextField*)[ret inputOnToolbar], showInfo->inputType);
    return ret;
}


- (void) show: (const cc::EditBox::ShowInfo*)showInfo {
    g_maxLength = showInfo->maxLength;
    g_isMultiline = showInfo->isMultiline;
    
    if (showInfo->isMultiline) {
        curView = [self createTextView:showInfo];
    } else {
        curView = [self createTextField:showInfo];
    }
    [[curView inputOnView] setHidden:INPUTBOX_HIDDEN];
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    
    [view addSubview:[curView inputOnView]];
    [[curView inputOnView] becomeFirstResponder];
    [[curView inputOnToolbar] becomeFirstResponder];
}
- (void) hide {
    //TODO: I'm not so sure about what should be hide here.
    [[curView inputOnView]becomeFirstResponder];
    [[curView inputOnView] removeFromSuperview];
    [[curView inputOnToolbar] resignFirstResponder];
    [[curView inputOnView] resignFirstResponder];
}

- (InputBoxPair*) getCurrentViewInUse {
    return curView;
}
- (NSString*) getCurrentText {
    if (g_isMultiline)
        return [(UITextView*)[curView inputOnToolbar] text];
    return [(UITextField*)[curView inputOnToolbar] text];
}


@end
@implementation ButtonHandler
- (IBAction)buttonTapped:(UIButton *)button {
    const std::string text([[[Editbox_impl sharedInstance]getCurrentText] UTF8String]);
    callJSFunc("confirm", text);
    cc::EditBox::complete();
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
    EditBox::_isShown = true;
}

void EditBox::hide() {
    [[Editbox_impl sharedInstance] hide];
    EditBox::_isShown = true;
}

bool EditBox::complete() {
    if(!EditBox::_isShown)
        return;
    NSString *text = [[Editbox_impl sharedInstance] getCurrentText];
    callJSFunc("complete", [text UTF8String]);
    EditBox::hide();

    return true;
}
} // namespace cc
