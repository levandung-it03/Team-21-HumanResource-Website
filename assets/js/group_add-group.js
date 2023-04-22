let submitFormCancellation = false;

(function main() {
    const errorMessages = {
        group: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => isNaN(Number.parseInt(e)));
            },
            message: "Tên nhóm không hợp lệ.",
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
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })
            if (data[0][0] == "error_group") {
                console.log(data[0][0]);
                alert('Tên nhóm đã tồn tại!');

            } else if (data[0][0].includes("employee_code")) {
                console.log(data[0][0]);
                alert('Nhân viên đã tồn tại trong nhóm khác!');

            }

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/group/add-group");
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