(function(){
  function byId(id) {
    return document.getElementById(id);
  }
  byId('submitter').onclick = function() {

    var wrongAnswers = [ ];

    if (!byId('answer-1-1').checked) { wrongAnswers.push(1); }
    if (!byId('answer-2-4').checked) { wrongAnswers.push(2); }
    if (!byId('answer-3-1').checked) { wrongAnswers.push(3); }
    if (!byId('answer-4-4').checked) { wrongAnswers.push(4); }
    if (!byId('answer-5-1').checked) { wrongAnswers.push(5); }
    if (!byId('answer-6-1').checked) { wrongAnswers.push(6); }
    if (!byId('answer-7-1').checked) { wrongAnswers.push(7); }
    if (!byId('answer-8-2').checked) { wrongAnswers.push(8); }
    if (!byId('answer-9-3').checked) { wrongAnswers.push(9); }
    if (!byId('answer-10-2').checked) { wrongAnswers.push(10); }
    if (!byId('answer-11-1').checked) { wrongAnswers.push(11); }
    if (!byId('answer-12-2').checked) { wrongAnswers.push(12); }
    if (!byId('answer-13-1').checked) { wrongAnswers.push(13); }
    if (!byId('answer-14-2').checked) { wrongAnswers.push(14); }

    var message;

    if (wrongAnswers.length === 0) {
      message = 'Flawless victory.';
    }
    else if (wrongAnswers.length <= 7) {
      message = 'Very good, but not quite there yet.';
    }
    else if (wrongAnswers.length < 14) {
      message = 'That\'s more than a half :(';
    }
    else {
      message = 'Ouch.';
    }

    var prefix = (wrongAnswers.length === 14) ? 'all ' : '';

    document.getElementById('quiz-result').innerHTML = (
      'You\'ve got ' + prefix + '<strong>' + wrongAnswers.length +
      '</strong> answer'+ (wrongAnswers.length === 1 ? '' : 's') +
      ' wrong' + ((wrongAnswers.length > 0) ? (' (' + '#' + wrongAnswers.join(', #') + ')') : '')
      + '.<br>' + message);
  };
})();
