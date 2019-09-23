
/**
 * @zh
 * 用任意多个枚举扩展指定的枚举。
 * 此函数的行为等价于返回了一个新的枚举，其成员囊括了所有扩展枚举的成员。
 * 这些扩展枚举的成员必须各不相同（包括成员名和值），否则行为是未定义的。
 * @en
 * Extends an enumeration with arbitray number of enumerations.
 * It behaves like an enumeration having members that is a combination of members of the extended enumerations
 * is returned.
 * These enumerations shall have non-overlaped member names or member values.
 * If not, the behavior is undefined.
 * @param e 被扩展的枚举。
 * @example
 * ```ts
 * enum Apple { apple = 'apple', }
 * enum Pen { pen = 'pen' }
 * // As if `enum ApplePen { apple = 'apple'; pen = 'pen'; }`
 * const ApplePen = extendsEnum(ApplePen);
 * ```
 */
export function extendsEnum<E> (e: E): E;

export function extendsEnum<E, E1> (e: E, e1: E1): E & E1;

export function extendsEnum<E, E1, E2> (e: E, e1: E1, e2: E2): E & E1 & E2;

export function extendsEnum<E, E1, E2, E3> (e: E, e1: E1, e2: E2, e3: E3): E & E1 & E2 & E3;

export function extendsEnum<E> (e: E, ...enums: any[]): any {
    if (CC_DEV) {
        const kvs: PropertyKey[] = [];
        for (const emm of [e, ...enums]) {
            for (const kv of Object.keys(emm)) {
                if (kvs.indexOf(kv) >= 0) {
                    throw new Error(`Violation error: extending enumerations shall have non-overlaped member names or member values`);
                } else {
                    kvs.push(kv);
                }
            }
        }
        
    }
    return Object.assign({}, e, ...enums);
}