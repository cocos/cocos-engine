// kmMat4Inverse

(function () {

  // Kernel configuration
  var kernelConfig = {
    kernelName:       "kmMat4Inverse",
    kernelInit:       init,
    kernelCleanup:    cleanup,
    kernelSimd:       simd,
    kernelNonSimd:    nonSimd,
    kernelIterations: 10000
  };

  // Hook up to the harness
  benchmarks.add(new Benchmark(kernelConfig));

  // Benchmark data, initialization and kernel functions
  var src = new cc.kmMat4();
  var dst = new cc.kmMat4();
  var srcx4 = new cc.kmMat4();
  var dstx4 = new cc.kmMat4();
  var ident = new Float32Array(
                    [1,0,0,0,
                     0,1,0,0,
                     0,0,1,0,
                     0,0,0,1]);

  function equals(A, B) {
    for (var i = 0; i < 16; ++i) {
      if (Math.abs (A[i] - B[i]) > 5)
        return false;
    }
    return true;
  }

  function initMatrix(matrix) {
    // These values were chosen somewhat randomly, but they will at least yield a solution.
    matrix [0]  =  0;  matrix[1] =  1; matrix[2]  =  2; matrix[3]  =  3;
    matrix [4]  = -1; matrix[5]  = -2; matrix[6]  = -3; matrix[7]  = -4;
    matrix [8]  =  0;  matrix[9] =  0; matrix[10] =  2; matrix[11] =  3;
    matrix [12] = -1; matrix[13] = -2; matrix[14] =  0; matrix[15] = -4;
  }

  function mulMatrix(dst, op1, op2) {
    for (var r = 0; r < 4; ++r) {
      for (var c = 0; c < 4; ++c) {
        var ri = 4*r;
        dst[ri + c] = op1[ri]*op2[c] + op1[ri+1]*op2[c+4] + op1[ri+2]*op2[c+8] + op1[ri+3]*op2[c+12];
      }
    }
  }

  function printMatrix(matrix, str) {
    print('--------matrix ' + str + '----------');
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

  function checkMatrix(src, dst) {
    // when multiplied with the src matrix it should yield the identity matrix
    var tmp   = new Float32Array(16);
    mulMatrix(tmp, src, dst);
    for (var i = 0; i < 16; ++i) {
      if (Math.abs (tmp[i] - ident[i]) > 0.00001) {
        return false;
      }
    }
    return true;
  }

  function init() {
    initMatrix(src.mat);
    // printMatrix(src);
    nonSimd(1);
    // printMatrix(dst);
    if (!checkMatrix(src.mat, dst.mat)) {
      return false;
    }

    initMatrix(srcx4.mat);
    simd(1);
    // printMatrix(dst);
    if (!checkMatrix(srcx4.mat, dstx4.mat)) {
      return false;
    }

    return true;
  }

  function cleanup() {
    return init(); // Sanity checking before and after are the same
  }

  function nonSimd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4Inverse(dst, src);
      dst = src.inverse();
    }
  }

  function simd(n) {
    for (var i = 0; i < n; i++) {
      //cc.kmMat4InverseSIMD(dstx4, srcx4);
      dstx4 = srcx4.inverseSIMD();
    }
  }

} ());
