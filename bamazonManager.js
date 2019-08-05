var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var chalk=require("chalk");
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Raghav@123",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showStartPrompt();
  
});


function showStartPrompt() {
    inquirer
      .prompt(
 
      {
        name: 'M_task',
        type: 'list',
        message: 'What would you like to do ?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory','Add New Product','Quit'],
      }
      )
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.M_task === 'View Products for Sale') {
            showProduct();
          }else if (answer.M_task === 'View Low Inventory') {
            showLowInventory();
          }else if (answer.M_task === 'Add to Inventory') {
            addInventory();
          }else if (answer.M_task === 'Add New Product') {
            addNewProduct();
          }else{
            console.log("Thank you !")
            connection.end();
          } 
      });
  }

  function showProduct() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var displayTable  = new Table({
        head: ['Id', 'Product Name','Products Sales','Department Name','Price','Stock Quantity']
      , colWidths: [10, 25,20, 25, 10, 20]
      });
      for (var i = 0; i < res.length; i++) {
        displayTable.push([res[i].item_id, res[i].product_name, res[i].product_sales, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log(displayTable.toString() + "\n");
      showStartPrompt();
    });
  }

  function showLowInventory(){
    connection.query("SELECT * FROM products where stock_quantity < 5", function(err, res) {
        if (err) throw err;
        var displayTable  = new Table({
            head: ['Id', 'Product Name','Products Sales','Department Name','Price','Stock Quantity']
            , colWidths: [10, 25,20, 25, 10, 20]
        });
        for (var i = 0; i < res.length; i++) {
          displayTable.push([res[i].item_id, res[i].product_name, res[i].product_sales, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(displayTable.toString() + "\n");
        showStartPrompt();
      });
  }

  function addInventory(){
    connection.query("SELECT * FROM products ", function(err, res) {
        if (err) throw err;
        var displayTable  = new Table({
            head: ['Id', 'Product Name','Products Sales','Department Name','Price','Stock Quantity']
            , colWidths: [10, 25,20, 25, 10, 20]
          });
          for (var i = 0; i < res.length; i++) {
            displayTable.push([res[i].item_id, res[i].product_name, res[i].product_sales, res[i].department_name, res[i].price, res[i].stock_quantity]);
          }
        console.log(displayTable.toString());
        inquirer
        .prompt([
        {
          name: 'add_item_id',
          type: 'text',
          message: 'What is the ID of the item you would like to add?',
        },
        {
            name: 'add_item_quantity',
            type: 'text',
            message: 'How many would you like to add?',
          },
      
      ])
      .then(function( answer) {
           connection.query("UPDATE products SET stock_quantity= stock_quantity + " + answer.add_item_quantity + " WHERE item_id="+ answer.add_item_id);
           
            console.log("Successfully Added Inventory Item \n" );
            showStartPrompt();
        });
    });
    
  }

  function addNewProduct(){
    connection.query("SELECT DISTINCT department_name FROM products;", function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([
            {
            name: 'new_item_name',
            type: 'text',
            message: 'What is the name of the product you would like to add?',
            },
            {
            name: 'new_item_department',
            type: 'rawlist',
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].department_name);
                }
                return choiceArray;
            },
            message: 'Which department does this product fall into?',
            },
            {
                name: 'new_item_price',
                type: 'text',
                message: 'How much does it cost?',
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  },
            },
            {
                name: 'new_item_quantity',
                type: 'text',
                message: 'How many do we have?',
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  },
            },
        ]).then (function(answer){

            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.new_item_name,
                  product_sales:0,
                  department_name: answer.new_item_department ,
                  price: answer.new_item_price,
                  stock_quantity: answer.new_item_quantity
                },
                function(err, res) {
                  if (err) throw err;
                  console.log(answer.new_item_name + " product inserted to Bamazon!\n");
                  showStartPrompt();
                });



        })
    });
   
  }
