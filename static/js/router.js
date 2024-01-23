import Home from "./components/home.js"
import Admin from "./components/admin.js";
import Adminregister from "./components/adminregister.js";
import Admindashboard from "./components/admindashboard.js";
import Addvenue from "./components/addvenue.js";
import VenueShow from "./components/venueshow.js";
import Showregister from "./components/showregister.js";
import Updateshow from "./components/updateshow.js";
import User from "./components/user.js";
import Userdashboard from "./components/userdashboard.js";
import Userreg from "./components/userreg.js";
import PlaceDetails from "./components/placedetails.js";
import Booking from "./components/booking.js";
import Updatevenue from "./components/updatevenue.js";
import Placeresults from "./components/placeresults.js";
import Ratingresults from "./components/ratingresults.js";
import Tagresults from "./components/tagresults.js";
import Bookingconfirmation from "./components/bookingconfirmation.js";
import Userbooking from "./components/userbooking.js";
import Allshows from "./components/allshows.js";
import Error from "./components/error.js";

const routes = [
    { path: "/", component: Home, name: Home },
    { path: "/admin", component: Admin, name: Admin, },
    { path: "/adminreg", component: Adminregister, name: Adminregister },
    { path: "/admindashboard", component: Admindashboard, name: Admindashboard, meta: { requiresAuth: true } },
    { path: "/addvenue", component: Addvenue, name: Addvenue, meta: { requiresAuth: true } },
    { path: "/venueshow", component: VenueShow, name: VenueShow, meta: { requiresAuth: true } },
    { path: '/venueshow/:venue_id', component: VenueShow, props: true },
    { path: "/showreg/:venue_id", component: Showregister, name: Showregister, props: true, meta: { requiresAuth: true } },
    { path: "/updateshow/:showId", component: Updateshow, name: Updateshow, props: true, meta: { requiresAuth: true } },
    { path: "/user", component: User, name: User },
    { path: "/userdashboard", component: Userdashboard, name: Userdashboard, meta: { requiresAuth: true } },
    { path: "/userreg", component: Userreg, name: Userreg, },
    { path: "/place/:v_place", component: PlaceDetails, name: PlaceDetails, meta: { requiresAuth: true } },
    { path: "/booking/:showId/:username", component: Booking, meta: { requiresAuth: true } },
    { path: "/updatevenue/:venue_id", component: Updatevenue, meta: { requiresAuth: true } },
    { path: "/placeresults/:searchplace", component: Placeresults, props: true, meta: { requiresAuth: true } },
    { path: "/ratingresults/:searchplace", component: Ratingresults, props: true, meta: { requiresAuth: true } },
    { path: "/tagresults/:searchplace", component: Tagresults, props: true, meta: { requiresAuth: true } },
    { path: "/bookingconfirmation", component: Bookingconfirmation, props: true, meta: { requiresAuth: true } },
    { path: "/userbooking/:username", component: Userbooking, props: true, meta: { requiresAuth: true } },
    { path: "/allshows", component: Allshows, meta: { requiresAuth: true } },
    { path: "/errorpage", component: Error }
]


const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(route => route.meta.requiresAuth)) {

        const token = localStorage.getItem('access_token');
        if (!token) {

            next({ path: '/', query: { redirect: to.fullPath } });
        } else {

            next();
        }
    } else {

        next();
    }
})

export default router;