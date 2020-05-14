/**
 * @hidden
 */

import { IGFXColor } from "./gfx";
import { clamp01 } from "./math";
import { easing } from "./animation";
import { macro } from "./platform";
import { sys } from "./platform/sys";
import { COCOSPLAY, XIAOMI, JSB, ALIPAY } from 'internal:constants';
import { legacyCC } from './global-exports';

type SplashEffectType = 'none' | 'Fade-InOut';

interface ISplashSetting {
    readonly totalTime: number;
    readonly base64src: string;
    readonly effect: SplashEffectType;
    readonly clearColor: IGFXColor;
    readonly displayRatio: number;
    readonly displayWatermark: boolean;
}

function createShader (gl: WebGLRenderingContext, type: number, source: string) {
    let shader = gl.createShader(type);
    if (!shader) {
        console.error('create shader error', source);
        return;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.error('compile shader error', shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

function createProgram (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (!program) {
        console.error('create program error');
        return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.error('link program error', success);
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}

const vs = "precision mediump float;attribute vec2 a_position;attribute vec2 a_texCoord;uniform vec2 u_resolution;uniform mat3 u_worldMat;varying vec2 v_texCoord;void main() {vec3 wpos = u_worldMat * vec3(a_position, 1.0);vec2 clipSpace = wpos.xy / u_resolution * 2.0 - 1.0;gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);v_texCoord = a_texCoord;}";
const fs = "precision mediump float;uniform float u_alpha;uniform sampler2D u_image;varying vec2 v_texCoord;void main(){gl_FragColor = texture2D(u_image,v_texCoord);gl_FragColor.xyz *= clamp(u_alpha, 0.0, 1.0);}";

export class SplashScreenWebgl {

    private gl!: WebGLRenderingContext;
    private program!: WebGLProgram;
    private vertexShader!: WebGLShader;
    private fragmentShader!: WebGLShader;
    private positionBuffer!: WebGLBuffer;
    private texcoordBuffer!: WebGLBuffer;
    private textureLogo!: WebGLTexture;
    private textureText!: WebGLTexture;

    private logoImage = new Image();
    private textImage: HTMLCanvasElement = document.createElement('canvas');

    private vertices = new Float32Array([-1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1]);
    private texcoords = new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);
    private logoMat33 = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    private textMat33 = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);


    private setting!: ISplashSetting;
    private callBack: Function | null = null;
    private cancelAnimate = false;
    private handle = -1;
    private startTime = -1;

    private _isStart = false;
    private _directCall = false;
    private _splashFinish = false;
    private _loadFinish = false;

    public set loadFinish (v: boolean) {
        this._loadFinish = v;
        this._tryToStart();
    }

    private set splashFinish (v: boolean) {
        this._splashFinish = v;
        this._tryToStart();
    }

    private _tryToStart () {
        if (this._splashFinish && this._loadFinish) {
            if (this.callBack) {
                this.cancelAnimate = true;
                cancelAnimationFrame(this.handle);
                this.destroy();
                this.callBack();
            }
        }
    }

    public setOnFinish (cb: Function) {
        if ((!this._isStart || this._directCall) && cb) {
            delete SplashScreenWebgl._ins;
            return cb();
        }
        this.callBack = cb;
    }

    public main (canvas: HTMLCanvasElement) {
        if (window._CCSettings && window._CCSettings.splashScreen) {
            this.setting = window._CCSettings.splashScreen;
            (this.setting.totalTime as number) = this.setting.totalTime != null ? this.setting.totalTime : 3000;
            (this.setting.base64src as string) = this.setting.base64src != null ? this.setting.base64src : '';
            (this.setting.effect as SplashEffectType) = this.setting.effect != null ? this.setting.effect : 'Fade-InOut';
            (this.setting.clearColor as IGFXColor) = this.setting.clearColor != null ? this.setting.clearColor : { r: 0.88, g: 0.88, b: 0.88, a: 1.0 };
            (this.setting.displayRatio as number) = this.setting.displayRatio != null ? this.setting.displayRatio : 0.4;
            (this.setting.displayWatermark as boolean) = this.setting.displayWatermark != null ? this.setting.displayWatermark : true;
        } else {
            this.setting = {
                totalTime: 3000,
                base64src: '',
                effect: 'Fade-InOut',
                clearColor: { r: 0.88, g: 0.88, b: 0.88, a: 1.0 },
                displayRatio: 0.4,
                displayWatermark: true
            };
        }

        if (canvas == null || this.setting.base64src == '' || this.setting.totalTime <= 0) {
            if (this.callBack) { this.callBack(); }
            this.callBack = null;
            (this.setting as any) = null;
            this._directCall = true;
            return;
        } else {
            legacyCC.view.enableRetina(true);
            const designRes = window._CCSettings.designResolution;
            if (designRes) {
                legacyCC.view.setDesignResolutionSize(designRes.width, designRes.height, designRes.policy);
            } else {
                legacyCC.view.setDesignResolutionSize(960, 640, 4);
            }

            let useWebGL2 = (!!window.WebGL2RenderingContext);
            const userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1
                || sys.browserType === sys.BROWSER_TYPE_UC // UC browser implementation doesn't not conform to WebGL2 standard
            ) {
                useWebGL2 = false;
            }

            const webGLCtxAttribs: WebGLContextAttributes = {
                alpha: macro.ENABLE_TRANSPARENT_CANVAS,
                antialias: true,
                depth: true,
                stencil: true,
                premultipliedAlpha: true,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
            };

            let gl: WebGLRenderingContext | null = null;
            let gl2: WebGL2RenderingContext | null = null;
            if (useWebGL2 && legacyCC.WebGL2GFXDevice) {
                gl2 = canvas.getContext('webgl2', webGLCtxAttribs) as WebGL2RenderingContext;
                if (gl2 == null) {
                    gl = canvas.getContext('webgl', webGLCtxAttribs) as WebGLRenderingContext;
                }
            } else {
                gl = canvas.getContext('webgl', webGLCtxAttribs) as WebGLRenderingContext;
            }

            if (gl == null && gl2 == null) {
                return console.error("this device does not support webgl");
            } else {
                if (gl != null) this.gl = gl;
                if (gl2 != null) this.gl = gl2;
            }

            const textImage = this.textImage;
            textImage.width = 330;
            textImage.height = 30;
            textImage.style.width = `${textImage.width}`;
            textImage.style.height = `${textImage.height}`;

            const ctx = textImage.getContext('2d')!;
            ctx.font = `${18}px Arial`
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillStyle = '`#424242`';
            const text = "Powered by Cocos Creator 3D";
            const textMetrics = ctx.measureText(text);
            ctx.fillText(text, (330 - textMetrics.width) / 2, 6);

            this.logoImage.onload = this.init.bind(this);
            this.logoImage.src = this.setting.base64src;

            this._isStart = true;
        }
    }

    private init () {
        // adapt for native mac & ios
        if (JSB) {
            if (sys.os == legacyCC.sys.OS_OSX || sys.os == legacyCC.sys.OS_IOS) {
                this.gl.canvas.width = screen.width * devicePixelRatio;
                this.gl.canvas.height = screen.height * devicePixelRatio;
            }
        }

        // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong
        if (COCOSPLAY || XIAOMI) {
            if (window._CCSettings.orientation === 'landscape' && this.gl.canvas.width < this.gl.canvas.height) {
                let width = this.gl.canvas.height;
                let height = this.gl.canvas.width;
                this.gl.canvas.width = width;
                this.gl.canvas.height = height;
            }
        }

        // adapt for alipay, adjust the canvas size
        if (ALIPAY) {
            const w = screen.width;
            this.gl.canvas.width = w;
            const h = screen.height;
            this.gl.canvas.height = h;
        }

        this.initMatrix();
        this.initProgram();
        this.initBuffer();
        this.initTexture();
        this.initState();

        const that = this;
        const animate = (time: number) => {
            if (this.cancelAnimate) { return; }
            that.frame(time);
            requestAnimationFrame(animate);
        }
        this.handle = requestAnimationFrame(animate);
    }

    private initMatrix () {
        const screenWidth = this.gl.canvas.width;
        const screenHeight = this.gl.canvas.height;
        const displayRatio = this.setting.displayRatio;
        let logoW = this.logoImage.width / 2;
        let logoH = this.logoImage.height / 2;
        let textW = this.textImage.width / 2;
        let textH = this.textImage.height / 2;
        if (screenWidth < screenHeight) {
            logoW = screenWidth / 2 * displayRatio;
            logoH = logoW / (this.logoImage.width / this.logoImage.height);
            textW = screenWidth / 2 * 0.5;
            textH = textW / (this.textImage.width / this.textImage.height);
        } else {
            logoW = screenHeight / 2 * displayRatio;
            logoH = logoW / (this.logoImage.width / this.logoImage.height);
            textW = screenHeight / 2 * 0.5;
            textH = textW / (this.textImage.width / this.textImage.height);
        }

        this.logoMat33[0] = logoW;
        this.logoMat33[4] = logoH;
        this.logoMat33[6] = screenWidth / 2;
        this.logoMat33[7] = screenHeight / 2;

        this.textMat33[0] = textW;
        this.textMat33[4] = textH;
        this.textMat33[6] = screenWidth / 2;
        this.textMat33[7] = screenHeight * 0.9;
    }

    private initProgram () {
        const gl = this.gl;
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)!;
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)!;
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader)!;
    }

    private initBuffer () {
        const gl = this.gl;
        gl.useProgram(this.program);

        this.positionBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        this.texcoordBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texcoords, gl.STATIC_DRAW);

        var positionLocation = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        var texcoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    }

    private initTexture () {
        const gl = this.gl;

        this.textureLogo = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.textureLogo);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.logoImage);

        this.textureText = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.textureText);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textImage);
    }

    private initState () {
        const gl = this.gl;
        gl.useProgram(this.program);

        var resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    private frame (time: number) {
        const gl = this.gl;
        const program = this.program;
        const textureLogo = this.textureLogo;
        const textureText = this.textureText;
        const clearColor = this.setting.clearColor;
        const logoMat33 = this.logoMat33;
        const textMat33 = this.textMat33;

        if (this.startTime < 0) { this.startTime = time; }
        const elapsedTime = time - this.startTime;
        const precent = clamp01(elapsedTime / this.setting.totalTime);
        const alpha = easing.cubicOut(precent);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong
        if (COCOSPLAY || XIAOMI) {
            if (window._CCSettings.orientation === 'landscape' && this.gl.canvas.width < this.gl.canvas.height) {
                let width = this.gl.canvas.height;
                let height = this.gl.canvas.width;
                this.gl.canvas.width = width;
                this.gl.canvas.height = height;
            }
        }

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        gl.depthMask(true);
        gl.clearDepth(1);
        gl.clearStencil(0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        gl.useProgram(this.program);

        var resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        let location = gl.getUniformLocation(program, "u_alpha");
        gl.uniform1f(location, alpha);

        location = gl.getUniformLocation(program, "u_worldMat");

        gl.uniformMatrix3fv(location, false, logoMat33);
        gl.bindTexture(gl.TEXTURE_2D, textureLogo);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (this.setting.displayWatermark) {
            gl.uniformMatrix3fv(location, false, textMat33);
            gl.bindTexture(gl.TEXTURE_2D, textureText);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        if (elapsedTime > this.setting.totalTime) {
            this.splashFinish = true;
        }
    }

    private destroy () {
        delete SplashScreenWebgl._ins;
        this.gl.deleteProgram(this.program);
        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteBuffer(this.positionBuffer);
        this.gl.deleteBuffer(this.texcoordBuffer);
        this.gl.deleteTexture(this.textureLogo);
        this.gl.deleteTexture(this.textureText);
    }

    private static _ins: SplashScreenWebgl;

    public static get instance () {
        if (SplashScreenWebgl._ins == null) {
            SplashScreenWebgl._ins = new SplashScreenWebgl();
        }
        return SplashScreenWebgl._ins;
    }

    private constructor () { };
}

legacyCC.internal.SplashScreenWebgl = SplashScreenWebgl;
