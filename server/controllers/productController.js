const Product = require("../models/Product");


// ================= CREATE PRODUCT (ADMIN) =================
exports.createProduct = async (req, res) => {
  try {

    const { name, description, price, category, countInStock, image } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      countInStock,
      image,
      user: req.user._id
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL PRODUCTS (FILTER + PAGINATION) =================
exports.getProducts = async (req, res) => {
  try {

    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 8
    } = req.query;

    let query = {};

    // 🔎 Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🏷 Category
    if (category) {
      query.category = category;
    }

    // 💰 Price range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ⭐ Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 📊 Sorting
    let sortOption = {};

    if (sort) {
      sortOption[sort.replace("-", "")] =
        sort.startsWith("-") ? -1 : 1;
    } else {
      sortOption.createdAt = -1; // newest first
    }

    // 📄 Pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("user", "name email")
      .sort(sortOption)
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize);

    res.json({
      products,
      page: pageNumber,
      pages: Math.ceil(totalProducts / pageSize),
      totalProducts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET SINGLE PRODUCT =================
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE PRODUCT (ADMIN) =================
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.image = req.body.image || product.image;

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE PRODUCT (ADMIN) =================
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADD PRODUCT REVIEW =================
exports.addProductReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};