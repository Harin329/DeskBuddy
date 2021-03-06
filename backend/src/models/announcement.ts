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

Announcement.getCompanyAnnouncements = (result: any) => {
    con.query("SELECT * FROM company_announcement ORDER BY date DESC limit 30", (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            // console.log(res);
            result(null, res);
        }
         // console.log(res);
    })
};

Announcement.getAllBranchAnnouncements = (result: any) => {
    con.query("SELECT * FROM branch_announcement ORDER BY date DESC limit 30",  [
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            // console.log(res);
            result(null, res);
        }
        // console.log(res);
    })
};


Announcement.getBranchAnnouncements = (office_location: string, office_id: number, result: any) => {
    con.query("SELECT * FROM branch_announcement where office_location = ? and office_id = ? ORDER BY date DESC limit 30",  [
        office_location, office_id
    ], (err: any, res: any) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
        } else {
            // console.log(res);
            result(null, res);
        }
        // console.log(res);
    })
};


Announcement.postCompanyAnnouncement = (req: any, result: any) => {
    con.query("INSERT INTO company_announcement (employee_id, date, title, sub_title, content)" +
        "VALUES (?, NOW(), ?, ?, ?)" , [
        req.body.user, req.body.title, req.body.subtitle, req.body.content
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    })
}

Announcement.postBranchAnnouncement = (req: any, result: any) => {
    con.query("INSERT INTO branch_announcement (office_id, office_location, employee_id, date, title, sub_title, content)" +
        " VALUES (?, ?, ?, NOW(), ?, ?, ?)" , [
        req.body.office_id, req.body.office_location, req.body.user,
        req.body.title, req.body.subtitle, req.body.content
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    })
}

Announcement.deleteCompanyAnnouncement = (req: any, result: any) => {
    con.query("DELETE FROM company_announcement WHERE announcement_id=?", [
        req.body.announcement_id
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

Announcement.deleteBranchAnnouncement = (req: any, result: any) => {
    con.query("DELETE FROM branch_announcement WHERE announcement_id=?", [
        req.body.announcement_id
    ], (err: any, res: any) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

