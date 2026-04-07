
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcons from "./CartIcons";
import FavouriteButton from "./FavouriteButton";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";

const Header = () => {
  return (
    <header className="fixed mb-2 top-0 left-0 w-full bg-white z-50 shadow-md ">
      <Container className="flex items-center justify-between  text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcons />
          <FavouriteButton />
          <SignIn />
        </div>
      </Container>
    </header>
  );
};

export default Header;
