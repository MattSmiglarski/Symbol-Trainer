// Globals
var grid;
var choiceElements = {};
var tableValues;

function currentQuestion() {
	var currentQuestionElement = document.getElementById('questions').children[0];
	return currentQuestionElement && currentQuestionElement.getAttribute('data-question');
}

var message = (function() {
		var msg;
		var msgTimer;

		return function(msgHtml, top, right) {
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
		msgTimer = window.setTimeout(function() { msg.parentNode.removeChild(msg); msg = null;}, 3000);
		}
		}());

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
	var index = 0;
	var value;
	for (var i=0; i<tableValues.length; i++) {
		value = tableValues[i][n];
		if (value) {
			dst[index] = tableValues[i][n];
			index+=1;
		}
		value = null;
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

function gameOver() {
	document.getElementById('grid').style.display = 'none';
	document.getElementById('choices').style.display = 'none';
	message(m.gameOver);
}

function createChoiceWidget(answerCallback, key, value) {
	var choiceEl = document.createElement("div");
	var progressWrapper = document.createElement("div");
	var progress = document.createElement("div");
	var hint = document.createElement("div");
	var ideograph = document.createElement("span");
	var playButton = document.createElement("img");

	progressWrapper.className = 'progressWrapper';
	progress.className = 'progress';
	progress.style.width = 0;
	ideograph.className = 'option';
	ideograph.innerHTML = key;
	hint.className = 'hint';
	hint.innerHTML = value || "";
	playButton.src = 'play.png';
	playButton.className = 'playButton';
	playButton.onclick = function(evt) {
		evt.stopPropagation();
		sounds[key].play();
		return false;
	}

	if (!key) return choiceEl;

	progress.appendChild(hint);
	progressWrapper.appendChild(playButton);
	progressWrapper.appendChild(progress);
	choiceEl.appendChild(progressWrapper);
	choiceEl.appendChild(ideograph);

	choiceEl.className = 'choice';
	choiceEl.setAttribute('data-key', key);
	choiceEl.setAttribute('data-value', value);
	choiceEl.setAttribute('data-progress', 0);
	choiceEl.addEventListener('click', function() {
			answerCallback(key, choiceEl.increment, choiceEl.decrement);
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

function answer(value, correctCallback, incorrectCallback) {
	function correct() {
		var questionEl = document.getElementById('questions').children[0];
		document.getElementById('status').style.backgroundColor = 'green';
		questionEl.parentNode.removeChild(questionEl);
		window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
	}

	function incorrect() {
		var questionEl = document.getElementById('questions').children[0];
		document.getElementById('status').style.backgroundColor = 'red';
		questionEl.style.backgroundColor = 'red';
		questionEl.parentNode.removeChild(questionEl);
		document.getElementById('incorrectAnswers').appendChild(questionEl);
		window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
	}

	if (!currentQuestion()) return;
	if (data[value] === currentQuestion()) {
		correctCallback();
		correct();
	} else {
		incorrectCallback();
		incorrect();
	}
	nextQuestion();
}

function nextLevel() {
	var statusBar = document.getElementById('questions');
	var questionEl;
	var i,j,ideographWidget;

	var level = levels.shift();
	for (var i=0; i<level.questions.length; i++) {
		questionEl = createQuestionWidget(data[level.questions[level.questions.length-i-1]]);
		statusBar.insertBefore(questionEl, statusBar.children[0]);
	}
	level.data = tableValues;
	if (level.mode == 'grid') {
		level.gridConfig = {};
	} else {
		level.multiChoiceConfig = {};
	}
	if (level.msg) {
		message(level.msg);
	}

	document.getElementById('grid').style.display = 'none';
	document.getElementById('choices').style.display = 'none';

	if (level.gridConfig) {
		for (i=0; i<grid.rows(); i+=1) {
			if (!level.restrictCol || col === level.restrictCol) {
				for (var j=0; j<grid.cols(); j+=1) {
					if (!level.restrictRow || row === level.restrictRow) {
						var col = grid.cols()-1-j;
						ideographWidget = choiceElements[level.data[col][i]];
						grid.setValue(i, j, ideographWidget);
					}
				}
			}
		}
		document.getElementById('grid').style.display = 'block';
	}

	return level;
}

function createQuestionWidget(value) {
	var questionEl = document.createElement('div');
	questionEl.className = 'awesome question';
	questionEl.innerHTML = value;
	questionEl.setAttribute('data-question', value);
	return questionEl;
}

function createMultiChoices(config) {
	var choicesEl = document.getElementById('choices');
	var left = config.options;
	var i=0;
	var j, key, choiceEl;
	var limit = config.options.length;

	choicesEl.innerHTML = '';
	for (i=0; i<limit; i+=1) {
		j = Math.floor(Math.random() * Object.keys(left).length);
		key = left[j];
		choiceEl = choiceElements[key];
		choicesEl.appendChild(choiceEl);
		left = left.slice(0, j).concat(left.slice(j+1));
	}
}

var nextQuestion = (function() {

		var level;

		return function() {
		if (!level || !currentQuestion()) {
		if (!levels.length) {
			gameOver();
			return;
		} else {
			level = nextLevel();
		}
		}

		if (level.multiChoiceConfig) {
			createMultiChoices(level);
			document.getElementById('choices').style.display = 'block';
		}
		toggleHints(level.hints);
		return currentQuestion();
		}
}());

function setGridValue(tableCellTarget, value) {
	var ideographWidget = choiceElements[value];
	if (ideographWidget) tableCellTarget.appendChild(ideographWidget);
}
