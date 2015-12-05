// kmMat4Transpose

(function () {

  // Kernel configuration
  var kernelConfig = {
    kernelName:       "kmMat4Transpose",
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

  function init() {
    T1.mat [0]  =  0;  T1.mat[1] =  1; T1.mat[2]  =  2; T1.mat[3]  =  3;
    T1.mat [4]  = -1; T1.mat[5]  = -2; T1.mat[6]  = -3; T1.mat[7]  = -4;
    T1.mat [8]  =  0;  T1.mat[9] =  0; T1.mat[10] =  2; T1.mat[11] =  3;
    T1.mat [12] = -1; T1.mat[13] = -2; T1.mat[14] =  0; T1.mat[15] = -4;

    T1x4.mat [0]  =  0;  T1x4.mat[1] =  1; T1x4.mat[2]  =  2; T1x4.mat[3]  =  3;
    T1x4.mat [4]  = -1; T1x4.mat[5]  = -2; T1x4.mat[6]  = -3; T1x4.mat[7]  = -4;
    T1x4.mat [8]  =  0;  T1x4.mat[9] =  0; T1x4.mat[10] =  2; T1x4.mat[11] =  3;
    T1x4.mat [12] = -1; T1x4.mat[13] = -2; T1x4.mat[14] =  0; T1x4.mat[15] = -4;

    nonSimd(1);
    //printMatrix(T2.mat);
    simd(1);
    //printMatrix(T2x4.mat);
    return equals(T1.mat, T1x4.mat) && equals(T2.mat, T2x4.mat);
    
  }

  function cleanup() {
    return init(); // Sanity checking before and after are the same
  }

  function nonSimd(n) {
    for (var i = 0; i < n; i++) {
      T2 = T1.transpose();
      //T1.transpose();
    }
  }

  function simd(n) {
    for (var i = 0; i < n; i++) {
      T2x4 = T1x4.transposeSIMD();
      //T1x4.transposeSIMD();
    }
  }

} ());
