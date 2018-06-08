import React from 'react';
import {Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import UserMenu from "./Menus/UserMenu";
import AnonymousMenu from "./Menus/AnonymousMenu";

const Toolbar = ({user, logout}) => (
  <Navbar  style={{marginBottom: '0', background: '#989893'}}>
    <Navbar.Header>
      <Navbar.Brand>
        <LinkContainer to="/" exact  style={{color: '#fff772'}}><a>Welcome to chat!</a></LinkContainer>
      </Navbar.Brand>
      <Navbar.Toggle/>
    </Navbar.Header>
    <Navbar.Collapse>

      {user ? <UserMenu user={user} logout={logout}/> : <AnonymousMenu/>}
    </Navbar.Collapse>
  </Navbar>
);

export default Toolbar;