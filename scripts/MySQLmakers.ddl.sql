CREATE DATABASE makers;
USE makers;

-- cargos
CREATE TABLE cargos(
	id_cargo BINARY(16) NOT NULL PRIMARY KEY,
    cargo VARCHAR(30) NOT NULL,
    CONSTRAINT u_cargo UNIQUE (cargo)
);
-- tipos
CREATE TABLE tipos_servicios(
	id_tipo_servicio BINARY(16) NOT NULL PRIMARY KEY,
    tipo_servicio VARCHAR(30) NOT NULL,
    CONSTRAINT u_tipo_servicio UNIQUE (tipo_servicio)
);
-- horarios
CREATE TABLE horarios(
	id_horario BINARY(16) NOT NULL PRIMARY KEY,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL
);

-- sucursales 
CREATE TABLE sucursales(
	id_sucursal BINARY(16) NOT NULL PRIMARY KEY,
    nombre_sucursal VARCHAR(30) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    horario VARCHAR(25) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    CONSTRAINT u_nombre_sucursal UNIQUE (nombre_sucursal)
);

-- clientes
CREATE TABLE clientes(
	id_cliente BINARY(16) NOT NULL PRIMARY KEY,
    nombres VARCHAR(35) NOT NULL,
    apellidos VARCHAR(35) NOT NULL,
    dui VARCHAR(10) NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(50) NULL,
    clave VARCHAR(100) NOT NULL,
    estado INT NOT NULL DEFAULT 1,
    CONSTRAINT u_cliente_dui UNIQUE (dui)
);

-- servicios
CREATE TABLE servicios(
	id_servicio BINARY(16) NOT NULL PRIMARY KEY,
    nombre_servicio VARCHAR(50) NOT NULL,
    id_tipo_servicio BINARY(16) NOT NULL,
    descripcion VARCHAR(75) NOT NULL,
    precio NUMERIC(5,2) NOT NULL,
    existencias INT NOT NULL DEFAULT 1,
  	estado INT NOT NULL DEFAULT 1,
    CONSTRAINT u_nombre_servicio UNIQUE (nombre_servicio),
    CONSTRAINT chk_existencias CHECK (servicios.existencias > -1)
);

-- ordenes
CREATE TABLE ordenes(
	id_orden BINARY(16) NOT NULL PRIMARY KEY,
    id_cliente BINARY(16) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- empleados
CREATE TABLE empleados(
	id_empleado BINARY(16) NOT NULL PRIMARY KEY,
    nombres VARCHAR(35) NOT NULL,
    apellidos VARCHAR(35) NOT NULL,
    dui VARCHAR(10) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    alias VARCHAR(20) NOT NULL,
    clave VARCHAR(100) NOT NULL,
    planilla NUMERIC(5,2) NOT NULL,
    id_sucursal BINARY(16) NOT NULL,
    id_horario BINARY(16) NOT NULL,
    id_cargo BINARY(16) NOT NULL,
    estado INT NOT NULL DEFAULT 1,
    intentos INT DEFAULT 0,
    suplantaciones INT DEFAULT 0,
    PIN VARCHAR(100) DEFAULT 0,
    CONSTRAINT fk_empleado_sucursal FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_empleado_horario FOREIGN KEY (id_horario) REFERENCES horarios(id_horario),
    CONSTRAINT fk_empleado_cargo FOREIGN KEY (id_cargo) REFERENCES cargos(id_cargo),
    CONSTRAINT u_empleado_dui UNIQUE (dui)
);

-- facturas
CREATE TABLE facturas(
	id_factura BINARY(16) NOT NULL PRIMARY KEY,
    id_orden BINARY(16) NOT NULL,
    id_sucursal BINARY(16) NOT NULL,
    id_empleado BINARY(16) NOT NULL,
    estado INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_factura_orden FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
    CONSTRAINT fk_factura_sucursal FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_factura_empleado FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    CONSTRAINT u_orden UNIQUE (id_orden)
);


-- TRIGGER PARA VERIFICAR SÍ EL EMPLEADO
-- TIENE OTRA RESERVACIÓN A ESA HORA
-- reservaciones
CREATE TABLE reservaciones(
	id_reservacion BINARY(16) NOT NULL PRIMARY KEY,
    id_cliente BINARY(16) NOT NULL,
    id_empleado BINARY(16) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_reservacion_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_reservacion_empleado FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- detalle servicio sucursal
CREATE TABLE detalles_servicios_sucursales(
	id_detalle BINARY(16) NOT NULL PRIMARY KEY,
    id_sucursal BINARY(16) NOT NULL,
    id_servicio BINARY(16) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_detalles_servicios_sucursales_sucursal FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_detalles_servicios_sucursales_servicio FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio),
    CONSTRAINT chk_cantidad_servicios_sucursales CHECK (cantidad > 0)
);

-- DETALLE DE UNA ORDEN
CREATE TABLE detalles_ordenes(
	id_detalle BINARY(16) NOT NULL PRIMARY KEY,
    id_orden BINARY(16) NOT NULL,
    id_detalle_servicio BINARY(16) NOT NULL,
   	descuento DECIMAL(5,2) NOT NULL DEFAULT 0,
    cantidad INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_detalles_ordenes_orden FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
    CONSTRAINT fk_detalles_ordenes_servicio FOREIGN KEY (id_detalle_servicio) REFERENCES detalles_servicios_sucursales(id_detalle),
    CONSTRAINT chk_descuento CHECK (descuento >= 0),
    CONSTRAINT chk_cantidad_orden CHECK (cantidad >= 1)
);

-- crear inserciones in DML

-- vistas
CREATE VIEW clientes_view AS
SELECT c.id_cliente, c.nombres, c.apellidos, c.dui, c.telefono, c.correo, count(o.id_orden) as consumo
FROM clientes c
LEFT JOIN ordenes o ON o.id_cliente = c.id_cliente
GROUP BY c.id_cliente, c.nombres, c.apellidos, c.dui, c.telefono, c.correo
ORDER BY count(o.id_orden) DESC

CREATE VIEW empleados_view AS 
SELECT e.id_empleado, e.nombres, e.apellidos, e.alias, e.dui, e.telefono, e.correo, e.planilla, s.nombre_sucursal, s.id_sucursal, 
        CONCAT(time_format(h.hora_apertura, '%l:%i'), ' - ', time_format(h.hora_cierre, '%l:%i')) as horario, h.id_horario, c.id_cargo, c.cargo 
FROM empleados e 
INNER JOIN sucursales s ON s.id_sucursal = e.id_sucursal 
INNER JOIN horarios h ON h.id_horario = e.id_horario 
INNER JOIN cargos c ON c.id_cargo = e.id_cargo ORDER BY e.id_empleado ASC;

CREATE VIEW productos_sucursales_view AS
SELECT s.nombre_servicio, s.id_servicio, tp.tipo_servicio, s.existencias, ds.cantidad, ds.id_detalle, ds.id_sucursal
FROM detalles_servicios_sucursales ds
INNER JOIN servicios s ON s.id_servicio = ds.id_servicio
INNER JOIN tipos_servicios tp ON tp.id_tipo_servicio = s.id_tipo_servicio

CREATE VIEW detalle_view AS
SELECT d.id_detalle, s.id_servicio, s.nombre_servicio, t.id_tipo_servicio, t.tipo_servicio, d.descuento, d.cantidad, s.precio,
		d.cantidad * s.precio as subtotal, d.id_orden, sc.id_sucursal, sc.nombre_sucursal
FROM detalles_ordenes d
INNER JOIN detalles_servicios_sucursales dts ON dts.id_detalle = d.id_detalle_servicio
INNER JOIN servicios s ON s.id_servicio = dts.id_servicio
INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio
INNER JOIN sucursales sc ON sc.id_sucursal = dts.id_sucursal

CREATE VIEW horarios_view AS
SELECT h.id_horario, time_format(h.hora_apertura, '%h:%i') as inicio, time_format(h.hora_cierre, '%h:%i') as cierre
FROM horarios h
ORDER BY h.id_horario ASC

CREATE VIEW ordenes_view AS
SELECT o.id_orden, date_format(o.fecha, '%Y-%m-%d') as fecha, COALESCE(f.id_factura, null) as factura, o.id_cliente, c.nombres, c.apellidos, c.dui
FROM ordenes o
LEFT JOIN facturas f ON o.id_orden = f.id_orden
LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
GROUP BY o.id_orden, o.id_cliente, o.fecha, f.id_factura, o.id_cliente, c.nombres, c.apellidos, c.dui
ORDER BY o.id_orden ASC

CREATE VIEW reservaciones_view AS
SELECT r.id_reservacion,date_format(r.fecha, '%Y-%m-%d') as fecha, time_format(r.hora, '%l:%i') as hora, r.id_cliente, r.id_empleado, c.nombres as cliente_n,
		c.apellidos as cliente_a, c.dui as cliente_d,
		e.nombres as empleado_n, e.apellidos empleado_a, e.dui as empleado_d
FROM reservaciones r
INNER JOIN clientes c ON c.id_cliente = r.id_cliente
INNER JOIN empleados e ON e.id_empleado = r.id_empleado

CREATE VIEW servicios_view AS
SELECT s.id_servicio, s.nombre_servicio, s.descripcion, s.precio, tp.tipo_servicio, tp.id_tipo_servicio
FROM servicios s
INNER JOIN tipos_servicios tp ON s.id_tipo_servicio = tp.id_tipo_servicio
ORDER BY s.id_servicio ASC

-- vista que obtiene los de datos de las sucursales y las horas las convierte a formato de 12 hrs con A.M y P.M
CREATE VIEW sucursales_view AS
WITH times AS (
    SELECT TIME_FORMAT(SUBSTRING_INDEX(horario, '-', 1), '%h:%i') as h_inicio, 
    TIME_FORMAT(SUBSTRING_INDEX(horario, '-', -1), '%h:%i') as h_cierre, 
    s.horario 
    FROM sucursales s
)
SELECT s.id_sucursal, s.telefono, 
	CONCAT(times.h_inicio, ' ', IF(SUBSTRING_INDEX(s.horario, '-', 1) < 12, 'AM', 'PM') ) as inicio,
    CONCAT(times.h_cierre, ' ', IF(SUBSTRING_INDEX(s.horario, '-', -1) < 12, 'AM', 'PM') )as cierre,
    s.nombre_sucursal, s.direccion 
FROM times
INNER JOIN sucursales s ON s.horario = times.horario

-- Vista para obtener las ventas según año actual, los ordena por meses del año y sí no tiene pone 0
-- y verifíca sí hay ventas según la año actual y según los meses del año
CREATE VIEW ventas AS
SELECT
    YEAR(meses.fecha) AS anio,
    MONTH(meses.fecha) AS num_mes,
    MONTHNAME(meses.fecha) AS mes,
    IFNULL(COUNT(o.id_orden), 0) AS venta
FROM (
    SELECT MAKEDATE(YEAR(CURDATE()), 1) + INTERVAL (n - 1) MONTH AS fecha
    FROM (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
        UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 
        UNION SELECT 11 UNION SELECT 12
    ) AS num
) AS meses
LEFT JOIN ordenes o ON YEAR(meses.fecha) = YEAR(o.fecha) AND MONTH(meses.fecha) = MONTH(o.fecha)
-- agregar where año YEAR(o.fecha) = 'año parametrizado'
GROUP BY YEAR(meses.fecha), MONTH(meses.fecha)
ORDER BY YEAR(meses.fecha), MONTH(meses.fecha);

-- Consulta que obteniene la cantidad de ordenes y las agrupa por día, para obtener la cantidad de ordenes
-- y las ordena la fecha de manera descendente
SELECT count(o.fecha) as ordenes, date_format(o.fecha, '%Y-%m-%d') as fecha
FROM ordenes o
WHERE MONTH(o.fecha) = '08'
GROUP BY YEAR(o.fecha), MONTH(o.fecha), DAY(o.fecha)
ORDER BY o.fecha DESC;

ALTER TABLE empleados 
ADD COLUMN intentos INT DEFAULT 0,
ADD COLUMN suplantaciones INT DEFAULT 0 
ADD COLUMN PIN VARCHAR(100) NOT NULL DEFAULT 0