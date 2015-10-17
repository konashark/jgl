/*
 This is a simple example of using the JGL State Machine and Event Manager.
 It creates three states and rotates between them when the user presses ENTER.
 This example uses the class-based method of creating states. This is the better method
 to use when you have multiple instances of the same state that only differentiate
 themselves based on their id. If you only create a single instance of any state, and
 you prefer more procedural style coding, see example stateExample2.
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
    // Register three states
    // Note: since we are defining our own State class, we must register each instance.
    // If we were doing this procedurally (calling stateManager.newState) registration would already be done for us
    states[0] = stateManager.registerState(new State("stateA"));
    states[1] = stateManager.registerState(new State("stateB"));
    states[2] = stateManager.registerState(new State("stateC"));

    stateManager.transitionTo("stateA");

    // Start handling key events - converting system UI events into Juno App Events
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

// ********************************************
// Here's a really simple class that we will
// use for our State/Controller. It inherits
// its framework from the Jgl_State class.
// Note: you can name this class anything you
// want as long as it stores its id and provides
// the necessary function interfaces.
// ********************************************
var State = function(id) {
    this.id = id;
};

// Inherit from JGLs abstracted State class
State.prototype = Object.create(Jgl_State.prototype);

State.prototype.eventHandler = function(event) {
    var consumed = true;
    switch (event) {
        // Here's where you would put any event handling for your Controller
        default:
            consumed = false;
            break;
    }
    return consumed;
};

State.prototype.enter = function(stateData) {
    console.log(this.id + " - ENTER");
    // Activate our screen
    var elem = document.getElementById(this.id);
    elem.classList.add('show');
};

State.prototype.exit = function() {
    console.log(this.id + " - EXIT");
    // Deactivate our screen
    var elem = document.getElementById(this.id);
    elem.classList.remove('show');

    return null;
};
