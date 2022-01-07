#include "core/utils/IDGenerator.h"
#include "base/Random.h"

namespace cc {

IDGenerator globalIdGenerator("global");

IDGenerator::IDGenerator(const std::string &category) {
    // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
    _id     = static_cast<uint32_t>(RandomHelper::randomInt(0, 998));
    _prefix = (category + nonUuidMark);
}

std::string IDGenerator::getNewId() {
    //cjh TODO:    if (EDITOR && (this.prefix === 'Node.' || this.prefix === 'Comp.')) {
    //        return EditorExtends.UuidUtils.uuid();
    //    }
    return _prefix + std::to_string(++_id);
}

} // namespace cc
