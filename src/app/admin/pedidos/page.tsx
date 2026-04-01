import { MercadoPagoConfig, Payment } from 'mercadopago';

// Força a página a sempre buscar dados novos do MP na hora de carregar (Não usa cache antigo da Vercel)
export const dynamic = 'force-dynamic';

export default async function AdminPedidos() {
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
  let payments = [];
  let errorMsg = "";

  try {
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);

    // Busca os últimos 50 pagamentos aprovados no Mercado Pago
    const result = await payment.search({
      options: {
        status: 'approved',
        sort: 'date_created',
        criteria: 'desc',
        limit: 50,
      }
    });

    payments = result.results || [];
  } catch (err: unknown) {
    const e = err as Error;
    errorMsg = "Erro ao buscar no Mercado Pago: " + e.message;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-black text-amber-500">PAINEL DE ENTREGAS 📦</h1>
            <p className="text-gray-400 mt-2">Os dados dos clientes são puxados direto do Mercado Pago. Nenhum dado de endereço será perdido.</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg font-bold">
            Total Encontrado: <span className="text-green-400">{payments.length} Vendas</span>
          </div>
        </header>

        {errorMsg && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg text-red-200 mb-6">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6">
          {payments.map((p: any) => {
            const address = p.additional_info?.payer?.address || p.payer?.address || {};
            const phone = p.additional_info?.payer?.phone || p.payer?.phone || {};
            const items = p.additional_info?.items || [];
            
            return (
              <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  APROVADO
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info Pessoal */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-amber-400 mb-4 border-b border-gray-700 pb-2">Comprador</h2>
                    <p className="font-semibold text-lg">{p.payer?.first_name} {p.payer?.last_name || ""}</p>
                    <p className="text-gray-300">📧 {p.payer?.email}</p>
                    <p className="text-gray-300">📱 ({phone.area_code || ""}) {phone.number || "Sem telefone"}</p>
                    <p className="text-gray-300 mt-2 text-sm">CPF/CNPJ: {p.payer?.identification?.number || "Não informado"}</p>
                  </div>

                  {/* Info Endereço */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-700 pb-2">Endereço de Entrega</h2>
                    {address.street_name ? (
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="font-mono text-lg">{address.zip_code}</p>
                        <p>{address.street_name}, nº {address.street_number}</p>
                        <p>Bairro: {address.neighborhood || "Centro"}</p>
                        <p>{address.city} - {address.federal_unit}</p>
                      </div>
                    ) : (
                      <p className="text-red-400 italic">Endereço não recebido do cliente nesta transação antiga.</p>
                    )}
                  </div>

                  {/* Info Produto */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-emerald-400 mb-4 border-b border-gray-700 pb-2">O que entregar?</h2>
                    
                    {items.length > 0 ? (
                      items.map((item: any, i: number) => (
                        <p key={i} className="font-bold text-lg mb-1">{item.quantity}x {item.title || item.description}</p>
                      ))
                    ) : (
                      <p className="font-bold text-lg">{p.description || "Produto Genérico"}</p>
                    )}
                    
                    <p className="text-3xl font-black mt-4">R$ {p.transaction_amount?.toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-gray-400 mt-1">ID Pagamento: {p.id}</p>
                    <p className="text-xs text-gray-400 mt-1">Data: {new Date(p.date_created).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {payments.length === 0 && !errorMsg && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-2xl mb-2">Poxaaa...</p>
              <p>Nenhuma venda Aprovada encontrada no seu Mercado Pago ainda.</p>
              <p>Esperando os anúncios rodarem!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
