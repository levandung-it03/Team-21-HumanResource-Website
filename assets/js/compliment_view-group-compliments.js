let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    function deleteComplimentOfGroup() {
        $$('td.delete-group-compliment a').forEach((tag) => {
            tag.onclick = async (e) => {
                const currentUrl = window.location.href;
                const groupComplimentId = currentUrl.split("/")[currentUrl.split("/").length - 1];
                if (confirm('Bạn chắc chắn muốn xoá khen thưởng này của nhân viên chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('compliment_id');
                    await fetch(`/api/admin/delete-compliment-of-group/${groupComplimentId}/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá khen thưởng thành công!');
                            window.location.href = currentUrl;
                        })
                }
            }
        })
    }

    deleteComplimentOfGroup();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteComplimentOfGroup();
            }
        })
    })();

    (function searchingEvent() {
        $('div#heading #turn-back-btn').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#heading #turn-back-btn').style.display = "none";
            $('div#heading #search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#heading #turn-back-btn').style.display = "inline-block";
            $('div#heading #search').style.display = "none";

            deleteComplimentOfGroup();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                $('div#heading #turn-back-btn').style.display = "inline-block";
                $('div#heading #search').style.display = "none";

                deleteComplimentOfGroup();
            }
        }
    })();
}) ();