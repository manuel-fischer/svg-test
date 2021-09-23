const dbgBorder = true;


function createSvg(width, height)
{
	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", width);
	svg.setAttribute("height", height);

	if(dbgBorder)
		svg.appendChild(createSvgElement("rect", {
			x: 0, y: 0, width, height,
			style: "fill: none; stroke: #888"
		}));
	return svg;
}


function createSvgElement(type, properties)
{
	let el = document.createElementNS("http://www.w3.org/2000/svg", type);
	for (let p in properties)
	{
		if(properties.hasOwnProperty(p))
			el.setAttribute(p, properties[p]);
	}
	return el;
}

/*
svg.setAttribute("width", "20px");
svg.setAttribute("height", "20px");

svg.appendChild(createSvgElement('rect', { width:200, height:20, fill: '#ff0000' }));
svg.appendChild(createSvgElement('polygon', { class: "icon-border", points: "10,10 200,300"}));
*/






class SVGDrawingContext
{
	constructor(svg)
	{
		this.svg = svg;
		this.classname = null;
		this.style = "";
	}

	setClass(classname)
	{
		this.classname = classname;
		this.style = "";
		return this;
	}

	setStyle(style)
	{
		this.classname = "";
		if(typeof style == "string")
			this.style = style;
		else
		{
			this.style = "";
			for (let key in style) {
				if (!style.hasOwnProperty(key)) continue;
				if(this.style) this.style += ";";
				this.style += key + ":" + style[key];
			}
		}
		return this;
	}

	setClassAndStyle(classname, style)
	{
		this.setStyle(style);
		this.classname = classname;
		return this;
	}

	_addElement(el)
	{
		if(this.classname) el.setAttribute("class", this.classname);
		if(this.style)
		{
			el.setAttribute("style", this.style);
		}
		this.svg.appendChild(el);
		return this;
	}

	rect(x, y, width, height)
	{
		let el = createSvgElement('rect', { x, y, width, height });

		this._addElement(el);
		return this;
	}

	circle(cx, cy, r)
	{
		let el = createSvgElement('circle', { cx, cy, r });

		this._addElement(el);
		return this;
	}

	line(x1, y1, x2, y2)
	{
		let el = createSvgElement('line', { x1, y1, x2, y2 });

		this._addElement(el);
		return this;
	}

	_accumulatePoints(points)
	{
		let p = "";
		for(let i = 0; i < points.length; ++i)
		{
			if(p) p += " ";
			p += points[i][0] + "," + points[i][1];
		}
		return p;
	}


	polygon(...points_args)
	{
		let points = this._accumulatePoints(points_args);
		let el = createSvgElement('polygon', { points });

		this._addElement(el);
		return this;
	}
	polyline(...points_args)
	{
		let points = this._accumulatePoints(points_args);
		let el = createSvgElement('polyline', { points });

		this._addElement(el);
		return this;
	}




	beginPath()
	{
		this.path = "";
	}
	_appendPath(s)
	{
		if(this.path) this.path += " ";
		this.path += s;
	}
	moveTo(x, y)
	{
		this._appendPath(`M ${x} ${y}`);
	}
	lineTo(x, y)
	{
		this._appendPath(`L ${x} ${y}`);
	}
	ellipse(x, y, rx, ry, rotation, startAngle, endAngle, /*counterclockwise = false*/)
	{
		//[startAngle, endAngle] = [endAngle, startAngle+Math.PI*2];

		let x0 = x + Math.cos(startAngle)*rx;
		let y0 = y + Math.sin(startAngle)*ry;

		let x1 = x + Math.cos(endAngle)*rx;
		let y1 = y + Math.sin(endAngle)*ry;
		
		/*let longArc = endAngle-startAngle > Math.PI ? 1 : 0;
		this._appendPath(`M ${x0},${y0}`);
		this._appendPath(`A ${rx},${ry} 0 ${longArc} 1 ${x1},${y1}`);*/

		let xm = x + Math.cos((startAngle+endAngle)/2)*rx;
		let ym = y + Math.sin((startAngle+endAngle)/2)*ry;
		let r = rotation * 180/Math.PI;

		this._appendPath(`M ${x0},${y0}`);
		this._appendPath(`A ${rx},${ry} ${r} 0 1 ${xm},${ym}`);
		this._appendPath(`A ${rx},${ry} ${r} 0 1 ${x1},${y1}`);

		//this._appendPath(`L ${x1},${y1}`);
	}
	arc(x, y, radius, startAngle, endAngle, /*counterclockwise = false*/)
	{
		this.ellipse(x, y, radius, radius, 0, startAngle, endAngle);
	}

	closePath()
	{
		this._appendPath("Z");
	}
	endPath()
	{
		let d = this.path;
		delete this.path;
		let el = createSvgElement('path', { d });

		this._addElement(el);
		return this;
	}

}





function drawWindow_org(canvas, dark) {
	let ctx = canvas.getContext("2d");
	ctx.lineWidth = 1;
	ctx.fillStyle = iconColorBack(dark);
	ctx.fillRect(2.5, 2.5, 15, 15);
	ctx.strokeStyle = iconColorBorder(dark);
	ctx.beginPath();
	ctx.rect(2.5, 2.5, 15, 15);
	ctx.fillStyle = iconColorTitle(dark);
	ctx.fillRect(2.5, 2.5, 15, 3);
	ctx.stroke();
};


function iconColorBorder(dark) {
	return dark ? "#fff" : "#000";
}
function iconColorBack(dark) {
	return dark ? "#444" : "#fff";
}
function iconColorTitle(dark) {
	return dark ? "#36f" : "#00c";
}
let dark = false;

let icons = {};
{
	
	icons.window = function (ctx) {
		ctx
			.setClass("icon-panel-back")
			.rect(2.5, 2.5, 15, 15)
			
			.setClass("icon-panel-title")
			.rect(2.5, 2.5, 15, 3)

			.setClass("icon-border")
			.rect(2.5, 2.5, 15, 15);

	};

	icons.dockLeft_size = [18, 18];
	icons.dockLeft = function (ctx) {
		ctx.setStyle("stroke: #666; fill: none");
		ctx.rect(2.5, 2.5, 13, 13);
		
		ctx.setClass("icon-panel-back");
		ctx.rect(2.5, 2.5, 7, 13);

		ctx.setClass("icon-panel-title");
		ctx.rect(2.5, 2.5, 7, 3);

		ctx.setClass("icon-border");
		ctx.rect(2.5, 2.5, 7, 13);
	};

	icons.dockRight_size = [18, 18];
	icons.dockRight = function (ctx) {
		ctx.setStyle("stroke: #666; fill: none");
		ctx.rect(2.5, 2.5, 13, 13);

		ctx.setClass("icon-panel-back");
		ctx.rect(8.5, 2.5, 7, 13);

		ctx.setClass("icon-panel-title");
		ctx.rect(8.5, 2.5, 7, 3);

		ctx.setClass("icon-border");
		ctx.rect(8.5, 2.5, 7, 13);
	};

	icons.maximize_size = [18, 18];
	icons.maximize = function (ctx) {
		ctx.setClass("icon-panel-back");
		ctx.rect(2.5, 2.5, 13, 13);
			
		ctx.setClass("icon-panel-title");
		ctx.rect(2.5, 2.5, 13, 3);

		ctx.setClass("icon-border");
		ctx.rect(2.5, 2.5, 13, 13);
	};

	icons.float_size = [18, 18];
	icons.float = function (ctx) {
		ctx.setStyle("stroke: #666; fill: none");
		ctx.rect(2.5, 2.5, 13, 13);

		ctx.setClass("icon-panel-back");
		ctx.rect(4.5, 5.5, 9, 8);

		ctx.setClass("icon-panel-title");
		ctx.rect(4.5, 5.5, 9, 3);

		ctx.setClass("icon-border");
		ctx.rect(4.5, 5.5, 9, 8);
	};
	
	icons.minimize_size = [18, 18];
	icons.minimize = function (ctx) {
		ctx.setClassAndStyle("icon-border", "stroke-width: 2.5");
		ctx.line(3, 14.5,  15, 14.5);
	};

	icons.help_size = [18, 18];
	icons.help = function (ctx) {
		ctx.setClassAndStyle("icon-border", "stroke-width: 2");

		ctx.beginPath();
		ctx.arc(9, 6, 4, 1 * Math.PI, 2.25 * Math.PI, false);
		ctx.lineTo(9, 11.5);
		ctx.lineTo(9, 13);
		ctx.endPath();

		ctx.beginPath();
		ctx.moveTo(9, 15);
		ctx.lineTo(9, 17);
		ctx.endPath();
	};
	
	icons.close_size = [18, 18];
	icons.close = function (ctx) {
		ctx.setClassAndStyle("icon-border", "stroke-width: 2");
		ctx.line(4,  4,   14, 14);
		ctx.line(4, 14,   14,  4);
	};

	icons.msgBoxQuestion_size = [40, 40];
	icons.msgBoxQuestion = function (ctx) {
		ctx.setStyle("stroke-width: 2; stroke: #04d; fill: #16f");
		ctx.circle(20, 20, 18.5);

		ctx.setStyle("stroke-width: 2; stroke: #fff; fill: none");
		ctx.beginPath();
		ctx.arc(20, 15, 7, 1 * Math.PI, 2.25 * Math.PI, false);
		ctx.lineTo(20, 25);
		ctx.lineTo(20, 28);
		ctx.endPath();

		ctx.line(20, 31, 20, 34);
	};

	
	icons.msgBoxExclamation_size = [40, 40];
	icons.msgBoxExclamation = function (ctx) {


		ctx.setStyle("stroke-width: 2; stroke: #a91; fill: #ec2");
		ctx.polygon(
			[19, 2],
			[21, 2],
			[38, 36],
			[37, 38],
			[3,  38],
			[2,  36]
		);

		ctx.setStyle("stroke-width: 2; stroke: #000; fill: none");
		ctx.line(20, 10,  20, 28);
		ctx.line(20, 31,  20, 34);
	};



	// Ide specific icons

	// Toolbar icons
	// icon parts used several times are written as a function,
	// the 2d context of the canvas is passed as a parameter,
	// resulting in less code

	function draw_icon_paper(ctx) {
		ctx.setStyle("stroke: #333; fill: #fff");
		ctx.polygon([4.5, 7.5],
					[8.5, 3.5],
					[14.5, 3.5],
					[14.5, 16.5],
					[4.5, 16.5]);

		ctx.setStyle("stroke: #333; fill: none");
		ctx.polyline([4.5, 7.5],
					 [8.5, 7.5],
					 [8.5, 3.5]);
	}

	function draw_icon_floppy_disk(ctx) {
		ctx.setStyle("stroke: #139; fill: #36d");
		ctx.polygon([3.5, 3.5],
					[16.5, 3.5],
					[16.5, 16.5],
					[5.5, 16.5],
					[3.5, 14.5]);

		ctx.setStyle("stroke: none; fill: #eef");
		ctx.rect(7, 11, 6, 5);

		ctx.setStyle("stroke: none; fill: #36d");
		ctx.rect(8, 12, 2, 3);

		ctx.setStyle("stroke: none; fill: #fff");
		ctx.rect(6, 4, 8, 5);
	}

	function draw_icon_pencil_overlay(ctx) {
		// draw pencil
		// shadow
		ctx.setStyle("stroke-width: 3; stroke: #0005; fill: none");
		ctx.line(8, 8, 8 + 10, 8 + 10);

		ctx.setStyle("stroke: none; fill: #fc9");
		ctx.polygon(
			[8, 6],
			[11, 7],
			[9, 9]
		);

		ctx.setStyle("stroke: none; fill: #000");
		ctx.polygon(
			[8, 6],
			[9.5, 6.5],
			[8.5, 7.5]
		);

		ctx.setStyle("stroke-width: 3; stroke: #000; fill: none");
		ctx.line(10, 8, 18, 16);

		ctx.setStyle("stroke-width: 2; stroke: #dd0; fill: none");
		ctx.line(10, 8, 18, 16);

		ctx.setStyle("stroke: none; fill: #000");
		ctx.polygon(
			[8, 6],
			[9.5, 6.5],
			[8.5, 7.5]
		);
		ctx.beginPath();
		ctx.arc(18, 16, 1.5, 1.75 * Math.PI, 2.75 * Math.PI);
		ctx.endPath();

		ctx.setStyle("stroke: none; fill: #f33");
		ctx.circle(18, 16, 1);
	}

	icons.newDocument = function (ctx) {
		draw_icon_paper(ctx);

		ctx.setStyle("stroke: #030; fill: #0a0");
		ctx.circle(14, 14, 4.75, 0, 2 * Math.PI);

		ctx.setStyle("stroke-width: 2; stroke: #fff; fill: none");
		ctx.line(14, 17, 14, 11);
		ctx.line(11, 14, 17, 14);
	};

	icons.openDocument = function (ctx) {
		ctx.setStyle("fill: #ec5; stroke: #330");
		ctx.polygon(
			[2.5, 4.5],
			[7.5, 4.5],
			[9.5, 6.5],
			[15.5, 6.5],
			[15.5, 15.5],
			[2.5, 15.5]
		);

		ctx.setStyle("fill: #fd6; stroke: #330");

		ctx.polygon(
			[5.5, 8.5],
			[17.5, 8.5],
			[15.5, 15.5],
			[3.5, 15.5]
		);
	};

	icons.saveDocument = function (ctx) {
		draw_icon_floppy_disk(ctx);
	};

	icons.saveDocumentAs = function (ctx) {
		draw_icon_floppy_disk(ctx);
		draw_icon_pencil_overlay(ctx);
	};
		
	icons.run = function (ctx) {
		ctx.setClass("icon-green-fill");
		ctx.polygon(
			[5, 5],
			[15, 10],
			[5, 15]
		);
	};

	icons.interrupt = function (ctx) {
		ctx.setClass("icon-red-fill");
		ctx.rect(5, 5, 4, 10);
		ctx.rect(11, 5, 4, 10);
	};

	icons.reset = function (ctx) {
		ctx.setClass("icon-red-fill");
		ctx.rect(5, 5, 10, 10);
	};

	
	icons.stepInto = function (ctx) {
		ctx.setClass("icon-neutral-fill");
		ctx.rect(10, 3, 7, 2);
		ctx.rect(13, 6, 4, 2);
		ctx.rect(13, 9, 4, 2);
		ctx.rect(13, 12, 4, 2);
		ctx.rect(10, 15, 7, 2);
		
		ctx.setClass("icon-blue-line");
		ctx.polyline(
			[8, 4],
			[3, 4],
			[3, 10],
			[6, 10]
		);
		
		ctx.setClass("icon-blue-fill");
		ctx.polygon(
			[5, 7],
			[5, 13],
			[9.5, 10]
		);
	};
	
	icons.stepOver = function (ctx) {
		ctx.setClass("icon-neutral-fill");
		ctx.rect(10, 3, 7, 2);
		ctx.rect(13, 6, 4, 2);
		ctx.rect(13, 9, 4, 2);
		ctx.rect(13, 12, 4, 2);
		ctx.rect(10, 15, 7, 2);

		ctx.setClass("icon-blue-line");
		ctx.polyline(
			[8, 4],
			[3, 4],
			[3, 16],
			[6, 16]
		);
		
		ctx.setClass("icon-blue-fill");
		ctx.polygon(
			[5, 13],
			[5, 19],
			[9.5, 16]
		);
	};

	
	icons.stepOut = function (ctx) {
		ctx.setClass("icon-neutral-fill");
		ctx.rect(10, 3, 7, 2);
		ctx.rect(13, 6, 4, 2);
		ctx.rect(13, 9, 4, 2);
		ctx.rect(13, 12, 4, 2);
		ctx.rect(10, 15, 7, 2);
		
		ctx.setClass("icon-blue-line");
		ctx.polyline(
			[11, 10],
			[3, 10],
			[3, 16],
			[6, 16]
		);
		
		ctx.setClass("icon-blue-fill");
		ctx.polygon(
			[5, 13],
			[5, 19],
			[9.5, 16]
		);
	};

	icons.breakPoint = function (ctx) {
		ctx.setClass("icon-red-fill");
		ctx.circle(10, 10, 3.9);
	};

	icons.search = function(ctx) {
		ctx.setClassAndStyle("icon-neutral-line", "stroke-width: 1.5");
		ctx.beginPath();
		ctx.arc(8, 8, 5, 0.25*Math.PI, 2.25*Math.PI, false); // starting/ending point at 45 degrees south-east
		ctx.lineTo(17, 17);
		ctx.endPath();
	};

	icons.export = function (ctx) {
		ctx.setClass("icon-green-frame");
		ctx.polygon(
			[3, 7],
			[10, 7],
			[10, 3],
			[17, 10],
			[10, 17],
			[10, 13],
			[3, 13],
		);
	};

	icons.config = function (ctx) {
		ctx.setClass("icon-neutral-fill");
		ctx.circle(10, 10, 2.0);

		ctx.setClassAndStyle("icon-neutral-line", "stroke-width: 2");
		ctx.circle(10, 10, 5.7);

		for (let i = 0; i < 12; i++) {
			let a = ((i + 0.5) * Math.PI) / 6;
			ctx.line(10 + 6.0 * Math.cos(a), 10 + 6.0 * Math.sin(a),
					 10 + 9.4 * Math.cos(a), 10 + 9.4 * Math.sin(a));
		}
	};

	icons.restorePanels = function (ctx) {
		ctx.setStyle("stroke: #aaa; fill: #fff");
		ctx.rect(2.5, 2.5, 15, 15);

		ctx.setStyle("stroke: none; fill: #ccc");
		ctx.rect(11, 3, 1, 14);

		ctx.setStyle("stroke: none; fill: #77f");
		ctx.rect(3, 3, 14, 1);
		ctx.rect(3, 12, 8, 1);

		ctx.setStyle("stroke: #222; stroke-width: 1.7; fill: none");
		ctx.beginPath();
		ctx.arc(9.5, 10.5, 4, 1.25 * Math.PI, 2.6 * Math.PI);
		ctx.endPath();

		ctx.setStyle("stroke: none; fill: #222");
		ctx.polygon(
			[5, 5],
			[5, 10],
			[10, 10]
		);
	};

	// Panel icons
	icons.editor = function (ctx) {
		draw_icon_paper(ctx);

		ctx.setStyle("stroke: none; fill: #777");
		ctx.rect(10, 5, 3, 1);
		ctx.rect(10, 7, 2, 1);
		ctx.rect(7, 9, 4, 1);
		ctx.rect(6, 11, 7, 1);
		ctx.rect(9, 13, 4, 1);
	};
	
	icons.messages = function (ctx) {
		ctx.setStyle("stroke: #222; fill: #fff");
		ctx.beginPath();
		ctx.ellipse(9.5, 8.5, 7, 6, 0, 0.73 * Math.PI, 2.57 * Math.PI);
		ctx.lineTo(4.5, 17);
		ctx.closePath();
		ctx.endPath();

		ctx.setStyle("stroke: none; fill: #777");
		ctx.rect(8, 6, 3, 1);
		ctx.rect(6, 8, 2, 1);
		ctx.rect(9, 8, 5, 1);
		ctx.rect(7, 10, 4, 1);
	};
	
	icons.stackView = function (ctx) {
		// white top
		ctx.setStyle("stroke: none; fill: #fff");
		ctx.polygon(
			[4, 5.5],
			[10, 8.5],
			[16, 5.5],
			[10, 2.5]
		);

		// shaded lower pages
		ctx.setStyle("stroke: none; fill: #bbb");
		ctx.polygon(
			[4, 5.5],
			[4, 14.5],
			[10, 17.5],
			[10, 8.5]
		);

		ctx.setStyle("stroke: none; fill: #999");
		ctx.fillStyle = "#999";
		ctx.polygon(
			[10, 17.5],
			[16, 14.5],
			[16, 5.5],
			[10, 8.5]
		);

		ctx.setStyle("stroke-width: 0.6; stroke: #222; fill: none");
		for (let i = 8; i < 17; i += 3) {
			ctx.polyline(
				[3, i + 0.5],
				[10, i + 3.5],
				[17, i + 0.5]
			);
		}

		// top frame
		ctx.polygon(
			[3.5, 5.3],
			[3.5, 5.7],
			[10, 8.5],
			[16.5, 5.7],
			[16.5, 5.3],
			[10, 2.5]
		);
	};

	icons.programView = function (ctx) {
		// Outline
		ctx.setStyle("stroke:none; fill: #eeeeeec0");
		ctx.polygon(
			[3, 2],
			[13, 2],
			[13, 5],
			[15, 5],
			[15, 8],
			[17, 8],
			[17, 12],
			[13, 12],
			[13, 14],
			[15, 14],
			[15, 18],
			[5, 18],
			[5, 15],
			[3, 15],
			[3, 11],
			[7, 11],
			[7, 9],
			[5, 9],
			[5, 6],
			[3, 6]
		);

		// Black boxes
		ctx.setStyle("stroke:none; fill: #000");
		ctx.rect(4, 3, 8, 2);
		ctx.rect(6, 6, 8, 2);
		ctx.rect(8, 9, 8, 2);
		ctx.rect(4, 12, 8, 2);
		ctx.rect(6, 15, 8, 2);
	};
	
	icons.canvas = function (ctx) {
		ctx.setStyle("stroke: none; fill: #333");
		ctx.rect(3, 2, 14, 16);

		ctx.setStyle("stroke: none; fill: #fff");
		ctx.rect(4, 3, 12, 14);

		ctx.setStyle("stroke: #00cc; fill: #00c8");
		ctx.rect(5.5, 5.5, 6, 6);
		
		ctx.setStyle("stroke: #c00c; fill: #c008");
		ctx.circle(11, 11, 3.5);
	};

	icons.tutorial = function (ctx) {
		ctx.setStyle("stroke-width: 3; stroke: #666; fill: none");

		ctx.beginPath();
		ctx.moveTo(5.0, 20);
		ctx.lineTo(9.0, 2);
		ctx.lineTo(11.0, 2);
		ctx.lineTo(15.0, 20);
		ctx.endPath();

		ctx.setStyle("stroke-width: 2; stroke: #db7; fill: none");
		ctx.polyline(
			[5, 20],
			[9, 2],
			[11, 2],
			[15, 20]
		);

		ctx.setStyle("stroke: none; fill: #666");
		ctx.rect(1.5, 2.5, 17, 12);
		
		ctx.setStyle("stroke: none; fill: #db7");
		ctx.rect(2, 3, 16, 11);

		ctx.setStyle("stroke: none; fill: #000");
		ctx.rect(3, 4, 14, 9);

		ctx.setStyle("stroke: #fff; fill: none");
		ctx.polyline(
			[5, 6],
			[7, 8],
			[5, 10]
		);
	};
}



for(let dfunc in icons)
{
	if(!icons.hasOwnProperty(dfunc)) continue;
	if(typeof icons[dfunc] != "function") continue;

	let svg;
	if(icons.hasOwnProperty(dfunc + "_size"))
		svg = createSvg(...icons[dfunc + "_size"]);
	else
		svg = createSvg("20px", "20px");
	icons[dfunc](new SVGDrawingContext(svg));
	document.body.appendChild(svg);
}







function toggleDarktheme()
{
	document.body.classList.toggle("dark-theme");
}