import DB from '../config/db-handler';

const con = DB.getCon();

export const Announcement = function (this: any, announcement: any) {
    this.announcement_id = announcement.annoucement_id;
    this.employee_id = announcement.employee_id;
    this.date = announcement.date;
    this.title = announcement.title;
    this.sub_title = announcement.sub_title;
    this.content = announcement.content;
};

Announcement.getCompanyAnnouncements = (start_index: number, result: any) => {
    con.query("SELECT * FROM announcement where announcement_id not in" +
        " (select announcement_id from branch_announcement) limit ?, 20",  [
        start_index
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
        console.log(res);
    })
};

Announcement.getAllBranchAnnouncements = (start_index: number, result: any) => {
    con.query("SELECT * FROM announcement inner join branch_announcement on announcement.announcement_id = " +
        "branch_announcement.announcement_id limit ?, 20",  [
        start_index
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
        console.log(res);
    })
};


Announcement.getBranchAnnouncements = (office_location: string, office_id: number, start_index: number, result: any) => {
    con.query("SELECT * FROM announcement inner join branch_announcement on announcement.announcement_id = " +
        "branch_announcement.announcement_id where branch_announcement.office_location = ? and branch_announcement.office_id = ? limit ?, 20",  [
        office_location, office_id, start_index
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
        console.log(res);
    })
};

Announcement.getTotalAnnouncements = (result: any) => {
    con.query("SELECT COUNT(announcement_id) FROM announcement", (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            console.log(res);
            result(null, res);
        }
        console.log(res);
    })
};
