/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
#ifndef Spine_BlockAllocator_h
#define Spine_BlockAllocator_h

#include <cstdint>
#include <spine/SpineObject.h>
#include <spine/Extension.h>
#include <spine/MathUtil.h>
#include <spine/Vector.h>

namespace spine {
    struct Block {
        int size;
        int allocated;
        uint8_t *memory;

        int free() {
            return size - allocated;
        }

        bool canFit(int numBytes) {
            return free() >= numBytes;
        }

        uint8_t *allocate(int numBytes) {
            uint8_t *ptr = memory + allocated;
            allocated += numBytes;
            return ptr;
        }
    };

    class BlockAllocator : public SpineObject {
        int initialBlockSize;
        Vector <Block> blocks;

    public:
        BlockAllocator(int initialBlockSize) : initialBlockSize(initialBlockSize) {
            blocks.add(newBlock(initialBlockSize));
        }

        ~BlockAllocator() {
            for (int i = 0, n = (int) blocks.size(); i < n; i++) {
                SpineExtension::free(blocks[i].memory, __FILE__, __LINE__);
            }
        }

        template<typename T>
        T *allocate(size_t num) {
            return (T *) _allocate((int) (sizeof(T) * num));
        }

        void compress() {
            if (blocks.size() == 1) return;
            int totalSize = 0;
            for (int i = 0, n = (int)blocks.size(); i < n; i++) {
                totalSize += blocks[i].size;
                SpineExtension::free(blocks[i].memory, __FILE__, __LINE__);
            }
            blocks.clear();
            blocks.add(newBlock(totalSize));
        }

    private:
        void *_allocate(int numBytes) {
            // 16-byte align allocations
            int alignedNumBytes = numBytes + (numBytes % 16 != 0 ? 16 - (numBytes % 16) : 0);
            Block *block = &blocks[blocks.size() - 1];
            if (!block->canFit(alignedNumBytes)) {
                blocks.add(newBlock(MathUtil::max(initialBlockSize, alignedNumBytes)));
                block = &blocks[blocks.size() - 1];
            }
            return block->allocate(alignedNumBytes);
        }

        Block newBlock(int numBytes) {
            Block block = {MathUtil::max(initialBlockSize, numBytes), 0, nullptr};
            block.memory = SpineExtension::alloc<uint8_t>(block.size, __FILE__, __LINE__);
            return block;
        }
    };
}

#endif