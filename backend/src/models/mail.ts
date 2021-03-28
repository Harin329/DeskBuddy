import DB from '../config/db-handler';
import {getFormattedDate} from "../helpers/Date";

const con = DB.getCon();

export const Mail = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}

Mail.getMail = (employeeID: string, result: any) => {
  con.query(`CALL getMail(?)`,
  [employeeID],
  (err: any, res: any) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res[0]);
    }
  })
}

Mail.createMail = (officeID: number, officeLoc: string, recipient: string, type: string, approx: string, sender: string,
  dimensions: string, comments: string, adminID: string, result: any) => {
    con.query('CALL createMail(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      recipient,
      adminID,
      officeID,
      officeLoc,
      approx,
      type,
      dimensions,
      sender,
      comments

    ],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    });
  };

Mail.deleteMail = (mailID: number, result: any) => {
    con.query(`CALL deleteMail(?)`,
    [mailID],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res.affectedRows);
      }
    })
  };

Mail.createRequest = (req: any, result: any) => {
    const date = new Date();
    const currTime = getFormattedDate(date);
  con.query(`CALL createRequest(?,?,?,?,?,?,?,?,?,?)`,
      [
          req.mail_id,
          req.employee_id,
          req.employee_name,
          req.employee_email,
          req.employee_phone,
          req.request_type,
          req.forward_location,
          req.additional_instructions,
          req.req_conpletion_date,
          currTime
      ], (err: any, res: any) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
      })
};

Mail.getAllRequests = (employeeID: any, result: any) => {
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

Mail.updateRequest = (req: any, result: any) => {
    const date = new Date();
    const currDate = getFormattedDate(date);
};

Mail.deleteRequest = (req: any, result: any) => {
  con.query("DELETE FROM mail_request WHERE employee_id = ? AND mail_id = ?", [
      req.employee_id,
      req.mail_id
  ], (err: any, res: any) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  })
};
