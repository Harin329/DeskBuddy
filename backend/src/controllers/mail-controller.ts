import { Mail } from '../models/mail'
import { User } from '../models/user'
import { IMail, IMailResponse, IRequestTypesForward, IRequestTypesForwardPair } from '../interfaces/mail.interface';

export default class MailController {
  // tslint:disable-next-line:no-empty
  constructor() { }

  getMailByEmployee(employeeID: string,
    filter: string | undefined,
    sort: string | undefined,
    loc: string | undefined,
    id: string | undefined): Promise<IMailResponse[]> {
    return new Promise((resolve, reject) => {
      User.getUserNameAndEmailByOID(employeeID, (nameErr: any, nameRes: any) => {
        if (nameErr) {
          reject(nameErr);
        } else {
          Mail.getMailByEmployee(employeeID, filter, sort, loc, id, async (err: any, res: any) => {
            if (err) {
              reject(err);
            } else {
              try {
                const employeeInfo = JSON.parse(JSON.stringify(nameRes))[0];
                const result = JSON.parse(JSON.stringify(res));
                const output: IMailResponse[] = [];
                const mailIDs: string[] = [];
                for (const mail of result) {
                  mailIDs.push(mail.mail_id.toString());
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
                    adminID: mail.fk_admin_eid,
                    request_type: null as any,
                    forward_location: null as any,
                    response: null as any
                  }
                  output.push(parsedMail);
                }
                const typesAndLocations: IRequestTypesForward[] = await this.getRequestTypeAndForwardLocation(mailIDs);
                const requestMap: Map<number, IRequestTypesForwardPair> = new Map();
                for (const element of typesAndLocations) {
                  requestMap.set(element.mail_id, {
                    request_type: element.request_type,
                    forward_location: element.forward_location,
                    response: element.response
                  });
                }
                for (const mail of output) {
                  const mapping = requestMap.get(mail.mailID)
                  if (mapping !== undefined) {
                    mail.request_type = mapping.request_type;
                    mail.forward_location = mapping.forward_location;
                    mail.response = mapping.response
                  }
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

  public async getMail(filter: string | undefined,
    sort: string | undefined,
    loc: string | undefined,
    id: string | undefined): Promise<IMailResponse[]> {
    return new Promise((resolve, reject) => {
      Mail.getMailWithEmployeeInfo(filter, sort, loc, id, async (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          try {
            const result = JSON.parse(JSON.stringify(res));
            const output: IMailResponse[] = [];
            const mailIDs: string[] = [];
            for (const mail of result) {
              mailIDs.push(mail.mail_id.toString());
              let date = mail.date_arrived;
              if (date !== null) {
                date = date.substring(0, 10); // truncates time
              }
              const parsedMail: IMailResponse = {
                mailID: mail.mail_id,
                officeID: mail.fk_office_id,
                officeLocation: mail.fk_office_location,
                recipient_first: mail.first_name,
                recipient_last: mail.last_name,
                recipient_email: mail.email,
                type: mail.type,
                approx_date: date,
                sender: mail.sender_info,
                dimensions: mail.dimensions,
                comments: mail.additional_notes,
                adminID: mail.fk_admin_eid,
                request_type: null as any,
                forward_location: null as any,
                response: null as any
              }
              output.push(parsedMail);
            }
            const typesAndLocations: IRequestTypesForward[] = await this.getRequestTypeAndForwardLocation(mailIDs);
            const requestMap: Map<number, IRequestTypesForwardPair> = new Map();
            for (const element of typesAndLocations) {
              requestMap.set(element.mail_id, {
                request_type: element.request_type,
                forward_location: element.forward_location,
                response: element.response
              });
            }
            for (const mail of output) {
              const mapping = requestMap.get(mail.mailID)
              if (mapping !== undefined) {
                mail.request_type = mapping.request_type;
                mail.forward_location = mapping.forward_location
                mail.response = mapping.response;
              }
            }
            resolve(output);
          } catch (err) {
            reject(err);
          }
        }
      }
      );
    });
  }

  getRequestTypeAndForwardLocation(mailIDs: string[]): Promise<IRequestTypesForward[]> {
    for (const id in mailIDs) {
      if (isNaN(Number(id))) {
        return Promise.reject("mailIDs are not good"); // sanitizes IDs
      }
    }
    const allIDs = "('" + mailIDs.join("','") + "')";
    return new Promise((resolve, reject) => {
      Mail.getMailRequestTypeAndForwardLocation(allIDs, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          try {
            const result: IRequestTypesForward[] = JSON.parse(JSON.stringify(res));
            resolve(result);
          } catch (newerr) {
            reject(newerr)
          }
        }
      });
    })
  }


  // posts a mail, returns mail_id
  createMail(body: IMail): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!body.oid || !body.recipient_first || !body.recipient_last) {
        reject("Bad body");
      }
      User.getUserNameAndEmailByOID(body.oid, (errGet: any, resGet: any) => {
        if (errGet) {
          reject(errGet);
        } else {
          const results = JSON.parse(JSON.stringify(resGet));
          if (results.length === 0) {
            const newUser = {
              employee_id: body.oid,
              first_name: body.recipient_first,
              last_name: body.recipient_last,
              phone: "",
              email: ""
            }
            User.insertUser(newUser, (errInsert: any, resInsert: any) => {
              if (errInsert) {
                reject(errGet);
              } else {
                Mail.createMail(body.officeID, body.officeLocation, body.oid,
                    body.type, body.approx_date, body.sender, body.dimensions, body.comments, body.adminID, (err: any, res: any) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(JSON.parse(JSON.stringify(res[0][0]))['LAST_INSERT_ID()']);
                      }
                    });
              }
            })
          } else {
            try {
              const oid = body.oid;
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

