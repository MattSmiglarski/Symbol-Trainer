var h = Object.keys(hiragana);
var tableValues = [
['&#x3042;'
,'&#x3044;'
,'&#x3046;'
,'&#x3048;'
,'&#x304A;'],

['&#x304B;'
,'&#x304D;'
,'&#x304F;'
,'&#x3051;'
,'&#x3053;'],

['&#x304C;'
,'&#x304E;'
,'&#x3050;'
,'&#x3052;'
,'&#x3054;'],

['&#x3055;'
,'&#x3057;'
,'&#x3059;'
,'&#x305B;'
,'&#x304D;'],

['&#x3056;'
,'&#x3058;'
,'&#x305A;'
,'&#x305C;'
,'&#x305E;'],

['&#x305F;'
,'&#x3061;'
,'&#x3064;'
,'&#x3066;'
,'&#x3068;'],

['&#x3060;'
,''
,''
,'&#x3067;'
,'&#x3069;'],

['&#x306A;'
,'&#x306B;'
,'&#x306C;'
,'&#x306D;'
,'&#x306E;'],

['&#x306F;'
,'&#x3072;'
,'&#x3075;'
,'&#x3078;'
,'&#x307B;'],

['&#x3070;'
,'&#x3073;'
,'&#x3076;'
,'&#x3079;'
,'&#x307C;'],

['&#x3071;'
,'&#x3074;'
,'&#x3077;'
,'&#x307A;'
,'&#x307D;'],

['&#x307E;'
,'&#x307F;'
,'&#x3080;'
,'&#x3081;'
,'&#x3082;'],

['&#x3084;'
,''
,'&#x3086;'
,''
,'&#x3088;'],

['&#x3089;'
,'&#x308A;'
,'&#x308B;'
,'&#x308C;'
,'&#x308D;'],

['&#x308F;'
,null
,null
,null
,'&#x3092;'],

[null
,null
,null
,null
,'&#x3093;'],
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

function createGridChoice(answerCallback, target, value) {
	target.appendChild(createChoice(answerCallback, value, hiragana[value]));
}

function createGrid(game) {
	var config = {
target: document.getElementById('grid'),
	setValue: function(target, value) { createGridChoice(game, target, value); },
	columnSpans: [1,1,1,1,1,3,1,2,2,2,1,1],
	};
	var grid = G.create(5, 16, config);
	var row, col;

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

var gridGame= (function () {
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
		//	mode = 'grid';
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

