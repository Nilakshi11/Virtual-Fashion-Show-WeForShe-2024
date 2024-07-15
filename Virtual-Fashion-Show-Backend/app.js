const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
const cors=require("cors");
app.use(cors());
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const JWT_SECRET="ijhfhsdfkjsdgfuygerf384563874?<[,jfghdu4378459dhvdhfbviuewyr38477";

const multer = require("multer");
const path = require("path");
const fs = require("fs");
app.use('/uploads', express.static('uploads'));

// mongoose.set('strictQuery', false);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });


const mongourl="mongodb+srv://hack:system@cluster0.6osrmnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Connected to Database");
})
.catch((e)=>console.log(e));

require("./userDetails");
const User=mongoose.model("UserInfo");
require("./designerDetails");
const Designer=mongoose.model("DesignerInfo");

app.post("/register",async(req,res)=>{
    const{email,password}=req.body;
    const encryptedPassword=await bcrypt.hash(password,10);
    try {
        const oldUser = await User.findOne({ email });
        if(oldUser)
        {
            return res.send({error:"User Exits"});
        }
        await User.create({
            email,
            password:encryptedPassword,
        });
        res.send({status:"ok"});
    } catch (error) {
        res.send({status:"error"});        
    }
});

app.post("/login-user",async(req,res)=>{
    const {email,password,}=req.body;
    const user=await User.findOne({ email });
    const designer = await Designer.findOne({ email });

    if(!user)
    {
        return res.send({error:"User not found..."});
    }
    if (designer) {
        if (await bcrypt.compare(password, designer.password)) {
            const token = jwt.sign({ email: designer.email, userType: 'designer' }, JWT_SECRET, {
                expiresIn: '360s', 
            });
            return res.json({ status: 'ok', data: token, userType: 'designer'});
        } else {
            return res.json({ status: 'error', error: 'Invalid credentials' });
        }
    }
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email, userType: 'user' }, JWT_SECRET, {
                expiresIn: '360s', 
            });
            return res.json({ status: 'ok', data: token, userType: 'user'});
        } else {
            return res.json({ status: 'error', error: 'Invalid credentials' });
        }
    }
    res.json({status:"error",error:"Invalid Password!!!"});
});

app.post("/userData",async(req,res)=>{
    const {token}=req.body;
    try {
        const user=jwt.verify(token,JWT_SECRET,(err,res)=>{
            if(err)
                return "Token Expired";
            return res;
        });

        console.log(user);
        if(user=="Token Expired"){
            res.send({status:"error",data:"Token Expired"});
        }            

        const useremail=user.email;
        User.findOne({email:useremail}).then((data)=>{
            res.send({status:"ok",data:data});
        }).catch((error)=>{
            res.send({status:"error",data:error});
        });
    } catch (error) {
        
    }
});

app.post("/registerdesigner",upload.single("photo"),async(req,res)=>{
    const{name,email,password,mobileno, location}=req.body;
    const encryptedPassword=await bcrypt.hash(password,10);
    const photoPath = req.file ? req.file.path : ""; 

    try {
        const oldUser = await User.findOne({ email });
        if(oldUser)
        {
            return res.send({error:"User Exits"});
        }
        await User.create({
            email,
            password:encryptedPassword,
        });
        await Designer.create({
            name,
            email,
            password:encryptedPassword,
            mobileno,
            location,
            photo: photoPath,
            designs:null,
        });
        res.send({status:"ok"});
    } catch (error) {
        res.send({status:"error"});        
    }
});


app.post("/uploadform", upload.single("video"), async (req, res) => {
    const { category, price, description, size, email } = req.body;
    const videoPath = req.file ? req.file.path : null;

    console.log('Received email:', email); 

    try {
        const designer = await Designer.findOne({ email });
        
        if (!designer) {
            return res.send({  error: "Designer not found" });
        }

        const newDesign = {
            _id: new mongoose.Types.ObjectId(), // Generate a unique ID
            category,
            video: videoPath,
            price,
            size,
            description,
            like: 0,
            dislike: 0,
            comment: [],
            // orders: 0,
        };
        if (!designer.designs) {
            designer.designs = []; // Initialize designs array if not present
        }

        designer.designs.push(newDesign);

        await designer.save();

        res.send({ status: "ok", data: designer });
      } catch (error) {
        res.send({ status: "error", error: error.message });
      }
});

  app.get("/getdesigns", async (req, res) => {
    try {
        const designers = await Designer.find().exec();
        let allDesigns = [];

        designers.forEach(designer => {
            if (designer.designs && designer.designs.length > 0) {
                designer.designs.forEach(design => {
                    allDesigns.push({
                        ...design.toObject(),
                        designerName: designer.name,
                        designerPhoto: designer.photo,
                    });
                });
            }
        });

        res.json(allDesigns);
    } catch (error) {
        console.error("Error fetching designs:", error); // Add detailed logging
        res.status(500).json({ status: 'error', error: 'Error fetching designs' });
    }
});

const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

// Handle Like, Dislike, and Comments
app.post("/like/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const designer = await Designer.findOne({ "designs._id": id });
        if (!designer) {
            return res.status(404).json({ error: 'Design not found' });
        }

        const design = designer.designs.id(id);
        design.like += 1;
        await designer.save();
        res.json({ status: 'ok', message: 'Liked successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.post("/dislike/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const designer = await Designer.findOne({ "designs._id": id });
        if (!designer) {
            return res.status(404).json({ error: 'Design not found' });
        }

        const design = designer.designs.id(id);
        design.dislike += 1;
        await designer.save();
        res.json({ status: 'ok', message: 'Disliked successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.post("/comment/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const designer = await Designer.findOne({ "designs._id": id });
        if (!designer) {
            return res.status(404).json({ error: 'Design not found' });
        }

        const design = designer.designs.id(id);
        design.comments.push({ email: req.user.email, text });
        await designer.save();
        res.json({ status: 'ok', message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


app.listen(5000,()=>{
    console.log("server started on port 5000");
});