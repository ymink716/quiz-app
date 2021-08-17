const mongoose = require("mongoose");

const connect = () => {
    if (process.env.NODE_ENV !== 'test') {
      mongoose.connect(process.env.mongoProdURI, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: false
      })
      .then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err));
    }
}

module.exports = connect;