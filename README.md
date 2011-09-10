#Parrot Templating Engine

Parrot is an incredibly lightweight, and super fast templating engine for node.js. It works by using a set of regular expressions to compile an input into executable javascript which is then compiled and run by the V8 engine, harnessing 100% of its power.

All feedback is welcome.

### Features

* Fully Configurable
* Native Javascript Support
* Compiled and interpreted by V8 (Super Fast)
* Internal Caching
* Buffering
* Fully configurable Sandbox
* Lightweight, Elegant & Fully Annotated Code
* Thorough Documentation

## Installation

### NPM (Node Package Manager)

The easiest way to install parrot is by using NPM as follows:

    npm install parrot

Or globally by:

    npm install -g parrot
    
### Alternatively

Open up your project folder, create a folder called 'lib/parrot' if it doesn't exist already. Navigate to that folder and place the parrot index.js within that folder. The url to download the parrot files can be found here:

	http://github.com/ollym/parrot/zipball/master
	
You should now have the parrot library installed in the lib/parrot folder.
## Syntax Reference

Being lightweight, parrot offloads a lot of the processing to the V8 interpreter, which compiles the code and runs as fast as the rest of your application. In fact, parrot shouldn't add any overhead to your application at all! For this reason, the syntax within the parrot tags is javascript. You can perform any function you wish within the bounds of javascript and node.js.

### Basic Example
Below is a basic example of parrot's usage syntax.

```html
<html>
<% for(var i = 0; i < 3; i++) : %>
    <div>I am div #<%= i %></div>
<% endfor; %>
</html>
```

Will render as:

```html
<html>
	<div>I am div #0</div>
	<div>I am div #1</div>
	<div>I am div #2</div>
</html>
```

### Alternative Syntax
As supposed to the example above, it can also be written as:

```html
<html>
<% for(var i = 0; i < 3; i++) { %>
	<div>I am div #<% print(i) %></div>
<% } %>
</html>
```
	
As you would have noticed, the colon (:) and endfor directives have been replaced with curly brackets, and the <%= %> tags have been replaced with a print() function. Parrot works by buffering data sent using print() before returning it to the user.

## API Reference

Within your application, you can use parrot like the following:

```javascript
var parrot = require('parrot');

var output = parrot.render(input);
```
	
Where the input variable is a string you would like parrot to render. If you would like to render a file, do the following:

```javascript
var parrot = require('parrot');
var fs     = require('fs');
fs.readFile(file, encoding, function(err, data) {
	if (err) throw err;
	var output = parrot.render(data);
});
```
	
Where file is a string value of the file you wish to render, and output is the rendered template.

If you want to stream your template in chunks you can add a function as the second or third parameter and it will be called every time data is printed from the template. If the buffer configuration is set to true, then the entire output is provided to this function once rendering has ended. For example:

```javascript
parrot.render(input, function(chunk) {
	
// Send chunks as they are received
res.write(chunk);
});
```
	
Or if you have configurations set:

```javascript
parrot.render(input, {cache: 0}, function(chunk) {
		
// Send chunks as they are received
res.write(chunk);
});
```
	
> Note: If you have buffer set to true, then the chunk parameter passed to the callback function will be identical to the value returned by the method.
	
### Advanced Methods

If you want to manually flush the internal cache, you can do so by using the parrot.clearCache() method. For example:

```javascript
parrot.clearCache();
```

## Configuration

To configure parrot you have two available options: global or local. Altering parrot's global configuration will affect every rendering process that takes values from the global configuration as they're not already defined locally. Both local configuration settings are the same.

### Sandbox

The sandbox property defines any variables or methods that you want to expose to the template. These can be functions you want to allow your template to use, or variables defined earlier in your script.

Default: {}

Example:

```javascript
var input = '<%= square(2) %>';

var square = function(a) {
	return a * a;
}
	
var output = parrot.render(input, {
	sandbox: {
		square: square
	}
});
	
// Output = 4
```
	
> Note you cannot replace the print() function, as this is reserved by parrot.
	
### Cache

Parrot will internally cache all rendered templates, which will dramatically reduce rendering time in future. Just incase you're loading dynamic content within your template, you define the cache property as an integer representing the number of seconds that parrot will hold the rendered template in the cache.

Default: 3600 * 24 // 1 day (24 hours)

Example:

```javascript
parrot.render(input, {
	cache: 3600 * 24 // Will cache a template for a whole day (24 hours)
});
```
	
> Note: If the cache value is set to 0 or below, then the rendered templates will not be cached.

### Buffer

If your template requires heavy processing, and to wait for the whole template to render before returning it to the client is not feasible, you can set the buffer property to false. This will prompt parrot to return data as it is printed to a function given as the 3rd parameter to the render method. This is advisable for all heavy duty templates, as it allows the client to start downloading header resources before the entire template is rendered.

Default: false

Example:

```javascript
parrot.render(input {
	buffer: false,
}, function(chunk) {
	
	// Write the chunk to the response stream
    res.write(chunk);
});
```
	
> Note: If buffer is set to true and a function is provided as the 2nd/3rd parameter, it will write the entire output to that function.

> Note: The render method will still return the entire output once the template is finished rendering.

### Tags

The tags property allows you to define what tags you want in your template. By default they are: <% and %> but you can use this property to set them to whatever you want.

Default: {
   start: '<%',
   end: '%>'
}

Example:

```javascript
parrot.render(input, {
	tags: {
		start: '<?',
		end: '?>'
	}
});
```

> Note: Short tags will always work with an appended equals sign (=) to your start tag. So for the example above, it will be set to <?= ?> automatically.

> Note: Tag values are prepended and appended to regular expressions, ensure you're tags are escaped or intentionally not so.

## License 

Copyright (c) 2010 Oliver Morgan (oliver.morgan@kohark.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.