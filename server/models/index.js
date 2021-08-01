const mongoose = require("mongoose");

const connect = () => {
    const mongoURI = process.env.NODE_ENV === "test" 
    ? process.env.mongoTestURI 
    : process.env.mongoProdURI;

    mongoose.connect(mongoURI, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: false
      })
      .then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));
}

module.exports = connect;