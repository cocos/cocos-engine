/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Enum } from '../../core/value-types';
/**
 * 键盘的返回键类型。
 * @readonly
 * @enum EditBox.KeyboardReturnType
 */
export enum KeyboardReturnType {
    /**
     * 默认。
     */
    DEFAULT = 0,
    /**
     * 完成类型。
     */
    DONE = 1,
    /**
     * 发送类型。
     */
    SEND = 2,
    /**
     * 搜索类型。
     */
    SEARCH = 3,
    /**
     * 跳转类型。
     */
    GO = 4,
    /**
     * 下一个类型。
     */
    NEXT = 5,
}
Enum(KeyboardReturnType);

/**
 * 输入模式。
 * @readonly
 * @enum EditBox.InputMode
 */
export enum InputMode {
    /**
     * 用户可以输入任何文本，包括换行符。
     */
    ANY = 0,
    /**
     * 允许用户输入一个电子邮件地址。
     */
    EMAIL_ADDR = 1,
    /**
     * 允许用户输入一个整数值。
     */
    NUMERIC = 2,
    /**
     * 允许用户输入一个电话号码。
     */
    PHONE_NUMBER = 3,
    /**
     * 允许用户输入一个 URL。
     */
    URL = 4,
    /**
     * 允许用户输入一个实数。
     */
    DECIMAL = 5,
    /**
     * 除了换行符以外，用户可以输入任何文本。
     */
    SINGLE_LINE = 6,
}

Enum(InputMode);

/**
 * 定义了一些用于设置文本显示和文本格式化的标志位。
 * @readonly
 * @enum EditBox.InputFlag
 */
export enum InputFlag {
    /**
     * 表明输入的文本是保密的数据，任何时候都应该隐藏起来，它隐含了 EDIT_BOX_INPUT_FLAG_SENSITIVE。
     */
    PASSWORD = 0,
    /**
     * 表明输入的文本是敏感数据，它禁止存储到字典或表里面，也不能用来自动补全和提示用户输入。
     * 一个信用卡号码就是一个敏感数据的例子。
     */
    SENSITIVE = 1,
    /**
     * 这个标志用来指定在文本编辑的时候，是否把每一个单词的首字母大写。
     */
    INITIAL_CAPS_WORD = 2,
    /**
     * 这个标志用来指定在文本编辑是否每个句子的首字母大写。
     */
    INITIAL_CAPS_SENTENCE = 3,
    /**
     * 自动把输入的所有字符大写。
     */
    INITIAL_CAPS_ALL_CHARACTERS = 4,
    /**
     * Don't do anything with the input text.
     */
    DEFAULT = 5,
}

Enum(InputFlag);
