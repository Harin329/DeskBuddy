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

Announcement.getAnnouncements = (params: any, result: any) => {
    con.query("SELECT * FROM announcement limit ?, 20",  [
        Number(params.startIndex)
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
