const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = 3000;

let personalTodoList = ["Sample Item"];
let workTodoList = [];

app.get('/', (req, res) => {

    const options = { weekday: 'long', day: 'numeric', month: 'long', };
    const today = new Date().toLocaleString('en-us', options);
    res.render('index', { pageTitle: today, todoItems: personalTodoList, buttonValue: today });
})

app.get("/work", (req, res) => {
    const workTitle = "Work"
    res.render('index', {pageTitle: workTitle, todoItems: workTodoList, buttonValue: workTitle});
})

app.get("/about", (req, res) => {
    res.render('about');
})

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


app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});