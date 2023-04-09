let submitFormCancellation = false;

(function main() {
    const errorMessages = {
        department: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => isNaN(Number.parseInt(e)));
            },
            message: "Tên phòng ban không hợp lệ.",
            isValid: false,
        },
        multipleSalary: {
            confirm: function (value) {
                const multiples = value.split(".");
                if (multiples.length > 2) {
                    this.isValid = false;
                } else {
                    this.isValid = !multiples.every(value => value.split("").every((e) => isNaN(Number.parseInt(e))));
                }
            },
            message: "Hệ số không hợp lệ.",
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
            </span>`;
        });
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
        strictInputTags[1].onkeyup = generalMethods.rejectWeirdCharOfNumberInputTags;
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Phòng ban này đã tồn tại!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
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
})();