(function main() {
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;
                if([...sortingIconTag.classList].some(className => className == "light-block")) {
                    tagSelector += " span";
                }
                generalMethods.sortingMethod(tagSelector);
                
                alert("Sắp xếp thành công!");
            }
        })
    })();

    (function searchingEvent() {
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
            }
        }
    })();
})();