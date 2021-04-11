/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)

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
var G = ( function () {
	var puzzle_width = 4;
	var puzzle_height = 4;
	var PUZZLE_SOL = [
		[0xe6b8af,	0xdd7e6b,	0xa61c00,	0x691a0a],
		[0xdd7e6b,	0xb6d7a8,	0x6aa84f,	0x214612],
		[0xa61c00,	0x6aa84f,	0xeeb880,	0xe4831d],
		[0x691a0a,	0x214612,	0xe4831d,  -1]
	];
	//instead of doin it like this, do:
	/*
	var puz_col = 		[0xe6b8af,	0xdd7e6b,	0xa61c00,	0x691a0a
	 								0xb6d7a8,	0x6aa84f,	0x214612
	 											0xeeb880,	0xe4831d];

	var puz_col_alt = 	[0x117733,	0xCC6677,	0xAA4499,	0x882255
	 								0x88CCEE,	0x44AA99,	0x332288
	 											0xDDCC77,	0x999933];
	//...
	var PUZZLE_SOL = [
		[puz_col[0], puz_col[1], puz_col[2], puz_col[3]],
		[puz_col[1], puz_col[4], puz_col[5], puz_col[6]],
		[puz_col[2], puz_col[5], puz_col[7], puz_col[8]],
		[puz_col[3], puz_col[6], puz_col[8], -1(?)];
		so that you can just swap puz_col for puz_col_alt? but i'd have to adjust the deep copy for putting into arr

	*/
	var puzzle_arr = JSON.parse(JSON.stringify(PUZZLE_SOL)); //PUZZLE_SOL;
	/*[
		[0xe6b8af,	0xdd7e6b,	0xa61c00,	0x691a0a],
		[0xdd7e6b,	0xb6d7a8,	0x6aa84f,	0x214612],
		[0xa61c00,	0x6aa84f,	0xf9cb9c,	0xe69138],
		[0x691a0a,	0x214612,	0xe69138,  -1]
	];*/
	var PUZZLE_SOL_CB = [
		[0x117733,	0xCC6677,	0xAA4499,	0x882255],
		[0xCC6677,	0x88CCEE,	0x44AA99,	0x332288],
		[0xAA4499,	0x44AA99,	0xDDCC77,	0x999933],
		[0x882255,	0x332288,	0x999933,	-1]
	];
	var puzzle_arr_alt = JSON.parse(JSON.stringify(PUZZLE_SOL_CB));
	var blank = [3,3];
	var margin = 1;
	var is_colorblind = false;
	//ADD A COLOR BLIND MODE!!! VARYING SHADES OF GRAY!


	var COLOR_TILE_BACKGROUND = 0xDDDDDD;

	//var for border of beads (not bead borders, but beads around the puzzle and solution?)
	var exports = {
		XOr : function(a,b){
			return ( a || b ) && !( a && b );
		},

		initMargin : function(){
			//PS.color(PS.ALL, 0, PS.COLOR_BLACK);
			/*PS.color(PS.ALL, puzzle_height + margin*2 -1, PS.COLOR_BLACK);
			PS.color(0, PS.ALL, PS.COLOR_BLACK);
			PS.color(puzzle_width*2 + margin*2, PS.ALL, PS.COLOR_BLACK);*/
			var middle = {//middle
				top : 0,
				left : 2,
				bottom : 0,
				right : 2
			};
			var top = {//top
				top : 0,
				left : 0,
				bottom : 2,
				right : 0
			};
			var bottom = {//bottom
				top : 2,
				left : 0,
				bottom : 0,
				right : 0
			};
			var left = {//left
				top : 0,
				left : 0,
				bottom : 0,
				right : 2
			};
			var right = {//right
				top : 0,
				left : 2,
				bottom : 0,
				right : 0
			};
			var i;
			for(i = 1; i < puzzle_width + margin; i+=1){

				PS.border( i, 0, top );
				PS.border( i, puzzle_height + margin*2 -1, bottom);
				PS.border( i+puzzle_width+1, 0, top );
				PS.border( i+puzzle_width+1, puzzle_height + margin*2 -1, bottom);

			}
			for(i = 1; i < puzzle_height + margin; i+=1){
				PS.border( puzzle_width + margin, i, middle);
				PS.border( 0, i,  left);
				PS.border( puzzle_width*2 + margin*2, i,  right);
			}
			/*
			PS.border( puzzle_width + margin, PS.ALL, middle);
			PS.border( PS.ALL, 0, top );

			PS.border( PS.ALL, puzzle_height + margin*2 -1, bottom);

			PS.border( 0, PS.ALL,  left);

			PS.border( puzzle_width*2 + margin*2, PS.ALL,  right);

			PS.border(0,0,0);
			PS.border(0,puzzle_height+margin*2-1,0);
			PS.border(puzzle_width*2 + margin*2,0,0);
			PS.border(puzzle_width*2 + margin*2,puzzle_height+margin*2-1,0);
			*/
		},

		convert : function(x, y, toLocal){
			var arr = [-1,-1];
			if(toLocal){
				//from absolute (grid) to local (puzzle)
				arr[0] = x - margin;
				arr[1] = y - margin;
			}else{
				//from local (puzzle) to absolute (grid)
				arr[0] = parseInt(x) + margin;
				arr[1] = parseInt(y) + margin;
				//PS.debug("abs x: " + arr[0] + ", abs y: " + arr[1] + ", x: " + x + ", y: " + y + "\n");
			}

			return arr;
		},

		updateTileSet : function(to_update){//uses local

			var len = to_update.length;

			if (len == 0){//update all
				var i, j, abs;
				for(i = 0; i < puzzle_width; i+=1){
					for(j = 0; j < puzzle_height; j+=1){
						G.updateBead(i,j);
					}
				}
			}else {
				var i;
				for (i = 0; i < len; i += 1) {
					//local = to_update[i];

					G.updateBead(to_update[i][0], to_update[i][1]);
				}
			}
		},

		updateSol : function(){
			var i, j, sol, col, abs;
			if(is_colorblind){
				sol = PUZZLE_SOL_CB;
			}else{
				sol = PUZZLE_SOL;
			}
			for(i = 0; i < puzzle_width; i+=1){
				for(j = 0; j < puzzle_height; j+=1){
					col = sol[i][j];
					abs = G.convert(i,j,false);
					abs[0] += puzzle_width+1;
					if(col != -1){
						PS.color(abs[0],abs[1], col);
					}
				}
			}
		},

		updateBead : function(x,y){
			var abs, col;
			abs = G.convert(x,y,false);
			//PS.debug("\n"+ puzzle_arr[0][0] + ", x: " + x + ", y: " + y + "\n\n");
			col = puzzle_arr[x][y];
			//PS.debug("col: " + col + ", x: " + abs[0] + ", y: " + abs[1] + ", xloc: " + local[0] + ", yloc: " + local[1] +"\n");
			if(col == -1){
				PS.alpha(abs[0],abs[1],0);
				PS.borderAlpha(abs[0],abs[1],0);

			}else{
				PS.color(abs[0],abs[1], col);
				PS.alpha(abs[0],abs[1],255);
				PS.borderAlpha(abs[0],abs[1],255);
			}
		},

		swap : function(x1, y1, x2, y2, isLocal){//}, isShuffle){ // second is always the blank tile!
			if(!isLocal){
				var arr1 = G.convert(x1,y1,true);
				var arr2 = G.convert(x2,y2,true);
				x1 = arr1[0];
				y1 = arr1[1];
				x2 = arr2[0];
				y2 = arr2[1];
			}
			if(x2 != blank[0] || y2 != blank[1]){
				return;
			}
			var p = puzzle_arr[x1][y1];
			puzzle_arr[x1][y1] = puzzle_arr[x2][y2];
			puzzle_arr[x2][y2] = p;

			p = puzzle_arr_alt[x1][y1];
			puzzle_arr_alt[x1][y1] = puzzle_arr_alt[x2][y2];
			puzzle_arr_alt[x2][y2] = p;

			blank[0] = x1;
			blank[1] = y1;
			/*
			if(!isShuffle) {
				G.updateTiles([[x1, y1], [x2, y2]]);//not always; at least, not in shuffle
				//FADERS????????? only on nonblank tiles
			}*/
		},

		slide : function(x, y, isShuffle){//expects local!
			//PS.debug("start slide\n");
			//var coord = G.convert(x,y, true);
			var coordinates = [x,y];
			var isVert = false;
			var dif;
			if(x - blank[0] == 0){
				isVert = true;
				dif = y-blank[1];
				//PS.debug("   isVert!");
			}if(y - blank[1]==0){
				//PS.debug("   isntVert!");
				if(isVert){
					return;
					//PS.debug("lakjsdf");
				}
				dif = x-blank[0];
			}else if(!isVert){
				return;
			}
			//PS.debug("\n");
			//PS.debug("passed check\n");
			var i;

			var k = (dif > 0) ? 1 : -1;
			var newX = parseInt(blank[0])+k;
			var newY = parseInt(blank[1])+k;
			var update = [[blank[0],blank[1]]];
			//dif = Math.abs(dif);
			//PS.debug("BEF0RE FOR LOOP!!! i = " + i + ", dif = " + dif + ", isVert = " + isVert + ", newX = " + newX + ", y = " + y + ", k = " + k + "\n")
			for(i = 0; Math.abs(i) < Math.abs(dif); i+=k){
				//PS.debug("i = " + i + ", dif = " + dif + ", isVert = " + isVert + ", x = " + x + ", y = " + y + ", k = " + k + ", x+i: " + (parseInt(x) + i) + "\n");
				if(isVert){
					update.push([x,parseInt(newY)+i]);
					G.swap(x,newY+i,blank[0],blank[1],true,false);
				}else{
					update.push([parseInt(newX)+i,y]);
					G.swap(parseInt(newX)+i,y,blank[0],blank[1],true,false);
				}
				//G.swap(update[Math.abs(i)+1][0],update[Math.abs(i)+1][1],blank[0],blank[1],true,false);
			}
			if(!isShuffle){
				PS.audioPlay("fx_bloop");//coin2");//blip");//squink	");
				G.updateTileSet(update);//not always; at least, not in shuffle
			}

		},

		swapColor : function(){
			is_colorblind = !is_colorblind;
			var p = puzzle_arr;
			puzzle_arr = puzzle_arr_alt;
			puzzle_arr_alt = p;
			G.updateTileSet([]);
			G.updateSol();
		},

		click : function(x, y, data, options){
			if(y==puzzle_height+margin){
				if(x>puzzle_width+margin && x<puzzle_width+margin+3) {
					//PS.debug("\n"+ puzzle_arr + "\n\n");
					G.swapColor();
					//PS.debug("\n"+ puzzle_arr + "\n\n");
				}else if(x ==margin){
					G.shuffle();
				}
			}

			var coords = G.convert(x,y, true);
			//if(x < puzzle_width + margin && x > margin-1 && y < puzzle_height + margin && y > margin-1){
			//PS.debug( "coords[0]: " + coords[0] + ", coords[1]: " + coords[1] + "\n" );
			if(coords[0] < puzzle_width && coords[0] > -1 && coords[1] < puzzle_height && coords[1] > -1){
				//it's inside the puzzle
				//PS.debug( "G.click() @ " + x + ", " + y + "\n" );
				//G.swap(coords[0],coords[1], blank[0], blank[1], true, false);
				//f(G.XOr(coords[0] - blank[0] == 0, coords[1]-blank[1]==0)){
				G.slide(coords[0],coords[1], false);
				//}
			}else {
				//G.swap(PS.random(puzzle_width) - 1, PS.random(puzzle_height) - 1, blank[0], blank[1], true, false);
				//PS.debug("random swap!\n");
			}
		},

		shuffle : function(){//randomly choose vertical or horizontal,
			var isVert;
			var coords;
			var num_moves = PS.random(100)+100;
			var i;
			for(i = 0; i<num_moves; i+=1){
				coords = [blank[0],blank[1]];
				isVert = PS.random(2)-1;
				coords[isVert] = isVert ? PS.random(puzzle_height)-1 : PS.random(puzzle_width)-1;
				if(coords[isVert] != blank[isVert]){
					G.slide(coords[0], coords[1], true);
				}
			}
			G.updateTileSet([]);
			PS.audioPlay("fx_powerup7");

		},

		init : function( system, options ) {
			// Change this string to your team name
			// Use only ALPHABETIC characters
			// No numbers, spaces or punctuation!

			const TEAM = "WhichHawk";

			// Begin with essential setup
			// Establish initial grid size

			PS.gridSize( puzzle_width*2+1 + margin*2, puzzle_height + margin*2 ); // or whatever size you want
			PS.statusText( "Mystic Image" );
			PS.border(PS.ALL, PS.ALL, 0);

			G.initMargin();
			//CB
			PS.glyph(puzzle_width+margin+1, puzzle_height+margin, "C");
			PS.glyph(puzzle_width+margin+2, puzzle_height+margin, "B");
			//SHUFFLE
			PS.glyph(margin, puzzle_height+margin, 0x1F500);/*
			PS.glyph(margin+1, puzzle_height+margin, "H");
			PS.glyph(margin+2, puzzle_height+margin, "U");
			PS.glyph(margin+3, puzzle_height+margin, "F");*/

			var i, j, col;
			for(j = margin; j<puzzle_height+margin; j+=1){
				for(i = margin; i < puzzle_width+margin; i+=1){
					PS.scale(i,j,90);
					PS.bgColor(i,j, COLOR_TILE_BACKGROUND);//PS.COLOR_GRAY_LIGHT);
					PS.bgAlpha(i,j, 255);
					col = puzzle_arr[i-margin][j-margin];//need to futureproof this!!
					if(col == -1){
						PS.alpha(i,j,0);
						PS.borderAlpha(i,j,0);
						PS.border(i,j,PS.DEFAULT);
						//PS.alpha(i+puzzle_width+1,j,0);
					}else{
						PS.color(i,j, col);
						PS.color(i+puzzle_width+1,j, col);
						PS.border(i,j,PS.DEFAULT);
					}
				}
				//PS.color(puzzle_width+margin, j, PS.COLOR_BLACK);
			}
			PS.color(puzzle_width*2 + margin, puzzle_height+margin-1, COLOR_TILE_BACKGROUND);//PS.COLOR_GRAY_LIGHT);
			//PS.fade(PS.ALL, PS.ALL, 10);
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
		}
	};

	return exports;
} () );
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
	//PS.debug( "PS.touch() @ " + x + ", " + y + " width: " + G.puzzle_width + ", height: " + G.puzzle_height + "\n" );
	G.click(x,y,data,options);
	//if(x < G.puzzle_width && y < G.puzzle_height){
		//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	//}
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

