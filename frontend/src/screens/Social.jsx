import '../App.css';
import GroupChannel from "../components/social/GroupChannel";

function Social() {
  return (
    <div className="App" >
      <GroupChannel isAdmin={true} />
    </div>
  );
}

export default Social;