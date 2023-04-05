(function main() {
    (function deleteUser() {
        $$('td.delete-employee a').forEach((tag) => {
            tag.onclick = (e) => {
                const id = tag.getAttribute('id_user');
                fetch('/admin/category/employee/employee-list/delete/' + id, {
                    method: "DELETE",
                })
                    .then(response => {
                        window.location.href = "http://localhost:3000/admin/category/employee/employee-list"
                        alert('Xoá nhân viên thành công!');
                    })
            }
        })
    })();
})();