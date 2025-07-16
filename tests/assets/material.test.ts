test('Material hash', () => {
});

// This doesn't work until we do `cc.game.init` properly (and perhaps headlessly) at start up
// test('Material hash', () => {
//     const mat1 = new Material();
//     const mat2 = new Material();
//     mat1.initialize({ effectName: 'builtin-unlit' });
//     mat2.initialize({ effectName: 'builtin-unlit', defines: { USE_TEXTURE: true } });

//     const hash1 = mat1.hash;
//     const hash2 = mat2.hash;

//     const node = new Node();
//     const comp = node.addComponent(MeshRenderer);
//     comp.material = mat1;

//     strictEqual(comp.material.hash, hash1);
//     strictEqual(comp.sharedMaterial.hash, hash1);

//     comp.material = mat2;

//     strictEqual(comp.material.hash, hash2);
//     strictEqual(comp.sharedMaterial.hash, hash2);
// });
