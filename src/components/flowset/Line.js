import SVG from 'svg.js';

export default class Line {

    ns = 'http://www.w3.org/2000/svg';
    x = 0;
    y = 0;
    x1=0;
    y1=0;
    svg = null;
    preAction = null;
    nextAction = null;
    constructor(x, y,x1,y1) {
        this.x = x;
        this.y = y;
        this.x1=x1;
        this.y1=y1;
    }

    createSvg(){
        var lineSvg = document.createElementNS(this.ns, "line");
        lineSvg.setAttributeNS(null, "class", "flow-line");
        lineSvg.setAttributeNS(null, "x1", this.x);
        lineSvg.setAttributeNS(null, "y1", this.y);
        lineSvg.setAttributeNS(null, "x2", this.x1);
        lineSvg.setAttributeNS(null, "y2", this.y1);

        SVG.on(lineSvg, 'mousedown', (e) => {
            if (e.button == 0) {
                console.log("lineclick")
            }
        });
        this.svg=lineSvg;
        return lineSvg;
    }
}