var game;

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

function createChoice(value) {
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
	this.appendChild(choiceEl);
	choiceEl.addEventListener('click', function() {
		game.answer(value);
	});
}

var strategy = (function() {
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


window.onload = function() {
var config = {
	target: document.getElementById('choices'),
	setValue: createChoice,
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

game = doOne(hiragana, {
	nextValue: strategy
});
game.addHook('question', function() {
	var question = game.getQuestion();
	var answer = game.getAnswer();

	var questionEl= document.getElementById('question');
	var ideograph = document.getElementById(answer);
	ideograph && (ideograph.style.display = 'block');
	questionEl.innerHTML = question;
});
game.start();

var cheapRefreshPlugin = game.plugin('Refresh', function() {document.location = document.location;});
var romanjiPlugin = game.plugin('Romanji', function(flag) {
	var hints = document.getElementsByClassName('hint');
	for (var i=0; i<hints.length; i++) {
		hints[i].style.display = (flag? 'block' : 'none');
	}
});

var soundPlugin = game.plugin('Sound', function(flag) {});
soundPlugin.setCallback('incorrect', (function() {
	var incorrectAudio = new Audio();
	incorrectAudio.src = 'dialog-error.ogg';
	incorrectAudio.load();

	return function() {
		incorrectAudio.play();
	}
}()));
soundPlugin.setCallback('correct', (function() {
	function s(filename) {
		var pronounciationAudio = new Audio();
		pronounciationAudio.src = 'audio/' + filename + '.wav';
		pronounciationAudio.load();
		return pronounciationAudio;
	}

	var sounds;

	function init() {
	sounds = {
 '&#x3042;':s('a')
,'&#x3044;':s('i')
,'&#x3046;':s('u')
,'&#x3048;':s('e')
,'&#x304A;':s('o')
,'&#x304B;':s('ka')
,'&#x304C;':s('ga')
,'&#x304D;':s('ki')
,'&#x304E;':s('gi')
,'&#x304F;':s('ku')
,'&#x3050;':s('gu')
,'&#x3051;':s('ke')
,'&#x3052;':s('ge')
,'&#x3053;':s('ko')
,'&#x3054;':s('go')
,'&#x3055;':s('sa')
,'&#x3056;':s('za')
,'&#x3057;':s('si')
,'&#x3058;':s('zi')
,'&#x3059;':s('su')
,'&#x305A;':s('zu')
,'&#x305B;':s('se')
,'&#x305C;':s('ze')
,'&#x305E;':s('zo')
,'&#x305F;':s('ta')
,'&#x3060;':s('da')
,'&#x3061;':s('ti')
,'&#x3064;':s('tu')
,'&#x3066;':s('te')
,'&#x3067;':s('de')
,'&#x3068;':s('to')
,'&#x3069;':s('do')
,'&#x306A;':s('na')
,'&#x306B;':s('ni')
,'&#x306C;':s('nu')
,'&#x306D;':s('ne')
,'&#x306E;':s('no')
,'&#x306F;':s('ha')
,'&#x3070;':s('ba')
,'&#x3071;':s('pa')
,'&#x3072;':s('hi')
,'&#x3073;':s('bi')
,'&#x3074;':s('pi')
,'&#x3075;':s('hu')
,'&#x3076;':s('bu')
,'&#x3077;':s('pu')
,'&#x3078;':s('he')
,'&#x3079;':s('be')
,'&#x307A;':s('pe')
,'&#x307B;':s('ho')
,'&#x307C;':s('bo')
,'&#x307D;':s('po')
,'&#x307E;':s('ma')
,'&#x307F;':s('mi')
,'&#x3080;':s('mu')
,'&#x3081;':s('me')
,'&#x3082;':s('mo')
,'&#x3084;':s('ya')
,'&#x3086;':s('yu')
,'&#x3088;':s('yo')
,'&#x3089;':s('ra')
,'&#x308A;':s('ri')
,'&#x308B;':s('ru')
,'&#x308C;':s('re')
,'&#x308D;':s('ro')
,'&#x308F;':s('wa')
,'&#x3090;':s('wi')
,'&#x3092;':s('wo')
,'&#x3093;':s('n')
	};
	}

	return function() {
		if (!sounds) init();
		var sound = sounds[game.getAnswer()];
		if (sound) {
			sound.play();
		} else {
			console.log("No sound for " + sound + ":" + game.getAnswer());
		}
	}
}()));

};
