import DB from '../config/db-handler';
import { getFormattedDate } from "../helpers/Date";

const con = DB.getCon();

export const Mail = function (this: any, post: any) {
  // TODO based on DBs attributes of posts
}
// truth table is the way it is because non-parameterized queries are vulnerable to SQL injection
Mail.getMail = (employeeID: string,
  filter: string | undefined,
  sort: string | undefined,
  loc: string | undefined,
  id: string | undefined,
  result: any) => {
  let processed_sort = sort;
  let query: string;
  let parameters: (string|number)[];
  let direction: string | undefined;
  if (typeof sort === "string") {
    if (sort.charAt(0) === "+") {
      processed_sort = sort.substr(1);
      direction = "ASC";
    } else if (sort.charAt(0) === "-") {
      processed_sort = sort.substr(1);
      direction = "DESC";
    } else {
      processed_sort = sort;
      direction = "DESC";
    }
  }
  // params: filter, sort, direction, loc, id
  switch (getCode(filter, processed_sort, direction, loc, id)) {
    case "getMail":
      query = `CALL getMail(?)`;
      parameters = [employeeID];
      break;
    case "getMailLoc":
      query = `CALL getMailLoc(?, ?)`;
      parameters = [employeeID, loc as string];
      break;
    case "getMailID":
      query = `CALL getMailID(?, ?)`;
      parameters = [employeeID, parseInt(id as string, 10)];
      break;
    case "getMailLocID":
      query = `CALL getMailLocID(?, ?, ?)`;
      parameters = [employeeID, loc as string, parseInt(id as string, 10)];
      break;
    case "getNewMail":
      query = `CALL getNewMail(?)`;
      parameters = [employeeID];
      break;
    case "getNewMailLoc":
      query = `CALL getNewMailLoc(?, ?)`;
      parameters = [employeeID, loc as string];
      break;
    case "getNewMailID":
      query = `CALL getNewMailID(?, ?)`;
      parameters = [employeeID, parseInt(id as string, 10)];
      break;
    case "getNewMailLocID":
      query = `CALL getNewMailLocID(?, ?, ?)`;
      parameters = [employeeID, loc as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMail":
      query = `CALL getFilteredMail(?, ?)`;
      parameters = [employeeID, filter as string];
      break;
    case "getFilteredMailLoc":
      query = `CALL getFilteredMailLoc(?, ?, ?)`;
      parameters = [employeeID, filter as string, loc as string];
      break;
    case "getFilteredMailID":
      query = `CALL getFilteredMailID(?, ?, ?)`;
      parameters = [employeeID, filter as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMailLocID":
      query = `CALL getFilteredMailLocID(?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getMailSortedAsc":
      query = `CALL getMailSortedAsc(?, ?)`;
      parameters = [employeeID, processed_sort as string];
      break;
    case "getMailSortedAscLoc":
      query = `CALL getMailSortedAscLoc(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string];
      break;
    case "getMailSortedAscID":
      query = `CALL getMailSortedAscID(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getMailSortedAscLocID":
      query = `CALL getMailSortedAscLocID(?, ?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getMailSortedDesc":
      query = `CALL getMailSortedDesc(?, ?)`;
      parameters = [employeeID, processed_sort as string];
      break;
    case "getMailSortedDescLoc":
      query = `CALL getMailSortedDescLoc(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string];
      break;
    case "getMailSortedDescID":
      query = `CALL getMailSortedDescID(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getMailSortedDescLocID":
      query = `CALL getMailSortedDescLocID(?, ?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getNewMailSortedAsc":
      query = `CALL getNewMailSortedAsc(?, ?)`;
      parameters = [employeeID, processed_sort as string];
      break;
    case "getNewMailSortedAscLoc":
      query = `CALL getNewMailSortedAscLoc(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string];
      break;
    case "getNewMailSortedAscID":
      query = `CALL getNewMailSortedAscID(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getNewMailSortedAscLocID":
      query = `CALL getNewMailSortedAscLocID(?, ?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getNewMailSortedDesc":
      query = `CALL getNewMailSortedDesc(?, ?)`;
      parameters = [employeeID, processed_sort as string];
      break;
    case "getNewMailSortedDescLoc":
      query = `CALL getNewMailSortedDescLoc(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string];
      break;
    case "getNewMailSortedDescID":
      query = `CALL getNewMailSortedDescID(?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getNewMailSortedDescLocID":
      query = `CALL getNewMailSortedDescLocID(?, ?, ?, ?)`;
      parameters = [employeeID, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMailSortedAsc":
      query = `CALL getFilteredMailSortedAsc(?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string];
      break;
    case "getFilteredMailSortedAscLoc":
      query = `CALL getFilteredMailSortedAscLoc(?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, loc as string];
      break;
    case "getFilteredMailSortedAscID":
      query = `CALL getFilteredMailSortedAscID(?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMailSortedAscLocID":
      query = `CALL getFilteredMailSortedAscLocID(?, ?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMailSortedDesc":
      query = `CALL getFilteredMailSortedDesc(?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string];
      break;
    case "getFilteredMailSortedDescLoc":
      query = `CALL getFilteredMailSortedDescLoc(?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, loc as string];
      break;
    case "getFilteredMailSortedDescID":
      query = `CALL getFilteredMailSortedDescID(?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, parseInt(id as string, 10)];
      break;
    case "getFilteredMailSortedDescLocID":
      query = `CALL getFilteredMailSortedDescLocID(?, ?, ?, ?, ?)`;
      parameters = [employeeID, filter as string, processed_sort as string, loc as string, parseInt(id as string, 10)];
      break;
    default:
      result("Error: filter, sort, loc or id were bad", null)
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

const getCode = (filter: string | undefined,
  sort: string | undefined,
  direction: string | undefined,
  loc: string | undefined,
  id: string | undefined): string => {
  const truth_table: { [key: string]: any[] } = {
    getMail: [undefined, undefined, undefined, undefined, undefined], // getMail
    getMailLoc: [undefined, undefined, undefined, "string", undefined], // getMail
    getMailID: [undefined, undefined, undefined, undefined, "string"], // getMail
    getMailLocID: [undefined, undefined, undefined, "string", "string"], // getMail
    getNewMail: ["new", undefined, undefined, undefined, undefined], // getNewMail
    getNewMailLoc: ["new", undefined, undefined, "string", undefined], // getNewMail
    getNewMailID: ["new", undefined, undefined, undefined, "string"], // getNewMail
    getNewMailLocID: ["new", undefined, undefined, "string", "string"], // getNewMail
    getFilteredMail: ["string", undefined, undefined, undefined, undefined], // getFilteredMail
    getFilteredMailLoc: ["string", undefined, undefined, "string", undefined], // getFilteredMail
    getFilteredMailID: ["string", undefined, undefined, undefined, "string"], // getFilteredMail
    getFilteredMailLocID: ["string", undefined, undefined, "string", "string"], // getFilteredMail
    getMailSortedAsc: [undefined, "string", "ASC", undefined, undefined], // getMailSortedAsc
    getMailSortedAscLoc: [undefined, "string", "ASC", "string", undefined], // getMailSortedAsc
    getMailSortedAscID: [undefined, "string", "ASC", undefined, "string"], // getMailSortedAsc
    getMailSortedAscLocID: [undefined, "string", "ASC", "string", "string"], // getMailSortedAsc
    getMailSortedDesc: [undefined, "string", "DESC", undefined, undefined], // getMailSortedDesc
    getMailSortedDescLoc: [undefined, "string", "DESC", "string", undefined], // getMailSortedDesc
    getMailSortedDescID: [undefined, "string", "DESC", undefined, "string"], // getMailSortedDesc
    getMailSortedDescLocID: [undefined, "string", "DESC", "string", "string"], // getMailSortedDesc
    getNewMailSortedAsc: ["new", "string", "ASC", undefined, undefined], // getNewMailSortedAsc
    getNewMailSortedAscLoc: ["new", "string", "ASC", "string", undefined], // getNewMailSortedAsc
    getNewMailSortedAscID: ["new", "string", "ASC", undefined, "string"], // getNewMailSortedAsc
    getNewMailSortedAscLocID: ["new", "string", "ASC", "string", "string"], // getNewMailSortedAsc
    getNewMailSortedDesc: ["new", "string", "DESC", undefined, undefined], // getNewMailSortedDesc
    getNewMailSortedDescLoc: ["new", "string", "DESC", "string", undefined], // getNewMailSortedDesc
    getNewMailSortedDescID: ["new", "string", "DESC", undefined, "string"], // getNewMailSortedDesc
    getNewMailSortedDescLocID: ["new", "string", "DESC", "string", "string"], // getNewMailSortedDesc
    getFilteredMailSortedAsc: ["string", "string", "ASC", undefined, undefined], // getFilteredMailSortedAsc
    getFilteredMailSortedAscLoc: ["string", "string", "ASC", "string", undefined], // getFilteredMailSortedAsc
    getFilteredMailSortedAscID: ["string", "string", "ASC", undefined, "string"], // getFilteredMailSortedAsc
    getFilteredMailSortedAscLocID: ["string", "string", "ASC", "string", "string"], // getFilteredMailSortedAsc
    getFilteredMailSortedDesc: ["string", "string", "DESC", undefined, undefined], // getFilteredMailSortedDesc
    getFilteredMailSortedDescLoc: ["string", "string", "DESC", "string", undefined], // getFilteredMailSortedDesc
    getFilteredMailSortedDescID: ["string", "string", "DESC", undefined, "string"], // getFilteredMailSortedDesc
    getFilteredMailSortedDescLocID: ["string", "string", "DESC", "string", "string"], // getFilteredMailSortedDesc
  };
  let toReturn = "no match";
  Object.keys(truth_table).forEach((key: string) => {
    const cond: any = truth_table[key]
    const condFilter: boolean = filter === cond[0] || typeof filter === cond[0];
    const condSort: boolean = sort === cond[1] || typeof sort === cond[1];
    const condDirection: boolean = direction === cond[2];
    const condLocation: boolean = loc === cond[3] || typeof loc === cond[3];
    const condID: boolean = id === cond[4] || typeof id === cond[4];
    if (toReturn === "no match" && condFilter && condSort && condDirection && condLocation && condID) {
      toReturn = key;
    }
  });
  return toReturn;
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
  const currDate = getFormattedDate();
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
