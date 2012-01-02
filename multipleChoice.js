function doOne(data, gameConfig) {
		if (typeof $ === 'undefined') var $ = function(id) { return document.getElementById(id); }

		if (typeof Object.keys != 'function') {
				Object.keys = function(obj) {
						if (typeof obj != "object" && typeof obj != "function" || obj == null) {
								throw TypeError("Object.keys called on non-object");
						} 
						var keys = [];
						for (var p in obj) obj.hasOwnProperty(p) && keys.push(p);
						return keys;
				}
		}

		var choicesEl = $('choices');
		var statusEl = $('status');
		var currentValue;
		var plugins = new Array();
		var config = {};
		var hooks = {};

		function doCallbacks(hook) {
			var i, callback, plugin;

			if (hooks[hook]) {
				for (i=0; i<hooks[hook].length; i+=1) {
					hooks[hook][i]();
				}
			}

			for (i=0; i<plugins.length; i+=1) {
				plugin = plugins[i];
				if (plugin.isEnabled()) {
					callback = plugin.getCallback(hook);
					if (typeof callback === 'function') {
						callback();
					}
				}
			}
		}

		var timer;
		window.timerSupport = function() {
			doCallbacks('timer');
			timer = setTimeout("timerSupport()", 1000);
		};
		//timerSupport();

		function nextQuestion() {
			currentValue = gameConfig.nextValue();
			doCallbacks('question');
		}

		function answerGiven(value) {
			if (value === currentValue) {
				nextQuestion();
				statusEl.style.backgroundColor = 'green';
				window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);
				doCallbacks('correct');
			} else {
				doCallbacks('incorrect');
				statusEl.style.backgroundColor = 'red';
				var setStyle = "document.getElementById('status').style.backgroundColor = ''";
				window.setTimeout(setStyle, 300);
			}
		}
 		
		return {

plugin: function (pluginName, toggleFunction) {
				var hooks = {};
				var flag = false;
				var configEl = document.createElement('a');
				var onHtml = ' <span style="color: blue;">On</span>/Off';
				var offHtml = ' On/<span style="color: blue;">Off</span>';

				configEl.innerHTML = pluginName + offHtml;
				configEl.className = 'awesome config';

				document.getElementById('config').appendChild(configEl);

				configEl.addEventListener('click', function() {
						 flag = !flag;
						 configEl.innerHTML = pluginName + (flag? onHtml : offHtml);
						 toggleFunction(flag);
				}, false);
				var thePlugin = {
					isEnabled: function() { return flag; }
					,getCallback: function(hook) { return hooks[hook]; }
					,setCallback: function(hook, callback) { hooks[hook] = callback; }
				};
				plugins.push(thePlugin);
				return thePlugin;
			}
,getQuestion: function() { return data[currentValue]; }
,getAnswer: function() { return currentValue; }
,answer: answerGiven
,addHook: function(hook, callback) {
	if (!hooks[hook]) {
		hooks[hook] = new Array();
	}
	hooks[hook].push(callback);
}
,start: function() { nextQuestion(); }
};
}
