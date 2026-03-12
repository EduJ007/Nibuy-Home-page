import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

interface Props {
  mode: "login" | "signup";
  onClose: () => void;
}

const AuthModal = ({ mode, onClose }: Props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {

      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      onClose();

    } catch (err) {
      alert("Erro: " + (err as any).message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-xl w-[350px]">

        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-[#ff5722] text-white py-2 rounded font-bold"
        >
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-500"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
};

export default AuthModal;