(function() {

	var pathes = [ 'grass.jpeg', 'wool.jpeg' ].map( function( asset ) {
		return 'assets/textures/' + asset;
	});


	var init = function( textures ) {

		var sim = new SheepSim({
			textures: textures,
			numSheep: 15
		});

		sim.start();

	};

	Util.loadTextures( pathes, init );

}());