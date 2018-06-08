import React, {Fragment} from 'react';
import {MenuItem, Nav, NavDropdown} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const UserMenu = ({user, logout}) => {
  const navTitle = (
    <Fragment>
      <p style={{color: '#000000', display: 'inline'}}>Hello, <b>{user.username}</b>!</p>
    </Fragment>
  );

  return (
    <Nav pullRight>
      <NavDropdown id='user-menu' title={navTitle}>
        <LinkContainer to="/profile">
          <MenuItem>Edit profile</MenuItem>
        </LinkContainer>
        <LinkContainer to="/publish">
          <MenuItem>Publish menu</MenuItem>
        </LinkContainer>
        {
          user.role === 'admin' ?
            <LinkContainer to="/artists/unpublish">
              <MenuItem>Unpublished artists</MenuItem>
            </LinkContainer> : null
        }
        <MenuItem divider/>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  )
};

export default UserMenu;
