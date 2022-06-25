import JSDOMEnvironment from 'jest-environment-jsdom';

class Environment extends JSDOMEnvironment {
    constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
        super(...args);

        const promises = this._promises;
        Object.defineProperty(this.global, 'waitThis', {
            get: () => {
                return (promise: Promise<unknown>) => {
                    promises.push(promise);
                };
            },
        });
    }

    async setup(...args: Parameters<JSDOMEnvironment['setup']>) {
        await super.setup(...args);
        await Promise.all(this._promises);
    }

    private _promises: Promise<unknown>[] = [];
}

export default Environment;