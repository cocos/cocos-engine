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

#ifndef Spine_Property_h
#define Spine_Property_h

namespace spine {
	typedef long long PropertyId;
	enum Property {
		Property_Rotate = 1 << 0,
		Property_X = 1 << 1,
		Property_Y = 1 << 2,
		Property_ScaleX = 1 << 3,
		Property_ScaleY = 1 << 4,
		Property_ShearX = 1 << 5,
		Property_ShearY = 1 << 6,
        Property_Inherit = 1 << 7,
		Property_Rgb = 1 << 8,
		Property_Alpha = 1 << 9,
		Property_Rgb2 = 1 << 10,
		Property_Attachment = 1 << 11,
		Property_Deform = 1 << 12,
		Property_Event = 1 << 13,
		Property_DrawOrder = 1 << 14,
		Property_IkConstraint = 1 << 15,
		Property_TransformConstraint = 1 << 16,
		Property_PathConstraintPosition = 1 << 17,
		Property_PathConstraintSpacing = 1 << 18,
		Property_PathConstraintMix = 1 << 19,
        Property_PhysicsConstraintInertia = 1 << 20,
        Property_PhysicsConstraintStrength = 1 << 21,
        Property_PhysicsConstraintDamping = 1 << 22,
        Property_PhysicsConstraintMass = 1 << 23,
        Property_PhysicsConstraintWind = 1 << 24,
        Property_PhysicsConstraintGravity = 1 << 25,
        Property_PhysicsConstraintMix = 1 << 26,
        Property_PhysicsConstraintReset = 1 << 27,
		Property_Sequence = 1 << 28
	};
}

#endif /* Spine_Property_h */
