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
    adminID: string,
    request_type: string,
    forward_location: string
}

export interface IRequestTypesForward {
    mailID: number,
    request_type: string,
    forward_location: string
}

export interface IRequestTypesForwardPair {
    request_type: string,
    forward_location: string
}