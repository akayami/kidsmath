const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const os = require('os');

module.exports = (flags) => {
	
	let log_options = {};
	if(flags.logs) {
		log_options.stream = fs.createWriteStream(flags.logs, {flags: 'a'})
	}
	app.use(require('morgan')('combined', log_options));
	// app.use(require('morgan')('combined', {
	// 	stream: fs.createWriteStream(path.join(os.tmpdir(), '/access.log'), {flags: 'a'})
	// }));
	
	app.set('view engine', 'ejs');
	
	app.get('/math/:type', function (req, res, next) {
		var operations = {};
		operations['multiplication'] = {
			operator: '*',
			type: 'multiplication',
			template: 'multi'
		};
		operations['addition'] = {
			operator: '+',
			type: 'addition',
			template: 'multi'
		};
		operations['substraction'] = {
			operator: '-',
			type: 'substraction',
			template: 'multi'
		};
		operations['division'] = {
			operator: '/',
			type: 'division',
			template: 'multi'
		};
		if (operations[req.params.type]) {
			res.render(operations[req.params.type].template, operations[req.params.type]);
		} else {
			next(new Error('Unsupported Operation'));
		}
	});
	app.get('/', function (req, res) {
		res.render('splash');
		//	res.send('Math For Kids');
	});
	
	app.use(function (err, req, res, next) {
		if (err.message == 'Unsupported Operation') {
			return next();
		}
		res.status(500).end();
	});
	
	
	app.use(function (req, res, next) {
		res.status(404);
		
		// respond with html page
		if (req.accepts('html')) {
			res.render('404', {
				url: req.url
			});
			return;
		}
		
		// respond with json
		if (req.accepts('json')) {
			res.send({
				error: 'Not found'
			});
			return;
		}
		
		// default to plain-text. send()
		res.type('txt').send('Not found');
	});
	app.listen(flags.port, function () {
		console.log(`Example app listening on port ${flags.port}!`);
	});
};
