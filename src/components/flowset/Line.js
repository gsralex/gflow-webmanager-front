export default class Line {

    x = 0;
    y = 0;
    svg = null;
    preAction = null;
    nextAction = null;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}