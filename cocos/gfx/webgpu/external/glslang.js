
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(Module) {
  Module = Module || {};


var c;c||(c=typeof Module !== 'undefined' ? Module : {});var r,t;c.ready=new Promise(function(b,d){r=b;t=d});
c.compileGLSLZeroCopy=function(b,d,e,f){e=!!e;switch(d){case "vertex":var h=0;break;case "fragment":h=4;break;case "compute":h=5;break;default:throw Error("shader_stage must be 'vertex', 'fragment', or 'compute'.");}switch(f||"1.0"){case "1.0":var g=65536;break;case "1.1":g=65792;break;case "1.2":g=66048;break;case "1.3":g=66304;break;case "1.4":g=66560;break;case "1.5":g=66816;break;default:throw Error("spirv_version must be '1.0' ~ '1.5'.");}f=c._malloc(4);d=c._malloc(4);var m=aa([b,h,e,g,f,d]);
e=u(f);b=u(d);c._free(f);c._free(d);if(0===m)throw Error("GLSL compilation failed");f={};e/=4;f.data=c.HEAPU32.subarray(e,e+b);f.free=function(){c._destroy_output_buffer(m)};return f};c.compileGLSL=function(b,d,e,f){b=c.compileGLSLZeroCopy(b,d,e,f);d=b.data.slice();b.free();return d};var v=Object.assign({},c),x="./this.program",y="object"==typeof window,z="function"==typeof importScripts,B="",C;
if(y||z)z?B=self.location.href:"undefined"!=typeof document&&document.currentScript&&(B=document.currentScript.src),_scriptDir&&(B=_scriptDir),0!==B.indexOf("blob:")?B=B.substr(0,B.replace(/[?#].*/,"").lastIndexOf("/")+1):B="",z&&(C=b=>{var d=new XMLHttpRequest;d.open("GET",b,!1);d.responseType="arraybuffer";d.send(null);return new Uint8Array(d.response)});var ba=c.print||console.log.bind(console),D=c.printErr||console.warn.bind(console);Object.assign(c,v);v=null;c.thisProgram&&(x=c.thisProgram);
var E;c.wasmBinary&&(E=c.wasmBinary);var noExitRuntime=c.noExitRuntime||!0;"object"!=typeof WebAssembly&&F("no native wasm support detected");var G,H=!1,I="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;
function J(b,d){for(var e=d+NaN,f=d;b[f]&&!(f>=e);)++f;if(16<f-d&&b.buffer&&I)return I.decode(b.subarray(d,f));for(e="";d<f;){var h=b[d++];if(h&128){var g=b[d++]&63;if(192==(h&224))e+=String.fromCharCode((h&31)<<6|g);else{var m=b[d++]&63;h=224==(h&240)?(h&15)<<12|g<<6|m:(h&7)<<18|g<<12|m<<6|b[d++]&63;65536>h?e+=String.fromCharCode(h):(h-=65536,e+=String.fromCharCode(55296|h>>10,56320|h&1023))}}else e+=String.fromCharCode(h)}return e}
function K(b,d,e,f){if(0<f){f=e+f-1;for(var h=0;h<b.length;++h){var g=b.charCodeAt(h);if(55296<=g&&57343>=g){var m=b.charCodeAt(++h);g=65536+((g&1023)<<10)|m&1023}if(127>=g){if(e>=f)break;d[e++]=g}else{if(2047>=g){if(e+1>=f)break;d[e++]=192|g>>6}else{if(65535>=g){if(e+2>=f)break;d[e++]=224|g>>12}else{if(e+3>=f)break;d[e++]=240|g>>18;d[e++]=128|g>>12&63}d[e++]=128|g>>6&63}d[e++]=128|g&63}}d[e]=0}}var L,M,N,ca,O,P,da,ea;
function fa(){var b=G.buffer;L=b;c.HEAP8=M=new Int8Array(b);c.HEAP16=ca=new Int16Array(b);c.HEAP32=O=new Int32Array(b);c.HEAPU8=N=new Uint8Array(b);c.HEAPU16=new Uint16Array(b);c.HEAPU32=P=new Uint32Array(b);c.HEAPF32=da=new Float32Array(b);c.HEAPF64=ea=new Float64Array(b)}var ha=[],ia=[],ja=[];function ka(){var b=c.preRun.shift();ha.unshift(b)}var Q=0,R=null,S=null;
function F(b){if(c.onAbort)c.onAbort(b);b="Aborted("+b+")";D(b);H=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");t(b);throw b;}function la(){return T.startsWith("data:application/octet-stream;base64,")}var T;T="glslang.wasm";if(!la()){var ma=T;T=c.locateFile?c.locateFile(ma,B):B+ma}function na(){var b=T;try{if(b==T&&E)return new Uint8Array(E);if(C)return C(b);throw"both async and sync fetching of the wasm failed";}catch(d){F(d)}}
function ra(){return E||!y&&!z||"function"!=typeof fetch?Promise.resolve().then(function(){return na()}):fetch(T,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+T+"'";return b.arrayBuffer()}).catch(function(){return na()})}function U(b){for(;0<b.length;)b.shift()(c)}
function u(b){var d="i32";d.endsWith("*")&&(d="*");switch(d){case "i1":return M[b>>0];case "i8":return M[b>>0];case "i16":return ca[b>>1];case "i32":return O[b>>2];case "i64":return O[b>>2];case "float":return da[b>>2];case "double":return ea[b>>3];case "*":return P[b>>2];default:F("invalid type for getValue: "+d)}return null}var V={};
function sa(){if(!W){var b={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:x||"./this.program"},d;for(d in V)void 0===V[d]?delete b[d]:b[d]=V[d];var e=[];for(d in b)e.push(d+"="+b[d]);W=e}return W}var W,ta=[null,[],[]];function X(b){return 0===b%4&&(0!==b%100||0===b%400)}var ua=[31,29,31,30,31,30,31,31,30,31,30,31],va=[31,28,31,30,31,30,31,31,30,31,30,31];
function wa(b){for(var d=0,e=0;e<b.length;++e){var f=b.charCodeAt(e);127>=f?d++:2047>=f?d+=2:55296<=f&&57343>=f?(d+=4,++e):d+=3}d=Array(d+1);K(b,d,0,d.length);return d}
function xa(b,d,e,f){function h(a,k,l){for(a="number"==typeof a?a.toString():a||"";a.length<k;)a=l[0]+a;return a}function g(a,k){return h(a,k,"0")}function m(a,k){function l(oa){return 0>oa?-1:0<oa?1:0}var A;0===(A=l(a.getFullYear()-k.getFullYear()))&&0===(A=l(a.getMonth()-k.getMonth()))&&(A=l(a.getDate()-k.getDate()));return A}function w(a){switch(a.getDay()){case 0:return new Date(a.getFullYear()-1,11,29);case 1:return a;case 2:return new Date(a.getFullYear(),0,3);case 3:return new Date(a.getFullYear(),
0,2);case 4:return new Date(a.getFullYear(),0,1);case 5:return new Date(a.getFullYear()-1,11,31);case 6:return new Date(a.getFullYear()-1,11,30)}}function p(a){var k=a.v;for(a=new Date((new Date(a.A+1900,0,1)).getTime());0<k;){var l=a.getMonth(),A=(X(a.getFullYear())?ua:va)[l];if(k>A-a.getDate())k-=A-a.getDate()+1,a.setDate(1),11>l?a.setMonth(l+1):(a.setMonth(0),a.setFullYear(a.getFullYear()+1));else{a.setDate(a.getDate()+k);break}}l=new Date(a.getFullYear()+1,0,4);k=w(new Date(a.getFullYear(),0,
4));l=w(l);return 0>=m(k,a)?0>=m(l,a)?a.getFullYear()+1:a.getFullYear():a.getFullYear()-1}var n=O[f+40>>2];f={H:O[f>>2],G:O[f+4>>2],B:O[f+8>>2],D:O[f+12>>2],C:O[f+16>>2],A:O[f+20>>2],u:O[f+24>>2],v:O[f+28>>2],J:O[f+32>>2],F:O[f+36>>2],I:n?n?J(N,n):"":""};e=e?J(N,e):"";n={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d",
"%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var q in n)e=e.replace(new RegExp(q,"g"),n[q]);var pa="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),qa="January February March April May June July August September October November December".split(" ");n={"%a":function(a){return pa[a.u].substring(0,3)},"%A":function(a){return pa[a.u]},"%b":function(a){return qa[a.C].substring(0,3)},"%B":function(a){return qa[a.C]},
"%C":function(a){return g((a.A+1900)/100|0,2)},"%d":function(a){return g(a.D,2)},"%e":function(a){return h(a.D,2," ")},"%g":function(a){return p(a).toString().substring(2)},"%G":function(a){return p(a)},"%H":function(a){return g(a.B,2)},"%I":function(a){a=a.B;0==a?a=12:12<a&&(a-=12);return g(a,2)},"%j":function(a){for(var k=0,l=0;l<=a.C-1;k+=(X(a.A+1900)?ua:va)[l++]);return g(a.D+k,3)},"%m":function(a){return g(a.C+1,2)},"%M":function(a){return g(a.G,2)},"%n":function(){return"\n"},"%p":function(a){return 0<=
a.B&&12>a.B?"AM":"PM"},"%S":function(a){return g(a.H,2)},"%t":function(){return"\t"},"%u":function(a){return a.u||7},"%U":function(a){return g(Math.floor((a.v+7-a.u)/7),2)},"%V":function(a){var k=Math.floor((a.v+7-(a.u+6)%7)/7);2>=(a.u+371-a.v-2)%7&&k++;if(k)53==k&&(l=(a.u+371-a.v)%7,4==l||3==l&&X(a.A)||(k=1));else{k=52;var l=(a.u+7-a.v-1)%7;(4==l||5==l&&X(a.A%400-1))&&k++}return g(k,2)},"%w":function(a){return a.u},"%W":function(a){return g(Math.floor((a.v+7-(a.u+6)%7)/7),2)},"%y":function(a){return(a.A+
1900).toString().substring(2)},"%Y":function(a){return a.A+1900},"%z":function(a){a=a.F;var k=0<=a;a=Math.abs(a)/60;return(k?"+":"-")+String("0000"+(a/60*100+a%60)).slice(-4)},"%Z":function(a){return a.I},"%%":function(){return"%"}};e=e.replace(/%%/g,"\x00\x00");for(q in n)e.includes(q)&&(e=e.replace(new RegExp(q,"g"),n[q](f)));e=e.replace(/\0\0/g,"%");q=wa(e);if(q.length>d)return 0;M.set(q,b);return q.length-1}
function aa(b){var d="string number boolean number number number".split(" "),e={string:p=>{var n=0;if(null!==p&&void 0!==p&&0!==p){var q=(p.length<<2)+1;n=Y(q);K(p,N,n,q)}return n},array:p=>{var n=Y(p.length);M.set(p,n);return n}},f=c._convert_glsl_to_spirv,h=[],g=0;if(b)for(var m=0;m<b.length;m++){var w=e[d[m]];w?(0===g&&(g=ya()),h[m]=w(b[m])):h[m]=b[m]}b=f.apply(null,h);return b=function(p){0!==g&&za(g);return p}(b)}
var Aa={b:function(){F("")},i:function(b,d,e){N.copyWithin(b,d,d+e)},g:function(b){var d=N.length;b>>>=0;if(2147483648<b)return!1;for(var e=1;4>=e;e*=2){var f=d*(1+.2/e);f=Math.min(f,b+100663296);var h=Math;f=Math.max(b,f);h=h.min.call(h,2147483648,f+(65536-f%65536)%65536);a:{try{G.grow(h-L.byteLength+65535>>>16);fa();var g=1;break a}catch(m){}g=void 0}if(g)return!0}return!1},e:function(b,d){var e=0;sa().forEach(function(f,h){var g=d+e;h=P[b+4*h>>2]=g;for(g=0;g<f.length;++g)M[h++>>0]=f.charCodeAt(g);
M[h>>0]=0;e+=f.length+1});return 0},f:function(b,d){var e=sa();P[b>>2]=e.length;var f=0;e.forEach(function(h){f+=h.length+1});P[d>>2]=f;return 0},h:function(){return 52},c:function(){return 70},a:function(b,d,e,f){for(var h=0,g=0;g<e;g++){var m=P[d>>2],w=P[d+4>>2];d+=8;for(var p=0;p<w;p++){var n=N[m+p],q=ta[b];0===n||10===n?((1===b?ba:D)(J(q,0)),q.length=0):q.push(n)}h+=w}P[f>>2]=h;return 0},d:function(b,d,e,f){return xa(b,d,e,f)}};
(function(){function b(h){c.asm=h.exports;G=c.asm.j;fa();ia.unshift(c.asm.k);Q--;c.monitorRunDependencies&&c.monitorRunDependencies(Q);0==Q&&(null!==R&&(clearInterval(R),R=null),S&&(h=S,S=null,h()))}function d(h){b(h.instance)}function e(h){return ra().then(function(g){return WebAssembly.instantiate(g,f)}).then(function(g){return g}).then(h,function(g){D("failed to asynchronously prepare wasm: "+g);F(g)})}var f={a:Aa};Q++;c.monitorRunDependencies&&c.monitorRunDependencies(Q);if(c.instantiateWasm)try{return c.instantiateWasm(f,
b)}catch(h){return D("Module.instantiateWasm callback failed with error: "+h),!1}(function(){return E||"function"!=typeof WebAssembly.instantiateStreaming||la()||"function"!=typeof fetch?e(d):fetch(T,{credentials:"same-origin"}).then(function(h){return WebAssembly.instantiateStreaming(h,f).then(d,function(g){D("wasm streaming compile failed: "+g);D("falling back to ArrayBuffer instantiation");return e(d)})})})().catch(t);return{}})();
c.___wasm_call_ctors=function(){return(c.___wasm_call_ctors=c.asm.k).apply(null,arguments)};c._convert_glsl_to_spirv=function(){return(c._convert_glsl_to_spirv=c.asm.l).apply(null,arguments)};c._destroy_output_buffer=function(){return(c._destroy_output_buffer=c.asm.m).apply(null,arguments)};c._malloc=function(){return(c._malloc=c.asm.o).apply(null,arguments)};c._free=function(){return(c._free=c.asm.p).apply(null,arguments)};
var ya=c.stackSave=function(){return(ya=c.stackSave=c.asm.q).apply(null,arguments)},za=c.stackRestore=function(){return(za=c.stackRestore=c.asm.r).apply(null,arguments)},Y=c.stackAlloc=function(){return(Y=c.stackAlloc=c.asm.s).apply(null,arguments)},Z;S=function Ba(){Z||Ca();Z||(S=Ba)};
function Ca(){function b(){if(!Z&&(Z=!0,c.calledRun=!0,!H)){U(ia);r(c);if(c.onRuntimeInitialized)c.onRuntimeInitialized();if(c.postRun)for("function"==typeof c.postRun&&(c.postRun=[c.postRun]);c.postRun.length;){var d=c.postRun.shift();ja.unshift(d)}U(ja)}}if(!(0<Q)){if(c.preRun)for("function"==typeof c.preRun&&(c.preRun=[c.preRun]);c.preRun.length;)ka();U(ha);0<Q||(c.setStatus?(c.setStatus("Running..."),setTimeout(function(){setTimeout(function(){c.setStatus("")},1);b()},1)):b())}}
if(c.preInit)for("function"==typeof c.preInit&&(c.preInit=[c.preInit]);0<c.preInit.length;)c.preInit.pop()();Ca();


  return Module.ready
}
);
})();

const initialize = (wasmPath) => {
    return new Promise(resolve => {
        Module({
            locateFile() {
                return wasmPath;
            },
            onRuntimeInitialized() {
                resolve({
                    compileGLSLZeroCopy: this.compileGLSLZeroCopy,
                    compileGLSL: this.compileGLSL,
                });
            },
        });
    });
  };

  let instance;
  export default (wasmPath) => {
      if (!instance) {
          instance = initialize(wasmPath);
      }
      return instance;
  };