const mainData = [...$$("tr.body")];
(function main() {
    function deleteTechnique() {
        $$('td.delete-technique a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá chuyên môn này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('technique_id');
                    await fetch(`/api/admin/delete-technique/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá chuyên môn thành công!');
                            window.location.href = "http://localhost:3000/admin/category/employee/technique-list";
                        })
                }
            }
        })
    }
    deleteTechnique();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;
                                          
                generalMethods.sortingMethod(tagSelector);

                

                deleteTechnique(); 
            }
        })
    })();

    (function searchingEvent() {
        $('div#turn-back-btn-for-searching-event').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#turn-back-btn-for-searching-event').style.display = "none";
            $('div#search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#search').style.display = "none";
            deleteTechnique();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#search').style.display = "none";
                deleteTechnique();
            }
        }
    })();
})();