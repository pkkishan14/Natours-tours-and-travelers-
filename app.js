// // const fs = require('fs');
// const express = require('express');
// const morgan = require('morgan');

// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');//Exported routers are received here

// // const exp = require('constants');
// // const { get } = require('http');

// const app = express(); //adds up many express functions for variable app

// // 1. MIDDLEWARE
// app.use(morgan('dev'));
// app.use(express.json()); //app.use() is used to put middleware functions in middleware stack
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 😁');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString(); //will add the date and time when request is initiated
//   next();
// });

// // app.get('/', (req, res) =>{
// //   res.status(200)
// //   .json({message: 'Hello from the server side!', app: 'Natours'});
// // })
// // //server response 200 => OK

// // app.post('/',(req, res) => {
// //   res.send('You can post to this endpoint...');
// // })

// // 2. ROUTE HANDLERS

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   })
// }
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   })
// }

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   })
// }

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   })
// }

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   })
// }

// //
//// // 3. ROUTES
//
//
//   app.use('/api/v1/tours', tourRouter);
//   app.use('/api/v1/users', userRouter);// mounting a new router on a route

// // Routing
// // app.get('/api/v1/tours', (req, res) => {
// //   res.status(200).json({
// //     status: 'success',
// //     results: tours.length,
// //     data: {
// //       tours
// //     }
// //   })
// // })

// // app.get('/api/v1/tours/:id', (req, res) => {
// //   console.log(req.params);
// //   const id = req.params.id*1;

// //   const tour = tours.find(el => el.id === id);

// //   // if(id>tours.length){}
// //   if(!tour){
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID'
// //     });
// //   }
// //   //this callback function here is called routHandler
// //   res.status(200).json({
// //     status: 'success',
// //     results: tours.length,
// //     data: {
// //       tours
// //     }
// //   });
// // });

// //Rout handler for post request
// // app.post('/api/v1/tours', (req, res) => {
// //   // console.log(req.body);
// //   const newId = tours[tours.length - 1].id + 1;
// //   const newTour = Object.assign({ id: newId }, req.body);

// //   tours.push(newTour);

// //   fs.writeFile(
// //     `${__dirname}/dev-data/data/tours-simple.json`,
// //     JSON.stringify(tours),
// //     err => {
// //       res.status(201).json({
// //         status: 'success',
// //         data: {
// //           tours: newTour
// //         }
// //       });
// //     }
// //   );
// // });

// // app.patch('/api/v1/tours/:id',(req, res) => {
// //   if(req.params.id*1 > tours.length){
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID'
// //     });
// //   }

// //   res.status(200).json({
// //     status: 'success',
// //     data: {
// //       tour: '<Updated tour here..>'
// //     }
// //   })
// // })

// // app.delete('/api/v1/tours/:id',(req, res) => {
// //   if(req.params.id*1 > tours.length){
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID'
// //     });
// //   }

// //   res.status(204).json({
// //     status: 'success',
// //     data: null
// //   })
// // })

// // 4. START SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

/////////////////////////////////////////////

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); //path relative to place where we launched node application

app.use(bodyParser.urlencoded({ extended: true }));

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // for running pug template files

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // limiting time in seconds i.e. 1 hour
  message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // We can limit the amount of data that comes in body
app.use(cookieParser()); // above parser pases data from the body and this one parses data from the cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);

  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.all() -> works for all the http requests of all kinds
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handling Error with our Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
