#pragma once

#include "renderer/gfx-base/GFXAccelerationStructure.h"
#include "base/Ptr.h"
#include "gfx-base/GFXBuffer.h"
#include "RayTracingSceneTypes.h"
#include <queue>

namespace cc {
namespace scene {

class RenderScene;
class Model;
} // namespace scene
namespace pipeline {
struct RayTracingMeshDescriptor final {
    IntrusivePtr<gfx::Buffer> vertexBuffer;
    IntrusivePtr<gfx::Buffer> indexBuffer;
    uint32_t vertexCount;
    uint32_t indexCount;
    gfx::Format vertexFormat;
};

struct RayTracingGeometryShadingDescriptor final {
    std::optional<RayTracingMeshDescriptor> meshDescriptor;
    uint32_t materialID{};
};

struct RayTracingInstanceDescriptor final {
    uint32_t instanceCustomIdx;
    uint32_t mask;
    gfx::GeometryInstanceFlags flags;
    Mat4& transform;
    ccstd::vector<RayTracingGeometryShadingDescriptor> shadingGeometries;
    ccstd::string uuid;
    bool changed;
};

struct RayTracingSceneDescriptor final {
    ccstd::vector<RayTracingInstanceDescriptor> instances;
};

struct RayTracingSceneAddInstanceEvent {
    RayTracingInstanceDescriptor instDescriptor;
};

struct RayTracingSceneRemoveInstanceEvent {
    uint32_t instIdx;
};

struct RayTracingSceneMoveInstanceEvent {
    Mat4& transform;
    uint32_t instIdx;
};

using RayTracingUpdateEvent = std::variant<RayTracingSceneAddInstanceEvent, RayTracingSceneRemoveInstanceEvent, RayTracingSceneMoveInstanceEvent>;

struct RayTracingSceneUpdateInfo {
    ccstd::vector<RayTracingUpdateEvent> events;
};

using AccelerationStructurePtr = IntrusivePtr<gfx::AccelerationStructure>;

struct RayTracingSceneAccelerationStructureManager final {

    std::optional<AccelerationStructurePtr> checkExistingBlas(const gfx::AccelerationStructureInfo& info) {
        return {};
    }

    auto createBlas(const gfx::AccelerationStructureInfo& info) {
        auto blas = gfx::Device::getInstance()->createAccelerationStructure(info);
        blas->build();
        blas->compact();
        _geomBlasCache.emplace();
        return blas;
    }

    AccelerationStructurePtr registry(const gfx::AccelerationStructureInfo& info) {
        auto result = checkExistingBlas(info);
        if (result) {
            return result.value();
        }
        return createBlas(info);
    }
private:
    /*
     * first: blas's uuid
     * second: blas ref
     */
    ccstd::unordered_map<uint64_t, AccelerationStructurePtr> _geomBlasCache;
};

enum class AllocationPolicy {
    BEST_FIT,
    WORST_FIT,
    FIRST_FIT,
    NEXT_FIT
};

template <typename BlockType, typename Derived>
struct ArenaAllocatorBase {
    static_assert(std::is_trivially_copyable<BlockType>::value);
    static_assert(!std::is_abstract<BlockType>::value);
    using ConsecutiveBlocks = std::vector<BlockType>;

    int allocate(const ConsecutiveBlocks& blocks) {
        int offset = -1;
        if (static_cast<Derived*>(this)->use_avaiable_free_blocks(blocks.size(), offset)) {
            std::copy(blocks.cbegin(), blocks.cend(), _blocks.begin() + offset);
            return offset;
        }
        offset = this->_blocks.size();
        this->_blocks.insert(this->_blocks.end(), blocks.cbegin(), blocks.cend());
        return offset;
    }

    void deallocate(const int offset, const size_t size) {
        static_cast<Derived*>(this)->add_free_blocks(offset, size);
    }

    auto data() const {
        return _blocks.data();
    }

    auto size() const {
        return _blocks.size();
    }

protected:
    ConsecutiveBlocks _blocks;
};

template <typename BlockType, AllocationPolicy policy = AllocationPolicy::FIRST_FIT>
struct ArenaAllocator {};

#define ARENA_ALLOCATOR_DEFINITION_START(policy) template <typename BlockType> \
                                                 struct ArenaAllocator<BlockType, policy> : ArenaAllocatorBase<BlockType, ArenaAllocator<BlockType, (policy)>> {

#define ARENA_ALLOCATOR_DEFINITION_END(policy) };

/***********************************************************
 *  Best Fit Policy
 ***********************************************************/

ARENA_ALLOCATOR_DEFINITION_START(AllocationPolicy::BEST_FIT)

struct customLess {
    bool operator()(const std::pair<int, int>& l, const std::pair<int, int>& r) const {
        return l.second - l.first > r.second - r.first;
    }
};

bool use_avaiable_free_blocks(const int size, int& offset) {
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, customLess> new_map;
    bool find = false;
    for (; !free_blocks_max_heap.empty(); free_blocks_max_heap.pop()) {
        std::pair<int,int> fb = free_blocks_max_heap.top();
        if (fb.second-fb.first>size) {
            find = true;
            offset = fb.first;
            fb.first += size;
            if (fb.first<fb.second) {
                new_map.push(fb);   
            }
        }else {
            new_map.push(fb);
        }
    }
    free_blocks_max_heap = new_map;
    return find;
}

void add_free_blocks(const int offset, const int size) {

}

private:
std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>> ,customLess> free_blocks_max_heap{};
ARENA_ALLOCATOR_DEFINITION_END(AllocationPolicy::BEST_FIT)

/***********************************************************
 *  Worst Fit Policy
 ***********************************************************/

ARENA_ALLOCATOR_DEFINITION_START(AllocationPolicy::WORST_FIT)

bool use_avaiable_free_blocks(const int size, int& offset) {
    std::cout << "use worst fit policy\n";
    return false;
}

void add_free_blocks(const int offset, const int size) {

}

struct customGreater {
    bool operator()(const std::pair<int, int>& l, const std::pair<int, int>& r) const {
        return l.second - l.first < r.second - r.first;
    }
};

private:
std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, customGreater> free_blocks_min_heap;

ARENA_ALLOCATOR_DEFINITION_END(AllocationPolicy::WORST_FIT)

/***********************************************************
 *  First Fit Policy
 ***********************************************************/

ARENA_ALLOCATOR_DEFINITION_START(AllocationPolicy::FIRST_FIT)

bool use_avaiable_free_blocks(const int size, int& offset) {
    for (auto free_block_it = free_blocks_list.begin(); free_block_it != free_blocks_list.end(); ++free_block_it) {
        assert(free_block_it->second >= free_block_it->first);
        if (free_block_it->second - free_block_it->first + 1 >= size) {
            free_block_it->first += size;
            if (free_block_it->first >= free_block_it->second) {
                free_blocks_list.erase(free_block_it);
            }
            return true;
        }
    }
    return false;
}

void add_free_blocks(const int offset, const int size) {
    if (!merge_free_blocks(offset, offset + size)) {
        free_blocks_list.emplace_back(offset, offset + size);
    }
}

private:
bool merge_free_blocks(int start, int end) {
    auto front_merge_target = free_blocks_list.end();
    auto rear_merge_target = free_blocks_list.end();

    for (auto fb = free_blocks_list.begin(); fb != free_blocks_list.end(); ++fb) {
        if (fb->second == start - 1) {
            fb->second = end;
            front_merge_target = fb;
        }

        if (fb->first == end + 1) {
            fb->first = start;
            rear_merge_target = fb;
        }
    }

    if (front_merge_target == free_blocks_list.end() && rear_merge_target == free_blocks_list.end()) {
        return false;
    }

    if (front_merge_target != free_blocks_list.end() && rear_merge_target != free_blocks_list.end()) {
        front_merge_target->second = rear_merge_target->second;
        free_blocks_list.erase(rear_merge_target);
    }

    return true;
}

std::list<std::pair<int, int>> free_blocks_list;
ARENA_ALLOCATOR_DEFINITION_END(AllocationPolicy::FIRST_FIT)

/***********************************************************
 *  Next Fit Policy
 ***********************************************************/

ARENA_ALLOCATOR_DEFINITION_START(AllocationPolicy::NEXT_FIT)

//todo may need a circle list

ARENA_ALLOCATOR_DEFINITION_END(AllocationPolicy::NEXT_FIT)

/*
template <typename BlockType,bool allow_reuse = false>
struct MonotonicPool{

    static_assert(std::is_trivially_copyable<BlockType>::value);
    static_assert(!std::is_abstract<BlockType>::value);
    using PoolIndexType = uint32_t;
    using ConsecutiveBlocks = ccstd::vector<BlockType>;

public:

    PoolIndexType allocate(const ConsecutiveBlocks& consecutive_blocks) {
        if (allow_reuse) {
            auto offset = check_exist(consecutive_blocks);
            if (offset) return offset.value();
        }

        return handle_new_blocks(consecutive_blocks);
    }

    ccstd::vector<PoolIndexType> allocate(const ccstd::vector<ConsecutiveBlocks>& consecutive_blocks_group) {
        return {};
    }

    void free(int first, int last) {
        CC_ASSERT(first <= last);
        CC_ASSERT(last < _blocks.size());

        _blockRefView.dec_ref(first, last);
    }

    size_t size() const noexcept {
        return _blocks.size();
    }

    auto data() const noexcept {
        return _blocks.data();
    }

private:

    std::optional<PoolIndexType> check_exist(const ConsecutiveBlocks& consecutive_blocks) {
        const auto& it = std::search(_blocks.cbegin(), _blocks.cend(), consecutive_blocks.cbegin(), consecutive_blocks.cend());
        if (it != _blocks.cend()) {
            auto offset = std::distance(_blocks.cbegin(), it);
            _blockRefView.inc_ref(offset, consecutive_blocks.size());
            return offset;
        }
        return {};
    }

    PoolIndexType push_back_new_blocks(const ConsecutiveBlocks& consecutive_blocks) {
        auto offset = _blocks.size();
        _blocks.insert(_blocks.end(), consecutive_blocks.cbegin(), consecutive_blocks.cend());
        _blockRefView.push_back_new_blocks(consecutive_blocks.size());
        return offset;
    }

    PoolIndexType use_consecutive_free_block(const PoolIndexType free_block_id, const ConsecutiveBlocks& consecutive_blocks) {
        const auto offset = _blockRefView.use_consecutive_free_block(free_block_id, consecutive_blocks.size());
        std::copy(consecutive_blocks.cbegin(), consecutive_blocks.cend(), _blocks.begin() + offset);
        return offset;
    }

    PoolIndexType handle_new_blocks(const ConsecutiveBlocks& consecutive_blocks) {
        auto block_id = _blockRefView.check_consecutive_free_block(consecutive_blocks.size());
        if (block_id) {
            return use_consecutive_free_block(block_id.value(), consecutive_blocks);
        }else {
            return push_back_new_blocks(consecutive_blocks);
        }
    }

    struct BlockRefView {

        void inc_ref(const PoolIndexType offset, const size_t size) noexcept {
            auto it = block_ref_count.begin() + offset;
            std::for_each(it, it + size, [](auto& i) { ++i; });
        }

        void dec_ref(const PoolIndexType start, const PoolIndexType end) noexcept {
            ccstd::vector<PoolIndexType> stack;
            for (auto i = start;i<end;++i) {
                if (block_ref_count[i]>0) {
                    if (stack.empty()) {
                        stack.push_back(i);
                    }
                }else {
                    if (!stack.empty()) {
                        dec_ref_impl(stack.back(), i - 1);
                        stack.pop_back();
                    }
                }
            }

            if (!stack.empty()) {
                dec_ref_impl(stack.back(), end);
            }
        }

        void push_back_new_blocks(size_t size) {
            block_ref_count.insert(block_ref_count.end(), size, 1);
        }

        PoolIndexType use_consecutive_free_block(const PoolIndexType free_block_id, const size_t size) noexcept {
            auto& free_block = free_blocks[free_block_id];
            inc_ref(free_block.first, size);
            free_block.first += size;
            if (free_block.first>free_block.second) {
                free_blocks.erase(free_blocks.begin() + free_block_id);
            }
            return free_blocks[free_block_id].first;
        }

        std::optional<PoolIndexType> check_consecutive_free_block(const size_t size) const noexcept {
            int free_block_id = 0;
            for (const auto & free_block : free_blocks) {
                assert(free_block.second >= free_block.first);
                if (free_block.second - free_block.first + 1 >= size) {
                    return free_block_id;
                }
                free_block_id++;
            }
            return {};
        }

        uint32_t get_ref_count(PoolIndexType idx) {
            return block_ref_count[idx];
        }

    private:

        bool merge_free_blocks(PoolIndexType start, PoolIndexType end) {
            auto  front_merge_target = free_blocks.end();
            auto rear_merge_target = free_blocks.end();

            for (auto fb = free_blocks.begin(); fb != free_blocks.end();++fb) {
                if (fb->second == start - 1) {
                    fb->second = end;
                    front_merge_target = fb;
                }

                if (fb->first == end + 1) {
                    fb->first = start;
                    rear_merge_target = fb;
                }
            }

            if (front_merge_target == free_blocks.end() && rear_merge_target == free_blocks.end()) {
                return false;
            }

            if (front_merge_target != free_blocks.end() && rear_merge_target != free_blocks.end()) {
                front_merge_target->second = rear_merge_target->second;
                free_blocks.erase(rear_merge_target);
            }

            return true;

        }

        void dec_ref_impl(PoolIndexType start, PoolIndexType end) noexcept {

            for (auto i = start; i < end; ++i) {
                block_ref_count[i]--;
            }

            if (!merge_free_blocks(start,end)) {
                free_blocks.emplace_back(start, end);
            }
        }

        ccstd::vector<std::pair<PoolIndexType, PoolIndexType>> free_blocks;
        ccstd::vector<uint32_t> block_ref_count;
    }_blockRefView;

    ccstd::vector<BlockType> _blocks;
};*/

struct SubMeshGeomDescriptor final {
    uint64_t indexAddress{0};
    uint64_t vertexAddress{0};

    bool operator==(const SubMeshGeomDescriptor& other) const noexcept{
        return indexAddress == other.indexAddress && vertexAddress == other.vertexAddress;
    }
};

using MeshGeometriesDescriptor = ccstd::vector<SubMeshGeomDescriptor>;

using MeshMaterialsDescriptor = ccstd::vector<uint32_t>;

struct MeshShadingDescriptor final {
    // The first submesh geometry position of the Mesh
    uint16_t subMeshGeometryOffset{0};
    // The first submesh material position of the Mesh
    uint16_t subMeshMaterialOffset{0};
    uint16_t subMeshCount{0};
    uint16_t padding{0};

    bool operator==(const MeshShadingDescriptor& other) const noexcept{
        return subMeshCount == other.subMeshCount &&
               subMeshGeometryOffset == other.subMeshGeometryOffset &&
               subMeshMaterialOffset == other.subMeshMaterialOffset;
    }
};

 /*
    Definition:
        G = {g1, g2, ...} as all geometries of the model
        M = {m1, m2, ...} as all materials of the model
        T as the transform of the model
        I = {G,M,T} as a unique instance in the scene

    For I1 = {G1,M1,T1} and I2 = {G2,M2,T2}
        iff G1 = G2, then BLAS could be shared.
        iff G1 = G2 and M1 = M2, then MeshShadingDescriptor could be shared.
*/

struct RayQueryBindingTable final{
private:
    // instanceDecs.geometryOffset + geometryIndex
    /*
     * IA n ：index address of the nth geometry
     * VA n : vertex address of the nth geometry
     *
     * |---------0---------||----2----||---------3---------||--------------5--------------||--------------8--------------||---11----||--------12---------|  geom_offset
     * |----0----|----1----||----2----||----3----|----4----||----5----|----6----|----7----||----8----|----9----|---10----||---11----||---12----|---13----|
     * |IA 0|VA 0|IA 1|VA 1||IA 0|VA 0||IA 0|VA 0|IA 1|VA 1||IA 0|VA 0|IA 1|VA 1|IA 2|VA 2||IA 0|VA 0|IA 1|VA 1|IA 2|VA 2||IA 0|VA 0||IA 0|VA 0|IA 1|VA 1|
     * |-------------------||---------||-------------------||-----------------------------||-----------------------------||---------||-------------------|
     */

    //MonotonicPool<SubMeshGeomDescriptor, true> _geomDesc;
    ArenaAllocator<SubMeshGeomDescriptor> _geomDesc;

    /*
     * matID n : matID of the nth geometry
     *
     * |-------0-------||---2---||-------3-------||-----------5-----------||-----------8-----------||--11---||------12-------|  material_offset
     * |---0---|---1---||---2---||---3---|---4---||---5---|---6---|---7---||---8---|---9---|--10---||--11---||--12---|--13---|
     * |matID 0|matID 1||matID 0||matID 0|matID 1||matID 0|matID 1|matID 2||matID 0|matID 1|matID 2||matID 0||matID 0|matID 1|
     * |---------------||-------||---------------||-----------------------||-----------------------||-------||---------------|
      */

    //MonotonicPool<uint64_t,true> _materialDesc;
    ArenaAllocator<uint64_t> _materialDesc;

    /* |----------------------------------------------||----------------------------------------------||----------------------------------------------|
     * |-------------------descriptor 0---------------||-------------------descriptor 1---------------||-------------------descriptor 2---------------| instanceCustomIndex
     * |geom_offset|material_offset|geom_count|padding||geom_offset|material_offset|geom_count|padding||geom_offset|material_offset|geom_count|padding|
     * |----------------------------------------------||----------------------------------------------||----------------------------------------------|                                     
     */

    //MonotonicPool<MeshShadingDescriptor> _shadingInstanceDescriptors;
    ArenaAllocator<MeshShadingDescriptor> _shadingInstanceDescriptors;

    uint16_t registrySubmeshes(const ccstd::vector<SubMeshGeomDescriptor>& subMeshes);

    uint16_t registryMaterials(const ccstd::vector<uint64_t>& materials);

    void unregistrySubmeshes(const int offset, const int size) noexcept{
        _geomDesc.deallocate(offset, size);
    }

    void unregistryMaterials(const int offset, const int size) noexcept{
        _materialDesc.deallocate(offset, size);
    }

public:

    IntrusivePtr<gfx::Buffer> _geomDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _materialDescGPUBuffer;
    IntrusivePtr<gfx::Buffer> _instanceDescGPUBuffer;

    uint32_t registry(const ccstd::vector<RayTracingGeometryShadingDescriptor>& shadingGeometries);

    void unregistry(const gfx::ASInstance & a) {
        const auto offset = a.instanceCustomIdx;
        const auto size = a.accelerationStructureRef->getInfo().triangleMeshes.size();
        unregistrySubmeshes(offset,size);
        unregistryMaterials(offset,size);
    }
  
    void recreate();

    void update() {
        _geomDescGPUBuffer->update(_geomDesc.data());
        _instanceDescGPUBuffer->update(_shadingInstanceDescriptors.data());
    }
};

/*
 * first: subMesh Geometry info descriptor
 * second: material identifier
 */

using ShaderRecord = std::pair<SubMeshGeomDescriptor,uint64_t>;

/*
 * IA n ：index address of the nth geometry
 * VA n : vertex address of the nth geometry
 * matID n : matID of the nth geometry
 *
 * |-----------------0-----------------||--------2--------||-----------------3-----------------||--------------------------5--------------------------|  SBTRecordOffset
 * |--------0--------|--------1--------||--------2--------||--------3--------|--------4--------||--------5--------|--------6--------|--------7--------| 
 * |IA 0|VA 0|matID 0|IA 1|VA 1|matID 1||IA 0|VA 0|matID 0||IA 0|VA 0|matID 0|IA 1|VA 1|matID 1||IA 0|VA 0|matID 0|IA 1|VA 1|matID 1|IA 2|VA 2|matID 2|
 * |-----------------------------------||-----------------||-----------------------------------||-----------------------------------------------------|
 */

struct RayTracingBindingTable final{

    //using ShaderRecordList = MonotonicPool<ShaderRecord,true>;
    using ShaderRecordList = ArenaAllocator<ShaderRecord>;

    ShaderRecordList _hitGroup;
    uint32_t registry(const ccstd::vector<RayTracingGeometryShadingDescriptor>& shadingGeometries) {
        ccstd::vector<ShaderRecord> shaderRecords;
        shaderRecords.reserve(shadingGeometries.size());
        std::transform(shadingGeometries.cbegin(), shadingGeometries.cend(), std::back_inserter(shaderRecords), [&](const RayTracingGeometryShadingDescriptor& geom) {
            const auto& meshDescriptor = geom.meshDescriptor;
            if (meshDescriptor) {
                return ShaderRecord{SubMeshGeomDescriptor{meshDescriptor.value().indexBuffer->getDeviceAddress(), meshDescriptor.value().vertexBuffer->getDeviceAddress()},geom.materialID};
            }
            return ShaderRecord{SubMeshGeomDescriptor{~0U, ~0U}, geom.materialID};
        });
        return _hitGroup.allocate(shaderRecords);
    }

    void unregistry(const gfx::ASInstance& a) {
        const auto offset = a.shaderBindingTableRecordOffset;
        const auto size = a.accelerationStructureRef->getInfo().triangleMeshes.size();
        _hitGroup.deallocate(offset, size);
    }
};

} // namespace pipeline
} // namespace cc
