import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function getTasksAndNotes (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const {task_handler} = req.query as {task_handler:string}
    const action = {task_handler}

    const noteCollection: Collection = db.collection('notes');
    const taskCollection:Collection = db.collection('tasks')

    try {
       
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}