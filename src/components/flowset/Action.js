export default class Action {

    x = 0;
    y = 0;
    width = 0;
    height = 0;
    svg = null;
    svgHelper = null;
    index = 0;
    pre = [];
    next = [];

    constructor(index, x, y, width, height) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    appendPre(action) {
        var index = this.pre.findIndex(x => x.index == action.index);
        if (index < 0) {
            this.pre.push(action);
        }
    }

    removePre(action) {
        var index = this.pre.findIndex(x => x.index == action.index);
        this.pre.splice(index, 1);
    }

    appendNext(action) {
        var index = this.next.findIndex(x => x.index == action.index);
        if (index < 0) {
            this.next.push(action);
        }
    }

    removeNext(action) {
        var index = this.next.findIndex(x => x.index == action.index);
        this.next.splice(index, 1);
    }

}