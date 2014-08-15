# Quickie
A tiny framework for serving statics sites with node. Quickie serves up basic html pages and static assets. It also supports custom routes and render methods.

## Basic Usage
Get it from NPM. In your project's directory, simply run: 

```
$ npm install quickie
```

##### Folder Structure

Quicky looks at your templates folder and automatically configures routes to those pages. It also supplies a safe place for you to keep your static assets (css, js, images, anything you'll be attempting to access from the front-end).

If you're not planning on doing any customization, Quickie only expects that you keep your html files in a "pages" folder and your static assets in a folder called "public". Your project should probably look something like this:

```
myProject
 - node_modules
 - pages
 |-- index.html
 |-- pizza.html
 - public
 |-- css
   |-- whatever.css
 |-- images
   |-- whatever.png
 - app.js
```

This would mean you could access index.html from http://localhost:3000/ and pizza.html from http://localhost:3000/pizza. Pretty straightforward, right?

##### One line in app.js!

```javascript
var quickie = require('quickie').site(__dirname).listen();
```
Ok, so you could technically break it out into three lines for readability.

```javascript
var quickie = require('quickie');
var site = quickie.site(__dirname);
site.listen();
```

##### Any port in a storm
You can also pass any port number into the listen method (by default, it's 3000);
```javascript
var quickie = require('quickie').site(__dirname).listen(1337);
```

##### The __dirname is important
You must always pass __dirname into quickie. If you'd like to include it with other options in an object, do this:

```javascript
var quickie = require('quickie').site({
  dirname: __dirname,
  // etc.
}.listen();
```
## Available Options
##### assets (string)
Use this option if your you'd like your static assets folder to be called something other than "public".

```javascript
var quickie = require('quickie').site({
  dirname: __dirname,
  assets: 'static/',
}).listen();
```

##### templates (string)
Use this option if your you'd like your templates to live in a folder called something other than "pages".

```javascript
var quickie = require('quickie').site({
  dirname: __dirname,
  templates: 'views/',
}).listen();
```

##### render (function)
Use this option if you're trying to get fancy with a custom template rendering engine. I like to use nunjucks with mine:

```javascript
var nunjucks = require('nunjucks');

var quickie = require('quickie').site({
  dirname: __dirname,
  assets: 'static/',
  tempaltes: 'views/',
  render: function(markup, data) {
    return nunjucks.renderString(markup, data);
  }
}).listen();
```

You might be asking yourself where that data is coming from. See the next section for details on passing data through to templates using custom routes.

##### extension (string)
Use this option if your templates have a file extension other than '.html'. In the previous example, we set up nunjucks as our renderer. Nunjucks uses the '.html' file extension so we didn't need to specify an alternative file extension. If we wanted to use Jade, we could have written it like so:

```javascript
var jade = require('jade');

var quickie = require('quickie').site({
  dirname: __dirname,
  extension: '.jade',
  render: function(markup, data) {
    return jade.render(markup, data);
  }
}).listen();
```

## Adding Routes and passing data
You can add custom routes to your Quickie site before calling the listen method.

```javascript
var nunjucks = require('nunjucks');

var site = require('quickie').site({
  dirname: __dirname,
  assets: 'static/',
  tempaltes: 'views/',
  render: function(markup, data) {
    return nunjucks.renderString(markup, data);
  }
});

// Add your routes before calling listen.
site.addRoute('/special', function(req, res){
  // Do some other stuff before rendering the page, like make an API call or whatever.
  return quickie.sendPage(req, res, 'index', { fancy: 'data' });
});

site.listen();
```
##### sendpage(req, res, pageName, [data]);
That sendPage method takes req, res, pageName, and data. The pageName should be a string and '.html' will automatically be appended to it unless you have specified otherwise using the extension option.

## Other Stuff

##### What about CSS Precompilers?

I thought about building this feature into quickie but in the interest of keeping the module succinct and focused, I decided against it. If you'd like to use LESS with your project instead of CSS, I recommend trying out [Less Before Listen](https://github.com/colpanik/less-before-listen)