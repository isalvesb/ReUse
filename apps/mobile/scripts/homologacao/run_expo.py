# Nunca carrega .env nem aponta para bancos reais. Exige cópia independente.
import os,subprocess
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description='Expo local com provedores fictícios e dotenv desativado.')
parser.add_argument('--project',required=True,type=Path)
parser.add_argument('--port',type=int,default=4330)
parser.add_argument('--api-port',type=int,default=4335)
args=parser.parse_args()
root=args.project.resolve()
if root == Path(__file__).resolve().parents[2]:
 parser.error('Use uma cópia independente do projeto para preservar o diretório de desenvolvimento.')
env={k:os.environ[k] for k in ['PATH','HOME','TMPDIR','LANG','SHELL'] if k in os.environ}
env.update({'NODE_OPTIONS':'--dns-result-order=ipv4first','EXPO_NO_DOTENV':'1','EXPO_OFFLINE':'1','EXPO_NO_TELEMETRY':'1','EXPO_PUBLIC_DEV_SKIP_AUTH':'true','EXPO_PUBLIC_SUPABASE_URL':f'http://127.0.0.1:{args.api_port}','EXPO_PUBLIC_SUPABASE_ANON_KEY':'homologacao-local-sem-provedor','EXPO_PUBLIC_FIREBASE_API_KEY':'AIzaSyHomologacaoLocalSemProvedor00000000','EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN':'localhost','EXPO_PUBLIC_FIREBASE_PROJECT_ID':'reuse-homologacao-local','EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET':'localhost','EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID':'123456789','EXPO_PUBLIC_FIREBASE_APP_ID':'1:123456789:ios:0000000000000000','EXPO_PUBLIC_FACEBOOK_APP_ID':'000000000000000','EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN':'00000000000000000000000000000000'})
if __name__ == '__main__': subprocess.run(['node','node_modules/expo/bin/cli','start','--localhost','--port',str(args.port),'--dev-client'],cwd=root,env=env,check=True)
