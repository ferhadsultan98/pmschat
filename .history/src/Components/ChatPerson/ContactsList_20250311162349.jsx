const ContactsList = ({ onContactSelect }) => {
  // ... (rest of your existing code)

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user authentication
    setShowDropdown(false); // Close dropdown
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* ... (rest of your existing JSX) */}
      <div className="dropdownContainer">
        <button className="contactsMoreButton" onClick={toggleDropdown}>
          <MoreVertical size={20} />
        </button>
        {showDropdown && (
          <div className="dropdownMenu">
            <button className="dropdownItem" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      {/* ... (rest of your existing JSX) */}
    </>
  );
};

export default ContactsList;