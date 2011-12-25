function doOne(data) {
		if (typeof $ === 'undefined') var $ = function(id) { return document.getElementById(id); }

		if (typeof Object.keys != 'function') {
				Object.keys = function(obj) {
						if (typeof obj != "object" && typeof obj != "function" || obj == null) {
								throw TypeError("Object.keys called on non-object");
						} 
						var keys = [];
						for (var p in obj) obj.hasOwnProperty(p) &&keys.push(p);
						return keys;
				}
		}

		var onHtml = ' <span style="color: blue;">On</span>/Off';
		var offHtml = ' On/<span style="color: blue;">Off</span>';
		var questionEl= $('question');
		var choicesEl = $('choices');
		var currentValue;
		var correctCallbacks = new Array();
		var incorrectCallbacks = new Array();
		var timerCallbacks = new Array();
	var timer;
	window.timerSupport = function() {
		for (var i=0; i<timerCallbacks.length; i++) {
			timerCallbacks[i]();
		}
		timer = setTimeout("timerSupport()", 1000);
	};
	timerSupport();

		function answerGiven(value) {
				if (value === currentValue) {
					for (var i=0; i<correctCallbacks.length; i++) {
						correctCallbacks[i]();
					}
					var i = Math.floor(Math.random() * $('choices').children.length)
					currentValue = Object.keys(data)[i];
					questionEl.innerHTML = currentValue;
				} else {
					for (var i=0; i<incorrectCallbacks.length; j++) {
						incorrectCallbacks[i]();
					}
				}
		}

		function createChoice(key, value) {
				var choiceEl = document.createElement("div");
				var hint = '<div class="hint">'+key+'</div>';
				choiceEl.innerHTML = hint + '<span class="option">'+value+'<span>';
				choiceEl.addEventListener('click', function() {
					answerGiven(key);
				}, false);

				return choiceEl;
		}

		for (var c in data) {
				var choiceEl = createChoice(c, data[c]);
				choicesEl.appendChild(choiceEl);
		}

		answerGiven(); // initialise

		return {
plugin : function (pluginName, toggleFunction) {
				 var flag = false;
				 var configEl = document.createElement('a');
				 configEl.innerHTML = pluginName + offHtml;
				 configEl.className = 'awesome';

				 document.getElementById('config').appendChild(configEl);

				 configEl.addEventListener('click', function() {
						 flag = !flag;
						 configEl.innerHTML = pluginName + (flag? onHtml : offHtml);
						 toggleFunction(flag);
				});
				return {
					addCorrectCallback: function(callback) {
						correctCallbacks.push(callback);
					},
					addIncorrectCallback: function(callback) {
						incorrectCallbacks.push(callback);
					},
					addTimerCallback: function(callback) {
						timerCallbacks.push(callback);
					}
				};
		 }
	};
}
