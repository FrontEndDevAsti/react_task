import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link to="/users" className="mr-6 hover:text-highlight">Users</Link>
          <Link to="/products" className="hover:text-highlight">Products</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;