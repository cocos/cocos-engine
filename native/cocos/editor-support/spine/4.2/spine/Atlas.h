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

#ifndef Spine_Atlas_h
#define Spine_Atlas_h

#include <spine/Vector.h>
#include <spine/Extension.h>
#include <spine/SpineObject.h>
#include <spine/SpineString.h>
#include <spine/HasRendererObject.h>
#include "TextureRegion.h"

namespace spine {
	enum Format {
		Format_Alpha,
		Format_Intensity,
		Format_LuminanceAlpha,
		Format_RGB565,
		Format_RGBA4444,
		Format_RGB888,
		Format_RGBA8888
	};

	// Our TextureFilter collides with UE4's TextureFilter in unity builds. We rename
	// TextureFilter to SpineTextureFilter in UE4.
#ifdef SPINE_UE4
	#define TEXTURE_FILTER_ENUM SpineTextureFilter
#else
	#define TEXTURE_FILTER_ENUM TextureFilter
#endif

	enum TEXTURE_FILTER_ENUM {
		TextureFilter_Unknown,
		TextureFilter_Nearest,
		TextureFilter_Linear,
		TextureFilter_MipMap,
		TextureFilter_MipMapNearestNearest,
		TextureFilter_MipMapLinearNearest,
		TextureFilter_MipMapNearestLinear,
		TextureFilter_MipMapLinearLinear
	};

	enum TextureWrap {
		TextureWrap_MirroredRepeat,
		TextureWrap_ClampToEdge,
		TextureWrap_Repeat
	};

	class SP_API AtlasPage : public SpineObject {
	public:
		String name;
		String texturePath;
		Format format;
		TEXTURE_FILTER_ENUM minFilter;
		TEXTURE_FILTER_ENUM magFilter;
		TextureWrap uWrap;
		TextureWrap vWrap;
		int width, height;
		bool pma;
        int index;
        void *texture;

		explicit AtlasPage(const String &inName) : name(inName), format(Format_RGBA8888),
												   minFilter(TextureFilter_Nearest),
												   magFilter(TextureFilter_Nearest), uWrap(TextureWrap_ClampToEdge),
												   vWrap(TextureWrap_ClampToEdge), width(0), height(0), pma(false), index(0), texture(NULL) {
		}
	};

	class SP_API AtlasRegion : public TextureRegion {
	public:
		AtlasPage *page;
		String name;
		int index;
		int x, y;
		Vector<int> splits;
		Vector<int> pads;
		Vector <String> names;
		Vector<float> values;
	};

	class TextureLoader;

	class SP_API Atlas : public SpineObject {
	public:
		Atlas(const String &path, TextureLoader *textureLoader, bool createTexture = true);

		Atlas(const char *data, int length, const char *dir, TextureLoader *textureLoader, bool createTexture = true);

		~Atlas();

		void flipV();

		/// Returns the first region found with the specified name. This method uses String comparison to find the region, so the result
		/// should be cached rather than calling this method multiple times.
		/// @return The region, or NULL.
		AtlasRegion *findRegion(const String &name);

		Vector<AtlasPage *> &getPages();

		Vector<AtlasRegion *> &getRegions();

	private:
		Vector<AtlasPage *> _pages;
		Vector<AtlasRegion *> _regions;
		TextureLoader *_textureLoader;

		void load(const char *begin, int length, const char *dir, bool createTexture);
	};
}

#endif /* Spine_Atlas_h */
