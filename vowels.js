var vowelGame = (function () {
	return {
		nextValue: function() { return '&#x3042;'; },

		createChoiceElement: createChoice,

		questionsHook: function(game) {
			var answer = game.getAnswer();
			var ideograph = document.getElementById(answer);
			var choicesEl = document.getElementById('choices');
			var limit = 5;
			var data = hiragana; 
			var currentValue = game.getAnswer();
			var left = Object.keys(data);
			var j, key, choiceEl;

			ideograph && (ideograph.style.display = 'block');
			choicesEl.innerHTML = '';
			left = left.slice(0, i).concat(left.slice(i+1));
			for (var i=0; i<limit - 1; i++) {
				j = Math.floor(Math.random() * Object.keys(left).length);
				key = left[j];
				choiceEl = createChoice(game, key, data[key]);
				choicesEl.appendChild(choiceEl);
				left = left.slice(0, j).concat(left.slice(j+1));
			}
			var x = createChoice(game, currentValue, data[currentValue]);
			choicesEl.insertBefore(x, choicesEl.children[Math.floor(Math.random() * (choicesEl.children.length+1))]);
		},
			};
}());

