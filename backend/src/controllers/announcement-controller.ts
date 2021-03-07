import { Announcement } from '../models/announcement';

export default class AnnouncementController {

    getAnnouncements(req: any) {
        const startIndex = req;
        return new Promise((resolve, reject) => {
            Announcement.getAnnouncements(startIndex, (err: any, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
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