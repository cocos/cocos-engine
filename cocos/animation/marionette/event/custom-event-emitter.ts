/**
 * Animation graph custom event emitter interface.
 *
 * This interface is served as the middleware between controller component and graph evaluation.
 */
export interface AnimationGraphCustomEventEmitter {
    /**
     * Emits a custom event.
     * @param eventName Name of the custom event.
     */
    emit(eventName: string): void;
}
