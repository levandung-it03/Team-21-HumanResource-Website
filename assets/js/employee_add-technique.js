(function main() {
    const errorMessages = {
        technique: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => isNaN(Number.parseInt(e)));
            },
            message: "Tên chuyên môn không hợp lệ.",
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
                generalMethods.trimInputData(e.target);

                const errMesTagObject = errorMessages[tag.name];
                const errTag = $(`div#${tag.name} span#${tag.name}`);

                errMesTagObject.confirm(tag.value);
                if (errMesTagObject.isValid) errTag.style.display = "none";
                else errTag.style.display = "inline";
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
})();