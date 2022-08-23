import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { User } from '../../../models/interfaces';


export default async function getNotes (req:NextApiRequest, res:NextApiResponse) {
    const user = req.body as User
    const client = await clientPromise;
    const db = client.db("diary");

    const myCollection: Collection = db.collection('notes');
    const currentNotes = await myCollection.find({email:user.email}).toArray()
    try {
       res.status(200).json({notes:currentNotes})
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}