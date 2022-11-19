
#include <cstdlib>
#include <sstream>
#include <string>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_global_init.h"
#include "cocos/platform/FileUtils.h"

int main(int argc, char **argv) {
    std::string scriptPath = "index.js";

    if (argc > 1) {
        scriptPath = argv[1];
    }

    auto *engine = se::ScriptEngine::getInstance();
    auto *fu = cc::FileUtils::getInstance();

    // TODO: replace search path
    auto *currentDir = getenv("PWD");
    fu->addSearchPath(currentDir);

    jsb_set_xxtea_key("");
    jsb_init_file_operation_delegate();

    engine->start();
    engine->evalString("console.log('begin execute')");
    auto ret = engine->runScript(scriptPath);
    engine->evalString("console.log('end')");
    if (!ret) return EXIT_FAILURE;

    se::ScriptEngine::destroyInstance();
    cc::FileUtils::destroyInstance();
    return 0;
}