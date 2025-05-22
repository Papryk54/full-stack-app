import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../src/components/layout/Header/Header";
import Footer from "../src/components/layout/Footer/Footer";
import HomePage from "./components/pages/HomePage/HomePage";
import EditAd from "./components/pages/EditAd/EditAd";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import PostAd from "./components/pages/PostAd/PostAd";
import SingleAd from "./components/pages/SingleAd/SingleAd";
import Logout from "./components/pages/Logout/Logout";

function App() {
	return (
		<Router>
			<Header></Header>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/edit/:id" element={<EditAd />} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/register" element={<Register />} />
				<Route path="/post-ad" element={<PostAd />} />
				<Route path="/ads/:id" element={<SingleAd />} />
			</Routes>
			<Footer></Footer>
		</Router>
	);
}

export default App;
