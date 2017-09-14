// JavaScript Document
window.onload = function() {
  var c = document.getElementById('canv');
  var $ = c.getContext('2d');
  var w = c.width = window.innerWidth;
  var h = c.height = window.innerHeight;
  
  var _main = new Main(c);
  _main.base(w / 2, h / 2);

  var z = 30;
  _main.build(0, 0, z, 30);
  _main.build(1, 1, z, 15);
  _main.build(60, 0, z, 20);
  _main.build(-60, 0, z, 20);

  _main.build(0, 0, -z, 30);
  _main.build(1, 1, -z, 15);
  _main.build(60, 0, -z, 20);
  _main.build(-60, 0, -z, 20);

  _main.build(0, 0, -z * 3, 30);
  _main.build(1, 1, -z * 3, 15);
  _main.build(60, 0, -z * 3, 20);
  _main.build(-60, 0, -z * 3, 20);

  _main.build(0, 60, z, 20);
  _main.build(0, 60, -z, 20);
  _main.build(0, 60, -z * 3, 20);

  _main.build(60, 60, z, 20);
  _main.build(-60, 60, z, 20);
  _main.build(60, -60, z, 20);
  _main.build(0, -60, z, 20);

  _main.build(60, 60, -z, 20);
  _main.build(-60, 60, -z, 20);
  _main.build(60, -60, -z, 20);
  _main.build(0, -60, -z, 20);

  _main.build(60, 60, -z * 3, 20);
  _main.build(-60, 60, -z * 3, 20);
  _main.build(60, -60, -z * 3, 20);
  _main.build(0, -60, -z * 3, 20);

  _main.build(-60, -60, z, 20);
  _main.build(-60, -60, -z, 20);
  _main.build(-60, -60, -z * 3, 20);

  function run() {
    window.requestAnimationFrame(run);
    _main.draw();
  };
  run();
};

function Main(c) {
  this.c = c;
  this.$ = this.c.getContext('2d');

  this.vx = undefined;
  this.vy = undefined;
  this.cubes = [];
  this.angY = Math.PI / 180 * 1;
  this.angX = Math.PI / 180 * 1;
}

Main.prototype = {
  base: function(x, y) {
    this.vx = x;
    this.vy = y;
  },

  build: function(x, y, z, r) {
    this.cubes.push(new Cube(this, x, y, z, r));
  },
  draw: function() {
    this.$.clearRect(0, 0, this.c.width, this.c.height);
    this.$.fillStyle = 'hsla(360, 5%, 85%, 1)';
    this.$.fillRect(0, 0, this.c.width, this.c.height);
    var t1 = "".split("").join(String.fromCharCode(0x2004));
    this.$.font = "3em Poiret One";
    this.$.fillStyle = 'hsla(0,0%,5%,1)';
    this.$.fillText(t1, (this.c.width - this.$.measureText(t1).width) * 0.5, this.c.height * 0.2);
    var t2 = "".split("").join(String.fromCharCode(0x2004));
    this.$.font = "3em Poiret One";
    this.$.fillStyle = 'hsla(0,0%,5%,1)';
    this.$.fillText(t2, (this.c.width - this.$.measureText(t2).width) * 0.5, this.c.height * 0.9);
    var that = this;
    this.cubes.sort(function(a, b) {
      if (b.z !== a.z)
        return b.z - a.z;
      else if (b.idx_x !== a.idx_x) {

        if (that.x >= 0)
          return b.x - a.x;
        else
          return a.x - b.x;
      } else {
        if (that.y >= 0)
          return b.y - a.y;
        else
          return a.y - b.y;
      }
    });
    for (var i in this.cubes)
      this.cubes[i].draw();
  }
};

function Hexa(cube, x, y, z) {
  this.cube = cube;

  this.x = x;
  this.y = y;
  this.z = z;

  this.x2 = undefined;
  this.y2 = undefined;
}

Hexa.prototype = {
  rotY: function() {
    var cosy = Math.cos(this.cube.angY);
    var siny = Math.sin(this.cube.angY);
    var x1 = this.z * siny + this.x * cosy;
    var z1 = this.z * cosy - this.x * siny;
    this.x = x1;
    this.z = z1;

  },

  rotX: function() {
    var cosx = Math.cos(this.cube.angX);
    var sinx = Math.sin(this.cube.angX);

    var y1 = this.y * cosx - this.z * sinx;
    var z1 = this.y * sinx + this.z * cosx;
    this.y = y1;
    this.z = z1;
  },

  pos: function(a) {
    var fl = 300;
    var scale = fl / (fl + this.z);
    this.x2 = this.cube._main.vx + this.x * scale;
    this.y2 = this.cube._main.vy + this.y * scale;
  },

  draw: function() {
    this.rotX();
    this.rotY();
    this.pos();

  }
};

function Cube(_main, x, y, z, r) {
  this._main = _main;

  this.x = x;
  this.y = y;
  this.z = z;
  this.r = r;

  this.angX = Math.PI / 180 * 1;
  this.angY = Math.PI / 180 * 1;
  this.p = [];

  this.arr = [];

  this.set();
}

Cube.prototype = {
  set: function() {
    this.p[0] = new Hexa(this, this.x - this.r, this.y - this.r, this.z - this.r);
    this.p[1] = new Hexa(this, this.x - this.r, this.y + this.r, this.z - this.r);
    this.p[2] = new Hexa(this, this.x + this.r, this.y + this.r, this.z - this.r);
    this.p[3] = new Hexa(this, this.x + this.r, this.y - this.r, this.z - this.r);
    this.p[4] = new Hexa(this, this.x - this.r, this.y - this.r, this.z + this.r);
    this.p[5] = new Hexa(this, this.x - this.r, this.y + this.r, this.z + this.r);
    this.p[6] = new Hexa(this, this.x + this.r, this.y + this.r, this.z + this.r);
    this.p[7] = new Hexa(this, this.x + this.r, this.y - this.r, this.z + this.r);

    this.arr[0] = new Side(this, this.p[0], this.p[1], this.p[2], this.p[3]);
    this.arr[1] = new Side(this, this.p[3], this.p[2], this.p[6], this.p[7]);
    this.arr[2] = new Side(this, this.p[4], this.p[5], this.p[6], this.p[7]);
    this.arr[3] = new Side(this, this.p[4], this.p[5], this.p[1], this.p[0]);
    this.arr[4] = new Side(this, this.p[0], this.p[3], this.p[7], this.p[4]);
    this.arr[5] = new Side(this, this.p[5], this.p[1], this.p[2], this.p[6]);
  },

  draw: function() {
    for (var i = 0; i < 8; i++)
      this.p[i].draw();
    this.mv();

    for (var i = 0; i < 6; i++)
      this.arr[i].ang = this.arr[i]._ang();
    this.arr.sort(function(a, b) {
      return a.ang > b.ang;
    });
    for (var i = 0; i < 6; i++) {
      if (this.arr[i].ang > 0)
        this.arr[i].draw();
    }
  },

  mv: function() {
    this.x = this.y = this.z = 0;
    for (var i = 0; i < 8; i++) {
      this.x += this.p[i].x;
      this.y += this.p[i].y;
      this.z += this.p[i].z;
    }
    this.x /= 8;
    this.y /= 8;
    this.z /= 8;
  }
};

function Side(cube, a, b, c, d) {
  this.cube = cube;
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.alpha = rnd(0.7, .9);
  this.color = 'hsla(' + Math.random() * 360 + ',50%,75%,' + this.alpha + ')';
  this.ang = undefined;
}

Side.prototype = {
  draw: function() {
    var $ = this.cube._main.$;
    var g = $.createLinearGradient(this.a.x2 + this.b.x2, this.a.y2 + this.b.y2, 8, this.c.x2, this.d.y2, this.r);
    g.addColorStop(0, 'hsla(360, 5%, 85%, 1)');
    g.addColorStop(0.5, this.color);
    g.addColorStop(1, 'hsla(210, 15%, 95%, 0)');
    $.beginPath();
    //$.fillStyle = this.color
    $.fillStyle = g;
    $.strokeStyle = 'hsla(0,0%,25%,.07)';
    $.moveTo(this.a.x2, this.a.y2);
    $.lineTo(this.b.x2, this.b.y2);
    $.lineTo(this.c.x2, this.c.y2);
    $.lineTo(this.d.x2, this.d.y2);
    $.closePath();
    $.fill();
    $.stroke();
  },

  idx: function() {
    this.idx_x = (this.a.x + this.b.x + this.c.x + this.d.x) / 4;
    this.idx_y = (this.a.y + this.b.y + this.c.y + this.d.y) / 4;
    this.idx_z = (this.a.z + this.b.z + this.c.z + this.d.z) / 4;
  },

  _ang: function() {
    var x = (this.a.x + this.b.x + this.c.x + this.d.x) / 4 - this.cube.x;
    var y = (this.a.y + this.b.y + this.c.y + this.d.y) / 4 - this.cube.y;
    var z = (this.a.z + this.b.z + this.c.z + this.d.z) / 4 - this.cube.z;
    var v = new V(x, y, z);

    var x = 0 - (this.a.x + this.b.x + this.c.x + this.d.x) / 4;
    var y = 0 - (this.a.y + this.b.y + this.c.y + this.d.y) / 4;
    var z = -500 - (this.a.z + this.b.z + this.c.z + this.d.z) / 4;
    var v2 = new V(x, y, z);
    return v.pt(v2);
  }
};

function V(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

var rnd = function(min, max) {
  return Math.random() * (max - min) + min;
}
V.prototype.pt = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
}

window.addEventListener('resize',function(){
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
}, false);