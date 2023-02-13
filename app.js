const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Success');
})


app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
});