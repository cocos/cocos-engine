/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
/**
 * !#en Enum for keyboard return types
 * !#zh 键盘的返回键类型
 * @readonly
 * @enum EditBox.KeyboardReturnType
 */
let KeyboardReturnType = cc.Enum({
    /**
     * !#en TODO
     * !#zh 默认
     * @property {Number} DEFAULT
     */
    DEFAULT: 0,
    /**
     * !#en TODO
     * !#zh 完成类型
     * @property {Number} DONE
     */
    DONE: 1,
    /**
     * !#en TODO
     * !#zh 发送类型
     * @property {Number} SEND
     */
    SEND: 2,
    /**
     * !#en TODO
     * !#zh 搜索类型
     * @property {Number} SEARCH
     */
    SEARCH: 3,
    /**
     * !#en TODO
     * !#zh 跳转类型
     * @property {Number} GO
     */
    GO: 4,
    /**
     * !#en TODO
     * !#zh 下一个类型
     * @property {Number} NEXT
     */
    NEXT: 5
});

/**
 * !#en The EditBox's InputMode defines the type of text that the user is allowed to enter.
 * !#zh 输入模式
 * @readonly
 * @enum EditBox.InputMode
 */
let InputMode = cc.Enum({
    /**
     * !#en TODO
     * !#zh 用户可以输入任何文本，包括换行符。
     * @property {Number} ANY
     */
    ANY: 0,
    /**
     * !#en The user is allowed to enter an e-mail address.
     * !#zh 允许用户输入一个电子邮件地址。
     * @property {Number} EMAIL_ADDR
     */
    EMAIL_ADDR: 1,
    /**
     * !#en The user is allowed to enter an integer value.
     * !#zh 允许用户输入一个整数值。
     * @property {Number} NUMERIC
     */
    NUMERIC: 2,
    /**
     * !#en The user is allowed to enter a phone number.
     * !#zh 允许用户输入一个电话号码。
     * @property {Number} PHONE_NUMBER
     */
    PHONE_NUMBER: 3,
    /**
     * !#en The user is allowed to enter a URL.
     * !#zh 允许用户输入一个 URL。
     * @property {Number} URL
     */
    URL: 4,
    /**
     * !#en
     * The user is allowed to enter a real number value.
     * This extends kEditBoxInputModeNumeric by allowing a decimal point.
     * !#zh
     * 允许用户输入一个实数。
     * @property {Number} DECIMAL
     */
    DECIMAL: 5,
    /**
     * !#en The user is allowed to enter any text, except for line breaks.
     * !#zh 除了换行符以外，用户可以输入任何文本。
     * @property {Number} SINGLE_LINE
     */
    SINGLE_LINE: 6
});

/**
 * !#en Enum for the EditBox's input flags
 * !#zh 定义了一些用于设置文本显示和文本格式化的标志位。
 * @readonly
 * @enum EditBox.InputFlag
 */
let InputFlag = cc.Enum({
    /**
     * !#en
     * Indicates that the text entered is confidential data that should be
     * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
     * !#zh
     * 表明输入的文本是保密的数据，任何时候都应该隐藏起来，它隐含了 EDIT_BOX_INPUT_FLAG_SENSITIVE。
     * @property {Number} PASSWORD
     */
    PASSWORD: 0,
    /**
     * !#en
     * Indicates that the text entered is sensitive data that the
     * implementation must never store into a dictionary or table for use
     * in predictive, auto-completing, or other accelerated input schemes.
     * A credit card number is an example of sensitive data.
     * !#zh
     * 表明输入的文本是敏感数据，它禁止存储到字典或表里面，也不能用来自动补全和提示用户输入。
     * 一个信用卡号码就是一个敏感数据的例子。
     * @property {Number} SENSITIVE
     */
    SENSITIVE: 1,
    /**
     * !#en
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each word should be capitalized.
     * !#zh
     *  这个标志用来指定在文本编辑的时候，是否把每一个单词的首字母大写。
     * @property {Number} INITIAL_CAPS_WORD
     */
    INITIAL_CAPS_WORD: 2,
    /**
     * !#en
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each sentence should be capitalized.
     * !#zh
     * 这个标志用来指定在文本编辑是否每个句子的首字母大写。
     * @property {Number} INITIAL_CAPS_SENTENCE
     */
    INITIAL_CAPS_SENTENCE: 3,
    /**
     * !#en Capitalize all characters automatically.
     * !#zh 自动把输入的所有字符大写。
     * @property {Number} INITIAL_CAPS_ALL_CHARACTERS
     */
    INITIAL_CAPS_ALL_CHARACTERS: 4,
    /**
     * Don't do anything with the input text.
     * @property {Number} DEFAULT
     */
    DEFAULT: 5
});

module.exports = {
    KeyboardReturnType: KeyboardReturnType,
    InputMode: InputMode,
    InputFlag: InputFlag
};
