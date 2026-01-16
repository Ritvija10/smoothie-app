const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const {isEmail}=require("validator");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:true,
        lowercase:true,
        // validate:[(val)=>{ },'Please enter a valid email']
        validate:[isEmail,'Please enter a valid email']

    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[6,"Minimum password length is 6 characters"]
    },
     
})
// //fire a function after new user saved to db
// userSchema.post('save',function(doc,next){
//     console.log("New user was created and saved",doc);
//     next();
// });

//fie a funtion before doc is saved to db
userSchema.pre('save',async function(next){
    console.log("user is about to be created",this);
    const salt=await bcrypt.genSalt();
    this.password=bcrypt.hash(this.password,salt);
    next();
});

//static method to login user by comparing the data to the data presetn in database.
userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email});
    if(user){
        const auth=await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('user does not exist');
}


const user =mongoose.model('user',userSchema);

module.exports=user;