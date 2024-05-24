import UIAbility from '@ohos.app.ability.UIAbility';
import cocos from 'libcocos.so';
import { ContextType } from '../common/Constants';
import window from '@ohos.window';

const nativeContext = cocos.getContext(ContextType.ENGINE_UTILS);
const nativeAppLifecycle = cocos.getContext(ContextType.APP_LIFECYCLE);

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    globalThis.abilityWant = want;
    nativeAppLifecycle.onCreate();
    nativeContext.resourceManagerInit(this.context.resourceManager);
  }

  onDestroy() {
    nativeAppLifecycle.onDestroy();
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    nativeContext.writablePathInit(this.context.cacheDir);

    // Get the Main window instance
    let windowClass = null;
    windowStage.getMainWindow((err, data) => {
      if (err.code) {
        console.error('Failed to obtain the main window. Cause: ' + JSON.stringify(err));
        return;
      }
      windowClass = data;
      console.info('Succeeded in obtaining the main window. Data: ' + JSON.stringify(data));

      // Set the window to a full-screen layout, along with setting whether the navigation bar and status bar are displayed or not, to keep coordinated with the main window display.
      let isLayoutFullScreen = true;
      windowClass.setWindowLayoutFullScreen(isLayoutFullScreen, (err) => {
        if (err.code) {
          console.error('Failed to set the window layout to full-screen mode. Cause: ' + JSON.stringify(err));
          return;
        }
        console.info('Succeeded in setting the window layout to full-screen mode.');
      });

      // If or not the status bar and navigation bar will be shown. For example, to display them all, this parameter is set to ['status', 'navigation']; if it is not set, they are not displayed by default.
      let visibleBar = [];
      windowClass.setWindowSystemBarEnable(visibleBar, (err) => {
        if (err.code) {
          console.error('Failed to set the system bar to be invisible. Cause: ' + JSON.stringify(err));
          return;
        }
        console.info('Succeeded in setting the system bar to be invisible.');
      });
    });

    // Main window is created, set main page for this ability
    windowStage.loadContent("pages/index", (err, data) => {
      if (err.code) {
        console.error('Failed to load the content. Cause:' + JSON.stringify(err));
        return;
      }
    });
    windowStage.on("windowStageEvent", (data) => {
      let stageEventType: window.WindowStageEventType = data;
      switch (stageEventType) {
          case window.WindowStageEventType.RESUMED:
              nativeAppLifecycle.onShow();
              break;
          case window.WindowStageEventType.PAUSED:
              nativeAppLifecycle.onHide();
              break;
          default:
              break;
      }
  });
  }

  onWindowStageDestroy() {

  }

  onForeground() {
    // Ability has brought to foreground
    nativeAppLifecycle.onShow();
  }

  onBackground() {
    // Ability has back to background
    nativeAppLifecycle.onHide();
  }
}
