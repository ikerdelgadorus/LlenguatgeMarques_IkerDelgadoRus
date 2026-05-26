let specieActual;
let pokemonActual;
let lenguageActual = 8;
let variety = 0;


load();

async function load() {

    let response = await fetch("https://pokeapi.co/api/v2/pokemon/999/");

    let data = response.json();
    console.log("Ditto")
    console.log(data);

    let type = await fetch(`https://pokeapi.co/api/v2/type/ghost`);
    let typedata = await type.json();
    console.log("Ghost")
    console.log(typedata);

    let spec = await fetch(`https://pokeapi.co/api/v2/pokemon-species/999/`);
    let specie = await spec.json();
    console.log("Specie")
    console.log(specie);

    let evolution = await fetch(`https://pokeapi.co/api/v2/evolution-chain/40/`);
    let evo = await evolution.json();
    console.log("Evo")
    console.log(evo);

    let hab = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/8/`);
    let hab1 = await hab.json();
    console.log("Habitat")
    console.log(hab1);

    let generation = await fetch(`https://pokeapi.co/api/v2/generation/1/`);
    let gen = await generation.json();
    console.log("Generation")
    console.log(gen);

    let hability = await fetch(`https://pokeapi.co/api/v2/ability/75/`);
    let habi = await hability.json();
    console.log("Hability")
    console.log(habi);

}

function thousandNumber(num) {
    let string = num.toString();
    for (let i = 0; i < (4 - num.toString().length); i++) {
        string = "0" + string;
    }
    console.log(string);
    return string;
}

function changeName() {
    lenguageActual = (lenguageActual + 1) % specieActual.names.length;
    document.getElementById("nom-pokemon").innerHTML = (specieActual.names[lenguageActual].name);
}

function photoDefault() {
    document.getElementById("photo-pokemon").src = pokemonActual.sprites.other["official-artwork"].front_default;
}

function photoShiny() {
    document.getElementById("photo-pokemon").src = pokemonActual.sprites.other["official-artwork"].front_shiny;
}

function leftPokemon() {
    console.log("Left")
    searchPokemon(document.getElementById("left-pokemon").value);
}

function rightPokemon() {
    console.log("Right")
    searchPokemon(document.getElementById("right-pokemon").value);
}

async function nextVariety(num) {
    console.log("Next");
    variety = (variety + num) % specieActual.varieties.length;
    if (variety < 0) variety = (specieActual.varieties.length - 1);
    let response_v = await fetch(specieActual.varieties[variety].pokemon.url);
    let data_v = await response_v.json();
    pokemonActual = data_v;
    document.getElementById("photo-pokemon").src = pokemonActual.sprites.other["official-artwork"].front_default || 'who_ditto.svg';
    if (pokemonActual.sprites.other["official-artwork"].front_shiny) {
        document.getElementById("shiny-button").style.display = 'block';
    } else {
        document.getElementById("shiny-button").style.display = 'none';
    }
    console.log(data_v);
}   

async function restartNums() {
    let left = ((specieActual.id - 1) > 0) ? (specieActual.id - 1) : 1025;
    let left_response_s = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${left}`);
    let left_data_s = await left_response_s.json();
    let left_name_en;
    for (let i = 0; i < left_data_s.names.length; i++) {
        if (left_data_s.names[i].language.name == "en") {
            left_name_en = left_data_s.names[i].name;
        }
    }
    document.getElementById("left-pokemon").innerHTML = `<p class="button-text">&lt;&nbsp;&nbsp;N.º ${thousandNumber(left)}<p>` + `<p class="button-name button-text">${left_name_en}</p>`;
    document.getElementById("left-pokemon").value = left;


    let right = ((specieActual.id + 1) <= 1025) ? (specieActual.id + 1) : 1;
    let right_response_s = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${right}`);
    let right_data_s = await right_response_s.json();
    let right_name_en;
    for (let i = 0; i < right_data_s.names.length; i++) {
        if (right_data_s.names[i].language.name == "en") {
            right_name_en = right_data_s.names[i].name;
        }
    }
    document.getElementById("right-pokemon").innerHTML = `<p class="button-name button-text">${right_name_en}</p>` + `<p class="button-text">N.º ${thousandNumber(right)}&nbsp;&nbsp;&gt;<p>`;
    document.getElementById("right-pokemon").value = right;
}

function searchBar() {

    document.getElementById("start-text").innerHTML = "Charging...";

    let pokemon = document.getElementById("text").value;
    searchPokemon(pokemon);
}

function descPokemon(array) {
    let desc = "";
    for (let i = (array.length - 1); i > 0; i--) {
        if (array[i].language.name == "en") {
            desc = array[i].flavor_text;
            break;
        }
    }
    return desc;
}

function catPokemon(array) {
    let cat = "";
    for (let i = (array.length - 1); i > 0; i--) {
        if (array[i].language.name == "en") {
            cat = array[i].genus;
            break;
        }
    }
    return cat;
}

async function typePhoto(type) {
    let response_t = await fetch(type.type.url);
    let data_t = await response_t.json();
    return (data_t.sprites["generation-viii"]["sword-shield"].name_icon).toString();
}

async function abilityFetch(ability) {
    let response_a = await fetch(ability.ability.url);
    let data_a = await response_a.json();
    let name_en;
    for (let i = 0; i < data_a.names.length; i++) {
        if (data_a.names[i].language.name == "en") {
            name_en = data_a.names[i].name;
        }
    }

    return name_en;
}

async function searchPokemon(pokemon) {

    variety = 0;

    let response_s = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    if (!response_s.ok) {
        console.log("Error: Pokemon not found");
        document.getElementById("error").innerHTML = "Error: Pokemon not found";
        document.getElementById("error").style.display = 'block';
        throw new Error("Pokemon no encontrado");
    } else {
        document.getElementById("error").style.display = 'none';
    }
    let data_s = await response_s.json();


    let response_p = await fetch(data_s.varieties[0].pokemon.url);
    let data_p = await response_p.json();

    let response_g = await fetch(data_s.generation.url);
    let data_g = await response_g.json();

    let response_r = await fetch(data_g.main_region.url);
    let data_r = await response_r.json();

    console.log(data_s);
    console.log(data_p);
    console.log(data_g);
    console.log(data_r);
    console.log(data_p.name);
    specieActual = data_s;
    pokemonActual = data_p;

    let description = await descPokemon(data_s.flavor_text_entries);
    let category = await catPokemon(data_s.genera);
    //console.log(description);

    document.getElementById("pokemonContainer").innerHTML = `
        <div>
            <h4 id="nom-pokemon-title">Name:</h4>
            <div id="nom-pokemon-line"><p>${"#" + thousandNumber(data_s.id) + " "}</p><p id="nom-pokemon" onclick="changeName()">${data_s.names[lenguageActual].name}</p></div> 
            <h4 class="other-title">Types:</h4>
            <div class="types">
                ${await Promise.all(data_p.types.map(async (type) => { return `<img class="type-pokemon" src="${await typePhoto(type)}" />`; })).then(arr => arr.join(""))}
            </div>
            <p><b>Region: </b>${data_r.names[6].name}</p> 
            <div class="hw-container">
                <p><b>Height: </b>${parseInt(data_p.height / 10) + "," + (data_p.height % 10)} m</p>
                <p><b>Weight: </b>${parseInt(data_p.weight / 10) + "," + (data_p.weight % 10)} kg</p>
            </div>
            <h4 class="other-title">Description:</h4>
            <p>${description}</p>
            ${ (category) ? `<p id="category"><b>Category: </b>${category}</p>` : ""}
            <h4 class="other-title">Ability:</h4>
            <div class="abilities">
                ${await Promise.all(data_p.abilities.map(async (ability) => { return `<p class="ability">${await abilityFetch(ability)}</p>`; })).then(arr => arr.join(""))}
            </div>  
        </div>
        <div id="photo-container">
            <img id="photo-pokemon" src=${data_p.sprites.other["official-artwork"].front_default}></img>
            <div class="photo-buttons">
                ${(data_s.varieties.length > 1) ? `<button class="photo-button var-button" onclick="nextVariety(-1)">&lt;</button>` : ``}
                <button id="default-button" class="photo-button" onclick="photoDefault()"></button>
                ${(data_p.sprites.other["official-artwork"].front_shiny) ? `<button id="shiny-button" class="photo-button" onclick="photoShiny()"></button>` : ""}
                ${(data_s.varieties.length > 1) ? `<button class="photo-button var-button" onclick="nextVariety(1)">&gt;</button>` : ``}
            </div>
        </div>
    `;
    await restartNums();
    document.getElementById("pokedex-buttons").style.display = 'grid';
    document.getElementById("start-search").style.display = 'none';
}
