import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditAd.module.scss";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const EditAd = () => {
	const { id } = useParams();
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("");
	const [image, setImage] = useState(null);
	const [currentImage, setCurrentImage] = useState("");
	const [alertVisible, setAlertVisible] = useState(false);

	useEffect(() => {
		fetch(`${apiUrl}/ads/getById/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setTitle(data.title || "");
				setDescription(data.description || "");
				setLocation(data.location || "");
				setPrice(data.price || "");
				setCurrentImage(data.image || "");
			})
			.catch(() => setAlertVisible(true));
	}, [apiUrl, id]);

	useEffect(() => {
		if (alertVisible) {
			const timer = setTimeout(() => {
				setAlertVisible(false);
			}, 3300);
			return () => clearTimeout(timer);
		}
	}, [alertVisible]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append("title", title);
		fd.append("description", description);
		fd.append("location", location);
		fd.append("price", price);
		fd.append("sellerInfo", user._id);
		if (image) {
			fd.append("image", image);
		} else {
			fd.append("image", currentImage);
		}

		try {
			const res = await fetch(`${apiUrl}/ads/update/${id}`, {
				method: "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error();
			navigate("/");
		} catch {
			setAlertVisible(true);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={`${styles.alert} ${!alertVisible ? styles.hidden : ""}`}>
				<p>Something went wrong...</p>
			</div>
			<p>Edit your ad:</p>
			<form onSubmit={handleSubmit}>
				<p>Title:</p>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<p>Description:</p>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<p>Image:</p>
				{!image && <p className={styles.currentImage}>{currentImage}</p>}
				{image && <p className={styles.fileChoosed}>{image.name}</p>}

				<input
					type="file"
					id="image"
					className={styles.image}
					onChange={(e) => setImage(e.target.files[0])}
				/>
				<label htmlFor="image" className={styles.customBtn}>
					<p>Upload New Image</p>
				</label>

				<p>Location:</p>
				<input
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>

				<p>Price:</p>
				<input
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>

				<button type="submit">Update</button>
			</form>
		</div>
	);
};

export default EditAd;
