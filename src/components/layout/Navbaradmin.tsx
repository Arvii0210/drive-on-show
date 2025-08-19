import { Bars3Icon } from '@heroicons/react/24/outline';

interface NavbarProps {
  toggleSidebar: () => void;
  title?: string;
}

const Navbar = ({ toggleSidebar, title = 'Admin Dashboard' }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-md rounded-b-2xl mx-2 mt-2 mb-4">
      <div className="flex items-center px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden border border-primary text-primary rounded-lg py-2 px-3 hover:bg-primary hover:text-white transition-all duration-300"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h5 className="ml-4 my-0 font-extrabold text-transparent bg-gradient-to-r from-blue-700 via-pink-600 to-emerald-600 bg-clip-text text-lg tracking-wide drop-shadow">
          {title}
        </h5>
      </div>
    </nav>
  );
};

export default Navbar;