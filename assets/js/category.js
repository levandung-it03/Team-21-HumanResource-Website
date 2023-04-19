
(function main() {
    function automaticallySetiingMainTagHeight(class_list) {
        const isShowingIndexOfCategory = class_list.some(className => !(className == "hide"));
        if (isShowingIndexOfCategory) {
            $('main').style.minHeight = `calc(${$('#category').offsetHeight}px - var(--footer-height))`;
        } else {
            $('main').style.minHeight = 'calc(100vh - var(--footer-height))';
        }
        return;
    }
    (function toggleHidingCatalog() {
        $$('#category_body .category_items').forEach((tag) => {
            tag.onclick = (e) => {
                const ulTag = tag.querySelector('ul.list');
                ulTag.classList.toggle('hide')
                automaticallySetiingMainTagHeight([...ulTag.classList]);
            }
        })
    })();
})();
