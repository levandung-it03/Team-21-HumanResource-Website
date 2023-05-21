let submitFormCancellation = false;
(function main() {
    const errorMessages = {
        ["old-password"]: {
            confirm: function (value) {
                if (value.length < 8) {
                    this.isValid = false;
                } else this.isValid = true;
            },
            message: "Mật khẩu không đủ dài.",
            isValid: false,
        },
        ["new-password"]: {
            confirm: function (value) {
                if (value.length >= 8 && value != $("input[name=old-password]").value) {
                    this.isValid = true;
                } else this.isValid = false;
            },
            message: "Mật khẩu không đủ dài hoặc trùng với mật khẩu cũ.",
            isValid: false,
        },
        ["confirm-new-password"]: {
            confirm: function (value) {
                if ($("input[name=confirm-new-password]").value != $("input[name=new-password]").value) {
                    this.isValid = false;
                } else this.isValid = true;
            },
            message: "Mật khẩu không khớp.",
            isValid: false,
        },
    };
    const strictInputTags = [...$$(".more-condition input")];

    $('input[type=submit').onclick = (e) => {
        let isAccept = false;
        if (confirm("Bạn có chắc chắn với những thông tin này?")) {
            isAccept = strictInputTags.every((tag) => {
                let errObj = errorMessages[tag.name];
                errObj.confirm(tag.value);
                return errObj.isValid;
            })

            if (isAccept) {
                submitFormCancellation = true;
            } else {
                alert("Thông tin đầu vào bị lỗi hoặc mật khẩu cũ không đúng!");
                submitFormCancellation = false;
            }
        } else submitFormCancellation = false;
    }

    (function createErrorMessages() {
        [...$$('.form_text-input_err-message')].forEach((tag) => {
            const parentId = tag.parentNode.id;
            tag.innerHTML = `
            <span class='err-message-block' id='${parentId}'>
                ${errorMessages[parentId].message}
            </span>`;
        });
    })();

    (function toggleHidingPassword() {
        $$('.change-password-input_toggle-hidden i').forEach((e) => {
            e.onclick = (e) => {
                if ([...e.target.classList].some((e) => e == "show-pass")) {
                    e.target.classList.add("hidden");
                    e.target.parentElement.querySelector(".hide-pass").classList.remove("hidden");
                    $(`input[name=${e.target.id}]`).type = "text";
                } else {
                    e.target.classList.add("hidden");
                    e.target.parentElement.querySelector(".show-pass").classList.remove("hidden");
                    $(`input[name=${e.target.id}]`).type = "password";
                }
            }
        })
    })();

    (function setUpstrictInputTags() {
        strictInputTags.forEach((tag) => {
            tag.onblur = (e) => {
                if (tag.getAttribute("name") == "new-password") {
                    const errMesTagObject = errorMessages["confirm-new-password"];
                    const errTag = $(`div#confirm-new-password span#confirm-new-password`);

                    errMesTagObject.confirm(tag.value);
                    if (errMesTagObject.isValid) errTag.style.display = "none";
                    else errTag.style.display = "inline";
                }

                const errMesTagObject = errorMessages[tag.name];
                const errTag = $(`div#${tag.name} span#${tag.name}`);

                errMesTagObject.confirm(tag.value);
                if (errMesTagObject.isValid) errTag.style.display = "none";
                else errTag.style.display = "inline";
            }
        })
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Mật khẩu cũ không chính xác!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            console.log(dataMessages);
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/employee/add-department");
            strictInputTags.forEach((tag, index) => {
                tag.value = data.find((e) => e[0] == tag.name)[1];
                errorMessages[tag.name].confirm(tag.value);
            })
        })();
    }

    (function alertIfChangeSucessfully() {
        let isSuccessfully = window.location.href.split("=").pop();
        if (isSuccessfully == "true") {
            alert("Đổi mật khẩu thành công");
            window.location.href = "http://localhost:3000/change-password";
        }
    })();
})();