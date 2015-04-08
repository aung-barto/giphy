var http = require("http");
var request = require("request");
var url = require("url");
var fs = require("fs");

//searchGif function
var searchGif = function(res,search){
	fs.readFile("index.html", function(err,data){
		if(err){
			console.log(err);
		}
		else{
			var body = data.toString();
			var splitIndex = body.split("<p>Your Search Coming Up</p>")
			request("http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=dc6zaTOxFJmzC", function(err, response, body){
				var jsBody = JSON.parse(body).data;
				var imageUrl = [];
				for(var i = 0; i < jsBody.length; i++){
					var image = jsBody[i].images.fixed_height.url;
					var link = jsBody[i].url;

					//collecting urls and images
					imageUrl.push("<a href='"+ link + "'><image src='" + image + "'>");
				}
				var newStrg = splitIndex[0] + "<br><p>Click on any images to go to Giphy.com</p><br>" + imageUrl.join("<br>") + splitIndex[1];
				res.end(newStrg);
			});
		}
	});
}
//opening index page
http.createServer(function(req,res){
	if(req.url === "/"){

		//reading index file
		fs.readFile("index.html", function(err, data){
			if(err){
				console.log(err);
			}
			else{
				res.end(data.toString());
			}
		});
	}
	//GET information from search box in index file
	else if(req.method == "GET"){
		var url_parts = url.parse(req.url, true);
		console.log(url_parts.query);

		//obtaining search result, if there are more than one word, split space and replace with + 
		var search = url_parts.query.search.split(' ').join('+');

		//Applies searchGid function
		searchGif(res, search); 
	}
}).listen(3000);
console.log("Server listening on port 3000");
	
	





	