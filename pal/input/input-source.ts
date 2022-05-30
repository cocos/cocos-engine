/*
 Copyright (c) 2022 Chukong Technologies Inc.
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
*/

import { Vec2, Vec3 } from '../../cocos/core/math';

export abstract class InputSource<T> {
    abstract getValue (): T;
}

export class InputSourceAxis1D extends InputSource<number> {
    getValue (): number {
        throw new Error('Method not implemented.');
    }
}

export class InputSourceAxis2D extends InputSource<Vec2> {
    getValue (): Vec2 {
        throw new Error('Method not implemented.');
    }
}

export class InputSourceAxis3D extends InputSource<Vec3> {
    getValue (): Vec3 {
        throw new Error('Method not implemented.');
    }
}

export class CompositeInputSourceAxis1D extends InputSourceAxis1D {
    public positive: InputSourceButton;
    public negative: InputSourceButton;
    constructor (options: {positive: InputSourceButton, negative: InputSourceButton}) {
        super();
        this.positive = options.positive;
        this.negative = options.negative;
    }
    public getValue (): number {
        const positiveValue = this.positive.getValue();
        const negativeValue = this.negative.getValue();
        if (Math.abs(positiveValue) > Math.abs(negativeValue)) {
            return positiveValue;
        }
        return -negativeValue;
    }
}
export class CompositeInputSourceAxis2D extends InputSourceAxis2D {
    public up: InputSourceButton;
    public down: InputSourceButton;
    public left: InputSourceButton;
    public right: InputSourceButton;

    public xAxis: CompositeInputSourceAxis1D;
    public yAxis: CompositeInputSourceAxis1D;
    constructor (options: {up: InputSourceButton, down: InputSourceButton, left: InputSourceButton, right: InputSourceButton}) {
        super();
        this.up = options.up;
        this.down = options.down;
        this.left = options.left;
        this.right = options.right;
        this.xAxis = new CompositeInputSourceAxis1D({ positive: this.right, negative: this.left });
        this.yAxis = new CompositeInputSourceAxis1D({ positive: this.up, negative: this.down });
    }
    getValue (): Vec2 {
        return new Vec2(this.xAxis.getValue(), this.yAxis.getValue());
    }
}
export class CompositeInputSourceAxis3D extends InputSourceAxis3D {
    public up: InputSourceButton;
    public down: InputSourceButton;
    public left: InputSourceButton;
    public right: InputSourceButton;
    public forward: InputSourceButton;
    public backward: InputSourceButton;

    public xAxis: CompositeInputSourceAxis1D;
    public yAxis: CompositeInputSourceAxis1D;
    public zAxis: CompositeInputSourceAxis1D;
    constructor (options: {up: InputSourceButton, down: InputSourceButton, left: InputSourceButton,
        right: InputSourceButton, forward: InputSourceButton, backward: InputSourceButton}) {
        super();
        this.up = options.up;
        this.down = options.down;
        this.left = options.left;
        this.right = options.right;
        this.forward = options.forward;
        this.backward = options.backward;

        this.xAxis = new CompositeInputSourceAxis1D({ positive: this.right, negative: this.left });
        this.yAxis = new CompositeInputSourceAxis1D({ positive: this.up, negative: this.down });
        this.zAxis = new CompositeInputSourceAxis1D({ positive: this.forward, negative: this.backward });
    }

    getValue (): Vec3 {
        return new Vec3(this.xAxis.getValue(), this.yAxis.getValue(), this.zAxis.getValue());
    }
}

export class InputSourceButton extends InputSourceAxis1D {
}

export class InputSourceDpad extends CompositeInputSourceAxis2D {
}

export class InputSourceStick extends CompositeInputSourceAxis2D {
}
