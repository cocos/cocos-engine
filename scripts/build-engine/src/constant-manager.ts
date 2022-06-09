import fsExt from 'fs-extra';
import ps from 'path';
import { Config, IConstantConfig, IConstantInfo } from './config-interface';

export type ModeType = 'EDITOR' | 'PREVIEW' | 'BUILD' | 'TEST';
export type PlatformType = 'HTML5' | 'NATIVE' |
        'WECHAT' | 'BAIDU' | 'XIAOMI' | 'ALIPAY' | 'BYTEDANCE' |
        'OPPO' | 'VIVO' | 'HUAWEI' | 'COCOSPLAY' | 'QTT' | 'LINKSURE';
export type FlagType = 'DEBUG' | 'SERVER_MODE';

export interface ConstantOptions {
    mode: ModeType;
    platform: PlatformType;
    flags: Partial<Record<FlagType, boolean>>;
}

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
            throw new Error(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            throw new Error(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType] as boolean;
            if (config[key]) {
                config[key].value = value;
            } else {
                throw new Error(`Unknown flag: ${key}`);
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
            if (info.dynamic) {
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

    public genBuildTimeConstants ({
        mode,
        platform,
        flags,
    }: ConstantOptions): Record<string, boolean> {
        const config = this._getConfig();

        // update value
        if (config[mode]) {
            config[mode].value = true;
        } else {
            throw new Error(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            throw new Error(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType] as boolean;
            if (config[key]) {
                config[key].value = value;
            } else {
                throw new Error(`Unknown flag: ${key}`);
            }
        }

        // eval value
        for (const key in config) {
            const info = config[key];
            if (typeof info.value === 'string') {
                info.value = this._evalExpression(info.value, config);
            }
        }

        // generate json object
        const jsonObj: Record<string, boolean> = {};
        for (const key in config) {
            const info = config[key];
            jsonObj[key] = info.value as boolean;
        }
        return jsonObj;
    }

    public exportStaticConstants ({
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

        // update value
        if (config[mode]) {
            config[mode].value = true;
        } else {
            throw new Error(`Unknown mode: ${mode}`);
        }
        if (config[platform]) {
            config[platform].value = true;
        } else {
            throw new Error(`Unknown platform: ${platform}`);
        }
        for (const key in flags) {
            const value = flags[key as FlagType] as boolean;
            if (config[key]) {
                config[key].value = value;
            } else {
                throw new Error(`Unknown flag: ${key}`);
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
    public generateInternalConstants (): string {
        const config = this._getConfig();

        let result = `declare module 'internal:constants'{\n`;

        for (const name in config) {
            const info = config[name];
            result += this._generateConstantDeclaration(name, info);
        }
        result += '}\n';

        return result;
    }

    public generateCCEnv (): string {
        const config = this._getConfig();

        let result = `declare module 'cc/env'{\n`;

        for (const name in config) {
            const info = config[name];
            if (info.internal) {
                continue;
            }
            result += this._generateConstantDeclaration(name, info);
        }
        result += '}\n';

        return result;
    }
    
    private _generateConstantDeclaration (name: string, info: IConstantInfo): string {
        let result = '\t/**\n';
        let comments = info.comment.split('\n');
        for (const comment of comments) {
            result += `\t * ${comment}\n`;
        }
        result += '\t */\n';
        result += `\texport const ${name}: boolean;\n\n`
        return result;
    }
    //#endregion declaration

    //#region utils
    private _getConfig (): IConstantConfig {
        const engineConfig =  fsExt.readJsonSync(ps.join(this._engineRoot, './cc.config.json').replace(/\\/g, '/')) as Config;
        const config = engineConfig.constants;
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
    //#endregion utils
}