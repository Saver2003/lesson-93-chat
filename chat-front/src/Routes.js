import React from 'react';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {connect} from "react-redux";

import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Products from "./containers/Products/Products";
import NewProduct from "./containers/NewProduct/NewProduct";

const ProtectedRoute = ({isAllowed, ...props}) => (
  isAllowed ? <Route {...props}/> : <Redirect to='/login' />
);

const Routes = ({user}) => (
  <Switch>
    <Route path="/" exact component={Products}/>
    <ProtectedRoute
      isAllowed={user && user.role === 'admin'}
      path="/products/new"
      exact
      component={NewProduct}
    />
    <Route path="/register" exact component={Register}/>
    <Route path="/login" exact component={Login}/>
  </Switch>
);

const mapStateToProps = state => ({
  user: state.users.user
});

export default withRouter(connect(mapStateToProps)(Routes));