let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    const errorMessages = {
        name: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Tên không hợp lệ.",
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
        birthday: {
            confirm: function (value) {
                this.isValid = (value != '');
            },
            message: "Hãy nhập ngày sinh của bạn."
        },
        birthplace: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Nơi sinh không hợp lệ.",
            isValid: false,
        },
        country: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Quốc gia không hợp lệ.",
            isValid: false,
        },
        ethnic: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Dân tộc không hợp lệ.",
            isValid: false,
        },
        religion: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Tôn giáo không hợp lệ.",
            isValid: false,
        },
        phone: {
            confirm: function (value) {
                if (value.length != 10) {
                    this.isValid = false;
                } else {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e))) && (value[0] == "0");
                }
            },
            message: "Điện thoại chỉ gồm số và có 10 chữ số.",
            isValid: false,
        },
<<<<<<< HEAD
=======
        phone: {
            confirm: function (value) {
                if (value.length != 10) {
                    this.isValid = false;
                } else {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e))) && (value[0] == "0");
                }
            },
            message: "Điện thoại chỉ gồm số và có 10 chữ số.",
            isValid: false,
        },
>>>>>>> 4bafa0649959542d2ac9639bd6b276f44a5361f1
    }
    const inputTags = [...$$('.form_text-input input')];
    const strictInputTags = [...$$('.more-condition input')];
    const dataTags = [...inputTags, ...$$('.form_select-input select')];

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
                alert("Thông tin đầu vào bị lỗi!");
                submitFormCancellation = false;
            }
        } else submitFormCancellation = false;
    }

    (function createErrorMessages() {
        [...$$('.form_text-input .form_text-input_err-message')].forEach((e) => {
            const parentId = e.parentNode.id;
            e.innerHTML = `
        <span class='err-message-block' id='${parentId}'>
            ${errorMessages[parentId].message}
        </span>
    `;
        })
    })();

    (function setUpstrictInputTags() {
        strictInputTags.forEach((tag) => {
            tag.onblur = (e) => {
                if ([...tag.classList].includes("adjust-upper-and-lower-case")) {
                    generalMethods.adjustUpperAndLowerCase(e.target);
                }
                generalMethods.trimInputData(e.target);
                const errMesTagObject = errorMessages[tag.name];
                const errTag = $(`div#${tag.name} span#${tag.name}`);

                errMesTagObject.confirm(tag.value);
                if (errMesTagObject.isValid) errTag.style.display = "none";
                else errTag.style.display = "inline";
            }
        })
    })();

    const url = window.location.href.split("?")[0];
    const id = url.split("/")[url.split("/").length - 1];
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            if (data[0][0] == "error_account.email") {
                console.log(data[0][0]);
                alert('Email đã tồn tại!');

            } else if (data[0][0] == "error_identifier") {
                console.log(data[0][0]);
                alert('CCCD hoặc CMND đã tồn tại!');

            }

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/employee/update/" + id);
            dataTags.forEach((tag, index) => {
                if (tag.name == "avatar") return;
                tag.value = data.find((e) => e[0] == tag.name)[1];
            })
            strictInputTags.forEach((tag) => {
                errorMessages[tag.name].confirm(tag.value);
            })
        })();
    }
    
    (function recoverEmployeeSelectData() {
        const selectTags = [...$$('.form_select-input select')];
        selectTags.forEach((tag) => {
            let value = tag.getAttribute('data').trim();
            tag.querySelectorAll('option').forEach((optionTag) => {
                if (optionTag.innerHTML == value) {
                    optionTag.selected = true;
                }
            })
            
        })
    })();
})();
