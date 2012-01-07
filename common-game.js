var h = Object.keys(hiragana);
var grid;
var choiceElements = {};
var rightToLeft = true; // Put in a config object or something
var mode = 'grid';

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
						document.getElementById('status').style.backgroundColor = 'green';
						document.getElementById('questions').children[0].style.backgroundColor = 'green';
						window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
						mode = 'multichoice';
						romajiPlugin.disable();
						});
		game.addHook('incorrect', function() {
						document.getElementById('status').style.backgroundColor = 'red';
						document.getElementById('questions').children[0].style.backgroundColor = 'red';
						window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
						mode = 'grid';
						romajiPlugin.enable();
						});

		var cheapRefreshPlugin = game.plugin('Refresh', function() {
						document.location = document.location;
						});
		var romajiPlugin = game.plugin('Rōmaji', function(flag) {
						var hints = document.getElementsByClassName('hint');
						for (var i=0; i<hints.length; i++) {
						hints[i].style.display = (flag? 'block' : 'none');
						}
						});
		romajiPlugin.enable();
		game.restrictRow = config.restrictRow;
		game.restrictCol = config.restrictCol;
		if (config.init) config.init(game);
		game.start();
		return game;
}

var gridGame = (function () {
				var options = [h[0],h[1],h[2],h[3],h[4]];
				var data = hiragana; 
				var currentValue;

				function createMultiChoices(answerCallback, config) {
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
				choiceEl = choiceElements[key];
				choicesEl.appendChild(choiceEl);
				left = left.slice(0, j).concat(left.slice(j+1));
				}
				}

				function createQuestionWidget(value) {
					var questionEl = document.createElement('div');
					questionEl.className = 'awesome question';
					questionEl.innerHTML = value;
					return questionEl;
				}

				function nextQuestion() {
					var questionEl;
					var statusBar = document.getElementById('questions');
					currentValue = options[Math.floor(Math.random() * options.length)]
 					questionEl = createQuestionWidget(data[currentValue]);
					statusBar.insertBefore(questionEl, statusBar.children[0]);
				}

				function questionsHook(answerCallback) {
						var config = {};
						var i,j,ideographWidget;
						grid.clear();
						nextQuestion();
						config.data = tableValues;
						if (mode == 'grid') {
								config.gridConfig = {};
								mode = 'multichoice';
						} else {
								config.multiChoiceConfig = {}
						}

						document.getElementById('grid').style.display = 'none';
						document.getElementById('choices').style.display = 'none';

						if (config.gridConfig) {
								for (i=0; i<grid.rows(); i+=1) {
										if (!config.restrictCol || col === config.restrictCol) {
												for (var j=0; j<grid.cols(); j+=1) {
														if (!config.restrictRow || row === config.restrictRow) {
																var col = rightToLeft? grid.cols()-1-j : j;
																ideographWidget = choiceElements[config.data[col][i]];
																grid.setValue(i, j, ideographWidget);
														}
												}
										}
								}
								document.getElementById('grid').style.display = 'block';
						}

						if (config.multiChoiceConfig) {
								createMultiChoices(answerCallback, {});
								document.getElementById('choices').style.display = 'block';
						}
						return currentValue;
				}

				return {
							 questionsHook: questionsHook,
							 //restrictCol: 2,
							 init: function init(game) {
									 for (var i=0; i<h.length; i+=1) {
											 choiceElements[h[i]] = createChoice(game.answer, h[i], hiragana[h[i]]);
									 }

									 grid = G.create(5, 16, {
target: document.getElementById('grid'),
data: tableValues,
setValue: function(tableCellTarget, value) {
var ideographWidget = choiceElements[value];
if (ideographWidget) tableCellTarget.appendChild(ideographWidget);
},
columnSpans: [1,1,1,1,1,3,1,2,2,2,1,1],
restrictRow: game.restrictRow,
restrictCol: game.restrictCol
});
}
};
}());

