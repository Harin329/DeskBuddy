import { Announcement } from '../models/announcement';

export default class AnnouncementController {

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
    getBranchAnnouncements(office_location: string, office_id: number, start_index: number, ) {
        return new Promise((resolve, reject) => {
            Announcement.getBranchAnnouncements(office_location, office_id, start_index, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    }
    getTotalAnnouncements(){
        return new Promise((resolve, reject) => {
            Announcement.getTotalAnnouncements((err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }
}