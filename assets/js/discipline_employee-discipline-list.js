(function main() {
    function deleteEmployeeDiscipline() {
        $$('td.delete-employee-discipline a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá tất cả kỷ luật của nhân viên này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('employee_discipline_id');
                    await fetch(`/api/admin/delete-employee-discipline/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá phòng kỷ luật thành công!');
                            window.location.href = "http://localhost:3000/admin/category/discipline/employee-discipline-list";
                        })
                }
            }
        })
    }
    deleteEmployeeDiscipline();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteEmployeeDiscipline(); 
            }
        })
    })();

    (function searchingEvent() {
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            deleteEmployeeDiscipline();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                deleteEmployeeDiscipline();
            }
        }
    })();
})();