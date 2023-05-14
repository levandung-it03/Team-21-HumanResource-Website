let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    const errorMessages = {
        insurance_book_number: {
            confirm: function (value) {
                if (value.length == 10) {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
                } else {
                    this.isValid = false;
                }
            },
            message: "Số sổ bảo hiểm chỉ dài đúng 10 số.",
            isValid: false,
        },
        insurance_card: {
            confirm: function (value) {
                $('input[name=insurance_card]').value = $('input[name=insurance_card]').value.toUpperCase();
                this.isValid = /^[a-zA-Z]{2}\d{13}$/.test(value);
            },
            message: "Số thẻ bảo hiểm chỉ chứa 2 ký tự đầu và 13 số.",
            isValid: false,
        },
        insuranceCash: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
            },
            message: "Mức đóng bảo hiểm phải là số.",
            isValid: false,
        },
        insurancePlace: {
            confirm: function (value) {
                
            },
            message: "",
            isValid: true
        },
        startingDate: {
            confirm: function (value) {
                this.isValid = (value != '');
            },
            message: "Ngày bắt đầu không hợp lệ.",
            isValid: false
        },
        endingDate: {
            confirm: function (value) {
                const startingDate = Date.parse($('input[name=startingDate]').value);
                const endingDate = Date.parse(value);
                this.isValid = startingDate < endingDate;
            },
            message: "Ngày kết thúc không hợp lệ.",
            isValid: false,
        },
        status: {
            confirm: function (value) {
                this.isValid = (value != '');
            },
            message: "Hãy chọn một trạng thái."
        },
        household: {
            confirm: function (value) {
                if (value.length == 9) {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
                } else {
                    this.isValid = false;
                }
            },
            message: "Số hộ khẩu chỉ dài đúng 9 số.",
            isValid: false,
        },
        household_code: {
            confirm: function (value) {
                if (value.length == 13) {
                    this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
                } else {
                    this.isValid = false;
                }
            },
            message: "Số hộ khẩu chỉ dài đúng 13 số.",
            isValid: false,
        },
    }
    const strictInputTags = [...$$('.more-condition input')];

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
        $$('input[type=date]').forEach((tag) => {
            tag.onblur = (e) => {
                const errMesTagObject = errorMessages.endingDate;
                const errTag = $(`div#endingDate span#endingDate`);
                
                errMesTagObject.confirm($(`input[name=endingDate]`).value);
                if (errMesTagObject.isValid) errTag.style.display = "none";
                else errTag.style.display = "inline";
            }
        })
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
        $('textarea').onblur = (e) => {
            generalMethods.trimInputData(e.target);
        }
    })();

    (function recoverSelectData() {
        const selectTags = $$('.form_select-input select');
        selectTags.forEach(tag => {
            let value = tag.getAttribute('data').trim();
            tag.querySelectorAll('option').forEach((optionTag) => {
                if (value.includes(optionTag.innerHTML)) {
                    optionTag.selected = true;
                }
            })
        })
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Nhân viên này đã tồn tại bảo hiểm khác!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })  

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/insurance/add-insurance");
            strictInputTags.forEach((tag, index) => {
                tag.value = data.find((e) => e[0] == tag.name)[1];
                errorMessages[tag.name].confirm(tag.value);
            })
            $$('.form_select-input select option').forEach(optionTag => {
                const tagName = optionTag.parentElement.name;
                const value = data.find(e=>e[0]==tagName)[1];
                if (value.includes(optionTag.value)) {
                    optionTag.selected = true;
                }
            })
            $('.form_textarea-input textarea').innerText = data.find(e=>e[0]=="description")[1];
        })();
    }
})();