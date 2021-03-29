import DB from '../config/db-handler';
import {getFormattedDate} from "../helpers/Date";

const con = DB.getCon();

export const Request = function (this: any, request: any) {
    this.mail_id = request.mail_id;
    this.employee_id = request.employee_id;
    // more fields to come
}

// creates a request for the given mail
Request.createRequest = (req: any, result: any) => {
    const currTime = getFormattedDate();
    con.query(`CALL createRequest(?,?,?,?,?,?,?,?,?,?,?)`,
        [
            req.mail_id,
            req.employee_id,
            req.employee_name,
            req.employee_email,
            req.employee_phone,
            req.request_type,
            req.forward_location,
            req.additional_instructions,
            req.req_completion_date,
            "awaiting admin action",
            currTime
        ], (err: any, res: any) => {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        })
};
// gets all of the requests for a given employee. Can change this to get all open requests if needed?
Request.getAllRequests = (employeeID: any, result: any) => {
    con.query("SELECT * FROM mail_request WHERE employee_id = ?", [
        employeeID
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

// employee updates their request that they selected (Request additional assistance)
Request.updateRequestEmployee = (req: any, result: any) => {
    const currDate = getFormattedDate();
    con.query(`CALL updateRequestEmployee(?,?,?,?,?,?,?,?,?)`, [
        req.mail_id,
        req.employee_id,
        req.employee_phone,
        req.request_type,
        req.forward_location,
        req.additional_instruction,
        req.req_completion_date,
        "awaiting admin action", // placeholder
        currDate
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

// admin responds to the request (updates request)
Request.updateRequestAdmin = (req: any, result: any) => {
    const currDate = getFormattedDate();
    con.query(`CALL updateRequestAdmin(?,?,?,?,?)`, [
        req.mail_id,
        "awaiting employee confirmation", // placeholder, will likely be an enum?
        req.admin_eid,
        req.response,
        currDate
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
};

// admin or user can close request (request is updated to closed)
Request.closeRequest = (req: any, result: any) => {
    const currDate = getFormattedDate();
    con.query("UPDATE mail_request SET `status` = ?, `completion_date` = ?, `modified_at` = ? WHERE mail_id = ? AND employee_id = ?", [
        "closed", // will be changed to an enum or something. i.e won't be hardcoded
        currDate,
        currDate,
        req.mail_id,
        req.employee_id
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
};