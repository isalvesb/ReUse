import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { buscarEnderecoPorCep, CepResponse } from "../../Services/Cep";
import styles from "./styles";

type CepInputProps = {
  onAddressFound: (address: CepResponse) => void;
  onCepChange?: (cep: string) => void;
};

export function CepInput({ onAddressFound, onCepChange }: CepInputProps) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCepChange(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    const formattedCep = onlyNumbers.replace(/^(\d{5})(\d{0,3})/, "$1-$2");

    setCep(formattedCep);
    setErrorMessage("");

    if (onCepChange) {
      onCepChange(onlyNumbers);
    }

    if (onlyNumbers.length !== 8) {
      return;
    }

    try {
      setLoading(true);

      const address = await buscarEnderecoPorCep(onlyNumbers);

      onAddressFound(address);
    } catch (error) {
      setErrorMessage("CEP não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CEP</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={cep}
          onChangeText={handleCepChange}
          placeholder="Digite seu CEP"
          placeholderTextColor="#8A7F7F"
          keyboardType="numeric"
          maxLength={9}
          style={styles.input}
        />

        {loading && <ActivityIndicator size="small" />}
      </View>

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}