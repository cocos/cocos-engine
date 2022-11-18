#pragma once

#include <cassert>
#include <cstddef>
#include <iostream>
#include <string>
#include <type_traits>
#include <unordered_map>
#include <vector>

class ModuleGroup;
class Module;

class ModuleFactoryBase {
public:
    virtual ~ModuleFactoryBase() = default;
    virtual Module *createModule(ModuleGroup *group) = 0;
    virtual void deleteModule(void *) = 0;
    virtual const char *getName() = 0;
    bool autoLoad{false};
    bool loaded{false};
};

template <typename Mod, typename Fn = nullptr_t, typename Fn2 = nullptr_t>
class ModuleFactory : public ModuleFactoryBase {
public:
    explicit ModuleFactory(bool autoLoad) {
        this->autoLoad = autoLoad;
    }
    ModuleFactory(Fn creator, bool autoLoad) {
        this->creator = std::move(creator);
        this->autoLoad = autoLoad;
    }
    ModuleFactory(Fn creator, Fn2 deletor, bool autoLoad) {
        this->creator = std::move(creator);
        this->deletor = std::move(deletor);
        this->autoLoad = autoLoad;
    }

    Module *createModule(ModuleGroup *group) override {
        Module *ret;
        if constexpr (std::is_invocable_v<Fn>) {
            ret = creator();
        } else if constexpr (std::is_constructible_v<Mod>) {
            ret = new Mod;
        } else {
            assert(false); // failed to create instance
        }
        if (ret) {
            ret->setGroup(group);
        }
        return ret;
    }

    void deleteModule(void *in) override {
        Mod *md = reinterpret_cast<Mod *>(in);
        if constexpr (std::is_invocable_v<Fn2, Mod *>) {
            deletor(md);
        } else if constexpr (std::is_destructible_v<Mod>) {
            delete md;
        } else {
            assert(false);
        }
    }

    const char *getName() override {
        return Mod::MODULE_NAME;
    }

    Fn creator;
    Fn2 deletor;
};

ModuleFactoryBase *queryModuleClass(const char *name);
void registerModuleClass(const char *name, ModuleFactoryBase *entry);
void unregisterModuleClass(ModuleFactoryBase *entry);

class Module {
public:
    enum class State {
        Uninitialized,  // NOLINT
        Initializing,   // NOLINT
        Initialized,    // NOLINT
        Deinitializing, // NOLINT
        Deinitialized,  // NOLINT
        Error,          // NOLINT
    };

    virtual ~Module() = default;
    virtual const char *getName() = 0;
    virtual std::vector<std::string> getDependencies() { return {}; }
    virtual bool isEnabled() { return _enabled; }
    bool setEnable(bool enabled) {
        _enabled = enabled;
        return _enabled;
    }

    ModuleGroup *getGroup() {
        return _group;
    }

    void setGroup(ModuleGroup *group) {
        _group = group;
    }

    Module *lookup(const char *name);

    template <typename T>
    T *lookup() {
        return dynamic_cast<T *>(lookup(T::MODULE_NAME));
    }

    virtual bool doInit() { return true; }
    virtual bool doDeinit() { return true; }

    void addModuleRef() {
        _refCount++;
    }
    void releaseModule() {
        if (_refCount > 0) {
            std::cout << ":: multiple reference " << _refCount << " for " << getName() << std::endl;
        }
        _refCount--;
        if (_refCount == 0) {
            std::cout << ":: " << getName() << " releaseModule ()" << std::endl;
            deinit();
            // TODO(PatriceJiang): delete with factory method
            auto *factory = queryModuleClass(getName());
            factory->deleteModule(this);
        }
    }

protected:
    bool loadDependencies();
    bool unloadDependencies();
    bool init() {
        if (_state == State::Initialized) {
            return true;
        }
        if (_state == State::Initializing) {
            std::cerr << "[error] Module is already initializing " << getName() << std::endl;
            return false;
        }
        // assert(!_initializing);
        _state = State::Initializing;
        std::cout << "  " << getName() << " init()" << std::endl;
        std::cout << "  " << getName() << " loadDependencies()" << std::endl;
        loadDependencies();
        std::cout << "  " << getName() << " loadDependencies() done!!!" << std::endl;
        std::cout << "  " << getName() << " doInit()" << std::endl;
        doInit();
        _state = State::Initialized;
        return true;
    }
    bool deinit() {
        if (_state != State::Initialized) {
            return true;
        }
        _state = State::Deinitializing;
        std::cout << "  " << getName() << " doDeinit()" << std::endl;
        doDeinit();
        std::cout << "  " << getName() << " unloadDependencies()" << std::endl;
        unloadDependencies();
        _state = State::Deinitialized;
        return true;
    }

    std::vector<Module *> _dependencies;

    ModuleGroup *_group{nullptr};

    // TODO(PatriceJiang): StrongRefcounnt & WeakRefCount
    // - automatically load modules should apply weak reference
    int _refCount{0};
    State _state{State::Uninitialized};
    bool _enabled{true};

    friend class ModuleGroup;
};

class ModuleGroup final {
public:
    // TODO(PatriceJiang): compile-time hashing
    std::unordered_map<std::string, Module *> _modules;

    template <typename Mod>
    Mod *load() {
        return dynamic_cast<Mod *>(load(Mod::MODULE_NAME));
    }

    Module *load(const char *name) {
        auto *mod = findOrCreate(name);
        if (mod) mod->init();
        return mod;
    }

    bool unload(const char *name) {
        // TODO(PatriceJiang): should not unload weak reference
        return true;
    }

    Module *findOrCreate(const char *moduleName) {
        auto itr = _modules.find(moduleName);
        if (itr == _modules.end()) {
            auto *mod = construct(moduleName);
            if (mod) {
                _modules.emplace(moduleName, mod);
                mod->addModuleRef();
                return mod;
            }
            return nullptr;
        }
        return itr->second;
    }

    // TODO(PatriceJiang): remove this method ?
    static inline bool hasConstructor(const char *moduleName) { // NOLINT(readability-identifier-naming)
        return queryModuleClass(moduleName) != nullptr;
    }

    Module *construct(const char *moduleName) {
        std::cout << _name << "!!! ModuleGroup try to construct a instance of " << moduleName << std::endl;
        ModuleFactoryBase *entry = queryModuleClass(moduleName);
        if (!entry) {
            std::cout << _name << "failed to query module : " << moduleName << std::endl;
            assert(false); // should abort
            return nullptr;
        }
        return entry->createModule(this);
    }
    explicit ModuleGroup(const char *name) {
        _name = name;
    }
    ModuleGroup() {
        autoLoad();
    }

    ~ModuleGroup() {
        reset();
    }

    void autoLoad();

    void reset() {
        // TODO(PatriceJiang): dispose order control
        std::cout << _name << "Remove " << _modules.size() << " modules from group" << std::endl;
        for (auto &mod : _modules) {
            if (mod.second) {
                mod.second->deinit();
                // delete mod.second; // TODO: implement strong ref & weak ref
            }
        }
        _modules.clear();
    }

private:
    std::string _name;
};

#define MODULE_DEPS(...)                                  \
    std::vector<std::string> getDependencies() override { \
        return {__VA_ARGS__};                             \
    }

#define IMPL_MODULE_NAMED(ModName, ModName2)                                                          \
    constexpr static const char *MODULE_NAME = ModName2;                                              \
    const char *getName() override { return MODULE_NAME; }                                            \
    static void registerModule(bool autoLoad = false, bool remove = false) {                          \
        static ModuleFactoryBase *registerEntry{nullptr};                                             \
        if (!remove) {                                                                                \
            if (!registerEntry) {                                                                     \
                registerEntry = new ModuleFactory<ModName>(autoLoad);                                 \
            }                                                                                         \
            registerModuleClass(MODULE_NAME, registerEntry);                                          \
        } else {                                                                                      \
            if (registerEntry) {                                                                      \
                unregisterModuleClass(registerEntry);                                                 \
                registerEntry = nullptr;                                                              \
            }                                                                                         \
        }                                                                                             \
    }                                                                                                 \
    template <typename Fn>                                                                            \
    static void registerModule(Fn creator, bool autoLoad = false, bool remove = false) {              \
        static ModuleFactoryBase *registerEntry{nullptr};                                             \
        if (!remove) {                                                                                \
            if (!registerEntry) {                                                                     \
                registerEntry = new ModuleFactory<ModName, Fn>(creator, autoLoad);                    \
            }                                                                                         \
            registerModuleClass(MODULE_NAME, registerEntry);                                          \
        } else {                                                                                      \
            if (registerEntry) {                                                                      \
                unregisterModuleClass(registerEntry);                                                 \
                registerEntry = nullptr;                                                              \
            }                                                                                         \
        }                                                                                             \
    }                                                                                                 \
    template <typename Fn, typename Fn2>                                                              \
    static void registerModule(Fn creator, Fn2 deletor, bool autoLoad = false, bool remove = false) { \
        static ModuleFactoryBase *registerEntry{nullptr};                                             \
        if (!remove) {                                                                                \
            if (!registerEntry) {                                                                     \
                registerEntry = new ModuleFactory<ModName, Fn, Fn2>(creator, deletor, autoLoad);      \
            }                                                                                         \
            registerModuleClass(MODULE_NAME, registerEntry);                                          \
        } else {                                                                                      \
            if (registerEntry) {                                                                      \
                unregisterModuleClass(registerEntry);                                                 \
                registerEntry = nullptr;                                                              \
            }                                                                                         \
        }                                                                                             \
    }

#define IMPL_MODULE(ModName) \
    IMPL_MODULE_NAMED(ModName, #ModName)