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
 // console.log("connected as id " + connection.threadId);
 
  showProduct();
  
});

function showProduct() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var displayTable  = new Table({
        head: ['Id', 'Product Name','Products Sales','Department Name','Price','Stock Quantity']
      , colWidths: [10, 25,20, 25, 10, 20]
      });
      for (var i = 0; i < res.length; i++) {
        displayTable.push([
          res[i].item_id,
          res[i].product_name,
          res[i].product_sales, 
          res[i].department_name, 
          res[i].price, 
          res[i].stock_quantity]);
      }
      console.log(displayTable.toString()+ "\n");
      start();
    });
  }
function start() {
    inquirer
      .prompt([
      {
        name: 'pursase_item_id',
        type: 'text',
        message: 'What is the ID of the item you would like to purchase?',
        validate: function(value) {
          if (isNaN(value) == false && parseInt(value) > 0) {
            return true;
          }
          return false;
        },
      },
      {
        name: 'pursase_item_count',
        type: 'text',
        message: 'How many would you like?',
        validate: function(value) {
            if (isNaN(value) === false ) {
              return true;
            }
            return false;
        },
      }])
      .then(function(answer) {
        
       var purchase_id= answer.pursase_item_id ;
       var purchase_count= answer.pursase_item_count ;
       if(purchase_id==="q" || purchase_count==="q"){
         console.log("Thank you !");
         connection.end();
       }else{
        purchase_order(purchase_id, purchase_count);
       }
       
      });
  }

  function purchase_order(purchase_id, purchase_count) {
   
    connection.query("SELECT * FROM products where item_id="+purchase_id, function(err, res) {
      if (err) throw err;
     if(purchase_count<=res[0].stock_quantity){
       var totalcost=purchase_count * res[0].price;
       console.log("Successful Purchase " + purchase_count +" "+res[0].product_name + totalcost );
       console.log("Your total cost for  " + purchase_count +" "+res[0].product_name+" is " + totalcost +"\n");
       connection.query(
      // "UPDATE products SET stock_quantity= stock_quantity - " + purchase_count, + "product_sales= 10, WHERE item_id="+ purchase_id
         "UPDATE products SET product_sales= product_sales + " + totalcost + " WHERE item_id="+ purchase_id,
        );
      connection.query(
       "UPDATE products SET stock_quantity= stock_quantity - "+ purchase_count + " WHERE item_id="+ purchase_id
        );
     }else{
      console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + " to complete your order. \n");
     }
     confirmPurchase();
     
     
    });
   // 
  }

 function confirmPurchase(){
  inquirer
  .prompt([
  {
    name: 'confirm',
    type: 'list',
    message: 'Would you like to purchase another item ?',
    choices: ['YES', 'NO'],
  }
  ])
  .then(function(answer) {
      if(answer.confirm==="YES"){
         showProduct();
      }else if(answer.confirm==="NO"){
        console.log("See you soon!");
        connection.end();
      }
  });
 }