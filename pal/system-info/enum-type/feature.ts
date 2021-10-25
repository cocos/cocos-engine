export enum Feature {
    /**
     * @en Feature to support Webp.
     * @zh 是否支持 Webp 特性。
     */
    WEBP = 'WEBP',
    /**
     * @en Feature to support Image Bitmap.
     * @zh 是否支持 Image Bitmap 特性。
     */
    IMAGE_BITMAP = 'IMAGE_BITMAP',
    /**
     * @en Feature to support Web View.
     * @zh 是否支持 Web View 特性。
     */
    WEB_VIEW = 'WEB_VIEW',
    /**
     * @en Feature to support Video Player.
     * @zh 是否支持 Video Player 特性。
     */
    VIDEO_PLAYER = 'VIDEO_PLAYER',
    /**
     * @en Feature to support Safe Area.
     * @zh 是否支持 Safe Area 特性。
     */
    SAFE_AREA = 'SAFE_AREA',

    /**
     * @en Feature to support Touch Input.
     * Touch Input is only supported on some devices with touch screen.
     * This feature tells that whether the device has a touch screen.
     * @zh 是否支持触摸输入。
     * 触摸输入只在一些带触摸屏的设备上支持。
     * 这个特性旨在说明设备上是否带触摸屏。
     */
    INPUT_TOUCH = 'INPUT_TOUCH',
    /**
     * @en Feature to support dispatching EventKeyboard.
     * @zh 是否支持派发 EventKeyboard。
     */
    EVENT_KEYBOARD = 'EVENT_KEYBOARD',
    /**
     * @en Feature to support dispatching EventMouse.
     * @zh 是否支持派发 EventMouse。
     */
    EVENT_MOUSE = 'EVENT_MOUSE',
    /**
     * @en Feature to support dispatching EventTouch.
     * On some devices without touch screen, we still can simulate dispatching EventTouch from EventMouse.
     * @zh 是否支持派发 EventTouch。
     * 在一些不带触摸屏的设备上，我们仍然会从 EventMouse 模拟派发 EventTouch。
     */
    EVENT_TOUCH = 'EVENT_TOUCH',
    /**
     * @en Feature to support dispatching EventAcceleration.
     * @zh 是否支持派发 EventAcceleration。
     */
    EVENT_ACCELEROMETER = 'EVENT_ACCELEROMETER',
}
