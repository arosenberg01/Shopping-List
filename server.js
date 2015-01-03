var http = require('http');
var url = require('url');
var join = require('path').join;
var fs = require('fs');
var qs = require('querystring');
var parse = require('url').parse;

var items = ['milk', 'cheese'];
var root = __dirname;	

var server = http.createServer(function (req, res) {
	switch (req.method) {
		case 'POST':
			var item = '';
			req.setEncoding('utf8');
			req.on('data', function (chunk) {
				item += chunk;
			});
			req.on('end', function() {
				var obj = qs.parse(item);
				items.push(obj.item);
				console.log(items);
				
			list = '';
			items.forEach(function (item, i) {
				list += "<li>" + item + "</li>";
			})
			res.write("<!DOCTYPE html><html><head><title>Shopping List</title></head><body><form method=\"post\"><input type=\"text\" name=\"item\" placeholder=\"Enter an item\"><button>Add Item</button></form><h2>Shopping List</h2><ul id=\"list\">" + list + "</ul></body></html>");
			res.end();
			});
			break;
		case 'GET':
			list = '';
			items.forEach(function (item, i) {
				list += "<li>" + item + "</li>";
			});
			res.write("<!DOCTYPE html><html><head><title>Shopping List</title></head><body><form method=\"post\"><input type=\"text\" name=\"item\" placeholder=\"Enter an item\"><button>Add Item</button></form><h2>Shopping List</h2><ul id=\"list\">" + list + "</ul></body></html>");	
			break;
		case 'DELETE':
			var pathname = url.parse(req.url).pathname;
			var i = parseInt(pathname.slice(1), 10);
			if (isNaN(i)) {
				res.statusCode = 400;
				res.end('Item id not valid');
			} else if (!items[i]) {
				res.statusCode = 404;
				res.end('Item not found');
			} else {
				items.splice(i, 1);
				res.end('Item deleted successfully');
			}
			break;
		case 'PUT':
			var item = '';
			req.setEncoding('utf8');
			req.on('data', function (chunk) {
				item += chunk;
			});
			var pathname = url.parse(req.url).pathname;
			var i = parseInt(pathname.slice(1), 10);
			if (isNaN(i)) {
				res.statusCode = 400;
				res.end('Item id not valid');
			} else if (!items[i]) {
				res.statusCode = 404;
				res.end('Tem not found');
			} else {
				req.on('end', function() {
					items.splice(i, 1, item);
					res.end('Item updated successfully');
				});
			}
			break;
			
	}

	// var url = parse(req.url);
	// var path = join(root, url.pathname);
	// fs.stat(path, function (err, stat) {
 //        if (err) {
 //            if (err.code == 'ENOENT') {
 //                res.statusCode = 404;
 //                res.end('File Not Found');
 //            }
 //            else {
 //                res.statusCode = 500;
 //                res.end('Internal Server Error1');
 //            }
 //        } else {
 //            var stream = fs.createReadStream(path);
 //            // res.setHeader('Content-Length', stat.size);
 //            stream.pipe(res);
 //            stream.on('error', function (err) {
 //                res.statusCode = 500;
 //                res.end('Internal Server Error2');
 //            });
 //        }
 //    });
});

server.listen(9000, function() {
	console.log('listening on 9000');
});