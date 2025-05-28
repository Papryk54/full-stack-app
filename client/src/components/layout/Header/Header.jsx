import styles from "./Header.module.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
	const userFromStore = useSelector((state) => state.user);
	const user = userFromStore ?? { login: null };
	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<img src="../../../public/img/CapybaraBoardLogo.png" />
			</div>
			<h1>Capybara Board</h1>
			<div className={styles.authButtons}>
				<Link to="/">
					<button className={`${styles.lined} ${styles.thick}`}>
						Home Page
					</button>
				</Link>
				{!user.login && (
					<Link to="/login">
						<button className={`${styles.lined} ${styles.thick}`}>
							Sign In
						</button>
					</Link>
				)}
				{user.login && (
					<div>
						<Link to="/logout">
							<button className={`${styles.lined} ${styles.thick}`}>
								<p>Sign Out</p>
							</button>
						</Link>
						<p className="welcome">
							Welcome <br></br> {user.login}!
						</p>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
