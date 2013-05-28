Util = {

	GROUND_LVL: 3,

	WORLD_MAX_X: 16000,

	WORLD_MAX_Y: 16000,

	loadTextures: function( pathes, cb ) {

		var total = pathes.length,
			loaded = 0,
			textures = {};

		var done = function() {

			loaded += 1;

			if ( loaded === total ) {
				cb( textures );
			}

		};

		pathes.forEach( function( path ) {

			var fileName = this.getFileName( path );

			textures[ fileName ] = THREE.ImageUtils.loadTexture( path, {}, done );

		}.bind( this ));

	},

	getFileName: function( path ) {

		var lastSegment = path.lastIndexOf( '/' ) + 1;
		return path.substring( lastSegment ).split( '.' )[ 0 ];

	},

	randomRange: function( min, max ) {

		return Math.floor( Math.random() * ( max - min + 1 ) + min );

	}


};