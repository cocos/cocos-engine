import fsExt from 'fs-extra';
import ps from 'path';
import { Config, IConstantConfig, IConstantInfo } from './config-interface';

export type ModeType = 'EDITOR' | 'PREVIEW' | 'BUILD' | 'TEST';
export type PlatformType = 'HTML5' | 'NATIVE' |
        'WECHAT' | 'BAIDU' | 'XIAOMI' | 'ALIPAY' | 'TAOBAO' | 'TAOBAO_MINIGAME' | 'BYTEDANCE' |
        'OPPO' | 'VIVO' | 'HUAWEI' | 'COCOSPLAY' | 'QTT' | 'LINKSURE';
export type InternalFlagType = 'SERVER_MODE' | 'NOT_PACK_PHYSX_LIBS' | 'WEBGPU';
export type PublicFlagType = 'DEBUG' | 'NET_MODE';
export type FlagType = InternalFlagType | PublicFlagType;

export type ValueType = number | boolean;
export interface ConstantOptions {
    mode: ModeType;
    platform: PlatformType;
    flags: Partial<Record<FlagType, ValueType>>;
    /**
     * @experimental
     */
    forceJitValue?: boolean;
}
export type BuildTimeConstants = Record<PlatformType | ModeType | FlagType, ValueType>;
export type CCEnvConstants = Record<PlatformType | ModeType | PublicFlagType, ValueType>;


export class ConstantManager {
    private _engineRoot: string;

    constructor (engineRoot: string) {
        this._engineRoot = engineRoot;
    }

    //#region export string
    public exportDynamicConstants ({
        mode,
        platform,
        flags,
    }: ConstantOptions): string {
        const config = this._getConfig();
        // init helper
        let result = '';
        if (this._hasCCGlobal(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../static/helper-global-exporter.txt'), 'utf8') + '\n';
        }
        if (this._hasDynamic(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../static/helper-dynamic-constants.txt'), 'utf8') + '\n';
        }
        
        // update value
        if (config[mode]) {
            config[mode].value = true;
        } else {
            console.warn(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            console.warn(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType]!;
            if (config[key]) {
                config[key].value = value;
            } else {
                console.warn(`Unknown flag: ${key}`);
            }
        }

        // eval value
        for (const key in config) {
            const info = config[key];
            if (typeof info.value === 'string') {
                info.value = this._evalExpression(info.value, config);
            }
        }

        // generate export content
        for (const key in config) {
            const info = config[key];
            const value = info.value;
            if (info.dynamic || info.internal) {
                continue;
            }
            result += `export const ${key} = ${value};\n`;
            if (info.ccGlobal) {
                result += `tryDefineGlobal('CC_${key}', ${value});\n`
            }
            result += '\n';
        }

        return result;
    }

    public genBuildTimeConstants (options: ConstantOptions): BuildTimeConstants {
        const config = this._getConfig();

        this._applyOptionsToConfig(config, options);

        // generate json object
        const jsonObj: Record<string, ValueType> = {};
        for (const key in config) {
            const info = config[key];
            jsonObj[key] = info.value as ValueType;
        }
        if (typeof options.forceJitValue !== 'undefined') {
            jsonObj['SUPPORT_JIT'] = options.forceJitValue;
        }
        return jsonObj as BuildTimeConstants;
    }

    public genCCEnvConstants (options: ConstantOptions): CCEnvConstants {
        const config = this._getConfig();

        this._applyOptionsToConfig(config, options);

        // generate json object
        const jsonObj: Record<string, ValueType> = {};
        for (const key in config) {
            const info = config[key];
            if (!info.internal) {
                jsonObj[key] = info.value as ValueType;
            }
        }
        return jsonObj as CCEnvConstants;
    }

    public exportStaticConstants ({
        mode,
        platform,
        flags,
        forceJitValue,
    }: ConstantOptions): string {
        const config = this._getConfig();
        // init helper
        let result = '';
        if (this._hasCCGlobal(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../static/helper-global-exporter.txt'), 'utf8') + '\n';
        }

        // update value
        if (config[mode]) {
            config[mode].value = true;
        } else {
            console.warn(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            console.warn(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType]!;
            if (config[key]) {
                config[key].value = value;
            } else {
                console.warn(`Unknown flag: ${key}`);
            }
        }

        // eval value
        for (const key in config) {
            const info = config[key];
            if (typeof info.value === 'string') {
                info.value = this._evalExpression(info.value, config);
            }
        }
        if (typeof forceJitValue !== 'undefined') {
            const info = config['SUPPORT_JIT'];
            info.value = forceJitValue;
        }

        // generate export content
        for (const key in config) {
            const info = config[key];
            const value = info.value;
            result += `export const ${key} = ${value};\n`;
            if (info.ccGlobal) {
                result += `tryDefineGlobal('CC_${key}', ${value});\n`
            }
            result += '\n';
        }

        return result;
    }
    //#endregion export string

    //#region declaration
    public genInternalConstants (): string {
        const config = this._getConfig();

        let result = `declare module 'internal:constants'{\n`;

        for (const name in config) {
            const info = config[name];
            result += this._genConstantDeclaration(name, info);
        }
        result += '}\n';

        return result;
    }

    public genCCEnv (): string {
        const config = this._getConfig();

        let result = `declare module 'cc/env'{\n`;

        for (const name in config) {
            const info = config[name];
            if (info.internal) {
                continue;
            }
            result += this._genConstantDeclaration(name, info);
        }
        result += '}\n';

        return result;
    }
    
    private _genConstantDeclaration (name: string, info: IConstantInfo): string {
        let result = '\t/**\n';
        let comments = info.comment.split('\n');
        for (const comment of comments) {
            result += `\t * ${comment}\n`;
        }
        result += '\t */\n';
        result += `\texport const ${name}: ${info.type};\n\n`
        return result;
    }
    //#endregion declaration

    //#region utils
    private _getConfig (): IConstantConfig {
        const engineConfig =  fsExt.readJsonSync(ps.join(this._engineRoot, './cc.config.json').replace(/\\/g, '/')) as Config;
        const config = engineConfig.constants;

        // init default value
        for (const key in config) {
            const info = config[key];
            if (typeof info.ccGlobal === 'undefined') {
                info.ccGlobal = false;
            }
            if (typeof info.dynamic === 'undefined') {
                info.dynamic = false;
            }
        }
        return config;
    }

    private _hasCCGlobal (config: IConstantConfig) {
        for (let key in config) {
            const info = config[key];
            if (info.ccGlobal) {
                return true;
            }
        }
        return false;
    }

    private _hasDynamic (config: IConstantConfig) {
        for (let key in config) {
            const info = config[key];
            if (info.dynamic) {
                return true;
            }
        }
        return false;
    }

    private _evalExpression (expression: string, config: IConstantConfig): boolean {
        // eval sub expression
        const matchResult = expression.match(/(?<=\$)\w+/g);
        if (matchResult) {
            for (let name of matchResult) {
                const value = config[name].value;
                if (typeof value === 'string') {
                    config[name].value = this._evalExpression(value, config);
                }
            }
        }
        // $EDITOR to $EDITOR.value
        expression = expression.replace(/(?<=\$)(\w+)/g, '$1.value');
        // $EDITOR to $.EDITOR.value
        expression = expression.replace(/\$/g, '$.');
        // do eval
        const evalFn = new Function('$', `return ${expression}`);
        return evalFn(config);
    }

    private _applyOptionsToConfig (config: IConstantConfig, options: ConstantOptions) {
        const { mode, platform, flags } = options;

        // update value
        if (config[mode]) {
            config[mode].value = true;
        } else {
            console.warn(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            console.warn(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType]!;
            if (config[key]) {
                config[key].value = value;
            } else {
                console.warn(`Unknown flag: ${key}`);
            }
        }

        // eval value
        for (const key in config) {
            const info = config[key];
            if (typeof info.value === 'string') {
                info.value = this._evalExpression(info.value, config);
            }
        }
    }
    //#endregion utils
}