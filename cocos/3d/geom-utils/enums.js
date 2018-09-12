
/**
 * Orders matter, it decides the priority when calling intersection functions
 */
export default {
  SHAPE_RAY: (1 << 0),
  SHAPE_LINE: (1 << 1),
  SHAPE_SPHERE: (1 << 2),
  SHAPE_AABB: (1 << 3),
  SHAPE_OBB: (1 << 4),
  SHAPE_PLANE: (1 << 5),
  SHAPE_TRIANGLE: (1 << 6),
  SHAPE_FRUSTUM: (1 << 7),
  SHAPE_FRUSTUM_ACCURATE: (1 << 8),
};