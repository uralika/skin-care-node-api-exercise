const sqlite3 = require('sqlite3').verbose(),
	DBSOURCE = 'db.sqlite',
	server = require('./server'),
	urlPrefix = 'http://localhost:8000/';


let db = new sqlite3.Database(DBSOURCE, (err) => {
	if (err) {
	// Cannot open database
	console.error(err.message)
	throw err
	} else {
		console.log('Connected to the SQLite database.')
		db.run(`CREATE TABLE products (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name string NOT NULL,
			price float NOT NULL,
			link text NOT NULL,
			rating float NOT NULL,
			category string NOT NULL,
			CONSTRAINT link UNIQUE (link),
			CONSTRAINT name UNIQUE (name),
			CONSTRAINT category CHECK (category IN ('moisturizers', 'sun protection', 'cleansers', 'face oils'))
			)`,
		(err) => {
			if (err) {
				// Table already created
			} else {
				// Table just created, creating some rows
				let insert = 'INSERT INTO products (name, price, link, rating, category) VALUES (?, ?, ?, ?, ?)';
				db.run(insert, ['Countertime Tetrapeptide Supreme Cream', 89, `${urlPrefix}countertime-tetrapeptide-supreme-cream`, 5, 'moisturizers']);
				db.run(insert, ['Countermatch Adaptive Moisture Lotion', 49 , `${urlPrefix}countermatch-adaptive-moisture-lotion`, 5, 'moisturizers']);
				db.run(insert, ['Dew Skin Tinted Moisturizer', 45, `${urlPrefix}dew-skin-tinted-moisturizer-spf-20`, 4.5, 'moisturizers']);
				db.run(insert, ['Nourishing Night Cream', 49 , `${urlPrefix}nourishing-night-cream`, 3, 'moisturizers']);
				db.run(insert, ['Charcoal Cleansing Bar', 26, `${urlPrefix}charcoal-cleansing-bar`, 5, 'cleansers']);
				db.run(insert, ['Countermatch Pure Calm Cleansing Milk', 32 , `${urlPrefix}countermatch-pure-calm-cleansing-milk`, 4, 'cleansers']);
				db.run(insert, ['One-Step Makeup Remover Wipes', 20, `${urlPrefix}one-step-makeup-remover`, 5, 'cleansers']);
				db.run(insert, ['Countersun After Sun Cooling Gel', 32 , `${urlPrefix}countersun-after-sun-cooling-gel`, 4.5, 'sun protection']);
				db.run(insert, ['Countersun Mineral Sunscreen Stick SPF 30', 21, `${urlPrefix}countersun-mineral-sunscreen-stick-spf-30`, 4.5, 'sun protection']);
				db.run(insert, ['Countersun Mineral Sunscreen Mist SPF 30 Travel Size', 20 , `${urlPrefix}countersun-mineral-sunscreen-mist-spf-30-travel-size`, 5, 'sun protection']);
			}
		});
	}
});


module.exports = db;
