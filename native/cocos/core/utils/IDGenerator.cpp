/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "core/utils/IDGenerator.h"
#include "base/Random.h"
#include "boost/uuid/uuid.hpp"
#include "boost/uuid/uuid_generators.hpp"
#include "boost/uuid/uuid_io.hpp"

namespace cc {

IDGenerator globalIdGenerator("global");

IDGenerator::IDGenerator(const ccstd::string &category) {
    // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
    _id = static_cast<uint32_t>(RandomHelper::randomInt(0, 998));
    _prefix = (category + nonUuidMark);
}

ccstd::string IDGenerator::getNewId() {
#if CC_EDITOR
    if (_prefix == "Node." || _prefix == "Comp.") {
        static boost::uuids::random_generator_mt19937 generator;
        boost::uuids::uuid id = generator();
        return boost::uuids::to_string(id);
    }
#endif
    return _prefix + std::to_string(++_id);
}
} // namespace cc
