const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('6503cbd99e3f45ad53797446')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

mongoose.connect('mongodb+srv://dennisjshofficial:wO22Kgq8wN5XBCGv@dennisjsh.q5qgsgx.mongodb.net/shop?retryWrites=true')
.then(()=>{
  app.listen(3000);
})
.catch((err)=>{
  console.log(err);
})



