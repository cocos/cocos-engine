#include "Accessor.h"

namespace se {

namespace accessor {

se::Value globalPath(const std::string &path) {
    se::Value current{se::ScriptEngine::getInstance()->getGlobalObject()};
    if (path.empty()) return {};
    std::string::size_type pStart = 0;
    std::string::size_type pEnd = 0;
    se::Value tmp;
    while ((pEnd = path.find_first_of('.', pStart)) != std::string::npos) {
        if (!current.toObject()->getProperty(path.substr(pStart, pEnd - pStart), &tmp)) {
            CC_ABORTF("failed to getProperty \"%s\" within \"%s\"", path.substr(pStart, pEnd).c_str(), path.c_str());
            return {};
        }
        if (!tmp.isObject()) {
            CC_ABORTF("property \"%s\" is not an object within \"%s\"", path.substr(pStart, pEnd).c_str(), path.c_str());
            return {};
        }
        pStart = pEnd + 1;
        current = tmp;
    }
    if (pStart < path.length()) {
        current.toObject()->getProperty(path.c_str() + pStart, &tmp);
        return tmp;
    }
    CC_ABORTF("path format incorrect \"%s\"?", path.c_str());
    return {};
}

} // namespace accessor
} // namespace se
