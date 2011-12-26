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
		var statusEl = $('status');
		var currentValue;
		var plugins = new Array();

		function doCallbacks(hook) {
			for (var i=0; i<plugins.length; i++) {
				var plugin = plugins[i];
				if (plugin.isEnabled()) {
					var callback = plugin.getCallback(hook);
					if (typeof callback === 'function') {
						callback();
					}
				}
			}
		}
		function randomiseOptions() {
			var choicesEl = document.getElementById('choices');
			var choices = new Array();
			while (choicesEl.children.length > 0) {
				var element = choicesEl.children[0];
				choicesEl.removeChild(element);
				choices.push(element);
			}
			while (choices.length > 0) {
				var index = Math.floor(Math.random() * choices.length);
				choicesEl.appendChild(choices[index]);
				choices = choices.slice(0, index).concat(choices.slice(index + 1));
			}
		}

		var timer;
		window.timerSupport = function() {
			doCallbacks('timer');
			timer = setTimeout("timerSupport()", 1000);
		};
		timerSupport();

		function answerGiven(value) {
				if (typeof value === 'undefined' || value === currentValue) {
						choicesEl.innerHTML = '';
						var i = Math.floor(Math.random() * Object.keys(data).length);
						currentValue = Object.keys(data)[i];
						questionEl.innerHTML = currentValue;
						choicesEl.appendChild(createChoice(currentValue, data[currentValue]));

						var left = Object.keys(data);
						left = left.slice(0, i).concat(left.slice(i+1));
						for (var i=0; i<4; i++) {
							var j = Math.floor(Math.random() * Object.keys(left).length);
							console.log(Object.keys(left), j);
							var key = left[j];
							var choiceEl = createChoice(key, data[key]);
							console.log(key, data[key]);
							choicesEl.appendChild(choiceEl);
							left = left.slice(0, j).concat(left.slice(j+1));
						}
					 
					randomiseOptions();
					// Hacks breed hacks. This avoids flashing green upon initialisation.
					if (typeof value !== 'undefined') {
							statusEl.style.backgroundColor = 'green';
							window.setTimeout("document.getElementById('status').style = ''", 300);
						}
						
					doCallbacks('correct');
				} else {
					doCallbacks('incorrect');
					statusEl.style.backgroundColor = 'red';
					var setStyle = "document.getElementById('status').style = ''";
					window.setTimeout(setStyle, 300); }
		}

		function createChoice(key, value) {
				var choiceEl = document.createElement("div");
				choiceEl.className = 'choice';
				var hint = '<div class="hint">'+key+'</div>';
				choiceEl.innerHTML = hint + '<span class="option">'+value+'<span>';
				choiceEl.addEventListener('click', function() {
					answerGiven(key);
				}, false);

				return choiceEl;
		}

		answerGiven(); // initialise

		return {

plugin: function (pluginName, toggleFunction) {
				 var hooks = {};
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
				var thePlugin = {
					isEnabled: function() { return flag; }
					,getCallback: function(hook) { return hooks[hook]; }
					,setCallback: function(hook, callback) { hooks[hook] = callback; }
				};
				plugins.push(thePlugin);
				return thePlugin;
				}
,getAnswer: function() { return data[currentValue]; }
,randomiseOptions: randomiseOptions
};
}
