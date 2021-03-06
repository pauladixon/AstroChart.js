/** This file is part of AstroChart.js
 *
 *    AstroChart.js is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    AstroChart.js is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with AstroChart.js.  If not, see <http://www.gnu.org/licenses/>.
 */

function aspect(planet1, planet2) {
	var orb = 6;
	var angle = Math.abs(planet1.angle - planet2.angle);
	if(angle > 180) angle = 360 - angle;

	if(isMoon(planet1) || isSun(planet1) || isMoon(planet2) || isSun(planet2)) {
		orb = 8;
	}

	if (angle <= orb) {
		return 1;
	} else if ((angle <= (60 + orb)) && (angle >= (60 - orb))) {
		return 6;
	} else if ((angle <= (90 + orb)) && (angle >= (90 - orb))) {
		return 4;
	} else if ((angle <= (120 + orb)) && (angle >= (120 - orb))) {
		return 3;
	} else if ((angle <= (150 + orb)) && (angle >= (150 - orb))) {
		return 5;
	} else if (angle >= (180 - orb)) {
		return 2;
	}

	return 0;

	function isMoon(planet) {
		return planet.planet == 1;
	}

	function isSun(planet) {
		return planet.planet == 0;
	}

}

function astro_glyph(type, idx) {
	var pl_glyph = [];
	pl_glyph[0] = String.fromCharCode(81);
	pl_glyph[1] = String.fromCharCode(87);
	pl_glyph[2] = String.fromCharCode(69);
	pl_glyph[3] = String.fromCharCode(82);
	pl_glyph[4] = String.fromCharCode(84);
	pl_glyph[5] = String.fromCharCode(89);
	pl_glyph[6] = String.fromCharCode(85);
	pl_glyph[7] = String.fromCharCode(73);
	pl_glyph[8] = String.fromCharCode(79);
	pl_glyph[9] = String.fromCharCode(80);
	pl_glyph[10] = String.fromCharCode(77);
	pl_glyph[11] = String.fromCharCode(96);
	pl_glyph[12] = String.fromCharCode(123);
	pl_glyph[13] = String.fromCharCode(60);		//Part of Fortune
	pl_glyph[14] = String.fromCharCode(109);	//Vertex
	pl_glyph[15] = String.fromCharCode(90);		//Ascendant
	pl_glyph[16] = String.fromCharCode(88);		//Midheaven

	var sign_glyph = [];
	sign_glyph[1] = String.fromCharCode(97);
	sign_glyph[2] = String.fromCharCode(115);
	sign_glyph[3] = String.fromCharCode(100);
	sign_glyph[4] = String.fromCharCode(102);
	sign_glyph[5] = String.fromCharCode(103);
	sign_glyph[6] = String.fromCharCode(104);
	sign_glyph[7] = String.fromCharCode(106);
	sign_glyph[8] = String.fromCharCode(107);
	sign_glyph[9] = String.fromCharCode(108);
	sign_glyph[10] = String.fromCharCode(118);
	sign_glyph[11] = String.fromCharCode(120);
	sign_glyph[12] = String.fromCharCode(99);

	var aspect_glyph = [];
	aspect_glyph[1] = String.fromCharCode(113);
	aspect_glyph[2] = String.fromCharCode(119);
	aspect_glyph[3] = String.fromCharCode(101);
	aspect_glyph[4] = String.fromCharCode(114);
	//	aspect_glyph[5] = String.fromCharCode(111);
	aspect_glyph[6] = String.fromCharCode(116);

	switch(type) {
	case 'planet': return pl_glyph[idx];
	case 'sign': return sign_glyph[idx];
	case 'aspect': return aspect_glyph[idx];
	case 'retrograde': return String.fromCharCode(62);
	}
	return '';
};

function drawNatalChart(id, radius, params, options) {
	var longitude = params.longitude;
	var houses = params.houses;
	var retrogrades = params.retrogrades;
	var south = params.south;

	var defaults = {red : "red",
					aspect_red: "red",
					green : "green",
					aspect_green: "green",
					orange : "orange",
					blue:"blue",
					aspect_blue: "blue",
					outer_color : "yellow",
					outer_line: "goldenrod",
					outer_text_color : "black",
					inner_color : "green",
					inner_text_color : "lightgreen",
					outer_background_color : "white",
					inner_background_color: "white",
					outer_stroke1 : "black",
					outer_stroke2 : "black",
					inner_stroke1: "black",
					inner_stroke2: "black",
					text_color : "black",
					line_color: "lightgrey",
					ascendant_color: "black",
					houseHover: undefined,
					planetHover: undefined,
					conjunctionHover: undefined};

	var settings = utils.extend(defaults, {outer_text_stroke: options.outer_color | defaults.outer_color, inner_text_stroke: options.inner_color | defaults.inner_color}, options);

	var Ascendant = (houses != undefined)? houses[1]:undefined;

	var red = settings.red;
	var green = settings.green;
	var orange = settings.orange;
	var blue = settings.blue;
	var outer_color = settings.outer_color;
	var outer_text_color = settings.outer_text_color;
	var inner_color = settings.inner_color;
	var inner_text_color = settings.inner_text_color;
	var text_color = settings.text_color;
	var line_color = settings.line_color;


	var outer2_radius=radius;
	var outer2_thick = radius*35/300;
	var inner_radius = outer2_radius/3;
	var inner_thick = 2*outer2_thick/3;
	var big_gliph = radius*27/300;
	var mid_gliph = radius*20/300;
	var small_gliph = radius*15/300;
	var tiny_text = radius*10/300;

	var fsize = 2*(outer2_radius+outer2_thick);
	var center_x = fsize/2;
	var center_y = fsize/2;

	var conjunctions = [];
	var planets = [];

	var showAscendant = true;
	var showMC = true;
	var showLuna = true;

	var paper = Raphael(id, fsize,fsize);

	var hamburg = paper.getFont("HamburgSymbols");

	utils.drawThickCircle(center_x, center_y, outer2_radius, outer2_thick, paper, outer_color, settings.outer_background_color, settings.outer_stroke1, settings.outer_stroke2);

	utils.drawThickCircle(center_x, center_y, inner_radius,inner_thick, paper, inner_color, settings.inner_background_color, settings.inner_stroke1, settings.inner_stroke2);

	var x1 = center_x-inner_radius;
	var x2 = outer2_thick;
	var multiplier = 1;
    if(south) {
		x1 = center_x+inner_radius;
		x2 = center_y+outer2_radius;
		multiplier = -1;
	}



	if(houses != undefined) {
		//Ascendant
		utils.drawArrow(x1, center_y, x2, center_y, paper, settings.ascendant_color, multiplier*Math.abs(x2-x1)/10, multiplier*Math.abs(x2-x1)/20);

		//the fixed house line
		var fixed = utils.drawLine(0,center_y,outer2_thick,center_y, paper, settings.outer_line)
			.transform('r'+multiplier*reduce(Ascendant)+','+center_x+','+center_y);
		//houses
		var i;
		var last_angle = south?180:360;
		var sign_pos = Math.floor(houses[1]/30)+1;
		var degmin = 	displayDegMinute(houses[1], center_x-outer2_radius-2*radius/30,center_y,(south)?180:0, 1);
		var glyph = paper.print(center_x-outer2_radius-(radius/10),center_y, astro_glyph('sign',sign_pos), hamburg, big_gliph)
			.attr({fill: color(sign_pos), stroke: settings.outer_text_stroke, 'stroke-width': .5});
		if(south) glyph.transform('r180,'+center_x+','+center_y+'r180');
		glyph.node.id= "house-0";
		glyph.id= "house-0";
		if(settings.houseHover != null) {
			var bbox = glyph.getBBox();
			var boxw = Math.max(bbox.width, bbox.height);
			glyph = paper.rect(bbox.x+(bbox.x<0?1:-1)*5, bbox.y+(bbox.y<0?1:-1)*5, boxw+5, boxw+5)
				.attr({fill: "white", stroke: 'none', 'fill-opacity':0})
				.hover(
					function(evt) {settings.houseHover.f_in({house: 0, degree: degmin[0], minute: degmin[1], sign: sign_pos, color: color(sign_pos)}, evt);},
					function(evt) {settings.houseHover.f_out({house: 0, degree: degmin[0], minute: degmin[1], sign: sign_pos, color: color(sign_pos)}, evt);}
				);
			glyph.node.id= "house-hover-0";
			glyph.id= "house-hover-0";
		}

		for(i=2; i<=12;i++) {
			var angle = (Ascendant-houses[i]);
			if(south) angle = 180-angle;

			sign_pos = Math.floor(houses[i]/30)+1;

			if(angle < 0) {
				angle += 360;
			}
			if(angle>360) angle -= 360;
			var midAngle = (angle-(angle-last_angle)/2);

			//the fixed house line
			utils.drawLine(0,center_y,outer2_thick,center_y, paper, settings.outer_line)
				.transform('r'+(multiplier*(i-1)*30)+','+center_x+','+center_y)
				.transform('...r'+multiplier*reduce(Ascendant)+','+center_x+','+center_y);

			if(Math.floor(angle) == 0) midAngle = 180+last_angle/2;
			if(i == 10) {
				utils.drawArrow(x1,center_y,x2,center_y, paper, line_color, multiplier*Math.abs(x2-x1)/10, multiplier*Math.abs(x2-x1)/20).transform("r"+(angle+(south?180:0))+","+center_x+","+center_y);
			} else {
				utils.drawLine(x1,center_y,x2,center_y, paper, line_color).transform("r"+(angle+(south?180:0))+","+center_x+","+center_y);
			}

			last_angle=angle;

			//house number
			paper.text(center_x-inner_radius-inner_thick/2,center_y, i-1)
				.attr({fill: inner_text_color, 'font-size': small_gliph, stroke: settings.inner_text_stroke, 'stroke-width': .5})
				.transform("r"+midAngle+","+center_x+","+center_y+"r"+(-midAngle));

			degmin = displayDegMinute(houses[i], center_x-outer2_radius-2*radius/30,center_y, angle, i);

			//house glyph
			glyph = paper.print(center_x-outer2_radius-radius/10,center_y, astro_glyph('sign',sign_pos), hamburg, big_gliph).transform("r"+angle+","+center_x+","+center_y+"r-"+(angle))
				.attr({fill: color(sign_pos), stroke: settings.outer_text_stroke, 'stroke-width': .5});
			glyph.node.id= "house-"+i;
			glyph.id= "house-"+i;
			if(settings.houseHover != null) {
				var bbox = glyph.getBBox();
				var boxw = Math.max(bbox.width, bbox.height);
				glyph = paper.rect(bbox.x+(bbox.x<0?1:-1)*5, bbox.y+(bbox.y<0?1:-1)*5, boxw+5, boxw+5)
					.attr({fill: "white", stroke: 'none', 'fill-opacity':0})
					.hover(
						utils.mkClosure({house: i, degree: degmin[0], minute: degmin[1], sign: sign_pos, color: color(sign_pos)}, function(hs, evt, el) {settings.houseHover.f_in(hs, evt, el);}),
						utils.mkClosure({house: i, degree: degmin[0], minute: degmin[1],  sign: sign_pos, color: color(sign_pos)}, function(hs, evt, el) {settings.houseHover.f_out(hs, evt, el);})
					);
				glyph.node.id= "house-hover-"+i;
				glyph.id= "house-hover-"+i;
			}
		}
		var midAngle;
		midAngle = last_angle/2;
		if(south) midAngle = 180+(last_angle-180)/2;
		paper.text(center_x-inner_radius-inner_thick/2,center_y, 12)
			.attr({fill: inner_text_color, 'font-size': small_gliph, stroke: settings.inner_text_stroke, 'stroke-width': .5})
			.transform("r"+midAngle+","+center_x+","+center_y+"r-"+(midAngle));

	} else {
		showMC = false;
		showLuna = false;
		showAscendant = false;

		//whole house system
		//find the position of Sun
		houses = [];
		var pos_translate = [];
		var angle_sun;
		var i;
		var sun_sign;
		for(i=0; i<longitude.length; i++) {
			if(longitude[i].planet==0) {
				sun_sign = Math.floor(longitude[i].angle/30)+1;
				Ascendant = (sun_sign-1)*30;
				break;
			}
		}
		if(Ascendant != undefined) {
			for(i=0; i<12; i++) {
				var idx = i+1;
				var sign_pos = 1+(sun_sign+i-1)%12;
				pos_translate[idx] = sign_pos;
				houses[sign_pos] = (idx-1)*30;
				var angle = 360-idx*30;
				//the divider line
				utils.drawLine(x1,center_y,0,center_y, paper, line_color).transform("r"+angle+","+center_x+","+center_y);

				//House numbers
				paper.text(center_x-inner_radius-inner_thick/2,center_y, idx)
					.attr({fill: inner_text_color, 'font-size': small_gliph, stroke: settings.inner_text_stroke, 'stroke-width': .5})
					.transform("r"+(15+angle)+","+center_x+","+center_y+"r"+(-(15+angle)));


				//house glyph
				var glyph = paper.print(center_x-outer2_radius-radius/10,center_y, astro_glyph('sign',sign_pos), hamburg, big_gliph).transform("r"+(15+angle)+","+center_x+","+center_y+"r-"+(15+angle))
					.attr({fill: color(sign_pos), stroke: settings.outer_text_stroke, 'stroke-width': .5});
				glyph.node.id= "house-"+idx;
				glyph.id= "house-"+idx;
				if(settings.houseHover != null) {
					var bbox = glyph.getBBox();
					var boxw = Math.max(bbox.width, bbox.height);
					glyph = paper.rect(bbox.x+(bbox.x<0?1:-1)*5, bbox.y+(bbox.y<0?1:-1)*5, boxw+5, boxw+5)
						.attr({fill: "white", stroke: 'none', 'fill-opacity':0})
						.hover(
							utils.mkClosure({house: idx, degree: degmin[0], minute: degmin[1], sign: sign_pos, color: color(sign_pos)}, function(hs, evt, el) {settings.houseHover.f_in(hs, evt, el);}),
							utils.mkClosure({house: idx, degree: degmin[0], minute: degmin[1],  sign: sign_pos, color: color(sign_pos)}, function(hs, evt, el) {settings.houseHover.f_out(hs, evt, el);})
						);
					glyph.node.id= "house-hover-"+idx;
					glyph.id= "house-hover-"+idx;
				}

			}
			//Assign planets to houses
			for(i=0; i<longitude.length; i++) {
				if(longitude[i] != undefined) {
					var sign_pos = Math.floor(longitude[i].angle/30)+1;
					longitude[i].house = pos_translate[sign_pos];
				}
			}
		} else {
			console.error("we couldn't find the sun position");
		}
	}


	longitude.sort(function(a, b) {return multiplier*a.angle-multiplier*b.angle;});

	var last_angle = 360;
	var lastArc = true; //true: top, false: bottom
	var lastTopBbox;
	var lastBottomBBox;
	var topArc = outer2_radius-2;
	var bottomArc = (outer2_radius+inner_radius+12)/2;
	var i;
	for(i=0; i<longitude.length; i++) {
		if(longitude[i] != undefined
		   && showPlanet(longitude[i].planet)
		  ) {
			var planetAngle = longitude[i].angle;
			var angle = -(planetAngle-Ascendant);
			if(longitude[i].planet == 15 || longitude[i].planet == 16) {
				angle -= multiplier*3;
			}
			if(south) angle = 180-angle;

			var degmin = degMinute(longitude[i].angle);
			var sign_pos = Math.floor(longitude[i].angle/30)+1;
			longitude[i].degree = degmin[0];
			longitude[i].minute = degmin[1];
			longitude[i].sign = sign_pos;
			longitude[i].sign_color = color(sign_pos);
			longitude[i].retrograde = isRetrograde;
			planets[longitude[i].planet] = longitude[i];

			var isRetrograde = retrogrades != null && retrogrades.substring(longitude[i].planet,longitude[i].planet+1).toUpperCase() === 'R';

			var straight = Ascendant-planetAngle;
			if(south) straight = 180-straight;
			last_angle = angle;

			if(straight < 0) straight = straight+360;

			var arc = topArc;
			//planet
			var glyph = paper.print(center_x-topArc,center_y, astro_glyph('planet',longitude[i].planet), hamburg,big_gliph)
				.attr({fill: text_color})
				.transform("r"+angle+","+center_x+","+center_y+"r-"+(straight));
			//check if we are stepping on something
			var bbox = glyph.getBBox();
			var mvAngle =0;
			if((lastArc && lastTopBbox != undefined && Raphael.isBBoxIntersect(bbox, lastTopBbox))) {
				//there is no space on the top line, so try the bottom arc
				glyph.remove();
				glyph = paper.print(center_x-bottomArc,center_y, astro_glyph('planet',longitude[i].planet), hamburg,big_gliph)
					.attr({fill: text_color})
					.transform("r"+angle+","+center_x+","+center_y+"r-"+(straight));
				bbox = glyph.getBBox();
				if(lastBottomBBox != undefined && Raphael.isBBoxIntersect(bbox, lastBottomBBox)) {
					//bottom arc is used already, we are gone move along the top arc until there is space
					mvAngle = 0;
					do{
						mvAngle+=1;
						glyph.remove();
						if(lastArc) {
							arc = bottomArc;
							//the last we put was at the top, so there will be more place at the bottom
							glyph = paper.print(center_x-bottomArc,center_y, astro_glyph('planet',longitude[i].planet), hamburg,big_gliph)
								.attr({fill: text_color})
								.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
						} else {
							arc = topArc;
							//the last we put was at the top, so there will be more place at the bottom
							glyph = paper.print(center_x-topArc,center_y, astro_glyph('planet',longitude[i].planet), hamburg,big_gliph)
								.attr({fill: text_color})
								.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
						}
						bbox = glyph.getBBox();
					} while((Raphael.isBBoxIntersect(bbox, lastTopBbox) && !lastArc) //we are trying on the top arc
							|| (Raphael.isBBoxIntersect(bbox, lastBottomBBox) && lastArc)); //we are trying on the bottom arc
					if(arc == topArc) {
						lastArc = true;
						lastTopBbox = bbox;
					} else {
						lastArc = false;
						lastBottomBBox = bbox;
					}
				} else {
					lastArc = false;
					arc = bottomArc;
					lastBottomBBox = bbox;
				}
			} else {
				lastTopBbox = bbox;
				lastArc = true;
			}
			glyph.attr({fill: text_color, 'fill-opacity': 100});
			glyph.node.id= "planet-"+longitude[i].planet;
			glyph.id= "planet-"+longitude[i].planet;

			if(settings.planetHover != null) {
				var boxw = Math.max(bbox.width, bbox.height);
				glyph = paper.rect(bbox.x+(bbox.x<0?1:-1)*5, bbox.y+(bbox.y<0?1:-1)*5, boxw+5, boxw+5)
					.attr({fill: "white", stroke: 'none', 'fill-opacity':0})
					.hover(
						utils.mkClosure(longitude[i], function(pl, evt, el) {if(settings.planetHover.f_in != undefined) settings.planetHover.f_in(pl, evt, el);}),
						utils.mkClosure(longitude[i], function(pl, evt, el) {if(settings.planetHover.f_out != undefined) settings.planetHover.f_out(pl, evt, el);})
					);
				glyph.node.id= "planet-hover-"+longitude[i].planet;
				glyph.id= "planet-hover-"+longitude[i].planet;
			}


			//degree
			paper.text(center_x-arc+(big_gliph+mid_gliph/6),center_y, degmin[0]+String.fromCharCode(176))
				.attr({'font-size': tiny_text, fill: text_color})
				.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
			//sign
			paper.print(center_x-arc+(big_gliph+2*small_gliph/3),center_y, astro_glyph('sign',sign_pos), hamburg, small_gliph)
				.attr({fill: color(sign_pos)})
				.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
			//minutes
			paper.text(center_x-arc+(big_gliph+2*small_gliph),center_y, degmin[1]+String.fromCharCode(39))
				.attr({'font-size': tiny_text, fill: text_color})
				.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
			//Rx symbol
			if(isRetrograde) {
				paper.print(center_x-arc+(big_gliph+2*small_gliph+2*tiny_text/3),center_y, String.fromCharCode(62), hamburg, tiny_text)
					.attr({fill: red})
					.transform("r"+(angle+multiplier*mvAngle)+","+center_x+","+center_y+"r-"+(straight));
			}

			//draw lines
			var j;
			for(j=0; j< longitude.length;j++) {
				var q=0;
				if(longitude[i] != undefined && longitude[j] != undefined)
					q =aspect(longitude[i], longitude[j]);

				if (q > 0) {
					var aspect_color;
					if ( q == 3 || q == 6) {
						aspect_color = settings.aspect_blue;
					} else if (q == 1 || q == 4 || q == 2) {
						aspect_color = settings.aspect_red;
					} else if (q == 5) {
						aspect_color = settings.aspect_green;
					}

					if (q != 1 &&
						q!= 5 &&
						showPlanet(longitude[i].planet) &&
						showPlanet(longitude[j].planet) &&
						!isVertex(longitude[i]) &&
						!isVertex(longitude[j]) &&
						!isLilith(longitude[i]) &&
						!isLilith(longitude[j]) &&
						!isPof(longitude[i]) &&
						!isPof(longitude[j])) {
						var otherPlanetAngle = longitude[j].angle;

						x1 = (inner_radius) * Math.cos(utils.deg2rad(multiplier*((south?-180:0)+planetAngle-Ascendant)));
						var y1 = (inner_radius) * Math.sin(utils.deg2rad(multiplier*((south?-180:0)+planetAngle-Ascendant)));
						x2 = (inner_radius) * Math.cos(utils.deg2rad(multiplier*((south?-180:0)+otherPlanetAngle-Ascendant)));
						var y2 = (inner_radius) * Math.sin(utils.deg2rad(multiplier*((south?-180:0)+otherPlanetAngle-Ascendant)));
						var line = utils.drawLine(center_x-x1,center_y+y1,center_x-x2,center_y+y2, paper, aspect_color);

						var len = line.getTotalLength();
						var p1 = line.getPointAtLength((len/2)-tiny_text);
						var p2 = line.getPointAtLength((len/2)+tiny_text);
						var p3 = line.getPointAtLength((len/2));
						var hide = utils.drawLine(p1.x,p1.y,p2.x,p2.y, paper, settings.inner_background_color)
							.attr({'stroke-width': 2});
						glyph = paper.print(p3.x-tiny_text/2,p3.y, astro_glyph('aspect',q), hamburg, tiny_text)
							.attr({fill: aspect_color});

						glyph.node.id="conjunction-glyph"+longitude[i].planet+"t"+longitude[j].planet;
						glyph.id="conjunction-glyph"+longitude[i].planet+"t"+longitude[j].planet;

						hide.node.id="conjunction-hide"+longitude[i].planet+"t"+longitude[j].planet;
						hide.id="conjunction-hide"+longitude[i].planet+"t"+longitude[j].planet;

						line.node.id="conjunction"+longitude[i].planet+"t"+longitude[j].planet;
						line.id="conjunction"+longitude[i].planet+"t"+longitude[j].planet;
						var conj = {planet1: longitude[i].planet, planet2: longitude[j].planet, aspect: q, aspect_color: aspect_color};
						if(settings.conjunctionHover != undefined) {
							line.hover(
								utils.mkClosure(conj, function(pl, evt, t) {settings.conjunctionHover.f_in(pl, evt, t);}),
								utils.mkClosure(conj, function(pl, evt, el) {settings.conjunctionHover.f_out(pl, evt, el);})
							);
						}

						if(conjunctions[longitude[i].planet] == undefined) conjunctions[longitude[i].planet] = [];
						conjunctions[longitude[i].planet][longitude[j].planet] = conj;
					}
				}
			}
		}
	}

	return {paper: paper, conjunctions: conjunctions, planets: planets};

	//////////////////////////////////////////////////////////////////////
	// utils
	//////////////////////////////////////////////////////////////////////

	function isPof(planet) {
		return planet.planet == 13;
	}

	function isLilith(planet) {
		return planet.planet == 11;
	}

	function isVertex(planet) {
		return planet.planet == 14;
	}


	function width(angle1, angle2) {
		return Math.max(angle1, angle2) - Math.min(angle1,angle2);
	}

	function degMinute(angle) {
		var reduced = reduce(angle);
		var deg = Math.floor(reduced);
		var minute = Math.floor(60*(reduced-deg));
		if(deg<10 && deg > 0) deg="0"+deg;
		if(minute<10  && minute > 0) minute= "0"+minute;

		return [deg, minute];
	}

	function displayDegMinute(hc, x, y, angle, i) {
		var degmin = degMinute(hc);
		var deg = degmin[0];
		var minute = degmin[1];
		var dir = 20*radius/300;
		if(i >= 1 && i <= 6) dir *= multiplier*1;
		else dir *= -1*multiplier;
		paper.text(x, y-dir, deg+String.fromCharCode(176))
			.attr({'font-size': small_gliph, fill: outer_text_color})
			.transform("r"+angle+","+center_x+","+center_y+"r-"+(angle));
		paper.text(x,y-(-1*dir), minute+String.fromCharCode(39))
			.attr({'font-size': small_gliph, fill: outer_text_color})
			.transform("r"+angle+","+center_x+","+center_y+"r-"+(angle));
		return degmin;
	}

	function color(pos) {
		if (sign_pos == 1 || sign_pos == 5 || sign_pos == 9) {
			return red;
		} else if (sign_pos == 2 || sign_pos == 6 || sign_pos == 10) {
			return green;
		} else if (sign_pos == 3 || sign_pos == 7 || sign_pos == 11) {
			return orange;
		} else if (sign_pos == 4 || sign_pos == 8 || sign_pos == 12) {
			return blue;
		}
		return "black";
	}

	function reduce(angle) {
		var toRet = angle;
		while(toRet >=30) toRet -= 30;
		return toRet;
	}

	function showPlanet(planet) {
		if((planet == 1) && !showLuna) return false;
		if((planet == 15) && !showAscendant) return false;
		if((planet == 16) && !showMC) return false;
		return true;
	}

};
