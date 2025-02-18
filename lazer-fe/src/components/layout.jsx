// src/components/Layout.jsx
import Navbar from './navbar';
import Footer from './footer';

function Layout({ children }) {
  return (
    <div className='' >
      <Navbar/>
      <main className="container mx-auto p-4 h-[80vh] flex justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
