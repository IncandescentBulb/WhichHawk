/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!
var G = ( function () {
	var GRID_X = 32;
	var GRID_Y = 32;

	//var player_loc = [0,0];
	/*
	var map_key = {
		PIT: {value: -5, color:0x333210}, //a pit; a player on a pit will fall (bead shrinks, disapears, lose a life)
		COOL_LAVA:{value: -4, color:0x333210},
		FILLED_SLOT:{value: -3, color:0x333210}, //when pushable block is over a block slot,
		//background of tile is set to COLOR_BLOCK_SLOT,
		//tile color stays COLOR_PUSHABLE_BLOCK
		//bead shrinks a tiny bit
		POWERUP_SPOT:{value: -2, color:0x333210},//press space on powerup spot to cycle through the room's available powerups
						//all of the room's available powerups will show up on the sidebar, selected one will have a white border around it
		FLOOR:{value: -1, color:0x333210},
		//anything below 0 is always able to be passed through????
		BACKGROUND:{value: 0, color:0x333210}, //outside of boundaries
		WALL:{value: 1, color:0x333210},
		DOOR:{value: 2, color:0x333210},//a door, that will be opened at some point.
		TORCH:{value: 3, color:0x333210},//a torch that can be lit with fire powerup. when lit,
		LIT_TORCH: {value: 3.5, color:0x333210}, // circular bead, background same color as torch, circle is orange
		ICE:{value: 4, color:0x333210}, //ice that can be melted with fire power.
		PERM_WALL:{value: 5, color:0x333210}, //permeable wall, able to be passed through with permeability powerup
		LAVA:{value: 6, color:0x333210},

		PUSHABLE_BLOCK:{value: 7, color:0x333210},
		BLOCK_SLOT:{value: 7.5, color:0x333210},

	};*/
	var map = {
		/*map_key : {},
		init_map : function(){
			map.map_key = new Map([
				['PIT', {value: -4, color:0x333210}]

			]);
			//map.map_key.set('PIT', {value: -4, color:0x333210})
		},/**/
		PIT: -4, //a pit; a player on a pit will fall (bead shrinks, disapears, lose a life)
		FILLED_SLOT:-3, //when pushable block is over a block slot,
		//background of tile is set to COLOR_BLOCK_SLOT,
		//tile color stays COLOR_PUSHABLE_BLOCK
		//bead shrinks a tiny bit
		POWERUP_SPOT:-2,//press space on powerup spot to cycle through the room's available powerups
						//all of the room's available powerups will show up on the sidebar, selected one will have a white border around it
		FLOOR:-1,
		//anything below 0 is always able to be passed through????
		BACKGROUND:0, //outside of boundaries
		WALL:1,
		DOOR:2,//a door, that will be opened at some point.
		TORCH:3,//a torch that can be lit with fire powerup. when lit,
		LIT_TORCH: 3.5, // circular bead, background same color as torch, circle is orange
		ICE:4, //ice that can be melted with fire power.
		PERM_WALL:5, //permeable wall, able to be passed through with permeability powerup
		LAVA:6,
		COOL_LAVA:6.5,
		PUSHABLE_BLOCK:7,
		BLOCK_SLOT:7.5,
		//*/
		/*MAP_KEY : Object.freeze({

			POWERUP_SPOT:-2,//press space on powerup spot to cycle through the room's available powerups
							//all of the room's available powerups will show up on the sidebar, selected one will have a white border around it
			FLOOR:-1,
			//anything below 0 is always able to be passed through????
			BACKGROUND:0, //outside of boundaries
			WALL:1,
			DOOR:2,//a door, that will be opened at some point.
			TORCH:3,//a torch that can be lit with fire powerup. when lit,
			LIT_TORCH: 3.5, // circular bead, background same color as torch, circle is orange
			ICE:4, //ice that can be melted with fire power.
			PERM_WALL:5, //permeable wall, able to be passed through with permeability powerup

		}),*/
		mapdata : {},
		imagemap : {
			width : GRID_X,
			height : GRID_Y,
			pixelSize : 1,
			data : []
		},
		COLOR_PIT: 0x333210,
		COLOR_POWERUP_SPOT:0x0ACDDE,
		COLOR_FLOOR:0xA99D62,
		COLOR_BACKGROUND: PS.COLOR_BLACK,
		COLOR_WALL:0x219304,
		COLOR_DOOR: 0x873C1F,
		COLOR_TORCH: 0x001,
		COLOR_LIT_TORCH:0xFF3700,
		COLOR_ICE:PS.COLOR_WHITE,
		COLOR_PERM_WALL:0xFFF500,
		COLOR_LAVA: 0xF50,
		COLOR_COOL_LAVA:PS.COLOR_GREY,
		COLOR_PUSHABLE_BLOCK:0xC25ED5,
		COLOR_BLOCK_SLOT:0X4B1322,
		/*
		COLOR_KEY : Object.freeze({
			POWERUP_SPOT:

			FLOOR:
			BACKGROUND: PS.COLOR_BLACK,
			WALL:
			DOOR:
			TORCH:
			LIT_TORCH:
			ICE:
			PERM_WALL:
		}),*/
		/*getColor : function(color){
			for(let key of map_key){
				if(){
					return map_key.get(key).value;
				}
			}
			return PS.ERROR;
		},*/


	};
	const POWERUPS = Object.freeze({
		NONE: 0,
		FIRE: 1,
		WATER: 2,
		PERMEABLE: 3,

	});
	var resetMap = function(){
		PS.color(PS.ALL, PS.ALL, map.COLOR_BACKGROUND)
		PS.border(PS.ALL, PS.ALL, 0);
	};
	var exports = {
		player: {
			location: [0,0],
			color: PS.COLOR_RED,
			lives: 4,

		},
		timer: {
			time: 100,
		},


		// G.init()
		// Initializes the game

		init: function () {


			var onMapLoad = function (image) {
				var i, x, y, data, pixel;
				if(image == PS.ERROR){
					PS.debug( "onMapLoad(): image load error\n" );
					return;
				}
				map.mapdata = image;



				i = 0; // init pointer into imagemap.data array

				for ( y = 0; y < GRID_Y; y += 1 ) {
					for ( x = 0; x < GRID_X; x += 1 ) {
						data = map.FLOOR; // assume floor
						pixel = image.data[ i ];
						switch ( pixel ) {
							case map.COLOR_FLOOR:
								break; // no need to do anything
							case map.COLOR_BACKGROUND:
								data = map.BACKGROUND;
								break;
							case map.COLOR_WALL:
								data = map.WALL; // found a wall!
								break;
							case map.COLOR_PIT:
								data = map.PIT;
								break;
							case map.COLOR_POWERUP_SPOT:
								data = map.POWERUP_SPOT;
								break;
							case map.COLOR_DOOR:
								data = map.DOOR;
								break;
							case map.COLOR_TORCH:
								data = map.TORCH;
								break;
							case map.COLOR_LIT_TORCH:
								data = map.LIT_TORCH;
								break;
							case map.COLOR_ICE:
								data = map.ICE;
								break;
							case map.COLOR_PERM_WALL:
								data = map.PERM_WALL;
								break;
							case map.COLOR_LAVA:
								data = map.LAVA;
								break;
							case map.COLOR_COOL_LAVA:
								data = map.COOL_LAVA;
								break;
							case map.COLOR_PUSHABLE_BLOCK:
								data = map.PUSHABLE_BLOCK;
								break;
							case map.COLOR_BLOCK_SLOT:
								data = map.BLOCK_SLOT;
								break;


							/*case ACTOR_COLOR:
								actor_x = x; // establish initial location of actor
								actor_y = y;
								break;*/
							default:
								PS.debug( "onMapLoad(): unrecognized pixel value\n" );
								break;
						}
						imagemap.data[ i ] = data; // install translated data
						i += 1; // update array pointer
					}
				}


			};


			PS.gridSize( GRID_X, GRID_Y );
			resetMap();
			PS.statusText( "Athena's Trap" );
			PS.imageLoad( 'images/Fire_Power_Tutorial_Room_1.gif', onMapLoad, 1 );


			const TEAM = "WhichHawk";

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.

			PS.dbLogin("imgd2900", TEAM, function (id, user) {
				if (user === PS.ERROR) {
					return;
				}
				PS.dbEvent(TEAM, "startup", user);
				PS.dbSend(TEAM, PS.CURRENT, {discard: true});
			}, {active: false});
		}
	};

	return exports;

} () );
/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/
PS.init = G.init;
/*
PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	// PS.gridSize( 8, 8 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.

	// Change this TEAM constant to your team name,
	// using ONLY alphabetic characters (a-z).
	// No numbers, spaces, punctuation or special characters!

	const TEAM = "teamname";

	// This code should be the last thing
	// called by your PS.init() handler.
	// DO NOT MODIFY IT, except for the change
	// explained in the comment below.

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );
	
	// Change the false in the final line above to true
	// before deploying the code to your Web site.
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

