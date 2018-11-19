import React, { Component } from 'react';
import SVG from 'svg.js';
import Action from './Action';
import Line from './Line';
import PosUtils from './PosUtils';
import ActionType from './ActionType';
import styles from './index.css';
import ActionPo from './ActionPo';

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
            if (this.moveAction.type == ActionType.Action) {
                this.moveAction.svg.setAttributeNS(null, "x", this.nodeX + x);
                this.moveAction.svg.setAttributeNS(null, "y", this.nodeY + y);
            } else {
                this.moveAction.svg.setAttributeNS(null, "cx", this.nodeX + x);
                this.moveAction.svg.setAttributeNS(null, "cy", this.nodeY + y);
            }
            this.moveAction.svgHelper.setAttributeNS(null, "x", this.helperX + x);
            this.moveAction.svgHelper.setAttributeNS(null, "y", this.helperY + y);
            this.moveAction.x = this.nodeX + x;
            this.moveAction.y = this.nodeY + y;
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
    }

    actionMouseMove(x, y) {
        this.actionMap.forEach((value, key, mapObj) => {
            if (x >= value.x && x <= value.x + value.width
                && y >= value.y && y <= value.y + value.height) {
                // value.svg.setAttributeNS(null, "class", "flow-action flow-action-selected");
                this.line.nextAction = value;
                return;
            } else {
                // value.svg.setAttributeNS(null, "class", "flow-action");
                this.line.nextAction = null;
            }
        })
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
        var node = action.svg;
        SVG.on(node, 'mousedown', (e) => {
            if (e.button == 0) {
                this.nodeSelected = true;
                this.moveAction = this.getActionByNode(node);
                this.clickX = e.pageX;
                this.clickY = e.pageY;
                if (this.moveAction.type == ActionType.Action) {
                    this.nodeX = parseInt(this.moveAction.svg.getAttributeNS(null, "x"));
                    this.nodeY = parseInt(this.moveAction.svg.getAttributeNS(null, "y"));
                    this.helperX = parseInt(this.moveAction.svgHelper.getAttributeNS(null, "x"));
                    this.helperY = parseInt(this.moveAction.svgHelper.getAttributeNS(null, "y"));
                } else {
                    this.nodeX = parseInt(this.moveAction.svg.getAttributeNS(null, "cx"));
                    this.nodeY = parseInt(this.moveAction.svg.getAttributeNS(null, "cy"));
                    this.helperX = parseInt(this.moveAction.svgHelper.getAttributeNS(null, "x"));
                    this.helperY = parseInt(this.moveAction.svgHelper.getAttributeNS(null, "y"));
                }
                // console.log("node",this.nodeX, this.nodeY);
                // console.log("helper",this.helperX,this.helperY);
                this.saveFlow();
            }
        });

        SVG.on(node, 'mousemove', (e) => {
            if (this.lineSelected) {
                // var index = node.getAttributeNS(null, "index");
                // var action = this.actionMap.get(index);
                // action.svg.setAttributeNS(null, "style", "fill:red");
                // this.line.nextAction = action;
            }
        });

        SVG.on(node, 'mouseout', (e) => {
            if (this.lineSelected) {
                // var index = node.getAttributeNS(null, "index");
                // var action = this.actionMap.get(index);
                // action.svg.setAttributeNS(null, "style", "fill:gray");
                // this.line.nextAction = null;
            }
        });
    }

    saveFlow() {
        var list = [];
        this.actionMap.forEach((value, key, mapObj) => {
            console.log("va", value);
            value.next.forEach((item, index, arr) => {
                var po = new ActionPo(value.index, value.actionId, item.index,item.actionId);
                list.push(po);
            });
        });

        list.forEach((value, index, arr) => {
            console.log("value", value);
        });

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
        var startSvg = document.createElementNS(this.ns, 'circle');
        startSvg.setAttributeNS(null, 'width', width);
        startSvg.setAttributeNS(null, 'height', height);
        startSvg.setAttributeNS(null, 'class', 'flow-start');
        startSvg.setAttributeNS(null, "r", 10);
        startSvg.setAttributeNS(null, "cx", x);
        startSvg.setAttributeNS(null, "cy", y);
        startSvg.setAttributeNS(null, "index", this.currentIndex);
        this.start.svg = startSvg;
        this.append(startSvg);
        this.start.svgHelper = this.createHelper(this.start);
        console.log("start", this.start);
        this.saveMap(this.currentIndex, this.start);
        this.bindMoveEvent(this.start);
        this.currentIndex++;
    }

    //创建action
    createAction(x, y, actionId, name, className) {
        x -= this.selfRect.x;
        y -= this.selfRect.y;
        var action = new Action(ActionType.Action, this.currentIndex, actionId, x, y, 130, 50);
        var actionSvg = document.createElementNS(this.ns, 'rect');
        actionSvg.setAttributeNS(null, 'width', action.width);
        actionSvg.setAttributeNS(null, 'height', action.height);
        actionSvg.setAttributeNS(null, "x", action.x);
        actionSvg.setAttributeNS(null, "y", action.y);
        actionSvg.setAttributeNS(null, "rx", 5);
        actionSvg.setAttributeNS(null, "ry", 5);
        actionSvg.setAttributeNS(null, "class", "flow-action");
        actionSvg.setAttributeNS(null, "index", this.currentIndex);
        this.append(actionSvg);
        action.svg = actionSvg;
        this.bindMoveEvent(action);
        action.svgHelper = this.createHelper(action);
        this.saveMap(this.currentIndex, action);
        this.currentIndex++;
    }

    getActionByNode(node) {
        var index = node.getAttributeNS(null, "index");
        return this.getMap(index);
    }


    createHelper(action) {
        var helper = document.createElementNS(this.ns, 'rect');
        var width = 20;
        var height = 10;
        helper.setAttributeNS(null, 'width', width);
        helper.setAttributeNS(null, 'height', height);
        console.log("action", action);
        var downXy = PosUtils.getActionDownPos(action);
        helper.setAttributeNS(null, "x", downXy.x - width / 2);
        helper.setAttributeNS(null, "y", downXy.y + 2);
        helper.setAttributeNS(null, "class", "flow-helper");
        helper.setAttributeNS(null, "index", action.index);
        this.append(helper);
        this.bindHelperEvent(helper);
        return helper;
    }

    bindHelperEvent(helper) {
        SVG.on(helper, 'mousedown', (e) => {
            if (e.button == 0) {
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