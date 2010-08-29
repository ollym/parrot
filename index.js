var Script = process.binding('evals').Script;

exports.render = function(data, sandbox) {

    // Default sanbox to an empty object
    sandbox = sandbox || {};

    // Parrot can only process strings
    data = data.toString();
        
    // Escape double quoted strings and default to print
    data = 'print("' + data.replace(/"/gm, '\\"') + '");';

    // Compile the input into executable javascript
    data = data.replace(/:\s*%>/gm, '{ %>')
        .replace(/<%=\s*(.+)\s*%>/gm, '"); print($1); print("')
        .replace(/<%\s*end(if|while|for|switch);*\s*%>/gmi, '"); } print("')
        .replace(/<%\s*(.+)\s*%>/gm, '"); $1 print("')
        .replace(/(\r\n|\r|\n)/gmi, '\\$1');

    // Get ready to take the output data
    var output = '';

    // Override the print function
    sandbox.print = function(data) {

        // Append any data to the output buffer
        output += data;
    }

    console.log(data);

    // Execute the script, rendering the template
    Script.runInNewContext(data, sandbox);

    // Return the output
    return output;
}