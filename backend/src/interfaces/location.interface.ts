export interface IOffice {
    city: string,
    name: string,
    address: string,
    image: string,
    floors: IFloor[]
}

export interface IFloor {
    floor_num: number,
    image: string,
    desks: IDesk[]
}

export interface IDesk {
    ID: string,
    capacity: number
}