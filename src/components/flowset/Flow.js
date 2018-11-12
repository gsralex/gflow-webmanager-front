import React, { Component } from 'react';
import SVG from 'svg.js';

class Flow extends Component {

    div;
    ns = 'http://www.w3.org/2000/svg';
    edit = false;
    mouseDown = false;
    action = null;
    x = 0;
    y = 0;
    offsetX = 0;
    offsetY = 0;
    componentDidMount() {
        this.div = document.getElementById('svg2');
        this.createStart();
        this.props.onRef(this);
        this.edit = this.props.edit;
        document.addEventListener('mouseup', this.pageMouseUp.bind(this));
        document.addEventListener('mousemove', this.pageMouseMove.bind(this));
    }



    createAction(x, y, name, className) {
        var action = document.createElementNS(this.ns, 'rect');
        action.setAttributeNS(null, 'width', "130px");
        action.setAttributeNS(null, 'height', "50px");
        action.setAttributeNS(null, "x", x - 419);
        action.setAttributeNS(null, "y", y - 155);
        action.setAttributeNS(null, "style", "fill:gray;stroke:gray;stroke-width:2;opacity:0.5");
        this.div.appendChild(action);
        SVG.on(action, 'mousedown', (e) => {
            if (e.button == 0) {
                this.mouseDown = true;
                this.action = action;
                this.x = e.pageX;
                this.y = e.pageY;
                this.offsetX = parseInt(action.getAttributeNS(null, "x"));
                this.offsetY = parseInt(action.getAttributeNS(null, "y"));
            }
        })
    }


    pageMouseMove(e) {
        if (this.mouseDown) {
            var x = e.pageX - this.x;
            var y = e.pageY - this.y;
            this.action.setAttributeNS(null, "x", this.offsetX + x);
            this.action.setAttributeNS(null, "y", this.offsetY + y);
        }
    }

    pageMouseUp(e) {
        this.mouseDown = false;
    }

    createHelper(x, y) {
        var helper = document.createElementNS(this.ns, 'rect');
        var width = 20;
        var height = 10;
        helper.setAttributeNS(null, 'width', width);
        helper.setAttributeNS(null, 'height', height);
        helper.setAttributeNS(null, "x", x - (width / 2));
        helper.setAttributeNS(null, "y", y + height / 2);
        helper.setAttributeNS(null, "style", "fill:gray;stroke:gray;stroke-width:2;opacity:0.5");
        this.div.appendChild(helper);
        SVG.on(helper, 'click', (e) => {
            alert(1);
        })
    }

    createStart() {
        var midX = this.div.clientWidth / 2;
        var midY = 20;
        var start = document.createElementNS(this.ns, 'circle');
        start.setAttributeNS(null, 'width', 100);
        start.setAttributeNS(null, 'height', 100);
        start.setAttributeNS(null, 'fill', '#90EE90');
        start.setAttributeNS(null, "r", 10);
        start.setAttributeNS(null, "cx", midX);
        start.setAttributeNS(null, "cy", midY);
        start.setAttributeNS(null, "stroke", "black");
        start.setAttributeNS(null, "stroke-width", "1");
        this.div.appendChild(start);
        this.createHelper(midX, midY);
    }

    render() {
        return (
            <svg id="svg2" style={{ width: '100%', height: '100%', 'user-select': 'none' }}>

            </svg>
        );
    }
}

export default Flow;