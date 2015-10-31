var q = require("q"),
    Bro = require("brototype"),
    utils = require("../util/query-helpers.js");

module.exports = {
    query: function (mysql, config, query) {
        var deferred = q.defer(),
            connection = mysql.createConnection(config);
        connection.connect();
        
        connection.query(query, function (err, rows, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve({ rows: rows, fields: fields});
            }
        });
        
        return deferred.promise;
    },
    query_strings: {
        c: function (table_name, data) {
            if (!table_name || typeof table_name !== 'string'
            || !data || typeof data !== 'object'
            || Bro(data).giveMeProps().length === 0) {
                throw Error("BAD_ARGUMENTS");
            }
            var keys = Bro(data).giveMeProps();
            return "INSERT INTO "
                        + table_name
                        + " ("
                        + utils.commafied_keys(data)
                        + ") VALUES ("
                        + utils.ordered_quoted_vals(keys, data)
                        + ");";
        },
        r: function (table_name, filters) {
            if (!filters) {
                return select_all(table_name);
            } else if (typeof filters === 'object') {
                return select_by_keyvals(table_name, filters);
            } else {
                throw Error("BAD_ARGUMENTS");
            }
            
            function select_all() {
                return "SELECT * FROM " + table_name;
            }
            function select_by_keyvals(table_name, filters) {
                return "SELECT * FROM "
                        + table_name
                        + " WHERE "
                        + utils.equalized_keyvals(filters)
                        + ";"
            }
        },
        u: function (table_name, primary_keys, data) {
            if (!table_name || !primary_keys || !data
                || Bro(primary_keys).giveMeProps().length === 0
                || Bro(data).giveMeProps().length === 0) {
                    throw Error("BAD_ARGUMENTS");
                }
            var query_string = "UPDATE "
                                + table_name
                                + " SET "
                                + utils.equalized_keyvals(data)
                                + " WHERE "
                                + utils.equalized_keyvals(primary_keys);
                                + ";";
            return query_string;
        },
        d: function (table_name, primary_keys) {
            if (!table_name || typeof table_name !== 'string'
                || !primary_keys || typeof primary_keys !== 'object'
                || Bro(primary_keys).giveMeProps().length === 0) {
                    throw Error("BAD_ARGUMENTS");
                }
            var query_string = "DELETE FROM "
                                + table_name
                                + " WHERE "
                                + utils.equalized_keyvals(primary_keys);
            return query_string;
        },
        describe_table: function (table_name) {
            return "DESCRIBE " + table_name + ";";
            // This would be a good thing to replace with a function that actually
            // analyzes the structure of the table and phrases it in a standardized way
        }
    }
};

/*module.exports = function (connection_method) {
    var self = this,
        _source = connection_method.data_source,
        _config = connection_method.config,
        Query_Promise = function (query_string) {
            var deferred = q.defer(),
                connection = _source.createConnection(_config);
                
            connection.connect();
            connection.query(query_string, function (err, rows, fields) {
               if (err) {
                   deferred.reject(err);
               } else {
                   deferred.resolve({
                       "rows": rows,
                       "fields": fields
                   });
               }
            });
            
            return deferred.promise;
        };
        
    self.Create = function (table_name) {
        return function (data) {
            var self = this;
            
            this.table = table_name;
                
            return Query_Promise(create_query_string(data));
            function create_query_string(data) {
                return "INSERT INTO "
                        + self.table
                        + " ("
                        + utils.commafied_keys(data)
                        + ") VALUES ("
                        + utils.ordered_quoted_vals(data)
                        + ");"
            }
        };
    };
    
    return self;
};*/