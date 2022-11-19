
#include <iostream>
#include "platform/FileUtils.h"

int main(int argc, char **argv) {
    auto *fu = cc::FileUtils::getInstance();
    cc::FileUtils::destroyInstance();
    std::cout << "tests-fs done!" << std::endl;
    return 0;
}