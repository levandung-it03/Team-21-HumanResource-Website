let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    function deleteComplimentOfEmployee() {
        $$('td.delete-employee-compliment a').forEach((tag) => {
            tag.onclick = async (e) => {
                const currentUrl = window.location.href;
                const employeeComplimentId = currentUrl.split("/")[currentUrl.split("/").length - 1];
                if (confirm('Bạn chắc chắn muốn xoá khen thưởng này của nhân viên chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('compliment_id');
                    await fetch(`/api/admin/delete-compliment-of-employee/${employeeComplimentId}/${id}`, {
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

    deleteComplimentOfEmployee();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteComplimentOfEmployee();
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
            deleteComplimentOfEmployee();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                deleteComplimentOfEmployee();
            }
        }
    })();
}) ();