import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';


export default async function deleteTask (req:NextApiRequest, res:NextApiResponse) {
    const taskId = req.body as {id:string}
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('tasks');
    const targetId = new ObjectId(taskId.id)
    const target = {_id:targetId}

    try {
    await myCollection.deleteOne(target)


   res.status(200).json('Success')
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}