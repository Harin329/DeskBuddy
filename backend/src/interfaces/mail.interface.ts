export interface IMail {
    officeID: number,
    officeLocation: string,
    recipient_first: string,
    recipient_last: string,
    recipient_email: string,
    type: string,
    approx_date: string,
    sender: string,
    dimensions: string,
    comments: string,
    adminID: string
}

export interface IMailResponse {
    mailID: number,
    officeID: number,
    officeLocation: string,
    recipient_first: string,
    recipient_last: string,
    recipient_email: string,
    type: string,
    approx_date: string,
    sender: string,
    dimensions: string,
    comments: string,
    adminID: string
}