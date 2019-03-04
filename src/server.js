const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  switch (request.method) {
    //case for get requests
    case 'GET':
      if (parsedUrl.pathname === '/') { //index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') { //css
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getChars') { //get characters
        responseHandler.getChars(request, response);
      } else { //any other url is notReal
        responseHandler.notReal(request, response);
      }
      break;
    //case for head requests
    case 'HEAD':
      if (parsedUrl.pathname === '/getChars') { //get characters head
        responseHandler.getCharsMeta(request, response);
      } else { //any other url is notReal head
        responseHandler.notRealMeta(request, response);
      }
      break;
    //case for post requests
    case 'POST':
      if (parsedUrl.pathname === '/addChar') { //add character
        const res = response;
        const body = [];

        //on an error, return 400 missing params
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        //push data
        request.on('data', (chunk) => {
          body.push(chunk);
        });

        //add character
        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);

          responseHandler.addChar(request, res, bodyParams);
        });
      } else if(parsedUrl.pathname === '/addSpell'){ //add spell
        const res = response;
        const body = [];
        
        //on an error, return 400 missing params
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });
        
        //push data
        request.on('data', (chunk) => {
          body.push(chunk);
        });
        
        //add spell
        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);
          
          responseHandler.addSpell(request, res, bodyParams);
        });
      }
      break;
    //any other case is notReal
    default:
      responseHandler.notReal(request, response);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
