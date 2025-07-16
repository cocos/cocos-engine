#include "Fruit.h"
#include <sstream>
namespace demo {

Fruit::Fruit(const std::string& name) : _name(name) {}

Fruit::Fruit(const std::string& name, int price) : _name(name), _price(price) {}

std::string Fruit::fullInfo() const {
    std::stringstream ss;
    ss << "Full information about fruit " << _name << std::endl
       << "  price:     " << _price << std::endl
       << "  sweetness: " << _sweetness << std::endl;
    return ss.str();
}

} // namespace demo
