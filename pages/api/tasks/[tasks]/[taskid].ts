import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';



export default async function updateTask (req:NextApiRequest, res:NextApiResponse) {
    const taskId = req.body as {id:string}
    const client = await clientPromise;
    const db = client.db("diary");
    const myCollection: Collection = db.collection('tasks');
    const method = req.method
    const targetId = new ObjectId(taskId.id)
    const target = {_id:targetId}


    switch (method) {
        case 'PATCH':
            const targetTask = await myCollection.findOne(target) 
            try {
        
                if(targetTask.done) {
                    const updateTask = {$set:{
                    done:false
                }}
                await myCollection.updateOne(target, updateTask)
            
                res.status(200).json('Success')
               }
            
               else{
                const updateTask = {$set:{
                    done:true
                }}
                await myCollection.updateOne(target, updateTask)
            
                res.status(200).json('Success')
               }
                   
                } catch (error) {
                    res.status(400).json({error})
                    console.log(error)
                }

            break;
        
        case 'DELETE':
            try {
                const {taskid} = req.query as {taskid:string}
                const deleteId = new ObjectId(taskid)
               await myCollection.deleteOne({_id:deleteId})
            
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