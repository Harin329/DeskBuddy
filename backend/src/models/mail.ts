import DB from '../config/db-handler';
import {getFormattedDate} from "../helpers/Date";

const con = DB.getCon();

export const Mail = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}

Mail.getMail = (employeeID: string, filter: string | undefined, result: any) => {
  if (filter === undefined) {
    con.query(`CALL getMail(?)`,
      [employeeID],
      (err: any, res: any) => {
        if (err) {
          result(err, null);
        } else {
          result(null, res[0]);
        }
      });
  } else if (filter === "new") {
    con.query(`CALL getNewMail(?)`,
      [employeeID],
      (err: any, res: any) => {
        if (err) {
          console.log(err);
          result(err, null);
        } else {
          result(null, res[0]);
        }
      });
  } else {
    con.query(`CALL getFilteredMail(?, ?)`,
      [employeeID, filter],
      (err: any, res: any) => {
        if (err) {
          result(err, null);
        } else {
          result(null, res[0]);
        }
      });
  }
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
  }

Mail.createRequest = (req: any, result: any) => {
  con.query("INSERT INTO mail_request VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [req.mail_id, req.employee_id, req.employee_name, req.employee_email, req.employee_phone,
    req.request_type, req.forward_location, req.additional_instructions, req.req_completion_date,
    req.completion_date, req.status, req.admin_eid],
    (err: any, res: any) => {
      if (err) {
        result(err, null);
      } else {
        result(null, res.affectedRows);
      }
    });
}

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
}

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
