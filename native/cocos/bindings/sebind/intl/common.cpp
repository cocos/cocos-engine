#include "common.h"
namespace sebind {

namespace intl {
context_db_::context_ *context_db_::operator[](const char *key) {
    auto itr = _contexts.find(key);
    if (itr == _contexts.end()) {
        auto *ctx = new context_;
        _contexts.emplace(key, ctx);
        return ctx;
    }
    return itr->second;
}

context_db_ &context_db_::instance() {
    static context_db_ database;
    return database;
}

void context_db_::reset() {
    auto &inst = instance();
    for (auto &itr : inst._contexts) {
        delete itr.second;
    }
    inst._contexts.clear();
}
} // namespace intl
} // namespace sebind