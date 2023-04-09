(function main() {
    (function deleteDepartment() {
        $$('td.delete-department a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá loại nhân viên này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('department_id');
                    await fetch(`/api/admin/delete-department/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá phòng ban thành công!');
                            window.location.href = "http://localhost:3000/admin/category/employee/department-list";
                        })
                }
            }
        })
    })();

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