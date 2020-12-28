const express = require('express');
const hbs = require('hbs');
const mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

const app = express();

//Take the data from textbox by using bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs'); //Using template engine

hbs.registerPartials(__dirname + '/views/partials'); //Link the partials
app.use(express.static(__dirname + '/public')); //Link public 

var url = 'mongodb+srv://vunam2000:Vuhainam0123456@cluster0.zi4ld.mongodb.net/test'


//Index
app.get('/', (req, res) => {
    let pageTitle = 'Index Page';
    res.render('index', {pageTitle});
})

//Add
app.get('/insert', (req, res) => {
    let pageTitle = 'Add Product'
    res.render('addProduct', {pageTitle});
})

app.post('/doAdd', async (req, res) => {
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let cateInput = req.body.txtCate;
    let ageInput = req.body.txtAge;

    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db("ProductDB");
    let newProduct = { productName: nameInput, price: priceInput, color: colorInput, category: cateInput, age: ageInput};
    await dbo.collection('product').insertOne(newProduct);

    res.redirect('/show');
})

//Show
app.get('/show', async (req, res) => {
    let pageTitle = 'Show Product'
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});    //Access the user
    let dbo = client.db('ProductDB');     //Access the database
    let results = await dbo.collection('product').find({}).toArray();
    res.render('showProduct', { model: results, pageTitle });
})

//Search
app.get('/search', (req, res) => {
    let pageTitle = 'Search Page'
    res.render('searchProduct', {pageTitle});
})

app.post('/doSearch', async (req, res) => {
    let nameProInput = new RegExp(req.body.txtSearch); //use regex to find approximatelly search
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db('ProductDB');

    let searchProduct = { productName: nameProInput };
    let results = await dbo.collection('product').find(searchProduct).toArray();
    res.render('searchProduct', { proSearch: results });
})

//Update
app.post('/findUpdate', async (req, res) => {
    let pageTitle = 'Update Page'
    //Get the id of button Update
    let idGet = req.body.id;
    let id = new mongodb.ObjectID(idGet)

    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db('ProductDB');

    let findUpdate = { _id: id };
    let results = await dbo.collection('product').find(findUpdate).toArray();
    res.render('updateProduct', { findUpdate: results, pageTitle });
})

app.post('/doUpdate', async (req, res) => {
    //Get the data of form
    let nameF = req.body.name;
    let priceF = req.body.price;
    let colorF = req.body.color;
    let idF = req.body.id;
    let cateF = req.body.cate;
    let ageF = req.body.age;

    let id = new mongodb.ObjectID(idF);
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db('ProductDB');

    let doUpdate = { _id: id };
    await dbo.collection('product').updateOne(doUpdate, { $set: { productName: nameF, price: priceF, color: colorF , category: cateF, age: ageF} })
    res.redirect('/show');
})

//Delete
app.post('/findDelete', async (req, res) => {
    let idF = req.body.id;
    let id = new mongodb.ObjectID(idF);
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});

    let dbo = client.db('ProductDB');

    let doDelete = { '_id': id };
    await dbo.collection('product').deleteOne(doDelete);
    res.redirect('/show');
}) 


var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log('Server is running!');