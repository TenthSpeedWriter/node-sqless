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
        describe("create", function () {
            var create = lexicon.query_strings.create,
                table_name = "people",
                betty = {
                    first_name: "Betty",
                    last_name: "Newbie",
                    age: 37
                };
            it("produces a correctly formatted insert string for Betty Newbie", function () {
                var correct_response = "INSERT INTO people (first_name, last_name, age) VALUES (Betty, Newbie, 37);";
                
                expect(create(table_name, betty)).to.eql(correct_response);
            })    
        });
        
        describe("read", function () {
            
        });
        
        describe("update", function () {
            
        });
        
        describe("delete", function () {
            
        });
    });
})