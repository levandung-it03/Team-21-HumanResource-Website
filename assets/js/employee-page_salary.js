const mainData = [...$$("tr.body")];
(function main() {
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");
            }
        })
    })();

    (function searchingEvent() {
        $('div#heading #turn-back-btn-for-searching-event').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#heading #turn-back-btn-for-searching-event').style.display = "none";
            $('div#heading #search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#heading #turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#heading #search').style.display = "none";
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                $('div#heading #turn-back-btn-for-searching-event').style.display = "inline-block";
                $('div#heading #search').style.display = "none";
            }
        }
    })();

    (function defindingCurrency() {
        $$('.vn_currency').forEach(tag => {
            const salary = tag.innerText;
            const length = salary.length;
            let result = "";
            for (var i = length - 1; i >= 0; i--) {
                result = salary[i] + result;
                if ((length - i) % 3 == 0)
                    if (i)    result = "," + result;
            }
            tag.innerText = result;
        })
    })();
})();