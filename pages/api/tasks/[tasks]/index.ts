import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';


interface Task {
    author: string;
    email:string;
    task: string;
    done:boolean;
    date: string;
}

export default async function TaskHandler (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const taskCollection:Collection = db.collection('tasks')
    const method = req.method
    const {tasks} = req.query as {tasks:string}

    //Email do usuário
    const email = tasks
    const task:Task = req.body

    switch (method) {
        case 'GET':
            const currentTasks = await taskCollection.find({email}).toArray()
            try {
            res.status(200).json({tasks:currentTasks})
            } catch (error) {
                res.status(400).json({error})
                console.log(error)
            }
            break;
            
        case 'POST':
            
            try {
                await taskCollection.insertOne(task)
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