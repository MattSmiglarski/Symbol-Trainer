var tableValues = [
 '&#x3042;'
,'&#x3044;'
,'&#x3046;'
,'&#x3048;'
,'&#x304A;'

,'&#x304B;'
,'&#x304D;'
,'&#x304F;'
,'&#x3051;'
,'&#x3053;'

,'&#x304C;'
,'&#x304E;'
,'&#x3050;'
,'&#x3052;'
,'&#x3054;'

,'&#x3055;'
,'&#x3057;'
,'&#x3059;'
,'&#x305B;'
,'&#x304D;'

,'&#x3056;'
,'&#x3058;'
,'&#x305A;'
,'&#x305C;'
,'&#x305E;'

,'&#x305F;'
,'&#x3061;'
,'&#x3064;'
,'&#x3066;'
,'&#x3068;'

,'&#x3060;'
,''
,''
,'&#x3067;'
,'&#x3069;'

,'&#x306A;'
,'&#x306B;'
,'&#x306C;'
,'&#x306D;'
,'&#x306E;'

,'&#x306F;'
,'&#x3072;'
,'&#x3075;'
,'&#x3078;'
,'&#x307B;'

,'&#x3070;'
,'&#x3073;'
,'&#x3076;'
,'&#x3079;'
,'&#x307C;'

,'&#x3071;'
,'&#x3074;'
,'&#x3077;'
,'&#x307A;'
,'&#x307D;'

,'&#x307E;'
,'&#x307F;'
,'&#x3080;'
,'&#x3081;'
,'&#x3082;'

,'&#x3084;'
,''
,'&#x3086;'
,''
,'&#x3088;'

,'&#x3089;'
,'&#x308A;'
,'&#x308B;'
,'&#x308C;'
,'&#x308D;'

,'&#x308F;'
,null
,null
,null
,'&#x3092;'

,null
,null
,null
,null
,'&#x3093;'
];

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

function createGridChoice(game, target, value) {
	var choiceEl = document.createElement("div");
	var hint, ideograph;

	if (value && !document.getElementById('value')) {
		hint = document.createElement('div');
		hint.className = "hint";
		hint.innerHTML = hiragana[value];

		ideograph = document.createElement('div');
		ideograph.className = 'option';
		ideograph.innerHTML = value;
		ideograph.id = value;
		
		choiceEl.appendChild(hint);
		choiceEl.appendChild(ideograph);
		choiceEl.setAttribute('data-title', hiragana[value]);
	}
	if (value != null){
		choiceEl.className = 'choice';
	}
	target.appendChild(choiceEl);
	choiceEl.addEventListener('click', function() {
		game.answer(value);
	});
	return choiceEl;
}

function createGrid(game) {
var config = {
	target: document.getElementById('grid'),
	setValue: function(target, value) { createGridChoice(game, target, value); },
	columnSpans: [1,1,1,1,1,3,1,2,2,2,1,1],
};
var grid = G.create(5, 16, config);
var i;
var row = 0;
var col = 15;

for (i = 0; i < tableValues.length; i+=1) {
	grid.setValue(row, col, tableValues[i]);
	if (row < 4) {
		row+=1;
	} else if (row === 4) {
		row = 0;
		col-=1;
	} else {
		throw "Too much data for grid?";
	}
}
}

var gridGame= (function () {
	return {
nextValue: (function() {
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
			}()),
		createChoiceElement: function(game, key, value) {},
		questionsHook: function() {},
		init: createGrid
	};
}());

