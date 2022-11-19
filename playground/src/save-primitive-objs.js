function write (name) {
  const text = cc.primitives.toWavefrontOBJ(cc.primitives[name](), 100);
  const blob = new Blob([text], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = `${name}.obj`;
  anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
  anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
  anchor.click();
}

// write('box');
// write('sphere');
// write('cylinder');
write('cone');
// write('capsule');
// write('torus');
// write('plane');
// write('quad');
