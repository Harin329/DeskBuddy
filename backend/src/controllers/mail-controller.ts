import { Mail } from '../models/mail'
import { User } from '../models/user'
import { IMail, IMailResponse } from '../interfaces/mail.interface';

export default class MailController {
  // tslint:disable-next-line:no-empty
  constructor() { }

  getMail(employeeID: string, filter: string | undefined, sort: string | undefined): Promise<IMailResponse[]> {
    return new Promise((resolve, reject) => {
      User.getUserNameAndEmailByOID(employeeID, (nameErr: any, nameRes: any) => {
        if (nameErr) {
          reject (nameErr);
        } else {
          Mail.getMail(employeeID ,filter, sort, (err: any, res: any) => {
            if (err) {
              reject(err);
            } else {
              try {
                const employeeInfo = JSON.parse(JSON.stringify(nameRes))[0];
                const result = JSON.parse(JSON.stringify(res));
                const output: IMailResponse[] = [];
                for (const mail of result) {
                  let date = mail.date_arrived;
                  if (date !== null) {
                    date = date.substring(0, 10); // truncates time
                  }
                  const parsedMail: IMailResponse = {
                    mailID: mail.mail_id,
                    officeID: mail.fk_office_id,
                    officeLocation: mail.fk_office_location,
                    recipient_first: employeeInfo.first_name,
                    recipient_last: employeeInfo.last_name,
                    recipient_email: employeeInfo.email,
                    type: mail.type,
                    approx_date: date,
                    sender: mail.sender_info,
                    dimensions: mail.dimensions,
                    comments: mail.additional_notes,
                    adminID: mail.fk_admin_eid
                  }
                  output.push(parsedMail);
                }
                resolve(output);
              } catch (err) {
                reject(err);
              }
            }
          });
        }
      })
    });
  }

  // posts a mail, returns mail_id
  createMail(body: IMail): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!body.recipient_email || !body.recipient_first || !body.recipient_last) {
        reject("Bad body");
      }
      User.getUserOIDByNameAndEmail(body.recipient_first, body.recipient_last, body.recipient_email, (errGet: any, resGet: any) => {
        if (errGet) {
          reject(errGet);
        } else {
          const results = JSON.parse(JSON.stringify(resGet[0]));
          if (results.length === 0) {
            reject("No user with these parameters");
          } else if (results.length > 1) {
            reject("Too many users with these parameters");
          }
          try {
            const oid = results[0].employee_id;
            Mail.createMail(body.officeID, body.officeLocation, oid,
              body.type, body.approx_date, body.sender, body.dimensions, body.comments, body.adminID, (err: any, res: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(JSON.parse(JSON.stringify(res[0][0]))['LAST_INSERT_ID()']);
                }
              });
          } catch (e: any) {
            reject(e);
          }
        }
      });
    });
  }
  createMailRequest(req: any) {
    return new Promise((resolve, reject) => {
      Mail.createRequest(req, (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    })
  }
  // deletes a mail, returns how many rows have been deleted
  deleteMail(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      Mail.deleteMail(id, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    })
  }
}

