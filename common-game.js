function createChoice(answerCallback, key, value) {
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

var h = Object.keys(hiragana);

function createGame(config) {
	var game = doOne(hiragana, config);

game.addHook('question', function() {
		var statusBar = document.getElementById('status');
		var questionEl = document.createElement('div');
		questionEl.className = 'awesome question';
		questionEl.innerHTML = game.getQuestion();
		statusBar.insertBefore(questionEl, statusBar.children[0]);
		});

game.addHook('correct', function() {
		document.getElementById('status').style.backgroundColor = 'green';
		window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);

		});
game.addHook('incorrect', function() {
		document.getElementById('status').style.backgroundColor = 'red';
		document.getElementById('status').children[0].style.backgroundColor = 'red';
		window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);

		});

var cheapRefreshPlugin = game.plugin('Refresh', function() {
		document.location = document.location;
		});
var romanjiPlugin = game.plugin('Romanji', function(flag) {
		var hints = document.getElementsByClassName('hint');
		for (var i=0; i<hints.length; i++) {
		hints[i].style.display = (flag? 'block' : 'none');
		}
		});

game.restrictRow = config.restrictRow;
game.restrictCol = config.restrictCol;
if (config.init) config.init(game);
game.start();
return game;
}

var anythingStrategy = (function() {
		var count = 1;
		var previousQs = {};

		return function() {
		var data;
		var i, q;

		data = count%3 == 0? previousQs : hiragana;
		i = Math.floor(Math.random() * Object.keys(data).length);
		var q = Object.keys(data)[i];
		previousQs[q] = 1;
		count += 1;
		return q;
		}
		}());

function createGrid(game) {
	var config = {
target: document.getElementById('grid'),
	setValue: function(target, value) { // Flatten
		target.appendChild(createChoice(game.answer, value, hiragana[value]));
	},
columnSpans: [1,1,1,1,1,3,1,2,2,2,1,1],
	};
	var grid = G.create(5, 16, config);
	var row, col;
	// Pass into the grid
	for (col=15; col>=0; col-=1) {
		if (!game.restrictCol || col === game.restrictCol) {
			for (row=0; row<5; row+=1) {
				if (!game.restrictRow || row === game.restrictRow) {
					grid.setValue(row, col, tableValues[15-col][row]);
				}
			}
		}
	}
}

var gridGame = (function () {
		var mode = 'multichoice';
		var options = [h[0],h[1],h[2],h[3],h[4]];
		var data = hiragana; 
		var currentValue;

		function createMultiChoices(answerCallback, config) {
		currentValue = options[Math.floor(Math.random() * options.length)];
		var ideograph = document.getElementById(currentValue);
		var choicesEl = document.getElementById('choices');
		var left = options;
		var i=0;
		var j, key, choiceEl;
		var limit = options.length;

		ideograph && (ideograph.style.display = 'block');
		choicesEl.innerHTML = '';
		for (i=0; i<limit; i+=1) {
		j = Math.floor(Math.random() * Object.keys(left).length);
		key = left[j];
		choiceEl = createChoice(answerCallback, key, data[key]);
		choicesEl.appendChild(choiceEl);
		left = left.slice(0, j).concat(left.slice(j+1));
		}
		}

		function questionsHook(answerCallback) {
			var config = nextQuestionConfig();

			document.getElementById('grid').style.display = 'none';
			document.getElementById('choices').style.display = 'none';

			if (config.gridConfig) {
				document.getElementById('grid').style.display = 'block';
			}

			if (config.multiChoiceConfig) {
				createMultiChoices(answerCallback, {
						});
				document.getElementById('choices').style.display = 'block';
			}
			return currentValue;
		}

		var nextValue = (function() {
				var count = 1;
				var previousQs = {};

				return function() {
				var data;
				var i, q;

				data = count%3 == 0? previousQs : hiragana;
				i = Math.floor(Math.random() * Object.keys(data).length);
				var q = Object.keys(data)[i];
				previousQs[q] = 1;
				count += 1;
				return q;
				}
				}());

		function nextQuestionConfig() {
			var gridConfig;
			var multiChoiceConfig;

			if (mode == 'grid') {
				gridConfig = {

				}
				mode = 'multichoice';
			} else {
				multiChoiceConfig = {
options: 5
				}
				//mode = 'grid';
			}

			return {
gridConfig: gridConfig,
		    multiChoiceConfig: multiChoiceConfig
			}
		}

		return {
createChoiceElement: function(game, key, value) {},
			     questionsHook: questionsHook,
			     //restrictCol: 2,
			     init: createGrid
		};
}());

