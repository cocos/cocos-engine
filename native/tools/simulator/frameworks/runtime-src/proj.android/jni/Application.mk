APP_STL := gnustl_static

APP_CPPFLAGS := -frtti -std=c++11 -fsigned-char
APP_LDFLAGS := -latomic

# To solve windows commands char length too long
APP_SHORT_COMMANDS := true

ifeq ($(NDK_DEBUG),1)
  APP_CFLAGS += -DCOCOS2D_DEBUG=1
  APP_CPPFLAGS += -DCOCOS2D_DEBUG=1
  APP_OPTIM := debug
else
  APP_CFLAGS += -DNDEBUG
  APP_CPPFLAGS += -DNDEBUG
  APP_OPTIM := release
endif

COCOS_SIMULATOR_BUILD := 1
USE_ARM_MODE := 1
