import Header from './Header';
import Sidebar from './Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="">
      <Header></Header>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="bg-sky-100 w-full">{children}</div>
      </div>
    </div>
  );
};
export default Layout;
