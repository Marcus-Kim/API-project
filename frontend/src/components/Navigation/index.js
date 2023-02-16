import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navbar-wrapper'>
      <div className='home-button'>
        <NavLink exact to="/"><img className='logo-button' src='/logo.JPG' /></NavLink>
      </div>
      <div className='profile-button'>
        {sessionUser !== null && <div className='create-spot-button'>
          <NavLink to='/spots/new'>Create a Spot</NavLink>
          </div>}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </div>
  );
}

export default Navigation;
