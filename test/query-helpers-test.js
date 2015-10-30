var Bro = require("brototype"),
    utils = require("../util/query-helpers.js"),
    expect = require("chai").expect;
    
describe("query-constructors", function () {
    it("exposes the method commafied_keys()", function () {
        expect(utils.commafied_keys).to.exist;
        expect(typeof utils.commafied_keys).to.eql('function');
    });
    describe("commafied_keys()", function () {
        var data_to_commafy = {
            "alpha": "dude",
            "beta": "sweet"
        };
        
        it("turns the keys of an object into a comma-separated string", function () {
            expect(utils.commafied_keys(data_to_commafy)).to.eql("alpha, beta");
        });
    });
    
    it("exposes the method equalized_keyvals()", function () {
        expect(utils.equalized_keyvals).to.exist;
        expect(typeof utils.equalized_keyvals).to.eql('function');
    });
    describe("equalized_keyvals()", function () {
        var data_to_equalize = {
            "alpha": "dude",
            "beta": "sweet"
        };
        
        it("returns a string of keys and their values, matched by equal signs and comma separated", function () {
            expect(utils.equalized_keyvals(data_to_equalize)).to.eql("alpha=dude, beta=sweet");
        });
    });
    
    it("exposes the method ordered_quoted_vals()", function () {
        expect(utils.ordered_quoted_vals).to.exist;
        expect(typeof utils.ordered_quoted_vals).to.eql('function');
    });
    describe("ordered_quoted_vals()", function () {
        var data_to_order = {
            "alpha": "dude",
            "beta": "sweet"
        };
        
        it("converts the object { alpha: 'dude', beta: 'sweet' } into ' 'dude', 'sweet' '", function () {
            expect(utils.ordered_quoted_vals(Bro(data_to_order).giveMeProps(), data_to_order))
                .to.eql("'dude', 'sweet'");
        });
        
        it("converts the object { a: 'boo', b: 17 } into ' 'boo', 17 '", function () {
            var other_data = { a: 'boo', b: 17 },
                expected_string = "'boo', 17";
            expect(utils.ordered_quoted_vals(Bro(other_data).giveMeProps(), other_data)).to.eql(expected_string);
        });
    })
})