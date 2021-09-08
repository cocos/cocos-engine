/**
 * Class designed for UI input box.
 * TODO: add more description for this class
 */
    export class InputBox {
    /**
     * Asynchronously show the UI input box, also show the soft keyboard on mobile.
     */
    public show (): Promise<void>;
    /**
     * Asynchronously hide the UI input box, also hide the soft keyboard on mobile.
     */
    public hide (): Promise<void>;
    /**
     * Register the UI input box change event callback.
     * @param cb
     */
    public onChange (cb: ()=>void);
    /**
     * Register the UI input box complete event callback.
     * @param cb
     */
    public onComplete (cb: ()=>void);
    /**
     * Unregister the UI input box change event callback.
     * @param cb If not specified, all callback would be unregistered.
     */
    public offChange (cb?: ()=>void);
    /**
     * Unregister the UI input box complete event callback.
     * @param cb If not specified, all callback would be unregistered.
     */
    public offComplete (cb?: ()=>void);
}