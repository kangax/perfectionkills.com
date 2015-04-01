---
layout: post
title: Know thy reference
tags:
  - js
---

# Know thy reference
### Abusing leaky abstractions for a better understanding of "this"

It was a sunny Monday morning that I woke up to [an article on HackerNews](https://news.ycombinator.com/item?id=8713270), simply named ["This in Javascript"](http://bjorn.tipling.com/all-this). Curious to see what all the attention is about, I started skimming through. As expected, there were mentions of `this` in global scope, `this` in function calls, `this` in constructor instantiation, and so on. It was a long article. And the more I looked through, the more I realized just how **overwhelming** this topic might seem to folks unfamiliar with intricacies of `this`, especially when thrown into a myriad of various examples with seemingly random behavior.

It made me remember a moment from few years ago when I first read [Crockford's Good Parts](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742). In it, Douglas succinctly laid out a piece of information that immediately made everything much clearer in my head:

<blockquote>
  The `this` parameter is very important in object oriented programming, and its value is <b>determined by the invocation pattern</b>. There are <b>four patterns of invocation</b> in JavaScript: the <b>method invocation</b> pattern, the <b>function invocation</b> pattern, the <b>constructor invocation</b> pattern, and the <b>apply invocation</b> pattern. The patterns differ in how the bonus parameter this is initialized.
</blockquote>

Determined by invocation and only 4 cases? Well, that's certainly pretty simple.

With this thought in mind, I went back to HackerNews, wondering if anyone else thought the subject was presented as something way too complicated. I wasn't the only one. Lots of folks chimed in with the explanation similar to that from Good Parts, like [this one](https://news.ycombinator.com/item?id=8715373):

<blockquote>
  Even more simply, I'd just say:<br>
  1) The keyword "this" refers to whatever is left of the dot at call-time.<br>
  2) If there's nothing to the left of the dot, then "this" is the root scope (e.g. Window).<br>
  3) A few functions change the behavior of "this"—bind, call and apply<br>
  4) The keyword "new" binds this to the object just created
</blockquote>

Great and simple breakdown. But one point caught my attention — <i>"whatever is left of the dot at call-time"</i>. Seems pretty self-explanatory. For `foo.bar()`, `this` would refer to `foo`; for `foo.bar.baz()`, `this` would refer to `foo.bar`, and so on. But what about something like `(f = foo.bar)()`? After all, it <i>seems</i> that "whatever is left of the dot at call time" is `foo.bar`. Would that make `this` refer to `foo`?

Eager to save the world from unusual results in obscure cases, I rushed to leave a prompt comment on how the concept of "left of the dot" could be hairy. That for best results, one should understand concept of references, and their base values.

It is then that I shockingly realized that this concept of references actually hasn't been covered all that much! In fact, searching for "javascript reference" yielded anything from cheatsheets to "pass-by-reference vs. pass-by-value" discussions, and not at all what I wanted. It had to be fixed.

And so this brings me here.

I'll try to explain what these mysterious References are in Javascript (by which, of course, I mean ECMAScript) and how fun it is to learn `this` behavior through them. Once you understand References, you'll also notice that reading ECMAScript spec is much easier.

But before we continue, quick disclaimer on the excerpt from Good Parts.

### Good Parts 2.0

The book was written in the times when [ES3](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf) roamed the prairies, and now we're in a full state of [ES5](https://es5.github.io).

What changed? Not much.

There's 2 additions, or rather sub-points to the list of 4:

1. method invocation
1. function invocation
    - <span style="color: green">"use strict" mode (<i>new in ES5</i>)</span>
1. constructor invocation
1. apply invocation
    - <span style="color: green">Function.prototype.bind (<i>new in ES5</i>)</span>

Function invocation that happens in strict mode now has its `this` values set to `undefined`. Actually, it would be more correct to say that it does NOT have its `this` "coerced" to global object. That's what was happening in ES3 and what happens in ES5-non-strict. Strict mode simply [avoids that extra step](https://es5.github.io/#x10.4.3), letting `undefined` propagate through.

And then there's good old `Function.prototype.bind` which is hard to even call an addition. It's essentially call/apply wrapped in a function, permanently binding `this` value to whatever was passed to `bind()`. It's in the same bracket as `call` and `apply`, except for its "static" nature.

Alright, on to the References.

### Reference Specification Type

To be honest, I wasn't <i>that</i> surprised to find very little information on References in Javascript. After all, it's not part of the language per se. References are only a <b>mechanism</b>, [used to describe certain behaviors in ECMAScript](https://es5.github.io/#x8.7). They're not really "visible" to the outside world. They are vital for engine implementors, and users of the language don't need to know about them.

Except when understanding them brings a whole new level of clarity.

Coming back to my original "obscure" example:

{% gist kangax/9a19b45da97a522701ab %}

How do we know that 1st one's `this` references `foo`, but 2nd one — global object (or `undefined`)?

Astute readers will rightfully notice — <i>"well, the expression to the left of `()` evaluates to `f`, right after assignment; and so it's the same as calling `f()`, making this function invocation rather than method invocation."</i>

Alright, and what about this:

{% gist kangax/3667b73fce9a793b7ec5 %}

<i>"Oh, that's just grouping operator! It evaluates from left to right so it must be the same as foo.bar(), making `this` reference `foo`"</i>

{% gist kangax/1499fcaa72dcc8f18c09 %}

<i>"Strange"</i>

And how about this:

{% gist kangax/89efa9d5b02215b24f8a %}

<i>"Well... considering last example, it must be `undefined` as well then? There must be something about those parenthesis"</i>

{% gist kangax/300d61151c5e94230834 %}

<i>"Ok, I'm confused"</i>

### Theory

ECMAScript defines Reference as a "resolved name binding". It's an abstract entity that consists of three components — base, name, and strict flag. The first 2 are what's important for us at the moment.

There are 2 cases when Reference is created: in the process of <b>Identifier resolution</b> and during <b>property access</b>. In other words, `foo` creates a Reference and `foo.bar` (or `foo['bar']`) creates a Reference. Neither literals — `1`, `"foo"`, `/x/`, `{ }`, `[ 1,2,3 ]`, etc., nor function expressions — `(function(){})` — create references.

Here's a simple cheat sheet:

#### Cheat sheet

<table style="font-family: Courier New, Courier, monospace; text-align: left; border-spacing: 0; border-collapse: collapse">
  <thead>
    <tr>
      <th style="width: 250px; font-weight: normal; background: #888; color: #fff; padding: 5px">
        Example
      </th>
      <th style="width: 200px; font-weight: normal; background: #888; color: #fff; padding: 5px">
        Reference?
      </th>
      <th style="width: 400px; font-weight: normal; background: #888; color: #fff; padding: 5px">
        Notes
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">"foo"</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px"></td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">123</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px"></td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">/x/</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px"></td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">({})</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px"></td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(function(){})</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px"></td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">foo</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Could be unresolved reference if `foo` is not defined</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">foo.bar</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Property reference</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(123).toString</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Property reference</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(function(){}).toString</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Property reference</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(1,foo.bar)</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px">Already evaluated, BUT see grouping operator exception</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(f = foo.bar)</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #fcc">No</td>
      <td style="border: 1px solid #ccc; padding: 5px">Already evaluated, BUT see grouping operator exception</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(foo)</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Grouping operator does not evaluate reference</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 5px">(foo.bar)</td>
      <td style="border: 1px solid #ccc; padding: 5px; background: #cfc">Yes</td>
      <td style="border: 1px solid #ccc; padding: 5px">Ditto with property reference</td>
    </tr>

  </tbody>
</table>

Don't worry about last 4 for now; we'll take a look at those shortly.

Every time a Reference is created, its components — "base", "name", "strict" — are set to some values. The strict flag is easy — it's there to denote if code is in strict mode or not. The "name" component is set to identifier or property name that's being resolved, and the base is set to either property object or environment record.

It might help to think of References as <b>plain JS objects with a null \[\[Prototype\]\]</b> (i.e. with no "prototype chain"), containing only "base", "name", and "strict" properties; this is how we can illustrate them below:

When Identifier `foo` is resolved, a Reference is created like so:

{% gist kangax/f910ea9f7c0fc83ff1ec %}

and this is what's created for property accessor `foo.bar`:

{% gist kangax/21accb720a8786346382 %}

This is a so-called "Property Reference".

There's also a 3rd scenario — Unresolvable Reference. When an Identifier can't be found anywhere in the scope chain, a Reference is returned with base value set to `undefined`:

{% gist kangax/4500d751162c23f6b682 %}

As you probably know, Unresolvable References could blow up if not "properly used", resulting in an infamous ReferenceError ("foo is not defined").

Essentially, References are a simple mechanism of representing name bindings; it's a way to abstract both object-property resolution and variable resolution into a unified data structure — base + name — whether that base is a regular JS object (as in property access) or an Environment Record (a link in a "scope chain", as in identifier resolution).

So what's the use of all this? Now that we know what ECMAScript does under the hood, how does this apply to `this` behavior, `foo()` vs. `foo.bar()` vs. `(f = foo.bar)()` and all that?

### Function call

What do `foo()`, `foo.bar()`, and `(f = foo.bar)()` all have in common? They're function calls.

If we take a look at [what happens when Function Call takes place](https://es5.github.io/#x11.2.3), we'll see something very interesting:

{% gist kangax/07c8ed3d6309dba23648 %}

Notice highlighted step 6, which basically explains both #1 and #2 from Crockford's list of 4.

We take expression before `()`. Is it a property reference? (`foo.bar()`) Then use its base value as `this`. And what's a base value of `foo.bar`? We already know that it's `foo`. Hence `foo.bar()` is called with `this=foo`.

Is it NOT a property reference? Ok, then it must be a regular reference with Environment Record as its base — `foo()`. In that case, use ImplicitThisValue as `this` (and ImplicitThisValue of Environment Record is [always set to `undefined`](https://es5.github.io/#x10.2.1.1.6)). Hence `foo()` is called with `this=undefined`.

Finally, if it's NOT a reference at all — `(function(){})()` — use `undefined` as `this` value again.

Are you feeling like this right now?

<img src="/images/matrix.jpg">

### Assignment, comma, and grouping operators

Armed with this knowledge, let's see if if we can explain `this` behavior of `(f = foo.bar)()`, `(1,foo.bar)()`, and `(foo.bar)()` in terms more robust than "whatever is left of the dot".

Let's start with the first one. The expression in question is known as Simple Assignment (=). `foo = 1`, `g = function(){}`, and so on. If we look at the steps taken to evaluate [Simple Assignment](https://es5.github.io/#x11.13.1), we'll see one important detail:

{% gist kangax/c59daa515bee3c9e98f0 %}

Notice that the expression on the right is passed through internal `GetValue()` before assignment. `GetValue()` in its turn, <b>transforms `foo.bar` Reference into an actual function object</b>. And of course then we proceed to the usual Function Call with NOT a reference, which results in `this=undefined`. As you can see, `(f = foo.bar)()` only looks similar to `foo.bar()` but is actually "closer" to `(function(){})()` in a sense that it's an (evaluated) expression rather than an (untouched) Reference.

The same story happens with comma operator:

{% gist kangax/19508cf03171137a6234 %}

`(1,foo.bar)()` is evaluated as a function object and Function Call with NOT a reference results in `this=undefined`.

Finally, what about grouping operator? Does it also evaluate its expression?

{% gist kangax/f4e49e362db9e2a7f7eb %}

And here we're in for surprise!

Even though it's so similar to `(1,foo.bar)()` and `(f = foo.bar)()`, grouping operator does NOT evaluate its expression. It even says so plain and simple — it may return a reference; no evaluation happens. This is why `foo.bar()` and `(foo.bar)()` are absolutely identical, having `this` set to `foo` since a Reference is created and passed to a Function call.

### Returning References

It's worth mentioning that ES5 spec technically [allows function calls to return a reference](https://es5.github.io/#x8.7). However, this is only reserved for host objects, and none of the built-in (or user-defined) functions do that.

An example of this (non-existent, but permitted) behavior is something like this:

{% gist kangax/36c3ae7b3e446c394197 %}

Of course, the current behavior is that non-Reference is passed to a Function call, resulting in this=undefined/global object (unless `bar` was already bound to `foo` earlier).

### typeof operator

Now that we understand References, we can take a look in few other places for a better understanding. Take, for example, [typeof operator](https://es5.github.io/#x11.4.3):

{% gist kangax/1b0c46898331cf92b540 %}

Here is that "secret" for why we can pass unresolvable reference to `typeof` and not have it blow up.

On the other hand, if we were to use unresolvable reference without `typeof`, as a [plain statement](https://es5.github.io/#x12.4) somewhere in code:

{% gist kangax/b2c453a43b4687225ed8 %}

Notice how Reference is passed to GetValue() which is then responsible for stopping execution if Reference is an unresolvable one. It all starts to make sense.

### delete operator

Finally, what about good old [delete operator](https://es5.github.io/#x11.4.1)?

{% gist kangax/3ca8c2a1e141ee4f3c3d %}

What might have looked like mambo-jumbo is now pretty nice and clear:

- If it's not a reference, return true (`delete 1`, `delete /x/`)
- If it's unresolvable reference (`delete iDontExist`)
  - if in strict mode, throw SyntaxError
  - if not in strict mode, return true
- If it's a property reference, actually try to delete a property (`delete foo.bar`)
- If it's a reference with Environment Record as base (`delete foo`)
  - if in strict mode, throw SyntaxError
  - if not in strict mode, attempt to delete it (further algorithm follows)

### Summary

And that's a wrap!

Hopefully you now understand the underlying mechanism of References in Javascript; how they're used in various places and how we can "utilize" them to explain `this` behavior even in non-trivial constructs.

Note that everything I mentioned in this post was <b>based on ES5</b>, being current standard and the most implemented one at the moment. [ES6](people.mozilla.org/~jorendorff/es6-draft.html) might have some changes, but that's a story for another day.

If you're curious to know more — check out [section 8.7 of ES5 spec](https://es5.github.io/#x8.7), including internal methods `GetValue()`, `PutValue()`, and more.

P.S. Big thanks to [Rick Waldron](https://twitter.com/rwaldron) for review and suggestions!
