import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import SearchBar from "./SearchBar";
import { useAuth } from "../../context/AuthContextProvider";
import { Link } from "react-router-dom";

function NavBarComponent() {
  const { activeSession, userData } = useAuth(); 
  
  return (
    <div>
      <Navbar fluid rounded className="dark:bg-[#19191a]">
        <NavbarBrand href="https://flowbite-react.com">
          <img
            src="https://img.freepik.com/vector-premium/ejemplo-logotipo_590037-59.jpg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Pixel Reviews
          </span>
        </NavbarBrand>

        {activeSession ? (
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{userData?.username}</span>
                <span className="block truncate text-sm font-medium">
                  {userData?.email}
                </span>
              </DropdownHeader>
              <DropdownItem><Link to={`/users/${userData?.username}`}>My Profile</Link></DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Earnings</DropdownItem>
              <DropdownDivider />
              <DropdownItem>
                <Link to="/auth/logout">Log out</Link>
              </DropdownItem>
            </Dropdown>
            <NavbarToggle />
          </div>
        ) : null}
        <NavbarCollapse>
          <Link className="hover:text-white" to="/">
            Home
          </Link>

          {activeSession ? (
            <>
              <Link className="hover:text-white" to="/">
                Wishlist
              </Link>

              <Link className="hover:text-white" to="/">
                My Reviews
              </Link>
            </>
          ) : (
            <>
              <Link className="hover:text-white" to="/auth/login">
                Login
              </Link>

              <Link className="hover:text-white" to="/auth/signup">
                Signup
              </Link>
            </>
          )}
        </NavbarCollapse>
        <SearchBar />
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
