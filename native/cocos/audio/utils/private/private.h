/*
 * Copyright (C) 2014 The Android Open Source Project
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

#ifndef ANDROID_AUDIO_PRIVATE_H
#define ANDROID_AUDIO_PRIVATE_H
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include <sys/cdefs.h>
#elif CC_PLATFORM == CC_PLATFORM_WINDOWS
    #include <sys/types.h>
    #define __attribute__(x)
#endif
#include <stdint.h>
/* Defines not necessary for external use but kept here to be common
 * to the audio_utils library.
 */

/* struct representation of 3 bytes for packed PCM 24 bit data.
 * The naming follows the ARM NEON convention.
 */
extern "C" {
typedef struct __attribute__((__packed__)) {
    uint8_t c[3];
} uint8x3_t;
}
#endif /*ANDROID_AUDIO_PRIVATE_H*/
