import { useEffect, useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { buscarEnderecoPorCep, CepResponse } from "../../Services/Cep";
import styles from "./styles";

type CepInputProps = {
  value?: string;
  onAddressFound: (address: CepResponse) => void;
  onCepChange?: (cep: string) => void;
};

function formatCep(value: string) {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);

  if (onlyNumbers.length > 5) {
    return onlyNumbers.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
  }

  return onlyNumbers;
}

export function CepInput({ value = "", onAddressFound, onCepChange }: CepInputProps) {
  const [cep, setCep] = useState(formatCep(value));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCep(formatCep(value));
  }, [value]);

  async function handleCepChange(value: string) {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
    const formattedCep = formatCep(onlyNumbers);

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