import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

interface Task {
        author: string;
        email:string;
        task: string;
        date: string;
}

export default async function AddTask (req:NextApiRequest, res:NextApiResponse) {
    const task:Task = req.body
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('tasks');


    try {
       await myCollection.insertOne(task)
       res.status(200).json('Success')
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}