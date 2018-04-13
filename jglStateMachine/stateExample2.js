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
    states[0] = stateManager.newState({
        id: "stateA",
        enter: function() { document.write("ENTER A<br>");},
        exit: function() { document.write("EXIT A<br>");},
        eventHandler: function() { document.write("EVENTHANDLER A<br>"); return false; }
    });
    states[1] = stateManager.newState({
        id: "stateB",
        enter: function() { document.write("ENTER B<br>");},
        exit: function() { document.write("EXIT B<br>");},
        eventHandler: function() { document.write("EVENTHANDLER B<br>"); return false; }
    });
    states[2] = stateManager.newState({
        id: "stateC",
        enter: function() { document.write("ENTER C<br>");},
        exit: function() { document.write("EXIT C<br>");},
        eventHandler: function() { document.write("EVENTHANDLER C<br>"); return false; }
    });

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
