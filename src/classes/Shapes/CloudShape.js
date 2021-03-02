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



