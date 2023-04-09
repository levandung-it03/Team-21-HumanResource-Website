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
})();