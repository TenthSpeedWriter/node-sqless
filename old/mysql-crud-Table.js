var Bro = require("brototype"),
    intersperse = require("intersperse"),
    q = require("q");
    
var Table = function (table_name, connection_method) {
    var deferred_table = q.defer(),
        _self = this,
        _connection_method = connection_method;
        
    this.name = table_name;
    
    this.utils = {
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
        
        ordered_vals: function (keys, data) {
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
    
    this.Query = function(query_string, connection_method) {
        var deferred = q.defer(),
            connection = connection_method.mysql.createConnection(connection_method.config);
            
        connection.connect();
        connection.query(query_string, resolve_or_reject_promise);
        
        return deferred.promise;
        
        function resolve_or_reject_promise(err, rows, fields) {
            // Shouldn't be hidden
            connection.end();
            if (err) {
                console.error("Failed Query: " + query_string + "\n" + err);
                deferred.reject(err);
            } else {
                deferred.resolve(rows);
            }
        }
    };
    
    this.c = function (data) {
        var Query_Promise = _self.Query;
        
        return Query_Promise(formatted_query_string(data), _connection_method);
        
        function formatted_query_string(data) {
            var query_string = "INSERT INTO " + _self.name + " (",
                keys = Bro(data).giveMeProps(),
                commafied_keys = _self.utils.commafied_keys(data),
                stringified_vals = _self.utils.ordered_vals(keys, data);
            
            query_string = query_string
                            + commafied_keys
                            + ") VALUES ("
                            + stringified_vals
                            + ");";
                            
            return query_string;
        }
    };
    
    /* Attempt to query data description and construct instance of table */
    this.data_structure = _self.Query(("DESCRIBE " + table_name + ";"), connection_method)
        .then(resolve_table_with_data_structure)
        .catch(reject_table);
    
    return deferred_table.promise;
    
    function resolve_table_with_data_structure(data_structure) {
        _self.data_structure = data_structure;
        deferred_table.resolve(_self);
    }
    function reject_table(err) {
        deferred_table.reject(err);
    }
};

/*var Table = function (table_name, connection_method) {
    var _self = this,
        deferred = q.defer(),
        mysql = connection_method.mysql,
        config = connection_method.config;
        
    _self.Query_Promise = function () {
        this.commafied_keys = function (data_to_commafy) {
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
        };
        
        this.equalized_keyvals = function(data_to_equalize) {
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
        };
        
        return this;
    };
    
    var table_description_connection = mysql.createConnection(config);
    table_description_connection.query(("DESCRIBE " + table_name), function (err, rows, fields) {
        if (err) { 
            table_description_connection.end();
            deferred.reject(Bro(_self).comeAtMe({
                err: err
            }));
        } else {
            _self.data_structure = {};
            rows.map(function (row) {
                _self.data_structure[row.Field] = {
                    Type: row.Type,
                    Null: row.Null,
                    Key: row.Key,
                    Default: row.Default,
                    Extra: row.Extra
                };
            });
            
            table_description_connection.end();
            deferred.resolve(_self);
        }
    });
    
    return deferred.promise;
};*/

module.exports = Table;