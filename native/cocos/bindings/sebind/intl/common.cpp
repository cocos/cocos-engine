#include "common.h"
namespace sebind {

namespace intl {
ContextDB::Context *ContextDB::operator[](const char *key) {
    auto itr = _contexts.find(key);
    if (itr == _contexts.end()) {
        auto *ctx = ccnew Context;
        _contexts.emplace(key, ctx);
        return ctx;
    }
    return itr->second.get();
}

ContextDB &ContextDB::instance() {
    static ContextDB database;
    return database;
}

void ContextDB::reset() {
    auto &inst = instance();
    inst._contexts.clear();
}
} // namespace intl
} // namespace sebind
