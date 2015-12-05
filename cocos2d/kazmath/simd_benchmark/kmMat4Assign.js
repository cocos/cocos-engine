// kmMat4Assign

(function () {

  // Kernel configuration
  var kernelConfig = {
    kernelName:       "kmMat4Assign",
    kernelInit:       init,
    kernelCleanup:    cleanup,
    kernelSimd:       simd,
    kernelNonSimd:    nonSimd,
    kernelIterations: 10000
  };

  // Hook up to the harness
  benchmarks.add(new Benchmark(kernelConfig));

  // Benchmark data, initialization and kernel functions
  var T1 = new cc.kmMat4();
  var T2 = new cc.kmMat4();
  var T1x4 = new cc.kmMat4();
  var T2x4 = new cc.kmMat4();

  function equals(A, B) {
    for (var i = 0; i < 16; ++i) {
      if (A[i] != B[i])
        return false;
    }
    return true;
  }

  function init() {
    T1.mat[0] = 1.0;
    T1.mat[5] = 1.0;
    T1.mat[10] = 1.0;
    T1.mat[15] = 1.0;

    T1x4.mat[0] = 1.0;
    T1x4.mat[5] = 1.0;
    T1x4.mat[10] = 1.0;
    T1x4.mat[15] = 1.0;

    nonSimd(1);
    simd(1);

    return equals(T1.mat, T1x4.mat) && equals(T2.mat, T2x4.mat);
    
  }

  function cleanup() {
    return init(); // Sanity checking before and after are the same
  }

  function nonSimd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4Assign(T2, T1);
      T2.assignFrom(T1);
    }
  }

  function simd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4AssignSIMD(T2x4, T1x4);
      T2x4.assignFromSIMD(T1x4);
    }
  }

} ());
