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
#include "engine/EngineEvents.h"
#import <UIKit/UIKit.h>

#define ITEM_MARGIN_WIDTH               10
#define ITEM_MARGIN_HEIGHT              10
#define TEXT_LINE_HEIGHT                40
#define TEXT_VIEW_MAX_LINE_SHOWN        1.5
#define BUTTON_HEIGHT                   (TEXT_LINE_HEIGHT - ITEM_MARGIN_HEIGHT)
#define BUTTON_WIDTH                    60
//TODO: change the proccedure of showing inputbox, possibly become a property
const bool INPUTBOX_HIDDEN = true; // Toggle if Inputbox is visible
/*************************************************************************
 Inner class declarations.
 ************************************************************************/
@interface EditboxManager : NSObject
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
static bool g_isMultiline{false};
static bool g_confirmHold{false};
static int g_maxLength{INT_MAX};
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

int getTextInputHeight(bool isMultiLine) {
    if (isMultiLine)
        return TEXT_LINE_HEIGHT * TEXT_VIEW_MAX_LINE_SHOWN;
    else
        return TEXT_LINE_HEIGHT;
}

void setTextFieldKeyboardType(UITextField *textField, const ccstd::string &inputType) {
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
            viewRect.size.width -= safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.right;
        } else {
            viewRect.origin.x += safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.left;
            viewRect.size.width -= safeAreaInsets.right;
        }
    }

    return viewRect;
}

//TODO: Get hash with different type of showInfo, for example different inputAccessoryView
NSString* getTextInputType(const cc::EditBox::ShowInfo* showInfo) {
    return showInfo->isMultiline?@"textView":@"textField";
}
void onParentViewTouched(const cc::CustomEvent &touchEvent){
    [[EditboxManager sharedInstance] hide];
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
    if (self = [super init]) {
        tViewOnView = inputOnView;
        tViewOnToolbar = inputOnToolbar;
    }
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
    if (textView.text.length > g_maxLength) {
        NSRange rangeIndex = [textView.text rangeOfComposedCharacterSequenceAtIndex:g_maxLength];
        textView.text = [textView.text substringToIndex:rangeIndex.location];
    }
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
    if (self = [super init]) {
        textFieldOnView = inputOnView;
        textFieldOntoolbar = inputOnToolbar;
        
    }
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
@property(readwrite) id inputDelegate;
@end
@implementation InputBoxPair
- (void)dealloc {
    [super dealloc];
    [_inputOnView release];
    [_inputOnToolbar release];
    [_inputDelegate release];
}
@end

@implementation EditboxManager
{
    //recently there'ill be only 2 elements
    NSMutableDictionary<NSString*, InputBoxPair*>*      textInputDictionnary;
    InputBoxPair*                                       curView;

    cc::events::Resize::Listener  resizeListener;
    cc::events::Touch::Listener  touchListener;
    cc::events::Close::Listener  closeListener;
}
static EditboxManager *instance = nil;

+ (instancetype) sharedInstance {
    static dispatch_once_t pred = 0;
    dispatch_once(&pred, ^{
        instance = [[super allocWithZone:NULL] init];
        if (instance == nil) {
            CC_LOG_ERROR("Editbox manager init failed, plz check if you have enough space left");
        }
    });
    return instance;
}
+ (id)allocWithZone:(struct _NSZone*)zone {
    return [EditboxManager sharedInstance];
}

- (id)copyWithZone:(struct _NSZone*)zone {
    return [EditboxManager sharedInstance];
}

- (void)onOrientationChanged{
    cc::EditBox::complete();
}
- (id)init {
    if (self = [super init]) {
        
        textInputDictionnary = [NSMutableDictionary new];
        if (textInputDictionnary == nil) {
            [self release];
            return nil;
        }
        
        resizeListener.bind([&](int /*width*/, int /*height*/ , uint32_t /*windowId*/) {
                [[EditboxManager sharedInstance] onOrientationChanged];
        });
        //"onTouchStart" is a sub event for TouchEvent, so we can only add listener for this sub event rather than TouchEvent itself.
        touchListener.bind([&](const cc::TouchEvent& event) {
            if(event.type == cc::TouchEvent::Type::BEGAN) {
                cc::EditBox::complete();
            }
        });

        closeListener.bind([&]() {
            [[EditboxManager sharedInstance] dealloc];
        });
    }
    return self;
}
- (void)dealloc {
    [textInputDictionnary release];
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
            } else if ([view isKindOfClass:[UIButton class]]) {
                // Docs say width can be negative for variable size items
                totalItemsWidth += BUTTON_WIDTH + ITEM_MARGIN_WIDTH;
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
                            getTextInputHeight(g_isMultiline))];
    return textViewBarButtonItem;
}
- (void) addInputAccessoryViewForTextView: (InputBoxPair*)inputbox
                                     with:(const cc::EditBox::ShowInfo*)showInfo{
    CGRect safeView = getSafeAreaRect();
    UIToolbar* toolbar = [[UIToolbar alloc]
                          initWithFrame:CGRectMake(0,
                                                   0,
                                                   safeView.size.width,
                                                   getTextInputHeight(g_isMultiline) + ITEM_MARGIN_HEIGHT)];
    [toolbar setBackgroundColor:[UIColor darkGrayColor]];
    
    UITextView* textView = [[UITextView alloc] init];
    textView.textColor = [UIColor blackColor];
    textView.backgroundColor = [UIColor whiteColor];
    textView.layer.cornerRadius = 5.0;
    textView.clipsToBounds = YES;
    textView.text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    TextViewDelegate* delegate = [[TextViewDelegate alloc] initWithPairs:[inputbox inputOnView] and:textView];
    inputbox.inputDelegate = delegate;
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
    //release for NON ARC ENV
    [toolbar release];
    [textView release];
    [confirmBtn release];
    [textViewItem release];
    [confirm release];
    
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
    inputbox.inputDelegate = delegate;
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
    
    //release for NON ARC ENV
    [toolbar release];
    [textField release];
    [confirmBtn release];
    [textFieldItem release];
    [confirm release];
}

- (id) createTextView:    (const cc::EditBox::ShowInfo *)showInfo {
    InputBoxPair* ret;
    // Visible view rect size of phone
    CGRect viewRect = UIApplication.sharedApplication.delegate.window.rootViewController.view.frame;
    
    //TODO: object for key with real hash value
    NSString* inputType = getTextInputType(showInfo);
    
    if ((ret = [textInputDictionnary objectForKey:inputType])) {
        [[ret inputOnView] setFrame:CGRectMake(showInfo->x,
                                 viewRect.size.height - showInfo->y - showInfo->height,
                                 showInfo->width,
                                 showInfo->height)];
        CGRect safeArea = getSafeAreaRect();
        [[[ret inputOnView] inputAccessoryView] setFrame:CGRectMake(0,
                                                                           0,
                                                                           safeArea.size.width,
                                                                    getTextInputHeight(g_isMultiline) + ITEM_MARGIN_HEIGHT)];
        [self setInputWidthOf:[[ret inputOnView] inputAccessoryView] ];
    } else {
        ret = [[InputBoxPair alloc] init];
        [ret setInputOnView:[[UITextView alloc]
               initWithFrame:CGRectMake(showInfo->x,
                                        viewRect.size.height - showInfo->y - showInfo->height,
                                        showInfo->width,
                                        showInfo->height)]];
        [textInputDictionnary setValue:ret forKey:inputType];
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
    NSString* inputType = getTextInputType(showInfo);
    
    if ((ret = [textInputDictionnary objectForKey:inputType])) {
        [[ret inputOnView] setFrame:CGRectMake(showInfo->x,
                                 viewRect.size.height - showInfo->y - showInfo->height,
                                 showInfo->width,
                                 showInfo->height)];
        CGRect safeArea = getSafeAreaRect();
        [[[ret inputOnView] inputAccessoryView] setFrame:CGRectMake(0,
                                                                           0,
                                                                    safeArea.size.width,
                                                                    getTextInputHeight(g_isMultiline) + ITEM_MARGIN_HEIGHT)];
        [self setInputWidthOf:[[ret inputOnView] inputAccessoryView] ];
    } else {
        ret = [[InputBoxPair alloc] init];
        [ret setInputOnView:[[UITextField alloc]
                initWithFrame:CGRectMake(showInfo->x,
                                         viewRect.size.height - showInfo->y - showInfo->height,
                                         showInfo->width,
                                         showInfo->height)]];
        [textInputDictionnary setValue:ret forKey:inputType];
        [self addInputAccessoryViewForTextField:ret with:showInfo];
    }
    ((UITextField*)[ret inputOnToolbar]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    ((UITextField*)[ret inputOnView]).text = [NSString stringWithUTF8String:showInfo->defaultValue.c_str()];
    setTextFieldReturnType((UITextField*)[ret inputOnToolbar], showInfo->confirmType);
    setTextFieldReturnType((UITextField*)[ret inputOnView], showInfo->confirmType);
    setTextFieldKeyboardType((UITextField*)[ret inputOnToolbar], showInfo->inputType);
    setTextFieldKeyboardType((UITextField*)[ret inputOnView], showInfo->inputType);
    return ret;
}

//TODO: show inputbox with width modified.
- (void) show: (const cc::EditBox::ShowInfo*)showInfo {
    g_maxLength = showInfo->maxLength;
    g_isMultiline = showInfo->isMultiline;
    g_confirmHold = showInfo->confirmHold;
    
    if (g_isMultiline) {
        curView = [self createTextView:showInfo];
    } else {
        curView = [self createTextField:showInfo];
    }
    [[curView inputOnView] setHidden:INPUTBOX_HIDDEN];
    UIView *view = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    
    [view addSubview:[curView inputOnView]];
    [[curView inputOnView] becomeFirstResponder];
     dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
         if(![[curView inputOnToolbar] becomeFirstResponder]) {
             CC_LOG_ERROR("inputOnToolbar becomeFirstResponder error!");
         }
    });

}
// Change the focus point to the TextField or TextView on the toolbar.
- (void) hide {
   if ([[curView inputOnToolbar] isFirstResponder]) {
       [[curView inputOnToolbar] resignFirstResponder];
   }
   if ([[curView inputOnView] isFirstResponder]) {
       [[curView inputOnView] resignFirstResponder];
   }
   [[curView inputOnView] removeFromSuperview];
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
    const ccstd::string text([[[EditboxManager sharedInstance]getCurrentText] UTF8String]);
    callJSFunc("confirm", text);
    if (!g_confirmHold)
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
    [[EditboxManager sharedInstance] show:&showInfo];
    EditBox::_isShown = true;
}

void EditBox::hide() {
    [[EditboxManager sharedInstance] hide];
    EditBox::_isShown = false;
}

bool EditBox::complete() {
    if(!EditBox::_isShown)
        return false;
    NSString *text = [[EditboxManager sharedInstance] getCurrentText];
    callJSFunc("complete", [text UTF8String]);
    EditBox::hide();

    return true;
}
} // namespace cc
