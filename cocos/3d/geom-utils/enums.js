
/**
 * Orders matter, it decides the priority when calling intersection functions
 */
export default {
  SHAPE_RAY: 1,
  SHAPE_LINE: 2,
  SHAPE_SPHERE: 4,
  SHAPE_BOX: 8,
  SHAPE_PLANE: 16,
  SHAPE_TRIANGLE: 32,
  SHAPE_FRUSTUM: 64,
  SHAPE_FRUSTUM_ACCURATE: 128,
};