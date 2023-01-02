const mongoose = require("mongoose");

class Index {
    connectToMongoDb(){
        mongoose.set("strictQuery", false);
        const db = "mongodb://localhost:27017/ecom";
        mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true,
            family: 4})
        .then((data) => console.log("DB Connected!!"))
        .catch(err => console.log(err));
    }
}

module.exports = new Index();
