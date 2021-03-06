const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const joi = require("@hapi/joi");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");

module.exports.index = async function(req, res){
    const page = parseInt(req.query.page || 1);
    console.log(page)
    const limit = 5;

    const skip = (page -1) * limit;

    const totalDocument = await Product.find().countDocuments();

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
    console.log(rangerForDot)

    const products = await Product.find().populate("cat_id").sort("-_id").limit(limit).skip(skip);

    console.log(req.session.user);

    res.render("admin/pages/products/index", {products, range: rangerForDot, page, totalPages});
    
};

module.exports.add = async function(req, res){
    const categories = await Category.find();
    res.render("admin/pages/products/add", {categories});
}

module.exports.store = async function(req, res){
    const file = req.file;
    const pathUpload = path.resolve("src", "public", "images", "products");

    const contentFile = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);

    fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile);
    console.log(req.file);

    const bodySchema = joi.object({
        prd_name: joi.string().required().min(3).max(30),
        prd_price: joi.number().required(),
        prd_warranty: joi.string().required(),
    })
    .unknown();

    const value = await bodySchema.validateAsync(req.body).catch((err) => err);
    if(value instanceof Error){
        return res.redirect("/admin/products/add");
    }

    const product = new Product({
        prd_name: value.prd_name,
        cat_id: value.cat_id,
        prd_image: file.originalname,
        prd_price: value.prd_price,
        prd_warranty: value.prd_warranty,
        prd_accessories: value.prd_accessories,
        prd_new: value.prd_new,
        prd_promotion: value.prd_promotion,
        prd_status: value.prd_status,
        prd_featured: value.prd_featured,
        prd_detail: value.prd_detail,
    });

    await product.save();

    return res.redirect("/admin/products");
}

module.exports.destroy = async function(req, res){
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.redirect("/admin/products");
    }

    const product = await Product.findByIdAndDelete(id);

    if(product){
        const pathUpload = path.resolve("src", "public", "images", "products");
        if(fs.existsSync(path.join(pathUpload, product.prd_image))){
            fs.unlinkSync(path.join(pathUpload, product.prd_image));
        }
    }

    return res.redirect("/admin/products");
}

module.exports.edit = async function(req, res){
    const {id} = req.params;
    const categories = await Category.find();
    const product = await Product.findById(id);


    res.render("admin/pages/products/edit", {categories, product});
}

module.exports.update = async function(req, res){
    const {id} = req.params;
    const file = req.file;
    
    if(file){
    const pathUpload = path.resolve("src", "public", "images", "products");
    const contentFile = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);
    fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile);
    console.log(req.file);
    };

    const bodySchema = joi.object({
        prd_name: joi.string().required().min(3).max(30),
        prd_price: joi.number().required(),
        prd_warranty: joi.string().required(),
    })
    .unknown();

    const value = await bodySchema.validateAsync(req.body).catch((err) => err);
    console.log(req.path);
    if(value instanceof Error){
        return res.redirect(req.path);
    }
        const productUpdate = {
            prd_name: value.prd_name,
            cat_id: value.cat_id,
            prd_price: value.prd_price,
            prd_warranty: value.prd_warranty,
            prd_accessories: value.prd_accessories,
            prd_new: value.prd_new,
            prd_promotion: value.prd_promotion,
            prd_status: value.prd_status,
            prd_featured: value.prd_featured,
            prd_detail: value.prd_detail,
        };

        if(file){ // check anh hien co, khi khong thay doi ko bi xoa anh da add truoc do
            productUpdate["prd_image"] = file.originalname;
        }

        await Product.updateOne({ _id: id}, productUpdate);

        return res.redirect("/admin/products");
    }