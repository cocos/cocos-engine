#pragma once
#include <cocos/scene/Model.h>
#include <cocos/core/Root.h>

namespace cc {
	class GraphicsProxy final {

	public:
        GraphicsProxy();
        ~GraphicsProxy();

    public:
		void initModel(Node* node);
		void activeSubModel(uint8_t val);
		void uploadData();
		void destroy(); // clear
		void clear();
	private:
		Node* _node{ nullptr };
		scene::Model* _model{ nullptr };
		ccstd::vector<cc::RenderingSubMesh*> _graphicsUseSubMeshes{};

		gfx::Device* _device = Root::getInstance()->getDevice();
		uint32_t _stride{ 32 };
		ccstd::vector<gfx::Attribute> _attributes{
			gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
			gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
			gfx::Attribute{"a_dist", gfx::Format::R32F},
		};
		gfx::PrimitiveMode _primitiveMode{ gfx::PrimitiveMode::TRIANGLE_LIST };
	};
} // namespace cc

