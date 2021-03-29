import DB from '../config/db-handler';

const con = DB.getCon();

export const Mail = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}

Mail.getMail = (employeeID: string, filter: string | undefined, sort: string | undefined, result: any) => {
  let processed_sort = sort;
  let query: string;
  let parameters: string[];
  let direction: string = "DESC";
  if (typeof sort === "string") {
    if (sort.charAt(0) === "+") {
      processed_sort = sort.substr(1);
      direction = "ASC";
    } else if (sort.charAt(0) === "-") {
      processed_sort = sort.substr(1);
    }
  }
  switch (true) {
    case filter === undefined && processed_sort === undefined:
      query = `CALL getMail(?)`;
      parameters = [employeeID];
      break;
    case filter === "new" && processed_sort === undefined:
      query = `CALL getNewMail(?)`;
      parameters = [employeeID];
      break;
    case (filter !== undefined && filter !== "new") && processed_sort === undefined:
      query = `CALL getFilteredMail(?, ?)`;
      parameters = [employeeID, filter as string];
      break;
    case filter === undefined && processed_sort !== undefined && direction === "ASC":
      query = `CALL getMailSortedAsc(?, ?)`; // TODO
      parameters = [employeeID, processed_sort as string];
      break;
    case filter === undefined && processed_sort !== undefined && direction === "DESC":
      query = `CALL getMailSortedDesc(?, ?)`; // TODO
      parameters = [employeeID, processed_sort as string];
      break;
    case filter === "new" && processed_sort !== undefined && direction === "ASC":
      query = `CALL getNewMailSortedAsc(?, ?)`; // TODO
      parameters = [employeeID, processed_sort as string];
      break;
    case filter === "new" && processed_sort !== undefined && direction === "DESC":
      query = `CALL getNewMailSortedDesc(?, ?)`; // TODO
      parameters = [employeeID, processed_sort as string];
      break;
    case (filter !== undefined && filter !== "new") && processed_sort !== undefined && direction === "ASC":
      query = `CALL getFilteredMailSortedAsc(?, ?, ?)`; // TODO
      parameters = [employeeID, filter as string, processed_sort as string];
      break;
    case (filter !== undefined && filter !== "new") && processed_sort !== undefined && direction === "DESC":
      query = `CALL getFilteredMailSortedDesc(?, ?, ?)`; // TODO
      parameters = [employeeID, filter as string, processed_sort as string];
      break;
    default:
      result("Error: filter or sort were bad types", null)
      return;
  }
  con.query(query, parameters, (err: any, res: any) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res[0]);
    }
  });
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

Mail.createMailRequest = (req: any, result: any) => {
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