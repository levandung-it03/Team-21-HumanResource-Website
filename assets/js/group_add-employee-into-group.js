let submitFormCancellation = false;

(function main() {
    $('input[type=submit').onclick = (e) => {
        if (confirm("Bạn chắn chắn muốn thêm nhân viên này?")) submitFormCancellation = true;
        else submitFormCancellation = false;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    const url = window.location.href;
    if (myParam) {
        (async function handleRedirect() {
            alert('Nhân viên đã tồn tại!');

            window.history.replaceState({}, "", url.split("?")[0]);
        })();
    }
})();