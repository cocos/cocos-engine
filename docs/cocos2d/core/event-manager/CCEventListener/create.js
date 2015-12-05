--------
cc.EventListener.create({

      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
          //do something
          return true;
      }
   });
