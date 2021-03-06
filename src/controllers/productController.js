import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc Fetch all products
//@route GET /api/products
//@access Public 

export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber)  || 1;
    const keyword = req.query.keyword
      ? {
          name: {
              $regex: req.query.keyword,
              $option: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    return res.json({ products, page, pages: Math.ceil(count / pageSize)});

});

//@desc Fetch single product 
//@route GET /api/products/:id
//@access Public

export const getProductById = asyncHandler(async (req, res )=> {
    const product = await Product.findById(req.params.id);
    if(!product){
        res.status(404);
        throw new Error ('Product not Found');
               
    }else{
        res.json({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            brand: product.brand,
            category: product.category,
            countInStock: product.countInStock

            
        });
        
    }
})

//@desc createproduct
//@route POST /api/products
//@access Private/ Admin

export const createdProduct = asyncHandler(async (req, res)=> {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/image/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

//@desc create new review 
//@route POST /api/products/:id/reviews
//@access Private
export const createdProductReview = asyncHandler (async (req, res) => {
    const {rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product){
        const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed){
            res.status(400);
            throw new Error ('Product already reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id, 
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0)/
            product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added' });


    }else {
        res.status(404);
        throw new Error ('Product not found');
    }
});

//@desc Update a product  
//@route PUT /api/products/:id
//@access Private/admin

export const updateProduct = asyncHandler(async ( req, res) => {
    const { name, price, description, image,  brand,  category, countInStock } = req.body;
    const product = await Product.findById(req.params.id); 
    if(product){
        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.description = description ?? product.description;
        product.image = image ?? product.image;
        product.brand = brand ?? product.brand;
        product.category = category ?? product.category;
        product.countInStock = countInStock ?? product.countInStock;

        const updateProduct = await product.save();

        res.json({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            brand: product.brand,
            category: product.category,
            countInStock: product.countInStock
        });
    }else {
        res.status(404);
        throw new Error('Use not found');
    }
})
