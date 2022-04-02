
#include "cocos/math/Math.h"
#include "math/Vec3.h"
#include <iostream>

int main(int argc, char **argv) {
    cc::Mat4 identity{};
    cc::Vec3 vec3;
    std::cout << "Mat4 " << sizeof(identity) << std::endl;
    std::cout << "Vec3 " << sizeof(vec3) << std::endl;
    return 0;
}