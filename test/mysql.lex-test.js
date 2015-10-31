'use strict';

var lexicon = require("../lexicons/mysql.lex.js"),
    expect = require("chai").expect;

describe("the MySQL lexicon", function () {
    it("is an object", function () {
        expect(typeof lexicon).to.eql("object");
    });
    
    
    it("has child object query_strings", function () {
        expect(lexicon.query_strings).to.exist;
    });
    
    describe(".query_strings", function () {
        describe("describe_table", function () {
            it("has method describe_table", function () {
                expect(typeof lexicon.query_strings.describe_table).to.eql('function');
            });
            
            it("returns a correctly formatted query to describe a MySQL table", function () {
                expect(lexicon.query_strings.describe_table('person'))
                    .to.eql('DESCRIBE person;');
            })
        });
        describe("c", function () {
            var c = lexicon.query_strings.c,
                table_name = "people",
                betty = {
                    first_name: "Betty",
                    last_name: "Newbie",
                    age: 37
                };
            it("produces a correctly formatted insert string for Betty Newbie", function () {
                var correct_response = "INSERT INTO people (first_name, last_name, age) VALUES ('Betty', 'Newbie', 37);";
                
                expect(c(table_name, betty)).to.eql(correct_response);
            });
        });
        
        describe("r", function () {
            var r = lexicon.query_strings.r;
            it("constructs a SELECT * FROM query when given no filter argument", function () {
                expect(r("people")).to.eql("SELECT * FROM people");
            });
            
            it("constructs a SELECT * WHERE query when given filters", function () {
                expect(r("people", { personID: 1 }))
                    .to.eql('SELECT * FROM people WHERE personID=1;');
            });
        });
        
        describe("u", function () {
            var u = lexicon.query_strings.u;
            it("constructs an UPDATE ... SET ... WHERE query when given primary keys and data", function () {
                var example_data = { age: 32 },
                    example_primary_key = { "personID": 1 };
                    
                expect(u('people', example_primary_key, example_data))
                    .to.eql("UPDATE people SET age=32 WHERE personID=1");
            });
        });
        
        describe("d", function () {
            var d = lexicon.query_strings.d;
            it("constructs a DELETE FROM ... WHERE query given primary keys", function () {
                var dummy_keys = { personID: 1 };
                expect(d('people', dummy_keys)).to.eql("DELETE FROM people WHERE personID=1");
            });
        });
    });
})