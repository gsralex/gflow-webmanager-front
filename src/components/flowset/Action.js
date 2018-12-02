export default class Action {

    startX=0;
    startY=0;
    x = 0;
    y = 0;
    width = 130;
    height = 50;
    svg = null;
    svgG=null;
    svgHelper = null;
    index = 0;
    pre = [];
    next = [];
    type = 0;
    actionId = 0;

    constructor(type, index, actionId, x, y) {
        this.type = type;
        this.index = index;
        this.actionId = actionId;
        this.x = x;
        this.y = y;
    }



    hasPre(action) {
        var index = this.pre.findIndex(x => x.index == action.index);
        return index < 0 ? false : true;
    }

    appendPre(action) {
        if (!this.hasPre(action)) {
            this.pre.push(action);
        }
    }

    removePre(action) {
        var index = this.pre.findIndex(x => x.index == action.index);
        this.pre.splice(index, 1);
    }

    hasNext(action) {
        var index = this.next.findIndex(x => x.index == action.index);
        console.log("index", index);
        return index < 0 ? false : true;
    }

    appendNext(action) {
        if (!this.hasNext(action)) {
            this.next.push(action);
        }
    }

    removeNext(action) {
        var index = this.next.findIndex(x => x.index == action.index);
        this.next.splice(index, 1);
    }

}