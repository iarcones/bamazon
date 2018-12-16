var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors');
var error = colors.red;

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
    console.log("\n*************".magenta)
    console.log("\nBamazon Store".magenta.bold)
    console.log("\n*************\n".magenta)
    queryAllProducts();
});


var itemsArray = [];

function startPrompt() {

    inquirer
        .prompt([
            {
                type: 'input',
                message: "What is the ID of the product you would like to purchase? [Quit with Q]".blue.bold,
                name: "productID",
                validate: function validateProductID(name) {
                    if (name === "Q") { end() }
                    else if (parseInt(name) > parseInt(lastID) || !parseInt(name, 10)) {
                        console.log("\nPlease introduce a valid id".red.bold);
                    }
                    else {
                        return true
                    }
                }
            },
            {
                type: 'input',
                message: "How many would you like? [Quit with Q]".blue.bold,
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

            if (resInput.productID === "Q" || resInput.quantity === "Q") {
                end();
            }
            else {
                customerOrder(resInput);
            };
        })
}


function customerOrder(resInput) {

    query = "SELECT * FROM products where item_id =" + resInput.productID;

    connection.query(query, function (error, resQuery) {
        if (error) throw error;

        if (resQuery.stock_quantity < resInput.quantity) {
            console.log("Insufficient quantity!".red + "we have: ".red + resQuery.stock_quantity.red);
            askLessQuatity(resInput.productID);
        }
        else {
            processOrder(resInput, [resQuery]);
        }

    });

}

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (error, res) {
        if (error) throw error;
        console.log(res);
        var table = new Table({
            head: ['itemId'.cyan.bold, 'Product'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold]
            , colWidths: [10, 50, 30, 10]
        });
        for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].res);
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]
            );
        }

        console.log(table.toString());
        startPrompt()

    });
}


function processOrder(resInput, [resQuery]) {

    var newStock = parseInt(resQuery[0].stock_quantity) - parseInt(resInput.quantity);
    var newTotal = parseFloat(resQuery[0].product_sales) + (parseInt(resInput.quantity) * parseFloat(resQuery[0].price));
    console.log(newStock + " | " + newTotal);

    var query =
        connection.query("UPDATE products SET ?, ? WHERE ?",
            [
                {
                    stock_quantity: newStock,
                },
                {
                    product_sales: newTotal,
                },
                {
                    item_id: resInput.productID
                }
            ], function (error, res) {
                if (error) throw error;

                var display = "\nThanks for your order of " + resQuery[0].product_name + ", the total cost was: " + resQuery[0].price * resInput.quantity + "\n";

                console.log(display.green.bold);

                startPrompt();

            });


}

function end() {
    console.log("\n____________________________________________\n")
    console.log("Thanks for visiting, hope you come back soon".green.bold + "\n");
    connection.end();
    process.exit();
}