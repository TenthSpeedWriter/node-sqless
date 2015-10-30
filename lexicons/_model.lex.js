'use strict';
module.exports = {
    
    Query_Promise: function (module, config, query) {
        /* Returns a promise for string 'query',
            given the desired uninstantiated module and
            any necessary configs.
            
            Used by the Table class to separate the concern
            of actual database interaction, replacing it with
            a promise-based interface which it can then expose. */
    },
    
    query_strings: {
        /* Functions which produce correctly formatted strings
            for the each of the CRUD query types. */
        create: function (table_name, data) {
            
        },
        read: function (table_name, filters) {
            
        },
        update: function (table_name, primary_keys, data) {
            
        },
        delete: function (table_name, primary_keys) {
            
        }
    }
};