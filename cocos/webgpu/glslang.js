
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(Module) {
  Module = Module || {};


var d;d||(d=typeof Module !== 'undefined' ? Module : {});var m=Object.assign,t,v;d.ready=new Promise(function(a,c){t=a;v=c});
d.compileGLSLZeroCopy=function(a,c,e,f){e=!!e;switch(c){case "vertex":var h=0;break;case "fragment":h=4;break;case "compute":h=5;break;default:throw Error("shader_stage must be 'vertex', 'fragment', or 'compute'.");}switch(f||"1.0"){case "1.0":var g=65536;break;case "1.1":g=65792;break;case "1.2":g=66048;break;case "1.3":g=66304;break;case "1.4":g=66560;break;case "1.5":g=66816;break;default:throw Error("spirv_version must be '1.0' ~ '1.5'.");}f=d._malloc(4);c=d._malloc(4);var l=aa([a,h,e,g,f,c]);
e=w(f);a=w(c);d._free(f);d._free(c);if(0===l)throw Error("GLSL compilation failed");f={};e/=4;f.data=d.HEAPU32.subarray(e,e+a);f.free=function(){d._destroy_output_buffer(l)};return f};d.compileGLSL=function(a,c,e,f){a=d.compileGLSLZeroCopy(a,c,e,f);c=a.data.slice();a.free();return c};var x=m({},d),ba="./this.program",ca="object"===typeof window,y="function"===typeof importScripts,A="",B;
if(ca||y)y?A=self.location.href:"undefined"!==typeof document&&document.currentScript&&(A=document.currentScript.src),_scriptDir&&(A=_scriptDir),0!==A.indexOf("blob:")?A=A.substr(0,A.replace(/[?#].*/,"").lastIndexOf("/")+1):A="",y&&(B=function(a){var c=new XMLHttpRequest;c.open("GET",a,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)});var da=d.print||console.log.bind(console),C=d.printErr||console.warn.bind(console);m(d,x);x=null;d.thisProgram&&(ba=d.thisProgram);var D;
d.wasmBinary&&(D=d.wasmBinary);var noExitRuntime=d.noExitRuntime||!0;"object"!==typeof WebAssembly&&E("no native wasm support detected");function w(a){var c="i32";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":return F[a>>0];case "i8":return F[a>>0];case "i16":return ea[a>>1];case "i32":return G[a>>2];case "i64":return G[a>>2];case "float":return fa[a>>2];case "double":return Number(ha[a>>3]);default:E("invalid type for getValue: "+c)}return null}var H,ia=!1;
function aa(a){var c="string number boolean number number number".split(" "),e={string:function(q){var n=0;if(null!==q&&void 0!==q&&0!==q){var r=(q.length<<2)+1;n=I(r);ja(q,J,n,r)}return n},array:function(q){var n=I(q.length);F.set(q,n);return n}},f=d._convert_glsl_to_spirv,h=[],g=0;if(a)for(var l=0;l<a.length;l++){var u=e[c[l]];u?(0===g&&(g=ka()),h[l]=u(a[l])):h[l]=a[l]}a=f.apply(null,h);return a=function(q){0!==g&&la(g);return q}(a)}
var ma="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function K(a,c,e){var f=c+e;for(e=c;a[e]&&!(e>=f);)++e;if(16<e-c&&a.subarray&&ma)return ma.decode(a.subarray(c,e));for(f="";c<e;){var h=a[c++];if(h&128){var g=a[c++]&63;if(192==(h&224))f+=String.fromCharCode((h&31)<<6|g);else{var l=a[c++]&63;h=224==(h&240)?(h&15)<<12|g<<6|l:(h&7)<<18|g<<12|l<<6|a[c++]&63;65536>h?f+=String.fromCharCode(h):(h-=65536,f+=String.fromCharCode(55296|h>>10,56320|h&1023))}}else f+=String.fromCharCode(h)}return f}
function ja(a,c,e,f){if(0<f){f=e+f-1;for(var h=0;h<a.length;++h){var g=a.charCodeAt(h);if(55296<=g&&57343>=g){var l=a.charCodeAt(++h);g=65536+((g&1023)<<10)|l&1023}if(127>=g){if(e>=f)break;c[e++]=g}else{if(2047>=g){if(e+1>=f)break;c[e++]=192|g>>6}else{if(65535>=g){if(e+2>=f)break;c[e++]=224|g>>12}else{if(e+3>=f)break;c[e++]=240|g>>18;c[e++]=128|g>>12&63}c[e++]=128|g>>6&63}c[e++]=128|g&63}}c[e]=0}}var na,F,J,ea,G,fa,ha;
function oa(){var a=H.buffer;na=a;d.HEAP8=F=new Int8Array(a);d.HEAP16=ea=new Int16Array(a);d.HEAP32=G=new Int32Array(a);d.HEAPU8=J=new Uint8Array(a);d.HEAPU16=new Uint16Array(a);d.HEAPU32=new Uint32Array(a);d.HEAPF32=fa=new Float32Array(a);d.HEAPF64=ha=new Float64Array(a)}var L,pa=[],qa=[],ra=[];function sa(){var a=d.preRun.shift();pa.unshift(a)}var M=0,N=null,O=null;d.preloadedImages={};d.preloadedAudios={};
function E(a){if(d.onAbort)d.onAbort(a);a="Aborted("+a+")";C(a);ia=!0;a=new WebAssembly.RuntimeError(a+". Build with -s ASSERTIONS=1 for more info.");v(a);throw a;}function ta(){return P.startsWith("data:application/octet-stream;base64,")}var P;P="glslang.wasm";if(!ta()){var xa=P;P=d.locateFile?d.locateFile(xa,A):A+xa}function ya(){var a=P;try{if(a==P&&D)return new Uint8Array(D);if(B)return B(a);throw"both async and sync fetching of the wasm failed";}catch(c){E(c)}}
function za(){return D||!ca&&!y||"function"!==typeof fetch?Promise.resolve().then(function(){return ya()}):fetch(P,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+P+"'";return a.arrayBuffer()}).catch(function(){return ya()})}function Q(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c(d);else{var e=c.K;"number"===typeof e?void 0===c.F?L.get(e)():L.get(e)(c.F):e(void 0===c.F?null:c.F)}}}var R={};
function Aa(){if(!S){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:ba||"./this.program"},c;for(c in R)void 0===R[c]?delete a[c]:a[c]=R[c];var e=[];for(c in a)e.push(c+"="+a[c]);S=e}return S}var S,Ba=[null,[],[]];function T(a){return 0===a%4&&(0!==a%100||0===a%400)}function U(a,c){for(var e=0,f=0;f<=c;e+=a[f++]);return e}
var V=[31,29,31,30,31,30,31,31,30,31,30,31],W=[31,28,31,30,31,30,31,31,30,31,30,31];function X(a,c){for(a=new Date(a.getTime());0<c;){var e=a.getMonth(),f=(T(a.getFullYear())?V:W)[e];if(c>f-a.getDate())c-=f-a.getDate()+1,a.setDate(1),11>e?a.setMonth(e+1):(a.setMonth(0),a.setFullYear(a.getFullYear()+1));else{a.setDate(a.getDate()+c);break}}return a}
function Ca(a,c,e,f){function h(b,k,p){for(b="number"===typeof b?b.toString():b||"";b.length<k;)b=p[0]+b;return b}function g(b,k){return h(b,k,"0")}function l(b,k){function p(ua){return 0>ua?-1:0<ua?1:0}var z;0===(z=p(b.getFullYear()-k.getFullYear()))&&0===(z=p(b.getMonth()-k.getMonth()))&&(z=p(b.getDate()-k.getDate()));return z}function u(b){switch(b.getDay()){case 0:return new Date(b.getFullYear()-1,11,29);case 1:return b;case 2:return new Date(b.getFullYear(),0,3);case 3:return new Date(b.getFullYear(),
0,2);case 4:return new Date(b.getFullYear(),0,1);case 5:return new Date(b.getFullYear()-1,11,31);case 6:return new Date(b.getFullYear()-1,11,30)}}function q(b){b=X(new Date(b.u+1900,0,1),b.D);var k=new Date(b.getFullYear()+1,0,4),p=u(new Date(b.getFullYear(),0,4));k=u(k);return 0>=l(p,b)?0>=l(k,b)?b.getFullYear()+1:b.getFullYear():b.getFullYear()-1}var n=G[f+40>>2];f={I:G[f>>2],H:G[f+4>>2],B:G[f+8>>2],A:G[f+12>>2],v:G[f+16>>2],u:G[f+20>>2],C:G[f+24>>2],D:G[f+28>>2],L:G[f+32>>2],G:G[f+36>>2],J:n?n?
K(J,n,void 0):"":""};e=e?K(J,e,void 0):"";n={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var r in n)e=e.replace(new RegExp(r,"g"),n[r]);var va="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
wa="January February March April May June July August September October November December".split(" ");n={"%a":function(b){return va[b.C].substring(0,3)},"%A":function(b){return va[b.C]},"%b":function(b){return wa[b.v].substring(0,3)},"%B":function(b){return wa[b.v]},"%C":function(b){return g((b.u+1900)/100|0,2)},"%d":function(b){return g(b.A,2)},"%e":function(b){return h(b.A,2," ")},"%g":function(b){return q(b).toString().substring(2)},"%G":function(b){return q(b)},"%H":function(b){return g(b.B,2)},
"%I":function(b){b=b.B;0==b?b=12:12<b&&(b-=12);return g(b,2)},"%j":function(b){return g(b.A+U(T(b.u+1900)?V:W,b.v-1),3)},"%m":function(b){return g(b.v+1,2)},"%M":function(b){return g(b.H,2)},"%n":function(){return"\n"},"%p":function(b){return 0<=b.B&&12>b.B?"AM":"PM"},"%S":function(b){return g(b.I,2)},"%t":function(){return"\t"},"%u":function(b){return b.C||7},"%U":function(b){var k=new Date(b.u+1900,0,1),p=0===k.getDay()?k:X(k,7-k.getDay());b=new Date(b.u+1900,b.v,b.A);return 0>l(p,b)?g(Math.ceil((31-
p.getDate()+(U(T(b.getFullYear())?V:W,b.getMonth()-1)-31)+b.getDate())/7),2):0===l(p,k)?"01":"00"},"%V":function(b){var k=new Date(b.u+1901,0,4),p=u(new Date(b.u+1900,0,4));k=u(k);var z=X(new Date(b.u+1900,0,1),b.D);return 0>l(z,p)?"53":0>=l(k,z)?"01":g(Math.ceil((p.getFullYear()<b.u+1900?b.D+32-p.getDate():b.D+1-p.getDate())/7),2)},"%w":function(b){return b.C},"%W":function(b){var k=new Date(b.u,0,1),p=1===k.getDay()?k:X(k,0===k.getDay()?1:7-k.getDay()+1);b=new Date(b.u+1900,b.v,b.A);return 0>l(p,
b)?g(Math.ceil((31-p.getDate()+(U(T(b.getFullYear())?V:W,b.getMonth()-1)-31)+b.getDate())/7),2):0===l(p,k)?"01":"00"},"%y":function(b){return(b.u+1900).toString().substring(2)},"%Y":function(b){return b.u+1900},"%z":function(b){b=b.G;var k=0<=b;b=Math.abs(b)/60;return(k?"+":"-")+String("0000"+(b/60*100+b%60)).slice(-4)},"%Z":function(b){return b.J},"%%":function(){return"%"}};for(r in n)e.includes(r)&&(e=e.replace(new RegExp(r,"g"),n[r](f)));r=Da(e);if(r.length>c)return 0;F.set(r,a);return r.length-
1}function Da(a){for(var c=0,e=0;e<a.length;++e){var f=a.charCodeAt(e);55296<=f&&57343>=f&&(f=65536+((f&1023)<<10)|a.charCodeAt(++e)&1023);127>=f?++c:c=2047>=f?c+2:65535>=f?c+3:c+4}c=Array(c+1);ja(a,c,0,c.length);return c}
var Ea={b:function(){E("")},d:function(a,c,e){J.copyWithin(a,c,c+e)},e:function(a){var c=J.length;a>>>=0;if(2147483648<a)return!1;for(var e=1;4>=e;e*=2){var f=c*(1+.2/e);f=Math.min(f,a+100663296);f=Math.max(a,f);0<f%65536&&(f+=65536-f%65536);a:{try{H.grow(Math.min(2147483648,f)-na.byteLength+65535>>>16);oa();var h=1;break a}catch(g){}h=void 0}if(h)return!0}return!1},g:function(a,c){var e=0;Aa().forEach(function(f,h){var g=c+e;h=G[a+4*h>>2]=g;for(g=0;g<f.length;++g)F[h++>>0]=f.charCodeAt(g);F[h>>0]=
0;e+=f.length+1});return 0},h:function(a,c){var e=Aa();G[a>>2]=e.length;var f=0;e.forEach(function(h){f+=h.length+1});G[c>>2]=f;return 0},i:function(){return 0},c:function(){},a:function(a,c,e,f){for(var h=0,g=0;g<e;g++){var l=G[c>>2],u=G[c+4>>2];c+=8;for(var q=0;q<u;q++){var n=J[l+q],r=Ba[a];0===n||10===n?((1===a?da:C)(K(r,0)),r.length=0):r.push(n)}h+=u}G[f>>2]=h;return 0},f:function(a,c,e,f){return Ca(a,c,e,f)}};
(function(){function a(h){d.asm=h.exports;H=d.asm.j;oa();L=d.asm.n;qa.unshift(d.asm.k);M--;d.monitorRunDependencies&&d.monitorRunDependencies(M);0==M&&(null!==N&&(clearInterval(N),N=null),O&&(h=O,O=null,h()))}function c(h){a(h.instance)}function e(h){return za().then(function(g){return WebAssembly.instantiate(g,f)}).then(function(g){return g}).then(h,function(g){C("failed to asynchronously prepare wasm: "+g);E(g)})}var f={a:Ea};M++;d.monitorRunDependencies&&d.monitorRunDependencies(M);if(d.instantiateWasm)try{return d.instantiateWasm(f,
a)}catch(h){return C("Module.instantiateWasm callback failed with error: "+h),!1}(function(){return D||"function"!==typeof WebAssembly.instantiateStreaming||ta()||"function"!==typeof fetch?e(c):fetch(P,{credentials:"same-origin"}).then(function(h){return WebAssembly.instantiateStreaming(h,f).then(c,function(g){C("wasm streaming compile failed: "+g);C("falling back to ArrayBuffer instantiation");return e(c)})})})().catch(v);return{}})();
d.___wasm_call_ctors=function(){return(d.___wasm_call_ctors=d.asm.k).apply(null,arguments)};d._convert_glsl_to_spirv=function(){return(d._convert_glsl_to_spirv=d.asm.l).apply(null,arguments)};d._destroy_output_buffer=function(){return(d._destroy_output_buffer=d.asm.m).apply(null,arguments)};d._malloc=function(){return(d._malloc=d.asm.o).apply(null,arguments)};d._free=function(){return(d._free=d.asm.p).apply(null,arguments)};
var ka=d.stackSave=function(){return(ka=d.stackSave=d.asm.q).apply(null,arguments)},la=d.stackRestore=function(){return(la=d.stackRestore=d.asm.r).apply(null,arguments)},I=d.stackAlloc=function(){return(I=d.stackAlloc=d.asm.s).apply(null,arguments)},Y;O=function Fa(){Y||Z();Y||(O=Fa)};
function Z(){function a(){if(!Y&&(Y=!0,d.calledRun=!0,!ia)){Q(qa);t(d);if(d.onRuntimeInitialized)d.onRuntimeInitialized();if(d.postRun)for("function"==typeof d.postRun&&(d.postRun=[d.postRun]);d.postRun.length;){var c=d.postRun.shift();ra.unshift(c)}Q(ra)}}if(!(0<M)){if(d.preRun)for("function"==typeof d.preRun&&(d.preRun=[d.preRun]);d.preRun.length;)sa();Q(pa);0<M||(d.setStatus?(d.setStatus("Running..."),setTimeout(function(){setTimeout(function(){d.setStatus("")},1);a()},1)):a())}}d.run=Z;
if(d.preInit)for("function"==typeof d.preInit&&(d.preInit=[d.preInit]);0<d.preInit.length;)d.preInit.pop()();Z();


  return Module.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;
export default (() => {
    const initialize = () => {
        return new Promise(resolve => {
            Module({
                locateFile() {
                    const i = import.meta.url.lastIndexOf('/')
                    return import.meta.url.substring(0, i) + '/glslang.wasm';
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
    return () => {
        if (!instance) {
            instance = initialize();
        }
        return instance;
    };
})();
