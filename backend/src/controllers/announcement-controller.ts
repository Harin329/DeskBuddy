import { Announcement } from '../models/announcement';

export default class AnnouncementController {

    // tslint:disable-next-line:no-empty
    constructor() {}

    getCompanyAnnouncements(start_index: number) {
        return new Promise((resolve, reject) => {
            Announcement.getCompanyAnnouncements(start_index, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

    }

    getAllBranchAnnouncements(start_index: number) {
        return new Promise((resolve, reject) => {
            Announcement.getAllBranchAnnouncements(start_index, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

    }

    getBranchAnnouncements(office_location: string, office_id: number, start_index: number,) {
        return new Promise((resolve, reject) => {
            Announcement.getBranchAnnouncements(office_location, office_id, start_index, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }

    getTotalCompanyAnnouncements() {
        return new Promise((resolve, reject) => {
            Announcement.getTotalCompanyAnnouncements((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    getTotalBranchAnnouncements() {
        return new Promise((resolve, reject) => {
            Announcement.getTotalBranchAnnouncements((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    postCompanyAnnouncement(req: any) {
        return new Promise((resolve, reject) => {
            Announcement.postCompanyAnnouncement(req, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    postBranchAnnouncement(req: any) {
        return new Promise((resolve, reject) => {
            Announcement.postBranchAnnouncement(req, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }
}