import { Router, Request, Response } from 'express';
import passport from "passport";
import { BearerStrategy } from 'passport-azure-ad';
import * as config from "../config.json";
const router = Router();

const EXPOSED_SCOPES = [ "access_as_user" ];

const options = {
    identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.audience,
    validateIssuer: config.settings.validateIssuer,
    passReqToCallback: config.settings.passReqToCallback,
    loggingLevel: config.settings.loggingLevel,
    scope: EXPOSED_SCOPES
};

// @ts-ignore
const bearerStrategy = new BearerStrategy(options, (token, done) => {
    // @ts-ignore
    return done(null, {}, token);
    }
);

router.use(passport.initialize());

passport.use(bearerStrategy);

// enable CORS (for testing only -remove in production/deployment)
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(passport.authenticate("oauth-bearer", { session: false }), (req, res, next) => {
    console.log("Authenticated");
    next();
});

export default router