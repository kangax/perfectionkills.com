(function () {
  var body = document.querySelector('.post-body');
  var ad = document.querySelector('.post-ad');
  if (body && ad) {
    var blocks = Array.prototype.slice.call(body.children);
    var paragraphs = blocks.filter(function (element) {
      return element.tagName === 'P' && !element.classList.contains('source-note');
    });
    var firstSection = blocks.find(function (element) {
      if (!/^H[34]$/.test(element.tagName)) return false;
      var paragraphsBefore = paragraphs.filter(function (paragraph) {
        return paragraph.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING;
      }).length;
      return paragraphsBefore >= 2 && paragraphsBefore <= 4;
    });

    if (firstSection) {
      body.insertBefore(ad, firstSection);
    } else if (paragraphs.length) {
      paragraphs[Math.min(3, paragraphs.length - 1)].after(ad);
    } else {
      body.appendChild(ad);
    }

    ad.classList.add('is-pending');
    var container = document.getElementById('carbonads-container');
    var observer = new MutationObserver(function () {
      if (container.querySelector('#carbonads')) {
        ad.classList.remove('is-pending');
        ad.classList.add('is-loaded');
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    var adScript = document.createElement('script');
    adScript.id = '_carbonads_js';
    adScript.async = true;
    adScript.src = 'https://cdn.carbonads.com/carbon.js?serve=CKYIKK3L&placement=perfectionkillscom';
    adScript.onerror = function () {
      observer.disconnect();
      ad.hidden = true;
    };
    container.appendChild(adScript);
    window.setTimeout(function () {
      if (!ad.classList.contains('is-loaded')) {
        observer.disconnect();
        ad.hidden = true;
      }
    }, 5000);
  }

  var discussion = document.querySelector('.post-discussion');
  if (discussion) {
    discussion.addEventListener('toggle', function () {
      if (!discussion.open || discussion.dataset.loaded) return;
      discussion.dataset.loaded = 'true';
      window.disqus_shortname = 'perfectionkillscom';
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://perfectionkillscom.disqus.com/embed.js';
      document.head.appendChild(script);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.post-body pre'), function (codeBlock) {
    if (codeBlock.scrollWidth > codeBlock.clientWidth) {
      codeBlock.tabIndex = 0;
      codeBlock.setAttribute('aria-label', 'Code example; scroll horizontally to read the full line');
      codeBlock.classList.add('scrollable-code');
    }
  });
})();
