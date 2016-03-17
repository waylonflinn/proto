/* Experiment in Mercury event propagation

	Conclusions:
		* events bubble, but bubbling will be stopped by the first element
			which handles the event
		* adding the `{startPropagation: true}` option to an event handler
			will allow the event to bubble up one additional level
		* `:focus` state is set only on the element actually focused

	Tested:
		* focus
		* click
		* keydown - filtering by key code does not prevent propagation, if enabled
				(i.e. non-matching key codes will be passed through)
 */
var hg = require('mercury'),
	h = require('mercury').h;

function App(){
	return hg.state({
		"outer" : hg.value(false),
		"inner" : hg.value(false),
		"input" : hg.value(false),
		"channels" : {
			eventOuterDiv : eventOuterDiv,
			eventDiv : eventDiv,
			eventInput : eventInput,
			reset : reset
		}
	});
}

function reset(state){
	state.outer.set(false);
	state.inner.set(false);
	state.input.set(false);
}

function eventOuterDiv(state){
	console.log("outer div");
	state.outer.set(true);
}
function eventDiv(state){
	console.log("  inner div");
	state.inner.set(true);
}

function eventInput(state){
	console.log("    input elem");
	state.input.set(true);
}

var keys = {};

keys.A = 'A'.charCodeAt(0);
keys.B = 'B'.charCodeAt(0);

var state = App();

d = hg.Delegator();
// this always fires first
d.addGlobalEventListener("keydown", hg.send(state().channels.reset));

App.render = function(state){
	return h('div.mercury',
		{'ev-keydown' : hg.send(state.channels.eventOuterDiv), 'tabIndex' : 0, "className" : state.outer ? "active" : ""},
		h('div',
			{'ev-keydown' : hg.sendKey(state.channels.eventDiv, {}, {key: keys.B, startPropagation: true}), 'tabIndex' : 1, "className" : state.inner ? "active" : ""},
			h('input',
				{'ev-keydown' : hg.sendKey(state.channels.eventInput, {}, {key: keys.A, startPropagation: true}), "className" : state.input ? "active" : ""},
				state.text)
		)
	);
}
//

hg.app(document.body, state, App.render);
