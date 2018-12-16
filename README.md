# Store-node-app
Simulate a general store, with all kind of departments and with 3 diferents APP based on the role of the user (Customer, Store Manager, Business Supervisor)

## Getting Started

#### These instructions will get you a copy of the project up and running on your local machine.

1. Clone the repository
2. Run nmp install 

#### Go to npmjs if you want to know more about:

1. **mysql**: https://www.npmjs.com/package/mysql
2. **cli-table**: https://www.npmjs.com/package/cli-table
3. **inquirer**: https://www.npmjs.com/package/inquirer
4. **colors**: https://www.npmjs.com/package/colors


## Built With

- Html
- Nodejs
- Javascript
- MySql
- Npmjs packages: **mysql** mysql database access, **cli-table** draw tables, **inquirer** handle prompts, **colors** color, backgrounds.

## Functionality

### Challenge #1: Customer View
https://youtu.be/6RRY5DHhG30

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/6RRY5DHhG30/0.jpg)](http://www.youtube.com/watch?v=6RRY5DHhG30)


Node application called **bamazonCustomer.js**. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
The app will then prompt users with two messages.

- The first asks the customers the ID of the product they would like to buy.
- The second message asks how many units of the product they would like to buy.

Once the customer has placed the order, the application  check if the store has enough of the product to meet the customer's request.
If not, the app log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if the store haves enough of the product, the order is proccesed.

The app includes validations as product sold out, product ever more exist, etc.


### Challenge #2: Manager View 

[![Alt text](https://youtu.be/NEizBw_hUTc)](https://www.youtube.com/watch?v=VID)

A Node application called **bamazonManager.js**. Running this application will:

- List a set of menu options:
    - View Products for Sale
    - View Low Inventory
    - Add to Inventory
    - Add New Product
- Actions:
    - If a manager selects View Products for Sale, the app lists every available item: the item IDs, names, prices, and quantities.
    - If a manager selects View Low Inventory, then it will list all items with an inventory count lower than five.
    - If a manager selects Add to Inventory, the app display a prompt that will let the manager "add more" of any item currently in the store.
    - If a manager selects Add New Product, it allows the manager to add a completely new product to the store.


### Challenge #3: Supervisor View 

[![Alt text](https://youtu.be/uQKCAH_lDNg)](https://www.youtube.com/watch?v=VID)

Another Node app called **bamazonSupervisor.js**. 

- This application will list a set of menu options:

    - View Product Sales by Department
    - Create New Department

- Actions:

    - When a supervisor selects View Product Sales by Department, the app will display a summarized table including: department_id, department_name, over_head_costs, product_sales, total_profit.
    The total_profit column will be calculated on the fly using the difference between over_head_costs and product_sales. The first app bamazonSupervisor.js has been modified to keep track of the product_sales.
     - If the supervisor selects Create New Department, the app allows  to add a completely new department to the store.

  

## Author

Isabel Arcones: https://github.com/iarcones

Here I will be updating some samples of my projects: https://iarcones.github.io/Porfolio/




