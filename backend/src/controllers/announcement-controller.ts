import { Announcement } from '../models/announcement';

export default class AnnouncementController {

    // tslint:disable-next-line:no-empty
    constructor() {}

    getCompanyAnnouncements(start_index: number) {
        return new Promise((resolve, reject) => {
            Announcement.getCompanyAnnouncements((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

    }

    getAllBranchAnnouncements() {
        return new Promise((resolve, reject) => {
            Announcement.getAllBranchAnnouncements((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })

    }

    getBranchAnnouncements(office_location: string, office_id: number) {
        return new Promise((resolve, reject) => {
            Announcement.getBranchAnnouncements(office_location, office_id, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
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