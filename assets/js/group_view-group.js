let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    function deleteEmployeeIntoGroup() {
        $$('td.delete-employee-inside-group a').forEach((tag) => {
            tag.onclick = async (e) => {
                const currentUrl = window.location.href;
                const groupId = currentUrl.split("/")[currentUrl.split("/").length - 1];
                if (confirm('Bạn chắc chắn muốn xoá nhân viên này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('employee_id');
                    await fetch(`/api/admin/delete-employee-inside-group/${groupId}/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá nhân viên thành công!');
                            window.location.href = currentUrl;
                        })
                }
            }
        })
    }

    deleteEmployeeIntoGroup();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                

                deleteEmployeeIntoGroup();
            }
        })
    })();

    (function searchingEvent() {
        $('div#heading #turn-back-btn-for-searching-event').onclick = (e) => {
            $('tbody').innerHTML = mainData.reduce((accuTagsStr, tag) => (accuTagsStr + tag.outerHTML), "");
            $('div#heading #turn-back-btn-for-searching-event').style.display = "none";
            $('div#heading #search').style.display = "block";
        }
        $('div#search i').onclick = (e) => {
            const inputTag = $('div#search input');
            generalMethods.searchingMethod(inputTag);
            $('div#heading #turn-back-btn-for-searching-event').style.display = "inline-block";
            $('div#heading #search').style.display = "none";

            deleteEmployeeIntoGroup();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);
                $('div#heading #turn-back-btn-for-searching-event').style.display = "inline-block";
                $('div#heading #search').style.display = "none";

                deleteEmployeeIntoGroup();
            }
        }
    })();
}) ();