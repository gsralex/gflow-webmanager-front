import React, { Component } from 'react';
import SVG from 'svg.js';
import Action from './Action';
import Line from './Line';
import PosUtils from './PosUtils';
import ActionType from './ActionType';
import styles from './index.css';
import ActionPo from './ActionPo';

let helperW = 30;
var helperH = 10;

class Flow extends Component {
    ns = 'http://www.w3.org/2000/svg';
    div;
    edit = false;
    nodeSelected = false;
    lineSelected = false;
    moveAction = null;
    clickX = 0;
    clickY = 0;
    lineX = 0;
    lineY = 0;
    nodeX = 0;
    nodeY = 0;
    helperX = 0;
    helperY = 0;
    actionMap = new Map();
    lineMap = new Map();
    //当前页面的页面大小
    currentIndex = 0;
    //辅助连接线
    line = null;
    //辅助线连接的action
    selfRect;
    start = null;
    componentDidMount() {
        this.div = document.getElementById('svg2');
        this.selfRect = this.div.getBoundingClientRect();
        this.createStart();
        this.props.onRef(this);
        this.edit = this.props.edit;
        document.addEventListener('mouseup', this.pageMouseUp.bind(this));
        document.addEventListener('mousemove', this.pageMouseMove.bind(this));
    }



    pageMouseMove(e) {
        if (this.nodeSelected) {
            var x = e.pageX - this.clickX;
            var y = e.pageY - this.clickY;
            var moveX = this.moveAction.startX + x;
            var moveY = this.moveAction.startY + y;
            this.moveAction.svgG.setAttributeNS(null, "transform", "translate(" + moveX + "," + moveY + ")");
            this.moveAction.x = moveX;
            this.moveAction.y = moveY;

            // this.moveAction.svgHelper.setAttributeNS(null, "x", this.helperX + x);
            // this.moveAction.svgHelper.setAttributeNS(null, "y", this.helperY + y);
            var upXy = PosUtils.getActionUpPos(this.moveAction);
            this.moveAction.pre.forEach((item) => {
                var key = item.index + "_" + this.moveAction.index;
                var line = this.lineMap.get(key);
                if (line != null) {
                    line.svg.setAttributeNS(null, "x2", upXy.x);
                    line.svg.setAttributeNS(null, "y2", upXy.y);
                }
            })
            var downXy = PosUtils.getHelperPointPos(this.moveAction);
            this.moveAction.next.forEach((item) => {
                var key = this.moveAction.index + "_" + item.index;
                var line = this.lineMap.get(key);
                if (line != null) {
                    line.svg.setAttributeNS(null, "x1", downXy.x);
                    line.svg.setAttributeNS(null, "y1", downXy.y);
                }
            })
        }

        if (this.lineSelected) {
            var x = e.pageX - this.lineX;
            var y = e.pageY - this.lineY;
            this.line.svg.setAttributeNS(null, "x2", this.line.x + x);
            this.line.svg.setAttributeNS(null, "y2", this.line.y + y);
            var xy = this.convertPageXy(e.pageX, e.pageY);
            this.actionMouseMove(xy.x, xy.y);
        }
        e.stopPropagation();
    }

    actionMouseMove(x, y) {
        var hit = false;
        this.actionMap.forEach((value, key, mapObj) => {
            if (x >= value.x && x <= value.x + value.width
                && y >= value.y && y <= value.y + value.height) {
                // value.svg.setAttributeNS(null, "class", "flow-action flow-action-selected");
                this.line.nextAction = value;
                hit = true;
                return;
            }
        })
        if (!hit) {
            this.line.nextAction = null;
        }
    }

    pageMouseUp(e) {
        if (this.lineSelected) {
            console.log(this.line);
            if (this.line.nextAction != null) {
                //判断是否已经加入了连接
                console.log(this.line.preAction, this.line.nextAction);
                if (!this.line.preAction.hasNext(this.line.nextAction)) {
                    console.log("lined");
                    var xy = PosUtils.getActionUpPos(this.line.nextAction);
                    this.line.svg.setAttributeNS(null, "x2", xy.x);
                    this.line.svg.setAttributeNS(null, "y2", xy.y);
                    console.log(this.line);
                    this.line.preAction.appendNext(this.line.nextAction);
                    this.line.nextAction.appendPre(this.line.preAction);
                    this.lineMap.set(this.line.preAction.index + "_" +
                        this.line.nextAction.index, this.line);
                    console.log(this.lineMap);
                } else {
                    this.clearLine();
                }
            } else {
                this.clearLine();
            }
        }

        this.nodeSelected = false;
        this.lineSelected = false;
    }

    clearLine() {
        this.div.removeChild(this.line.svg);
        this.line = null;
    }


    bindMoveEvent(action) {
        var node = action.svgG;
        SVG.on(node, 'mousedown', (e) => {
            if (e.button != 0) {
                return;
            }
            this.nodeSelected = true;
            this.moveAction = this.getActionByNode(node);
            this.clickX = e.pageX;
            this.clickY = e.pageY;
            this.moveAction.startX = this.moveAction.x;
            this.moveAction.startY = this.moveAction.y;
        });

    }


    getFlowMap() {
        var list = [];
        this.actionMap.forEach((value, key, mapObj) => {
            var actionPo = new ActionPo(value.index, value.actionId);
            value.next.forEach((item, index) => {
                actionPo.next.push(item.index);
            })
            list.push(actionPo);
        })
        return list;
    }

    convertPageXy(x, y) {
        return { x: x - this.selfRect.x, y: y - this.selfRect.y };
    }

    saveMap(index, action) {
        this.actionMap.set(index.toString(), action);
    }

    getMap(index) {
        return this.actionMap.get(index);
    }

    append(svg) {
        this.div.appendChild(svg);
    }


    createStart() {
        var width = 20;
        var height = 20;
        var x = this.selfRect.width / 2 - width / 2;
        var y = 20;
        this.start = new Action(ActionType.Start, this.currentIndex, 0, x, y, width, height);
        var gSvg = document.createElementNS(this.ns, "g");
        this.start.svgG = gSvg;
        this.append(gSvg);
        gSvg.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
        gSvg.setAttributeNS(null, "index", this.currentIndex);
        var svg = document.createElementNS(this.ns, 'circle');
        gSvg.append(svg);
        this.start.svg = svg;
        svg.setAttributeNS(null, 'width', width);
        svg.setAttributeNS(null, 'height', height);
        svg.setAttributeNS(null, 'class', 'flow-start');
        svg.setAttributeNS(null, "r", width/2);
        svg.setAttributeNS(null, "cx", 0);
        svg.setAttributeNS(null, "cy", 0);
        svg.setAttributeNS(null, "index", this.currentIndex);

        this.start.svg = svg;
        var hx=-helperW/2;
        var hy=helperH+2;
        var hSvg = this.createHelper(this.start,hx,hy);
        gSvg.append(hSvg);
        this.saveMap(this.currentIndex, this.start);
        this.bindMoveEvent(this.start);
        this.currentIndex++;
    }

    //创建action
    createAction(x, y, actionId, name, className) {
        x -= this.selfRect.x;
        y -= this.selfRect.y;
        var action = new Action(ActionType.Action, this.currentIndex, actionId, x, y);

        var gSvg = document.createElementNS(this.ns, "g");
        action.svgG = gSvg;
        this.append(gSvg);
        gSvg.setAttributeNS(null, "index", this.currentIndex);
        gSvg.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
        var svg = document.createElementNS(this.ns, "rect");
        svg.setAttributeNS(null, 'width', action.width);
        svg.setAttributeNS(null, 'height', action.height);
        svg.setAttributeNS(null, "x", 0);
        svg.setAttributeNS(null, "y", 0);
        svg.setAttributeNS(null, "rx", 5);
        svg.setAttributeNS(null, "ry", 5);
        svg.setAttributeNS(null, "class", "flow-action");
        svg.setAttributeNS(null, "index", this.currentIndex);
        gSvg.append(svg);
        action.svg = svg;
        this.bindMoveEvent(action);

        var t = document.createElementNS(this.ns, "text");
        gSvg.append(t);
        t.setAttributeNS(null, "x", 65);
        t.setAttributeNS(null, "y", 25);
        t.setAttributeNS(null, "class", "flow-action-text");
        var tSpan = document.createElementNS(this.ns, "tspan");
        t.append(tSpan);
        tSpan.innerHTML = name;


        //创建helper
        var hx=action.width/2-helperW/2;
        var hy=action.height+2;
        var hSvg = this.createHelper(action,hx,hy);
        action.svgHelper = hSvg;
        gSvg.append(hSvg);
        this.saveMap(this.currentIndex, action);
        this.currentIndex++;
    }

    getActionByNode(node) {
        var index = node.getAttributeNS(null, "index");
        return this.getMap(index);
    }


    createHelper(action,x,y) {
        var helper = document.createElementNS(this.ns, 'rect');
        helper.setAttributeNS(null, 'width', helperW);
        helper.setAttributeNS(null, 'height', helperH);
        console.log("action", action);
        var downXy = PosUtils.getActionDownPos(action);
        helper.setAttributeNS(null, "x", x);
        helper.setAttributeNS(null, "y", y);
        helper.setAttributeNS(null, "class", "flow-helper");
        helper.setAttributeNS(null, "index", action.index);
        this.bindHelperEvent(helper);
        return helper;
    }

    bindHelperEvent(helper) {
        SVG.on(helper, 'mousedown', (e) => {
            if (e.button == 0) {
                console.log("2");
                this.lineSelected = true;
                var action = this.getActionByNode(helper);
                if (action == null) {
                    return;
                }
                var xy = PosUtils.getHelperPointPos(action);
                this.line = new Line(xy.x, xy.y);
                var lineSvg = document.createElementNS(this.ns, "line");
                lineSvg.setAttributeNS(null, "class", "flow-line");
                lineSvg.setAttributeNS(null, "x1", this.line.x);
                lineSvg.setAttributeNS(null, "y1", this.line.y);
                lineSvg.setAttributeNS(null, "x2", this.line.x);
                lineSvg.setAttributeNS(null, "y2", this.line.y);
                this.line.svg = lineSvg;
                this.line.preAction = action;
                this.lineX = e.pageX;
                this.lineY = e.pageY;
                this.append(lineSvg);
            }
            e.stopPropagation();
        });
    }



    render() {
        return (
            <svg id="svg2" style={{ width: '100%', height: '100%', 'user-select': 'none' }}>

            </svg>
        );
    }
}

export default Flow;