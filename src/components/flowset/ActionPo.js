export default class ActionPo {

    index;
    actionId;
    next=[];

    constructor(index, actionId) {
        this.index = index;
        this.actionId = actionId;
    }
}
