const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
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

// Collections
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

// Flexible TodoLists
const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    todos: [
        todoSchema
    ]
});
const List = new mongoose.model("List", listSchema);


// Routes
// Get main todo list
app.get('/', async (req, res) => {
    const allTodos = await Todo.find({});
    if(allTodos.length === 0) {
        Todo.insertMany(defaultItems);
    }
    res.render('index', { listTitle: "Today", todoItems: allTodos});
});

// Get custom todo list
app.get('/:customListName', async (req, res) => {
    const name = _.capitalize(req.params.customListName);
    const currentList = await List.findOne({name: name});
    if(!currentList) {
        // Create a new List
        const list = new List({
            name: name,
            todos: defaultItems,
        })
        list.save();
        res.redirect(`/${name}`);
    } else {
        // Show an existing list
        res.render('index', { listTitle: currentList.name, todoItems: currentList.todos});
    }

});

// About this app
app.get("/about",  (req, res) => {
    res.render('about');
})

// Post to todo list
app.post('/', async (req, res) => {
    const listName = req.body.button;
    const newTodoName = req.body.newTodo;
    const newTodo = Todo({
        name: newTodoName,
    });

    if(listName === "Today") {
        newTodo.save();
        res.redirect('/');
    } else {
        const listCollection = await List.findOne({name: listName});
        listCollection.todos.push(newTodo);
        listCollection.save();
        res.redirect(`/${listName}`);
    }

});

// Delete todos
app.post('/delete', async (req, res) => {
    const listName = req.body.listName;
    const checkedTodoId = req.body.checkbox;

    if(listName === "Today") {
        await Todo.findByIdAndRemove(checkedTodoId);
        res.redirect('/');
    } else {
        await List.findOneAndUpdate({name: listName}, {$pull: {todos: {_id: checkedTodoId}}});
        res.redirect(`/${listName}`);
    }
})

// Listener
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});