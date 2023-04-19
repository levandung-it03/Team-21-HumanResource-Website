
(function main() {
    function automaticallySetiingMainTagHeight(indexTags) {
        const isHiddingAllIndexOfCategory = indexTags.every(indexTag => [...indexTag.classList].includes("hide"));
        if (isHiddingAllIndexOfCategory) {
            $('main').style.minHeight = 'calc(100vh - var(--footer-height))';
        } else {
            $('main').style.minHeight = `calc(${$('#category').offsetHeight}px - 1px - var(--footer-height))`;
        }
        return;
    }

    (function toggleHidingCatalog() {
        $$('#category_body .category_items').forEach(tag => {
            tag.onclick = (e) => {
                const indexTags = [...$$('ul.list')];

                const openingIndexTag = indexTags.find(indexTag => {
                    const indexTagClassList = [...indexTag.classList];
                    return indexTagClassList.includes("hide") != true;
                });
                if (openingIndexTag != undefined)    openingIndexTag.classList.add('hide');

                const tagClicked = tag.querySelector('ul.list');
                const clickedOpeningTag = openingIndexTag ? (openingIndexTag.innerText != tagClicked.innerText) : true;
                if (clickedOpeningTag)  tagClicked.classList.toggle('hide');
                
                automaticallySetiingMainTagHeight(indexTags);
            }
        })
    })();
})();
