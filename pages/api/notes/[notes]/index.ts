import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';

interface Note {
    author: string;
    email:string;
    note: string;
    media:{
        name: string;
        url: string;
    }[];
    date: string;
}



export default async function NoteHandler (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const noteCollection:Collection = db.collection('notes')
    const method = req.method
    const {notes} = req.query as {notes:string}

    //Email do usuário
    const email = notes

    switch (method) {
        case 'GET':
            const currentNotes = await noteCollection.find({email}).toArray()

            try {
            res.status(200).json({notes:currentNotes})
            } catch (error) {
                res.status(400).json({error})
                console.log(error)
            }
            break;
            
        case 'POST':
            const body = req.body

            try {

                await noteCollection.insertOne(body)
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