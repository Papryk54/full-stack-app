import styles from "./Login.module.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../../../redux/usersRedux";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [login, setLogin] = useState("");
	const [loginFailed, setLoginFailed] = useState(false);
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const apiUrl = import.meta.env.VITE_API_URL;

	const handleLogin = async (e) => {
		e.preventDefault();

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ login, password }),
		};

		try {
			setStatus("loading");
			const res = await fetch(`${apiUrl}/auth/login`, options);

			if (res.status === 200) {
				const data = await res.json();
				setStatus("success");
				dispatch(logIn({ _id: data._id, login: data.login }));
				navigate("/");
			} else if (res.status === 400) {
				setStatus("clientError");
			} else {
				setStatus("serverError");
			}
		} catch (err) {
			setStatus("serverError");
			setLoginFailed(true);
			console.error("Something went wrong...");
		}
	};

	return (
		<div className={styles.wrapper}>
			<p>Welcome to Capybara Board — please log in to continue:</p>
			<form onSubmit={handleLogin}>
				<p>Username:</p>
				<input
					type="text"
					value={login}
					onChange={(e) => setLogin(e.target.value)}
				/>
				<p>Password:</p>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Login</button>
			</form>
			<div className={styles.register}>
				<p>Or join the capybara crew:</p>
				<a href="/register">
					<button className={`${styles.lined} ${styles.thick}`}>
						Register
					</button>
				</a>
			</div>
		</div>
	);
};

export default Login;
