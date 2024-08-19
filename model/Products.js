import { connection as db } from "../config/index.js";

class Products {
  fetchProducts(req, res) {
    try {
      const strQry = `
                SELECT productID, prodName, category, prodDescription, prodURL, amount
                FROM Products;
            `;
      db.query(strQry, (err, results) => {
        if (err) throw new Error(`Unable to fetch all products`);
        res.json({
          status: res.statusCode,
          results,
        });
      });
    } catch (error) {
      res.json({
        status: 404,
        message: error.message,
      });
    }
  }

  recentProducts(req, res) {
    try {
      const strQry = `
        SELECT productID, prodName, category, prodDescription, prodURL, amount
        FROM Products
        ORDER BY productID DESC
        LIMIT 5;
        `;

      db.query(strQry, (err, results) => {
        if (err) throw new Error(`Unable to retrieve recent products`);
        res.json({
          status: res.statusCode,
          results,
        });
      });
    } catch (error) {
      res.json({
        status: 404,
        message: error.message,
      });
    }
  }
  fetchProduct(req, res) {
    try {
      const strQry = `
                SELECT productID, prodName, category, prodDescription, prodURL, amount
                FROM Products
                WHERE productID = ${req.params.id};
            `;
      db.query(strQry, (err, result) => {
        if (err) throw new Error(`Specified product was not found`);
        res.json({
          status: res.statusCode,
          result: result[0],
        });
      });
    } catch (error) {
      res.json({
        status: 404,
        message: error.message,
      });
    }
  }
  addProduct(req, res) {
    try {
      const strQry = `
                INSERT INTO Products
                SET ?;
            `;

      db.query(strQry, [req.body], (err) => {
        if (err) throw new Error(`Unable to add product`);
        res.json({
          status: res.statusCode,
          message: "Product added successfully",
        });
      });
    } catch (error) {
      res.json({ status: 404, err: error.message });
    }
  }
  updateProduct(req, res) {
    try {
      const strQry = `
                    UPDATE Products
                    SET ?
                    WHERE productID = ${req.params.id};
                `;

      db.query(strQry, [req.body], (err) => {
        if (err) throw new Error(`Unable to update product`);
        res.json({
          status: res.statusCode,
          message: "Product updated successfully",
        });
      });
    } catch (error) {
      res.json({ status: 404, err: error.message });
    }
  }
  deleteProduct(req, res) {
    try {
      const strQry = `
        DELETE FROM Products
        WHERE productID = ${req.params.id};
        `;

      db.query(strQry, (err) => {
        if (err) throw new Error(`Please review your delete query`);
        res.json({
          status: res.statusCode,
          message: "Product deleted successfully",
        });
      });
    } catch (error) {
      res.json({ status: 404, err: error.message });
    }
  }
}

export {
    Products
}