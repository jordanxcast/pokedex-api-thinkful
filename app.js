require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const app = express();

console.log(process.env.API_TOKEN);

app.use(morgan('dev'));

// app.use((req, res) => {
//   res.send('Hello, world!');
// });

//this would call validateBearerToken for EVERY endpoint
// app.use(validateBearerToken);

const pokeTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychich', 'Rock', 'Steel', 'Water'];

function handleGetTypes(req, res) {
  res.json(pokeTypes);
  res.send(pokeTypes);
}

function handleGetPokemon(req, res){
  // res.send('Hello, Pokemon!');
  const { name, type } = req.query;
  let response = POKEDEX.pokemon;

  if(name){
    response = response.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if(type) {
    response = response.filter(pokemon => 
      pokemon.type.includes(type)  
    );
  }
  
  res.json(response);
  console.log(response);
  res.send(response.name);
}

app.get('/pokemon', handleGetPokemon);

function validateBearerToken(req, res, next) {
  //this get method is DIFFERENT from the app.get()
  //this is fetching a value from our request header
  const authVal = req.get('Authorization') || '';
  console.log(authVal);
  if(!authVal.startsWith('Bearer ')){
    return res.status(400).json({error: 'Missing or Malformed Authorization header'});
  }

  //SHOULD HAVE: ['Bearer', 12345] so our value we want would be index 1
  // const token = authVal.split(' ')[1];
  const token = 1234567890;

  //set this variable to the token in our .env file
  // const apiToken = process.env.API_TOKEN;
  const apiToken = 1234567890;

  //then compare the token to the env token to ensure the user is authorized
  if (token !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'});
  }

  next();
}

app.get('/types', handleGetTypes);
app.get('/pokemon', handleGetPokemon);

//configure out listening port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
