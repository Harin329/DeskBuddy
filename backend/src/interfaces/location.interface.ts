export interface IOffice {
    city: string,
    address: string,
    image: Buffer,
    floors: IFloor[]
}

export interface IFloor {
    floor_num: number,
    image: HTMLImageElement,
    desks: IDesk[]
}

export interface IDesk {
    ID: string,
    capacity: number
}