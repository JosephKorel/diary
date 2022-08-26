import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';


export default async function deleteNote (req:NextApiRequest, res:NextApiResponse) {
    const method = req.method
    const {edit} = req.body as {edit:string}
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
            
            const updateNote = {$set:{
                note:edit
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