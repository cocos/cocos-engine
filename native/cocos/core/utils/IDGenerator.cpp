#include "core/utils/IDGenerator.h"
#include "base/Random.h"
#include "boost/uuid/uuid.hpp"
#include "boost/uuid/uuid_generators.hpp" 
#include "boost/uuid/uuid_io.hpp"

namespace cc {

IDGenerator globalIdGenerator("global");

IDGenerator::IDGenerator(const std::string &category) {
    // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
    _id     = static_cast<uint32_t>(RandomHelper::randomInt(0, 998));
    _prefix = (category + nonUuidMark);
}

std::string IDGenerator::getNewId() {
#ifdef CC_EDITOR
    if (_prefix == "Node." || _prefix == "Comp.") {
        static boost::uuids::random_generator_mt19937 generator;
        boost::uuids::uuid                            id = generator();
        return boost::uuids::to_string(id);
    }
#endif
    return _prefix + std::to_string(++_id);
}
} // namespace cc
