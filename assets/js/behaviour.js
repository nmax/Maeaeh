var HerdBehaviour = (function() {

	var BehaviourConstructor = function( herd ) {
		this.herd = herd;
	};

	var p = BehaviourConstructor.prototype;

	p.centerOfMass = function centerOfMass( sheep, v ) {

		var i = 0,
			l = this.herd.length;

		for ( ; i < l; i += 1 ) {

			if ( this.herd[i] !== sheep ){
				v.add( this.herd[ i ].position );
			}

		}

		v = v.divideScalar( l - 1 );

		return v.sub( sheep.position ).divideScalar( 1000 );

	};

	p.matchVelocities = function matchVelocities( sheep, v ) {

		var i = 0,
			l = this.herd.length;

		for( ; i < l; i += 1 ) {

			if ( this.herd[ i ] !== sheep ) {
				v.add( this.herd[ i ].position );
			}

		}

		v.divideScalar( l - 1 );

		return v.sub( sheep.velocity ).divideScalar( 8 );

	};

	p.dontCollide = function dontCollide( sheep, v ) {

		var i = 0,
			l = this.herd.length,
			pos = sheep.position.clone();

		for( ; i < l; i += 1 ) {

			if ( this.herd[ i ] !== sheep ) {

				var dist = sheep.position.distanceTo( this.herd[ i ].position );

				if ( dist < 7 ) {

					v = v.sub( this.herd[i].position.clone().sub( pos ) );
				}

			}

		}
		return v;

	};

	p.boundPosition = function boundPosition( sheep, v ) {

		var xmin = -80,
			xmax = 80,
			zmin = -80,
			zmax = 80;

		if ( sheep.position.x < xmin ) {
			v.setX( 10 );
		}

		if ( sheep.position.x > xmax ) {
			v.setX( -10 );
		}

		if ( sheep.position.z < zmin ) {
			v.setZ( 10 );
		}

		if ( sheep.position.z > zmax ) {
			v.setZ( -10 );
		}

		return v;

	};

	p.limitSpeed = function limitSpeed( sheep ) {

		var speedLimit = .9,
			speed = sheep.velocity.length();

		if ( speed > speedLimit ) {
			sheep.velocity = sheep.velocity.divideScalar( speed ).multiplyScalar( speedLimit );
		}

	};

	return BehaviourConstructor;

}());