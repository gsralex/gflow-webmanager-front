export default class ActionPo {

    index;
    actionId;
    nextIndex;
    nextActionId;

    constructor(index, actionId, nextIndex, nextActionId) {
        this.index = index;
        this.actionId = actionId;
        this.nextIndex = nextIndex;
        this.nextActionId = nextActionId;
    }
}
