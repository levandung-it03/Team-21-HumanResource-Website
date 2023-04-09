const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const generalMethods = {
    sortingMethod: function (tagSelector) {
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

            if (data_1 > data_2) return 1;
            if (data_1 < data_2) return -1;
            return 0;
        });

        let result = dataObjectsSortedList.map(object => object.tag.outerHTML);
        tbodyTag.innerHTML = result.join("");
    },
    searchingMethod: function (inputTag) {
        let result = null;
        const inputValue = inputTag.value.trim();
        const allDataTags = [...$$('table tbody tr.body')];
        if (inputValue == "") result = allDataTags;
        else {
            result = allDataTags.filter(dataTag => {
                const enableSearchingField = [...dataTag.querySelectorAll('.body_enable-searching')];
                return enableSearchingField.some(field => field.innerText == inputValue);
            })
        }
        if (!result.length) {
            $('table').innerHTML = '<p style="padding: 50px; font-size: 3rem;">Không tìm thấy kết quả của bạn!</p>';

        } else {
            $('tbody').innerHTML = result.map(tag => tag.outerHTML).join("");
        }
        $('#heading div#search').classList.add('hide');
        $('#heading div#turn-back-btn').classList.remove('hide');
    }
}