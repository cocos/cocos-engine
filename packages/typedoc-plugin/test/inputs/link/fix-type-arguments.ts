export class A {}

export function test<T extends A>(t: A): Record<string, T> {
    throw 'not impl';
}
