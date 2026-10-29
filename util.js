const SLICE = 250;

class Util {
    static toPercent(value) {
        let v = value.toString()
        if(v.length == 1) {
            v = "00" + v;
        }
        if(v.length == 2) {
            v = "0" + v;
        }
        v += "%"
        return v;
    }

    static toDecimal(value) {
        let v = value.toString()
        if(v.length == 1) {
            v += ".00";
        }
        if(v.length == 2) {
            v += ".0";
        }
        if(v.length == 3) {
            v += "0";
        }
        return v
    }

    static make6Long(value) {
        let v = value.toString()
        if(v.length == 1) {
            v = "00000" + v;
        }
        if(v.length == 2) {
            v = "0000" + v;
        }
        if(v.length == 3) {
            v = "000" + v;
        }
        if(v.length == 4) {
            v = "00" + v;
        }
        if(v.length == 5) {
            v = "0" + v;
        }
        return v;
    }
}

class Vector3 {
    constructor(x, y, t) {
        this.x = x;
        this.y = y;
        this.t = t;
    }

    normalize() {
        x = this.x/1;
        y = this.y/1;
        t = this.t/1;
        return new Vector3(x, y, t)
    }

    mul(vec) {
        this.x*=vec.x;
        this.y*=vec.y;
        this.t*=vec.t;
    }
}