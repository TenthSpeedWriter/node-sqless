var Bro = require("brototype"),
    intersperse = require("intersperse");

module.exports = {
    commafied_keys: function (data_to_commafy) {
        if (typeof data_to_commafy !== 'object') {
            throw Error("ARGUMENT_MUST_BE_AN_OBJECT");
        } else if (Bro(data_to_commafy).giveMeProps().length === 0) {
            throw Error("ARGUMENT_CANNOT_BE_EMPTY");
        }
        
        // Could this operation be performed more functionally?
        var keys = Bro(data_to_commafy).giveMeProps(),
            commafied_keys = intersperse(keys, ', '),
            output_string = "";
            
        for (var iter = 0; iter < commafied_keys.length; iter ++) {
            output_string = output_string + commafied_keys[iter];
        }
            
        return output_string;
    },
    
    equalized_keyvals: function (data_to_equalize) {
        if (typeof data_to_equalize !== 'object') {
            throw Error("ARGUMENT_MUST_BE_AN_OBJECT");
        } else if (Bro(data_to_equalize).giveMeProps().length === 0) {
            throw Error("ARGUMENT_CANNOT_BE_EMPTY");
        }
        
        var keys = Bro(data_to_equalize).giveMeProps(),
            output_string = keys[0] + "=" + data_to_equalize[keys[0]];
            
        for (var iter = 1; iter < keys.length; iter ++) {
            output_string = output_string + ", " + keys[iter] + "=" + data_to_equalize[keys[iter]];
        }
        
        return output_string;
    },
    
    ordered_quoted_vals: function (keys, data) {
        var output_string = "",
            sorted_data = [],
            commafied_data;
        
        for (var iter = 0; iter < keys.length; iter ++) {
            var this_data = data[keys[iter]];
            if (typeof data[keys[iter]] === 'string') {
                sorted_data[iter] = ("'" + this_data + "'");
            } else {
                sorted_data[iter] = this_data;
            }
            
        }
        
        commafied_data = intersperse(sorted_data, ", ");
        
        for (var iter = 0; iter < commafied_data.length; iter ++) {
            output_string = output_string + commafied_data[iter];
        }
        
        return output_string;
    }
};