// State Manager Object
// *****************************************************
var Jgl_StateManager = function(jgl) {

    this.jgl = jgl;
    this.stateList = [];
    this.currentState = null;
    this.historyStack = [];
    this.MAX_HISTORIES = 16;
};

//*****************************************************
var Jgl_State = function(id, enter, exit, eventHandler){
    // params:
    //      eventHandler    - eventHandler for state
    //      enter           - callback function
    //      exit            - callback function

    this.id             = id;
    this.enter          = enter;
    this.exit           = exit;
    this.eventHandler   = eventHandler;

    this.enter          = enter || function() { console.log("'enter' not implemented")};
    this.exit           = exit || function() { console.log("'exit' not implemented")};
    this.eventHandler   = eventHandler || function() { return false };
};

//*****************************************************
Jgl_StateManager.prototype.newState = function(id, enter, exit, eventHandler){
    if (!(id)) {
        return this.jgl.error.PARAMETER;
    }

    return this.registerState(new Jgl_State(id, enter, exit, eventHandler));
};

//*****************************************************
Jgl_StateManager.prototype.registerState = function(state){
    this.stateList.push(state);
    return state;
};

//*****************************************************
Jgl_StateManager.prototype.unregisterState = function(state){

    if (typeof state === "string") {
        state = this.findStateById(state);
    }

    if (state){
        var index = this.stateList.indexOf(state);

        if (index) {
            if (state === this.currentState) {
                console.log("Uh oh. Deleting the current state!");
                this.jgl.postEvent(this.jgl.event.STATE_TERMINATE, this.currentState.id);
                this.currentState = null;
            }
            this.stateList.splice(index, 1);
            return state;
        }
    }
    return null;
};

//*****************************************************
Jgl_StateManager.prototype.findStateById = function(id){
    for (var node = 0; node < this.stateList.length; node++) {
        if (this.stateList[node].id === id) {
            return this.stateList[node];
        }
    }
    return null;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentState = function(){
    return this.currentState.id;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentStateEventHandler = function(){
    return this.currentState.eventHandler;
};

//*****************************************************
Jgl_StateManager.prototype.getCurrentStateId = function(){
    return this.currentState.id;
};

//*****************************************************
Jgl_StateManager.prototype.privateDoTransition = function(oldState, newState, stateData){
    // Tell old state that it's going away
    if (oldState && oldState.exit) {
        if (stateData === undefined || stateData === null) {
            stateData = oldState.exit(oldState, newState);    // old state, new state
        } else {
            oldState.exit(oldState, newState);    // old state, new state
        }
    }
    if (this.currentState) {
        this.jgl.postEvent(this.jgl.event.STATE_TERMINATE, this.currentState.id);
    }

    // Tell new state that it's being activated
    if (newState.enter) {
        newState.enter(this.currentState, newState, stateData);
    }
    this.currentState = newState;
    console.log("JGL CURRENT STATE: " + newState.id);
    this.jgl.postEvent(this.jgl.event.STATE_ACTIVATE, { id: newState.id, stateData: stateData });
}

//*****************************************************
Jgl_StateManager.prototype.transitionTo = function(state, stateData){
    if (state) {
        if (typeof state === "string") {
            state = this.findStateById(state);
        }

        if (state === this.currentState) {
            console.log("Uh oh. Requested state is already active!");
        }

        this.privateDoTransition(this.currentState, state, stateData);

        this.historyStack.unshift(state);
        if (this.historyStack.length > this.MAX_HISTORIES) {
            this.historyStack.pop();
        }
    }
    return state;
};

//*****************************************************
Jgl_StateManager.prototype.transitionBack = function(){
    var oldState = this.currentState;
    this.historyStack.shift();
    var newState = this.historyStack[0];

    if (oldState && newState) {
        this.privateDoTransition(oldState, newState);
    }
    return this.currentState;
};
