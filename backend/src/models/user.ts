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

User.getUserOIDByNameAndEmail = (first_name: string, last_name: string, email: string, result: any) => {
    con.query(
        'CALL getUserOIDByNameAndEmail(?, ?, ?)',
        [
            first_name,
            last_name,
            email
        ],
        (err: any, res: any) => {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        }
    )
}

User.getUserNameAndEmailByOID = (oid: string, result: any) => {
    con.query(
        'CALL getUserNameAndEmailByOID(?)',
        [oid],
        (err: any, res: any) => {
            if (err) {
                result(err, null);
            } else {
                result(null, res[0]);
            }
        }
    )
}

User.getAllUsers = (result: any) => {
    con.query("SELECT employee_id, first_name, last_name, email FROM employee", (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
};


User.updatePhoto = (oid: any, photo: any, result: any) => {
    con.query(
        'CALL updateProfilePhoto(?,?)',
        [
            oid,
            photo
        ],
        (err: any, res: any) => {
            if (err) {
                console.log("Error: ", err);
                result(err, null);
            } else {
                console.log("Photo updated for user: ", oid);
                result(null, "Photo updated for user: ", oid);
            }
        }
    )
};