import React, {useState, useContext} from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CompetitionPage from "./pages/CompetitionPage";
import TeamsPage from "./pages/TeamsPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import ClubsPage from "./pages/ClubsPage";
import ClubPage from "./pages/ClubPage";
import CompetitionViewPage from "./pages/CompetitionViewPage";

require("../css/app.css");

authAPI.setup();


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated()
    );

    const NavBarWIthRouter = withRouter(NavBar);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <HashRouter>
                <NavBarWIthRouter/>
                <main className="container mt-5">
                    <Switch>
                        <Route
                            path="/login"
                            render={ props => <LoginPage onLogin={setIsAuthenticated} {...props}/> }
                        />
                        <PrivateRoute path={"/competition/:id/view"} component={CompetitionViewPage}/>
                        <PrivateRoute path={"/competition/:id"} component={CompetitionPage}/>
                        <PrivateRoute path={"/competition"} component={CompetitionsPage}/>
                        <PrivateRoute path={"/teams"} component={TeamsPage}/>
                        <PrivateRoute path={"/club/:id"} component={ClubPage}/>
                        <PrivateRoute path={"/club"} component={ClubsPage}/>
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
