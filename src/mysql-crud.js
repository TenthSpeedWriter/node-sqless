var fs = require("fs"),
    q = require("q"),
    Bro = require("brototype"),
    mysql = require("mysql"),
    Table = require("./mysql-crud-Table.js"),
    deferredModule = q.defer();
    

load_config()
    .then(create_connection)
    .then(read_tables)
    .then(initialize_module_with_tables)
    .then(function (module) {
        console.log(module);
        deferredModule.resolve(
            Bro(module).comeAtMe({
                Table: Table
            }));
    })
    .catch(function (err) {
        console.err(err);
        deferredModule.reject(err);
    });

module.exports = deferredModule.promise;

function load_config() {
    var deferredConfig = q.defer();
    fs.readFile("./mysql-crud-config.json", function (err, data) {
        if (err) {
            deferredConfig.resolve(err);
        } else {
            deferredConfig.resolve(data);
        }
    });
    return deferredConfig.promise;
}
function create_connection(config) {
    var deferredConncetion = q.defer();
    
    try {
        var connection = mysql.createConnection(config),
            module = {
                "config": config,
                "connection": connection
            };
        deferredConncetion.resolve(module);
    } catch(err) {
        deferredConncetion.reject(err);
    }
    
    return deferredConncetion.promise();
}
function read_tables(module) {
    var deferred_module_with_table_names = q.defer();
    
    module.connection.connect();
    
    module.query(function (err, rows, fields) {
        if (err) {
            deferred_module_with_table_names.reject(err);
        } else {
            var module_with_table_names = Bro({}).comeAtMe(module);
            module_with_table_names.tables = rows;
            deferred_module_with_table_names.resolve(module_with_table_names);
        }
        
        module.connection.end();
    });
    
    return deferred_module_with_table_names.promise;
}
/* Tsk, tsk. This could be more functional. */
function initialize_module_with_tables(module) {
    module.tables.map(function (table_name) {
        module[table_name] = Table(module.connection, table_name); 
    });
    
    return module;
}

