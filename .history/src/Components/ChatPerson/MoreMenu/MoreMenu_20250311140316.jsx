import React from 'react';
import { MoreVertical, LogOut } from 'react-feather';
import PropTypes from 'prop-types';
import './MoreMenu.scss';

const MoreMenu = ({ isOpen, onToggle, onLogout, menuRef }) => (
  <div className="moreMenuContainer" ref={menuRef}>
    <button className="contactsMoreButton" onClick={onToggle}>
      <MoreVertical size={20} />
    </button>
    <div className={`moreDropdown ${isOpen ? 'show' : ''}`}>
      <button className="dropdownItem" onClick={onLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

MoreMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  menuRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

export default MoreMenu;