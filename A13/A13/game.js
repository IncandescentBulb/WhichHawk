/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-30 (EM)

The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

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

	var WIDTH = 32; // width of grid
	var HEIGHT = 31; // height of grid
	var FRAME_RATE = 6;
	var COLOR_DROP = PS.COLOR_BLUE; // grabber color
	var COLOR_BACKGROUND = PS.COLOR_WHITE; // floor color
	var COLOR_WALL = PS.COLOR_BLACK; // wall color

	// The following variables are grab-related,
	// so they start with 'grab'
	var grav_val = .6;
	var dropsx = [], dropsy =[];
	var speedx = [], speedy =[];
	var splashed = [];
	var gravity = [0, .5];
	var maxBeads = 10;
	var term_vel = 3;//5;
	var swapped = 0;
	// The 'exports' object is used to define
	// variables and/or functions that need to be
	// accessible outside this function.
	// So far, it contains only one property,
	// an 'init' function with no parameters.

	var exports = {
		addDrop : function(x,y,data,options){
			"use strict";
			if( x > 1 && x < WIDTH-1 && y>1 && y<HEIGHT-1 && dropsx.length < maxBeads){
				//var num;
				dropsx.push(x);
				dropsy.push(y);
				speedx.push(0);
				speedy.push(0);
				splashed.push(0);
				//num = dropsx.length;
				//speedx[num-1] = gravity[0]/grav_val;
				//speedy[num-1] = gravity[1]/grav_val;

				PS.color(x,y, COLOR_DROP);
			}else if(y == HEIGHT){
				if(x < 5){
					G.setUp();
				}else if(x>WIDTH-6){
					G.swapMode();
				}
			}
		},
		setGravity : function(x,y){
			gravity[0] = x*grav_val;
			gravity[1] = y*grav_val;
		},
		setUp : function(){
			PS.color( PS.ALL, PS.ALL, COLOR_BACKGROUND );
			PS.glyph(0, HEIGHT, "R");
			PS.glyph(1, HEIGHT, "E");
			PS.glyph(2, HEIGHT, "S");
			PS.glyph(3, HEIGHT, "E");
			PS.glyph(4, HEIGHT, "T");

			PS.glyph(WIDTH-5, HEIGHT, "M");
			PS.glyph(WIDTH-4, HEIGHT, "O");
			PS.glyph(WIDTH-3, HEIGHT, "D");
			PS.glyph(WIDTH-2, HEIGHT, "E");
			PS.glyph(WIDTH-1, HEIGHT, swapped.toString());

			var i, j, k;
			k = 1;
			for(i = 0; i < WIDTH; i+=1){

				for(j=0; j< HEIGHT; j+=k){
					PS.color(i,j, COLOR_WALL);
				}
				if(i == WIDTH -2){
					k = 1;
				}else{
					k = HEIGHT-1;
				}
			}

			dropsx = [], dropsy =[];
			speedx = [], speedy =[];
			splashed = [];
			gravity = [0, .5];

		},
		swapMode : function(){
			if(swapped == 1){
				swapped = 0;
				term_vel = 3;
			}else{
				swapped = 1;
				term_vel = 4;
			}
			PS.glyph(WIDTH-1, HEIGHT, swapped.toString());
		},
		// G.init()
		// Initializes the game

		init : function( system, options ) {
			"use strict";
			// Change this string to your team name
			// Use only ALPHABETIC characters
			// No numbers, spaces or punctuation!

			const TEAM = "WhichHawk";

			// Begin with essential setup
			// Establish initial grid size

			PS.gridSize( WIDTH, HEIGHT+1 ); // or whatever size you want
			PS.border( PS.ALL, PS.ALL, 0 );
			PS.color( PS.ALL, PS.ALL, COLOR_BACKGROUND );
			PS.gridColor(COLOR_BACKGROUND);
			PS.statusText( "Gravity Rain" );

			/* figure out how this works!!!
			// Add fader FX to bottom row only
			// This makes the beads flash white when they "splash"

			PS.fade( PS.ALL, RAIN.BOTTOM_ROW, 30, { rgb : PS.COLOR_WHITE } );
			 */

			G.setUp();


			// Install additional initialization code
			// here as needed
			/*
			var i, j, k;
			k = 1;
			for(i = 0; i < WIDTH; i+=1){

				for(j=0; j< HEIGHT; j+=k){
					PS.color(i,j, COLOR_WALL);
				}
				if(i == WIDTH -2){
					k = 1;
				}else{
					k = HEIGHT-1;
				}
			}*/

			PS.timerStart( FRAME_RATE, G.tick );

			// PS.dbLogin() must be called at the END
			// of the PS.init() event handler (as shown)
			// DO NOT MODIFY THIS FUNCTION CALL
			// except as instructed

			PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
				if ( user === PS.ERROR ) {
					return PS.dbErase( TEAM );
				}
				PS.dbEvent( TEAM, "startup", user );
				PS.dbSave( TEAM, PS.CURRENT, { discard : true } );
			}, { active : false } );
		},

		tick : function () {
			"use strict";
			var x, y, num, i, newx, newy;
			num = dropsx.length;
			i = 0;
			while(i<num){
				x = dropsx[i];
				y = dropsy[i];
				PS.color(x,y, COLOR_BACKGROUND);
				speedx[i] = speedx[i] + gravity[0];

				if(speedx[i] > term_vel){
					speedx[i] = term_vel;
				}else if(speedx[i] < -1 * term_vel){
					speedx[i] = term_vel*-1;
				}

				speedy[i] = speedy[i] + gravity[1];
				if(speedy[i] > term_vel){
					speedy[i] = term_vel;
				}else if(speedy[i] < -1 * term_vel){
					speedy[i] = term_vel*-1;
				}

				if(splashed[i]==0) {
					newx = x + speedx[i];
					if (newx < 1) {
						//splashed[i] = 1;
						newx = 1;
						if(swapped == 0){
							splashed[i] = 1;
						}else if(dropsx[i]==1){
							newx = WIDTH-2;//1
						}
					} else if (newx > WIDTH - 2) {
						//splashed[i] = 1;

						newx = WIDTH-2;
						if(swapped == 0){
							splashed[i] = 1;
						}else if(dropsx[i]==WIDTH-2){
							newx = 1;//WIDTH - 2;
						}
					}

					newy = y + speedy[i];
					if (newy < 1) {
						//splashed[i] = 1;
						newy = 1;
						if(swapped == 0){
							splashed[i] = 1;
						}else if(dropsy[i]==1){
							newy = HEIGHT-2;//1
						}
					} else if (newy > HEIGHT - 2) {
						//splashed[i] = 1;
						newy = HEIGHT-2;
						if(swapped == 0){
							splashed[i] = 1;
						}else if(dropsy[i]==HEIGHT-2){
							newy = 1;//WIDTH - 2;
						}
					}
				}
				/*
				newx = newx < 1 ? 1 : newx;
				newx = newx >= WIDTH-1 ? WIDTH-2 : newx;


				newy = y + speedy[i];
				newy = newy < 1 ? 1 : newy;
				newy = newy >= HEIGHT-1 ? HEIGHT-2 : newy;
				*/
				if(splashed[i] < 2) {
					dropsx[i] = newx;
					dropsy[i] = newy;
					//PS.debug(dropsx[i] + ", " + dropsy[i] + ", " + splashed[i] + "\n" );
					PS.color(dropsx[i], dropsy[i], COLOR_DROP);
					splashed[i] = splashed[i] == 1 ? 2 : splashed[i];
					i += 1;
				}else{
					dropsx.splice(i,1);
					dropsy.splice(i,1);
					speedx.splice(i,1);
					speedy.splice(i,1);
					splashed.splice(i,1);
					num-=1;
				}
			}

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
	// Change this string to your team name
	// Use only ALPHABETIC characters
	// No numbers, spaces or punctuation!

	const TEAM = "WhichHawk";

	// Begin with essential setup
	// Establish initial grid size

	PS.gridSize( 8, 8 ); // or whatever size you want

	// Install additional initialization code
	// here as needed

	// PS.dbLogin() must be called at the END
	// of the PS.init() event handler (as shown)
	// DO NOT MODIFY THIS FUNCTION CALL
	// except as instructed

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return PS.dbErase( TEAM );
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSave( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );
};
*/

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
	G.addDrop(x,y,data,options);


	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
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

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
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

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!
	switch ( key ) {
		case PS.KEY_ARROW_UP:
		case 119:
		case 87: {
			G.setGravity( 0, -1 );
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83: {
			G.setGravity( 0, 1 );
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65: {
			G.setGravity( -1, 0 );
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68: {
			G.setGravity( 1, 0 );
			break;
		}
		case PS.KEY_SPACE: {
			G.setGravity(0,0);
			break;
		}
		case PS.KEY_ENTER: {
			G.setUp();
			break;
		}
		case PS.KEY_TAB :{
			G.swapMode();
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

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

