import LoginForm from "../components/LoginForm/LoginForm";
import Hero from "../components/Hero/Hero";

function LoginPage() {
  return (
    <div>
      <Hero
        title="Connexion"
        subtitle="Connectez-vous pour accéder à votre compte"
        imageUrl="assets/images/hero.webp"
      />
      <LoginForm />
    </div>
  );
}

export default LoginPage;
