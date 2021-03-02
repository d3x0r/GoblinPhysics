/**
* Goblin Physics
*
* @module Goblin
*/
(function(){
	var Goblin = {};
Goblin.Matrix3 = function( e00, e01, e02, e10, e11, e12, e20, e21, e22 ) {
	this.e00 = e00 || 0;
	this.e01 = e01 || 0;
	this.e02 = e02 || 0;

	this.e10 = e10 || 0;
	this.e11 = e11 || 0;
	this.e12 = e12 || 0;

	this.e20 = e20 || 0;
	this.e21 = e21 || 0;
	this.e22 = e22 || 0;
};

Goblin.Matrix3.prototype = {
	identity: function() {
		this.e00 = 1;
		this.e01 = 0;
		this.e02 = 0;

		this.e10 = 0;
		this.e11 = 1;
		this.e12 = 0;

		this.e20 = 0;
		this.e21 = 0;
		this.e22 = 1;
	},

	fromMatrix4: function( m ) {
		this.e00 = m.e00;
		this.e01 = m.e01;
		this.e02 = m.e02;

		this.e10 = m.e10;
		this.e11 = m.e11;
		this.e12 = m.e12;

		this.e20 = m.e20;
		this.e21 = m.e21;
		this.e22 = m.e22;
	},

	fromQuaternion: function( q ) {
		var x2 = q.x + q.x,
			y2 = q.y + q.y,
			z2 = q.z + q.z,

			xx = q.x * x2,
			xy = q.x * y2,
			xz = q.x * z2,
			yy = q.y * y2,
			yz = q.y * z2,
			zz = q.z * z2,
			wx = q.w * x2,
			wy = q.w * y2,
			wz = q.w * z2;

		this.e00 = 1 - (yy + zz);
		this.e10 = xy + wz;
		this.e20 = xz - wy;

		this.e01 = xy - wz;
		this.e11 = 1 - (xx + zz);
		this.e21 = yz + wx;

		this.e02 = xz + wy;
		this.e12 = yz - wx;
		this.e22 = 1 - (xx + yy);
	},

	transformVector3: function( v ) {
		var x = v.x,
			y = v.y,
			z = v.z;
		v.x = this.e00 * x + this.e01 * y + this.e02 * z;
		v.y = this.e10 * x + this.e11 * y + this.e12 * z;
		v.z = this.e20 * x + this.e21 * y + this.e22 * z;
	},

	transformVector3Into: function( v, dest ) {
		dest.x = this.e00 * v.x + this.e01 * v.y + this.e02 * v.z;
		dest.y = this.e10 * v.x + this.e11 * v.y + this.e12 * v.z;
		dest.z = this.e20 * v.x + this.e21 * v.y + this.e22 * v.z;
	},

	transposeInto: function( m ) {
		m.e00 = this.e00;
		m.e10 = this.e01;
		m.e20 = this.e02;
		m.e01 = this.e10;
		m.e11 = this.e11;
		m.e21 = this.e12;
		m.e02 = this.e20;
		m.e12 = this.e21;
		m.e22 = this.e22;
	},

	invert: function() {
		var a00 = this.e00, a01 = this.e01, a02 = this.e02,
			a10 = this.e10, a11 = this.e11, a12 = this.e12,
			a20 = this.e20, a21 = this.e21, a22 = this.e22,

			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,

			d = a00 * b01 + a01 * b11 + a02 * b21,
			id;

		if ( !d ) {
			return true;
		}
		id = 1 / d;

		this.e00 = b01 * id;
		this.e01 = (-a22 * a01 + a02 * a21) * id;
		this.e02 = (a12 * a01 - a02 * a11) * id;
		this.e10 = b11 * id;
		this.e11 = (a22 * a00 - a02 * a20) * id;
		this.e12 = (-a12 * a00 + a02 * a10) * id;
		this.e20 = b21 * id;
		this.e21 = (-a21 * a00 + a01 * a20) * id;
		this.e22 = (a11 * a00 - a01 * a10) * id;

		return true;
	},

	invertInto: function( m ) {
		var a00 = this.e00, a01 = this.e01, a02 = this.e02,
			a10 = this.e10, a11 = this.e11, a12 = this.e12,
			a20 = this.e20, a21 = this.e21, a22 = this.e22,

			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,

			d = a00 * b01 + a01 * b11 + a02 * b21,
			id;

		if ( !d ) {
			return false;
		}
		id = 1 / d;

		m.e00 = b01 * id;
		m.e01 = (-a22 * a01 + a02 * a21) * id;
		m.e02 = (a12 * a01 - a02 * a11) * id;
		m.e10 = b11 * id;
		m.e11 = (a22 * a00 - a02 * a20) * id;
		m.e12 = (-a12 * a00 + a02 * a10) * id;
		m.e20 = b21 * id;
		m.e21 = (-a21 * a00 + a01 * a20) * id;
		m.e22 = (a11 * a00 - a01 * a10) * id;

		return true;
	},

	multiply: function( m ) {
		var a00 = this.e00, a01 = this.e01, a02 = this.e02,
			a10 = this.e10, a11 = this.e11, a12 = this.e12,
			a20 = this.e20, a21 = this.e21, a22 = this.e22,

			b00 = m.e00, b01 = m.e01, b02 = m.e02,
			b10 = m.e10, b11 = m.e11, b12 = m.e12,
			b20 = m.e20, b21 = m.e21, b22 = m.e22;

		this.e00 = b00 * a00 + b10 * a01 + b20 * a02;
		this.e10 = b00 * a10 + b10 * a11 + b20 * a12;
		this.e20 = b00 * a20 + b10 * a21 + b20 * a22;

		this.e01 = b01 * a00 + b11 * a01 + b21 * a02;
		this.e11 = b01 * a10 + b11 * a11 + b21 * a12;
		this.e21 = b01 * a20 + b11 * a21 + b21 * a22;

		this.e02 = b02 * a00 + b12 * a01 + b22 * a02;
		this.e12 = b02 * a10 + b12 * a11 + b22 * a12;
		this.e22 = b02 * a20 + b12 * a21 + b22 * a22;
	},

	multiplyFrom: function( a, b ) {
		var a00 = a.e00, a01 = a.e01, a02 = a.e02,
			a10 = a.e10, a11 = a.e11, a12 = a.e12,
			a20 = a.e20, a21 = a.e21, a22 = a.e22,

			b00 = b.e00, b01 = b.e01, b02 = b.e02,
			b10 = b.e10, b11 = b.e11, b12 = b.e12,
			b20 = b.e20, b21 = b.e21, b22 = b.e22;

		this.e00 = b00 * a00 + b10 * a01 + b20 * a02;
		this.e10 = b00 * a10 + b10 * a11 + b20 * a12;
		this.e20 = b00 * a20 + b10 * a21 + b20 * a22;

		this.e01 = b01 * a00 + b11 * a01 + b21 * a02;
		this.e11 = b01 * a10 + b11 * a11 + b21 * a12;
		this.e21 = b01 * a20 + b11 * a21 + b21 * a22;

		this.e02 = b02 * a00 + b12 * a01 + b22 * a02;
		this.e12 = b02 * a10 + b12 * a11 + b22 * a12;
		this.e22 = b02 * a20 + b12 * a21 + b22 * a22;
	}
};
Goblin.Matrix4 = function() {
	this.e00 = 0;
	this.e01 = 0;
	this.e02 = 0;
	this.e03 = 0;

	this.e10 = 0;
	this.e11 = 0;
	this.e12 = 0;
	this.e13 = 0;

	this.e20 = 0;
	this.e21 = 0;
	this.e22 = 0;
	this.e23 = 0;

	this.e30 = 0;
	this.e31 = 0;
	this.e32 = 0;
	this.e33 = 0;
};

Goblin.Matrix4.prototype = {
	identity: function() {
		this.e00 = 1;
		this.e01 = 0;
		this.e02 = 0;
		this.e03 = 0;

		this.e10 = 0;
		this.e11 = 1;
		this.e12 = 0;
		this.e13 = 0;

		this.e20 = 0;
		this.e21 = 0;
		this.e22 = 1;
		this.e23 = 0;

		this.e30 = 0;
		this.e31 = 0;
		this.e32 = 0;
		this.e33 = 1;
	},

	copy: function( m ) {
		this.e00 = m.e00;
		this.e01 = m.e01;
		this.e02 = m.e02;
		this.e03 = m.e03;

		this.e10 = m.e10;
		this.e11 = m.e11;
		this.e12 = m.e12;
		this.e13 = m.e13;

		this.e20 = m.e20;
		this.e21 = m.e21;
		this.e22 = m.e22;
		this.e23 = m.e23;

		this.e30 = m.e30;
		this.e31 = m.e31;
		this.e32 = m.e32;
		this.e33 = m.e33;
	},

	makeTransform: function( rotation, translation ) {
		// Setup rotation
		var x2 = rotation.x + rotation.x,
			y2 = rotation.y + rotation.y,
			z2 = rotation.z + rotation.z,
			xx = rotation.x * x2,
			xy = rotation.x * y2,
			xz = rotation.x * z2,
			yy = rotation.y * y2,
			yz = rotation.y * z2,
			zz = rotation.z * z2,
			wx = rotation.w * x2,
			wy = rotation.w * y2,
			wz = rotation.w * z2;

		this.e00 = 1 - ( yy + zz );
		this.e10 = xy + wz;
		this.e20 = xz - wy;
		this.e30 = 0;
		this.e01 = xy - wz;
		this.e11 = 1 - (xx + zz);
		this.e21 = yz + wx;
		this.e31 = 0;
		this.e02 = xz + wy;
		this.e12 = yz - wx;
		this.e22 = 1 - (xx + yy);
		this.e32 = 0;

		// Translation
		this.e03 = translation.x;
		this.e13 = translation.y;
		this.e23 = translation.z;
		this.e33 = 1;
	},

	transformVector3: function( v ) {
		// Technically this should compute the `w` term and divide the resulting vector
		// components by `w` to homogenize but we don't scale so `w` is just `1`
		var x = v.x,
			y = v.y,
			z = v.z;
		v.x = this.e00 * x + this.e01 * y + this.e02 * z + this.e03;
		v.y = this.e10 * x + this.e11 * y + this.e12 * z + this.e13;
		v.z = this.e20 * x + this.e21 * y + this.e22 * z + this.e23;
	},

	transformVector3Into: function( v, dest ) {
		// Technically this should compute the `w` term and divide the resulting vector
		// components by `w` to homogenize but we don't scale so `w` is just `1`
		dest.x = this.e00 * v.x + this.e01 * v.y + this.e02 * v.z + this.e03;
		dest.y = this.e10 * v.x + this.e11 * v.y + this.e12 * v.z + this.e13;
		dest.z = this.e20 * v.x + this.e21 * v.y + this.e22 * v.z + this.e23;
	},

	rotateVector3: function( v ) {
		var x = v.x,
			y = v.y,
			z = v.z;
		v.x = this.e00 * x + this.e01 * y + this.e02 * z;
		v.y = this.e10 * x + this.e11 * y + this.e12 * z;
		v.z = this.e20 * x + this.e21 * y + this.e22 * z;
	},

	rotateVector3Into: function( v, dest ) {
		dest.x = this.e00 * v.x + this.e01 * v.y + this.e02 * v.z;
		dest.y = this.e10 * v.x + this.e11 * v.y + this.e12 * v.z;
		dest.z = this.e20 * v.x + this.e21 * v.y + this.e22 * v.z;
	},

	invert: function() {
		var a00 = this.e00, a01 = this.e01, a02 = this.e02, a03 = this.e03,
			a10 = this.e10, a11 = this.e11, a12 = this.e12, a13 = this.e13,
			a20 = this.e20, a21 = this.e21, a22 = this.e22, a23 = this.e23,
			a30 = this.e30, a31 = this.e31, a32 = this.e32, a33 = this.e33,

			b00 = a00 * a11 - a01 * a10,
			b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10,
			b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11,
			b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30,
			b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30,
			b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31,
			b11 = a22 * a33 - a23 * a32,

			d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
			invDet;

		// Calculate the determinant
		if ( !d ) {
			return false;
		}
		invDet = 1 / d;

		this.e00 = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
		this.e01 = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
		this.e02 = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
		this.e03 = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
		this.e10 = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
		this.e11 = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
		this.e12 = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
		this.e13 = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
		this.e20 = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
		this.e21 = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
		this.e22 = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
		this.e23 = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
		this.e30 = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
		this.e31 = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
		this.e32 = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
		this.e33 = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

		return true;
	},

	invertInto: function( m ) {
		var a00 = this.e00, a01 = this.e10, a02 = this.e20, a03 = this.e30,
			a10 = this.e01, a11 = this.e11, a12 = this.e21, a13 = this.e31,
			a20 = this.e02, a21 = this.e12, a22 = this.e22, a23 = this.e32,
			a30 = this.e03, a31 = this.e13, a32 = this.e23, a33 = this.e33,

			b00 = a00 * a11 - a01 * a10,
			b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10,
			b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11,
			b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30,
			b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30,
			b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31,
			b11 = a22 * a33 - a23 * a32,

			d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
			invDet;

		// Calculate the determinant
		if ( !d ) {
			return false;
		}
		invDet = 1 / d;

		m.e00 = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
		m.e10 = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
		m.e20 = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
		m.e30 = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
		m.e01 = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
		m.e11 = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
		m.e21 = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
		m.e31 = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
		m.e02 = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
		m.e12 = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
		m.e22 = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
		m.e32 = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
		m.e03 = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
		m.e13 = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
		m.e23 = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
		m.e33 = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
	},

	multiply: function( m ) {
		// Cache the matrix values (makes for huge speed increases!)
		var a00 = this.e00, a01 = this.e10, a02 = this.e20, a03 = this.e30;
		var a10 = this.e01, a11 = this.e11, a12 = this.e21, a13 = this.e31;
		var a20 = this.e02, a21 = this.e12, a22 = this.e22, a23 = this.e32;
		var a30 = this.e03, a31 = this.e13, a32 = this.e23, a33 = this.e33;

		// Cache only the current line of the second matrix
		var b0  = m.e00, b1 = m.e10, b2 = m.e20, b3 = m.e30;
		this.e00 = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		this.e10 = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		this.e20 = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		this.e30 = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = m.e01;
		b1 = m.e11;
		b2 = m.e21;
		b3 = m.e31;
		this.e01 = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		this.e11 = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		this.e21 = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		this.e31 = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = m.e02;
		b1 = m.e12;
		b2 = m.e22;
		b3 = m.e32;
		this.e02 = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		this.e12 = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		this.e22 = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		this.e32 = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = m.e03;
		b1 = m.e13;
		b2 = m.e23;
		b3 = m.e33;
		this.e03 = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		this.e13 = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		this.e23 = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		this.e33 = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	}
};
Goblin.Quaternion = function( x, y, z, w ) {
	this.x = x != null ? x : 0;
	this.y = y != null ? y : 0;
	this.z = z != null ? z : 0;
	this.w = w != null ? w : 1;
	this.normalize();
};

Goblin.Quaternion.prototype = {
	set: function( x, y, z, w ) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	},

	multiply: function( q ) {
		var x = this.x, y = this.y, z = this.z, w = this.w,
			qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		this.x = x * qw + w * qx + y * qz - z * qy;
		this.y = y * qw + w * qy + z * qx - x * qz;
		this.z = z * qw + w * qz + x * qy - y * qx;
		this.w = w * qw - x * qx - y * qy - z * qz;
	},

	multiplyQuaternions: function( a, b ) {
		this.x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
		this.y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
		this.z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
		this.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
	},

	normalize: function() {
		var x = this.x, y = this.y, z = this.z, w = this.w,
			length = Math.sqrt( x * x + y * y + z * z + w * w );

		if ( length === 0) {
			this.x = this.y = this.z = this.w = 0;
		} else {
			length = 1 / length;
			this.x *= length;
			this.y *= length;
			this.z *= length;
			this.w *= length;
		}
	},

	invertQuaternion: function( q ) {
		var x = q.x, y = q.y, z = q.z, w = q.w,
			dot = x * x + y * y + z * z + w * w;

		if ( dot === 0 ) {
			this.x = this.y = this.z = this.w = 0;
		} else {
			var inv_dot = -1 / dot;
			this.x = q.x * inv_dot;
			this.y = q.y *  inv_dot;
			this.z = q.z *  inv_dot;
			this.w = q.w *  -inv_dot;
		}
	},

	transformVector3: function( v ) {
		var x = v.x, y = v.y, z = v.z,
			qx = this.x, qy = this.y, qz = this.z, qw = this.w,

		// calculate quat * vec
			ix = qw * x + qy * z - qz * y,
			iy = qw * y + qz * x - qx * z,
			iz = qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat
		v.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		v.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		v.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	},

	transformVector3Into: function( v, dest ) {
		var x = v.x, y = v.y, z = v.z,
			qx = this.x, qy = this.y, qz = this.z, qw = this.w,

		// calculate quat * vec
			ix = qw * x + qy * z - qz * y,
			iy = qw * y + qz * x - qx * z,
			iz = qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat
		dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	}
};
Goblin.Vector3 = function( x, y, z ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

Goblin.Vector3.prototype = {
	set: function( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	},

	copy: function( v ) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	},

	add: function( v ) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},

	addVectors: function( a, b ) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
	},

	subtract: function( v ) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},

	subtractVectors: function( a, b ) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
	},

	multiply: function( v ) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
	},

	multiplyVectors: function( a, b ) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
	},

	scale: function( scalar ) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
	},

	scaleVector: function( v, scalar ) {
		this.x = v.x * scalar;
		this.y = v.y * scalar;
		this.z = v.z * scalar;
	},

	lengthSquared: function() {
		return this.dot( this );
	},

	length: function() {
		return Math.sqrt( this.lengthSquared() );
	},

	normalize: function() {
		var length = this.length();
		if ( length === 0 ) {
			this.x = this.y = this.z = 0;
		} else {
			this.scale( 1 / length );
		}
	},

	normalizeVector: function( v ) {
		this.copy( v );
		this.normalize();
	},

	dot: function( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},

	cross: function( v ) {
		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;
	},

	crossVectors: function( a, b ) {
		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;
	},

	distanceTo: function( v ) {
		var x = v.x - this.x,
			y = v.y - this.y,
			z = v.z - this.z;
		return Math.sqrt( x*x + y*y + z*z );
	},

	findOrthogonal: function( o1, o2 ) {
		var a, k;
		if ( Math.abs( this.z ) > 0.7071067811865476 ) {
			// choose p in y-z plane
			a = -this.y * this.y + this.z * this.z;
			k = 1 / Math.sqrt( a );
			o1.set( 0, -this.z * k, this.y * k );
			// set q = n x p
			o2.set( a * k, -this.x * o1.z, this.x * o1.y );
		}
		else {
			// choose p in x-y plane
			a = this.x * this.x + this.y * this.y;
			k = 1 / Math.sqrt( a );
			o1.set( -this.y * k, this.x * k, 0 );
			// set q = n x p
			o2.set( -this.z * o1.y, this.z * o1.x, a * k );
		}
	}
};
Goblin.EPSILON = 0.00001;

var _tmp_vec3_1 = new Goblin.Vector3(),
	_tmp_vec3_2 = new Goblin.Vector3(),
	_tmp_vec3_3 = new Goblin.Vector3(),

	_tmp_quat4_1 = new Goblin.Quaternion(),
	_tmp_quat4_2 = new Goblin.Quaternion(),

	_tmp_mat3_1 = new Goblin.Matrix3(),
	_tmp_mat3_2 = new Goblin.Matrix3();
Goblin.EventEmitter = function(){};

Goblin.EventEmitter.prototype = {
	addListener: function( event, listener ) {
		if ( this.listeners[event] == null ) {
			this.listeners[event] = [];
		}

		if ( this.listeners[event].indexOf( listener ) === -1 ) {
			this.listeners[event].push( listener );
		}
	},

	removeListener: function( event, listener ) {
		if ( this.listeners[event] == null ) {
			this.listeners[event] = [];
		}

		var index = this.listeners[event].indexOf( listener );
		if ( index !== -1 ) {
			this.listeners[event].splice( index, 1 );
		}
	},

	removeAllListeners: function() {
		var listeners = Object.keys( this.listeners );
		for ( var i = 0; i < listeners.length; i++ ) {
			this.listeners[listeners[i]].length = 0;
		}
	},

	emit: function( event ) {
		var event_arguments = Array.prototype.slice.call( arguments, 1 ),
			ret_value;

		if ( this.listeners[event] instanceof Array ) {
			var listeners = this.listeners[event].slice();
			for ( var i = 0; i < listeners.length; i++ ) {
				ret_value = listeners[i].apply( this, event_arguments );
				if ( ret_value === false ) {
					return false;
				}
			}
		}
	}
};

Goblin.EventEmitter.apply = function( klass ) {
	klass.prototype.addListener = Goblin.EventEmitter.prototype.addListener;
	klass.prototype.removeListener = Goblin.EventEmitter.prototype.removeListener;
	klass.prototype.removeAllListeners = Goblin.EventEmitter.prototype.removeAllListeners;
	klass.prototype.emit = Goblin.EventEmitter.prototype.emit;
};
/**
 * Represents a rigid body
 *
 * @class RigidBody
 * @constructor
 * @param shape
 * @param mass {Number}
 */
Goblin.RigidBody = (function() {
	var body_count = 0;

	return function( shape, mass ) {
		/**
		 * goblin ID of the body
		 *
		 * @property id
		 * @type {Number}
		 */
		this.id = body_count++;

		/**
		 * shape definition for this rigid body
		 *
		 * @property shape
		 */
		this.shape = shape;

        /**
         * axis-aligned bounding box enclosing this body
         *
         * @property aabb
         * @type {AABB}
         */
        this.aabb = new Goblin.AABB();

		/**
		 * the rigid body's mass
		 *
		 * @property mass
		 * @type {Number}
		 * @default Infinity
		 */
		this._mass = mass || Infinity;
		this._mass_inverted = 1 / mass;

		/**
		 * the rigid body's current position
		 *
		 * @property position
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 */
		this.position = new Goblin.Vector3();

		/**
		 * rotation of the rigid body
		 *
		 * @type {quat4}
		 */
		this.rotation = new Goblin.Quaternion( 0, 0, 0, 1 );

		/**
		 * the rigid body's current linear velocity
		 *
		 * @property linear_velocity
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 */
		this.linear_velocity = new Goblin.Vector3();

		/**
		 * the rigid body's current angular velocity
		 *
		 * @property angular_velocity
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 */
		this.angular_velocity = new Goblin.Vector3();

		/**
		 * transformation matrix transforming points from object space to world space
		 *
		 * @property transform
		 * @type {mat4}
		 */
		this.transform = new Goblin.Matrix4();
		this.transform.identity();

		/**
		 * transformation matrix transforming points from world space to object space
		 *
		 * @property transform_inverse
		 * @type {mat4}
		 */
		this.transform_inverse = new Goblin.Matrix4();
		this.transform_inverse.identity();

		this.inertiaTensor = shape.getInertiaTensor( mass );

		this.inverseInertiaTensor = new Goblin.Matrix3();
		this.inertiaTensor.invertInto( this.inverseInertiaTensor );

		this.inertiaTensorWorldFrame = new Goblin.Matrix3();

		this.inverseInertiaTensorWorldFrame = new Goblin.Matrix3();

		/**
		 * the rigid body's current acceleration
		 *
		 * @property acceleration
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 */
		this.acceleration = new Goblin.Vector3();

		/**
		 * amount of restitution this object has
		 *
		 * @property restitution
		 * @type {Number}
		 * @default 0.1
		 */
		this.restitution = 0.1;

		/**
		 * amount of friction this object has
		 *
		 * @property friction
		 * @type {Number}
		 * @default 0.5
		 */
		this.friction = 0.5;

		/**
		 * bitmask indicating what collision groups this object belongs to
		 * @type {number}
		 */
		this.collision_groups = 0;

		/**
		 * collision groups mask for the object, specifying what groups to not collide with (BIT 1=0) or which groups to only collide with (Bit 1=1)
		 * @type {number}
		 */
		this.collision_mask = 0;

		/**
		 * the rigid body's custom gravity
		 *
		 * @property gravity
		 * @type {vec3}
		 * @default null
		 * @private
		 */
		this.gravity = null;

		/**
		 * proportion of linear velocity lost per second ( 0.0 - 1.0 )
		 *
		 * @property linear_damping
		 * @type {Number}
		 */
		this.linear_damping = 0;

		/**
		 * proportion of angular velocity lost per second ( 0.0 - 1.0 )
		 *
		 * @property angular_damping
		 * @type {Number}
		 */
		this.angular_damping = 0;

		/**
		 * multiplier of linear force applied to this body
		 *
		 * @property linear_factor
		 * @type {Goblin.Vector3}
		 */
		this.linear_factor = new Goblin.Vector3( 1, 1, 1 );

		/**
		 * multiplier of angular force applied to this body
		 *
		 * @property angular_factor
		 * @type {Goblin.Vector3}
		 */
		this.angular_factor = new Goblin.Vector3( 1, 1, 1 );

		/**
		 * the world to which the rigid body has been added,
		 * this is set when the rigid body is added to a world
		 *
		 * @property world
		 * @type {Goblin.World}
		 * @default null
		 */
		this.world = null;

		/**
		 * all resultant force accumulated by the rigid body
		 * this force is applied in the next occurring integration
		 *
		 * @property accumulated_force
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 * @private
		 */
		this.accumulated_force = new Goblin.Vector3();

		/**
		 * All resultant torque accumulated by the rigid body
		 * this torque is applied in the next occurring integration
		 *
		 * @property accumulated_force
		 * @type {vec3}
		 * @default [ 0, 0, 0 ]
		 * @private
		 */
		this.accumulated_torque = new Goblin.Vector3();

		// Used by the constraint solver to determine what impulse needs to be added to the body
		this.push_velocity = new Goblin.Vector3();
		this.turn_velocity = new Goblin.Vector3();
		this.solver_impulse = new Float64Array( 6 );

		// Set default derived values
		this.updateDerived();

		this.listeners = {};
	};
})();
Goblin.EventEmitter.apply( Goblin.RigidBody );

Object.defineProperty(
	Goblin.RigidBody.prototype,
	'mass',
	{
		get: function() {
			return this._mass;
		},
		set: function( n ) {
			this._mass = n;
			this._mass_inverted = 1 / n;
			this.inertiaTensor = this.shape.getInertiaTensor( n );
		}
	}
);

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.RigidBody.prototype.findSupportPoint = (function(){
	var local_direction = new Goblin.Vector3();

	return function( direction, support_point ) {
		// Convert direction into local frame for the shape
		this.transform_inverse.rotateVector3Into( direction, local_direction );

		this.shape.findSupportPoint( local_direction, support_point );

		// Convert from the shape's local coordinates to world coordinates
		this.transform.transformVector3( support_point );
	};
})();

/**
 * Checks if a ray segment intersects with the object
 *
 * @method rayIntersect
 * @property ray_start {vec3} start point of the segment
 * @property ray_end {vec3{ end point of the segment
 * @property intersection_list {Array} array to append intersection to
 */
Goblin.RigidBody.prototype.rayIntersect = (function(){
	var local_start = new Goblin.Vector3(),
		local_end = new Goblin.Vector3();

	return function( ray_start, ray_end, intersection_list ) {
		// transform start & end into local coordinates
		this.transform_inverse.transformVector3Into( ray_start, local_start );
		this.transform_inverse.transformVector3Into( ray_end, local_end );

		// Intersect with shape
		var intersection = this.shape.rayIntersect( local_start, local_end );

		if ( intersection != null ) {
			intersection.object = this; // change from the shape to the body
			this.transform.transformVector3( intersection.point ); // transform shape's local coordinates to the body's world coordinates

            // Rotate intersection normal
			this.transform.rotateVector3( intersection.normal );

			intersection_list.push( intersection );
		}
	};
})();

/**
 * Updates the rigid body's position, velocity, and acceleration
 *
 * @method integrate
 * @param timestep {Number} time, in seconds, to use in integration
 */
Goblin.RigidBody.prototype.integrate = function( timestep ) {
	if ( this._mass === Infinity ) {
		return;
	}

	// Add accumulated linear force
	_tmp_vec3_1.scaleVector( this.accumulated_force, this._mass_inverted );
	_tmp_vec3_1.multiply( this.linear_factor );
	this.linear_velocity.add( _tmp_vec3_1 );

	// Add accumulated angular force
	this.inverseInertiaTensorWorldFrame.transformVector3Into( this.accumulated_torque, _tmp_vec3_1 );
	_tmp_vec3_1.multiply( this.angular_factor );
	this.angular_velocity.add( _tmp_vec3_1 );

	// Apply damping
	this.linear_velocity.scale( Math.pow( 1 - this.linear_damping, timestep ) );
	this.angular_velocity.scale( Math.pow( 1 - this.angular_damping, timestep ) );

	// Update position
	_tmp_vec3_1.scaleVector( this.linear_velocity, timestep );
	this.position.add( _tmp_vec3_1 );

	// Update rotation
	_tmp_quat4_1.x = this.angular_velocity.x * timestep;
	_tmp_quat4_1.y = this.angular_velocity.y * timestep;
	_tmp_quat4_1.z = this.angular_velocity.z * timestep;
	_tmp_quat4_1.w = 0;

	_tmp_quat4_1.multiply( this.rotation );

	var half_dt = 0.5;
	this.rotation.x += half_dt * _tmp_quat4_1.x;
	this.rotation.y += half_dt * _tmp_quat4_1.y;
	this.rotation.z += half_dt * _tmp_quat4_1.z;
	this.rotation.w += half_dt * _tmp_quat4_1.w;
	this.rotation.normalize();

	// Clear accumulated forces
	this.accumulated_force.x = this.accumulated_force.y = this.accumulated_force.z = 0;
	this.accumulated_torque.x = this.accumulated_torque.y = this.accumulated_torque.z = 0;
	this.solver_impulse[0] = this.solver_impulse[1] = this.solver_impulse[2] = this.solver_impulse[3] = this.solver_impulse[4] = this.solver_impulse[5] = 0;
	this.push_velocity.x = this.push_velocity.y = this.push_velocity.z = 0;
	this.turn_velocity.x = this.turn_velocity.y = this.turn_velocity.z = 0;
};

/**
 * Sets a custom gravity value for this rigid_body
 *
 * @method setGravity
 * @param x {Number} gravity to apply on x axis
 * @param y {Number} gravity to apply on y axis
 * @param z {Number} gravity to apply on z axis
 */
Goblin.RigidBody.prototype.setGravity = function( x, y, z ) {
	if ( this.gravity ) {
		this.gravity.x = x;
		this.gravity.y = y;
		this.gravity.z = z;
	} else {
		this.gravity = new Goblin.Vector3( x, y, z );
	}
};

/**
 * Directly adds linear velocity to the body
 *
 * @method applyImpulse
 * @param impulse {vec3} linear velocity to add to the body
 */
Goblin.RigidBody.prototype.applyImpulse = function( impulse ) {
	_tmp_vec3_1.multiplyVectors( impulse, this.linear_factor );
	this.linear_velocity.add( _tmp_vec3_1 );
};

/**
 * Adds a force to the rigid_body which will be used only for the next integration
 *
 * @method applyForce
 * @param force {vec3} force to apply to the rigid_body
 */
Goblin.RigidBody.prototype.applyForce = function( force ) {
	this.accumulated_force.add( force );
};

/**
 * Applies the vector `force` at world coordinate `point`
 *
 * @method applyForceAtWorldPoint
 * @param force {vec3} Force to apply
 * @param point {vec3} world coordinates where force originates
 */
Goblin.RigidBody.prototype.applyForceAtWorldPoint = function( force, point ) {
	_tmp_vec3_1.copy( point );
	_tmp_vec3_1.subtract( this.position );
	_tmp_vec3_1.cross( force );

	this.accumulated_force.add( force );
	this.accumulated_torque.add( _tmp_vec3_1 );
};

/**
 * Applies vector `force` to body at position `point` in body's frame
 *
 * @method applyForceAtLocalPoint
 * @param force {vec3} Force to apply
 * @param point {vec3} local frame coordinates where force originates
 */
Goblin.RigidBody.prototype.applyForceAtLocalPoint = function( force, point ) {
	this.transform.transformVector3Into( point, _tmp_vec3_1 );
	this.applyForceAtWorldPoint( force, _tmp_vec3_1 );
};

Goblin.RigidBody.prototype.getVelocityInLocalPoint = function( point, out ) {
	if ( this._mass === Infinity ) {
		out.set( 0, 0, 0 );
	} else {
		out.copy( this.angular_velocity );
		out.cross( point );
		out.add( this.linear_velocity );
	}
};

/**
 * Sets the rigid body's transformation matrix to the current position and rotation
 *
 * @method updateDerived
 */
Goblin.RigidBody.prototype.updateDerived = function() {
	// normalize rotation
	this.rotation.normalize();

	// update this.transform and this.transform_inverse
	this.transform.makeTransform( this.rotation, this.position );
	this.transform.invertInto( this.transform_inverse );

	// Update the world frame inertia tensor and inverse
	if ( this._mass !== Infinity ) {
		_tmp_mat3_1.fromMatrix4( this.transform_inverse );
		_tmp_mat3_1.transposeInto( _tmp_mat3_2 );
		_tmp_mat3_2.multiply( this.inertiaTensor );
		this.inertiaTensorWorldFrame.multiplyFrom( _tmp_mat3_2, _tmp_mat3_1 );

		this.inertiaTensorWorldFrame.invertInto( this.inverseInertiaTensorWorldFrame );
	}

	// Update AABB
	this.aabb.transform( this.shape.aabb, this.transform );
};
/**
 * adds a constant force to associated objects
 *
 * @class ForceGenerator
 * @constructor
 * @param force {vec3} [optional] force the generator applies
*/
Goblin.ForceGenerator = function( force ) {
	/**
	* force which will be applied to affected objects
	*
	* @property force
	* @type {vec3}
	* @default [ 0, 0, 0 ]
	*/
	this.force = force || new Goblin.Vector3();

	/**
	* whether or not the force generator is enabled
	*
	* @property enabled
	* @type {Boolean}
	* @default true
	*/
	this.enabled = true;

	/**
	* array of objects affected by the generator
	*
	* @property affected
	* @type {Array}
	* @default []
	* @private
	*/
	this.affected = [];
};
/**
* applies force to the associated objects
*
* @method applyForce
*/
Goblin.ForceGenerator.prototype.applyForce = function() {
	if ( !this.enabled ) {
		return;
	}

	var i, affected_count;
	for ( i = 0, affected_count = this.affected.length; i < affected_count; i++ ) {
		this.affected[i].applyForce( this.force );
	}
};
/**
* enables the force generator
*
* @method enable
*/
Goblin.ForceGenerator.prototype.enable = function() {
	this.enabled = true;
};
/**
* disables the force generator
*
* @method disable
*/
Goblin.ForceGenerator.prototype.disable = function() {
	this.enabled = false;
};
/**
* adds an object to be affected by the generator
*
* @method affect
* @param object {Mixed} object to be affected, must have `applyForce` method
*/
Goblin.ForceGenerator.prototype.affect = function( object ) {
	var i, affected_count;
	// Make sure this object isn't already affected
	for ( i = 0, affected_count = this.affected.length; i < affected_count; i++ ) {
		if ( this.affected[i] === object ) {
			return;
		}
	}

	this.affected.push( object );
};
/**
* removes an object from being affected by the generator
*
* @method unaffect
* @param object {Mixed} object to be affected, must have `applyForce` method
*/
Goblin.ForceGenerator.prototype.unaffect = function( object ) {
	var i, affected_count;
	for ( i = 0, affected_count = this.affected.length; i < affected_count; i++ ) {
		if ( this.affected[i] === object ) {
			this.affected.splice( i, 1 );
			return;
		}
	}
};
/**
 * @class TriangleShape
 * @param vertex_a {Vector3} first vertex
 * @param vertex_b {Vector3} second vertex
 * @param vertex_c {Vector3} third vertex
 * @constructor
 */
Goblin.TriangleShape = function( vertex_a, vertex_b, vertex_c ) {
	/**
	 * first vertex of the triangle
	 *
	 * @property a
	 * @type {Vector3}
	 */
	this.a = vertex_a;

	/**
	 * second vertex of the triangle
	 *
	 * @property b
	 * @type {Vector3}
	 */
	this.b = vertex_b;

	/**
	 * third vertex of the triangle
	 *
	 * @property c
	 * @type {Vector3}
	 */
	this.c = vertex_c;

	/**
	 * normal vector of the triangle
	 *
	 * @property normal
	 * @type {Goblin.Vector3}
	 */
	this.normal = new Goblin.Vector3();
	_tmp_vec3_1.subtractVectors( this.b, this.a );
	_tmp_vec3_2.subtractVectors( this.c, this.a );
	this.normal.crossVectors( _tmp_vec3_1, _tmp_vec3_2 );

	/**
	 * area of the triangle
	 *
	 * @property volume
	 * @type {Number}
	 */
	this.volume = this.normal.length() / 2;

	this.normal.normalize();

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.TriangleShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = Math.min( this.a.x, this.b.x, this.c.x );
	aabb.min.y = Math.min( this.a.y, this.b.y, this.c.y );
	aabb.min.z = Math.min( this.a.z, this.b.z, this.c.z );

	aabb.max.x = Math.max( this.a.x, this.b.x, this.c.x );
	aabb.max.y = Math.max( this.a.y, this.b.y, this.c.y );
	aabb.max.z = Math.max( this.a.z, this.b.z, this.c.z );
};

Goblin.TriangleShape.prototype.getInertiaTensor = function( mass ) {
	// @TODO http://www.efunda.com/math/areas/triangle.cfm
	return new Goblin.Matrix3(
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	);
};

Goblin.TriangleShape.prototype.classifyVertex = function( vertex ) {
	var w = this.normal.dot( this.a );
	return this.normal.dot( vertex ) - w;
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.TriangleShape.prototype.findSupportPoint = function( direction, support_point ) {
	var dot, best_dot = -Infinity;

	dot = direction.dot( this.a );
	if ( dot > best_dot ) {
		support_point.copy( this.a );
		best_dot = dot;
	}

	dot = direction.dot( this.b );
	if ( dot > best_dot ) {
		support_point.copy( this.b );
		best_dot = dot;
	}

	dot = direction.dot( this.c );
	if ( dot > best_dot ) {
		support_point.copy( this.c );
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.TriangleShape.prototype.rayIntersect = (function(){
	var d1 = new Goblin.Vector3(),
		d2 = new Goblin.Vector3(),
		n = new Goblin.Vector3(),
		segment = new Goblin.Vector3(),
		b = new Goblin.Vector3(),
		u = new Goblin.Vector3();

	return function( start, end ) {
		d1.subtractVectors( this.b, this.a );
		d2.subtractVectors( this.c, this.a );
		n.crossVectors( d1, d2 );

		segment.subtractVectors( end, start );
		var det = -segment.dot( n );

		if ( det <= 0 ) {
			// Ray is parallel to triangle or triangle's normal points away from ray
			return null;
		}

		b.subtractVectors( start, this.a );

		var t = b.dot( n ) / det;
		if ( 0 > t || t > 1 ) {
			// Ray doesn't intersect the triangle's plane
			return null;
		}

		u.crossVectors( b, segment );
		var u1 = d2.dot( u ) / det,
			u2 = -d1.dot( u ) / det;

		if ( u1 + u2 > 1 || u1 < 0 || u2 < 0 ) {
			// segment does not intersect triangle
			return null;
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.t = t * segment.length();
		intersection.point.scaleVector( segment, t );
		intersection.point.add( start );
		intersection.normal.copy( this.normal );

		return intersection;
	};
})();
/**
 * @class AABB
 * @param [min] {vec3}
 * @param [max] {vec3}
 * @constructor
 */
Goblin.AABB = function( min, max ) {
	/**
	 * @property min
	 * @type {vec3}
	 */
	this.min = min || new Goblin.Vector3();

	/**
	 * @property max
	 * @type {vec3}
	 */
	this.max = max || new Goblin.Vector3();
};

Goblin.AABB.prototype.copy = function( aabb ) {
	this.min.x = aabb.min.x;
	this.min.y = aabb.min.y;
	this.min.z = aabb.min.z;

	this.max.x = aabb.max.x;
	this.max.y = aabb.max.y;
	this.max.z = aabb.max.z;
};

Goblin.AABB.prototype.combineAABBs = function( a, b ) {
	this.min.x = Math.min( a.min.x, b.min.x );
	this.min.y = Math.min( a.min.y, b.min.y );
	this.min.z = Math.min( a.min.z, b.min.z );

	this.max.x = Math.max( a.max.x, b.max.x );
	this.max.y = Math.max( a.max.y, b.max.y );
	this.max.z = Math.max( a.max.z, b.max.z );
};

Goblin.AABB.prototype.transform = (function(){
	var local_half_extents = new Goblin.Vector3(),
		local_center = new Goblin.Vector3(),
		center = new Goblin.Vector3(),
		extents = new Goblin.Vector3(),
		abs = new Goblin.Matrix3();

	return function( local_aabb, matrix ) {
		local_half_extents.subtractVectors( local_aabb.max, local_aabb.min );
		local_half_extents.scale( 0.5  );

		local_center.addVectors( local_aabb.max, local_aabb.min );
		local_center.scale( 0.5  );

		matrix.transformVector3Into( local_center, center );

		// Extract the absolute rotation matrix
		abs.e00 = Math.abs( matrix.e00 );
		abs.e01 = Math.abs( matrix.e01 );
		abs.e02 = Math.abs( matrix.e02 );
		abs.e10 = Math.abs( matrix.e10 );
		abs.e11 = Math.abs( matrix.e11 );
		abs.e12 = Math.abs( matrix.e12 );
		abs.e20 = Math.abs( matrix.e20 );
		abs.e21 = Math.abs( matrix.e21 );
		abs.e22 = Math.abs( matrix.e22 );

		_tmp_vec3_1.x = abs.e00;
		_tmp_vec3_1.y = abs.e10;
		_tmp_vec3_1.z = abs.e20;
		extents.x = local_half_extents.dot( _tmp_vec3_1 );

		_tmp_vec3_1.x = abs.e01;
		_tmp_vec3_1.y = abs.e11;
		_tmp_vec3_1.z = abs.e21;
		extents.y = local_half_extents.dot( _tmp_vec3_1 );

		_tmp_vec3_1.x = abs.e02;
		_tmp_vec3_1.y = abs.e12;
		_tmp_vec3_1.z = abs.e22;
		extents.z = local_half_extents.dot( _tmp_vec3_1 );

		this.min.subtractVectors( center, extents );
		this.max.addVectors( center, extents );
	};
})();

Goblin.AABB.prototype.intersects = function( aabb ) {
    if (
        this.max.x < aabb.min.x ||
        this.max.y < aabb.min.y ||
        this.max.z < aabb.min.z ||
        this.min.x > aabb.max.x ||
        this.min.y > aabb.max.y ||
        this.min.z > aabb.max.z
    )
    {
        return false;
    }

    return true;
};

/**
 * Checks if a ray segment intersects with this AABB
 *
 * @method testRayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {boolean}
 */
Goblin.AABB.prototype.testRayIntersect = (function(){
	var direction = new Goblin.Vector3(),
		tmin, tmax,
		ood, t1, t2;

	return function AABB_testRayIntersect( start, end ) {
		tmin = 0;

		direction.subtractVectors( end, start );
		tmax = direction.length();
		direction.scale( 1 / tmax ); // normalize direction

		var extent_min, extent_max;

        // Check X axis
        extent_min = this.min.x;
        extent_max = this.max.x;
        if ( Math.abs( direction.x ) < Goblin.EPSILON ) {
            // Ray is parallel to axis
            if ( start.x < extent_min || start.x > extent_max ) {
                return false;
            }
        } else {
            ood = 1 / direction.x;
            t1 = ( extent_min - start.x ) * ood;
            t2 = ( extent_max - start.x ) * ood;
            if ( t1 > t2 ) {
                ood = t1; // ood is a convenient temp variable as it's not used again
                t1 = t2;
                t2 = ood;
            }

            // Find intersection intervals
            tmin = Math.max( tmin, t1 );
            tmax = Math.min( tmax, t2 );

            if ( tmin > tmax ) {
                return false;
            }
        }

        // Check Y axis
        extent_min = this.min.y;
        extent_max = this.max.y;
        if ( Math.abs( direction.y ) < Goblin.EPSILON ) {
            // Ray is parallel to axis
            if ( start.y < extent_min || start.y > extent_max ) {
                return false;
            }
        } else {
            ood = 1 / direction.y;
            t1 = ( extent_min - start.y ) * ood;
            t2 = ( extent_max - start.y ) * ood;
            if ( t1 > t2 ) {
                ood = t1; // ood is a convenient temp variable as it's not used again
                t1 = t2;
                t2 = ood;
            }

            // Find intersection intervals
            tmin = Math.max( tmin, t1 );
            tmax = Math.min( tmax, t2 );

            if ( tmin > tmax ) {
                return false;
            }
        }

        // Check Z axis
        extent_min = this.min.z;
        extent_max = this.max.z;
        if ( Math.abs( direction.z ) < Goblin.EPSILON ) {
            // Ray is parallel to axis
            if ( start.z < extent_min || start.z > extent_max ) {
                return false;
            }
        } else {
            ood = 1 / direction.z;
            t1 = ( extent_min - start.z ) * ood;
            t2 = ( extent_max - start.z ) * ood;
            if ( t1 > t2 ) {
                ood = t1; // ood is a convenient temp variable as it's not used again
                t1 = t2;
                t2 = ood;
            }

            // Find intersection intervals
            tmin = Math.max( tmin, t1 );
            tmax = Math.min( tmax, t2 );

            if ( tmin > tmax ) {
                return false;
            }
        }

		return true;
	};
})();
(function(){
	function getSurfaceArea( aabb ) {
		var x = aabb.max.x - aabb.min.x,
			y = aabb.max.y - aabb.min.y,
			z = aabb.max.z - aabb.min.z;
		return x * ( y + z ) + y * z;
	}

	/**
	 * Tree node for a BVH
	 *
	 * @class BVHNode
	 * @param [object] {Object} leaf object in the BVH tree
	 * @constructor
	 * @private
	 */
	var BVHNode = function( object ) {
		this.aabb = new Goblin.AABB();
		this.area = 0;

		this.parent = null;
		this.left = null;
		this.right = null;

		this.morton = null;

		this.object = object || null;
	};
	BVHNode.prototype = {
		isLeaf: function() {
			return this.object != null;
		},

		computeBounds: function( global_aabb ) {
			if ( this.isLeaf() ) {
				this.aabb.copy( this.object.aabb );
			} else {
				this.aabb.combineAABBs( this.left.aabb, this.right.aabb );
			}

			this.area = getSurfaceArea( this.aabb );
		},

		valueOf: function() {
			return this.area;
		}
	};

	/**
	 * Bottom-up BVH construction based on "Efficient BVH Construction via Approximate Agglomerative Clustering", Yan Gu 2013
	 *
	 * @Class AAC
	 * @static
	 * @private
	 */
	var AAC = (function(){
		function part1By2( n ) {
			n = ( n ^ ( n << 16 ) ) & 0xff0000ff;
			n = ( n ^ ( n << 8 ) ) & 0x0300f00f;
			n = ( n ^ ( n << 4 ) ) & 0x030c30c3;
			n = ( n ^ ( n << 2 ) ) & 0x09249249;
			return n;
		}
		function morton( x, y, z ) {
			return ( part1By2( z ) << 2 ) + ( part1By2( y ) << 1 ) + part1By2( x );
		}

		var _tmp_aabb = new Goblin.AABB();

		var AAC = function( global_aabb, leaves ) {
			var global_width = global_aabb.max.x - global_aabb.min.x,
				global_height = global_aabb.max.y - global_aabb.min.y,
				global_depth = global_aabb.max.z - global_aabb.min.z,
				max_value = 1 << 9,
				scale_x = max_value / global_width,
				scale_y = max_value / global_height,
				scale_z = max_value / global_depth;

			// Compute the morton code for each leaf
			for ( var i = 0; i < leaves.length; i++ ) {
				var leaf = leaves[i],
					// find center of aabb
					x = ( leaf.aabb.max.x - leaf.aabb.min.x ) / 2 + leaf.aabb.min.x,
					y = ( leaf.aabb.max.y - leaf.aabb.min.y ) / 2 + leaf.aabb.min.y,
					z = ( leaf.aabb.max.z - leaf.aabb.min.z ) / 2 + leaf.aabb.min.z;

				leaf.morton = morton(
					( x + global_aabb.min.x ) * scale_x,
					( y + global_aabb.min.y ) * scale_y,
					( z + global_aabb.min.z ) * scale_z
				);
			}

			// Sort leaves based on morton code
			leaves.sort( AAC.mortonSort );
			var tree = AAC.buildTree( leaves, 29 ); // @TODO smaller starting bit, log4N or log2N or log10N ?
			//var tree = AAC.buildTree( leaves, 20 ); // @TODO smaller starting bit, log4N or log2N or log10N ?
			AAC.combineCluster( tree, 1 );
			return tree;
		};
		AAC.mortonSort = function( a, b ) {
			if ( a.morton < b.morton ) {
				return -1;
			} else if ( a.morton > b.morton ) {
				return 1;
			} else {
				return 0;
			}
		};
		AAC.clusterReductionCount = function( cluster_size ) {
			var c = Math.pow( cluster_size, 0.5 ) / 2,
				a = 0.5;
			return Math.max( c * Math.pow( cluster_size, a ), 1 );
		};
		AAC.buildTree = function( nodes, bit ) {
			var cluster = [];

			if ( nodes.length < AAC.max_bucket_size ) {
				cluster.push.apply( cluster, nodes );
				AAC.combineCluster( cluster, AAC.clusterReductionCount( AAC.max_bucket_size ) );
			} else {
				var left = [],
					right = [];

				if ( bit < 1 ) {
					// no more bits, just cut bucket in half
					left = nodes.slice( 0, nodes.length / 2 );
					right = nodes.slice( nodes.length / 2 );
				} else {
					var bit_value = 1 << bit;
					for ( var i = 0; i < nodes.length; i++ ) {
						var node = nodes[i];
						if ( node.morton & bit_value ) {
							right.push( node );
						} else {
							left.push( node );
						}
					}
				}
				cluster.push.apply( cluster, AAC.buildTree( left, bit - 1 ) );
				cluster.push.apply( cluster, AAC.buildTree( right, bit - 1 ) );
				AAC.combineCluster( cluster, AAC.clusterReductionCount( cluster.length ) );
			}

			return cluster;
		};
		AAC.combineCluster = function( cluster, max_clusters ) {
			if ( cluster.length <= 1 ) {
				return cluster;
			}

			// find the best match for each object
			var merge_queue = new Goblin.MinHeap(),
				merged_node;
			for ( var i = 0; i < cluster.length; i++ ) {
				merged_node = new BVHNode();
				merged_node.left = cluster[i];
				merged_node.right = AAC.findBestMatch( cluster, cluster[i] );
				merged_node.computeBounds();
				merge_queue.push( merged_node );
			}

			var best_cluster;
			while( cluster.length > max_clusters ) {
				best_cluster = merge_queue.pop();
				cluster.splice( cluster.indexOf( best_cluster.left ), 1 );
				cluster.splice( cluster.indexOf( best_cluster.right ), 1 );
				cluster.push( best_cluster );

				// update the merge queue
				// @TODO don't clear the whole heap every time, only need to update any nodes which touched best_cluster.left / best_cluster.right
				merge_queue.heap.length = 0;
				for ( i = 0; i < cluster.length; i++ ) {
					merged_node = new BVHNode();
					merged_node.left = cluster[i];
					merged_node.right = AAC.findBestMatch( cluster, cluster[i] );
					merged_node.computeBounds();
					merge_queue.push( merged_node );
				}
			}
		};
		AAC.findBestMatch = function( cluster, object ) {
			var area,
				best_area = Infinity,
				best_idx = 0;
			for ( var i = 0; i < cluster.length; i++ ) {
				if ( cluster[i] === object ) {
					continue;
				}
				_tmp_aabb.combineAABBs( object.aabb, cluster[i].aabb );
				area = getSurfaceArea( _tmp_aabb );

				if ( area < best_area ) {
					best_area = area;
					best_idx = i;
				}
			}

			return cluster[best_idx];
		};
		AAC.max_bucket_size = 20;
		return AAC;
	})();

	/**
	 * Creates a bounding volume hierarchy around a group of objects which have AABBs
	 *
	 * @class BVH
	 * @param bounded_objects {Array} group of objects to be hierarchized
	 * @constructor
	 */
	Goblin.BVH = function( bounded_objects ) {
		// Create a node for each object
		var leaves = [],
			global_aabb = new Goblin.AABB();

		for ( var i = 0; i < bounded_objects.length; i++ ) {
			global_aabb.combineAABBs( global_aabb, bounded_objects[i].aabb );
			var leaf = new BVHNode( bounded_objects[i] );
			leaf.computeBounds();
			leaves.push( leaf );
		}

		this.tree = AAC( global_aabb, leaves )[0];
	};

	Goblin.BVH.AAC = AAC;
})();
/**
 * Structure which holds information about a contact between two objects
 *
 * @Class ContactDetails
 * @constructor
 */
Goblin.ContactDetails = function() {
	/**
	 * first body in the  contact
	 *
	 * @property object_a
	 * @type {Goblin.RigidBody}
	 */
	this.object_a = null;

	/**
	 * second body in the  contact
	 *
	 * @property object_b
	 * @type {Goblin.RigidBody}
	 */
	this.object_b = null;

	/**
	 * point of contact in world coordinates
	 *
	 * @property contact_point
	 * @type {vec3}
	 */
	this.contact_point = new Goblin.Vector3();

	/**
	 * contact point in local frame of `object_a`
	 *
	 * @property contact_point_in_a
	 * @type {vec3}
	 */
	this.contact_point_in_a = new Goblin.Vector3();

	/**
	 * contact point in local frame of `object_b`
	 *
	 * @property contact_point_in_b
	 * @type {vec3}
	 */
	this.contact_point_in_b = new Goblin.Vector3();

	/**
	 * normal vector, in world coordinates, of the contact
	 *
	 * @property contact_normal
	 * @type {vec3}
	 */
	this.contact_normal = new Goblin.Vector3();

	/**
	 * how far the objects are penetrated at the point of contact
	 *
	 * @property penetration_depth
	 * @type {Number}
	 */
	this.penetration_depth = 0;

	/**
	 * amount of restitution between the objects in contact
	 *
	 * @property restitution
	 * @type {Number}
	 */
	this.restitution = 0;

	/**
	 * amount of friction between the objects in contact
	 *
	 * @property friction
	 * @type {*}
	 */
	this.friction = 0;

	this.listeners = {};
};
Goblin.EventEmitter.apply( Goblin.ContactDetails );

Goblin.ContactDetails.prototype.destroy = function() {
	this.emit( 'destroy' );
	Goblin.ObjectPool.freeObject( 'ContactDetails', this );
};
/**
 * Structure which holds information about the contact points between two objects
 *
 * @Class ContactManifold
 * @constructor
 */
Goblin.ContactManifold = function() {
	/**
	 * first body in the contact
	 *
	 * @property object_a
	 * @type {RigidBody}
	 */
	this.object_a = null;

	/**
	 * second body in the contact
	 *
	 * @property object_b
	 * @type {RigidBody}
	 */
	this.object_b = null;

	/**
	 * array of the active contact points for this manifold
	 *
	 * @property points
	 * @type {Array}
	 */
	this.points = [];

	/**
	 * reference to the next `ContactManifold` in the list
	 *
	 * @property next_manifold
	 * @type {ContactManifold}
	 */
	this.next_manifold = null;
};

/**
 * Determines which cached contact should be replaced with the new contact
 *
 * @method findWeakestContact
 * @param {ContactDetails} new_contact
 */
Goblin.ContactManifold.prototype.findWeakestContact = function( new_contact ) {
	// Find which of the current contacts has the deepest penetration
	var max_penetration_index = -1,
		max_penetration = new_contact.penetration_depth,
		i,
		contact;
	for ( i = 0; i < 4; i++ ) {
		contact = this.points[i];
		if ( contact.penetration_depth > max_penetration ) {
			max_penetration = contact.penetration_depth;
			max_penetration_index = i;
		}
	}

	// Estimate contact areas
	var res0 = 0,
		res1 = 0,
		res2 = 0,
		res3 = 0;
	if ( max_penetration_index !== 0 ) {
		_tmp_vec3_1.subtractVectors( new_contact.contact_point_in_a, this.points[1].contact_point_in_a );
		_tmp_vec3_2.subtractVectors( this.points[3].contact_point_in_a, this.points[2].contact_point_in_a );
		_tmp_vec3_1.cross( _tmp_vec3_2 );
		res0 = _tmp_vec3_1.lengthSquared();
	}
	if ( max_penetration_index !== 1 ) {
		_tmp_vec3_1.subtractVectors( new_contact.contact_point_in_a, this.points[0].contact_point_in_a );
		_tmp_vec3_2.subtractVectors( this.points[3].contact_point_in_a, this.points[2].contact_point_in_a );
		_tmp_vec3_1.cross( _tmp_vec3_2 );
		res1 = _tmp_vec3_1.lengthSquared();
	}
	if ( max_penetration_index !== 2 ) {
		_tmp_vec3_1.subtractVectors( new_contact.contact_point_in_a, this.points[0].contact_point_in_a );
		_tmp_vec3_2.subtractVectors( this.points[3].contact_point_in_a, this.points[1].contact_point_in_a );
		_tmp_vec3_1.cross( _tmp_vec3_2 );
		res2 = _tmp_vec3_1.lengthSquared();
	}
	if ( max_penetration_index !== 3 ) {
		_tmp_vec3_1.subtractVectors( new_contact.contact_point_in_a, this.points[0].contact_point_in_a );
		_tmp_vec3_2.subtractVectors( this.points[2].contact_point_in_a, this.points[1].contact_point_in_a );
		_tmp_vec3_1.cross( _tmp_vec3_2 );
		res3 = _tmp_vec3_1.lengthSquared();
	}

	var max_index = 0,
		max_val = res0;
	if ( res1 > max_val ) {
		max_index = 1;
		max_val = res1;
	}
	if ( res2 > max_val ) {
		max_index = 2;
		max_val = res2;
	}
	if ( res3 > max_val ) {
		max_index = 3;
	}

	return max_index;
};

/**
 * Adds a contact point to the manifold
 *
 * @param {Goblin.ContactDetails} contact
 */
Goblin.ContactManifold.prototype.addContact = function( contact ) {
	//@TODO add feature-ids to detect duplicate contacts
	var i;
	for ( i = 0; i < this.points.length; i++ ) {
		if ( this.points[i].contact_point.distanceTo( contact.contact_point ) <= 0.02 ) {
			contact.destroy();
			return;
		}
	}

	var use_contact = false;
	if ( contact != null ) {
		use_contact = contact.object_a.emit( 'speculativeContact', contact.object_b, contact );
		if ( use_contact !== false ) {
			use_contact = contact.object_b.emit( 'speculativeContact', contact.object_a, contact );
		}

		if ( use_contact === false ) {
			contact.destroy();
			return;
		} else {
			contact.object_a.emit( 'contact', contact.object_b, contact );
			contact.object_b.emit( 'contact', contact.object_a, contact );
		}
	}

	// Add contact if we don't have enough points yet
	if ( this.points.length < 4 ) {
		this.points.push( contact );
	} else {
		var replace_index = this.findWeakestContact( contact );
		this.points[replace_index].destroy();
		this.points[replace_index] = contact;
	}
};

/**
 * Updates all of this manifold's ContactDetails with the correct contact location & penetration depth
 *
 * @method update
 */
Goblin.ContactManifold.prototype.update = function() {
	// Update positions / depths of contacts
	var i,
		j,
		point,
		object_a_world_coords = new Goblin.Vector3(),
		object_b_world_coords = new Goblin.Vector3(),
		vector_difference = new Goblin.Vector3();

	for ( i = 0; i < this.points.length; i++ ) {
		point = this.points[i];

		// Convert the local contact points into world coordinates
		point.object_a.transform.transformVector3Into( point.contact_point_in_a, object_a_world_coords );
		point.object_b.transform.transformVector3Into( point.contact_point_in_b, object_b_world_coords );

		// Find new world contact point
		point.contact_point.addVectors( object_a_world_coords, object_b_world_coords );
		point.contact_point.scale( 0.5  );

		// Find the new penetration depth
		vector_difference.subtractVectors( object_a_world_coords, object_b_world_coords );
		point.penetration_depth = vector_difference.dot( point.contact_normal );

		// If distance from contact is too great remove this contact point
		if ( point.penetration_depth < -0.02 ) {
			// Points are too far away along the contact normal
			point.destroy();
			for ( j = i; j < this.points.length; j++ ) {
				this.points[j] = this.points[j + 1];
			}
			this.points.length = this.points.length - 1;
		} else {
			// Check if points are too far away orthogonally
			_tmp_vec3_1.scaleVector( point.contact_normal, point.penetration_depth );
			_tmp_vec3_1.subtractVectors( object_a_world_coords, _tmp_vec3_1 );

			_tmp_vec3_1.subtractVectors( object_b_world_coords, _tmp_vec3_1 );
			var distance = _tmp_vec3_1.lengthSquared();
			if ( distance > 0.2 * 0.2 ) {
				// Points are indeed too far away
				point.destroy();
				for ( j = i; j < this.points.length; j++ ) {
					this.points[j] = this.points[j + 1];
				}
				this.points.length = this.points.length - 1;
			}
		}
	}

	if ( this.points.length === 0 ) {
		this.object_a.emit( 'endContact', this.object_b );
		this.object_b.emit( 'endContact', this.object_a );
	}
};
/**
 * List/Manager of ContactManifolds
 *
 * @Class ContactManifoldList
 * @constructor
 */
Goblin.ContactManifoldList = function() {
	/**
	 * The first ContactManifold in the list
	 *
	 * @property first
	 * @type {ContactManifold}
	 */
	this.first = null;
};

/**
 * Inserts a ContactManifold into the list
 *
 * @method insert
 * @param {ContactManifold} contact_manifold contact manifold to insert into the list
 */
Goblin.ContactManifoldList.prototype.insert = function( contact_manifold ) {
	// The list is completely unordered, throw the manifold at the beginning
	contact_manifold.next_manifold = this.first;
	this.first = contact_manifold;
};

/**
 * Returns (and possibly creates) a ContactManifold for the two rigid bodies
 *
 * @param {RigidBody} object_a
 * @param {RigidBoxy} object_b
 * @returns {ContactManifold}
 */
Goblin.ContactManifoldList.prototype.getManifoldForObjects = function( object_a, object_b ) {
	var manifold = null;
	if ( this.first !== null ) {
		var current = this.first;
		while ( current !== null ) {
			if (
				current.object_a === object_a && current.object_b === object_b ||
				current.object_a === object_b && current.object_b === object_a
			) {
				manifold = current;
				break;
			}
			current = current.next_manifold;
		}
	}

	if ( manifold === null ) {
		// A manifold for these two objects does not exist, create one
		manifold = Goblin.ObjectPool.getObject( 'ContactManifold' );
		manifold.object_a = object_a;
		manifold.object_b = object_b;
		this.insert( manifold );
	}

	return manifold;
};
Goblin.GhostBody = function( shape ) {
    Goblin.RigidBody.call( this, shape, Infinity );

    this.contacts = [];
    this.tick_contacts = [];

    this.addListener( 'speculativeContact', Goblin.GhostBody.prototype.onSpeculativeContact );
};

Goblin.GhostBody.prototype = Object.create( Goblin.RigidBody.prototype );

Goblin.GhostBody.prototype.onSpeculativeContact = function( object_b, contact ) {
    this.tick_contacts.push( object_b );
    if ( this.contacts.indexOf( object_b ) === -1 ) {
        this.contacts.push( object_b );
        this.emit( 'contactStart', object_b, contact );
    } else {
        this.emit( 'contactContinue', object_b, contact );
    }

    return false;
};

Goblin.GhostBody.prototype.checkForEndedContacts = function() {
    for ( var i = 0; i < this.contacts.length; i++ ) {
        if ( this.tick_contacts.indexOf( this.contacts[i] ) === -1 ) {
            this.emit( 'contactEnd', this.contacts[i] );
            this.contacts.splice( i, 1 );
            i -= 1;
        }
    }
    this.tick_contacts.length = 0;
};
/**
 * Adapted from BulletPhysics's btIterativeSolver
 *
 * @class IterativeSolver
 * @constructor
 */
Goblin.IterativeSolver = function() {
	/**
	 * Holds contact constraints generated from contact manifolds
	 *
	 * @property contact_constraints
	 * @type {Array}
	 */
	this.contact_constraints = [];

	/**
	 * Holds friction constraints generated from contact manifolds
	 *
	 * @property friction_constraints
	 * @type {Array}
	 */
	this.friction_constraints = [];

	/**
	 * array of all constraints being solved
	 *
	 * @property all_constraints
	 * @type {Array}
	 */
	this.all_constraints = [];

	/**
	 * array of constraints on the system, excluding contact & friction
	 *
	 * @property constraints
	 * @type {Array}
	 */
	this.constraints = [];

	/**
	 * maximum solver iterations per time step
	 *
	 * @property max_iterations
	 * @type {number}
	 */
	this.max_iterations = 10;

	/**
	 * maximum solver iterations per time step to resolve contacts
	 *
	 * @property penetrations_max_iterations
	 * @type {number}
	 */
	this.penetrations_max_iterations = 5;

	/**
	 * used to relax the contact position solver, 0 is no position correction and 1 is full correction
	 *
	 * @property relaxation
	 * @type {number}
	 * @default 0.1
	 */
	this.relaxation = 0.1;

	/**
	 * weighting used in the Gauss-Seidel successive over-relaxation solver
	 *
	 * @property sor_weight
	 * @type {number}
	 */
	this.sor_weight = 0.85;

	/**
	 * how much of the solution to start with on the next solver pass
	 *
	 * @property warmstarting_factor
	 * @type {number}
	 */
	this.warmstarting_factor = 0.95;


	var solver = this;
	/**
	 * used to remove contact constraints from the system when their contacts are destroyed
	 *
	 * @method onContactDeactivate
	 * @private
	 */
	this.onContactDeactivate = function() {
		this.removeListener( 'deactivate', solver.onContactDeactivate );

		var idx = solver.contact_constraints.indexOf( this );
		solver.contact_constraints.splice( idx, 1 );
	};
	/**
	 * used to remove friction constraints from the system when their contacts are destroyed
	 *
	 * @method onFrictionDeactivate
	 * @private
	 */
	this.onFrictionDeactivate = function() {
		this.removeListener( 'deactivate', solver.onFrictionDeactivate );

		var idx = solver.friction_constraints.indexOf( this );
		solver.friction_constraints.splice( idx, 1 );
	};
};

/**
 * adds a constraint to the solver
 *
 * @method addConstraint
 * @param constraint {Goblin.Constraint} constraint to be added
 */
Goblin.IterativeSolver.prototype.addConstraint = function( constraint ) {
	if ( this.constraints.indexOf( constraint ) === -1 ) {
		this.constraints.push( constraint );
	}
};

/**
 * removes a constraint from the solver
 *
 * @method removeConstraint
 * @param constraint {Goblin.Constraint} constraint to be removed
 */
Goblin.IterativeSolver.prototype.removeConstraint = function( constraint ) {
	var idx = this.constraints.indexOf( constraint );
	if ( idx !== -1 ) {
		this.constraints.splice( idx, 1 );
	}
};

/**
 * Converts contact manifolds into contact constraints
 *
 * @method processContactManifolds
 * @param contact_manifolds {Array} contact manifolds to process
 */
Goblin.IterativeSolver.prototype.processContactManifolds = function( contact_manifolds ) {
	var i, j,
		manifold,
		contacts_length,
		contact,
		constraint;

	manifold = contact_manifolds.first;

	// @TODO this seems like it should be very optimizable
	while( manifold ) {
		contacts_length = manifold.points.length;

		for ( i = 0; i < contacts_length; i++ ) {
			contact = manifold.points[i];

			var existing_constraint = null;
			for ( j = 0; j < this.contact_constraints.length; j++ ) {
				if ( this.contact_constraints[j].contact === contact ) {
					existing_constraint = this.contact_constraints[j];
					break;
				}
			}

			if ( !existing_constraint ) {
				// Build contact constraint
				constraint = Goblin.ObjectPool.getObject( 'ContactConstraint' );
				constraint.buildFromContact( contact );
				this.contact_constraints.push( constraint );
				constraint.addListener( 'deactivate', this.onContactDeactivate );

				// Build friction constraint
				constraint = Goblin.ObjectPool.getObject( 'FrictionConstraint' );
				constraint.buildFromContact( contact );
				this.friction_constraints.push( constraint );
				constraint.addListener( 'deactivate', this.onFrictionDeactivate );
			}
		}

		manifold = manifold.next_manifold;
	}

	// @TODO just for now
	this.all_constraints.length = 0;
	Array.prototype.push.apply( this.all_constraints, this.friction_constraints );
	Array.prototype.push.apply( this.all_constraints, this.constraints );
	Array.prototype.push.apply( this.all_constraints, this.contact_constraints );
};

Goblin.IterativeSolver.prototype.prepareConstraints = function( time_delta ) {
	var num_constraints = this.all_constraints.length,
		num_rows,
		constraint,
		row,
		i, j;

	for ( i = 0; i < num_constraints; i++ ) {
		constraint = this.all_constraints[i];
		if ( constraint.active === false ) {
			continue;
		}
		num_rows = constraint.rows.length;

		constraint.update( time_delta );
		for ( j = 0; j < num_rows; j++ ) {
			row = constraint.rows[j];
			row.multiplier = 0;
			row.computeB( constraint ); // Objects' inverted mass & inertia tensors & Jacobian
			row.computeD();
			row.computeEta( constraint, time_delta ); // Amount of work needed for the constraint
		}
	}
};

Goblin.IterativeSolver.prototype.resolveContacts = function() {
	var iteration,
		constraint,
		jdot, row, i,
		delta_lambda,
		max_impulse = 0,
		invmass;

	// Solve penetrations
	for ( iteration = 0; iteration < this.penetrations_max_iterations; iteration++ ) {
		max_impulse = 0;
		for ( i = 0; i < this.contact_constraints.length; i++ ) {
			constraint = this.contact_constraints[i];
			row = constraint.rows[0];

			jdot = 0;
			if ( constraint.object_a != null && constraint.object_a._mass !== Infinity ) {
				jdot += (
					row.jacobian[0] * constraint.object_a.linear_factor.x * constraint.object_a.push_velocity.x +
					row.jacobian[1] * constraint.object_a.linear_factor.y * constraint.object_a.push_velocity.y +
					row.jacobian[2] * constraint.object_a.linear_factor.z * constraint.object_a.push_velocity.z +
					row.jacobian[3] * constraint.object_a.angular_factor.x * constraint.object_a.turn_velocity.x +
					row.jacobian[4] * constraint.object_a.angular_factor.y * constraint.object_a.turn_velocity.y +
					row.jacobian[5] * constraint.object_a.angular_factor.z * constraint.object_a.turn_velocity.z
				);
			}
			if ( constraint.object_b != null && constraint.object_b._mass !== Infinity ) {
				jdot += (
					row.jacobian[6] * constraint.object_b.linear_factor.x * constraint.object_b.push_velocity.x +
					row.jacobian[7] * constraint.object_b.linear_factor.y * constraint.object_b.push_velocity.y +
					row.jacobian[8] * constraint.object_b.linear_factor.z * constraint.object_b.push_velocity.z +
					row.jacobian[9] * constraint.object_b.angular_factor.x * constraint.object_b.turn_velocity.x +
					row.jacobian[10] * constraint.object_b.angular_factor.y * constraint.object_b.turn_velocity.y +
					row.jacobian[11] * constraint.object_b.angular_factor.z * constraint.object_b.turn_velocity.z
				);
			}

			delta_lambda = ( constraint.contact.penetration_depth - jdot ) / row.D || 0;
			var cache = row.multiplier;
			row.multiplier = Math.max(
				row.lower_limit,
				Math.min(
					cache + delta_lambda,
					row.upper_limit
				)
			);
			delta_lambda = row.multiplier - cache;
			max_impulse = Math.max( max_impulse, delta_lambda );

			if ( constraint.object_a && constraint.object_a._mass !== Infinity ) {
				constraint.object_a.push_velocity.x += delta_lambda * row.B[0];
				constraint.object_a.push_velocity.y += delta_lambda * row.B[1];
				constraint.object_a.push_velocity.z += delta_lambda * row.B[2];

				constraint.object_a.turn_velocity.x += delta_lambda * row.B[3];
				constraint.object_a.turn_velocity.y += delta_lambda * row.B[4];
				constraint.object_a.turn_velocity.z += delta_lambda * row.B[5];
			}
			if ( constraint.object_b && constraint.object_b._mass !== Infinity ) {
				constraint.object_b.push_velocity.x += delta_lambda * row.B[6];
				constraint.object_b.push_velocity.y += delta_lambda * row.B[7];
				constraint.object_b.push_velocity.z += delta_lambda * row.B[8];

				constraint.object_b.turn_velocity.x += delta_lambda * row.B[9];
				constraint.object_b.turn_velocity.y += delta_lambda * row.B[10];
				constraint.object_b.turn_velocity.z += delta_lambda * row.B[11];
			}
		}

		if ( max_impulse >= -Goblin.EPSILON && max_impulse <= Goblin.EPSILON ) {
			break;
		}
	}

	// Apply position/rotation solver
	for ( i = 0; i < this.contact_constraints.length; i++ ) {
		constraint = this.contact_constraints[i];
		row = constraint.rows[0];

		if ( constraint.object_a != null && constraint.object_a._mass !== Infinity ) {
			invmass = constraint.object_a._mass_inverted;
			constraint.object_a.position.x += invmass * row.jacobian[0] * constraint.object_a.linear_factor.x * row.multiplier * this.relaxation;
			constraint.object_a.position.y += invmass * row.jacobian[1] * constraint.object_a.linear_factor.y * row.multiplier * this.relaxation;
			constraint.object_a.position.z += invmass * row.jacobian[2] * constraint.object_a.linear_factor.z * row.multiplier * this.relaxation;

			_tmp_vec3_1.x = row.jacobian[3] * constraint.object_a.angular_factor.x * row.multiplier * this.relaxation;
			_tmp_vec3_1.y = row.jacobian[4] * constraint.object_a.angular_factor.y * row.multiplier * this.relaxation;
			_tmp_vec3_1.z = row.jacobian[5] * constraint.object_a.angular_factor.z * row.multiplier * this.relaxation;
			constraint.object_a.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );

			_tmp_quat4_1.x = _tmp_vec3_1.x;
			_tmp_quat4_1.y = _tmp_vec3_1.y;
			_tmp_quat4_1.z = _tmp_vec3_1.z;
			_tmp_quat4_1.w = 0;
			_tmp_quat4_1.multiply( constraint.object_a.rotation );

			constraint.object_a.rotation.x += 0.5 * _tmp_quat4_1.x;
			constraint.object_a.rotation.y += 0.5 * _tmp_quat4_1.y;
			constraint.object_a.rotation.z += 0.5 * _tmp_quat4_1.z;
			constraint.object_a.rotation.w += 0.5 * _tmp_quat4_1.w;
			constraint.object_a.rotation.normalize();
		}

		if ( constraint.object_b != null && constraint.object_b._mass !== Infinity ) {
			invmass = constraint.object_b._mass_inverted;
			constraint.object_b.position.x += invmass * row.jacobian[6] * constraint.object_b.linear_factor.x * row.multiplier * this.relaxation;
			constraint.object_b.position.y += invmass * row.jacobian[7] * constraint.object_b.linear_factor.y * row.multiplier * this.relaxation;
			constraint.object_b.position.z += invmass * row.jacobian[8] * constraint.object_b.linear_factor.z * row.multiplier * this.relaxation;

			_tmp_vec3_1.x = row.jacobian[9] * constraint.object_b.angular_factor.x * row.multiplier * this.relaxation;
			_tmp_vec3_1.y = row.jacobian[10] * constraint.object_b.angular_factor.y * row.multiplier * this.relaxation;
			_tmp_vec3_1.z = row.jacobian[11] * constraint.object_b.angular_factor.z * row.multiplier * this.relaxation;
			constraint.object_b.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );

			_tmp_quat4_1.x = _tmp_vec3_1.x;
			_tmp_quat4_1.y = _tmp_vec3_1.y;
			_tmp_quat4_1.z = _tmp_vec3_1.z;
			_tmp_quat4_1.w = 0;
			_tmp_quat4_1.multiply( constraint.object_b.rotation );

			constraint.object_b.rotation.x += 0.5 * _tmp_quat4_1.x;
			constraint.object_b.rotation.y += 0.5 * _tmp_quat4_1.y;
			constraint.object_b.rotation.z += 0.5 * _tmp_quat4_1.z;
			constraint.object_b.rotation.w += 0.5 * _tmp_quat4_1.w;
			constraint.object_b.rotation.normalize();
		}

		row.multiplier = 0;
	}
};

Goblin.IterativeSolver.prototype.solveConstraints = function() {
	var num_constraints = this.all_constraints.length,
		constraint,
		num_rows,
		row,
		warmth,
		i, j;

	var iteration,
		delta_lambda,
		max_impulse = 0, // Track the largest impulse per iteration; if the impulse is <= EPSILON then early out
		jdot;

	// Warm starting
	for ( i = 0; i < num_constraints; i++ ) {
		constraint = this.all_constraints[i];
		if ( constraint.active === false ) {
			continue;
		}

		for ( j = 0; j < constraint.rows.length; j++ ) {
			row = constraint.rows[j];
			warmth = row.multiplier_cached * this.warmstarting_factor;
			row.multiplier = warmth;

			if ( constraint.object_a && constraint.object_a._mass !== Infinity ) {
				constraint.object_a.solver_impulse[0] += warmth * row.B[0];
				constraint.object_a.solver_impulse[1] += warmth * row.B[1];
				constraint.object_a.solver_impulse[2] += warmth * row.B[2];

				constraint.object_a.solver_impulse[3] += warmth * row.B[3];
				constraint.object_a.solver_impulse[4] += warmth * row.B[4];
				constraint.object_a.solver_impulse[5] += warmth * row.B[5];
			}
			if ( constraint.object_b && constraint.object_b._mass !== Infinity ) {
				constraint.object_b.solver_impulse[0] += warmth * row.B[6];
				constraint.object_b.solver_impulse[1] += warmth * row.B[7];
				constraint.object_b.solver_impulse[2] += warmth * row.B[8];

				constraint.object_b.solver_impulse[3] += warmth * row.B[9];
				constraint.object_b.solver_impulse[4] += warmth * row.B[10];
				constraint.object_b.solver_impulse[5] += warmth * row.B[11];
			}
		}
	}

	for ( iteration = 0; iteration < this.max_iterations; iteration++ ) {
		max_impulse = 0;
		for ( i = 0; i < num_constraints; i++ ) {
			constraint = this.all_constraints[i];
			if ( constraint.active === false ) {
				continue;
			}
			num_rows = constraint.rows.length;

			for ( j = 0; j < num_rows; j++ ) {
				row = constraint.rows[j];

				jdot = 0;
				if ( constraint.object_a != null && constraint.object_a._mass !== Infinity ) {
					jdot += (
						row.jacobian[0] * constraint.object_a.linear_factor.x * constraint.object_a.solver_impulse[0] +
						row.jacobian[1] * constraint.object_a.linear_factor.y * constraint.object_a.solver_impulse[1] +
						row.jacobian[2] * constraint.object_a.linear_factor.z * constraint.object_a.solver_impulse[2] +
						row.jacobian[3] * constraint.object_a.angular_factor.x * constraint.object_a.solver_impulse[3] +
						row.jacobian[4] * constraint.object_a.angular_factor.y * constraint.object_a.solver_impulse[4] +
						row.jacobian[5] * constraint.object_a.angular_factor.z * constraint.object_a.solver_impulse[5]
						);
				}
				if ( constraint.object_b != null && constraint.object_b._mass !== Infinity ) {
					jdot += (
						row.jacobian[6] * constraint.object_b.linear_factor.x * constraint.object_b.solver_impulse[0] +
						row.jacobian[7] * constraint.object_b.linear_factor.y * constraint.object_b.solver_impulse[1] +
						row.jacobian[8] * constraint.object_b.linear_factor.z * constraint.object_b.solver_impulse[2] +
						row.jacobian[9] * constraint.object_b.angular_factor.x * constraint.object_b.solver_impulse[3] +
						row.jacobian[10] * constraint.object_b.angular_factor.y * constraint.object_b.solver_impulse[4] +
						row.jacobian[11] * constraint.object_b.angular_factor.z * constraint.object_b.solver_impulse[5]
					);
				}

				delta_lambda = ( ( row.eta - jdot ) / row.D || 0) * constraint.factor;
				var cache = row.multiplier,
					multiplier_target = cache + delta_lambda;


				// successive over-relaxation
				multiplier_target = this.sor_weight * multiplier_target + ( 1 - this.sor_weight ) * cache;

				// Clamp to row constraints
				row.multiplier = Math.max(
					row.lower_limit,
					Math.min(
						multiplier_target,
						row.upper_limit
					)
				);

				// Find final `delta_lambda`
				delta_lambda = row.multiplier - cache;

				var total_mass = ( constraint.object_a && constraint.object_a._mass !== Infinity ? constraint.object_a._mass : 0 ) +
					( constraint.object_b && constraint.object_b._mass !== Infinity ? constraint.object_b._mass : 0 );
				max_impulse = Math.max( max_impulse, Math.abs( delta_lambda ) / total_mass );

				if ( constraint.object_a && constraint.object_a._mass !== Infinity ) {
					constraint.object_a.solver_impulse[0] += delta_lambda * row.B[0];
					constraint.object_a.solver_impulse[1] += delta_lambda * row.B[1];
					constraint.object_a.solver_impulse[2] += delta_lambda * row.B[2];

					constraint.object_a.solver_impulse[3] += delta_lambda * row.B[3];
					constraint.object_a.solver_impulse[4] += delta_lambda * row.B[4];
					constraint.object_a.solver_impulse[5] += delta_lambda * row.B[5];
				}
				if ( constraint.object_b && constraint.object_b._mass !== Infinity ) {
					constraint.object_b.solver_impulse[0] += delta_lambda * row.B[6];
					constraint.object_b.solver_impulse[1] += delta_lambda * row.B[7];
					constraint.object_b.solver_impulse[2] += delta_lambda * row.B[8];

					constraint.object_b.solver_impulse[3] += delta_lambda * row.B[9];
					constraint.object_b.solver_impulse[4] += delta_lambda * row.B[10];
					constraint.object_b.solver_impulse[5] += delta_lambda * row.B[11];
				}
			}
		}

		if ( max_impulse <= 0.1 ) {
			break;
		}
	}
};

Goblin.IterativeSolver.prototype.applyConstraints = function( time_delta ) {
	var num_constraints = this.all_constraints.length,
		constraint,
		num_rows,
		row,
		i, j,
		invmass;

	for ( i = 0; i < num_constraints; i++ ) {
		constraint = this.all_constraints[i];
		if ( constraint.active === false ) {
			continue;
		}
		num_rows = constraint.rows.length;

		constraint.last_impulse.x = constraint.last_impulse.y = constraint.last_impulse.z = 0;

		for ( j = 0; j < num_rows; j++ ) {
			row = constraint.rows[j];
			row.multiplier_cached = row.multiplier;

			if ( constraint.object_a != null && constraint.object_a._mass !== Infinity ) {
				invmass = constraint.object_a._mass_inverted;
				_tmp_vec3_2.x = invmass * time_delta * row.jacobian[0] * constraint.object_a.linear_factor.x * row.multiplier;
				_tmp_vec3_2.y = invmass * time_delta * row.jacobian[1] * constraint.object_a.linear_factor.y * row.multiplier;
				_tmp_vec3_2.z = invmass * time_delta * row.jacobian[2] * constraint.object_a.linear_factor.z * row.multiplier;
				constraint.object_a.linear_velocity.add( _tmp_vec3_2 );
				constraint.last_impulse.add( _tmp_vec3_2 );

				_tmp_vec3_1.x = time_delta * row.jacobian[3] * constraint.object_a.angular_factor.x * row.multiplier;
				_tmp_vec3_1.y = time_delta * row.jacobian[4] * constraint.object_a.angular_factor.y * row.multiplier;
				_tmp_vec3_1.z = time_delta * row.jacobian[5] * constraint.object_a.angular_factor.z * row.multiplier;
				constraint.object_a.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
				constraint.object_a.angular_velocity.add( _tmp_vec3_1 );
				constraint.last_impulse.add( _tmp_vec3_1 );
			}

			if ( constraint.object_b != null && constraint.object_b._mass !== Infinity ) {
				invmass = constraint.object_b._mass_inverted;
				_tmp_vec3_2.x = invmass * time_delta * row.jacobian[6] * constraint.object_b.linear_factor.x * row.multiplier;
				_tmp_vec3_2.y = invmass * time_delta * row.jacobian[7] * constraint.object_b.linear_factor.y * row.multiplier;
				_tmp_vec3_2.z = invmass * time_delta * row.jacobian[8] * constraint.object_b.linear_factor.z * row.multiplier;
				constraint.object_b.linear_velocity.add(_tmp_vec3_2 );
				constraint.last_impulse.add( _tmp_vec3_2 );

				_tmp_vec3_1.x = time_delta * row.jacobian[9] * constraint.object_b.angular_factor.x * row.multiplier;
				_tmp_vec3_1.y = time_delta * row.jacobian[10] * constraint.object_b.angular_factor.y * row.multiplier;
				_tmp_vec3_1.z = time_delta * row.jacobian[11] * constraint.object_b.angular_factor.z * row.multiplier;
				constraint.object_b.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
				constraint.object_b.angular_velocity.add( _tmp_vec3_1 );
				constraint.last_impulse.add( _tmp_vec3_1 );
			}
		}

		if ( constraint.breaking_threshold > 0 ) {
			if ( constraint.last_impulse.lengthSquared() >= constraint.breaking_threshold * constraint.breaking_threshold ) {
				constraint.active = false;
			}
		}
	}
};
/**
 * Takes possible contacts found by a broad phase and determines if they are legitimate contacts
 *
 * @class NarrowPhase
 * @constructor
 */
Goblin.NarrowPhase = function() {
	/**
	 * holds all contacts which currently exist in the scene
	 *
	 * @property contact_manifolds
	 * @type Goblin.ContactManifoldList
	 */
	this.contact_manifolds = new Goblin.ContactManifoldList();
};

/**
 * Iterates over all contact manifolds, updating penetration depth & contact locations
 *
 * @method updateContactManifolds
 */
Goblin.NarrowPhase.prototype.updateContactManifolds = function() {
	var current = this.contact_manifolds.first,
		prev = null;

	while ( current !== null ) {
		current.update();

		if ( current.points.length === 0 ) {
			Goblin.ObjectPool.freeObject( 'ContactManifold', current );
			if ( prev == null ) {
				this.contact_manifolds.first = current.next_manifold;
			} else {
				prev.next_manifold = current.next_manifold;
			}
			current = current.next_manifold;
		} else {
			prev = current;
			current = current.next_manifold;
		}
	}
};

Goblin.NarrowPhase.prototype.midPhase = function( object_a, object_b ) {
	var compound,
		other;

	if ( object_a.shape instanceof Goblin.CompoundShape ) {
		compound = object_a;
		other = object_b;
	} else {
		compound = object_b;
		other = object_a;
	}

	var proxy = Goblin.ObjectPool.getObject( 'RigidBodyProxy' ),
		child_shape, contact;
	for ( var i = 0; i < compound.shape.child_shapes.length; i++ ) {
		child_shape = compound.shape.child_shapes[i];
		proxy.setFrom( compound, child_shape );

		if ( proxy.shape instanceof Goblin.CompoundShape || other.shape instanceof Goblin.CompoundShape ) {
			this.midPhase( proxy, other );
		} else {
			contact = this.getContact( proxy, other );
			if ( contact != null ) {
				var parent_a, parent_b;
				if ( contact.object_a === proxy ) {
					contact.object_a = compound;
					parent_a = proxy;
					parent_b = other;
				} else {
					contact.object_b = compound;
					parent_a = other;
					parent_b = proxy;
				}

				if ( parent_a instanceof Goblin.RigidBodyProxy ) {
					while ( parent_a.parent ) {
						if ( parent_a instanceof Goblin.RigidBodyProxy ) {
							parent_a.shape_data.transform.transformVector3( contact.contact_point_in_a );
						}
						parent_a = parent_a.parent;
					}
				}

				if ( parent_b instanceof Goblin.RigidBodyProxy ) {
					while ( parent_b.parent ) {
						if ( parent_b instanceof Goblin.RigidBodyProxy ) {
							parent_b.shape_data.transform.transformVector3( contact.contact_point_in_b );
						}
						parent_b = parent_b.parent;
					}
				}

				contact.object_a = parent_a;
				contact.object_b = parent_b;
				this.addContact( parent_a, parent_b, contact );
			}
		}
	}
	Goblin.ObjectPool.freeObject( 'RigidBodyProxy', proxy );
};

Goblin.NarrowPhase.prototype.meshCollision = (function(){
	var b_to_a = new Goblin.Matrix4(),
		tri_b = new Goblin.TriangleShape( new Goblin.Vector3(), new Goblin.Vector3(), new Goblin.Vector3() ),
		b_aabb = new Goblin.AABB(),
		b_right_aabb = new Goblin.AABB(),
		b_left_aabb = new Goblin.AABB();

	function meshMesh( object_a, object_b, addContact ) {
		// get matrix which converts from object_b's space to object_a
		b_to_a.copy( object_a.transform_inverse );
		b_to_a.multiply( object_b.transform );

		// traverse both objects' AABBs while they overlap, if two overlapping leaves are found then perform Triangle/Triangle intersection test
		var nodes = [ object_a.shape.hierarchy, object_b.shape.hierarchy ];
		//debugger;
		while ( nodes.length ) {
			var a_node = nodes.shift(),
				b_node = nodes.shift();

			if ( a_node.isLeaf() && b_node.isLeaf() ) {
				// Both sides are triangles, do intersection test
                // convert node_b's triangle into node_a's frame
                b_to_a.transformVector3Into( b_node.object.a, tri_b.a );
                b_to_a.transformVector3Into( b_node.object.b, tri_b.b );
                b_to_a.transformVector3Into( b_node.object.c, tri_b.c );
                _tmp_vec3_1.subtractVectors( tri_b.b, tri_b.a );
                _tmp_vec3_2.subtractVectors( tri_b.c, tri_b.a );
                tri_b.normal.crossVectors( _tmp_vec3_1, _tmp_vec3_2 );
                tri_b.normal.normalize();

				var contact = Goblin.TriangleTriangle( a_node.object, tri_b );
                if ( contact != null ) {
					object_a.transform.rotateVector3( contact.contact_normal );

                    object_a.transform.transformVector3( contact.contact_point );

                    object_a.transform.transformVector3( contact.contact_point_in_b );
                    object_b.transform_inverse.transformVector3( contact.contact_point_in_b );

                    contact.object_a = object_a;
                    contact.object_b = object_b;

                    contact.restitution = ( object_a.restitution + object_b.restitution ) / 2;
                    contact.friction = ( object_a.friction + object_b.friction ) / 2;
                    /*console.log( contact );
                    debugger;*/

                    addContact( object_a, object_b, contact );
                }
			} else if ( a_node.isLeaf() ) {
				// just a_node is a leaf
				b_left_aabb.transform( b_node.left.aabb, b_to_a );
				if ( a_node.aabb.intersects( b_left_aabb ) ) {
					nodes.push( a_node, b_node.left );
				}
				b_right_aabb.transform( b_node.right.aabb, b_to_a );
				if ( a_node.aabb.intersects( b_right_aabb ) ) {
					nodes.push( a_node, b_node.right );
				}
			} else if ( b_node.isLeaf() ) {
				// just b_node is a leaf
				b_aabb.transform( b_node.aabb, b_to_a );
				if ( b_aabb.intersects( a_node.left.aabb ) ) {
					nodes.push( a_node.left, b_node );
				}
				if ( b_aabb.intersects( a_node.right.aabb ) ) {
					nodes.push( a_node.right, b_node );
				}
			} else {
				// neither node is a branch
				b_left_aabb.transform( b_node.left.aabb, b_to_a );
				b_right_aabb.transform( b_node.right.aabb, b_to_a );
				if ( a_node.left.aabb.intersects( b_left_aabb ) ) {
					nodes.push( a_node.left, b_node.left );
				}
				if ( a_node.left.aabb.intersects( b_right_aabb ) ) {
					nodes.push( a_node.left, b_node.right );
				}
				if ( a_node.right.aabb.intersects( b_left_aabb ) ) {
					nodes.push( a_node.right, b_node.left );
				}
				if ( a_node.right.aabb.intersects( b_right_aabb ) ) {
					nodes.push( a_node.right, b_node.right );
				}
			}
		}
	}

	function triangleConvex( triangle, mesh, convex ) {
		// Create proxy to convert convex into mesh's space
		var proxy = Goblin.ObjectPool.getObject( 'RigidBodyProxy' );

		var child_shape = new Goblin.CompoundShapeChild( triangle, new Goblin.Vector3(), new Goblin.Quaternion() );
		proxy.setFrom( mesh, child_shape );

		var simplex = Goblin.GjkEpa.GJK( proxy, convex ),
			contact;
		if ( Goblin.GjkEpa.result != null ) {
			contact = Goblin.GjkEpa.result;
		} else if ( simplex != null ) {
			contact = Goblin.GjkEpa.EPA( simplex );
		}

		Goblin.ObjectPool.freeObject( 'RigidBodyProxy', proxy );

		return contact;
	}

	var meshConvex = (function(){
		var convex_to_mesh = new Goblin.Matrix4(),
			convex_aabb_in_mesh = new Goblin.AABB();

		return function meshConvex( mesh, convex, addContact ) {
			// Find matrix that converts convex into mesh space
			convex_to_mesh.copy( convex.transform );
			convex_to_mesh.multiply( mesh.transform_inverse );

			convex_aabb_in_mesh.transform( convex.aabb, mesh.transform_inverse );

			// Traverse the BHV in mesh
			var pending_nodes = [ mesh.shape.hierarchy ],
				node;
			while ( ( node = pending_nodes.shift() ) ) {
				if ( node.aabb.intersects( convex_aabb_in_mesh ) ) {
					if ( node.isLeaf() ) {
						// Check node for collision
						var contact = triangleConvex( node.object, mesh, convex );
						if ( contact != null ) {
							var _mesh = mesh;
							while ( _mesh.parent != null ) {
								_mesh = _mesh.parent;
							}
							contact.object_a = _mesh;
							addContact( _mesh, convex, contact );
						}
					} else {
						pending_nodes.push( node.left, node.right );
					}
				}
			}
		};
	})();

	return function meshCollision( object_a, object_b ) {
		var a_is_mesh = object_a.shape instanceof Goblin.MeshShape,
			b_is_mesh = object_b.shape instanceof Goblin.MeshShape;

		if ( a_is_mesh && b_is_mesh ) {
			meshMesh( object_a, object_b, this.addContact.bind( this ) );
		} else {
			if ( a_is_mesh ) {
				meshConvex( object_a, object_b, this.addContact.bind( this ) );
			} else {
				meshConvex( object_b, object_a, this.addContact.bind( this ) );
			}
		}
	};
})();

/**
 * Tests two objects for contact
 *
 * @method getContact
 * @param {RigidBody} object_a
 * @param {RigidBody} object_b
 */
Goblin.NarrowPhase.prototype.getContact = function( object_a, object_b ) {
	if ( object_a.shape instanceof Goblin.CompoundShape || object_b.shape instanceof Goblin.CompoundShape ) {
		this.midPhase( object_a, object_b );
		return;
	}

	if ( object_a.shape instanceof Goblin.MeshShape || object_b.shape instanceof Goblin.MeshShape ) {
		this.meshCollision( object_a, object_b );
		return;
	}

	var contact;

	if ( object_a.shape instanceof Goblin.SphereShape && object_b.shape instanceof Goblin.SphereShape ) {
		// Sphere - Sphere contact check
		contact = Goblin.SphereSphere( object_a, object_b );
	} else if (
		object_a.shape instanceof Goblin.SphereShape && object_b.shape instanceof Goblin.BoxShape ||
		object_a.shape instanceof Goblin.BoxShape && object_b.shape instanceof Goblin.SphereShape
	) {
		// Sphere - Box contact check
		contact = Goblin.BoxSphere( object_a, object_b );
	} else {
		// contact check based on GJK
		var simplex = Goblin.GjkEpa.GJK( object_a, object_b );
		if ( Goblin.GjkEpa.result != null ) {
			contact = Goblin.GjkEpa.result;
		} else if ( simplex != null ) {
			contact = Goblin.GjkEpa.EPA( simplex );
		}
	}

	return contact;
};

Goblin.NarrowPhase.prototype.addContact = function( object_a, object_b, contact ) {
	this.contact_manifolds.getManifoldForObjects( object_a, object_b ).addContact( contact );
};

/**
 * Loops over the passed array of object pairs which may be in contact
 * valid contacts are put in this object's `contacts` property
 *
 * @param possible_contacts {Array}
 */
Goblin.NarrowPhase.prototype.generateContacts = function( possible_contacts ) {
	var i,
		contact,
		possible_contacts_length = possible_contacts.length;

	// Make sure all of the manifolds are up to date
	this.updateContactManifolds();

	for ( i = 0; i < possible_contacts_length; i++ ) {
		contact = this.getContact( possible_contacts[i][0], possible_contacts[i][1] );
		if ( contact != null ) {
			this.addContact( possible_contacts[i][0], possible_contacts[i][1], contact );
		}
	}
};
/**
 * Manages pools for various types of objects, provides methods for creating and freeing pooled objects
 *
 * @class ObjectPool
 * @static
 */
Goblin.ObjectPool = {
	/**
	 * key/value map of registered types
	 *
	 * @property types
	 * @private
	 */
	types: {},

	/**
	 * key/pool map of object type - to - object pool
	 *
	 * @property pools
	 * @private
	 */
	pools: {},

	/**
	 * registers a type of object to be available in pools
	 *
	 * @param key {String} key associated with the object to register
	 * @param constructing_function {Function} function which will return a new object
	 */
	registerType: function( key, constructing_function ) {
		this.types[ key ] = constructing_function;
		this.pools[ key ] = [];
	},

	/**
	 * retrieve a free object from the specified pool, or creates a new object if one is not available
	 *
	 * @param key {String} key of the object type to retrieve
	 * @return {Mixed} object of the type asked for, when done release it with `ObjectPool.freeObject`
	 */
	getObject: function( key ) {
		var pool = this.pools[ key ];

		if ( pool.length !== 0 ) {
			return pool.pop();
		} else {
			return this.types[ key ]();
		}
	},

	/**
	 * adds on object to the object pool so it can be reused
	 *
	 * @param key {String} type of the object being freed, matching the key given to `registerType`
	 * @param object {Mixed} object to release into the pool
	 */
	freeObject: function( key, object ) {
		if ( object.removeAllListeners != null ) {
			object.removeAllListeners();
		}
		this.pools[ key ].push( object );
	}
};

// register the objects used in Goblin
Goblin.ObjectPool.registerType( 'ContactDetails', function() { return new Goblin.ContactDetails(); } );
Goblin.ObjectPool.registerType( 'ContactManifold', function() { return new Goblin.ContactManifold(); } );
Goblin.ObjectPool.registerType( 'GJK2SupportPoint', function() { return new Goblin.GjkEpa.SupportPoint( new Goblin.Vector3(), new Goblin.Vector3(), new Goblin.Vector3() ); } );
Goblin.ObjectPool.registerType( 'ConstraintRow', function() { return new Goblin.ConstraintRow(); } );
Goblin.ObjectPool.registerType( 'ContactConstraint', function() { return new Goblin.ContactConstraint(); } );
Goblin.ObjectPool.registerType( 'FrictionConstraint', function() { return new Goblin.FrictionConstraint(); } );
Goblin.ObjectPool.registerType( 'RayIntersection', function() { return new Goblin.RayIntersection(); } );
Goblin.ObjectPool.registerType( 'RigidBodyProxy', function() { return new Goblin.RigidBodyProxy(); } );
Goblin.RigidBodyProxy = function() {
	this.parent = null;
	this.id = null;

	this.shape = null;

	this.aabb = new Goblin.AABB();

	this._mass = null;
	this._mass_inverted = null;

	this.position = new Goblin.Vector3();
	this.rotation = new Goblin.Quaternion();

	this.transform = new Goblin.Matrix4();
	this.transform_inverse = new Goblin.Matrix4();

	this.restitution = null;
	this.friction = null;
};

Object.defineProperty(
	Goblin.RigidBodyProxy.prototype,
	'mass',
	{
		get: function() {
			return this._mass;
		},
		set: function( n ) {
			this._mass = n;
			this._mass_inverted = 1 / n;
			this.inertiaTensor = this.shape.getInertiaTensor( n );
		}
	}
);

Goblin.RigidBodyProxy.prototype.setFrom = function( parent, shape_data ) {
	this.parent = parent;

	this.id = parent.id;

	this.shape = shape_data.shape;
	this.shape_data = shape_data;

	this._mass = parent._mass;

	parent.transform.transformVector3Into( shape_data.position, this.position );
	this.rotation.multiplyQuaternions( parent.rotation, shape_data.rotation );

	this.transform.makeTransform( this.rotation, this.position );
	this.transform.invertInto( this.transform_inverse );

	this.aabb.transform( this.shape.aabb, this.transform );

	this.restitution = parent.restitution;
	this.friction = parent.friction;
};

Goblin.RigidBodyProxy.prototype.findSupportPoint = Goblin.RigidBody.prototype.findSupportPoint;

Goblin.RigidBodyProxy.prototype.getRigidBody = function() {
	var body = this.parent;
	while ( body.parent ) {
		body = this.parent;
	}
	return body;
};
/**
 * Manages the physics simulation
 *
 * @class World
 * @param broadphase {Goblin.Broadphase} the broadphase used by the world to find possible contacts
 * @param narrowphase {Goblin.NarrowPhase} the narrowphase used by the world to generate valid contacts
 * @constructor
 */
Goblin.World = function( broadphase, narrowphase, solver ) {
	/**
	 * How many time steps have been simulated. If the steps are always the same length then total simulation time = world.ticks * time_step
	 *
	 * @property ticks
	 * @type {number}
	 */
	this.ticks = 0;

	/**
	 * The broadphase used by the world to find possible contacts
	 *
	 * @property broadphase
	 * @type {Goblin.Broadphase}
	 */
	this.broadphase = broadphase;

	/**
	 * The narrowphase used by the world to generate valid contacts
	 *
	 * @property narrowphasee
	 * @type {Goblin.NarrowPhase}
	 */
	this.narrowphase = narrowphase;

	/**
	 * The contact solver used by the world to calculate and apply impulses resulting from contacts
	 *
	 * @property solver
	 */
	this.solver = solver;
	solver.world = this;

	/**
	 * Array of rigid bodies in the world
	 *
	 * @property rigid_bodies
	 * @type {Array}
	 * @default []
	 * @private
	 */
	this.rigid_bodies = [];

	/**
	 * Array of ghost bodies in the world
	 *
	 * @property ghost_bodies
	 * @type {Array}
	 * @default []
	 * @private
	 */
	this.ghost_bodies = [];

	/**
	* the world's gravity, applied by default to all objects in the world
	*
	* @property gravity
	* @type {vec3}
	* @default [ 0, -9.8, 0 ]
	*/
	this.gravity = new Goblin.Vector3( 0, -9.8, 0 );

	/**
	 * array of force generators in the world
	 *
	 * @property force_generators
	 * @type {Array}
	 * @default []
	 * @private
	 */
	this.force_generators = [];

	this.listeners = {};
};
Goblin.EventEmitter.apply( Goblin.World );

/**
* Steps the physics simulation according to the time delta
*
* @method step
* @param time_delta {Number} amount of time to simulate, in seconds
* @param [max_step] {Number} maximum time step size, in seconds
*/
Goblin.World.prototype.step = function( time_delta, max_step ) {
    max_step = max_step || time_delta;

	var x, delta, time_loops,
        i, loop_count, body;

    time_loops = time_delta / max_step;
    for ( x = 0; x < time_loops; x++ ) {
		this.ticks++;
        delta = Math.min( max_step, time_delta );
        time_delta -= max_step;

		this.emit( 'stepStart', this.ticks, delta );

        for ( i = 0, loop_count = this.rigid_bodies.length; i < loop_count; i++ ) {
            this.rigid_bodies[i].updateDerived();
        }

		// Apply gravity
        for ( i = 0, loop_count = this.rigid_bodies.length; i < loop_count; i++ ) {
            body = this.rigid_bodies[i];

            // Objects of infinite mass don't move
            if ( body._mass !== Infinity ) {
				_tmp_vec3_1.scaleVector( body.gravity || this.gravity, body._mass * delta );
                body.accumulated_force.add( _tmp_vec3_1 );
            }
        }

        // Apply force generators
        for ( i = 0, loop_count = this.force_generators.length; i < loop_count; i++ ) {
            this.force_generators[i].applyForce();
        }

        // Check for contacts, broadphase
        this.broadphase.update();

        // Find valid contacts, narrowphase
        this.narrowphase.generateContacts( this.broadphase.collision_pairs );

        // Process contact manifolds into contact and friction constraints
        this.solver.processContactManifolds( this.narrowphase.contact_manifolds );

        // Prepare the constraints by precomputing some values
        this.solver.prepareConstraints( delta );

        // Resolve contacts
        this.solver.resolveContacts();

        // Run the constraint solver
        this.solver.solveConstraints();

        // Apply the constraints
        this.solver.applyConstraints( delta );

        // Integrate rigid bodies
        for ( i = 0, loop_count = this.rigid_bodies.length; i < loop_count; i++ ) {
            body = this.rigid_bodies[i];
            body.integrate( delta );
        }

		// Uppdate ghost bodies
		for ( i = 0; i < this.ghost_bodies.length; i++ ) {
			body = this.ghost_bodies[i];
			body.checkForEndedContacts();
		}

		this.emit( 'stepEnd', this.ticks, delta );
    }
};

/**
 * Adds a rigid body to the world
 *
 * @method addRigidBody
 * @param rigid_body {Goblin.RigidBody} rigid body to add to the world
 */
Goblin.World.prototype.addRigidBody = function( rigid_body ) {
	rigid_body.world = this;
	rigid_body.updateDerived();
	this.rigid_bodies.push( rigid_body );
	this.broadphase.addBody( rigid_body );
};

/**
 * Removes a rigid body from the world
 *
 * @method removeRigidBody
 * @param rigid_body {Goblin.RigidBody} rigid body to remove from the world
 */
Goblin.World.prototype.removeRigidBody = function( rigid_body ) {
	var i,
		rigid_body_count = this.rigid_bodies.length;

	for ( i = 0; i < rigid_body_count; i++ ) {
		if ( this.rigid_bodies[i] === rigid_body ) {
			this.rigid_bodies.splice( i, 1 );
			this.broadphase.removeBody( rigid_body );
			break;
		}
	}
};

/**
 * Adds a ghost body to the world
 *
 * @method addGhostBody
 * @param ghost_body {Goblin.GhostBody} ghost body to add to the world
 */
Goblin.World.prototype.addGhostBody = function( ghost_body ) {
	ghost_body.world = this;
	ghost_body.updateDerived();
	this.ghost_bodies.push( ghost_body );
	this.broadphase.addBody( ghost_body );
};

/**
 * Removes a ghost body from the world
 *
 * @method removeGhostBody
 * @param ghost_body {Goblin.GhostBody} ghost body to remove from the world
 */
Goblin.World.prototype.removeGhostBody = function( ghost_body ) {
	for ( var i = 0; i < this.ghost_bodies.length; i++ ) {
		if ( this.ghost_bodies[i] === ghost_body ) {
			this.ghost_bodies.splice( i, 1 );
			this.broadphase.removeBody( ghost_body );
			break;
		}
	}
};

/**
 * Adds a force generator to the world
 *
 * @method addForceGenerator
 * @param force_generator {Goblin.ForceGenerator} force generator object to be added
 */
Goblin.World.prototype.addForceGenerator = function( force_generator ) {
	var i, force_generators_count;
	// Make sure this generator isn't already in the world
	for ( i = 0, force_generators_count = this.force_generators.length; i < force_generators_count; i++ ) {
		if ( this.force_generators[i] === force_generator ) {
			return;
		}
	}

	this.force_generators.push( force_generator );
};

/**
 * removes a force generator from the world
 *
 * @method removeForceGenerator
 * @param force_generatorv {Goblin.ForceGenerator} force generator object to be removed
 */
Goblin.World.prototype.removeForceGenerator = function( force_generator ) {
	var i, force_generators_count;
	for ( i = 0, force_generators_count = this.force_generators.length; i < force_generators_count; i++ ) {
		if ( this.force_generators[i] === force_generator ) {
			this.force_generators.splice( i, 1 );
			return;
		}
	}
};

/**
 * adds a constraint to the world
 *
 * @method addConstraint
 * @param constraint {Goblin.Constraint} constraint to be added
 */
Goblin.World.prototype.addConstraint = function( constraint ) {
	this.solver.addConstraint( constraint );
};

/**
 * removes a constraint from the world
 *
 * @method removeConstraint
 * @param constraint {Goblin.Constraint} constraint to be removed
 */
Goblin.World.prototype.removeConstraint = function( constraint ) {
	this.solver.removeConstraint( constraint );
};

(function(){
	var tSort = function( a, b ) {
		if ( a.t < b.t ) {
			return -1;
		} else if ( a.t > b.t ) {
			return 1;
		} else {
			return 0;
		}
	};

	/**
	 * Checks if a ray segment intersects with objects in the world
	 *
	 * @method rayIntersect
	 * @property start {vec3} start point of the segment
	 * @property end {vec3{ end point of the segment
	 * @return {Array<RayIntersection>} an array of intersections, sorted by distance from `start`
	 */
	Goblin.World.prototype.rayIntersect = function( start, end ) {
		var intersections = this.broadphase.rayIntersect( start, end );
		intersections.sort( tSort );
		return intersections;
	};

	Goblin.World.prototype.shapeIntersect = function( shape, start, end ){
		var swept_shape = new Goblin.LineSweptShape( start, end, shape ),
			swept_body = new Goblin.RigidBody( swept_shape, 0 );
		swept_body.updateDerived();

		var possibilities = this.broadphase.intersectsWith( swept_body ),
			intersections = [];

		for ( var i = 0; i < possibilities.length; i++ ) {
			var contact = this.narrowphase.getContact( swept_body, possibilities[i] );

			if ( contact != null ) {
				var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
				intersection.object = contact.object_b;
				intersection.normal.copy( contact.contact_normal );

				// compute point
				intersection.point.scaleVector( contact.contact_normal, -contact.penetration_depth );
				intersection.point.add( contact.contact_point );

				// compute time
				intersection.t = intersection.point.distanceTo( start );

				intersections.push( intersection );
			}
		}

		intersections.sort( tSort );
		return intersections;
	};
})();
Goblin.Constraint = function() {
	this.active = true;

	this.object_a = null;

	this.object_b = null;

	this.rows = [];

	this.factor = 1;

	this.last_impulse = new Goblin.Vector3();

	this.breaking_threshold = 0;

	this.listeners = {};
};
Goblin.EventEmitter.apply( Goblin.Constraint );

Goblin.Constraint.prototype.deactivate = function() {
	this.active = false;
	this.emit( 'deactivate' );
};

Goblin.Constraint.prototype.update = function(){};
Goblin.ConstraintRow = function() {
	this.jacobian = new Float64Array( 12 );
	this.B = new Float64Array( 12 ); // `B` is the jacobian multiplied by the objects' inverted mass & inertia tensors
	this.D = 0; // Length of the jacobian

	this.lower_limit = -Infinity;
	this.upper_limit = Infinity;

	this.bias = 0;
	this.multiplier = 0;
	this.multiplier_cached = 0;
	this.eta = 0;
	this.eta_row = new Float64Array( 12 );
};

Goblin.ConstraintRow.prototype.computeB = function( constraint ) {
	var invmass;

	if ( constraint.object_a != null && constraint.object_a._mass !== Infinity ) {
		invmass = constraint.object_a._mass_inverted;

		this.B[0] = invmass * this.jacobian[0] * constraint.object_a.linear_factor.x;
		this.B[1] = invmass * this.jacobian[1] * constraint.object_a.linear_factor.y;
		this.B[2] = invmass * this.jacobian[2] * constraint.object_a.linear_factor.z;

		_tmp_vec3_1.x = this.jacobian[3];
		_tmp_vec3_1.y = this.jacobian[4];
		_tmp_vec3_1.z = this.jacobian[5];
		constraint.object_a.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
		this.B[3] = _tmp_vec3_1.x * constraint.object_a.angular_factor.x;
		this.B[4] = _tmp_vec3_1.y * constraint.object_a.angular_factor.y;
		this.B[5] = _tmp_vec3_1.z * constraint.object_a.angular_factor.z;
	} else {
		this.B[0] = this.B[1] = this.B[2] = 0;
		this.B[3] = this.B[4] = this.B[5] = 0;
	}

	if ( constraint.object_b != null && constraint.object_b._mass !== Infinity ) {
		invmass = constraint.object_b._mass_inverted;
		this.B[6] = invmass * this.jacobian[6] * constraint.object_b.linear_factor.x;
		this.B[7] = invmass * this.jacobian[7] * constraint.object_b.linear_factor.y;
		this.B[8] = invmass * this.jacobian[8] * constraint.object_b.linear_factor.z;

		_tmp_vec3_1.x = this.jacobian[9];
		_tmp_vec3_1.y = this.jacobian[10];
		_tmp_vec3_1.z = this.jacobian[11];
		constraint.object_b.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
		this.B[9] = _tmp_vec3_1.x * constraint.object_b.linear_factor.x;
		this.B[10] = _tmp_vec3_1.y * constraint.object_b.linear_factor.y;
		this.B[11] = _tmp_vec3_1.z * constraint.object_b.linear_factor.z;
	} else {
		this.B[6] = this.B[7] = this.B[8] = 0;
		this.B[9] = this.B[10] = this.B[11] = 0;
	}
};

Goblin.ConstraintRow.prototype.computeD = function() {
	this.D = (
		this.jacobian[0] * this.B[0] +
		this.jacobian[1] * this.B[1] +
		this.jacobian[2] * this.B[2] +
		this.jacobian[3] * this.B[3] +
		this.jacobian[4] * this.B[4] +
		this.jacobian[5] * this.B[5] +
		this.jacobian[6] * this.B[6] +
		this.jacobian[7] * this.B[7] +
		this.jacobian[8] * this.B[8] +
		this.jacobian[9] * this.B[9] +
		this.jacobian[10] * this.B[10] +
		this.jacobian[11] * this.B[11]
	);
};

Goblin.ConstraintRow.prototype.computeEta = function( constraint, time_delta ) {
	var invmass,
		inverse_time_delta = 1 / time_delta;

	if ( constraint.object_a == null || constraint.object_a._mass === Infinity ) {
		this.eta_row[0] = this.eta_row[1] = this.eta_row[2] = this.eta_row[3] = this.eta_row[4] = this.eta_row[5] = 0;
	} else {
		invmass = constraint.object_a._mass_inverted;

		this.eta_row[0] = ( constraint.object_a.linear_velocity.x + ( invmass * constraint.object_a.accumulated_force.x ) ) * inverse_time_delta;
		this.eta_row[1] = ( constraint.object_a.linear_velocity.y + ( invmass * constraint.object_a.accumulated_force.y ) ) * inverse_time_delta;
		this.eta_row[2] = ( constraint.object_a.linear_velocity.z + ( invmass * constraint.object_a.accumulated_force.z ) ) * inverse_time_delta;

		_tmp_vec3_1.copy( constraint.object_a.accumulated_torque );
		constraint.object_a.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
		this.eta_row[3] = ( constraint.object_a.angular_velocity.x + _tmp_vec3_1.x ) * inverse_time_delta;
		this.eta_row[4] = ( constraint.object_a.angular_velocity.y + _tmp_vec3_1.y ) * inverse_time_delta;
		this.eta_row[5] = ( constraint.object_a.angular_velocity.z + _tmp_vec3_1.z ) * inverse_time_delta;
	}

	if ( constraint.object_b == null || constraint.object_b._mass === Infinity ) {
		this.eta_row[6] = this.eta_row[7] = this.eta_row[8] = this.eta_row[9] = this.eta_row[10] = this.eta_row[11] = 0;
	} else {
		invmass = constraint.object_b._mass_inverted;

		this.eta_row[6] = ( constraint.object_b.linear_velocity.x + ( invmass * constraint.object_b.accumulated_force.x ) ) * inverse_time_delta;
		this.eta_row[7] = ( constraint.object_b.linear_velocity.y + ( invmass * constraint.object_b.accumulated_force.y ) ) * inverse_time_delta;
		this.eta_row[8] = ( constraint.object_b.linear_velocity.z + ( invmass * constraint.object_b.accumulated_force.z ) ) * inverse_time_delta;

		_tmp_vec3_1.copy( constraint.object_b.accumulated_torque );
		constraint.object_b.inverseInertiaTensorWorldFrame.transformVector3( _tmp_vec3_1 );
		this.eta_row[9] = ( constraint.object_b.angular_velocity.x + _tmp_vec3_1.x ) * inverse_time_delta;
		this.eta_row[10] = ( constraint.object_b.angular_velocity.y + _tmp_vec3_1.y ) * inverse_time_delta;
		this.eta_row[11] = ( constraint.object_b.angular_velocity.z + _tmp_vec3_1.z ) * inverse_time_delta;
	}

	var jdotv = this.jacobian[0] * this.eta_row[0] +
		this.jacobian[1] * this.eta_row[1] +
		this.jacobian[2] * this.eta_row[2] +
		this.jacobian[3] * this.eta_row[3] +
		this.jacobian[4] * this.eta_row[4] +
		this.jacobian[5] * this.eta_row[5] +
		this.jacobian[6] * this.eta_row[6] +
		this.jacobian[7] * this.eta_row[7] +
		this.jacobian[8] * this.eta_row[8] +
		this.jacobian[9] * this.eta_row[9] +
		this.jacobian[10] * this.eta_row[10] +
		this.jacobian[11] * this.eta_row[11];

	this.eta = ( this.bias * inverse_time_delta ) - jdotv;
};
Goblin.ContactConstraint = function() {
	Goblin.Constraint.call( this );

	this.contact = null;
};
Goblin.ContactConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.ContactConstraint.prototype.buildFromContact = function( contact ) {
	this.object_a = contact.object_a;
	this.object_b = contact.object_b;
	this.contact = contact;

	var self = this;
	var onDestroy = function() {
		this.removeListener( 'destroy', onDestroy );
		self.deactivate();
	};
	this.contact.addListener( 'destroy', onDestroy );

	var row = this.rows[0] || Goblin.ObjectPool.getObject( 'ConstraintRow' );
	row.lower_limit = 0;
	row.upper_limit = Infinity;
	this.rows[0] = row;

	this.update();
};

Goblin.ContactConstraint.prototype.update = function() {
	var row = this.rows[0];

	if ( this.object_a == null || this.object_a._mass === Infinity ) {
		row.jacobian[0] = row.jacobian[1] = row.jacobian[2] = 0;
		row.jacobian[3] = row.jacobian[4] = row.jacobian[5] = 0;
	} else {
		row.jacobian[0] = -this.contact.contact_normal.x;
		row.jacobian[1] = -this.contact.contact_normal.y;
		row.jacobian[2] = -this.contact.contact_normal.z;

		_tmp_vec3_1.subtractVectors( this.contact.contact_point, this.contact.object_a.position );
		_tmp_vec3_1.cross( this.contact.contact_normal );
		row.jacobian[3] = -_tmp_vec3_1.x;
		row.jacobian[4] = -_tmp_vec3_1.y;
		row.jacobian[5] = -_tmp_vec3_1.z;
	}

	if ( this.object_b == null || this.object_b._mass === Infinity ) {
		row.jacobian[6] = row.jacobian[7] = row.jacobian[8] = 0;
		row.jacobian[9] = row.jacobian[10] = row.jacobian[11] = 0;
	} else {
		row.jacobian[6] = this.contact.contact_normal.x;
		row.jacobian[7] = this.contact.contact_normal.y;
		row.jacobian[8] = this.contact.contact_normal.z;

		_tmp_vec3_1.subtractVectors( this.contact.contact_point, this.contact.object_b.position );
		_tmp_vec3_1.cross( this.contact.contact_normal );
		row.jacobian[9] = _tmp_vec3_1.x;
		row.jacobian[10] = _tmp_vec3_1.y;
		row.jacobian[11] = _tmp_vec3_1.z;
	}

	// Pre-calc error
	row.bias = 0;

	// Apply restitution
	var velocity_along_normal = 0;
	if ( this.object_a._mass !== Infinity ) {
		this.object_a.getVelocityInLocalPoint( this.contact.contact_point_in_a, _tmp_vec3_1 );
		velocity_along_normal += _tmp_vec3_1.dot( this.contact.contact_normal );
	}
	if ( this.object_b._mass !== Infinity ) {
		this.object_b.getVelocityInLocalPoint( this.contact.contact_point_in_b, _tmp_vec3_1 );
		velocity_along_normal -= _tmp_vec3_1.dot( this.contact.contact_normal );
	}

	// Add restitution to bias
	row.bias += velocity_along_normal * this.contact.restitution;
};
Goblin.FrictionConstraint = function() {
	Goblin.Constraint.call( this );

	this.contact = null;
};
Goblin.FrictionConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.FrictionConstraint.prototype.buildFromContact = function( contact ) {
	this.rows[0] = this.rows[0] || Goblin.ObjectPool.getObject( 'ConstraintRow' );
	this.rows[1] = this.rows[1] || Goblin.ObjectPool.getObject( 'ConstraintRow' );

	this.object_a = contact.object_a;
	this.object_b = contact.object_b;
	this.contact = contact;

	var self = this;
	var onDestroy = function() {
		this.removeListener( 'destroy', onDestroy );
		self.deactivate();
	};
	this.contact.addListener( 'destroy', onDestroy );

	this.update();
};

Goblin.FrictionConstraint.prototype.update = (function(){
	var rel_a = new Goblin.Vector3(),
		rel_b = new Goblin.Vector3(),
		u1 = new Goblin.Vector3(),
		u2 = new Goblin.Vector3();

	return function updateFrictionConstraint() {
		var row_1 = this.rows[0],
			row_2 = this.rows[1];

		// Find the contact point relative to object_a and object_b
		rel_a.subtractVectors( this.contact.contact_point, this.object_a.position );
		rel_b.subtractVectors( this.contact.contact_point, this.object_b.position );

		this.contact.contact_normal.findOrthogonal( u1, u2 );

		if ( this.object_a == null || this.object_a._mass === Infinity ) {
			row_1.jacobian[0] = row_1.jacobian[1] = row_1.jacobian[2] = 0;
			row_1.jacobian[3] = row_1.jacobian[4] = row_1.jacobian[5] = 0;
			row_2.jacobian[0] = row_2.jacobian[1] = row_2.jacobian[2] = 0;
			row_2.jacobian[3] = row_2.jacobian[4] = row_2.jacobian[5] = 0;
		} else {
			row_1.jacobian[0] = -u1.x;
			row_1.jacobian[1] = -u1.y;
			row_1.jacobian[2] = -u1.z;

			_tmp_vec3_1.crossVectors( rel_a, u1 );
			row_1.jacobian[3] = -_tmp_vec3_1.x;
			row_1.jacobian[4] = -_tmp_vec3_1.y;
			row_1.jacobian[5] = -_tmp_vec3_1.z;

			row_2.jacobian[0] = -u2.x;
			row_2.jacobian[1] = -u2.y;
			row_2.jacobian[2] = -u2.z;

			_tmp_vec3_1.crossVectors( rel_a, u2 );
			row_2.jacobian[3] = -_tmp_vec3_1.x;
			row_2.jacobian[4] = -_tmp_vec3_1.y;
			row_2.jacobian[5] = -_tmp_vec3_1.z;
		}

		if ( this.object_b == null || this.object_b._mass === Infinity ) {
			row_1.jacobian[6] = row_1.jacobian[7] = row_1.jacobian[8] = 0;
			row_1.jacobian[9] = row_1.jacobian[10] = row_1.jacobian[11] = 0;
			row_2.jacobian[6] = row_2.jacobian[7] = row_2.jacobian[8] = 0;
			row_2.jacobian[9] = row_2.jacobian[10] = row_2.jacobian[11] = 0;
		} else {
			row_1.jacobian[6] = u1.x;
			row_1.jacobian[7] = u1.y;
			row_1.jacobian[8] = u1.z;

			_tmp_vec3_1.crossVectors( rel_b, u1 );
			row_1.jacobian[9] = _tmp_vec3_1.x;
			row_1.jacobian[10] = _tmp_vec3_1.y;
			row_1.jacobian[11] = _tmp_vec3_1.z;

			row_2.jacobian[6] = u2.x;
			row_2.jacobian[7] = u2.y;
			row_2.jacobian[8] = u2.z;

			_tmp_vec3_1.crossVectors( rel_b, u2 );
			row_2.jacobian[9] = _tmp_vec3_1.x;
			row_2.jacobian[10] = _tmp_vec3_1.y;
			row_2.jacobian[11] = _tmp_vec3_1.z;
		}

		// Find total velocity between the two bodies along the contact normal
		this.object_a.getVelocityInLocalPoint( this.contact.contact_point_in_a, _tmp_vec3_1 );

		// Include accumulated forces
		if ( this.object_a._mass !== Infinity ) {
			// accumulated linear velocity
			_tmp_vec3_1.scaleVector( this.object_a.accumulated_force, 1 / this.object_a._mass );
			_tmp_vec3_1.add( this.object_a.linear_velocity );

			// accumulated angular velocity
			this.object_a.inverseInertiaTensorWorldFrame.transformVector3Into( this.object_a.accumulated_torque, _tmp_vec3_3 );
			_tmp_vec3_3.add( this.object_a.angular_velocity );

			_tmp_vec3_3.cross( this.contact.contact_point_in_a );
			_tmp_vec3_1.add( _tmp_vec3_3 );
			_tmp_vec3_1.scale( this.object_a._mass );
		} else {
			_tmp_vec3_1.set( 0, 0, 0 );
		}

		var limit = this.contact.friction * 25;
		if ( limit < 0 ) {
			limit = 0;
		}
		row_1.lower_limit = row_2.lower_limit = -limit;
		row_1.upper_limit = row_2.upper_limit = limit;

		row_1.bias = row_2.bias = 0;

		this.rows[0] = row_1;
		this.rows[1] = row_2;
	};
})();
Goblin.HingeConstraint = function( object_a, hinge_a, point_a, object_b, point_b ) {
	Goblin.Constraint.call( this );

	this.object_a = object_a;
	this.hinge_a = hinge_a;
	this.point_a = point_a;

	this.object_b = object_b || null;
	this.point_b = new Goblin.Vector3();
	this.hinge_b = new Goblin.Vector3();
	if ( this.object_b != null ) {
		this.object_a.rotation.transformVector3Into( this.hinge_a, this.hinge_b );
		_tmp_quat4_1.invertQuaternion( this.object_b.rotation );
		_tmp_quat4_1.transformVector3( this.hinge_b );

		this.point_b = point_b;
	} else {
		this.object_a.updateDerived(); // Ensure the body's transform is correct
		this.object_a.rotation.transformVector3Into( this.hinge_a, this.hinge_b );
		this.object_a.transform.transformVector3Into( this.point_a, this.point_b );
	}

	this.erp = 0.1;

	// Create rows
	// rows 0,1,2 are the same as point constraint and constrain the objects' positions
	// rows 3,4 introduce the rotational constraints which constrains angular velocity orthogonal to the hinge axis
	for ( var i = 0; i < 5; i++ ) {
		this.rows[i] = Goblin.ObjectPool.getObject( 'ConstraintRow' );
		this.rows[i].lower_limit = -Infinity;
		this.rows[i].upper_limit = Infinity;
		this.rows[i].bias = 0;

		this.rows[i].jacobian[0] = this.rows[i].jacobian[1] = this.rows[i].jacobian[2] =
			this.rows[i].jacobian[3] = this.rows[i].jacobian[4] = this.rows[i].jacobian[5] =
			this.rows[i].jacobian[6] = this.rows[i].jacobian[7] = this.rows[i].jacobian[8] =
			this.rows[i].jacobian[9] = this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = 0;
	}
};
Goblin.HingeConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.HingeConstraint.prototype.update = (function(){
	var r1 = new Goblin.Vector3(),
		r2 = new Goblin.Vector3(),
		t1 = new Goblin.Vector3(),
		t2 = new Goblin.Vector3(),
		world_axis = new Goblin.Vector3();

	return function( time_delta ) {
		this.object_a.rotation.transformVector3Into( this.hinge_a, world_axis );

		this.object_a.transform.transformVector3Into( this.point_a, _tmp_vec3_1 );
		r1.subtractVectors( _tmp_vec3_1, this.object_a.position );

		// 0,1,2 are positional, same as PointConstraint
		this.rows[0].jacobian[0] = -1;
		this.rows[0].jacobian[1] = 0;
		this.rows[0].jacobian[2] = 0;
		this.rows[0].jacobian[3] = 0;
		this.rows[0].jacobian[4] = -r1.z;
		this.rows[0].jacobian[5] = r1.y;

		this.rows[1].jacobian[0] = 0;
		this.rows[1].jacobian[1] = -1;
		this.rows[1].jacobian[2] = 0;
		this.rows[1].jacobian[3] = r1.z;
		this.rows[1].jacobian[4] = 0;
		this.rows[1].jacobian[5] = -r1.x;

		this.rows[2].jacobian[0] = 0;
		this.rows[2].jacobian[1] = 0;
		this.rows[2].jacobian[2] = -1;
		this.rows[2].jacobian[3] = -r1.y;
		this.rows[2].jacobian[4] = r1.x;
		this.rows[2].jacobian[5] = 0;

		// 3,4 are rotational, constraining motion orthogonal to axis
		world_axis.findOrthogonal( t1, t2 );
		this.rows[3].jacobian[3] = -t1.x;
		this.rows[3].jacobian[4] = -t1.y;
		this.rows[3].jacobian[5] = -t1.z;

		this.rows[4].jacobian[3] = -t2.x;
		this.rows[4].jacobian[4] = -t2.y;
		this.rows[4].jacobian[5] = -t2.z;

		if ( this.object_b != null ) {
			this.object_b.transform.transformVector3Into( this.point_b, _tmp_vec3_2 );
			r2.subtractVectors( _tmp_vec3_2, this.object_b.position );

			// 0,1,2 are positional, same as PointConstraint
			this.rows[0].jacobian[6] = 1;
			this.rows[0].jacobian[7] = 0;
			this.rows[0].jacobian[8] = 0;
			this.rows[0].jacobian[9] = 0;
			this.rows[0].jacobian[10] = r2.z;
			this.rows[0].jacobian[11] = -r2.y;

			this.rows[1].jacobian[6] = 0;
			this.rows[1].jacobian[7] = 1;
			this.rows[1].jacobian[8] = 0;
			this.rows[1].jacobian[9] = -r2.z;
			this.rows[1].jacobian[10] = 0;
			this.rows[1].jacobian[11] = r2.x;

			this.rows[2].jacobian[6] = 0;
			this.rows[2].jacobian[7] = 0;
			this.rows[2].jacobian[8] = 1;
			this.rows[2].jacobian[9] = r2.y;
			this.rows[2].jacobian[10] = -r2.z;
			this.rows[2].jacobian[11] = 0;

			// 3,4 are rotational, constraining motion orthogonal to axis
			this.rows[3].jacobian[9] = t1.x;
			this.rows[3].jacobian[10] = t1.y;
			this.rows[3].jacobian[11] = t1.z;

			this.rows[4].jacobian[9] = t2.x;
			this.rows[4].jacobian[10] = t2.y;
			this.rows[4].jacobian[11] = t2.z;
		} else {
			_tmp_vec3_2.copy( this.point_b );
		}

		// Linear error correction
		_tmp_vec3_3.subtractVectors( _tmp_vec3_1, _tmp_vec3_2 );
		_tmp_vec3_3.scale( this.erp / time_delta );
		this.rows[0].bias = _tmp_vec3_3.x;
		this.rows[1].bias = _tmp_vec3_3.y;
		this.rows[2].bias = _tmp_vec3_3.z;

		// Angular error correction
		if (this.object_b != null) {
			this.object_a.rotation.transformVector3Into(this.hinge_a, _tmp_vec3_1);
			this.object_b.rotation.transformVector3Into(this.hinge_b, _tmp_vec3_2);
			_tmp_vec3_1.cross(_tmp_vec3_2);
			this.rows[3].bias = -_tmp_vec3_1.dot(t1);
			this.rows[4].bias = -_tmp_vec3_1.dot(t2);
		} else {
			this.rows[3].bias = this.rows[4].bias = 0;
		}
	};
})( );
Goblin.PointConstraint = function( object_a, point_a, object_b, point_b ) {
	Goblin.Constraint.call( this );

	this.object_a = object_a;
	this.point_a = point_a;

	this.object_b = object_b || null;
	if ( this.object_b != null ) {
		this.point_b = point_b;
	} else {
		this.point_b = new Goblin.Vector3();
		this.object_a.updateDerived(); // Ensure the body's transform is correct
		this.object_a.transform.transformVector3Into( this.point_a, this.point_b );
	}

	this.erp = 0.1;

	// Create rows
	for ( var i = 0; i < 3; i++ ) {
		this.rows[i] = Goblin.ObjectPool.getObject( 'ConstraintRow' );
		this.rows[i].lower_limit = -Infinity;
		this.rows[i].upper_limit = Infinity;
		this.rows[i].bias = 0;

		this.rows[i].jacobian[6] = this.rows[i].jacobian[7] = this.rows[i].jacobian[8] =
			this.rows[i].jacobian[9] = this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = 0;
	}
};
Goblin.PointConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.PointConstraint.prototype.update = (function(){
	var r1 = new Goblin.Vector3(),
		r2 = new Goblin.Vector3();

	return function( time_delta ) {
		this.object_a.transform.transformVector3Into( this.point_a, _tmp_vec3_1 );
		r1.subtractVectors( _tmp_vec3_1, this.object_a.position );

		this.rows[0].jacobian[0] = -1;
		this.rows[0].jacobian[1] = 0;
		this.rows[0].jacobian[2] = 0;
		this.rows[0].jacobian[3] = 0;
		this.rows[0].jacobian[4] = -r1.z;
		this.rows[0].jacobian[5] = r1.y;

		this.rows[1].jacobian[0] = 0;
		this.rows[1].jacobian[1] = -1;
		this.rows[1].jacobian[2] = 0;
		this.rows[1].jacobian[3] = r1.z;
		this.rows[1].jacobian[4] = 0;
		this.rows[1].jacobian[5] = -r1.x;

		this.rows[2].jacobian[0] = 0;
		this.rows[2].jacobian[1] = 0;
		this.rows[2].jacobian[2] = -1;
		this.rows[2].jacobian[3] = -r1.y;
		this.rows[2].jacobian[4] = r1.x;
		this.rows[2].jacobian[5] = 0;

		if ( this.object_b != null ) {
			this.object_b.transform.transformVector3Into( this.point_b, _tmp_vec3_2 );
			r2.subtractVectors( _tmp_vec3_2, this.object_b.position );

			this.rows[0].jacobian[6] = 1;
			this.rows[0].jacobian[7] = 0;
			this.rows[0].jacobian[8] = 0;
			this.rows[0].jacobian[9] = 0;
			this.rows[0].jacobian[10] = r2.z;
			this.rows[0].jacobian[11] = -r2.y;

			this.rows[1].jacobian[6] = 0;
			this.rows[1].jacobian[7] = 1;
			this.rows[1].jacobian[8] = 0;
			this.rows[1].jacobian[9] = -r2.z;
			this.rows[1].jacobian[10] = 0;
			this.rows[1].jacobian[11] = r2.x;

			this.rows[2].jacobian[6] = 0;
			this.rows[2].jacobian[7] = 0;
			this.rows[2].jacobian[8] = 1;
			this.rows[2].jacobian[9] = r2.y;
			this.rows[2].jacobian[10] = -r2.x;
			this.rows[2].jacobian[11] = 0;
		} else {
			_tmp_vec3_2.copy( this.point_b );
		}

		_tmp_vec3_3.subtractVectors( _tmp_vec3_1, _tmp_vec3_2 );
		_tmp_vec3_3.scale( this.erp / time_delta );
		this.rows[0].bias = _tmp_vec3_3.x;
		this.rows[1].bias = _tmp_vec3_3.y;
		this.rows[2].bias = _tmp_vec3_3.z;
	};
})( );

Goblin.SliderConstraint = function( object_a, axis, object_b ) {
	Goblin.Constraint.call( this );

	this.object_a = object_a;
	this.axis = axis;
	this.object_b = object_b;

	// Find the initial distance between the two objects in object_a's local frame
	this.position_error = new Goblin.Vector3();
	this.position_error.subtractVectors( this.object_b.position, this.object_a.position );
	_tmp_quat4_1.invertQuaternion( this.object_a.rotation );
	_tmp_quat4_1.transformVector3( this.position_error );

	this.rotation_difference = new Goblin.Quaternion();
	if ( this.object_b != null ) {
		_tmp_quat4_1.invertQuaternion( this.object_b.rotation );
		this.rotation_difference.multiplyQuaternions( _tmp_quat4_1, this.object_a.rotation );
	}

	this.erp = 0.1;

	// First two rows constrain the linear velocities orthogonal to `axis`
	// Rows three through five constrain angular velocities
	for ( var i = 0; i < 5; i++ ) {
		this.rows[i] = Goblin.ObjectPool.getObject( 'ConstraintRow' );
		this.rows[i].lower_limit = -Infinity;
		this.rows[i].upper_limit = Infinity;
		this.rows[i].bias = 0;

		this.rows[i].jacobian[0] = this.rows[i].jacobian[1] = this.rows[i].jacobian[2] =
			this.rows[i].jacobian[3] = this.rows[i].jacobian[4] = this.rows[i].jacobian[5] =
			this.rows[i].jacobian[6] = this.rows[i].jacobian[7] = this.rows[i].jacobian[8] =
			this.rows[i].jacobian[9] = this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = 0;
	}
};
Goblin.SliderConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.SliderConstraint.prototype.update = (function(){
	var _axis = new Goblin.Vector3(),
		n1 = new Goblin.Vector3(),
		n2 = new Goblin.Vector3();

	return function( time_delta ) {
		// `axis` is in object_a's local frame, convert to world
		this.object_a.rotation.transformVector3Into( this.axis, _axis );

		// Find two vectors that are orthogonal to `axis`
		_axis.findOrthogonal( n1, n2 );

		this._updateLinearConstraints( time_delta, n1, n2 );
		this._updateAngularConstraints( time_delta, n1, n2 );
	};
})();

Goblin.SliderConstraint.prototype._updateLinearConstraints = function( time_delta, n1, n2 ) {
	var c = new Goblin.Vector3();
	c.subtractVectors( this.object_b.position, this.object_a.position );
	//c.scale( 0.5 );

	var cx = new Goblin.Vector3( );

	// first linear constraint
	cx.crossVectors( c, n1 );
	this.rows[0].jacobian[0] = -n1.x;
	this.rows[0].jacobian[1] = -n1.y;
	this.rows[0].jacobian[2] = -n1.z;
	//this.rows[0].jacobian[3] = -cx[0];
	//this.rows[0].jacobian[4] = -cx[1];
	//this.rows[0].jacobian[5] = -cx[2];

	this.rows[0].jacobian[6] = n1.x;
	this.rows[0].jacobian[7] = n1.y;
	this.rows[0].jacobian[8] = n1.z;
	this.rows[0].jacobian[9] = 0;
	this.rows[0].jacobian[10] = 0;
	this.rows[0].jacobian[11] = 0;

	// second linear constraint
	cx.crossVectors( c, n2 );
	this.rows[1].jacobian[0] = -n2.x;
	this.rows[1].jacobian[1] = -n2.y;
	this.rows[1].jacobian[2] = -n2.z;
	//this.rows[1].jacobian[3] = -cx[0];
	//this.rows[1].jacobian[4] = -cx[1];
	//this.rows[1].jacobian[5] = -cx[2];

	this.rows[1].jacobian[6] = n2.x;
	this.rows[1].jacobian[7] = n2.y;
	this.rows[1].jacobian[8] = n2.z;
	this.rows[1].jacobian[9] = 0;
	this.rows[1].jacobian[10] = 0;
	this.rows[1].jacobian[11] = 0;

	// linear constraint error
	//c.scale( 2  );
	this.object_a.rotation.transformVector3Into( this.position_error, _tmp_vec3_1 );
	_tmp_vec3_2.subtractVectors( c, _tmp_vec3_1 );
	_tmp_vec3_2.scale( this.erp / time_delta  );
	this.rows[0].bias = -n1.dot( _tmp_vec3_2 );
	this.rows[1].bias = -n2.dot( _tmp_vec3_2 );
};

Goblin.SliderConstraint.prototype._updateAngularConstraints = function( time_delta, n1, n2, axis ) {
	this.rows[2].jacobian[3] = this.rows[3].jacobian[4] = this.rows[4].jacobian[5] = -1;
	this.rows[2].jacobian[9] = this.rows[3].jacobian[10] = this.rows[4].jacobian[11] = 1;

	_tmp_quat4_1.invertQuaternion( this.object_b.rotation );
	_tmp_quat4_1.multiply( this.object_a.rotation );

	_tmp_quat4_2.invertQuaternion( this.rotation_difference );
	_tmp_quat4_2.multiply( _tmp_quat4_1 );
	// _tmp_quat4_2 is now the rotational error that needs to be corrected

	var error = new Goblin.Vector3();
	error.x = _tmp_quat4_2.x;
	error.y = _tmp_quat4_2.y;
	error.z = _tmp_quat4_2.z;
	error.scale( this.erp / time_delta  );

	//this.rows[2].bias = error[0];
	//this.rows[3].bias = error[1];
	//this.rows[4].bias = error[2];
};
Goblin.WeldConstraint = function( object_a, point_a, object_b, point_b ) {
	Goblin.Constraint.call( this );

	this.object_a = object_a;
	this.point_a = point_a;

	this.object_b = object_b || null;
	this.point_b = point_b || null;

	this.rotation_difference = new Goblin.Quaternion();
	if ( this.object_b != null ) {
		_tmp_quat4_1.invertQuaternion( this.object_b.rotation );
		this.rotation_difference.multiplyQuaternions( _tmp_quat4_1, this.object_a.rotation );
	}

	this.erp = 0.1;

	// Create translation constraint rows
	for ( var i = 0; i < 3; i++ ) {
		this.rows[i] = Goblin.ObjectPool.getObject( 'ConstraintRow' );
		this.rows[i].lower_limit = -Infinity;
		this.rows[i].upper_limit = Infinity;
		this.rows[i].bias = 0;

		if ( this.object_b == null ) {
			this.rows[i].jacobian[0] = this.rows[i].jacobian[1] = this.rows[i].jacobian[2] =
				this.rows[i].jacobian[4] = this.rows[i].jacobian[5] = this.rows[i].jacobian[6] =
				this.rows[i].jacobian[7] = this.rows[i].jacobian[8] = this.rows[i].jacobian[9] =
				this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = this.rows[i].jacobian[12] = 0;
			this.rows[i].jacobian[i] = 1;
		}
	}

	// Create rotation constraint rows
	for ( i = 3; i < 6; i++ ) {
		this.rows[i] = Goblin.ObjectPool.getObject( 'ConstraintRow' );
		this.rows[i].lower_limit = -Infinity;
		this.rows[i].upper_limit = Infinity;
		this.rows[i].bias = 0;

		if ( this.object_b == null ) {
			this.rows[i].jacobian[0] = this.rows[i].jacobian[1] = this.rows[i].jacobian[2] =
				this.rows[i].jacobian[4] = this.rows[i].jacobian[5] = this.rows[i].jacobian[6] =
				this.rows[i].jacobian[7] = this.rows[i].jacobian[8] = this.rows[i].jacobian[9] =
				this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = this.rows[i].jacobian[12] = 0;
			this.rows[i].jacobian[i] = 1;
		} else {
			this.rows[i].jacobian[0] = this.rows[i].jacobian[1] = this.rows[i].jacobian[2] = 0;
			this.rows[i].jacobian[3] = this.rows[i].jacobian[4] = this.rows[i].jacobian[5] = 0;
			this.rows[i].jacobian[ i ] = -1;

			this.rows[i].jacobian[6] = this.rows[i].jacobian[7] = this.rows[i].jacobian[8] = 0;
			this.rows[i].jacobian[9] = this.rows[i].jacobian[10] = this.rows[i].jacobian[11] = 0;
			this.rows[i].jacobian[ i + 6 ] = 1;
		}
	}
};
Goblin.WeldConstraint.prototype = Object.create( Goblin.Constraint.prototype );

Goblin.WeldConstraint.prototype.update = (function(){
	var r1 = new Goblin.Vector3(),
		r2 = new Goblin.Vector3();

	return function( time_delta ) {
		if ( this.object_b == null ) {
			// No need to update the constraint, all motion is already constrained
			return;
		}

		this.object_a.transform.transformVector3Into( this.point_a, _tmp_vec3_1 );
		r1.subtractVectors( _tmp_vec3_1, this.object_a.position );

		this.rows[0].jacobian[0] = -1;
		this.rows[0].jacobian[1] = 0;
		this.rows[0].jacobian[2] = 0;
		this.rows[0].jacobian[3] = 0;
		this.rows[0].jacobian[4] = -r1.z;
		this.rows[0].jacobian[5] = r1.y;

		this.rows[1].jacobian[0] = 0;
		this.rows[1].jacobian[1] = -1;
		this.rows[1].jacobian[2] = 0;
		this.rows[1].jacobian[3] = r1.z;
		this.rows[1].jacobian[4] = 0;
		this.rows[1].jacobian[5] = -r1.x;

		this.rows[2].jacobian[0] = 0;
		this.rows[2].jacobian[1] = 0;
		this.rows[2].jacobian[2] = -1;
		this.rows[2].jacobian[3] = -r1.y;
		this.rows[2].jacobian[4] = r1.x;
		this.rows[2].jacobian[5] = 0;

		if ( this.object_b != null ) {
			this.object_b.transform.transformVector3Into( this.point_b, _tmp_vec3_2 );
			r2.subtractVectors( _tmp_vec3_2, this.object_b.position );

			this.rows[0].jacobian[6] = 1;
			this.rows[0].jacobian[7] = 0;
			this.rows[0].jacobian[8] = 0;
			this.rows[0].jacobian[9] = 0;
			this.rows[0].jacobian[10] = r2.z;
			this.rows[0].jacobian[11] = -r2.y;

			this.rows[1].jacobian[6] = 0;
			this.rows[1].jacobian[7] = 1;
			this.rows[1].jacobian[8] = 0;
			this.rows[1].jacobian[9] = -r2.z;
			this.rows[1].jacobian[10] = 0;
			this.rows[1].jacobian[11] = r2.x;

			this.rows[2].jacobian[6] = 0;
			this.rows[2].jacobian[7] = 0;
			this.rows[2].jacobian[8] = 1;
			this.rows[2].jacobian[9] = r2.y;
			this.rows[2].jacobian[10] = -r2.x;
			this.rows[2].jacobian[11] = 0;
		} else {
			_tmp_vec3_2.copy( this.point_b );
		}

		var error = new Goblin.Vector3();

		// Linear correction
		error.subtractVectors( _tmp_vec3_1, _tmp_vec3_2 );
		error.scale( this.erp / time_delta  );
		this.rows[0].bias = error.x;
		this.rows[1].bias = error.y;
		this.rows[2].bias = error.z;

		// Rotation correction
		_tmp_quat4_1.invertQuaternion( this.object_b.rotation );
		_tmp_quat4_1.multiply( this.object_a.rotation );

		_tmp_quat4_2.invertQuaternion( this.rotation_difference );
		_tmp_quat4_2.multiply( _tmp_quat4_1 );
		// _tmp_quat4_2 is now the rotational error that needs to be corrected

		error.x = _tmp_quat4_2.x;
		error.y = _tmp_quat4_2.y;
		error.z = _tmp_quat4_2.z;
		error.scale( this.erp / time_delta );

		this.rows[3].bias = error.x;
		this.rows[4].bias = error.y;
		this.rows[5].bias = error.z;
	};
})( );
/**
 * Performs a n^2 check of all collision objects to see if any could be in contact
 *
 * @class BasicBroadphase
 * @constructor
 */
Goblin.BasicBroadphase = function() {
	/**
	 * Holds all of the collision objects that the broadphase is responsible for
	 *
	 * @property bodies
	 * @type {Array}
	 */
	this.bodies = [];

	/**
	 * Array of all (current) collision pairs between the broadphases' bodies
	 *
	 * @property collision_pairs
	 * @type {Array}
	 */
	this.collision_pairs = [];
};

/**
 * Adds a body to the broadphase for contact checking
 *
 * @method addBody
 * @param body {RigidBody} body to add to the broadphase contact checking
 */
Goblin.BasicBroadphase.prototype.addBody = function( body ) {
	this.bodies.push( body );
};

/**
 * Removes a body from the broadphase contact checking
 *
 * @method removeBody
 * @param body {RigidBody} body to remove from the broadphase contact checking
 */
Goblin.BasicBroadphase.prototype.removeBody = function( body ) {
	var i,
		body_count = this.bodies.length;

	for ( i = 0; i < body_count; i++ ) {
		if ( this.bodies[i] === body ) {
			this.bodies.splice( i, 1 );
			break;
		}
	}
};

/**
 * Checks all collision objects to find any which are possibly in contact
 *  resulting contact pairs are held in the object's `collision_pairs` property
 *
 * @method update
 */
Goblin.BasicBroadphase.prototype.update = function() {
	var i, j,
		object_a, object_b,
		bodies_count = this.bodies.length;

	// Clear any old contact pairs
	this.collision_pairs.length = 0;

	// Loop over all collision objects and check for overlapping boundary spheres
	for ( i = 0; i < bodies_count; i++ ) {
		object_a = this.bodies[i];

		for ( j = 0; j < bodies_count; j++ ) {
			if ( i <= j ) {
				// if i < j then we have already performed this check
				// if i === j then the two objects are the same and can't be in contact
				continue;
			}

			object_b = this.bodies[j];

			if( Goblin.CollisionUtils.canBodiesCollide( object_a, object_b ) ) {
				if ( object_a.aabb.intersects( object_b.aabb ) ) {
					this.collision_pairs.push( [ object_b, object_a ] );
				}
			}
		}
	}
};

/**
 * Returns an array of objects the given body may be colliding with
 *
 * @method intersectsWith
 * @param object_a {RigidBody}
 * @return Array<RigidBody>
 */
Goblin.BasicBroadphase.prototype.intersectsWith = function( object_a ) {
	var i, object_b,
		bodies_count = this.bodies.length,
		intersections = [];

	// Loop over all collision objects and check for overlapping boundary spheres
	for ( i = 0; i < bodies_count; i++ ) {
		object_b = this.bodies[i];

		if ( object_a === object_b ) {
			continue;
		}

		if ( object_a.aabb.intersects( object_b.aabb ) ) {
			intersections.push( object_b );
		}
	}

	return intersections;
};

/**
 * Checks if a ray segment intersects with objects in the world
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {Array<RayIntersection>} an unsorted array of intersections
 */
Goblin.BasicBroadphase.prototype.rayIntersect = function( start, end ) {
	var bodies_count = this.bodies.length,
		i, body,
		intersections = [];
	for ( i = 0; i < bodies_count; i++ ) {
		body = this.bodies[i];
		if ( body.aabb.testRayIntersect( start, end ) ) {
			body.rayIntersect( start, end, intersections );
		}
	}

	return intersections;
};
(function(){
	/**
	 * @class SAPMarker
	 * @private
	 * @param {SAPMarker.TYPES} marker_type
	 * @param {RigidBody} body
	 * @param {Number} position
	 * @constructor
	 */
	var SAPMarker = function( marker_type, body, position ) {
		this.type = marker_type;
		this.body = body;
		this.position = position;
		
		this.prev = null;
		this.next = null;
	};
	SAPMarker.TYPES = {
		START: 0,
		END: 1
	};

	var LinkedList = function() {
		this.first = null;
		this.last = null;
	};

	/**
	 * Sweep and Prune broadphase
	 *
	 * @class SAPBroadphase
	 * @constructor
	 */
	Goblin.SAPBroadphase = function() {
		/**
		 * linked list of the start/end markers along the X axis
		 *
		 * @property bodies
		 * @type {SAPMarker<SAPMarker>}
		 */
		this.markers_x = new LinkedList();

		/**
		 * linked list of the start/end markers along the Y axis
		 *
		 * @property bodies
		 * @type {SAPMarker<SAPMarker>}
		 */
		this.markers_y = new LinkedList();

		/**
		 * linked list of the start/end markers along the Z axis
		 *
		 * @property bodies
		 * @type {SAPMarker<SAPMarker>}
		 */
		this.markers_z = new LinkedList();

		/**
		 * maintains count of axis over which two bodies overlap; if count is three, their AABBs touch/penetrate
		 *
		 * @type {Object}
		 */
		this.overlap_counter = {};

		/**
		 * array of all (current) collision pairs between the broadphases' bodies
		 *
		 * @property collision_pairs
		 * @type {Array}
		 */
		this.collision_pairs = [];

		/**
		 * array of bodies which have been added to the broadphase since the last update
		 *
		 * @type {Array<RigidBody>}
		 */
		this.pending_bodies = [];
	};

	Goblin.SAPBroadphase.prototype = {
		incrementOverlaps: function( body_a, body_b ) {
			if( !Goblin.CollisionUtils.canBodiesCollide( body_a, body_b ) ) {
				return;
			}

			var key = body_a.id < body_b.id ? body_a.id + '-' + body_b.id : body_b.id + '-' + body_a.id;

			if ( !this.overlap_counter.hasOwnProperty( key ) ) {
				this.overlap_counter[key] = 0;
			}

			this.overlap_counter[key]++;

			if ( this.overlap_counter[key] === 3 ) {
				// The AABBs are touching, add to potential contacts
				this.collision_pairs.push([ body_a.id < body_b.id ? body_a : body_b, body_a.id < body_b.id ? body_b : body_a ]);
			}
		},

		decrementOverlaps: function( body_a, body_b ) {
			var key = body_a.id < body_b.id ? body_a.id + '-' + body_b.id : body_b.id + '-' + body_a.id;

			if ( !this.overlap_counter.hasOwnProperty( key ) ) {
				this.overlap_counter[key] = 0;
			}

			this.overlap_counter[key]--;

			if ( this.overlap_counter[key] === 0 ) {
				delete this.overlap_counter[key];
			} else if ( this.overlap_counter[key] === 2 ) {
				// These are no longer touching, remove from potential contacts
				this.collision_pairs = this.collision_pairs.filter(function( pair ){
					if ( pair[0] === body_a && pair[1] === body_b ) {
						return false;
					}
					if ( pair[0] === body_b && pair[1] === body_a ) {
						return false;
					}
					return true;
				});
			}
		},

		/**
		 * Adds a body to the broadphase for contact checking
		 *
		 * @method addBody
		 * @param body {RigidBody} body to add to the broadphase contact checking
		 */
		addBody: function( body ) {
			this.pending_bodies.push( body );
		},

		removeBody: function( body ) {
			// first, check if the body is pending
			var pending_index = this.pending_bodies.indexOf( body );
			if ( pending_index !== -1 ) {
				this.pending_bodies.splice( pending_index, 1 );
				return;
			}

			// body was already added, find & remove
			var next, prev;
			var marker = this.markers_x.first;
			while ( marker ) {
				if ( marker.body === body ) {
					next = marker.next;
					prev = marker.prev;
					if ( next != null ) {
						next.prev = prev;
						if ( prev != null ) {
							prev.next = next;
						}
					} else {
						this.markers_x.last = prev;
					}
					if ( prev != null ) {
						prev.next = next;
						if ( next != null ) {
							next.prev = prev;
						}
					} else {
						this.markers_x.first = next;
					}
				}
				marker = marker.next;
			}

			marker = this.markers_y.first;
			while ( marker ) {
				if ( marker.body === body ) {
					next = marker.next;
					prev = marker.prev;
					if ( next != null ) {
						next.prev = prev;
						if ( prev != null ) {
							prev.next = next;
						}
					} else {
						this.markers_y.last = prev;
					}
					if ( prev != null ) {
						prev.next = next;
						if ( next != null ) {
							next.prev = prev;
						}
					} else {
						this.markers_y.first = next;
					}
				}
				marker = marker.next;
			}

			marker = this.markers_z.first;
			while ( marker ) {
				if ( marker.body === body ) {
					next = marker.next;
					prev = marker.prev;
					if ( next != null ) {
						next.prev = prev;
						if ( prev != null ) {
							prev.next = next;
						}
					} else {
						this.markers_z.last = prev;
					}
					if ( prev != null ) {
						prev.next = next;
						if ( next != null ) {
							next.prev = prev;
						}
					} else {
						this.markers_z.first = next;
					}
				}
				marker = marker.next;
			}

			// remove any collisions
			this.collision_pairs = this.collision_pairs.filter(function( pair ){
				if ( pair[0] === body || pair[1] === body ) {
					return false;
				}
				return true;
			});
		},

		insertPending: function() {
			var body;
			while ( ( body = this.pending_bodies.pop() ) ) {
				body.updateDerived();
				var start_marker_x = new SAPMarker( SAPMarker.TYPES.START, body, body.aabb.min.x ),
					start_marker_y = new SAPMarker( SAPMarker.TYPES.START, body, body.aabb.min.y ),
					start_marker_z = new SAPMarker( SAPMarker.TYPES.START, body, body.aabb.min.z ),
					end_marker_x = new SAPMarker( SAPMarker.TYPES.END, body, body.aabb.max.x ),
					end_marker_y = new SAPMarker( SAPMarker.TYPES.END, body, body.aabb.max.y ),
					end_marker_z = new SAPMarker( SAPMarker.TYPES.END, body, body.aabb.max.z );

				// Insert these markers, incrementing overlap counter
				this.insert( this.markers_x, start_marker_x );
				this.insert( this.markers_x, end_marker_x );
				this.insert( this.markers_y, start_marker_y );
				this.insert( this.markers_y, end_marker_y );
				this.insert( this.markers_z, start_marker_z );
				this.insert( this.markers_z, end_marker_z );
			}
		},

		insert: function( list, marker ) {
			if ( list.first == null ) {
				list.first = list.last = marker;
			} else {
				// Insert at the end of the list & sort
				marker.prev = list.last;
				list.last.next = marker;
				list.last = marker;
				this.sort( list, marker );
			}
		},

		sort: function( list, marker ) {
			var prev;
			while (
				marker.prev != null &&
				(
					marker.position < marker.prev.position ||
					( marker.position === marker.prev.position && marker.type === SAPMarker.TYPES.START && marker.prev.type === SAPMarker.TYPES.END )
				)
			) {
				prev = marker.prev;

				// check if this swap changes overlap counters
				if ( marker.type !== prev.type ) {
					if ( marker.type === SAPMarker.TYPES.START ) {
						// marker is START, moving into an overlap
						this.incrementOverlaps( marker.body, prev.body );
					} else {
						// marker is END, leaving an overlap
						this.decrementOverlaps( marker.body, prev.body );
					}
				}

				marker.prev = prev.prev;
				prev.next = marker.next;

				marker.next = prev;
				prev.prev = marker;

				if ( marker.prev == null ) {
					list.first = marker;
				} else {
					marker.prev.next = marker;
				}
				if ( prev.next == null ) {
					list.last = prev;
				} else {
					prev.next.prev = prev;
				}
			}
		},

		/**
		 * Updates the broadphase's internal representation and current predicted contacts
		 *
		 * @method update
		 */
		update: function() {
			this.insertPending();

			var marker = this.markers_x.first;
			while ( marker ) {
				if ( marker.type === SAPMarker.TYPES.START ) {
					marker.position = marker.body.aabb.min.x;
				} else {
					marker.position = marker.body.aabb.max.x;
				}
				this.sort( this.markers_x, marker );
				marker = marker.next;
			}

			marker = this.markers_y.first;
			while ( marker ) {
				if ( marker.type === SAPMarker.TYPES.START ) {
					marker.position = marker.body.aabb.min.y;
				} else {
					marker.position = marker.body.aabb.max.y;
				}
				this.sort( this.markers_y, marker );
				marker = marker.next;
			}

			marker = this.markers_z.first;
			while ( marker ) {
				if ( marker.type === SAPMarker.TYPES.START ) {
					marker.position = marker.body.aabb.min.z;
				} else {
					marker.position = marker.body.aabb.max.z;
				}
				this.sort( this.markers_z, marker );
				marker = marker.next;
			}
		},

		/**
		 * Returns an array of objects the given body may be colliding with
		 *
		 * @method intersectsWith
		 * @param body {RigidBody}
		 * @return Array<RigidBody>
		 */
		intersectsWith: function( body ) {
			this.addBody( body );
			this.update();

			var possibilities = this.collision_pairs.filter(function( pair ){
				if ( pair[0] === body || pair[1] === body ) {
					return true;
				}
				return false;
			}).map(function( pair ){
				return pair[0] === body ? pair[1] : pair[0];
			});

			this.removeBody( body );
			return possibilities;
		},

		/**
		 * Checks if a ray segment intersects with objects in the world
		 *
		 * @method rayIntersect
		 * @property start {vec3} start point of the segment
		 * @property end {vec3{ end point of the segment
         * @return {Array<RayIntersection>} an unsorted array of intersections
		 */
		rayIntersect: function( start, end ) {
			// It's assumed that raytracing will be performed through a proxy like Goblin.World,
			// thus that the only time this broadphase cares about updating itself is if an object was added
			if ( this.pending_bodies.length > 0 ) {
				this.update();
			}

			// This implementation only scans the X axis because the overall process gets slower the more axes you add
			// thanks JavaScript

			var active_bodies = {},
				intersections = [],
				id_body_map = {},
				id_intersection_count = {},
				ordered_start, ordered_end,
				marker, has_encountered_start,
				i, body, key, keys;

			// X axis
			marker = this.markers_x.first;
			has_encountered_start = false;
			active_bodies = {};
			ordered_start = start.x < end.x ? start.x : end.x;
			ordered_end = start.x < end.x ? end.x : start.x;
			while ( marker ) {
				if ( marker.type === SAPMarker.TYPES.START ) {
					active_bodies[marker.body.id] = marker.body;
				}

				if ( marker.position >= ordered_start ) {
					if ( has_encountered_start === false ) {
						has_encountered_start = true;
						keys = Object.keys( active_bodies );
						for ( i = 0; i < keys.length; i++ ) {
							key = keys[i];
							body = active_bodies[key];
							if ( body == null ) { // needed because we don't delete but set to null, see below comment
								continue;
							}
							// The next two lines are piss-slow
							id_body_map[body.id] = body;
							id_intersection_count[body.id] = id_intersection_count[body.id] ? id_intersection_count[body.id] + 1 : 1;
						}
					} else if ( marker.type === SAPMarker.TYPES.START ) {
						// The next two lines are piss-slow
						id_body_map[marker.body.id] = marker.body;
						id_intersection_count[marker.body.id] = id_intersection_count[marker.body.id] ? id_intersection_count[marker.body.id] + 1 : 1;
					}
				}

				if ( marker.type === SAPMarker.TYPES.END ) {
					active_bodies[marker.body.id] = null; // this is massively faster than deleting the association
					//delete active_bodies[marker.body.id];
				}

				if ( marker.position > ordered_end ) {
					// no more intersections to find on this axis
					break;
				}

				marker = marker.next;
			}

			keys = Object.keys( id_intersection_count );
			for ( i = 0; i < keys.length; i++ ) {
				var body_id = keys[i];
				if ( id_intersection_count[body_id] === 1 ) {
					if ( id_body_map[body_id].aabb.testRayIntersect( start, end ) ) {
						id_body_map[body_id].rayIntersect( start, end, intersections );
					}
				}
			}

			return intersections;
		}
	};
})();
Goblin.BoxSphere = function( object_a, object_b ) {
	var sphere = object_a.shape instanceof Goblin.SphereShape ? object_a : object_b,
		box = object_a.shape instanceof Goblin.SphereShape ? object_b : object_a,
		contact, distance;

	// Transform the center of the sphere into box coordinates
	box.transform_inverse.transformVector3Into( sphere.position, _tmp_vec3_1 );

	// Early out check to see if we can exclude the contact
	if ( Math.abs( _tmp_vec3_1.x ) - sphere.shape.radius > box.shape.half_width ||
		Math.abs( _tmp_vec3_1.y ) - sphere.shape.radius > box.shape.half_height ||
		Math.abs( _tmp_vec3_1.z ) - sphere.shape.radius > box.shape.half_depth )
	{
		return;
	}

	// `_tmp_vec3_1` is the center of the sphere in relation to the box
	// `_tmp_vec3_2` will hold the point on the box closest to the sphere
	_tmp_vec3_2.x = _tmp_vec3_2.y = _tmp_vec3_2.z = 0;

	// Clamp each coordinate to the box.
	distance = _tmp_vec3_1.x;
	if ( distance > box.shape.half_width ) {
		distance = box.shape.half_width;
	} else if (distance < -box.shape.half_width ) {
		distance = -box.shape.half_width;
	}
	_tmp_vec3_2.x = distance;

	distance = _tmp_vec3_1.y;
	if ( distance > box.shape.half_height ) {
		distance = box.shape.half_height;
	} else if (distance < -box.shape.half_height ) {
		distance = -box.shape.half_height;
	}
	_tmp_vec3_2.y = distance;

	distance = _tmp_vec3_1.z;
	if ( distance > box.shape.half_depth ) {
		distance = box.shape.half_depth;
	} else if (distance < -box.shape.half_depth ) {
		distance = -box.shape.half_depth;
	}
	_tmp_vec3_2.z = distance;

	// Check we're in contact
	_tmp_vec3_3.subtractVectors( _tmp_vec3_2, _tmp_vec3_1 );
	distance = _tmp_vec3_3.lengthSquared();
	if ( distance > sphere.shape.radius * sphere.shape.radius ) {
		return;
	}

	// Get a ContactDetails object populate it
	contact = Goblin.ObjectPool.getObject( 'ContactDetails' );
	contact.object_a = sphere;
	contact.object_b = box;

	if ( distance === 0 ) {

		// The center of the sphere is contained within the box
		Goblin.BoxSphere.spherePenetration( box.shape, _tmp_vec3_1, _tmp_vec3_2, contact );

	} else {

		// Center of the sphere is outside of the box

		// Find contact normal and penetration depth
		contact.contact_normal.subtractVectors( _tmp_vec3_2, _tmp_vec3_1 );
		contact.penetration_depth = -contact.contact_normal.length();
		contact.contact_normal.scale( -1 / contact.penetration_depth );

		// Set contact point of `object_b` (the box )
		contact.contact_point_in_b.copy( _tmp_vec3_2 );

	}

	// Update penetration depth to include sphere's radius
	contact.penetration_depth += sphere.shape.radius;

	// Convert contact normal to world coordinates
	box.transform.rotateVector3( contact.contact_normal );

	// Contact point in `object_a` (the sphere) is the normal * radius converted to the sphere's frame
	sphere.transform_inverse.rotateVector3Into( contact.contact_normal, contact.contact_point_in_a );
	contact.contact_point_in_a.scale( sphere.shape.radius );

	// Find contact position
	contact.contact_point.scaleVector( contact.contact_normal, sphere.shape.radius - contact.penetration_depth / 2 );
	contact.contact_point.add( sphere.position );

	contact.restitution = ( sphere.restitution + box.restitution ) / 2;
	contact.friction = ( sphere.friction + box.friction ) / 2;

	return contact;
};

Goblin.BoxSphere.spherePenetration = function( box, sphere_center, box_point, contact ) {
	var min_distance, face_distance;

	if ( sphere_center.x < 0 ) {
		min_distance = box.half_width + sphere_center.x;
		box_point.x = -box.half_width;
		box_point.y = box_point.z = 0;
		contact.penetration_depth = min_distance;
	} else {
		min_distance = box.half_width - sphere_center.x;
		box_point.x = box.half_width;
		box_point.y = box_point.z = 0;
		contact.penetration_depth = min_distance;
	}

	if ( sphere_center.y < 0 ) {
		face_distance = box.half_height + sphere_center.y;
		if ( face_distance < min_distance ) {
			min_distance = face_distance;
			box_point.y = -box.half_height;
			box_point.x = box_point.z = 0;
			contact.penetration_depth = min_distance;
		}
	} else {
		face_distance = box.half_height - sphere_center.y;
		if ( face_distance < min_distance ) {
			min_distance = face_distance;
			box_point.y = box.half_height;
			box_point.x = box_point.z = 0;
			contact.penetration_depth = min_distance;
		}
	}

	if ( sphere_center.z < 0 ) {
		face_distance = box.half_depth + sphere_center.z;
		if ( face_distance < min_distance ) {
			box_point.z = -box.half_depth;
			box_point.x = box_point.y = 0;
			contact.penetration_depth = min_distance;
		}
	} else {
		face_distance = box.half_depth - sphere_center.z;
		if ( face_distance < min_distance ) {
			box_point.z = box.half_depth;
			box_point.x = box_point.y = 0;
			contact.penetration_depth = min_distance;
		}
	}

	// Set contact point of `object_b` (the box)
	contact.contact_point_in_b.copy( _tmp_vec3_2 );
	contact.contact_normal.scaleVector( contact.contact_point_in_b, -1 );
	contact.contact_normal.normalize();
};
Goblin.CloudCloud = function( object_a, object_b ) {
	// Cache positions of the spheres
	var position_a = object_a.position,
		position_b = object_b.position;

	// Get the vector between the two objects
	_tmp_vec3_1.subtractVectors( position_b, position_a );
	var distance = _tmp_vec3_1.length();

	// If the distance between the objects is greater than their combined radii
	// then they are not touching, continue processing the other possible contacts
	if ( distance > object_a.shape.radius + object_b.shape.radius ) {
		return;
	}

	// Get a ContactDetails object and fill out it's information
	var contact = Goblin.ObjectPool.getObject( 'ContactDetails' );
	contact.object_a = object_a;
	contact.object_b = object_b;

	// Because we already have the distance (vector magnitude), don't normalize
	// instead we will calculate this value manually
	contact.contact_normal.scaleVector( _tmp_vec3_1, 1 / distance );

	// Calculate contact position
	_tmp_vec3_1.scale( -0.5  );
	contact.contact_point.addVectors( _tmp_vec3_1, position_a );

	// Calculate penetration depth
	contact.penetration_depth = object_a.shape.radius + object_b.shape.radius - distance;

	// Contact points in both objects - in world coordinates at first
	contact.contact_point_in_a.scaleVector( contact.contact_normal, contact.object_a.shape.radius );
	contact.contact_point_in_a.add( contact.object_a.position );
	contact.contact_point_in_b.scaleVector( contact.contact_normal, -contact.object_b.shape.radius );
	contact.contact_point_in_b.add( contact.object_b.position );

	// Find actual contact point
	contact.contact_point.addVectors( contact.contact_point_in_a, contact.contact_point_in_b );
	contact.contact_point.scale( 0.5 );

	// Convert contact_point_in_a and contact_point_in_b to those objects' local frames
	contact.object_a.transform_inverse.transformVector3( contact.contact_point_in_a );
	contact.object_b.transform_inverse.transformVector3( contact.contact_point_in_b );

	contact.restitution = ( object_a.restitution + object_b.restitution ) / 2;
	contact.friction = ( object_a.friction + object_b.friction ) / 2;

	return contact;
};


// duplicated in VoxelCloud
function  rayCast(cluster, o, forward )
{
    var Out = null;
  var Delta_h = THREE.Vector4Pool.new(),Delta_v = THREE.Vector4Pool.new(),Delta_s = THREE.Vector4Pool.new();
  var Offset_h = THREE.Vector4Pool.new(), Offset_v = THREE.Vector4Pool.new(), Offset_s = THREE.Vector4Pool.new();
  var Norm_h = THREE.Vector3Pool.new(), Norm_v = THREE.Vector3Pool.new(), Norm_s = THREE.Vector3Pool.new();
  var Collision_h = THREE.Vector4Pool.new(), Collision_v = THREE.Vector4Pool.new(), Collision_s = THREE.Vector4Pool.new();

  var ActualCube_x,ActualCube_y,ActualCube_z;
  var NewCube_x,NewCube_y,NewCube_z;
  var Collide_X, Collide_Y, Collide_Z;
  var i;

  var Norm = forward;

  Collide_X = Collide_Y = Collide_Z = false;

  if (Norm.x >= 0.01 )
  {
    Collide_X = true;
    Delta_h.x = 1.0;
    Delta_h.y = Norm.y / Norm.x;
    Delta_h.z = Norm.z / Norm.x;
    Delta_h.w = 0;
    Delta_h.w = Delta_h.length();

    Collision_h.x = (Math.floor(o.x / cluster.voxelUnitSize) + 1.0)*cluster.voxelUnitSize;
    Collision_h.y = (Collision_h.x - o.x) * Delta_h.y + o.y;
    Collision_h.z = (Collision_h.x - o.x) * Delta_h.z + o.z;
    Collision_h.w = (Collision_h.x - o.x) * Delta_h.w;

    Offset_h.x = cluster.voxelUnitSize;
    Offset_h.y = Delta_h.y * cluster.voxelUnitSize;
    Offset_h.z = Delta_h.z * cluster.voxelUnitSize;
    Offset_h.w = Delta_h.w * cluster.voxelUnitSize;
    Norm_h.x = Offset_h.x/2;// / (cluster.voxelUnitSize/2);
    Norm_h.y = 0 / (cluster.voxelUnitSize/2);
    Norm_h.z = 0 / (cluster.voxelUnitSize/2);
  }
  else if (Norm.x <= -0.01)
  {
    Collide_X = true;

    Delta_h.x = 1.0;
    Delta_h.y = Norm.y / -Norm.x;
    Delta_h.z = Norm.z / -Norm.x;
    Delta_h.w = 0;
    Delta_h.w = Delta_h.length();

    Collision_h.x = (Math.floor(o.x / cluster.voxelUnitSize))*cluster.voxelUnitSize;
    Collision_h.y = (o.x - Collision_h.x) * Delta_h.y + o.y;
    Collision_h.z = (o.x - Collision_h.x) * Delta_h.z + o.z;
    Collision_h.w = (o.x - Collision_h.x) * Delta_h.w;
    Offset_h.x = -cluster.voxelUnitSize;
    Offset_h.y = Delta_h.y * cluster.voxelUnitSize;
    Offset_h.z = Delta_h.z * cluster.voxelUnitSize;
    Offset_h.w = Delta_h.w * cluster.voxelUnitSize;
    Norm_h.x = Offset_h.x/2;// / (cluster.voxelUnitSize/2);
    Norm_h.y = 0 / (cluster.voxelUnitSize/2);
    Norm_h.z = 0 / (cluster.voxelUnitSize/2);
  }

  if (Norm.y >= 0.01 )
  {
    Collide_Y = true;
    Delta_v.x = Norm.x / Norm.y;
    Delta_v.y = 1.0;
    Delta_v.z = Norm.z / Norm.y;
    Delta_v.w = 0;
    Delta_v.w = Delta_v.length();

    Collision_v.y = (Math.floor(o.y / cluster.voxelUnitSize)+1) * cluster.voxelUnitSize;
    var dely = (Collision_v.y - o.y);
    Collision_v.x = dely * Delta_v.x + o.x;
    Collision_v.z = dely * Delta_v.z + o.z;
    Collision_v.w = dely * Delta_v.w;
    Offset_v.y = cluster.voxelUnitSize;
    Offset_v.x = Delta_v.x * cluster.voxelUnitSize;
    Offset_v.z = Delta_v.z * cluster.voxelUnitSize;
    Offset_v.w = Delta_v.w * cluster.voxelUnitSize;
    Norm_v.x = 0 / (cluster.voxelUnitSize/2);
    Norm_v.y = Offset_v.y/2;// / (cluster.voxelUnitSize/2);
    Norm_v.z = 0 / (cluster.voxelUnitSize/2);
  }
  else if (Norm.y <= -0.01)
  {
    Collide_Y = true;
    Delta_v.x = Norm.x / -Norm.y;
    Delta_v.y = 1.0;
    Delta_v.z = Norm.z / -Norm.y;
    Delta_v.w = 0;
    Delta_v.w = Delta_v.length();

    Collision_v.y = (Math.floor(o.y / cluster.voxelUnitSize)) * cluster.voxelUnitSize;
    var dely = (o.y-Collision_v.y );
    Collision_v.x = (dely) * Delta_v.x + o.x;
    Collision_v.z = (dely) * Delta_v.z + o.z;
    Collision_v.w = (dely) * Delta_v.w;

    Offset_v.y = -cluster.voxelUnitSize;
    Offset_v.x = Delta_v.x * cluster.voxelUnitSize;
    Offset_v.z = Delta_v.z * cluster.voxelUnitSize;
    Offset_v.w = Delta_v.w * cluster.voxelUnitSize;
    Norm_v.x = 0 / (cluster.voxelUnitSize/2);
    Norm_v.y = Offset_v.y/2;// / (cluster.voxelUnitSize/2);
    Norm_v.z = 0 / (cluster.voxelUnitSize/2);
  }

  if (Norm.z >= 0.01)
  {
    Collide_Z = true;
    Delta_s.x = Norm.x / Norm.z;
    Delta_s.y = Norm.y / Norm.z;
    Delta_s.z = 1.0;
    Delta_s.w = 0;
    Delta_s.w = Delta_s.length();
    Collision_s.z = (Math.floor(o.z / cluster.voxelUnitSize) + 1.0)*cluster.voxelUnitSize;
    Collision_s.x = (Collision_s.z - o.z) * Delta_s.x + o.x;
    Collision_s.y = (Collision_s.z - o.z) * Delta_s.y + o.y;
    Collision_s.w = (Collision_s.z - o.z) * Delta_s.w;

    Offset_s.x = Delta_s.x * cluster.voxelUnitSize;
    Offset_s.y = Delta_s.y * cluster.voxelUnitSize;
    Offset_s.z = cluster.voxelUnitSize;
    Offset_s.w = Delta_s.w * cluster.voxelUnitSize;
    Norm_s.x = 0 / (cluster.voxelUnitSize/2);
    Norm_s.y = 0 / (cluster.voxelUnitSize/2);
    Norm_s.z = Offset_s.z/2;// / (cluster.voxelUnitSize/2);
  }
  else if (Norm.z <= -0.01)
  {
    Collide_Z = true;
    Delta_s.x = Norm.x / -Norm.z;
    Delta_s.y = Norm.y / -Norm.z;
    Delta_s.z = 1.0;
    Delta_s.w = 0;
    Delta_s.w = Delta_s.length();
    Collision_s.z = (Math.floor(o.z / cluster.voxelUnitSize) )*cluster.voxelUnitSize;
    Collision_s.x = (o.z - Collision_s.z) * Delta_s.x + o.x;
    Collision_s.y = (o.z - Collision_s.z) * Delta_s.y + o.y;
    Collision_s.w = (o.z - Collision_s.z) * Delta_s.w;

    Offset_s.x = Delta_s.x * cluster.voxelUnitSize;
    Offset_s.y = Delta_s.y * cluster.voxelUnitSize;
    Offset_s.z = - cluster.voxelUnitSize;
    Offset_s.w = Delta_s.w * cluster.voxelUnitSize;

    Norm_s.x = 0 / (cluster.voxelUnitSize/2);
    Norm_s.y = 0 / (cluster.voxelUnitSize/2);
    Norm_s.z = Offset_s.z/2;// / (cluster.voxelUnitSize/2);
  }



//  printf("yaw: %04lf pitch: %lf Offset_y:%lf Offset_z:%lf xyz:%lf %lf %lf NXYZ:%lf %lf %lf Dxyz:%lf %lf %lf", yaw,pitch, Delta_h.y, Delta_h.z,x,y,z, Norm_h.x, Norm_h.y, Norm_h.z, Delta_h.x, Delta_h.y, Delta_h.z);
 //printf("Angle (y:%lf p:%lf) XYZ:(%lf %lf %lf) Off(%lf %lf %lf %lf) Coll(%lf %lf %lf %lf) Norm(%lg %lg %lf) :\n", yaw,pitch,x,y,z, Offset_s.x, Offset_s.y, Offset_s.z, Offset_s.w, Collision_s.x, Collision_s.y, Collision_s.z, Collision_s.w, Norm_s.x,Norm_s.y, Norm_s.z);

  var Match_h = 0;
  var Match_s = 0;
  var Match_v = 0;
  var Cycle = 1;
  var MinW = 1000000.0;
  var ref;
  //console.log( '-------------------------');
  for (i=0;i<150;i++)
  {

    // Horizontal X axis.
    if (Collide_X)
    {
      if (Match_h==0 && Collision_h.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_h.x - Norm_h.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_h.y - Norm_h.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_h.z - Norm_h.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_h.x + Norm_h.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_h.y + Norm_h.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_h.z + Norm_h.z) / cluster.voxelUnitSize);
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough)
        {
            //console.log( `x check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}    ${ActualCube_x} ${ActualCube_y} ${ActualCube_z}  ${MinW}  ${Collision_h.w}`)
            Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                    PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                    ref : ref
                    };
          // printf(" MATCH_H: %lf\n",Collision_h.w);
          Match_h = Cycle;
          MinW = Collision_h.w;
        } else if( ref ) ref.delete();
      }
    }

    // Horizontal Z axis.

    if (Collide_Z)
    {
      if (Match_s == 0 && Collision_s.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_s.x - Norm_s.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_s.y - Norm_s.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_s.z - Norm_s.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_s.x + Norm_s.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_s.y + Norm_s.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_s.z + Norm_s.z) / cluster.voxelUnitSize);
        //console.log( `z check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_s.w} `)
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough)
        {
            //console.log( `z check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_s.w} `)
          Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                  PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                  ref : ref
                   };
          // printf(" MATCH_S: %lf\n",Collision_s.w);
          Match_s = Cycle;
          MinW = Collision_s.w;
        } else if( ref ) ref.delete();
      }
    }

    // Vertical Y axis.

    if (Collide_Y)
    {
      if (Match_v==0 && Collision_v.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_v.x - Norm_v.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_v.y - Norm_v.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_v.z - Norm_v.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_v.x + Norm_v.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_v.y + Norm_v.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_v.z + Norm_v.z) / cluster.voxelUnitSize);
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough )
        {
            //console.log( `y check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_v.w} `)
          Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                  PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                  ref : ref
                   };
          // printf(" MATCH_V: %lf\n",Collision_v.w);
          Match_v = Cycle;
          MinW = Collision_v.w;
        } else if( ref ) ref.delete();
      }
    }

      //printf(" Match (H:%lf S:%lf V:%lf) \n", Collision_h.w, Collision_s.w, Collision_v.w);
      if (Match_h>0 && (Match_h - Cycle)<-100) return Out;
      if (Match_s>0 && (Match_s - Cycle)<-100) return Out;
      if (Match_v>0 && (Match_v - Cycle)<-100) return Out;

    Collision_h.x += Offset_h.x; Collision_h.y += Offset_h.y; Collision_h.z += Offset_h.z; Collision_h.w += Offset_h.w;
    Collision_v.x += Offset_v.x; Collision_v.y += Offset_v.y; Collision_v.z += Offset_v.z; Collision_v.w += Offset_v.w;
    Collision_s.x += Offset_s.x; Collision_s.y += Offset_s.y; Collision_s.z += Offset_s.z; Collision_s.w += Offset_s.w;
    Cycle ++;
  }
  Delta_h.delete();
  Delta_v.delete();
  Delta_s.delete();
  Offset_h.delete();
  Offset_v.delete();
  Offset_s.delete();
  Norm_h.delete();
  Norm_v.delete();
  Norm_s.delete();
  Collision_h.delete();
  Collision_v.delete();
  Collision_s.delete();

  return Out;
}

/**
 * Provides the classes and algorithms for running GJK+EPA based collision detection
 *
 * @class GjkEpa
 * @static
 */
Goblin.GjkEpa = {
	margins: 0.03,
	result: null,

    max_iterations: 20,
    epa_condition: 0.001,

    /**
     * Holds a point on the edge of a Minkowski difference along with that point's witnesses and the direction used to find the point
     *
     * @class SupportPoint
     * @param witness_a {vec3} Point in first object used to find the supporting point
     * @param witness_b {vec3} Point in the second object ued to find th supporting point
     * @param point {vec3} The support point on the edge of the Minkowski difference
     * @constructor
     */
    SupportPoint: function( witness_a, witness_b, point ) {
        this.witness_a = witness_a;
        this.witness_b = witness_b;
        this.point = point;
    },

    /**
     * Finds the extant point on the edge of the Minkowski difference for `object_a` - `object_b` in `direction`
     *
     * @method findSupportPoint
     * @param object_a {Goblin.RigidBody} First object in the search
     * @param object_b {Goblin.RigidBody} Second object in the search
     * @param direction {vec3} Direction to find the extant point in
     * @param gjk_point {Goblin.GjkEpa.SupportPoint} `SupportPoint` class to store the resulting point & witnesses in
     */
    findSupportPoint: (function(){
        var temp = new Goblin.Vector3();
        return function( object_a, object_b, direction, support_point ) {
            // Find witnesses from the objects
            object_a.findSupportPoint( direction, support_point.witness_a );
            temp.scaleVector( direction, -1 );
            object_b.findSupportPoint( temp, support_point.witness_b );

            // Find the CSO support point
            support_point.point.subtractVectors( support_point.witness_a, support_point.witness_b );
        };
    })(),

	testCollision: function( object_a, object_b ) {
		var simplex = Goblin.GjkEpa.GJK( object_a, object_b );
		if ( Goblin.GjkEpa.result != null ) {
			return Goblin.GjkEpa.result;
		} else if ( simplex != null ) {
			return Goblin.GjkEpa.EPA( simplex );
		}
	},

    /**
     * Perform GJK algorithm against two objects. Returns a ContactDetails object if there is a collision, else null
     *
     * @method GJK
     * @param object_a {Goblin.RigidBody}
     * @param object_b {Goblin.RigidBody}
     * @return {Goblin.ContactDetails|Boolean} Returns `null` if no collision, else a `ContactDetails` object
     */
	GJK: function( object_a, object_b ) {
            var simplex = new Goblin.GjkEpa.Simplex( object_a, object_b ),
                last_point;

		Goblin.GjkEpa.result = null;

            while ( ( last_point = simplex.addPoint() ) ){}

            // If last_point is false then there is no collision
            if ( last_point === false ) {
				Goblin.GjkEpa.freeSimplex( simplex );
                return null;
            }

            return simplex;
        },

	freeSimplex: function( simplex ) {
		// Free the support points used by this simplex
		for ( var i = 0, points_length = simplex.points.length; i < points_length; i++ ) {
			Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', simplex.points[i] );
		}
	},

	freePolyhedron: function( polyhedron ) {
		// Free the support points used by the polyhedron (includes the points from the simplex used to create the polyhedron
		var pool = Goblin.ObjectPool.pools['GJK2SupportPoint'];

		for ( var i = 0, faces_length = polyhedron.faces.length; i < faces_length; i++ ) {
			// The indexOf checking is required because vertices are shared between faces
			if ( pool.indexOf( polyhedron.faces[i].a ) === -1 ) {
				Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', polyhedron.faces[i].a );
			}
			if ( pool.indexOf( polyhedron.faces[i].b ) === -1 ) {
				Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', polyhedron.faces[i].b );
			}
			if ( pool.indexOf( polyhedron.faces[i].c ) === -1 ) {
				Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', polyhedron.faces[i].c );
			}
		}
	},

    /**
     * Performs the Expanding Polytope Algorithm a GJK simplex
     *
     * @method EPA
     * @param simplex {Goblin.GjkEpa.Simplex} Simplex generated by the GJK algorithm
     * @return {Goblin.ContactDetails}
     */
    EPA: (function(){
		var barycentric = new Goblin.Vector3(),
			confirm = {
				a: new Goblin.Vector3(),
				b: new Goblin.Vector3(),
				c: new Goblin.Vector3()
			};
		return function( simplex ) {
            // Time to convert the simplex to real faces
            // @TODO this should be a priority queue where the position in the queue is ordered by distance from face to origin
			var polyhedron = new Goblin.GjkEpa.Polyhedron( simplex );

			var i = 0;

            // Expand the polyhedron until it doesn't expand any more
			while ( ++i ) {
				polyhedron.findFaceClosestToOrigin();

				// Find a new support point in the direction of the closest point
				if ( polyhedron.closest_face_distance < Goblin.EPSILON ) {
					_tmp_vec3_1.copy( polyhedron.faces[polyhedron.closest_face].normal );
				} else {
					_tmp_vec3_1.copy( polyhedron.closest_point );
				}

				var support_point = Goblin.ObjectPool.getObject( 'GJK2SupportPoint' );
				Goblin.GjkEpa.findSupportPoint( simplex.object_a, simplex.object_b, _tmp_vec3_1, support_point );

				// Check for terminating condition
                _tmp_vec3_1.subtractVectors( support_point.point, polyhedron.closest_point );
                var gap = _tmp_vec3_1.lengthSquared();

				if ( i === Goblin.GjkEpa.max_iterations || ( gap < Goblin.GjkEpa.epa_condition && polyhedron.closest_face_distance > Goblin.EPSILON ) ) {

					// Get a ContactDetails object and fill out its details
					var contact = Goblin.ObjectPool.getObject( 'ContactDetails' );
					contact.object_a = simplex.object_a;
					contact.object_b = simplex.object_b;

					contact.contact_normal.normalizeVector( polyhedron.closest_point );
					if ( contact.contact_normal.lengthSquared() === 0 ) {
						contact.contact_normal.subtractVectors( contact.object_b.position, contact.object_a.position );
					}
					contact.contact_normal.normalize();

					Goblin.GeometryMethods.findBarycentricCoordinates( polyhedron.closest_point, polyhedron.faces[polyhedron.closest_face].a.point, polyhedron.faces[polyhedron.closest_face].b.point, polyhedron.faces[polyhedron.closest_face].c.point, barycentric );

					if ( isNaN( barycentric.x ) ) {
                        // @TODO: Avoid this degenerate case
						//console.log( 'Point not in triangle' );
						//debugger;
						Goblin.GjkEpa.freePolyhedron( polyhedron );
						return null;
					}

					// Contact coordinates of object a
					confirm.a.scaleVector( polyhedron.faces[polyhedron.closest_face].a.witness_a, barycentric.x );
					confirm.b.scaleVector( polyhedron.faces[polyhedron.closest_face].b.witness_a, barycentric.y );
					confirm.c.scaleVector( polyhedron.faces[polyhedron.closest_face].c.witness_a, barycentric.z );
					contact.contact_point_in_a.addVectors( confirm.a, confirm.b );
					contact.contact_point_in_a.add( confirm.c );

					// Contact coordinates of object b
					confirm.a.scaleVector( polyhedron.faces[polyhedron.closest_face].a.witness_b, barycentric.x );
					confirm.b.scaleVector( polyhedron.faces[polyhedron.closest_face].b.witness_b, barycentric.y );
					confirm.c.scaleVector( polyhedron.faces[polyhedron.closest_face].c.witness_b, barycentric.z );
					contact.contact_point_in_b.addVectors( confirm.a, confirm.b );
					contact.contact_point_in_b.add( confirm.c );

					// Find actual contact point
					contact.contact_point.addVectors( contact.contact_point_in_a, contact.contact_point_in_b );
					contact.contact_point.scale( 0.5  );

					// Set objects' local points
					contact.object_a.transform_inverse.transformVector3( contact.contact_point_in_a );
					contact.object_b.transform_inverse.transformVector3( contact.contact_point_in_b );

					// Calculate penetration depth
					contact.penetration_depth = polyhedron.closest_point.length() + Goblin.GjkEpa.margins;

					contact.restitution = ( simplex.object_a.restitution + simplex.object_b.restitution ) / 2;
					contact.friction = ( simplex.object_a.friction + simplex.object_b.friction ) / 2;

					Goblin.GjkEpa.freePolyhedron( polyhedron );

					return contact;
				}

                polyhedron.addVertex( support_point );
			}

			Goblin.GjkEpa.freePolyhedron( polyhedron );
            return null;
        };
    })(),

    Face: function( polyhedron, a, b, c ) {
		this.active = true;
		//this.polyhedron = polyhedron;
        this.a = a;
        this.b = b;
        this.c = c;
        this.normal = new Goblin.Vector3();
		this.neighbors = [];

        _tmp_vec3_1.subtractVectors( b.point, a.point );
        _tmp_vec3_2.subtractVectors( c.point, a.point );
        this.normal.crossVectors( _tmp_vec3_1, _tmp_vec3_2 );
        this.normal.normalize();
    }
};

Goblin.GjkEpa.Polyhedron = function( simplex ) {
	this.closest_face = null;
	this.closest_face_distance = null;
	this.closest_point = new Goblin.Vector3();

	this.faces = [
		//BCD, ACB, CAD, DAB
		new Goblin.GjkEpa.Face( this, simplex.points[2], simplex.points[1], simplex.points[0] ),
		new Goblin.GjkEpa.Face( this, simplex.points[3], simplex.points[1], simplex.points[2] ),
		new Goblin.GjkEpa.Face( this, simplex.points[1], simplex.points[3], simplex.points[0] ),
		new Goblin.GjkEpa.Face( this, simplex.points[0], simplex.points[3], simplex.points[2] )
	];

	this.faces[0].neighbors.push( this.faces[1], this.faces[2], this.faces[3] );
	this.faces[1].neighbors.push( this.faces[2], this.faces[0], this.faces[3] );
	this.faces[2].neighbors.push( this.faces[1], this.faces[3], this.faces[0] );
	this.faces[3].neighbors.push( this.faces[2], this.faces[1], this.faces[0] );
};
Goblin.GjkEpa.Polyhedron.prototype = {
    addVertex: function( vertex )
    {
        var edges = [], faces = [], i, j, a, b, last_b;
        this.faces[this.closest_face].silhouette( vertex, edges );

        // Re-order the edges if needed
        for ( i = 0; i < edges.length - 5; i += 5 ) {
            a = edges[i+3];
            b = edges[i+4];

            // Ensure this edge really should be the next one
            if ( i !== 0 && last_b !== a ) {
                // It shouldn't
                for ( j = i + 5; j < edges.length; j += 5 ) {
                    if ( edges[j+3] === last_b ) {
                        // Found it
                        var tmp = edges.slice( i, i + 5 );
                        edges[i] = edges[j];
                        edges[i+1] = edges[j+1];
                        edges[i+2] = edges[j+2];
                        edges[i+3] = edges[j+3];
                        edges[i+4] = edges[j+4];
                        edges[j] = tmp[0];
                        edges[j+1] = tmp[1];
                        edges[j+2] = tmp[2];
                        edges[j+3] = tmp[3];
                        edges[j+4] = tmp[4];

                        a = edges[i+3];
                        b = edges[i+4];
                        break;
                    }
                }
            }
            last_b = b;
        }

        for ( i = 0; i < edges.length; i += 5 ) {
            var neighbor = edges[i];
            a = edges[i+3];
            b = edges[i+4];

            var face = new Goblin.GjkEpa.Face( this, b, vertex, a );
            face.neighbors[2] = edges[i];
            faces.push( face );

            neighbor.neighbors[neighbor.neighbors.indexOf( edges[i+2] )] = face;
        }

        for ( i = 0; i < faces.length; i++ ) {
            faces[i].neighbors[0] = faces[ i + 1 === faces.length ? 0 : i + 1 ];
            faces[i].neighbors[1] = faces[ i - 1 < 0 ? faces.length - 1 : i - 1 ];
        }

		Array.prototype.push.apply( this.faces, faces );

        return edges;
    },

	findFaceClosestToOrigin: (function(){
		var origin = new Goblin.Vector3(),
			point = new Goblin.Vector3();

		return function() {
			this.closest_face_distance = Infinity;

			var distance, i;

			for ( i = 0; i < this.faces.length; i++ ) {
				if ( this.faces[i].active === false ) {
					continue;
				}

				Goblin.GeometryMethods.findClosestPointInTriangle( origin, this.faces[i].a.point, this.faces[i].b.point, this.faces[i].c.point, point );
				distance = point.lengthSquared();
				if ( distance < this.closest_face_distance ) {
					this.closest_face_distance = distance;
					this.closest_face = i;
					this.closest_point.copy( point );
				}
			}
		};
	})()
};

Goblin.GjkEpa.Face.prototype = {
	/**
	 * Determines if a vertex is in front of or behind the face
	 *
	 * @method classifyVertex
	 * @param vertex {vec3} Vertex to classify
	 * @return {Number} If greater than 0 then `vertex' is in front of the face
	 */
	classifyVertex: function( vertex ) {
		var w = this.normal.dot( this.a.point );
		return this.normal.dot( vertex.point ) - w;
	},

	silhouette: function( point, edges, source ) {
        if ( this.active === false ) {
            return;
        }

        if ( this.classifyVertex( point ) > 0 ) {
			// This face is visible from `point`. Deactivate this face and alert the neighbors
			this.active = false;

			this.neighbors[0].silhouette( point, edges, this );
			this.neighbors[1].silhouette( point, edges, this );
            this.neighbors[2].silhouette( point, edges, this );
		} else if ( source ) {
			// This face is a neighbor to a now-silhouetted face, determine which neighbor and replace it
			var neighbor_idx = this.neighbors.indexOf( source ),
                a, b;
            if ( neighbor_idx === 0 ) {
                a = this.a;
                b = this.b;
            } else if ( neighbor_idx === 1 ) {
                a = this.b;
                b = this.c;
            } else {
                a = this.c;
                b = this.a;
            }
			edges.push( this, neighbor_idx, source, b, a );
		}
	}
};

(function(){
    var origin = new Goblin.Vector3(),
		ao = new Goblin.Vector3(),
        ab = new Goblin.Vector3(),
        ac = new Goblin.Vector3(),
        ad = new Goblin.Vector3();

	var barycentric = new Goblin.Vector3(),
		confirm = {
			a: new Goblin.Vector3(),
			b: new Goblin.Vector3(),
			c: new Goblin.Vector3()
		};

    Goblin.GjkEpa.Simplex = function( object_a, object_b ) {
        this.object_a = object_a;
        this.object_b = object_b;
        this.points = [];
        this.iterations = 0;
        this.next_direction = new Goblin.Vector3();
        this.updateDirection();
    };
    Goblin.GjkEpa.Simplex.prototype = {
        addPoint: function() {
            if ( ++this.iterations === Goblin.GjkEpa.max_iterations ) {
                return false;
            }

            var support_point = Goblin.ObjectPool.getObject( 'GJK2SupportPoint' );
            Goblin.GjkEpa.findSupportPoint( this.object_a, this.object_b, this.next_direction, support_point );
            this.points.push( support_point );

			if ( support_point.point.dot( this.next_direction ) < 0 && this.points.length > 1 ) {
				// Check the margins first
				// @TODO this can be expanded to support 1-simplex (2 points)
				if ( this.points.length >= 3 ) {
					Goblin.GeometryMethods.findClosestPointInTriangle(
						origin,
						this.points[0].point,
						this.points[1].point,
						this.points[2].point,
						_tmp_vec3_1
					);
					var distanceSquared = _tmp_vec3_1.lengthSquared();

					if ( distanceSquared <= Goblin.GjkEpa.margins * Goblin.GjkEpa.margins ) {
						// Get a ContactDetails object and fill out its details
						var contact = Goblin.ObjectPool.getObject( 'ContactDetails' );
						contact.object_a = this.object_a;
						contact.object_b = this.object_b;

						contact.contact_normal.normalizeVector( _tmp_vec3_1 );
						if ( contact.contact_normal.lengthSquared() === 0 ) {
							contact.contact_normal.subtractVectors( contact.object_b.position, contact.object_a.position );
						}
						contact.contact_normal.normalize();
						contact.contact_normal.scale( -1 );

						contact.penetration_depth = Goblin.GjkEpa.margins - Math.sqrt( distanceSquared );

						Goblin.GeometryMethods.findBarycentricCoordinates( _tmp_vec3_1, this.points[0].point, this.points[1].point, this.points[2].point, barycentric );

						if ( isNaN( barycentric.x ) ) {
							//debugger;
							return false;
						}

						// Contact coordinates of object a
						confirm.a.scaleVector( this.points[0].witness_a, barycentric.x );
						confirm.b.scaleVector( this.points[1].witness_a, barycentric.y );
						confirm.c.scaleVector( this.points[2].witness_a, barycentric.z );
						contact.contact_point_in_a.addVectors( confirm.a, confirm.b );
						contact.contact_point_in_a.add( confirm.c );

						// Contact coordinates of object b
						contact.contact_point_in_b.scaleVector( contact.contact_normal, -contact.penetration_depth );
						contact.contact_point_in_b.add( contact.contact_point_in_a );

						// Find actual contact point
						contact.contact_point.addVectors( contact.contact_point_in_a, contact.contact_point_in_b );
						contact.contact_point.scale( 0.5  );

						// Set objects' local points
						contact.object_a.transform_inverse.transformVector3( contact.contact_point_in_a );
						contact.object_b.transform_inverse.transformVector3( contact.contact_point_in_b );

						contact.restitution = ( this.object_a.restitution + this.object_b.restitution ) / 2;
						contact.friction = ( this.object_a.friction + this.object_b.friction ) / 2;

						//Goblin.GjkEpa.freePolyhedron( polyhedron );

						Goblin.GjkEpa.result = contact;
						return null;
					}
				}

				// if the last added point was not past the origin in the direction
				// then the Minkowski difference cannot contain the origin because
				// point added is past the edge of the Minkowski difference
				return false;
			}

            if ( this.updateDirection() === true ) {
                // Found a collision
                return null;
            }

            return support_point;
        },

        findDirectionFromLine: function() {
            ao.scaleVector( this.points[1].point, -1 );
            ab.subtractVectors( this.points[0].point, this.points[1].point );

            if ( ab.dot( ao ) < 0 ) {
                // Origin is on the opposite side of A from B
                this.next_direction.copy( ao );
				Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', this.points[1] );
                this.points.length = 1; // Remove second point
			} else {
                // Origin lies between A and B, move on to a 2-simplex
                this.next_direction.crossVectors( ab, ao );
                this.next_direction.cross( ab );

                // In the case that `ab` and `ao` are parallel vectors, direction becomes a 0-vector
                if (
                    this.next_direction.x === 0 &&
                    this.next_direction.y === 0 &&
                    this.next_direction.z === 0
                ) {
                    ab.normalize();
                    this.next_direction.x = 1 - Math.abs( ab.x );
                    this.next_direction.y = 1 - Math.abs( ab.y );
                    this.next_direction.z = 1 - Math.abs( ab.z );
                }
            }
        },

        findDirectionFromTriangle: function() {
            // Triangle
            var a = this.points[2],
                b = this.points[1],
                c = this.points[0];

            ao.scaleVector( a.point, -1 ); // ao
            ab.subtractVectors( b.point, a.point ); // ab
            ac.subtractVectors( c.point, a.point ); // ac

            // Determine the triangle's normal
            _tmp_vec3_1.crossVectors( ab, ac );

            // Edge cross products
            _tmp_vec3_2.crossVectors( ab, _tmp_vec3_1 );
            _tmp_vec3_3.crossVectors( _tmp_vec3_1, ac );

            if ( _tmp_vec3_3.dot( ao ) >= 0 ) {
                // Origin lies on side of ac opposite the triangle
                if ( ac.dot( ao ) >= 0 ) {
                    // Origin outside of the ac line, so we form a new
                    // 1-simplex (line) with points A and C, leaving B behind
                    this.points.length = 0;
                    this.points.push( c, a );
					Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', b );

                    // New search direction is from ac towards the origin
                    this.next_direction.crossVectors( ac, ao );
                    this.next_direction.cross( ac );
                } else {
                    // *
                    if ( ab.dot( ao ) >= 0 ) {
                        // Origin outside of the ab line, so we form a new
                        // 1-simplex (line) with points A and B, leaving C behind
                        this.points.length = 0;
                        this.points.push( b, a );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', c );

                        // New search direction is from ac towards the origin
                        this.next_direction.crossVectors( ab, ao );
                        this.next_direction.cross( ab );
                    } else {
                        // only A gives us a good reference point, start over with a 0-simplex
                        this.points.length = 0;
                        this.points.push( a );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', b );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', c );
                    }
                    // *
                }

            } else {

                // Origin lies on the triangle side of ac
                if ( _tmp_vec3_2.dot( ao ) >= 0 ) {
                    // Origin lies on side of ab opposite the triangle

                    // *
                    if ( ab.dot( ao ) >= 0 ) {
                        // Origin outside of the ab line, so we form a new
                        // 1-simplex (line) with points A and B, leaving C behind
                        this.points.length = 0;
                        this.points.push( b, a );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', c );

                        // New search direction is from ac towards the origin
                        this.next_direction.crossVectors( ab, ao );
                        this.next_direction.cross( ab );
                    } else {
                        // only A gives us a good reference point, start over with a 0-simplex
                        this.points.length = 0;
                        this.points.push( a );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', b );
						Goblin.ObjectPool.freeObject( 'GJK2SupportPoint', c );
                    }
                    // *

                } else {

                    // Origin lies somewhere in the triangle or above/below it
                    if ( _tmp_vec3_1.dot( ao ) >= 0 ) {
                        // Origin is on the front side of the triangle
                        this.next_direction.copy( _tmp_vec3_1 );
						this.points.length = 0;
						this.points.push( a, b, c );
                    } else {
                        // Origin is on the back side of the triangle
                        this.next_direction.copy( _tmp_vec3_1 );
                        this.next_direction.scale( -1 );
                    }

                }

            }
        },

        getFaceNormal: function( a, b, c, destination ) {
            ab.subtractVectors( b.point, a.point );
            ac.subtractVectors( c.point, a.point );
            destination.crossVectors( ab, ac );
            destination.normalize();
        },

        faceNormalDotOrigin: function( a, b, c ) {
            // Find face normal
            this.getFaceNormal( a, b, c, _tmp_vec3_1 );

            // Find direction of origin from center of face
            _tmp_vec3_2.addVectors( a.point, b.point );
            _tmp_vec3_2.add( c.point );
			_tmp_vec3_2.scale( -3 );
			_tmp_vec3_2.normalize();

            return _tmp_vec3_1.dot( _tmp_vec3_2 );
        },

        findDirectionFromTetrahedron: function() {
            var a = this.points[3],
                b = this.points[2],
                c = this.points[1],
                d = this.points[0];

			// Check each of the four sides to see which one is facing the origin.
			// Then keep the three points for that triangle and use its normal as the search direction
			// The four faces are BCD, ACB, CAD, DAB
			var closest_face = null,
				closest_dot = Goblin.EPSILON,
				face_dot;

			// @TODO we end up calculating the "winning" face normal twice, don't do that

			face_dot = this.faceNormalDotOrigin( b, c, d );
			if ( face_dot > closest_dot ) {
				closest_face = 1;
				closest_dot = face_dot;
			}

			face_dot = this.faceNormalDotOrigin( a, c, b );
			if ( face_dot > closest_dot ) {
				closest_face = 2;
				closest_dot = face_dot;
			}

			face_dot = this.faceNormalDotOrigin( c, a, d );
			if ( face_dot > closest_dot ) {
				closest_face = 3;
				closest_dot = face_dot;
			}

			face_dot = this.faceNormalDotOrigin( d, a, b );
			if ( face_dot > closest_dot ) {
				closest_face = 4;
				closest_dot = face_dot;
			}

			if ( closest_face === null ) {
				// We have a collision, ready for EPA
				return true;
			} else if ( closest_face === 1 ) {
				// BCD
				this.points.length = 0;
				this.points.push( b, c, d );
				this.getFaceNormal( b, c, d, _tmp_vec3_1 );
				this.next_direction.copy( _tmp_vec3_1 );
			} else if ( closest_face === 2 ) {
				// ACB
				this.points.length = 0;
				this.points.push( a, c, b );
				this.getFaceNormal( a, c, b, _tmp_vec3_1 );
				this.next_direction.copy( _tmp_vec3_1 );
			} else if ( closest_face === 3 ) {
				// CAD
				this.points.length = 0;
				this.points.push( c, a, d );
				this.getFaceNormal( c, a, d, _tmp_vec3_1 );
				this.next_direction.copy( _tmp_vec3_1 );
			} else if ( closest_face === 4 ) {
				// DAB
				this.points.length = 0;
				this.points.push( d, a, b );
				this.getFaceNormal( d, a, b, _tmp_vec3_1 );
				this.next_direction.copy( _tmp_vec3_1 );
			}
        },

        containsOrigin: function() {
			var a = this.points[3],
                b = this.points[2],
                c = this.points[1],
                d = this.points[0];

            // Check DCA
            ab.subtractVectors( d.point, a.point );
            ad.subtractVectors( c.point, a.point );
            _tmp_vec3_1.crossVectors( ab, ad );
            if ( _tmp_vec3_1.dot( a.point ) > 0 ) {
                return false;
            }

            // Check CBA
            ab.subtractVectors( c.point, a.point );
            ad.subtractVectors( b.point, a.point );
            _tmp_vec3_1.crossVectors( ab, ad );
            if ( _tmp_vec3_1.dot( a.point ) > 0 ) {
                return false;
            }

            // Check ADB
            ab.subtractVectors( b.point, a.point );
            ad.subtractVectors( d.point, a.point );
            _tmp_vec3_1.crossVectors( ab, ad );
            if ( _tmp_vec3_1.dot( a.point ) > 0 ) {
                return false;
            }

            // Check DCB
            ab.subtractVectors( d.point, c.point );
            ad.subtractVectors( b.point, c.point );
            _tmp_vec3_1.crossVectors( ab, ad );
            if ( _tmp_vec3_1.dot( d.point ) > 0 ) {
                return false;
            }

            return true;
        },

        updateDirection: function() {
            if ( this.points.length === 0 ) {

                this.next_direction.subtractVectors( this.object_b.position, this.object_a.position );

            } else if ( this.points.length === 1 ) {

                this.next_direction.scale( -1 );

            } else if ( this.points.length === 2 ) {

                this.findDirectionFromLine();

            } else if ( this.points.length === 3 ) {

                this.findDirectionFromTriangle();

            } else {

                return this.findDirectionFromTetrahedron();

            }
        }
    };
})();

Goblin.SphereSphere = function( object_a, object_b ) {
	// Cache positions of the spheres
	var position_a = object_a.position,
		position_b = object_b.position;

	// Get the vector between the two objects
	_tmp_vec3_1.subtractVectors( position_b, position_a );
	var distance = _tmp_vec3_1.length();

	// If the distance between the objects is greater than their combined radii
	// then they are not touching, continue processing the other possible contacts
	if ( distance > object_a.shape.radius + object_b.shape.radius ) {
		return;
	}

	// Get a ContactDetails object and fill out it's information
	var contact = Goblin.ObjectPool.getObject( 'ContactDetails' );
	contact.object_a = object_a;
	contact.object_b = object_b;

	// Because we already have the distance (vector magnitude), don't normalize
	// instead we will calculate this value manually
	contact.contact_normal.scaleVector( _tmp_vec3_1, 1 / distance );

	// Calculate contact position
	_tmp_vec3_1.scale( -0.5  );
	contact.contact_point.addVectors( _tmp_vec3_1, position_a );

	// Calculate penetration depth
	contact.penetration_depth = object_a.shape.radius + object_b.shape.radius - distance;

	// Contact points in both objects - in world coordinates at first
	contact.contact_point_in_a.scaleVector( contact.contact_normal, contact.object_a.shape.radius );
	contact.contact_point_in_a.add( contact.object_a.position );
	contact.contact_point_in_b.scaleVector( contact.contact_normal, -contact.object_b.shape.radius );
	contact.contact_point_in_b.add( contact.object_b.position );

	// Find actual contact point
	contact.contact_point.addVectors( contact.contact_point_in_a, contact.contact_point_in_b );
	contact.contact_point.scale( 0.5 );

	// Convert contact_point_in_a and contact_point_in_b to those objects' local frames
	contact.object_a.transform_inverse.transformVector3( contact.contact_point_in_a );
	contact.object_b.transform_inverse.transformVector3( contact.contact_point_in_b );

	contact.restitution = ( object_a.restitution + object_b.restitution ) / 2;
	contact.friction = ( object_a.friction + object_b.friction ) / 2;

	return contact;
};
/**
 * Performs an intersection test between two triangles
 *
 * @method TriangleTriangle
 * @param tri_a {TriangleShape}
 * @param tri_b {TriangleShape}
 */
Goblin.TriangleTriangle = function( tri_a, tri_b ) {
	var dv1_0 = tri_b.classifyVertex( tri_a.a ),
		dv1_1 = tri_b.classifyVertex( tri_a.b ),
		dv1_2 = tri_b.classifyVertex( tri_a.c );

	if (
		(dv1_0 > 0 && dv1_1 > 0 && dv1_2 > 0 ) ||
		(dv1_0 < 0 && dv1_1 < 0 && dv1_2 < 0 )
	)
	{
		// All vertices of tri_a are on the same side of tri_b, no intersection possible
		return null;
	}

	var dv2_0 = tri_a.classifyVertex( tri_b.a ),
		dv2_1 = tri_a.classifyVertex( tri_b.b ),
		dv2_2 = tri_a.classifyVertex( tri_b.c );
	if (
		( dv2_0 > 0 && dv2_1 > 0 && dv2_2 > 0 ) ||
		( dv2_0 < 0 && dv2_1 < 0 && dv2_2 < 0 )
		)
	{
		// All vertices of tri_b are on the same side of tri_a, no intersection possible
		return null;
	}

	var d = new Goblin.Vector3();
	d.crossVectors( tri_a.normal, tri_b.normal );
	d.normalize();

	var pv1_0 = d.dot( tri_a.a ),
		pv1_1 = d.dot( tri_a.b ),
		pv1_2 = d.dot( tri_a.c ),
		pv2_0 = d.dot( tri_b.a ),
		pv2_1 = d.dot( tri_b.b ),
		pv2_2 = d.dot( tri_b.c );

	var aa = tri_a.a,
		ab = tri_a.b,
		ac = tri_a.c,
		ba = tri_b.a,
		bb = tri_b.b,
		bc = tri_b.c;

	var tmp;
	if ( Math.sign( dv1_0 ) === Math.sign( dv1_1 ) ) {
		tmp = dv1_0;
		dv1_0 = dv1_2;
		dv1_2 = tmp;

		tmp = pv1_0;
		pv1_0 = pv1_2;
		pv1_2 = tmp;

		tmp = aa;
		aa = ac;
		ac = tmp;
	} else if ( Math.sign( dv1_0 ) === Math.sign( dv1_2 ) ) {
		tmp = dv1_0;
		dv1_0 = dv1_1;
		dv1_1 = tmp;

		tmp = pv1_0;
		pv1_0 = pv1_1;
		pv1_1 = tmp;

		tmp = aa;
		aa = ab;
		ab = tmp;
	}

	if ( Math.sign( dv2_0 ) === Math.sign( dv2_1 ) ) {
		tmp = dv2_0;
		dv2_0 = dv2_2;
		dv2_2 = tmp;

		tmp = pv2_0;
		pv2_0 = pv2_2;
		pv2_2 = tmp;

		tmp = ba;
		ba = bc;
		bc = tmp;
	} else if ( Math.sign( dv2_0 ) === Math.sign( dv2_2 ) ) {
		tmp = dv2_0;
		dv2_0 = dv2_1;
		dv2_1 = tmp;

		tmp = pv2_0;
		pv2_0 = pv2_1;
		pv2_1 = tmp;

		tmp = ba;
		ba = bb;
		bb = tmp;
	}

	var a_t1 = pv1_0 + ( pv1_1 - pv1_0 ) * ( dv1_0 / ( dv1_0 - dv1_1 ) ),
		a_t2 = pv1_0 + ( pv1_2 - pv1_0 ) * ( dv1_0 / ( dv1_0 - dv1_2 ) ),
		b_t1 = pv2_0 + ( pv2_1 - pv2_0 ) * ( dv2_0 / ( dv2_0 - dv2_1 ) ),
		b_t2 = pv2_0 + ( pv2_2 - pv2_0 ) * ( dv2_0 / ( dv2_0 - dv2_2 ) );

	if ( a_t1 > a_t2 ) {
		tmp = a_t1;
		a_t1 = a_t2;
		a_t2 = tmp;

		tmp = pv1_1;
		pv1_1 = pv1_2;
		pv1_2 = tmp;

		tmp = ab;
		ab = ac;
		ac = tmp;
	}
	if ( b_t1 > b_t2 ) {
		tmp = b_t1;
		b_t1 = b_t2;
		b_t2 = tmp;

		tmp = pv2_1;
		pv2_1 = pv2_2;
		pv2_2 = tmp;

		tmp = bb;
		bb = bc;
		bc = tmp;
	}

	if (
		( a_t1 >= b_t1 && a_t1 <= b_t2 ) ||
		( a_t2 >= b_t1 && a_t2 <= b_t2 ) ||
		( b_t1 >= a_t1 && b_t1 <= a_t2 ) ||
		( b_t2 >= a_t1 && b_t2 <= a_t2 )
	) {
		//console.log( 'contact' );

		var contact = Goblin.ObjectPool.getObject( 'ContactDetails' );

		contact.object_a = tri_a;
		contact.object_b = tri_b;

        //debugger;

        var best_a_a = new Goblin.Vector3(),
            best_a_b = new Goblin.Vector3(),
            best_a_n = new Goblin.Vector3(),
            best_b_a = new Goblin.Vector3(),
            best_b_b = new Goblin.Vector3(),
            best_b_n = new Goblin.Vector3(),
            has_a = false,
            has_b = false;

        if ( tri_b.classifyVertex( aa ) <= 0 ) {
            // aa is penetrating tri_b
            has_a = true;
            Goblin.GeometryMethods.findClosestPointInTriangle( aa, ba, bb, bc, best_a_b );
            best_a_a.copy( aa );
            best_a_n.copy( tri_b.normal );
            best_a_n.scale( -1 );
        } else {
            if ( a_t1 >= b_t1 && a_t1 <= b_t2 ) {
                // ab is penetrating tri_b
                has_a = true;
                Goblin.GeometryMethods.findClosestPointInTriangle( ab, ba, bb, bc, best_a_b );
                best_a_a.copy( ab );
                best_a_n.copy( tri_b.normal );
                best_a_n.scale( -1 );
            } else if ( a_t2 >= b_t1 && a_t2 <= b_t2 ) {
                // ac is penetration tri_b
                has_a = true;
                Goblin.GeometryMethods.findClosestPointInTriangle( ac, ba, bb, bc, best_a_b );
                best_a_a.copy( ac );
                best_a_n.copy( tri_b.normal );
                best_a_n.scale( -1 );
            }
        }

        if ( tri_a.classifyVertex( ba ) <= 0 ) {
            // ba is penetrating tri_a
            has_b = true;
            Goblin.GeometryMethods.findClosestPointInTriangle( ba, aa, ab, ac, best_b_a );
            best_b_b.copy( ba );
            best_b_n.copy( tri_a.normal );
        } else {
            if ( b_t1 >= a_t1 && b_t1 <= a_t2 ) {
                // bb is penetrating tri_a
                has_b = true;
                Goblin.GeometryMethods.findClosestPointInTriangle( bb, aa, ab, ac, best_b_a );
                best_b_b.copy( bb );
                best_b_n.copy( tri_a.normal );
            } else if ( b_t2 >= a_t1 && b_t2 <= a_t2 ) {
                // bc is penetration tri_a
                has_b = true;
                Goblin.GeometryMethods.findClosestPointInTriangle( bc, aa, ab, ac, best_b_a );
                best_b_b.copy( bc );
                best_b_n.copy( tri_a.normal );
            }
        }

        _tmp_vec3_1.subtractVectors( best_a_a, best_a_b );
        _tmp_vec3_2.subtractVectors( best_b_a, best_b_b );
        if ( !has_b || ( has_a && _tmp_vec3_1.lengthSquared() < _tmp_vec3_2.lengthSquared() ) ) {
            contact.contact_point_in_a.copy( best_a_a );
            contact.contact_point_in_b.copy( best_a_b );
            contact.contact_normal.copy( best_a_n );
        } else {
            contact.contact_point_in_a.copy( best_b_a );
            contact.contact_point_in_b.copy( best_b_b );
            contact.contact_normal.copy( best_b_n );
        }
        _tmp_vec3_1.subtractVectors( contact.contact_point_in_a, contact.contact_point_in_b );
        contact.penetration_depth = _tmp_vec3_1.length();
        //console.log( 'depth', contact.penetration_depth );
        //console.log( contact.contact_normal );
		//if (contact.penetration_depth > 1) debugger;



		contact.contact_point.addVectors( contact.contact_point_in_a, contact.contact_point_in_b );
		contact.contact_point.scale( 0.5 );

		/*m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0xFF0000 }) );
		m.position.copy( contact.contact_point_in_a );
		exampleUtils.scene.add( m );

        m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0x0000FF }) );
        m.position.copy( contact.contact_point_in_b );
        exampleUtils.scene.add( m );

        m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0x00FF00 }) );
        m.position.copy( contact.contact_point );
        exampleUtils.scene.add( m );*/

		return contact;
	}

	/*var m;
	_tmp_vec3_1.scaleVector( d, a_t1 / d.length() );
	m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0xDDAAAA }) );
	m.position.copy( _tmp_vec3_1 );
	exampleUtils.scene.add( m );

	_tmp_vec3_1.scaleVector( d, a_t2 / d.length() );
	m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0xDDAAAA }) );
	m.position.copy( _tmp_vec3_1 );
	exampleUtils.scene.add( m );

	_tmp_vec3_1.scaleVector( d, b_t1 / d.length() );
	m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0xAAAADD }) );
	m.position.copy( _tmp_vec3_1 );
	exampleUtils.scene.add( m );

	_tmp_vec3_1.scaleVector( d, b_t2 / d.length() );
	m = new THREE.Mesh( new THREE.SphereGeometry( 0.05 ), new THREE.MeshBasicMaterial({ color: 0xAAAADD }) );
	m.position.copy( _tmp_vec3_1 );
	exampleUtils.scene.add( m );*/

	return null;
};

/**
* adds a drag force to associated objects
*
* @class DragForce
* @extends ForceGenerator
* @constructor
*/
Goblin.DragForce = function( drag_coefficient, squared_drag_coefficient ) {
	/**
	* drag coefficient
	*
	* @property drag_coefficient
	* @type {Number}
	* @default 0
	*/
	this.drag_coefficient = drag_coefficient || 0;

	/**
	* drag coefficient
	*
	* @property drag_coefficient
	* @type {Number}
	* @default 0
	*/
	this.squared_drag_coefficient = squared_drag_coefficient || 0;

	/**
	* whether or not the force generator is enabled
	*
	* @property enabled
	* @type {Boolean}
	* @default true
	*/
	this.enabled = true;

	/**
	* array of objects affected by the generator
	*
	* @property affected
	* @type {Array}
	* @default []
	* @private
	*/
	this.affected = [];
};
Goblin.DragForce.prototype.enable = Goblin.ForceGenerator.prototype.enable;
Goblin.DragForce.prototype.disable = Goblin.ForceGenerator.prototype.disable;
Goblin.DragForce.prototype.affect = Goblin.ForceGenerator.prototype.affect;
Goblin.DragForce.prototype.unaffect = Goblin.ForceGenerator.prototype.unaffect;
/**
* applies force to the associated objects
*
* @method applyForce
*/
Goblin.DragForce.prototype.applyForce = function() {
	if ( !this.enabled ) {
		return;
	}

	var i, affected_count, object, drag,
		force = _tmp_vec3_1;

	for ( i = 0, affected_count = this.affected.length; i < affected_count; i++ ) {
		object = this.affected[i];

		force.copy( object.linear_velocity );

		// Calculate the total drag coefficient.
		drag = force.length();
		drag = ( this.drag_coefficient * drag ) + ( this.squared_drag_coefficient * drag * drag );

		// Calculate the final force and apply it.
		force.normalize();
		force.scale( -drag );
		object.applyForce( force  );
	}
};
/**
 * @class BoxShape
 * @param half_width {Number} half width of the cube ( X axis )
 * @param half_height {Number} half height of the cube ( Y axis )
 * @param half_depth {Number} half depth of the cube ( Z axis )
 * @constructor
 */
Goblin.BoxShape = function( half_width, half_height, half_depth ) {
	/**
	 * Half width of the cube ( X axis )
	 *
	 * @property half_width
	 * @type {Number}
	 */
	this.half_width = half_width;

	/**
	 * Half height of the cube ( Y axis )
	 *
	 * @property half_height
	 * @type {Number}
	 */
	this.half_height = half_height;

	/**
	 * Half width of the cube ( Z axis )
	 *
	 * @property half_height
	 * @type {Number}
	 */
	this.half_depth = half_depth;

    this.aabb = new Goblin.AABB();
    this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.BoxShape.prototype.calculateLocalAABB = function( aabb ) {
    aabb.min.x = -this.half_width;
    aabb.min.y = -this.half_height;
    aabb.min.z = -this.half_depth;

    aabb.max.x = this.half_width;
    aabb.max.y = this.half_height;
    aabb.max.z = this.half_depth;
};

Goblin.BoxShape.prototype.getInertiaTensor = function( mass ) {
	var height_squared = this.half_height * this.half_height * 4,
		width_squared = this.half_width * this.half_width * 4,
		depth_squared = this.half_depth * this.half_depth * 4,
		element = 0.0833 * mass;
	return new Goblin.Matrix3(
		element * ( height_squared + depth_squared ), 0, 0,
		0, element * ( width_squared + depth_squared ), 0,
		0, 0, element * ( height_squared + width_squared )
	);
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.BoxShape.prototype.findSupportPoint = function( direction, support_point ) {
	/*
	support_point = [
		sign( direction.x ) * half_width,
		sign( direction.y ) * half_height,
		sign( direction.z ) * half_depth
	]
	*/

	// Calculate the support point in the local frame
	if ( direction.x < 0 ) {
		support_point.x = -this.half_width;
	} else {
		support_point.x = this.half_width;
	}

	if ( direction.y < 0 ) {
		support_point.y = -this.half_height;
	} else {
		support_point.y = this.half_height;
	}

	if ( direction.z < 0 ) {
		support_point.z = -this.half_depth;
	} else {
		support_point.z = this.half_depth;
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3} end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.BoxShape.prototype.rayIntersect = (function(){
	var direction = new Goblin.Vector3(),
		tmin, tmax,
		axis, ood, t1, t2, extent;

	return function( start, end ) {
		tmin = 0;

		direction.subtractVectors( end, start );
		tmax = direction.length();
		direction.scale( 1 / tmax ); // normalize direction

		for ( var i = 0; i < 3; i++ ) {
			axis = i === 0 ? 'x' : ( i === 1 ? 'y' : 'z' );
			extent = ( i === 0 ? this.half_width : (  i === 1 ? this.half_height : this.half_depth ) );

			if ( Math.abs( direction[axis] ) < Goblin.EPSILON ) {
				// Ray is parallel to axis
				if ( start[axis] < -extent || start[axis] > extent ) {
					return null;
				}
			}

            ood = 1 / direction[axis];
            t1 = ( -extent - start[axis] ) * ood;
            t2 = ( extent - start[axis] ) * ood;
            if ( t1 > t2  ) {
                ood = t1; // ood is a convenient temp variable as it's not used again
                t1 = t2;
                t2 = ood;
            }

            // Find intersection intervals
            tmin = Math.max( tmin, t1 );
            tmax = Math.min( tmax, t2 );

            if ( tmin > tmax ) {
                return null;
            }
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.t = tmin;
		intersection.point.scaleVector( direction, tmin );
		intersection.point.add( start );

		// Find face normal
        var max = Infinity;
		for ( i = 0; i < 3; i++ ) {
			axis = i === 0 ? 'x' : ( i === 1 ? 'y' : 'z' );
			extent = ( i === 0 ? this.half_width : (  i === 1 ? this.half_height : this.half_depth ) );
			if ( extent - Math.abs( intersection.point[axis] ) < max ) {
				intersection.normal.x = intersection.normal.y = intersection.normal.z = 0;
				intersection.normal[axis] = intersection.point[axis] < 0 ? -1 : 1;
				max = extent - Math.abs( intersection.point[axis] );
			}
		}

		return intersection;
	};
})();
/**
 * @class CloudShape
 * @param data {Array<Number>} - distance to surface data
 * @param dims {Array<Number>} - dimensions of the data cloud
 * @constructor
 */
Goblin.CloudShape = function( data,dims,scales ) {
	this.data = data;
	this.dims = dims;
	this.scales = scales;
	this.dim0  = dims[0];
	this.dim1  = dims[1];
	this.dim10 = dim0*dim1;
	this.dim2  = dims[2];

	this.mass  = [0,0,0];
	this.tree = new OctereTree( data,dims );
	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );	
};


Goblin.CloudShape.prototype.update = function() {
	this.tree.update();
	let mass = 0;
	let massx = 1; // make sure we don't start at 0  (assume (1,1,1)/1 ....) * scale
	let massy = 1;
	let massz = 1;
	const absMass = 1;
	const midx = this.dim0/2;
	const midy = this.dim1/2;
	const midz = this.dim2/2;
	for( let z = 0; z < this.dim2; z++ ) {
		const zofs = z * this.dim10;
		for( let y = 0; y < this.dim1; y++ ) {
			const yofs = y*this.dim0;
			for( let x = 0; x < this.dim0; x++ ){		
				const ofs = zofs+yofs+x;
				if( data[ofs] < 0 ) {
					absmass++; // total number of points collected.
					if( this.data[ofs] < -1 ) {
						mass++;
						massx += Math.abs(x-midx);
						massy += Math.abs(y-midy);
						massz += Math.abs(z-midz);
					} else {
						const volume = (1-this.data[ofs])/2; // 0 to -1 ... 0=1/2  1 = 1  and 0-1 is a linear scale between 0.5 and 1.
						mass += volume; // some fraction of the block is full.
						massx += Math.abs(x-midx) * volume;
						massy += Math.abs(y-midy) * volume;
						massz += Math.abs(z-midz) * volume;
					}
				}
			}
		}
	}
	
	// inertia tensor (basically)  minus the elemental type mass...
	this.mass[0] = this.scales[0] * massx / absMass;
	this.mass[1] = this.scales[1] * massy / absMass;
	this.mass[2] = this.scales[2] * massz / absMass;

}

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.CloudShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = -(this.dims[0]*dims.scales[0])/2
	aabb.min.y = -(this.dims[1]*dims.scales[1])/2
	aabb.min.z = -(this.dims[2]*dims.scales[2])/2;
	aabb.max.x = -aabb.min.x;
	aabb.max.y = -aabb.min.y;
	aabb.max.z = -aabb.min.z;
};

Goblin.CloudShape.prototype.getInertiaTensor = function( mass ) {
	//var element = 0.4 * mass * this.radius * this.radius;
	return new Goblin.Matrix3(
		mass*this.mass[0], 0, 0,
		0, mass*this.mass[1], 0,
		0, 0, mass*this.mass[2]
	);
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in local coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.CloudShape.prototype.findSupportPoint = (function(){
	const temp = new Goblin.Vector3();

	return function( direction, support_point ) {
		temp.normalizeVector( direction );
		// from my 'origin' (CoG)
				
		support_point.scaleVector( temp, this.radius );
	};
})();

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.CloudShape.prototype.rayIntersect = (function(){
	const direction = new Goblin.Vector3();
	let  length;

	return function( start, end ) {
		direction.subtractVectors( end, start );
		length = direction.length();
		direction.scale( 1 / length  ); // normalize direction

		var a = start.dot( direction ),
		    b = start.dot( start ) - this.radius * this.radius;

		// if ray starts outside of sphere and points away, exit
		if ( a >= 0 && b >= 0 ) {
			return null;
		}

		var discr = a * a - b;

		// Check for ray miss
		if ( discr < 0 ) {
			return null;
		}

		// ray intersects, find closest intersection point
		var discr_sqrt = Math.sqrt( discr ),
			t = -a - discr_sqrt;
		if ( t < 0 ) {
			t = -a + discr_sqrt;
		}

		// verify the segment intersects
		if ( t > length ) {
			return null;
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.point.scaleVector( direction, t );
		intersection.t = t;
		intersection.point.add( start );

        intersection.normal.normalizeVector( intersection.point );

		return intersection;
	};
})();

//--------------- Spoctree/Octere Tree ------------------------


/* 
 *
 
 levels
 		(1 << tree.depth - 1)
    0 = 1 point 0    (half_width*1)  (depth 0)
    	1 point 1    (depth 1)
        1 point 3    (depth 2)
        1 point 7    (depth 3)
        1 point 15   (depth 4)
        1 point 31   (depth 5) 
        
        (  N = (1<<(tree.depth-this.level)-1), N2 = N + (1<<this.level) )
    1 = 2 point (0, ,2) ((depth 1)width of 3)
        2 point (1, ,5) ((depth 2)width of 4/6)
        2 point (3, ,11) (depth 3)(width of 5/12)
        2 point (7, ,23) (depth 4)(width of 6/24)
        2 point (15, ,47)
                
	( N = ( 1 << ( tree.depth - this.level) - 1 ), step = N + 1 << (1+tree.depth-this.level) , count = 1<<this.level
    2 = 4 point (0,2, ,4,6)  ((depth 2) width of 4/6)
        4 point (1,5, ,9,13) (depth 3) width of 
        

	( N = ( 1 << ( tree.depth - this.level) - 1 ), step = N + 1 << (1+tree.depth-this.level) , count = 1<<this.level
    3 = 8 points  (1<<node.level)
    	
    	( 0, 2, 4, 6,  ,8, 10, 12, 14 )  (depth 3)
	( 1, 5, 9, 13,  , 17, 21, 25, 29 ) (depth 4)   

    amazingly - is a binary number progression :)
     1,3,7,15, .. what's the next number?
     
     cubed. 2*2*2 (8) 3*3*3(27) 4*4*4(64)
     
*/

function OctereTree(data,dims_) {
	if( this instanceof "OctereTree" ) throw new Error( "Please do not call this with new." );
        

function maxInt( x ) { 	for( let n = 0; n < 32; n++ ) if( x & ( 1 << 31-n) ) return 32-n; }

// basically a yardstick that converts a coordinate at a depth to an index.
function octRuler( x, depth ) {
	const stepx = 1 << ( depth);
        const Nx = (1 << ( depth -1 ))-1;
        return ( x*stepx + Nx );
}

const octEntResult = [0,0,0];
function octEnt( x, y, z, level, depth ) {
	const stepx = 1 << ( depth-level);
        const Nx = (1 << ( depth - level -1 ))-1;
        octEntResult[0] = ( x*stepx + Nx ); octEntResult[1] = (y*stepx+Nx); octEntResult[2] = (z*stepx+Nx);
        return octEntResult;
}

	
const depths = [maxInt(dims[0]),maxInt(dims[1]),maxInt(dims[2])];

// max depths
const depth = (depths[0]>depths[1])
		?(depths[0]>depths[2])
			?depths[0]
			:(depths[1]>depths[2])
			?depths[1]
			:depths[2]
      :(depths[1]>depths[2])
       ?depth1[0]:depths[2];

const dims = dims_;
const octBits = new Uint32Array( dims[0]*dims[1]*dims[2]/32 );


function octeretree() {
        let level = depth-1;
        
        for( ; level >= 0; level-- ) {
		xsize = octRuler( 1, level );
        	for( let z = 0; z < xsize && z < dims[2]; z++ ) 
                	for( let y = 0; y < xsize && y < dims[1]; y++ )
	                	for( let x = 0; x < xsize && x < dims[0]; x++ ) {
					// ent is temporary... 
                        		let ent = octEnt( x, y, z, level, depth );
                                       	let index = ent[0]+ent[1]*dims[0] + ent[2]*dims[0]*dims[1];
                                        let bits = octBits[(index>>5)|0];
                                        const bit = index & 0x1f;
                                        let newIndex, newBit;
					if( data[index] < 0 ) {
                                        	bits |= 1 << (index & 0x1f);
                                        }
                                        if( !(bits & ( 1 << index & 0x1f ) ) )
                                        	
                                        // this is already solid because of its own point.
                                       	level++;
                                	if( level == depth-1 ) {
	                                        	ent = octEnt( x*2, y*2, z*2, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}
	                                        	else { ent = octEnt( x*2+1, y*2, z*2, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}
                	                        	else { ent = octEnt( x*2, y*2+1, z*2, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                	                	bits |= bit;
                                        		}
	                                        	else { ent = octEnt( x*2+1, y*2+1, z*2, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}

	                                        	else { ent = octEnt( x*2, y*2, z*2+1, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}
	                                        	else { ent = octEnt( x*2+1, y*2, z*2+1, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}
                	                        	else { ent = octEnt( x*2, y*2+1, z*2+1, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                	                	bits |= bit;
                                        		}
	                                        	else { ent = octEnt( x*2+1, y*2+1, z*2+1, level, depth );
							if( data[index = ent[0]+ent[1]*dims[0]+ent[2]*dims[0]*dims[1]] < 0 ) {
                                                        	bits |= bit;
                                                	}
                                                        }}}}}}}
                                        }else {
	                                        	ent = octEnt( x*2, y*2, z*2, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}
	                                        	else { ent = octEnt( x*2+1, y*2, z*2, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}
                	                        	else { ent = octEnt( x*2, y*2+1, z*2, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                	                	bits |= 1 << (index & 0x1f);
                                        		}
	                                        	else { ent = octEnt( x*2+1, y*2+1, z*2, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}

	                                        	else { ent = octEnt( x*2, y*2, z*2+1, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}
	                                        	else { ent = octEnt( x*2+1, y*2, z*2+1, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}
                	                        	else { ent = octEnt( x*2, y*2+1, z*2+1, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                	                	bits |= 1 << (index & 0x1f);
                                        		}
	                                        	else { ent = octEnt( x*2+1, y*2+1, z*2+1, level, depth );
                                                        newIndex = ent[0] + ent[1]*dims[0] + ent[2]*dims[0]*dims[1]; newBit = newIndex & 0x1f; newIndex >>= 5;
							if( octBits[newIndex] & newBit ) {
                                                        	bits |= 1 << (index & 0x1f);
                                                	}
                                                        }}}}}}}
                                        }
                                       	level--;
                                        octBits[index>>5] = bits;
        			}
                		
        }
        
        
        
	function node() {
		this.value = 0.0;
                this.level = 0;
	        this.children = [ null,null,null,null
        	                , null,null,null,null ];
	}

	


}

const octIndex = [ [0,0,0], [1,0,0], [0,1,0], [1,1,0], [0,0,1], [1,0,1], [0,1,1], [1,1,1] ];

// indexed by [normalBits] [octant collided]
const octOrder = [ [0,1,2,4, 7,6,5,3]
		 , [1,0,3,5, 6,4,7,2]
                 , [2,3,0,6, 5,4,7,1]
                 , [3,1,2,7, 4,6,5,0]
                 , [4,6,5,0, 3,1,2,7]
                 , [5,4,7,1, 2,3,0,6]
                 , [6,4,7,2, 1,0,3,5]
                 , [7,6,5,3, 0,1,2,4]
                 ];
                 

function pointDistance( p, o, n ) {
// array of values version.
	// length( o-p  - ( o-p)dot n ) n ) 
	//
	var t = [o[0]-p[0],o[1]-p[1],o[2]-p[2] ];
	var dn = t[0]*n[0]+t[1]*n[1]+t[2]*n[2];
	n[0] *= dn;
	n[1] *= dn;
	n[2] *= dn;
	return Math.sqrt( n[0]*n[0]+n[1]*n[1]+n[2]+n[2] );
}
// three.js vector version
function pointDistanceT( p, o, n ) {
	// length( o-p  - ( o-p)dot n ) n ) 
	//
	var t = new THREE.Vector3();
	t.sub( o, p );
	var dn = t.dot(n);
	n.multiplyScalar(dn);
	return n.length();
}


function dirBits(n) {
	return ((n[0]>0)?0:1) + ((n[1]>0)?0:2) + ((n[2]>0)?0:4);
}

octeretree.prototype.raycast = function( o, n ) {
	
	var dir = dirBits(n);
        var level = 0;
        let size = octRuler( 1, depth-level );
        
        var r = checkNode( 0, 0, 0 );
        console.log( "Hit at:", r );
        return r;
        
        function checkNode(x,y,z) {
	        let base=octEnt( x, y, z, level, depth );
        
		let r = 1.414*(depth-level);
	        let d = pointDistance( base, o, n );
        	if( d < r ) {
	        	let index = base[0]+base[1]*dims[0]+base[2]*dims[1]*dims[0];
        
	        	if(octBits[index>>5] & index&0x1f) {
        			const test = octOrder[dir];
                	        level++;
                        	for( let test = 0; test < 8; test++ ) {
                                	const i = octIndex[test];
                                        let r = checkNode( x*2+i[0], y*2+i[1], z*2+i[2] );
                                        if( r ) {
                                        	//r.push( [x,y,z] );
	                                        return r<<3+test;
                                        }
                        	}
                        }
	        }
		return 0;
        }
        
}

return new octeretree( data, dims );

};




/**
 * @class CompoundShape
 * @constructor
 */
Goblin.CompoundShape = function() {
	this.child_shapes = [];

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Adds the child shape at `position` and `rotation` relative to the compound shape
 *
 * @method addChildShape
 * @param shape
 * @param position
 * @param rotation
 */
Goblin.CompoundShape.prototype.addChildShape = function( shape, position, rotation ) {
	this.child_shapes.push( new Goblin.CompoundShapeChild( shape, position, rotation ) );
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.CompoundShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = aabb.min.y = aabb.min.z = Infinity;
	aabb.max.x = aabb.max.y = aabb.max.z = -Infinity;

	var i, shape;

	for ( i = 0; i < this.child_shapes.length; i++ ) {
		shape = this.child_shapes[i];

		aabb.min.x = Math.min( aabb.min.x, shape.aabb.min.x );
		aabb.min.y = Math.min( aabb.min.y, shape.aabb.min.y );
		aabb.min.z = Math.min( aabb.min.z, shape.aabb.min.z );

		aabb.max.x = Math.max( aabb.max.x, shape.aabb.max.x );
		aabb.max.y = Math.max( aabb.max.y, shape.aabb.max.y );
		aabb.max.z = Math.max( aabb.max.z, shape.aabb.max.z );
	}
};

Goblin.CompoundShape.prototype.getInertiaTensor = function( mass ) {
	var tensor = new Goblin.Matrix3(),
		j = new Goblin.Matrix3(),
		i,
		child,
		child_tensor;
	tensor.identity();

	mass /= this.child_shapes.length;

	// Holds center of current tensor
	_tmp_vec3_1.x = _tmp_vec3_1.y = _tmp_vec3_1.z = 0;

	for ( i = 0; i < this.child_shapes.length; i++ ) {
		child = this.child_shapes[i];

		_tmp_vec3_1.subtract( child.position );

		j.e00 = mass * -( _tmp_vec3_1.y * _tmp_vec3_1.y + _tmp_vec3_1.z * _tmp_vec3_1.z );
		j.e10 = mass * _tmp_vec3_1.x * _tmp_vec3_1.y;
		j.e20 = mass * _tmp_vec3_1.x * _tmp_vec3_1.z;

		j.e01 = mass * _tmp_vec3_1.x * _tmp_vec3_1.y;
		j.e11 = mass * -( _tmp_vec3_1.x * _tmp_vec3_1.x + _tmp_vec3_1.z * _tmp_vec3_1.z );
		j.e21 = mass * _tmp_vec3_1.y * _tmp_vec3_1.z;

		j.e02 = mass * _tmp_vec3_1.x * _tmp_vec3_1.z;
		j.e12 = mass * _tmp_vec3_1.y * _tmp_vec3_1.z;
		j.e22 = mass * -( _tmp_vec3_1.x * _tmp_vec3_1.x + _tmp_vec3_1.y * _tmp_vec3_1.y );

		_tmp_mat3_1.fromMatrix4( child.transform );
		child_tensor = child.shape.getInertiaTensor( mass );
		_tmp_mat3_1.transposeInto( _tmp_mat3_2 );
		_tmp_mat3_1.multiply( child_tensor );
		_tmp_mat3_1.multiply( _tmp_mat3_2 );

		tensor.e00 += _tmp_mat3_1.e00 + j.e00;
		tensor.e10 += _tmp_mat3_1.e10 + j.e10;
		tensor.e20 += _tmp_mat3_1.e20 + j.e20;
		tensor.e01 += _tmp_mat3_1.e01 + j.e01;
		tensor.e11 += _tmp_mat3_1.e11 + j.e11;
		tensor.e21 += _tmp_mat3_1.e21 + j.e21;
		tensor.e02 += _tmp_mat3_1.e02 + j.e02;
		tensor.e12 += _tmp_mat3_1.e12 + j.e12;
		tensor.e22 += _tmp_mat3_1.e22 + j.e22;
	}

	return tensor;
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property ray_start {vec3} start point of the segment
 * @property ray_end {vec3} end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.CompoundShape.prototype.rayIntersect = (function(){
	var tSort = function( a, b ) {
		if ( a.t < b.t ) {
			return -1;
		} else if ( a.t > b.t ) {
			return 1;
		} else {
			return 0;
		}
	};
	return function( ray_start, ray_end ) {
		var intersections = [],
			local_start = new Goblin.Vector3(),
			local_end = new Goblin.Vector3(),
			intersection,
			i, child;

		for ( i = 0; i < this.child_shapes.length; i++ ) {
			child = this.child_shapes[i];

			child.transform_inverse.transformVector3Into( ray_start, local_start );
			child.transform_inverse.transformVector3Into( ray_end, local_end );

			intersection = child.shape.rayIntersect( local_start, local_end );
			if ( intersection != null ) {
				intersection.object = this; // change from the shape to the body
				child.transform.transformVector3( intersection.point ); // transform child's local coordinates to the compound's coordinates
				intersections.push( intersection );
			}
		}

		intersections.sort( tSort );
		return intersections[0] || null;
	};
})();
/**
 * @class CompoundShapeChild
 * @constructor
 */
Goblin.CompoundShapeChild = function( shape, position, rotation ) {
	this.shape = shape;

	this.position = new Goblin.Vector3( position.x, position.y, position.z );
	this.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );

	this.transform = new Goblin.Matrix4();
	this.transform_inverse = new Goblin.Matrix4();
	this.transform.makeTransform( this.rotation, this.position );
	this.transform.invertInto( this.transform_inverse );

	this.aabb = new Goblin.AABB();
	this.aabb.transform( this.shape.aabb, this.transform );
};
/**
 * @class ConeShape
 * @param radius {Number} radius of the cylinder
 * @param half_height {Number} half height of the cylinder
 * @constructor
 */
Goblin.ConeShape = function( radius, half_height ) {
	/**
	 * radius of the cylinder
	 *
	 * @property radius
	 * @type {Number}
	 */
	this.radius = radius;

	/**
	 * half height of the cylinder
	 *
	 * @property half_height
	 * @type {Number}
	 */
	this.half_height = half_height;

    this.aabb = new Goblin.AABB();
    this.calculateLocalAABB( this.aabb );

    /**
     * sin of the cone's angle
     *
     * @property _sinagle
     * @type {Number}
     * @private
     */
	this._sinangle = this.radius / Math.sqrt( this.radius * this.radius + Math.pow( 2 * this.half_height, 2 ) );

    /**
     * cos of the cone's angle
     *
     * @property _cosangle
     * @type {Number}
     * @private
     */
    this._cosangle = Math.cos( Math.asin( this._sinangle ) );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.ConeShape.prototype.calculateLocalAABB = function( aabb ) {
    aabb.min.x = aabb.min.z = -this.radius;
    aabb.min.y = -this.half_height;

    aabb.max.x = aabb.max.z = this.radius;
    aabb.max.y = this.half_height;
};

Goblin.ConeShape.prototype.getInertiaTensor = function( mass ) {
	var element = 0.1 * mass * Math.pow( this.half_height * 2, 2 ) + 0.15 * mass * this.radius * this.radius;

	return new Goblin.Matrix3(
		element, 0, 0,
		0, 0.3 * mass * this.radius * this.radius, 0,
		0, 0, element
	);
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.ConeShape.prototype.findSupportPoint = function( direction, support_point ) {
	// Calculate the support point in the local frame
	//var w = direction - ( direction.y )
	var sigma = Math.sqrt( direction.x * direction.x + direction.z * direction.z );

	if ( direction.y > direction.length() * this._sinangle ) {
		support_point.x = support_point.z = 0;
		support_point.y = this.half_height;
	} else if ( sigma > 0 ) {
		var r_s = this.radius / sigma;
		support_point.x = r_s * direction.x;
		support_point.y = -this.half_height;
		support_point.z = r_s * direction.z;
	} else {
		support_point.x = support_point.z = 0;
		support_point.y = -this.half_height;
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.ConeShape.prototype.rayIntersect = (function(){
    var direction = new Goblin.Vector3(),
        length,
        p1 = new Goblin.Vector3(),
        p2 = new Goblin.Vector3(),
		normal1 = new Goblin.Vector3(),
		normal2 = new Goblin.Vector3();

    return function( start, end ) {
        direction.subtractVectors( end, start );
        length = direction.length();
        direction.scale( 1 / length  ); // normalize direction

        var t1, t2;

        // Check for intersection with cone base
		p1.x = p1.y = p1.z = 0;
        t1 = this._rayIntersectBase( start, end, p1, normal1 );

        // Check for intersection with cone shape
		p2.x = p2.y = p2.z = 0;
        t2 = this._rayIntersectCone( start, direction, length, p2, normal2 );

        var intersection;

        if ( !t1 && !t2 ) {
            return null;
        } else if ( !t2 || ( t1 &&  t1 < t2 ) ) {
            intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
            intersection.object = this;
			intersection.t = t1;
            intersection.point.copy( p1 );
			intersection.normal.copy( normal1 );
            return intersection;
        } else if ( !t1 || ( t2 && t2 < t1 ) ) {
            intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
            intersection.object = this;
			intersection.t = t2;
            intersection.point.copy( p2 );
			intersection.normal.copy( normal2 );
            return intersection;
        }

        return null;
    };
})();

Goblin.ConeShape.prototype._rayIntersectBase = (function(){
    var _normal = new Goblin.Vector3( 0, -1, 0 ),
        ab = new Goblin.Vector3(),
        _start = new Goblin.Vector3(),
        _end = new Goblin.Vector3(),
        t;

    return function( start, end, point, normal ) {
        _start.x = start.x;
        _start.y = start.y + this.half_height;
        _start.z = start.z;

        _end.x = end.x;
        _end.y = end.y + this.half_height;
        _end.z = end.z;

        ab.subtractVectors( _end, _start );
        t = -_normal.dot( _start ) / _normal.dot( ab );

        if ( t < 0 || t > 1 ) {
            return null;
        }

        point.scaleVector( ab, t );
        point.add( start );

        if ( point.x * point.x + point.z * point.z > this.radius * this.radius ) {
            return null;
        }

		normal.x = normal.z = 0;
		normal.y = -1;

        return t * ab.length();
    };
})();

/**
 * Checks if a ray segment intersects with the cone definition
 *
 * @method _rayIntersectCone
 * @property start {vec3} start point of the segment
 * @property direction {vec3} normalized direction vector of the segment, from `start`
 * @property length {Number} segment length
 * @property point {vec3} (out) location of intersection
 * @private
 * @return {vec3|null} if the segment intersects, point where the segment intersects the cone, else `null`
 */
Goblin.ConeShape.prototype._rayIntersectCone = (function(){
    var _point = new Goblin.Vector3();

    return function( start, direction, length, point, normal ) {
        var A = new Goblin.Vector3( 0, -1, 0 );

        var AdD = A.dot( direction ),
            cosSqr = this._cosangle * this._cosangle;

        var E = new Goblin.Vector3();
        E.x = start.x;
        E.y = start.y - this.half_height;
        E.z = start.z;

        var AdE = A.dot( E ),
            DdE = direction.dot( E ),
            EdE = E.dot( E ),
            c2 = AdD * AdD - cosSqr,
            c1 = AdD * AdE - cosSqr * DdE,
            c0 = AdE * AdE - cosSqr * EdE,
            dot, t, tmin = null;

        if ( Math.abs( c2 ) >= Goblin.EPSILON ) {
            var discr = c1 * c1 - c0 * c2;
			if ( discr < -Goblin.EPSILON ) {
                return null;
            } else if ( discr > Goblin.EPSILON ) {
                var root = Math.sqrt( discr ),
                    invC2 = 1 / c2;

                t = ( -c1 - root ) * invC2;
                if ( t >= 0 && t <= length ) {
                    _point.scaleVector( direction, t );
                    _point.add( start );
                    E.y = _point.y - this.half_height;
                    dot = E.dot( A );
                    if ( dot >= 0 ) {
                        tmin = t;
                        point.copy( _point );
                    }
                }

                t = ( -c1 + root ) * invC2;
                if ( t >= 0 && t <= length ) {
                    if ( tmin == null || t < tmin ) {
                        _point.scaleVector( direction, t );
                        _point.add( start );
                        E.y = _point.y - this.half_height;
                        dot = E.dot( A );
                        if ( dot >= 0 ) {
                            tmin = t;
                            point.copy( _point );
                        }
                    }
                }

                if ( tmin == null ) {
                    return null;
                }
                tmin /= length;
            } else {
                t = -c1 / c2;
                _point.scaleVector( direction, t );
                _point.add( start );
                E.y = _point.y - this.half_height;
                dot = E.dot( A );
                if ( dot < 0 ) {
                    return null;
                }

                // Verify segment reaches _point
                _tmp_vec3_1.subtractVectors( _point, start );
                if ( _tmp_vec3_1.lengthSquared() > length * length ) {
                    return null;
                }

                tmin = t / length;
                point.copy( _point );
            }
        } else if ( Math.abs( c1 ) >= Goblin.EPSILON ) {
            t = 0.5 * c0 / c1;
            _point.scaleVector( direction, t );
            _point.add( start );
            E.y = _point.y - this.half_height;
            dot = E.dot( A );
            if ( dot < 0 ) {
                return null;
            }
            tmin = t;
            point.copy( _point );
        } else {
            return null;
        }

        if ( point.y < -this.half_height ) {
            return null;
        }

		// Compute normal
		normal.x = point.x;
		normal.y = 0;
		normal.z = point.z;
		normal.normalize();

		normal.x *= ( this.half_height * 2 ) / this.radius;
		normal.y = this.radius / ( this.half_height * 2 );
		normal.z *= ( this.half_height * 2 ) / this.radius;
		normal.normalize();

        return tmin * length;
    };
})();
/**
 * @class ConvexShape
 * @param vertices {Array<vec3>} array of vertices composing the convex hull
 * @constructor
 */
Goblin.ConvexShape = function( vertices ) {
	/**
	 * vertices composing the convex hull
	 *
	 * @property vertices
	 * @type {Array<vec3>}
	 */
	this.vertices = [];

	/**
	 * faces composing the convex hull
	 * @type {Array}
	 */
	this.faces = [];

	/**
	 * the convex hull's volume
	 * @property volume
	 * @type {number}
	 */
	this.volume = 0;

	/**
	 * coordinates of the hull's COM
	 * @property center_of_mass
	 * @type {vec3}
	 */
	this.center_of_mass = new Goblin.Vector3();

	/**
	 * used in computing the convex hull's center of mass & volume
	 * @property _intergral
	 * @type {Float32Array}
	 * @private
	 */
	this._integral = new Float32Array( 10 );

	this.process( vertices );

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

Goblin.ConvexShape.prototype.process = function( vertices ) {
	// Find two points furthest apart on X axis
	var candidates = vertices.slice(),
		min_point = null,
		max_point = null;

	for ( var i = 0; i < candidates.length; i++ ) {
		var vertex = candidates[i];

		if ( min_point == null || min_point.x > vertex.x ) {
			min_point = vertex;
		}
		if ( max_point == null || max_point.x > vertex.x ) {
			max_point = vertex;
		}
	}
	if ( min_point === max_point ) {
		max_point = vertices[0] === min_point ? vertices[1] : vertices[0];
	}

	// Initial 1-simplex
	var point_a = min_point,
		point_b = max_point;
	candidates.splice( candidates.indexOf( point_a ), 1 );
	candidates.splice( candidates.indexOf( point_b ), 1 );

	// Find the point most distant from the line to construct the 2-simplex
	var distance = -Infinity,
		furthest_idx = null,
		candidate, candidate_distance;

	for ( i = 0; i < candidates.length; i++ ) {
		candidate = candidates[i];
		candidate_distance = Goblin.GeometryMethods.findSquaredDistanceFromSegment( candidate, point_a, point_b );
		if ( candidate_distance > distance ) {
			distance = candidate_distance;
			furthest_idx = i;
		}
	}
	var point_c = candidates[furthest_idx];
	candidates.splice( furthest_idx, 1 );

	// Fourth point of the 3-simplex is the one furthest away from the 2-simplex
	_tmp_vec3_1.subtractVectors( point_b, point_a );
	_tmp_vec3_2.subtractVectors( point_c, point_a );
	_tmp_vec3_1.cross( _tmp_vec3_2 ); // _tmp_vec3_1 is the normal of the 2-simplex

	distance = -Infinity;
	furthest_idx = null;

	for ( i = 0; i < candidates.length; i++ ) {
		candidate = candidates[i];
		candidate_distance = Math.abs( _tmp_vec3_1.dot( candidate ) );
		if ( candidate_distance > distance ) {
			distance = candidate_distance;
			furthest_idx = i;
		}
	}
	var point_d = candidates[furthest_idx];
	candidates.splice( furthest_idx, 1 );

	// If `point_d` is on the front side of `abc` then flip to `cba`
	if ( _tmp_vec3_1.dot( point_d ) > 0 ) {
		var tmp_point = point_a;
		point_a = point_c;
		point_c = tmp_point;
	}

	// We have our starting tetrahedron, rejoice
	// Now turn that into a polyhedron
	var polyhedron = new Goblin.GjkEpa.Polyhedron({ points:[
		{ point: point_c }, { point: point_b }, { point: point_a }, { point: point_d }
	]});

	// Add the rest of the points
	for ( i = 0; i < candidates.length; i++ ) {
		// We are going to lie and tell the polyhedron that its closest face is any of the faces which can see the candidate
		polyhedron.closest_face = null;
		for ( var j = 0; j < polyhedron.faces.length; j++ ) {
			if ( polyhedron.faces[j].active === true && polyhedron.faces[j].classifyVertex( { point: candidates[i] } ) > 0 ) {
				polyhedron.closest_face = j;
				break;
			}
		}
		if ( polyhedron.closest_face == null ) {
			// This vertex is already contained by the existing hull, ignore
			continue;
		}
		polyhedron.addVertex( { point: candidates[i] } );
	}

	this.faces = polyhedron.faces.filter(function( face ){
		return face.active;
	});

	// find all the vertices & edges which make up the convex hull
	var convexshape = this;
	
	this.faces.forEach(function( face ){
		// If we haven't already seen these vertices then include them
		var a = face.a.point,
			b = face.b.point,
			c = face.c.point,
			ai = convexshape.vertices.indexOf( a ),
			bi = convexshape.vertices.indexOf( b ),
			ci = convexshape.vertices.indexOf( c );

		// Include vertices if they are new
		if ( ai === -1 ) {
			convexshape.vertices.push( a );
		}
		if ( bi === -1 ) {
			convexshape.vertices.push( b );
		}
		if ( ci === -1 ) {
			convexshape.vertices.push( c );
		}
	});

	this.computeVolume( this.faces );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.ConvexShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = aabb.min.y = aabb.min.z = 0;
	aabb.max.x = aabb.max.y = aabb.max.z = 0;

	for ( var i = 0; i < this.vertices.length; i++ ) {
		aabb.min.x = Math.min( aabb.min.x, this.vertices[i].x );
		aabb.min.y = Math.min( aabb.min.y, this.vertices[i].y );
		aabb.min.z = Math.min( aabb.min.z, this.vertices[i].z );

		aabb.max.x = Math.max( aabb.max.x, this.vertices[i].x );
		aabb.max.y = Math.max( aabb.max.y, this.vertices[i].y );
		aabb.max.z = Math.max( aabb.max.z, this.vertices[i].z );
	}
};

Goblin.ConvexShape.prototype.computeVolume = (function(){
	var origin = { point: new Goblin.Vector3() },
		output = new Float32Array( 6 ),
		macro = function( a, b, c ) {
			var temp0 = a + b,
				temp1 = a * a,
				temp2 = temp1 + b * temp0;

			output[0] = temp0 + c;
			output[1] = temp2 + c * output[0];
			output[2] = a * temp1 + b * temp2 + c * output[1];
			output[3] = output[1] + a * ( output[0] + a );
			output[4] = output[1] + b * ( output[0] + b );
			output[5] = output[1] + c * ( output[0] + c );
		};

	return function( faces ) {
		for ( var i = 0; i < faces.length; i++ ) {
			var face = faces[i],
				v0 = face.a.point,
				v1 = face.b.point,
				v2 = face.c.point;

			var a1 = v1.x - v0.x,
				b1 = v1.y - v0.y,
				c1 = v1.z - v0.z,
				a2 = v2.x - v0.x,
				b2 = v2.y - v0.y,
				c2 = v2.z - v0.z,
				d0 = b1 * c2 - b2 * c1,
				d1 = a2 * c1 - a1 * c2,
				d2 = a1 * b2 - a2 * b1;

			macro( v0.x, v1.x, v2.x );
			var f1x = output[0],
				f2x = output[1],
				f3x = output[2],
				g0x = output[3],
				g1x = output[4],
				g2x = output[5];

			macro( v0.y, v1.y, v2.y );
			var f1y = output[0],
				f2y = output[1],
				f3y = output[2],
				g0y = output[3],
				g1y = output[4],
				g2y = output[5];

			macro( v0.z, v1.z, v2.z );
			var f1z = output[0],
				f2z = output[1],
				f3z = output[2],
				g0z = output[3],
				g1z = output[4],
				g2z = output[5];

			var contributor = face.classifyVertex( origin ) > 0 ? -1 : 1;

			this._integral[0] += contributor * d0 * f1x;
			this._integral[1] += contributor * d0 * f2x;
			this._integral[2] += contributor * d1 * f2y;
			this._integral[3] += contributor * d2 * f2z;
			this._integral[4] += contributor * d0 * f3x;
			this._integral[5] += contributor * d1 * f3y;
			this._integral[6] += contributor * d2 * f3z;
			this._integral[7] += contributor * d0 * ( v0.y * g0x + v1.y * g1x + v2.y * g2x );
			this._integral[8] += contributor * d1 * ( v0.z * g0y + v1.z * g1y + v2.z * g2y );
			this._integral[9] += contributor * d2 * ( v0.x * g0z + v1.x * g1z + v2.x * g2z );
		}

		this._integral[0] *= 1 / 6;
		this._integral[1] *= 1 / 24;
		this._integral[2] *= 1 / 24;
		this._integral[3] *= 1 / 24;
		this._integral[4] *= 1 / 60;
		this._integral[5] *= 1 / 60;
		this._integral[6] *= 1 / 60;
		this._integral[7] *= 1 / 120;
		this._integral[8] *= 1 / 120;
		this._integral[9] *= 1 / 120;

		this.volume = this._integral[0];

		this.center_of_mass.x = this._integral[1] / this.volume;
		this.center_of_mass.y = this._integral[2] / this.volume;
		this.center_of_mass.z = this._integral[3] / this.volume;
	};
})();

Goblin.ConvexShape.prototype.getInertiaTensor = (function(){
	return function( mass ) {
		var	inertia_tensor = new Goblin.Matrix3();
		mass /= this.volume;

		inertia_tensor.e00 = ( this._integral[5] + this._integral[6] ) * mass;
		inertia_tensor.e11 = ( this._integral[4] + this._integral[6] ) * mass;
		inertia_tensor.e22 = ( this._integral[4] + this._integral[5] ) * mass;
		inertia_tensor.e10 = inertia_tensor.e01 = -this._integral[7] * mass; //xy
		inertia_tensor.e21 = inertia_tensor.e12 = -this._integral[8] * mass; //yz
		inertia_tensor.e20 = inertia_tensor.e02 = -this._integral[9] * mass; //xz

		inertia_tensor.e00 -= mass * ( this.center_of_mass.y * this.center_of_mass.y + this.center_of_mass.z * this.center_of_mass.z );
		inertia_tensor.e11 -= mass * ( this.center_of_mass.x * this.center_of_mass.x + this.center_of_mass.z * this.center_of_mass.z );
		inertia_tensor.e22 -= mass * ( this.center_of_mass.x * this.center_of_mass.x + this.center_of_mass.y * this.center_of_mass.y );

		inertia_tensor.e10 += mass * this.center_of_mass.x * this.center_of_mass.y;
		inertia_tensor.e01 += mass * this.center_of_mass.x * this.center_of_mass.y;

		inertia_tensor.e21 += mass * this.center_of_mass.y * this.center_of_mass.z;
		inertia_tensor.e12 += mass * this.center_of_mass.y * this.center_of_mass.z;

		inertia_tensor.e20 += mass * this.center_of_mass.x * this.center_of_mass.z;
		inertia_tensor.e02 += mass * this.center_of_mass.x * this.center_of_mass.z;

		return inertia_tensor;
	};
})();

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.ConvexShape.prototype.findSupportPoint = function( direction, support_point ) {
	var best,
		best_dot = -Infinity,
		dot;

	for ( var i = 0; i < this.vertices.length; i++ ) {
		dot = this.vertices[i].dot( direction );
		if ( dot > best_dot ) {
			best_dot = dot;
			best = i;
		}
	}

	support_point.copy( this.vertices[best] );
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.ConvexShape.prototype.rayIntersect = (function(){
	var direction = new Goblin.Vector3(),
		ab = new Goblin.Vector3(),
		ac = new Goblin.Vector3(),
		q = new Goblin.Vector3(),
		s = new Goblin.Vector3(),
		r = new Goblin.Vector3(),
		b = new Goblin.Vector3(),
		u = new Goblin.Vector3(),
		tmin, tmax;

	return function( start, end ) {
		tmin = 0;

		direction.subtractVectors( end, start );
		tmax = direction.length();
		direction.scale( 1 / tmax ); // normalize direction

		for ( var i = 0; i < this.faces.length; i++  ) {
			var face = this.faces[i];

			ab.subtractVectors( face.b.point, face.a.point );
			ac.subtractVectors( face.c.point, face.a.point );
			q.crossVectors( direction, ac );
			var a = ab.dot( q );

			if ( a < Goblin.EPSILON ) {
				// Ray does not point at face
				continue;
			}

			var f = 1 / a;
			s.subtractVectors( start, face.a.point );

			var u = f * s.dot( q );
			if ( u < 0 ) {
				// Ray does not intersect face
				continue;
			}

			r.crossVectors( s, ab );
			var v = f * direction.dot( r );
			if ( v < 0 || u + v > 1 ) {
				// Ray does not intersect face
				continue;
			}

			var t = f * ac.dot( r );
			if ( t < tmin || t > tmax ) {
				// ray segment does not intersect face
				continue;
			}

			// Segment intersects the face, find from `t`
			var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
			intersection.object = this;
			intersection.t = t;
			intersection.point.scaleVector( direction, t );
			intersection.point.add( start );
			intersection.normal.copy( face.normal );

			// A convex object can have only one intersection with a line, we're done
			return intersection;
		}

		// No intersection found
		return null;
	};
})();
/**
 * @class CylinderShape
 * @param radius {Number} radius of the cylinder
 * @param half_height {Number} half height of the cylinder
 * @constructor
 */
Goblin.CylinderShape = function( radius, half_height ) {
	/**
	 * radius of the cylinder
	 *
	 * @property radius
	 * @type {Number}
	 */
	this.radius = radius;

	/**
	 * half height of the cylinder
	 *
	 * @property half_height
	 * @type {Number}
	 */
	this.half_height = half_height;

    this.aabb = new Goblin.AABB();
    this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.CylinderShape.prototype.calculateLocalAABB = function( aabb ) {
    aabb.min.x = aabb.min.z = -this.radius;
    aabb.min.y = -this.half_height;

    aabb.max.x = aabb.max.z = this.radius;
    aabb.max.y = this.half_height;
};

Goblin.CylinderShape.prototype.getInertiaTensor = function( mass ) {
	var element = 0.0833 * mass * ( 3 * this.radius * this.radius + ( this.half_height + this.half_height ) * ( this.half_height + this.half_height ) );

	return new Goblin.Matrix3(
		element, 0, 0,
		0, 0.5 * mass * this.radius * this.radius, 0,
		0, 0, element
	);
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.CylinderShape.prototype.findSupportPoint = function( direction, support_point ) {
	// Calculate the support point in the local frame
	if ( direction.y < 0 ) {
		support_point.y = -this.half_height;
	} else {
		support_point.y = this.half_height;
	}

	if ( direction.x === 0 && direction.z === 0 ) {
		support_point.x = support_point.z = 0;
	} else {
		var sigma = Math.sqrt( direction.x * direction.x + direction.z * direction.z ),
			r_s = this.radius / sigma;
		support_point.x = r_s * direction.x;
		support_point.z = r_s * direction.z;
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.CylinderShape.prototype.rayIntersect = (function(){
	var p = new Goblin.Vector3(),
		q = new Goblin.Vector3();

	return function ( start, end ) {
		p.y = this.half_height;
		q.y = -this.half_height;

		var d = new Goblin.Vector3();
		d.subtractVectors( q, p );

		var m = new Goblin.Vector3();
		m.subtractVectors( start, p );

		var n = new Goblin.Vector3();
		n.subtractVectors( end, start );

		var md = m.dot( d ),
			nd = n.dot( d ),
			dd = d.dot( d );

		// Test if segment fully outside either endcap of cylinder
		if ( md < 0 && md + nd < 0 ) {
			return null; // Segment outside 'p' side of cylinder
		}
		if ( md > dd && md + nd > dd ) {
			return null; // Segment outside 'q' side of cylinder
		}

		var nn = n.dot( n ),
			mn = m.dot( n ),
			a = dd * nn - nd * nd,
			k = m.dot( m ) - this.radius * this.radius,
			c = dd * k - md * md,
			t, t0;

		if ( Math.abs( a ) < Goblin.EPSILON ) {
			// Segment runs parallel to cylinder axis
			if ( c > 0 ) {
				return null; // 'a' and thus the segment lie outside cylinder
			}

			// Now known that segment intersects cylinder; figure out how it intersects
			if ( md < 0 ) {
				t = -mn / nn; // Intersect segment against 'p' endcap
			} else if ( md > dd ) {
				t = (nd - mn) / nn; // Intersect segment against 'q' endcap
			} else {
				t = 0; // 'a' lies inside cylinder
			}
		} else {
			var b = dd * mn - nd * md,
				discr = b * b - a * c;

			if ( discr < 0 ) {
				return null; // No real roots; no intersection
			}

			t0 = t = ( -b - Math.sqrt( discr ) ) / a;

			if ( md + t * nd < 0 ) {
				// Intersection outside cylinder on 'p' side
				if ( nd <= 0 ) {
					return null; // Segment pointing away from endcap
				}
				t = -md / nd;
				// Keep intersection if Dot(S(t) - p, S(t) - p) <= r^2
				if ( k + t * ( 2 * mn + t * nn ) <= 0 ) {
					t0 = t;
				} else {
					return null;
				}
			} else if ( md + t * nd > dd ) {
				// Intersection outside cylinder on 'q' side
				if ( nd >= 0 ) {
					return null; // Segment pointing away from endcap
				}
				t = ( dd - md ) / nd;
				// Keep intersection if Dot(S(t) - q, S(t) - q) <= r^2
				if ( k + dd - 2 * md + t * ( 2 * ( mn - nd ) + t * nn ) <= 0 ) {
					t0 = t;
				} else {
					return null;
				}
			}
			t = t0;

			// Intersection if segment intersects cylinder between the end-caps
			if ( t < 0 || t > 1 ) {
				return null;
			}
		}

		// Segment intersects cylinder between the endcaps; t is correct
		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.t = t * n.length();
		intersection.point.scaleVector( n, t );
		intersection.point.add( start );

		if ( Math.abs( intersection.point.y - this.half_height ) <= Goblin.EPSILON ) {
			intersection.normal.x = intersection.normal.z = 0;
			intersection.normal.y = intersection.point.y < 0 ? -1 : 1;
		} else {
			intersection.normal.y = 0;
			intersection.normal.x = intersection.point.x;
			intersection.normal.z = intersection.point.z;
			intersection.normal.scale( 1 / this.radius );
		}

		return intersection;
	};
})( );
/**
 * @class MeshShape
 * @param vertices {Array<Vector3>} vertices comprising the mesh
 * @param faces {Array<Number>} array of indices indicating which vertices compose a face; faces[0..2] represent the first face, faces[3..5] are the second, etc
 * @constructor
 */
Goblin.MeshShape = function( vertices, faces ) {
	this.vertices = vertices;

	this.triangles = [];
	for ( var i = 0; i < faces.length; i += 3 ) {
		this.triangles.push( new Goblin.TriangleShape( vertices[faces[i]], vertices[faces[i+1]], vertices[faces[i+2]] ) );
	}

	/**
	 * the convex mesh's volume
	 * @property volume
	 * @type {number}
	 */
	this.volume = 0;

	/**
	 * coordinates of the mesh's COM
	 * @property center_of_mass
	 * @type {vec3}
	 */
	this.center_of_mass = new Goblin.Vector3();

	/**
	 * used in computing the mesh's center of mass & volume
	 * @property _intergral
	 * @type {Float32Array}
	 * @private
	 */
	this._integral = new Float32Array( 10 );

	this.hierarchy = new Goblin.BVH( this.triangles ).tree;

	var polygon_faces = this.triangles.map(
		function( triangle ) {
			return new Goblin.GjkEpa.Face(
				null,
				{ point: triangle.a },
				{ point: triangle.b },
				{ point: triangle.c }
			);
		}
	);

	Goblin.ConvexShape.prototype.computeVolume.call( this, polygon_faces );

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.MeshShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = aabb.min.y = aabb.min.z = 0;
	aabb.max.x = aabb.max.y = aabb.max.z = 0;

	for ( var i = 0; i < this.vertices.length; i++ ) {
		aabb.min.x = Math.min( aabb.min.x, this.vertices[i].x );
		aabb.min.y = Math.min( aabb.min.y, this.vertices[i].y );
		aabb.min.z = Math.min( aabb.min.z, this.vertices[i].z );

		aabb.max.x = Math.max( aabb.max.x, this.vertices[i].x );
		aabb.max.y = Math.max( aabb.max.y, this.vertices[i].y );
		aabb.max.z = Math.max( aabb.max.z, this.vertices[i].z );
	}
};

Goblin.MeshShape.prototype.getInertiaTensor = function( mass ) {
	return Goblin.ConvexShape.prototype.getInertiaTensor.call( this, mass );
};

/**
 * noop
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.MeshShape.prototype.findSupportPoint = function( direction, support_point ) {
	return; // MeshShape isn't convex so it cannot be used directly in GJK
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3} end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.MeshShape.prototype.rayIntersect = (function(){
	var intersections = [],
		tSort = function( a, b ) {
			if ( a.t < b.t ) {
				return -1;
			} else if ( a.t > b.t ) {
				return 1;
			} else {
				return 0;
			}
		};

	return function( start, end ) {
		// Traverse the BVH and return the closest point of contact, if any
		var nodes = [ this.hierarchy ],
			node;
		intersections.length = 0;

		var count = 0;
		while ( nodes.length > 0 ) {
			count++;
			node = nodes.shift();

			if ( node.aabb.testRayIntersect( start, end ) ) {
				// Ray intersects this node's AABB
				if ( node.isLeaf() ) {
					var intersection = node.object.rayIntersect( start, end );
					if ( intersection != null ) {
						intersections.push( intersection );
					}
				} else {
					nodes.push( node.left, node.right );
				}
			}
		}

		intersections.sort( tSort );
		return intersections[0] || null;
	};
})();

//import {SaltyRNG} from "./salty_random_generator.mjs"

const generate_3D = true;
//-------------------------
// Usage : import {noise} from "./perlin-min.js"
//  var noise = new noise( config )
//
//  where config is an option block like the following.
// noise.get( x, y, z ) floating point elements. returns floating point element at that point.
// 

var example_config = {
	patchSize : 128,
	seed_noise : null,
	repeat_modulo : 0,
	//base : 0,
}

const CUBE_ELEMENT_SIZE = 32 // x by y plane if not _3D else also by z



function noise( opts ) {
	function NoiseGeneration(n,s) {
		//console.log( "generation....", n, s );

		return { 
			steps : n,
			pitch : opts.patchSize / n,
			scalar : s||(1/n),
			corn:[0,0,0,0],
			//dx : 1/(opts.patchSize/n),
			//dy : 1/(opts.patchSize/n),
			nx : 0,
			ny : 0,
			ny2 : 0,
			ny2 : 0,
			cx : 0,
			cy : 0,
			ix : 0,
			iy : 0,
			dx1 : 0,
			dx2 : 0,
			dx3 : 0,
			dx4 : 0,
			dy1 : 0,
			dy2 : 0,
			ox:0,oy:0,oz:0,
			
		};
	}
	var noiseGen = [];
	var maxtot = 0;
	for( var i = 1; i < 8; i++ ) {
		var gen;
		if( opts.patchSize/(1<<i) < 1 ) break;
		noiseGen.push( gen = NoiseGeneration( 1 << i, 1/((1<<i)) ) );
		if( i == 6 ) gen.scalar *= 2;
		//if( i == 4 ) gen.scalar *= 2;
		if( i == 1 ) gen.scalar /= 3;
		if( i == 2 ) gen.scalar /= 2;

		//if( i > 4 ) gen.scalar *= 2;
		//if( i > 6 ) gen.scalar *= 3;
		//gen.scalar *= 1;
		maxtot += gen.scalar;
	}
	console.log( "tot:", maxtot );
	var seeds = [];

	var data;
	const RNG = SaltyRNG( arr=>arr.push( data ), {mode:1} );

	function myRandom() {
		var arr = [];
		RNG.reset();
		if( opts.seed_noise ) {
			RNG.feed( opts.seed_noise );
		}
		var rand = new Uint8Array(RNG.getBuffer( 8*CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE*(generate_3D?CUBE_ELEMENT_SIZE:1)));
		var n = 0;
		//console.log( "Data wil lbe:", data );
		for( var nz = 0; nz< (generate_3D?CUBE_ELEMENT_SIZE:1); nz++ ) 
		for( var ny = 0; ny < CUBE_ELEMENT_SIZE; ny++ ) 
		for( var nx = 0; nx < CUBE_ELEMENT_SIZE; nx++ )  {
			var val = rand[n++]/255;//RNG.getBits( 8, false ) / 255; // 0 < 1 
			arr.push( val );
		}
		return { id:data, when : 0, next : null, arr: arr, sx:0, sy:0, sz:0 };
	}

	var cache = [];
	var last_used;
	var most_used;
	var cacheLen = 0;

	function ageCache() {
		var patch = last_used;
		
	}
	var counter = 0;
	function heatCache( patch ) {
		var p1 = most_used;
		var _p1 = null;
		if( p1 ) {
			for( ; p1; (_p1 = p1),p1 = p1.next ) {
				if( patch === p1 )
					break;
			}
			if( p1 && p1 != most_used ) {
				cacheLen--;
				if( !_p1 )
					most_used = most_used.next;
				else {
					_p1.next = p1.next;
				}
			}
		}
		patch.when = Date.now();
		if( cacheLen > 500 ) {
			var counter = 0;
			for( p1 = most_used; p1; (_p1 = p1),p1 = p1.next ) {
				counter++;
				if( counter === 400 ) {
					cacheLen = counter;
					p1.next = null; // trim tail of cached values... recompute later.
					break;
				}
			}
			
		}
		if( most_used ) {
			if( most_used !== patch ) {
				patch.next = most_used;
				most_used = patch;
				cacheLen++;
			}
		} else {
			last_used = most_used = patch;
			cacheLen = 1;
		}
		if( counter++ == 1000 ) {
			counter = 0;
		console.log( "length?", cacheLen, patch );
		}
		//patch.next = null;
	}

	function getRandom( x, y, z ) {
		//var fx = (x=x||0) &  0xF:
		//var fy = (y=x||0) &  0xF:
		//var fz = (z=z||0) &  0xF:
		const sx = (x/CUBE_ELEMENT_SIZE)|0;
		const sy = (y/CUBE_ELEMENT_SIZE)|0;
		const sz = (z/CUBE_ELEMENT_SIZE)|0;

		if( generate_3D ){
			var c_lv1 = cache[sx];
			if( !c_lv1 ) ( c_lv1 = cache[sx] = [] );
	        
			var c_lv2 = c_lv1[sy];				
			if( !c_lv2 ) ( c_lv2 = c_lv1[sy] = [] );
			
			var c_lv3 = c_lv2[sz];				
			if( !c_lv3 ) {
				data = [ sx, sy, sz ].join( " " );
				c_lv3 = c_lv2[sz] = myRandom();
				c_lv3.sx = sx;
				c_lv3.sy = sy;
				c_lv3.sz = sz;
				//console.log( "clv:", c_lv3 )
			}
			//heatCache( c_lv3 );
			return c_lv3;
		}else {
			var c_lv1 = cache[sx];
			if( !c_lv1 ) ( c_lv1 = cache[sx] = [] );
	        
			var c_lv2 = c_lv1[sy];				
			if( !c_lv2 ) {
				data = [ sx, sy, sz ].join( " " );
				c_lv2 = c_lv1[sy] = myRandom();
				c_lv2.sx = sx;
				c_lv2.sy = sy;
				c_lv2.sz = sz;
				//console.log( "clv:", c_lv3 )
			}
			//heatCache( c_lv2 );
			return c_lv2;
		}
	}

	

	return {
		setGenOffset( g, ox, oy, oz ) {
			noiseGen[g].ox = ox||0;
			noiseGen[g].oy = oy||0;
			noiseGen[g].oz = oz||0;
		}, 
		get(x,y,z,xTo,yTo,zTo) {
			z = z || 0;
			
			//var noise1 = getRandom( x, y, z ).arr;
			//var noise2 = getRandom( xTo, y, z ).arr;
			//var noise3 = getRandom( x, yTo, z ).arr;
			//var noise4 = getRandom( xTo, yTo, z ).arr;

			//var noise5 = getRandom( x, y, zTo ).arr;
			//var noise6 = getRandom( xTo, y, zTo ).arr;
			//var noise7 = getRandom( x, yTo, zTo ).arr;
			//var noise8 = getRandom( xTo, yTo, zTo ).arr;
		
			var _x;
			const modulox = opts.repeat_modulo2?opts.repeat_modulo2.x:(opts.repeat_modulo || 1.0);
			const moduloy = opts.repeat_modulo2?opts.repeat_modulo2.y:(opts.repeat_modulo || 1.0);
			x = x % modulox;
			y = y % moduloy;

			// Y will be 0 at the same time this changes...  which will update all anyway
			for( var n = 0; n < noiseGen.length; n++ ) {
			//for( var n = noiseGen.length-1; n > 0; n-- ) {//< noiseGen.length; n++ ) {
				var gen = noiseGen[n];
				// let's call nx normal-x and normal-y - this is the point that the 
				// generation patch is anchored at.
				// it is a pitch*N number.
				var nx = Math.floor(( (x-gen.ox) / gen.pitch ) )*gen.pitch;
				var ny = Math.floor(( (y-gen.oy) / gen.pitch ) )*gen.pitch;
				if( x == 0.9 && y == 0.75 ) console.log( "Gen ", n, "is", x, y, nx, ny );
				nx = nx;
				//if( modulo ) while( nx < 0 ) nx += modulo;
				ny = ny;
				//if( modulo ) while( ny < 0 ) ny += modulo;

				if( generate_3D ) {
					var nz = Math.floor(( (z-gen.oz) / gen.pitch ) )*gen.pitch;
				}
				if( ny != gen.ny  ) { 
					gen.dirty = true; 
					gen.ny =ny; 
				}
				if( nx != gen.nx ) { 
					gen.dirty = true; 
					gen.nx = nx;
				}
				if( generate_3D ) {
					if( nz != gen.nz ) { 
						gen.nz = nz;
						gen.dirty = true; 
					}
				}
				let gpx = gen.pitch;
				// this is the delta this point is between 0 and pitch width
				// so for this generation, it between 0-1 for the corners of the patch.
				gen.cx = ((x - gen.ox)/gen.pitch) % 1; // range scalar on top of nx
				while( gen.cx < 0 ) { gen.cx += 1; /*nx -=1*/ } // always apply forward
				gen.cy = ((y - gen.oy)/gen.pitch) % 1;
				while( gen.cy < 0 ) { gen.cy += 1; /*ny -= 1*/ }// always apply forward

				if( generate_3D ) {
					gen.cz = ((z - gen.oz)/gen.pitch) % 1;
					while( gen.cz < 0 ) gen.cz += 1;
				}
				//	if( n === 6 ) console.log( "Gen go from ", nx, ny, gen.dirty, (nx+gen.pitch)%modulo );

					
					const x1 = nx;
					// this is the next point to the right; normalized to pitch*N (+1)
					const x2 = Math.floor(((((nx) + gen.pitch) % modulox)/gen.pitch))*gen.pitch; 
					if( x2 != gen.nx2 ) { gen.nx2 = x2; gen.dirty = true; }

					const y1 = ny;
					const y2 = Math.floor(((((ny) + gen.pitch) % moduloy)/gen.pitch))*gen.pitch;
					if( y2 != gen.ny2 ) { gen.ny2 = y2; gen.dirty = true; }

					//if( y2 < y1 ) return y1/128 + gen.cy;
					//if( x2 < x1 ) return x1/128;

				if( gen.dirty ) 
				{
					// one (or more) of the normal anchors is not the same.
					gen.dirty = false;

					//console.log( "noise is...", n, x, y, z, nx, ny, nz, gen.cx, gen.cy, gen.cz );
				        
					
					
	         
                                	if( !generate_3D ) {
						
						const noise1 = getRandom( x1, y1, nz ).arr;
						const noise2 = getRandom( x2, y1, nz ).arr;
						const noise3 = getRandom( x1, y2, nz ).arr;
						const noise4 = getRandom( x2, y2, nz ).arr;
	         
						let ix = x1 % CUBE_ELEMENT_SIZE;
						while( ix < 0 ) ix += CUBE_ELEMENT_SIZE;
						let jx = x2 %CUBE_ELEMENT_SIZE;
						
						let iy = y1 % CUBE_ELEMENT_SIZE;
						while( iy < 0 ) iy += CUBE_ELEMENT_SIZE;
						let jy = y2 % CUBE_ELEMENT_SIZE;
	         	         
						gen.corn[0] = noise1[ (iy) * CUBE_ELEMENT_SIZE + ix ];
						//gen.corn[1] = ;
						gen.corn[2] = noise3[ (jy) * CUBE_ELEMENT_SIZE + ix ];
						//gen.corn[3] = ;
	         
						gen.dx1 = noise2[ (iy) * CUBE_ELEMENT_SIZE + jx ] - gen.corn[0];
						gen.dx2 = noise4[ (jy) * CUBE_ELEMENT_SIZE + jx ] - gen.corn[2];
					}
	         
					if( generate_3D ) {
						gen.nz = nz;
						const noise1 = getRandom( nx          , ny          , nz ).arr;
						const noise2 = getRandom( nx+gen.pitch, ny          , nz ).arr;
						const noise3 = getRandom( nx          , ny+gen.pitch, nz ).arr;
						const noise4 = getRandom( nx+gen.pitch, ny+gen.pitch, nz ).arr;
			
						const noise5 = getRandom( nx          , ny          , nz+gen.pitch ).arr;
						const noise6 = getRandom( nx+gen.pitch, ny          , nz+gen.pitch ).arr;
						const noise7 = getRandom( nx          , ny+gen.pitch, nz+gen.pitch ).arr;
						const noise8 = getRandom( nx+gen.pitch, ny+gen.pitch, nz+gen.pitch ).arr;
	         
						gen.ix = ( (Math.floor((x-gen.ox) / gen.pitch ))*gen.pitch) % CUBE_ELEMENT_SIZE;
						while( gen.ix < 0 ) gen.ix += CUBE_ELEMENT_SIZE;
						gen.jx = (gen.ix+gen.pitch)%CUBE_ELEMENT_SIZE;
	         
						gen.iy = ( (Math.floor((y-gen.oy) / gen.pitch))*gen.pitch) % CUBE_ELEMENT_SIZE;
						while( gen.iy < 0 ) gen.iy += CUBE_ELEMENT_SIZE;
						gen.jy = (gen.iy+gen.pitch)%CUBE_ELEMENT_SIZE;
	         
						gen.iz = ( (Math.floor((z-gen.oz) / gen.pitch))*gen.pitch) % CUBE_ELEMENT_SIZE;
						while( gen.iz < 0 ) gen.iz += CUBE_ELEMENT_SIZE;
						gen.jz = (gen.iz+gen.pitch)%CUBE_ELEMENT_SIZE;
	         
						gen.corn[0] = noise1[ gen.iz * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + gen.iy * CUBE_ELEMENT_SIZE + gen.ix ];
						gen.corn[1] = noise2[ gen.iz * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.iy) * CUBE_ELEMENT_SIZE + (gen.jx) ];
	         
						gen.corn[2] = noise3[ gen.iz * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.jy) * CUBE_ELEMENT_SIZE + gen.ix ];
						gen.corn[3] = noise4[ gen.iz * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.jy) * CUBE_ELEMENT_SIZE + (gen.jx) ];
	         
						gen.corn[4] = noise5[ (gen.jz) * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + gen.iy * CUBE_ELEMENT_SIZE + gen.ix ];
						gen.corn[5] = noise6[ (gen.jz) * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.iy) * CUBE_ELEMENT_SIZE + (gen.jx) ];
	         
						gen.corn[6] = noise7[ (gen.jz) * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.jy) * CUBE_ELEMENT_SIZE + gen.ix ];
						gen.corn[7] = noise8[ (gen.jz) * (CUBE_ELEMENT_SIZE*CUBE_ELEMENT_SIZE) + (gen.jy) * CUBE_ELEMENT_SIZE + (gen.jx) ];
	         
						gen.dx1 = gen.corn[1] - gen.corn[0];
						gen.dx2 = gen.corn[3] - gen.corn[2];
	         
						gen.dx3 = gen.corn[5] - gen.corn[4];
						gen.dx4 = gen.corn[7] - gen.corn[6]
					}
				}
		        }
		
		
			var tot = 0;
			for( var n = 0; n < noiseGen.length; n++ ) {
				var gen = noiseGen[n];
				// ((((c1)*(max-(d))) + ((c2)*(d)))/max)				
				//console.log( "gen.cx:", gen.cx );
				if( !generate_3D ) {
					var tx = (1-Math.cos( gen.cx *Math.PI) )/2;
					var ty =  (1-Math.cos( gen.cy *Math.PI) )/2;

					//console.log( "gen.cx:", tx, ty, "xy:", x, y,  "Genxy:", gen.cx, gen.cy  );
					var value1 = gen.dx1 * tx + gen.corn[0];
					var value2 = gen.dx2 * tx + gen.corn[2];
					var dy = value2 - value1; // /1
					var value = value1 + ty * dy;

					tot += (value * gen.scalar);
			        
				}
			        
				if( generate_3D ) {
					var tx = (1-Math.cos( gen.cx *Math.PI) )/2;
					var ty =  (1-Math.cos( gen.cy *Math.PI) )/2;
					var tz =  (1-Math.cos( gen.cz *Math.PI) )/2;
					//var tx = gen.cx;
					//var ty =  gen.cy;
			        
		                	var value1 = gen.dx1 * ( tx ) + gen.corn[0];
					var value2 = gen.dx2 * ( tx ) + gen.corn[2];
		                
					var dy1 = value2 - value1; // /1
					var value12 = value1 + ty * dy1;
			        
	        			var value3 = gen.dx3 * ( tx ) + gen.corn[4];
					var value4 = gen.dx4 * ( tx ) + gen.corn[6];
		                
					var dy2 = value4 - value3; // /1
					var value34 = value3 + ty * dy2;
			        
					var dz = value34 - value12;
					var value = value12 + tz * dz;
					tot += (value * gen.scalar) ;				
				}
			}
			tot /= maxtot;
			return tot;
		}
	};
	
}


//export {noise}

// find nearest does a recusive search and finds nodes
// which may qualify for linking to the new node (to).
// from is some source point, in a well linked web, should be irrelavent which to start from
// paint is passed to show nodes touched during the (last)search.


//This code is from Kas Thomas' blog:
//  http://asserttrue.blogspot.de/2011/12/perlin-noise-in-javascript_31.html

// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.
PerlinNoise = new function() {

this.noise = function(x, y, z) {

   var p = new Array(512)
   var permutation = [ 151,160,137,91,90,15,
   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
   ];
   for (var i=0; i < 256 ; i++) 
 p[256+i] = p[i] = permutation[i]; 

      var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
          Y = Math.floor(y) & 255,                  // CONTAINS POINT.
          Z = Math.floor(z) & 255;
      x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
      y -= Math.floor(y);                                // OF POINT IN CUBE.
      z -= Math.floor(z);
      var    u = fade(x),                                // COMPUTE FADE CURVES
             v = fade(y),                                // FOR EACH OF X,Y,Z.
             w = fade(z);
      var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
          B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

      return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                     grad(p[BA  ], x-1, y  , z   )), // BLENDED
                             lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                     grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                     grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                             lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                     grad(p[BB+1], x-1, y-1, z-1 )))));
   }
   function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
   function lerp( t, a, b) { return a + t * (b - a); }
   function grad(hash, x, y, z) {
      var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
      var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
             v = h<4 ? y : h==12||h==14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
   } 
   function scale(n) { return (1 + n)/2; }
}

/**
 * @class PlaneShape
 * @param orientation {Number} index of axis which is the plane's normal ( 0 = X, 1 = Y, 2 = Z )
 * @param half_width {Number} half width of the plane
 * @param half_length {Number} half height of the plane
 * @constructor
 */
Goblin.PlaneShape = function( orientation, half_width, half_length ) {
	/**
	 * index of axis which is the plane's normal ( 0 = X, 1 = Y, 2 = Z )
	 * when 0, width is Y and length is Z
	 * when 1, width is X and length is Z
	 * when 2, width is X and length is Y
	 *
	 * @property half_width
	 * @type {Number}
	 */
	this.orientation = orientation;

	/**
	 * half width of the plane
	 *
	 * @property half_height
	 * @type {Number}
	 */
	this.half_width = half_width;

	/**
	 * half length of the plane
	 *
	 * @property half_length
	 * @type {Number}
	 */
	this.half_length = half_length;

    this.aabb = new Goblin.AABB();
    this.calculateLocalAABB( this.aabb );


	if ( this.orientation === 0 ) {
		this._half_width = 0;
		this._half_height = this.half_width;
		this._half_depth = this.half_length;
	} else if ( this.orientation === 1 ) {
		this._half_width = this.half_width;
		this._half_height = 0;
		this._half_depth = this.half_length;
	} else {
		this._half_width = this.half_width;
		this._half_height = this.half_length;
		this._half_depth = 0;
	}
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.PlaneShape.prototype.calculateLocalAABB = function( aabb ) {
    if ( this.orientation === 0 ) {
        this._half_width = 0;
        this._half_height = this.half_width;
        this._half_depth = this.half_length;

        aabb.min.x = 0;
        aabb.min.y = -this.half_width;
        aabb.min.z = -this.half_length;

        aabb.max.x = 0;
        aabb.max.y = this.half_width;
        aabb.max.z = this.half_length;
    } else if ( this.orientation === 1 ) {
        this._half_width = this.half_width;
        this._half_height = 0;
        this._half_depth = this.half_length;

        aabb.min.x = -this.half_width;
        aabb.min.y = 0;
        aabb.min.z = -this.half_length;

        aabb.max.x = this.half_width;
        aabb.max.y = 0;
        aabb.max.z = this.half_length;
    } else {
        this._half_width = this.half_width;
        this._half_height = this.half_length;
        this._half_depth = 0;

        aabb.min.x = -this.half_width;
        aabb.min.y = -this.half_length;
        aabb.min.z = 0;

        aabb.max.x = this.half_width;
        aabb.max.y = this.half_length;
        aabb.max.z = 0;
    }
};

Goblin.PlaneShape.prototype.getInertiaTensor = function( mass ) {
	var width_squared = this.half_width * this.half_width * 4,
		length_squared = this.half_length * this.half_length * 4,
		element = 0.0833 * mass,

		x = element * length_squared,
		y = element * ( width_squared + length_squared ),
		z = element * width_squared;

	if ( this.orientation === 0 ) {
		return new Goblin.Matrix3(
			y, 0, 0,
			0, x, 0,
			0, 0, z
		);
	} else if ( this.orientation === 1 ) {
		return new Goblin.Matrix3(
			x, 0, 0,
			0, y, 0,
			0, 0, z
		);
	} else {
		return new Goblin.Matrix3(
			y, 0, 0,
			0, z, 0,
			0, 0, x
		);
	}
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.PlaneShape.prototype.findSupportPoint = function( direction, support_point ) {
	/*
	 support_point = [
	 sign( direction.x ) * _half_width,
	 sign( direction.y ) * _half_height,
	 sign( direction.z ) * _half_depth
	 ]
	 */

	// Calculate the support point in the local frame
	if ( direction.x < 0 ) {
		support_point.x = -this._half_width;
	} else {
		support_point.x = this._half_width;
	}

	if ( direction.y < 0 ) {
		support_point.y = -this._half_height;
	} else {
		support_point.y = this._half_height;
	}

	if ( direction.z < 0 ) {
		support_point.z = -this._half_depth;
	} else {
		support_point.z = this._half_depth;
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.PlaneShape.prototype.rayIntersect = (function(){
	var normal = new Goblin.Vector3(),
		ab = new Goblin.Vector3(),
		point = new Goblin.Vector3(),
		t;

	return function( start, end ) {
		if ( this.orientation === 0 ) {
			normal.x = 1;
			normal.y = normal.z = 0;
		} else if ( this.orientation === 1 ) {
			normal.y = 1;
			normal.x = normal.z = 0;
		} else {
			normal.z = 1;
			normal.x = normal.y = 0;
		}

		ab.subtractVectors( end, start );
		t = -normal.dot( start ) / normal.dot( ab );

		if ( t < 0 || t > 1 ) {
			return null;
		}

		point.scaleVector( ab, t );
		point.add( start );

		if ( point.x < -this._half_width || point.x > this._half_width ) {
			return null;
		}

		if ( point.y < -this._half_height || point.y > this._half_height ) {
			return null;
		}

		if ( point.z < -this._half_depth || point.z > this._half_depth ) {
			return null;
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.t = t * ab.length();
		intersection.point.copy( point );
		intersection.normal.copy( normal );

		return intersection;
	};
})();
"use strict";

// usage
//  var RNG = require( "salty_random_generator")( callback }
//    constructor callback is used as a source of salt to the generator
//    the callback is passed an array to which strings are expected to be added
//     ( [] )=>{ [].push( more_salt ); }
//
//    - methods on RNG
//         reset()
//                clear current random state, and restart
//
//         getBits( /* 0-31 */ )
//                return a Number that is that many bits from the random stream
//
//         getBuffer( /* 0-n */ )
//                returns a ArrayBuffer that is that many bits of randomness...
//
//         save()
//                return an object representing the current RNG state
//
//         restore( o )
//                use object to restore RNG state.
//
//          feed( buf )
//                feed a raw uint8array.
//

//  import {SaltyRNG} from "./salty_random_generator.js"
//  var RNG = SaltyRNG( callback );
//  
//  callback is passed an array, additional array buffers and strings can be added to this
//  to provide salt information for the current request.
//


var exports = exports || {};
var module = module || {parent:true};

const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_'
const decodings = { '~':0
		,'=':0
		,'$':62
		,'_':63
		,'+':62
		,'-':62
		,'.':62
		,'/':63
		,',':63
};


var u8 = '';

for( var x = 0; x < 256; x++ ) {
	if( x < 64 ) {
		decodings[encodings[x]] = x;
		u8 += String.fromCharCode(x);
	}
	else if( x < 128 ) {
		u8 += String.fromCharCode(x);
	}
	else {
		u8 += String.fromCharCode(x);
	}
}
Object.freeze( decodings );

exports.SaltyRNG = SaltyRNG;
function SaltyRNG(f, opt) {

	const K12_SQUEEZE_LENGTH = 32768;

	const shabuf = opt?( opt.mode === 0 )?new SHA256() : null
                          : new SHA256();
	const k12buf = opt?( opt.mode === 1 )?KangarooTwelve() : null
                          : null;

	function MASK_TOP_MASK(length) {
		return (0xFF) >>> (8 - (length))
	};

	function MY_MASK_MASK(n, length) {
		return (MASK_TOP_MASK(length) << ((n) & 0x7)) & 0xFF;
	}
	function MY_GET_MASK(v, n, mask_size) {
		return (v[(n) >> 3] & MY_MASK_MASK(n, mask_size)) >>> (((n)) & 0x7)
	}

	function compute(buf) {

		if( shabuf ) {
			var h = new Array(32)
			shabuf.update(buf).finish(h).clean()
			//console.log( "RESULT HASH?", h );
			return h;
		} else if( k12buf ) {	
			k12buf.update(buf);		
			k12buf.final();
			return k12buf.squeeze( 64 );
		} else  {
			console.log( "no engine for salty generator" );
		}
	}
	var RNG = {
		getSalt: f,
		feed(buf) {
			if( typeof buf === "string" )
				buf = toUTF8Array( buf );
			if( shabuf )
				shabuf.update(buf)
			else
				k12buf.update(buf)
		},
		saltbuf: [],
		entropy: null,
		available: 0,
		used: 0,
		total_bits : 0,
		initialEntropy : "test",
		save() {
			return {
				saltbuf: this.saltbuf.slice(0),
				entropy: this.entropy?this.entropy.slice(0):null,
				available: this.available,
				used: this.used,
				state : shabuf?shabuf.clone():( k12buf ? k12buf.clone():null )
			}
		},
		restore(oldState) {
			this.saltbuf = oldState.saltbuf.slice(0);
			this.entropy = oldState.entropy?oldState.entropy.slice(0):null;
			this.available = oldState.available;
			this.used = oldState.used;
			//throw new Error( "RESTORE STATE IS BROKEN." );
			shabuf && shabuf.copy( oldState.state );
			k12buf && k12buf.copy( oldState.state );
		},
		reset() {
			this.entropy = 
				this.initialEntropy
					?compute(this.initialEntropy)
					:null;
			this.available = 0;
			this.used = 0;
			this.total_bits = 0;
			if( shabuf )
				shabuf.clean();
			if( k12buf ) {
				k12buf.init();
			}
		},
		getByte() {
			if( this.used & 0x7 ) {
				var arr = new Uint8Array(this.getBuffer(8));
				return arr[0];
			} else {
				if(this.available === this.used)
					needBits();
				this.total_bits += 8;
				var result = this.entropy[(this.used) >> 3]
				this.used += 8;
				return result;
			}
		},
		getBits(count, signed) {
			if( !count ) { count = 32; signed = true } 
			if (count > 32)
				throw "Use getBuffer for more than 32 bits.";
			var tmp = this.getBuffer(count);
			if( signed ) {
				var arr_u = new Uint32Array(tmp);
				var arr = new Int32Array(tmp);
				if(  arr_u[0] & ( 1 << (count-1) ) ) {
					var negone = ~0;
					negone <<= (count-1);
					//console.log( "set arr_u = ", arr_u[0].toString(16 ) , negone.toString(16 ) );
					arr_u[0] |= negone;
				}
				return arr[0];
			}
			else {
				var arr = new Uint32Array(tmp);
				return arr[0];
			}
		},
		getBuffer(bits) {
			let _bits = bits;
			let resultIndex = 0;
			let resultBits = 0;
			let resultBuffer = new ArrayBuffer(4 * ((bits + 31) >> 5));
			let result = new Uint8Array(resultBuffer);
			this.total_bits += bits;
			{
				let tmp;
				let partial_tmp;
				let partial_bits = 0;
				let get_bits;

				do {
					if (bits > 8)
						get_bits = 8;
					else
						get_bits = bits;
					// if there were 1-7 bits of data in partial, then can only get 8-partial max.
					if( (8-partial_bits) < get_bits )
						get_bits = (8-partial_bits);
					// if get_bits == 8
					//    but bits_used is 1-7, then it would have to pull 2 bytes to get the 8 required
					//    so truncate get_bits to 1-7 bits
					let chunk = ( 8 - ( this.used & 7) );
					if( chunk < get_bits )
						get_bits = chunk;
					// if resultBits is 1-7 offset, then would have to store up to 2 bytes of value
					//    so have to truncate to just the up to 1 bytes that will fit.
					chunk = ( 8 - ( resultBits & 7) );
					if( chunk < get_bits )
						get_bits = chunk;

					//console.log( "Get bits:", get_bits, " after", this.used, "into", resultBits );
					// only greater... if equal just grab the bits.
					if (get_bits > (this.available - this.used)) {
						if (this.available - this.used) {
							partial_bits = this.available - this.used;
							// partial can never be greater than 8; request is never greater than 8
							//if (partial_bits > 8)
							//	partial_bits = 8;
							partial_tmp = MY_GET_MASK(this.entropy, this.used, partial_bits);
						}
						needBits();
						bits -= partial_bits;
					}
					else {
						tmp = MY_GET_MASK(this.entropy, this.used, get_bits);
						this.used += get_bits;
						if (partial_bits) {
							tmp = partial_tmp | (tmp << partial_bits);
							partial_bits = 0;
						}
						
						result[resultIndex] |= tmp << (resultBits&7);
						resultBits += get_bits;
						// because of input limits, total result bits can only be 8 or less.
						if( resultBits == 8 ) {
							resultIndex++;
							resultBits = 0;
						}
						bits -= get_bits;
					}
				} while (bits);
				//console.log( "output is ", result[0].toString(16), result[1].toString(16), result[2].toString(16), result[3].toString(16) )
				return resultBuffer;
			}
		}
	}
	function needBits() {
		RNG.saltbuf.length = 0;
		if( k12buf ) {
			if( !k12buf.phase() )
				console.trace( "PLEASE INIT THIS USAGE!" );
			//console.log( "BUF IS:", k12buf.absorbing()?"absorbing":"??", k12buf.squeezing()?"squeezing":"!!", k12buf.phase(),( k12buf.absorbing() || ( RNG.total_bits > K12_SQUEEZE_LENGTH ) ) )
			if( k12buf.absorbing() || ( RNG.total_bits >= K12_SQUEEZE_LENGTH ) ) {
				if( k12buf.squeezing() ) {
	                                //console.log( "Need to init with new entropy (BIT FORCE)" );
					k12buf.init();
					k12buf.update( RNG.entropy );
				}
				if (typeof (RNG.getSalt) === 'function') {
					RNG.getSalt(RNG.saltbuf);
					if( RNG.saltbuf.length )
						k12buf.update( RNG.saltbuf );

				}
				k12buf.final();
				RNG.used = 0;
			}
			if( k12buf.squeezing() ) {
				RNG.entropy = k12buf.squeeze(64); // customization is a final pad string.
			}
		}
		if( shabuf ) {
			if (typeof (RNG.getSalt) === 'function')
				RNG.getSalt(RNG.saltbuf);
			//console.log( "saltbuf.join = ", RNG.saltbuf.join(), RNG.saltbuf.length );
			var newbuf;
			if( RNG.saltbuf.length ) {
				if( !RNG.entropy )
					RNG.entropy = new Uint8Array(32)
				newbuf = toUTF8Array( RNG.saltbuf.join() );
				shabuf.update(newbuf).finish(RNG.entropy).clean();
				shabuf.update(RNG.entropy);
			}
			else {
				if( !RNG.entropy )
					RNG.entropy = new Uint8Array(32)
				shabuf.finish(RNG.entropy).clean();
				shabuf.update(RNG.entropy);
			}
		}
		RNG.available = RNG.entropy.length * 8;
		RNG.used = 0;
	};
	RNG.reset();
	return RNG;
}

//------------------ SHA256 support

/* Taken from https://github.com/brillout/forge-sha256
 * which itself is taken from https://github.com/digitalbazaar/forge/tree/3b7826f7c2735c42b41b7ceaaadaad570e92d898
 */

// this is just the working bits of the above.

var K = new Uint32Array([
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
	0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
	0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
	0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
	0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
	0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
	0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
	0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
	0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
	0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
	0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
	0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
])

function blocks(w, v, p, pos, len) {
	var a, b, c, d, e, f, g, h, u, i, j, t1, t2
	while (len >= 64) {
		a = v[0]
		b = v[1]
		c = v[2]
		d = v[3]
		e = v[4]
		f = v[5]
		g = v[6]
		h = v[7]

		for (i = 0; i < 16; i++) {
			j = pos + i * 4
			w[i] = (((p[j] & 0xff) << 24) | ((p[j + 1] & 0xff) << 16) |
				((p[j + 2] & 0xff) << 8) | (p[j + 3] & 0xff))
		}

		for (i = 16; i < 64; i++) {
			u = w[i - 2]
			t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10)

			u = w[i - 15]
			t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3)

			w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0)
		}

		for (i = 0; i < 64; i++) {
			t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
				(e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
				((h + ((K[i] + w[i]) | 0)) | 0)) | 0

			t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
				(a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0

			h = g
			g = f
			f = e
			e = (d + t1) | 0
			d = c
			c = b
			b = a
			a = (t1 + t2) | 0
		}

		v[0] += a
		v[1] += b
		v[2] += c
		v[3] += d
		v[4] += e
		v[5] += f
		v[6] += g
		v[7] += h

		pos += 64
		len -= 64
	}
	return pos
}

function SHA256() {
	if( !(this instanceof SHA256) ) return new SHA256();
	this.v = new Uint32Array(8)
	this.w = new Int32Array(64)
	this.buf = new Uint8Array(128)
	this.buflen = 0
	this.len = 0
	this.reset()
}

SHA256.prototype.clone = function (){
	var x = new SHA256();
	x.v = this.v.slice(0);
	x.w = this.w.slice(0);
	x.buf = this.buf.slice(0);
	x.buflen = this.buflen;
	x.len = this.len;
	return x;
}

SHA256.prototype.copy = function (from){

	this.v = from.v;
	this.w = from.w;
	this.buf = from.buf;
	this.buflen = from.buflen;
	this.len = from.len;
	return this;
}

SHA256.prototype.reset = function () {
	this.v[0] = 0x6a09e667
	this.v[1] = 0xbb67ae85
	this.v[2] = 0x3c6ef372
	this.v[3] = 0xa54ff53a
	this.v[4] = 0x510e527f
	this.v[5] = 0x9b05688c
	this.v[6] = 0x1f83d9ab
	this.v[7] = 0x5be0cd19
	this.buflen = 0
	this.len = 0
}

SHA256.prototype.clean = function () {
	var i
	for (i = 0; i < this.buf.length; i++) this.buf[i] = 0
	for (i = 0; i < this.w.length; i++) this.w[i] = 0
	this.reset()
}

SHA256.prototype.update = function (m, len) {
	var mpos = 0, mlen = (typeof len !== 'undefined') ? len : m.length
	this.len += mlen
	if (this.buflen > 0) {
		while (this.buflen < 64 && mlen > 0) {
			this.buf[this.buflen++] = m[mpos++]
			mlen--
		}
		if (this.buflen === 64) {
			blocks(this.w, this.v, this.buf, 0, 64)
			this.buflen = 0
		}
	}
	if (mlen >= 64) {
		mpos = blocks(this.w, this.v, m, mpos, mlen)
		mlen %= 64
		for( var buf_fill = mlen; buf_fill < 64; buf_fill++ )
			this.buf[buf_fill] = m[mpos-64 + buf_fill];
	}
	while (mlen > 0) {
		this.buf[this.buflen++] = m[mpos++]
		mlen--
	}
	return this
}

SHA256.prototype.finish = function (h) {
	var mlen = this.len,
		left = this.buflen,
		bhi = (mlen / 0x20000000) | 0,
		blo = mlen << 3,
		padlen = (mlen % 64 < 56) ? 64 : 128,
		i

	this.buf[left] = 0x80
	for (i = left + 1; i < padlen - 8; i++) this.buf[i] = 0
	this.buf[padlen - 8] = (bhi >>> 24) & 0xff
	this.buf[padlen - 7] = (bhi >>> 16) & 0xff
	this.buf[padlen - 6] = (bhi >>> 8) & 0xff
	this.buf[padlen - 5] = (bhi >>> 0) & 0xff
	this.buf[padlen - 4] = (blo >>> 24) & 0xff
	this.buf[padlen - 3] = (blo >>> 16) & 0xff
	this.buf[padlen - 2] = (blo >>> 8) & 0xff
	this.buf[padlen - 1] = (blo >>> 0) & 0xff

	blocks(this.w, this.v, this.buf, 0, padlen)

	for (i = 0; i < 8; i++) {
		h[i * 4 + 0] = (this.v[i] >>> 24) & 0xff
		h[i * 4 + 1] = (this.v[i] >>> 16) & 0xff
		h[i * 4 + 2] = (this.v[i] >>> 8) & 0xff
		h[i * 4 + 3] = (this.v[i] >>> 0) & 0xff
	}
	if( false )
	{
		var str = '';
		for( i = 0; i < 32; i++ )
			str += h[i].toString(16);
	}

	return this
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}



const k12Module = {};
var k12 = (function(module){
var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=(function(status,toThrow){throw toThrow});Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;if(Module["ENVIRONMENT"]){if(Module["ENVIRONMENT"]==="WEB"){ENVIRONMENT_IS_WEB=true}else if(Module["ENVIRONMENT"]==="WORKER"){ENVIRONMENT_IS_WORKER=true}else if(Module["ENVIRONMENT"]==="NODE"){ENVIRONMENT_IS_NODE=true}else if(Module["ENVIRONMENT"]==="SHELL"){ENVIRONMENT_IS_SHELL=true}else{throw new Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.")}}else{ENVIRONMENT_IS_WEB=typeof window==="object";/*ENVIRONMENT_IS_WORKER=typeof importScripts==="function"*/;ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER}
	if(ENVIRONMENT_IS_NODE){var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;ret=tryParseAsDataURI(filename);if(!ret){if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename)}return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}Module["arguments"]=process["argv"].slice(2);
		if(typeof module!=="undefined"){module["exports"]=Module}
		Module["inspect"]=(function(){return"[Emscripten Module object]"})}
	else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){var data=tryParseAsDataURI(f);if(data){return intArrayToString(data)}return read(f)}}Module["readBinary"]=function readBinary(f){var data;data=tryParseAsDataURI(f);if(data){return data}if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof quit==="function"){Module["quit"]=(function(status,toThrow){quit(status)})}}else 
	if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){module["exports"]=Module;Module["read"]=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};
	if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=(function(title){document.title=title})}Module["print"]=typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null;Module["printErr"]=typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||Module["print"];Module.print=Module["print"];Module.printErr=Module["printErr"];for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;var STACK_ALIGN=16;function staticAlloc(size){assert(!staticSealed);var ret=STATICTOP;STATICTOP=STATICTOP+size+15&-16;return ret}function dynamicAlloc(size){assert(DYNAMICTOP_PTR);var ret=HEAP32[DYNAMICTOP_PTR>>2];var end=ret+size+15&-16;HEAP32[DYNAMICTOP_PTR>>2]=end;if(end>=TOTAL_MEMORY){var success=enlargeMemory();if(!success){HEAP32[DYNAMICTOP_PTR>>2]=ret;return 0}}return ret}function alignMemory(size,factor){if(!factor)factor=STACK_ALIGN;var ret=size=Math.ceil(size/factor)*factor;return ret}function getNativeTypeSize(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return 4}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;Module.printErr(text)}}var jsCallStartIndex=1;var functionPointers=new Array(0);var funcWrappers={};function dynCall(sig,ptr,args){if(args&&args.length){return Module["dynCall_"+sig].apply(null,[ptr].concat(args))}else{return Module["dynCall_"+sig].call(null,ptr)}}var GLOBAL_BASE=8;var ABORT=0;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}var JSfuncs={"stackSave":(function(){stackSave()}),"stackRestore":(function(){stackRestore()}),"arrayToC":(function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};function ccall(ident,returnType,argTypes,args,opts){var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);if(returnType==="string")ret=Pointer_stringify(ret);else if(returnType==="boolean")ret=Boolean(ret);if(stack!==0){stackRestore(stack)}return ret}function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=+1?tempDouble>+0?(Math_min(+Math_floor(tempDouble/+4294967296),+4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/+4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}var ALLOC_STATIC=2;var ALLOC_NONE=4;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[typeof _malloc==="function"?_malloc:staticAlloc,stackAlloc,staticAlloc,dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var stop;ptr=ret;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}
function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return UTF8ToString(ptr)}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;
function UTF8ArrayToString(u8Array,idx){var endPtr=idx;while(u8Array[endPtr])++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}}
function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}
function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}
function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}
function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;
function demangle(func){return func}
function demangleAll(text){var regex=/__Z[\w\d_]+/g;return text.replace(regex,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var STATIC_BASE,STATICTOP,staticSealed;var STACK_BASE,STACKTOP,STACK_MAX;var DYNAMIC_BASE,DYNAMICTOP_PTR;STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0;staticSealed=false;function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}function enlargeMemory(){abortOnCannotGrowMemory()}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(TOTAL_MEMORY<TOTAL_STACK)Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"]}else{{buffer=new ArrayBuffer(TOTAL_MEMORY)}Module["buffer"]=buffer}updateGlobalBufferViews();function getTotalMemory(){return TOTAL_MEMORY}HEAP32[0]=1668509029;HEAP16[1]=25459;if(HEAPU8[2]!==115||HEAPU8[3]!==99)throw"Runtime error: expected the system to be little-endian!";function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}var Math_abs=Math.abs;var Math_cos=Math.cos;var Math_sin=Math.sin;var Math_tan=Math.tan;var Math_acos=Math.acos;var Math_asin=Math.asin;var Math_atan=Math.atan;var Math_atan2=Math.atan2;var Math_exp=Math.exp;var Math_log=Math.log;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_imul=Math.imul;var Math_fround=Math.fround;var Math_round=Math.round;var Math_min=Math.min;var Math_max=Math.max;var Math_clz32=Math.clz32;var Math_trunc=Math.trunc;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var memoryInitializer=null;var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}STATIC_BASE=GLOBAL_BASE;STATICTOP=STATIC_BASE+4608;__ATINIT__.push();memoryInitializer="data:application/octet-stream;base64,AQAAAAAAAAAAAAAAiQAAAAAAAACLAACAAAAAAICAAIABAAAAiwAAAAEAAAAAgAAAAQAAAIiAAIABAAAAggAAgAAAAAALAAAAAAAAAAoAAAABAAAAgoAAAAAAAAADgAAAAQAAAIuAAAABAAAACwAAgAEAAACKAACAAQAAAIEAAIAAAAAAgQAAgAAAAAAIAACAAAAAAIMAAAAAAAAAA4AAgAEAAACIgACAAAAAAIgAAIABAAAAAIAAAAAAAACCgACA/wAAANAAAAAFAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAAOAAAABAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAK/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADcDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBIQVNFOiVkABEACgAREREAAAAABQAAAAAAAAkAAAAACwAAAAAAAAAAEQAPChEREQMKBwABEwkLCwAACQYLAAALAAYRAAAAERERAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAABEACgoREREACgAAAgAJCwAAAAkACwAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAMAAAAAAwAAAAACQwAAAAAAAwAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAADQAAAAQNAAAAAAkOAAAAAAAOAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA8AAAAADwAAAAAJEAAAAAAAEAAAEAAAEgAAABISEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAEhISAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAAAAAAAAACgAAAAAKAAAAAAkLAAAAAAALAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAwAAAAADAAAAAAJDAAAAAAADAAADAAALSsgICAwWDB4AChudWxsKQAtMFgrMFggMFgtMHgrMHggMHgAaW5mAElORgBuYW4ATkFOADAxMjM0NTY3ODlBQkNERUYuAFQhIhkNAQIDEUscDBAECx0SHidobm9wcWIgBQYPExQVGggWBygkFxgJCg4bHyUjg4J9JiorPD0+P0NHSk1YWVpbXF1eX2BhY2RlZmdpamtscnN0eXp7fABJbGxlZ2FsIGJ5dGUgc2VxdWVuY2UARG9tYWluIGVycm9yAFJlc3VsdCBub3QgcmVwcmVzZW50YWJsZQBOb3QgYSB0dHkAUGVybWlzc2lvbiBkZW5pZWQAT3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQATm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeQBObyBzdWNoIHByb2Nlc3MARmlsZSBleGlzdHMAVmFsdWUgdG9vIGxhcmdlIGZvciBkYXRhIHR5cGUATm8gc3BhY2UgbGVmdCBvbiBkZXZpY2UAT3V0IG9mIG1lbW9yeQBSZXNvdXJjZSBidXN5AEludGVycnVwdGVkIHN5c3RlbSBjYWxsAFJlc291cmNlIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlAEludmFsaWQgc2VlawBDcm9zcy1kZXZpY2UgbGluawBSZWFkLW9ubHkgZmlsZSBzeXN0ZW0ARGlyZWN0b3J5IG5vdCBlbXB0eQBDb25uZWN0aW9uIHJlc2V0IGJ5IHBlZXIAT3BlcmF0aW9uIHRpbWVkIG91dABDb25uZWN0aW9uIHJlZnVzZWQASG9zdCBpcyBkb3duAEhvc3QgaXMgdW5yZWFjaGFibGUAQWRkcmVzcyBpbiB1c2UAQnJva2VuIHBpcGUASS9PIGVycm9yAE5vIHN1Y2ggZGV2aWNlIG9yIGFkZHJlc3MAQmxvY2sgZGV2aWNlIHJlcXVpcmVkAE5vIHN1Y2ggZGV2aWNlAE5vdCBhIGRpcmVjdG9yeQBJcyBhIGRpcmVjdG9yeQBUZXh0IGZpbGUgYnVzeQBFeGVjIGZvcm1hdCBlcnJvcgBJbnZhbGlkIGFyZ3VtZW50AEFyZ3VtZW50IGxpc3QgdG9vIGxvbmcAU3ltYm9saWMgbGluayBsb29wAEZpbGVuYW1lIHRvbyBsb25nAFRvbyBtYW55IG9wZW4gZmlsZXMgaW4gc3lzdGVtAE5vIGZpbGUgZGVzY3JpcHRvcnMgYXZhaWxhYmxlAEJhZCBmaWxlIGRlc2NyaXB0b3IATm8gY2hpbGQgcHJvY2VzcwBCYWQgYWRkcmVzcwBGaWxlIHRvbyBsYXJnZQBUb28gbWFueSBsaW5rcwBObyBsb2NrcyBhdmFpbGFibGUAUmVzb3VyY2UgZGVhZGxvY2sgd291bGQgb2NjdXIAU3RhdGUgbm90IHJlY292ZXJhYmxlAFByZXZpb3VzIG93bmVyIGRpZWQAT3BlcmF0aW9uIGNhbmNlbGVkAEZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZABObyBtZXNzYWdlIG9mIGRlc2lyZWQgdHlwZQBJZGVudGlmaWVyIHJlbW92ZWQARGV2aWNlIG5vdCBhIHN0cmVhbQBObyBkYXRhIGF2YWlsYWJsZQBEZXZpY2UgdGltZW91dABPdXQgb2Ygc3RyZWFtcyByZXNvdXJjZXMATGluayBoYXMgYmVlbiBzZXZlcmVkAFByb3RvY29sIGVycm9yAEJhZCBtZXNzYWdlAEZpbGUgZGVzY3JpcHRvciBpbiBiYWQgc3RhdGUATm90IGEgc29ja2V0AERlc3RpbmF0aW9uIGFkZHJlc3MgcmVxdWlyZWQATWVzc2FnZSB0b28gbGFyZ2UAUHJvdG9jb2wgd3JvbmcgdHlwZSBmb3Igc29ja2V0AFByb3RvY29sIG5vdCBhdmFpbGFibGUAUHJvdG9jb2wgbm90IHN1cHBvcnRlZABTb2NrZXQgdHlwZSBub3Qgc3VwcG9ydGVkAE5vdCBzdXBwb3J0ZWQAUHJvdG9jb2wgZmFtaWx5IG5vdCBzdXBwb3J0ZWQAQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbABBZGRyZXNzIG5vdCBhdmFpbGFibGUATmV0d29yayBpcyBkb3duAE5ldHdvcmsgdW5yZWFjaGFibGUAQ29ubmVjdGlvbiByZXNldCBieSBuZXR3b3JrAENvbm5lY3Rpb24gYWJvcnRlZABObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlAFNvY2tldCBpcyBjb25uZWN0ZWQAU29ja2V0IG5vdCBjb25uZWN0ZWQAQ2Fubm90IHNlbmQgYWZ0ZXIgc29ja2V0IHNodXRkb3duAE9wZXJhdGlvbiBhbHJlYWR5IGluIHByb2dyZXNzAE9wZXJhdGlvbiBpbiBwcm9ncmVzcwBTdGFsZSBmaWxlIGhhbmRsZQBSZW1vdGUgSS9PIGVycm9yAFF1b3RhIGV4Y2VlZGVkAE5vIG1lZGl1bSBmb3VuZABXcm9uZyBtZWRpdW0gdHlwZQBObyBlcnJvciBpbmZvcm1hdGlvbg==";var tempDoublePtr=STATICTOP;STATICTOP+=16;var SYSCALLS={varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function flush_NO_FILESYSTEM(){var fflush=Module["_fflush"];if(fflush)fflush(0);var printChar=___syscall146.printChar;if(!printChar)return;var buffers=___syscall146.buffers;if(buffers[1].length)printChar(1,10);if(buffers[2].length)printChar(2,10)}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;if(!___syscall146.buffers){___syscall146.buffers=[null,[],[]];___syscall146.printChar=(function(stream,curr){var buffer=___syscall146.buffers[stream];assert(buffer);if(curr===0||curr===10){(stream===1?Module["print"]:Module["printErr"])(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}})}for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){___syscall146.printChar(stream,HEAPU8[ptr+j])}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var cttz_i8=allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",ALLOC_STATIC);function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}DYNAMICTOP_PTR=staticAlloc(4);STACK_BASE=STACKTOP=alignMemory(STATICTOP);STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=alignMemory(STACK_MAX);HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;staticSealed=true;var ASSERTIONS=false;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:(function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output});function intArrayFromBase64(s){
		if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){return DecodeBase64(s);}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}function invoke_ii(index,a1){try{return Module["dynCall_ii"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiii(index,a1,a2,a3){try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}Module.asmGlobalArg={"Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array,"NaN":NaN,"Infinity":Infinity};Module.asmLibraryArg={"abort":abort,"assert":assert,"enlargeMemory":enlargeMemory,"getTotalMemory":getTotalMemory,"abortOnCannotGrowMemory":abortOnCannotGrowMemory,"invoke_ii":invoke_ii,"invoke_iiii":invoke_iiii,"___setErrNo":___setErrNo,"___syscall140":___syscall140,"___syscall146":___syscall146,"___syscall54":___syscall54,"___syscall6":___syscall6,"_emscripten_memcpy_big":_emscripten_memcpy_big,"flush_NO_FILESYSTEM":flush_NO_FILESYSTEM,"DYNAMICTOP_PTR":DYNAMICTOP_PTR,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"cttz_i8":cttz_i8};// EMSCRIPTEN_START_ASM
var asm=(/** @suppress {uselessCode} */ function(global,env,buffer) {
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.DYNAMICTOP_PTR|0;var j=env.tempDoublePtr|0;var k=env.ABORT|0;var l=env.STACKTOP|0;var m=env.STACK_MAX|0;var n=env.cttz_i8|0;var o=0;var p=0;var q=0;var r=0;var s=global.NaN,t=global.Infinity;var u=0,v=0,w=0,x=0,y=0.0;var z=0;var A=global.Math.floor;var B=global.Math.abs;var C=global.Math.sqrt;var D=global.Math.pow;var E=global.Math.cos;var F=global.Math.sin;var G=global.Math.tan;var H=global.Math.acos;var I=global.Math.asin;var J=global.Math.atan;var K=global.Math.atan2;var L=global.Math.exp;var M=global.Math.log;var N=global.Math.ceil;var O=global.Math.imul;var P=global.Math.min;var Q=global.Math.max;var R=global.Math.clz32;var S=env.abort;var T=env.assert;var U=env.enlargeMemory;var V=env.getTotalMemory;var W=env.abortOnCannotGrowMemory;var X=env.invoke_ii;var Y=env.invoke_iiii;var Z=env.___setErrNo;var _=env.___syscall140;var $=env.___syscall146;var aa=env.___syscall54;var ba=env.___syscall6;var ca=env._emscripten_memcpy_big;var da=env.flush_NO_FILESYSTEM;var ea=0.0;
// EMSCRIPTEN_START_FUNCS
function ha(a){a=a|0;var b=0;b=l;l=l+a|0;l=l+15&-16;return b|0}function ia(){return l|0}function ja(a){a=a|0;l=a}function ka(a,b){a=a|0;b=b|0;l=a;m=b}function la(a,b){a=a|0;b=b|0;if(!o){o=a;p=b}}function ma(a){a=a|0;z=a}function na(){return z|0}function oa(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;d=d+-1|0;if((d|0)<=-1)return;while(1){i=c[b>>2]|0;h=(i>>>1^i)&572662306;i=h^i;h=i^h<<1;i=(h^i>>>2)&202116108;h=i^h;i=h^i<<2;h=(i^h>>>4)&15728880;i=h^i;h=i^h<<4;i=(h^i>>>8)&65280;g=c[b+4>>2]|0;f=(g>>>1^g)&572662306;g=f^g;f=g^f<<1;g=(f^g>>>2)&202116108;f=g^f;g=f^g<<2;f=(g^f>>>4)&15728880;g=f^g;f=g^f<<4;g=(f^g>>>8)&65280;e=a+4|0;c[a>>2]=((g^f)<<16|i^h&65535)^c[a>>2];c[e>>2]=((i<<8^h)>>>16|g<<8^f&-65536)^c[e>>2];d=d+-1|0;if((d|0)<=-1)break;else{b=b+8|0;a=a+8|0}}return}function pa(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0;i=l;l=l+16|0;h=i;if(!d){d=e>>>3;oa(a,b,d);f=h;c[f>>2]=0;c[f+4>>2]=0;Bb(h|0,b+(e&-8)|0,e&7|0)|0;e=c[h>>2]|0;b=c[h+4>>2]|0;f=(e>>>1^e)&572662306;e=f^e;f=e^f<<1;e=(f^e>>>2)&202116108;f=e^f;e=f^e<<2;f=(e^f>>>4)&15728880;e=f^e;f=e^f<<4;e=(f^e>>>8)&65280;g=(b>>>1^b)&572662306;b=g^b;g=b^g<<1;b=(g^b>>>2)&202116108;g=b^g;b=g^b<<2;g=(b^g>>>4)&15728880;b=g^b;g=b^g<<4;b=(g^b>>>8)&65280;h=d<<1;d=a+(h<<2)|0;c[d>>2]=((b^g)<<16|e^f&65535)^c[d>>2];h=a+((h|1)<<2)|0;c[h>>2]=((e<<8^f)>>>16|b<<8^g&-65536)^c[h>>2];l=i;return}if(!e){l=i;return}o=d&7;f=d>>>3;g=h+4|0;d=8-o|0;d=d>>>0>e>>>0?e:d;m=h;c[m>>2]=0;c[m+4>>2]=0;Bb(h+o|0,b|0,d|0)|0;o=c[h>>2]|0;m=c[g>>2]|0;n=(o>>>1^o)&572662306;o=n^o;n=o^n<<1;o=(n^o>>>2)&202116108;n=o^n;o=n^o<<2;n=(o^n>>>4)&15728880;o=n^o;n=o^n<<4;o=(n^o>>>8)&65280;k=(m>>>1^m)&572662306;m=k^m;k=m^k<<1;m=(k^m>>>2)&202116108;k=m^k;m=k^m<<2;k=(m^k>>>4)&15728880;m=k^m;k=m^k<<4;m=(k^m>>>8)&65280;j=f<<1;p=a+(j<<2)|0;c[p>>2]=((m^k)<<16|o^n&65535)^c[p>>2];j=a+((j|1)<<2)|0;c[j>>2]=((o<<8^n)>>>16|m<<8^k&-65536)^c[j>>2];e=e-d|0;if(!e){l=i;return}b=b+d|0;while(1){f=f+1|0;d=e>>>0<8?e:8;k=h;c[k>>2]=0;c[k+4>>2]=0;Bb(h|0,b|0,d|0)|0;k=c[h>>2]|0;n=c[g>>2]|0;m=(k>>>1^k)&572662306;k=m^k;m=k^m<<1;k=(m^k>>>2)&202116108;m=k^m;k=m^k<<2;m=(k^m>>>4)&15728880;k=m^k;m=k^m<<4;k=(m^k>>>8)&65280;o=(n>>>1^n)&572662306;n=o^n;o=n^o<<1;n=(o^n>>>2)&202116108;o=n^o;n=o^n<<2;o=(n^o>>>4)&15728880;n=o^n;o=n^o<<4;n=(o^n>>>8)&65280;p=f<<1;j=a+(p<<2)|0;c[j>>2]=((n^o)<<16|k^m&65535)^c[j>>2];p=a+((p|1)<<2)|0;c[p>>2]=((k<<8^m)>>>16|n<<8^o&-65536)^c[p>>2];e=e-d|0;if(!e)break;else b=b+d|0}l=i;return}function qa(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;d=d+-1|0;if((d|0)<=-1)return;while(1){g=c[a>>2]|0;i=c[a+4>>2]|0;e=g>>>16;h=(i<<8^g)&65280;g=h^(i<<16|g&65535);h=g^h<<8;g=(h^g>>>4)&15728880;h=g^h;g=h^g<<4;h=(g^h>>>2)&202116108;g=h^g;h=g^h<<2;g=(h^g>>>1)&572662306;f=(i>>>8^e)&65280;e=f^(i&-65536|e);f=e^f<<8;e=(f^e>>>4)&15728880;f=e^f;e=f^e<<4;f=(e^f>>>2)&202116108;e=f^e;f=e^f<<2;e=(f^e>>>1)&572662306;c[b>>2]=g^h^g<<1;c[b+4>>2]=e^f^e<<1;d=d+-1|0;if((d|0)<=-1)break;else{b=b+8|0;a=a+8|0}}return}function ra(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0;i=l;l=l+16|0;h=i;if(!d){j=e>>>3;qa(a,b,j);j=j<<1;f=c[a+(j<<2)>>2]|0;j=c[a+((j|1)<<2)>>2]|0;a=f>>>16;d=(j<<8^f)&65280;f=d^(j<<16|f&65535);d=f^d<<8;f=(d^f>>>4)&15728880;d=f^d;f=d^f<<4;d=(f^d>>>2)&202116108;f=d^f;d=f^d<<2;f=(d^f>>>1)&572662306;g=(j>>>8^a)&65280;a=g^(j&-65536|a);g=a^g<<8;a=(g^a>>>4)&15728880;g=a^g;a=g^a<<4;g=(a^g>>>2)&202116108;a=g^a;g=a^g<<2;a=(g^a>>>1)&572662306;c[h>>2]=f^d^f<<1;c[h+4>>2]=a^g^a<<1;Bb(b+(e&-8)|0,h|0,e&7|0)|0;l=i;return}if(!e){l=i;return}j=d&7;f=d>>>3;g=h+4|0;d=8-j|0;d=d>>>0>e>>>0?e:d;p=f<<1;n=c[a+(p<<2)>>2]|0;p=c[a+((p|1)<<2)>>2]|0;k=n>>>16;o=(p<<8^n)&65280;n=o^(p<<16|n&65535);o=n^o<<8;n=(o^n>>>4)&15728880;o=n^o;n=o^n<<4;o=(n^o>>>2)&202116108;n=o^n;o=n^o<<2;n=(o^n>>>1)&572662306;m=(p>>>8^k)&65280;k=m^(p&-65536|k);m=k^m<<8;k=(m^k>>>4)&15728880;m=k^m;k=m^k<<4;m=(k^m>>>2)&202116108;k=m^k;m=k^m<<2;k=(m^k>>>1)&572662306;c[h>>2]=n^o^n<<1;c[g>>2]=k^m^k<<1;Bb(b|0,h+j|0,d|0)|0;e=e-d|0;if(!e){l=i;return}b=b+d|0;while(1){f=f+1|0;d=e>>>0<8?e:8;k=f<<1;n=c[a+(k<<2)>>2]|0;k=c[a+((k|1)<<2)>>2]|0;p=n>>>16;m=(k<<8^n)&65280;n=m^(k<<16|n&65535);m=n^m<<8;n=(m^n>>>4)&15728880;m=n^m;n=m^n<<4;m=(n^m>>>2)&202116108;n=m^n;m=n^m<<2;n=(m^n>>>1)&572662306;o=(k>>>8^p)&65280;p=o^(k&-65536|p);o=p^o<<8;p=(o^p>>>4)&15728880;o=p^o;p=o^p<<4;o=(p^o>>>2)&202116108;p=o^p;o=p^o<<2;p=(o^p>>>1)&572662306;c[h>>2]=n^m^n<<1;c[g>>2]=p^o^p<<1;Bb(b|0,h|0,d|0)|0;e=e-d|0;if(!e)break;else b=b+d|0}l=i;return}function sa(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0;g=8+(24-b<<1<<2)|0;f=b&255;switch(f&3){case 1:{ha=a+40|0;ja=c[ha>>2]|0;ga=a+44|0;b=c[ga>>2]|0;d=a+80|0;ia=a+84|0;e=c[ia>>2]|0;c[ga>>2]=c[d>>2];c[ha>>2]=e;ha=a+160|0;e=a+164|0;ga=c[e>>2]|0;c[d>>2]=c[ha>>2];c[ia>>2]=ga;ia=a+120|0;ga=a+124|0;d=c[ga>>2]|0;c[e>>2]=c[ia>>2];c[ha>>2]=d;c[ia>>2]=ja;c[ga>>2]=b;ga=a+8|0;b=c[ga>>2]|0;ia=a+12|0;ja=c[ia>>2]|0;ha=a+48|0;d=a+52|0;e=c[d>>2]|0;c[ga>>2]=c[ha>>2];c[ia>>2]=e;ia=a+128|0;e=a+132|0;ga=c[e>>2]|0;c[d>>2]=c[ia>>2];c[ha>>2]=ga;ha=a+88|0;ga=a+92|0;d=c[ga>>2]|0;c[ia>>2]=c[ha>>2];c[e>>2]=d;c[ga>>2]=b;c[ha>>2]=ja;ha=a+16|0;ja=c[ha>>2]|0;ga=a+20|0;b=c[ga>>2]|0;e=a+96|0;d=a+100|0;ia=c[d>>2]|0;c[ga>>2]=c[e>>2];c[ha>>2]=ia;ha=a+56|0;ia=a+60|0;ga=c[ia>>2]|0;c[e>>2]=c[ha>>2];c[d>>2]=ga;d=a+176|0;ga=a+180|0;e=c[ga>>2]|0;c[ia>>2]=c[d>>2];c[ha>>2]=e;c[d>>2]=ja;c[ga>>2]=b;ga=a+136|0;b=c[ga>>2]|0;d=a+140|0;c[ga>>2]=c[d>>2];c[d>>2]=b;d=a+24|0;b=c[d>>2]|0;ga=a+28|0;ja=c[ga>>2]|0;ha=a+144|0;e=a+148|0;ia=c[e>>2]|0;c[ga>>2]=c[ha>>2];c[d>>2]=ia;d=a+184|0;ia=a+188|0;ga=c[ia>>2]|0;c[ha>>2]=c[d>>2];c[e>>2]=ga;e=a+64|0;ga=a+68|0;ha=c[ga>>2]|0;c[ia>>2]=c[e>>2];c[d>>2]=ha;c[e>>2]=b;c[ga>>2]=ja;ga=a+104|0;ja=c[ga>>2]|0;e=a+108|0;c[ga>>2]=c[e>>2];c[e>>2]=ja;e=a+32|0;ja=c[e>>2]|0;ga=a+36|0;b=c[ga>>2]|0;d=a+192|0;ha=a+196|0;ia=c[ha>>2]|0;c[e>>2]=c[d>>2];c[ga>>2]=ia;ga=a+112|0;ia=a+116|0;e=c[ia>>2]|0;c[ha>>2]=c[ga>>2];c[d>>2]=e;d=a+152|0;e=a+156|0;ha=c[e>>2]|0;c[ga>>2]=c[d>>2];c[ia>>2]=ha;c[e>>2]=ja;e=0;ja=5;break}case 2:{d=a+40|0;b=c[d>>2]|0;ga=a+44|0;ja=c[ga>>2]|0;ia=a+160|0;e=a+164|0;ha=c[e>>2]|0;c[ga>>2]=c[ia>>2];c[d>>2]=ha;c[e>>2]=b;c[ia>>2]=ja;ia=a+80|0;ja=c[ia>>2]|0;e=a+84|0;b=c[e>>2]|0;d=a+120|0;ha=a+124|0;ga=c[ha>>2]|0;c[e>>2]=c[d>>2];c[ia>>2]=ga;c[ha>>2]=ja;c[d>>2]=b;d=a+8|0;b=c[d>>2]|0;ha=a+12|0;ja=c[ha>>2]|0;ia=a+128|0;ga=a+132|0;e=c[ga>>2]|0;c[ha>>2]=c[ia>>2];c[d>>2]=e;c[ga>>2]=b;c[ia>>2]=ja;ia=a+48|0;ja=c[ia>>2]|0;ga=a+52|0;b=c[ga>>2]|0;d=a+88|0;e=a+92|0;ha=c[e>>2]|0;c[ga>>2]=c[d>>2];c[ia>>2]=ha;c[e>>2]=ja;c[d>>2]=b;d=a+16|0;b=c[d>>2]|0;e=a+20|0;ja=c[e>>2]|0;ia=a+56|0;ha=a+60|0;ga=c[ha>>2]|0;c[e>>2]=c[ia>>2];c[d>>2]=ga;c[ha>>2]=b;c[ia>>2]=ja;ia=a+96|0;ja=c[ia>>2]|0;ha=a+100|0;b=c[ha>>2]|0;d=a+176|0;ga=a+180|0;e=c[ga>>2]|0;c[ha>>2]=c[d>>2];c[ia>>2]=e;c[ga>>2]=ja;c[d>>2]=b;d=a+24|0;b=c[d>>2]|0;ga=a+28|0;ja=c[ga>>2]|0;ia=a+184|0;e=a+188|0;ha=c[e>>2]|0;c[ga>>2]=c[ia>>2];c[d>>2]=ha;c[e>>2]=b;c[ia>>2]=ja;ia=a+64|0;ja=c[ia>>2]|0;e=a+68|0;b=c[e>>2]|0;d=a+144|0;ha=a+148|0;ga=c[ha>>2]|0;c[e>>2]=c[d>>2];c[ia>>2]=ga;c[ha>>2]=ja;c[d>>2]=b;d=a+32|0;b=c[d>>2]|0;ha=a+36|0;ja=c[ha>>2]|0;ia=a+112|0;ga=a+116|0;e=c[ga>>2]|0;c[ha>>2]=c[ia>>2];c[d>>2]=e;c[ga>>2]=b;c[ia>>2]=ja;ia=a+152|0;ja=c[ia>>2]|0;ga=a+156|0;b=c[ga>>2]|0;d=a+192|0;e=a+196|0;ha=c[e>>2]|0;c[ga>>2]=c[d>>2];c[ia>>2]=ha;c[e>>2]=ja;e=0;ja=5;break}case 3:{ja=a+40|0;e=c[ja>>2]|0;ia=a+44|0;b=c[ia>>2]|0;ha=a+120|0;ga=a+124|0;d=c[ga>>2]|0;c[ja>>2]=c[ha>>2];c[ia>>2]=d;ia=a+160|0;d=a+164|0;ja=c[d>>2]|0;c[ga>>2]=c[ia>>2];c[ha>>2]=ja;ha=a+80|0;ja=a+84|0;ga=c[ja>>2]|0;c[ia>>2]=c[ha>>2];c[d>>2]=ga;c[ja>>2]=e;c[ha>>2]=b;ha=a+8|0;b=c[ha>>2]|0;ja=a+12|0;e=c[ja>>2]|0;d=a+88|0;ga=a+92|0;ia=c[ga>>2]|0;c[ja>>2]=c[d>>2];c[ha>>2]=ia;ha=a+128|0;ia=a+132|0;ja=c[ia>>2]|0;c[d>>2]=c[ha>>2];c[ga>>2]=ja;ga=a+48|0;ja=a+52|0;d=c[ja>>2]|0;c[ia>>2]=c[ga>>2];c[ha>>2]=d;c[ga>>2]=b;c[ja>>2]=e;ja=a+16|0;e=c[ja>>2]|0;ga=a+20|0;b=c[ga>>2]|0;ha=a+176|0;d=a+180|0;ia=c[d>>2]|0;c[ja>>2]=c[ha>>2];c[ga>>2]=ia;ga=a+56|0;ia=a+60|0;ja=c[ia>>2]|0;c[d>>2]=c[ga>>2];c[ha>>2]=ja;ha=a+96|0;ja=a+100|0;d=c[ja>>2]|0;c[ga>>2]=c[ha>>2];c[ia>>2]=d;c[ja>>2]=e;c[ha>>2]=b;ha=a+136|0;b=c[ha>>2]|0;ja=a+140|0;c[ha>>2]=c[ja>>2];c[ja>>2]=b;ja=a+24|0;b=c[ja>>2]|0;ha=a+28|0;e=c[ha>>2]|0;ia=a+64|0;d=a+68|0;ga=c[d>>2]|0;c[ja>>2]=c[ia>>2];c[ha>>2]=ga;ha=a+184|0;ga=a+188|0;ja=c[ga>>2]|0;c[d>>2]=c[ha>>2];c[ia>>2]=ja;ia=a+144|0;ja=a+148|0;d=c[ja>>2]|0;c[ha>>2]=c[ia>>2];c[ga>>2]=d;c[ja>>2]=b;c[ia>>2]=e;ia=a+104|0;e=c[ia>>2]|0;ja=a+108|0;c[ia>>2]=c[ja>>2];c[ja>>2]=e;ja=a+32|0;e=c[ja>>2]|0;ia=a+36|0;b=c[ia>>2]|0;ga=a+152|0;d=a+156|0;ha=c[d>>2]|0;c[ia>>2]=c[ga>>2];c[ja>>2]=ha;ja=a+112|0;ha=a+116|0;ia=c[ha>>2]|0;c[ga>>2]=c[ja>>2];c[d>>2]=ia;d=a+192|0;ia=c[a+196>>2]|0;c[ha>>2]=c[d>>2];c[ja>>2]=ia;c[d>>2]=e;e=1;ja=5;break}default:{}}if((ja|0)==5)c[d+(e<<2)>>2]=b;o=a+32|0;p=a+72|0;q=a+112|0;r=a+152|0;s=a+192|0;t=a+12|0;u=a+52|0;v=a+92|0;w=a+132|0;x=a+172|0;y=a+36|0;z=a+76|0;A=a+116|0;B=a+156|0;C=a+196|0;D=a+8|0;E=a+48|0;F=a+88|0;G=a+128|0;H=a+168|0;I=a+16|0;J=a+56|0;K=a+96|0;L=a+136|0;M=a+176|0;N=a+20|0;O=a+60|0;P=a+100|0;Q=a+140|0;R=a+180|0;S=a+40|0;T=a+80|0;U=a+120|0;V=a+160|0;W=a+4|0;X=a+44|0;Y=a+84|0;Z=a+124|0;_=a+164|0;$=a+28|0;aa=a+68|0;ba=a+108|0;ca=a+148|0;da=a+188|0;ea=a+24|0;fa=a+64|0;ga=a+104|0;ha=a+144|0;ia=a+184|0;b=f;d=g;a:while(1){switch(b&3){case 0:{ma=c[s>>2]|0;e=c[p>>2]^c[o>>2]^c[q>>2]^c[r>>2]^ma;ja=c[u>>2]^c[t>>2]^c[v>>2]^c[w>>2]^c[x>>2];n=(ja<<1|ja>>>31)^e;ka=c[z>>2]^c[y>>2]^c[A>>2]^c[B>>2]^c[C>>2];m=c[E>>2]|0;l=m^c[D>>2]^c[F>>2]^c[G>>2]^c[H>>2];la=l^ka;g=c[J>>2]^c[I>>2]^c[K>>2]^c[L>>2]^c[M>>2];ka=g^(ka<<1|ka>>>31);oa=c[P>>2]|0;b=c[O>>2]^c[N>>2]^oa^c[Q>>2]^c[R>>2];e=b^e;k=c[a>>2]|0;i=c[S>>2]^k^c[T>>2]^c[U>>2]^c[V>>2];b=i^(b<<1|b>>>31);f=c[W>>2]|0;j=c[X>>2]^f^c[Y>>2]^c[Z>>2]^c[_>>2];g=j^g;na=c[ca>>2]|0;pa=c[aa>>2]^c[$>>2]^c[ba>>2]^na^c[da>>2];l=(pa<<1|pa>>>31)^l;h=c[ha>>2]|0;qa=c[fa>>2]^c[ea>>2]^c[ga>>2]^h^c[ia>>2];ja=qa^ja;j=qa^(j<<1|j>>>31);i=pa^i;k=k^n;m=b^m;m=m<<22|m>>>10;oa=ja^oa;oa=oa<<22|oa>>>10;na=na^e;na=na<<11|na>>>21;ma=j^ma;ma=ma<<7|ma>>>25;pa=oa&~m^k;c[a>>2]=pa;c[a>>2]=pa^c[d>>2];c[E>>2]=na&~oa^m;c[P>>2]=ma&~na^oa;c[ca>>2]=k&~ma^na;c[s>>2]=ma^m&~k;f=f^la;k=c[u>>2]^g;k=k<<22|k>>>10;m=c[K>>2]^l;m=m<<21|m>>>11;h=h^ka;h=h<<10|h>>>22;ma=c[C>>2]^i;ma=ma<<7|ma>>>25;na=m&~k^f;c[W>>2]=na;c[W>>2]=na^c[d+4>>2];c[u>>2]=h&~m^k;c[K>>2]=ma&~h^m;c[ha>>2]=f&~ma^h;c[C>>2]=ma^k&~f;f=c[Y>>2]^la;f=f<<2|f>>>30;k=c[w>>2]^g;k=k<<23|k>>>9;ma=c[R>>2]^ja;ma=ma<<31|ma>>>1;h=c[ea>>2]^ka;h=h<<14|h>>>18;m=c[p>>2]^j;m=m<<10|m>>>22;c[Y>>2]=f&~m^h;c[w>>2]=m^k&~f;c[R>>2]=ma&~k^f;c[ea>>2]=h&~ma^k;c[p>>2]=m&~h^ma;ma=c[T>>2]^n;ma=ma<<1|ma>>>31;h=c[G>>2]^b;h=h<<22|h>>>10;m=c[M>>2]^l;m=m<<30|m>>>2;k=c[$>>2]^e;k=k<<14|k>>>18;f=c[z>>2]^i;f=f<<10|f>>>22;c[T>>2]=ma&~f^k;c[G>>2]=f^h&~ma;c[M>>2]=m&~h^ma;c[$>>2]=k&~m^h;c[z>>2]=f&~k^m;m=c[V>>2]^n;m=m<<9|m>>>23;k=c[t>>2]^g;k=k<<1|k>>>31;f=c[J>>2]^l;f=f<<3|f>>>29;h=c[ba>>2]^e;h=h<<13|h>>>19;ma=c[r>>2]^j;ma=ma<<4|ma>>>28;c[V>>2]=h&~f^k;c[t>>2]=ma&~h^f;c[J>>2]=m&~ma^h;c[ba>>2]=ma^k&~m;c[r>>2]=f&~k^m;m=c[_>>2]^la;m=m<<9|m>>>23;k=c[D>>2]^b;f=c[O>>2]^ja;f=f<<3|f>>>29;ma=c[ga>>2]^ka;ma=ma<<12|ma>>>20;h=c[B>>2]^i;h=h<<4|h>>>28;c[_>>2]=ma&~f^k;c[D>>2]=h&~ma^f;c[O>>2]=m&~h^ma;c[ga>>2]=h^k&~m;c[B>>2]=f&~k^m;m=c[S>>2]^n;m=m<<18|m>>>14;k=c[F>>2]^b;k=k<<5|k>>>27;f=c[Q>>2]^ja;f=f<<8|f>>>24;h=c[ia>>2]^ka;h=h<<28|h>>>4;ma=c[y>>2]^i;ma=ma<<14|ma>>>18;c[S>>2]=ma^k&~m;c[F>>2]=f&~k^m;c[Q>>2]=h&~f^k;c[ia>>2]=ma&~h^f;c[y>>2]=m&~ma^h;h=c[X>>2]^la;h=h<<18|h>>>14;ma=c[v>>2]^g;ma=ma<<5|ma>>>27;m=c[L>>2]^l;m=m<<7|m>>>25;f=c[da>>2]^e;f=f<<28|f>>>4;k=c[o>>2]^j;k=k<<13|k>>>19;c[X>>2]=k^ma&~h;c[v>>2]=m&~ma^h;c[L>>2]=f&~m^ma;m=k&~f^m;c[da>>2]=m;f=h&~k^f;c[o>>2]=f;la=c[Z>>2]^la;la=la<<21|la>>>11;b=c[H>>2]^b;b=b<<1|b>>>31;l=c[I>>2]^l;l=l<<31|l>>>1;e=c[aa>>2]^e;e=e<<28|e>>>4;i=c[A>>2]^i;i=i<<20|i>>>12;k=i&~e^l;c[Z>>2]=k;h=la&~i^e;c[H>>2]=h;i=i^b&~la;c[I>>2]=i;c[aa>>2]=l&~b^la;b=e&~l^b;c[A>>2]=b;n=c[U>>2]^n;n=n<<20|n>>>12;g=c[x>>2]^g;g=g<<1|g>>>31;ja=c[N>>2]^ja;ja=ja<<31|ja>>>1;ka=c[fa>>2]^ka;ka=ka<<27|ka>>>5;j=c[q>>2]^j;j=j<<19|j>>>13;l=j&~ka^ja;c[U>>2]=l;e=n&~j^ka;c[x>>2]=e;j=j^g&~n;c[N>>2]=j;n=ja&~g^n;c[fa>>2]=n;g=ka&~ja^g;c[q>>2]=g;d=d+8|0;ja=12;break}case 3:{b=c[A>>2]|0;e=c[x>>2]|0;f=c[o>>2]|0;g=c[q>>2]|0;h=c[H>>2]|0;i=c[I>>2]|0;j=c[N>>2]|0;k=c[Z>>2]|0;l=c[U>>2]|0;m=c[da>>2]|0;n=c[fa>>2]|0;ja=12;break}case 2:{b=c[B>>2]|0;e=c[x>>2]|0;f=c[s>>2]|0;g=c[r>>2]|0;h=c[H>>2]|0;i=c[P>>2]|0;j=c[K>>2]|0;k=c[X>>2]|0;l=c[S>>2]|0;m=c[fa>>2]|0;n=c[ea>>2]|0;ja=13;break}case 1:{n=d;b=c[o>>2]|0;d=c[x>>2]|0;e=c[A>>2]|0;f=c[y>>2]|0;g=c[H>>2]|0;h=c[O>>2]|0;i=c[J>>2]|0;j=c[T>>2]|0;k=c[Y>>2]|0;l=c[ea>>2]|0;m=c[ca>>2]|0;break}default:{ja=15;break a}}if((ja|0)==12){na=c[p>>2]^c[s>>2]^c[r>>2]^c[y>>2]^b;qa=c[G>>2]^c[u>>2]^c[D>>2]^c[v>>2]^e;e=(qa<<1|qa>>>31)^na;pa=c[z>>2]^c[C>>2]^c[B>>2]^f^g;ma=c[w>>2]|0;ra=ma^c[E>>2]^c[t>>2]^c[F>>2]^h;oa=ra^pa;g=c[R>>2]^c[P>>2]^c[J>>2]^c[Q>>2]^i;pa=g^(pa<<1|pa>>>31);la=c[O>>2]|0;f=c[M>>2]^c[K>>2]^la^c[L>>2]^j;h=f^na;na=c[a>>2]|0;i=c[Y>>2]^na^c[V>>2]^c[S>>2]^k;k=i^(f<<1|f>>>31);f=c[W>>2]|0;j=c[T>>2]^f^c[_>>2]^c[X>>2]^l;g=j^g;ka=c[$>>2]^c[ha>>2]^c[ga>>2]^m^n;n=(ka<<1|ka>>>31)^ra;l=c[ia>>2]|0;ra=c[ea>>2]^c[ca>>2]^c[ba>>2]^l^c[aa>>2];qa=ra^qa;j=ra^(j<<1|j>>>31);i=ka^i;na=na^e;ma=k^ma;ma=ma<<22|ma>>>10;la=qa^la;la=la<<22|la>>>10;m=m^h;m=m<<11|m>>>21;b=j^b;b=b<<7|b>>>25;ka=la&~ma^na;c[a>>2]=ka;c[a>>2]=ka^c[d>>2];c[w>>2]=m&~la^ma;c[O>>2]=b&~m^la;c[da>>2]=na&~b^m;c[A>>2]=b^ma&~na;f=f^oa;b=c[G>>2]^g;b=b<<22|b>>>10;m=c[J>>2]^n;m=m<<21|m>>>11;l=l^pa;l=l<<10|l>>>22;na=c[q>>2]^i;na=na<<7|na>>>25;ma=m&~b^f;c[W>>2]=ma;c[W>>2]=ma^c[d+4>>2];c[G>>2]=l&~m^b;c[J>>2]=na&~l^m;c[ia>>2]=f&~na^l;c[q>>2]=na^b&~f;f=c[_>>2]^oa;f=f<<2|f>>>30;b=c[v>>2]^g;b=b<<23|b>>>9;na=c[N>>2]^qa;na=na<<31|na>>>1;l=c[ca>>2]^pa;l=l<<14|l>>>18;m=c[p>>2]^j;m=m<<10|m>>>22;c[_>>2]=f&~m^l;c[v>>2]=m^b&~f;c[N>>2]=na&~b^f;c[ca>>2]=l&~na^b;c[p>>2]=m&~l^na;na=c[V>>2]^e;na=na<<1|na>>>31;l=c[F>>2]^k;l=l<<22|l>>>10;m=c[I>>2]^n;m=m<<30|m>>>2;b=c[ha>>2]^h;b=b<<14|b>>>18;f=c[z>>2]^i;f=f<<10|f>>>22;c[V>>2]=na&~f^b;c[F>>2]=f^l&~na;c[I>>2]=m&~l^na;c[ha>>2]=b&~m^l;c[z>>2]=f&~b^m;m=c[Z>>2]^e;m=m<<9|m>>>23;b=c[u>>2]^g;b=b<<1|b>>>31;f=c[R>>2]^n;f=f<<3|f>>>29;l=c[ga>>2]^h;l=l<<13|l>>>19;na=c[y>>2]^j;na=na<<4|na>>>28;c[Z>>2]=l&~f^b;c[u>>2]=na&~l^f;c[R>>2]=m&~na^l;c[ga>>2]=na^b&~m;c[y>>2]=f&~b^m;m=c[U>>2]^oa;m=m<<9|m>>>23;b=c[E>>2]^k;f=c[M>>2]^qa;f=f<<3|f>>>29;na=c[ba>>2]^pa;na=na<<12|na>>>20;l=c[o>>2]^i;l=l<<4|l>>>28;c[U>>2]=na&~f^b;c[E>>2]=l&~na^f;c[M>>2]=m&~l^na;c[ba>>2]=l^b&~m;c[o>>2]=f&~b^m;m=c[Y>>2]^e;m=m<<18|m>>>14;b=c[t>>2]^k;b=b<<5|b>>>27;f=c[L>>2]^qa;f=f<<8|f>>>24;l=c[aa>>2]^pa;l=l<<28|l>>>4;na=c[C>>2]^i;na=na<<14|na>>>18;c[Y>>2]=na^b&~m;c[t>>2]=f&~b^m;c[L>>2]=l&~f^b;c[aa>>2]=na&~l^f;c[C>>2]=m&~na^l;l=c[T>>2]^oa;l=l<<18|l>>>14;na=c[D>>2]^g;na=na<<5|na>>>27;m=c[Q>>2]^n;m=m<<7|m>>>25;f=c[fa>>2]^h;f=f<<28|f>>>4;b=c[s>>2]^j;b=b<<13|b>>>19;c[T>>2]=b^na&~l;c[D>>2]=m&~na^l;c[Q>>2]=f&~m^na;m=b&~f^m;c[fa>>2]=m;f=l&~b^f;c[s>>2]=f;oa=c[X>>2]^oa;oa=oa<<21|oa>>>11;b=c[H>>2]^k;b=b<<1|b>>>31;n=c[P>>2]^n;n=n<<31|n>>>1;l=c[$>>2]^h;l=l<<28|l>>>4;i=c[B>>2]^i;i=i<<20|i>>>12;k=i&~l^n;c[X>>2]=k;h=oa&~i^l;c[H>>2]=h;i=i^b&~oa;c[P>>2]=i;c[$>>2]=n&~b^oa;b=l&~n^b;c[B>>2]=b;n=c[S>>2]^e;n=n<<20|n>>>12;g=c[x>>2]^g;g=g<<1|g>>>31;qa=c[K>>2]^qa;qa=qa<<31|qa>>>1;pa=c[ea>>2]^pa;pa=pa<<27|pa>>>5;j=c[r>>2]^j;j=j<<19|j>>>13;l=j&~pa^qa;c[S>>2]=l;e=n&~j^pa;c[x>>2]=e;j=j^g&~n;c[K>>2]=j;n=qa&~g^n;c[ea>>2]=n;g=pa&~qa^g;c[r>>2]=g;d=d+8|0;ja=13}if((ja|0)==13){ja=0;la=c[p>>2]^c[A>>2]^c[y>>2]^c[C>>2]^b;sa=c[F>>2]^c[G>>2]^c[E>>2]^c[D>>2]^e;ra=(sa<<1|sa>>>31)^la;qa=c[z>>2]^c[q>>2]^c[o>>2]^f^g;na=c[v>>2]|0;oa=na^c[w>>2]^c[u>>2]^c[t>>2]^h;pa=oa^qa;f=c[N>>2]^c[O>>2]^c[R>>2]^c[L>>2]^i;qa=f^(qa<<1|qa>>>31);ma=c[M>>2]|0;g=c[I>>2]^c[J>>2]^ma^c[Q>>2]^j;j=g^la;la=c[a>>2]|0;h=c[_>>2]^la^c[Z>>2]^c[Y>>2]^k;g=h^(g<<1|g>>>31);e=c[W>>2]|0;i=c[V>>2]^e^c[U>>2]^c[T>>2]^l;f=i^f;l=c[ha>>2]^c[ia>>2]^c[ba>>2]^m^n;k=(l<<1|l>>>31)^oa;oa=c[aa>>2]|0;ka=c[ca>>2]^c[da>>2]^c[ga>>2]^oa^c[$>>2];n=ka^sa;i=ka^(i<<1|i>>>31);h=l^h;l=la^ra;na=g^na;na=na<<22|na>>>10;ma=n^ma;ma=ma<<22|ma>>>10;m=m^j;m=m<<11|m>>>21;b=i^b;b=b<<7|b>>>25;la=ma&~na^l;c[a>>2]=la;c[a>>2]=la^c[d>>2];c[v>>2]=m&~ma^na;c[M>>2]=b&~m^ma;c[fa>>2]=l&~b^m;c[B>>2]=b^na&~l;e=e^pa;b=c[F>>2]^f;b=b<<22|b>>>10;l=c[R>>2]^k;l=l<<21|l>>>11;m=oa^qa;m=m<<10|m>>>22;oa=c[r>>2]^h;oa=oa<<7|oa>>>25;na=l&~b^e;c[W>>2]=na;c[W>>2]=na^c[d+4>>2];c[F>>2]=m&~l^b;c[R>>2]=oa&~m^l;c[aa>>2]=e&~oa^m;c[r>>2]=oa^b&~e;e=c[U>>2]^pa;e=e<<2|e>>>30;b=c[D>>2]^f;b=b<<23|b>>>9;oa=c[K>>2]^n;oa=oa<<31|oa>>>1;m=c[da>>2]^qa;m=m<<14|m>>>18;l=c[p>>2]^i;l=l<<10|l>>>22;c[U>>2]=e&~l^m;c[D>>2]=l^b&~e;c[K>>2]=oa&~b^e;c[da>>2]=m&~oa^b;c[p>>2]=l&~m^oa;oa=c[Z>>2]^ra;oa=oa<<1|oa>>>31;m=c[t>>2]^g;m=m<<22|m>>>10;l=c[P>>2]^k;l=l<<30|l>>>2;b=c[ia>>2]^j;b=b<<14|b>>>18;e=c[z>>2]^h;e=e<<10|e>>>22;c[Z>>2]=oa&~e^b;c[t>>2]=e^m&~oa;c[P>>2]=l&~m^oa;c[ia>>2]=b&~l^m;c[z>>2]=e&~b^l;l=c[X>>2]^ra;l=l<<9|l>>>23;b=c[G>>2]^f;b=b<<1|b>>>31;e=c[N>>2]^k;e=e<<3|e>>>29;m=c[ba>>2]^j;m=m<<13|m>>>19;oa=c[C>>2]^i;oa=oa<<4|oa>>>28;c[X>>2]=m&~e^b;c[G>>2]=oa&~m^e;c[N>>2]=l&~oa^m;c[ba>>2]=oa^b&~l;c[C>>2]=e&~b^l;l=c[S>>2]^pa;l=l<<9|l>>>23;b=c[w>>2]^g;e=c[I>>2]^n;e=e<<3|e>>>29;oa=c[ga>>2]^qa;oa=oa<<12|oa>>>20;m=c[s>>2]^h;m=m<<4|m>>>28;c[S>>2]=oa&~e^b;c[w>>2]=m&~oa^e;c[I>>2]=l&~m^oa;c[ga>>2]=m^b&~l;c[s>>2]=e&~b^l;l=c[_>>2]^ra;l=l<<18|l>>>14;b=c[u>>2]^g;b=b<<5|b>>>27;e=c[Q>>2]^n;e=e<<8|e>>>24;m=c[$>>2]^qa;m=m<<28|m>>>4;oa=c[q>>2]^h;oa=oa<<14|oa>>>18;c[_>>2]=oa^b&~l;c[u>>2]=e&~b^l;c[Q>>2]=m&~e^b;c[$>>2]=oa&~m^e;c[q>>2]=l&~oa^m;m=c[V>>2]^pa;m=m<<18|m>>>14;oa=c[E>>2]^f;oa=oa<<5|oa>>>27;l=c[L>>2]^k;l=l<<7|l>>>25;e=c[ea>>2]^j;e=e<<28|e>>>4;b=c[A>>2]^i;b=b<<13|b>>>19;c[V>>2]=b^oa&~m;c[E>>2]=l&~oa^m;c[L>>2]=e&~l^oa;l=b&~e^l;c[ea>>2]=l;e=m&~b^e;c[A>>2]=e;pa=c[T>>2]^pa;pa=pa<<21|pa>>>11;b=c[H>>2]^g;b=b<<1|b>>>31;m=c[O>>2]^k;m=m<<31|m>>>1;k=c[ha>>2]^j;k=k<<28|k>>>4;h=c[o>>2]^h;h=h<<20|h>>>12;j=h&~k^m;c[T>>2]=j;g=pa&~h^k;c[H>>2]=g;h=h^b&~pa;c[O>>2]=h;c[ha>>2]=m&~b^pa;b=k&~m^b;c[o>>2]=b;m=c[Y>>2]^ra;m=m<<20|m>>>12;f=c[x>>2]^f;f=f<<1|f>>>31;n=c[J>>2]^n;n=n<<31|n>>>1;qa=c[ca>>2]^qa;qa=qa<<27|qa>>>5;i=c[y>>2]^i;i=i<<19|i>>>13;k=i&~qa^n;c[Y>>2]=k;ra=m&~i^qa;c[x>>2]=ra;i=i^f&~m;c[J>>2]=i;m=n&~f^m;c[ca>>2]=m;f=qa&~n^f;c[y>>2]=f;n=d+8|0;d=ra}la=c[p>>2]^c[B>>2]^c[C>>2]^c[q>>2]^b;ra=c[t>>2]^c[F>>2]^c[w>>2]^c[E>>2]^d;pa=(ra<<1|ra>>>31)^la;qa=c[z>>2]^c[r>>2]^c[s>>2]^e^f;f=c[D>>2]|0;ma=f^c[v>>2]^c[G>>2]^c[u>>2]^g;ka=ma^qa;sa=c[K>>2]^c[M>>2]^c[N>>2]^c[Q>>2]^h;qa=sa^(qa<<1|qa>>>31);d=c[I>>2]|0;na=c[P>>2]^c[R>>2]^d^c[L>>2]^i;la=na^la;h=c[a>>2]|0;g=c[U>>2]^h^c[X>>2]^c[_>>2]^j;na=g^(na<<1|na>>>31);i=c[W>>2]|0;oa=c[Z>>2]^i^c[S>>2]^c[V>>2]^k;sa=oa^sa;m=c[ia>>2]^c[aa>>2]^c[ga>>2]^l^m;ma=(m<<1|m>>>31)^ma;j=c[$>>2]|0;k=c[da>>2]^c[fa>>2]^c[ba>>2]^j^c[ha>>2];ra=k^ra;oa=k^(oa<<1|oa>>>31);m=m^g;h=h^pa;k=na^f;k=k<<22|k>>>10;d=ra^d;d=d<<22|d>>>10;g=l^la;g=g<<11|g>>>21;l=oa^b;l=l<<7|l>>>25;f=d&~k^h;c[a>>2]=f;c[a>>2]=f^c[n>>2];c[D>>2]=g&~d^k;c[I>>2]=l&~g^d;c[ea>>2]=h&~l^g;c[o>>2]=l^k&~h;l=i^ka;i=c[t>>2]^sa;i=i<<22|i>>>10;h=c[N>>2]^ma;h=h<<21|h>>>11;j=j^qa;j=j<<10|j>>>22;k=c[y>>2]^m;k=k<<7|k>>>25;g=h&~i^l;c[W>>2]=g;d=n+8|0;c[W>>2]=g^c[n+4>>2];c[t>>2]=j&~h^i;c[N>>2]=k&~j^h;c[$>>2]=l&~k^j;c[y>>2]=k^i&~l;n=c[S>>2]^ka;n=n<<2|n>>>30;l=c[E>>2]^sa;l=l<<23|l>>>9;i=c[J>>2]^ra;i=i<<31|i>>>1;k=c[fa>>2]^qa;k=k<<14|k>>>18;j=c[p>>2]^oa;j=j<<10|j>>>22;c[S>>2]=n&~j^k;c[E>>2]=j^l&~n;c[J>>2]=i&~l^n;c[fa>>2]=k&~i^l;c[p>>2]=j&~k^i;i=c[X>>2]^pa;i=i<<1|i>>>31;k=c[u>>2]^na;k=k<<22|k>>>10;j=c[O>>2]^ma;j=j<<30|j>>>2;l=c[aa>>2]^la;l=l<<14|l>>>18;n=c[z>>2]^m;n=n<<10|n>>>22;c[X>>2]=i&~n^l;c[u>>2]=n^k&~i;c[O>>2]=j&~k^i;c[aa>>2]=l&~j^k;c[z>>2]=n&~l^j;j=c[T>>2]^pa;j=j<<9|j>>>23;l=c[F>>2]^sa;l=l<<1|l>>>31;n=c[K>>2]^ma;n=n<<3|n>>>29;k=c[ga>>2]^la;k=k<<13|k>>>19;i=c[q>>2]^oa;i=i<<4|i>>>28;c[T>>2]=k&~n^l;c[F>>2]=i&~k^n;c[K>>2]=j&~i^k;c[ga>>2]=i^l&~j;c[q>>2]=n&~l^j;j=c[Y>>2]^ka;j=j<<9|j>>>23;l=c[v>>2]^na;n=c[P>>2]^ra;n=n<<3|n>>>29;i=c[ba>>2]^qa;i=i<<12|i>>>20;k=c[A>>2]^m;k=k<<4|k>>>28;c[Y>>2]=i&~n^l;c[v>>2]=k&~i^n;c[P>>2]=j&~k^i;c[ba>>2]=k^l&~j;c[A>>2]=n&~l^j;j=c[U>>2]^pa;j=j<<18|j>>>14;l=c[G>>2]^na;l=l<<5|l>>>27;n=c[L>>2]^ra;n=n<<8|n>>>24;k=c[ha>>2]^qa;k=k<<28|k>>>4;i=c[r>>2]^m;i=i<<14|i>>>18;c[U>>2]=i^l&~j;c[G>>2]=n&~l^j;c[L>>2]=k&~n^l;c[ha>>2]=i&~k^n;c[r>>2]=j&~i^k;k=c[Z>>2]^ka;k=k<<18|k>>>14;i=c[w>>2]^sa;i=i<<5|i>>>27;j=c[Q>>2]^ma;j=j<<7|j>>>25;n=c[ca>>2]^la;n=n<<28|n>>>4;l=c[B>>2]^oa;l=l<<13|l>>>19;c[Z>>2]=l^i&~k;c[w>>2]=j&~i^k;c[Q>>2]=n&~j^i;c[ca>>2]=l&~n^j;c[B>>2]=k&~l^n;ka=c[V>>2]^ka;ka=ka<<21|ka>>>11;na=c[H>>2]^na;na=na<<1|na>>>31;ma=c[M>>2]^ma;ma=ma<<31|ma>>>1;la=c[ia>>2]^la;la=la<<28|la>>>4;n=c[s>>2]^m;n=n<<20|n>>>12;c[V>>2]=n&~la^ma;c[H>>2]=ka&~n^la;c[M>>2]=n^na&~ka;c[ia>>2]=ma&~na^ka;c[s>>2]=la&~ma^na;pa=c[_>>2]^pa;pa=pa<<20|pa>>>12;sa=c[x>>2]^sa;sa=sa<<1|sa>>>31;ra=c[R>>2]^ra;ra=ra<<31|ra>>>1;qa=c[da>>2]^qa;qa=qa<<27|qa>>>5;oa=c[C>>2]^oa;oa=oa<<19|oa>>>13;c[_>>2]=oa&~qa^ra;c[x>>2]=pa&~oa^qa;c[R>>2]=oa^sa&~pa;c[da>>2]=ra&~sa^pa;c[C>>2]=qa&~ra^sa;if((c[d>>2]|0)==255){ja=16;break}else b=0}if((ja|0)!=15)if((ja|0)==16)return}function ta(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;r=l;l=l+16|0;p=r;e=c[a+200>>2]|0;q=e>>>3;if(c[a+208>>2]|0){q=1;l=r;return q|0}if(!d){q=0;l=r;return q|0}o=a+204|0;i=e>>>6;j=q&536870904;k=q&7;h=p+4|0;n=i<<1;m=a+(n<<2)|0;n=a+((n|1)<<2)|0;e=b;f=0;while(1){g=c[o>>2]|0;b=d-f|0;if((f+q|0)>>>0>d>>>0|(g|0)!=0){s=(g+b|0)>>>0>q>>>0?q-g|0:b;b=s+f|0;pa(a,e,g,s);e=e+s|0;g=(c[o>>2]|0)+s|0;c[o>>2]=g;if((g|0)==(q|0)){sa(a,12);c[o>>2]=0}}else{if(b>>>0>=q>>>0)do{oa(a,e,i);t=p;c[t>>2]=0;c[t+4>>2]=0;Bb(p|0,e+j|0,k|0)|0;t=c[p>>2]|0;g=c[h>>2]|0;f=(t>>>1^t)&572662306;t=f^t;f=t^f<<1;t=(f^t>>>2)&202116108;f=t^f;t=f^t<<2;f=(t^f>>>4)&15728880;t=f^t;f=t^f<<4;t=(f^t>>>8)&65280;s=(g>>>1^g)&572662306;g=s^g;s=g^s<<1;g=(s^g>>>2)&202116108;s=g^s;g=s^g<<2;s=(g^s>>>4)&15728880;g=s^g;s=g^s<<4;g=(s^g>>>8)&65280;c[m>>2]=((g^s)<<16|t^f&65535)^c[m>>2];c[n>>2]=((t<<8^f)>>>16|g<<8^s&-65536)^c[n>>2];sa(a,12);e=e+q|0;b=b-q|0}while(b>>>0>=q>>>0);b=d-b|0}if(b>>>0<d>>>0)f=b;else{e=0;break}}l=r;return e|0}function ua(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=(c[a+200>>2]|0)>>>3;if(!(b<<24>>24)){f=1;return f|0}e=a+208|0;if(c[e>>2]|0){f=1;return f|0}f=a+204|0;g=c[f>>2]|0;k=g&7;h=k>>>0<4;j=b&255;k=k<<3;i=h?0:j<<k+-32;k=h?j<<k:0;j=(k>>>1^k)&572662306;k=j^k;j=k^j<<1;k=(j^k>>>2)&202116108;j=k^j;k=j^k<<2;j=(k^j>>>4)&15728880;k=j^k;j=k^j<<4;k=(j^k>>>8)&65280;h=(i>>>1^i)&572662306;i=h^i;h=i^h<<1;i=(h^i>>>2)&202116108;h=i^h;i=h^i<<2;h=(i^h>>>4)&15728880;i=h^i;h=i^h<<4;i=(h^i>>>8)&65280;g=g>>>3<<1;l=a+(g<<2)|0;c[l>>2]=((i^h)<<16|k^j&65535)^c[l>>2];g=a+((g|1)<<2)|0;c[g>>2]=((k<<8^j)>>>16|i<<8^h&-65536)^c[g>>2];if(b<<24>>24<0){b=d+-1|0;if((c[f>>2]|0)==(b|0))sa(a,12)}else b=d+-1|0;h=b&7;i=h>>>0<4;h=h<<3;j=i?0:128<<h+-32;h=i?128<<h:0;i=(h>>>1^h)&572662306;h=i^h;i=h^i<<1;h=(i^h>>>2)&202116108;i=h^i;h=i^h<<2;i=(h^i>>>4)&15728880;h=i^h;i=h^i<<4;h=(i^h>>>8)&65280;k=(j>>>1^j)&572662306;j=k^j;k=j^k<<1;j=(k^j>>>2)&202116108;k=j^k;j=k^j<<2;k=(j^k>>>4)&15728880;j=k^j;k=j^k<<4;j=(k^j>>>8)&65280;l=b>>>3<<1;g=a+(l<<2)|0;c[g>>2]=c[g>>2]^((j^k)<<16|h^i&65535);l=a+((l|1)<<2)|0;c[l>>2]=c[l>>2]^((h<<8^i)>>>16|j<<8^k&-65536);sa(a,12);c[f>>2]=0;c[e>>2]=1;l=0;return l|0}function va(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;q=l;l=l+16|0;o=q;e=c[a+200>>2]|0;p=e>>>3;if(!(c[a+208>>2]|0))ua(a,1)|0;if(!d){l=q;return 0}n=a+204|0;h=e>>>6;i=p&536870904;j=p&7;m=h<<1;k=a+(m<<2)|0;m=a+((m|1)<<2)|0;g=o+4|0;e=0;f=b;do{b=c[n>>2]|0;if((e+p|0)>>>0>d>>>0|(b|0)!=(p|0)){if((b|0)==(p|0)){sa(a,12);c[n>>2]=0;b=0}r=d-e|0;r=(b+r|0)>>>0>p>>>0?p-b|0:r;ra(a,f,b,r);c[n>>2]=r+(c[n>>2]|0);f=f+r|0;e=r+e|0}else{e=d-e|0;if(e>>>0<p>>>0){b=e;e=f}else{b=e;e=f;do{sa(a,12);qa(a,e,h);s=c[k>>2]|0;u=c[m>>2]|0;r=s>>>16;t=(u<<8^s)&65280;s=t^(u<<16|s&65535);t=s^t<<8;s=(t^s>>>4)&15728880;t=s^t;s=t^s<<4;t=(s^t>>>2)&202116108;s=t^s;t=s^t<<2;s=(t^s>>>1)&572662306;f=(u>>>8^r)&65280;r=f^(u&-65536|r);f=r^f<<8;r=(f^r>>>4)&15728880;f=r^f;r=f^r<<4;f=(r^f>>>2)&202116108;r=f^r;f=r^f<<2;r=(f^r>>>1)&572662306;c[o>>2]=s^t^s<<1;c[g>>2]=r^f^r<<1;Bb(e+i|0,o|0,j|0)|0;e=e+p|0;b=b-p|0}while(b>>>0>=p>>>0)}f=e;e=d-b|0}}while(e>>>0<d>>>0);l=q;return 0}function wa(a,b){a=a|0;b=b|0;c[a+428>>2]=b;c[a+436>>2]=0;c[a+432>>2]=0;c[a+440>>2]=1;Cb(a+216|0,0,200)|0;c[a+416>>2]=1344;c[a+420>>2]=0;c[a+424>>2]=0;return 0}function xa(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0;o=l;l=l+32|0;m=o;if((c[b+440>>2]|0)!=1){n=1;l=o;return n|0}n=b+432|0;k=b+436|0;f=c[k>>2]|0;do if(!(c[n>>2]|0)){g=8192-f|0;g=g>>>0>e>>>0?e:g;h=b+216|0;if(ta(h,d,g)|0){n=1;l=o;return n|0}f=d+g|0;e=e-g|0;j=(c[k>>2]|0)+g|0;c[k>>2]=j;if((e|0)!=0&(j|0)==8192){a[m>>0]=3;c[k>>2]=0;c[n>>2]=1;if(!(ta(h,m,1)|0)){j=b+420|0;c[j>>2]=(c[j>>2]|0)+7&-8;break}n=1;l=o;return n|0}else i=15}else if(f){g=8192-f|0;g=g>>>0>e>>>0?e:g;if(ta(b,d,g)|0){n=1;l=o;return n|0}f=d+g|0;e=e-g|0;j=(c[k>>2]|0)+g|0;c[k>>2]=j;if((j|0)==8192){c[k>>2]=0;c[n>>2]=(c[n>>2]|0)+1;if((ua(b,11)|0)==0?(va(b,m,32)|0,(ta(b+216|0,m,32)|0)==0):0){i=15;break}n=1;l=o;return n|0}else i=15}else{f=d;i=15}while(0);if((i|0)==15)if(!e){n=0;l=o;return n|0}d=b+200|0;h=b+204|0;i=b+208|0;j=b+216|0;while(1){g=e>>>0<8192?e:8192;Cb(b|0,0,200)|0;c[d>>2]=1344;c[h>>2]=0;c[i>>2]=0;if(ta(b,f,g)|0){e=1;i=25;break}f=f+g|0;if(e>>>0>8191){c[n>>2]=(c[n>>2]|0)+1;if(ua(b,11)|0){i=21;break}va(b,m,32)|0;if(ta(j,m,32)|0){i=21;break}}else c[k>>2]=g;e=e-g|0;if(!e){e=0;i=25;break}}if((i|0)==21){n=1;l=o;return n|0}else if((i|0)==25){l=o;return e|0}return 0}function ya(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0;k=l;l=l+48|0;i=k+32|0;h=k;j=b+440|0;if((c[j>>2]|0)!=1){j=1;l=k;return j|0}if(!f)e=0;else{if(!(xa(b,e,f)|0)){e=0;g=f}else{j=1;l=k;return j|0}do{e=e+1|0;g=g>>>8}while((g|0)!=0&e>>>0<4);g=1;do{a[i+(g+-1)>>0]=f>>>(e-g<<3);g=g+1|0}while(e>>>0>=g>>>0)}a[i+e>>0]=e;if(xa(b,i,e+1|0)|0){j=1;l=k;return j|0}g=b+432|0;e=c[g>>2]|0;if(e){do if(c[b+436>>2]|0){c[g>>2]=e+1;if((ua(b,11)|0)==0?(va(b,h,32)|0,(ta(b+216|0,h,32)|0)==0):0){e=c[g>>2]|0;break}j=1;l=k;return j|0}while(0);f=e+-1|0;c[g>>2]=f;if(!f)e=0;else{e=0;g=f;do{e=e+1|0;g=g>>>8}while((g|0)!=0&e>>>0<4);g=1;do{a[i+(g+-1)>>0]=f>>>(e-g<<3);g=g+1|0}while(e>>>0>=g>>>0)}a[i+e>>0]=e;a[i+(e+1)>>0]=-1;a[i+(e+2)>>0]=-1;g=b+216|0;if(!(ta(g,i,e+3|0)|0))e=6;else{j=1;l=k;return j|0}}else{e=7;g=b+216|0}if(ua(g,e)|0){j=1;l=k;return j|0}e=c[b+428>>2]|0;if(!e){c[j>>2]=3;j=0;l=k;return j|0}else{c[j>>2]=2;va(g,d,e)|0;j=0;l=k;return j|0}return 0}function za(a,b,d){a=a|0;b=b|0;d=d|0;if((c[a+440>>2]|0)!=3){d=1;return d|0}va(a+216|0,b,d)|0;d=0;return d|0}function Aa(){return Ea(448)|0}function Ba(a){a=a|0;if(!a){a=0;return a|0}a=(c[a+440>>2]|0)==3&1;return a|0}function Ca(a){a=a|0;if(!a){a=0;return a|0}a=(c[a+440>>2]|0)==1&1;return a|0}function Da(a){a=a|0;var b=0,d=0,e=0;d=l;l=l+16|0;e=d;b=a+440|0;c[e>>2]=c[b>>2];qb(576,e)|0;if(!a){e=0;l=d;return e|0}e=c[b>>2]|0;l=d;return e|0}function Ea(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;x=l;l=l+16|0;p=x;do if(a>>>0<245){m=a>>>0<11?16:a+11&-8;a=m>>>3;o=c[753]|0;d=o>>>a;if(d&3|0){b=(d&1^1)+a|0;a=3052+(b<<1<<2)|0;d=a+8|0;e=c[d>>2]|0;f=e+8|0;g=c[f>>2]|0;if((g|0)==(a|0))c[753]=o&~(1<<b);else{c[g+12>>2]=a;c[d>>2]=g}w=b<<3;c[e+4>>2]=w|3;w=e+w+4|0;c[w>>2]=c[w>>2]|1;w=f;l=x;return w|0}n=c[755]|0;if(m>>>0>n>>>0){if(d|0){b=2<<a;b=d<<a&(b|0-b);b=(b&0-b)+-1|0;i=b>>>12&16;b=b>>>i;d=b>>>5&8;b=b>>>d;g=b>>>2&4;b=b>>>g;a=b>>>1&2;b=b>>>a;e=b>>>1&1;e=(d|i|g|a|e)+(b>>>e)|0;b=3052+(e<<1<<2)|0;a=b+8|0;g=c[a>>2]|0;i=g+8|0;d=c[i>>2]|0;if((d|0)==(b|0)){a=o&~(1<<e);c[753]=a}else{c[d+12>>2]=b;c[a>>2]=d;a=o}w=e<<3;h=w-m|0;c[g+4>>2]=m|3;f=g+m|0;c[f+4>>2]=h|1;c[g+w>>2]=h;if(n|0){e=c[758]|0;b=n>>>3;d=3052+(b<<1<<2)|0;b=1<<b;if(!(a&b)){c[753]=a|b;b=d;a=d+8|0}else{a=d+8|0;b=c[a>>2]|0}c[a>>2]=e;c[b+12>>2]=e;c[e+8>>2]=b;c[e+12>>2]=d}c[755]=h;c[758]=f;w=i;l=x;return w|0}j=c[754]|0;if(j){d=(j&0-j)+-1|0;i=d>>>12&16;d=d>>>i;h=d>>>5&8;d=d>>>h;k=d>>>2&4;d=d>>>k;e=d>>>1&2;d=d>>>e;a=d>>>1&1;a=c[3316+((h|i|k|e|a)+(d>>>a)<<2)>>2]|0;d=(c[a+4>>2]&-8)-m|0;e=c[a+16+(((c[a+16>>2]|0)==0&1)<<2)>>2]|0;if(!e){k=a;h=d}else{do{i=(c[e+4>>2]&-8)-m|0;k=i>>>0<d>>>0;d=k?i:d;a=k?e:a;e=c[e+16+(((c[e+16>>2]|0)==0&1)<<2)>>2]|0}while((e|0)!=0);k=a;h=d}i=k+m|0;if(i>>>0>k>>>0){f=c[k+24>>2]|0;b=c[k+12>>2]|0;do if((b|0)==(k|0)){a=k+20|0;b=c[a>>2]|0;if(!b){a=k+16|0;b=c[a>>2]|0;if(!b){d=0;break}}while(1){d=b+20|0;e=c[d>>2]|0;if(e|0){b=e;a=d;continue}d=b+16|0;e=c[d>>2]|0;if(!e)break;else{b=e;a=d}}c[a>>2]=0;d=b}else{d=c[k+8>>2]|0;c[d+12>>2]=b;c[b+8>>2]=d;d=b}while(0);do if(f|0){b=c[k+28>>2]|0;a=3316+(b<<2)|0;if((k|0)==(c[a>>2]|0)){c[a>>2]=d;if(!d){c[754]=j&~(1<<b);break}}else{c[f+16+(((c[f+16>>2]|0)!=(k|0)&1)<<2)>>2]=d;if(!d)break}c[d+24>>2]=f;b=c[k+16>>2]|0;if(b|0){c[d+16>>2]=b;c[b+24>>2]=d}b=c[k+20>>2]|0;if(b|0){c[d+20>>2]=b;c[b+24>>2]=d}}while(0);if(h>>>0<16){w=h+m|0;c[k+4>>2]=w|3;w=k+w+4|0;c[w>>2]=c[w>>2]|1}else{c[k+4>>2]=m|3;c[i+4>>2]=h|1;c[i+h>>2]=h;if(n|0){e=c[758]|0;b=n>>>3;d=3052+(b<<1<<2)|0;b=1<<b;if(!(o&b)){c[753]=o|b;b=d;a=d+8|0}else{a=d+8|0;b=c[a>>2]|0}c[a>>2]=e;c[b+12>>2]=e;c[e+8>>2]=b;c[e+12>>2]=d}c[755]=h;c[758]=i}w=k+8|0;l=x;return w|0}else n=m}else n=m}else n=m}else if(a>>>0<=4294967231){a=a+11|0;m=a&-8;k=c[754]|0;if(k){e=0-m|0;a=a>>>8;if(a)if(m>>>0>16777215)j=31;else{o=(a+1048320|0)>>>16&8;v=a<<o;n=(v+520192|0)>>>16&4;v=v<<n;j=(v+245760|0)>>>16&2;j=14-(n|o|j)+(v<<j>>>15)|0;j=m>>>(j+7|0)&1|j<<1}else j=0;d=c[3316+(j<<2)>>2]|0;a:do if(!d){d=0;a=0;v=57}else{a=0;i=d;h=m<<((j|0)==31?0:25-(j>>>1)|0);d=0;while(1){f=(c[i+4>>2]&-8)-m|0;if(f>>>0<e>>>0)if(!f){e=0;d=i;a=i;v=61;break a}else{a=i;e=f}f=c[i+20>>2]|0;i=c[i+16+(h>>>31<<2)>>2]|0;d=(f|0)==0|(f|0)==(i|0)?d:f;f=(i|0)==0;if(f){v=57;break}else h=h<<((f^1)&1)}}while(0);if((v|0)==57){if((d|0)==0&(a|0)==0){a=2<<j;a=k&(a|0-a);if(!a){n=m;break}o=(a&0-a)+-1|0;i=o>>>12&16;o=o>>>i;h=o>>>5&8;o=o>>>h;j=o>>>2&4;o=o>>>j;n=o>>>1&2;o=o>>>n;d=o>>>1&1;a=0;d=c[3316+((h|i|j|n|d)+(o>>>d)<<2)>>2]|0}if(!d){i=a;h=e}else v=61}if((v|0)==61)while(1){v=0;n=(c[d+4>>2]&-8)-m|0;o=n>>>0<e>>>0;e=o?n:e;a=o?d:a;d=c[d+16+(((c[d+16>>2]|0)==0&1)<<2)>>2]|0;if(!d){i=a;h=e;break}else v=61}if((i|0)!=0?h>>>0<((c[755]|0)-m|0)>>>0:0){g=i+m|0;if(g>>>0<=i>>>0){w=0;l=x;return w|0}f=c[i+24>>2]|0;b=c[i+12>>2]|0;do if((b|0)==(i|0)){a=i+20|0;b=c[a>>2]|0;if(!b){a=i+16|0;b=c[a>>2]|0;if(!b){b=0;break}}while(1){d=b+20|0;e=c[d>>2]|0;if(e|0){b=e;a=d;continue}d=b+16|0;e=c[d>>2]|0;if(!e)break;else{b=e;a=d}}c[a>>2]=0}else{w=c[i+8>>2]|0;c[w+12>>2]=b;c[b+8>>2]=w}while(0);do if(f){a=c[i+28>>2]|0;d=3316+(a<<2)|0;if((i|0)==(c[d>>2]|0)){c[d>>2]=b;if(!b){e=k&~(1<<a);c[754]=e;break}}else{c[f+16+(((c[f+16>>2]|0)!=(i|0)&1)<<2)>>2]=b;if(!b){e=k;break}}c[b+24>>2]=f;a=c[i+16>>2]|0;if(a|0){c[b+16>>2]=a;c[a+24>>2]=b}a=c[i+20>>2]|0;if(a){c[b+20>>2]=a;c[a+24>>2]=b;e=k}else e=k}else e=k;while(0);do if(h>>>0>=16){c[i+4>>2]=m|3;c[g+4>>2]=h|1;c[g+h>>2]=h;b=h>>>3;if(h>>>0<256){d=3052+(b<<1<<2)|0;a=c[753]|0;b=1<<b;if(!(a&b)){c[753]=a|b;b=d;a=d+8|0}else{a=d+8|0;b=c[a>>2]|0}c[a>>2]=g;c[b+12>>2]=g;c[g+8>>2]=b;c[g+12>>2]=d;break}b=h>>>8;if(b)if(h>>>0>16777215)b=31;else{v=(b+1048320|0)>>>16&8;w=b<<v;u=(w+520192|0)>>>16&4;w=w<<u;b=(w+245760|0)>>>16&2;b=14-(u|v|b)+(w<<b>>>15)|0;b=h>>>(b+7|0)&1|b<<1}else b=0;d=3316+(b<<2)|0;c[g+28>>2]=b;a=g+16|0;c[a+4>>2]=0;c[a>>2]=0;a=1<<b;if(!(e&a)){c[754]=e|a;c[d>>2]=g;c[g+24>>2]=d;c[g+12>>2]=g;c[g+8>>2]=g;break}a=h<<((b|0)==31?0:25-(b>>>1)|0);d=c[d>>2]|0;while(1){if((c[d+4>>2]&-8|0)==(h|0)){v=97;break}e=d+16+(a>>>31<<2)|0;b=c[e>>2]|0;if(!b){v=96;break}else{a=a<<1;d=b}}if((v|0)==96){c[e>>2]=g;c[g+24>>2]=d;c[g+12>>2]=g;c[g+8>>2]=g;break}else if((v|0)==97){v=d+8|0;w=c[v>>2]|0;c[w+12>>2]=g;c[v>>2]=g;c[g+8>>2]=w;c[g+12>>2]=d;c[g+24>>2]=0;break}}else{w=h+m|0;c[i+4>>2]=w|3;w=i+w+4|0;c[w>>2]=c[w>>2]|1}while(0);w=i+8|0;l=x;return w|0}else n=m}else n=m}else n=-1;while(0);d=c[755]|0;if(d>>>0>=n>>>0){b=d-n|0;a=c[758]|0;if(b>>>0>15){w=a+n|0;c[758]=w;c[755]=b;c[w+4>>2]=b|1;c[a+d>>2]=b;c[a+4>>2]=n|3}else{c[755]=0;c[758]=0;c[a+4>>2]=d|3;w=a+d+4|0;c[w>>2]=c[w>>2]|1}w=a+8|0;l=x;return w|0}i=c[756]|0;if(i>>>0>n>>>0){u=i-n|0;c[756]=u;w=c[759]|0;v=w+n|0;c[759]=v;c[v+4>>2]=u|1;c[w+4>>2]=n|3;w=w+8|0;l=x;return w|0}if(!(c[871]|0)){c[873]=4096;c[872]=4096;c[874]=-1;c[875]=-1;c[876]=0;c[864]=0;c[871]=p&-16^1431655768;a=4096}else a=c[873]|0;j=n+48|0;k=n+47|0;h=a+k|0;f=0-a|0;m=h&f;if(m>>>0<=n>>>0){w=0;l=x;return w|0}a=c[863]|0;if(a|0?(o=c[861]|0,p=o+m|0,p>>>0<=o>>>0|p>>>0>a>>>0):0){w=0;l=x;return w|0}b:do if(!(c[864]&4)){d=c[759]|0;c:do if(d){e=3460;while(1){a=c[e>>2]|0;if(a>>>0<=d>>>0?(s=e+4|0,(a+(c[s>>2]|0)|0)>>>0>d>>>0):0)break;a=c[e+8>>2]|0;if(!a){v=118;break c}else e=a}b=h-i&f;if(b>>>0<2147483647){a=Db(b|0)|0;if((a|0)==((c[e>>2]|0)+(c[s>>2]|0)|0)){if((a|0)!=(-1|0)){h=b;g=a;v=135;break b}}else{e=a;v=126}}else b=0}else v=118;while(0);do if((v|0)==118){d=Db(0)|0;if((d|0)!=(-1|0)?(b=d,q=c[872]|0,r=q+-1|0,b=((r&b|0)==0?0:(r+b&0-q)-b|0)+m|0,q=c[861]|0,r=b+q|0,b>>>0>n>>>0&b>>>0<2147483647):0){s=c[863]|0;if(s|0?r>>>0<=q>>>0|r>>>0>s>>>0:0){b=0;break}a=Db(b|0)|0;if((a|0)==(d|0)){h=b;g=d;v=135;break b}else{e=a;v=126}}else b=0}while(0);do if((v|0)==126){d=0-b|0;if(!(j>>>0>b>>>0&(b>>>0<2147483647&(e|0)!=(-1|0))))if((e|0)==(-1|0)){b=0;break}else{h=b;g=e;v=135;break b}a=c[873]|0;a=k-b+a&0-a;if(a>>>0>=2147483647){h=b;g=e;v=135;break b}if((Db(a|0)|0)==(-1|0)){Db(d|0)|0;b=0;break}else{h=a+b|0;g=e;v=135;break b}}while(0);c[864]=c[864]|4;v=133}else{b=0;v=133}while(0);if(((v|0)==133?m>>>0<2147483647:0)?(g=Db(m|0)|0,s=Db(0)|0,t=s-g|0,u=t>>>0>(n+40|0)>>>0,!((g|0)==(-1|0)|u^1|g>>>0<s>>>0&((g|0)!=(-1|0)&(s|0)!=(-1|0))^1)):0){h=u?t:b;v=135}if((v|0)==135){b=(c[861]|0)+h|0;c[861]=b;if(b>>>0>(c[862]|0)>>>0)c[862]=b;j=c[759]|0;do if(j){b=3460;while(1){a=c[b>>2]|0;d=b+4|0;e=c[d>>2]|0;if((g|0)==(a+e|0)){v=143;break}f=c[b+8>>2]|0;if(!f)break;else b=f}if(((v|0)==143?(c[b+12>>2]&8|0)==0:0)?g>>>0>j>>>0&a>>>0<=j>>>0:0){c[d>>2]=e+h;w=(c[756]|0)+h|0;u=j+8|0;u=(u&7|0)==0?0:0-u&7;v=j+u|0;u=w-u|0;c[759]=v;c[756]=u;c[v+4>>2]=u|1;c[j+w+4>>2]=40;c[760]=c[875];break}if(g>>>0<(c[757]|0)>>>0)c[757]=g;a=g+h|0;b=3460;while(1){if((c[b>>2]|0)==(a|0)){v=151;break}b=c[b+8>>2]|0;if(!b){a=3460;break}}if((v|0)==151)if(!(c[b+12>>2]&8)){c[b>>2]=g;m=b+4|0;c[m>>2]=(c[m>>2]|0)+h;m=g+8|0;m=g+((m&7|0)==0?0:0-m&7)|0;b=a+8|0;b=a+((b&7|0)==0?0:0-b&7)|0;k=m+n|0;i=b-m-n|0;c[m+4>>2]=n|3;do if((j|0)!=(b|0)){if((c[758]|0)==(b|0)){w=(c[755]|0)+i|0;c[755]=w;c[758]=k;c[k+4>>2]=w|1;c[k+w>>2]=w;break}a=c[b+4>>2]|0;if((a&3|0)==1){h=a&-8;e=a>>>3;d:do if(a>>>0<256){a=c[b+8>>2]|0;d=c[b+12>>2]|0;if((d|0)==(a|0)){c[753]=c[753]&~(1<<e);break}else{c[a+12>>2]=d;c[d+8>>2]=a;break}}else{g=c[b+24>>2]|0;a=c[b+12>>2]|0;do if((a|0)==(b|0)){e=b+16|0;d=e+4|0;a=c[d>>2]|0;if(!a){a=c[e>>2]|0;if(!a){a=0;break}else d=e}while(1){e=a+20|0;f=c[e>>2]|0;if(f|0){a=f;d=e;continue}e=a+16|0;f=c[e>>2]|0;if(!f)break;else{a=f;d=e}}c[d>>2]=0}else{w=c[b+8>>2]|0;c[w+12>>2]=a;c[a+8>>2]=w}while(0);if(!g)break;d=c[b+28>>2]|0;e=3316+(d<<2)|0;do if((c[e>>2]|0)!=(b|0)){c[g+16+(((c[g+16>>2]|0)!=(b|0)&1)<<2)>>2]=a;if(!a)break d}else{c[e>>2]=a;if(a|0)break;c[754]=c[754]&~(1<<d);break d}while(0);c[a+24>>2]=g;d=b+16|0;e=c[d>>2]|0;if(e|0){c[a+16>>2]=e;c[e+24>>2]=a}d=c[d+4>>2]|0;if(!d)break;c[a+20>>2]=d;c[d+24>>2]=a}while(0);b=b+h|0;f=h+i|0}else f=i;b=b+4|0;c[b>>2]=c[b>>2]&-2;c[k+4>>2]=f|1;c[k+f>>2]=f;b=f>>>3;if(f>>>0<256){d=3052+(b<<1<<2)|0;a=c[753]|0;b=1<<b;if(!(a&b)){c[753]=a|b;b=d;a=d+8|0}else{a=d+8|0;b=c[a>>2]|0}c[a>>2]=k;c[b+12>>2]=k;c[k+8>>2]=b;c[k+12>>2]=d;break}b=f>>>8;do if(!b)b=0;else{if(f>>>0>16777215){b=31;break}v=(b+1048320|0)>>>16&8;w=b<<v;u=(w+520192|0)>>>16&4;w=w<<u;b=(w+245760|0)>>>16&2;b=14-(u|v|b)+(w<<b>>>15)|0;b=f>>>(b+7|0)&1|b<<1}while(0);e=3316+(b<<2)|0;c[k+28>>2]=b;a=k+16|0;c[a+4>>2]=0;c[a>>2]=0;a=c[754]|0;d=1<<b;if(!(a&d)){c[754]=a|d;c[e>>2]=k;c[k+24>>2]=e;c[k+12>>2]=k;c[k+8>>2]=k;break}a=f<<((b|0)==31?0:25-(b>>>1)|0);d=c[e>>2]|0;while(1){if((c[d+4>>2]&-8|0)==(f|0)){v=192;break}e=d+16+(a>>>31<<2)|0;b=c[e>>2]|0;if(!b){v=191;break}else{a=a<<1;d=b}}if((v|0)==191){c[e>>2]=k;c[k+24>>2]=d;c[k+12>>2]=k;c[k+8>>2]=k;break}else if((v|0)==192){v=d+8|0;w=c[v>>2]|0;c[w+12>>2]=k;c[v>>2]=k;c[k+8>>2]=w;c[k+12>>2]=d;c[k+24>>2]=0;break}}else{w=(c[756]|0)+i|0;c[756]=w;c[759]=k;c[k+4>>2]=w|1}while(0);w=m+8|0;l=x;return w|0}else a=3460;while(1){b=c[a>>2]|0;if(b>>>0<=j>>>0?(w=b+(c[a+4>>2]|0)|0,w>>>0>j>>>0):0)break;a=c[a+8>>2]|0}f=w+-47|0;a=f+8|0;a=f+((a&7|0)==0?0:0-a&7)|0;f=j+16|0;a=a>>>0<f>>>0?j:a;b=a+8|0;d=h+-40|0;u=g+8|0;u=(u&7|0)==0?0:0-u&7;v=g+u|0;u=d-u|0;c[759]=v;c[756]=u;c[v+4>>2]=u|1;c[g+d+4>>2]=40;c[760]=c[875];d=a+4|0;c[d>>2]=27;c[b>>2]=c[865];c[b+4>>2]=c[866];c[b+8>>2]=c[867];c[b+12>>2]=c[868];c[865]=g;c[866]=h;c[868]=0;c[867]=b;b=a+24|0;do{v=b;b=b+4|0;c[b>>2]=7}while((v+8|0)>>>0<w>>>0);if((a|0)!=(j|0)){g=a-j|0;c[d>>2]=c[d>>2]&-2;c[j+4>>2]=g|1;c[a>>2]=g;b=g>>>3;if(g>>>0<256){d=3052+(b<<1<<2)|0;a=c[753]|0;b=1<<b;if(!(a&b)){c[753]=a|b;b=d;a=d+8|0}else{a=d+8|0;b=c[a>>2]|0}c[a>>2]=j;c[b+12>>2]=j;c[j+8>>2]=b;c[j+12>>2]=d;break}b=g>>>8;if(b)if(g>>>0>16777215)d=31;else{v=(b+1048320|0)>>>16&8;w=b<<v;u=(w+520192|0)>>>16&4;w=w<<u;d=(w+245760|0)>>>16&2;d=14-(u|v|d)+(w<<d>>>15)|0;d=g>>>(d+7|0)&1|d<<1}else d=0;e=3316+(d<<2)|0;c[j+28>>2]=d;c[j+20>>2]=0;c[f>>2]=0;b=c[754]|0;a=1<<d;if(!(b&a)){c[754]=b|a;c[e>>2]=j;c[j+24>>2]=e;c[j+12>>2]=j;c[j+8>>2]=j;break}a=g<<((d|0)==31?0:25-(d>>>1)|0);d=c[e>>2]|0;while(1){if((c[d+4>>2]&-8|0)==(g|0)){v=213;break}e=d+16+(a>>>31<<2)|0;b=c[e>>2]|0;if(!b){v=212;break}else{a=a<<1;d=b}}if((v|0)==212){c[e>>2]=j;c[j+24>>2]=d;c[j+12>>2]=j;c[j+8>>2]=j;break}else if((v|0)==213){v=d+8|0;w=c[v>>2]|0;c[w+12>>2]=j;c[v>>2]=j;c[j+8>>2]=w;c[j+12>>2]=d;c[j+24>>2]=0;break}}}else{w=c[757]|0;if((w|0)==0|g>>>0<w>>>0)c[757]=g;c[865]=g;c[866]=h;c[868]=0;c[762]=c[871];c[761]=-1;c[766]=3052;c[765]=3052;c[768]=3060;c[767]=3060;c[770]=3068;c[769]=3068;c[772]=3076;c[771]=3076;c[774]=3084;c[773]=3084;c[776]=3092;c[775]=3092;c[778]=3100;c[777]=3100;c[780]=3108;c[779]=3108;c[782]=3116;c[781]=3116;c[784]=3124;c[783]=3124;c[786]=3132;c[785]=3132;c[788]=3140;c[787]=3140;c[790]=3148;c[789]=3148;c[792]=3156;c[791]=3156;c[794]=3164;c[793]=3164;c[796]=3172;c[795]=3172;c[798]=3180;c[797]=3180;c[800]=3188;c[799]=3188;c[802]=3196;c[801]=3196;c[804]=3204;c[803]=3204;c[806]=3212;c[805]=3212;c[808]=3220;c[807]=3220;c[810]=3228;c[809]=3228;c[812]=3236;c[811]=3236;c[814]=3244;c[813]=3244;c[816]=3252;c[815]=3252;c[818]=3260;c[817]=3260;c[820]=3268;c[819]=3268;c[822]=3276;c[821]=3276;c[824]=3284;c[823]=3284;c[826]=3292;c[825]=3292;c[828]=3300;c[827]=3300;w=h+-40|0;u=g+8|0;u=(u&7|0)==0?0:0-u&7;v=g+u|0;u=w-u|0;c[759]=v;c[756]=u;c[v+4>>2]=u|1;c[g+w+4>>2]=40;c[760]=c[875]}while(0);b=c[756]|0;if(b>>>0>n>>>0){u=b-n|0;c[756]=u;w=c[759]|0;v=w+n|0;c[759]=v;c[v+4>>2]=u|1;c[w+4>>2]=n|3;w=w+8|0;l=x;return w|0}}c[(Ka()|0)>>2]=12;w=0;l=x;return w|0}function Fa(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;if(!a)return;d=a+-8|0;f=c[757]|0;a=c[a+-4>>2]|0;b=a&-8;j=d+b|0;do if(!(a&1)){e=c[d>>2]|0;if(!(a&3))return;h=d+(0-e)|0;g=e+b|0;if(h>>>0<f>>>0)return;if((c[758]|0)==(h|0)){a=j+4|0;b=c[a>>2]|0;if((b&3|0)!=3){i=h;b=g;break}c[755]=g;c[a>>2]=b&-2;c[h+4>>2]=g|1;c[h+g>>2]=g;return}d=e>>>3;if(e>>>0<256){a=c[h+8>>2]|0;b=c[h+12>>2]|0;if((b|0)==(a|0)){c[753]=c[753]&~(1<<d);i=h;b=g;break}else{c[a+12>>2]=b;c[b+8>>2]=a;i=h;b=g;break}}f=c[h+24>>2]|0;a=c[h+12>>2]|0;do if((a|0)==(h|0)){d=h+16|0;b=d+4|0;a=c[b>>2]|0;if(!a){a=c[d>>2]|0;if(!a){a=0;break}else b=d}while(1){d=a+20|0;e=c[d>>2]|0;if(e|0){a=e;b=d;continue}d=a+16|0;e=c[d>>2]|0;if(!e)break;else{a=e;b=d}}c[b>>2]=0}else{i=c[h+8>>2]|0;c[i+12>>2]=a;c[a+8>>2]=i}while(0);if(f){b=c[h+28>>2]|0;d=3316+(b<<2)|0;if((c[d>>2]|0)==(h|0)){c[d>>2]=a;if(!a){c[754]=c[754]&~(1<<b);i=h;b=g;break}}else{c[f+16+(((c[f+16>>2]|0)!=(h|0)&1)<<2)>>2]=a;if(!a){i=h;b=g;break}}c[a+24>>2]=f;b=h+16|0;d=c[b>>2]|0;if(d|0){c[a+16>>2]=d;c[d+24>>2]=a}b=c[b+4>>2]|0;if(b){c[a+20>>2]=b;c[b+24>>2]=a;i=h;b=g}else{i=h;b=g}}else{i=h;b=g}}else{i=d;h=d}while(0);if(h>>>0>=j>>>0)return;a=j+4|0;e=c[a>>2]|0;if(!(e&1))return;if(!(e&2)){if((c[759]|0)==(j|0)){j=(c[756]|0)+b|0;c[756]=j;c[759]=i;c[i+4>>2]=j|1;if((i|0)!=(c[758]|0))return;c[758]=0;c[755]=0;return}if((c[758]|0)==(j|0)){j=(c[755]|0)+b|0;c[755]=j;c[758]=h;c[i+4>>2]=j|1;c[h+j>>2]=j;return}f=(e&-8)+b|0;d=e>>>3;do if(e>>>0<256){b=c[j+8>>2]|0;a=c[j+12>>2]|0;if((a|0)==(b|0)){c[753]=c[753]&~(1<<d);break}else{c[b+12>>2]=a;c[a+8>>2]=b;break}}else{g=c[j+24>>2]|0;a=c[j+12>>2]|0;do if((a|0)==(j|0)){d=j+16|0;b=d+4|0;a=c[b>>2]|0;if(!a){a=c[d>>2]|0;if(!a){d=0;break}else b=d}while(1){d=a+20|0;e=c[d>>2]|0;if(e|0){a=e;b=d;continue}d=a+16|0;e=c[d>>2]|0;if(!e)break;else{a=e;b=d}}c[b>>2]=0;d=a}else{d=c[j+8>>2]|0;c[d+12>>2]=a;c[a+8>>2]=d;d=a}while(0);if(g|0){a=c[j+28>>2]|0;b=3316+(a<<2)|0;if((c[b>>2]|0)==(j|0)){c[b>>2]=d;if(!d){c[754]=c[754]&~(1<<a);break}}else{c[g+16+(((c[g+16>>2]|0)!=(j|0)&1)<<2)>>2]=d;if(!d)break}c[d+24>>2]=g;a=j+16|0;b=c[a>>2]|0;if(b|0){c[d+16>>2]=b;c[b+24>>2]=d}a=c[a+4>>2]|0;if(a|0){c[d+20>>2]=a;c[a+24>>2]=d}}}while(0);c[i+4>>2]=f|1;c[h+f>>2]=f;if((i|0)==(c[758]|0)){c[755]=f;return}}else{c[a>>2]=e&-2;c[i+4>>2]=b|1;c[h+b>>2]=b;f=b}a=f>>>3;if(f>>>0<256){d=3052+(a<<1<<2)|0;b=c[753]|0;a=1<<a;if(!(b&a)){c[753]=b|a;a=d;b=d+8|0}else{b=d+8|0;a=c[b>>2]|0}c[b>>2]=i;c[a+12>>2]=i;c[i+8>>2]=a;c[i+12>>2]=d;return}a=f>>>8;if(a)if(f>>>0>16777215)a=31;else{h=(a+1048320|0)>>>16&8;j=a<<h;g=(j+520192|0)>>>16&4;j=j<<g;a=(j+245760|0)>>>16&2;a=14-(g|h|a)+(j<<a>>>15)|0;a=f>>>(a+7|0)&1|a<<1}else a=0;e=3316+(a<<2)|0;c[i+28>>2]=a;c[i+20>>2]=0;c[i+16>>2]=0;b=c[754]|0;d=1<<a;do if(b&d){b=f<<((a|0)==31?0:25-(a>>>1)|0);d=c[e>>2]|0;while(1){if((c[d+4>>2]&-8|0)==(f|0)){a=73;break}e=d+16+(b>>>31<<2)|0;a=c[e>>2]|0;if(!a){a=72;break}else{b=b<<1;d=a}}if((a|0)==72){c[e>>2]=i;c[i+24>>2]=d;c[i+12>>2]=i;c[i+8>>2]=i;break}else if((a|0)==73){h=d+8|0;j=c[h>>2]|0;c[j+12>>2]=i;c[h>>2]=i;c[i+8>>2]=j;c[i+12>>2]=d;c[i+24>>2]=0;break}}else{c[754]=b|d;c[e>>2]=i;c[i+24>>2]=e;c[i+12>>2]=i;c[i+8>>2]=i}while(0);j=(c[761]|0)+-1|0;c[761]=j;if(!j)a=3468;else return;while(1){a=c[a>>2]|0;if(!a)break;else a=a+8|0}c[761]=-1;return}function Ga(a){a=a|0;var b=0,d=0;b=l;l=l+16|0;d=b;c[d>>2]=La(c[a+60>>2]|0)|0;a=Ja(ba(6,d|0)|0)|0;l=b;return a|0}function Ha(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0;n=l;l=l+48|0;k=n+16|0;g=n;f=n+32|0;i=a+28|0;e=c[i>>2]|0;c[f>>2]=e;j=a+20|0;e=(c[j>>2]|0)-e|0;c[f+4>>2]=e;c[f+8>>2]=b;c[f+12>>2]=d;e=e+d|0;h=a+60|0;c[g>>2]=c[h>>2];c[g+4>>2]=f;c[g+8>>2]=2;g=Ja($(146,g|0)|0)|0;a:do if((e|0)!=(g|0)){b=2;while(1){if((g|0)<0)break;e=e-g|0;p=c[f+4>>2]|0;o=g>>>0>p>>>0;f=o?f+8|0:f;b=b+(o<<31>>31)|0;p=g-(o?p:0)|0;c[f>>2]=(c[f>>2]|0)+p;o=f+4|0;c[o>>2]=(c[o>>2]|0)-p;c[k>>2]=c[h>>2];c[k+4>>2]=f;c[k+8>>2]=b;g=Ja($(146,k|0)|0)|0;if((e|0)==(g|0)){m=3;break a}}c[a+16>>2]=0;c[i>>2]=0;c[j>>2]=0;c[a>>2]=c[a>>2]|32;if((b|0)==2)d=0;else d=d-(c[f+4>>2]|0)|0}else m=3;while(0);if((m|0)==3){p=c[a+44>>2]|0;c[a+16>>2]=p+(c[a+48>>2]|0);c[i>>2]=p;c[j>>2]=p}l=n;return d|0}function Ia(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;f=l;l=l+32|0;g=f;e=f+20|0;c[g>>2]=c[a+60>>2];c[g+4>>2]=0;c[g+8>>2]=b;c[g+12>>2]=e;c[g+16>>2]=d;if((Ja(_(140,g|0)|0)|0)<0){c[e>>2]=-1;a=-1}else a=c[e>>2]|0;l=f;return a|0}function Ja(a){a=a|0;if(a>>>0>4294963200){c[(Ka()|0)>>2]=0-a;a=-1}return a|0}function Ka(){return 3572}function La(a){a=a|0;return a|0}function Ma(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;g=l;l=l+32|0;f=g;c[b+36>>2]=3;if((c[b>>2]&64|0)==0?(c[f>>2]=c[b+60>>2],c[f+4>>2]=21523,c[f+8>>2]=g+16,aa(54,f|0)|0):0)a[b+75>>0]=-1;f=Ha(b,d,e)|0;l=g;return f|0}function Na(b,c){b=b|0;c=c|0;var d=0,e=0;d=a[b>>0]|0;e=a[c>>0]|0;if(d<<24>>24==0?1:d<<24>>24!=e<<24>>24)b=e;else{do{b=b+1|0;c=c+1|0;d=a[b>>0]|0;e=a[c>>0]|0}while(!(d<<24>>24==0?1:d<<24>>24!=e<<24>>24));b=e}return (d&255)-(b&255)|0}function Oa(a){a=a|0;return (a+-48|0)>>>0<10|0}function Pa(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;s=l;l=l+224|0;n=s+120|0;o=s+80|0;q=s;r=s+136|0;f=o;g=f+40|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(g|0));c[n>>2]=c[e>>2];if((Qa(0,d,n,q,o)|0)<0)e=-1;else{if((c[b+76>>2]|0)>-1)p=Ra(b)|0;else p=0;e=c[b>>2]|0;m=e&32;if((a[b+74>>0]|0)<1)c[b>>2]=e&-33;f=b+48|0;if(!(c[f>>2]|0)){g=b+44|0;h=c[g>>2]|0;c[g>>2]=r;i=b+28|0;c[i>>2]=r;j=b+20|0;c[j>>2]=r;c[f>>2]=80;k=b+16|0;c[k>>2]=r+80;e=Qa(b,d,n,q,o)|0;if(h){ga[c[b+36>>2]&3](b,0,0)|0;e=(c[j>>2]|0)==0?-1:e;c[g>>2]=h;c[f>>2]=0;c[k>>2]=0;c[i>>2]=0;c[j>>2]=0}}else e=Qa(b,d,n,q,o)|0;f=c[b>>2]|0;c[b>>2]=f|m;if(p|0)Sa(b);e=(f&32|0)==0?e:-1}l=s;return e|0}function Qa(d,e,f,g,i){d=d|0;e=e|0;f=f|0;g=g|0;i=i|0;var j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;I=l;l=l+64|0;D=I+16|0;E=I;A=I+24|0;G=I+8|0;H=I+20|0;c[D>>2]=e;w=(d|0)!=0;x=A+40|0;y=x;A=A+39|0;B=G+4|0;j=0;e=0;m=0;a:while(1){do if((e|0)>-1)if((j|0)>(2147483647-e|0)){c[(Ka()|0)>>2]=75;e=-1;break}else{e=j+e|0;break}while(0);r=c[D>>2]|0;j=a[r>>0]|0;if(!(j<<24>>24)){v=88;break}else k=r;b:while(1){switch(j<<24>>24){case 37:{j=k;v=9;break b}case 0:{j=k;break b}default:{}}u=k+1|0;c[D>>2]=u;j=a[u>>0]|0;k=u}c:do if((v|0)==9)while(1){v=0;if((a[k+1>>0]|0)!=37)break c;j=j+1|0;k=k+2|0;c[D>>2]=k;if((a[k>>0]|0)!=37)break;else v=9}while(0);j=j-r|0;if(w)Ta(d,r,j);if(j|0)continue;u=(Oa(a[(c[D>>2]|0)+1>>0]|0)|0)==0;k=c[D>>2]|0;if(!u?(a[k+2>>0]|0)==36:0){s=(a[k+1>>0]|0)+-48|0;n=1;j=3}else{s=-1;n=m;j=1}j=k+j|0;c[D>>2]=j;k=a[j>>0]|0;u=(k<<24>>24)+-32|0;if(u>>>0>31|(1<<u&75913|0)==0)m=0;else{m=0;do{m=1<<(k<<24>>24)+-32|m;j=j+1|0;c[D>>2]=j;k=a[j>>0]|0;u=(k<<24>>24)+-32|0}while(!(u>>>0>31|(1<<u&75913|0)==0))}if(k<<24>>24==42){if((Oa(a[j+1>>0]|0)|0)!=0?(F=c[D>>2]|0,(a[F+2>>0]|0)==36):0){j=F+1|0;c[i+((a[j>>0]|0)+-48<<2)>>2]=10;j=c[g+((a[j>>0]|0)+-48<<3)>>2]|0;k=1;n=F+3|0}else{if(n|0){e=-1;break}if(w){u=(c[f>>2]|0)+(4-1)&~(4-1);j=c[u>>2]|0;c[f>>2]=u+4}else j=0;k=0;n=(c[D>>2]|0)+1|0}c[D>>2]=n;t=(j|0)<0;u=t?0-j|0:j;m=t?m|8192:m;t=k;j=n}else{j=Ua(D)|0;if((j|0)<0){e=-1;break}u=j;t=n;j=c[D>>2]|0}do if((a[j>>0]|0)==46){if((a[j+1>>0]|0)!=42){c[D>>2]=j+1;p=Ua(D)|0;j=c[D>>2]|0;break}if(Oa(a[j+2>>0]|0)|0?(C=c[D>>2]|0,(a[C+3>>0]|0)==36):0){p=C+2|0;c[i+((a[p>>0]|0)+-48<<2)>>2]=10;p=c[g+((a[p>>0]|0)+-48<<3)>>2]|0;j=C+4|0;c[D>>2]=j;break}if(t|0){e=-1;break a}if(w){q=(c[f>>2]|0)+(4-1)&~(4-1);j=c[q>>2]|0;c[f>>2]=q+4}else j=0;q=(c[D>>2]|0)+2|0;c[D>>2]=q;p=j;j=q}else p=-1;while(0);q=0;while(1){if(((a[j>>0]|0)+-65|0)>>>0>57){e=-1;break a}k=j;j=j+1|0;c[D>>2]=j;k=a[(a[k>>0]|0)+-65+(585+(q*58|0))>>0]|0;n=k&255;if((n+-1|0)>>>0>=8)break;else q=n}if(!(k<<24>>24)){e=-1;break}o=(s|0)>-1;do if(k<<24>>24==19)if(o){e=-1;break a}else v=50;else{if(o){c[i+(s<<2)>>2]=n;o=g+(s<<3)|0;s=c[o+4>>2]|0;v=E;c[v>>2]=c[o>>2];c[v+4>>2]=s;v=50;break}if(!w){e=0;break a}Va(E,n,f);j=c[D>>2]|0}while(0);if((v|0)==50){v=0;if(!w){j=0;m=t;continue}}k=a[j+-1>>0]|0;k=(q|0)!=0&(k&15|0)==3?k&-33:k;j=m&-65537;s=(m&8192|0)==0?m:j;d:do switch(k|0){case 110:switch((q&255)<<24>>24){case 0:{c[c[E>>2]>>2]=e;j=0;m=t;continue a}case 1:{c[c[E>>2]>>2]=e;j=0;m=t;continue a}case 2:{j=c[E>>2]|0;c[j>>2]=e;c[j+4>>2]=((e|0)<0)<<31>>31;j=0;m=t;continue a}case 3:{b[c[E>>2]>>1]=e;j=0;m=t;continue a}case 4:{a[c[E>>2]>>0]=e;j=0;m=t;continue a}case 6:{c[c[E>>2]>>2]=e;j=0;m=t;continue a}case 7:{j=c[E>>2]|0;c[j>>2]=e;c[j+4>>2]=((e|0)<0)<<31>>31;j=0;m=t;continue a}default:{j=0;m=t;continue a}}case 112:{k=120;j=p>>>0>8?p:8;m=s|8;v=62;break}case 88:case 120:{j=p;m=s;v=62;break}case 111:{k=E;j=c[k>>2]|0;k=c[k+4>>2]|0;o=Xa(j,k,x)|0;m=y-o|0;q=0;n=1049;p=(s&8|0)==0|(p|0)>(m|0)?p:m+1|0;m=s;v=68;break}case 105:case 100:{k=E;j=c[k>>2]|0;k=c[k+4>>2]|0;if((k|0)<0){j=tb(0,0,j|0,k|0)|0;k=z;m=E;c[m>>2]=j;c[m+4>>2]=k;m=1;n=1049;v=67;break d}else{m=(s&2049|0)!=0&1;n=(s&2048|0)==0?((s&1|0)==0?1049:1051):1050;v=67;break d}}case 117:{k=E;m=0;n=1049;j=c[k>>2]|0;k=c[k+4>>2]|0;v=67;break}case 99:{a[A>>0]=c[E>>2];r=A;q=0;n=1049;o=x;k=1;break}case 109:{k=Za(c[(Ka()|0)>>2]|0)|0;v=72;break}case 115:{k=c[E>>2]|0;k=k|0?k:1059;v=72;break}case 67:{c[G>>2]=c[E>>2];c[B>>2]=0;c[E>>2]=G;p=-1;m=G;v=76;break}case 83:{j=c[E>>2]|0;if(!p){$a(d,32,u,0,s);j=0;v=85}else{m=j;v=76}break}case 65:case 71:case 70:case 69:case 97:case 103:case 102:case 101:{j=bb(d,+h[E>>3],u,p,s,k)|0;m=t;continue a}default:{q=0;n=1049;o=x;k=p;j=s}}while(0);e:do if((v|0)==62){s=E;r=c[s>>2]|0;s=c[s+4>>2]|0;o=Wa(r,s,x,k&32)|0;n=(m&8|0)==0|(r|0)==0&(s|0)==0;q=n?0:2;n=n?1049:1049+(k>>4)|0;p=j;j=r;k=s;v=68}else if((v|0)==67){o=Ya(j,k,x)|0;q=m;m=s;v=68}else if((v|0)==72){v=0;s=_a(k,0,p)|0;m=(s|0)==0;r=k;q=0;n=1049;o=m?k+p|0:s;k=m?p:s-k|0}else if((v|0)==76){v=0;o=m;j=0;k=0;while(1){n=c[o>>2]|0;if(!n)break;k=ab(H,n)|0;if((k|0)<0|k>>>0>(p-j|0)>>>0)break;j=k+j|0;if(p>>>0>j>>>0)o=o+4|0;else break}if((k|0)<0){e=-1;break a}$a(d,32,u,j,s);if(!j){j=0;v=85}else{n=0;while(1){k=c[m>>2]|0;if(!k){v=85;break e}k=ab(H,k)|0;n=k+n|0;if((n|0)>(j|0)){v=85;break e}Ta(d,H,k);if(n>>>0>=j>>>0){v=85;break}else m=m+4|0}}}while(0);if((v|0)==68){v=0;k=(j|0)!=0|(k|0)!=0;j=(p|0)!=0|k;k=y-o+((k^1)&1)|0;r=j?o:x;o=x;k=j?((p|0)>(k|0)?p:k):p;j=(p|0)>-1?m&-65537:m}else if((v|0)==85){v=0;$a(d,32,u,j,s^8192);j=(u|0)>(j|0)?u:j;m=t;continue}p=o-r|0;o=(k|0)<(p|0)?p:k;s=o+q|0;m=(u|0)<(s|0)?s:u;$a(d,32,m,s,j);Ta(d,n,q);$a(d,48,m,s,j^65536);$a(d,48,o,p,0);Ta(d,r,p);$a(d,32,m,s,j^8192);j=m;m=t}f:do if((v|0)==88)if(!d)if(m){e=1;while(1){j=c[i+(e<<2)>>2]|0;if(!j)break;Va(g+(e<<3)|0,j,f);j=e+1|0;if((e|0)<9)e=j;else{e=j;break}}if((e|0)<10)while(1){if(c[i+(e<<2)>>2]|0){e=-1;break f}if((e|0)<9)e=e+1|0;else{e=1;break}}else e=1}else e=0;while(0);l=I;return e|0}function Ra(a){a=a|0;return 0}function Sa(a){a=a|0;return}function Ta(a,b,d){a=a|0;b=b|0;d=d|0;if(!(c[a>>2]&32))ob(b,d,a)|0;return}function Ua(b){b=b|0;var d=0,e=0;if(!(Oa(a[c[b>>2]>>0]|0)|0))d=0;else{d=0;do{e=c[b>>2]|0;d=(d*10|0)+-48+(a[e>>0]|0)|0;e=e+1|0;c[b>>2]=e}while((Oa(a[e>>0]|0)|0)!=0)}return d|0}function Va(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0.0;a:do if(b>>>0<=20)do switch(b|0){case 9:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;c[a>>2]=b;break a}case 10:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;e=a;c[e>>2]=b;c[e+4>>2]=((b|0)<0)<<31>>31;break a}case 11:{e=(c[d>>2]|0)+(4-1)&~(4-1);b=c[e>>2]|0;c[d>>2]=e+4;e=a;c[e>>2]=b;c[e+4>>2]=0;break a}case 12:{e=(c[d>>2]|0)+(8-1)&~(8-1);b=e;f=c[b>>2]|0;b=c[b+4>>2]|0;c[d>>2]=e+8;e=a;c[e>>2]=f;c[e+4>>2]=b;break a}case 13:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;e=(e&65535)<<16>>16;f=a;c[f>>2]=e;c[f+4>>2]=((e|0)<0)<<31>>31;break a}case 14:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;f=a;c[f>>2]=e&65535;c[f+4>>2]=0;break a}case 15:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;e=(e&255)<<24>>24;f=a;c[f>>2]=e;c[f+4>>2]=((e|0)<0)<<31>>31;break a}case 16:{f=(c[d>>2]|0)+(4-1)&~(4-1);e=c[f>>2]|0;c[d>>2]=f+4;f=a;c[f>>2]=e&255;c[f+4>>2]=0;break a}case 17:{f=(c[d>>2]|0)+(8-1)&~(8-1);g=+h[f>>3];c[d>>2]=f+8;h[a>>3]=g;break a}case 18:{f=(c[d>>2]|0)+(8-1)&~(8-1);g=+h[f>>3];c[d>>2]=f+8;h[a>>3]=g;break a}default:break a}while(0);while(0);return}function Wa(b,c,e,f){b=b|0;c=c|0;e=e|0;f=f|0;if(!((b|0)==0&(c|0)==0))do{e=e+-1|0;a[e>>0]=d[1101+(b&15)>>0]|0|f;b=yb(b|0,c|0,4)|0;c=z}while(!((b|0)==0&(c|0)==0));return e|0}function Xa(b,c,d){b=b|0;c=c|0;d=d|0;if(!((b|0)==0&(c|0)==0))do{d=d+-1|0;a[d>>0]=b&7|48;b=yb(b|0,c|0,3)|0;c=z}while(!((b|0)==0&(c|0)==0));return d|0}function Ya(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;if(c>>>0>0|(c|0)==0&b>>>0>4294967295){while(1){e=xb(b|0,c|0,10,0)|0;d=d+-1|0;a[d>>0]=e&255|48;e=b;b=wb(b|0,c|0,10,0)|0;if(!(c>>>0>9|(c|0)==9&e>>>0>4294967295))break;else c=z}c=b}else c=b;if(c)while(1){d=d+-1|0;a[d>>0]=(c>>>0)%10|0|48;if(c>>>0<10)break;else c=(c>>>0)/10|0}return d|0}function Za(a){a=a|0;return jb(a,c[(ib()|0)+188>>2]|0)|0}function _a(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;h=d&255;f=(e|0)!=0;a:do if(f&(b&3|0)!=0){g=d&255;while(1){if((a[b>>0]|0)==g<<24>>24){i=6;break a}b=b+1|0;e=e+-1|0;f=(e|0)!=0;if(!(f&(b&3|0)!=0)){i=5;break}}}else i=5;while(0);if((i|0)==5)if(f)i=6;else e=0;b:do if((i|0)==6){g=d&255;if((a[b>>0]|0)!=g<<24>>24){f=O(h,16843009)|0;c:do if(e>>>0>3)while(1){h=c[b>>2]^f;if((h&-2139062144^-2139062144)&h+-16843009|0)break;b=b+4|0;e=e+-4|0;if(e>>>0<=3){i=11;break c}}else i=11;while(0);if((i|0)==11)if(!e){e=0;break}while(1){if((a[b>>0]|0)==g<<24>>24)break b;b=b+1|0;e=e+-1|0;if(!e){e=0;break}}}}while(0);return (e|0?b:0)|0}function $a(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0;g=l;l=l+256|0;f=g;if((c|0)>(d|0)&(e&73728|0)==0){e=c-d|0;Cb(f|0,b<<24>>24|0,(e>>>0<256?e:256)|0)|0;if(e>>>0>255){b=c-d|0;do{Ta(a,f,256);e=e+-256|0}while(e>>>0>255);e=b&255}Ta(a,f,e)}l=g;return}function ab(a,b){a=a|0;b=b|0;if(!a)a=0;else a=fb(a,b,0)|0;return a|0}function bb(b,e,f,g,h,i){b=b|0;e=+e;f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;H=l;l=l+560|0;m=H+8|0;u=H;G=H+524|0;F=G;n=H+512|0;c[u>>2]=0;E=n+12|0;cb(e)|0;if((z|0)<0){e=-e;C=1;B=1066}else{C=(h&2049|0)!=0&1;B=(h&2048|0)==0?((h&1|0)==0?1067:1072):1069}cb(e)|0;do if(0==0&(z&2146435072|0)==2146435072){G=(i&32|0)!=0;j=C+3|0;$a(b,32,f,j,h&-65537);Ta(b,B,C);Ta(b,e!=e|0.0!=0.0?(G?1093:1097):G?1085:1089,3);$a(b,32,f,j,h^8192)}else{r=+db(e,u)*2.0;j=r!=0.0;if(j)c[u>>2]=(c[u>>2]|0)+-1;w=i|32;if((w|0)==97){p=i&32;s=(p|0)==0?B:B+9|0;q=C|2;j=12-g|0;do if(!(g>>>0>11|(j|0)==0)){e=8.0;do{j=j+-1|0;e=e*16.0}while((j|0)!=0);if((a[s>>0]|0)==45){e=-(e+(-r-e));break}else{e=r+e-e;break}}else e=r;while(0);k=c[u>>2]|0;j=(k|0)<0?0-k|0:k;j=Ya(j,((j|0)<0)<<31>>31,E)|0;if((j|0)==(E|0)){j=n+11|0;a[j>>0]=48}a[j+-1>>0]=(k>>31&2)+43;o=j+-2|0;a[o>>0]=i+15;m=(g|0)<1;n=(h&8|0)==0;j=G;do{D=~~e;k=j+1|0;a[j>>0]=p|d[1101+D>>0];e=(e-+(D|0))*16.0;if((k-F|0)==1?!(n&(m&e==0.0)):0){a[k>>0]=46;j=j+2|0}else j=k}while(e!=0.0);if((g|0)!=0?(-2-F+j|0)<(g|0):0){k=j-F|0;j=g+2|0}else{j=j-F|0;k=j}E=E-o|0;F=E+q+j|0;$a(b,32,f,F,h);Ta(b,s,q);$a(b,48,f,F,h^65536);Ta(b,G,k);$a(b,48,j-k|0,0,0);Ta(b,o,E);$a(b,32,f,F,h^8192);j=F;break}k=(g|0)<0?6:g;if(j){j=(c[u>>2]|0)+-28|0;c[u>>2]=j;e=r*268435456.0}else{e=r;j=c[u>>2]|0}D=(j|0)<0?m:m+288|0;m=D;do{y=~~e>>>0;c[m>>2]=y;m=m+4|0;e=(e-+(y>>>0))*1.0e9}while(e!=0.0);if((j|0)>0){n=D;p=m;while(1){o=(j|0)<29?j:29;j=p+-4|0;if(j>>>0>=n>>>0){m=0;do{x=zb(c[j>>2]|0,0,o|0)|0;x=sb(x|0,z|0,m|0,0)|0;y=z;v=xb(x|0,y|0,1e9,0)|0;c[j>>2]=v;m=wb(x|0,y|0,1e9,0)|0;j=j+-4|0}while(j>>>0>=n>>>0);if(m){n=n+-4|0;c[n>>2]=m}}m=p;while(1){if(m>>>0<=n>>>0)break;j=m+-4|0;if(!(c[j>>2]|0))m=j;else break}j=(c[u>>2]|0)-o|0;c[u>>2]=j;if((j|0)>0)p=m;else break}}else n=D;if((j|0)<0){g=((k+25|0)/9|0)+1|0;t=(w|0)==102;do{s=0-j|0;s=(s|0)<9?s:9;if(n>>>0<m>>>0){o=(1<<s)+-1|0;p=1e9>>>s;q=0;j=n;do{y=c[j>>2]|0;c[j>>2]=(y>>>s)+q;q=O(y&o,p)|0;j=j+4|0}while(j>>>0<m>>>0);j=(c[n>>2]|0)==0?n+4|0:n;if(!q){n=j;j=m}else{c[m>>2]=q;n=j;j=m+4|0}}else{n=(c[n>>2]|0)==0?n+4|0:n;j=m}m=t?D:n;m=(j-m>>2|0)>(g|0)?m+(g<<2)|0:j;j=(c[u>>2]|0)+s|0;c[u>>2]=j}while((j|0)<0);j=n;g=m}else{j=n;g=m}y=D;if(j>>>0<g>>>0){m=(y-j>>2)*9|0;o=c[j>>2]|0;if(o>>>0>=10){n=10;do{n=n*10|0;m=m+1|0}while(o>>>0>=n>>>0)}}else m=0;t=(w|0)==103;v=(k|0)!=0;n=k-((w|0)!=102?m:0)+((v&t)<<31>>31)|0;if((n|0)<(((g-y>>2)*9|0)+-9|0)){n=n+9216|0;s=D+4+(((n|0)/9|0)+-1024<<2)|0;n=(n|0)%9|0;if((n|0)<8){o=10;while(1){o=o*10|0;if((n|0)<7)n=n+1|0;else break}}else o=10;p=c[s>>2]|0;q=(p>>>0)%(o>>>0)|0;n=(s+4|0)==(g|0);if(!(n&(q|0)==0)){r=(((p>>>0)/(o>>>0)|0)&1|0)==0?9007199254740992.0:9007199254740994.0;x=(o|0)/2|0;e=q>>>0<x>>>0?.5:n&(q|0)==(x|0)?1.0:1.5;if(C){x=(a[B>>0]|0)==45;e=x?-e:e;r=x?-r:r}n=p-q|0;c[s>>2]=n;if(r+e!=r){x=n+o|0;c[s>>2]=x;if(x>>>0>999999999){m=s;while(1){n=m+-4|0;c[m>>2]=0;if(n>>>0<j>>>0){j=j+-4|0;c[j>>2]=0}x=(c[n>>2]|0)+1|0;c[n>>2]=x;if(x>>>0>999999999)m=n;else break}}else n=s;m=(y-j>>2)*9|0;p=c[j>>2]|0;if(p>>>0>=10){o=10;do{o=o*10|0;m=m+1|0}while(p>>>0>=o>>>0)}}else n=s}else n=s;n=n+4|0;n=g>>>0>n>>>0?n:g;x=j}else{n=g;x=j}w=n;while(1){if(w>>>0<=x>>>0){u=0;break}j=w+-4|0;if(!(c[j>>2]|0))w=j;else{u=1;break}}g=0-m|0;do if(t){j=k+((v^1)&1)|0;if((j|0)>(m|0)&(m|0)>-5){o=i+-1|0;k=j+-1-m|0}else{o=i+-2|0;k=j+-1|0}j=h&8;if(!j){if(u?(A=c[w+-4>>2]|0,(A|0)!=0):0)if(!((A>>>0)%10|0)){n=0;j=10;do{j=j*10|0;n=n+1|0}while(!((A>>>0)%(j>>>0)|0|0))}else n=0;else n=9;j=((w-y>>2)*9|0)+-9|0;if((o|32|0)==102){s=j-n|0;s=(s|0)>0?s:0;k=(k|0)<(s|0)?k:s;s=0;break}else{s=j+m-n|0;s=(s|0)>0?s:0;k=(k|0)<(s|0)?k:s;s=0;break}}else s=j}else{o=i;s=h&8}while(0);t=k|s;p=(t|0)!=0&1;q=(o|32|0)==102;if(q){v=0;j=(m|0)>0?m:0}else{j=(m|0)<0?g:m;j=Ya(j,((j|0)<0)<<31>>31,E)|0;n=E;if((n-j|0)<2)do{j=j+-1|0;a[j>>0]=48}while((n-j|0)<2);a[j+-1>>0]=(m>>31&2)+43;j=j+-2|0;a[j>>0]=o;v=j;j=n-j|0}j=C+1+k+p+j|0;$a(b,32,f,j,h);Ta(b,B,C);$a(b,48,f,j,h^65536);if(q){o=x>>>0>D>>>0?D:x;s=G+9|0;p=s;q=G+8|0;n=o;do{m=Ya(c[n>>2]|0,0,s)|0;if((n|0)==(o|0)){if((m|0)==(s|0)){a[q>>0]=48;m=q}}else if(m>>>0>G>>>0){Cb(G|0,48,m-F|0)|0;do m=m+-1|0;while(m>>>0>G>>>0)}Ta(b,m,p-m|0);n=n+4|0}while(n>>>0<=D>>>0);if(t|0)Ta(b,1117,1);if(n>>>0<w>>>0&(k|0)>0)while(1){m=Ya(c[n>>2]|0,0,s)|0;if(m>>>0>G>>>0){Cb(G|0,48,m-F|0)|0;do m=m+-1|0;while(m>>>0>G>>>0)}Ta(b,m,(k|0)<9?k:9);n=n+4|0;m=k+-9|0;if(!(n>>>0<w>>>0&(k|0)>9)){k=m;break}else k=m}$a(b,48,k+9|0,9,0)}else{t=u?w:x+4|0;if((k|0)>-1){u=G+9|0;s=(s|0)==0;g=u;p=0-F|0;q=G+8|0;o=x;do{m=Ya(c[o>>2]|0,0,u)|0;if((m|0)==(u|0)){a[q>>0]=48;m=q}do if((o|0)==(x|0)){n=m+1|0;Ta(b,m,1);if(s&(k|0)<1){m=n;break}Ta(b,1117,1);m=n}else{if(m>>>0<=G>>>0)break;Cb(G|0,48,m+p|0)|0;do m=m+-1|0;while(m>>>0>G>>>0)}while(0);F=g-m|0;Ta(b,m,(k|0)>(F|0)?F:k);k=k-F|0;o=o+4|0}while(o>>>0<t>>>0&(k|0)>-1)}$a(b,48,k+18|0,18,0);Ta(b,v,E-v|0)}$a(b,32,f,j,h^8192)}while(0);l=H;return ((j|0)<(f|0)?f:j)|0}function cb(a){a=+a;var b=0;h[j>>3]=a;b=c[j>>2]|0;z=c[j+4>>2]|0;return b|0}function db(a,b){a=+a;b=b|0;return +(+eb(a,b))}function eb(a,b){a=+a;b=b|0;var d=0,e=0,f=0;h[j>>3]=a;d=c[j>>2]|0;e=c[j+4>>2]|0;f=yb(d|0,e|0,52)|0;switch(f&2047){case 0:{if(a!=0.0){a=+eb(a*18446744073709551616.0,b);d=(c[b>>2]|0)+-64|0}else d=0;c[b>>2]=d;break}case 2047:break;default:{c[b>>2]=(f&2047)+-1022;c[j>>2]=d;c[j+4>>2]=e&-2146435073|1071644672;a=+h[j>>3]}}return +a}function fb(b,d,e){b=b|0;d=d|0;e=e|0;do if(b){if(d>>>0<128){a[b>>0]=d;b=1;break}if(!(c[c[(gb()|0)+188>>2]>>2]|0))if((d&-128|0)==57216){a[b>>0]=d;b=1;break}else{c[(Ka()|0)>>2]=84;b=-1;break}if(d>>>0<2048){a[b>>0]=d>>>6|192;a[b+1>>0]=d&63|128;b=2;break}if(d>>>0<55296|(d&-8192|0)==57344){a[b>>0]=d>>>12|224;a[b+1>>0]=d>>>6&63|128;a[b+2>>0]=d&63|128;b=3;break}if((d+-65536|0)>>>0<1048576){a[b>>0]=d>>>18|240;a[b+1>>0]=d>>>12&63|128;a[b+2>>0]=d>>>6&63|128;a[b+3>>0]=d&63|128;b=4;break}else{c[(Ka()|0)>>2]=84;b=-1;break}}else b=1;while(0);return b|0}function gb(){return hb()|0}function hb(){return 332}function ib(){return hb()|0}function jb(b,e){b=b|0;e=e|0;var f=0,g=0;g=0;while(1){if((d[1119+g>>0]|0)==(b|0)){b=2;break}f=g+1|0;if((f|0)==87){f=1207;g=87;b=5;break}else g=f}if((b|0)==2)if(!g)f=1207;else{f=1207;b=5}if((b|0)==5)while(1){do{b=f;f=f+1|0}while((a[b>>0]|0)!=0);g=g+-1|0;if(!g)break;else b=5}return kb(f,c[e+20>>2]|0)|0}function kb(a,b){a=a|0;b=b|0;return lb(a,b)|0}function lb(a,b){a=a|0;b=b|0;if(!b)b=0;else b=mb(c[b>>2]|0,c[b+4>>2]|0,a)|0;return (b|0?b:a)|0}function mb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;o=(c[b>>2]|0)+1794895138|0;h=nb(c[b+8>>2]|0,o)|0;f=nb(c[b+12>>2]|0,o)|0;g=nb(c[b+16>>2]|0,o)|0;a:do if((h>>>0<d>>>2>>>0?(n=d-(h<<2)|0,f>>>0<n>>>0&g>>>0<n>>>0):0)?((g|f)&3|0)==0:0){n=f>>>2;m=g>>>2;l=0;while(1){j=h>>>1;k=l+j|0;i=k<<1;g=i+n|0;f=nb(c[b+(g<<2)>>2]|0,o)|0;g=nb(c[b+(g+1<<2)>>2]|0,o)|0;if(!(g>>>0<d>>>0&f>>>0<(d-g|0)>>>0)){f=0;break a}if(a[b+(g+f)>>0]|0){f=0;break a}f=Na(e,b+g|0)|0;if(!f)break;f=(f|0)<0;if((h|0)==1){f=0;break a}else{l=f?l:k;h=f?j:h-j|0}}f=i+m|0;g=nb(c[b+(f<<2)>>2]|0,o)|0;f=nb(c[b+(f+1<<2)>>2]|0,o)|0;if(f>>>0<d>>>0&g>>>0<(d-f|0)>>>0)f=(a[b+(f+g)>>0]|0)==0?b+f|0:0;else f=0}else f=0;while(0);return f|0}function nb(a,b){a=a|0;b=b|0;var c=0;c=Ab(a|0)|0;return ((b|0)==0?a:c)|0}function ob(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;f=e+16|0;g=c[f>>2]|0;if(!g)if(!(pb(e)|0)){g=c[f>>2]|0;h=5}else f=0;else h=5;a:do if((h|0)==5){j=e+20|0;i=c[j>>2]|0;f=i;if((g-i|0)>>>0<d>>>0){f=ga[c[e+36>>2]&3](e,b,d)|0;break}b:do if((a[e+75>>0]|0)>-1){i=d;while(1){if(!i){h=0;g=b;break b}g=i+-1|0;if((a[b+g>>0]|0)==10)break;else i=g}f=ga[c[e+36>>2]&3](e,b,i)|0;if(f>>>0<i>>>0)break a;h=i;g=b+i|0;d=d-i|0;f=c[j>>2]|0}else{h=0;g=b}while(0);Bb(f|0,g|0,d|0)|0;c[j>>2]=(c[j>>2]|0)+d;f=h+d|0}while(0);return f|0}function pb(b){b=b|0;var d=0,e=0;d=b+74|0;e=a[d>>0]|0;a[d>>0]=e+255|e;d=c[b>>2]|0;if(!(d&8)){c[b+8>>2]=0;c[b+4>>2]=0;e=c[b+44>>2]|0;c[b+28>>2]=e;c[b+20>>2]=e;c[b+16>>2]=e+(c[b+48>>2]|0);b=0}else{c[b>>2]=d|32;b=-1}return b|0}function qb(a,b){a=a|0;b=b|0;var d=0,e=0;d=l;l=l+16|0;e=d;c[e>>2]=b;b=Pa(c[51]|0,a,e)|0;l=d;return b|0}function rb(){}function sb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=a+c>>>0;return (z=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0}function tb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;d=b-d-(c>>>0>a>>>0|0)>>>0;return (z=d,a-c>>>0|0)|0}function ub(b){b=b|0;var c=0;c=a[n+(b&255)>>0]|0;if((c|0)<8)return c|0;c=a[n+(b>>8&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>16&255)>>0]|0;if((c|0)<8)return c+16|0;return (a[n+(b>>>24)>>0]|0)+24|0}function vb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;l=a;j=b;k=j;h=d;n=e;i=n;if(!k){g=(f|0)!=0;if(!i){if(g){c[f>>2]=(l>>>0)%(h>>>0);c[f+4>>2]=0}n=0;f=(l>>>0)/(h>>>0)>>>0;return (z=n,f)|0}else{if(!g){n=0;f=0;return (z=n,f)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;f=0;return (z=n,f)|0}}g=(i|0)==0;do if(h){if(!g){g=(R(i|0)|0)-(R(k|0)|0)|0;if(g>>>0<=31){m=g+1|0;i=31-g|0;b=g-31>>31;h=m;a=l>>>(m>>>0)&b|k<<i;b=k>>>(m>>>0)&b;g=0;i=l<<i;break}if(!f){n=0;f=0;return (z=n,f)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;n=0;f=0;return (z=n,f)|0}g=h-1|0;if(g&h|0){i=(R(h|0)|0)+33-(R(k|0)|0)|0;p=64-i|0;m=32-i|0;j=m>>31;o=i-32|0;b=o>>31;h=i;a=m-1>>31&k>>>(o>>>0)|(k<<m|l>>>(i>>>0))&b;b=b&k>>>(i>>>0);g=l<<p&j;i=(k<<p|l>>>(o>>>0))&j|l<<m&i-33>>31;break}if(f|0){c[f>>2]=g&l;c[f+4>>2]=0}if((h|0)==1){o=j|b&0;p=a|0|0;return (z=o,p)|0}else{p=ub(h|0)|0;o=k>>>(p>>>0)|0;p=k<<32-p|l>>>(p>>>0)|0;return (z=o,p)|0}}else{if(g){if(f|0){c[f>>2]=(k>>>0)%(h>>>0);c[f+4>>2]=0}o=0;p=(k>>>0)/(h>>>0)>>>0;return (z=o,p)|0}if(!l){if(f|0){c[f>>2]=0;c[f+4>>2]=(k>>>0)%(i>>>0)}o=0;p=(k>>>0)/(i>>>0)>>>0;return (z=o,p)|0}g=i-1|0;if(!(g&i)){if(f|0){c[f>>2]=a|0;c[f+4>>2]=g&k|b&0}o=0;p=k>>>((ub(i|0)|0)>>>0);return (z=o,p)|0}g=(R(i|0)|0)-(R(k|0)|0)|0;if(g>>>0<=30){b=g+1|0;i=31-g|0;h=b;a=k<<i|l>>>(b>>>0);b=k>>>(b>>>0);g=0;i=l<<i;break}if(!f){o=0;p=0;return (z=o,p)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;o=0;p=0;return (z=o,p)|0}while(0);if(!h){k=i;j=0;i=0}else{m=d|0|0;l=n|e&0;k=sb(m|0,l|0,-1,-1)|0;d=z;j=i;i=0;do{e=j;j=g>>>31|j<<1;g=i|g<<1;e=a<<1|e>>>31|0;n=a>>>31|b<<1|0;tb(k|0,d|0,e|0,n|0)|0;p=z;o=p>>31|((p|0)<0?-1:0)<<1;i=o&1;a=tb(e|0,n|0,o&m|0,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&l|0)|0;b=z;h=h-1|0}while((h|0)!=0);k=j;j=0}h=0;if(f|0){c[f>>2]=a;c[f+4>>2]=b}o=(g|0)>>>31|(k|h)<<1|(h<<1|g>>>31)&0|j;p=(g<<1|0>>>31)&-2|i;return (z=o,p)|0}function wb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return vb(a,b,c,d,0)|0}function xb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;g=l;l=l+16|0;f=g|0;vb(a,b,d,e,f)|0;l=g;return (z=c[f+4>>2]|0,c[f>>2]|0)|0}function yb(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){z=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}z=0;return b>>>c-32|0}function zb(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){z=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}z=a<<c-32;return 0}function Ab(a){a=a|0;return (a&255)<<24|(a>>8&255)<<16|(a>>16&255)<<8|a>>>24|0}function Bb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;if((e|0)>=8192)return ca(b|0,d|0,e|0)|0;h=b|0;g=b+e|0;if((b&3)==(d&3)){while(b&3){if(!e)return h|0;a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}e=g&-4|0;f=e-64|0;while((b|0)<=(f|0)){c[b>>2]=c[d>>2];c[b+4>>2]=c[d+4>>2];c[b+8>>2]=c[d+8>>2];c[b+12>>2]=c[d+12>>2];c[b+16>>2]=c[d+16>>2];c[b+20>>2]=c[d+20>>2];c[b+24>>2]=c[d+24>>2];c[b+28>>2]=c[d+28>>2];c[b+32>>2]=c[d+32>>2];c[b+36>>2]=c[d+36>>2];c[b+40>>2]=c[d+40>>2];c[b+44>>2]=c[d+44>>2];c[b+48>>2]=c[d+48>>2];c[b+52>>2]=c[d+52>>2];c[b+56>>2]=c[d+56>>2];c[b+60>>2]=c[d+60>>2];b=b+64|0;d=d+64|0}while((b|0)<(e|0)){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0}}else{e=g-4|0;while((b|0)<(e|0)){a[b>>0]=a[d>>0]|0;a[b+1>>0]=a[d+1>>0]|0;a[b+2>>0]=a[d+2>>0]|0;a[b+3>>0]=a[d+3>>0]|0;b=b+4|0;d=d+4|0}}while((b|0)<(g|0)){a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0}return h|0}function Cb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;h=b+e|0;d=d&255;if((e|0)>=67){while(b&3){a[b>>0]=d;b=b+1|0}f=h&-4|0;g=f-64|0;i=d|d<<8|d<<16|d<<24;while((b|0)<=(g|0)){c[b>>2]=i;c[b+4>>2]=i;c[b+8>>2]=i;c[b+12>>2]=i;c[b+16>>2]=i;c[b+20>>2]=i;c[b+24>>2]=i;c[b+28>>2]=i;c[b+32>>2]=i;c[b+36>>2]=i;c[b+40>>2]=i;c[b+44>>2]=i;c[b+48>>2]=i;c[b+52>>2]=i;c[b+56>>2]=i;c[b+60>>2]=i;b=b+64|0}while((b|0)<(f|0)){c[b>>2]=i;b=b+4|0}}while((b|0)<(h|0)){a[b>>0]=d;b=b+1|0}return h-e|0}function Db(a){a=a|0;var b=0,d=0;d=c[i>>2]|0;b=d+a|0;if((a|0)>0&(b|0)<(d|0)|(b|0)<0){W()|0;Z(12);return -1}c[i>>2]=b;if((b|0)>(V()|0)?(U()|0)==0:0){c[i>>2]=d;Z(12);return -1}return d|0}function Eb(a,b){a=a|0;b=b|0;return fa[a&1](b|0)|0}function Fb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ga[a&3](b|0,c|0,d|0)|0}function Gb(a){a=a|0;S(0);return 0}function Hb(a,b,c){a=a|0;b=b|0;c=c|0;S(1);return 0}

// EMSCRIPTEN_END_FUNCS
var fa=[Gb,Ga];var ga=[Hb,Ma,Ia,Ha];return{_KangarooTwelve_Final:ya,_KangarooTwelve_Initialize:wa,_KangarooTwelve_IsAbsorbing:Ca,_KangarooTwelve_IsSqueezing:Ba,_KangarooTwelve_Squeeze:za,_KangarooTwelve_Update:xa,_KangarooTwelve_phase:Da,_NewKangarooTwelve:Aa,___errno_location:Ka,___udivdi3:wb,___uremdi3:xb,_bitshift64Lshr:yb,_bitshift64Shl:zb,_free:Fa,_i64Add:sb,_i64Subtract:tb,_llvm_bswap_i32:Ab,_malloc:Ea,_memcpy:Bb,_memset:Cb,_sbrk:Db,dynCall_ii:Eb,dynCall_iiii:Fb,establishStackSpace:ka,getTempRet0:na,runPostSets:rb,setTempRet0:ma,setThrew:la,stackAlloc:ha,stackRestore:ja,stackSave:ia}})


// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg,Module.asmLibraryArg,buffer);var _KangarooTwelve_Final=Module["_KangarooTwelve_Final"]=asm["_KangarooTwelve_Final"];var _KangarooTwelve_Initialize=Module["_KangarooTwelve_Initialize"]=asm["_KangarooTwelve_Initialize"];var _KangarooTwelve_IsAbsorbing=Module["_KangarooTwelve_IsAbsorbing"]=asm["_KangarooTwelve_IsAbsorbing"];var _KangarooTwelve_IsSqueezing=Module["_KangarooTwelve_IsSqueezing"]=asm["_KangarooTwelve_IsSqueezing"];var _KangarooTwelve_Squeeze=Module["_KangarooTwelve_Squeeze"]=asm["_KangarooTwelve_Squeeze"];var _KangarooTwelve_Update=Module["_KangarooTwelve_Update"]=asm["_KangarooTwelve_Update"];var _KangarooTwelve_phase=Module["_KangarooTwelve_phase"]=asm["_KangarooTwelve_phase"];var _NewKangarooTwelve=Module["_NewKangarooTwelve"]=asm["_NewKangarooTwelve"];var ___errno_location=Module["___errno_location"]=asm["___errno_location"];var ___udivdi3=Module["___udivdi3"]=asm["___udivdi3"];var ___uremdi3=Module["___uremdi3"]=asm["___uremdi3"];var _bitshift64Lshr=Module["_bitshift64Lshr"]=asm["_bitshift64Lshr"];var _bitshift64Shl=Module["_bitshift64Shl"]=asm["_bitshift64Shl"];var _free=Module["_free"]=asm["_free"];var _i64Add=Module["_i64Add"]=asm["_i64Add"];var _i64Subtract=Module["_i64Subtract"]=asm["_i64Subtract"];var _llvm_bswap_i32=Module["_llvm_bswap_i32"]=asm["_llvm_bswap_i32"];var _malloc=Module["_malloc"]=asm["_malloc"];var _memcpy=Module["_memcpy"]=asm["_memcpy"];var _memset=Module["_memset"]=asm["_memset"];var _sbrk=Module["_sbrk"]=asm["_sbrk"];var establishStackSpace=Module["establishStackSpace"]=asm["establishStackSpace"];var getTempRet0=Module["getTempRet0"]=asm["getTempRet0"];var runPostSets=Module["runPostSets"]=asm["runPostSets"];var setTempRet0=Module["setTempRet0"]=asm["setTempRet0"];var setThrew=Module["setThrew"]=asm["setThrew"];var stackAlloc=Module["stackAlloc"]=asm["stackAlloc"];var stackRestore=Module["stackRestore"]=asm["stackRestore"];var stackSave=Module["stackSave"]=asm["stackSave"];var dynCall_ii=Module["dynCall_ii"]=asm["dynCall_ii"];var dynCall_iiii=Module["dynCall_iiii"]=asm["dynCall_iiii"];
Module["asm"]=asm;
Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;
if(memoryInitializer){if(!isDataURI(memoryInitializer)){if(typeof Module["locateFile"]==="function"){memoryInitializer=Module["locateFile"](memoryInitializer)}else if(Module["memoryInitializerPrefixURL"]){memoryInitializer=Module["memoryInitializerPrefixURL"]+memoryInitializer}}
if(ENVIRONMENT_IS_NODE||ENVIRONMENT_IS_SHELL){var data=Module["readBinary"](memoryInitializer);HEAPU8.set(data,GLOBAL_BASE)}else{addRunDependency("memory initializer");var applyMemoryInitializer=(function(data){if(data.byteLength)data=new Uint8Array(data);HEAPU8.set(data,GLOBAL_BASE);if(Module["memoryInitializerRequest"])delete Module["memoryInitializerRequest"].response;removeRunDependency("memory initializer")});function doBrowserLoad(){Module["readAsync"](memoryInitializer,applyMemoryInitializer,(function(){throw"could not load memory initializer "+memoryInitializer}))}var memoryInitializerBytes=tryParseAsDataURI(memoryInitializer);if(memoryInitializerBytes){applyMemoryInitializer(memoryInitializerBytes.buffer)}else if(Module["memoryInitializerRequest"]){function useRequest(){var request=Module["memoryInitializerRequest"];var response=request.response;if(request.status!==200&&request.status!==0){var data=tryParseAsDataURI(Module["memoryInitializerRequestURL"]);if(data){response=data.buffer}else{console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: "+request.status+", retrying "+memoryInitializer);doBrowserLoad();return}}applyMemoryInitializer(response)}if(Module["memoryInitializerRequest"].response){setTimeout(useRequest,0)}else{Module["memoryInitializerRequest"].addEventListener("load",useRequest)}}else{doBrowserLoad()}}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]&&status===0){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}if(ENVIRONMENT_IS_NODE){process["exit"](status)}Module["quit"](status,new ExitStatus(status))}Module["exit"]=exit;function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){Module.print(what);Module.printErr(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}Module["noExitRuntime"]=true;run()

return k12Module.exports;
}  )(k12Module);

//console.log( "u8 is...", u8 );
function DecodeBase64( buf )
{
	var outsize = 0;
	// if the buffer is truncated in length, use that as the 
	// constraint, and if 1 char results with 6 bits, do not
	// count that as a whole byte of output.
	if( buf.length % 4 == 1 )
		outsize = (((buf.length + 3) / 4) * 3) - 3;
	else if( buf.length % 4 == 2 )
		outsize = (((buf.length + 3) / 4) * 3) - 2;
	else if( buf.length % 4 == 3 )
		outsize = (((buf.length + 3) / 4) * 3) - 1;
	else if( buf[buf.length - 1] == '=' ) {
		if( buf[buf.length - 2] == '=' )
			outsize = (((buf.length + 3) / 4) * 3) - 2;
		else
			outsize = (((buf.length + 3) / 4) * 3) - 1;
	}
	else
		outsize = (((buf.length + 3) / 4) * 3);

	var out = new Uint8Array( outsize );

	var n;
	var l = (buf.length+3)/4;
	for( n = 0; n < l; n++ )
	{
		var index0 = decodings[buf[n*4]];
		var index1 = decodings[buf[n*4+1]];
		var index2 = decodings[buf[n*4+2]];
		var index3 = decodings[buf[n*4+3]];
		
		out[n*3+0] = (( index0 ) << 2 | ( index1 ) >> 4);
		out[n*3+1] = (( index1 ) << 4 | ( ( ( index2 ) >> 2 ) & 0x0f ));
		out[n*3+2] = (( index2 ) << 6 | ( ( index3 ) & 0x3F ));
	}

	return out;
}



if( 0 ) {
	var k = KangarooTwelve();

	k.update( "" );
	k.final();
	var realBuf = k.squeeze( 64 );

	var outstr = [];
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "BUF:", outstr.join( " " ) );

	k.release( realBuf );


	console.log( "init..." );

	k.init();
	k.update( "asdf" );
	k.final();
	realBuf = k.squeeze( 64 );

	outstr = [];
	console.log( "format..." );
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "otuput..." );
	console.log( "BUF:", outstr.join( " " ) );


	realBuf = k.squeeze( 64 );

	outstr = [];
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "BUF:", outstr.join( " " ) );
	realBuf = k.squeeze( 64 );

	outstr = [];
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "BUF:", outstr.join( " " ) );
	realBuf = k.squeeze( 64 );

	outstr = [];
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "BUF:", outstr.join( " " ) );


	k.release( realBuf );


	k.init();
	k.update( "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf" );
	k.final();
	realBuf = k.squeeze( 64 );

	outstr = [];
	realBuf.forEach( v=>outstr.push( v.toString(16)) );
	console.log( "BUF:", outstr.join( " " ) );

	k.release( realBuf );
}


if( 0 ) {

	var start = Date.now();
	var n;
	for( n = 0; n < 10000000; n++ ) {
		var s = k.squeeze( 64 );
		k.release(s);
	}
	var end = Date.now();
	console.log( "N in M...", n, end-start, n/(end-start), n*32/(end-start) );

}


function KangarooTwelve() {
	const data = {
		k : 0,
		keybuf : 0,
		keybuflen : 0,
		buf : 0,
		bufMaps : new WeakMap(),
		outbuf : 0,
		realBuf : null,
	};
	var tn = 0;
	var s;
	var K12 = {
		init() {
			s = k12._KangarooTwelve_Initialize( data.k, 0 );	
			//console.log( "Initialize S?", s );
		},
		drop() {
			k12._free( data.keybuf );
			k12._free( data.buf );
			k12._free( data.k );
			//console.log( "S?", s );
		},
		update(buf) {
			var byteLength;
			if( buf instanceof Array ) {
				buf = buf.join();
				byteLength = k12.lengthBytesUTF8( buf );
			} else if( "string" === typeof buf ) {
				byteLength = k12.lengthBytesUTF8( buf );
			} else if( buf instanceof Uint32Array ) {
				byteLength = buf.length * 4;
			} else if( buf instanceof Uint8Array ) {
				byteLength = buf.length;
			}

			if( byteLength > data.keybuflen ) {
				if( data.keybuf )
					k12._free( data.keybuf );
				data.keybuflen = byteLength*2+1;
				data.keybuf = k12._malloc( data.keybuflen );
		
			}
			if( "string" === typeof buf ) {
				k12.stringToUTF8( buf, data.keybuf, byteLength );
			}else if( buf instanceof Uint32Array ) {
				var keydata = new Uint32Array( k12.HEAPU32.buffer, data.keybuf, buf.length );
				//console.log( "copy keydata from binay", keydata );
				for( var b = 0; b < buf.length; b++ )
					keydata[b] = buf[b];
			}
			else if( buf instanceof Uint8Array ) {
				var keydata = new Uint8Array( k12.HEAPU8.buffer, data.keybuf, buf.length );
				//console.log( "copy keydata from binay", keydata );
				for( var b = 0; b < buf.length; b++ )
					keydata[b] = buf[b];
			}

			s = k12._KangarooTwelve_Update( data.k, data.keybuf, byteLength );
			//console.log( "Update S?", s );
		},
		final() {
			s = k12._KangarooTwelve_Final( data.k, 0, 0, 0 );
			//console.log( "Final S?", s );
		},
		squeeze(n) {
			s = k12._KangarooTwelve_Squeeze( data.k, data.outbuf, n );
			//data.realBuf = new Uint8Array( k12.HEAPU8.buffer, data.outbuf, 64 );
			//console.log( "Squeeze?", s, n );
			return data.realBuf;
		},
		release(buf) {
			if(0){
				var bufID = data.bufMaps.get( buf );
				if( bufID ) {
					k12._free( bufID );
					data.bufMaps.delete( buf );
				}
			}
		},
		absorbing: null,
		squeezing: null,
		clone() {
		},
		copy(from) {
		},
		phase() {
			return k12._KangarooTwelve_phase( data.k );
		},
	};
	
	data.k = k12._NewKangarooTwelve();
	data.outbuf = k12._malloc( 64 );
	//console.log( "malloc:", data.outbuf );
	//data.realBuf = k12.HEAPU8.slice( data.outbuf, data.outbuf+64 );
	data.realBuf = new Uint8Array( k12.HEAPU8.buffer, data.outbuf, 64 );
	K12.absorbing = k12._KangarooTwelve_IsAbsorbing.bind(k12,data.k),
	K12.squeezing = k12._KangarooTwelve_IsSqueezing.bind(k12,data.k),

	K12.init();

	return K12;
}

//-------------- byte xbox ------------------------------

function BlockShuffle_ByteShuffler( ctx ) {
	//struct byte_shuffle_key *key = New( struct byte_shuffle_key );
	var key = { map:[], dmap:[] };
	var n;
	var srcMap;
	for( n = 0; n < 256; n++ )
		key.map[n] = n;

	// simple-in-place shuffler.

	for( n = 0; n < 256; n++ ) {
		var m;
		var t;
		m = ctx.getByte(); //console.log( "swap:", n, m );
		t = key.map[m];
		key.map[m] = key.map[n];
		key.map[n] = t;
	}

	for( n = 0; n < 256; n++ )
		key.dmap[key.map[n]] = n;
	return key;
}

function  BlockShuffle_SubByte( key, bytes_input ) {
	return key.map[bytes_input];
}
function  BlockShuffle_BusByte( key, bytes_input ) {
	return key.dmap[bytes_input];
}

function BlockShuffle_SubBytes( key, bytes_input, bytes_output, offset, byteCount ) 
{
	var n;
	const map = key.map;
	for( n = 0; n < byteCount; n++ ) {
		bytes_output[offset+n] = map[bytes_input[offset+n]];
	}
}


function BlockShuffle_BusBytes( key, bytes_input, bytes_output, offset, byteCount ) 
{
	var n;
	const map = key.dmap;
	for( n = 0; n < byteCount; n++ ) {
		bytes_output[offset+n] = map[bytes_input[offset+n]];
	}
}

//----------------- K12-XBOX Utilities -----------------------------

// bit size of masking hash.
const RNGHASH = 256
const localCiphers = [];
function SRG_XSWS_encryptData( objBuf, tick, keyBuf ) {
	if( objBuf.buffer.byteLength & 0x7 ) {
		throw new Error( "buffer to encode must be a multiple of 64 bits; (should also include last byte of padding specification)" );
	}
	function encryptBlock( bytKey
		, output, output8, offset, outlen 
		,  bufKey
	) {
		var n;
		var dolen = outlen/4
		for( n = 0; n < dolen; n++ ) output[n] ^= bufKey [ ((n) % (RNGHASH / 32)) ];
		var p = 0x55;
		for( n = 0; n < outlen; n++ )  p = output8[n] = bytKey.map[output8[n] ^ p];
		p = 0xAA;
		for( n = outlen-1; n >= 0; n-- ) p = output8[n] = bytKey.map[output8[n] ^ p];
	}

	var signEntropy = localCiphers.pop();
	if( !signEntropy ) {
		signEntropy = exports.SaltyRNG( null, {mode:1} );
		signEntropy.initialEntropy = null;
	}
	signEntropy.reset();	
	signEntropy.feed( tick );
	signEntropy.feed( keyBuf );

	var bufKey = new Uint32Array( signEntropy.getBuffer( RNGHASH ) );
	var bytKey = BlockShuffle_ByteShuffler( signEntropy );

	var outBufLen = objBuf.length * 4;
	//outBuf[0] = (uint8_t*)HeapAllocateAligned( NULL, (*outBufLen), 4096 );
	var outBuf = objBuf;//new Uint32Array( outBufLen / 4 );
	var outBuf8 = new Uint8Array( outBuf.buffer );

	for( var b = 0; b < outBufLen; b += 4096 ) {
		var bs = outBufLen - b;
		if( bs > 4096 )
			encryptBlock( bytKey, outBuf, outBuf8, b, 4096, bufKey );
		else
			encryptBlock( bytKey, outBuf, outBuf8, b, bs, bufKey );
	}

	localCiphers.push( signEntropy );

	return outBuf8;
}

function SRG_XSWS_encryptString( objBuf, tick, keyBuf ) {
	var tickBuf = new Uint32Array( 2 );
	
	tickBuf[0] = tick & 0xFFFFFFFF;
	tickBuf[1] = ( tick / 0x100000000 ) & 0xFFFFFFFF;
	var ob = myTextEncoder( objBuf );
	//console.log( "INPUT BUF?", ob.length );
	var ob32 = new Uint32Array( ob.buffer );
	//console.log( "BUF?", ob32, ob32[0], tickBuf, keyBuf );
	return SRG_XSWS_encryptData( ob32, tickBuf, keyBuf );
}

function SRG_XSWS_decryptData( objBuf,  tick, keyBuf ) {
	function decryptBlock( bytKey
		, input, offset,  len
		, output, output8
		, bufKey
	) {
		var n;
		for( n = 0; n < (len - 1); n++ ) output8[offset+n] = bytKey.dmap[input[offset+n]] ^ input[offset+n+1];
        	output8[offset+n] = bytKey.dmap[output[offset+n]] ^ 0xAA;
		for( n = (len - 1); n > 0; n-- ) output8[offset+n] = bytKey.dmap[output8[offset+n]] ^ output8[offset+n-1];
		output8[offset+0] = bytKey.dmap[output8[offset+0]] ^ 0x55;
		var dolen = len / 4;
		for( n = 0; n < dolen; n ++ ) output[offset+n] ^= bufKey [ ((n) % (RNGHASH / 32)) ];
	}

	
	var signEntropy = localCiphers.pop();
	if( !signEntropy ) {
		signEntropy = exports.SaltyRNG( null, {mode:1} );
		signEntropy.initialEntropy = null;
	}
	
	signEntropy.reset();	
	signEntropy.feed( tick );
	signEntropy.feed( keyBuf );

	var bufKey = new Uint32Array( signEntropy.getBuffer( RNGHASH ) );
	var bytKey = BlockShuffle_ByteShuffler( signEntropy );

	var outBuf = new Uint32Array( objBuf.length );
	var outBuf8 = new Uint8Array( outBuf.buffer );
	var blockLen = objBuf.buffer.byteLength;
	for( var b = 0; b < blockLen; b += 4096 ) {
		var bs = blockLen - b;
		if( bs > 4096 )
			decryptBlock( bytKey, objBuf, b, 4096, outBuf, outBuf8, bufKey );
		else
			decryptBlock( bytKey, objBuf, b, bs, outBuf, outBuf8, bufKey );
	}
	outBuf = new Uint8Array( outBuf8, 0, outBuf.length - outBuf[0] + objBuf.buffer.length - 1 );

	localCiphers.push( signEntropy );
	return outBuf;
}

function SRG_XSWS_decryptString( objBuf, tick, keyBuf ) {
	var tickBuf = new Uint32Array( 2 );
	
	tickBuf[0] = tick & 0xFFFFFFFF;
	tickBuf[1] = ( tick / 0x100000000 ) & 0xFFFFFFFF;
	var outBuf = SRG_XSWS_decryptData( objBuf, tickBuf, keyBuf );
	return myTextDecoder( outBuf );
}

        // string->Uint8
	function myTextEncoder(s) {	
		var chars = [...s];
		var len = 0;
		for( var n = 0; n < chars.length; n++ ) {
			var chInt = chars[n].codePointAt(0);
			if( chInt < 128 ) 
				len++;
			else if( chInt < 0x800 ) 
				len += 2;
			else if( chInt < 0x10000 ) 
				len += 3;
			else if( chInt < 0x110000 ) 
				len += 4;
		}
		len+=2;
		var out = new Uint8Array( len + ( len&7?(8-(len&7)):0 ) );
		len = 0;			
		for( var n = 0; n < chars.length; n++ ) {
			var chInt = chars[n].codePointAt(0);
			if( chInt < 128 ) 
				out[len++] = chInt;
			else if( chInt < 0x800 ) {
				out[len++] = ( (chInt & 0x7c0) >> 6 ) | 0xc0;
				out[len++] = ( (chInt & 0x03f) ) | 0x80;
			} else if( chInt < 0x10000 ) {
				out[len++] = ( (chInt & 0xf000) >> 12 ) | 0xE0;
				out[len++] = ( (chInt & 0x0fc0) >> 6 ) | 0x80;
				out[len++] = ( (chInt & 0x003f) ) | 0x80;
			} else if( chInt < 0x110000 ) {
				out[len++] = ( (chInt & 0x01c0000) >> 18 ) | 0xF0;
				out[len++] = ( (chInt & 0x003f000) >> 12 ) | 0xE0;
				out[len++] = ( (chInt & 0x0000fc0) >> 6 ) | 0x80;
				out[len++] = ( (chInt & 0x000003f) ) | 0x80;
			}
		}
		out[len] = 0xFF;
		out[out.length-1] = out.length - (len);
		return out;
	}
        // uInt8 ->string
	function myTextDecoder(buf) {
		var out = '';
		var len;
		for( var n = 0; n < buf.length; n++ ) {
			if( buf[n] === 0xFF ) break;
			if( ( buf[n]& 0x80 ) == 0 )
				out += String.fromCodePoint( buf[n] );
			else if( ( buf[n] & 0xC0 ) == 0x80 ) {
				// invalid character... should already be skipped
			} else if( ( buf[n] & 0xE0 ) == 0xC0 ) {
				out += String.fromCodePoint( ( ( buf[n] & 0x1f ) << 6 ) | ( buf[n+1] & 0x3f ) );
				n++;
			} else if( ( buf[n] & 0xF0 ) == 0xE0 ) {
				out += String.fromCodePoint( ( ( buf[n] & 0xf ) << 12 ) | ( ( buf[n+1] & 0x3f ) << 6 ) | ( buf[n+2] & 0x3f ) );
				n+=2;
			} else if( ( buf[n] & 0xF8 ) == 0xF0 ) {
				out += String.fromCodePoint( ( ( buf[n] & 0x7 ) << 18 ) | ( ( buf[n+1] & 0x3f ) << 12 ) | ( ( buf[n+2] & 0x3f ) << 6 ) | ( buf[n+3] & 0x3f ) );
				n+=3;
			} else if( ( buf[n] & 0xFC ) == 0xF8 ) {
				out += String.fromCodePoint( ( ( buf[n] & 0x3 ) << 24 ) | ( ( buf[n+1] & 0x3f ) << 18 ) | ( ( buf[n+2] & 0x3f ) << 12 ) | ( ( buf[n+3] & 0x3f ) << 6 ) | ( buf[n+4] & 0x3f ) );
				n+=4;
			}
		}
		return out;
	}

function GetCurrentTick() {
	var now = new Date();
	var tick = now.getTime() * 256;
	tick |= ( -now.getTimezoneOffset() /15 ) & 0xFF;
	return tick;
}


function TickToTime( tick ) {
	var now = new Date( tick / 256 );
}
exports.SRG_XSWS_encryptString = SRG_XSWS_encryptString;
exports.SRG_XSWS_decryptString = SRG_XSWS_decryptString;
exports.SRG_XSWS_encryptData = SRG_XSWS_encryptData;
exports.SRG_XSWS_decryptData = SRG_XSWS_decryptData;
exports.TickToTime = TickToTime;
exports.GetCurrentTick = GetCurrentTick;


var seeds = [];
function shuffleSeeder(salt){
  var val;
  if( seeds.length ) {
    //console.log( "using seed... ", seeds.length )
    salt.push( seeds.shift() );
  } else {
    salt.push(  ( val = new Date().getTime(), val =( val % 100000 ) * ( val % 100000 ) )  );
    if( outSeeds )
      outSeeds.write( String(val) + "\n");
  }
}

const shuffleRNG = exports.SaltyRNG( shuffleSeeder, {mode:1} );
function Holder() {
  return {
    number : 0
    , r : 0
    , less : null
    , more : null
  };
}

var nHolders = 0;
var holders = [];

function sort(  tree,  number,  r )
{
    //console.log( "Assign ", r, " to ", number)
   if( !tree )
   {
      tree = holders.pop();
      if( !tree ) tree = Holder();
      tree.number = number;
      tree.r = r;
      tree.pLess = tree.pMore = null;
   }
   else
   {
      if( r > tree.r )
         tree.pMore = sort( tree.pMore, number, r );
      else
         tree.pLess = sort( tree.pLess, number, r );
   }
   return tree;
}

var nNumber = 0;
function  FoldTree( tree, numbers, count )
{
   if( !(count-numbers.length) ) return numbers;
   if( tree.pLess )
      FoldTree( tree.pLess, numbers, count );
   numbers.push(tree.number);
   holders.push(tree);
   if( tree.pMore )
      FoldTree( tree.pMore, numbers, count ); 
   return numbers
}

function  Shuffle( numbers, count, RNG )
{
	const bits = (Math.ceil(Math.log2( numbers.length ))+2 )|0;
	var tree;
	var n;
	tree = null;
	for( n of numbers )
		tree = sort( tree, n, RNG.getBits(bits) );//RNG.getBits( 13 ) );

	var x = FoldTree( tree, [], count||numbers.length );
	
	return x;
}

exports.Shuffler = Shuffler;
function Shuffler( opts ) {
	var RNG;
	if( opts && opts.salt ) {
		RNG = exports.SaltyRNG( opts.salt, {mode:1} );
	}
	else 
		RNG = exports.SaltyRNG( shuffleSeeder, {mode:1} );
	return {
		shuffle(numbers,count) {
			 return Shuffle(numbers,count, RNG);
		}
	};
}


if( !module.parent ) {
	var keybuf = new Uint8Array(1);
	
	var output = SRG_XSWS_encryptString( "test", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	var input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
	
	output = SRG_XSWS_encryptString( "test1", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
	
	output = SRG_XSWS_encryptString( "test12", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
	
	output = SRG_XSWS_encryptString( "test123", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
	
	output = SRG_XSWS_encryptString( "test1234", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
	        
	output = SRG_XSWS_encryptString( "test1235", 123, keybuf );
	console.log( "ENC OUTPUT? ", output );
	input = SRG_XSWS_decryptString( output, 123, keybuf );
	console.log( "DEC OUTPUT? ", input, input.length );
}


/**
 * @class SphereShape
 * @param radius {Number} sphere radius
 * @constructor
 */
Goblin.SphereShape = function( radius ) {
	this.radius = radius;

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.SphereShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = aabb.min.y = aabb.min.z = -this.radius;
	aabb.max.x = aabb.max.y = aabb.max.z = this.radius;
};

Goblin.SphereShape.prototype.getInertiaTensor = function( mass ) {
	var element = 0.4 * mass * this.radius * this.radius;
	return new Goblin.Matrix3(
		element, 0, 0,
		0, element, 0,
		0, 0, element
	);
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in local coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.SphereShape.prototype.findSupportPoint = (function(){
	var temp = new Goblin.Vector3();
	return function( direction, support_point ) {
		temp.normalizeVector( direction );
		support_point.scaleVector( temp, this.radius );
	};
})();

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.SphereShape.prototype.rayIntersect = (function(){
	var direction = new Goblin.Vector3(),
		length;

	return function( start, end ) {
		direction.subtractVectors( end, start );
		length = direction.length();
		direction.scale( 1 / length  ); // normalize direction

		var a = start.dot( direction ),
			b = start.dot( start ) - this.radius * this.radius;

		// if ray starts outside of sphere and points away, exit
		if ( a >= 0 && b >= 0 ) {
			return null;
		}

		var discr = a * a - b;

		// Check for ray miss
		if ( discr < 0 ) {
			return null;
		}

		// ray intersects, find closest intersection point
		var discr_sqrt = Math.sqrt( discr ),
			t = -a - discr_sqrt;
		if ( t < 0 ) {
			t = -a + discr_sqrt;
		}

		// verify the segment intersects
		if ( t > length ) {
			return null;
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.point.scaleVector( direction, t );
		intersection.t = t;
		intersection.point.add( start );

        intersection.normal.normalizeVector( intersection.point );

		return intersection;
	};
})();

//import {noise} from "./perlin-min.mjs"

var noiseOpts;
var noiseMap = noise(noiseOpts ={
	patchSize : 256,
	seed_noise : '' + Date.now(),
	repeat_modulo : 256,
	//base : 0,
} );

function createTestData() {
	var result = {};
	
	function memoize(f) {
		var cached = null;
		return function(a) {
			if(cached === null) { 
				cached = f(a);
			}
			return cached;
		}
	}
	
	function makeVolume(dims, f) {
		return memoize( function(fill) {
			var res = new Array(3);
			for(var i=0; i<3; ++i) {
				res[i] = 2 + Math.ceil((dims[i][1] - dims[i][0]) / dims[i][2]);
			}

			var volume = new Float32Array((res[0]+(fill?2:0)) * (res[1]+(fill?2:0)) * (res[2]+(fill?2:0)))
				, n = 0;
			if( fill )
			for(var k=0; k < 1; k++ )
			for(var j=-1, y=dims[1][0]-dims[1][2]; j<=res[1]; ++j, y+=dims[1][2])
			for(var i=-1, x=dims[0][0]-dims[0][2]; i<=res[0]; ++i, x+=dims[0][2], ++n) {
				if( fill < 0 )
					volume[n] = 2.3 * Math.random();
				if( fill > 0 )
					volume[n] = -2.3 * Math.random();
			}
			for(var k=0, z=dims[2][0]-dims[2][2]; k<res[2]; ++k, z+=dims[2][2])
			for(var j=-1, y=dims[1][0]-dims[1][2]; j<=res[1]; ++j, y+=dims[1][2])
			for(var i=-1, x=dims[0][0]-dims[0][2]; i<=res[0]; ++i, x+=dims[0][2], ++n) {
				if( j < 0 || i < 0 || j == res[1] || i == res[0]){
					if( fill < 0 )
						volume[n] = 2.3 * Math.random();
					else if( fill > 0 )
						volume[n] = -2.3 * Math.random();
					else n--;
				}else
					volume[n] = f(x,y,z);
			}
			if( fill )
			for(var k=0; k < 1; k++ )
			for(var j=-1, y=dims[1][0]-dims[1][2]; j<=res[1]; ++j, y+=dims[1][2])
			for(var i=-1, x=dims[0][0]-dims[0][2]; i<=res[0]; ++i, x+=dims[0][2], ++n) {
				if( fill < 0 )
					volume[n] = 2.3 * Math.random();
				if( fill > 0 )
					volume[n] = -2.3 * Math.random();
			}
			res[0] = res[0] + (fill?2:0);
			res[1] = res[1] + (fill?2:0);
			res[2] = res[2] + (fill?2:0);
			return {data: volume, dims:res};
		});
	}

	result['Sphere'] = makeVolume(
		[[-1.0, 1.0, 0.25],
		 [-1.0, 1.0, 0.25],
		 [-1.0, 1.0, 0.25]],
		function(x,y,z) {
			return x*x + y*y + z*z - 1.0;
		}
	);

	result['dots'] = makeVolume(
		[[-4.0, 4.0, 1],
		 [-4.0, 4.0, 1],
		 [-4.0, 6.0, 1]],
		function(x,y,z) {
			//console.log( "duh? ", x, y, z );
			if( ( Math.abs(x) % 2 == 1 )
			&& ( (z < 0 ) ? ( Math.abs(y) % 2 == 1 ) : ( Math.abs(y) % 2 == 0 ) )
			&& ( ( Math.abs(x) % 2 == 0 ) ? ( Math.abs(z) % 2 == 1 ) : ( Math.abs(z) % 2 == 1 ) ))
				return -2.3 * Math.random();
			else
				return 2.3 * Math.random();
		}
	);


	result['Torus'] = makeVolume(
		[[-2.0, 2.0, 0.2],
		 [-2.0, 2.0, 0.2],
		 [-1.0, 1.0, 0.2]],
		function(x,y,z) {
			return Math.pow(1.0 - Math.sqrt(x*x + y*y), 2) + z*z - 0.25;
		}
	);

	result['Big Sphere'] = makeVolume(
		[[-1.0, 1.0, 0.05],
		 [-1.0, 1.0, 0.05],
		 [-1.0, 1.0, 0.05]],
		function(x,y,z) {
			return x*x + y*y + z*z - 1.0;
		}
	);
	
	result['Hyperelliptic'] = makeVolume(
		[[-1.0, 1.0, 0.05],
		 [-1.0, 1.0, 0.05],
		 [-1.0, 1.0, 0.05]],
		function(x,y,z) {
			return Math.pow( Math.pow(x, 6) + Math.pow(y, 6) + Math.pow(z, 6), 1.0/6.0 ) - 1.0;
		}  
	);
	
	result['Nodal Cubic'] = makeVolume(
		[[-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05]],
		function(x,y,z) {
			return x*y + y*z + z*x + x*y*z;
		}
	);
	
	result["Goursat's Surface"] = makeVolume(
		[[-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05]],
		function(x,y,z) {
			return Math.pow(x,4) + Math.pow(y,4) + Math.pow(z,4) - 1.5 * (x*x  + y*y + z*z) + 1;
		}
	);
	
	result["Heart"] = makeVolume(
		[[-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05],
		 [-2.0, 2.0, 0.05]],
		function(x,y,z) {
			y *= 1.5;
			z *= 1.5;
			return Math.pow(2*x*x+y*y+2*z*z-1, 3) - 0.1 * z*z*y*y*y - y*y*y*x*x;
		}
	);
	
	result["Nordstrand's Weird Surface"] = makeVolume(
		[[-0.8, 0.8, 0.01],
		 [-0.8, 0.8, 0.01],
		 [-0.8, 0.8, 0.01]],
		function(x,y,z) {
			return 25 * (Math.pow(x,3)*(y+z) + Math.pow(y,3)*(x+z) + Math.pow(z,3)*(x+y)) +
				50 * (x*x*y*y + x*x*z*z + y*y*z*z) -
				125 * (x*x*y*z + y*y*x*z+z*z*x*y) +
				60*x*y*z -
				4*(x*y+x*z+y*z);
		}
	);
	
	result['Sine Waves'] = makeVolume(
		[[-Math.PI*2, Math.PI*2, Math.PI/8],
		 [-Math.PI*2, Math.PI*2, Math.PI/8],
		 [-Math.PI*2, Math.PI*2, Math.PI/8]],
		function(x,y,z) {
			return Math.sin(x) + Math.sin(y) + Math.sin(z);
		}
	);
	
	result['Perlin Noise'] = makeVolume(
		[[-5, 5, 0.25],
		 [-5, 5, 0.25],
		 [-5, 5, 0.25]],
		function(x,y,z) {
			return PerlinNoise.noise(x,y,z) - 0.5;
		}
	);
		
	result['Asteroid'] = makeVolume(
		[[-1, 1, 0.08],
		 [-1, 1, 0.08],
		 [-1, 1, 0.08]],
		function(x,y,z) {
			return (x*x + y*y + z*z) - PerlinNoise.noise(x*2,y*2,z*2);
		}
	);
	var pos = 0;
	result['Terrain 2'] = makeVolume(
		[[-1, 1, 0.05],
		 [-1, 1, 0.05],
		 [-1, 1, 0.05]],
		function(x,y,z) {
		    	if( x==-1&&y===-1&&z===-1) {
				noiseOpts.seed = '' + Date.now();
				noiseMap = noise(noiseOpts );
				pos += 5;
			}
			return   y +1.8  - noiseMap.get(x*40+5 + pos,0/*y*40+3*/,z*40+0.6)*3;
			return   noiseMap.get(x*40+5 + pos,0/*y*40+3*/,z*40+0.6)*2;
		}
	);

	var pos = 0;
	result['Terrain 3'] = makeVolume(
		[[-1, 1, 0.05],
		 [-1, 1, 0.05],
		 [-1, 1, 0.05]],
		function(x,y,z) {
		    	if( x==-1&&y===-1&&z===-1) {
				noiseOpts.seed = '' + Date.now();
				noiseMap = noise(noiseOpts );
				pos += 5;
			}
			return   noiseMap.get(x*40+5 + pos,y*40+3,z*40+0.6)*2 - 1.0;
		}
	);

	
	result['Terrain'] = makeVolume(
		[[-1, 1, 0.05],
		 [-1, 1, 0.05],
		 [-1, 1, 0.05]],
		function(x,y,z) {
			return  y + PerlinNoise.noise(x*2+5,y*2+3,z*2+0.6);
		}
	);

	function distanceFromConvexPlanes(planes, planeOffsets, x, y, z) {
		var maxDistance = -Infinity;
		for(var i = 0; i < planes.length; i++) {
			var x_ = x - planeOffsets[i][0];
			var y_ = y - planeOffsets[i][1];
			var z_ = z - planeOffsets[i][2];

			var dotProduct = planes[i][0] * x_ + planes[i][1] * y_ + planes[i][2] * z_;

			maxDistance = Math.max(maxDistance, dotProduct);
		}

		return maxDistance;
	}

	result['Pyramid'] = makeVolume(
		[[-1, 1, 0.125],
		 [-1, 1, 0.125],
		 [-1, 1, 0.125]],
		function(x,y,z) {
			var ROOT_3 = Math.sqrt(3);

			var planes = [[-ROOT_3, ROOT_3, -ROOT_3],
							      [-ROOT_3, ROOT_3,  ROOT_3],
							      [ ROOT_3, ROOT_3, -ROOT_3],
							      [ ROOT_3, ROOT_3,  ROOT_3]];
			var planeOffsets = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

			return distanceFromConvexPlanes(planes, planeOffsets, x, y, z);
		}
	);

	result['1/2 Offset Pyramid'] = makeVolume(
		[[-1, 1, 0.125],
		 [-1, 1, 0.125],
		 [-1, 1, 0.125]],
		function(x,y,z) {
			var ROOT_3 = Math.sqrt(3);

			var planes = [[-ROOT_3, ROOT_3, -ROOT_3],
							      [-ROOT_3, ROOT_3,  ROOT_3],
							      [ ROOT_3, ROOT_3, -ROOT_3],
							      [ ROOT_3, ROOT_3,  ROOT_3]];
			var planeOffsets = [[0.0625, 0.0625, 0.0625],
							            [0.0625, 0.0625, 0.0625],
							            [0.0625, 0.0625, 0.0625],
							            [0.0625,0.0625,0.0625]];

			return distanceFromConvexPlanes(planes, planeOffsets, x, y, z);
		}
	);

	result['Tetrahedron'] = makeVolume(
		[[-1, 1, 0.125],
		 [-1, 1, 0.125],
		 [-1, 1, 0.125]],
		function(x,y,z) {
			var INV_ROOT_3 = Math.sqrt(3)/3;

			var planes = [[ INV_ROOT_3,  INV_ROOT_3,  INV_ROOT_3],
							      [-INV_ROOT_3, -INV_ROOT_3,  INV_ROOT_3],
							      [ INV_ROOT_3, -INV_ROOT_3, -INV_ROOT_3],
							      [-INV_ROOT_3,  INV_ROOT_3, -INV_ROOT_3]];
			var planeOffsets = [[ 0.25,  0.25,  0.25],
							            [-0.25, -0.25,  0.25],
							            [ 0.25, -0.25, -0.25],
							            [-0.25,  0.25, -0.25]];

			return distanceFromConvexPlanes(planes, planeOffsets, x, y, z);
		}
	);

	result['1/2 Offset Tetrahedron'] = makeVolume(
		[[-1, 1, 0.125],
		 [-1, 1, 0.125],
		 [-1, 1, 0.125]],
		function(x,y,z) {
			var INV_ROOT_3 = Math.sqrt(3)/3;

			var planes = [[ INV_ROOT_3,  INV_ROOT_3,  INV_ROOT_3],
							      [-INV_ROOT_3, -INV_ROOT_3,  INV_ROOT_3],
							      [ INV_ROOT_3, -INV_ROOT_3, -INV_ROOT_3],
							      [-INV_ROOT_3,  INV_ROOT_3, -INV_ROOT_3]];
			var planeOffsets = [[ 0.3125,  0.3125,  0.3125],
							            [-0.3125, -0.3125,  0.3125],
							            [ 0.3125, -0.3125, -0.3125],
							            [-0.3125,  0.3125, -0.3125]];

			return distanceFromConvexPlanes(planes, planeOffsets, x, y, z);
		}
	);
	
	result['Empty'] = function(){ return { data: new Float32Array(32*32*32), dims:[32,32,32] } };
	
	return result;
}

//export {createTestData}
/**
 * @class TriangleShape
 * @param vertex_a {Vector3} first vertex
 * @param vertex_b {Vector3} second vertex
 * @param vertex_c {Vector3} third vertex
 * @constructor
 */
Goblin.TriangleShape = function( vertex_a, vertex_b, vertex_c ) {
	/**
	 * first vertex of the triangle
	 *
	 * @property a
	 * @type {Vector3}
	 */
	this.a = vertex_a;

	/**
	 * second vertex of the triangle
	 *
	 * @property b
	 * @type {Vector3}
	 */
	this.b = vertex_b;

	/**
	 * third vertex of the triangle
	 *
	 * @property c
	 * @type {Vector3}
	 */
	this.c = vertex_c;

	/**
	 * normal vector of the triangle
	 *
	 * @property normal
	 * @type {Goblin.Vector3}
	 */
	this.normal = new Goblin.Vector3();
	_tmp_vec3_1.subtractVectors( this.b, this.a );
	_tmp_vec3_2.subtractVectors( this.c, this.a );
	this.normal.crossVectors( _tmp_vec3_1, _tmp_vec3_2 );

	/**
	 * area of the triangle
	 *
	 * @property volume
	 * @type {Number}
	 */
	this.volume = this.normal.length() / 2;

	this.normal.normalize();

	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.TriangleShape.prototype.calculateLocalAABB = function( aabb ) {
	aabb.min.x = Math.min( this.a.x, this.b.x, this.c.x );
	aabb.min.y = Math.min( this.a.y, this.b.y, this.c.y );
	aabb.min.z = Math.min( this.a.z, this.b.z, this.c.z );

	aabb.max.x = Math.max( this.a.x, this.b.x, this.c.x );
	aabb.max.y = Math.max( this.a.y, this.b.y, this.c.y );
	aabb.max.z = Math.max( this.a.z, this.b.z, this.c.z );
};

Goblin.TriangleShape.prototype.getInertiaTensor = function( mass ) {
	// @TODO http://www.efunda.com/math/areas/triangle.cfm
	return new Goblin.Matrix3(
		0, 0, 0,
		0, 0, 0,
		0, 0, 0
	);
};

Goblin.TriangleShape.prototype.classifyVertex = function( vertex ) {
	var w = this.normal.dot( this.a );
	return this.normal.dot( vertex ) - w;
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.TriangleShape.prototype.findSupportPoint = function( direction, support_point ) {
	var dot, best_dot = -Infinity;

	dot = direction.dot( this.a );
	if ( dot > best_dot ) {
		support_point.copy( this.a );
		best_dot = dot;
	}

	dot = direction.dot( this.b );
	if ( dot > best_dot ) {
		support_point.copy( this.b );
		best_dot = dot;
	}

	dot = direction.dot( this.c );
	if ( dot > best_dot ) {
		support_point.copy( this.c );
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3{ end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.TriangleShape.prototype.rayIntersect = (function(){
	var d1 = new Goblin.Vector3(),
		d2 = new Goblin.Vector3(),
		n = new Goblin.Vector3(),
		segment = new Goblin.Vector3(),
		b = new Goblin.Vector3(),
		u = new Goblin.Vector3();

	return function( start, end ) {
		d1.subtractVectors( this.b, this.a );
		d2.subtractVectors( this.c, this.a );
		n.crossVectors( d1, d2 );

		segment.subtractVectors( end, start );
		var det = -segment.dot( n );

		if ( det <= 0 ) {
			// Ray is parallel to triangle or triangle's normal points away from ray
			return null;
		}

		b.subtractVectors( start, this.a );

		var t = b.dot( n ) / det;
		if ( 0 > t || t > 1 ) {
			// Ray doesn't intersect the triangle's plane
			return null;
		}

		u.crossVectors( b, segment );
		var u1 = d2.dot( u ) / det,
			u2 = -d1.dot( u ) / det;

		if ( u1 + u2 > 1 || u1 < 0 || u2 < 0 ) {
			// segment does not intersect triangle
			return null;
		}

		var intersection = Goblin.ObjectPool.getObject( 'RayIntersection' );
		intersection.object = this;
		intersection.t = t * segment.length();
		intersection.point.scaleVector( segment, t );
		intersection.point.add( start );
		intersection.normal.copy( this.normal );

		return intersection;
	};
})();
Goblin.RayIntersection = function() {
	this.object = null;
	this.point = new Goblin.Vector3();
	this.t = null;
    this.normal = new Goblin.Vector3();
};
Goblin.CollisionUtils = {};

Goblin.CollisionUtils.canBodiesCollide = function( object_a, object_b ) {
	if ( object_a._mass === Infinity && object_b._mass === Infinity ) {
		// Two static objects aren't considered to be in contact
		return false;
	}

	// Check collision masks
	if ( object_a.collision_mask !== 0 ) {
		if ( ( object_a.collision_mask & 1 ) === 0 ) {
			// object_b must not be in a matching group
			if ( ( object_a.collision_mask & object_b.collision_groups ) !== 0 ) {
				return false;
			}
		} else {
			// object_b must be in a matching group
			if ( ( object_a.collision_mask & object_b.collision_groups ) === 0 ) {
				return false;
			}
		}
	}
	if ( object_b.collision_mask !== 0 ) {
		if ( ( object_b.collision_mask & 1 ) === 0 ) {
			// object_a must not be in a matching group
			if ( ( object_b.collision_mask & object_a.collision_groups ) !== 0 ) {
				return false;
			}
		} else {
			// object_a must be in a matching group
			if ( ( object_b.collision_mask & object_a.collision_groups ) === 0 ) {
				return false;
			}
		}
	}

	return true;
};
/**
 * Provides methods useful for working with various types of geometries
 *
 * @class GeometryMethods
 * @static
 */
Goblin.GeometryMethods = {
	/**
	 * determines the location in a triangle closest to a given point
	 *
	 * @method findClosestPointInTriangle
	 * @param {vec3} p point
	 * @param {vec3} a first triangle vertex
	 * @param {vec3} b second triangle vertex
	 * @param {vec3} c third triangle vertex
	 * @param {vec3} out vector where the result will be stored
	 */
	findClosestPointInTriangle: (function() {
		var ab = new Goblin.Vector3(),
			ac = new Goblin.Vector3(),
			_vec = new Goblin.Vector3();

		return function( p, a, b, c, out ) {
			var v;

			// Check if P in vertex region outside A
			ab.subtractVectors( b, a );
			ac.subtractVectors( c, a );
			_vec.subtractVectors( p, a );
			var d1 = ab.dot( _vec ),
				d2 = ac.dot( _vec );
			if ( d1 <= 0 && d2 <= 0 ) {
				out.copy( a );
				return;
			}

			// Check if P in vertex region outside B
			_vec.subtractVectors( p, b );
			var d3 = ab.dot( _vec ),
				d4 = ac.dot( _vec );
			if ( d3 >= 0 && d4 <= d3 ) {
				out.copy( b );
				return;
			}

			// Check if P in edge region of AB
			var vc = d1*d4 - d3*d2;
			if ( vc <= 0 && d1 >= 0 && d3 <= 0 ) {
				v = d1 / ( d1 - d3 );
				out.scaleVector( ab, v );
				out.add( a );
				return;
			}

			// Check if P in vertex region outside C
			_vec.subtractVectors( p, c );
			var d5 = ab.dot( _vec ),
				d6 = ac.dot( _vec );
			if ( d6 >= 0 && d5 <= d6 ) {
				out.copy( c );
				return;
			}

			// Check if P in edge region of AC
			var vb = d5*d2 - d1*d6,
				w;
			if ( vb <= 0 && d2 >= 0 && d6 <= 0 ) {
				w = d2 / ( d2 - d6 );
				out.scaleVector( ac, w );
				out.add( a );
				return;
			}

			// Check if P in edge region of BC
			var va = d3*d6 - d5*d4;
			if ( va <= 0 && d4-d3 >= 0 && d5-d6 >= 0 ) {
				w = (d4 - d3) / ( (d4-d3) + (d5-d6) );
				out.subtractVectors( c, b );
				out.scale( w );
				out.add( b );
				return;
			}

			// P inside face region
			var denom = 1 / ( va + vb + vc );
			v = vb * denom;
			w = vc * denom;


			// At this point `ab` and `ac` can be recycled and lose meaning to their nomenclature

			ab.scale( v );
			ab.add( a );

			ac.scale( w );

			out.addVectors( ab, ac );
		};
	})(),

	/**
	 * Finds the Barycentric coordinates of point `p` in the triangle `a`, `b`, `c`
	 *
	 * @method findBarycentricCoordinates
	 * @param p {vec3} point to calculate coordinates of
	 * @param a {vec3} first point in the triangle
	 * @param b {vec3} second point in the triangle
	 * @param c {vec3} third point in the triangle
	 * @param out {vec3} resulting Barycentric coordinates of point `p`
	 */
	findBarycentricCoordinates: function( p, a, b, c, out ) {

		var v0 = new Goblin.Vector3(),
			v1 = new Goblin.Vector3(),
			v2 = new Goblin.Vector3();

		v0.subtractVectors( b, a );
		v1.subtractVectors( c, a );
		v2.subtractVectors( p, a );

		var d00 = v0.dot( v0 ),
			d01 = v0.dot( v1 ),
			d11 = v1.dot( v1 ),
			d20 = v2.dot( v0 ),
			d21 = v2.dot( v1 ),
			denom = d00 * d11 - d01 * d01;

		out.y = ( d11 * d20 - d01 * d21 ) / denom;
		out.z = ( d00 * d21 - d01 * d20 ) / denom;
		out.x = 1 - out.y - out.z;
	},

	/**
	 * Calculates the distance from point `p` to line `ab`
	 * @param p {vec3} point to calculate distance to
	 * @param a {vec3} first point in line
	 * @param b [vec3] second point in line
	 * @returns {number}
	 */
	findSquaredDistanceFromSegment: (function(){
		var ab = new Goblin.Vector3(),
			ap = new Goblin.Vector3(),
			bp = new Goblin.Vector3();

		return function( p, a, b ) {
			ab.subtractVectors( a, b );
			ap.subtractVectors( a, p );
			bp.subtractVectors( b, p );

			var e = ap.dot( ab );
			if ( e <= 0 ) {
				return ap.dot( ap );
			}

			var f = ab.dot( ab );
			if ( e >= f ) {
				return bp.dot( bp );
			}

			return ap.dot( ap ) - e * e / f;
		};
	})(),

	findClosestPointsOnSegments: (function(){
		var d1 = new Goblin.Vector3(),
			d2 = new Goblin.Vector3(),
			r = new Goblin.Vector3(),
			clamp = function( x, min, max ) {
				return Math.min( Math.max( x, min ), max );
			};

		return function( aa, ab, ba, bb, p1, p2 ) {
			d1.subtractVectors( ab, aa );
			d2.subtractVectors( bb, ba );
			r.subtractVectors( aa, ba );

			var a = d1.dot( d1 ),
				e = d2.dot( d2 ),
				f = d2.dot( r );

			var s, t;

			if ( a <= Goblin.EPSILON && e <= Goblin.EPSILON ) {
				// Both segments are degenerate
				s = t = 0;
				p1.copy( aa );
				p2.copy( ba );
				_tmp_vec3_1.subtractVectors( p1, p2 );
				return _tmp_vec3_1.dot( _tmp_vec3_1 );
			}

			if ( a <= Goblin.EPSILON ) {
				// Only first segment is degenerate
				s = 0;
				t = f / e;
				t = clamp( t, 0, 1 );
			} else {
				var c = d1.dot( r );
				if ( e <= Goblin.EPSILON ) {
					// Second segment is degenerate
					t = 0;
					s = clamp( -c / a, 0, 1 );
				} else {
					// Neither segment is degenerate
					var b = d1.dot( d2 ),
						denom = a * e - b * b;

					if ( denom !== 0 ) {
						// Segments aren't parallel
						s = clamp( ( b * f - c * e ) / denom, 0, 1 );
					} else {
						s = 0;
					}

					// find point on segment2 closest to segment1(s)
					t = ( b * s + f ) / e;

					// validate t, if it needs clamping then clamp and recompute s
					if ( t < 0 ) {
						t = 0;
						s = clamp( -c / a, 0, 1 );
					} else if ( t > 1 ) {
						t = 1;
						s = clamp( ( b - c ) / a, 0, 1 );
					}
				}
			}

			p1.scaleVector( d1, s );
			p1.add( aa );

			p2.scaleVector( d2, t );
			p2.add( ba );

			_tmp_vec3_1.subtractVectors( p1, p2 );
			return _tmp_vec3_1.dot( _tmp_vec3_1 );
		};
	})()
};
(function(){
	Goblin.MinHeap = function( array ) {
		this.heap = array == null ? [] : array.slice();

		if ( this.heap.length > 0 ) {
			this.heapify();
		}
	};
	Goblin.MinHeap.prototype = {
		heapify: function() {
			var start = ~~( ( this.heap.length - 2 ) / 2 );
			while ( start >= 0 ) {
				this.siftUp( start, this.heap.length - 1 );
				start--;
			}
		},
		siftUp: function( start, end ) {
			var root = start;

			while ( root * 2 + 1 <= end ) {
				var child = root * 2 + 1;

				if ( child + 1 <= end && this.heap[child + 1].valueOf() < this.heap[child].valueOf() ) {
					child++;
				}

				if ( this.heap[child].valueOf() < this.heap[root].valueOf() ) {
					var tmp = this.heap[child];
					this.heap[child] = this.heap[root];
					this.heap[root] = tmp;
					root = child;
				} else {
					return;
				}
			}
		},
		push: function( item ) {
			this.heap.push( item );

			var root = this.heap.length - 1;
			while ( root !== 0 ) {
				var parent = ~~( ( root - 1 ) / 2 );

				if ( this.heap[parent].valueOf() > this.heap[root].valueOf() ) {
					var tmp = this.heap[parent];
					this.heap[parent] = this.heap[root];
					this.heap[root] = tmp;
				}

				root = parent;
			}
		},
		peek: function() {
			return this.heap.length > 0 ? this.heap[0] : null;
		},
		pop: function() {
			var entry = this.heap[0];
			this.heap[0] = this.heap[this.heap.length - 1];
			this.heap.length = this.heap.length - 1;
			this.siftUp( 0, this.heap.length - 1 );

			return entry;
		}
	};
})();
/**
 * Extends a given shape by sweeping a line around it
 *
 * @class LineSweptShape
 * @param start {Vector3} starting point of the line
 * @param end {Vector3} line's end point
 * @param shape any Goblin shape object
 * @constructor
 */
Goblin.LineSweptShape = function( start, end, shape ) {
	/**
	 * starting point of the line
	 *
	 * @property start
	 * @type {Vector3}
	 */
	this.start = start;

	/**
	 * line's end point
	 *
	 * @property end
	 * @type {Vector3}
	 */
	this.end = end;

	/**
	 * shape being swept
	 *
	 * @property shape
	 */
	this.shape = shape;

	/**
	 * unit direction of the line
	 *
	 * @property direction
	 * @type {Vector3}
	 */
	this.direction = new Goblin.Vector3();
	this.direction.subtractVectors( end, start );

	/**
	 * length of the line
	 *
	 * @property length
	 * @type {Number}
	 */
	this.length = this.direction.length();
	this.direction.normalize();

	/**
	 * axis-aligned bounding box of this shape
	 *
	 * @property aabb
	 * @type {AABB}
	 */
	this.aabb = new Goblin.AABB();
	this.calculateLocalAABB( this.aabb );
};

/**
 * Calculates this shape's local AABB and stores it in the passed AABB object
 *
 * @method calculateLocalAABB
 * @param aabb {AABB}
 */
Goblin.LineSweptShape.prototype.calculateLocalAABB = function( aabb ) {
	this.shape.calculateLocalAABB( aabb );

	aabb.min.x = Math.min( aabb.min.x + this.start.x, aabb.min.x + this.end.x );
	aabb.min.y = Math.min( aabb.min.y + this.start.y, aabb.min.y + this.end.y );
	aabb.min.z = Math.min( aabb.min.z + this.start.z, aabb.min.z + this.end.z );

	aabb.max.x = Math.max( aabb.max.x + this.start.x, aabb.max.x + this.end.x );
	aabb.max.y = Math.max( aabb.max.y + this.start.y, aabb.max.y + this.end.y );
	aabb.max.z = Math.max( aabb.max.z + this.start.z, aabb.max.z + this.end.z );
};

Goblin.LineSweptShape.prototype.getInertiaTensor = function( mass ) {
	// this is wrong, but currently not used for anything
	return this.shape.getInertiaTensor( mass );
};

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.LineSweptShape.prototype.findSupportPoint = function( direction, support_point ) {
	this.shape.findSupportPoint( direction, support_point );

	// Add whichever point of this line lies in `direction`
	var dot = this.direction.dot( direction );

	if ( dot < 0 ) {
		support_point.add( this.start );
	} else {
		support_point.add( this.end );
	}
};

/**
 * Checks if a ray segment intersects with the shape
 *
 * @method rayIntersect
 * @property start {vec3} start point of the segment
 * @property end {vec3} end point of the segment
 * @return {RayIntersection|null} if the segment intersects, a RayIntersection is returned, else `null`
 */
Goblin.LineSweptShape.prototype.rayIntersect = function(){
	return null;
};
	if ( typeof window !== 'undefined' ) window.Goblin = Goblin;
	if ( typeof self !== 'undefined' ) self.Goblin = Goblin;
	if ( typeof module !== 'undefined' ) module.exports = Goblin;
})();