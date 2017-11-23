APP_STL := gnustl_static

# Uncomment this line to compile to armeabi-v7a, your application will run faster but support less devices
APP_ABI := armeabi-v7a

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

# Some Android Simulators don't support SSE instruction, so disable it for x86 arch.
APP_CPPFLAGS += -U__SSE__
