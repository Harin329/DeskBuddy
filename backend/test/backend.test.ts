import { DeskbuddyServer } from "../src/server";
import supertest from "supertest";
import fs from 'fs';
import { IOffice } from "../src/interfaces/location.interface";
import { IMail } from "../src/interfaces/mail.interface";

let server: DeskbuddyServer;
let request: any;

const adminToken = ""; // token for Global Admin administrator
const userToken = ""; // token for Dana White user
const adminJSON = {"Authorization": `Bearer ${adminToken}`};
const userJSON = {"Authorization": `Bearer ${userToken}`};
const testUserOID = `faa7c922-18f4-469a-9d0e-8999d0a783a4`;

beforeAll(done => {
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

    it("POST /reservation", async done => {
        // todo
        done();
    });

    it("POST /reservation with malformed packet", async done => {
        // todo
        done();
    });

    it("POST /reservation duplicated", async done => {
        // todo
        done();
    });

    it("GET /reservation/upcoming", async done => {
        // todo
        done();
    });

    it("POST /reservation/upcoming/:date", async done => {
        // todo
        done();
    });

    it("GET /reservation/count/:officeID/:start/:end", async done => {
        // todo
        done();
    });

    it("DEL /reservation/:reservationID", async done => {
        // todo
        done();
    });
});

describe("Social feed endpoints tests", () => {
    it("POST /createPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /createPost with null channel_id", async done => {
        const body = loadJSON("test/jsonBody/postBody/postPostNullChannel.json");
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /createPost with null employee_id", async done => {
        const body = loadJSON("test/jsonBody/postBody/postPostNullEmployee.json");
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /createPost to reports channel", async done => {
        const body = loadJSON("test/jsonBody/postBody/postPostAdminChannel.json");
        const res = await request.post('/post/createPost').send(body).set(adminJSON);
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
        const body = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res = await request.post('/post/createPost').send(body).set(userJSON);
        expect(res.status).toBe(200);
        await postDeleter(res);
        done();
    });

    it("POST /flagPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/flagPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /flagPost with null post_id", async done => {
        const body = {
            post_id: null
        };
        const res = await request.post('/post/flagPost').send(body).set(userJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /flagPost normal", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res1 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.post('/post/flagPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        await postDeleter(res1);
        done();
    });

    it("POST /unreportPost with empty body", async done => {
        const body = {};
        const res = await request.post('/post/unreportPost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /unreportPost with null post_id", async done => {
        const body = {
            post_id: null
        };
        const res = await request.post('/post/unreportPost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("POST /unreportPost as non-admin", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res1 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.post('/post/flagPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const res3 = await request.post('/post/unreportPost').send(body2).set(userJSON);
        expect(res3.status).toBe(401);
        await postDeleter(res1);
        done();
    });

    it("POST /unreportPost normal", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res1 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.post('/post/flagPost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        const res3 = await request.post('/post/unreportPost').send(body2).set(adminJSON);
        expect(res3.status).toBe(200);
        await postDeleter(res1);
        done();
    });

    it("DELETE /deletePost with empty body", async done => {
        const body = {};
        const res = await request.delete('/post/deletePost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("DELETE /deletePost with null post_id", async done => {
        const body = {
            post_id: null
        };
        const res = await request.delete('/post/deletePost').send(body).set(adminJSON);
        expect(res.status).toBe(400);
        done();
    });

    it("DELETE /deletePost as user for same user's post", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res1 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.delete('/post/deletePost').send(body2).set(userJSON);
        expect(res2.status).toBe(200);
        done();
    });

    it("DELETE /deletePost as user for different user's post", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormalAdmin.json");
        const res1 = await request.post('/post/createPost').send(body1).set(adminJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.delete('/post/deletePost').send(body2).set(userJSON);
        expect(res2.status).toBe(404);
        await postDeleter(res1);
        done();
    });

    it("DELETE /deletePost as admin for different user's post", async done => {
        const body1 = loadJSON("test/jsonBody/postBody/postPostNormal.json");
        const res1 = await request.post('/post/createPost').send(body1).set(userJSON);
        expect(res1.status).toBe(200);
        const body2 = {
            post_id: res1.body.post_id
        };
        const res2 = await request.delete('/post/deletePost').send(body2).set(adminJSON);
        expect(res2.status).toBe(200);
        done();
    });


});

const postDeleter = async (res: any) => {
    const id = res.body.post_id;
    const body = {"post_id" : id};
    await request.delete(`/post/deletePost`).send(body).set(adminJSON);
}

describe("Mail manager endpoints tests", () => {
    // these tests assume the existence of a test user Dana White, who has no mails to begin with
    it("POST /mail", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        await mailDeleter(res);
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

    it("GET /mail", async done => {
        const body: IMail = loadJSON("test/jsonBody/mailBody/postMailNormal.json");
        const res = await request.post('/mail').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        // User currently has mail stored
        const getRes = await request.get(`/mail/${testUserOID}`).set(userJSON);
        try {
            const output = JSON.parse(getRes.text);
            const results: IMail[] = output.mails;
            expect(results.length).toBe(1);
            expect(results[0]).toStrictEqual(body);
            await mailDeleter(res);
        } catch(err) {
            await mailDeleter(res);
            throw new Error(err);
        }
        done();
    });

    it("GET /mail where no mail has been added", async done => {
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

    it("GET /mail where two mails have been added", async done => {
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
            throw new Error(JSON.stringify(getRes));
            throw new Error("Test failed: " + err);
        }
        done();
    });
});

const mailDeleter = async (res: any) => {
    const id = JSON.parse(res.text).id;
    await request.delete(`/mail/${id}`).set(adminJSON);
}

describe("Miscellaneous tests", () => {
    it("GET /", async done => {
        const res = await request.get('/').set(adminJSON);
        expect(res.status).toBe(200);
        done();
    });
});

describe("Location endpoint tests", () => {
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