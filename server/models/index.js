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
    
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });
}

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊어짐. 연결 재시도');
    connect();
});

module.exports = connect;