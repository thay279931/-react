import { Outlet } from 'react-router-dom';
import MemberNav from './MemberNav';
//這邊要放會員NAVBAR
function IndexPage() {
  return (
    <>
      <MemberNav />
      <div className="container">{<Outlet />}</div>
    </>
  );
}
export default IndexPage;
