var express = require('express')
var app = express()

app.set('view engine', 'ejs');

app.get('/math/:type', function(req, res, next) {
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
		next(new Error('Unsupported Operation'))
	}
});

//app.use('/static', express.static('static'));

app.get('/', function(req, res) {
	res.render('splash');
	//	res.send('Math For Kids');
})

app.use(function(err, req, res, next) {
	if(err.message == 'Unsupported Operation') {
		return next();
	}
	res.status(500).end();
});


app.use(function(req, res, next) {
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

app.listen(3000, function() {
	console.log('Example app listening on port 3000!')
})
