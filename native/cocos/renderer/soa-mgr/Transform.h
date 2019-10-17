#ifndef __TRANSFORM_H__
#define __TRANSFORM_H__

#include "SoA/SoAMath.h"

CC_NAMESPACE_BEGIN
//using namespace std;
typedef vector<Byte*>	MemPoolVec;

class SceneNode;

enum TransformMemoryType
{
	TMT_PARENT = 0,
	TMT_OWNER,
	TMT_POSITION,
	TMT_ROTATION,
	TMT_SCALE,
	TMT_WORLD_POSITION,
	TMT_WORLD_ROTATION,
	TMT_WORLD_SCALE,
	TMT_WORLD_MATRIX,
	//TMT_INHERIT_ROTATION,
	//TMT_INHERIT_SCALE,
	TMT_COUNT,
};

/** Represents the transform of a single object, arranged in SoA (Structure of Arrays) */
struct Transform
{
	// Which of the packed values is ours. Value in range [0; 4) for SSE2
	Byte		idx;

	// Holds the pointers to each parent. Ours is mParents[mIndex]
	Transform	**parents;

	// The transform that owns this Transform. Ours is mOwner[mIndex]
	Transform	**owners;

	// Stores the position/translation of a node relative to its parent.
	SoAVec3		* CC_RESTRICT positions;

	// Stores the orientation of a node relative to it's parent.
	SoAQuat		* CC_RESTRICT rotations;

	// Stores the scaling factor applied to a node
	SoAVec3		* CC_RESTRICT scales;

	// Caches the combined position from all parent nodes.
	SoAVec3		* CC_RESTRICT worldPositions;

	// Caches the combined orientation from all parent nodes.
	SoAQuat		* CC_RESTRICT worldRotations;

	// Caches the combined scale from all parent nodes.
	SoAVec3		* CC_RESTRICT worldScales;

	// Caches the full transform into a 4x4 matrix.
	SoAMat4		* CC_RESTRICT matWorlds;

	Transform() :
	idx(0),
	parents(NULL),
	owners(NULL),
	positions(NULL),
	rotations(NULL),
	scales(NULL),
	worldPositions(NULL),
	worldRotations(NULL),
	worldScales(NULL),
	matWorlds(NULL)
	{
	}

    /** Copies all the scalar data from the parameter into this
    @remarks
        A normal "=" operator, or an assignment constructor Transform( Transform & )
        wouldn't work. This is because ArrayVector3 & co. would try to copy all the
        packed values, while we just want the scalar ones.

        Furthermore, it would be confusing, because it would be not clear whether
        those two options should memcpy memory, or rebase the pointers, hence
        explicit functions are much preferred. @See rebasePtrs

        Note that we do NOT copy the mIndex member.
    */
    void copy(const Transform &inCopy)
    {
        parents[idx] = inCopy.parents[inCopy.idx];
        owners[idx] = inCopy.owners[inCopy.idx];

        //Position
		positions->fromVec3(inCopy.positions->getVec3(inCopy.idx), idx);

        //Orientation
		rotations->fromQuat(inCopy.rotations->getQuat(inCopy.idx), idx);

        //Scale
		scales->fromVec3(inCopy.scales->getVec3(inCopy.idx), idx);

        //Derived position
		worldPositions->fromVec3(inCopy.worldPositions->getVec3(inCopy.idx), idx);

        //Derived orientation
		worldRotations->fromQuat(inCopy.worldRotations->getQuat(inCopy.idx), idx);

        //Derived scale
		worldScales->fromVec3(inCopy.worldScales->getVec3(inCopy.idx), idx);

		//matWorlds[idx] = inCopy.matWorlds[idx];

		matWorlds->fromMat4(inCopy.matWorlds->getMat4(inCopy.idx), idx);
    }

	/** Rebases all the pointers from our SoA structures so that they point to a new location
		calculated from a base pointer, and a difference offset. The index is assumed to stay the same
	*/
	void rebasePtrs(const MemPoolVec &newBasePtrs, const ptrdiff_t diff)
	{
		parents = reinterpret_cast<Transform**>(newBasePtrs[TMT_PARENT] + diff);
		owners = reinterpret_cast<Transform**>(newBasePtrs[TMT_OWNER] + diff);
		positions = reinterpret_cast<SoAVec3*>(newBasePtrs[TMT_POSITION] + diff);
		rotations = reinterpret_cast<SoAQuat*>(newBasePtrs[TMT_ROTATION] + diff);
		scales = reinterpret_cast<SoAVec3*>(newBasePtrs[TMT_SCALE] + diff);
		worldPositions = reinterpret_cast<SoAVec3*>(newBasePtrs[TMT_WORLD_POSITION] + diff);
		worldRotations = reinterpret_cast<SoAQuat*>(newBasePtrs[TMT_WORLD_ROTATION] + diff);
		worldScales	= reinterpret_cast<SoAVec3*>(newBasePtrs[TMT_WORLD_SCALE] + diff);
		matWorlds = reinterpret_cast<SoAMat4*>(newBasePtrs[TMT_WORLD_MATRIX] + diff);
	}

	/** Advances all pointers to the next pack, i.e. if we're processing 4 elements at a time, move to
		the next 4 elements.
	*/
	void advancePack()
	{
		parents				+= ARRAY_PACKED_FLOATS;
		owners				+= ARRAY_PACKED_FLOATS;
		++positions;
		++rotations;
		++scales;
		++worldPositions;
		++worldRotations;
		++worldScales;
		++matWorlds;
	}

	void advancePack(size_t numAdvance)
	{
		size_t offset = ARRAY_PACKED_FLOATS * numAdvance;
		parents += offset;
		owners += offset;
		positions += numAdvance;
		rotations += numAdvance;
		scales += numAdvance;
		worldPositions += numAdvance;
		worldRotations += numAdvance;
		worldScales += numAdvance;
		matWorlds += numAdvance;
	}

	Transform * getParent()
	{
		return parents[idx];
	}
	void setParent(Transform* parent)
	{
		parents[idx] = parent;
	}

	Vec3 getPosition()
	{
		return positions->getVec3(idx);
	}

	void printPosition()
	{
		printf("transform position x: %f, y: %f, z: %f \n", getPosition().x, getPosition().y, getPosition().z);
	}

	void setPosition(Vec3& vec)
	{
		positions->fromVec3(vec, idx);
		//printf("position x: %f, y: %f, z: %f", getPosition().x, getPosition().y, getPosition().z);
	}

	Quat getRotation()
	{
		return rotations->getQuat(idx);
	}

	void setRotation(Quat & q)
	{
		rotations->fromQuat(q, idx);
	}

	Vec3 getScale()
	{
		return scales->getVec3(idx);
	}

	void setScale(Vec3& vec)
	{
		scales->fromVec3(vec, idx);
	}

	Vec3 getWorldPosition()
	{
		return worldPositions->getVec3(idx);
	}

	void setWorldPosition(Vec3& vec)
	{
		//find where the transform would end up in parent's local space
		if (parents[idx])
		{
			Vec3 lpos = parents[idx]->convertWorldToLocalPosition(vec);
			setPosition(lpos);

			vec = lpos;
		}
		else
		{
			setPosition(vec);
		}

	
	}

	Quat getWorldRotation()
	{
		return worldRotations->getQuat(idx);
	}

	void setWorldRotation(Quat & q)
	{
		//find where the transform would end up in parent's local space
		if (parents[idx])
		{
			Quat lrot = parents[idx]->convertWorldToLocalRotation(q);
			setRotation(lrot);

			q = lrot;
		}
		else
		{
			setRotation(q);
		}
	}

	Vec3 getWorldScale()
	{
		return worldScales->getVec3(idx);
	}

	void setWorldScale(Vec3& vec)
	{
		if (parents[idx]) 
		{
			Vec3 lscale = parents[idx]->convertWorldToLocalScale(vec);
            setScale(lscale);
			vec = lscale;
        } 
		else 
		{
            setScale(vec);
        }
	}

	Mat4 getWorldMat()
	{
		return matWorlds->getMat4(idx);
	}

	void setWorldMat(Mat4& m)
	{
		matWorlds->fromMat4(m, idx);
	}

	Vec3 convertWorldToLocalPosition(const Vec3& worldPos)
	{
		SoAVec3 soaWorldPos;
		soaWorldPos.set(worldPos);

		SoAQuat* pWorldRot = worldRotations;
		pWorldRot->inverse();

		soaWorldPos = (*pWorldRot) * (soaWorldPos - (*worldPositions)) / (*worldScales);
		return soaWorldPos.getVec3(idx);
	}

	Vec3 convertLocalToWorldPosition(const Vec3& localPos)
	{
		SoAVec3 soaLocalPos;
		soaLocalPos.set(localPos);
		soaLocalPos = ((*worldRotations) * (soaLocalPos * (*worldScales))) + (*worldPositions);
		return soaLocalPos.getVec3(idx);
	}

	Quat convertWorldToLocalRotation(const Quat& worldRot)
	{
		Quat quat = worldRotations->getQuat(idx);
		quat.inverse();
		return quat * worldRot;
	}

	Quat convertLocalToWorldRotation(const Quat& localRot)
	{
		return worldRotations->getQuat(idx) * localRot;
	}

	Vec3 convertWorldToLocalScale(const Vec3& worldScale)
	{
		SoAVec3 soaWorldScale;
		soaWorldScale.set(worldScale);

		soaWorldScale = (*worldScales) / (soaWorldScale);
		return soaWorldScale.getVec3(idx);
	}

	void updateForce()
	{
		//printf("enter updateForce()");
		if(parents)
		{
			//printf("idx : %d\n", idx);
			parents[idx]->updateForce();
		}
		else
		{
			return;
		}
		

		//Retrieve from parents. Unfortunately we need to do SoA -> AoS -> SoA conversion
		SoAMat4 matWorldP;
		for(size_t i = 0; i < ARRAY_PACKED_FLOATS; ++i)
		{
			Transform *transformP = parents[i];

			matWorldP.fromMat4(transformP->matWorlds->getMat4(transformP->idx), i);
		}

		SoAMat4 matLocal;
		matLocal.compose(*positions, *scales, *rotations);

		*matWorlds = matWorldP * matLocal;
		matWorlds->decompose(*worldPositions, *worldScales, *worldRotations);


		//printf("out updateForce() \n");
	}
};

CC_NAMESPACE_END

#endif
