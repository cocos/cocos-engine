export default {
    floatsPerVert: 6,
    verticesFloats: 4 * 6,

    uvOffset: 3,
    colorOffset: 5,

    getBuffer (renderer) {
        return renderer._meshBuffer3D;
    },
};
