/**
 * Vector2D.js - inspired by Keith Peters
 * @Author: Sandy
 * @Date: 2011-02-03
 * @Email: wojiaoabin@gmail.com
 */


/**
 * Constructor
 */

function Vector2D(x, y) {
	if(this == window || !(this instanceof Vector2D)) {
		return new Vector2D(x, y);
	}
	this.x = x;
	this.y = y;
}

/** 
 * Public Methods
 */

Vector2D.prototype = {
	
	'constructor': Vector2D,

	'clone': function() {
		return new Vector2D(this.x, this.y);
	},

	'zero': function() {
		this.x = 0;
		this.y = 0;
		return this;
	},

	'isZero': function() {
		return this.x == 0 && this.y == 0;
	},

	set angle(value) {
		var len = this.length;
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * Len;
	},

	get angle() {
		return Math.atan2(this.y, this.x);
	},

	set length(value) {
		var a = this.angle;
		this.x = Math.cos(a) * value;
		this.y = Math.sin(a) * value;
	},

	get length() {
		return Math.sqrt(this.lengthSQ());
	},

	'lengthSQ': function() {
		return this.x * this.x + this.y * this.y;
	},

	'normalize': function() {		
		var len = this.length;
		if (len == 0) {
			this.x = 1;
			return this;
		}
		this.x /= len;
		this.y /= len;
		return this;
	},

	'truncate': function(max) {
		this.length = Math.min(max, this.length);
		return this;
	},

	'reverse': function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},

	'isNormalized': function() {
		return this.length == 1.0;
	},

	'dotProd': function(v2) {
		return this.x * v2.x + this.y * v2.y;
	},

	'crossProd': function(v2) {
		return this.x * v2.y - this.y * v2.x;
	},

	'sign': function(v2) {
		return this.perp().dotProd(v2) < 0 ? -1 : 1;
	},

	'perp': function() {
		return new Vector2D(-this.y, this.x);
	},

	'dist': function(v2) {
		return Math.sqrt(this.distSQ(v2));
	},

	'distSQ': function(v2) {
		var dx = v2.x - this.x,
			dy = v2.y - this.y;
		return dx * dx + dy * dy;
	},

	'add': function(v2) {
		return new Vector2D(this.x + v2.x, this.y + v2.y);
	},

	'subtract': function(v2) {
		return new Vector2D(this.x - v2.x, this.y - v2.y);
	},

	'multiply': function(value) {
		return new Vector2D(this.x * value, this.y * value);
	},

	'divide': function(value) {
		return new Vector2D(this.x / value, this.y / value);
	},

	'equals': function(v2) {
		return this.x == v2.x && this.y == v2.y;
	},

	'toString': function() {
		return "[Vector2D (x:" + this.x + ", y:" + this.y + ")]";
	}
}

/**
 * Static Method
 */

Vector2D.angleBetween = function(v1, v2) {
	if(!v1.isNormalized()) v1 = v1.clone().normalize();
	if(!v2.isNormalized()) v2 = v2.clone().normalize();
	return Math.acos(v1.dotProd(v2));
}

