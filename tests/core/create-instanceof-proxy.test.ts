import { createInstanceofProxy } from "../../cocos/core/utils/internal";

test(`createInstanceofProxy`, () => {
    const {
        Animal,
        Dog,
        createDog,
    } = createEssentials();

    // Proxies are not callable or newable.
    // @ts-expect-error
    expect(() => new Animal()).toThrowError();
    // @ts-expect-error
    expect(() => new Dog()).toThrowError();

    // `instanceof` should be available.
    const dog = createDog();
    expect(dog).toBeInstanceOf(Dog);
    expect(dog).toBeInstanceOf(Animal);

    function createEssentials() {
        // Original classes.
        class Animal {}
        class Dog extends Animal {}

        // Ways to create instances.
        function createDog() { return new Dog(); }

        // Proxies.
        const AnimalConstructorProxy = createInstanceofProxy(Animal);
        const DogConstructorProxy = createInstanceofProxy(Dog);

        // Expose.
        return {
            Animal: AnimalConstructorProxy,
            Dog: DogConstructorProxy,
            createDog,
        };
    }
});
