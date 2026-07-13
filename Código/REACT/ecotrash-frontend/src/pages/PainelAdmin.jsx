import { useState } from 'react';

const initialPoints = [
  { id: 1, nome: 'Ponto Central', municipio: 'Campinas', tipo: 'Reciclável', ativo: true },
  { id: 2, nome: 'EcoPosto Vila Nova', municipio: 'Campinas', tipo: 'Orgânico', ativo: true },
  { id: 3, nome: 'Coleta Norte', municipio: 'Indaiatuba', tipo: 'Eletroeletrônico', ativo: false },
];

const initialUsers = [
  { id: 1, nome: 'Ana Souza', email: 'ana@ecotrash.com', papel: 'Administrador', ativo: true },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@ecotrash.com', papel: 'Operador', ativo: true },
  { id: 3, nome: 'Carla Dias', email: 'carla@ecotrash.com', papel: 'Visualizador', ativo: false },
];

export default function PainelAdmin() {
  const [points, setPoints] = useState(initialPoints);
  const [users, setUsers] = useState(initialUsers);
  const [pointForm, setPointForm] = useState({ nome: '', municipio: '', tipo: '' });
  const [userForm, setUserForm] = useState({ nome: '', email: '', papel: 'Operador' });

  const handlePointSubmit = (event) => {
    event.preventDefault();

    if (!pointForm.nome || !pointForm.municipio || !pointForm.tipo) return;

    setPoints([
      ...points,
      {
        id: Date.now(),
        nome: pointForm.nome,
        municipio: pointForm.municipio,
        tipo: pointForm.tipo,
        ativo: true,
      },
    ]);
    setPointForm({ nome: '', municipio: '', tipo: '' });
  };

  const togglePoint = (id) => {
    setPoints(points.map((point) => (point.id === id ? { ...point, ativo: !point.ativo } : point)));
  };

  const removePoint = (id) => {
    setPoints(points.filter((point) => point.id !== id));
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();

    if (!userForm.nome || !userForm.email || !userForm.papel) return;

    setUsers([
      ...users,
      {
        id: Date.now(),
        nome: userForm.nome,
        email: userForm.email,
        papel: userForm.papel,
        ativo: true,
      },
    ]);
    setUserForm({ nome: '', email: '', papel: 'Operador' });
  };

  const toggleUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ativo: !user.ativo } : user)));
  };

  const removeUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Centralize a gestão de pontos de coleta e usuários da plataforma EcoTrash.</p>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <h2>Pontos de coleta</h2>
          <form className="admin-form" onSubmit={handlePointSubmit}>
            <input
              type="text"
              placeholder="Nome do ponto"
              value={pointForm.nome}
              onChange={(event) => setPointForm({ ...pointForm, nome: event.target.value })}
            />
            <input
              type="text"
              placeholder="Município"
              value={pointForm.municipio}
              onChange={(event) => setPointForm({ ...pointForm, municipio: event.target.value })}
            />
            <input
              type="text"
              placeholder="Tipo"
              value={pointForm.tipo}
              onChange={(event) => setPointForm({ ...pointForm, tipo: event.target.value })}
            />
            <button type="submit" className="btn btn-aceitar">
              Adicionar ponto
            </button>
          </form>

          <ul className="admin-list">
            {points.map((point) => (
              <li key={point.id} className="admin-list-item">
                <div>
                  <strong>{point.nome}</strong>
                  <p>
                    {point.municipio} · {point.tipo}
                  </p>
                </div>
                <div className="admin-actions">
                  <span className={`status-pill ${point.ativo ? 'active' : 'inactive'}`}>
                    {point.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <button type="button" className="btn-small" onClick={() => togglePoint(point.id)}>
                    {point.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button type="button" className="btn-small btn-danger" onClick={() => removePoint(point.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <h2>Usuários</h2>
          <form className="admin-form" onSubmit={handleUserSubmit}>
            <input
              type="text"
              placeholder="Nome do usuário"
              value={userForm.nome}
              onChange={(event) => setUserForm({ ...userForm, nome: event.target.value })}
            />
            <input
              type="email"
              placeholder="E-mail"
              value={userForm.email}
              onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
            />
            <select
              value={userForm.papel}
              onChange={(event) => setUserForm({ ...userForm, papel: event.target.value })}
            >
              <option value="Operador">Operador</option>
              <option value="Administrador">Administrador</option>
              <option value="Visualizador">Visualizador</option>
            </select>
            <button type="submit" className="btn btn-submit">
              Adicionar usuário
            </button>
          </form>

          <ul className="admin-list">
            {users.map((user) => (
              <li key={user.id} className="admin-list-item">
                <div>
                  <strong>{user.nome}</strong>
                  <p>
                    {user.email} · {user.papel}
                  </p>
                </div>
                <div className="admin-actions">
                  <span className={`status-pill ${user.ativo ? 'active' : 'inactive'}`}>
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <button type="button" className="btn-small" onClick={() => toggleUser(user.id)}>
                    {user.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button type="button" className="btn-small btn-danger" onClick={() => removeUser(user.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
