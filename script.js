// Para cada obra, cole o link direto da imagem em coverImage.
// Exemplo: coverImage: "https://meusite.com/imagens/capa.jpg"
// Redes sociais são opcionais: socials: { instagram: "...", facebook: "...", tiktok: "..." }
// Informe o total de páginas em pageCount. Use null enquanto não souber o total.
const items = [
  {
    title: "Harmonia",
    author: "Elif",
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    type: "HQ",
    tag: "FANTASIA",
    color: "#425b72",
    ink: "#fff9ef",
    symbol: "✳",
    bg: "#ddc89d",
    description: "Uma história sobre memória, escolhas e o preço de viver para sempre. Addie LaRue faz um pacto que a liberta da morte, mas condena o mundo a esquecê-la.",
    pdfUrl: "https://drive.google.com/file/d/18W-yLtpB67Z8LIOdCwO3q-4aWemZfrWG/view?usp=drive_link",
    coverImage: "https://drive.google.com/file/d/16VRJ3eB1ryfnj1eMvbwd-fgvRKNSvV45/view?usp=drive_link",
    pageCount: 18,
  },
  {
    title: "historia dos ritmos",
    author: "Marjane Satrapi",
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    type: "HQ",
    tag: "MEMÓRIAS",
    color: "#bd705e",
    ink: "#fff9ef",
    symbol: "☾",
    bg: "#ece8df",
    description: "A infância e a juventude de Marjane durante a Revolução Iraniana, contadas em uma HQ autobiográfica sensível e cheia de personalidade.",
    pdfUrl: "https://drive.google.com/file/d/18W-yLtpB67Z8LIOdCwO3q-4aWemZfrWG/view?usp=sharing",
    coverImage: "",
    pageCount: 18,
  },
  {
    title: "O pequeno príncipe",
    author: "Antoine de Saint-Exupéry",
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
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
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
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
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
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
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
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
  {
    title: "Mapa de manhã",
    author: "Texto original · demonstração",
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    type: "Poema",
    tag: "VERSOS",
    color: "#536e87",
    ink: "#fff9ef",
    symbol: "✎",
    bg: "#dfe8e7",
    description: "Abro a janela devagar,\na rua aprende a clarear.\nNo bolso, um dia por fazer;\nno peito, espaço pra caber.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 1,
  },
  {
    title: "Pequeno intervalo",
    author: "Texto original · demonstração",
    socials: {
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    type: "Poema",
    tag: "COTIDIANO",
    color: "#bd705e",
    ink: "#fff9ef",
    symbol: "✧",
    bg: "#ece8df",
    description: "Entre a pressa e o café,\num minuto fica de pé.\nO mundo espera, sem falar;\neu respiro antes de andar.",
    pdfUrl: "",
    coverImage: "",
    pageCount: 1,
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
let favorites = new Set(JSON.parse(localStorage.getItem("margem-favorites") || "[]"));
let favoritesOnly = false;
let activeNavView = "home";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderSocialLinks(socials = {}) {
  socials = socials || {};
  const platforms = [
    { key: "instagram", label: "Instagram", icon: "◎" },
    { key: "facebook", label: "Facebook", icon: "f" },
    { key: "tiktok", label: "TikTok", icon: "♪" },
  ];

  const links = platforms.map(({ key, label, icon }) => {
    const value = String(socials[key] || "").trim();
    if (!value) return "";

    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(candidate);
      if (url.protocol !== "https:" && url.protocol !== "http:") return "";
      return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}"><span aria-hidden="true">${icon}</span>${label}</a>`;
    } catch {
      return "";
    }
  }).filter(Boolean);

  return links.length ? `<div class="social-links" aria-label="Redes sociais">${links.join("")}</div>` : "";
}

function getCoverImageSources(value) {
  if (!value) return { src: "", fallback: "" };

  try {
    const url = new URL(value);
    if (url.hostname.endsWith("drive.google.com")) {
      const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
        || url.searchParams.get("id");
      if (fileId) {
        const encodedId = encodeURIComponent(fileId);
        return {
          src: `https://drive.google.com/thumbnail?id=${encodedId}&sz=w1000`,
          fallback: `https://drive.google.com/uc?export=view&id=${encodedId}`,
        };
      }
    }
  } catch {
    // Mantém caminhos locais, como images/capa.jpg.
  }

  return { src: value, fallback: "" };
}

function enableCoverImageFallbacks(container) {
  container.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== fallback) image.src = fallback;
    });
  });
}

function renderCatalog() {
  const results = items.map((item, index) => ({ ...item, index })).filter((item) => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesFavorite = !favoritesOnly || favorites.has(item.title);
    const text = `${item.title} ${item.author} ${item.tag}`.toLocaleLowerCase("pt-BR");
    return matchesType && matchesFavorite && text.includes(searchTerm.toLocaleLowerCase("pt-BR"));
  });

  catalog.innerHTML = results.map((item) => {
    const coverImage = getCoverImageSources(item.coverImage);
    const coverImageUrl = escapeHtml(coverImage.src);
    const coverImageFallback = escapeHtml(coverImage.fallback);

    return `
    <article class="card" tabindex="0" role="button" aria-label="Ver detalhes de ${escapeHtml(item.title)}" data-index="${item.index}">
      <div class="card-art" style="background:${item.bg}">
        <span class="kind">${item.tag}</span>
        <div class="cover${coverImageUrl ? " has-image" : ""}" style="background:${item.color};color:${item.ink}">
          ${coverImageUrl
            ? `<img class="cover-image" src="${coverImageUrl}" data-fallback="${coverImageFallback}" alt="Capa de ${escapeHtml(item.title)}">`
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

  enableCoverImageFallbacks(catalog);

  catalog.hidden = results.length === 0;
  emptyState.hidden = results.length > 0;
  resultCount.textContent = `Mostrando ${results.length} ${results.length === 1 ? "item" : "itens"}`;
  const currentFilter = favoritesOnly ? "Favoritos" : selectedTypes.join(" + ") || "Todos os formatos";
  document.querySelector("#active").textContent = [
    favoritesOnly ? `${currentFilter} · ${favorites.size} salvos` : "",
    searchTerm ? `Busca: “${searchTerm}”` : ""
  ].filter(Boolean).join(" · ");

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
    const selected = !favoritesOnly && (button.dataset.filter === "Todos"
      ? selectedTypes.length === 0
      : selectedTypes.includes(button.dataset.filter));
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderCatalog();
  document.querySelectorAll(".nav-item").forEach((link) => {
    const isCurrentView = link.dataset.view === activeNavView || link.dataset.type === activeNavView;
    link.classList.toggle("active", isCurrentView);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.filter;
    favoritesOnly = false;
    activeNavView = type === "Todos" ? "all" : type;
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
    favoritesOnly = false;
    activeNavView = link.dataset.type;
    selectedTypes = [link.dataset.type];
    updateFilters();
  });
});

document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", () => {
    favoritesOnly = link.dataset.view === "favorites";
    activeNavView = link.dataset.view;
    selectedTypes = [];
    searchTerm = "";
    searchInput.value = "";
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
  const coverImage = getCoverImageSources(item.coverImage);
  const coverImageUrl = escapeHtml(coverImage.src);
  const coverImageFallback = escapeHtml(coverImage.fallback);
  const totalPages = Number.isInteger(item.pageCount) && item.pageCount > 0
    ? item.pageCount
    : null;
  const progressKey = item.title;
  const descriptionClass = item.type === "Poema" ? "poem-text" : "";
  const savedPage = Math.min(
    totalPages || Number.MAX_SAFE_INTEGER,
    Math.max(1, readingProgress[progressKey] || 1)
  );
  const pdfAction = item.pdfUrl
    ? `<a class="pdf-link" href="${escapeHtml(item.pdfUrl)}" target="_blank" rel="noopener">Abrir PDF <span>↗</span></a>`
    : `<button class="pdf-link unavailable" type="button" disabled>PDF ainda não disponível</button>`;

  document.querySelector("#details").innerHTML = `
    <div class="detail">
      <div class="detail-cover${coverImageUrl ? " has-image" : ""}" style="background:${item.color};color:${item.ink}">
        ${coverImageUrl
          ? `<img src="${coverImageUrl}" data-fallback="${coverImageFallback}" alt="Capa de ${escapeHtml(item.title)}">`
          : `${item.symbol}<br>${escapeHtml(item.title)}`}
      </div>
      <div>
        <small>${item.type} · ${item.tag}</small>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.author)}</p>
        ${renderSocialLinks(item.socials)}
        <p class="${descriptionClass}">${escapeHtml(item.description)}</p>

      </div>
      <div class="detail-actions">
        ${pdfAction}
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
      </div>
    </div>
  `;
  enableCoverImageFallbacks(document.querySelector("#details"));
  dialog.showModal();

  const favoriteButton = document.querySelector("#favorite-toggle");
  function updateFavoriteButton() {
    const isFavorite = favorites.has(item.title);
    favoriteButton.textContent = isFavorite ? "★" : "☆";
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.setAttribute("aria-label", isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos");
    favoriteButton.classList.toggle("is-favorite", isFavorite);
  }

  favoriteButton.onclick = () => {
    if (favorites.has(item.title)) favorites.delete(item.title);
    else favorites.add(item.title);
    localStorage.setItem("margem-favorites", JSON.stringify([...favorites]));
    updateFavoriteButton();
    renderCatalog();
  };
  updateFavoriteButton();

  const shareButton = document.querySelector("#share-item");
  shareButton.onclick = async () => {
    const shareUrl = new URL("index.html", window.location.href);
    shareUrl.hash = `item-${index}`;
    const shareData = {
      title: `${item.title} — Margem`,
      text: `Confira “${item.title}” na biblioteca Margem.`,
      url: shareUrl.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") console.error("Não foi possível compartilhar o item.", error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl.href);
      shareButton.textContent = "✓";
      shareButton.setAttribute("aria-label", "Link copiado");
      window.setTimeout(() => {
        shareButton.textContent = "↗";
        shareButton.setAttribute("aria-label", "Compartilhar este item");
      }, 1800);
    } catch {
      window.prompt("Copie o link para compartilhar este item:", shareUrl.href);
    }
  };

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
document.querySelector("#show-more").addEventListener("click", () => {
  document.querySelector("#inicio").scrollIntoView({ behavior: "smooth" });
});

renderCatalog();

const sharedItem = window.location.hash.match(/^#item-(\d+)$/);
if (sharedItem && items[Number(sharedItem[1])]) {
  showDetails(Number(sharedItem[1]));
}
