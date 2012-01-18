var createEngine = function(visitor) {

	var hooks = [], value;	

	function doHooks(name) {}

	function answer(givenValue) {
		if (value === givenValue) {
			visitor.correct(givenValue);
		} else {
			visitor.incorrect(givenValue);
		}
		value = visitor.question();
		if (!value) {
			visitor.cleanUp();
		}
	}

	return {
		start: function() {},
		answer: answer,
		addHook: function(hookName, callback) {},
	};
};

var questionStream = function(levels) {
	var level = levels.pop();
	return function() {
		if (!level.questions) {
			level = levels.pop();
		}
	
		return level && level.questions.pop();
	};
};

var levels = [
	[ questions: [h[1],h[2]]]
];

createEngine({
	correct: function() {},
	incorrect: function() {},
	cleanUp: function() {},
	question: questionStream(levels)
});
