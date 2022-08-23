import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function deleteNote (req:NextApiRequest, res:NextApiResponse) {
    const noteId = req.body as {id:string}
    const targetId = new ObjectId(noteId.id)
    const target = {_id:targetId}
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('notes');


    try {
       await myCollection.deleteOne(target)
       res.status(200).json('Success')
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}