document.getElementById("cadastroForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede envio até validar

  let nome = document.getElementById("nome").value.trim();
  let cpf = document.getElementById("cpf").value.trim();
  let dataNasc = document.getElementById("dataNasc").value;
  let email = document.getElementById("email").value.trim();
  let telefone = document.getElementById("telefone").value.trim();

  // ===== Validações =====
  if (nome.length < 3) {
    alert("⚠️ O nome deve ter pelo menos 3 caracteres.");
    return;
  }

  if (!validarCPF(cpf)) {
    alert("⚠️ CPF inválido. Digite um número válido com 11 dígitos.");
    return;
  }

  if (!validarIdade(dataNasc)) {
    alert("⚠️ Você deve ter pelo menos 12 anos para se cadastrar.");
    return;
  }

  if (!validarEmail(email)) {
    alert("⚠️ Digite um email válido.");
    return;
  }

  if (telefone && telefone.replace(/\D/g, "").length < 8) {
    alert("⚠️ O número de telefone deve ter pelo menos 8 dígitos.");
    return;
  }

  // Se tudo OK
  alert("✅ Formulário enviado com sucesso!");
  this.submit();
});

// ===== Função CPF =====
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// ===== Função Idade =====
function validarIdade(data) {
  if (!data) return false;
  let nasc = new Date(data);
  let hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  let m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 12;
}

// ===== Função Email =====
function validarEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
