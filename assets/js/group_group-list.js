const mainData = [...$$("tr.body")];
(function main() {
    function deleteGroup() {
        $$('td.delete-group a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá nhóm này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('group_id');
                    await fetch(`/api/admin/delete-group/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá nhóm thành công!');
                            window.location.href = "http://localhost:3000/admin/category/group/group-list";
                        })
                }
            }
        })
    }
    deleteGroup();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteGroup(); 
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
            deleteGroup();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn').style.display = "inline-block";
            $('div#search').style.display = "none";
                deleteGroup();
            }
        }
    })();
})();