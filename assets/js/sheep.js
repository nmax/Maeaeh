var Sheep = (function() {

  var SheepConststructor = function( options ) {

    THREE.Object3D.call( this );

    var material  = new THREE.MeshPhongMaterial({
      ambient: 0xa9a9b1,
      map: options.texture
    });

    var torso = new THREE.CubeGeometry( 3, 3, 3 );
    this.add( new THREE.Mesh( torso, material ) );

    // add head
    var head = new THREE.Mesh( new THREE.CubeGeometry( 2, 2, 2 ), material );
    head.position.y = 2;
    head.position.x = 1.5;
    this.add( head );

    var hooves = [];
    hooves[ 0 ] = new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material );
    hooves[ 1 ] = new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material );
    hooves[ 2 ] = new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material );
    hooves[ 3 ] = new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material );

    hooves[ 0 ].position.x = -1;
    hooves[ 1 ].position.x = -1;
    hooves[ 2 ].position.x = 1;
    hooves[ 3 ].position.x = 1;

    hooves[ 0 ].position.z = 1;
    hooves[ 1 ].position.z = -1;
    hooves[ 2 ].position.z = 1;
    hooves[ 3 ].position.z = -1;

    hooves.forEach( function( hoove ) {
      hoove.position.y = -2;
      this.add( hoove );
    }.bind( this ));

    this.position = options.position || this.position;
    this.velocity = new THREE.Vector3();

  };

  SheepConststructor.prototype = new THREE.Object3D();
  SheepConststructor.prototype.constructor = SheepConststructor;

  var p = SheepConststructor.prototype;

  return SheepConststructor;

}());