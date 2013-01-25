/**
 * License Information (MIT)
 *
 * Copyright (c) 2010 Oliver Morgan (oliver.morgan@kohark.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var crypto = require('crypto'),
	Script = require('vm'),
	cache  = { };

// Defines parrot's version
exports.version = '0.3.1';

// Global configuration
exports.config = {
	sandbox: {},
	cache: 5,
	buffer: true,
	tags: {
		start: '<%',
		end: '%>'
	}
};

/**
 * Clear's parrots internal cache
 *
 * @return undefined
 */
exports.clearCache = function() {

	cache = {};
};

/**
 * Renders a template
 *
 * @param  data   string The input data
 * @param  config object Any optional configuration options
 * @return The rendered template
 */
exports.render = function(data, config, onprint) {
	
	// If config is given as a function
	if (typeof config === 'function') {

		// Swap the parameters
		onprint = config;
		config  = undefined;
	}

	if (config === undefined) {

		// Use the global defaults
		config = exports.config;
	}
	else {

		// Set the cache and buffer configuration if none is defiend
		config.cache  = config.cache  || exports.config.cache;
		config.buffer = config.buffer || exports.config.buffer;

		if (config.tags === undefined) {

			// Default to the global tags
			config.tags = exports.config.tags;
		}
		else {

			// Default to the global tags if they aren't set
			config.tags.start = config.tags.start || exports.config.tags.start;
			config.tags.end   = config.tags.end   || exports.config.tags.end;
		}

		if (config.sandbox === undefined) {

			// Set the sandbox defaults
			config.sandbox = exports.config.sandbox;
		}
		else {

			// Default to the global sandbox
			var sandbox = exports.config.sandbox;

			// Loop through each item in the sandbox
			for (var key in config.sandbox) {

				// And overwrite any existing sandbox item
				sandbox[key] = config.sandbox[key];
			}

			// Replace the merged sandbox
			config.sandbox = sandbox;
		}
	}

	// Short forms for the start and end tags and get the parent callee
	var et     = config.tags.end,
		st     = config.tags.start,
		ident  = crypto.createHash('md5').update(data).digest('base64'),
		output = '';

	// Override the print function
	config.sandbox.print = function(chunk) {
	
		// We can only accept strings
		chunk = chunk.toString();

		// If the buffer configuration was set to false and the user defined a function
		if ( ! config.buffer && typeof onprint === 'function') {

			// Call the function with the data chunk
			onprint(chunk);
		}

		// Append any data to the output buffer
		output += chunk;
	};

	// If the output is already cached
	if (cache[ident] !== undefined) {

		// Print the entire output
		config.sandbox.print(cache[ident]);

		// And return the output
		return output;
	}

	// Parrot can only process strings
	data = data.toString();

	// Compile the input into executable javascript
	data = data
		.replace(new RegExp('(^|' + et + ')[^]+?($|' + st + ')', 'g'), function(match) {
			return match
				.replace(/"/g,  '\\"')
				.replace(/\n/g, '\\n')
				.replace(/\r/g, '\\r')
				.replace(/\t/g, '\\t');
		})
		.replace(new RegExp(':\\s*' + et, 'gm'), '{ ' + et)
		.replace(new RegExp(st + '=([^]+?)' + et, 'gm'), '");\nprint($1);\nprint("')
		.replace(new RegExp(st + '\\s*end(if|while|for|switch);?\\s*' + et, 'gmi'), '");\n}\nprint("')
		.replace(new RegExp(st + '([^]+?)' + et, 'gm'), '");\n$1\nprint("');

	// Add outer print function
	data = 'print("' + data + '");';
	
	// Execute the script, rendering the template
	Script.runInNewContext(data, config.sandbox);

	// If we have a valid cache amount
	if (config.cache > 0) {

		// Cache the output
		cache[ident] = output;

		// Set a timeout of the time
		setTimeout(function() {

			// Delete the cache entry
			delete cache[ident];
			
		}, config.cache);
	}

	// If we have been buffering the output and onprint is a function
	if (config.buffer && typeof onprint == 'function') {

		// Return the output value
		return onprint(output);
	}

	// Return the output
	return output;
};