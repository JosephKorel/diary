import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';

interface Remind {
    author: string;
    email:string;
    title:string;
    content: string;
    addedOn: string;
    when:string;
    time:string;
}

export default async function RemindHandler (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const rmdCollection:Collection = db.collection('reminders')
    const method = req.method
    const {email} = req.query as {email:string}


    switch (method) {
        case 'GET':
            const currentReminders = await rmdCollection.find({email}).toArray()

            try {
            res.status(200).json({remind:currentReminders})
            } catch (error) {
                res.status(400).json({error})
                console.log(error)
            }
            break;
            
        case 'POST':
            const remind:Remind = req.body
    
            try {

                await rmdCollection.insertOne(remind)
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