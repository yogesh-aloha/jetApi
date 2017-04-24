var cron = require('node-cron'),
    moviesModel = require('./models/moviesModel'),
    isRunning = false;

console.log('JOB STARTED');

//Cron-job for storing movie information.
cron.schedule('*/2 * * * *', function() {
  if(!isRunning){
    isRunning = true;
    moviesModel.StoreAllThetericalMovies(' ',function(err,result){
			if(err){ isRunning = false; console.log('ERROR : Error occuered during storing Theterical Movies.');}
			else {isRunning = false; console.log('SUCCESS : Succesfully saved Theterical Movies.');}
		});
  }
});
