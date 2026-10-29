// Informe o total de páginas em pageCount. Use null enquanto não souber o total.
const items = [
  {
    title: "A vida invisível de Addie LaRue",
    author: "V. E. Schwab",
    type: "Livro",
    tag: "FANTASIA",
    color: "#425b72",
    ink: "#fff9ef",
    symbol: "✳",
    bg: "#ddc89d",
    description: "Uma história sobre memória, escolhas e o preço de viver para sempre. Addie LaRue faz um pacto que a liberta da morte, mas condena o mundo a esquecê-la.",
    pdfUrl: "https://drive.google.com/file/d/1UhvrXSmPfCQj9VwFU4lBMsaFEKisUY-6/view?usp=drive_link",
    coverImage: "",
    pageCount: 4,
  },
  {
    title: "Persépolis",
    author: "Marjane Satrapi",
    type: "HQ",
    tag: "MEMÓRIAS",
    color: "#bd705e",
    ink: "#fff9ef",
    symbol: "☾",
    bg: "#ece8df",
    description: "A infância e a juventude de Marjane durante a Revolução Iraniana, contadas em uma HQ autobiográfica sensível e cheia de personalidade.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 3,
  },
  {
    title: "O pequeno príncipe",
    author: "Antoine de Saint-Exupéry",
    type: "Livro",
    tag: "CLÁSSICO",
    color: "#7c9cab",
    ink: "#fff9ef",
    symbol: "✦",
    bg: "#ddc89d",
    description: "Um piloto, um pequeno viajante e encontros que lembram o que importa. Uma fábula delicada que continua encontrando novos leitores.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 2,
  },
  {
    title: "A arte de observar",
    author: "Lia Ferreira",
    type: "Artigo",
    tag: "CRIATIVIDADE",
    color: "#536e87",
    ink: "#fff9ef",
    symbol: "◉",
    bg: "#dfe8e7",
    description: "Um ensaio breve sobre desacelerar, prestar atenção ao cotidiano e transformar detalhes comuns em novas ideias.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 6,
  },
  {
    title: "Daytripper",
    author: "Fábio Moon & Gabriel Bá",
    type: "HQ",
    tag: "DRAMA",
    color: "#425b72",
    ink: "#fff9ef",
    symbol: "☼",
    bg: "#e5e9e5",
    description: "Brás de Oliva Domingos é escritor de obituários e vive muitas vidas possíveis. Uma HQ sobre família, amor e os momentos que nos formam.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 1,
  },
  {
    title: "Ler o mundo",
    author: "Caderno de ideias · 8 min",
    type: "Artigo",
    tag: "LEITURA",
    color: "#bd705e",
    ink: "#fff9ef",
    symbol: "⌁",
    bg: "#ddc89d",
    description: "Como as histórias que lemos ajudam a perceber melhor as histórias ao nosso redor: uma conversa sobre leitura, empatia e imaginação.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 22,
  },
];

const catalog = document.querySelector("#catalog");
const searchInput = document.querySelector("#search");
const emptyState = document.querySelector("#empty");
const resultCount = document.querySelector("#count");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
let selectedTypes = [];
let searchTerm = "";
let readingProgress = JSON.parse(localStorage.getItem("margem-reading-progress") || "{}");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderCatalog() {
  const results = items.map((item, index) => ({ ...item, index })).filter((item) => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const text = `${item.title} ${item.author} ${item.tag}`.toLocaleLowerCase("pt-BR");
    return matchesType && text.includes(searchTerm.toLocaleLowerCase("pt-BR"));
  });

  catalog.innerHTML = results.map((item) => {
    const coverImage = item.coverImage;

    return `
    <article class="card" tabindex="0" role="button" aria-label="Ver detalhes de ${escapeHtml(item.title)}" data-index="${item.index}">
      <div class="card-art" style="background:${item.bg}">
        <span class="kind">${item.tag}</span>
        <div class="cover${coverImage ? " has-image" : ""}" style="background:${item.color};color:${item.ink}">
          ${coverImage
            ? `<img class="cover-image" src="${coverImage}" alt="Capa de ${escapeHtml(item.title)}">`
            : `<small>MARGEM · ${item.type.toUpperCase()}</small><strong>${escapeHtml(item.title)}</strong><i>${item.symbol}</i>`}
        </div>
      </div>
      <div class="card-info">
        <div>
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-author">${escapeHtml(item.author)}</p>
        </div>
        <span class="card-type">${item.type}</span>
        <span class="arrow">↗</span>
      </div>
    </article>
    `;
  }).join("");

  catalog.hidden = results.length === 0;
  emptyState.hidden = results.length > 0;
  resultCount.textContent = `Mostrando ${results.length} ${results.length === 1 ? "item" : "itens"}`;
  document.querySelector("#active").textContent = searchTerm
    ? `${selectedTypes.join(" + ") || "Todos os formatos"} · Busca: “${searchTerm}”`
    : "";

  catalog.querySelectorAll(".card").forEach((card) => {
    const open = () => showDetails(Number(card.dataset.index));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function updateFilters() {
  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === "Todos"
      ? selectedTypes.length === 0
      : selectedTypes.includes(button.dataset.filter);
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderCatalog();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.filter;
    selectedTypes = type === "Todos"
      ? []
      : selectedTypes.includes(type)
        ? selectedTypes.filter((item) => item !== type)
        : [...selectedTypes, type];

    updateFilters();
  });
});

document.querySelectorAll("[data-type]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedTypes = [link.dataset.type];
    updateFilters();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderCatalog();
});

document.querySelector("#clear").addEventListener("click", () => {
  selectedTypes = [];
  searchTerm = "";
  searchInput.value = "";
  updateFilters();
  searchInput.focus();
});

const dialog = document.querySelector("#dialog");
function showDetails(index) {
  const item = items[index];
  const coverImage = item.coverImage;
  const totalPages = Number.isInteger(item.pageCount) && item.pageCount > 0
    ? item.pageCount
    : null;
  const progressKey = item.title;
  const savedPage = Math.min(
    totalPages || Number.MAX_SAFE_INTEGER,
    Math.max(1, readingProgress[progressKey] || 1)
  );
  const pdfAction = item.pdfUrl
    ? `<a class="pdf-link" href="${escapeHtml(item.pdfUrl)}" target="_blank" rel="noopener">Abrir PDF <span>↗</span></a>`
    : `<button class="pdf-link unavailable" type="button" disabled>PDF ainda não disponível</button>`;

  document.querySelector("#details").innerHTML = `
    <div class="detail">
      <div class="detail-cover${coverImage ? " has-image" : ""}" style="background:${item.color};color:${item.ink}">
        ${coverImage
          ? `<img src="${coverImage}" alt="Capa de ${escapeHtml(item.title)}">`
          : `${item.symbol}<br>${escapeHtml(item.title)}`}
      </div>
      <div>
        <small>${item.type} · ${item.tag}</small>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.author)}</p>
        <p>${escapeHtml(item.description)}</p>
        <section class="reading-progress" aria-label="Seu progresso de leitura">
          <label for="page-input">Sua página</label>
          <div class="page-controls">
            <button id="page-back" type="button" aria-label="Voltar uma página">−</button>
            <input id="page-input" type="number" min="1" max="${totalPages || ""}" value="${savedPage}" inputmode="numeric" aria-label="Número da página atual">
            <button id="page-forward" type="button" aria-label="Avançar uma página">+</button>
            ${totalPages ? '<span class="page-total">/ ' + totalPages + '</span>' : ''}
          </div>
          <small id="page-status" aria-live="polite">Página ${savedPage} anotada neste aparelho</small>
        </section>
        ${pdfAction}
      </div>
    </div>
  `;
  dialog.showModal();

  const pageInput = document.querySelector("#page-input");
  const pageStatus = document.querySelector("#page-status");

  function saveCurrentPage(value) {
    const requestedPage = Number.parseInt(value, 10);
    if (!Number.isFinite(requestedPage)) return;

    const maximumPage = totalPages || Number.MAX_SAFE_INTEGER;
    const page = Math.min(maximumPage, Math.max(1, requestedPage));
    pageInput.value = page;
    readingProgress[progressKey] = page;
    localStorage.setItem("margem-reading-progress", JSON.stringify(readingProgress));
    pageStatus.textContent = "Página " + page + " anotada neste aparelho";
  }

  pageInput.addEventListener("input", () => saveCurrentPage(pageInput.value));
  pageInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const change = event.key === "ArrowUp" ? 1 : -1;
      saveCurrentPage(Number(pageInput.value || 1) + change);
    }
  });

  document.querySelector("#page-back").addEventListener("click", () => {
    saveCurrentPage(Number(pageInput.value || 1) - 1);
  });
  document.querySelector("#page-forward").addEventListener("click", () => {
    saveCurrentPage(Number(pageInput.value || 1) + 1);
  });
}

dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});
renderCatalog();
