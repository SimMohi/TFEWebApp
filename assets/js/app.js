import React, {useState, useContext, useEffect} from "react";
import ReactDOM from "react-dom";
import "../css/app.css";
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter, Switch, Route, withRouter, Redirect, NavLink, Link} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CompetitionPage from "./pages/CompetitionPage";
import TeamsPage from "./pages/TeamsPage";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionsPageUser from "./pages/CompetitionsPageUser";
import ClubsPage from "./pages/ClubsPage";
import ClubPage from "./pages/ClubPage";
import CompetitionViewPage from "./pages/CompetitionViewPage";
import MatchPagesUser from "./pages/MatchsPageUser";
import MatchPages from "./pages/MatchsPage";
import MatchesPages from "./pages/MatchesPage";
import CovoitsPage from "./pages/CovoitsPage";
import CovoitEditPage from "./pages/CovoitEditPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilPage from "./pages/ProfilPage";
import RegisterPage from "./pages/RegisterPage";
import RonvauTeamsPage from "./pages/RonvauTeamsPage";
import RonvauTeamsPageUser from "./pages/RonvauTeamsPageUser";
import RonvauTeamPage from "./pages/RonvauTeamPage";
import UserAcceptPage from "./pages/UserAcceptPage";
import RonvauTeamCalendarMatch from "./pages/RonvauTeamCalendarMatch";
import CompetitionTeamsPage from "./pages/CompetitionTeamsPage";
import SelectPlayerMatchPage from "./pages/SelectPlayerPage";
import RonvauTeamSelectPage from "./pages/RonvauTeamSelectPage";
import EncodeMatchPage from "./pages/EncodeMatchPage";
import ProfilUserPage from "./pages/ProfilUserPage";
import RonvauTeamCalendar from "./pages/RonvauTeamCalendar";
import EventsPage from "./pages/EventsPage";
import UsersPage from "./pages/UsersPage";
import jwtDecode from "jwt-decode";
import ChatPage from "./pages/ChatPage";
import EventsUser from "./pages/EventsUser";
import RonvauTeamMemberUser from "./pages/RonvauTeamMemberUser";
import RonvauTeamCalendarUnOffPage from "./pages/RonvauTeamCalendarUnOFFPage";
import SelectPlayerUnOffMatchPage from "./pages/SelectPlayerUnOffMatchPage";
import EventPage from "./pages/EventPage";
import EventSubPage from "./pages/EventSubPage";
import RonvauTeamMember from "./pages/RonvauTeamMember";
import EncodeUnOffMatchPage from "./pages/encodeUnOffPage";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import TrainingResumePage from "./pages/TrainingResumePage";
import RGPDPage from "./pages/RGPDPage";
import ConfidentialPage from "./pages/ConfidentialPage";
import ConditionsPage from "./pages/ConditionsPage";
import ConditionsDataPage from "./pages/ConditionsDataPage";
import CovoitAccess from "./pages/CovoitAccess";
import PhotosPage from "./pages/PhotosPage";
import FolderPage from "./pages/folderPage";
import PhotosAuth from "./pages/PhotosAuth";

require("../css/app.css");


authAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated()
    );

    const isAdmin = authAPI.getIsAdmin();
    const NavBarWIthRouter = withRouter(NavBar);
    const [expanded, setExpanded] = useState(false);


    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <HashRouter>
                <NavBarWIthRouter/>
                {isAuthenticated &&
                <SideNav
                    onSelect={(selected) => {
                        setExpanded(!expanded);
                    }}
                >
                    <SideNav.Toggle/>
                    <SideNav.Nav defaultSelected="home">
                        <NavItem eventKey="home">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/"}>
                                    <i className="fas fa-calendar-alt" style={{fontSize: '1.75em'}}/>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/"}>
                                    Mon calendrier
                                </NavLink>
                            </NavText>
                        </NavItem>
                        {isAdmin &&
                        <NavItem eventKey="access">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/userAccess"}>
                                    <i className="fas fa-users-cog" style={{fontSize: '1.75em'}}/>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/userAccess"}>
                                    Gestion des accès
                                </NavLink>
                            </NavText>
                        </NavItem>
                        }
                        <NavItem eventKey="team">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/equipeRonvau"}>
                                    <i className="fas fa-tshirt" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/equipeRonvau"}>
                                    {isAdmin &&
                                    "Gestion des équipes"
                                    ||
                                        "Equipes"
                                    }
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="car">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/covoit"}>
                                    <i className="fas fa-car" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/covoit"}>
                                    Covoiturage
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="photo">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/photos"}>
                                    <i className="fas fa-camera" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/covoit"}>
                                    Covoiturage
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="chat">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/chat"}>
                                    <i className="fas fa-comment" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/chat"}>
                                    Chat
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="event">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/events"}>
                                    <i className="fas fa-hotdog" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/events"}>
                                    Evènements
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="club">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/club"}>
                                    <i className="fas fa-futbol" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/club"}>
                                    Clubs
                                </NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="competition">
                            <NavIcon>
                                <NavLink className="nav-link" to={"/competition"}>
                                    <i className="fas fa-trophy" style={{fontSize: '1.75em'}}></i>
                                </NavLink>
                            </NavIcon>
                            <NavText>
                                <NavLink className="nav-link" to={"/competition"}>
                                    Compétitions
                                </NavLink>
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
                }
                <main className="p-5 ml-5">
                    <Switch>
                        <Route
                            path="/login"
                            render={ props => <LoginPage onLogin={setIsAuthenticated} {...props}/> }
                        />
                        <Route path={"/register"} component={RegisterPage}/>
                        <Route path={"/conditions"} component={ConditionsPage}/>
                        <Route path={"/conditionsDonnées"} component={ConditionsDataPage}/>
                        <PrivateRoute path={"/photos/:id"} component={FolderPage}/>
                        <PrivateRoute path={"/photosAut"} component={PhotosAuth}/>
                        <PrivateRoute path={"/photos"} component={PhotosPage}/>
                        <PrivateRoute path={"/profil/:id"} component={ProfilUserPage}/>
                        <PrivateRoute path={"/profil"} component={ProfilPage}/>
                        <PrivateRoute path={"/param"} component={ConfidentialPage}/>
                        {isAdmin && <PrivateRoute path={"/competition/:id/matchs"} component={MatchesPages}/>}
                        {!isAdmin && <PrivateRoute path={"/competition/:id/matchs"} component={MatchPagesUser}/>}                        }
                        <PrivateRoute path={"/competition/:id/view"} component={CompetitionViewPage}/>
                        <PrivateRoute path={"/competition/:id/équipes"} component={CompetitionTeamsPage}/>
                        <PrivateRoute path={"/competition/:id"} component={CompetitionPage}/>
                        {isAdmin && <PrivateRoute path={"/competition"} component={CompetitionsPage}/>}
                        {!isAdmin && <PrivateRoute path={"/competition"} component={CompetitionsPageUser}/>}
                        {isAdmin && <PrivateRoute path={"/events/:id/inscrit"} component={EventSubPage}/>}
                        {isAdmin && <PrivateRoute path={"/events/:id"} component={EventPage}/>}
                        {isAdmin && <PrivateRoute path={"/events"} component={EventsPage}/>}
                        {!isAdmin && <PrivateRoute path={"/events"} component={EventsUser}/>}
                        <PrivateRoute path={"/covoitAccess/:id"} component={CovoitAccess}/>
                        <PrivateRoute path={"/covoit/:id"} component={CovoitEditPage}/>
                        <PrivateRoute path={"/covoit"} component={CovoitsPage}/>
                        <PrivateRoute path={"/teams"} component={TeamsPage}/>
                        {isAdmin && <PrivateRoute path={"/club/:id"} component={ClubPage}/>}
                        <PrivateRoute path={"/club"} component={ClubsPage}/>
                        <PrivateRoute path={"/chat"} component={ChatPage}/>
                        <PrivateRoute path={"/match/:id/encode"} component={EncodeMatchPage}/>
                        <PrivateRoute path={"/unOffMatch/:id/encode"} component={EncodeUnOffMatchPage}/>
                        <PrivateRoute path={"/match/:id/select"} component={SelectPlayerMatchPage}/>
                        <PrivateRoute path={"/unOffMatch/:id/select"} component={SelectPlayerUnOffMatchPage}/>
                        {isAdmin && <PrivateRoute path={"/equipeRonvau/:id/userAdmin"} component={RonvauTeamMember}/>}
                        <PrivateRoute path={"/equipeRonvau/:id/training"} component={TrainingResumePage}/>
                        <PrivateRoute path={"/equipeRonvau/:id/user"} component={RonvauTeamMemberUser}/>
                        <PrivateRoute path={"/equipeRonvau/:id/select"} component={RonvauTeamMemberUser}/>
                        <PrivateRoute path={"/equipeRonvau/:id/calendar"} component={RonvauTeamCalendar}/>
                        <PrivateRoute path={"/equipeRonvau/:id/matchCalendar"} component={RonvauTeamCalendarMatch}/>
                        <PrivateRoute path={"/equipeRonvau/:id/unOffMatchCalendar"} component={RonvauTeamCalendarUnOffPage}/>
                        <PrivateRoute path={"/equipeRonvau/:id"} component={RonvauTeamPage}/>
                        <PrivateRoute path={"/equipeRonvau"} component={RonvauTeamsPage}/>
                        {isAdmin && <PrivateRoute path={"/userAccess"} component={UsersPage}/>}
                        <Route path="/rgpd/:id" component={RGPDPage}/>
                        <PrivateRoute path="/" component={HomePage} />
                    </Switch>
                </main>
                <div className="d-flex justify-content-center">
                    <div className={"row justify-content-around w-75 mb-5 mt-5"}>
                        <Link to={"/conditions"}>Conditions d'utilisation</Link>
                        <Link to={"/conditionsDonnées"}>Politique d'utilisation des données</Link>
                        Contact: info.plateformeronvau@gmail.com
                    </div>
                </div>

            </HashRouter>
            <ToastContainer/>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
