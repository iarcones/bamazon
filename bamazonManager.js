var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazonDB"
});

connection.connect(function (error) {
    if (error) throw error;
    // console.log("connected as id " + connection.threadId);
    console.log("\n****************************".magenta)
    console.log("\nBamazon Store -  Manager APP".magenta.bold)
    console.log("\n****************************\n".magenta)
    startPrompt();
});


function startPrompt() {

    inquirer
        .prompt([
            {
                type: 'list',
                message: "What would you like to do?\n".blue.bold,
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit"
                        ],
                name: "command"
            }
        ])
        .then(function (answer) {
        
            switch (answer.command) {
                case "View Products for Sale":
                    displayAll("1");
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    displayAll("2");
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "Exit":
                    end();
                    break;
            }
        });
}


//////" View Products for Sale" //////

function displayAll(option) {

    connection.query("SELECT * FROM products", function (error, res) {

        if (error) throw error;

        var table = new Table({
            head: ['itemId'.cyan.bold, 'Product'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold, "Stock".cyan.bold]
            , colWidths: [10, 50, 30, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
        
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        console.log("\n");

        switch (option) {

            case "1": //// Display all items
                startPrompt();
                break;

            case "2": //// add to Invetory

                promptAddStock();
                break;

        }
    });
}

///// "View Low Inventory" ////////

function lowInventory() {

    connection.query("SELECT * FROM products where stock_quantity < 5", function (error, res) {
        if (error) throw error;

        if (res.length === 0) {
            console.log("We didn't find any product low of stock ".red.bold + "\n");
            startPrompt();
            return;
        }

        var table = new Table({
            head: ['itemId'.cyan.bold, 'Product'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold, "Stock".cyan.bold]
            , colWidths: [10, 50, 30, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }

        console.log(table.toString());
        console.log("\n");
        startPrompt();

    });
}

function promptAddStock() {

    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the ID of the product you would like to add stock? [Quit with Q]".blue.bold,
                name: "productID",
                validate: function (name) {
                    if (name === "Q") { end() }
                    else if (!parseInt(name, 10)) {
                        console.log("\nPlease introduce a valid id".red.bold);
                    }
                    else {
                        return true
                    }
                }
            },
            {
                type: 'input',
                message: "How many would you like to add? [Quit with Q]".blue.bold,
                name: "quantity",
                validate: function validateQ(name) {
                    if (name === "Q") { end() }
                    else if (!parseInt(name, 10)) {
                        console.log("\nPlease introduce a valid quantity".red.bold);
                    }
                    else {
                        return true
                    }
                }
            }
        ])
        .then(function (resInput) {

            updateStock(resInput);

        })
}

function updateStock(resInput) {

    query = "SELECT * FROM products where item_id =" + resInput.productID;

    connection.query(query, function (error, resQuery) {
        if (error) throw error;

        if (resQuery.length === 0) {
            console.log("Invalid id, we don't have this product ".red.bold + "\n");
            startPrompt();
            return;
        }

        var newStock = parseInt(resQuery[0].stock_quantity) + parseInt(resInput.quantity);

        var query =
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStock,
                    },
                    {
                        item_id: resInput.productID
                    }
                ], function (error, res) {
                    if (error) throw error;

                    var display = "\nStock added to " + resQuery[0].product_name + ", the total stock is: " + newStock;

                    console.log(display.blue.green);

                    console.log("\n");
                    startPrompt();

                });


    });


}

////// "Add New Product" /////

function addNewProduct() {
    connection.query("SELECT department_name FROM products group by department_name", function (error, res) {

        if (error) throw error;

        var departmentsArray = [];
        for (var i = 0; i < res.length; i++) {
            departmentsArray.push(res[i].department_name);
        }
        addNewInventory(departmentsArray);

    });
}

function addNewInventory(departmentsArray) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Type product name [Quit with Q]".blue.bold,
                name: "productName",
                validate: function (name) {
                    if (name === "Q") { end() }
                    else
                        return true
                }
            },
            {
                type: 'list',
                message: "Type department name [Quit with Q]".blue.bold,
                choices: departmentsArray,
                name: "departmentName",
                validate: function (name) {
                    if (name === "Q") { end() }
                    else
                        return true
                }
            },
            {
                type: 'input',
                message: "Type item price? [Quit with Q]".blue.bold,
                name: "price",
                validate: function validateQ(name) {
                    if (name === "Q") { end() }
                    else if (!parseFloat(name, 10)) {
                        console.log("\nPlease introduce a valid price".red.bold);
                    }
                    else {
                        return true
                    }
                }
            },
            {
                type: 'input',
                message: "Type stock ? [Quit with Q]".blue.bold,
                name: "stock",
                validate: function validateQ(name) {
                    if (name === "Q") { end() }
                    else if (!parseInt(name, 10)) {
                        console.log("\nPlease introduce a valid quantity".red.bold);
                    }
                    else {
                        return true
                    }
                }
            }
        ])
        .then(function (resInput) {

            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: resInput.productName,
                    department_name: resInput.departmentName,
                    price: resInput.price,
                    stock_quantity: resInput.stock
                },
                function (err, res) {
                    console.log("\n");
                    console.log("Product added".green.bold);
                    console.log("\n");
                    startPrompt();
                }
            );

        })

}

///////// Close the pgm //////////

function end() {
    console.log("\n____________________________________________\n")
    console.log("Have a good day".green.bold + "\n");
    connection.end();
    process.exit();
}