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
    console.log("\n******************************".magenta)
    console.log("\nBamazon Store - Supervisor APP".magenta.bold)
    console.log("\n******************************\n".magenta)
    queryAllProducts();
});



function queryAllProducts() {
    connection.query("SELECT * FROM products", function (error, res) {
        if (error) throw error;

        var table = new Table({
            head: ['itemId'.cyan.bold, 'Product'.cyan.bold, 'Department'.cyan.bold, 'Price'.cyan.bold, 'Stock'.cyan.bold,
            'Product Sales'.cyan.bold,
            ]
            , colWidths: [10, 50, 30, 10, 10, 15]
        });
        var itemsArray = [];
        for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].res);

            table.push([
                res[i].item_id,
                res[i].product_name,
                res[i].department_name, res[i].price,
                res[i].stock_quantity,
                res[i].product_sales
            ]);
        }

        console.log(table.toString());
        startPrompt()

    });
}

function startPrompt() {

    inquirer
        .prompt([
            {
                type: 'list',
                message: "What would you like to do?\n".blue.bold,
                choices: [
                    "View Product Sales by Department",
                    "Create New Department",
                    "Exit"
                ],
                name: "command"
            }
        ])
        .then(function (answer) {

            switch (answer.command) {
                case "View Product Sales by Department":
                    displayDepartments("");
                    break;

                case "Create New Department":
                    addDepartment();
                    break;

                case "Exit":
                    end();
                    break;
            }
        });
}



function displayDepartments() {


    query = "SELECT max(deppro.department_id) as id,deppro.department_name as name, max(deppro.over_head_costs) as costs, sum(deppro.product_sales) as sales from (SELECT departments.department_id, departments.department_name,departments.over_head_costs, pro.product_sales FROM bamazonDB.departments LEFT JOIN bamazonDB.products as pro using(department_name)) as deppro group by deppro.department_name";

    connection.query(query, function (error, res) {
        if (error) throw error;

        var table = new Table({
            head: [
                'department_id'.cyan.bold,
                'department_name'.cyan.bold, 'over_head_costs'.cyan.bold, 'product_sales'.cyan.bold,
                'total_profit'.cyan.bold,
            ]
            , colWidths: [20, 30, 20, 20, 20]
        });

        var itemsArray = [];

        for (var i = 0; i < res.length; i++) {

            itemsArray.push(res[i]);

            if (!parseFloat(res[i].sales, 10)) {
                res[i].sales = 0;
            }

            var total_profit = res[i].sales - res[i].costs;

            table.push([
                res[i].id,
                res[i].name,
                res[i].costs,
                res[i].sales,
                total_profit
            ]);
        }

        console.log(table.toString());
        startPrompt();

    })
}


function addDepartment() {

    inquirer
        .prompt([
            {
                type: 'input',
                message: "Type department name [Quit with Q]".blue.bold,
                name: "departmentName",
                validate: function (name) {
                    if (name === "Q") { end() }
                    else
                        return true
                }
            },
            {
                type: 'input',
                message: "Type over head costs [Quit with Q]".blue.bold,
                name: "costs",
                validate: function validateQ(name) {
                    if (name === "Q") { end() }
                    else if (!parseFloat(name, 10)) {
                        console.log("\nPlease introduce a valid cost".red.bold);
                    }
                    else {
                        return true
                    }
                }
            }
        ])
        .then(function (resInput) {

            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: resInput.departmentName,
                    over_head_costs: resInput.costs,
                },
                function (err, res) {
                    console.log("\n");
                    console.log("Department added".green.bold);
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