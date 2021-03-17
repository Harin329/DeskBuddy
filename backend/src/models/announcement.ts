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
    con.query("SELECT * FROM company_announcement limit ?, 20",  [
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
    con.query("SELECT * FROM branch_announcement limit ?, 20",  [
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
    con.query("SELECT * FROM branch_announcement where office_location = ? and office_id = ? limit ?, 20",  [
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

Announcement.getTotalCompanyAnnouncements = (result: any) => {
    con.query("SELECT COUNT(announcement_id) FROM company_announcement", (err: any, res: any) => {
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

Announcement.getTotalBranchAnnouncements = (result: any) => {
    con.query("SELECT COUNT(announcement_id) FROM branch_announcement", (err: any, res: any) => {
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

Announcement.postCompanyAnnouncement = (req: any, result: any) => {
    con.query("INSERT INTO company_announcement (employee_id, date, title, sub_title, content)" +
        "VALUES (?, CURDATE(), ?, ?, ?)" , [
        req.body.user, req.body.title, req.body.subtitle, req.body.content
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log(res);
        }
        console.log(res);
    })
}

Announcement.postBranchAnnouncement = (req: any, result: any) => {
    con.query("INSERT INTO branch_announcement (?, ?, employee_id, date, title, sub_title, content)" +
        "VALUES (?, CURDATE(), ?, ?, ?)" , [
        req.body.user, req.body.office_id, req.body.office_location,
        req.body.title, req.body.subtitle, req.body.content
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log(res);
        }
        console.log(res);
    })
}
