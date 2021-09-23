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
	/*icons.help = function (canvas, dark) {
		let ctx = canvas.getContext("2d");
		ctx.lineWidth = 2;
		ctx.strokeStyle = iconColorBorder(dark);
		ctx.beginPath();
		ctx.arc(9, 6, 4, 1 * Math.PI, 2.25 * Math.PI, false);
		ctx.lineTo(9, 11.5);
		ctx.lineTo(9, 13);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(9, 15);
		ctx.lineTo(9, 17);
		ctx.stroke();
	};*/
    
    icons.close_size = [18, 18];
	icons.close = function (ctx) {
        ctx.setClassAndStyle("icon-border", "stroke-width: 2");
        ctx.line(4,  4,   14, 14);
        ctx.line(4, 14,   14,  4);
	};

    /*icons.msgBoxQuestion_size = [40, 40];
	icons.msgBoxQuestion = function (ctx) {
		let ctx = canvas.getContext("2d");
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#04d";
		ctx.fillStyle = "#16f";
		ctx.beginPath();
		ctx.arc(20, 20, 18.5, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.arc(20, 15, 7, 1 * Math.PI, 2.25 * Math.PI, false);
		ctx.lineTo(20, 25);

		ctx.lineTo(20, 28);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(20, 31);
		ctx.lineTo(20, 34);
		ctx.stroke();
	};*/

    
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

    //...

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

    // ...

    
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