import React, { useState } from "react";

function App() {
	const [searches, setSearches] = useState([
		{ firstName: "", lastName: "", businessName: "" },
	]);
	const [message, setMessage] = useState("");

	const handleChange = (index, e) => {
		const { name, value } = e.target;
		const updatedSearches = [...searches];
		updatedSearches[index][name] = value;
		setSearches(updatedSearches);
	};

	const addSearch = () => {
		if (searches.length < 5) {
			setSearches([
				...searches,
				{ firstName: "", lastName: "", businessName: "" },
			]);
		} else {
			setMessage("You can only add up to 5 searches.");
		}
	};

	const removeSearch = (index) => {
		const updatedSearches = searches.filter((_, i) => i !== index);
		setSearches(updatedSearches);
		setMessage(""); // Reset the message if they remove searches
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("Submitting searches...");

		try {
			const responses = await Promise.all(
				searches.map((search) =>
					fetch("http://localhost:5001/api/namesearch", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(search),
					}).then((res) => res.json())
				)
			);

			console.log("Searches submitted:", responses);
			setMessage("✅ Searches submitted successfully!");
		} catch (error) {
			console.error("Error submitting searches:", error);
			setMessage("❌ Error submitting searches.");
		}
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>NameSafe - Property Deed Monitor</h1>
			<p>Monitor up to 5 names for new records.</p>

			<form onSubmit={handleSubmit}>
				{searches.map((search, index) => (
					<div
						key={index}
						style={{
							marginBottom: "15px",
							border: "1px solid #ccc",
							padding: "10px",
						}}>
						<input
							type="text"
							name="firstName"
							placeholder="First Name (optional)"
							value={search.firstName}
							onChange={(e) => handleChange(index, e)}
						/>
						<input
							type="text"
							name="lastName"
							placeholder="Last Name"
							value={search.lastName}
							onChange={(e) => handleChange(index, e)}
							required
						/>
						<input
							type="text"
							name="businessName"
							placeholder="Business Name (optional)"
							value={search.businessName}
							onChange={(e) => handleChange(index, e)}
						/>
						{searches.length > 1 && (
							<button
								type="button"
								onClick={() => removeSearch(index)}>
								Remove
							</button>
						)}
					</div>
				))}

				{searches.length < 5 && (
					<button
						type="button"
						onClick={addSearch}>
						+ Add Another Search
					</button>
				)}

				<br />
				<button type="submit">Submit Searches</button>
			</form>

			{message && <p>{message}</p>}
		</div>
	);
}

export default App;
