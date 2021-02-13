import '../App.css';
import logo from '../logo.svg';

function Dashboard() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to DeskBuddy
        </p>
        <a
          className="App-link"
          href="/reservation"
        >
          Reserve Desk
        </a>
        <a
          className="App-link"
          href="/mail"
        >
          Mail Room
        </a>
        <a
          className="App-link"
          href="/social"
        >
          social
        </a>
      </header>
    </div>
  );
}

export default Dashboard;