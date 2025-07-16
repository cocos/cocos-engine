package com.example.cocosdemo;

import com.example.cocosdemo.slice.MainAbilitySlice;
import ohos.aafwk.ability.Ability;
import ohos.aafwk.content.Intent;
import ohos.accessibility.AccessibilityEventInfo;
import ohos.accessibility.ability.AccessibleAbility;

public class MainAbility extends AccessibleAbility {
    @Override
    public void onStart(Intent intent) {
        super.onStart(intent);
        super.setMainRoute(MainAbilitySlice.class.getName());
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEventInfo accessibilityEventInfo) {

    }

    @Override
    public void onInterrupt() {

    }
}
