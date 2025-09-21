import { useState } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import Hero from "../components/Hero/Hero";
import Modal from "../components/Modal/Modal";

function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Hero
        title="Connexion"
        subtitle="Connectez-vous pour accéder à votre compte"
        imageUrl="assets/images/hero.webp"
      />

      <button onClick={() => setIsModalOpen(true)}>Se connecter</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm />
      </Modal>
    </div>
  );
}

export default LoginPage;
