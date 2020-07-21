const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
    cat_name: String,
},{
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    }
});

CategoryModel.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "cat_id",
});

mongoose.model("Category", CategoryModel, "Category");