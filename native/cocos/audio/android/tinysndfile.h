/*
 * Copyright (C) 2012 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#pragma once

// This is a C library for reading and writing PCM .wav files.  It is
// influenced by other libraries such as libsndfile and audiofile, except is
// much smaller and has an Apache 2.0 license.
// The API should be familiar to clients of similar libraries, but there is
// no guarantee that it will stay exactly source-code compatible with other libraries.

#include <sys/cdefs.h>
#include <cstdio>

__BEGIN_DECLS

// visible to clients
using sf_count_t = int;

using SF_INFO = struct {
    sf_count_t frames;
    int        samplerate;
    int        channels;
    int        format;
};

// opaque to clients
using SNDFILE = struct SNDFILE_;

// Format
#define SF_FORMAT_TYPEMASK 1
#define SF_FORMAT_WAV      1
#define SF_FORMAT_SUBMASK  14
#define SF_FORMAT_PCM_16   2
#define SF_FORMAT_PCM_U8   4
#define SF_FORMAT_FLOAT    6
#define SF_FORMAT_PCM_32   8
#define SF_FORMAT_PCM_24   10

using snd_callbacks = struct {
    void *(*open)(const char *path, void *user);
    size_t (*read)(void *ptr, size_t size, size_t nmemb, void *datasource);
    int (*seek)(void *datasource, long offset, int whence); //NOLINT(google-runtime-int)
    int (*close)(void *datasource);
    long (*tell)(void *datasource); //NOLINT(google-runtime-int)
};

// Open stream
SNDFILE *sf_open_read(const char *path, SF_INFO *info, snd_callbacks *cb, void *user); //NOLINT(readability-identifier-naming)

// Close stream
void sf_close(SNDFILE *handle); //NOLINT(readability-identifier-naming)

// Read interleaved frames and return actual number of frames read
sf_count_t sf_readf_short(SNDFILE *handle, int16_t *ptr, sf_count_t desired); //NOLINT(readability-identifier-naming)
/*
sf_count_t sf_readf_float(SNDFILE *handle, float *ptr, sf_count_t desired);
sf_count_t sf_readf_int(SNDFILE *handle, int *ptr, sf_count_t desired);
*/

off_t sf_seek(SNDFILE *handle, int offset, int whence); //NOLINT(readability-identifier-naming)
off_t sf_tell(SNDFILE *handle);                         //NOLINT(readability-identifier-naming)

__END_DECLS
