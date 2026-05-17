// composantes/layout/PublicLayout.jsx
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PublicLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default PublicLayout;