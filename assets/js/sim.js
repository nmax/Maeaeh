var SheepSim = (function() {

	var herd = [],
			renderer,
			scene,
			camera,
			textures,
			running = false,
			Vector3 = THREE.Vector3,
			herdBehaviour;

	var SheepSimConstructor = function SheepSimConstructor( options ) {

		// TODO: Make options.. well optional
		if ( !options ) {
			throw new Error( 'Must provide options.' );
		}

		textures = options.textures;
		worldMaxX = options.worldMaxX || 16000;
		worldMaxY = options.worldMaxY || 16000;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		scene = new THREE.Scene();

		initHerd({
			amount: options.numSheep || 1,
			texture: options.textures.wool
		});

		herdBehaviour = new HerdBehaviour( herd );

		initAmbiance();
		initLight();
		initCamera();

		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

	};

	var initAmbiance = function initAmbiance() {

		// scene.fog = new THREE.Fog( 0xf4ffc6, 0, 700 );

		var gt = textures.grass;
		var gg = new THREE.PlaneGeometry( Util.WORLD_MAX_X, Util.WORLD_MAX_Y  );
		var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

		var ground = new THREE.Mesh( gg, gm );
		ground.position.y = 0;
		ground.rotation.x = - Math.PI / 2;
		ground.material.map.repeat.set( 512, 512 );
		ground.material.map.wrapS = THREE.RepeatWrapping;
		ground.material.map.wrapT = THREE.RepeatWrapping;
		ground.receiveShadow = true;

		scene.add( ground );

	};

	var initCamera = function initCamera() {

		camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.set( 0, 255, 0 );
		camera.rotation.x = 3/2 * Math.PI;
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

	var initHerd = function initHerd( opts ) {

		var c = {
			texture: opts.texture
		};

		for ( var i = 0; i < opts.amount; i += 1 ) {

			c.position = new Vector3( 0, Util.GROUND_LVL, 0 );
			c.position.x = (Math.random() > 0.5 ? 1 : -1) * Util.randomRange( 110, 300 );
			c.position.z = (Math.random() > 0.5 ? 1 : -1) * Util.randomRange( 110, 300 );

			herd[ i ] = new Sheep( c );
			scene.add( herd[ i ] );

		}

	};

	var run = function run() {

		if ( !running ) {
			return;
		}

		setTimeout( function() {

			requestAnimationFrame( run );

		}.bind( this ), 40 );

		renderer.render( scene, camera );
		computeNextPositions();

	};

	var computeNextPositions = function computeNextPositions() {

		var motions = [],
			v0 = new Vector3(),
			v1 = new Vector3(),
			v2 = new Vector3(),
			// v3 = new Vector3(),
			sheep,
			i = 0,
			l = herd.length;

		for ( ; i < l; i += 1 ) {

			sheep = herd[ i ];
			motions[ 0 ] = herdBehaviour.centerOfMass( sheep, v0 ).multiplyScalar( 1 );
			motions[ 1 ] = herdBehaviour.dontCollide( sheep, v1 ).multiplyScalar( 0.04 );
			motions[ 2 ] = herdBehaviour.boundPosition( sheep, v2 ).multiplyScalar( 0.07 );
			// motions[ 3 ] = herdBehaviour.matchVelocities( sheep, v3 ).multiplyScalar( 0.00 );

			sheep.velocity = motions.reduce( sumVelocities, sheep.velocity );

			herdBehaviour.limitSpeed( sheep );

			sheep.position = sheep.position.add( sheep.velocity ).setY( Util.GROUND_LVL);

		}

	};

	// setInterval( function() {
	// 	console.log( herd[0].position, herd[0].velocity );
	// }, 500 );

	var sumVelocities = function( v1, v2 ) {
		return v1.add( v2 );
	};

	SheepSimConstructor.prototype = {

		start: function() {
			running = true;
			run();
		},

		stop: function() {
			running = false;
		}

	};

	return SheepSimConstructor;

}());