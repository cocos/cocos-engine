APP_STL := c++_static

# Uncomment this line to compile to armeabi-v7a, your application will run faster but support less devices
APP_ABI := armeabi-v7a

APP_CPPFLAGS := -frtti -std=c++11 -fsigned-char
APP_LDFLAGS := -latomic

# To solve windows commands char length too long
APP_SHORT_COMMANDS := true

USE_ARM_MODE := 1

# MUST be careful to modify this manually
# disable module will speed up compile time, and reduce package size
USE_GFX_RENDERER := 1
USE_VIDEO := 1
USE_WEB_VIEW := 1
USE_AUDIO := 1
USE_SOCKET := 1
USE_SPINE := 1
USE_DRAGONBONES := 1
USE_TIFF := 1
USE_MIDDLEWARE := 1
USE_PARTICLE := 1

APP_CPPFLAGS += -DUSE_GFX_RENDERER=$(USE_GFX_RENDERER)
APP_CPPFLAGS += -DUSE_VIDEO=${USE_VIDEO}
APP_CPPFLAGS += -DUSE_WEB_VIEW=${USE_WEB_VIEW}
APP_CPPFLAGS += -DUSE_AUDIO=${USE_AUDIO}
APP_CPPFLAGS += -DUSE_SOCKET=${USE_SOCKET}
APP_CPPFLAGS += -DUSE_SPINE=${USE_SPINE}
APP_CPPFLAGS += -DUSE_DRAGONBONES=${USE_DRAGONBONES}
APP_CPPFLAGS += -DCC_USE_TIFF=${USE_TIFF}
APP_CPPFLAGS += -DUSE_MIDDLEWARE=${USE_MIDDLEWARE}
APP_CPPFLAGS += -DUSE_PARTICLE=${USE_PARTICLE}

ifeq ($(NDK_DEBUG),1)
  APP_CPPFLAGS += -DCOCOS2D_DEBUG=1
  APP_CFLAGS += -DCOCOS2D_DEBUG=1
  APP_OPTIM := debug
else
  APP_CPPFLAGS += -DNDEBUG
  APP_CFLAGS += -DNDEBUG
  APP_OPTIM := release
endif

# Some Android Simulators don't support SSE instruction, so disable it for x86 arch.
APP_CPPFLAGS += -U__SSE__
