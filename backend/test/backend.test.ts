import { DeskbuddyServer } from "../src/server";
import supertest, {agent} from "supertest";
import fs from 'fs';
import { IOffice } from "../src/interfaces/location.interface";

let server: DeskbuddyServer;
let request: any;
//                 vvvvvvvvvvv  replace with fresh token
const adminToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJkMTExY2RhYi02NjM3LTQ2YmItODZiMS0zNjg1ZGI5ZDc0NGUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNjVmNDBjNGEtYWEzMS00YzdjLThlNTMtNWMwY2E4MzJjN2VkL3YyLjAiLCJpYXQiOjE2MTU5NTU2NzYsIm5iZiI6MTYxNTk1NTY3NiwiZXhwIjoxNjE1OTU5NTc2LCJhaW8iOiJBVFFBeS84VEFBQUFmdW9VMDdpaUFIMXhjczF6bkpjNXNFZnRFWG1CSklaQlk5Qmk0N1RCdkd5SlJBUXFaVklVdUtvNlNDUW9uc2Y1IiwiYXpwIjoiNDJhNzI1NzktYTE2My00ZThiLWI0MjctYWE3ZWIxOTdlYjg3IiwiYXpwYWNyIjoiMCIsImdyb3VwcyI6WyJlMzBjYzhjZC0zZjg5LTRhNzgtODBmYy02NzhhMWUwNGE3OTEiLCIyNjI2MTgyNS05MDZjLTQ5OGQtOTcwNi0xMzgxMWI2NTYzNzQiXSwibmFtZSI6Ikdsb2JhbCBBZG1pbiIsIm9pZCI6Ijk5YjlhOWNmLTFjYjAtNDBjMy04N2MwLWFhOThkNmNlNjhkMSIsInByZWZlcnJlZF91c2VybmFtZSI6Imdsb2JhbGFkbWluQGRlc2tidWRkeS5vbm1pY3Jvc29mdC5jb20iLCJyaCI6IjAuQUFBQVNnejBaVEdxZkV5T1Uxd01xRExIN1hrbHAwSmpvWXRPdENlcWZyR1g2NGQ4QUdnLiIsInNjcCI6ImFjY2Vzc19hc191c2VyIiwic3ViIjoiNmxMMW51aVBsdlJLUy1kR2tCRDhVVE5QeG45ZXBEZHpHQXl5TkdORm5GTSIsInRpZCI6IjY1ZjQwYzRhLWFhMzEtNGM3Yy04ZTUzLTVjMGNhODMyYzdlZCIsInV0aSI6IklnWHV5c0ltMDBpRVR5NU5mdUVCQUEiLCJ2ZXIiOiIyLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.n0ng5GGKMI3WpeaQ8HCgBXEFu48f0AuqBDAAZFUaiPxZP5QaJRziqOBt3CCoxKvrpvmdyUwMq2yB3pZpV-hXWd-aJhQNRXz9r7JyIGBQcctGq-zxXtCvsJLZR6rBSdLJNFQlObo1AO3lSNZ7K-TrCk2zGRz5zu4f25AVLbPZKOWWbm0qbeYWESANG48cqORlO3aG9JhAGY5arzOhVTrziULR3qlZLt3YVegzvhZpg9cGVtgLFapOPbpAqiWGJJlW0f6NdxlxQ-bqBSqxkT_PZ8sghrLQrdHKB2mbxKcaOiqlmLnAd4kNHL4U2twWdmVvvLm4U7wFNJQ8b4WSG9S1WA";
const userToken = "PLACEHOLDER"
const adminJSON = {"Authorization": `Bearer ${adminToken}`}
const userJSON = {"Authorization": `Bearer ${userToken}`}

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
    it("dummy", () => {
        // todo
    });
});

describe("Mail manager endpoints tests", () => {
    it("dummy", () => {
        // todo
    });
});

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
        const res = await request.post('/location').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with null city", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingCity.json");
        const res = await request.post('/location').send(body).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with missing address", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationMissingAddress.json");
        const res = await request.post('/location').send(body).set(adminJSON);
        expect(res.status).toBe(200);
        await locationDeleter(res);
        done();
    });

    it("POST /location with duplicate floor numbers", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateFloors.json");
        const res = await request.post('/location').send(body).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    it("POST /location with duplicate desk IDs", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationDuplicateDesks.json");
        const res = await request.post('/location').send(body).set(adminJSON);
        expect(res.status).toBe(404);
        done();
    });

    // Maximum amount of offices for a single location (i.e. NV) is 100
    it("POST /location twice", async done => {
        const body: IOffice = loadJSON("test/jsonBody/locationBody/postLocationNormal.json");
        const resFirst = await request.post('/location').send(body).set(adminJSON);
        expect(resFirst.status).toBe(200);
        const resSecond = await request.post('/location').send(body).set(adminJSON);
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