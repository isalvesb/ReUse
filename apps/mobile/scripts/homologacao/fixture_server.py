# Servidor exclusivo de homologação: dados fictícios, vínculo somente em loopback.
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from urllib.parse import urlsplit,parse_qs,unquote
from pathlib import Path
import json,datetime,argparse
parser=argparse.ArgumentParser(description='API fictícia local. Não substitui os provedores reais do ReUse.')
parser.add_argument('--data-dir',required=True,type=Path)
parser.add_argument('--port',type=int,default=4335)
args=parser.parse_args()
project=Path(__file__).resolve().parents[2]
root=args.data_dir.resolve();root.mkdir(parents=True,exist_ok=True)
uploads=root/'mobile-fixture-images';uploads.mkdir(exist_ok=True)
store=root/'mobile-fixture-data.json'
if not store.exists():
 item=dict(id=1001,title='Cadeira fictícia de homologação',category='Móveis',item_condition='bom_estado',description='Anúncio fictício destinado exclusivamente aos testes locais do aplicativo mobile.',location='Bela Vista, São Paulo - SP',user_email='dev@reuse.app',created_at=datetime.datetime.now(datetime.UTC).isoformat(),images=[f'http://127.0.0.1:{args.port}/fixture-a.jpg',f'http://127.0.0.1:{args.port}/fixture-b.jpg'],price=None,size=None,cep=None,street=None,neighborhood='Bela Vista',city='São Paulo',state='SP',item_type='doacao')
 store.write_text(json.dumps([item],ensure_ascii=False))
class Handler(BaseHTTPRequestHandler):
 def log_message(self,fmt,*args):
  with (root/'mobile-fixture-requests.txt').open('a') as log:log.write(self.command+' '+urlsplit(self.path).path+'\n')
 def send(self,status,data=None,headers=None):
  body=json.dumps(data,ensure_ascii=False).encode() if data is not None else b''
  self.send_response(status)
  for k,v in {'Content-Type':'application/json','Content-Length':str(len(body)),**(headers or {})}.items():self.send_header(k,v)
  self.end_headers()
  if self.command!='HEAD':self.wfile.write(body)
 def items(self):
  rows=json.loads(store.read_text());qs=parse_qs(urlsplit(self.path).query)
  for key in ['id','user_email']:
   wanted=qs.get(key,[''])[0]
   if wanted.startswith('eq.'):rows=[x for x in rows if str(x.get(key))==wanted[3:]]
  return rows
 def do_HEAD(self):self.do_GET()
 def do_GET(self):
  path=unquote(urlsplit(self.path).path)
  if path=='/rest/v1/items':
   rows=self.items();single='application/vnd.pgrst.object+json' in self.headers.get('Accept','')
   return self.send(200,rows[0] if single and rows else rows,{'Content-Range':f'0-{max(0,len(rows)-1)}/{len(rows)}'})
  file=None
  if path in ['/fixture-a.jpg','/fixture-b.jpg']:
   file=(project/'assets/images/itens')/('cadeira.jpg' if path=='/fixture-a.jpg' else 'teclado.jpg')
  elif path.startswith('/storage/v1/object/public/item-images/'):
   candidate=(uploads/path.split('/item-images/',1)[1]).resolve()
   if uploads.resolve() in candidate.parents:file=candidate
  if file and file.is_file():
   body=file.read_bytes();self.send_response(200);self.send_header('Content-Type','image/jpeg');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body);return
  return self.send(404,{'message':'Endpoint inexistente no servidor fictício de homologação.'})
 def do_POST(self):
  path=unquote(urlsplit(self.path).path);body=self.rfile.read(int(self.headers.get('Content-Length','0')))
  if path=='/rest/v1/items':
   rows=json.loads(store.read_text());incoming=json.loads(body);item=(incoming[0] if isinstance(incoming,list) else incoming);item.update(id=max([x['id'] for x in rows],default=1000)+1,created_at=datetime.datetime.now(datetime.UTC).isoformat());rows.insert(0,item);store.write_text(json.dumps(rows,ensure_ascii=False));return self.send(201,item)
  if path.startswith('/storage/v1/object/item-images/'):
   name=path.split('/item-images/',1)[1];file=(uploads/name).resolve()
   if uploads.resolve() not in file.parents:return self.send(400,{'message':'Caminho inválido.'})
   file.parent.mkdir(parents=True,exist_ok=True);file.write_bytes(body);return self.send(200,{'Key':'item-images/'+name})
  self.send(403,{'message':'Somente operações fictícias locais permitidas.'})
 def do_PATCH(self):
  if urlsplit(self.path).path!='/rest/v1/items':return self.send(403,{'message':'Operação não permitida.'})
  update=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))));rows=json.loads(store.read_text());ids={x['id'] for x in self.items()}
  for row in rows:
   if row['id'] in ids:row.update(update)
  store.write_text(json.dumps(rows,ensure_ascii=False));return self.send(200,next(row for row in rows if row['id'] in ids))
print(f'API FICTÍCIA em http://127.0.0.1:{args.port}; dados: {root}',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
