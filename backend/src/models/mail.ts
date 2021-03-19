import DB from '../config/db-handler';

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