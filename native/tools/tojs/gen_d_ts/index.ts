
import fs from 'fs';
import path from 'path';

const dir = path.normalize(path.join(__dirname, '../../../../cocos/bindings/auto'));
const jsonFiles = fs.readdirSync(dir).filter(x => x.endsWith('.json')).map(x => path.join(dir, x));
const outFilePath = path.join(__dirname, 'jsb_auto.d.ts');
let copyTo = path.normalize(path.join(__dirname, '../../../../../engine/@types/jsb.auto.d.ts'));
const copyFiles: string[] = [path.join(__dirname, '../decl/predefine.d.ts'), outFilePath];

if(process.argv.length >= 3) {
    const argv = process.argv;
    if( !fs.existsSync(path.join(argv[2], '@types'))) {
        console.error(`Directory '${argv[2]}/@types' does not exists, not a engine path?`);
        process.exit(-2);
    }
    copyTo = path.join(argv[2], '@types/jsb.auto.d.ts');
}


const outFile = fs.openSync(outFilePath, 'w');
const exportNamespaces = ['gfx', 'cc', 'jsb', 'nr'];

let all_classes: NativeClass[] = [];
for (let f of jsonFiles) {
    console.log(`require ${f}`);
    const content = fs.readFileSync(f).toString();
    if (content.length > 0) {
        all_classes = all_classes.concat(JSON.parse(content));
    }
}

let nameToClass: { [key: string]: NativeClass } = {};
let nsToClass: { [key: string]: NativeClass[] } = {};
let fullNameToClass: { [key: string]: NativeClass } = {};
let enumClassMap: {[key:string]:boolean} ={};


interface TypeRecursive {
    name: string;
    children: TypeRecursive[];
    is_optional?: boolean;
}
namespace utils {

    let additional_type_mape: any = {
        'cc::Vec2': 'jsb.Vec2',
        'cc::Vec3': 'jsb.Vec3',
        'cc::Vec4': 'jsb.Vec4',
        'cc::Mat3': 'jsb.Mat3',
        'cc::Mat4': 'jsb.Mat4',
        'cc::Color': 'jsb.Color',
        'cc::Quaternion':'jsb.Quaternion',
        // 'cc::Que': 'jsb.Mat4',
        'cc::gfx::AccessType': 'number',
        'cc::gfx::DescriptorType':'number',
        'cc::Value': 'any',
        'jsb.Device::MotionValue': 'any',
    }

    function type_string_to_tree(input: string) {
        let stack: TypeRecursive[] = [{ name: 'root', children: [] }];
        let l = input.length;
        let p = 0;
        for (let i = 0; i < l; i++) {
            if (input.charAt(i) === '<') {
                let n = { name: input.slice(p, i).trim(), children: [] };
                stack[stack.length - 1].children.push(n);
                stack.push(n);
                p = i + 1;
            } else if (input.charAt(i) === '>') {
                if (i > p) {
                    let n = { name: input.slice(p, i).trim(), children: [] };
                    stack[stack.length - 1].children.push(n);
                }
                p = i + 1;
                stack.pop();
            } else if (input.charAt(i) === ',') {
                if (i > p) {
                    let n = { name: input.slice(p, i).trim(), children: [] };
                    stack[stack.length - 1].children.push(n);
                }
                p = i + 1;
            }
        }
        if (p < l) {
            stack[stack.length - 1].children.push({ name: input.slice(p, l), children: [] });
        }
        let ret = stack[0].children![0];
        return ret;
    }

    export function parse_type_string(input: string, type_convert: (d: string) => string | undefined): string | undefined {
        const info = type_string_to_tree(input);
        const result = walk_through_type_tree(info, type_convert);
        if (result) return (info.is_optional ? '?: ' : ' : ') + result;
    }

    function onlyUnique(value: string, index: number, self: string[]) {
        return self.indexOf(value) === index;
    }

    function walk_through_type_tree(info: TypeRecursive, type_convert: (d: string) => string | undefined): string | undefined {
        
        if(/(const)?\s*void\s*\*/.test(info.name)) {
            return 'ArrayBuffer';
        }
        if(info.name == 'void') {
            return 'void';
        }
        if (/char\s*\*/.test(info.name)) {
            return 'string';
        }
        if (info.name.startsWith('std::string')) {
            return 'string';
        }
        if (info.name.startsWith('std::optional')) {
            info.is_optional = true;
            return walk_through_type_tree(info.children[0], type_convert);
        }

        if(info.name.startsWith('std::array') && info.children[0].name.indexOf('::') < 0) {
    
            return convert_typed_array(info.children[0].name.match(/(.*)/)!)
        }

        if (info.name.startsWith('std::vector') || info.name.startsWith('std::array')) {
            return walk_through_type_tree(info.children[0], type_convert) + '[]';
        }
        if (info.name.startsWith('std::tuple')) {
            return '[' + info.children.map(x => walk_through_type_tree(x, type_convert)).join(', ') + ']'
        }
        if (info.name.startsWith('std::variant')) {
            return '(' + info.children.map(x => walk_through_type_tree(x, type_convert)).filter(onlyUnique as any).join('|') + ')'
        }
        if (info.name.startsWith('std::unordered_map')) {
            return `{[key:${walk_through_type_tree(info.children[0], type_convert)}]:${walk_through_type_tree(info.children[1], type_convert)}}`;
        }
        if (info.name.startsWith('std::any')) {
            return `any`;
        }
        if (info.name.startsWith('std::map')) {
            return `{[key:${walk_through_type_tree(info.children[0], type_convert)}]:${walk_through_type_tree(info.children[1], type_convert)};}`;
        }
        if (info.name.startsWith('std::shared_ptr')) {
            return walk_through_type_tree(info.children[0], type_convert);
        }
        if (info.name.startsWith('std::monostate')) {
            info.is_optional = true;
            return `undefined`;
        }

        if (/char|int|long|short|float|double/.test(info.name)) {
            return 'number';
        }
        if (/bool/.test(info.name)) {
            return 'boolean';
        }
        if (info.name.startsWith('std::function')) {
            return `AnyFunction`;
        }
        if (info.name.indexOf('TypedArrayTemp') >= 0) {
            return convert_typed_array(info.children[0].name.match(/(.*)/)!)
        }

        if(info.name.indexOf('ArrayBuffer') >= 0) {
            return 'ArrayBuffer';
        }

        if (info.name === 'nowhere') {
            return 'unknown';
        }

        if (info.children.length > 1) {
            throw new Error(`dont know how to handle ${JSON.stringify(info, null, 2)}`);
        }

        return type_convert(info.name);
        // return info.name;
    }


    export function cpptype_to_script_ns(name: string): string | undefined {
        name = name.replace(/(\*|&)/g, '').trim();
        let m = fullNameToClass[name];
        if (m) {
            return `${m.script_ns.replace(/::/g,'.')}`;
        }
        let s = additional_type_mape[name];
        if (s) return s;

        if(enumClassMap[name] && name.indexOf('::') > 0) {
            return `number`;
        }

    }

    function convert_typed_array(r: RegExpMatchArray): string {
        let c = r[1];
        if (/unsigned char/.test(c)) {
            return 'Uint8Array';
        }
        if (/char/.test(c)) {
            return 'Int8Array';
        }
        if (/float/.test(c)) {
            return 'Float32Array';
        }
        if (/double/.test(c)) {
            return 'Float64Array';
        }
        if (/unsigned.*int/.test(c)) {
            return 'Uint32Array';
        }
        if (/unsigned.*short/.test(c)) {
            return 'Uint16Array';
        }
        if (/int/.test(c)) {
            return 'Int32Array';
        }
        if (/short/.test(c)) {
            return 'Int16Array';
        }
        return `Uint32Array /*${c}*/`;
    }

    interface IType {
        script_ns:string;
        is_enum?:boolean;
        namespace_name?:string;
        whole_name?:string;
    }

    export function fix_type_name(t: IType): string {
        let r:string|undefined;
        if(t.namespace_name !== undefined && t.namespace_name.length == 0) {
            r = parse_type_string(t.whole_name!, fallback_step.bind(null, t));
        }else {
            r = parse_type_string(t.script_ns, fallback_step.bind(null, t));
        }
        if (r)
            r = r.trim();
        r = fallback_step(t, r!);
        r = r.replace(/::/g,'.').replace(/\*|&/,'').replace(/^const /,'').trim();
        if (r.startsWith('?:') || r.startsWith(':')) return r;
        return ': ' + r;
    }


    function fallback_step(t: IType, r: string): string {
        if(r.startsWith("const ")) {
            r = r.slice(6);
        }
        let full = cpptype_to_script_ns(r);
        if (full) {
            return full;
        }

        full = cpptype_to_script_ns(t.script_ns);
        if (full) {
            return full;
        }

        {
            let kls = nameToClass[r];
            // treat enum as number
            if (!kls && t.is_enum) {
                return 'number';
            }
            if (!kls && r.startsWith('sp.')) {
                return `unknown /*${t.script_ns}*/`;
            }

            if (kls) {
                return `${kls.script_ns.replace(/::/g, '.')}`;
            }
        }
        return r;
    }

    export function fix_type_name_clean(t: IType) {
        let ret = fix_type_name(t);
        if (ret.startsWith('?: ')) {
            return ret.substr(3);
        }
        if (ret.startsWith(': ')) {
            return ret.substr(2);
        }
        return ret;
    }

    export function fix_type_name_undefined(t: IType) {
        let ret = fix_type_name(t);
        if (ret.startsWith('?: ')) {
            return `undefined|${ret.substr(3)}`;
        }
        if (ret.startsWith(': ')) {
            return ret.substr(2);
        }
        return ret;
    }

    export function addIndent(content: string, spaces: number): string {
        let sp: string = '';
        while (spaces-- > 0) {
            sp += ' ';
        }
        return content.split('\n').map(x => {
            if (!/^\s+$/.test(x)) {
                return `${sp}${x}`;
            } else {
                return x;
            }
        })
            .join('\n');
    }

    export function align(alignment: number) {
        return (3 - (alignment + 3) % 4) + alignment;
    }

    export function alignText(text: string, alignment: number) {
        while (text.length < alignment) {
            text += ' ';
        }
        return text;
    }

    interface RecursiveArray<T> {
        [key: number]: T | RecursiveArray<T>;
        length: number
    }

    function flatMap<T>(data: RecursiveArray<T>, cb: (v: T) => T) {
        let ret: T[] = [];
        flatMapImpl(data, (v: T) => {
            ret.push(cb(v));
        });
        return ret;
    }

    function flatMapImpl<T>(data: RecursiveArray<T>, cb: (v: T) => void) {
        for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof Array) {
                flatMapImpl(data[i] as RecursiveArray<T>, cb);
            } else {
                cb(data[i] as T);
            }
        }
    }

    export function formatComment(comment: string): string[] {
        return flatMap<string>(comment.split(/\<br\/?\>/).map(x => x.split('\n')), x => {
            if (x.startsWith('*--')) {
                return '   ' + x.substr(3);
            }
            if (x.startsWith('*')) {
                return ' ' + x.substr(1);
            }
            if (x.startsWith('--')) {
                return '  ' + x.substr(2);
            }
            return x;
        }).map(x => x.trim()); //.filter(x=> x.length > 0);
    }
}

const UF = utils.fix_type_name;
const UFC = utils.fix_type_name_clean;
const UFU = utils.fix_type_name_undefined;

function processMethod(m: NativeFunction | NativeOverloadedFunction): string[] {
    let overloaded = m as NativeOverloadedFunction;
    let method = m as NativeFunction;
    let name = m.name;
    if (overloaded.implementations) {
        let ret: string[] = [];
        for (let x of overloaded.implementations) {
            ret = ret.concat(processMethod(x));
        }
        return ret;
    } else {
        let tips = method.argumentTips || [];
        let args = method.arguments.map((x, i) => `${tips[i] || ('arg' + i)}${UF(x)}`);//.join(', ');
        if (method.is_constructor) {
            //return [`new (${args}): ${method.current_class_name};`];
            return [`constructor(${args.join(', ')});`];
        }
        const prefix = args.join(', ').indexOf('??') > 0 ? '// ' : '';
        const comment = method.comment.length > 0 ? `/**\n${utils.formatComment(method.comment).map(x => ' * ' + x).join('\n')}\n */\n` : '';
        const static_prefix = method.static ? 'static ' : '';
        let functions:string[] = []; // [`// min_args ${method.min_args} - ${method.arguments.length}`];
        for(let i = method.min_args; i  <= method.arguments.length;i++) {
            functions.push(`${prefix}${static_prefix}${name}(${args.slice(0, i).join(', ')}):${UFU(method.ret_type)}; // ${method.ret_type.namespaced_class_name}`)
        }
        return [`${comment}${functions.join('\n')}`];
    }
}


function processClass(klass: NativeClass): string {
    let buffer: string[] = [];


    const extends_field = klass.parents.length == 0 ? '' :
        `extends ${klass.parents.map(x => UFC({ script_ns: utils.cpptype_to_script_ns(x) || x, is_enum: false, namespace_name:"???" }))} `;

    buffer.push('\n');

    const sub_classes = all_classes.filter(x => (x.nested_classes[0] == klass.class_name) && x.nested_classes[0]);
    if (sub_classes.length > 0) {
        buffer.push(`export namespace ${klass.class_name} {`);
        buffer.push(utils.addIndent(sub_classes.map(processClass).join('\n'), 4));
        buffer.push('} // endof namespace ${klass.class_name} \n');
    }
    buffer.push(`// ts : ${klass.script_ns}\n// cpp: ${klass.namespaced_class_name}`);
    buffer.push(`export class ${klass.class_name} ${extends_field}{`);


    // if(klass.namespaced_class_name.indexOf("DrawInfo") >=0 ){
    // console.log(`attributes ${klass.getter_setter.map(x=>x.name)}`);
    // }



    if (klass.getter_setter.length > 0) {
        //export attributes
        {
            let attrBuffer: string[] = [];
            attrBuffer.push(`// attributes list`);
            let maxLeft = 0;
            let maxMiddle = 0;
            let lines: [string, string, string][] = [];
            for (let attr of klass.getter_setter) {
                for (let name of attr.names) {
                    let p: [string, string, string] = [`${name}`, `${UF(attr.type)};`, `// ${attr.type.namespaced_class_name}`];
                    maxLeft = Math.max(maxLeft, p[0].length);
                    maxMiddle = Math.max(maxMiddle, p[1].length);
                    lines.push(p);
                }
            }
            let left = utils.align(maxLeft);
            let middle = utils.align(maxMiddle);
            for (let l of lines) {
                attrBuffer.push([utils.alignText(l[0], left), utils.alignText(l[1], middle), l[2]].join(''));
            }

            buffer.push(utils.addIndent(attrBuffer.join('\n'), 4))
        }
    }

    if (klass.public_fields.length > 0) {
        //export attributes
        {
            let attrBuffer: string[] = [];
            attrBuffer.push(`// public_fields list`);
            let maxLeft = 0;
            let maxMiddle = 0;
            let lines: [string, string, string][] = [];
            for (let attr of klass.public_fields) {
                let p: [string, string, string] = [`${attr.is_static?"static ":""}${attr.is_static_const?"readonly ":""}${attr.name}`, `${UF(attr.type)};`, `// ${attr.type.namespaced_class_name}`];
                maxLeft = Math.max(maxLeft, p[0].length);
                maxMiddle = Math.max(maxMiddle, p[1].length);
                lines.push(p);
            }
            let left = utils.align(maxLeft);
            let middle = utils.align(maxMiddle);
            for (let l of lines) {
                attrBuffer.push([utils.alignText(l[0], left), utils.alignText(l[1], middle), l[2]].join(''));
            }

            buffer.push(utils.addIndent(attrBuffer.join('\n'), 4))
        }
    }

    if (Object.keys(klass.static_methods).length > 0) {
        // export methods
        {
            {
                let methodBuffer: string[] = [];
                methodBuffer.push(`// static methods list`);
                for (let attr in klass.static_methods) {
                    const m = klass.static_methods[attr];
                    if (attr.startsWith('operator')) continue;
                    methodBuffer.push(`${processMethod(m).join('\n')}`);
                }
                buffer.push(utils.addIndent(methodBuffer.join('\n'), 4))
            }
        }
    }

    if (Object.keys(klass.methods).length > 0) {
        // export methods
        {
            {
                let methodBuffer: string[] = [];
                methodBuffer.push(`// methods list`);
                for (let attr in klass.methods) {
                    const m = klass.methods[attr];
                    if (attr.startsWith('operator')) continue;
                    methodBuffer.push(`${processMethod(m).join('\n')}`);
                }
                buffer.push(utils.addIndent(methodBuffer.join('\n'), 4))
            }
        }
    }


    buffer.push(`} // endof class ${klass.class_name}`);
    return buffer.join('\n');
}


all_classes.reduce((prev, curr) => {
    let ns = curr.script_ns.split('.');
    if (ns.length > 1) {
        ns.pop();
        prev[ns[0]] = prev[ns[0]] ? prev[ns[0]].concat(curr) : [curr];
    } else {
        console.error(`Skip bad namespace '${curr.script_ns}' from class ${curr.namespaced_class_name}`);
    }
    return prev;
}, nsToClass);


const register_all_enums = (fn :NativeFunction|NativeOverloadedFunction) => {
    let ol = fn as NativeOverloadedFunction;
    let sf = fn as NativeFunction;
    if(ol.implementations) {
        ol.implementations.forEach(x => register_all_enums(x));
    }else{
        if(sf.ret_type && sf.ret_type.is_enum) {
            enumClassMap[sf.ret_type.namespaced_class_name] = true;
        }
        for(let t of sf.arguments) {
            if(t.is_enum) {
                enumClassMap[sf.ret_type.namespaced_class_name] = true;
            }
        }
    }
};

// setup table
all_classes.forEach(kls => {
    nameToClass[kls.script_ns] = kls;
    fullNameToClass[kls.namespaced_class_name] = kls;

    for(let name in kls.methods) {
        register_all_enums(kls.methods[name]);
    }
    for(let name in kls.static_methods) {
        register_all_enums(kls.static_methods[name]);
    }
});




const topBuffer: string[] = [];

for (let ns of exportNamespaces) {
    let klist = nsToClass[ns];
    if (!klist) {
        console.error(`[error] namespace '${ns}' not found!`);
        continue;
    }
    topBuffer.push(`declare namespace ${ns} {`);
    topBuffer.push(utils.addIndent(klist.filter(x => x.nested_classes.length == 0).map(processClass).join('\n'), 4));
    topBuffer.push(`} // endof namespace ${ns}\n`);
}



fs.writeFileSync(outFile, topBuffer.join('\n'));

fs.writeFileSync(outFile, `\n\n\n//  ${all_classes.length} classes process!\n`);

fs.closeSync(outFile);

{
    copyTo = path.normalize(copyTo);
    let finalFile = fs.openSync(copyTo, 'w');
    copyFiles.forEach(arr => fs.writeFileSync(finalFile, fs.readFileSync(arr).toString('utf8')));
    fs.closeSync(finalFile);
    console.log(` -> copy jsb.auto.d.ts to ${copyTo}`)
}
console.log(` -> ${all_classes.length} classes exported`);
