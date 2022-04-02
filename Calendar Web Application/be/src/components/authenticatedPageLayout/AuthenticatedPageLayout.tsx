import { Header } from '../header/Header';
import NavBar from '../navigationBar/NavBar';
import { Footer } from '../footer/Footer';

const AuthenticatedPageLayout = ({ children }: any) => (
  <>
    <Header />
    <NavBar />
    <div className="contents">{children}</div>
    <Footer />
  </>
);

export default AuthenticatedPageLayout;
