import express from "express";
const router = express.Router();
import authRoute from './authRoute.js'
import appointmentRoute from './appointmentRoute.js'
// Define the route paths dynamically
const routeArray = [
    { path: "/auth", route: authRoute },
    {path:"/appointMent",route:appointmentRoute}
   
];

// Automatically register routes
routeArray.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
