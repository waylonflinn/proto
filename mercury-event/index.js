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
		"text" : hg.value("hello"),
		"channels" : {
			eventOuterDiv : eventOuterDiv,
			eventDiv : eventDiv,
			eventInput : eventInput
		}
	});
}

function eventOuterDiv(state){
	console.log("outer div");
}
function eventDiv(state){
	console.log("  inner div");
}

function eventInput(state){
	console.log("    input elem");
}

var keys = {};

keys.A = 'A'.charCodeAt(0),
keys.B = 'B'.charCodeAt(0);

App.render = function(state){
	return h('div.mercury',
		{'ev-keydown' : hg.send(state.channels.eventOuterDiv), 'tabIndex' : 0},
		h('div',
			{'ev-keydown' : hg.sendKey(state.channels.eventDiv, {}, {key: keys.A, startPropagation: true}), 'tabIndex' : 1},
			h('input',
				{'ev-keydown' : hg.sendKey(state.channels.eventInput, {}, {key: keys.A, startPropagation: true})},
				state.text)
		)
	);
}
//

hg.app(document.body, App(), App.render);
