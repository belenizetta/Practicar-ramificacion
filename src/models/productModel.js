import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: {
            type:Number, required: true
        },
        comment: {
            type: String, required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timesStamps: true
    }
);

const productScrema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name:{
            type: String,
            required:true,
        },
        image:{
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required:true,
        },
        description: {
            type: String,
            required:true,
        },
        reviews:[reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: true,
        },
        numReviews: {
            type: Number,
            required: true,
            default: true,
        },
        price: {
            type: Number,
            required: true,
            default: true,
        },
        countInStock: {
            type: Number,
            required: true,
            default: true,
        },
    },
    {
        timesStamps: true,
    }
);
 
const Product = mongoose.model('Product',productScrema);

export default Product;