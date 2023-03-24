let submitFormCancellation = false;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

(function main() {

    const inputTags = [...$$('.register-input input')];
    const emailTag = $('input[name=email]');
    const passwordTag = $('input[name=password]');

    const errorMessages = {
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
                if (value.length < 8) {
                    this.isValid = false;
                } else this.isValid = true;
            },
            message: "Mật khẩu không đủ dài.",
            isValid: false,
        },
        ['admin-right']: {
            confirm: function (value) {
                if (value == "") {
                    this.isValie = false;
                } else this.isValid = true;
            },
            message: "Admin Code không được để trống.",
            isValid: false,
        },
    };


    $('input[type=submit').onclick = (e) => {
        let isAccept = errorMessages.email.isValid && errorMessages.password.isValid;

        if (isAccept) {
            submitFormCancellation = true;
        } else {
            alert("Thông tin đầu vào bị lỗi!");
            submitFormCancellation = false;
        }
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
        emailTag.onkeyup = (e) => {
            errorMessages.email.confirm(emailTag.value);
            if (errorMessages.email.isValid)
                $('span#email').style.display = "none";
            else
                $('span#email').style.display = "inline";
        }
        passwordTag.onkeyup = (e) => {
            errorMessages.password.confirm(passwordTag.value);
            if (errorMessages.password.isValid)
                $('span#password').style.display = "none";
            else
                $('span#password').style.display = "inline";
        }
    })();

    (function toggleHidingPassword() {
        $$('.register-input_toggle-hidden i').forEach((e) => {
            e.onclick = (event) => {
                if ([...event.target.classList].some((e) => e == "show-pass")) {
                    $('.register-input_toggle-hidden .show-pass').classList.add("hidden");
                    $('.register-input_toggle-hidden .hide-pass').classList.remove("hidden");
                    passwordTag.type = "text";
                } else {
                    $('.register-input_toggle-hidden .hide-pass').classList.add("hidden");
                    $('.register-input_toggle-hidden .show-pass').classList.remove("hidden");
                    passwordTag.type = "password";
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
            if (data[0] == "error_email")
                alert('Email không chính xác!');
            else if (data[0] == "error_password")
                alert('Mật khẩu không chính xác!');
            else if (data[0] == "error_adminCode")
                alert('Admin code không chính xác!');

            inputTags.reduce((accum, e) => {
                e.value = data[accum][1];
                return accum + 1;
            }, 1)

            window.history.replaceState({}, "", "http://localhost:3000/login");
            inputTags.forEach((e) => {
                errorMessages[e.name].confirm(e.value);
            })
            inputTags.reduce((accum, e) => {
                e.value = data[accum][1];
                return accum + 1;
            }, 1)
        })();
    }
})();