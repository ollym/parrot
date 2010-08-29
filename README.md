#Parrot Templating Engine

Parrot is an incredibly lightweight, and super fast templating engine for node.js. It works by using a set of regular expressions to compile an input into executable javascript which is then compiled and run by the V8 engine, harnessing 100% of its power.

All feedback is welcome.

## Quick Start

Open up your project folder, create a folder called 'lib/parrot' if it doesn't exist already. Navigate to that folder and place the parrot index.js within that folder. The url to download the parrot files can be found here:

	http://github.com/ollym/parrot/zipball/master
	
You should now have the parrot library installed in the lib/parrot folder.

Within your application, you can use parrot like the following:

	var parrot = require('./lib/parrot');
	
	var output = parrot(input);
	
Where the input variable is a string you would like parrot to render. If you would like to render a file, do the following:

	var parrot = require('./lib/parrot'),
		fs     = require('fs');
		
	fs.readFile(file, function(data) {
		
		var output = parrot(data);	
	});
	
Where file is a string value of the file you wish to render, and output is the rendered template.

## Syntax Reference

Being lightweight, parrot offloads a lot of the processing to the V8 interpreter, which compiles the code and runs as fast as the rest of your application. In fact, parrot shouldn't add any overhead to your application at all! For this reason, the syntax within the parrot tags is javascript. You can perform any function you wish within the bounds of javascript and node.js.

### Basic Example
Below is a basic example of parrot's usage syntax.
	
	<html>
	<% for(var i = 0; i < 3; i++) : %>
		<div>I am div #<%= i %></div>
	<% endfor; %>
	</html>

Will render as:

	<html>
		<div>I am div #0</div>
		<div>I am div #1</div>
		<div>I am div #2</div>
	</html>
	
### Alternative Syntax
As supposed to the example above, it can also be written as:

	<html>
	<% for(var i = 0; i < 3; i++) { %>
		<div>I am div #<% print(i) %></div>
	<% } %>
	</html>
	
As you would have noticed, the colon (:) and endfor directives have been replaced with curley brackets, and the <%= %> tags have been replaced with a print() function. Parrot works by buffering data sent using print() before returning it to the user.

## Advanced Usage
If you wish to expose functions and variables to the script, you can provide them within an object as the second parameter to the parrot function. For example:

	var input = '<%= square(2) %>';

	var square = function(a) {
		return a * a;
	}
	
	var output = parrot(input, {
		square: square
	});
	
Will output:

	4

> Note you cannot replace the print() function, as this is reserved by parrot.