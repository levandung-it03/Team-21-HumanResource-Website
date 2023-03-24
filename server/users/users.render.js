class renderMethods {
    register(req, res) {
        res.render('register');
    }
    login(req, res) {
        res.render('login');
    }
    adminHome(req, res) {
        res.render('admin.ejs');
    }
    employeeHome(req, res) {
        res.render('employee.ejs');
    }
}
module.exports = new renderMethods;