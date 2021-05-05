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
	var START_LOC = [15,30];

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
	var OBJ_SKIP_ROW = 0x00ff05;//0xaac703;
	var levelNum = 0;
	var numLevels = 3;
	var imagemap = {
		width : GRID_X,
		height : GRID_Y,
		pixelSize : 1,
		data : []
	};
	var level_files = [
		 {
		 	file: 'images/Fire_Tutorial/Fire_Power_Tutorial_Room_3.gif',
			objective_files:[
				'images/Fire_Tutorial/Fire_Power_Tutorial_Room_unlit_torches_1_1.gif',
				'images/Fire_Tutorial/Fire_Power_Tutorial_Room_unlit_torches_2_4.gif',
			],

			 availablePowerups: [1,3],
		},
		{
			file: 'images/Permeation_Tutorial/Permeable_Wall_Turtorial_Room_2.gif',
			objective_files:[

			],
			availablePowerups: [1,3],
		},
		{
			file: 'images/Water_Tutorial/Water_Ability_Tutorial_Room.gif',
			objective_files:[
				'images/Water_Tutorial/Water_Ability_Tutorial_Room_interactives.gif',
			],
			availablePowerups: [1,2,3],
		},
		{
			file: 'images/Strength_Tutorial/strength_tutorial_room.gif',
			objective_files:[

			],
			availablePowerups: [1,3],
		}

	];
	var map = {
		powerup_spot_loc: [-1, -1],
		//availablePowerups: [1,3],
		objective_sets: [

		],
		lava_list: [
		],

		PLANE : 0,
		/*map_key : {},
		init_map : function(){
			map.map_key = new Map([
				['PIT', {value: -4, color:0x333210}]

			]);
			//map.map_key.set('PIT', {value: -4, color:0x333210})
		},/**/

		GOAL: -6, //end of level, step on to progress
		PIT: -5, //a pit; a player on a pit will fall (bead shrinks, disapears, lose a life)
		COOL_LAVA:-4,
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
		/*
		imagemap : {
			width : GRID_X,
			height : GRID_Y,
			pixelSize : 1,
			data : []
		},*/
		COLOR_GOAL: 0x0000FF,
		COLOR_PIT: 0x333210,
		COLOR_COOL_LAVA:0x545755, //PS.COLOR_GRAY,
		COLOR_POWERUP_SPOT:0x0ACDDE,
		COLOR_FLOOR:0xA99D62,
		COLOR_BACKGROUND: PS.COLOR_BLACK,
		COLOR_WALL:0x219304,
		COLOR_DOOR: 0x873C1F,
		COLOR_TORCH: 0x000011,//0x001,
		COLOR_LIT_TORCH:0xFF3700,
		COLOR_ICE:PS.COLOR_WHITE,
		COLOR_PERM_WALL:0xFFF500,
		COLOR_LAVA: 0xFF5500,
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

	var powerupSpotObj = {
		base: {
			rgb:0,
			r:0,
			g:0,
			b:0,
		},//PS.makeRGB(map.COLOR_POWERUP_SPOT,
		timerID: "",
		currentCol: {
			rgb:0,
			r:0,
			g:0,
			b:0,
		},
		colorRange: 50,
		increment: 5,
	};
	var lavaObj = {
		base: {
			rgb:0,
			r:0,
			g:0,
			b:0,
		},//PS.makeRGB(map.COLOR_POWERUP_SPOT,
		timerID: "",
		currentCol: {
			rgb:0,
			r:0,
			g:0,
			b:0,
		},
		colorRange: 30,
		increment: 3,
	};

	var goalDelay = false;

	var POWERUPS = {
		available : [],// [1,3],
		current : -1,
		NONE: 0,
		FIRE: 1,
		WATER: 2,
		PERMEABLE: 3,
		STRENGTH: 4,

	};

	var die = function(){
		place_player(START_LOC[0], START_LOC[1], true);
		G.player.lives -=1;
		draw_lives();
		G.player.canMove = true;
	};

	var resetMap = function(){
		PS.color(PS.ALL, PS.ALL, map.COLOR_BACKGROUND);
		PS.bgColor(PS.ALL, PS.ALL, map.COLOR_BACKGROUND);
		PS.bgAlpha(PS.ALL, PS.ALL, 255);
		PS.border(PS.ALL, PS.ALL, 0);
		PS.borderColor ( PS.ALL, PS.ALL, PS.DEFAULT);
		PS.alpha(PS.ALL, PS.ALL, 255);
		PS.radius(PS.ALL, PS.ALL, 0);
		PS.scale(PS.ALL, PS.ALL, 100);
		map.objective_sets = [];
		map.mapdata = {};
		imagemap = {
			width : GRID_X,
			height : GRID_Y,
			pixelSize : 1,
			data : []
		};
		map.lava_list = [];
	};

	var draw_clock = function(){

	};
	var draw_lives = function(){

	};

	var getColFromType = function(type){
		var color;
		switch ( type ) {
			case map.FLOOR:
				color = map.COLOR_FLOOR;
				break;
			case map.BACKGROUND:
				color = map.COLOR_BACKGROUND;
				break;
			case map.WALL:
				color = map.COLOR_WALL;
				break;
			case map.PIT:
				color = map.COLOR_PIT;
				break;
			case map.POWERUP_SPOT:
				color = map.COLOR_POWERUP_SPOT;
				break;
			case map.DOOR:
				color = map.COLOR_DOOR;
				break;
			case map.TORCH:
				color = map.COLOR_TORCH;
				break;
			case map.LIT_TORCH:
				color = map.COLOR_LIT_TORCH;
				break;
			case map.GOAL:
				color = map.COLOR_GOAL;
				break;
			case map.ICE:
				color = map.COLOR_ICE;
				break;
			case map.PERM_WALL:
				color = map.COLOR_PERM_WALL;
				break;
			case map.LAVA:
				color = map.COLOR_LAVA;
				break;
			case map.COOL_LAVA:
				color = map.COLOR_COOL_LAVA;
				break;
			case map.PUSHABLE_BLOCK:
				color = map.COLOR_PUSHABLE_BLOCK;
				break;
			case map.BLOCK_SLOT:
				color = map.COLOR_BLOCK_SLOT;
				break;
			default:
				color = map.BACKGROUND;
				break;
		}
		return color;
	};

	var draw_map = function ( im_map ) {
		var orig_plane, i, x, y, data, color;
		orig_plane = PS.gridPlane();
		PS.gridPlane( map.PLANE );

		i = 0;
		for ( y = 0; y < im_map.height; y += 1 ) {
			for (x = 0; x < im_map.width; x += 1) {
				//PS.debug("x: " + x + ", y: " + y + "\n");
				data = im_map.data[ i ];
				color = getColFromType(data);
				/*
				switch ( data ) {
					case map.FLOOR:
						color = map.COLOR_FLOOR;
						break;
					case map.BACKGROUND:
						color = map.COLOR_BACKGROUND;
						PS.radius(x,y, 50);
						PS.border(x,y,1);
						PS.borderColor(x,y, PS.COLOR_GRAY);
						PS.scale(x,y,60);
						break;
					case map.WALL:
						color = map.COLOR_WALL;
						break;
					case map.PIT:
						color = map.COLOR_PIT;
						break;
					case map.POWERUP_SPOT:
						color = map.COLOR_POWERUP_SPOT;
						break;
					case map.DOOR:
						color = map.COLOR_DOOR;
						break;
					case map.TORCH:
						color = map.COLOR_TORCH;
						PS.radius(x,y, 50);
						PS.border(x,y,1);
						PS.borderColor(x,y, PS.COLOR_GRAY);
						PS.scale(x,y,60);
						break;
					case map.LIT_TORCH:
						color = map.COLOR_LIT_TORCH;
						PS.radius(x,y, 50);
						PS.border(x,y,1);
						PS.borderColor(x,y, PS.COLOR_GRAY);
						PS.scale(x,y,60);
						PS.bgColor(x,y,map.COLOR_TORCH);
						break;
					case map.ICE:
						color = map.COLOR_ICE;
						break;
					case map.PERM_WALL:
						color = map.COLOR_PERM_WALL;
						break;
					case map.LAVA:
						color = map.COLOR_LAVA;
						break;
					case map.COOL_LAVA:
						color = map.COLOR_COOL_LAVA;
						break;
					case map.PUSHABLE_BLOCK:
						color = map.COLOR_PUSHABLE_BLOCK;
						break;
					case map.BLOCK_SLOT:
						color = map.COLOR_BLOCK_SLOT;
						break;
					default:
						color = map.BACKGROUND;
						break;
				}*/
				//PS.debug("color: " + color + ", data: " + data + "\n");
				updateTile(x,y,data, color);

				/*PS.color( x, y, color );
				if(data != map.LIT_TORCH){
					PS.bgColor(x,y,color);
				}*/
				i += 1;

			}
		}

		PS.gridPlane( orig_plane );
		G.player.sprite = PS.spriteSolid( 1, 1 ); // Create 1x1 solid sprite, save its ID
		PS.spriteSolidColor( G.player.sprite, G.player.color ); // assign color
		PS.spritePlane( G.player.sprite, G.player.plane ); // Move to assigned plane
		place_player(START_LOC[0], START_LOC[1], false);
		draw_lives();
		draw_clock();
		updatePowerupDisplay();
	};

	var place_player = function ( x, y, moved ) {
		if(moved){
			PS.radius(G.player.loc[0], G.player.loc[1], 0);
		}
		PS.radius(x,y, 50);
		PS.spriteMove( G.player.sprite, x, y );
		G.player.loc = [x,y];
	};

	var is_blocking = function ( x, y ) { //returns true if there is a tile that the player cannot step on by default
		// at the given location
		var data;

		data = imagemap.data[ ( y * GRID_X ) + x ];
		//return false;
		return ( data >= 0 );
	};

	var updateTile = function(x,y,tile, color){
		PS.color( x, y, color );
		switch(tile){
			case map.TORCH:
				PS.radius(x,y, 50);
				PS.border(x,y,1);
				PS.borderColor(x,y, PS.COLOR_GRAY);
				PS.scale(x,y,60);
				PS.bgColor(x,y,color);
				break;
			case map.LIT_TORCH:
				PS.radius(x,y, 50);
				PS.border(x,y,1);
				PS.borderColor(x,y, PS.COLOR_GRAY);
				PS.scale(x,y,60);
				PS.bgColor(x,y,map.COLOR_TORCH);
				break;

			case map.BLOCK_SLOT:
				PS.bgColor(x,y,color);
				//todo
				break;
			case map.ICE:
				//PS.bgColor(x,y, map.COLOR_FLOOR);
				//PS.radius(x,y,30);
				//PS.scale(x,y,90);
				PS.bgColor(x,y,color);
				break;
			default:
				PS.bgColor(x,y,color);
				break;
		}
	};

	var updatePowerupDisplay = function(){
		var x = 30;
		var y = 30;
		var i = 0;
		var color = map.COLOR_BACKGROUND;
		var pow;
		while(i < POWERUPS.available.length){
			//PS.scale(x,y,100);
			//PS.radius(x,y,0);
			pow = POWERUPS.available[i];
			//PS.debug(pow + ": pow \n");
			switch (pow){
				case POWERUPS.FIRE:
					color = map.COLOR_LIT_TORCH;
					break;
				case POWERUPS.PERMEABLE:
					color = map.COLOR_PERM_WALL;
					break;
				case POWERUPS.WATER:
					color = PS.COLOR_BLUE;
					break;
				default:
					break;
			}
			//PS.color(x,y,color);
			PS.bgColor(x,y, color);
			if(pow == G.player.powerup){
				//PS.border(x,y, 3);
				//PS.borderColor(x,y, PS.COLOR_GRAY);
				PS.scale(x,y,30);
				PS.radius(x,y,50);
				PS.color(x,y,PS.COLOR_GRAY_LIGHT);
				//PS.visible(x,y,false);
			}else{
				//PS.visible(x,y,true);
				PS.color(x,y,color);
				PS.scale(x,y,100);
				PS.radius(x,y,0);
				//PS.border(x,y,0);
			}
			y-=1;
			i+=1;
		}
	};

	var inBounds = function(x,y){ //checks if coords are out of bounds
		return !((x < 0) || (y >= GRID_X) || (x < 0) || (y >= GRID_Y));/* {
			return false;
		}else{
			return true;
		}*/
	};

	var use_fire = function(x,y){
		if(!inBounds(x,y)){
			return;
		}
		G.player.canMove = false;
		//G.player.canUse = false;
		var tile, orig_col, new_col;
		tile = imagemap.data[(y*GRID_X)+x];
		orig_col = getColFromType(tile);
		switch(tile){
			case map.ICE:
				new_col = map.COLOR_FLOOR;
				imagemap.data[(y*GRID_X)+x] = map.FLOOR;
				break;
			case map.TORCH:
				new_col = map.COLOR_LIT_TORCH;
				imagemap.data[(y*GRID_X)+x] = map.LIT_TORCH;
				tile = map.LIT_TORCH;
				//PS.debug("lighting torch at: " + x + ", " + y + "\n");
				updateObjectives([x,y], map.TORCH);
				break;
			case map.LIT_TORCH:
				orig_col = map.COLOR_TORCH;
				break;
			case map.COOL_LAVA:
				new_col =lavaObj.currentCol.rgb;
				imagemap.data[(y*GRID_X)+x] = map.LAVA;
				map.lava_list.push([x,y]);
				break;
			case map.LAVA:
				orig_col = lavaObj.currentCol.rgb;
				new_col = orig_col;
				break;
			case map.POWERUP_SPOT:
				orig_col = powerupSpotObj.currentCol.rgb;
				new_col = orig_col;
				break;
			default:
				new_col = orig_col;
				break;
		}
		PS.color(x,y, map.COLOR_LIT_TORCH);
		PS.radius(x,y,50);
		PS.scale(x,y, 90);
		//PS.border(x,y,0);
		PS.bgColor(x,y,orig_col);
		if(orig_col == map.COLOR_LIT_TORCH){
			PS.debug("use fire");
		}

		//imagemap.data[(y*GRID_X) + x] = map.LIT_TORCH;

		var timerID = PS.timerStart( 9,function(){
			updateTile(x,y,tile,new_col);
			//PS.radius(x,y, 50);
			/*if(tile == map.LIT_TORCH){
				//PS.borderAlpha(x,y, PS.DEFAULT);
				PS.scale(x,y,60);
			}else{

			}

			PS.color(x,y,new_col);*/
			G.player.canMove = true;
			//G.player.canUse = true;
			PS.timerStop(timerID);
		});

	};

	var use_water = function(x,y){
		if(!inBounds(x,y)){
			return;
		}
		G.player.canMove = false;
		//G.player.canUse = false;
		var tile, orig_col, new_col;
		tile = imagemap.data[(y*GRID_X)+x];
		orig_col = getColFromType(tile);
		switch(tile){
			case map.LAVA:
				orig_col = lavaObj.currentCol.rgb;
				new_col = map.COLOR_COOL_LAVA;
				imagemap.data[(y*GRID_X)+x] = map.COOL_LAVA;
				var ind = getIndOfLava(x,y);
				if(ind != -1){
					map.lava_list.splice(ind,1);
				}
				break;
			case map.LIT_TORCH:
				orig_col = map.COLOR_TORCH;
				new_col = map.COLOR_TORCH;
				imagemap.data[(y*GRID_X)+x] = map.TORCH;
				tile = map.TORCH;
				//PS.debug("lighting torch at: " + x + ", " + y + "\n");
				updateObjectives([x,y], map.LIT_TORCH);
				break;
			/*case map.TORCH:
				orig_col = map.COLOR_TORCH;
				break;*/
			case map.POWERUP_SPOT:
				orig_col = powerupSpotObj.currentCol.rgb;
				new_col = orig_col;
				break;

			default:
				new_col = orig_col;
				break;
		}
		PS.color(x,y, PS.COLOR_BLUE);
		PS.radius(x,y,50);
		PS.scale(x,y, 90);
		//PS.border(x,y,0);
		PS.bgColor(x,y,orig_col);
		/*if(orig_col == map.COLOR_LIT_TORCH){
			PS.debug("use fire");
		}*/

		//imagemap.data[(y*GRID_X) + x] = map.LIT_TORCH;

		var timerID = PS.timerStart( 9,function(){
			updateTile(x,y,tile,new_col);
			//PS.radius(x,y, 50);
			/*if(tile == map.LIT_TORCH){
				//PS.borderAlpha(x,y, PS.DEFAULT);
				PS.scale(x,y,60);
			}else{

			}

			PS.color(x,y,new_col);*/
			G.player.canMove = true;
			//G.player.canUse = true;
			PS.timerStop(timerID);
		});

	};

	var fall = function(){
		G.player.canMove = false;

		var timerID;
		var scale = 100;
		var x = G.player.loc[0];
		var y = G.player.loc[1];
		PS.audioPlay('fx_bloink');
		timerID = PS.timerStart( 6,function(){
			scale-=20;
			if(scale< 21 ){
				PS.timerStop(timerID);
				die();
				PS.scale(x,y, 100);
			}else {
				PS.scale(x, y, scale);
			}
		});
	};

	var isPerm = function(x,y){
		return (imagemap.data[(y*GRID_X)+x] == map.PERM_WALL);
	}

	var permeate = function(x,y){
		if(isPerm(x,y)){
			G.player.canMove = false;
			var timerID;
			var dx = G.player.dir[0];
			var dy = G.player.dir[1];

			var next_x = G.player.loc[0] + dx;
			var next_y = G.player.loc[1] + dy;
			//PS.spriteSolidAlpha(G.player.sprite, 10);

			timerID = PS.timerStart( 10,function(){
				if(isPerm( next_x,  next_y)) {
					place_player(next_x,next_y,true);
					PS.spriteSolidColor(G.player.sprite,0xD2754B);
					//PS.spriteSolidAlpha(G.player.sprite, 1);
					next_x+=dx;
					next_y+=dy;
					//PS.scale(x,y, 100);
				}else if(is_blocking(next_x,next_y)){
					PS.timerStop(timerID);
					die();
					PS.spriteSolidColor(G.player.sprite, G.player.color);
					//PS.spriteSolidAlpha(G.player.sprite, 255);
				}else{
					place_player(next_x,next_y, true);
					PS.timerStop(timerID);
					G.player.canMove = true;
					PS.spriteSolidColor(G.player.sprite, G.player.color);
					//PS.spriteSolidAlpha(G.player.sprite, 255);
				}
			});
		}
	};

	var onObjLoad = function (image) {
		var i, x, y, pixel;
		if (image == PS.ERROR) {
			PS.debug("onObjLoad(): image load error\n");
			return;
		}
		//map.mapdata = image;
		var numObjs = 0;

		//i = 0; // init pointer into imagemap.data array
		var door_loc = [ [-1, -1], [-1, -1] ];
		var torches_loc = []
		var slots_loc = [];
		var needToBeLit = true;
		//put an indicator at the top left corner, one color if need to be lit, another if need to be unlit?
		//for now, is based on whether it finds an unlit or lit first
		var foundIfNeedLit = false;
		var lit_torches_loc = [];
		var foundDoor = false;
		var i = 0;
		for (y = 0; y < GRID_Y; y += 1) {
			for (x = 0; x < GRID_X; x += 1) {
				//data = map.FLOOR; // assume floor
				pixel = image.data[i];
				switch (pixel) {
					case PS.COLOR_WHITE:
						break; // no need to do anything
					case 0:
						break;
					case OBJ_SKIP_ROW:
						i+= (GRID_X-x-1);
						x = GRID_X;
						break;
					case map.COLOR_DOOR:
						if(!foundDoor){
							door_loc[0][0] = x;
							door_loc[0][1] = y;
							foundDoor = true;
						}else{
							door_loc[1][0] = x;
							door_loc[1][1] = y;
						}
						//data = map.DOOR;
						break;
					case map.COLOR_TORCH:
						torches_loc.push([x,y]);
						if(!foundIfNeedLit){
							foundIfNeedLit = true;
							needToBeLit = true;
						}
						if(needToBeLit) {
							numObjs += 1;
						}
						//data = map.TORCH;
						break;
					case map.COLOR_LIT_TORCH:
						lit_torches_loc.push([x,y]);
						if(!foundIfNeedLit){
							foundIfNeedLit = true;
							needToBeLit = false;
						}
						if(!needToBeLit) {
							numObjs += 1;
						}
						//data = map.LIT_TORCH;
						//needToBeLit = false;
						//maybe make it a tile at the top left corner whose color determines thsi?
						break;
					case map.COLOR_BLOCK_SLOT:
						numObjs+=1;
						slots_loc.push([x,y]);
						//data = map.BLOCK_SLOT;
						break;
					default:
						PS.debug("onObjLoad(): unrecognized pixel value: " + pixel.toString(16) + "\n");
						break;
				}
				//imagemap.data[i] = data; // install translated data
				i += 1; // update array pointer

			}
		}
		map.objective_sets.push({
			door: door_loc,
			needLit: needToBeLit,
			torches: torches_loc,
			lit_torches: lit_torches_loc,
			slots: slots_loc,
			objectives_left: numObjs,
		});


	}

	var makeObjective = function(obj_file){//door, torches, slots, numObjectives){


		//door = [ [x_start,y_start],[x_end,y_end] ];
		//torches = [ [x_torch1,y_torch1], [x_torch2, y_torch2], ... ];
		//slots = [ [x_slot1,y_slot1], [x_slot2, y_slot2], ... ];


		/*
		var objective = {
			door: [ [x_start,y_start],[x_end,y_end] ],
			needLit: true/false, (if torches need to be lit or unlit
			torches: [ [x_torch1,y_torch1], [x_torch2, y_torch2], ... ],
			lit_torches:
			slots: [ [x_slot1,y_slot1], [x_slot2, y_slot2], ... ],
			objectives_left: numObjectives,
		}
		 */


		var obj_door = [ ];

	};

	var updateObjectives = function(obj_loc, obj_type){//returns true if successful
		var obj_list, obj_other;
		var i, j;
		var isTorch = 0;
		var set;
		//PS.debug("length of map.objective_sets: " + map.objective_sets.length + "\n");
		for(i = 0; i < map.objective_sets.length; i+=1){
			set = map.objective_sets[i];
			//if(!set.opened) {//might need to add something

			switch (obj_type) {
				case map.TORCH:
					obj_list = set.torches;
					obj_other = set.lit_torches;
					isTorch = 1;
					break;
				case map.LIT_TORCH:
					//if(set)
					obj_list = set.lit_torches;
					obj_other = set.torches;
					isTorch = 2;
					//PS.debug("lit torch\n");
					break;
				case map.BLOCK_SLOT:
					obj_list = set.slots;
					break;

				default:
					return;
					break;
			}
			var obj_added = false;
			//PS.debug("\nflaaag\n");
			PS.debug("obj_list lenght: " + obj_list.length + "\n");
			j = 0;
			while(j < obj_list.length){//; j += 1) {
				
				//PS.debug("j = " + j + ", i = " + i + ", obj_list[j] = [" + obj_list[j][0] + ", " + obj_list[j][1] + "] \n");
				if (obj_list[j][0] == obj_loc[0] && obj_list[j][1] == obj_loc[1]) {
					if(isTorch>0){
						//PS.debug("objective completed at " + obj_list[j][0] + ", " + obj_list[j][1] + "\n");
						obj_other.push(obj_list.splice(j,1)[0]);
						//PS.debug("spliced, torch\n");
						if(isTorch==1 && !set.needLit || isTorch==2 && set.needLit){
							obj_added = true;
						}

					}else{
						obj_list.splice(j,1);
						//PS.debug("spliced, not torch\n");
					}
					if(!obj_added) {
						set.objectives_left -= 1;

						//PS.debug("objectives left: " + set.objectives_left + "\n\n");
						if (set.objectives_left == 0) {
							toggleDoor(i, true);
						}
					}else{
						//PS.debug("objectives left (added): " + set.objectives_left + "\n");
						if (set.objectives_left == 0) {
							toggleDoor(i, false);
						}
						set.objectives_left+=1;
					}
					return true;
				}else {
					j += 1
				}
				//PS.debug("obj_list lenght after: " + obj_list.length + "\n");
			}
			//}
			//PS.debug("\n");
		}
		//PS.debug("false!!");
		return false;

	};

	var toggleDoor = function(doorNum, beingOpened){ //doors must be either horizontal or vertical! no diagonal!
		//PS.debug("\n\n\n");
		var isVert, i, start, end, index, newCol, newType;
		if(beingOpened){
			newType = map.FLOOR;
			newCol = map.COLOR_FLOOR;
		}else{
			newType = map.DOOR;
			newCol = map.COLOR_DOOR;
		}

		start = map.objective_sets[doorNum].door[0];
		end = map.objective_sets[doorNum].door[1];
		if(end[0] == -1){
			imagemap.data[(start[1]*GRID_X)+start[0]] = newType;
			PS.color(start[0], start[1], newCol);
			return;
		}

		isVert = (start[0] == end[0]);
		if(isVert){
			index = 1;
		}else{
			index = 0;
		}


		for(i = start[index]; i <= end[index]; i+=1){
			if(isVert){
				imagemap.data[(i*GRID_X)+start[0]] = newType;
				PS.color(start[0], i, newCol);
				PS.bgColor(start[0], i, newCol);
			}else{
				imagemap.data[(start[1]*GRID_X)+i] = newType;
				PS.color(i, start[1], newCol);
				PS.bgColor(i, start[1], newCol);
			}
		}
		//door = [[x_start,y_start],[x_end,y_end]];
	}

	var onMapLoad = function (image) {
		var i, x, y, data, pixel;
		if(image == PS.ERROR){
			PS.debug( "onMapLoad(): image load error\n" );
			return;
		}
		resetMap();
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
						map.powerup_spot_loc = [x,y];
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
					case map.COLOR_GOAL:
						data = map.GOAL;
						break;
					case map.COLOR_ICE:
						data = map.ICE;
						break;
					case map.COLOR_PERM_WALL:
						data = map.PERM_WALL;
						break;
					case map.COLOR_LAVA:
						data = map.LAVA;
						map.lava_list.push([x,y]);
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
						PS.debug( "onMapLoad(): unrecognized pixel value: " + pixel.toString(16) +  "\n" );
						break;
				}
				imagemap.data[ i ] = data; // install translated data
				i += 1; // update array pointer
			}
		}

		draw_map(imagemap)
		/*
        if(roomNum == 0) {
            var timerID = PS.timerStart(300, function () {


            });
        }
        */



	};

	var loadMap = function(level){
		if(powerupSpotObj.timerID != "") {
			PS.timerStop(powerupSpotObj.timerID);
		}
		if(lavaObj.timerID != ""){
			PS.timerStop(lavaObj.timerID);
		}
		PS.imageLoad(level_files[levelNum].file, onMapLoad, 1);
		var i;
		//PS.debug("outside for loop loadMap(level) \n");
		for(i = 0; i < level_files[levelNum].objective_files.length; i+=1){
			//PS.debug("obj_File num: " + i | "\n");
			PS.imageLoad(level_files[levelNum].objective_files[i], onObjLoad, 1);
		}
		POWERUPS.available = level_files[levelNum].availablePowerups;
		powerupSpotObj.timerID = PS.timerStart(6, powerupSpotTimerFunc);
		lavaObj.timerID = PS.timerStart(6, lavaTimerFunc);

	};

	var powerupSpotTimerFunc = function(){
		var curCol = powerupSpotObj.currentCol;

		if(curCol.g>=(powerupSpotObj.base.g+powerupSpotObj.colorRange) || curCol.g<=(powerupSpotObj.base.g-powerupSpotObj.colorRange)){
			powerupSpotObj.increment = powerupSpotObj.increment * -1;

		}/*else if(curCol.g<=(powerupSpotObj.base.g+50)){
			powerupSpotObj.increment = 1;
		}*/
		curCol.g+=powerupSpotObj.increment;
		curCol.rgb = PS.makeRGB(curCol.r, curCol.g, curCol.b);
		PS.color(map.powerup_spot_loc[0], map.powerup_spot_loc[1], curCol.rgb);
		PS.bgColor(map.powerup_spot_loc[0], map.powerup_spot_loc[1], curCol.rgb);
		//PS.debug("col: " + curCol.rgb.toString(16) + ", inc: " + powerupSpotObj.increment + ", g: " + curCol.g + "\n");
		//G.switchMaps();
		//goalDelay = false;
		//G.player.canMove = true;
		//PS.timerStop(timerID);

	};

	var getIndOfLava = function(x,y){
		var i;
		for(i = 0; i < map.lava_list.length; i+=1){
			if(map.lava_list[i][0] == x && map.lava_list[i][1] == y){
				return i;
			}
		}
		return -1;
	};

	var lavaTimerFunc = function(){
		var curCol = lavaObj.currentCol;

		if(curCol.r>=(lavaObj.base.r+lavaObj.colorRange) || curCol.r<=(lavaObj.base.r-lavaObj.colorRange)){
			lavaObj.increment = lavaObj.increment * -1;

		}/*else if(curCol.g<=(powerupSpotObj.base.g+50)){
			powerupSpotObj.increment = 1;
		}*/
		curCol.r+=lavaObj.increment;
		curCol.g+=lavaObj.increment;
		curCol.b+=lavaObj.increment;
		curCol.rgb = PS.makeRGB(curCol.r, curCol.g, curCol.b);

		var i;
		for(i = 0; i < map.lava_list.length; i+=1){
			PS.color(map.lava_list[i][0], map.lava_list[i][1], curCol.rgb);
			PS.bgColor(map.lava_list[i][0], map.lava_list[i][1], curCol.rgb);
		}
	};

	var exports = {
		/*move: function(dir){

		},*/
		use : function(){
			if(!G.player.canMove || !G.player.canUse){
				return;
			}
			if(imagemap.data[ (G.player.loc[1] * GRID_X)+G.player.loc[0]]==map.POWERUP_SPOT){
				if(G.player.powerup == 0){
					G.player.powerup = POWERUPS.available[0];
					POWERUPS.current = 0;
				}else{
					POWERUPS.current+=1;
					if(POWERUPS.current >= POWERUPS.available.length){
						POWERUPS.current = 0;
					}
					G.player.powerup = POWERUPS.available[POWERUPS.current];
				}
				updatePowerupDisplay();
			}else {
				var lookx = G.player.loc[0] + G.player.dir[0];
				var looky = G.player.loc[1] + G.player.dir[1];
				switch(G.player.powerup){
					case POWERUPS.FIRE:
						use_fire(lookx,looky);
						break;
					case POWERUPS.WATER:
						use_water(lookx,looky);
						break;
					case POWERUPS.PERMEABLE:
						permeate(lookx,looky);
						break;
					default:
						break;
				}
			}
		},

		player_step : function ( h, v ) {

			var nx, ny;
			G.player.dir = [h,v];
			// Calculate proposed new location.
			nx = G.player.loc[0]+h;
			ny = G.player.loc[1]+v;

			if (is_blocking(nx, ny)) {
				return;
			}

			// Is new location off the grid?
			// If so, exit without moving.

			if (!inBounds(nx,ny)){//(nx < 0) || (nx >= GRID_X) || (ny < 0) || (ny >= GRID_Y)) {
				return;
			}

			//actor_path = null;
			place_player(nx, ny, true);
			if(imagemap.data[(ny*GRID_X)+nx] == map.PIT){
				fall();
			}else if(imagemap.data[(ny*GRID_X)+nx] == map.GOAL){
				if(!goalDelay){
					goalDelay = true;
					G.player.canMove = false;
					var timerID = PS.timerStart( 18,function(){
						G.switchMaps();
						goalDelay = false;
						G.player.canMove = true;
						PS.timerStop(timerID);
					});

				}

			}
		},

		switchMaps: function(){

			POWERUPS.current = -1;
			G.player.powerup = 0;
			PS.spriteDelete(G.player.sprite);
			levelNum += 1;
			if(levelNum>=numLevels){
				levelNum = 0;
			}
			loadMap(levelNum);

			/*
			switch (roomNum) {
				case 0:
					PS.imageLoad( 'images/Fire_Power_Tutorial_Room_1.gif', onMapLoad, 1 );
					break;
				case 1:
					PS.imageLoad('images/Permeable_Wall_Turtorial_Room_1.gif', onMapLoad, 1);
					break;
				case 2:
					PS.imageLoad('images/strength_tutorial_room.gif', onMapLoad, 1);
					break;
				case 3:
					PS.imageLoad('images/Water_Ability_Tutorial_Room.gif', onMapLoad, 1);
					break;
				default:
					//PS.timerStop(timerID);
					break;

			}*/
		},

		player: {
			plane: 1,
			loc: [0,0],
			dir: [0,-1],
			color: 0xFF00AB,
			lives: 4,
			sprite:{},
			canMove:true,
			canUse:true,
			powerup : 0,

		},
		clock: {
			time: 100,
		},


		// G.init()
		// Initializes the game

		init: function () {




			PS.unmakeRGB(map.COLOR_POWERUP_SPOT, powerupSpotObj.base);
			PS.unmakeRGB(map.COLOR_POWERUP_SPOT, powerupSpotObj.currentCol);
			PS.unmakeRGB(map.COLOR_LAVA, lavaObj.currentCol);
			//PS.unmakeRGB(map.COLOR_LAVA, lavaObj.base);
			lavaObj.base.r = lavaObj.currentCol.r-30;
			lavaObj.base.b = lavaObj.currentCol.g;
			lavaObj.base.b = lavaObj.currentCol.b+30;
			lavaObj.base.rgb = PS.makeRGB(lavaObj.base.r, lavaObj.base.g, lavaObj.base.b);
			PS.gridSize( GRID_X, GRID_Y );
			//resetMap();
			PS.statusText( "Athena's Trap" );
			loadMap(0);
			PS.keyRepeat(PS.CURRENT, 15, PS.CURRENT);
			//PS.imageLoad( level_files[0].file, onMapLoad, 1 );
			/*
			var timer = 0;
			while (timer < 2000){
				timer+=1;
			}
			PS.imageLoad( 'images/Permeable_Wall_Tutorial_Room_1.gif', onMapLoad, 1 );
			timer = 0;
			while (timer < 2000){
				timer+=1;
			}
			PS.imageLoad( 'images/strength_tutorial_room.gif', onMapLoad, 1 );
			timer = 0;
			while (timer < 2000){
				timer+=1;
			}
			PS.imageLoad( 'images/Water_Ability_Tutorial_Room.gif', onMapLoad, 1 );
			/*timer = 0;
			while (timer < 200){
				timer+=1;
			}*/
			//PS.debug("tab to cycle levels (debug/playtesting)\n");

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
	if(!G.player.canMove){
		return;
	}
	switch ( key ) {
		case PS.KEY_TAB:
			G.switchMaps();
			break;
		case PS.KEY_ARROW_UP:
		case 119:
		case 87: {
			G.player_step( 0, -1 ); // move UP (v = -1)
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83: {
			G.player_step( 0, 1 ); // move DOWN (v = 1)
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65: {
			G.player_step( -1, 0 ); // move LEFT (h = -1)
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68: {
			G.player_step( 1, 0 ); // move RIGHT (h = 1)
			break;
		}
		case PS.KEY_SPACE:
			G.use();
			break;
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

