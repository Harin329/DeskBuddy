import DB from '../config/db-handler';

const con = DB.getCon();

export const User = function (this: any, user: any) {
    this.employee_id = user.employee_id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.phone = user.phone;
    this.email = user.email;
};

User.insertUser = (newUser: any, result: any) => {
    con.query(
        'CALL insertEmployee(?,?,?,?,?)',
        [
            newUser.employee_id,
            newUser.first_name,
            newUser.last_name,
            newUser.phone,
            newUser.email,
        ],
        (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                console.log("User Created: ", { ...newUser });
                result(null, newUser);
            }
        }
    )
};