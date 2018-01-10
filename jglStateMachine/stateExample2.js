/*
This is a simple example of using the JGL State Machine and Event Manager.
It creates three states and rotates between them when the user presses ENTER.
This version is more 'procedural' - every handler simply specifies a function instead of a class.
*/

var jgl;
var states = [];    // an array in which we'll store our three states
var stateIndex = 0;
var stateManager;

// ********************************************
window.onload = function() {

    jgl = new Jgl; // Instantiate JGL. Do this once at the start of your program

    // Create the state machine and initialise it to a given state
    stateManager = jgl.newStateManager();
    // Populate an array of three states
    states[0] = stateManager.newState("stateA",
        function() {console.log("ENTER A"); },
        function() {console.log("EXIT A"); },
        function() {console.log("EVENTHANDLER A");
                    return false });
    states[1] = stateManager.newState("stateB",
        function() {console.log("ENTER B"); },
        function() {console.log("EXIT B"); },
        function() {console.log("EVENTHANDLER B");
            return false });

    states[2] = stateManager.newState("stateC",
        function() {console.log("ENTER C"); },
        function() {console.log("EXIT C"); },
        function() {console.log("EVENTHANDLER C");
            return false });

    stateManager.transitionTo(states[stateIndex]);

    // Start handling key events
    document.onkeydown = function(event) {
        var eventConsumed = false;
        event.preventDefault();
        var eventHandler = stateManager.getCurrentStateEventHandler();
        if (eventHandler) {
            eventConsumed = eventHandler(event);
        }
        if (!eventConsumed) {
            console.log("Event was not handled by any State");
            switch (event.keyCode) {
                case jgl.KEYS.ENTER:
                    stateIndex = ((++stateIndex) % 3);  // look up next state and transition to it
                    stateManager.transitionTo(states[stateIndex], false);
                    break;

                case jgl.KEYS.ESC:
                    stateManager.transitionBack();
                    break;
            }
        }
    }.bind(this);
};
