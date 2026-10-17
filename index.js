//  Superhero API  
// https://superheroapi.com/api/f94ece365343be98fdac29e555f2ce1b/686 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/47 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/289 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/76 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/149 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/418 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/620 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/346 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/263 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/561


// Villains API 
//  https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/162 
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/639
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/655
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/550
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/370
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/60
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/207
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/208
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/230
// https://www.superheroapi.com/api.php/f94ece365343be98fdac29e555f2ce1b/680

function openMenu() {
  document.body.classList += "menu--open"
}

function closeMenu() {
  document.body.classList.remove('menu--open')
}


const API_TOKEN = "f94ece365343be98fdac29e555f2ce1b";
const API_URL = `https://www.superheroapi.com/api.php/${API_TOKEN}`;

const superheroIds = [
  686, 47, 289, 76, 149, 418, 620, 346, 263, 561
];

const villainIds = [
  162, 639, 655, 550, 370, 60, 207, 208, 230, 680
];

const superheroList = document.getElementById("superhero-list");
const villainList = document.getElementById("villain-list");

const searchForm = document.getElementById("hero-search-form");
const searchInput = document.getElementById("hero-search-input");

async function getCharacter(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch character");
  }

  const character = await response.json();

  if (character.response === "error") {
    throw new Error(character.error || "Character not found");
  }

  return character;
}

function createCharacterCard(character) {
  const biography = character.biography || {};
  const powerstats = character.powerstats || {};
  const appearance = character.appearance || {};
  const work = character.work || {};

  const card = document.createElement("article");
  card.className = "user";

  const cardContent = document.createElement("div");
  cardContent.className = "user-card";

  const container = document.createElement("div");
  container.className = "user-card__container";

  const image = document.createElement("img");
  image.className = "pfp";
  image.src = character.image?.url || "";
  image.alt = character.name || "Character";
  image.loading = "lazy";

  image.onerror = () => {
    image.alt = "Character image unavailable";
  };

  const info = document.createElement("div");
  info.className = "hero__info";

  const title = document.createElement("h3");
  title.textContent = character.name || "Unknown";
  info.appendChild(title);

  const details = [
    ["Full name", biography["full-name"]],
    ["Alignment", biography.alignment],
    ["Publisher", biography.publisher],
    ["Race", appearance.race],
    ["Occupation", work.occupation],
    ["Intelligence", powerstats.intelligence],
    ["Strength", powerstats.strength],
    ["Speed", powerstats.speed],
    ["Power", powerstats.power]
  ];

  details.forEach(([label, value]) => {
    const paragraph = document.createElement("p");
    paragraph.className = "hero__pg";

    const bold = document.createElement("b");
    bold.textContent = `${label}: `;

    paragraph.appendChild(bold);
    paragraph.appendChild(
      document.createTextNode(value || "Unknown")
    );

    info.appendChild(paragraph);
  });

  container.appendChild(image);
  container.appendChild(info);
  cardContent.appendChild(container);
  card.appendChild(cardContent);

  return card;
}

async function loadCharacters(ids, list, label) {
  list.replaceChildren();

  const loading = document.createElement("p");
  loading.textContent = `Loading ${label}...`;
  list.appendChild(loading);

  const results = await Promise.allSettled(
    ids.map(getCharacter)
  );

  list.replaceChildren();

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      list.appendChild(createCharacterCard(result.value));
    }
  });

  if (list.children.length === 0) {
    const error = document.createElement("p");
    error.textContent =
      `Unable to load ${label}. Check your API connection.`;
    list.appendChild(error);
  }
}

async function searchCharacters(name) {
  const existing = document.getElementById("search-results");

  if (existing) {
    existing.remove();
  }

  const section = document.createElement("section");
  section.id = "search-results";
  section.className = "superheros";

  const heading = document.createElement("h2");
  heading.className = "superheros__title";
  heading.textContent = "Search Results";

  const list = document.createElement("div");
  list.className = "user-list";

  const status = document.createElement("p");
  status.textContent = `Searching for ${name}...`;

  section.append(heading, status, list);

  document.querySelector(".hero").after(section);
  section.scrollIntoView({ behavior: "smooth" });

  try {
    const response = await fetch(
      `${API_URL}/search/${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const data = await response.json();
    list.replaceChildren();

    if (data.response === "error" || !data.results?.length) {
      status.textContent = "No characters found. Try another name.";
      return;
    }

    status.textContent = `Found ${data.results.length} character(s).`;

    data.results.forEach((character) => {
      list.appendChild(createCharacterCard(character));
    });
  } catch (error) {
    console.error(error);
    status.textContent =
      "Search failed. Check the API connection or browser console.";
  }
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = searchInput.value.trim();

  if (name) {
    searchCharacters(name);
  }
});

async function initializePage() {
  try {
    await Promise.all([
      loadCharacters(
        superheroIds,
        superheroList,
        "superheroes"
      ),
      loadCharacters(
        villainIds,
        villainList,
        "villains"
      )
    ]);
  } catch (error) {
    console.error("Unable to initialize the page:", error);
  }
}

initializePage();
