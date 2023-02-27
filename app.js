const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Database
const mongoDbUri = process.env.MONGODB_URI;
const database = "todoListDB";
mongoose.set("strictQuery", false);
mongoose.connect(`${mongoDbUri}/${database}`);

// Collection
const todoSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Todo entry rejected, you must set a title."]
    }
});
const Todo = mongoose.model("Todo", todoSchema);

// Default items
const item1 = new Todo({
    name: "Welcome to your Todo List"
});
const item2 = new Todo({
    name: "Write a name and hit the + button to add an item."
});
const item3 = new Todo({
    name: "<-- Press this checkbox to delete an item"
});

const defaultItems = [item1, item2, item3];

// TODO remove
let workTodoList = [];

// Routes
// Get main todo list
app.get('/', async (req, res) => {
    const today = date.getDate();
    const allTodos = await Todo.find({});
    if(allTodos.length === 0) {
        Todo.insertMany(defaultItems);
    }
    res.render('index', { pageTitle: today, todoItems: allTodos, buttonValue: today });
})

// Get work todo list
app.get("/work", (req, res) => {
    const workTitle = "Work"
    res.render('index', {pageTitle: workTitle, todoItems: workTodoList, buttonValue: workTitle});
})

// About this app
app.get("/about", (req, res) => {
    res.render('about');
})

// Post to either of the todo lists
app.post('/', (req, res) => {
    const newTodoItem = req.body.newTodo;
    if(req.body.button === "Work") {
        workTodoList.push(newTodoItem);
        res.redirect('/work');
    } else {
        personalTodoList.push(newTodoItem);
        res.redirect('/');
    }
})

// Listener
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});