import Home from "../Views/Home";
import About from "../Views/About";
import Template from "../Views/Template";
import Login from "../Views/Login";
import Profile from "../Views/Profile";
import Board from "../Components/Board";
import ErrorPage from "../Views/404";

export default [
  {
    name: "home",
    path: "/",
    isExact: true,
    isNavBar: true,
    isPrivate: true,
    component: Home,
  },
  {
    name: "help_outline",
    path: "/about",
    isNavBar: true,
    component: About,
  },
  {
    name: "format_list_bulleted",
    path: "/tasks",
    isNavBar: true,
    component: Template,
  },
  {
    name: "Login",
    path: "/login",
    isPublic: true,
    component: Login,
  },
  {
    name: "Profile",
    path: "/profile",
    isPrivate: true,
    component: Profile,
  },
  {
    name: "Board",
    path: "/b",
    isPrivate: true,
    component: Board,
  },
  {
    name: "404",
    path: "*",
    component: ErrorPage,
  },
];
