const Expense = require('../model/expense');
const User = require('../model/user');
const Download = require('../model/download');

const AWS = require('aws-sdk');
require('dotenv').config();

exports.addExpense = async (req,res,next)=>{
    try{
        // console.log(req.body);
        const {expenseAmt, expenseDescription, expenseCategory} = req.body;

        // enter all the fields...
        if(!expenseAmt || !expenseDescription || !expenseCategory){
            return res.status(400).json({err: 'enter all the fields'});
        }

        // insert into table...
        const newExpense = new Expense({
            expenseAmt: expenseAmt, 
            expenseDescription: expenseDescription, 
            expenseCategory: expenseCategory, 
            userId: req.user._id
        });

        const createdExpense = await newExpense.save();
        // console.log('createdExpense >>>>', createdExpense);

        // Update the user's totalExpenses
        req.user.totalExpenses += Number(expenseAmt);
        const updatedExpense = await req.user.save();
        // console.log('updatedExpense >>>>', updatedExpense);

        res.status(201).json({newExpenseDetails: createdExpense});

    } catch(err){
        console.log('add-expense is failing :', err)
        res.status(500).json({err: err})
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        // console.log(req.params);
        const Eid = req.params.id;
        if(Eid ==='undefined'){
            return res.status(400).json({error: 'id required to delete'});
        }

        // check the expense before deleting...
        const expense = await Expense.findOne({_id: Eid, userId: req.user._id});
        if(!expense){
            res.status(404).josn({err: 'expense not found'});
        }

        const response = await Expense.deleteOne({_id: Eid, userId: req.user._id});

       // Update the user's totalExpenses
        req.user.totalExpenses -= Number(expense.expenseAmt);
        await req.user.save();

        res.status(200).json({deletedExpense: response});
    } catch(err){
        console.log('delete expense is failing:',err);
        res.status(500).json({err: 'delete expense failed'});
    }
}

exports.getExpense = async(req,res,next)=>{
    try{
        const page = req.query.page || 1;
        const perPage = 5; // Number of expenses per page
        const offset = (page - 1) * perPage;

        const response = await Expense.find({userId: req.user._id}).skip(offset).limit(perPage);
        // console.log('all expenses >>>>',response);
        const totalExpenses = await Expense.count({ userId: req.user._id });
        const totalPages = Math.ceil(totalExpenses / perPage);

        res.status(200).json({allExpenses: response, totalPages: totalPages});
    } catch(err){
        console.log('get expense is failing :',err);
        res.status(500).json({err: 'failed to get all expenses'})
    }
}


function uploadToS3(data, filename){
    // configure the IAM user credentials and the bucket...
    const BUCKET_NAME = 'expensetrackerfordj';
    const IAM_USER_KEY = process.env.ACCESS_KEY;
    const IAM_USER_SECRET = process.env.SECRET_KEY;

    // get the permission...
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    // upload to bucket...
    var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response)=>{
        if(err){
            console.log('s3bucket err>>>>', err);
            reject(err);
        } else{
            console.log('success', s3response);
            resolve(s3response.Location);
        }
        })
    })
}

exports.downloadReport = async(req,res,next)=>{
    try{
        const Expenses = await Expense.find({userId: req.user._id});
        // console.log('expenses>>>>>',expenses);
        const stringifiedExpenses = JSON.stringify(Expenses);

        // the filename should depend upon user...
        const userId = req.user._id;
        const filename = `Expense.txt${userId}/${new Date()}` // create a .txt file...
        const fileUrl = await uploadToS3(stringifiedExpenses, filename); // uploading the file to s3...
        console.log('fileUrl>>>>:', fileUrl);

        
        let newfiledowmload = new Download({
            fileurl: fileUrl,
            userId: req.user._id
        })
        await newfiledowmload.save()

        res.status(200).json({ fileUrl, success: true })
    } catch(err){
        console.log('download monthly expense is failing :', err);
        res.status(500).json({success: false, err: err})
    }
}

exports.getAllDownloadedFileUrls = async (req, res, next) => {
    try {
        let id = req.user._id;
        console.log(id)
        let downloadedData = await Download.find({ userId: id } )
        res.status(200).json({ allData: downloadedData })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: 'false' })
    }
}