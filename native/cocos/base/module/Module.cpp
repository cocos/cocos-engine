#include "Module.h"
#include <unordered_map>

using EntryMap = std::unordered_map<std::string, ModuleFactoryBase *>;

static EntryMap *_moduleEntries{nullptr};

static EntryMap *getEntries() {
    if (!_moduleEntries) {
        _moduleEntries = new EntryMap;
    }
    return _moduleEntries;
}
ModuleFactoryBase *queryModuleClass(const char *name) {
    auto *map = getEntries();
    auto *ret = (*map)[name];
    // std::cout << "get " << name << " with " << ret << " from " << map << std::endl;
    return ret;
}
void registerModuleClass(const char *name, ModuleFactoryBase *entry) {
    auto *map = getEntries();
    (*map)[name] = entry;
    // std::cout << "put " << name << " with " << entry << " into " << map << std::endl;
}
void unregisterModuleClass(ModuleFactoryBase *entry) {
    auto *map = getEntries();
    auto itr = map->find(entry->getName());
    if (itr != map->end()) {
        map->erase(itr);
    }
}

bool Module::loadDependencies() {
    auto deps = getDependencies();
    for (auto &dep : deps) {
        auto *mod = _group->load(dep.c_str());
        if (mod) {
            _dependencies.emplace_back(mod);
            mod->addModuleRef();
        } else {
            std::cout << "Module `" << getName() << "` failed to load '" << dep << "'" << std::endl;
        }
    }
    return true;
}

bool Module::unloadDependencies() {
    releaseModule();  // self then dependencies
    for(auto &mod : _dependencies) {
        std::cout << " release " << mod->getName() << std::endl;
        mod->releaseModule();
    }
    return true;
}

Module *Module::lookup(const char *name) {
    if (_group) {
        return _group->load(name);
    }
    return nullptr;
}

void ModuleGroup::autoLoad() {
    auto & map = *getEntries();

    for(auto &itr : map) {
        auto groupIt = _modules.find(itr.first);
        if(itr.second->autoLoad && !itr.second->loaded && groupIt == _modules.end()) {
            load(itr.first.c_str());
            itr.second->loaded = true;
        }
    }

}
