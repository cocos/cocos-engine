#pragma once

#include <cstdint>

namespace cc {
void *ohosOpen(const char *path, void *user);

size_t ohosRead(void *ptr, size_t size, size_t nmemb, void *datasource);

int ohosSeek(void *datasource, long offset, int whence); //NOLINT(google-runtime-int)

int ohosClose(void *datasource);

long ohosTell(void *datasource); //NOLINT(google-runtime-int)

} // namespace cc