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

        if (resQuery.length === 0) {
            console.log("Invalid id, we don't have this product ".red.bold + "\n");
            startPrompt();
            return;
        }

        if (resQuery[0].stock_quantity === 0){
            console.log("Sorry this product is sold out".red.bold + "\n");
            startPrompt();
            return;
        }
        if (resQuery[0].stock_quantity < resInput.quantity) {
            console.log("Sorry insufficient number of items! ".red.bold + "we have: ".red.bold + (resQuery[0].stock_quantity) + " " + resQuery[0].product_name + "\n");

            startPrompt()
        }
        else {
            processOrder(resInput, [resQuery]);
        }

    });

}

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (error, res) {
        if (error) throw error;
        
        var table = new Table({
            head: ['itemId'.cyan.bold, 'Product'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold]
            , colWidths: [10, 50, 30, 10]
        });
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity > 0){
            itemsArray.push(res[i].res);
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2)]
            );
            }
        }

        console.log(table.toString());
        startPrompt()

    });
}

function processOrder(resInput, [resQuery]) {

    var newStock = parseInt(resQuery[0].stock_quantity) - parseInt(resInput.quantity);
    var newTotal = parseFloat(resQuery[0].product_sales) + (parseInt(resInput.quantity) * parseFloat(resQuery[0].price));

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

                var display = "\nThanks for your order of " + resQuery[0].product_name + ", the total cost was: " + (resQuery[0].price * resInput.quantity).toFixed(2) + "\n";

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