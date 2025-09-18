const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  pokemon.height = pokeDetail.height * 10 + " cm";
  pokemon.weight = pokeDetail.weight / 10 + " kg";
  pokemon.abilities = pokeDetail.abilities
    .map((abilitySlot) => abilitySlot.ability.name)
    .join(", ");

  pokemon.species = pokeDetail.species.url;

  pokemon.stats = pokeDetail.stats.map((stat) => stat.base_stat);

  console.log(pokeDetail);
  console.log(pokemon);

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemonSpecies = (speciesUrl) => {
  return fetch(speciesUrl).then((response) => response.json());
};

pokeApi.getPokemon = (pokemonNumber) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
  return fetch(url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
    .then((pokemon) => {
      return pokeApi.getPokemonSpecies(pokemon.species).then((species) => {
        pokemon.eggGroups = species.egg_groups
          .map((group) => group.name)
          .join(", ");
        pokemon.eggCycle = species.hatch_counter + " cycles";
        const pokemonSpecies = species.genera.find(
          (genus) => genus.language.name === "en"
        ).genus;
        pokemon.species = pokemonSpecies.split(" ")[0];
        pokemon.femaleGender = (species.gender_rate / 8) * 100;
        pokemon.maleGender = 100 - pokemon.femaleGender;
        return pokemon;
      });
    });
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests));
};
