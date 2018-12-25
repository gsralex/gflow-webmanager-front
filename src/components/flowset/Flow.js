import React, { Component } from 'react';
import SVG from 'svg.js';
import Action from './Action';
import Line from './Line';
import PosUtils from './PosUtils';
import ActionType from './ActionType';
import styles from './index.css';
import ActionPo from './ActionPo';
import { timingSafeEqual } from 'crypto';
import RectContants from '../../constant/RectContants';

class Flow extends Component {
    ns = 'http://www.w3.org/2000/svg';
    div;
    edit = false;
    nodeSelected = false;
    lineSelected = false;
    moveAction = null;
    actionMap = new Map();
    lineMap = new Map();
    //当前页面的页面大小
    currentIndex = 0;
    //辅助连接线
    line = null;
    //辅助线连接的action
    selfRect;
    start = null;
    flowGroup = null;
    componentDidMount() {
        this.div = document.getElementById('svg2');
        var divWrap = document.getElementById("div-wrap");
        this.selfRect = divWrap.getBoundingClientRect();
        this.createStart();
        this.props.onRef(this);
        this.edit = this.props.edit;
        document.addEventListener('mouseup', this.pageMouseUp.bind(this));
        document.addEventListener('mousemove', this.pageMouseMove.bind(this));
    }
    i = 0;
    componentWillReceiveProps(props) {
        if (props.flowGroup != null) {
            if (this.i == 0) {
                this.i++;
                this.setFlow(props.flowGroup);
            }
        }
    }

    setFlow(flowGroup) {
        this.id = flowGroup.id;
        this.flowGroup = flowGroup;

        this.updateStart(flowGroup.startX, flowGroup.startY);
        console.log("flowgroup", flowGroup);
        for (var i in this.flowGroup.items) {
            var flow = this.flowGroup.items[i];
            this.createAction(flow.id, flow.x, flow.y, flow.actionId, flow.index, flow.name, "");
        }
        console.log("items", flowGroup.items);
        for (var i in this.flowGroup.items) {
            var flow = this.flowGroup.items[i];
            for (var i in flow.pre) {
                var preIndex = flow.pre[i];
                this.createLine(preIndex, flow.index);
            }
        }
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
            //this.actionMouseMove(xy.x, xy.y);
        }
        e.stopPropagation();
    }

    // actionMouseMove(x, y) {
    //     var hit = false;
    //     this.actionMap.forEach((value, key, mapObj) => {
    //         if (x >= value.x && x <= value.x + value.width
    //             && y >= value.y && y <= value.y + value.height) {
    //             // value.svg.setAttributeNS(null, "class", "flow-action flow-action-selected");
    //             this.line.nextAction = value;
    //             hit = true;
    //             return;
    //         }
    //     })
    //     if (!hit) {
    //         this.line.nextAction = null;
    //     }
    // }

    pageMouseUp(e) {
        if (this.lineSelected) {
            console.log("789");
            if (this.line.nextAction == null) {
                this.clearLine();
                return;
            }
            if (this.line.preAction.index == this.line.nextAction.index) {
                this.clearLine();
                return;
            }
            if (this.line.preAction.hasNext(this.line.nextAction)) {
                this.clearLine();
                return;
            }
            var xy = PosUtils.getActionUpPos(this.line.nextAction);
            this.line.svg.setAttributeNS(null, "x2", xy.x);
            this.line.svg.setAttributeNS(null, "y2", xy.y);
            this.line.preAction.appendNext(this.line.nextAction);
            this.line.nextAction.appendPre(this.line.preAction);
            this.lineMap.set(this.line.preAction.index + "_" +
            this.line.nextAction.index, this.line);
        }
        this.lineSelected = false;
        this.nodeSelected=false;
    }

    clearLine() {
        this.div.removeChild(this.line.svg);
        this.line = null;
        this.lineSelected = false;
        this.nodeSelected=false;
    }


    getFlowMap() {
        var list = [];
        this.actionMap.forEach((value, key, mapObj) => {
            var actionPo = new ActionPo(value.id, value.index, value.actionId, value.x, value.y);
            value.next.forEach((item, index) => {
                actionPo.next.push(item.index);
            });
            value.pre.forEach((item, index) => {
                actionPo.pre.push(item.index);
            });
            list.push(actionPo);
        })
        console.log(list);
        return {
            id: this.id,
            startX: this.start.x,
            startY: this.start.y,
            list: list
        };
    }

    getActionByNode(node) {
        var index = node.getAttributeNS(null, "index");
        return this.getMap(index);
    }

    getActionByIndex(index) {
        return this.getMap(index);
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


    createLine(index1, index2) {
        console.log("index1", index1, "index2", index2);
        var action1 = this.getActionByIndex(index1.toString());
        var action2 = this.getActionByIndex(index2.toString());
        action1.next.push(action2);
        action2.pre.push(action1);
        console.log("action1", action1, "action2", action2);
        var xy1 = PosUtils.getHelperPointPos(action1);
        var xy2 = PosUtils.getActionUpPos(action2);
        var line = new Line(xy1.x, xy1.y, xy2.x, xy2.y);
        var lineSvg = line.createSvg();
        line.preAction = action1;
        line.nextAction = action2;
        this.div.append(lineSvg);
        this.lineMap.set(line.preAction.index + "_" +
            line.nextAction.index, line);
    }

    createStart() {
        var width = RectContants.START_WIDTH;
        var height = RectContants.START_HEIGHT;
        var x = this.selfRect.width / 2 - width / 2;
        var y = 20;
        this.start = new Action(0, ActionType.Start, this.currentIndex, 0, x, y, width, height);
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
        svg.setAttributeNS(null, "r", width / 2);
        svg.setAttributeNS(null, "cx", 0);
        svg.setAttributeNS(null, "cy", 0);
        svg.setAttributeNS(null, "index", this.currentIndex);

        this.start.svg = svg;
        var hx = -RectContants.HELPER_WIDTH / 2;
        var hy = RectContants.HELPER_HEIGHT + 2;
        var hSvg = this.createHelper(this.start, hx, hy);
        gSvg.append(hSvg);
        this.saveMap(this.currentIndex, this.start);
        this.bindMoveEvent(this.start);
        this.currentIndex++;
    }

    updateStart(x, y) {
        this.start.x = x;
        this.start.y = y;
        this.start.svgG.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
    }

    updateIndex(index){
        if(index>this.currentIndex){
            this.currentIndex=index;
        }
    }

    incrIndex(){
        return  ++this.currentIndex;
    }

    //创建action
    createAction(id, x, y, actionId, index, name, className) {
        //判断是否超出边界
        if (x < -RectContants.ACTION_WIDTH / 2 || y < -RectContants.ACTION_HEIGHT / 2) {
            return;
        }
        if (index != -1) {
            this.updateIndex(index);
        } else {
            index= this.incrIndex();
        }
        var action = new Action(id, ActionType.Action, index, actionId, x, y);

        var gSvg = document.createElementNS(this.ns, "g");
        action.svgG = gSvg;
        this.append(gSvg);
        gSvg.setAttributeNS(null, "index", index);
        gSvg.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
        var svg = document.createElementNS(this.ns, "rect");
        svg.setAttributeNS(null, 'width', action.width);
        svg.setAttributeNS(null, 'height', action.height);
        svg.setAttributeNS(null, "x", 0);
        svg.setAttributeNS(null, "y", 0);
        svg.setAttributeNS(null, "rx", 5);
        svg.setAttributeNS(null, "ry", 5);
        svg.setAttributeNS(null, "class", "flow-action");
        svg.setAttributeNS(null, "index", index);
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
        var hx = action.width / 2 - RectContants.HELPER_WIDTH / 2;
        var hy = action.height + 2;
        var hSvg = this.createHelper(action, hx, hy);
        action.svgHelper = hSvg;
        gSvg.append(hSvg);
        this.saveMap(index, action);
    }

    bindMoveEvent(action) {
        var g = action.svgG;
        SVG.on(g, 'mousedown', (e) => {
            if (e.button != 0) {
                return;
            }
            this.nodeSelected = true;
            this.moveAction = this.getActionByNode(g);
            this.clickX = e.pageX;
            this.clickY = e.pageY;
            this.moveAction.startX = this.moveAction.x;
            this.moveAction.startY = this.moveAction.y;
        });

        SVG.on(g,'mouseup',(e)=>{
            if (this.lineSelected) {
                var action= this.getActionByNode(g);
                console.log("action",action);
                this.line.nextAction = action;
            }
        });

    }


    createHelper(action, x, y) {
        var helper = document.createElementNS(this.ns, 'rect');
        helper.setAttributeNS(null, 'width', RectContants.HELPER_WIDTH);
        helper.setAttributeNS(null, 'height', RectContants.HELPER_HEIGHT);
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
                this.lineSelected = true;
                var action = this.getActionByNode(helper);
                if (action == null) {
                    return;
                }
                var xy = PosUtils.getHelperPointPos(action);
                this.line = new Line(xy.x, xy.y, xy.x, xy.y);
                var lineSvg = this.line.createSvg();
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
            <div id="div-wrap" style={{ width: '1100px', height: '100%', overflow: 'scroll' }}>
                <svg id="svg2" style={{ width: '10000px', height: '1000px', 'user-select': 'none' }}>

                </svg>
            </div>
        );
    }
}

export default Flow;