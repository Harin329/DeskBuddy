export interface IOffice {
    city: string,
    name: string,
    address: string,
    image: Buffer,
    floors: IFloor[]
}

export interface IFloor {
    floor_num: number,
    image: Buffer,
    desks: IDesk[]
}

export interface IDesk {
    ID: string,
    capacity: number
}