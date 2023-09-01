/**
 * @engineInternal
 */
export class Class1 {}

export class Class2 {
    /**
     * @engineInternal
     */
    static testStaticProp: number;
    /**
     * @engineInternal
     */
    static testStaticMdthod() {};
    /**
     * @engineInternal
     */
    get getterSetter (): number { return 1; }
    /**
     * @engineInternal
     */
    set getterSetter (a: number) {}
    /**
     * @engineInternal
     */
    testProp: number;
    /**
     * @engineInternal
     */
    testMethod () {}
}

/**
 * @engineInternal
 */
export const obj1  = {}

export const obj2 = {
    /**
     * @engineInternal
     */
    testProp: 1,
    /**
     * @engineInternal
     */
    testMethod () {},

}

/**
 * @engineInternal
 */
export interface Interface1 {}

export interface Interface2 {
    /**
     * @engineInternal
     */
    testProp: number;
    /**
     * @engineInternal
     */
    testMethod ();    
}

/**
 * @engineInternal
 */
export function testFunc () {}

/**
 * @engineInternal
 */
export enum TestEnum {}