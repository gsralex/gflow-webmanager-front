export default class ActionPo {

    index;
    actionId;
    next=[];
    pre=[];
    x=0;
    y=0;

    constructor(index, actionId,x,y) {
        this.index = index;
        this.actionId = actionId;
        this.x=x;
        this.y=y;
    }
}
