const chars = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getChars = (request, response) => {
  const responseJSON = {
    chars,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCharsMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
}

const addChar = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill in all fields.',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (chars[body.name]) {
    responseCode = 204;
    
  } else {
    chars[body.name] = {};
  }

  chars[body.name].name = body.name;
  chars[body.name].level = body.level;
  chars[body.name].class = body.class;
  chars[body.name].spells = body.spells.split(',');

  if (responseCode === 201) {
    responseJSON.message = 'Character Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const addSpell = (request, response, body) => {
  const responseJSON = {
    message: 'Please fill in all fields.'
  };
  
  if(!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  
  let responseCode = 204;
  
  if(chars[body.name]){
    if(chars[body.name].spells[0] == "")
      chars[body.name].spells[0] = body.spell;
    else
      chars[body.name].spells.push(body.spell);
  }
  
  responseJSON.message = 'Spell Added Successfully';
  return respondJSON(request, response, responseCode, responseJSON);
}

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getChars,
  getCharsMeta,
  notReal,
  notRealMeta,
  addChar,
  addSpell,
};
