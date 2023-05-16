let submitFormCancellation = false;

const mainData = [...$$("tr.body")];
(function main() {
    const errorMessages = {
        signingDate: {
            confirm: function (value) {
                this.isValid = Date.parse(value) <= Date.now();
            },
            message: "Ngày ký không hợp lệ.",
            isValid: false,
        },
        startingDate: {
            confirm: function (value) {
                const signingDate = Date.parse($('input[name=signingDate]').value);
                const startingDate = Date.parse(value);
                this.isValid = (signingDate <= startingDate);
            },
            message: "Ngày bắt đầu không hợp lệ.",
            isValid: false,
        },
        endingDate: {
            confirm: function (value) {
                const startingDate = Date.parse($('input[name=startingDate]').value);
                const endingDate = Date.parse(value);
                this.isValid = (startingDate <= endingDate);
            },
            message: "Ngày kết thúc không hợp lệ.",
            isValid: false,
        },
        actuallyDate: {
            confirm: function (value) {
                const startingDate = Date.parse($('input[name=startingDate]').value);
                const actualltyDate = Date.parse(value);
                this.isValid = (startingDate <= actualltyDate);
            },
            message: "Ngày tính phép không hợp lệ.",
            isValid: false,
        },
        negotiableRatio: {
            confirm: function (value) {
                if (value.length > 3)
                    $("input[name=negotiableRatio]").value = value.slice(0, 3);
                this.isValid = /^[0-9\s]+$/u.test(value);
            },
            message: "Tỉ lệ không hợp lệ.",
            isValid: false,
        },
        insuranceFee: {
            confirm: function (value) {
                this.isValid = /^[0-9\s]+$/u.test(value);
            },
            message: "Số tiền không hợp lệ.",
            isValid: false,
        },
        internalFund: {
            confirm: function (value) {
                this.isValid = /^[0-9\s]+$/u.test(value);
            },
            message: "Số tiền không hợp lệ.",
            isValid: false,
        },
        unionFee: {
            confirm: function (value) {
                this.isValid = /^[0-9\s]+$/u.test(value);
            },
            message: "Số tiền không hợp lệ.",
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
            e.innerHTML = `<span class='err-message-block' id='${parentId}'>
                ${errorMessages[parentId].message}
            </span>`;
        })
    })();

    function automaticallyCalculateTotalSalary(originSal, ratio) {
        if (originSal)
            if (ratio) $('input[name=totalSalary]').value = 30*originSal*ratio/100;
    }

    (function setUpstrictInputTags() {
        strictInputTags.forEach((tag) => {
            if (tag.name == "negotiableRatio") {
                tag.onchange = (e) => {
                    automaticallyCalculateTotalSalary($('input[name=originalSalary]').value, tag.value);
                    generalMethods.trimInputData(e.target);
    
                    const errMesTagObject = errorMessages[tag.name];
                    const errTag = $(`div#${tag.name} span#${tag.name}`);
    
                    errMesTagObject.confirm(tag.value);
                    if (errMesTagObject.isValid) errTag.style.display = "none";
                    else errTag.style.display = "inline";
                }
            }
            tag.onblur = (e) => {
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
        alert('Nhân viên này đã tồn tại hợp đồng!');
        (async function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/contract/add-contract");
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
    
    (function handleAutomaticallySetUpRemainingEmployeeDataTags() {
        const degreeHiddenInpTags = [...$$('div#degree input[type=hidden]')];
        const departmentHiddenInpTags = [...$$('div#department input[type=hidden]')];
        const employee_typeHiddenInpTags = [...$$('div#employee-type input[type=hidden]')];

        function handleSelection(tag) {
            const data = tag.value.split("-");
            const department = data.pop();
            const degree = data.pop();
            const employee_type = data.pop();

            $('input[name=department]').value = department;
            $('input[name=degree]').value = degree;
            $('input[name=employee_type]').value = employee_type;
            
            const departmentMulSal = degreeHiddenInpTags.find(d=>d.name==degree).value;
            const degreeMulSal = departmentHiddenInpTags.find(d=>d.name==department).value;
            const employee_typeMulSal = employee_typeHiddenInpTags.find(d=>d.name==employee_type).value;

            $('input[name=originalSalary]').value = $('div#position input').value
                * departmentMulSal * degreeMulSal * employee_typeMulSal;
        }

        $$('select[name=employee] option').forEach(tag => {
            if (tag.selected && !tag.disabled) {
                if (tag.value)  handleSelection(tag);
            }
        })

        $('select[name=employee]').onchange = (e) => {
            $$("option:disabled").forEach(tag => {
                tag.selected = false;
            })
            e.target.querySelectorAll('option').forEach(tag => {
                if (tag.value) {
                    if (tag.selected)   handleSelection(tag);
                    automaticallyCalculateTotalSalary($('input[name=originalSalary]').value, $('input[name=negotiableRatio]').value);
                }
            })
        }
        automaticallyCalculateTotalSalary($('input[name=originalSalary]').value, $('input[name=negotiableRatio]').value);
    })()
})();