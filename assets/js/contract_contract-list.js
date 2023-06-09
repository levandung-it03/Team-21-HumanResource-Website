const mainData = [...$$("tr.body")];
(function main() {
    function deleteContract() {
        $$('td.delete-contract a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá hợp đồng này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('contract_id');
                    await fetch(`/api/admin/delete-contract/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá hợp đồng thành công!');
                            window.location.href = "http://localhost:3000/admin/category/contract/contract-list";
                        })
                }
            }
        })
    }
    deleteContract();
    
    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                

                deleteContract(); 
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
            deleteContract();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
            $('div#turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#search').style.display = "none";
                deleteContract();
            }
        }
    })();
})();