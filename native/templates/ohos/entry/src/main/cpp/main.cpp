#include "Game.h"

extern "C" {

cc::Application *cocos_main(int width, int height) {
    return new Game(width, height);
}
}