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
        name: 'S_task',
        type: 'list',
        message: 'What would you like to do ?',
        choices: ['View Product Sales by Department', 'Create New Department','Quit'],
      }
      )
      .then(function(answer) {
       
        if (answer.S_task === 'View Product Sales by Department') {
            showProduct();
        }else if (answer.S_task === 'Create New Department') {
            createDepartment();
        }else{
            console.log("Thank you !")
            connection.end();
          } 
      });
  }

  function showProduct() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
      var displayTable  = new Table({
        head: ['Id', 'Department Name','Over-head Costs','Product Sales','Total Profit']
      , colWidths: [10, 25,20, 25, 20]
      });
      for (var i = 0; i < res.length; i++) {
        displayTable.push([
            res[i].department_id, 
            res[i].department_name, 
            res[i].over_head_costs, 
            res[i].product_sales, 
            res[i].product_sales - res[i].over_head_costs]);
      }
      console.log(displayTable.toString() + "\n");
      showStartPrompt();
    });
  }


  function createDepartment(){
    connection.query("SELECT * FROM departments ", function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([
            {
            name: 'new_department_name',
            type: 'text',
            message: 'What is the name of the department you would like to add?',
            },
            {
            name: 'new_over_head_costs',
            type: 'text',
            message: 'How much does it over-head cost?',
            default: 0,
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              },
            },
           
            
        ]).then (function(answer){

            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                  department_name: answer.new_department_name,
                  over_head_costs:answer.new_over_head_costs,
                  product_sales: 0, 
                },
                function(err, res) {
                  if (err) throw err;
                  console.log(answer.new_department_name + " department inserted to Bamazon!\n");
                  showStartPrompt();
                });



        })
    });
   
  }



