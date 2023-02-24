#include "GLES3Archive.h"

namespace cc::gfx {

void BinaryInputArchive::load(char *data, uint32_t size) {
    _stream.rdbuf()->sgetn(data, size);
}

void BinaryOutputArchive::save(const char *data, uint32_t size) {
    _stream.rdbuf()->sputn(data, size);
}

} // namespace cc::gfx
