(function main() {
    function deleteGroupCompliment() {
        $$('td.delete-group-compliment a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá toàn bộ khen thưởng của nhóm này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('group_compliment_id');
                    await fetch(`/api/admin/delete-group-compliment/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá khen thưởng thành công!');
                            window.location.href = "http://localhost:3000/admin/category/compliment/group-compliments-list";
                        })
                }
            }
        })
    }
    deleteGroupCompliment();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteGroupCompliment(); 
            }
        })
    })();

    (function searchingEvent() {
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            deleteGroupCompliment();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                deleteGroupCompliment();
            }
        }
    })();
})();