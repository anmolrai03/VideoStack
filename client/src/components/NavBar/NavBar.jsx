import {NavLink} from "react-router-dom"
export default function Navbar() {
  return (
    <nav className="vs-navbar">

      <div className="text-xl tracking-tight">
        VIDEOSTACK
      </div>

      <div className="vs-nav-links">
        <NavLink className="vs-nav-active">Home</NavLink>
        <NavLink>Uploads</NavLink>
        <NavLink>Processing</NavLink>
        <NavLink>Library</NavLink>
        <NavLink>Settings</NavLink>
        <NavLink>One More</NavLink>
      </div>

      <div className="flex gap-6 text-sm text-neutral-400">
        <span>☾</span>
        <span>⚙</span>
      </div>

    </nav>
  );
}