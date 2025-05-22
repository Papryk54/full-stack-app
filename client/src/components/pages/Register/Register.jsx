import styles from "./Register.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [alertVisible, setAlertVisible] = useState(false);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;


	useEffect(() => {
		if (alertVisible) {
			const timer = setTimeout(() => {
				setAlertVisible(false);
			}, 3300);
			return () => clearTimeout(timer);
		}
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append("login", login);
		fd.append("password", password);
		fd.append("phoneNumber", phoneNumber);
		fd.append("avatar", avatar);

		try {
			const res = await fetch(`${apiUrl}/auth/register`, {
				method: "POST",
				body: fd,
			});
			if (!res.ok) throw new Error("Registration failed");
			navigate("/");
		} catch (err) {
			setAlertVisible(true);
			console.error("Something went wrong...");
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={`${styles.alert} ${!alertVisible ? styles.hidden : ""}`}>
				<p>Something went wrong...</p>
			</div>
			<p>Join the capybara crew:</p>
			<form onSubmit={handleSubmit}>
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

				<p>Phone number:</p>
				<input
					type="tel"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
				/>

				<p>Avatar:</p>
				<input
					type="file"
					id="avatar"
					className={styles.avatar}
					onChange={(e) => setAvatar(e.target.files[0])}
				/>
				<label htmlFor="avatar" className={styles.customBtn}>
					{!avatar && <p>Choose Avatar</p>}
					{avatar && <p className={styles.fileChoosed}>{avatar.name}</p>}
				</label>

				<button type="submit">Register</button>
			</form>
			<div className={styles.register}>
				<p>Already have account?:</p>
				<a href="/login">
					<button className={`${styles.lined} ${styles.thick}`}>Sing In</button>
				</a>
			</div>
		</div>
	);
};

export default Register;
