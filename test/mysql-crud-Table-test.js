var Table = require("../src/mysql-crud-Table.js"),
    expect = require("chai").expect,
    mysql = require("mysql"),
    Bro = require("brototype"),
    config = {
        "host": "localhost",
        "user": "tenthspeedwriter",
        "database": "sqless_test",
        "tables": "*"
    };
    
function expect_no_errors(err) {
    console.err(err);
    expect(err).to.not.be.ok;
}

describe("Table", function () {
    var table, data_structure;
    beforeEach(function (done) {
        Table("people", {
                mysql: mysql,
                config: config
            })
            .then(function (new_table) {
                table = new_table,
                data_structure = table.data_structure;
            })
            .catch(function (err) {
                console.err(err);
                throw(err);
            })
            .finally(done);
    });
    
    it("initializes with attribute .data_structure, a description of the table", function () {
       expect(data_structure).to.be.ok;
    });
    
    describe(".data_structure", function () {
        it("has named child objects, at least one of which is 'peopleID'", function () {
            expect(data_structure.peopleID).to.be.ok;
            expect(typeof data_structure.peopleID).to.be.object;
        });
        
        describe(".peopleID", function () {
            ['Type', 'Null', 'Key', 'Default', 'Extra'].map(function (field_name) {
                it(("has attribute " + field_name), function () {
                    expect(data_structure.peopleID[field_name]).to.not.eql(undefined);
                });
            });
        });
    });
    
    describe(".Query_Promise", function () {
        it("initializes with helper method commafied_keys()", function () {
            expect(typeof table.Query_Promise().commafied_keys).to.eql('function');
        });
        
        describe(".commafied_keys()", function () {
            it("throws an error if not given a populated object", function () {
                expect(table.Query_Promise().commafied_keys(null)).to.throw("ARGUMENT_MUST_BE_AN_OBJECT");
                expect(table.Query_Promise().commafied_keys({})).to.throw("ARGUMENT_CANNOT_BE_EMPTY");
            });
            
            it("converts an object into a string of comma-interspersed keys", function () {
                var commafied_string = table.Query_Promise().commafied_keys({foo: "bar", baz: "zot"});
                
                expect(commafied_string).to.eql("foo, bar");
            });
        });
        
        it("initializes with helper method equalized_keyvals()", function () {
            expect(typeof table.Query_Promise().equalized_keyvals).to.eql('function');
        });
        
        describe(".equalized_keyvals()", function () {
            it("throws an error if not given a populated object", function () {
                expect(table.Query_Promise().equalized_keyvals(null)).to.throw("ARGUMENT_MUST_BE_AN_OBJECT");
                expect(table.Query_Promise().equalized_keyvals({})).to.throw("ARGUMENT_CANNOT_BE_EMPTY");
            });
            
            it("converts an object into a string of arguments and keys paired with '=' and separated by ', '", function () {
                expect(table.Query_Promise().equalized_keyvals({foo: "bar", baz: "zot"}))
                    .to.eql("foo=bar, baz=zot");
            });
        });
    });
    
    describe("CRUD methods", function () {
       ['create', 'read', 'update', 'drop'].map(function (function_name) {
           it(("initializes with method ." + function_name), function () {
               expect(typeof table[function_name]).to.eql('function');
           });
       });
    });
    
    describe(".c", function () {
        it("creates a new record without incident", function (done) {
            table.c({
                "first_name": "Betty",
                "last_name": "Newbie",
                "age": 29
            })
                .then(function (data) {
                    expect(data).to.be.ok;
                    expect(data.first_name).to.eql('Betty');
                })
                .catch(expect_no_errors)
                .finally(done);
        });
    });
    
    describe(".r", function () {
        it("reads existing records without incident", function (done) {
            table.r('*')
                .then(function (data) {
                    expect(Array.isArray(data)).to.be.true;
                    expect(typeof data[0].first_name).to.eql('string');
                })
                .catch(expect_no_errors)
                .finally(done);
        })
    });
    
    describe(".u", function () {
        it("changes an existing record without incident", function (done) {
            var personID;
            
            table.r('*')
                .then(function (people) {
                    personID = people[0].personID;
                    
                    table.u(personID, {
                        "age": 55
                    })
                        .then(function (person) {
                            expect(person.age).to.eql(55);
                        })
                        .catch(expect_no_errors)
                        .finally(done);
                })
                .catch(expect_no_errors)
                .finally(done);
        });
    });
    
    describe(".d", function () {
        var personID;
        
        beforeEach(function (done) {
            table.c({
                first_name: "Stacy",
                last_name: "Newbie",
                age: 7
            })
            .then(function (new_person) {
                personID = new_person.personID;
            })
            .catch(expect_no_errors)
            .finally(done);
        });
        
        it("creates a record, then deletes it without incident", function (done) {
            table.d(personID)
                .then(function () {
                    table.r(personID)
                        .then(function (rows) {
                            expect(rows.length).to.eql(0);
                            done();
                        })
                        .catch(expect_no_errors);
                })
                .catch(expect_no_errors)
                .finally(done);
        });
    });
});