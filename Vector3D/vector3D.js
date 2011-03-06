var Vector3D = Class.create();

Vector3D.prototype = {
	x: null, y: null, z: null,
	sx: null, sy: null, sz: null,
	userData: null,
	
	dx: null, dy: null, dz: null,
	tx: null, ty: null, tz: null,
	oll: null,
	
	initialize: function(a, b, c){
		this.x = a;
		this.y = b;
		this.z = c;
	},
	
	copy: function(v){
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	},
	
	add: function(v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},
	
	sub: function(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},
	
	cross: function(v){
		this.tx = this.x;
		this.ty = this.y;
		this.tz = this.z;
		
		this.x = this.ty * v.z - this.tz * v.y;
		this.y = this.tz * v.x - this.tx * v.z;
		this.z = this.tx * v.y - this.ty * v.x;
	},
	
	multiply: function(s){
		this.x *= s;
		this.y *= s;
		this.z *= s;
	},
	
	distanceTo: function(v){
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;
		
		return Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);
	},
	
	distanceToSquared: function(v){
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;
		
		return this.dx * this.dx + this.dy * this.dy + this.dz * this.dz;
	},
	
	length: function(){
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
	
	lengthSq: function(){
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	
	negate: function(){
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	},
	
	normalize: function(){
		if (this.length() > 0)
			this.ool = 1.0 / this.length();
		else
			this.ool = 0;
			
		this.x *= this.ool;
		this.y *= this.ool;
		this.z *= this.ool;
		return this;
	},
	
	dot: function(v){
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	
	clone: function(){
		return new Vector3D(this.x, this.y, this.z);
	},
	
	toString: function(){
		return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
	}
	
}

Vector3D.add = function(a, b)
{
	return new Vector3D( a.x + b.x, a.y + b.y, a.z + b.z );
}

Vector3D.sub = function(a, b)
{
	return new Vector3D( a.x - b.x, a.y - b.y, a.z - b.z );
}		

Vector3D.multiply = function(a, s)
{
	return new Vector3D( a.x * s, a.y * s, a.z * s );
}

Vector3D.cross = function(a, b)
{
	return new Vector3D( a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x );
}

Vector3D.dot = function(a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
}
