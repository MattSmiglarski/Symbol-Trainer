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
		answerCallback(key, choiceEl.increment, choiceEl.decrement);
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
var game = doOne(hiragana, {
	questionsHook: config.questionsHook
});

game.addHook('question', function() {
	var statusBar = document.getElementById('status');
	var questionEl = document.createElement('div');
	questionEl.className = 'awesome question';
	questionEl.innerHTML = game.getQuestion();
	statusBar.insertBefore(questionEl, statusBar.children[0]);
});

game.addHook('correct', function() {
	document.getElementById('status').style.backgroundColor = 'green';
	window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);

});
game.addHook('incorrect', function() {
	document.getElementById('status').style.backgroundColor = 'red';
	document.getElementById('status').children[0].style.backgroundColor = 'red';
	window.setTimeout("document.getElementById('status').style.backgroundColor = ''", 300);

});

var cheapRefreshPlugin = game.plugin('Refresh', function() {
	document.location = document.location;
});
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


game.restrictRow = config.restrictRow;
game.restrictCol = config.restrictCol;
if (config.init) config.init(game);
game.start();
return game;
}
