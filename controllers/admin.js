const sql = require("../util/database");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    await sql`INSERT INTO products (title, price, imageurl, description) VALUES (${title},${price},${imageUrl},${description})`;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM products ORDER BY id ASC`;
    res.render("admin/products", {
      pageTitle: "Admin-Products",
      prods: result,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (editMode === "false") {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    const product = await sql`SELECT * FROM products WHERE id = ${prodId}`;
    if (!product[0]) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode === "true",
      product: product[0],
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    await sql`UPDATE products SET title = ${updatedTitle} , price = ${updatedPrice} , imageurl = ${updatedImageUrl} , description = ${updatedDesc} WHERE id = ${prodId}`;
    const cartProduct =
      await sql`SELECT id FROM cart WHERE products_id = ${prodId}`;
    if (cartProduct.length > 0) {
      await sql`UPDATE cart SET product_title = ${updatedTitle} , product_price = ${updatedPrice}  WHERE products_id = ${prodId}`;
    }
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;

    const cartProduct =
      await sql`SELECT id FROM cart WHERE products_id = ${prodId}`;
    if (cartProduct.length > 0) {
      await sql`DELETE FROM cart WHERE products_id = ${prodId}`;
    }
    await sql`DELETE FROM products WHERE id = ${prodId}`;
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
