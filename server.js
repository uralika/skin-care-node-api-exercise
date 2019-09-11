// Create express app
const express = require('express');
const app = express();
const db = require('./database.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

// Server port
const HTTP_PORT = 8000;

// Start server
app.listen(HTTP_PORT, () => {
	console.log(`Server running on port ${HTTP_PORT}`);
});

// Root endpoint
app.get('/', (req, res, next) => {
	res.redirect("/api/products");
});

app.get('/api/products', (req, res, next) => {
	const filters = req.query.filters;
	let sql = 'SELECT * FROM products';
	let params = [];

	if (filters) {
		sql += ` WHERE category=${filters}`;
	}

	sql += ` ORDER BY rating DESC;`;

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({"error": err.message});
			return;
		}

		res.send({'products': rows}).status(200);
	});
});

// 2. Retrieve details of 1 skincare product
app.get('/api/products/:id', (req, res, next) => {
	const sql = 'SELECT * FROM products where id = ?',
		params = [req.params.id];

	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({'error': err.message});
			return;
		}

		res.send({'product': row}).status(200);
	});
});

app.post('/api/products', (req, res, next) => {
	const reqBody = req.body;
	let errors = [];

	if (!reqBody.name || typeof(reqBody.name) !== 'string') {
		errors.push('name');
	}

	if (!reqBody.price || typeof(reqBody.price) !== 'number') {
		errors.push('price');
	}

	if (!reqBody.link || typeof(reqBody.link) !== 'string') {
		errors.push('link');
	}

	if (!reqBody.rating || typeof(reqBody.rating) !== 'number') {
		errors.push('rating');
	}

	if (!reqBody.category || typeof(reqBody.rating) !== 'string') {
		errors.push('category');
	}

	if (errors.length) {
		console.log('errors', errors);
		res.status(400).json(
			{
				'errors': `Please fix the following field(s): ${errors.join(', ')}.`
			}
		);
		return;
	}

	const data = {
		name: reqBody.name,
		price: reqBody.price,
		link: reqBody.link,
		rating: reqBody.rating,
		category: reqBody.category
	}

	let sql ='INSERT INTO products (name, price, link, rating, category) VALUES (?, ?, ?, ?, ?)';
	const params =[data.name, data.price, data.link, data.rating, data.category];

	db.run(sql, params, function (err, result) {
		if (err){
			res.status(400).json({"error": err.message})
			return;
		}
		res.send({
			'id' : this.lastID,
			'product': data
		}).status(201);
	});
});

// Default response for any other request
app.use(function(req, res) {
	res.status(404);
});
