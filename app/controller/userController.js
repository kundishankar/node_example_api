const UserModel = require('../models/Users');
const fs = require('fs');
const path = require('path');

class User {
    getAllUsers = async (req, res) => {
        try{
            var limit;
            var page;
            //console.log(req.params)
            req.params.limit===undefined ? limit=10: limit=req.params.limit;
            req.params.page===undefined ? page=0: page=(req.params.page-1)*req.params.limit;
            
            UserModel.find({}, (err, data) => {
                //console.log(data);
                res.status(201).send({users:data,skip:page,limit:limit});
            }).skip(page).limit(limit);
        }catch(e){
            console.error(e)
        }  
    }

    getUser = async (req, res) => {
        //res.send(req.params.id)
        UserModel.find({"_id": Object(req.params.id)}, (err, data) => {
            res.send(data);
        })
    }

    addUser = (req, res) => {
        console.log(req.file)
        //var target_path = './public/images/' + req.file?.originalname;
        //console.log(target_path)
        //var dest = fs.createWriteStream(target_path);
        var userData = new UserModel(req.body)
        userData.image = "http://"+process.env.HOSTNAME +":"+ process.env.PORT + "/" + req.file?.filename;
        console.log(userData);
        userData.save((err, result) => {
            if(err) throw err;
            res.send("Data inserted successfully - " + result.id)
        })
        
        //res.send(userData);//http://localhost:4500/images/2.jpg
    }

    updateUser = (req, res) => {
        //console.log(req.body)
        //console.log(req.file)
        //var userData = new UserModel(req.body);
        if(req.file?.filename){
            req.body.image = "http://"+process.env.HOSTNAME +":"+ process.env.PORT + "/" + req.file?.filename;
        }
        
        console.log(req.body)
        UserModel.updateOne({_id: Object(req.params.id)}, {$set: req.body}, (err, result) => {
            if(err) throw err
            res.send("Data Updated Successfully!!")
        })
    }

    deleteUser = (req, res) => {
        UserModel.deleteOne({_id:Object(req.params.id)}, (err, result) => {
            if(err) throw err
            res.send("User Deleted Successfully!!")
        })
    }
}

module.exports = new User();