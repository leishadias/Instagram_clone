const rfs=require('rotating-file-stream');
const fs=require('fs');
const path=require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});

const development={
    name: 'development',
    asset_path: './assets',
    session_cookie_key: '****',
    db: 'instagram_dev',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    },
    smtp : {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'leid00123456@gmail.com',
            pass: '*****'
        }
    },
    google_client_id : "*****",
    google_client_secret : "*****",
    google_call_back_url : "http://localhost:8000/users/auth/google/callback",
    github_client_id : "*****",
    github_client_secret : "*****",
    github_call_back_url : "http://localhost:8000/users/auth/github/callback",
    facebook_client_id : "*****",
    facebook_client_secret : "*****",
    facebook_call_back_url : "http://localhost:8000/users/auth/facebook/callback",
    jwt_secret : '*****'
}

const production={
    name: 'production',
    asset_path: process.env.IG_ASSET_PATH,
    session_cookie_key: process.env.IG_SESSION_COOKIE_KEY,
    db: process.env.IG_DB,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    },
    smtp : {
        service : 'gmail',
        host : 'smpt.gmail.com',
        port: 587,
        secure: false,
        auth : {
            user : process.env.IG_GMAIL_USERNAME,
            pass : process.env.IG_GMAIL_PASSWORD
        }
    },
    google_client_id : process.env.IG_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.IG_GOOGLE_CLIENT_SECRET,
    google_call_back_url : "http://34.207.53.196:8000/users/auth/google/callback",
    github_client_id : process.env.IG_GITHUB_CLIENT_ID,
    github_client_secret : process.env.IG_GITHUB_CLIENT_SECRET,
    github_call_back_url : "http://34.207.53.196:8000/users/auth/github/callback",
    facebook_client_id : process.env.IG_FACEBOOK_CLIENT_ID,
    facebook_client_secret : process.env.IG_FACEBOOK_CLIENT_SECRET,
    facebook_call_back_url : "http://34.207.53.196:8000/users/auth/facebook/callback",
    jwt_secret : process.env.IG_JWT_SECRET,
}
// module.exports=development;
console.log(process.env.IG_ENVIRONMENT);
module.exports=eval(process.env.IG_ENVIRONMENT)==undefined?development:eval(process.env.IG_ENVIRONMENT);