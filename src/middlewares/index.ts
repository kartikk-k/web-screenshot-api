import express from 'express';
import { get, merge } from 'lodash';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // try {

    //     const sessionToken = req.cookies['sessionToken'];
    //     if (!sessionToken) return res.send({ message: 'session token not fonud' }).status(401).end();

    //     const existingUser = await getUserBySessionToken(sessionToken);
    //     if (!existingUser) return res.send({ message: 'Unauthorized' }).status(401).end();

    //     merge(req, { identity: existingUser });
    //     return next();

    // } catch (error) {
    //     return res.send({ error, message: 'Unauthorized' }).status(401).end();
    // }
}