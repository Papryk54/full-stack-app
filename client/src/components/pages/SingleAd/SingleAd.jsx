import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./SingleAd.module.scss";
import { IMGS_URL } from "./../../../../config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SingleAd = () => {
	const { id } = useParams();
	const [ad, setAd] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetch(`http://localhost:8000/ads/getById/${id}`)
			.then((res) => res.json())
			.then((data) => setAd(data))
			.catch((err) => console.error(err));
	}, [id]);

	const user = useSelector((state) => state.user);

	if (!ad) return <div>Loading...</div>;

	return (
		<div className={styles.singleAdPage}>
			<header className={styles.header}>
				<h2>Ad Details</h2>
			</header>

			<main className={styles.main}>
				<div className={styles.imageSection}>
					<img src={IMGS_URL + encodeURIComponent(ad.image)} alt={ad.title} />
				</div>

				<div className={styles.detailsSection}>
					<h3>{ad.title}</h3>
					<div className={styles.editButton}>
						{user._id === ad.sellerInfo && (
							<Link to={`/edit/${ad._id}`}>
								<button className={styles.addOffer}>Edit</button>
							</Link>
						)}
					</div>
					<p>
						<strong>Location:</strong> <br></br> {ad.location}
					</p>
					<p>
						<strong>Description:</strong> <br></br> {ad.description}
					</p>
					<p>
						<strong>Price:</strong> <br></br> {ad.price} $
					</p>
					<p>
						<strong>Publish date:</strong> <br></br>
						{ad.publishDate.slice(0, 10)}
					</p>
					<p>
						<strong>Seller: </strong>
						<br></br>
						{ad.sellerName}
					</p>
				</div>
			</main>
		</div>
	);
};

export default SingleAd;
