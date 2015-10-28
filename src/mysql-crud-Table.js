var Bro = require("brototype"),
    intersperse = require("intersperse"),
    q = require("q");

var Table = function (table_name, connection_method) {
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
};

module.exports = Table;