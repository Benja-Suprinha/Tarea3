CREATE KEYSPACE p 
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor' : 2
};

CREATE KEYSPACE r 
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor' : 3
};

CREATE TABLE p.paciente (
  id int, 
  nombre text, 
  apellido text, 
  rut text, 
  email text, 
  fecha_nacimiento text, 
  PRIMARY KEY(id)
);
CREATE TABLE r.recetas (
  id int, 
  id_paciente int, 
  comentario text, 
  farmacos text, 
  doctor text, 
  PRIMARY KEY(id)
);