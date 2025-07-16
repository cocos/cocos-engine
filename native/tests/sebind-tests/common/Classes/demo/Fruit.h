#pragma once

#include <string>

namespace demo {
class Fruit {
public:
    Fruit() = default;
    Fruit(const std::string &name);
    Fruit(const std::string &name, int price);

    std::string fullInfo() const;
    std::string toString() const { return fullInfo(); }

    void setSweetness(int value) { _sweetness = value; }
    double getSweetness() const { return _sweetness; };

    int uid{-1};

    std::string getName() const { return _name; }

    double getPrice() const { return _price; }

private:
    std::string _name;
    int _price{1};
    int _sweetness{0};
};
} // namespace demo
