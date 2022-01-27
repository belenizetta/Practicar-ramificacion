import asyncHandler from 'express-async-handler';
import generateToken from '../common/generateToken.js';
import User from '../models/userModel.js';

// @desc Auth user & get token 
// @route POST /api/users/login
// @access Public 

export const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,    
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }

});

// @desc Register a new user 
// @route POST /api/users
// @access Public 

export const registerUser = asyncHandler(async (req, res) => {
    const {name,email,password } = req.body;
    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400);
        throw new Error ('Use already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });

    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc Get user profile 
// @route GET /api/users/profile
// @access Private


export const getUserProfile = asyncHandler(async (req, res) => {
    const { _id  } = req.user;
    const user = await User.findById({ _id });
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });        
    }else{
        res.status(404);
        throw new Error ('User Not Found');
    }
});

// @desc Get all users 
// @route PUT /api/users
// @access Private/Admin

export const getUsers = asyncHandler(async (req,res) => {
    req.user;
    const user = await User.find({ });
    console.log(user);
        res.json({
            user
        });

    
        
        
})

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin


export const getUserById = asyncHandler(async (req, res) => {    
    const user = await User.findById(req.params.id).select('-password');
    if(!user){
        res.status(404);
        throw new Error ('User not Found');
               
    }else{
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
        
    }

})

//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    
    const { _id } = req.user;    

    const user = await User.findById({_id});
     
    if (user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        user.password = req.body.password;
        const updateUserProfile = await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('User not found');
    }
});

// @desc    Delete user 
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req,res)=>{
    //usar findById

    const user = await User.findById(req.params.id);
 
      if (!user) {
            res.status(404);
            throw new Error('User not found');          
        }
  
      user.remove();
      res.status(200).json({name: user.name,email: user.email});
      throw new Error('User removed');
});




