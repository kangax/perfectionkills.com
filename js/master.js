(function(){
  function addPermalinkToHeader(header) {
    if (header.id) {
      var permalink = document.createElement('a');
      permalink.href = '#' + header.id;
      permalink.className = 'heading-permalink';
      permalink.textContent = '§';
      permalink.setAttribute('aria-label', 'Link to section: ' + header.textContent.trim());
      header.appendChild(permalink);
    }
  }
  var headers = document.getElementsByTagName('h3');
  for (var i = headers.length; i--; ) {
    addPermalinkToHeader(headers[i]);
  }
  headers = document.getElementsByTagName('h4');
  for (var i = headers.length; i--; ) {
    addPermalinkToHeader(headers[i]);
  }
  headers = document.getElementsByTagName('h5');
  for (var i = headers.length; i--; ) {
    addPermalinkToHeader(headers[i]);
  }
})();

(function(d) {
  var script = d.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JMMHN1E71L';
  d.head.appendChild(script);
})(document);
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JMMHN1E71L');

(function () {
  var filters = document.querySelector('.archive-filters');
  if (!filters) return;

  var buttons = Array.prototype.slice.call(filters.querySelectorAll('.topic'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.archive-year-section'));
  var posts = Array.prototype.slice.call(document.querySelectorAll('.post-list li'));
  var status = document.getElementById('archive-status');
  filters.hidden = false;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var selected = button.getAttribute('data-tags');
      var selectedTags = selected.split(' ');
      var shown = 0;

      buttons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('selected', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      posts.forEach(function (post) {
        var tags = (post.getAttribute('data-tags') || '').split(' ');
        var visible = selected === 'all' || selectedTags.some(function (tag) {
          return tags.indexOf(tag) !== -1;
        });
        post.hidden = !visible;
        if (visible) shown++;
      });

      years.forEach(function (year) {
        year.hidden = !year.querySelector('.post-list li:not([hidden])');
      });

      status.textContent = shown + (shown === 1 ? ' post' : ' posts');
    });
  });
})();
