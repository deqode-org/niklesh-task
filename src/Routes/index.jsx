import React from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Paths from "./path";

const Routes = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <Route path={Paths.Dashboard} component={Dashboard} />
    <Redirect from={Paths.Redirect} to={Paths.Dashboard} />
  </Router>
);

export default Routes;
