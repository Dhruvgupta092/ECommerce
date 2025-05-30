const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const User = require('../model/user');

router.get('/users/cart/add/:productId',async (req,res)=>{
    const {productId} = req.params;
    const product = await Product.findById(productId);

    const userId = req.user._id;

    const user = await User.findById(userId);
    let index =-1;
    let x = user.cart.find((item,ind)=>{
        if(item.productId==productId){
            index=ind;
            return item
        }
    })
    if(x){
        user.cart[index].qantity +=1
    }
    else{
        user.cart.push({productId})
    }
    await user.save();

    res.redirect('back');
})

router.get('/user/cart',async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findById(userId).populate('cart.productId');
    let totalPrice = 0;
    for(product of user.cart){
        totalPrice += product.qantity*product.productId.price
    }
    res.render('product/cart',{cart:user.cart,totalPrice})
})


router.get('/users/cart/remove/:productId',async(req,res)=>{
    const {productId} = req.params;
    const product = await Product.findById(productId);

    const userId = req.user._id;
    const user = await User.findById(userId);
    let index =-1;
    let x = user.cart.find((item,ind)=>{
        if(item.productId==productId){
            index=ind;
            return item
        }
    })

    let qantity = user.cart[index].qantity

    if(qantity>1){
        user.cart[index].qantity -=1;
    }
    else{
        user.cart.splice(index,1)
    }
    await user.save();
    res.redirect('back')
})
module.exports = router;