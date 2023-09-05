import logo from './logo.svg';
import './App.css';
import { useEffect, useState, version } from "react";

function App() {

  const [regions, setRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toUpper = (stringToUpper) => {
    return stringToUpper.charAt(0).toUpperCase() + stringToUpper.slice(1)
  }

  const getPokemons = async () => {
    try {
      //primera repuesta
      const request = await fetch(`https://pokeapi.co/api/v2/pokedex`);
      const response = await request.json();

      //segunda repuesta con la info completa
      const pokemonInfoArray = await Promise.all(response.results.map(async (poke) => {
        const pokeRequest = await fetch(poke.url);
        return await pokeRequest.json();
      }
      ));

      setRegions(pokemonInfoArray);
    } catch (error) {
      console.log(error);
    }

  };

  const filteredRegions = regions.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    getPokemons();
  }, []);



  return (
    <div className="App">
      <h1>Pokedex</h1>
      <div className='container'>
        <h2>RAW info in console </h2>

        {console.log(regions)}

        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
        />
        <table className='table table-dark table-hover'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Is main Series?</th>
              <th>Version groups</th>
              <th>Total pokemons</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegions.map((pokemon, index) => (

              <tr key={index}>
                <td >{pokemon.id}</td>
                <td >{toUpper(pokemon.name)}</td>
                <td >{toUpper((pokemon.descriptions.length > 2 ? pokemon.descriptions[2].description : pokemon.descriptions[0].description))}</td>
                <td >{(pokemon.is_main_series ? "Yes" : "No")}</td>
                <td >{pokemon.version_groups.length > 0 ? (pokemon.version_groups.map(version => toUpper(version.name + " "))) : "Does´nt have"}</td>
                <td >{pokemon.pokemon_entries.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
