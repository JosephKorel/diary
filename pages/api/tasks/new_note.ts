import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

interface Note {
        author: string;
        email:string;
        note: string;
        date: string;
}

export default async function AddTask (req:NextApiRequest, res:NextApiResponse) {
    const note:Note = req.body
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('notes');


    try {
       await myCollection.insertOne(note)
       res.status(200).json('Success')
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}