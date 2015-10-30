var q = require("q"),
    utils = require("../util/query-helpers.js");

module.exports = {
    query_strings: {
        create: function (table_name, data) {
            return "INSERT INTO "
                        + table_name
                        + " ("
                        + utils.commafied_keys(data)
                        + ") VALUES ("
                        + utils.ordered_quoted_vals(data)
                        + ");"
        },
        read: function (table_name, filters) {
            if (!filters) {
                return select_all(table_name);
            } else if (typeof filter === 'object') {
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
                        + " WHERE ("
                        + utils.equalized_keyvals(filters)
                        + ");"
            }
        },
        update: function (table_name, primary_keys, data) {
            
        },
        delete: function (table_name, primary_keys) {
            
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