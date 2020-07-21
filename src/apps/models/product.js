const mongoose = require("mongoose");
const { string } = require("@hapi/joi");

const ProductSchema = new mongoose.Schema({
    cat_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    prd_name: {
        type: String,
        text: true,
    },
    prd_image: String,
    prd_price: String,
    prd_warranty: String,
    prd_accessories: String,
    prd_new: String,
    prd_promotion: String,
    prd_status: Number,
    prd_featured: Number,
    prd_details: String

},
{
    timestamps: true, // hien thi thoi gian create va update
});

ProductSchema.virtual("categories",{
    ref: "Category",
    localField: "cat_id",
    foreignField: "_id",
})

mongoose.model("Product", ProductSchema, "products");