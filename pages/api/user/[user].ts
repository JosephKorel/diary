import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';



export default async function getTasksAndNotes (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const {user} = req.query as {user:string}
    const email = user

    
    const noteCollection: Collection = db.collection('notes');
    const taskCollection:Collection = db.collection('tasks')
    const currentTasks = await taskCollection.find({email}).toArray()
    const currentNotes = await noteCollection.find({email}).toArray()
    try {
       res.status(200).json({notes:currentNotes, tasks:currentTasks})
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}