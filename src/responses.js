const chars = {};

//general function for JSON response
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//general function for JSON head response
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

//get request for getting stored characters
const getChars = (request, response) => {
  const responseJSON = {
    chars,
  };

  return respondJSON(request, response, 200, responseJSON);
};

//head request for getting stored characters
const getCharsMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

//post request for adding characters
const addChar = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill in all fields.',
  };

  //if no name, return 400 missing parameters
  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //set default response code 201 created
  let responseCode = 201;

  //if character name already exists, change response code to 204 updated
  if (chars[body.name]) {
    responseCode = 204;
  } else { //if character name does not exist, create new character object
    chars[body.name] = {};
  }

  //set all values of character object
  chars[body.name].name = body.name;
  chars[body.name].level = body.level;
  chars[body.name].class = body.class;
  chars[body.name].spells = body.spells.split(',');

  //if created new character, respond with 201
  if (responseCode === 201) {
    responseJSON.message = 'Character Created';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  
  //if updated character, respond with 204 meta response
  responseJSON.message = 'Character Updated';
  return respondJSON(request, response, responseCode, responseJSON);
};

//post request for adding spells to a character
const addSpell = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill in all fields.',
  };
  
  //if no name, return 400 missing parameters
  if(!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //if character name does not exist, exit function
  if(!chars[body.name]){
    responseJSON.id = 'wrongChar';
    return respondJSON(request, response, 400, responseJSON);
  }
  
  if(chars[body.name].spells[0] === ""){
    chars[body.name].spells[0] = body.spell;
  }
  else{
    chars[body.name].spells.push(body.spell);
  }
    
  responseJSON.message = 'Spell Added';
  return respondJSON(request, response, 204, responseJSON);
};

//get request for 404
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

//head request for 404
const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

//export methods
module.exports = {
  getChars,
  getCharsMeta,
  notReal,
  notRealMeta,
  addChar,
  addSpell,
};
