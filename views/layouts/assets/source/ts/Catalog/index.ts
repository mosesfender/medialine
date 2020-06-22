let catalog: cat.Catalog;
let articles: cat.Articles;

document.eventListener("DOMContentLoaded", () => {
    catalog = new cat.Catalog({
        container: document.querySelector('.catalog') as HTMLElement
    })
    articles = new cat.Articles({
        container: document.querySelector('.arts') as HTMLElement
    })

    catalog.eventListener('click', (ev: MouseEvent) => {
        ev.preventDefault();
        if ((ev.target as HTMLElement).closestType(cat.Chapter)) {
            let chapter = (ev.target as HTMLElement).closestType(cat.Chapter);
            articles.clear();
            cat.Articles.getArticles(chapter, articles);
        }
    });

    cat.Catalog.getChapters(catalog);
});