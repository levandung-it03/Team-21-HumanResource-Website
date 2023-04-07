(function main() {
    (function deleteUser() {
        $$('td.delete-employee a').forEach((tag) => {
            tag.onclick = async (e) => {
                if (confirm('Bạn chắc chắn muốn xoá nhân viên này chứ? Dữ liệu đã xoá không thể khôi phục!')) {
                    const id = tag.getAttribute('id_user');
                    await fetch(`/api/admin/delete-employee/${id}`, {
                        method: "DELETE",
                    })
                        .then((response) => {
                            alert('Xoá nhân viên thành công!');
                            window.location.href = "http://localhost:3000/admin/category/employee/employee-list";
                        })
                }
            }
        })
    })();

})();
