#pragma once

#include "Fruit.h"
#include "bindings/jswrapper/SeApi.h"

#include <memory>

namespace demo {
class Coconut : public Fruit {
public:
    Coconut() = default;
    Coconut(se::Object *jsThis) : Fruit("Coconut"), _jsThis(jsThis) {}
    Coconut(se::Object *jsThis, const std::string &name, float price) : Fruit(name, price), _jsThis(jsThis) {}
    Coconut(float r) : Fruit("Coconut"), _radius(r) {}

    float getRadius() const { return _radius; }
    void setRadius(float r) { _radius = r; }

    float growRadius(float x) { _radius += x; }

    void doNothing() const {}

    std::shared_ptr<Coconut> combine(Coconut *other) const {
        return std::make_shared<Coconut>(other->_radius + _radius);
    }

    std::shared_ptr<Coconut> combine1(Coconut &other) const {
        return std::make_shared<Coconut>(other._radius + _radius);
    }
    std::shared_ptr<Coconut> combine2(std::shared_ptr<Coconut> &other) const {
        return std::make_shared<Coconut>(other->_radius + _radius);
    }

    std::shared_ptr<Coconut> combine3(const std::shared_ptr<Coconut> &other) const {
        return std::make_shared<Coconut>(other->_radius + _radius);
    }

    std::string callJSFunction(const std::string &name);

    static std::vector<int> OneTwoThree() {
        return {1, 2, 3};
    }
    static void IgnoreInput(int) {}
    static void StaticDoNothing() {}

private:
    se::Object *_jsThis{nullptr};
    float _radius{10.0f};
};
} // namespace demo
