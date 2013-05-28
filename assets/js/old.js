var renderer = new THREE.WebGLRenderer({ antialias: true }),
    scene = new THREE.Scene(),
    camera,
    projector,
    grassTexture,
    woolTexture,
    sheep = [];

var initScene = function initScene() {
  scene.fog = new THREE.Fog( 0xf4ffc6, 0, 300 );

  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft    = true;

  projector = new THREE.Projector();

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

};

var initCamera = function initCamera() {
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set( 0, 15, 60 );
  camera.rotation.x = -Math.PI / 32;
  scene.add( camera );
};

var initLight = function initLight() {
  var ambientLight = new THREE.AmbientLight( 0xffffff );
  scene.add( ambientLight );

  var spotLight = new THREE.SpotLight( 0xd6c3bc );
  spotLight.position.set( -80, 100, 300 );
  spotLight.shadowCameraVisible = false;
  spotLight.castShadow = true;
  spotLight.target.position.set( 0, 2, 0 );

  scene.add( spotLight );
};

var addContents = function addContents( opt ) {
  var objects = opt.numCubes || 1;

  for ( var i = 0; i < objects ; i++ ) {
    cubes[ i ] = opt.model ? opt.model : createSheep();
    scene.add( cubes[ i ] );
  }


  protagonist = cubes[ ~~( Math.random() * cubes.length ) ];

  createFloor();

};

var createFloor = function createFloor() {
  var plane = new THREE.PlaneGeometry(8, 8, 8, 8);

  for ( i = 0; i < plane.faceVertexUvs[ 0 ].length; i ++ ) {

    uvs = plane.faceVertexUvs[ 0 ][ i ];

    for ( j = 0; j < uvs.length; j ++ ) {

      uvs[ j ].u *= 8;
      uvs[ j ].v *= 8;

    }
  }

  grassTexture.wapT = THREE.RepeatWrapping;
  grassTexture.wrapS = THREE.RepeatWrapping;

  var floor = new THREE.Mesh( plane, new THREE.MeshPhongMaterial({ map: grassTexture, wireframe: false }));
  floor.rotation.x = -90 * Math.PI / 180;
  floor.scale.x = floor.scale.y = floor.scale.z = 100;
  floor.receiveShadow = true;
  floor.position.y = 0;
  scene.add( floor );
};

var createSheep = function createSheep() {
  var material  = new THREE.MeshPhongMaterial({ ambient: 0xa9a9b1, map: woolTexture }),
      body = new THREE.CubeGeometry( 3, 3, 3 ),
      sheep = new THREE.Object3D();

  // add body
  sheep.add( new THREE.Mesh( body, material ) );

  // add head
  var head = new THREE.Mesh( new THREE.CubeGeometry( 2, 2, 2 ), material );
  head.position.y = 2;
  head.position.x = 1.5;
  sheep.add( head );

  var hooves = [];
  hooves.push( new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material ) );
  hooves.push( new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material ) );
  hooves.push( new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material ) );
  hooves.push( new THREE.Mesh ( new THREE.CubeGeometry( 0.5, 2, 0.5), material ) );

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
    sheep.add( hoove );
  });

  sheep.position.y = 3.5;
  sheep.castShadow = true;

  sheep.ticker = ~~(Math.random() * 10);
  sheep.xFactor = ~~( Math.random() * 100 ) + 10;
  sheep.zFactor = ~~( Math.random() * -100 ) - 10;

  return sheep;

};


var render = function render() {

  requestAnimationFrame( render );

  cubes.forEach( function( cube ) {

    var ticker = cube.ticker,
    xFactor = cube.xFactor,
    zFactor = cube.zFactor;

    var oldPos = new THREE.Vector3( cube.position.x, cube.position.y, cube.position.z );

    cube.position.setX( Math.sin( ticker ) * xFactor );
    cube.position.setY( Math.abs( Math.sin( ticker * 8 ) * 5 ) + 3.5);
    cube.position.setZ( Math.cos( ticker ) * zFactor );

    var vec = new THREE.Vector3();
    vec.sub( cube.position, oldPos );

    cube.lookAt( vec.normalize() );

    cube.ticker += 0.009;

  });

  camera.lookAt( protagonist.position );
  renderer.render( scene, camera );

};

var loadAudio = function loadAudio( url, cb ) {

    var context = new webkitAudioContext();

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {

      context.decodeAudioData( request.response, function( buffer ) {

        // playSound( context, buffer );

        // setInterval( function() {
        //   playSound( context, buffer );
        //   console.log( 'play' );
        // }, 5000 );

        cb.call( this );

      }, function() {
        console.log( 'sound error' );
      });

    };

    request.send();

};

var playSound = function playSound( context, buffer ) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect( context.destination );
  source.noteOn( 0 );
};

grassTexture = THREE.ImageUtils.loadTexture( 'assets/grass.jpeg', {}, function() {

  woolTexture = THREE.ImageUtils.loadTexture( 'assets/wool.jpeg', {}, function() {

    loadAudio( 'assets/meh.wav', function() {

        initScene();
        initCamera();
        initLight();
        addContents({ numCubes: 30 });
        render();

    });

  });

});