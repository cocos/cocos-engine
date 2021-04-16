export class InputBox {
    public support: boolean;

    constructor () {
        this.support =  true;
    }

    show (): Promise<void> {
        throw new Error('Method not implemented.');
    }
    hide (): Promise<void> {
        throw new Error('Method not implemented.');
    }
    onChange () {
        throw new Error('Method not implemented.');
    }
    onComplete () {
        throw new Error('Method not implemented.');
    }
    offChange () {
        throw new Error('Method not implemented.');
    }
    offComplete () {
        throw new Error('Method not implemented.');
    }
}
