// Simple Version Grammar

{

    const OP_EQ = "equal";
    const OP_IS = OP_EQ;
    const OP_GT = "greater";
    const OP_GE= "greaterequal";
    const OP_LT= "less";
    const OP_LE= "lessequal";
    const OP_NOT = "not";

    const VERBOSE = false;

    function Version(){
    	this.major = null;
        this.minor = null;
        this.patch = null;
        this.op = null;
    }

    const P = Version.prototype;

    P.toString = function() { 
        return `[${this.op ? this.op : "?"}]/v${this.major}.${this.minor}.${this.patch}`;
    }

    Object.defineProperty(Version.prototype, 'wildcard', {
        get: function() {
            return this.major === '*' || this.minor === '*' || this.patch === '*';
        }
    });
    Object.defineProperty(Version.prototype, 'anyMajor', {
        get: function() { return this.major === '*';}
    });
    Object.defineProperty(Version.prototype, 'anyMinor', {
        get: function() { return this.minor === '*';}
    });
    Object.defineProperty(Version.prototype, 'anyPatch', {
        get: function() { return this.patch === '*';}
    });
    P.toArray = function() {
        const r = [];
        if(this.major !== null) {
            r.push(this.major);
        }
        if(this.minor !== null) {
            r.push(this.minor);
        }
        if(this.patch !== null) {
            r.push(this.patch);
        }
        return r;
    };
    P.assertNotWildcard = function() {
        if(this.wildcard) {
            throw new Error("Source version should not be wildcard: "+this.toString());
        }
    }

    P.compareTo = function(o) {
        this.assertNotWildcard();
        if(o.wildcard) {
            throw new Error("Reference version should not be wildcard when comparing!");
        }
        const va = this.toArray();
        const vb = o.toArray();
        const l = Math.min(va.length, vb.length);
        let fillZeros = (a, l, ml) =>{ for(let i = l; i < ml; i++) a[i] = 0;}
        fillZeros(va, l, 3);
        fillZeros(vb, l, 3);
        let toFactor = (v) => {return (v[0] << 20) + (v[1] << 10) + (v[2]);}
        return toFactor(va) - toFactor(vb);
    };
    P.match = function(o) {
        if(VERBOSE) {
            console.log(`try match ${o}`);
        }
        this.assertNotWildcard();
        if(!o.wildcard) {
            throw new Error("Reference version should be wildcard when matching!");
        }

        if(VERBOSE) {
            console.log(` match major ${o.major}, any ${o.anyMajor}, ${this.major} <> ${o.major}`);
        }
        if(o.anyMajor) return true; 
        if(this.major !== o.major) return false;

        if(VERBOSE) {
            console.log(` match minor ${o.minor}, any ${o.anyMinor}, ${this.minor} <> ${o.minor}`);
        }
        if(o.anyMinor) return true;
        if(this.minor !== o.minor) return false;
        
        if(VERBOSE) {
            console.log(` match patch ${o.patch}, any ${o.anyPatch}`);
        }
        if(o.anyPatch) return true;
        return this.patch == o.patch;
    };

    P.test = function(o) {
        let op = o.op;
        if(op === OP_EQ) {
            return o.wildcard ? this.match(o) : this.compareTo(o) === 0;
        }
        if(op === OP_NOT) {
            return o.wildcard ? !this.match(o) : this.compareTo(o) !== 0;
        }
        if(o.wildcard){
            throw new Error("Can not compare to wildcard version");
        }
        const R = this.compareTo(o);
        if(op === OP_GE) {
            return R >= 0;
        }
        if(op === OP_LE) {
            return R <= 0;
        }
        if(op === OP_GT) {
            return R > 0;
        }
        if(op === OP_LT) {
            return R < 0;
        }
        throw new Error("invalidate operation " + op);
    };

    function VersionSet(data) {
        this.conds = data;
    }

    function allMatch(v, versions) {
        let t;
        let r = true;
        for(let c of versions) {
            t = v.test(c);
            if(VERBOSE) {
                console.log(`test ${v} with ${c} => ${t}`);
            }
            if(!t){
                r = false;
                if(!VERBOSE) {
                    return false;
                }
            }
        }
        return r;
    }

    function arrElmOr(arr, idx, dft){
        if(arr[idx] === undefined) return dft;
        return arr[idx];
    }

    VersionSet.prototype.match = function(o) {
        let ps = o.split('.');
        let v = new Version;
        v.major = parseInt(arrElmOr(ps, 0, 0), 10);
        v.minor = parseInt(arrElmOr(ps, 1, 0), 10);
        v.patch = parseInt(arrElmOr(ps, 2, 0), 10);
        if(VERBOSE) {
            console.log(`match version ${v}`);
        }
        for(let c of this.conds){
            if(allMatch(v, c)) {
                return true;
            }            
        }
        return false;
    };
}


Expression
  = head:Conds tail:('||' Conds)* {
  		let s = [head];
        s = s.concat(tail.map(x=>x[1]));
        return new VersionSet(s);
    }

Conds "Condition Items"
  = _ head:Cond tail:(S Cond)+ _ {
  	let s = [head];
    s = s.concat(tail.map(x=> x[1]));
    return s;
  }
  / _ head: Cond _ {
  	return [head];
  }

Cond
  = '>=' _ v:Version {
      v.op = OP_GE;
      return v;
      }
  / '<=' _ v:Version {
     v.op = OP_LE; 
      return v;
      }
  / '!=' _  v:Version {
      v.op = OP_NOT;
      return v;
      }
  / '!' _ v:Version {
      v.op = OP_NOT;
      return v;
      }
  / '=' _ v:Version {
      v.op = OP_EQ;
      return v;
      }
  / '<' _ v:Version {
      v.op = OP_LT;
      return v;
      }
  / '>'_  v:Version {
      v.op = OP_GT;
      return v;
      }
  / head:Version  {
      head.op = OP_IS;
      return head;
      }

Version "version"
 = V3 / V2 / V1
 
V3 "major.minor.patch"
 = v:V2 '.' n:Factor { v.patch = n; return v}
 
V2 "major.minor"
  = v:V1 '.' n:Factor {v.minor = n; return v}

V1 "major"
  =  n:Factor {let v = new Version; v.major = n; return v}


Factor
  = ('*' / 'x' / 'X') {return '*';}
  / Integer

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

S "whitespace"
  = [ \t\n\r]+

_ "whitespace"
  = [ \t\n\r]*