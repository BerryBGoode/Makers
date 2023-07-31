--Insersiones a tablas independientes
INSERT INTO public.tipos_servicios(
	 tipo_servicio)
	VALUES 	('Corte'),
			('Barba'),
			('Facial'),
			('Producto');
			
INSERT INTO public.estados_servicios(
	 estado)
	VALUES 	('Disponible'),
			('No disponible');
			
INSERT INTO public.estados_facturas(
	estado)
	VALUES 	('Pagado'),
			('Pendiente'),
			('Vencida'), 
			('Plazo vencido');
			
INSERT INTO public.estados_reservaciones(
	 estado)
	VALUES 	('Aceptado'),
			('Rechazado'),
			('Cancelado');--cuando el cliente cancele cita

INSERT INTO public.estados_usuarios(
	 estado)
	VALUES 	('Activo'),
			('Inactivo'),
			('Bloqueado'),
			('Fuera de servicio');
			
INSERT INTO public.sucursales(
	 direccion, telefono, horario, nrc, nit)
	VALUES 	( 'P. sherman calle wallaby 42 sidney', '7890-0345', '8:00 A.M - 5:00 P.M', '567891-5', '0614-111102-123-4'),
	 		( 'Local 4, 39 Avenida Norte, Avenida Centroamérica Boulevard Universitario, Centro Comercial Universitario, San Salvador.', '7958-3786', '8:00 A.M - 7:00 P.M', '276480-7', '0614-160119-105-3');
			
			
-- ALTER TABLE sucursales ADD COLUMN direccion character varying(1000)
INSERT INTO public.horarios(
	 hora_apertura, hora_cierre)
	VALUES 	('8:00', '17:00'),
			('8:00', '12:00'),
			('12:00', '17:00'),
			('8:00', '15:00');
			
INSERT INTO public.cargos(
	cargo)
	VALUES 	('Gerente'),
			('Barbero'),
			('Asistente de gerencia');


-- INSERCIÓN EN TABLAS DEPENDIENTES

INSERT INTO public.clientes(
	 nombres, apellidos, dui, telefono, correo, clave, id_estado_usuario_cliente)
	VALUES 	('Carlos', 'Gonzalez', '00723488-7', '7895-6348', 'carlosgonz@gmail.com', '$DsnIs', 1),
			('Juan', 'Ramirez', '35689421-8', '7659-1235', 'Juanram@gmail.com', '#fjS@lo', 2),
			('Stephanie', 'Galdamez', '32541987-5', '7692-0136', 'StephGal@gmail.com', '@flS7fsd', 1),
			('Oswaldo', 'Díaz', '24215637-9', '7982-0123', 'OsDiaz@gmail.com', '$kSh3s', 3),
			('Cristian', 'Mena', '20143560-7', '7963-1598', 'Crismena@gmail.com', '#mKi4d2', 2),
			('Regina', 'Hernandez', '25631487-0', '7069-2468', 'ReginaHerx@gmail.com', '@mL4n5', 3),
			('Lucía', 'Gongora', '25789641-2', '7326-9365', 'LuciGon@gmail.com', 'w3scc0l', 2),
			('Zara', 'Alvarado', '36487918-9', '6354-8659', 'Zara.al@gmail.com', '5dh$nsA', 1),
			('Adriana', 'Pérez', '21456223-2', '7986-1569', 'Adperez@gmail.com', 'jh@6Sfn', 1),
			('Nathaly', 'Saravia', '25447856-3', '7103-6985', 'Nathsaravia@gmail.com', 'skw#bs@2', 3);
			

INSERT INTO public.servicios(
	id_tipo_servicio, nombre_servicio, descripcion, precio, existencias, id_estado_servicio)
	VALUES 	( 5, 'Corte de Cabello', 'Corte de cabello según el cliente', 5.00, 1, 1),
			( 6, 'Corte de Barba', 'Corte de cabello según el cliente', 4.00, 1, 1),
			( 5, 'Alisado', 'Un alisado para resplandecer tu cabello', 6.00, 1, 1),
			( 5, 'Texturizado', 'Un texturizado  perfecto para moldear el cabello sin apelmazarlo', 3.00, 20, 1),
			( 5, 'Corte de Barba con Vapor de Ozono', 'Corte con nuestra especialidad de vapor al ozono', 7.00, 1, 2),
			( 7, 'Lavado Spa', 'Un lavado para tu rostro', 6.00, 1, 1),
			( 7, 'Corte de Cejas', 'Tu corte de cejas que tu rostro luzca bien', 4.00, 1, 2),
			( 5, 'Diseños en Corte de Cabellos', 'Elige tu mejor corte de cabello', 4.00, 1, 2),
			( 7, 'Mascarilla de Carbón Activado', 'Una mascarilla para tu rostro suave', 6.00, 20, 1),
			( 7, 'Mascarilla con Vapor de Ozono', 'Una mascarilla para tu rostro suave', 6.00, 19, 1),
			( 6, 'Afeitados', 'Cuida de tu barba, es lo que brilla en ti', 5.00, 1, 2),
			(8, 'Crema para cabello', 'Deja tu cabello en excelente cuidado', 3.00,50,1),
			(8, 'Vacelina', 'Da más suavidad a tú cabello', 2.50, 50, 1);

INSERT INTO public.facturas(
	 id_cliente, fecha, hora, id_estado_factura)
	VALUES 	( 21, '11-04-2023', '9:00', 2),
			( 22, '10-04-2023', '14:30', 1),
			( 24, '03-02-2023', '11:12', 2),
			( 23, '11-02-2023', '8:20', 2),
			( 26, '12-03-2023', '9:40', 1),
			( 25, '12-02-2023', '12:00', 1),
			( 28, '08-03-2023', '15:30', 1),
			( 27, '12-04-2023', '10:45', 1),
			( 30, '7-03-2023', '13:55', 2),
			( 29, '6-02-2023', '8:30', 2),
			( 22, '6-02-2023', '9:40', 1),
			( 21, '03-04-2023', '10:50', 1),
			( 24, '3-01-2023', '14:55', 1),
			( 23, '8-01-2023', '16:10', 2),
			( 26, '2-04-2023', '16:32', 1),
			( 25, '5-01-2023', '14:38', 2),
			( 28, '9-01-2023', '11:20', 2),
			( 27, '11-02-2023', '9:00', 1),
			( 30, '6-01-2023', '10:15', 2),
			( 29, '08-01-2023', '8:59', 2);
			
INSERT INTO public.empleados(
	 nombres, apellidos, dui, telefono, correo, clave, planilla, id_sucursal, id_horario, id_cargo, id_estado_empleado)
	VALUES 	('Carlos', 'Hernandz', '32659845-6', '7589-3652', 'Carlosher@gmail.com', 'ujF*0O60', 250.00, 1, 1, 2, 1),
			('Monica', 'Galdamez', '25463457-8', '7845-8965', 'Monica@gmail.com', 'km0P6^13', 250.00, 1, 3, 2, 1),
			('Alejandro', 'Gongora', '03210065-9', '7426-2365', 'Alej@gmail.com', 'mX46^91#', 500.00, 1, 2, 1, 1),
			('Salvador', 'Saravia', '01236547-8', '7896-1452', 'SalSav@gmail.com', 'b62P*pY8', 500.00, 2, 4, 1, 1),
			('Aaron', 'Alvarado', '12345678-9', '7425-1256', 'aaron@gmail.com', 'VM1wQ06!', 300.00, 1, 4, 2, 3),
			('Rodrigo', 'Pérez', '98745632-1', '7365-2589', 'rodpe@gmail.com', '2@9mAkmok616wT4', 250.00, 2, 2, 2, 2),
			('Melvin', 'Díaz', '01472583-6', '7412-5683', 'meldi@gmail.com', '5r$9oqFeY7T$BM7', 250.00, 2, 3, 2, 1),
			('Valeria', 'Gonzalez', '96325874-1', '7412-8965', 'valgon@gmail.com', '^ktUJ6JG4OH3ty5', 250.00, 2, 1, 1, 2),
			('Steven', 'López', '01470258-3', '7523-6547', 'stevlo@gmail.com', '7^8$I0TE7EUVk2o', 300.00, 2, 2, 3, 2),
			('Fernando', 'Mena', '36985201-4', '7142-2546', 'fermena@gmail.com', 'y1Szs7Ma04o&r!G', 250.00, 1, 1, 2, 1);
			
INSERT INTO public.reservaciones(
	 id_cliente, id_empleado, fecha, hora, id_estado)
	VALUES 	( 22, 1,'11-04-2023', '9:00', 2),
			( 21, 2,'10-04-2023', '14:30', 1),
			( 24, 4,'03-02-2023', '11:12', 3),
			( 23, 3,'4-02-2023', '8:20', 2),
			( 26, 5,'12-03-2023', '9:40', 1),
			( 25, 6,'4-02-2023', '12:00', 1),
			( 28, 7,'08-03-2023', '15:30', 3),
			( 27, 9,'2-04-2023', '10:45', 1),
			( 30, 8,'2-03-2023', '13:55', 3),
			( 29, 10,'1-02-2023', '8:30', 2);
	
INSERT INTO public.ordenes(
	 id_servicio, descuento, cantidad, id_empleado, id_factura)
	VALUES 	(27, 3.00, 2, 1, 21),
			(28, 2.00, 1, 2, 22),
			(29, 1.00, 1, 6, 23),
			(31, 0.50, 1, 7, 24),
			(31, 0.00, 1, 8, 25),
			(31, 3.00, 5, 10, 26),
			(32, 3.00, 4, 2, 27),
			(33, 1.50, 2, 10, 28),
			(34, 2.00, 3, 7, 29),
			(33, 0.40, 1, 6, 30),
			(29, 0.70, 1, 1, 31),
			(31, 2.90, 3, 10, 32),
			(32, 0.99, 2, 1, 33),
			(29, 3.00, 6, 2, 34),
			(31, 2.00, 6, 6, 35),
			(28, 0.20, 1, 8, 36),
			(29, 0.00, 2, 8, 37),
			(28, 1.00, 4, 7, 38),
			(27, 0.30, 1, 6, 39),
			(28, 1.20, 4, 8, 40);
		
SELECT * FROM servicios
INSERT INTO public.detalles_servicios_sucursales(
	id_sucursal, id_servicio)
	VALUES 	(1, 27),
			(2, 28),
			(2, 29),
			(2, 30),
			(1, 31),
			(1, 32),
			(2, 33),
			(1, 34),
			(1, 35),
			(2, 36),
			(1, 35),
			(2, 34),
			(1, 33),
			(1, 32),
			(1, 31),
			(2, 30),
			(2, 27),
			(1, 28),
			(2, 29);
			
-- 			( I  N  N  E  R      J  O  I  N)
			
-- MOSTRAR LOS SUCURSALES Y LOS EMPLEADOS QUE TIENE ESA SUCURSAL
SELECT c.id_sucursal, c.direccion, COUNT(P.id_sucursal) as Empleados 
	FROM sucursales c
	LEFT JOIN empleados p ON c.id_sucursal = p.id_sucursal
	GROUP BY c.id_sucursal, c.direccion
	ORDER BY COUNT(P.id_sucursal) asc;
	
-- MOSTRAR LA CANTIDAD DE VECES QUE SE COMPRO UN SERVICIO EN ORDEN DESCENDENTE
SELECT s."nombre_servicio", s.precio, s.descripcion, count(o.id_servicio) AS Consumo
			FROM servicios s
			INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio
			INNER JOIN ordenes o ON o.id_servicio = s.id_servicio
			WHERE t.tipo_servicio NOT ILIKE 'Producto'
			GROUP BY s."nombre_servicio", s.precio, s.descripcion					
			ORDER BY count(o.id_servicio) DESC;
			
-- 			(  G  R  O  U  P     B  Y )
			
-- MOSTRAR LA CANTIDAD DE VECES QUE SE COMPRO UN PRODUCTO EN ORDEN DESCENDENTE
SELECT p."nombre_servicio", P.precio, p.descripcion, count(o.id_servicio) AS Consumo
			FROM servicios p
			INNER JOIN tipos_servicios t ON t.id_tipo_servicio = p.id_tipo_servicio
			LEFT JOIN ordenes o ON o.id_servicio = p.id_servicio
			WHERE t.tipo_servicio ILIKE 'Producto'
			GROUP BY p."nombre_servicio", p.precio, p.descripcion					
			ORDER BY count(t.id_tipo_servicio) DESC
			
-- MOSTRAR LOS TIPOS DE SERVICIOS Y LA CANTIDAD DE SERVICIOS
SELECT t.id_tipo_servicio, t.tipo_servicio, COUNT(s.id_tipo_servicio) as servicios 
	FROM tipos_servicios t
	LEFT JOIN servicios s ON t.id_tipo_servicio = s.id_tipo_servicio
	GROUP BY t.id_tipo_servicio, t.tipo_servicio
	ORDER BY t.id_tipo_servicio ASC
	
	
	
-- MOSTRAR UN HISTORIAL DE COMPRAS DEL CLIENTE
SELECT s.nombre_servicio, s.precio, f.fecha
FROM ordenes o
INNER JOIN facturas f ON f.id_factura = o.id_factura
INNER JOIN clientes c ON c.id_cliente = f.id_cliente
INNER JOIN servicios s ON s.id_servicio = o.id_servicio
ORDER BY f.fecha DESC

-- 			(  T  R  I  G  G  E  R  )

-- FUNCIÓN PARA RESTAR EXISTENCIA A UN PRODUCTO CUANDO SE AGREGAR A UNA ORDEN
CREATE OR REPLACE FUNCTION FUN_restar_existencia()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$ -- {
DECLARE 
 _cantidad_ integer;
 _producto_ integer;
BEGIN
-- obtener la cantidad a restar
	SELECT cantidad FROM ordenes ORDER BY id_orden DESC LIMIT 1 INTO _cantidad_;
-- 	obtener y asignar el servicio a actualizar
	SELECT id_servicio FROM ordenes ORDER BY id_orden DESC LIMIT 1 INTO _producto_;
-- restar existencia	
	UPDATE servicios 
	SET existencias = existencias - _cantidad_
-- 	obtener el id del servicio de la orden
	WHERE servicios.id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto');
	
	RETURN NEW; --asigna valor
END
$$;
--}

-- TRIGGER PARA RESTAR EXISTENCIA A UN PRODUCTO
-- DESENCADENADOR : AGREGAR EN LA TABLA ORDENES
CREATE OR REPLACE TRIGGER TGG_restar_existencia
AFTER INSERT ON ordenes
-- a una fila
	FOR EACH ROW
	EXECUTE PROCEDURE FUN_restar_existencia()
	
SELECT * FROM servicios
INSERT INTO public.ordenes(id_servicio, descuento, cantidad, id_empleado, id_factura) VALUES (39, 3.00, 2, 1, 21),

-- FUNCIÓN PARA AGREGAR EXISTENCIA CUANDO SE ELIMINA UN PRODUCTO DE LA ORDEN
CREATE OR REPLACE FUNCTION FUN_agregar_existencia()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS 
$$ -- {
BEGIN
-- obtener el producto a actualizar
-- agregar la cantidad de la existencia producto
	UPDATE servicios
-- 	sumar la existencia + el resultado de la resta entre el valor antiguo y el nuevo (cantidad (orden))

-- SI CANTIDAD EN EL UPDATE ES 0, el resultado de la resta sería 0 y solo se le asigna el valor que ya tiene a existencias
	SET existencias = existencias + (OLD.cantidad - NEW.cantidad)
	WHERE id_servicio = OLD.id_servicio 
		AND id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto');
		
	RETURN NEW;
END
$$ --}

SELECT * FROM servicios
SELECT * FROM ordenes
UPDATE ordenes SET cantidad = cantidad - 1 WHERE id_orden = 147

-- TRIGGER PARA SUMAR UNA EXISTENCIA AL PRODUCTO
-- DESENCADENADOR: UPDATE EN ORDENES
CREATE OR REPLACE TRIGGER TGG_agregar_existencia
AFTER UPDATE ON ordenes
	FOR EACH ROW
	EXECUTE PROCEDURE FUN_agregar_existencia()
	

-- FUNCIÓN QUE ACTUALIZA EL ESTADO DE UN PRODUCTO A 'No disponible' cuando se agotan las existencias
CREATE OR REPLACE FUNCTION FUN_cambiar_estado()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$ --{
DECLARE 
 _existencias_ integer;
BEGIN
-- obtener la existencias del producto actualizado
	SELECT existencias FROM servicios WHERE id_servicio = OLD.id_servicio INTO _existencias_;
-- 	verficar sí el la existencia del producto es 0
	IF _existencias_ <= 0 THEN --then como finalizar condición
-- 		actualizar idestado al del valor del estado llamada 'No disponible'
		UPDATE servicios SET id_estado_servicio = (SELECT id_estado_servicio FROM estados_servicios WHERE estado = 'No disponible' ) 
		WHERE id_servicio = OLD.id_servicio AND id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto');
	END IF;
	
	RETURN NEW;
END
$$;--}

SELECT * FROM servicios
INSERT INTO public.ordenes(id_servicio, descuento, cantidad, id_empleado, id_factura) VALUES (38, 0.00, 48, 1, 21)
SELECT * FROM ordenes

UPDATE ordenes SET cantidad = 0 WHERE id_orden = 150
-- TRIGGER PARA ACTUALIZAR ESTADO
-- DESENCADENADOR UPDATE O CREATE ON ordenes
CREATE OR REPLACE TRIGGER TGG_cambiar_estado
AFTER INSERT OR UPDATE ON ordenes
	FOR EACH ROW
	EXECUTE PROCEDURE FUN_cambiar_estado()
	
	SELECT * FROM estados_facturas
	
-- 	FUNCIÓN PARA ACTUALIZAR ESTADO DE LA FACTURA DESPUÉS DE 1 MES
CREATE OR REPLACE FUNCTION FUN_desabilitar_factura()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$ -- {
DECLARE
	_estado_ integer;
BEGIN
-- obtener id estado correspondiente
	SELECT id_estado_factura FROM estados_facturas WHERE estado = 'Plazo vencido' INTO _estado_;
-- 	Tomar espera de 1 mes para actualizar estado
	PERFORM pg_sleep(interval '1 month');
-- 	actualizar estado
	UPDATE factura SET id_estado_factura = _estado_
	RETURN NEW;
END
$$
--}
-- TRIGGER PARA ACTUALIZAR ESTADO DE FACTURA CUANDO PASÉ 1 MES
-- A PARTIR DEL REGISTRO QUE SE AGREGÉ, ESPERARÁ 1 MES, Y DESPUÉS MODIFICARÁ EL ESTADO
CREATE OR REPLACE TRIGGER TGG_desabilitar_factura
AFTER INSERT ON facturas
FOR EACH ROW 
EXECUTE PROCEDURE FUN_desabilitar_factura()

-- 			(  O  P  E  R  A  D  O  R     A  R  I  T  M  E  T  I  C  O  )

-- MOSTRAR EL SUBTOTAL DE LAS FACTURAS
SELECT f.id_factura as numero_de_factura, s.nombre_servicio as servicio,
o.cantidad, s.precio, o.cantidad*s.precio as subtotal, o.id_orden
	FROM facturas f
	JOIN ordenes o
	ON f.id_factura = o.id_factura
	JOIN servicios s
	ON o.id_servicio = s.id_servicio

-- 			(  O  P  E  R  A  D  O  R     L  O  G  I  C  O  )
-- Mostrar las existencias de los productos 
SELECT nombre_servicio, existencias
FROM servicios s
INNER JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio
WHERE tipo_servicio = 'Producto'

-- 			(  F  U  N  C  I  O  N     A  G  R  E  G  A  C  I  O  N)
-- Mostrar la cantidad de empleados con un cargo
SELECT c.id_cargo, c.cargo, COUNT(e.id_cargo) as empleados 
	FROM cargos c
	LEFT JOIN empleados e ON c.id_cargo = e.id_cargo
	GROUP BY c.id_cargo, c.cargo
	ORDER BY c.id_cargo ASC
	
-- 			(  P  A  R  A  M  E  T  R  I  Z  A  D  A  S)
-- MOSTRAR LOS SUBTOTATALES DE UNA FACTURA
SELECT o.id_orden as NoOrden, s.nombre_servicio, s.precio, o.cantidad, (s.precio * o.cantidad) as subtotal, f.id_factura
FROM ordenes o
INNER JOIN servicios s ON s.id_servicio = o.id_servicio
INNER JOIN facturas f ON f.id_factura = o.id_factura
WHERE f.id_factura = 21

-- MOSTRAR EL TOTAL DE UNA FACTURA
SELECT SUM(s.precio * o.cantidad) as Total
FROM ordenes o
INNER JOIN servicios s ON s.id_servicio = o.id_servicio
INNER JOIN facturas f ON f.id_factura = o.id_factura
WHERE f.id_factura = 21

-- MOSTRAR LA CANTIDAD DE FACTURAS QUE TIENE UN CLIENTE (CONSUMO) GENERAL
SELECT c.nombres, COUNT(o.id_factura) AS cantidad_facturas
FROM clientes c
JOIN facturas f ON c.id_cliente = f.id_cliente
JOIN ordenes o ON f.id_factura = o.id_factura
GROUP BY c.nombres
ORDER BY COUNT(o.id_factura) DESC;

-- MOSTRAR LA CANTIDAD DEL CONSUMO DE SERVICIOS DE LOS CLIENTES
SELECT c.nombres, COUNT(f.id_factura) AS cantidad_facturas
FROM clientes c
JOIN facturas f ON c.id_cliente = f.id_cliente
JOIN ordenes o ON f.id_factura = o.id_factura
JOIN servicios s ON o.id_servicio = s.id_servicio
WHERE s.id_tipo_servicio <> (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto') 
							--obtener el id del tipo servicio llamado producto
GROUP BY c.nombres;

SELECT * FROM facturas
SELECT * FROM ordenes
SELECT * FROM servicios
SELECT * FROM tipos_servicios
SELECT * FROM clientes


-- MOSTRAR LA CANTIDAD DE CONSUMO DE PRODUCTOS DE LOS CLIENTES
SELECT c.nombres, COUNT(o.id_factura) AS cantidad_facturas
FROM clientes c
JOIN facturas f ON c.id_cliente = f.id_cliente
JOIN ordenes o ON f.id_factura = o.id_factura
JOIN servicios s ON o.id_servicio = s.id_servicio
WHERE s.id_tipo_servicio = (SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = 'Producto') --id tipo servicio llamada producto
GROUP BY c.nombres
ORDER BY COUNT(o.id_factura) DESC;

-- 			(  F  E  C  H  A  S      P  A  R  A  M  E  T  R  I  Z  A  D  A  S)

-- MOSTRAR LA CANTIDAD DE FACTUAS QUE TIENE UN CLIENTE EN UN MES (CONSUMO MENSUAL)
SELECT c.nombres, COUNT(o.id_factura) AS cantidad_facturas
FROM clientes c
JOIN facturas f ON c.id_cliente = f.id_cliente
JOIN ordenes o ON f.id_factura = o.id_factura
WHERE f.fecha BETWEEN '2023-11-01' AND '2023-11-30'
GROUP BY c.nombres
ORDER BY COUNT(o.id_factura) DESC;


-- MOSTRAR LAS RESERVACIONES APARTIR DE AHORA (2/5/2023) EN ADELANTE
SELECT r.fecha, r.hora, c.dui, CONCAT( c.nombres,' ', c.apellidos) as Cliente,
	c.telefono, e.dui, CONCAT(e.nombres,' ', e.apellidos) AS Empleado, s.estado	
FROM reservaciones r
INNER JOIN empleados e ON e.id_empleado = r.id_empleado
INNER JOIN clientes c ON c.id_cliente = r.id_cliente
INNER JOIN estados_reservaciones s ON s.id_estado_reservacion = r.id_estado
WHERE r.fecha >= CURRENT_DATE --current date, fecha actual
ORDER BY r.fecha ASC

-- MOSTRAR LOS PRODUCTOS MÁS COMPRADOS EN DESDE EL INICIO DE ESTE AÑO HASTA AHORA (2/5/2023)
SELECT s.nombre_servicio, s.precio, s.existencias, COUNT(*) as Comprado
FROM ordenes o
INNER JOIN servicios s ON s.id_servicio = o.id_servicio
INNER JOIN facturas f ON f.id_factura = o.id_factura
WHERE f.fecha BETWEEN '2023-01-01' AND CURRENT_DATE --current date, fecha actual
GROUP BY  s.nombre_servicio, s.precio, s.existencias

--   E   V   A   L  U  A   C   I   O   N

-- Agregar 2 servicios y 1 productoa una nueva orden
INSERT INTO public.facturas(id_cliente, fecha, hora, id_estado_factura)
VALUES (22, '2023-04-04', '8:16', 2)

Insert into public.ordenes(id_servicio, descuento, 
cantidad, id_empleado, id_factura)
Values (38, 0.00, 2, 5, 42),
(28, 0.50, 1, 5, 42),
(32, 0.27, 1, 5, 42);


-- (Actualizar los datos de los servicios que no existan en ordenes y su estado sea 1)
-- actualizar a estado a no disponible
UPDATE servicios SET id_estado_servicio = (SELECT id_estado_servicio 
										   FROM estados_servicios 
										   WHERE estado = 'No disponible')
WHERE id_servicio = (SELECT s.id_servicio
					FROM servicios s
					LEFT JOIN ordenes o ON o.id_servicio = s.id_servicio
					GROUP BY s.id_servicio, s.nombre_servicio
					HAVING COUNT(o.id_servicio) = 0 AND id_estado_servicio = (SELECT id_estado_servicio 
																			  FROM estados_servicios 
																			  WHERE estado = 'Disponible') LIMIT 1
					)
-- OBTENER LOS SERVICIOS QUE NO TENGAN ORDENES
INSERT INTO servicios 
		(id_tipo_servicio, descripcion, precio, existencias, id_estado_servicio, nombre_servicio) VALUES
SELECT *
FROM servicios s
LEFT JOIN ordenes o ON o.id_servicio = s.id_servicio
GROUP BY s.id_servicio, s.nombre_servicio
HAVING COUNT(o.id_servicio) = 0 AND id_estado_servicio = (SELECT id_estado_servicio FROM estados_servicios WHERE estado = 'Disponible')

	
-- eliminar los servicios o productos que existan en ordenes y el estado del servicio sea 1
	
	select  * from servicios where id_servicio in (39,38,28,32,27,31,32,33,34);
	select * from ordenes;
	select * from tipos_servicios;
	select * from estados_servicios;