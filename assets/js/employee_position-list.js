const mainData = [...$$("tr.body")];
(function main() {
    function deletePosition() {
        $$('td.delete-position a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá loại nhân viên này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('position_id');
                    await fetch(`/api/admin/delete-position/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá loại chức vụ thành công!');
                            window.location.href = "http://localhost:3000/admin/category/employee/position-list";
                        })
                }
            }
        })
    }
    deletePosition();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");
                
                deletePosition();
            }
        })
    })();

    (function searchingEvent() {
        $('div#turn-back-btn').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#turn-back-btn').style.display = "none";
            $('div#search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn').style.display = "inline-block";
            $('div#search').style.display = "none";
            deletePosition();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn').style.display = "inline-block";
            $('div#search').style.display = "none";
                deletePosition();
            }
        }
    })();

    (function defindingCurrency() {
        $$('td#salary_per_day').forEach(tag => {
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