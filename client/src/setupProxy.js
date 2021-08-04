const { createProxyMiddleware } = require('http-proxy-middleware');

let url;
if (process.env.NODE_ENV === 'production')
    url = 'https://ymink-quiz-app.herokuapp.com:5000';
else   
    url = 'http://localhost:5000';

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: url,
            changeOrigin: true,
        })
    );
};