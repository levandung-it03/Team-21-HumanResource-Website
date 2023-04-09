const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const generalMethods = {
    sortingMethod: function (tagSelector) {
        const employeeTags = [...$$('.body')];
        const tbodyTag = $('table tbody');

        //  Create data objects list as a Middleware.
        const dataObjectList = employeeTags.map(tag => {
            return {
                id: tag.id,
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
        let result = dataObjectsSortedList.map(object => employeeTags.find(tag => tag.id == object.id).outerHTML);
        tbodyTag.innerHTML = result.join("");
    }
}