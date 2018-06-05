import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Toolbar from "../../components/UI/Toolbar/Toolbar";
import {logoutUser} from "../../store/actions/users";

const Layout = props => (
  <Fragment>
    <NotificationContainer />
    <header>
      <Toolbar user={props.user} logout={props.logoutUser}/>
    </header>
    <main className="container">
      {props.children}
    </main>
  </Fragment>
);

const mapStateToProps = state => ({
  user: state.users.user
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);