/*export*/ function createSvg(width, height)
{
	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", width);
	svg.setAttribute("height", height);
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


/*export*/ class SVGDrawingContext
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
	// the following methods should be called between beginPath and endPath

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