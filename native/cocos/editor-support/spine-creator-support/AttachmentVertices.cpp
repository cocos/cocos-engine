/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
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
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "spine-creator-support/AttachmentVertices.h"

using namespace cc; // NOLINT(google-build-using-namespace)

namespace spine {

AttachmentVertices::AttachmentVertices(middleware::Texture2D *texture, int verticesCount, uint16_t *triangles, int trianglesCount) {
    _texture = texture;
    if (_texture) _texture->addRef();

    _triangles = new middleware::Triangles();
    _triangles->verts = new middleware::V3F_T2F_C4B[verticesCount];
    _triangles->vertCount = verticesCount;
    _triangles->indices = triangles;
    _triangles->indexCount = trianglesCount;
}

AttachmentVertices::~AttachmentVertices() {
    delete[] _triangles->verts;
    delete _triangles;
    if (_texture) _texture->release();
}

AttachmentVertices *AttachmentVertices::copy() {
    AttachmentVertices *atv = new AttachmentVertices(nullptr, _triangles->vertCount, _triangles->indices, _triangles->indexCount);
    return atv;
}

} // namespace spine
