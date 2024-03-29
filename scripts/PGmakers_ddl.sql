-- tablas padre
-- tablas tipo...
CREATE TABLE tipos_servicios(
	id_tipo_servicio serial PRIMARY KEY,
	tipo_servicio character varying(30)
);
-- tablas estado
-- CREATE TABLE estados_servicios(
-- 	id_estado_servicio serial PRIMARY KEY,
-- 	estado character varying(25) NOT NULL
-- );
-- CREATE TABLE estados_facturas(
-- 	id_estado_factura serial PRIMARY KEY,
-- 	estado character varying(25) NOT NULL
-- );
-- CREATE TABLE estados_reservaciones(
-- 	id_estado_reservacion serial PRIMARY KEY,
-- 	estado character varying(25) NOT NULL
-- );
-- CREATE TABLE estados_usuarios(
-- 	id_estado_usuario serial PRIMARY KEY,
-- 	estado character varying(25) NOT NULL
-- );
-- TABLAS INDEPENDIENTES
CREATE TABLE sucursales(
	id_sucursal serial PRIMARY KEY,
	direccion character varying(500) NOT NULL,
	telefono character varying(9) NOT NULL,
	horario character varying(25) NOT NULL,
	nrc character varying(8) NOT NULL,
	nit character varying(17) NOT NULL
);

CREATE TABLE horarios(
	id_horario serial PRIMARY KEY,
	hora_apertura time NOT NULL,
	hora_cierre time NOT NULL
);

CREATE TABLE cargos(
	id_cargo serial PRIMARY KEY,
	cargo character varying(30) NOT NULL
);

-- TABLAS DEPENDIENTES DE + DEP A - DEP
-- + llave foraneas
CREATE TABLE clientes(
	id_cliente serial PRIMARY KEY,
	nombres character varying(35) NOT NULL,
	apellidos character varying(35) NOT NULL,
	dui character varying(10) NOT NULL,
	telefono character varying(20) NOT NULL,
	correo character varying(50) NOT NULL,
	clave character varying(15) NOT NULL,
	id_estado_usuario_cliente integer NOT NULL, --FOREIGN KEY
	CONSTRAINT fk_estado_cliente FOREIGN KEY (id_estado_usuario_cliente) REFERENCES estados_usuarios(id_estado_usuario),
	CONSTRAINT chk_correo_cliente CHECK (correo like '%@%' AND correo like '%.com')--validacion
);

CREATE TABLE servicios(
	id_servicio serial PRIMARY KEY NOT NULL,
	id_tipo_servicio integer NOT NULL, --FOREIGN KEY
	nombre_servicio character varying(25) NOT NULL,
	descripcion character varying(75) NULL,
	precio numeric(4,2) NULL,
	existencias integer NULL,
	id_estado_servicio integer NOT NULL ,--FOREIGN KEY
	CONSTRAINT fk_tipo_servicio FOREIGN KEY (id_tipo_servicio) REFERENCES tipos_servicios(id_tipo_servicio),
	CONSTRAINT fk_estado_servicio FOREIGN KEY (id_estado_servicio) REFERENCES estados_servicios(id_estado_servicio)
);
CREATE TABLE facturas(
	id_factura serial PRIMARY KEY,
	id_cliente integer NOT NULL, --FOREIGN KEY
	fecha date NOT NULL,
	hora time NOT NULL,
	id_estado_factura integer NOT NULL,--FOREIGN KEY
	CONSTRAINT fk_cliente_factura FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente),
	CONSTRAINT fk_estado_factura FOREIGN KEY (id_estado_factura) REFERENCES estados_facturas(id_estado_factura)
);

CREATE TABLE empleados(
	id_empleado serial PRIMARY KEY,
	nombres character varying(35) NOT NULL,
	apellidos character varying(35) NOT NULL,
	dui character varying(10) NOT NULL,
	telefono character varying(20) NOT NULL,
	correo character varying(50) NOT NULL,
	clave character varying(15) NOT NULL,
	planilla numeric (5,2) NOT NULL,
	--FOREIGNS KEY
	id_sucursal integer NOT NULL,
	id_horario integer NOT NULL,
	id_cargo integer NOT NULL,
	id_estado_empleado integer NOT NULL,
	CONSTRAINT fk_sucursal_empleado FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
	CONSTRAINT fk_horario_empleado FOREIGN KEY (id_horario) REFERENCES horarios(id_horario),
	CONSTRAINT fk_cargo_empleado FOREIGN KEY (id_cargo) REFERENCES cargos(id_cargo),
	CONSTRAINT fk_estado_empleado FOREIGN KEY (id_estado_empleado) REFERENCES estados_usuarios(id_estado_usuario)
);	

CREATE TABLE reservaciones(
	id_reservacion serial PRIMARY KEY,
	id_cliente integer NOT NULL,--FOREIGN KEY
	id_empleado integer NOT NULL,--FOREIGN KEY
	fecha date NOT NULL DEFAULT CURRENT_DATE + 1,
	hora time NOT NULL,
	id_estado integer NOT NULL,--FOREIGN KEY
	CONSTRAINT fk_reservacion_cliente FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente),
	CONSTRAINT fk_reservacion_empleado FOREIGN KEY(id_empleado) REFERENCES empleados(id_empleado)
);	

--TABLA DETALLE
CREATE TABLE ordenes(
	id_orden serial PRIMARY KEY,
	id_servicio integer NOT NULL,
	descuento numeric(5,2) NOT NULL DEFAULT 0,
	cantidad integer NOT NULL,
	id_empleado integer NOT NULL,
	id_factura integer NOT NULL,
	CONSTRAINT fk_orden_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
	CONSTRAINT fk_orden_empleado FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
	CONSTRAINT fk_orden_factura FOREIGN KEY (id_factura) REFERENCES facturas(id_factura),
	CONSTRAINT chk_cantidad CHECK (cantidad >= 1)
);
CREATE TABLE detalles_servicios_sucursales(
	id_detalle serial PRIMARY KEY,
	id_sucursal integer NOT NULL,
	id_servicio integer NOT NULL,
	CONSTRAINT fk_detalle_servicio_sucursal FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
	CONSTRAINT fk_detalle_servicio_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);
DROP TABLE ordenes
DROP TABLE facturas
DROP TABLE estados_facturas
DROP TABLE estados_reservaciones
DELETE FROM detalles_servicios_sucursales
DELETE FROM servicios 
DELETE FROM estados_servicios
ALTER TABLE servicios DROP CONSTRAINT fk_estado_servicio
DROP TABLE estados_servicios

ALTER TABLE clientes DROP CONSTRAINT fk_estado_cliente
ALTER TABLE empleados DROP CONSTRAINT fk_estado_empleado
DROP TABLE estados_usuarios

CREATE TABLE ordenes(
	id_orden serial not null primary key,
	id_cliente integer not null, --FOREIGN KEY
	fecha date not null default current_date,
	estado integer not null default 1
);

CREATE TABLE detalle_ordenes(
	id_detalle serial not null primary key,
	id_servicio integer not null, --FOREIGN KEY
	descuento numeric(5,2) not null default 0,
	cantidad integer not null default 1,
	id_orden integer not null, --FOREIGN KEY
	CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
	CONSTRAINT fk_detalle_orden FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
	CONSTRAINT chk_cantidad CHECK (cantidad >= 1)
);

CREATE TABLE facturas(
	id_factura serial not null primary key,
	id_orden integer not null, -- FOREIGN KEY
	id_sucursal integer not null, --FOREIGN KEY
	id_empleado integer not null, --FOREIGN KEY
	estado integer not null default 1,
	CONSTRAINT fk_orden_factura FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
	CONSTRAINT fk_sucursal_factura FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
	CONSTRAINT id_empleado_factura FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

ALTER TABLE detalles_servicios_sucursales ADD COLUMN cantidad integer not null default 1;
ALTER TABLE detalles_servicios_sucursales ADD CONSTRAINT chk_cantidad_servicio_sucursal CHECK (cantidad >= 1)

CREATE VIEW empledos_view AS 
SELECT	e.id_empleado, e.nombres, e.apellidos, e.dui, e.telefono, e.correo, e.planilla, s.direccion, s.id_sucursal, 
		CONCAT(to_char(h.hora_apertura, 'HH12:MI') || ' - ' || to_char(h.hora_cierre, 'HH12:MI')) as horario, h.id_horario, 
		c.id_cargo, c.cargo
FROM empleados e
INNER JOIN sucursales s ON e.id_sucursal = s.id_sucursal
INNER JOIN horarios h ON e.id_horario = h.id_horario
INNER JOIN cargos c ON e.id_cargo = c.id_cargo
ORDER BY e.id_empleado ASC


ALTER TABLE empleados DROP id_estado_empleado
ALTER TABLE empleados ADD COLUMN estado INTEGER NOT NULL DEFAULT 1

CREATE VIEW productos_view AS
SELECT *
FROM servicios
WHERE id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto')

CREATE VIEW productos_sucursales_view AS
SELECT s.nombre_servicio, s.id_servicio, s.existencias, ds.cantidad, ds.id_detalle
FROM detalles_servicios_sucursales ds
INNER JOIN servicios s ON s.id_servicio = ds.id_servicio

CREATE VIEW detalle_view AS
SELECT d.id_detalle, s.id_servicio, s.nombre_servicio, d.descuento, d.cantidad, s.precio,
		d.cantidad * s.precio as subtotal, d.id_orden
FROM detalle_ordenes d
INNER JOIN servicios s ON s.id_servicio = d.id_servicio

-- modificar la longitud de la clave del empleado y cliente a 80
-- validar que dui sea unico 
ALTER TABLE empleados ADD CONSTRAINT chk_dui_empleado UNIQUE (dui)

CREATE VIEW servicios_view AS
SELECT s.id_servicio, s.nombre_servicio, s.descripcion, s.precio, tp.tipo_servicio, tp.id_tipo_servicio
FROM servicios s
INNER JOIN tipos_servicios tp ON s.id_tipo_servicio = tp.id_tipo_servicio
ORDER BY s.id_servicio ASC

CREATE VIEW reservaciones_view AS
SELECT r.id_reservacion, r.fecha as fecha, to_char(r.hora, 'HH12:MI') as hora, r.id_cliente, r.id_empleado, c.nombres as cliente_n,
		c.apellidos as cliente_a, c.dui as cliente_d,
		e.nombres as empleado_n, e.apellidos empleado_a, e.dui as empleado_d
FROM reservaciones r
INNER JOIN clientes c ON c.id_cliente = r.id_cliente
INNER JOIN empleados e ON e.id_empleado = r.id_empleado

ALTER TABLE facturas ADD CONSTRAINT u_orden UNIQUE (id_orden)

ALTER TABLE ordenes ADD CONSTRAINT fk_cliente_orden FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)

CREATE VIEW ordenes_view AS
SELECT o.id_orden, to_char(o.fecha, 'yyyy-mm-dd') as fecha, COALESCE(f.id_factura, 0) as factura, o.id_cliente, c.nombres, c.apellidos, c.dui
FROM ordenes o
-- INNER JOIN clientes c ON c.id_cliente = o.id_cliente
LEFT JOIN facturas f ON o.id_orden = f.id_orden
LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
-- WHERE f.id_factura IS NOT NULL 
GROUP BY o.id_orden, o.id_cliente, o.fecha, f.id_factura, o.id_cliente, c.nombres, c.apellidos, c.dui
ORDER BY o.id_orden ASC

ALTER TABLE tipos_servicios ADD CONSTRAINT u_tipo UNIQUE (tipo_servicio)

SELECT * FROM servicios WHERE id_tipo_servicio = 8
SELECT * FROM tipos_servicios

SELECT * FROM servicios WHERE id_tipo_servicio = (
	SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto'
)

SELECT * FROM servicios

DROP VIEW productos_view

SELECT *
FROM servicios_view

CREATE VIEW productos_view AS
SELECT *
FROM servicios
WHERE id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto')
ORDER BY id_servicio ASC

CREATE VIEW servicios_view AS
SELECT s.id_servicio, s.nombre_servicio, s.descripcion, s.precio, tp.tipo_servicio, tp.id_tipo_servicio
FROM servicios s
INNER JOIN tipos_servicios tp ON s.id_tipo_servicio = tp.id_tipo_servicio
ORDER BY s.id_servicio ASC


DROP VIEW productos_sucursales_view

CREATE VIEW productos_sucursales_view AS
SELECT s.nombre_servicio, s.id_servicio, s.existencias, ds.cantidad, ds.id_detalle, ds.id_sucursal
FROM detalles_servicios_sucursales ds
INNER JOIN servicios s ON s.id_servicio = ds.id_servicio

SELECT * FROM productos_sucursales_view

SELECT * FROM ordenes
INSERT INTO ordenes(id_cliente, fecha, estado) VALUES (87, '11-04-2023', 1)

SELECT * FROM detalle_ordenes



DROP VIEW detalle_view

CREATE VIEW detalle_view AS
SELECT d.id_detalle, s.id_servicio, s.nombre_servicio, t.id_tipo_servicio, t.tipo_servicio, d.descuento, d.cantidad, s.precio,
		d.cantidad * s.precio as subtotal, d.id_orden
FROM detalle_ordenes d
INNER JOIN servicios s ON s.id_servicio = d.id_servicio
INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio

WHERE d.id_orden = 1

SELECT * FROM detalle_view
INSERT INTO detalle_ordenes(id_servicio, id_orden) VALUES (40, 1)

CREATE VIEW detalle_orden_
SELECT d.id_detalle, d.id_servicio, d.descuento, d.cantidad, d.id_orden, t.id_tipo_servicio FROM detalle_ordenes d
INNER JOIN servicios s ON s.id_servicio = d.id_servicio
INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio

SELECT * FROM empleados
SELECT * FROM clientes

SELECT dui, correo, COUNT(*) AS repeticiones
FROM empleados
GROUP BY dui, correo
HAVING COUNT(*) = 2;

ALTER TABLE empleados ADD CONSTRAINT chk_dui_empleado UNIQUE (dui)
DELETE FROM empleados WHERE id_empleado in (17)
SELECT * FROM empleados WHERE  dui = '12345278-9' AND correo = 'fernandomena3131@gmail.com' --contraseña 1234567890

SELECT id_horario, CONCAT(to_char(hora_apertura, 'HH12:MI') || ' AM ') as apertura, CONCAT(to_char(hora_cierre, 'HH:12:MI') || ' PM') as cierre
FROM horarios

SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto'

INSERT INTO servicios(id_tipo_servicio, descripcion, precio, existencias, id_estado_servicio, nombre_servicio) VALUES ($, $2, $3, $4, $5, $6)

SELECT * FROM tipos_servicios WHERE NOT tipo_servicio = 'Producto';
SELECT telefono, horario, nrc, nit, direccion FROM sucursales
SELECT id_empleado FROM empleados

SELECT id_cliente, nombres, apellidos, dui, telefono, correo FROM clientes

SELECT * FROM reservaciones
DROP VIEW reservaciones_view

CREATE VIEW reservaciones_view AS
SELECT r.id_reservacion,to_char(r.fecha, 'yyyy-MM-dd') as fecha, to_char(r.hora, 'HH12:MI') as hora, r.id_cliente, r.id_empleado, c.nombres as cliente_n,
		c.apellidos as cliente_a, c.dui as cliente_d,
		e.nombres as empleado_n, e.apellidos empleado_a, e.dui as empleado_d
FROM reservaciones r
INNER JOIN clientes c ON c.id_cliente = r.id_cliente
INNER JOIN empleados e ON e.id_empleado = r.id_empleado

ALTER TABLE facturas ADD CONSTRAINT u_orden UNIQUE (id_orden)
SELECT * FROM ordenes

DROP VIEW ordenes_view
CREATE VIEW ordenes_view AS
SELECT o.id_orden, to_char(o.fecha, 'yyyy-mm-dd') as fecha, COALESCE(f.id_factura, 0) as factura, o.id_cliente, c.nombres, c.apellidos, c.dui
FROM ordenes o
-- INNER JOIN clientes c ON c.id_cliente = o.id_cliente
LEFT JOIN facturas f ON o.id_orden = f.id_orden
LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
-- WHERE f.id_factura IS NOT NULL 
GROUP BY o.id_orden, o.id_cliente, o.fecha, f.id_factura, o.id_cliente, c.nombres, c.apellidos, c.dui
ORDER BY o.id_orden ASC


INSERT INTO ordenes(fecha, estado, id_cliente) VALUES (CURRENT_DATE, 1, 104)
INSERT INTO facturas(id_orden, id_empleado, id_sucursal, estado) VALUES (6, 5, 1, 1)

SELECT f.id_factura, f.id_sucursal, f.id_empleado, f.estado, f.id_orden, e.nombres, e.apellidos FROM facturas f INNER JOIN empleados e ON e.id_empleado = f.id_empleado
SELECT * FROM tipos_servicios

ALTER TABLE ordenes ADD CONSTRAINT fk_cliente_orden FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
ALTER TABLE tipos_servicios ADD CONSTRAINT u_tipo UNIQUE (tipo_servicio)

CREATE VIEW empleados_view AS 
SELECT	e.id_empleado, e.nombres, e.apellidos, e.alias, e.dui, e.telefono, e.correo, e.planilla, s.nombre_sucursal, s.id_sucursal, 
		CONCAT(to_char(h.hora_apertura, 'HH12:MI') || ' - ' || to_char(h.hora_cierre, 'HH12:MI')) as horario, h.id_horario, 
		c.id_cargo, c.cargo
FROM empleados e
INNER JOIN sucursales s ON e.id_sucursal = s.id_sucursal
INNER JOIN horarios h ON e.id_horario = h.id_horario
INNER JOIN cargos c ON e.id_cargo = c.id_cargo
ORDER BY e.id_empleado ASC


ALTER TABLE empleados ADD COLUMN alias character varying(50) 
ALTER TABLE clientes ADD COLUMN alias character varying(50) 
ALTER TABLE clientes ADD CONSTRAINT chk_dui_cliente UNIQUE (dui)
ALTER TABLE servicios ADD CONSTRAINT chk_servicio UNIQUE (nombre_servicio)
ALTER TABLE cargos ADD CONSTRAINT chk_cargo UNIQUE (cargo)
ALTER TABLE sucursales ADD COLUMN nombre_sucursal character varying(30) NOT NULL DEFAULT 'Makers'

ALTER TABLE detalle_ordenes DROP CONSTRAINT fk_detalle_servicio
ALTER TABLE detalle_ordenes DROP COLUMN id_servicio
ALTER TABLE detalle_ordenes ADD COLUMN id_detalle_servicio integer 
ALTER TABLE detalle_ordenes ADD CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_detalle_servicio) REFERENCES detalles_servicios_sucursales(id_detalle)

CREATE VIEW detalle_view AS
SELECT d.id_detalle, s.id_servicio, s.nombre_servicio, t.id_tipo_servicio, t.tipo_servicio, d.descuento, d.cantidad, s.precio,
		d.cantidad * s.precio as subtotal, d.id_orden
FROM detalle_ordenes d
INNER JOIN detalles_servicios_sucursales dts ON dts.id_detalle = d.id_detalle_servicio
INNER JOIN servicios s ON s.id_servicio = dts.id_servicio
INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio

CREATE VIEW clientes_view AS
SELECT c.id_cliente, c.nombres, c.apellidos, c.dui, c.telefono, c.correo, count(o.id_orden) as consumo
FROM clientes c
LEFT JOIN ordenes o ON o.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombres, c.apellidos, c.dui, c.telefono, c.correo
ORDER BY count(o.id_orden) DESC