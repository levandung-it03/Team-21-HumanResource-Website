const mainData = [...$$("tr.body")];
(function main() {
    const errorMessages = {
        totalDays: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e))) && Number.parseInt(value) <= 31;
            },
            message: "Số ngày không hợp lệ.",
            isValid: false,
        },
        dayOff: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e))) && Number.parseInt(value) <= 31
                    && Number.parseInt($('input[name=totalDays]').value) + Number.parseInt(value) <= 31;
            },
            message: "Số ngày nghỉ không hợp lệ.",
            isValid: false,
        },
        allowance: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
            },
            message: "Số tiền không hợp lệ.",
            isValid: false,
        },
        bonusSalary: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
            },
            message: "Số tiền không hợp lệ.",
            isValid: false,
        },
        advanceSalary: {
            confirm: function (value) {
                this.isValid = value.split("").every((e) => !isNaN(Number.parseInt(e)));
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
            e.innerHTML = `
                <span class='err-message-block' id='${parentId}'>
                    ${errorMessages[parentId].message}</span>`;
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

                if (tag.name == "totalDays") {
                    const dayOffTag = $('input[name=dayOff]');

                    const errMesDayOffTagObject = errorMessages[dayOffTag.name];
                    const errDayOffTag = $(`div#${dayOffTag.name} span#${dayOffTag.name}`);

                    errMesDayOffTagObject.confirm(dayOffTag.value);
                    if (errMesDayOffTagObject.isValid) errDayOffTag.style.display = "none";
                    else errDayOffTag.style.display = "inline";
                }
            }
        })
    })();

    (function handleAutoSelectSalaryInfoTagsFromSpecifiedEmployee() {
        const data = $('select[name=employee]').getAttribute('data').trim();
        if (data) {
            const degreeOptionTags = [...$$('select[name=degree] option')];
            const positionOptionTags = [...$$('select[name=position] option')];
            const departmentOptionTags = [...$$('select[name=department] option')];
            const employeeTypeOptionTags = [...$$('select[name=employee_type] option')];
            const selectedEmployee =
                [...$$('select[name=employee] option')].find(optionTag => optionTag.value.split("-").includes(data));
            selectedEmployee.selected = true;
            const employeeData = selectedEmployee.value.split("-");

            positionOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[2]).selected = true;
            employeeTypeOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[4]).selected = true;
            degreeOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[6]).selected = true;
            departmentOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[8]).selected = true;
        }
    })();

    function handleSelectsOptions() {
        const degreeOptionTags = [...$$('select[name=degree] option')];
        const positionOptionTags = [...$$('select[name=position] option')];
        const departmentOptionTags = [...$$('select[name=department] option')];
        const employeeTypeOptionTags = [...$$('select[name=employee_type] option')];

        const selectedEmployee = [...$$('select[name=employee] option')].find(optionTag => optionTag.selected);
        const employeeData = selectedEmployee.value.split("-");

        positionOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[2]).selected = true;
        employeeTypeOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[4]).selected = true;
        degreeOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[6]).selected = true;
        departmentOptionTags.find(optionTag => optionTag.value.split("-")[0] == employeeData[8]).selected = true;
    }

    (function handleAutoSelectSalaryInfoTags() {
        $('select[name=employee]').onchange = (e) => {
            handleSelectsOptions();
        }
    })();

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    if (myParam) {
        alert('Hợp đồng của nhân viên này chưa tồn tại nên không thể tính lương!');
        (function handleRedirect() {
            const dataMessages = myParam.split('?');
            const data = dataMessages.map((e) => {
                return e.split('=');
            })

            window.history.replaceState({}, "", "http://localhost:3000/admin/category/salary/add-salary");
            strictInputTags.forEach((tag, index) => {
                tag.value = data.find((e) => e[0] == tag.name)[1];
                errorMessages[tag.name].confirm(tag.value);
            })

            const employee_code = data.find(data => data[0] == "employee").pop().split("-")[0];
            const selectTag = $('.form_select-input select[name=employee]');
            selectTag.querySelectorAll('option').forEach(optionTag => {
                if (optionTag.value.includes(employee_code)) {
                    optionTag.selected = true;
                    handleSelectsOptions();
                }
            })
        })();
    }
})();