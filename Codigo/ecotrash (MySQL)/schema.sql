-- ============================================================
--  EcoTrash — Schema MySQL
--  Execute este arquivo no seu banco de dados MySQL gratuito
--  (Clever Cloud, Railway, FreeSQLDatabase.com, ou XAMPP local)
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecotrash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecotrash;

-- Tabela de municípios (prefeituras parceiras)
CREATE TABLE IF NOT EXISTS municipios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email_oficial VARCHAR(255) NOT NULL UNIQUE,
  senha         VARCHAR(255) NOT NULL,
  telefone      VARCHAR(20),
  estado        VARCHAR(2)   NOT NULL,
  cidade        VARCHAR(100) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de solicitações de coleta
CREATE TABLE IF NOT EXISTS coletas (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(255) NOT NULL,
  cpf              VARCHAR(14)  NOT NULL,
  email            VARCHAR(255),
  telefone         VARCHAR(20),
  estado           VARCHAR(2),
  cidade           VARCHAR(100),
  bairro           VARCHAR(100),
  rua              VARCHAR(255),
  tipo_lixo        VARCHAR(100),
  status           VARCHAR(50)  DEFAULT 'Em análise',
  data_requisicao  DATE         DEFAULT (CURRENT_DATE),
  data_coleta      VARCHAR(50)  DEFAULT NULL,
  latitude         DECIMAL(10,8) DEFAULT NULL,
  longitude        DECIMAL(11,8) DEFAULT NULL,
  foto_path        VARCHAR(500)  DEFAULT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS mensagens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(255),
  email      VARCHAR(255),
  assunto    VARCHAR(255),
  mensagem   TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
