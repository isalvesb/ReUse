export default function CatalogUnavailable() {
    return <div role="status" className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-reuse-brown">
        <h2 className="font-bold">O catálogo está temporariamente indisponível</h2>
        <p className="mt-2 text-sm">Não foi possível consultar os anúncios. Tente novamente em instantes.</p>
        <a href="" className="mt-3 inline-block font-semibold underline">Tentar novamente</a>
    </div>;
}
