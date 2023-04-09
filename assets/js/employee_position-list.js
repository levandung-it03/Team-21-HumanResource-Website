(function main() {
    (function deleteUser() {
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
})();