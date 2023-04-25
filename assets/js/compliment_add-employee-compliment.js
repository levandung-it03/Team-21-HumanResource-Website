let submitFormCancellation = false;

(function main() {
    const errorMessages = {
        compliment: {
            confirm: function (value) {
                this.isValid = /^[a-zA-ZÀ-ỹ\s]+$/u.test(value);
            },
            message: "Khen thưởng không hợp lệ.",
            isValid: false,
        },
        numbers: {
            confirm: function (value) {
                const firstNumbersSplitArr = value.split("/");
                const textValue = firstNumbersSplitArr.pop();
                this.isValid =
                    firstNumbersSplitArr.every(n => /[0-9]/.test(n)) && /^[A-ZÀ-ỹ\s-]+$/u.test(textValue);
            },
            message: "Số quyết định không hợp lệ.",
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
                if (tag.classList.contains("adjust-upper-case"))
                    tag.value = tag.value.toUpperCase();

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

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Đã tồn tại loại hình khen thưởng này!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/compliment/add-compliment-type");
            strictInputTags.forEach((tag, index) => {
                tag.value = data.find((e) => e[0] == tag.name)[1];
                errorMessages[tag.name].confirm(tag.value);
            })
            $('.form_textarea-input textarea').innerText = data[3][1];
        })();
    }
})();