const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const PORT = 3000;

let items = ["Sample Item"];

app.get('/', (req, res) => {

    const options = { weekday: 'long', day: 'numeric', month: 'long', };
    const today = new Date().toLocaleString('en-us', options);
    res.render('index', { day: today, newItem: items });
})

app.post('/', (req, res) => {
    items.push(req.body.newTodo);
    res.redirect('/');
})


app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
});