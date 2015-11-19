# node-sqless
Provides a simple, unified wrapper for Create/Read/Update/Delete operations with various SQLish languages.

The core component of sqless is the Table class. A table is initialized once for a given database module, configuration, and of course, table.
It privately retains its storage functionality while exposing the commands c(), r(), u(), and d() - each corresponding to a piece of the CRUD operation set.

Queries performed by these operations are based on asynchronous Q promises, and are then-able in keeping with the practices of Promises/A+.

# Examples

    var sqless = require('sqless'),
    
    config = JSON.parse(fs.readFileSync('mysql_config.json'));
    config.database_type = "mysql";
    
    var people = sqless.Table('people', config);
    

**create**

    people.c({
      first_name: 'Stacy',
      last_name: 'Gantt',
      age: 28
    });


**read**

    people.r({
      age: 25
    })
    .then(function (result) {
      var count = result.records.length;
      console.log("There are " + count + " 25-year-old users in our records.");
    });


**update**

    // Modifying person 8675309 Ms. Jenny Monroe to Mrs. Jenny Schmidt
    
    people.u({ personID: 8675309 }, { last_name: "Schmidt" });


**delete**

    people.d({ last_name: "Whitt" })
    .then(function () {
      console.log("Database is now Whitless.");
    });
