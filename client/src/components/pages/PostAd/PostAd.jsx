import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./PostAd.module.scss";

const PostAd = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("");
	const [alertVisible, setAlertVisible] = useState(false);
	const user = useSelector((state) => state.user);
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
		fd.append("title", title);
		fd.append("description", description);
		fd.append("image", image);
		fd.append("location", location);
		fd.append("price", price);
		fd.append("publishDate", new Date().toISOString());
		fd.append("sellerInfo", user._id);
		fd.append("sellerName", user.login);

		const options = {
			method: "POST",
			body: fd,
		};

		try {
			const res = await fetch(`${apiUrl}/ads/create`, options);
			if (!res.ok) throw new Error("Action failed");
			navigate("/");
		} catch (err) {
			setAlertVisible(false);
			console.error("Something went wrong...");
		}
	};
	return (
		<div className={styles.wrapper}>
			<div className={`${styles.alert} ${!alertVisible ? styles.hidden : ""}`}>
				<p>Something went wrong...</p>
			</div>
			<p>Make your own ad:</p>
			<form onSubmit={handleSubmit}>
				<p>Title:</p>
				<input
					type="text"
					placeholder="(10-50 characters)"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<p>Descryption:</p>
				<textarea
					placeholder="(Max. 2000 characters)"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<p>Image:</p>
				<input
					type="file"
					id="image"
					className={styles.image}
					onChange={(e) => setImage(e.target.files[0])}
				/>
				<label htmlFor="image" className={styles.customBtn}>
					{!image && <p>Upload Image</p>}
					{image && <p className={styles.fileChoosed}>{image.name}</p>}
				</label>

				<p>Location:</p>
				<input
					type="text"
					placeholder="eg. Warsaw"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>

				<p>Price:</p>
				<input
					type="number"
					id="avatar"
					placeholder="eg. 99.99"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default PostAd;
