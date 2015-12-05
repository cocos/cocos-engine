// kmMat4LookAt

(function () {

  // Kernel configuration
  var kernelConfig = {
    kernelName:       "kmMat4LookAt",
    kernelInit:       init,
    kernelCleanup:    cleanup,
    kernelSimd:       simd,
    kernelNonSimd:    nonSimd,
    kernelIterations: 10000
  };

  // Hook up to the harness
  benchmarks.add(new Benchmark(kernelConfig));

  // Benchmark data, initialization and kernel functions
  var eye = new cc.kmVec3(), center = new cc.kmVec3(), up = new cc.kmVec3();
  var T1 = new cc.kmMat4();
  var eye1 = new cc.kmVec3(), center1 = new cc.kmVec3(), up1 = new cc.kmVec3();
  var T1x4 = new cc.kmMat4();

  function printMatrix(matrix) {
    print('--------matrix----------');
    for (var r = 0; r < 4; ++r) {
      var str = "";
      var ri = r*4;
      for (var c = 0; c < 4; ++c) {
        var value = matrix[ri + c];
        str += " " + value.toFixed(2);
      }
      print(str);
    }
  }

  function equals(A, B) {
    for (var i = 0; i < 16; ++i) {
      if (Math.abs (A[i] - B[i]) > 0.001) {
        return false;
      }
    }
    return true;
  }

  function init() {
    
    eye.fill(0, 1, 2);
    center.fill(2, 1, 0);
    up.fill(1, 1, 1);

    eye1.fill(0, 1, 2);
    center1.fill(2, 1, 0);
    up1.fill(1, 1, 1);
    /*
    eye1.data[0] = 0;
    eye1.data[1] = 1;
    eye1.data[2] = 2;

    center1.data[0] = 2;
    center1.data[1] = 1;
    center1.data[2] = 0;

    up1.data[0] = 1;
    up1.data[1] = 1;
    up1.data[2] = 1;
    */
    nonSimd(1);
    //printMatrix(T1.mat);
    simd(1);
    //printMatrix(T1x4.mat);

    return equals(T1.mat, T1x4.mat);
  }

  function cleanup() {
    return init(); // Sanity checking before and after are the same
  }

  function nonSimd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4LookAt(T1, eye, center, up);
      T1.lookAt(eye, center, up);
    }
  }

  function simd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4LookAtSIMD(T1x4, eye1, center1, up1);
      T1x4.lookAtSIMD(eye1, center1, up1);
    }
  }

} ());
