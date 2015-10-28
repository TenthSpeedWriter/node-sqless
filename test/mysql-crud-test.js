var mocha = require("mocha"),
    expect = require("chai").expect,
    mysql_wrap = require("../src/mysql-crud.js");
    //console.log(mysql_wrap.Table());

describe("mysql_wrap", function () {
    it("exports an object", function (done) {
        setTimeout( function () {
            expect(typeof mysql_wrap).to.eql("object");
            done();
        }, 15);
    });
});