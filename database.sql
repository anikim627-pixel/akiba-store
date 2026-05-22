CREATE DATABASE IF NOT EXISTS akiba_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE akiba_store;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  ciudad VARCHAR(80) NOT NULL,
  producto VARCHAR(120) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  direccion TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS telefono VARCHAR(30) NOT NULL DEFAULT '' AFTER correo,
  ADD COLUMN IF NOT EXISTS ciudad VARCHAR(80) NOT NULL DEFAULT '' AFTER telefono,
  ADD COLUMN IF NOT EXISTS precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER cantidad,
  ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER precio_unitario;

INSERT INTO pedidos (
  cliente,
  correo,
  telefono,
  ciudad,
  producto,
  cantidad,
  precio_unitario,
  total,
  direccion
)
VALUES
  ('Yuki Morales', 'yuki@email.com', '0991112222', 'Quito', 'Figura coleccionable', 1, 35.00, 35.00, 'Av. Japon N12'),
  ('Ana Sato', 'ana@email.com', '0983334444', 'Guayaquil', 'Box de snacks japoneses', 2, 22.00, 44.00, 'Centro comercial');
