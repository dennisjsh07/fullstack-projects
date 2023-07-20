const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const successController = require('./controller/success');
const errorController = require('./controller/error');
const sequelize = require('./util/database');
var cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/user',userRoutes);

// add success page...
app.use('/success',successController.successPage);

// add error page...
app.use(errorController.errorPage);

sequelize
// .sync({force: true})
.sync()
  .then(() => {
    console.log('User table created'); // Add this line for verification
    app.listen(8000);
  })
  .catch((err) => console.log(err));
  