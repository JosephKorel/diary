import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';



export default async function getUserData (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const {user} = req.query as {user:string}
    const {value, date} = req.body as {value:number, date:string}
    const email = user
    const method = req.method

    const userCollection:Collection = db.collection('users')
    const noteCollection: Collection = db.collection('notes');
    const taskCollection:Collection = db.collection('tasks')
    const comCollection:Collection = db.collection('comments')


    switch (method) {
        case 'GET':
            const currentTasks = await taskCollection.find({email}).toArray()
            const currentNotes = await noteCollection.find({email}).toArray()
            const currentCom = await comCollection.find({email}).toArray()
            try {
                res.status(200).json({notes:currentNotes, tasks:currentTasks, comments:currentCom})
             } catch (error) {
                 res.status(400).json({error})
                 console.log(error)
             }
            break;

        case 'PATCH':
             const filter = {email}
             const onUpdate = {$set:{
                dayEvaluation:[{date, value}]
             }}
             try {
                await userCollection.updateOne(filter, onUpdate)
                res.status(200).json('Success')
             } catch (error) {
                res.status(400).json({error})
                 console.log(error)
             }
    
        default:
            break;
    }

    
    
    
    
}