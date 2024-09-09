import Logo from "./Logo";

// Component that renders a navigation bar with a logo and optional children elements.
export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
