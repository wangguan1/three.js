/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer;

		var events = {};

		this.dom = undefined;

		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			camera = loader.parse( json.camera );
			scene = loader.parse( json.scene );

			events = {
				keydown: [],
				keyup: [],
				mousedown: [],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: []
			};

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( 'player, scene, keydown, keyup, mousedown, mouseup, mousemove, touchstart, touchend, touchmove, update', script.source + '\nreturn { keydown: keydown, keyup: keyup, mousedown: mousedown, mouseup: mouseup, mousemove: mousemove, touchstart: touchstart, touchend: touchend, touchmove: touchmove, update: update };' ).bind( object ) )( this, scene );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			this.dom = renderer.domElement;

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			renderer.setSize( width, height );

		};

		var dispatch = function ( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		};

		var request;

		var animate = function ( time ) {

			request = requestAnimationFrame( animate );

			dispatch( events.update, { time: time } );

			renderer.render( scene, camera );

		};

		this.play = function () {

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			request = requestAnimationFrame( animate );

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			cancelAnimationFrame( request );

		};

		//

		var onDocumentKeyDown = function ( event ) {

			dispatch( events.keydown, event );

		};

		var onDocumentKeyUp = function ( event ) {

			dispatch( events.keyup, event );

		};

		var onDocumentMouseDown = function ( event ) {

			dispatch( events.mousedown, event );

		};

		var onDocumentMouseUp = function ( event ) {

			dispatch( events.mouseup, event );

		};

		var onDocumentMouseMove = function ( event ) {

			dispatch( events.mousemove, event );

		};

		var onDocumentTouchStart = function ( event ) {

			dispatch( events.touchstart, event );

		};

		var onDocumentTouchEnd = function ( event ) {

			dispatch( events.touchend, event );

		};

		var onDocumentTouchMove = function ( event ) {

			dispatch( events.touchmove, event );

		};

	}

};
