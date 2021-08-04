
#include "cocos/bindings/jswrapper/SeApi.h"

int main(int argc, char **argv) {
    
    auto *engine = se::ScriptEngine::getInstance();
    engine->init();
    engine->start();
    engine->evalString("console.log('------------------------------------------');");
    engine->evalString("console.log('----------hello from evalString()---------');");
    engine->evalString("console.log('------------------------------------------');");
    se::ScriptEngine::destroyInstance();
    return 0;
}