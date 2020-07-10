// Copyright 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef __etc1_h__
#define __etc1_h__
/// @cond DO_NOT_SHOW

#define ETC1_ENCODED_BLOCK_SIZE 8
#define ETC1_DECODED_BLOCK_SIZE 48

#ifndef ETC1_RGB8_OES
#define ETC1_RGB8_OES 0x8D64
#endif

typedef unsigned char etc1_byte;
typedef int etc1_bool;
typedef unsigned int etc1_uint32;

#ifdef __cplusplus
extern "C" {
#endif
// Size of a PKM header, in bytes.

#define ETC_PKM_HEADER_SIZE 16

// Check if a PKM header is correctly formatted.

etc1_bool etc1_pkm_is_valid(const etc1_byte* pHeader);

// Read the image width from a PKM header

etc1_uint32 etc1_pkm_get_width(const etc1_byte* pHeader);

// Read the image height from a PKM header

etc1_uint32 etc1_pkm_get_height(const etc1_byte* pHeader);

#ifdef __cplusplus
}
#endif

/// @endcond
#endif

