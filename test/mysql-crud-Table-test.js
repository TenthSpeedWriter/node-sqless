var Table = require("../src/mysql-crud-Table.js"),
    expect = require("chai").expect,
    mysql = require("mysql"),
    config = JSON.parse(require("fs").readFileSync('mysql-crud-test-config', 'utf-8'));
    
function expect_no_errors(err) {
    console.err(err);
    expect(err).to.not.be.ok;
}

describe("Table", function () {
    var connection;
    
    beforeEach(function (done) {
        connection = mysql.create_connection(config);
        connection.connect();
        done();
    });
    
    afterEach(connection.end);
    
    it("throws an error if not given a valid connection", function () {
        expect(Table("bad_table", null)).to.throw("BAD_CONNECTION_OBJECT");
    });
    
    it("throws an error if not given a valid table_name", function () {
        expect(Table(null, connection)).to.throw("BAD_TABLE_NAME");
    });
    
    it("returns an object when called", function (done) {
        Table("good_table", connection)
            .then(function (data) {
                expect(typeof data).to.eql('object');
            })
            .catch(expect_no_errors)
            .finally(done);
    });
    
    it("has a method 'query'", function (done) {
        Table("good_table", connection)
            .then(function (good_table) {
                expect(good_table.query).to.be.ok;
                expect(typeof good_table.query).to.eql('function');
            })
            .catch(expect_no_errors)
            .finally(done);
    });
    
    it("is an object", function () {
        expect(typeof Table).to.eql("object");
    });
    
    ["create", "read", "update", "drop"].map(function (call_type) {
        it(("has method " + call_type), function () {
            expect(typeof Table[call_type]).to.eql("function");
        });
    });
});