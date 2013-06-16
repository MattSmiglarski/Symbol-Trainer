// Common data
var messages = {
	start: '&lt;&mdash;&mdash;&mdash;&mdash; Questions appear over there. Click the squiggle below to answer.',
	grid: 'This is the standard hiragana layout. It is read top to bottom, right to left.',
	vowels: 'You are now being tested on the vowels &#x3042;, &#x3044; &#x3046;, &#x3048;, &#x304A;. The hints will disappear on the next set of questions.',
	gameOver: 'Game over',
	end: {}
}



tableValues = [
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
,'&#x305D;'],

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

// Aliases
var m = messages;
var data = hiragana; 
var h = Object.keys(hiragana);

var levels = [
{ options: [h[0]], questions: [h[0]], hints: true, mode: 'multichoice' },
{ questions: row(0), hints: true, mode: 'grid', msg: m.grid },
{ questions: row(1), hints: true, mode: 'grid', msg: 'Column 2'},
{ questions: row(2), hints: true, mode: 'grid', msg: 'Column 3' },
{ questions: col(2), hints: true, mode: 'grid', msg: 'Row 3' },
{ questions: ['&#x304B;','&#x307F;','&#x304B;','&#x305C;'], mode: 'grid', msg: 'Kamikaze', hints: true },
{ questions: dup(0, 4), options: arrOfSize(2), mode: 'multichoice', msg: 'Find the ' + h[0] + ' symbol' },
{ questions: dup(0, 5), options: arrOfSize(8), mode: 'multichoice'},
{ questions: row(0), options: row(0), hints: true, mode: 'multichoice', msg: m.vowels},
{ questions: row(0), options: row(0), mode: 'multichoice'},
{ questions: dup(0, 5), options: arrOfSize(5), mode: 'multichoice' },
{ questions: dup(0, 5), options: arrOfSize(11), mode: 'multichoice' },
{ options: row(0), questions: row(0), hints: true, mode: 'multichoice' },
{ options: row(0), questions: row(0), mode: 'multichoice' },
{ questions: row(0), options: arrOfSize(6), mode: 'multichoice' },
{ questions: row(0), options: arrOfSize(11), mode: 'multichoice' },
{ questions: row(0), options: arrOfSize(22), mode: 'multichoice' },
{ questions: row(0), options: arrOfSize(33), mode: 'multichoice' }
];




function setup() {
	var config = {
	target: document.getElementById('grid'),
	data: tableValues,
	setValue: setGridValue
	};
	grid = G.create(5, 16, config);

	for (var i=0; i<h.length; i+=1) {
		choiceElements[h[i]] = createChoiceWidget(answer, h[i], hiragana[h[i]]);
	}
	message(m.start);
	nextQuestion();
}

document.addEventListener('DOMContentLoaded', setup, false);
