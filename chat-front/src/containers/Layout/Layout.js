import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import Toolbar from "../../components/UI/Toolbar/Toolbar";
import {logoutUser} from "../../store/actions/users";

const Layout = props => (
  <Fragment>
    <header>
      <Toolbar user={props.user} logout={props.logoutUser}/>
    </header>
    <div style={{background: '#ddd', height: '100%'}}>
    <main className="container">
      {props.children}
    </main>
    </div>
  </Fragment>
);

const mapStateToProps = state => ({
  user: state.users.user
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);