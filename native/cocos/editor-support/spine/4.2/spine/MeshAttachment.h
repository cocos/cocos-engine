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

#ifndef Spine_MeshAttachment_h
#define Spine_MeshAttachment_h

#include <spine/VertexAttachment.h>
#include <spine/TextureRegion.h>
#include <spine/Sequence.h>
#include <spine/Vector.h>
#include <spine/Color.h>
#include <spine/HasRendererObject.h>

namespace spine {
	/// Attachment that displays a texture region using a mesh.
	class SP_API MeshAttachment : public VertexAttachment {
		friend class SkeletonBinary;

		friend class SkeletonJson;

		friend class AtlasAttachmentLoader;

	RTTI_DECL

	public:
		explicit MeshAttachment(const String &name);

		virtual ~MeshAttachment();

		using VertexAttachment::computeWorldVertices;

		virtual void computeWorldVertices(Slot &slot, size_t start, size_t count, float *worldVertices, size_t offset,
		size_t stride = 2);

		void updateRegion();

		int getHullLength();

		void setHullLength(int inValue);

		Vector<float> &getRegionUVs();

		/// The UV pair for each vertex, normalized within the entire texture. See also MeshAttachment::updateRegion
		Vector<float> &getUVs();

		Vector<unsigned short> &getTriangles();

		Color &getColor();

		const String &getPath();

		void setPath(const String &inValue);

		TextureRegion *getRegion();

		void setRegion(TextureRegion *region);

		Sequence *getSequence();

		void setSequence(Sequence *sequence);

		MeshAttachment *getParentMesh();

		void setParentMesh(MeshAttachment *inValue);

		// Nonessential.
		Vector<unsigned short> &getEdges();

		float getWidth();

		void setWidth(float inValue);

		float getHeight();

		void setHeight(float inValue);

		virtual Attachment *copy();

		MeshAttachment *newLinkedMesh();

	#ifndef __EMSCRIPTEN__
	private:
	#endif
		MeshAttachment *_parentMesh;
		Vector<float> _uvs;
		Vector<float> _regionUVs;
		Vector<unsigned short> _triangles;
		Vector<unsigned short> _edges;
		String _path;
		Color _color;
		int _hullLength;
		int _width, _height;
		TextureRegion *_region;
		Sequence *_sequence;
	};
}

#endif /* Spine_MeshAttachment_h */
