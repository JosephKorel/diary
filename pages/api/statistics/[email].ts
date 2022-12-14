import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function getUserStatistics (req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("diary");
    const {email} = req.query as {email:string}
    const method = req.method
    
    const userCollection:Collection = db.collection('users')
    const noteCollection: Collection = db.collection('notes');
    const taskCollection:Collection = db.collection('tasks')
    const comCollection:Collection = db.collection('comments')
    const rmdCollection:Collection = db.collection('reminders')


    switch (method) {
        case 'GET':
            const currentTasks = await taskCollection.find({email}).toArray()
            const currentNotes = await noteCollection.find({email}).toArray()
            const currentCom = await comCollection.find({email}).toArray()
            const currentRmd = await rmdCollection.find({email}).toArray()
            const currentUser = await userCollection.findOne({email})
            try {
                res.status(200).json({currUser:currentUser, notes:currentNotes, tasks:currentTasks, comments:currentCom, reminders:currentRmd})
             } catch (error) {
                 res.status(400).json({error})
                 console.log(error)
             }
            break;

        case 'POST':
            const {value, date} = req.body as {value:number, date:string}
            const filter = {email}
             const onUpdate = {$push:{
                dayEvaluation:{date, value}
             }}
             try {
                await userCollection.updateOne(filter, onUpdate)
                res.status(200).json('Success')
             } catch (error) {
                res.status(400).json({error})
                 console.log(error)
             }

            break

        case 'PATCH':
            const {newVal} = req.body as {newVal: {value:number, date:string}[]}
            const target = {email}
         
             const onEdit = {$set:{
                dayEvaluation:newVal
             }}
             try {
                await userCollection.updateOne(target, onEdit)
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