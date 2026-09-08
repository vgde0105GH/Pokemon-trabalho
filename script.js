const API_URL =
    "https://pokeapi.co/api/v2/pokemon";


const pokemonList =
    document.getElementById("pokemon-list");


const previousButton =
    document.getElementById("previous");


const nextButton =
    document.getElementById("next");


const pageElement =
    document.getElementById("page");


const POKEMON_BY_PAGE = 20;


let currentPage = 1;


/* =========================================
   BUSCAR OS POKÉMON
========================================= */

async function searchPokemon() {


    pokemonList.innerHTML = `

        <div class="loading">

            Carregando Pokémon...

        </div>

    `;


    const offset =
        (currentPage - 1) *
        POKEMON_BY_PAGE;


    try {


        const response =
            await fetch(

                `${API_URL}?limit=${POKEMON_BY_PAGE}&offset=${offset}`

            );


        const data =
            await response.json();


        pokemonList.innerHTML = "";


        /*
            Percorre os 20 Pokémon
            retornados pela API.
        */

        for (
            const pokemon of data.results
        ) {


            const responsePokemon =
                await fetch(
                    pokemon.url
                );


            const dataPokemon =
                await responsePokemon.json();


            createCard(dataPokemon);

        }


        updatePagination();


    } catch (error) {


        console.error(error);


        pokemonList.innerHTML = `

            <div class="loading">

                Erro ao carregar os Pokémon.

            </div>

        `;

    }

}


/* =========================================
   CRIAR CARD DO POKÉMON
========================================= */

function createCard(pokemon) {


    const card =
        document.createElement("div");


    card.classList.add(
        "card-pokemon"
    );


    /*
        Pega o primeiro tipo do Pokémon.
    */

    const mainType =
        pokemon.types[0]
            .type.name;


    /*
        Adiciona uma classe de acordo
        com o tipo do Pokémon.

        Exemplo:

        fire -> type-fire
        water -> type-water
        grass -> type-grass
    */

    card.classList.add(
        `type-${mainType}`
    );


    /*
        Formata o número para
        sempre ter 3 dígitos.

        1 -> 001
        25 -> 025
        150 -> 150
    */

    const number =
        String(pokemon.id)
            .padStart(3, "0");


    card.innerHTML = `

        <img
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
        >


        <span class="number">

            Nº ${number}

        </span>


        <span class="name-pokemon">

            ${pokemon.name}

        </span>

    `;


    /* =====================================
       CLIQUE NO CARD
    ====================================== */

    card.addEventListener(
        "click",
        function () {


            /*
                Salva o Pokémon selecionado
                no Local Storage.

                JSON.stringify transforma
                o objeto em texto.
            */

            localStorage.setItem(

                "SelectedPokemon",

                JSON.stringify(pokemon)

            );


            /*
                Vai para a página
                de detalhes.
            */

            window.location.href =
                "pokemon/index.html";

        }
    );


    pokemonList.appendChild(card);

}


/* =========================================
   ATUALIZAR PAGINAÇÃO
========================================= */

function updatePagination() {


    pageElement.textContent =
        `Página ${currentPage}`;


    if (
        currentPage === 1
    ) {


        previousButton.disabled =
            true;


    } else {


        previousButton.disabled =
            false;

    }

}


/* =========================================
   BOTÃO ANTERIOR
========================================= */

previousButton.addEventListener(

    "click",

    function () {


        if (
            currentPage > 1
        ) {


            currentPage--;


            searchPokemon();

        }

    }

);


/* =========================================
   BOTÃO PRÓXIMO
========================================= */

nextButton.addEventListener(

    "click",

    function () {


        currentPage++;


        searchPokemon();

    }

);


/* =========================================
   INICIAR
========================================= */

searchPokemon();