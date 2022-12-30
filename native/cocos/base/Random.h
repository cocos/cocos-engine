/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <cstdlib>
#include <random>

#include "base/Macros.h"

namespace cc {

/**
 * @class RandomHelper
 * @brief A helper class for creating random number.
 */
class CC_DLL RandomHelper {
public:
    template <typename T>
    static inline T randomReal(T min, T max) {
        std::uniform_real_distribution<T> dist(min, max);
        auto &mt = RandomHelper::getEngine();
        return dist(mt);
    }

    template <typename T>
    static inline T randomInt(T min, T max) {
        std::uniform_int_distribution<T> dist(min, max);
        auto &mt = RandomHelper::getEngine();
        return dist(mt);
    }

private:
    static inline std::mt19937 &getEngine() {
        static std::random_device seedGen;
        static std::mt19937 engine(seedGen());
        return engine;
    }
};

/**
 * Returns a random value between `min` and `max`.
 */
template <typename T>
inline T random(T min, T max) {
    return RandomHelper::randomInt<T>(min, max);
}

template <>
inline float random(float min, float max) {
    return RandomHelper::randomReal(min, max);
}

template <>
inline long double random(long double min, long double max) {
    return RandomHelper::randomReal(min, max);
}

template <>
inline double random(double min, double max) {
    return RandomHelper::randomReal(min, max);
}

/**
 * Returns a random int between 0 and RAND_MAX.
 */
inline int random() {
    return cc::random(0, static_cast<int>(RAND_MAX));
};

/**
 * Returns a random float between -1 and 1.
 * It can be seeded using std::srand(seed);
 */
inline float randMinus1_1() {
    // IDEA: using the new c++11 random engine generator
    // without a proper way to set a seed is not useful.
    // Resorting to the old random method since it can
    // be seeded using std::srand()
    return ((std::rand() / (float)RAND_MAX) * 2) - 1;

    //    return cc::random(-1.f, 1.f);
};

/**
 * Returns a random float between 0 and 1.
 * It can be seeded using std::srand(seed);
 */
inline float rand0_1() {
    // IDEA: using the new c++11 random engine generator
    // without a proper way to set a seed is not useful.
    // Resorting to the old random method since it can
    // be seeded using std::srand()
    return std::rand() / (float)RAND_MAX;

    //    return cc::random(0.f, 1.f);
};

} // namespace cc
