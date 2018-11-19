export default class ActionPo {

    index;
    actionId;
    preIndex;
    nextIndex;

    constructor(index, actionId, nextIndex) {
        this.index = index;
        this.actionId = actionId;
        this.nextIndex = nextIndex;
    }
}
