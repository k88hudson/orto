import { useCurrentUser } from "../utils/firestore";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { ActiveTrials } from "../ActiveTrials/ActiveTrials";
import { SignIn, SignOut } from "../AuthButtons/AuthButtons";
import { MyTokens } from "../MyTokens/MyTokens";
import { NewToken } from "../NewToken/NewToken";
import { NewTrial } from "../NewTrial/NewTrial";

function App() {
  const [currentUser] = useCurrentUser();
  const uid = currentUser?.uid;
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Origin trials
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  exact
                  className="nav-link"
                  activeClassName="active"
                  aria-current="page"
                  to="/"
                >
                  Active trials
                </NavLink>
              </li>
              {currentUser && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    activeClassName="active"
                    aria-current="page"
                    to="/my"
                  >
                    My tokens
                  </NavLink>
                </li>
              )}
            </ul>

            <form className="d-flex">
              {" "}
              <span className="collapse navbar-collapse me-2 text-light">
                {currentUser?.email}
              </span>
              {uid ? <SignOut /> : <SignIn />}
            </form>
          </div>
        </div>
      </nav>

      <main className="container pt-4">
        <Switch>
          <Route path="/my">
            <MyTokens />
          </Route>
          <Route path="/new/:featureId">
            <NewToken />
          </Route>
          <Route path="/new-trial">
            <NewTrial />
          </Route>
          <Route path="/">
            <ActiveTrials />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
