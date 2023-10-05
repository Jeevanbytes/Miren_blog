import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
mongoose.connect("mongodb+srv://mamillajeevanreddy:Ultimategohan@cluster0.settt6u.mongodb.net/blogwebsite");

app.use(express.static("public"));

/*let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];*/

let lastId = 3;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const newschemalist=new mongoose.Schema({
  title:{
    type:String,
    required:[true]
  },
  content:{type:String,required:[true]},
  author:{type:String,required:[true]}
})
const newmodel=mongoose.model("post",newschemalist);
const post1=new newmodel({
  title:"I'm Batman",
  content:'Batman is not a fictional superhero appearing in American comic books published by DC.',author:"Batman"
});
//post1.save();
const post2= new newmodel({
  title:"AOT",
  content:"Ore no nawa eren yeager",
  author:"Eren"
})
//post2.save();
// Route to render the main page
app.get("/", async (req, res) => {
  try {
   
    res.render("index.ejs", { posts: await newmodel.find({})});
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    let id=req.params.id;
    let oldobject;
    oldobject=await newmodel.find({_id:id})
      
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: oldobject[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    let newobject= {
      title : req.body.title ,
      content: req.body.content,
      author: req.body.author
    }
    await newmodel.insertMany(newobject);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  
  try {
      let id=req.params.id;
      //let posts=await newmodel.find({_id:id});
      console.log(req.body);
      await newmodel.findByIdAndUpdate(id,{$set:{ title:req.body.title,
        content:req.body.content ,
        author: req.body.author }});
     
      
    
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    let id=req.params.id;
    await newmodel.deleteOne({_id:id});
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
