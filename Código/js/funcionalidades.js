// Voltar Solicitar Coleta
if (document.querySelector("button.btn-back") != null) {
    document.querySelector("button.btn-back").addEventListener("click", () => window.location.href = "./index.html" )
}
// Voltar Painel Município
if (document.querySelector(".btn-voltar") != null) {
    document.querySelector(".btn-voltar").addEventListener("click", () => { window.history.go(-1)})
}