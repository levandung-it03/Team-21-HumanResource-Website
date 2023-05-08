let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    const errorMessages = {
        endingDate: {
            confirm: function (value) {
                const startingDate = $('input[name=startingDate]').value, endingDate = value;
                let startingDateArr = startingDate.split("-").map(e => Number.parseInt(e)),
                    endingDateArr = endingDate.split("-").map(e => Number.parseInt(e));

                if (startingDateArr[0] == endingDateArr[0]) {
                    if (startingDateArr[1] == endingDateArr[1]) {
                        this.isValid = endingDateArr[2] >= startingDateArr[2] ? true : false;
                    } else if (startingDateArr[1] < endingDateArr[1]) {
                        this.isValid = true;
                    } else {
                        this.isValid = false;
                    }
                } else if (startingDateArr[0] < endingDateArr[0]) {
                    this.isValid = true;
                } else {
                    this.isValid = false;
                }
            },
            message: "Ngày kết thúc không hợp lệ.",
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
                const errMesTagObject = errorMessages[strictInputTags[0].name];
                const errTag = $(`div#${strictInputTags[0].name} span#${strictInputTags[0].name}`);

                errMesTagObject.confirm(strictInputTags[0].value);
                if (errMesTagObject.isValid) errTag.style.display = "none";
                else errTag.style.display = "inline";
            }
        })
        $$('div.need-to-trim .need-to-trim').forEach(tag => {
            tag.onblur = (e) => {
                generalMethods.trimInputData(e.target);
                if ([...tag.classList].includes("adjust-upper-and-lower-case")) {
                    generalMethods.adjustUpperAndLowerCase(e.target);
                }
            }
        })
    })();

    (function recoverEmployeeSelectData() {
        const selectTag = $('.form_select-input#employee select');
        let value = selectTag.getAttribute('data').trim();
        selectTag.querySelectorAll('option').forEach((optionTag) => {
            if (optionTag.innerHTML.split("-")[1].trim() == value) {
                optionTag.selected = true;
            }
        })
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Nhân viên này đã tồn tại một chuyên môn khác!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/employee/add-technique");
            strictInputTags.forEach((tag, index) => {
                tag.value = data.find((e) => e[0] == tag.name)[1];
                errorMessages[tag.name].confirm(tag.value);
            })
            $$('.form_select-input select option').forEach(optionTag => {
                if (optionTag.value.includes(data[2][1].split("-")[1])) {
                    optionTag.selected = true;
                }
            })
            $('.form_textarea-input textarea').innerText = data[3][1];
        })();
    }
})();