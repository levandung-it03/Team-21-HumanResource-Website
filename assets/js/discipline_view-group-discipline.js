let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    function deleteDisciplineOfGroup() {
        $$('td.delete-group-discipline a').forEach((tag) => {
            tag.onclick = async (e) => {
                const currentUrl = window.location.href;
                const groupDisciplineId = currentUrl.split("/")[currentUrl.split("/").length - 1];
                if (confirm('Bạn chắc chắn muốn xoá kỷ luật này của nhân viên chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('discipline_id');
                    await fetch(`/api/admin/delete-discipline-of-group/${groupDisciplineId}/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá kỷ luật thành công!');
                            window.location.href = currentUrl;
                        })
                }
            }
        })
    }

    deleteDisciplineOfGroup();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteDisciplineOfGroup();
            }
        })
    })();

    (function searchingEvent() {
        $('div#heading turn-back-btn-for-searching-event').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#heading turn-back-btn-for-searching-event').style.display = "none";
            $('div#heading #search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#heading turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#heading #search').style.display = "none";

            deleteDisciplineOfGroup();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                $('div#heading turn-back-btn-for-searching-event').style.display = "inline-block";
                $('div#heading #search').style.display = "none";

                deleteDisciplineOfGroup();
            }
        }
    })();
}) ();