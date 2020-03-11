import Home from "../Views/Home";
import About from "../Views/About";
import Login from "../Views/Login";
import Profile from "../Views/Profile";
import ErrorPage from "../Views/404";

export default [
  {
    name: "Home",
    path: "/",
    isExact: true,
    isNavBar: true,
    component: Home
  },
  {
    name: "About",
    path: "/about",
    isNavBar: true,
    component: About
  },
  {
    name: "Login",
    path: "/login",
    isPublic: true,
    component: Login
  },
  {
    name: "Profile",
    path: "/profile",
    isPrivate: true,
    component: Profile
  },
  {
    name: "404",
    path: "*",
    component: ErrorPage
  }
];
