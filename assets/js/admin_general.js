(function main() {
    const sortingObj = {
        sortingMethod: function (selector, tagSelector) {
            const represTagValue = $(selector + " " + tagSelector).innerText;
            let check = isNaN(Number.parseInt(represTagValue)) ? "Str" : "Num";
            if (check == "Num") this.sortingNumberMethod(selector, tagSelector);
            else this.sortingStringMethod(selector, tagSelector);
        },
        sortingStringMethod: function (selector, tagSelector) {
            const tbodyTag = $(selector + ' table tbody');
            const dataObjectList = [...$$(selector + ' .body')].map(tag => {
                return {
                    tag: tag,
                    data: tag.querySelector(tagSelector).innerText,
                };
            })
            const dataObjectsSortedList = dataObjectList.sort((object_1, object_2) => {
                let data_1 = object_1.data.trim().toUpperCase();
                let data_2 = object_2.data.trim().toUpperCase();
                if (data_1 > data_2) return 1;
                if (data_1 < data_2) return -1;
                return 0;
            });
            let result = dataObjectsSortedList.map(object => object.tag.outerHTML);
            tbodyTag.innerHTML = result.join("");
        },
        sortingNumberMethod: function (selector, tagSelector) {
            const tbodyTag = $(selector + ' table tbody');
            const dataObjectList = [...$$(selector + ' .body')].map(tag => {
                let data = tag.querySelector(tagSelector).innerText.split(",");
                if (data.length < 2) data = data[0].split("-");
                if (data.length < 2) data = data[0];
                else data = Number.parseInt(data.join(""));
                return {
                    tag: tag,
                    data: data,
                };
            })
            const dataObjectsSortedList = dataObjectList.sort((object_1, object_2) => {
                if (object_1.data > object_2.data) return 1;
                if (object_1.data < object_2.data) return -1;
                return 0;
            });
            let result = dataObjectsSortedList.map(object => object.tag.outerHTML);
            tbodyTag.innerHTML = result.join("");
        }
    }
    $$('.table_title i').forEach(sortingIconTag => {
        sortingIconTag.onclick = (e) => {
            let tagSelector = "td#" + sortingIconTag.id;
            sortingObj.sortingMethod(`#${[...e.target.classList].pop()}`, tagSelector);
            alert("Sắp xếp TĂNG DẦN thành công!");
        }
    })
})();