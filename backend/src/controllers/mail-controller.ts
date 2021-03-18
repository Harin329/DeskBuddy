import { Mail } from '../models/mail'
import { User } from '../models/user'
import { IMail } from '../interfaces/mail.interface';

export default class MailController {
  // tslint:disable-next-line:no-empty
  constructor() { }

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

