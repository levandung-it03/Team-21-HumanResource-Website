let submitFormCancellation = false;

(function main() {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const errorMessages = {
        name: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => isNaN(Number.parseInt(e)));
            },
            message: "Tên không hợp lệ.",
            isValid: false,
        },
        birthday: {
            confirm: function (value) {
                this.isValid = (value != '');
            },
            message: "Hãy nhập ngày sinh của bạn."
        },
        identifier: {
            confirm: function (value) {
                if (value.length == 9 || value.length == 12) {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
                } else {
                    this.isValid = false;
                }
            },
            message: "Vui lòng nhập đúng CMND hoặc CCCD.",
            isValid: false,
        },
        email: {
            confirm: function (value) {
                const regex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
                if (regex.test(value)) {
                    this.isValid = true;
                } else {
                    this.isValid = false;
                }
            },
            message: "Nhập đúng định dạng name.01@gmail.com",
            isValid: false,
        },
        password: {
            confirm: function (value) {
                if (value.length > 7) {
                    this.isValid = true;
                } else {
                    this.isValid = false;
                }
            },
            message: "Mật khẩu phải có ít nhất 8 ký tự.",
            isValid: false,
        },
        ["confirm-password"]: {
            confirm: function (value) {
                if ($('div#password input').value == value) this.isValid = true;
                else this.isValid = false;
            },
            message: "Mật khẩu không khớp.",
            isValid: false,
        },
        ["hired-day"]: {
            confirm: function (value) {
                this.isValid = (value != '');
            },
            message: "Hãy nhập ngày bạn chính thức được tuyển."
        },
        phone: {
            confirm: function (value) {
                if (value.length != 10) {
                    this.isValid = false;
                } else {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
                    this.isValid = (value[0] == "0");
                }
            },
            message: "Điện thoại chỉ gồm số và có 10 chữ số.",
            isValid: false,
        },
    }
    const inputTags = [...$$('.register-input input')];
    const dataTags = [...inputTags, ...$$('.register-select select')];
    const passowrdTags = $$('input[type=password]');

    // onsubmit="return submitFormCancellation()";

    $('input[type=submit').onclick = (e) => {
        let isAccept = false;

        if (confirm("Bạn có chắc chắn với những thông tin này?")) {
            isAccept = inputTags.every((tag) => {
                let errObj = errorMessages[tag.name];
                errObj.confirm(tag.value);
                return errObj.isValid;
            })

            if (isAccept) {
                submitFormCancellation = true;
            } else {
                alert("Thông tin đầu vào bị lỗi!");
                submitFormCancellation = false;
            }
        } else submitFormCancellation = false;
    }

    (function createErrorMessages() {
        [...$$('.register-input .register-input_err-message')].forEach((e) => {
            e.innerHTML = `
            <span class='err-message-block' id='${e.parentNode.id}'>
                ${errorMessages[e.parentNode.id].message}
            </span>
        `;
        })
    })();

    (function setUpInputTags() {
        inputTags.forEach((tag) => {
            // tag.oninvalid = (e) => { e.target.setCustomValidity("Giá trị không hợp lệ!") };
            // tag.oninput = (e) => { e.target.setCustomValidity("") };
            tag.onblur = (e) => {
                if (tag.name != "confirm-password") {
                    const errMesTagObject = errorMessages[tag.name];
                    const errTag = $(`div#${tag.name} span#${tag.name}`);

                    errMesTagObject.confirm(tag.value);
                    if (errMesTagObject.isValid) errTag.style.display = "none";
                    else errTag.style.display = "inline";
                }
            }
        })
        passowrdTags.forEach((e) => {
            const errMesTagObj = errorMessages['confirm-password'];
            const errTag = $('span#confirm-password');

            e.onkeyup = (event) => {
                errMesTagObj.confirm(passowrdTags[1].value);

                if (errMesTagObj.isValid) {
                    errTag.style.display = "none";
                } else {
                    errTag.style.display = "inline";
                }
            }
        })
    })();

    (function toggleHidingPassword() {
        $$('.register-input_toggle-hidden i').forEach((e) => {
            e.onclick = (event) => {
                if ([...event.target.classList].some((e) => e == "show-pass")) {
                    $$('.register-input_toggle-hidden .show-pass').forEach((e) => { e.classList.add("hidden") });
                    $$('.register-input_toggle-hidden .hide-pass').forEach((e) => { e.classList.remove("hidden") });
                    passowrdTags.forEach((e) => { e.type = "text" });
                } else {
                    $$('.register-input_toggle-hidden .hide-pass').forEach((e) => { e.classList.add("hidden") });
                    $$('.register-input_toggle-hidden .show-pass').forEach((e) => { e.classList.remove("hidden") });
                    passowrdTags.forEach((e) => { e.type = "password" });
                }
            }
        })
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })
            
            if (data[0] == "error_account.email") {

                alert('Email đã tồn tại!');

            } else if (data[0] == "error_identifier") {

                alert('CCCD hoặc CMND đã tồn tại!');

            }

            window.history.replaceState({}, "", "http://localhost:3000/register");
            dataTags.forEach((tag, index) => {
                if (tag.name == "confirm-password") {
                    tag.value = data.find((e) => e[0] == "password")[1];
                    return;
                }
                tag.value = data.find((e) => e[0] == tag.name)[1];
            })
        })();
    }
})();
