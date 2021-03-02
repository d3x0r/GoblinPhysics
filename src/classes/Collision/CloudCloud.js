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
