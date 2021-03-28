// Eddie Matava
// Team WhichHawk
// Mod 1: Changed click color from black to random
// (I swear I didn't just do this because I saw it given as the example, it just is a simple one that goes well with what I had planned next)
// Mod 2: modified example game and movement code from GoldGrabber tutorial.
// instead of moving a grabber, it instead turns the bead next to itself in the direction of "movement" into the same color as itself.
// Mod 3: Made it so that mousing over a bead turns it into the active bead for the "movement"
// Mod 4: Added function modify_color, which takes a color and randomly changes the r g b values individually by up to plus/minus 18,diversifying the color pallette
// Mod 5: Made the current bead have a different border




// Mod 1: Changed click color from black to random
// Mod 2: Added random percussion sound on click
// Mod 3: Changed size of grid to 17 x 3
// Mod 4: Added random Trump tweets to status line
// Mod 5: Changed grid background to shocking pink



/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-3-28 (EM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // do not remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// The global G variable creates a namespace
// for game-specific code and variables

// It is initialized with an immediately-invoked
// function call (described below)

var G = ( function () {
	// By convention, constants are all upper-case

	var WIDTH = 7; // width of grid
	var HEIGHT = 7; // height of grid

	var COLOR_FLOOR = [255,255,255]; // floor color
	var current_color = [255,255,255]; // current color

	var current_x = 0; // current x-pos of bead mouse is in
	var current_y = 0; // current y-pos of bead mouse is in

	// The 'exports' object is used to define
	// variables and/or functions that need to be
	// accessible outside this function.
	// So far, it contains only one property,
	// an 'init' function with no parameters.

	var exports = {

		// G.init()
		// Initializes the game

		init : function () {
			var i, j;
			PS.gridSize( WIDTH, HEIGHT ); // init grid
			PS.color( PS.ALL, PS.ALL, COLOR_FLOOR );
			for( i = 0; i < WIDTH; i +=1){
				for( j = 0; j < HEIGHT; j +=1){
					PS.data( i, j, COLOR_FLOOR );
				}
			}



		},
		// G.move( h, v )
		// Moves the grabber around the map
		// h : integer = horizontal movement
		// v : integer = vertical movement
		// h = 0: No horizontal movement
		// h = 1: Move one bead to the right
		// h = -1: Move one bead to the left
		// v = 0: No vertical movement
		// v = 1: Move one bead down
		// v = -1: Move one bead up

		move : function ( h, v ) {
			var nx, ny;

			// Calculate proposed new location.

			nx = current_x + h;
			ny = current_y + v;



			// Is new location off the grid?
			// If so, exit without moving.
			// NOTE: Current map design would never
			// allow grabber to get past the edge walls.
			// This code will prevent errors if
			// the map layout is changed.

			if ( ( nx < 0 ) || ( nx >= WIDTH ) ||
				( ny < 0 ) || ( ny >= HEIGHT ) ) {
				return;
			}

			// Legal move, so change new bead's color to current bead's color

			G.set_color( nx, ny, G.modify_color(current_color) );
		},
		// G.set_bead( nx, ny, new_color )
		// Sets the values of the bead currently hovered over
		// nx : integer = bead's x
		// ny : integer = bead's y
		// new_color = bead's color

		set_bead : function ( nx, ny, new_color ){
			current_color = new_color; // current color
			PS.borderColor(current_x, current_y, PS.COLOR_GRAY);
			current_x = nx; // current x-pos of bead mouse is in
			current_y = ny; // current y-pos of bead mouse is in
			PS.borderColor(current_x, current_y, PS.COLOR_BLACK);
		},

		// G.set_color( nx, ny, new_color )
		// Sets the data of a bead to equal its new color
		// nx : integer = bead's x
		// ny : integer = bead's y
		// current_color = bead's color

		set_color : function ( nx, ny, new_color ){
			PS.color(nx, ny, new_color);
			PS.data(nx, ny, new_color);

		},
		// G.modify_color( old_color )
		// slightly randomizes the values of the given color
		// returns new_color

		modify_color : function ( old_color ){
			var new_color = [0,0,0];
			var i;
			for(i = 0; i < 3; i += 1) {
				new_color[i] = PS.random(35) - 18 + old_color[i];
				if(new_color[i] > 255){
					new_color[i] = 255;
				}else if(new_color[i]<0){
					new_color[i] = 0;
				}
			}
			return new_color;
		}
	};



	// Return the 'exports' object as the value
	// of this function, thereby assigning it
	// to the global G variable. This makes
	// its properties visible to Perlenspiel.

	return exports;
} () );

// Tell Perlenspiel to use our G.init() function
// to initialize the game

PS.init = G.init;

/*
PS.init = function( system, options ) {

	// Establish grid dimensions
	
	PS.gridSize( 7, 7 );
	
	// Set background color to Perlenspiel logo gray
	
	PS.gridColor( 0x303030 );
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_WHITE );
	PS.statusText( "Touch any bead" );
	
	// Preload click sound

	PS.audioLoad( "fx_click" );
};*/

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	"use strict";
	// Toggle color of touched bead from white to black and back again
	// NOTE: The default value of a bead's [data] is 0, which happens to be equal to PS.COLOR_BLACK
	var r, g, b;

	r = PS.random(256) - 1; // random red 0-255
	g = PS.random(256) - 1; // random green
	b = PS.random(256) - 1; // random blue
	G.set_color(x, y, [r, g, b]);
	G.set_bead(x, y, [r,g,b]);
	/*
	PS.color( x, y, r, g, b ); // set bead color
	PS.data(x,y, [r, g, b]);
	*/
	//PS.color( x, y, data ); // set color to current value of data
	
	// Decide what the next color should be.
	// If the current value was black, change it to white.
	// Otherwise change it to black.
	/*
	let next; // variable to save next color

	if ( data === PS.COLOR_BLACK ) {
		next = PS.COLOR_WHITE;
	}
	else {
		next = PS.COLOR_BLACK;
	}
	*/
	// NOTE: The above statement could be expressed more succinctly using JavaScript's ternary operator:
	// let next = ( data === PS.COLOR_BLACK ) ? PS.COLOR_WHITE : PS.COLOR_BLACK;
	
	// Remember the newly-changed color by storing it in the bead's data.
	
	//PS.data( x, y, next );

	// Play click sound.

	PS.audioPlay( "fx_click" );
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!
	G.set_bead(x, y, data);
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};



/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};
*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:



PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!
	switch ( key ) {
	case PS.KEY_ARROW_UP:
	case 119:
	case 87: {
			G.move( 0, -1 ); // move UP (v = -1)
			break;
		}
	case PS.KEY_ARROW_DOWN:
	case 115:
	case 83: {
			G.move( 0, 1 ); // move DOWN (v = 1)
			break;
		}
	case PS.KEY_ARROW_LEFT:
	case 97:
	case 65: {
			G.move( -1, 0 ); // move LEFT (h = -1)
			break;
		}
	case PS.KEY_ARROW_RIGHT:
	case 100:
	case 68: {
			G.move( 1, 0 ); // move RIGHT (h = 1)
			break;
		}
	}
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.


};



/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/
