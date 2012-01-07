function doOne(data, config) {
		var currentValue;
		var plugins = new Array();
		var config = config || {};
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
			currentValue = config.questionsHook(answer);
			doCallbacks('question');
		};

		function answer(value, onCorrect, onIncorrect) {
			if (value === currentValue) {
				doCallbacks('correct');
				if (onCorrect) onCorrect(currentValue);
			} else {
				doCallbacks('incorrect');
				if (onIncorrect) onIncorrect(currentValue);
			}
			nextQuestion();
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
				function enable() {
					flag = true;
					configEl.innerHTML = pluginName + onHtml;
					toggleFunction(true);
				}
				function disable() {
					flag = false;
					configEl.innerHTML = pluginName + offHtml;
					toggleFunction(false);
				}
				function toggle() {
					if (flag) disable(); else enable();
				}
				configEl.addEventListener('click', toggle, false);
				var thePlugin = {
					isEnabled: function() { return flag; }
					,toggle: toggle
					,enable: enable
					,disable: disable
					,getCallback: function(hook) { return hooks[hook]; }
					,setCallback: function(hook, callback) { hooks[hook] = callback; }
				};
				plugins.push(thePlugin);
				return thePlugin;
			}
,getQuestion: function() { return data[currentValue]; }
,getAnswer: function() { return currentValue; }
,answer: answer
,addHook: function(hook, callback) {
	if (!hooks[hook]) {
		hooks[hook] = new Array();
	}
	hooks[hook].push(callback);
}
,start: function() { nextQuestion(); }
};
}
