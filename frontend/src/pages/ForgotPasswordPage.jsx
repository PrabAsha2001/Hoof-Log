import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import InputBox from "../components/InputBox";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<div>
			<h2>Forgot Password</h2>

			{!isSubmitted ? (
				<form onSubmit={handleSubmit}>
					<p>
						Enter your email address and we'll send you a link to reset your password.
					</p>
					<InputBox
						icon={Mail}
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button type="submit">
						{isLoading ? <Loader /> : "Send Reset Link"}
					</button>
				</form>
			) : (
				<div>
					<div>
						<Mail />
					</div>
					<p>
						If an account exists for {email}, you will receive a password reset link shortly.
					</p>
				</div>
			)}

			<div>
				<Link to="/login">
					<ArrowLeft /> Back to Login
				</Link>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
