document.addEventListener("DOMContentLoaded", () => {
  const pokemonList = document.getElementById("pokemonList");
  const loadMoreButton = document.getElementById("loadMoreButton");
  const modal = document.getElementById("pokemonModal");
  const modalBody = document.getElementById("modalBody");

  const maxRecords = 151;
  const limit = 12;
  let offset = 0;

  function convertPokemonToLi(pokemon) {
    return `
            <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types
                          .map(
                            (type) => `<li class="type ${type}">${type}</li>`
                          )
                          .join("")}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `;
  }

  function showPokemonDetailInModal(pokemon) {
    const modalContent = modal.querySelector(".modal-content");
    modalContent.className = "modal-content";
    modalContent.classList.add(pokemon.type);

    const newHtml = `
            <div class="pokedex-container">
                <div class="pokemon-header ${pokemon.type}">
                    <div class="header-top">
                        <a href="#" class="back-arrow">←</a>
                        <a href="#" class="favorite-icon">♡</a>
                    </div>
                    <div class="pokemon-title">
                        <h1>${pokemon.name}r</h1>
                        <span class="pokemon-id">#${pokemon.number}</span>
                    </div>
                    <div class="pokemon-types">
                        <ol class="types">
                            ${pokemon.types
                              .map(
                                (type) =>
                                  `<li class="type ${type}">${type}</li>`
                              )
                              .join("")}
                        </ol>
                    </div>
                    <div class="pokemon-image">
                        <img src="${pokemon.photo}" alt="Bulbasaur">
                    </div>
                </div>

                <div class="pokemon-info">
                    <div class="info-nav">
                        <a href="#" class="nav-link active" data-tab="about">About</a>
                        <a href="#" class="nav-link" data-tab="stats">Stats</a>
                    </div>

                    <!-- About Section -->
                    <div id="about-content" class="tab-content active">
                        <div class="info-content">
                            <div class="info-item">
                                <span class="label">Species</span>
                                <span class="value">${pokemon.species}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Height</span>
                                <span class="value">${pokemon.height}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Weight</span>
                                <span class="value">${pokemon.weight}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Abilities</span>
                                <span class="value">${pokemon.abilities}</span>
                            </div>
                        </div>
                        <h2 class="section-title">Breeding</h2>
                        <div class="info-content">
                            <div class="info-item">
                                <span class="label">Gender</span>
                                <div class="value gender">
                                    <span><i class="fas fa-mars"></i> ${
                                      pokemon.femaleGender
                                    }%</span>
                                    <span><i class="fas fa-venus"></i> ${
                                      pokemon.maleGender
                                    }%</span>
                                </div>
                            </div>
                            <div class="info-item">
                                <span class="label">Egg Groups</span>
                                <span class="value">${pokemon.eggGroups}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Egg Cycle</span>
                                <span class="value">${pokemon.eggCycle}</span>
                            </div>
                        </div>
                    </div>
            
                    <!-- Stats Section -->
                        <div id="stats-content" class="tab-content">
                            <div class="info-content">
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">HP</span>
                                        <span class="stat-value">${
                                          pokemon.stats[0] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill hp" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[0] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>    
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">Attack</span>
                                        <span class="stat-value">${
                                          pokemon.stats[1] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill attack" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[1] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">Defense</span>
                                        <span class="stat-value">${
                                          pokemon.stats[2] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill defense" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[2] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">Sp. Attack</span>
                                        <span class="stat-value">${
                                          pokemon.stats[3] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill sp-attack" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[3] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">Sp. Defense</span>
                                        <span class="stat-value">${
                                          pokemon.stats[4] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill sp-defense" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[4] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="stat-info">
                                        <span class="stat-label">Speed</span>
                                        <span class="stat-value">${
                                          pokemon.stats[5] || 0
                                        }</span>
                                    </div>
                                    <div class="stat-bar">
                                        <div class="stat-fill speed" style="width: ${Math.min(
                                          100,
                                          (pokemon.stats[5] || 0) / 2
                                        )}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>    
        </div>
        `;
    modalBody.innerHTML = newHtml;
    modal.style.display = "flex";
  }

  function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join("");
      pokemonList.innerHTML += newHtml;
    });
  }

  loadPokemonItens(offset, limit);

  loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItens(offset, limit);
    }
  });

  pokemonList.addEventListener("click", (event) => {
    const clickedLi = event.target.closest(".pokemon");
    if (clickedLi) {
      const pokemonNumber = clickedLi.dataset.number;
      pokeApi.getPokemon(pokemonNumber).then(showPokemonDetailInModal);
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("back-arrow")) {
      event.preventDefault();
      modal.style.display = "none";
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  function handleTabSwitch(event) {
    if (event.target.classList.contains("nav-link")) {
      event.preventDefault();

      // Remove a classe 'active' de todos os links de navegação
      const allNavLinks = modal.querySelectorAll(".nav-link");
      allNavLinks.forEach((link) => link.classList.remove("active"));

      // Adiciona a classe 'active' ao link clicado
      event.target.classList.add("active");

      // Esconde todos os conteúdos das abas
      const allTabContents = modal.querySelectorAll(".tab-content");
      allTabContents.forEach((content) => content.classList.remove("active"));

      // Mostra o conteúdo da aba selecionada
      const targetTab = event.target.getAttribute("data-tab");
      const targetContent = modal.querySelector(`#${targetTab}-content`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    }
  }

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("back-arrow")) {
      event.preventDefault();
      modal.style.display = "none";
    }

    // Adicione esta linha para lidar com os cliques nas abas
    handleTabSwitch(event);
  });
});
