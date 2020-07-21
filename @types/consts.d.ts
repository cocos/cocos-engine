
declare module "internal:constants" {
    /**
     * Running in published project.
     */
    export const BUILD: boolean;

    /**
     * Running in the engine's unit test.
     */
    export const TEST: boolean;

    /**
     * Running in the editor.
     */
    export const EDITOR: boolean;

    /**
     * Running in the GameView.
     */
    export const GAME_VIEW: boolean;

    /**
     * Preview in browser or simulator.
     */
    export const PREVIEW: boolean;

    /**
     * Running in the editor or preview.
     */
    export const DEV: boolean;

    /**
     * Running in the editor or preview, or build in debug mode.
     */
    export const DEBUG: boolean;

    /**
     * Running in native platform (mobile app, desktop app, or simulator).
     */
    export const JSB: boolean;

    /**
     * Running in the Wechat's mini game.
     */
    export const WECHAT: boolean;

    /**
     * Running in the alipay's mini game.
     */
    export const ALIPAY: boolean;

    /**
     * Running in the xiaomi's quick game.
     */
    export const XIAOMI: boolean;

    /**
     * Running in the baidu's mini game.
     */
    export const BAIDU: boolean;

    /**
     * Running in the cocosplay.
     */
    export const COCOSPLAY: boolean;

    /**
     * Running in the huawei's quick game.
     */
    export const HUAWEI: boolean;

    /**
     * Running in the oppo's mini game.
     */
    export const OPPO: boolean;

    /**
     * Running in the vivo's mini game.
     */
    export const VIVO: boolean;
    
    /**
     * Running in mini game.
     */
    export const MINIGAME: boolean;

    /**
     * Running in runtime environments.
     */
    export const RUNTIME_BASED: boolean;


    export const SUPPORT_JIT: boolean;
    export const PHYSICS_BUILTIN: boolean;
    export const PHYSICS_CANNON: boolean;
    export const PHYSICS_AMMO: boolean;
}