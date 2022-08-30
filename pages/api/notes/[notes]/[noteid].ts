import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';
import { FileInt } from '../../../../models/interfaces';


export default async function updateNote (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method
    const {edit, title, media} = req.body as {edit:string, title:string, media:FileInt[]}
    const {noteid} = req.query as {noteid:string}
    const targetId = new ObjectId(noteid)
    const target = {_id:targetId}
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('notes');

    switch (method) {
        case 'DELETE':
            try {
                await myCollection.deleteOne(target)
                res.status(200).json('Success')
             } catch (error) {
                 res.status(400).json({error})
                 console.log(error)
             }
            break;
             
        case 'PATCH':
            console.log(media)
            const updateNote = {$set:{
                title,
                note:edit,
                media,
            }}

            try {
                await myCollection.updateOne(target, updateNote)
                res.status(200).json('Success')
            } catch (error) {
                res.status(400).json({error})
                 console.log(error)
            }

            break
        default:
            break;
    }

    
    
}