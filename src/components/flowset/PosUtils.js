import ActionType from "./ActionType";

export default class PosUtils {

    static HELPER_WIDTH = 20;
    static HELPER_HEIGHT = 10;
    static BORDER = 2;



    static getActionUpPos(action) {
        if (action.type == ActionType.Action) {
            var x = action.x + action.width / 2;
            var y = action.y;
            return { x: x, y: y };
        } else {
            var x = action.x;
            var y = action.y - action.height / 2;
            return { x: x, y: y };
        }
    }


    static getActionDownPos(action) {
        if (action.type == ActionType.Action) {
            var x = action.x + action.width / 2;
            var y = action.y + action.height;
            return { x: x, y: y };
        } else {
            var x = action.x;
            var y = action.y + action.height / 2;
            return { x: x, y: y };
        }
    }

    static getHelperPointPos(action) {
        var xy = this.getActionDownPos(action);
        xy.y += this.HELPER_HEIGHT + this.BORDER;
        return xy;
    }
}