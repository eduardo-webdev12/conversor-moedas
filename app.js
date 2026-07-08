// ================================================================ */
// CONVERSOR DE MOEDAS - JAVASCRIPT                               */
// ================================================================ */
// 
// 📖 SOBRE ESTE PROJETO:
// Este é meu primeiro projeto completo em JavaScript puro.
// Quis criar algo útil e que mostrasse meus conhecimentos.
// 
// 🧠 O QUE APRENDI COM ESTE PROJETO:
// - Como consumir uma API REST
// - Como manipular o DOM
// - Como usar localStorage para persistência
// - Como fazer um design responsivo
// - Como estruturar um projeto JavaScript
// 
// 🚀 PRÓXIMOS PASSOS:
// - Adicionar mais moedas
// - Criar gráficos de histórico
// - Fazer deploy na Vercel

// ================================================================ */
// CONFIGURAÇÕES                                                  */
// ================================================================ */

// 
// 💰 MOEDAS DISPONÍVEIS:
// Escolhi 9 moedas principais para começar.
// Quero adicionar mais no futuro, como criptomoedas.
// 
const CURRENCIES = [
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
    { code: 'USD', name: 'Dólar Americano', symbol: 'US$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
    { code: 'JPY', name: 'Iene Japonês', symbol: '¥' },
    { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$' },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
    { code: 'CHF', name: 'Franco Suíço', symbol: 'Fr' },
    { code: 'CNY', name: 'Yuan Chinês', symbol: '¥' }
];

// 
// 🌐 API DE CÂMBIO:
// Usei a ExchangeRate-API porque é gratuita e fácil de usar.
// 
// ⚠️ LIMITAÇÕES:
// - 1500 requisições/mês no plano gratuito
// - Atualização diária das taxas
// 
// 🔮 FUTURO:
// - Adicionar fallback para outra API
// - Cache das requisições
// 
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// ================================================================ */
// FUNÇÕES AUXILIARES                                             */
// ================================================================ */

// 
// 💵 FORMATAR MOEDA:
// Aprendi que formatar valores é importante para a experiência do usuário.
// Cada país tem seu próprio formato e símbolo.
// 
function formatCurrency(value, currency = 'BRL') {
    const symbols = {
        BRL: 'R$', USD: '$', EUR: '€', GBP: '£',
        JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'Fr', CNY: '¥'
    };
    const symbol = symbols[currency] || currency;
    return `${symbol} ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// 
// 📅 FORMATAR DATA:
// Usei o toLocaleString para formatar no padrão brasileiro.
// Aprendi que datas precisam ser bem formatadas para o usuário.
// 
function formatDate(date) {
    return date.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

// ================================================================ */
// CLASSE PRINCIPAL                                               */
// ================================================================ */

// 
// 🎯 CLASSE CONVERSOR:
// Usei uma classe para organizar o código.
// Aprendi que classes ajudam a manter o código mais limpo e organizado.
// 
class CurrencyConverterApp {
    constructor() {
        // 📋 Histórico de conversões
        this.history = [];
        
        console.log('🚀 Conversor de Moedas iniciado!');
        console.log('👨‍💻 Desenvolvido por Eduardo de Lima Melo');
        
        // Iniciar a aplicação
        this.init();
    }

    // ============================================================== */
    // INICIALIZAÇÃO                                                */
    // ============================================================== */
    
    init() {
        console.log('📋 Inicializando...');
        this.populateCurrencySelects();
        this.setupEventListeners();
        this.loadHistory();
    }

    // ============================================================== */
    // POPULAR SELECTS                                              */
    // ============================================================== */
    
    // 
    // 🔄 POPULAR SELECTS:
    // Percorro a lista de moedas e adiciono cada uma como opção.
    // Aprendi a usar createElement e appendChild para manipular o DOM.
    // 
    populateCurrencySelects() {
        const fromSelect = document.getElementById('from-currency');
        const toSelect = document.getElementById('to-currency');

        console.log('🔄 Populando selects...');

        if (!fromSelect || !toSelect) {
            console.error('❌ Selects não encontrados!');
            return;
        }

        // Limpar selects (por segurança)
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        // Adicionar cada moeda como opção
        CURRENCIES.forEach(currency => {
            // Opção para "De"
            const option1 = document.createElement('option');
            option1.value = currency.code;
            option1.textContent = `${currency.code} - ${currency.name}`;
            fromSelect.appendChild(option1);

            // Opção para "Para"
            const option2 = document.createElement('option');
            option2.value = currency.code;
            option2.textContent = `${currency.code} - ${currency.name}`;
            toSelect.appendChild(option2);
        });

        // Valores padrão: Dólar → Real
        fromSelect.value = 'USD';
        toSelect.value = 'BRL';

        console.log('✅ Selects populados!');
        console.log('📤 De:', fromSelect.value);
        console.log('📥 Para:', toSelect.value);
    }

    // ============================================================== */
    // EVENTOS                                                     */
    // ============================================================== */
    
    // 
    // 🎯 CONFIGURAR EVENTOS:
    // Aprendi a usar addEventListener para escutar ações do usuário.
    // 
    setupEventListeners() {
        // Formulário de conversão
        const form = document.getElementById('conversion-form');
        if (form) {
            form.addEventListener('submit', this.handleConversion.bind(this));
            console.log('✅ Formulário configurado');
        } else {
            console.error('❌ Formulário não encontrado!');
        }

        // Botão de troca de moedas
        const swapBtn = document.querySelector('.swap-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', this.swapCurrencies.bind(this));
            console.log('✅ Botão swap configurado');
        }
    }

    // 
    // 🔄 TROCAR MOEDAS:
    // Essa função troca a moeda de origem com a de destino.
    // É um detalhe simples, mas que melhora muito a usabilidade.
    // 
    swapCurrencies() {
        const fromSelect = document.getElementById('from-currency');
        const toSelect = document.getElementById('to-currency');
        
        if (fromSelect && toSelect) {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            console.log('🔄 Moedas trocadas:', fromSelect.value, '↔', toSelect.value);
        }
    }

    // ============================================================== */
    // CONVERSÃO                                                    */
    // ============================================================== */
    
    // 
    // 🔄 CONVERTER:
    // Essa é a função mais importante do projeto!
    // 
    // O FLUXO É:
    // 1. Pegar os valores do formulário
    // 2. Validar os dados
    // 3. Chamar a API
    // 4. Mostrar o resultado
    // 5. Salvar no histórico
    // 
    async handleConversion(event) {
        // Prevenir recarregamento da página
        event.preventDefault();

        // Pegar elementos do DOM
        const fromSelect = document.getElementById('from-currency');
        const toSelect = document.getElementById('to-currency');
        const amountInput = document.getElementById('amount');

        // Validar elementos
        if (!fromSelect || !toSelect || !amountInput) {
            this.showError('Erro nos campos do formulário');
            return;
        }

        // Pegar valores
        const from = fromSelect.value;
        const to = toSelect.value;
        const amount = parseFloat(amountInput.value);

        // Validar valor
        if (!amount || amount <= 0) {
            this.showError('Por favor, insira um valor válido');
            return;
        }

        // Mostrar loading no botão
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '🔄 Convertendo...';
            submitBtn.disabled = true;
        }

        try {
            // 🔥 CHAMADA PARA A API:
            // Aqui acontece a mágica! Buscamos as taxas de câmbio em tempo real.
            // 
            // ⚠️ DESAFIO:
            // Tive que lidar com erros de rede e de API.
            // Aprendi a usar try/catch e a mostrar mensagens amigáveis para o usuário.
            // 
            const response = await fetch(`${API_URL}${from}`);
            
            if (!response.ok) {
                throw new Error('Erro na API');
            }
            
            const data = await response.json();
            
            if (!data.rates || !data.rates[to]) {
                throw new Error('Moeda não encontrada');
            }

            // Calcular conversão
            const rate = data.rates[to];
            const result = amount * rate;

            // Criar objeto com os dados da conversão
            const conversionResult = {
                from,
                to,
                amount,
                result,
                rate,
                timestamp: new Date()
            };

            // Mostrar resultado e salvar histórico
            this.displayResult(conversionResult);
            this.saveToHistory(conversionResult);
            this.updateHistory();
            
        } catch (error) {
            // 
            // 🐛 TRATAMENTO DE ERROS:
            // Aprendi que é importante mostrar mensagens amigáveis
            // em vez de deixar o erro "cru" para o usuário.
            // 
            console.error('Erro na conversão:', error);
            this.showError('Erro na conversão. Tente novamente.');
        } finally {
            // Restaurar botão
            if (submitBtn) {
                submitBtn.textContent = '🔄 Converter';
                submitBtn.disabled = false;
            }
        }
    }

    // ============================================================== */
    // EXIBIR RESULTADO                                             */
    // ============================================================== */
    
    // 
    // 📊 MOSTRAR RESULTADO:
    // Usei template strings para criar o HTML do resultado.
    // Aprendi que é uma forma prática de gerar conteúdo dinâmico.
    // 
    displayResult(result) {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-card" style="animation: fadeIn 0.5s;">
                    <div class="result-amount">
                        ${formatCurrency(result.amount, result.from)} 
                        <span class="arrow">→</span> 
                        ${formatCurrency(result.result, result.to)}
                    </div>
                    <div class="result-detail">
                        💱 Taxa: 1 ${result.from} = ${result.rate.toFixed(4)} ${result.to}
                    </div>
                    <div class="result-date">
                        🕐 ${formatDate(result.timestamp)}
                    </div>
                </div>
            `;
        }
    }

    // ============================================================== */
    // HISTÓRICO                                                    */
    // ============================================================== */
    
    // 
    // 💾 SALVAR HISTÓRICO:
    // Usei localStorage para persistir os dados.
    // Aprendi que é uma forma simples de salvar dados no navegador.
    // 
    // 🔮 FUTURO:
    // - Salvar histórico no backend
    // - Exportar para CSV
    // - Limpar histórico
    // 
    saveToHistory(result) {
        // Adicionar no início do array (mais recente primeiro)
        this.history.unshift(result);
        
        // Manter apenas as 10 últimas conversões
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        // Salvar no localStorage
        try {
            localStorage.setItem('conversion-history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }

    // 
    // 📂 CARREGAR HISTÓRICO:
    // Quando a página carrega, recupero o histórico salvo.
    // 
    loadHistory() {
        try {
            const saved = localStorage.getItem('conversion-history');
            if (saved) {
                this.history = JSON.parse(saved);
                this.updateHistory();
                console.log('📂 Histórico carregado:', this.history.length, 'itens');
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    }

    // 
    // 🔄 ATUALIZAR HISTÓRICO:
    // Atualizo a lista visual com os dados salvos.
    // 
    updateHistory() {
        const historyDiv = document.getElementById('history');
        if (!historyDiv) return;

        if (this.history.length === 0) {
            historyDiv.innerHTML = '<p class="no-history">📭 Nenhuma conversão realizada</p>';
            return;
        }

        // Gerar HTML para cada item do histórico
        historyDiv.innerHTML = this.history.map(item => `
            <div class="history-item">
                <span>${formatCurrency(item.amount, item.from)} → ${formatCurrency(item.result, item.to)}</span>
                <span class="history-date">${formatDate(new Date(item.timestamp))}</span>
            </div>
        `).join('');
    }

    // ============================================================== */
    // ERROS                                                        */
    // ============================================================== */
    
    // 
    // ❌ MOSTRAR ERRO:
    // Criei uma função centralizada para mostrar erros.
    // Assim mantenho consistência e facilidade de manutenção.
    // 
    showError(message) {
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            // Esconder após 3 segundos
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
}

// ================================================================ */
// INICIAR APLICAÇÃO                                              */
// ================================================================ */

// 
// 🚀 START:
// Aprendi que é importante esperar o DOM carregar antes de executar o código.
// 
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado!');
    console.log('========================================');
    console.log('💱 CONVERSOR DE MOEDAS');
    console.log('👨‍💻 Eduardo de Lima Melo');
    console.log('📅', new Date().toLocaleDateString('pt-BR'));
    console.log('========================================');
    
    new CurrencyConverterApp();
});

// 
// ================================================================ */
// FIM DO CÓDIGO                                                  */
// ================================================================ */
// 
// OBRIGADO POR LER ATÉ AQUI! 🚀
// 
// Se quiser contribuir ou dar feedback, é só me chamar!
// LinkedIn: https://linkedin.com/in/eduardo-de-lima-melo
// GitHub: https://github.com/eduardo-webdev12
// 
// ================================================================ */