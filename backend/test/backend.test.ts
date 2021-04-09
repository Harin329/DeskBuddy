import { DeskbuddyServer } from "../src/server";
import supertest from "supertest";
import fs from 'fs';
import { IOffice } from "../src/interfaces/location.interface";
import * as config from "../src/config.json";
import { IMail, IRequest, IRequestComplete } from "../src/interfaces/mail.interface";
import { parse } from "dotenv/types";

let server: DeskbuddyServer;
let request: any;

let adminToken:any = "";
let userToken:any = "";
let adminJSON = {"Authorization": `Bearer ${adminToken}`};
let userJSON = {"Authorization": `Bearer ${userToken}`};
const testUserOID = process.env.USER_OID;
const adminOID = process.env.ADMIN_OID;

const requestToken = async (username: any, password: any) => {
    const tokenRequest = require("request");
    return new Promise((resolve, reject) => {
        tokenRequest.post({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: `https://login.microsoftonline.com/${config.credentials.tenantID}/oauth2/v2.0/token/`,
            form : {
                "grant_type" : "password",
                "username" : username,
                "password" : password,
                "scope" : `api://${config.credentials.clientID}/.default`,
                "client_id" : config.credentials.appClientID,
                "client_secret" : process.env.CLIENT_SECRET
            }
        }, (err: any, res: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(res.body).access_token);
            }
        });
    });
}

beforeAll(async done => {
    userToken = await requestToken(process.env.USER_USERNAME, process.env.USER_PASSWORD);
    adminToken = await requestToken(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    userJSON = {"Authorization": `Bearer ${userToken}`};
    adminJSON = {"Authorization": `Bearer ${adminToken}`};

    server = new DeskbuddyServer(3000);
    server.start().then(() => {
        request = supertest(server.getApp());
        done();
    });
});

afterAll(done => {
    server.stop().then(() => {
        done();
    });
});

describe("Reservation endpoints tests", () => {
    it("GET /reservation/getAllReservations", async done => {
        const res = await request.get('/reservation/getAllReservations').set(adminJSON);
        expect(res.status).toBe(200);
        done();
    });

    it("POST /reservation with empty body", async done => {
        const body = {};
        const res1 = await request.post('/reservation/').send(body).set(userJSON);
        expect(res1.status).toBe(400);
        await reservationDeleter(res1);
        done();
    });

    it("POST /reservation normal", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body = loadJSON("test/jsonBody/reservationBody/postReservationNormal.json");
        body.office_id = officeID;
        body.employee_id = testUserOID;
        const res2 = await request.post('/reservation/').send(body).set(userJSON);
        expect(res2.status).toBe(200);
        await reservationDeleter(res2);
        await locationDeleter(res1);
        done();
    });

    it("POST /reservation duplicated", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body = loadJSON("test/jsonBody/reservationBody/postReservationNormal.json");
        body.office_id = officeID;
        body.employee_id = testUserOID;
        const res2 = await request.post('/reservation/').send(body).set(userJSON);
        expect(res2.status).toBe(200);
        body.employee_id = adminOID;
        const res3 = await request.post('/reservation/').send(body).set(adminJSON);
        expect(res3.status).toBe(404);
        await reservationDeleter(res2);
        await locationDeleter(res1);
        done();
    });

    it("GET /reservation/upcomingByUID/:userID with no reservations", async done => {
        const res = await request.get(`/reservation/upcomingByUID/${testUserOID}`).set(userJSON);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
        done();
    });

    it("GET /reservation/upcomingByUID/:userID with 2 reservations", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body1 = loadJSON("test/jsonBody/reservationBody/postReservationNormal.json");
        body1.office_id = officeID;
        body1.employee_id = testUserOID;
        const res2 = await request.post('/reservation/').send(body1).set(userJSON);
        expect(res2.status).toBe(200);
        const body2 = loadJSON("test/jsonBody/reservationBody/postReservationNormal2.json");
        body2.office_id = officeID;
        body2.employee_id = testUserOID;
        const res3 = await request.post('/reservation/').send(body2).set(userJSON);
        expect(res3.status).toBe(200);
        const res4 = await request.get(`/reservation/upcomingByUID/${testUserOID}`).set(userJSON);
        expect(res4.status).toBe(200);
        console.log(res4.body);
        expect(res4.body.length).toBe(2);
        await reservationDeleter(res2);
        await reservationDeleter(res3);
        await locationDeleter(res1);
        done();
    });

    it("GET /reservation/upcomingByUID/:userID for someone else's oid", async done => {
        const res = await request.get(`/reservation/upcomingByUID/${adminOID}`).set(userJSON);
        expect(res.status).toBe(401);
        done();
    });

    it("DEL /reservation/:reservationID for someone else's reservation", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body1 = loadJSON("test/jsonBody/reservationBody/postReservationNormal.json");
        body1.office_id = officeID;
        body1.employee_id = adminOID;
        const res2 = await request.post('/reservation/').send(body1).set(adminJSON);
        expect(res2.status).toBe(200);
        const body2 = {"reservation_id" :  res2.body.reservation_id};
        const res3 = await request.delete('/reservation/deleteReservation').send(body2).set(userJSON);
        expect(res3.status).toBe(404);
        await reservationDeleter(res2);
        await locationDeleter(res1);
        done();
    });

    it("DEL /reservation/:reservationID normal", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body1 = loadJSON("test/jsonBody/reservationBody/postReservationNormal.json");
        body1.office_id = officeID;
        body1.employee_id = testUserOID;
        const res2 = await request.post('/reservation/').send(body1).set(userJSON);
        expect(res2.status).toBe(200);
        const body2 = {"reservation_id" :  res2.body.reservation_id};
        const res3 = await request.delete('/reservation/deleteReservation').send(body2).set(userJSON);
        expect(res3.status).toBe(200);
        await locationDeleter(res1);
        done();
    });
});

const reservationDeleter = async (res: any) => {
    const id = res.body.reservation_id;
    const body = {"reservation_id" : id};
    await request.delete(`/reservation/deleteReservation`).send(body).set(adminJSON);
}

describe("Announcement endpoints tests", () => {
    it("POST /announcement/postCompanyAnnouncement normal", async done => {
        const body = loadJSON("test/jsonBody/announcementBody/postCompanyAnnouncementNormal.json");
        body.user = adminOID;
        const res = await request.post('/announcement/postCompanyAnnouncement').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        await announcementDeleter(res, true);
        done();
    });

    it("POST /announcement/postCompanyAnnouncement as a non-admin", async done => {
        const body = loadJSON("test/jsonBody/announcementBody/postCompanyAnnouncementNormal.json");
        body.user = testUserOID;
        const res = await request.post('/announcement/postCompanyAnnouncement').send(body).set(userJSON);
        expect(res.status).toBe(401);
        done();
    });

    it("POST /announcement/postBranchAnnouncement normal", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body = loadJSON("test/jsonBody/announcementBody/postBranchAnnouncementNormal.json");
        body.office_id = officeID;
        const res2 = await request.post('/announcement/postBranchAnnouncement').send(body).set(adminJSON);
        expect(res2.status).toBe(200);
        await announcementDeleter(res2, false);
        await locationDeleter(res1)
        done();
    });

    it("POST /announcement/postBranchAnnouncement as a non-admin", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const body = loadJSON("test/jsonBody/announcementBody/postBranchAnnouncementNormal.json");
        body.office_id = officeID;
        const res2 = await request.post('/announcement/postBranchAnnouncement').send(body).set(userJSON);
        expect(res2.status).toBe(401);
        await locationDeleter(res1)
        done();
    });

    it("GET /announcement/getCompanyAnnouncements", async done => {
        const body = loadJSON("test/jsonBody/announcementBody/postCompanyAnnouncementNormal.json");
        body.user = adminOID;
        const res1 = await request.post('/announcement/postCompanyAnnouncement').send(body).set(adminJSON);
        expect(res1.status).toBe(200);
        const res2 = await request.get('/announcement/getCompanyAnnouncements').set(userJSON);
        expect(res2.status).toBe(200);
        try {
            expect(res2.body.length).toBeGreaterThanOrEqual(1);
            await announcementDeleter(res1, true);
        } catch (err) {
            await announcementDeleter(res1, true);
        }
        done();
    });

    it("GET /announcement/getBranchAnnouncements with 0 announcements", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const officeLocation = JSON.parse(res1.text).code.split("-")[0];
        const res2 = await request.get(`/announcement/getBranchAnnouncements/${officeLocation}/${officeID}`).set(userJSON);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
        await locationDeleter(res1)
        done();
    });

    it("GET /announcement/getBranchAnnouncements with 1 announcement", async done => {
        const res1 = await locationCreator();
        const officeID = JSON.parse(res1.text).code.split("-")[1];
        const officeLocation = JSON.parse(res1.text).code.split("-")[0];
        const body = loadJSON("test/jsonBody/announcementBody/postBranchAnnouncementNormal.json");
        body.office_id = officeID;
        const res2 = await request.post('/announcement/postBranchAnnouncement').send(body).set(adminJSON);
        expect(res2.status).toBe(200);
        const res3 = await request.get(`/announcement/getBranchAnnouncements/${officeLocation}/${officeID}`).set(userJSON);
        expect(res3.status).toBe(200);
        expect(res3.body.length).toBe(1);
        await announcementDeleter(res2, false);
        await locationDeleter(res1)
        done();
    });

    it("GET /office/getAllOffices", async done => {
        const res1 = await locationCreator();
        const res2 = await request.get('/office/getAllOffices').set(userJSON);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBeGreaterThanOrEqual(1);
        const officeCodes = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res2.body.length; i++){
            officeCodes.push(res2.body[i].office_location + "-" + res2.body[i].office_id);
        }
        expect(officeCodes).toContain(JSON.parse(res1.text).code);
        await locationDeleter(res1)
        done();
    });
})

const announcementDeleter = async (res: any, isCompanyAnnouncement: boolean) => {
    const id = res.body.announcement_id;
    const body = {"announcement_id" : id};
    if (isCompanyAnnouncement){
        await request.delete(`/announcement/deleteCompanyAnnouncement`).send(body).set(adminJSON);
    } else {
        await request.delete(`/announcement/deleteBranchAnnouncement`).send(body).set(adminJSON);
    }
}

describe("Channel endpoints tests", () => {
    it("POST /channel/ normal", async done => {
        const body = { user : adminOID, channel_name : "jest channel" };
        const res = await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(200);
        await channelDeleter(res);
        done();
    });

    it("POST /channel/ as a non-admin user", async done => {
        const body = { user : testUserOID, channel_name : "jest channel" };
        const res = await request.post('/channel/').field("body", JSON.stringify(body)).set(userJSON);
        expect(res.status).toBe(401);
        await channelDeleter(res);
        done();
    });

    it("DELETE /channel/ normal", async done => {
        const body = { user : testUserOID, channel_name : "jest channel" };
        const res1 = await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res1.status).toBe(200);
        const res2 = await request.delete('/channel/').send(res1.body).set(adminJSON);
        expect(res2.status).toBe(200);
        done();
    });

    it("DELETE /channel/ as a non-admin user", async done => {
        const body = { user : testUserOID, channel_name : "jest channel" };
        const res1 = await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res1.status).toBe(200);
        const res2 = await request.delete('/channel/').send(res1.body).set(userJSON);
        expect(res2.status).toBe(401);
        await channelDeleter(res1);
        done();
    });

    it("GET /channel/ as an admin", async done => {
        const body = { user : testUserOID, channel_name : "jest channel" };
        const res1 = await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res1.status).toBe(200);
        const res2 = await request.get('/channel/').set(adminJSON);
        expect(res2.body.length).toBeGreaterThanOrEqual(2);
        const channelIDs = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res2.body.length; i++){
            channelIDs.push(res2.body[i].channel_id);
        }
        expect(channelIDs).toContain(0); // check for admin channel
        expect(channelIDs).toContain(res1.body.channel_id); // check for added channel
        await channelDeleter(res1);
        done();
    });

    it("GET /channel/ as a user", async done => {
        const body = { user : testUserOID, channel_name : "jest channel" };
        const res1 = await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res1.status).toBe(200);
        const res2 = await request.get('/channel/').set(userJSON);
        expect(res2.body.length).toBeGreaterThanOrEqual(2);
        const channelIDs = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res2.body.length; i++){
            channelIDs.push(res2.body[i].channel_id);
        }
        expect(channelIDs).not.toContain(0); // check for no admin channel
        expect(channelIDs).toContain(res1.body.channel_id); // check for added channel
        await channelDeleter(res1);
        done();
    });
})

const channelDeleter = async (res: any) => {
    const id = res.body.channel_id;
    const body = {"channel_id" : id};
    await request.delete(`/channel/`).send(body).set(adminJSON);
}

describe("Social feed endpoints tests", () => {
    it("POST /createPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /createPost to reports channel", async done => {
        const body = loadJSON("test/jsonBody/postBody/postPostAdminChannel.json");
        body.employee_id = testUserOID;
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /createPost with non-authenticated employee_id", async done => {
        const body = loadJSON("test/jsonBody/postBody/postPostWrongOID.json");
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(401);
        done();
    });

    it("POST /createPost normal", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("POST /flagPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/flagPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /flagPost normal", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const body3 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.post('/post/flagPost').send(body3).set(userJSON);
        expect(res3.status).toBe(200);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("POST /unreportPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/unreportPost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /unreportPost as non-admin", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const body3 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.post('/post/flagPost').send(body3).set(userJSON);
        expect(res3.status).toBe(200);
        const res4 = await request.post('/post/unreportPost').send(body3).set(userJSON);
        expect(res4.status).toBe(401);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("POST /unreportPost normal", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const body3 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.post('/post/flagPost').send(body3).set(userJSON);
        expect(res3.status).toBe(200);
        const res4 = await request.post('/post/unreportPost').send(body3).set(adminJSON);
        expect(res4.status).toBe(200);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("DELETE /deletePost with empty body", async done => {
        const body = {};
        const res = await request.delete('/post/deletePost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("DELETE /deletePost as user for same user's post", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const body3 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.delete('/post/deletePost').send(body3).set(userJSON);
        expect(res3.status).toBe(200);
        await channelDeleter(res1);
        done();
    });

    it("DELETE /deletePost as user for different user's post", async done => {
        const res1 = await channelCreator()
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body1.employee_id = adminOID;
        body1.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body1).set(adminJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.delete('/post/deletePost').send(body2).set(userJSON);
        expect(res3.status).toBe(404);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("DELETE /deletePost as admin for different user's post", async done => {
        const res1 = await channelCreator()
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body1.employee_id = testUserOID;
        body1.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res2.status).toBe(200);
        const body2 = {
            post_id: res2.body.post_id
        };
        const res3 = await request.delete('/post/deletePost').send(body2).set(adminJSON);
        expect(res3.status).toBe(200);
        await channelDeleter(res1);
        done();
    });

    it("GET /post/getFeedByCategory with 1 post", async done => {
        const res1 = await channelCreator()
        const body2 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        body2.employee_id = testUserOID;
        body2.channel_id = res1.body.channel_id;
        const res2 = await request.post('/post/createPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const res3 = await request.get(`/post/getFeedByCategory/${res1.body.channel_id}`).set(userJSON);
        expect(res3.status).toBe(200);
        expect(res3.body.length).toBe(1);
        await postDeleter(res2);
        await channelDeleter(res1);
        done();
    });

    it("GET /post/getFeedByCategory admin channel as a non-admin", async done => {
        const res = await request.get(`/post/getFeedByCategory/0`).set(userJSON);
        expect(res.status).toBe(401);
        await postDeleter(res);
        done();
    });
});

const channelCreator = async () => {
    const body = { "user" : testUserOID, "channel_name" : "jest channel" };
    return await request.post('/channel/').field("body", JSON.stringify(body)).set(adminJSON);
}

const postDeleter = async (res: any) => {
    const id = res.body.post_id;
    const body = {"post_id" : id};
    await request.delete(`/post/deletePost`).send(body).set(adminJSON);
}

describe.only("Mail manager endpoints tests", () => {
    // these tests assume the existence of a test user 'Test User', who has no mails to begin with

    it("POST /mail", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}`).set(userJSON);
        try {
            expect(getRes.status).toBe(200);
            const result = JSON.parse(getRes.text);
            expect(result.mails.length).toBe(1);
            await mailDeleter(res);
        } catch (err) {
            await mailDeleter(res);
            throw new Error("test failed: " + err);
        }
        done();
    });

    it("POST /mail with null office", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNullOffice.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /mail with null recipient", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNullRecipient.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /mail with null valid fields", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailValidNulls.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        await mailDeleter(res);
        done();
    });

    it("POST /request", async done => {
        const postBody: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const requestBody: IRequestComplete = loadJSON("test/jsonBody/mailRequestBody/postMailRequestNormal.json");
        const res = await request.post('/mail').send(postBody).set(adminJSON);
        try {
            expect(res.status).toBe(200);
            const resID = getID(res);
            requestBody.mailID = resID;
            const reqRes = await request.post('/request').send(requestBody).set(userJSON);
            expect(reqRes.status).toBe(200);
            await mailDeleter(res);
        } catch (err) {
            await mailDeleter(res);
            throw new Error("test failed: " + err);
        }
        done();
    });

    it("GET /mail/:employeeID", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // User currently has mail stored
        const getRes = await request.get(`/mail/${testUserOID}`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(body);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID where no mail has been added", async done => {
        const getRes = await request.get(`/mail/${testUserOID}`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(0);
        } catch(err) {
            throw new Error("Test failed: " + err);
        }
        done();
    });

    it("GET /mail/:employeeID where two mails have been added", async done => {
        const body1: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const body2: IMail = loadJSON("test/jsonBody/mailBody/postMailValidNulls.json");
        const res1 = await request.post(`/mail`).send(body1).set(adminJSON);
        const res2 = await request.post(`/mail`).send(body2).set(adminJSON);
        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(2);
            await mailDeleter(res1);
            await mailDeleter(res2);
        } catch(err) {
            await mailDeleter(res1);
            await mailDeleter(res2);
            throw new Error("Test failed: " + err);
        }
        done();
    });

    it("GET new /mail/:employeeID where there is one", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // User currently has mail stored
        const getRes = await request.get(`/mail/${testUserOID}?filter=new`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(body);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID filtered on awaiting admin action only", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}?filter=awaiting_admin_action`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(0);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID from the NV buildings, where there is one", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}?locname=NV`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(body);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID from the NV buildings, where there is none", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}?locname=KEK`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(0);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID from NV01, where there is one", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}?locname=NV&locid=1`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(body);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail/:employeeID from NV01, where there is none", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        const getRes = await request.get(`/mail/${testUserOID}?locname=KEK&locid=1`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(0);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // at least one mail
        const getRes = await request.get(`/mail`).set(adminJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBeGreaterThanOrEqual(1);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail while filtering for location NV01", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // at least one mail
        const getRes = await request.get(`/mail?locname=NV&locid=1`).set(adminJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBeGreaterThanOrEqual(1);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail while filtering for location IMPOSSIBLE99", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // at least one mail
        const getRes = await request.get(`/mail?locname=IMPOSSIBLE&locid=99`).set(adminJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(0);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail while filtering for new mail", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // at least one mail
        const getRes = await request.get(`/mail?filter=new`).set(adminJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBeGreaterThanOrEqual(1);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail while sorting for modified date descending", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // at least one mail
        const getRes = await request.get(`/mail?sort=-modified_at`).set(adminJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBeGreaterThanOrEqual(1);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });
});

const mailDeleter = async (res: any) => {
    const id = JSON.parse(res.text).id;
    await request.delete(`/mail/${id}`).set(adminJSON);
}

const getID = (res: any) => {
    const parsedJSON = JSON.parse(res.text);
    return parsedJSON.id;
}

describe("Miscellaneous tests", () => {
    it("GET /", async done => {
        const res = await request.get('/').set(adminJSON);
        expect(res.status).toBe(200);
        done();
    });
});

describe("Location endpoint tests", () => {
    it("POST /location as a non-admin", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(userJSON);
        expect(res.status).toBe(401);
        done();
    });

    it("POST /location", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with null city", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingCity.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with missing address", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingAddress.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with duplicate floor numbers", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateFloors.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with duplicate desk IDs", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateDesks.json");
        const res = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    // Maximum amount of offices for a single location (i.e. NV) is 100
    it("POST /location twice", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const resFirst = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(resFirst.status).toBe(200);
        const resSecond = await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
        expect(resSecond.status).toBe(200);
        await locationDeleter(resFirst);
        await locationDeleter(resSecond);
        done();
    });
});

const locationCreator = async () => {
    const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
    return await request.post('/location').field("body", JSON.stringify(body)).set(adminJSON);
}

const locationDeleter = async (res: any) => {
    const result = JSON.parse(res.text).code;
    let cityCode;
    try {
        cityCode = result.split("-");
        await request.delete(`/location/${cityCode[0]}/${cityCode[1]}`).set(adminJSON);
    } catch (err) {
        throw new Error(err);
    }
}


const loadJSON = (path: string) => {
    const body: string = fs.readFileSync(path).toString();
    const jsonBody = JSON.parse(body);
    return jsonBody;
}