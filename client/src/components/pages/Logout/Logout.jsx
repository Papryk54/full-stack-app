import { useEffect } from "react";
import { logOut } from "../../../redux/usersRedux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const options = {
			method: "DELETE",
			credentials: "include",
		};

		fetch(`${apiUrl}/auth/logout`, options).then(() => {
			dispatch(logOut());
			navigate("/");
		});
	}, [dispatch]);
	return null;
};

export default Logout;
