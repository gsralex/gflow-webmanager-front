



export default class PosUtils {

    static getActionUpPos(action) {
        var x = action.x + action.width / 2;
        var y = action.y;
        return { x: x, y: y };
    }

    static getActionDownPos(action) {
        var x = action.x + action.width / 2;
        var y = action.y + action.height;
        return { x: x, y: y };
    }

    static getActionHelperPos(action){
        var width = 20;
        var height = 10;
        var xy= this.getActionDownPos(action);
        return { x: xy.x, y: xy.y + height };
    }

    static getStartUpPos(action) {
        var x = action.x;
        var y = action.y - action.height / 2;
        return { x: x, y: y };

    }
    static getStartDownPos(action) {
        var x = action.x;
        var y = action.y + action.height / 2;
        return { x: x, y: y };
    }

    static getStartHelperPos(action) {
        var width = 20;
        var height = 10;
        var xy = this.getStartDownPos();
        return { x: xy.x, y: xy.y + height };

    }
}