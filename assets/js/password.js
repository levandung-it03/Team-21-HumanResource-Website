(function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');

    if (myParam) {
        window.history.replaceState({}, "", "http://localhost:3000/password");
        alert("Email không tồn tại!");
        document.querySelector('input').value = myParam.split(' ')[1];
    }
})();

