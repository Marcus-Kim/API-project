import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
    closeMenu();
  };

  const manageSpots = () => {
    return history.push('/spots/current')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button-icons" onClick={openMenu}>
        <div className="button-icon-group">
          <i className="fa-solid fa-bars"></i>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={manageSpots}>Manage Spots</button>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <div className="login-signup-modal-button-container">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
