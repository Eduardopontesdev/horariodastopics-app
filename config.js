// CONFIGURAÇÃO DO APP - preencha e salve. Vale para o app e para todas as páginas de rotas.
window.TOPICS_CFG={
  site:"https://SEU-DOMINIO",     // endereço final do app (sem barra no fim)
  ga:"",                    // ID do Google Analytics 4, ex.: "G-XXXXXXXXXX" (vazio = desligado)
  sb:{                      // contador no Supabase (vazio = desligado)
    url:"https://egfbvcfuizsyckmcnsue.supabase.co",                 // ex.: "https://abcdxyz.supabase.co"
    key:"sb_publishable_CqR1NHJWyPou4Hzah-jEkw_NTc5TM0D",                 // chave pública do projeto: "anon public" ou "publishable" (NUNCA a service_role/secret)
    table:"topics_acessos",   // nome da tabela onde cada acesso é gravado
    rpc:"topics_contagens",        // função que devolve os totais (veja supabase.sql). Vazio = não mostra números
    cols:{tipo:"tipo",pagina:"pagina",uid:"uid"}   // nomes das colunas; uid:false se a tabela não tiver
  }
};
