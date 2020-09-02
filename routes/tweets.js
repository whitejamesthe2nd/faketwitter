const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { check, validationResult } = require('express-validator')


const tweetNotFoundError = (id) => {
    let err = new Error(`tweet number${id}  could not be found`)
    err.status= 404;
    err.title = 'Tweet not found';
    return err;
}
const {Tweet} = db;
const tweetValidator = [
    check('message')
        .exists({checkFalsy:true})
        .withMessage('Please provide a message')
        .isLength({max:280})
        .withMessage('Message must not be more than 280 characters long')
]

const handleValidationErrors = (req,res,next) =>{
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        const errors = validationErrors.array().map((error)=> error.msg)
        const err =Error("Bad Request");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
}

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);
router.get("/tweets",asyncHandler (async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets
    })
}));

router.get('/tweets/:id(\\d+)', asyncHandler(async (req,res,next) =>{
    const tweetId = parseInt(req.params.id);
    const tw = await Tweet.findOne({where:tweetId});
    if(tw){

        res.json({tw});
    }else{
        next(tweetNotFoundError(req.params.id))
    }
}))

router.post('/tweets',tweetValidator, handleValidationErrors, asyncHandler((req,res,next)=>{

}))

router.put('/tweets/:id(\\d+)',tweetValidator, handleValidationErrors, asyncHandler( async (req,res)=>{
    const tweetId = parseInt(req.params.id);
    const tw = await Tweet.findByPk(tweetId);
    // console.log(tw);
    if(!tw){
        tweetNotFoundError(req.params.id);
    }else{
        const result = await tw.update({message:req.body.message});
        res.json(result);
        // console.log(tw);
        // console.log(result);
    }


}))

router.delete('/tweets/:id(\\d+)',tweetValidator, handleValidationErrors, asyncHandler( async (req,res,next)=>{
    const tweetId = parseInt(req.params.id);
    const tw = await Tweet.findByPk(tweetId);
    if(!tw){
        tweetNotFoundError(req.params.id);

    }else{
        await tw.destroy();
    }

}))

module.exports = router
