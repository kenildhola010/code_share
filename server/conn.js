const mongoose = require("mongoose");


//connection
mongoose.connect("mongodb://127.0.0.1/codeshare", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})