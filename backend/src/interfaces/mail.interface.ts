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
    adminID: string,
    oid: string
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
    forward_location: string,
    response: string
}

export interface IRequestTypesForward {
    mail_id: number,
    request_type: string,
    forward_location: string,
    response: string
}

export interface IRequestTypesForwardPair {
    request_type: string,
    forward_location: string,
    response: string
}

export interface IRequest {
    employee_phone: number,
    request_type: string,
    forward_location: string,
    additional_instructions: string,
    req_completion_date: string,
    response: string
}

export interface IRequestComplete {
    mailID: number,
    employee_phone: number,
    request_type: string,
    forward_location: string,
    additional_instructions: string,
    req_completion_date: string
}