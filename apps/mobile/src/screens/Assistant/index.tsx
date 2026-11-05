import { useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../design/Text";
import { colors, font, radius, size, space, tokens } from "../../design/tokens";
import { AssistantApiError, AssistantConfirmation, AssistantItem, AssistantProposal, assistantRequest } from "../../lib/assistantApi";

type Entry = { role: "user" | "assistant"; origin?: "ibm" | "reuse"; text: string };
const suggestions = ["Como publicar uma doação?", "Quero pausar um anúncio meu", "Quero reativar um anúncio meu"];
export function AssistantScreen() {
  const navigation = useNavigation<any>(), insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<Entry[]>([{ role: "assistant", origin: "reuse", text: "Olá! Posso orientar o uso do ReUse e ajudar a pausar ou reativar um anúncio próprio. Você escolherá o anúncio e confirmará antes de qualquer alteração." }]);
  const [proposal, setProposal] = useState<AssistantProposal | null>(null);
  const [confirmation, setConfirmation] = useState<AssistantConfirmation | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [origin, setOrigin] = useState<"unknown" | "ibm" | "unavailable">("unknown");
  const working = useRef(false), scroll = useRef<ScrollView>(null);
  async function run(operation: () => Promise<void>) {
    if (working.current) return;
    working.current = true; setBusy(true); setError("");
    try { await operation(); }
    catch (failure) {
      setError(failure instanceof AssistantApiError ? failure.message : "Falha de conexão. O texto permanece disponível. Se você confirmou uma alteração, confira o anúncio antes de tentar novamente.");
      if (failure instanceof AssistantApiError) {
        if (failure.status === 503) setOrigin("unavailable");
        if ([401,409].includes(failure.status)) { setProposal(null); setConfirmation(null); }
      }
    } finally { working.current = false; setBusy(false); }
  }
  async function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    await run(async () => {
      const result = await assistantRequest<{ text: string; origin: "ibm"; proposal: AssistantProposal | null }>("messages", { message: clean });
      setEntries(current => [...current, { role: "user", text: clean }, { role: "assistant", origin: "ibm", text: result.text }]);
      setMessage(""); setOrigin("ibm"); setProposal(result.proposal); setConfirmation(null);
    });
  }
  async function select(itemId: string) {
    if (!proposal) return;
    await run(async () => {
      setConfirmation(await assistantRequest<AssistantConfirmation>("selection", { proposalToken: proposal.proposalToken, itemId }));
      setProposal(null);
    });
  }
  async function decide(decision: "confirm" | "cancel") {
    if (!confirmation) return;
    await run(async () => {
      const result = await assistantRequest<{ cancelled: boolean; item?: AssistantItem }>("confirm", { confirmationToken: confirmation.confirmationToken, decision });
      const text = result.cancelled ? "Solicitação cancelada. Nenhum anúncio foi alterado por esta confirmação." :
        `“${result.item!.title}”: ${result.item!.status === "INATIVO" ? "pausa" : "reativação"} persistida no ReUse.`;
      setEntries(current => [...current, { role: "assistant", origin: "reuse", text }]);
      setConfirmation(null);
    });
  }
  function action(label: string, onPress: () => void, primary = false, key = label) {
    return <Pressable key={key} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: busy }} disabled={busy} onPress={onPress}
      style={({pressed}) => [styles.button, primary && styles.primary, (pressed || busy) && styles.pressed]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
  }
  return <KeyboardAvoidingView style={[styles.page, { paddingTop: insets.top }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Voltar ao perfil" onPress={() => navigation.goBack()} style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <View style={{flex:1}}><Text accessibilityRole="header" style={styles.title}>Assistente ReUse</Text><Text style={styles.caption}>{origin === "ibm" ? "Resposta IBM verificada" : origin === "unavailable" ? "Assistente indisponível" : "IBM: aguardando primeira resposta"}</Text></View>
    </View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content} onContentSizeChange={() => { if (!proposal) scroll.current?.scrollToEnd({animated:true}); }}>
      <Text style={styles.caption}>Trial acadêmico: use apenas dados fictícios, sem dados pessoais ou credenciais. Perguntas independentes; o histórico desta tela não é enviado à IBM.</Text>
      {entries.map((entry, index) => <View key={index} style={[styles.bubble, entry.role === "user" && styles.mine]}>
        <Text style={[styles.label, entry.role === "user" && styles.inverse]}>{entry.role === "user" ? "Você" : entry.origin === "ibm" ? "IBM watsonx Orchestrate" : "ReUse"}</Text>
        <Text selectable style={[styles.body, entry.role === "user" && styles.inverse]}>{entry.text}</Text>
      </View>)}
      {busy && <ActivityIndicator accessibilityLabel="Aguarde a resposta" color={colors.text} />}
      {!!error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
      {proposal && <View style={styles.panel}><Text style={styles.label}>Escolha um anúncio para {proposal.intent === "PAUSAR" ? "pausar" : "reativar"}:</Text>
        {!proposal.items.length && <Text>Nenhum anúncio próprio elegível.</Text>}
        {proposal.items.map(item => action(item.title, () => void select(item.id), false, item.id))}
      </View>}
      {confirmation && <View style={styles.panel}><Text style={styles.label}>{confirmation.intent === "PAUSAR" ? "Pausar" : "Reativar"} somente “{confirmation.item.title}”?</Text>
        <Text style={styles.caption}>Confirmação válida por até cinco minutos, para este anúncio e esta sessão.</Text>
        {action(`Confirmar ${confirmation.intent === "PAUSAR" ? "pausa" : "reativação"}`, () => void decide("confirm"), true)}
        {action("Cancelar", () => void decide("cancel"))}
      </View>}
      <View style={styles.panel}>{suggestions.map(text => action(text, () => void send(text)))}</View>
    </ScrollView>
    <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
      <TextInput accessibilityLabel="Mensagem para o assistente" value={message} onChangeText={setMessage} placeholder="Como posso ajudar?" placeholderTextColor={colors.textMuted} maxLength={500} editable={!busy} multiline style={styles.input} />
      <Pressable accessibilityRole="button" accessibilityLabel="Enviar ao IBM" disabled={busy || !message.trim()} onPress={() => void send(message)} style={[styles.send, (busy || !message.trim()) && styles.pressed]}><Ionicons name="send" size={22} color={colors.text} /></Pressable>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  page: {flex:1,backgroundColor:colors.background}, header:{flexDirection:"row",alignItems:"center",gap:space.sm,padding:space.lg},
  back:{minWidth:size.touch,minHeight:size.touch,alignItems:"center",justifyContent:"center"}, title:{fontFamily:font.brand,fontSize:tokens.type.subtitle,color:colors.text},
  content:{padding:space.lg,gap:space.md,paddingBottom:space.xl},caption:{fontSize:tokens.type.caption,color:colors.textMuted,lineHeight:18},
  bubble:{backgroundColor:colors.surface,borderColor:colors.accent,borderWidth:1,borderRadius:radius.card,padding:space.lg,gap:space.xs,maxWidth:"96%",alignSelf:"flex-start"},
  mine:{alignSelf:"flex-end",backgroundColor:colors.navigation},inverse:{color:colors.inverse}, label:{fontFamily:font.bold,color:colors.text,fontSize:tokens.type.label,lineHeight:21},
  body:{fontSize:tokens.type.body,lineHeight:24,color:colors.text},panel:{gap:space.sm,paddingVertical:space.sm},
  button:{minHeight:size.touch,borderRadius:radius.control,borderWidth:1,borderColor:colors.border,paddingHorizontal:space.lg,paddingVertical:space.md,justifyContent:"center"},
  primary:{backgroundColor:colors.accent},buttonText:{fontFamily:font.medium,color:colors.text,fontSize:tokens.type.label,lineHeight:21},pressed:{opacity:tokens.opacity.disabled},
  error:{color:colors.error,lineHeight:22,borderColor:colors.error,borderWidth:1,borderRadius:radius.small,padding:space.md},
  composer:{flexDirection:"row",alignItems:"center",gap:space.sm,paddingHorizontal:space.lg,paddingTop:space.md,borderTopColor:colors.border,borderTopWidth:1},
  input:{flex:1,minHeight:size.control,maxHeight:120,borderColor:colors.border,borderWidth:1,borderRadius:radius.input,paddingHorizontal:space.lg,paddingVertical:space.md,color:colors.text,fontFamily:font.regular,fontSize:tokens.type.body},
  send:{width:size.control,height:size.control,borderRadius:radius.control,backgroundColor:colors.accent,alignItems:"center",justifyContent:"center"},
});
