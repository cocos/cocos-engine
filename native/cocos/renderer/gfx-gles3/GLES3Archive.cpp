#include "GLES3Archive.h"

namespace cc::gfx {

bool BinaryInputArchive::load(char *data, uint32_t size) {
    return _stream.rdbuf()->sgetn(data, size) == size;
}

void BinaryOutputArchive::save(const char *data, uint32_t size) {
    _stream.rdbuf()->sputn(data, size);
}

} // namespace cc::gfx
