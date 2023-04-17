(function main() {
    function deleteDegree() {
        $$('td.delete-degree a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá loại bằng cấp này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('degree_id');
                    await fetch(`/api/admin/delete-degree/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá phòng ban thành công!');
                            window.location.href = "http://localhost:3000/admin/category/employee/degree-list";
                        })
                }
            }
        })
    }
    deleteDegree();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteDegree(); 
            }
        })
    })();

    (function searchingEvent() {
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            deleteDegree();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                deleteDegree();
            }
        }
    })();
})();