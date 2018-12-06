export default class ActionPo {

    id;
    index;
    actionId;
    next=[];
    pre=[];
    x=0;
    y=0;

    constructor(id,index, actionId,x,y) {
        this.id=id;
        this.index = index;
        this.actionId = actionId;
        this.x=x;
        this.y=y;
    }
}
