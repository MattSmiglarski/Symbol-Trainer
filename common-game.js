var h = Object.keys(hiragana);
var grid;
var choiceElements = {};
var rightToLeft = true; // Put in a config object or something
var mode = 'grid';
var msg;
var msgTimer;

function message(msgHtml, top, right) {
	if (msg) {
		window.clearTimeout(msgTimer);	
		msg.parentNode.removeChild(msg);
	}
	msg = document.createElement('div');
	msg.id = 'qwe';
	msg.innerHTML = msgHtml;
	msg.className = 'awesome';
	msg.style.position = 'absolute';
	msg.style.float = 'right';
	document.body.appendChild(msg);
	msg.style.top = top || '2px';
	msg.style.right = right || '20px';
	msgTimer = window.setTimeout("msg.parentNode.removeChild(msg);", 3000);
}

function row(n) {
	var src = tableValues[n];
	var dst = [];
	for (var i=0; i<src.length; i++) {
		dst[i] = src[i];
	}
	return dst;
}	

function col(n) {
	var dst = [];
	for (var i=0; i<src.length; i++) {
		dst[i] = tableValues[i][n];
	}
	return dst;
}	

function dup(index, multiple) {
	var dst = [];
	for (var i=0; i<multiple; i+=1) {
		dst[i] = h[index];
	}
	return dst;
}

function arrOfSize(n) {
	var dst = [];
	for (var i=0; i<n; i++) {
		dst[i] = h[i];
	}
	return dst;
}

function toggleHints(flag) {
	var hints = document.getElementsByClassName('hint');
	for (var i=0; i<hints.length; i++) {
		hints[i].style.display = (flag? 'block' : 'none');
	}
}

function createChoiceWidget(answerCallback, key, value) {
	var choiceEl = document.createElement("div");
	var progressWrapper = document.createElement("div");
	var progress = document.createElement("div");
	var hint = document.createElement("div");
	var ideograph = document.createElement("span");

	progressWrapper.className = 'progressWrapper';
	progress.className = 'progress';
	progress.style.width = 0;
	ideograph.className = 'option';
	ideograph.innerHTML = key;
	hint.className = 'hint';
	hint.innerHTML = value || "";

	if (!key) return choiceEl;

	progress.appendChild(hint);
	progressWrapper.appendChild(progress);
	choiceEl.appendChild(progressWrapper);
	choiceEl.appendChild(ideograph);

	choiceEl.className = 'choice';
	choiceEl.setAttribute('data-key', key);
	choiceEl.setAttribute('data-value', value);
	choiceEl.setAttribute('data-progress', 0);
	choiceEl.addEventListener('click', function() {
			answerCallback(key,
				choiceEl.increment,
				function (currentValue) {
				choiceElements[currentValue].decrement();
				choiceEl.decrement();
				mode = 'grid';
				});
			}, false);

	function updateProgressStyle() {
		var margin = 2;
		var wrapperWidth = 45;
		var availableWidth = wrapperWidth - 2*margin;
		var divisions = 5;
		var unitWidth = availableWidth / divisions;
		var progressWidth = unitWidth * choiceEl.progress();

		if (progressWidth < availableWidth) {
			progress.style.width = progressWidth + 'px';
		} else {
			progressWrapper.style.backgroundColor = 'green';
			progressWrapper.style.borderRadius = '6px 6px 0 0';
		}
	}

	choiceEl.increment = function() {
		var x = Number(choiceEl.getAttribute('data-progress'));
		choiceEl.setAttribute('data-progress', x+1);
		updateProgressStyle();
	}
	choiceEl.decrement = function() {
		var x = Number(choiceEl.getAttribute('data-progress'));
		var newValue;
		if (x > 0) {
			newValue=x-1;
		} else {
			newValue=0;
		}
		choiceEl.setAttribute('data-progress', newValue);
		updateProgressStyle();
	}
	choiceEl.progress = function() {
		return Number(choiceEl.getAttribute('data-progress'));
	}

	return choiceEl;
}

function createGame(config) {
	var game = doOne(hiragana, config);

	game.addHook('correct', function() {
			var questionEl = document.getElementById('questions').children[0];
			document.getElementById('status').style.backgroundColor = 'green';
			questionEl.parentNode.removeChild(questionEl);
			window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
			});
	game.addHook('incorrect', function() {
			var questionEl = document.getElementById('questions').children[0];
			document.getElementById('status').style.backgroundColor = 'red';
			questionEl.style.backgroundColor = 'red';
			questionEl.parentNode.removeChild(questionEl);
			document.getElementById('incorrectAnswers').appendChild(questionEl);
			window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
			});

	game.restrictRow = config.restrictRow;
	game.restrictCol = config.restrictCol;
	return game;
}

var data = hiragana; 
var currentValue;

function createQuestionWidget(value) {
	var questionEl = document.createElement('div');
	questionEl.className = 'awesome question';
	questionEl.innerHTML = value;
	questionEl.setAttribute('data-question', value);
	return questionEl;
}

var doubleClosure = (function () {
	return (function() {
		return function() {}
	}());
}());

var levels = [
		{ options: [h[0]], questions: [h[0]], hints: true, mode: 'multichoice' },
		{ options: [h[0]], questions: [h[0]], hints: true, mode: 'grid', msg: 'This is the standard hiragana layout. It is read top to bottom, right to left.' },
		{ questions: dup(0, 5), options: arrOfSize(2), hints: false, mode: 'multichoice' },
		{ options: row(0), questions: row(0), hints: true, mode: 'grid', msg: 'You are now being tested on the vowels in the rightmost column. The hints will disappear on the next question.'},
		{ questions: dup(0, 5), options: arrOfSize(5), hints: false, mode: 'multichoice' },
		{ questions: [h[0]], options: arrOfSize(11), hints: false, mode: 'multichoice' },
		{ questions: [h[0]], options: arrOfSize(11), hints: false, mode: 'multichoice' },
		{ questions: [h[0]], options: arrOfSize(11), hints: false, mode: 'multichoice' },
		{ questions: [h[0]], options: arrOfSize(11), hints: false, mode: 'multichoice' },
		{ questions: [h[0]], options: arrOfSize(22), hints: false, mode: 'multichoice' },
		{ options: row(0), questions: row(0), hints: true, mode: 'multichoice' },
		{ options: row(0), questions: row(0), hints: false, mode: 'multichoice' },
		{ questions: row(0), options: arrOfSize(6), hints: false, mode: 'multichoice' },
		{ questions: row(0), options: arrOfSize(11), hints: false, mode: 'multichoice' },
		{ questions: row(0), options: arrOfSize(22), hints: false, mode: 'multichoice' },
		{ questions: row(0), options: arrOfSize(33), hints: false, mode: 'multichoice' },
		{ questions: row(1), options: row(2), hints: true, mode: 'grid' },
		{}
		]

function nextLevelConfig() {
	return levels.shift();
}

var questionsHook = (function() {

		function createMultiChoices(answerCallback, config) {
		var ideograph = document.getElementById(currentValue);
		var choicesEl = document.getElementById('choices');
		var left = config.options;
		var i=0;
		var j, key, choiceEl;
		var limit = config.options.length;

		ideograph && (ideograph.style.display = 'block');
		choicesEl.innerHTML = '';
		for (i=0; i<limit; i+=1) {
			j = Math.floor(Math.random() * Object.keys(left).length);
			key = left[j];
			choiceEl = choiceElements[key];
			choicesEl.appendChild(choiceEl);
			left = left.slice(0, j).concat(left.slice(j+1));
		}
		}


		function nextLevel() {
			var statusBar = document.getElementById('questions');
			var questionEl;
			var i,j,ideographWidget;

			var level = nextLevelConfig();
			mode = level.mode;
			grid.clear();
			for (var i=0; i<level.questions.length; i++) {
				questionEl = createQuestionWidget(data[level.questions[level.questions.length-i-1]]);
				statusBar.insertBefore(questionEl, statusBar.children[0]);
			}
			level.data = tableValues;
			if (mode == 'grid') {
				level.gridConfig = {};
			} else {
				level.multiChoiceConfig = {};
			}
			if (level.msg) {
				message(level.msg);
			}
			return level;
		}

		return (function() {
				var level;

				return function(answerCallback) {
				if (!level || !level.questions.length) {
				level = nextLevel();
				if (!level) return;
				}

				currentValue = level.questions.shift();

				document.getElementById('grid').style.display = 'none';
				document.getElementById('choices').style.display = 'none';

				if (level.gridConfig) {
				for (i=0; i<grid.rows(); i+=1) {
				if (!level.restrictCol || col === level.restrictCol) {
				for (var j=0; j<grid.cols(); j+=1) {
				if (!level.restrictRow || row === level.restrictRow) {
				var col = rightToLeft? grid.cols()-1-j : j;
				ideographWidget = choiceElements[level.data[col][i]];
				grid.setValue(i, j, ideographWidget);
				}
				}
				}
				}
				document.getElementById('grid').style.display = 'block';
				}

				if (level.multiChoiceConfig) {
					createMultiChoices(answerCallback, level);
					document.getElementById('choices').style.display = 'block';
				}
				toggleHints(level.hints);
				return currentValue;
				}
		}());
}());

document.addEventListener('DOMContentLoaded', function() {
		grid = G.create(5, 16, {
target: document.getElementById('grid'),
data: tableValues,
setValue: function(tableCellTarget, value) {
var ideographWidget = choiceElements[value];
if (ideographWidget) tableCellTarget.appendChild(ideographWidget);
}});

		var game = createGame({
	questionsHook: questionsHook
});
		for (var i=0; i<h.length; i+=1) {
		choiceElements[h[i]] = createChoiceWidget(game.answer, h[i], hiragana[h[i]]);
		}

		game.start();
		message('&lt;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; Questions appear over there. Click the squiggle below to answer.');
		}, false);

