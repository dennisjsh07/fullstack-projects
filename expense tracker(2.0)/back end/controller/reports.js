const { Op } = require('sequelize');
const Expense = require('../model/expense');
const sequelize = require('../util/database');

exports.generateDailyReport = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { startDate, endDate } = req.query;
        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: { [Op.between]: [startDate, endDate] }
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate daily report' });
    }
}

exports.generateMonthlyReports = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { reportMonth } = req.query;
        const year = reportMonth.slice(0, 4);
        const month = reportMonth.slice(5, 7);

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.and]: [
                        { [Op.gte]: `${year}-${month}-01` },
                        { [Op.lte]: `${year}-${month}-31` }
                    ]
                }
            },
            transaction: t
        });

        await t.commit();
        res.status(200).json(expenses);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate monthly report' });
    }
}

exports.generateYearlyReports = async (req, res) => {    
    const t = await sequelize.transaction();
    try {
        const { reportYear } = req.query;

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.and]: [
                        { [Op.gte]: `${reportYear}-01-01` },
                        { [Op.lte]: `${reportYear}-12-31` }
                    ]
                }
            }
        });

        // Calculate total expenses for each month
        const monthlyExpenses = new Array(12).fill(0);
        expenses.forEach(expense => {
            const month = new Date(expense.createdAt).getMonth();
            monthlyExpenses[month] += expense.expenseAmt;
        });

        const reportData = monthlyExpenses.map((totalExpense, index) => {
            return {
                month: new Date(`${reportYear}-${index + 1}-01`).toLocaleString('default', { month: 'long' }),
                totalExpense
            };
        });

        await t.commit();
        res.status(200).json(reportData);
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ error: 'Failed to generate yearly report' });
    }
}
 
// exports.downloadExpenses = async (req, res) => {
//     try{
//         if(!req.user.ispremiumuser){
//             return res.status(401).json({ success: false, message: 'User is not a premium User'})
//         }
//         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
//         // Create the BlobServiceClient object which will be used to create a container client
//         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

//         // V.V.V.Imp - Guys Create a unique name for the container
//         // Name them your "mailidexpensetracker" as there are other people also using the same storage

//         const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name

//         console.log('\nCreating container...');
//         console.log('\t', containerName);

//         // Get a reference to a container
//         const containerClient = await blobServiceClient.getContainerClient(containerName);

//         //check whether the container already exists or not
//         if(!containerClient.exists()){
//             // Create the container if the container doesnt exist
//             const createContainerResponse = await containerClient.create({ access: 'container'});
//             console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
//         }
//         // Create a unique name for the blob
//         const blobName = 'expenses' + uuidv1() + '.txt';

//         // Get a block blob client
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         console.log('\nUploading to Azure storage as blob:\n\t', blobName);

//         // Upload data to the blob as a string
//         const data =  JSON.stringify(await req.user.getExpenses());

//         const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//         console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

//         //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
//         const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
//         res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.

//     } catch(err){
//         console.log('download expense is failing', err);
//         res.status(500).json({err: err});
//     }
// };

 