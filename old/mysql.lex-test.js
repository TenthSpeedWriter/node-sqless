var expect = require("chai").expect,
    fs = require("fs"),
    utils = require("../util/query-helpers.js"),
    Lexicon = require("../lexicons/mysql.lex.js"),
    
    sql_dummy = function (config) {
        this.createConnection = function () {
            this.query = function (sql_query, callback) {
                callback(null, {
                    rows: sql_query// Is this formatted correctly?
                });
            };
            
            this.connect = function () {
                return false;
            };
            
            this.end = function () {
                return false;
            }
            
            return this;
        };
        
        return this;
    },
    
    lexicon = Lexicon({
        config: {
            host: '0.0.0.0',
            user: 'tenthspeedwriter',
            database: 'c9'
        },
        source: sql_dummy
    }),
    
    model_person = {
        "first_name": "Betty",
        "last_name": "Newbie",
        "age": 31
    };

describe("The MySQL Lexicon (mysql.lex.js)", function () {
    it("exports a function", function () {
        expect(typeof Lexicon).to.eql("function");
    });
    
    ["Create", "Read", "Update", "Delete"].map(function (crud_operation) {
        it(("has child class " + crud_operation + "()"), function () {
           expect(lexicon[crud_operation]).to.exist;
           expect(typeof lexicon[crud_operation]).to.eql('function');
        });
        it("instantiates with the attribute .table='people'");
    });
    
    describe("Create(table_name)(data)", function () {
        it("executes a correctly formated MySQL INSERT query", function (done) {
            lexicon.Create('people')({
                "first_name": "Betty"
            }).then(function (rows) {
                expect(rows[0]).to.eql("INSERT INTO people (first_name) VALUES ('Betty');");
                done();
            });
        });
    });
    
    describe("Read(table_name)", function () {
        describe("Read(table_name)()", function () {
            it("executes a correctly formatted MySQL 'SELECT *' query");
        });
        
        describe("Read(table_name)(primary_keys)", function () {
            it("correctly executes a MySQL SELECT query for one primary key");
            it("correctly executes a MySQL SELECT query for multiple primary keys");
            it("throws an error if given a null primary key");
            it("executes a SELECT * query if given an empty object for primary_keys");
        });
        
        describe("Read(table_name)(primary_keys, filters)", function () {
            it("correctly executes a SELECT * WHERE query when given filters but no primary_keys");
            it("throws an error if asked to do this with insufficient degrees of freedom");
        });
    });
    
    describe("Update(table_name)(primary_keys, data)", function () {
        it("throws an error if not given primary keys");
        it("throws an error if not given data");
        
        it("executes a correctly formatted MySQL UPDATE query");
    });
    
    describe("Delete(table_name)(primary_keys)", function () {
        it("throws an error if not given primary keys");
        it("throws an error if primary_keys does not correspond to the table's primary keys");
        it("executes a correctly formatted MySQL DELETE query");
    });
});