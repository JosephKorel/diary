import moment from 'moment';
import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';


export default async function AddTask (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const today = moment().format('DD/MM/YY')
    const myCollection: Collection = db.collection('notes');
    const currentNotes = await myCollection.find({date:today}).toArray()


    try {
       res.status(200).json({notes:currentNotes})
    } catch (error) {
        res.status(400).json({error})
        console.log(error)
    }
    
}