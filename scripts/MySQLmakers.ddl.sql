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

-- crear inserciones

-- vistas