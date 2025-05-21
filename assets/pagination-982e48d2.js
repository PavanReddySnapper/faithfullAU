const r = {
    grid: "[data-grid]",
    gridItem: "[data-grid-item]",
    pagination: "[data-pagination]",
    progressViewed: "[data-pagination-viewed]",
    progressBar: "[data-progress-bar]",
    loadMoreButton: "[data-load-more]",
    loadNext: "[data-load-next]",
    loadPrev: "[data-load-prev]",
    sentinel: "[data-pagination-sentinel]",
    isNew: ".is-new"
};

const c = {
    btnLoading: "btn--loading",
    isNew: "is-new",
    hide: "hide"
};

const y = {
    resultsGrid: "data-results-grid",
    loadNext: "data-load-next",
    loadPrev: "data-load-prev"
};

function R(sectionId) {
    if (!sectionId) return;

    const gridElement = document.querySelector(r.grid);
    const paginationElement = document.querySelector(r.pagination);

    if (!gridElement || !paginationElement) return;

    const settingsJson = paginationElement.dataset.settings || "{}";
    const settings = JSON.parse(settingsJson);

    const progressViewedElement = document.querySelector(r.progressViewed);
    const progressBarElement = document.querySelector(r.progressBar);

    let loadedHtml = [];
    let isLoading = false;
    let itemsLoaded = 0;

    if (progressViewedElement) {
        itemsLoaded = parseInt(progressViewedElement.textContent, 10);
    }

    const loadMoreButtons = document.querySelectorAll(r.loadMoreButton);

    if (loadMoreButtons.length > 0) {
        loadMoreButtons.forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                loadedHtml = [];
                loadContent(button);
            });
        });
    }

    if (settings.type === "infinite-scroll") {
        const sentinelElement = document.querySelector(r.sentinel);
        const nextButton = document.querySelector(r.loadNext);

        const sentinelObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.unobserve(sentinelElement);
                    if (!isLoading) {
                        isLoading = true;
                        loadContent(nextButton, false);
                    }
                }
            });
        }, { rootMargin: "300px", threshold: 0.1 });

        const nextObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    nextButton.classList.add(c.btnLoading);
                    nextButton.textContent = theme.strings.pagination.loading;
                    nextButton.blur();
                    processLoadedContent(nextButton, sentinelElement, sentinelObserver);
                }
            });
        });

        if (nextButton) {
            sentinelObserver.observe(sentinelElement);
            nextObserver.observe(nextButton);
        }
    }

    async function loadContent(button, showLoader = true) {
        if (!button) return;

        if (showLoader) {
            button.classList.add(c.btnLoading);
            button.textContent = theme.strings.pagination.loading;
            button.blur();
        }

        const href = button.getAttribute("href").replace(window.location.origin, "");
        const url = new URL(window.location.origin + href);
        url.searchParams.set("section_id", sectionId);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Load more products response was not OK");
            }

            const responseText = await response.text();
            loadedHtml = loadedHtml.concat(responseText);
            isLoading = false;

            if (showLoader) {
                processLoadedContent(button);
            }
        } catch (error) {
            console.error("Failed to load more products:", error);
        } finally {
            button.classList.remove(c.btnLoading);
        }
    }

    function processLoadedContent(button, sentinelElement, sentinelObserver) {
        const isNextButton = button.hasAttribute(y.loadNext);
        const isPrevButton = button.hasAttribute(y.loadPrev);
        const isInfiniteScroll = isNextButton && settings.type === "infinite-scroll";

        while (loadedHtml.length > 0) {
            const html = loadedHtml.shift();
            const parser = new DOMParser();
            const documentFragment = parser.parseFromString(html, "text/html");

            const newGrid = documentFragment.querySelector(r.grid);
            const newGridItems = documentFragment.querySelectorAll(r.gridItem);

            const href = button.getAttribute("href").replace(window.location.origin, "");
            const url = new URL(window.location.origin + href);
            const currentPage = parseInt(url.searchParams.get("page"), 10);

            let newButton = documentFragment.querySelector(r.loadNext);
            if (isPrevButton) {
                newButton = documentFragment.querySelector(r.loadPrev);
            }

            if (newGridItems.length > 0) {
                newGridItems.forEach(item => {
                    item.classList.add(c.isNew);
                });

                if (isNextButton) {
                    gridElement.insertAdjacentHTML("beforeend", newGrid.innerHTML);
                } else {
                    gridElement.insertAdjacentHTML("afterbegin", newGrid.innerHTML);
                }

                const newItems = gridElement.querySelectorAll(r.isNew);

                if (newItems.length > 0) {
                    if (gridElement.hasAttribute(y.resultsGrid)) {
                        const images = gridElement.querySelectorAll(`${r.isNew} img`);

                        if (window.sessionStorage.getItem("resultsLayoutView") === "alt") {
                            images.forEach(image => {
                                image.sizes = gridElement.dataset.imageSizesAlt;
                            });
                        }
                    }

                    newItems.forEach(item => {
                        item.classList.remove(c.isNew);
                    });
                }

                history.replaceState({}, "", `${window.location.pathname}?page=${currentPage}`);
                itemsLoaded += newGridItems.length;

                if (progressViewedElement) {
                    progressViewedElement.textContent = itemsLoaded;
                }

                if (progressBarElement) {
                    progressBarElement.style.width = `${(itemsLoaded * 100) / settings.items_total}%`;
                }

                if (isNextButton && currentPage === settings.number_of_pages) {
                    button.classList.add(c.hide);
                    return;
                }

                if (isPrevButton && currentPage === 1) {
                    paginationElement.parentNode.classList.add(c.hide);
                    return;
                }

                const newHref = newButton.href.replace(window.location.origin, "");
                button.setAttribute("href", newHref);
            }
        }

        if (isInfiniteScroll && sentinelElement && sentinelObserver) {
            sentinelObserver.disconnect();
            sentinelObserver.observe(sentinelElement);
        }

        button.classList.remove(c.btnLoading);
        button.textContent = isNextButton ? theme.strings.pagination.loadMore : theme.strings.pagination.loadPrevious;
    }
}

export { R as i };