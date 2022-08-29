import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';


export default async function updateRemind (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method
    const {remindid} = req.query as {remindid:string}
    const targetId = new ObjectId(remindid)
    const target = {_id:targetId}
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('reminders');

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
             
        default:
            break;
    }

    
    
}