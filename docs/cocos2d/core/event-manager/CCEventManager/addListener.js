// Add KEYBOARD EventListener To StatusLabel.
cc.eventManager.addListener({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed:  function(keyCode, event){
        var label = event.getCurrentTarget();
        label.setString("Key " + keyCode.toString() + " was pressed!");
    },
    onKeyReleased: function(keyCode, event){
        var label = event.getCurrentTarget();
        label.setString("Key " + keyCode.toString() + " was released!");
    }
}, statusLabel);

// Create ACCELERATION EventListener To Sprite.
cc.eventManager.addListener({
    event: cc.EventListener.ACCELERATION,
    callback: function(acc, event){
        //Here processing logic.
    }
}, sprite);