const currentURL = window.location.href.slice();

(function main() {
    (function sendingEmailReport() {
        $('form').addEventListener('submit', e => { e.preventDefault() });
        $("button#submit").onclick = async (e) => {
            e.preventDefault();
            if (confirm("Bạn chắc chắn muốn gửi báo cáo này chứ!")) {
                fetch("/sending-report-email", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: $('input[name=email]').value,
                        name: $('input[name=name]').value,
                        details: $('textarea#details').value.trim(),
                    }),
                })
                    .then(response => {
                        if (response.ok) {
                            alert("Gửi thành công!");
                            window.location.reload();
                        }
                    })
            }
        }
    })();

    (function toggleLogs() {
        $$("header .tools-icons i").forEach(i => {
            i.onclick = (e) => {
                e.preventDefault();
                const clickedTag = $(`div#${i.id}`).querySelector(".blocks");
                const openingTag = [...$$(".blocks")].find(block => ![...block.classList].includes("hide"));
                if (openingTag && openingTag.id != clickedTag.id) {
                    openingTag.classList.toggle("hide");
                }
                clickedTag.classList.toggle("hide");
            }
        })
    })();

    (function logout() {
        $("header #settings a#log-out").onclick = (e) => {
            if (confirm("Bạn chắc chắn muốn đăng xuất chứ!")) {
                fetch("/api/log-out", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        isLogout: true,
                    }),
                })
                    .then(response => { window.location.reload() })
            }
        }
    })();
})();