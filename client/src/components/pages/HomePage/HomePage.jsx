import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.scss";
import { IMGS_URL } from "./../../../../config";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const HomePage = () => {
	const [searchPhrase, setSearchPhrase] = useState("");
	const [ads, setAds] = useState([]);
	const user = useSelector((state) => state.user);
	const apiUrl = import.meta.env.VITE_API_URL;
	const magnetsArray = useMemo(() => ["Red", "Yellow", "Green", "Blue"], []);

	useEffect(() => {
		fetch(`${apiUrl}/ads/getAll`)
			.then((res) => res.json())
			.then((data) => {
				setAds(data);
			})
			.catch((err) => console.error(err));
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchPhrase.trim() !== "") {
			fetch(`${apiUrl}/ads/getBySearchPhrase/${searchPhrase}`)
				.then((res) => res.json())
				.then((data) => setAds(data))
				.catch((err) => console.error(err));
		} else {
			fetch(`${apiUrl}/ads/getAll`)
				.then((res) => res.json())
				.then((data) => setAds(data))
				.catch((err) => console.error(err));
		}
	};

	return (
		<div className={styles.homepage}>
			<div className={styles.adsManagement}>
				<form className={styles.searchBar} onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Search..."
						value={searchPhrase}
						onChange={(e) => setSearchPhrase(e.target.value)}
					/>
					<button type="submit">Search</button>
				</form>
				{user.login && (
					<Link to={`/post-ad`}>
						<button className={styles.addOffer}>Add Offer</button>
					</Link>
				)}
			</div>

			<main className={styles.main}>
				<h2>Explore Our Latest Ads and Offers</h2>
				<div className={styles.adsGrid}>
					{ads.map((ad) => {
						const randomMagnet =
							magnetsArray[Math.floor(Math.random() * magnetsArray.length)];
						const randomRotation = Math.random() * 7;
						return (
							<div className={styles.adCard} key={ad._id}>
								<div
									className={styles.imageArea}
									style={{ rotate: `${randomRotation - 4}deg` }}
								>
									<img
										className={styles.magnetImg}
										src={`../../../../public/img/Magnet${randomMagnet}.png`}
									/>
									<img
										src={IMGS_URL + encodeURIComponent(ad.image)}
										alt={ad.title}
									/>
								</div>
								<div className={styles.adText}>
									<h3>{ad.title}</h3>
									<p>{ad.location}</p>
									<Link to={`/ads/${ad._id}`}>Check details</Link>
								</div>
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
};

export default HomePage;
