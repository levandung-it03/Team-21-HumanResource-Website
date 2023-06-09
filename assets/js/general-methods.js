const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const generalMethods = {
    sortingAccumulator: 0,
    sortingNumType: 1,
    trimInputData: function (inputTag) {
        const words = inputTag.value.trim().split(" ");
        let result = [];
        for (let i = 0; i < words.length; i++) {
            if (words[i] !== "") {
                if (i == 0) {
                    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
                }
                result.push(words[i]);
            }
        }
        inputTag.value = result.join(" ");
    },
    adjustUpperAndLowerCase: function (inputTag) {
        const words = inputTag.value.trim().split(" ");
        let result = [];
        for (let word of words) {
            if (word !== "") {
                let newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                result.push(newWord);
            }
        }
        inputTag.value = result.join(" ");
    },
    rejectWeirdCharOfNumberInputTags: function (e) {
        if (!((48 <= e.which && e.which <= 57) || e.which == 190)) e.target.value = "";
    },
    sortingMethod: function (tagSelector) {
        const represTagValue = $(tagSelector).innerText;
        let check = isNaN(Number.parseInt(represTagValue)) ? "Str" : "Num";
        if (this.sortingAccumulator) {
            this.sortingAccumulator = 0;
            this.sortingNumType = -1;
            alert("Sắp xếp GIẢM DẦN thành công!");
        } else {
            this.sortingAccumulator = 1;
            this.sortingNumType = 1;
            alert("Sắp xếp TĂNG DẦN thành công!");
        }
        if (check == "Num") this.sortingNumberMethod(tagSelector);
        else this.sortingStringMethod(tagSelector);
    },
    sortingStringMethod: function (tagSelector) {
        const tbodyTag = $('table tbody');

        //  Create data objects list as a Middleware.
        const dataObjectList = [...$$('.body')].map(tag => {
            return {
                tag: tag,
                data: tag.querySelector(tagSelector).innerText,
            };
        })

        //  Sort data list.
        const dataObjectsSortedList = dataObjectList.sort((object_1, object_2) => {
            let data_1 = object_1.data.trim().toUpperCase();  // ignore upper or lower case.
            let data_2 = object_2.data.trim().toUpperCase();  // ignore upper or lower case. 

            if (data_1 > data_2) return generalMethods.sortingNumType;
            if (data_1 < data_2) return generalMethods.sortingNumType*-1;
            return 0;
        });

        let result = dataObjectsSortedList.map(object => object.tag.outerHTML);
        tbodyTag.innerHTML = result.join("");
    },
    sortingNumberMethod: function (tagSelector) {
        const tbodyTag = $('table tbody');
        
        //  Create data objects list as a Middleware.
        const dataObjectList = [...$$('.body')].map(tag => {
            let data = tag.querySelector(tagSelector).innerText.split(",");
            if (data.length < 2)    data = data[0].split("-");
            
            if (data.length < 2)    data = data[0];
            else    data = Number.parseInt(data.join(""));

            return {
                tag: tag,
                data: data,
            };
        })

        //  Sort data list.
        const dataObjectsSortedList = dataObjectList.sort((object_1, object_2) => {
            if ( object_1.data >  object_2.data) return this.sortingNumType;
            if ( object_1.data <  object_2.data) return this.sortingNumType*-1;
            return 0;
        });

        let result = dataObjectsSortedList.map(object => object.tag.outerHTML);
        tbodyTag.innerHTML = result.join("");
    },
    searchingMethod: function (inputTag) {
        let result = null;
        const inputValue = inputTag.value.trim().split(" ").filter(c=>c!="").join(" ").toUpperCase();
        const allDataTags = [...$$('table tbody tr.body')];
        if (inputValue == "") result = allDataTags;
        else {
            result = allDataTags.filter(dataTag => {
                const enableSearchingField = [...dataTag.querySelectorAll('.body_enable-searching')];
                return enableSearchingField.some(field => field.innerText.trim().toUpperCase().includes(inputValue));
            })
        }
        if (!result.length) {
            $('tbody').innerHTML = '<p style="padding: 50px; font-size: 2rem; position: absolute">Không tìm thấy kết quả của bạn!</p>';

        } else {
            $('tbody').innerHTML = result.map(tag => tag.outerHTML).join("");
        }
    }
}