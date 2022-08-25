import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';


interface Comment {
    author: string;
    email:string;
    comment: string;
    mood:number;
    time:string;
    date: string;
}

export default async function TaskHandler (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const comCollection:Collection = db.collection('comments')
    const method = req.method
    const {comment} = req.query as {comment:string}

    //Email do usuário
    const email = comment
    const newComment:Comment = req.body

    switch (method) {
        case 'GET':
            const currentComments = await comCollection.find({email}).toArray()
            try {
            res.status(200).json({comments:currentComments})
            } catch (error) {
                res.status(400).json({error})
                console.log(error)
            }
            break;
            
        case 'POST':
            
            try {
                await comCollection.insertOne(newComment)
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