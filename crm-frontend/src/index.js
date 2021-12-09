import "./App.css"
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import Login from "./pages/loginPage";
import UserForm from "./components/forms/UserForm";
import CompanyDetail from "./components/CompanyDetail";
import CompanyForm from "./components/forms/CompanyForm";
import {CookiesProvider} from "react-cookie";
import 'react-pro-sidebar/dist/css/styles.css';
import MainTestEnv from "./tests/MainTestEnv";
import Page from "./tests/test_components/testPage";
import UsersList from "./pages/UsersList";
import CompaniesPanel from "./pages/companiesPanel";
import HomePage from "./pages/HomePage";
import ContactPersonPanel from "./pages/ContactPersonPanel";
import ContactForm from "./components/forms/ContactForm";
import LogoutPage from "./components/logoutPage";
import TradeNotesPanel from "./pages/TradeNotes";
import TradeNoteForm from "./components/forms/TradeNoteForm";

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/test_environment" element={<MainTestEnv/>}>
                    <Route path="test" element={<Page/>}/>
                </Route>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logged" element={<App/>}>
                        <Route path="companies" element={<CompaniesPanel/>}/>
                        <Route path="users" element={<UsersList/>}/>
                        <Route path="home" element={<HomePage/>}/>
                        <Route path="contacts" element={<ContactPersonPanel/>}/>
                        <Route path="trade_notes" element={<TradeNotesPanel/>}/>
                        <Route path="logout" element={<LogoutPage/>}/>
                    <Route path="contacts/edit/:contactID" element={<ContactForm new={false}/>}/>
                    <Route path="contacts/new" element={<ContactForm new={true}/>}/>
                    <Route path="trade_notes/edit/:noteID" element={<TradeNoteForm is_new={false}/>}/>
                    <Route path="trade_notes/new" element={<TradeNoteForm is_new={true}/>}/>
                </Route>
                <Route path="edit_user" element={<UserForm />}>
                    <Route path=":userID" element={<UserForm  is_new={false}/>}/>
                </Route>
                <Route path="new_user" element={<UserForm is_new={true}/>}/>
                <Route path="company">
                    <Route path=":companyID" element={<CompanyDetail token={"3830179166ab484e973a682262156bb16b6490e5"}/>}>
                        <Route path="edit" element={<CompanyForm is_new={false}/>}/>
                    </Route>
                    <Route path={"new"} element={<CompanyForm is_new={true}/>}/>
                </Route>
                <Route path="/logout" element={<LogoutPage/>}/>
            </Routes>
        </BrowserRouter>
    </CookiesProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
