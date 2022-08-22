import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handleNewUser(req:NextApiRequest, res:NextApiResponse){
    const client = await clientPromise;
    const db = client.db("diary");
    const coll: Collection = db.collection("users");

    const user = req.body
    
    try {
        await coll.insertOne(user)
        res.status(200).json({response:'Success'})
    } catch (error) {
        res.status(500).json({error:'Erro'})
    }
    
}