// import dotenv from 'dotenv';
// dotenv.config({
//     path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
// });

// import mongoose from 'mongoose';
// import server from './app';
// mongoose.connect(process.env.MONGO_URL as string, {})
// .then((data) => {
//     console.log("MongoDB connection succeed");
//     const PORT = process.env.PORT ?? 3003;
//     server.listen(PORT, function() {
//         console.log(`The server is running successfully on port: ${PORT}`);
//     });
// })
// .catch(err => console.log('ERROR on connection MongoDB', err));
import dotenv from 'dotenv';
dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import mongoose from 'mongoose';
import server from './app';

mongoose.connect(process.env.MONGO_URL as string, {})
.then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;

// IPv4 va IPv6 uchun
    server.listen(PORT, '0.0.0.0' as any, () => {
    console.log(`The server is running successfully on port: ${PORT}`);
});

})
.catch(err => console.log('ERROR on connection MongoDB', err));
