const mongoose = require("mongoose");
const CommentModel = mongoose.model("Comment");
const ProductModel = mongoose.model("Product");
const ejs = require("ejs");
const path = require("path");
const Joi = require("@hapi/joi");
const _ = require("lodash");

exports.getCommentForProduct = async (req, res) => {
    const {id} = req.body;

    const page = parseInt(req.query.page || 1);
    console.log(page);
    const limit = 2;

    const skip = (page -1) * limit;

    const totalDocument = await CommentModel.find({prd_id: id}).countDocuments();

    const totalPages = Math.ceil(totalDocument / limit);
    const range = [];
    const rangerForDot = [];
    const detal = 2;

    const left = page - detal;
    const right = page + detal;

    for(let i = 1; i <= totalPages; i++){
        if( i === 1 || i === totalPages || (i >= left && i <= right)){
            range.push(i);
        }
    }

    let temp;
    range.map((i) => {
      if (temp) {
        if(i - temp === 2){
            rangerForDot.push(i - 1);
    }else if (i - temp !== 1){
        rangerForDot.push("...");
    }
      }
    temp =  i;
    rangerForDot.push(i);
    });

    const comments = await CommentModel.find({prd_id: id}).sort("._id").limit(limit).skip(skip);

    const viewPath = req.app.get("views");

    const html = await ejs.renderFile(path.join(viewPath, "site/components/comment-product.ejs"), {comments, total: totalDocument, range: rangerForDot, page, totalPages});

    res.json({
        status: "success",
        data: {
            html: html,
        },
    })
};

exports.updateCart = async (req, res) => {

    const bodySchema = Joi.object({
        qty: Joi.number().required(),
        id: Joi.string().required(),
    });

    const value = await bodySchema.validateAsync(req.body);

    const cart = _.cloneDeep(req.session.cart || []);

    const {id, qty} = value;

    const newCart = cart.map((item) => { 
       if (item.id === id && qty >= 1) {
        item.qty = qty;
       }
       return item;
    });

    req.session.cart = newCart;

    const ids = newCart.map((prd) => prd.id);

    const products = await ProductModel. find({ _id: {$in: ids}});
    
    const html = await renderHtml(req, "site/components/list-cart.ejs", {products, miniCart: newCart});

    const totalCart = newCart.reduce((a, c) => a + c.qty, 0);

    return res.json({
        status: "success",
        data: {
            html: html,
            totalCart,
        },
    })
};

exports.deleteCart = async (req, res) => {
    
    const bodySchema = Joi.object({
        id: Joi.string().required(),
    });

    const value = await bodySchema.validateAsync(req.body);

    const cart = _.cloneDeep(req.session.cart || []);

    const {id} = value;

    const newCart = cart.filter((item) => item.id !== id);

    req.session.cart = newCart;

    const ids = newCart.map((prd) => prd.id);

    const products = await ProductModel. find({ _id: {$in: ids}});
    
    const html = await renderHtml(req, "site/components/list-cart.ejs", {products: products, miniCart: newCart});

    const totalCart = newCart.reduce((a, c) => a + c.qty, 0);

    return res.json({
        status: "success",
        data: {
            html: html,
            totalCart,
        },
    })
}

async function renderHtml(req, view, data){
    const viewPath = req.app.get("views");

    const html = await ejs.renderFile(path.join(viewPath, view), data);
    return html;
}