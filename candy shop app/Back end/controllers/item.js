const Item = require('../model/items');

exports.postaddItems = async (req,res,next)=>{ // grab items from front end and insert into table
    try{
        // console.log(req.body)
        if(!req.body.itemName){
            throw new Error('entering item name is mandatory');
        }
        const itemName = req.body.itemName;
        const description = req.body.description;
        const price = req.body.price;
        const qty = req.body.qty;
        const data = Item.create({
            itemName: itemName,
            description: description,
            price: price,
            qty: qty,
        });
        res.status(201).json({newItems: data});
    } catch(err){
        console.log('postaddItems is failing',err);
        res.status(500).json({err:err})
    }
};

exports.deleteItems = async (req,res,next)=>{
    try{
        const pId = req.params.id;
        if(pId === 'undefined'){
            return res.status(400).json({err: err})
        }
        // await Item.destroy({where: {id: pId}});
        // res.sendStatus(200);
        // check
        const deleteRows = await Item.destroy({where: {id: pId}});
        if(deleteRows>0){
            console.log(`${pId} successfully deleted`);
            res.sendStatus(200);
        }
        else{
            console.log(`${pId} not deleted`);
            res.status(404).json({err:err});
        }
    } catch(err){
        console.log('deleteItems is failing',err);
        res.status(500).json({err: err});
    }
};

exports.updateItems = async (req,res,next)=>{
    try{
        // check if the item is present by comparing with id...
        const pId = req.params.id;
        const qtyToBuy = req.body.qtyToBuy;
        const item = await Item.findByPk(pId);
        if(!item){
            return res.status(404).json({err: 'item not found'});
        }

        const newQty = item.qty - qtyToBuy;

        if(qtyToBuy > item.qty){
            throw new Error('there is no sufficient qty');
        }

        await item.update({qty: newQty});
        res.status(200).json({updateddata: item})
    } catch(err){
        console.log('updateItems is failing',err);
        res.status(500).json({err: err});
    }
};

exports.getItems = async (req,res,next)=>{
    try{
        const items = await Item.findAll();
        res.status(200).json({allItems:items})
    } catch(err){
        console.log('get items failing',err)
        res.status(500).json({err: err})
    }
};
 
