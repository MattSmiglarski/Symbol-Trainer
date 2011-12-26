function doPlugins(game) {
		function standardPlugin(name) {
			var wrapper = document.createElement('div');
			var label = document.createElement('span');
			var data = document.createElement('span');
			label.innerHTML = name + ': ';
			wrapper.appendChild(label);
			wrapper.appendChild(data);
			wrapper.className = 'awesome plugin';
			wrapper.style.display = 'none';
			wrapper.style.display = 'none';
			document.getElementById('status').appendChild(wrapper);

			var plugin = game.plugin(name, function(flag) {
				wrapper.style.display = flag? 'block' : 'none';
			});
			plugin.updateValue = function(value) {
				data.innerHTML = value;
			};
			plugin.retrieveValue = function() {
				return parseInt(data.innerHTML);
			};
			plugin.incrementValue = function() {
				var newValue = this.retrieveValue() + 1;
				this.updateValue(newValue);
			};
			return plugin;
		}
		var scorePlugin = standardPlugin('Correct');
		scorePlugin.setCallback('correct', function() {
			scorePlugin.incrementValue();
		});
		scorePlugin.updateValue(0);
		var incorrectScorePlugin = standardPlugin('Incorrect');
		incorrectScorePlugin.setCallback('incorrect', function() {
			incorrectScorePlugin.incrementValue();
		});
		incorrectScorePlugin.updateValue(0);
		var revealPlugin = standardPlugin('Reveal');
		revealPlugin.setCallback('correct', function() {
			revealPlugin.updateValue(game.getAnswer());
		});
		revealPlugin.updateValue(game.getAnswer());
		var timerPlugin = standardPlugin('Timer');
		timerPlugin.setCallback('timer', function() {
			timerPlugin.incrementValue();
		});
		timerPlugin.updateValue(0);
		var romanjiPlugin = game.plugin('Romanji', function(flag) {
			var hints = document.getElementsByClassName('hint');
			for (var i=0; i<hints.length; i++) {
				hints[i].style.display = (flag? 'block' : 'none');
			}
		});
		var randomisePlugin = game.plugin('Randomise', function(flag) {});
		randomisePlugin.setCallback('correct', function() {
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
		});
}
