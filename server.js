// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));


//Connect Mongo

mongoose.connect(`mongodb+srv://suyog:suyog@drawingboard.rjmwcwn.mongodb.net/?retryWrites=true&w=majority&appName=DrawingBoard`)
.then(() =>{
    console.log(`MongoDB is connected!!!`)
})
.catch(error => {
    console.log(error);
});

const drawingSchema = new mongoose.Schema({
    drawing: [String]
});

const Drawing = mongoose.model('Drawing', drawingSchema);

app.post('/save', (req, res) => {
    const newDrawing = new Drawing({ drawing: req.body.drawing });
    newDrawing.save()
        .then(() => {res.status(200).json({ message: 'Drawing saved successfully' })
    console.log("success")})
        .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
