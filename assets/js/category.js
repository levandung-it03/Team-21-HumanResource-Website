const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

(function main() {
    (function toggleHidingCatalog() {
        $$('#category_body .category_items').forEach((tag) => {
            tag.onclick = (e) => {
                tag.querySelector('ul.list').classList.toggle('hide');
            }
        })
    })();
})();
