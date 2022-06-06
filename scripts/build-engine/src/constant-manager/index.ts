import fsExt from 'fs-extra';
import ps from 'path';
import { IConstantConfig, IConstantInfo } from './config-interface';

type FlagType = 'DEBUG' | 'SERVER_MODE';

interface ConstantOptions {
    mode: 'EDITOR' | 'PREVIEW' | 'BUILD' | 'TEST';
    platform: 'HTML5' | 'NATIVE' |
      'WECHAT' | 'BAIDU' | 'XIAOMI' | 'ALIPAY' | 'BYTEDANCE' |
      'OPPO' | 'VIVO' | 'HUAWEI' | 'COCOSPLAY' | 'QTT' | 'LINKSURE';
    flags: FlagType[];
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
        let result: string = '';
        if (this._hasCCGlobal(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../../static/helper-global-exporter.txt'), 'utf8') + '\n';
        }
        if (this._hasDynamic(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../../static/helper-dynamic-constants.txt'), 'utf8') + '\n';
        }
        
        // update value
        if (config[mode]) {
            config[mode].value = true;
        }
        if (config[platform]) {
            config[platform].value = true;
        }
        for (const flag of flags) {
            if (config[flag]) {
                config[flag].value = true;
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

    public exportStaticConstants ({
        mode,
        platform,
        flags,
    }: ConstantOptions): string {
        const config = this._getConfig();
        // init helper
        let result: string = '';
        if (this._hasCCGlobal(config)) {
            result += fsExt.readFileSync(ps.join(__dirname, '../../static/helper-global-exporter.txt'), 'utf8') + '\n';
        }

        // update value
        if (config[mode]) {
            config[mode].value = true;
        }
        if (config[platform]) {
            config[platform].value = true;
        }
        for (const flag of flags) {
            if (config[flag]) {
                config[flag].value = true;
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
        const config =  fsExt.readJsonSync(ps.join(this._engineRoot, './cc.constant.json').replace(/\\/g, '/')) as IConstantConfig;
        delete config['$schema'];
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