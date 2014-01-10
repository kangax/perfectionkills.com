---
layout: post
title: Fabric.js 0.5 is out
tags:
  - js
---

<h2>Fabric.js 0.5 is out</h2>

<img src="/images/kitchensink.png" style="box-shadow:rgba(0,0,0,0.3) 0 0 5px">

<p>Remember that <a href="http://kangax.github.com/fabric.js/demos/kitchensink/">fabulous canvas library</a> that makes working with canvas a breeze? The one that can <a href="http://www.slideshare.net/kangax/fabric-falsy-values-8067834/28">parse SVG files</a> on the fly and fluently draw them on canvas; that can render <a href="http://www.slideshare.net/kangax/fabric-falsy-values-8067834/22">complex text</a> in real time; that can morph objects with a touch of a mouse; with sophisticated, programmatically-accessible <a href="http://www.slideshare.net/kangax/fabricjs-building-acanvaslibrarybk/18">object model</a>; <a href="http://kangax.github.com/fabric.js/demos/ladybug/">easy to use animation</a> and <a href="http://kangax.github.com/fabric.js/demos/events/">event infrastructure</a>?</p>

<p>Why yes, of course I&#8217;m talking about <a href="https://github.com/kangax/fabric.js">Fabric.js</a> ;)</p>

<p>Version 0.5 is out and here&#8217;s a quick overview of 3 main changes:</p>

<h3 id="nodejs_npm_support">Node.js &amp; NPM support</h3>

<p>Fabric can now run on a server, under <a href="http://nodejs.org/">Node.js</a>, thanks to wonderful <a href="https://github.com/tmpvar/jsdom">jsdom</a> and <a href="http://blog.learnboost.com/blog/introducing-node-canvas-server-side-html5-canvas-api/">node-canvas</a> libraries. It's basically a wrapper on top of <b>node-canvas</b> that's on top of <b>jsdom</b> that's on top of <b>node</b>.</p>

<p>Fabric is also registered as <a href="http://search.npmjs.org/#/fabric">NPM package</a>, so can be installed with the usual one-liner:</p>

<pre lang="javascript"><code>
> npm install fabric</code></pre>

<p>Here&#8217;s how you would use it:</p>

<pre lang="javascript"><code>
var fabric = require('fabric').fabric,
    canvas = fabric.createCanvasForNode(200, 200);

canvas.add(new fabric.Rect({
  top: 100,
  left: 100,
  width: 100,
  height: 50,
  angle: 30,
  fill: 'rgba(255,0,0,0.5)'
}));

var out = require('fs').createWriteStream(__dirname + '/rectangle.png'),
    stream = canvas.createPNGStream();

stream.on('data', function(chunk) {
  out.write(chunk);
});
</code></pre>

<p>.. and here&#8217;s what the resulting image would be — 30&deg; rotated half-transparent, red rectangle.</p>

<p><img src="/images/rect.png" style="box-shadow:rgba(0,0,0,0.3) 0 0 5px"></p>

<p>I'm really excited about Node support in fabric. We'll be using it in production on <a href="http://printio.ru">Printio.ru</a> shortly.</p>

<h3 id="custom_builder">Custom builder</h3>

<p>It&#8217;s now possible to create custom fabric build, including only those modules that you need. The build process was rewritten to use Node.js instead of <a href="http://getsprockets.org/">Sprockets</a>. Building can only be done via command line for now. Online interface is likely to come in the future:</p>

<pre lang="javascript"><code>
> node build.js modules=xxx,yyy,zzz
</code></pre>

<p>.. where &#8220;xxx&#8221;, &#8220;yyy&#8221;, and &#8220;zzz&#8221; are the names of the modules. Currently available modules are &#8220;text&#8221;, &#8220;serialization&#8221;, &#8220;parser&#8221;, and &#8220;node&#8221;. By default none of these modules are included. If you wish to include all of the modules, you can use &#8220;ALL&#8221; keyword:</p>

<pre lang="javascript"><code>
> node build.js modules=ALL
</code></pre>

<h3 id="smaller_footprint">Smaller footprint</h3>

<p>By moving some of the functionality into optional modules (e.g. &#8220;parser&#8221; and &#8220;serialization&#8221;), default minimalistic version of fabric is now ~76KB (~22KB gzipped). There&#8217;s still more reduction that can be done, so expect even smaller footprint in the near future.</p>

<p>Enjoy.</p>
