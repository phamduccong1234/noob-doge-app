const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");
const User = mongoose.model("User");

module.exports.dashboard = async function (req, res) {
  // fs.unlinkSync(path.join(__dirname, "../../..", "storage", "test.txt"));
  // const data = fs.readFileSync(path.join(__dirname, "../../..", "storage", "test.txt"));
  // console.log("data", data.toString());

  // fs.writeFileSync(path.join(__dirname, "../../..", "storage", "test.txt"), "Test", );

  // const categories = await Product.find().populate("products");
  // console.log("categories", categories);
  res.render("admin/pages/dashboard", { data: {} });
};
  
//   Product.find((err, products) => {
//     Category.find((err, categories) => {
//     res.render("admin/pages/dashboard", { data: {products, categories}});
//   });
// });

// console.log("I");

// const products = await Product.find(); // await de dung bat dong bo du lieu (phai su dung async tren phan function)
// const categories = await Category.find();
// console.log(products);
// console.log(categories);

// console.log("J");

// const category_0 = await Category.find({_id: "5ec3d5307b473e9d5d349c44"});
// const category = await Category.findById("5ec3d5307b473e9d5d349c44");
// console.log("category_0", category_0);
// console.log("category", category);
// res.render("admin/pages/dashboard", { data: {}});

// const product = new Product({
//   cat_id: "5ec3d5307b473e9d5d349c44",
//   prd_name: "Note 10+",
//   prd_image: "note10+.png",
//   prd_price: "200000000",
//   prd_warranty: "12 Tháng",
// 	prd_accessories: "Sách, sạc, tai nghe",
// 	prd_new: "Mới 100%",
// 	prd_promotion: "Tấm dán màn hình 4D",
// 	prd_status: 1,
// 	prd_featured: 1,
// 	prd_details: " iPhone 11 chính hãng",
// });
// product.save();
// console.log("product", product);
// res.render("admin/pages/dashboard", { data: {}});
// };

// await Product.updateMany(
//   { _id: {$in: ["5ec685846f50be33b09c65e3"]}},
//   {prd_price: 3818});
// await Product.deleteMany(
//   { _id: {$in: ["5ec685846f50be33b09c65e3"]}},
// )
//   res.render("admin/pages/dashboard", { data: {}});
// };


module.exports.login = function(req, res){
  res.render("admin/pages/login", {error: "" });
}

module.exports.postLogin = async function(req, res){
  const email = req.body.mail;
  const pass = req.body.pass;

  const user = await User.findOne({ user_mail: email });
  
  let error;

  if(!user){
    error = "Tai khoan khong ton tai";
  }

  if(!error && user.user_pass !== pass){
    error = "Mat khau khong khop";
  }

  if(!error){
    req.session.user = user;
    return res.redirect("/admin/dashboard");
  }
  
  res.render("admin/pages/login", {
        error,
      });

  // if(user){
  //   if(user.user_pass === pass){
  //     return res.redirect("/admin/dashboard");
  //   }
  //   res.render("admin/pages/login", {
  //     error: "Nhap lai",
  //   });
  // }
  // if(!user){
  //   res.render("admin/pages/login", {
  //     error: "Wrong",
  //   });
  // }
};

module.exports.logout = function(req, res){
  req.session.destroy();
  res.redirect("/login");
}