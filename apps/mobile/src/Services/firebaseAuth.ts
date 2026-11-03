import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";

import { auth } from "./firebaseConfig";

import { DEV_SKIP_AUTH } from "../config/devAuth";

export async function criarContaComEmailSenha(
  nome: string,
  email: string,
  senha: string,
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    senha,
  );

  if (nome.trim()) {
    await updateProfile(userCredential.user, {
      displayName: nome.trim(),
    });
  }

  return userCredential.user;
}

export async function loginComEmailSenha(email: string, senha: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    senha,
  );

  return userCredential.user;
}

export async function logoutFirebase() {
  await signOut(auth);
}

export function observarUsuarioLogado(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function buscarUsuarioAtual() {
  return auth.currentUser;
}

export function buscarEmailUsuarioAtual() {
  if (DEV_SKIP_AUTH) {
    return "dev@reuse.app";
  }

  return auth.currentUser?.email ?? null;
}
