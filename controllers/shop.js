const sql = require("../util/database");

async function updateCart(req) {
  const prodId = req.body.productId;
  const product = await sql`SELECT * FROM products WHERE id = ${prodId}`;
  const result = await sql`SELECT * FROM cart`;
  if (result.some((x) => x.products_id === Number(prodId))) {
    await sql`UPDATE cart SET quantity = quantity + 1 WHERE products_id = ${prodId}`;
  } else {
    await sql`INSERT INTO cart (products_id, product_price, quantity, product_title) VALUES (${prodId},${
      product[0].price
    },${1},${product[0].title})`;
  }
}

exports.getIndex = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM products ORDER BY id ASC`;
    res.render("shop/index", {
      pageTitle: "Shoopr-Home",
      prods: result,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM products ORDER BY id ASC`;
    res.render("shop/product-list", {
      pageTitle: "Shoopr-Home",
      prods: result,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await sql`SELECT * FROM products WHERE id = ${prodId}`;
    res.render("shop/product-detail", {
      pageTitle: product[0].title,
      product: product[0],
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM cart`;
    const totalPrice = result
      .reduce((x, y) => x + y.product_price * y.quantity, 0)
      .toFixed(2);
    res.render("shop/cart", {
      pageTitle: "cart",
      prods: result,
      totalCartPrice: totalPrice,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    await updateCart(req, res);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await sql`DELETE FROM cart WHERE id = ${prodId}`
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    res.render("shop/orders", {
      pageTitle: "orders",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateCart = updateCart;
