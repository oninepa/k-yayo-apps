import TopBar from "./topbar";
import NavigationBar from "./navigationbar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <TopBar />
      <NavigationBar />
    </header>
  );
};

export default Header;
