
/*
 * GET home page.
 */
var FlightSchema=require('../shemas/flight.js')
module.exports = function (flights) {
	var flight = require('../flight');

	for(var number in flights) {
		flights[number] = flight(flights[number]);
	}

	var functions = {};

	functions.flight = function(req, res){
		var number = req.param('number');

		req.session.latsnumber=number;
		if (typeof flights[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			res.json(flights[number].getInformation());
		}
	};

	functions.arrived = function (req, res) {
		var number = req.param('number');

		if (typeof flights[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			flights[number].triggerArrive();
		 var record=new FlightSchema(
			 flights[number].getInformation()
		 );
		 record.save(
			 (err)=>{
				 if(err){
					 console.log(err);
					 res.status(500).json({status:'failure'});
				 }
				 else{
					 res.json({status:'success'});
				 }
			 }
		 );
			res.json({status: 'done'});
		}
	};

	functions.list = function (req, res) {
		res.render('list', {
			title: 'All Flights', 
			flights: flights});
	};
functions.arrivals=(req,res)=>{
FlightSchema.find().setOptions({sort:'actualArrive'})
.exec((err,arrivals)=>{
	if(err){
  console.log(err);
  res.status(500).json({status:'failure'});
	}
	else{
		res.render('arrivals',{
			title:'Arrivals',
			arrivals:arrivals,
			latsnumber:req.session.latsnumber
		})
	}
})
};	
        functions.login=(req,res)=>{
		
			res.render('login',{title:'Log in'});
	  
		};

    functions.user=(req,res)=>{
    if(req.session.passport.user===undefined){
         res.redirect('/login');
	}	
	else{
		res.render('user',{title:'Welcome!', user:req.user})
	}
};
	return functions;
};
