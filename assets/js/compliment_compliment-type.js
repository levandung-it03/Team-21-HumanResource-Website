(function main() {
    function deleteCompliment_type() {
        $$('td.delete-compliment_type a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá chuyên môn này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('compliment_type_id');
                    await fetch(`/api/admin/delete-compliment_type/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá chuyên môn thành công!');
                            window.location.href = "http://localhost:3000/admin/category/compliment/compliment-type";
                        })
                }
            }
        })
    }
    deleteCompliment_type();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteCompliment_type(); 
            }
        })
    })();

    (function searchingEvent() {
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            deleteCompliment_type();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                deleteCompliment_type();
            }
        }
    })();
})();