const mainData = [...$$("tr.body")];
(function main() {
    function deleteSalary() {
        $$('td.delete-salary a').forEach((tag) => {
            tag.onclick = async (e) => {
                const currentUrl = window.location.href;
                const employeeSalaryId = currentUrl.split("/")[currentUrl.split("/").length - 1];
                if (confirm('Bạn chắc chắn muốn xoá thông tin chấm công của nhân viên trong tháng này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('salary_id');
                    await fetch(`/api/admin/delete-salary/${employeeSalaryId}/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá thành công thông tin lương tháng này!');
                            window.location.href = `http://localhost:3000/admin/category/salary/view-salary/${employeeSalaryId}`;
                        })
                }
            }
        })
    }
    deleteSalary();

    (function sortingEvent() {
        $$('.table_title i').forEach(sortingIconTag => {
            sortingIconTag.onclick = (e) => {
                let tagSelector = "td#" + sortingIconTag.id;

                generalMethods.sortingMethod(tagSelector);

                alert("Sắp xếp thành công!");

                deleteSalary();
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

            deleteSalary();
        }
        $('div#search input').onkeyup = (e) => {
            if (e.which == 13) {
                const inputTag = e.target;
                generalMethods.searchingMethod(inputTag);

                deleteSalary();
            }
        }
    })();

    (function defindingCurrency() {
        $$('.vn_currency').forEach(tag => {
            const salary = tag.innerText;
            const length = salary.length;
            let result = "";
            for (var i = length - 1; i >= 0; i--) {
                result = salary[i] + result;
                if ((length - i) % 3 == 0)
                    if (i)    result = "," + result;
            }
            tag.innerText = result;
        })
    })();
})();