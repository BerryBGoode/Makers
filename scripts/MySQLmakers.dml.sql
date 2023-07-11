-- inserciones
INSERT INTO tipos_servicios(id_tipo_servicio, tipos_servicios)
	VALUES 	(UUID(), 'Corte'),
			(UUID(),'Barba'),
			(UUID(),'Facial'),
			(UUID(),'Producto');

INSERT INTO cargos(
	id_cargo, cargo, tets_id)
	VALUES 	(UUID(),'Gerente'),
			(UUID(),'Barbero'),
			(UUID(),'Asistente de gerencia');

INSERT INTO public.horarios(
	 id_horario, hora_apertura, hora_cierre)
	VALUES 	(UUID(), '8:00', '17:00'),
			(UUID(), '8:00', '12:00'),
			(UUID(), '12:00', '17:00'),
			(UUID(), '8:00', '15:00');    

INSERT INTO sucursales(
	 id_sucursal, nombre_sucursal, direccion, telefono, horario)
	VALUES 	
(UUID(), 'Makers Santa Tecla', 'P. sherman calle wallaby 42 sidney', '7890-0345', '8:00 A.M - 5:00 P.M'),
(UUID(), 'Makers San Salvador', 'Local 4, 39 Avenida Norte, Avenida Centroamérica Boulevard Universitario, Centro Comercial Universitario, San Salvador.', '7958-3786', '8:00 A.M - 7:00 P.M');

INSERT INTO clientes(
	 id_cliente, nombres, apellidos, dui, telefono, correo, clave)
	VALUES 	(UUID(), 'Carlos', 'Gonzalez', '00723488-7', '7895-6348', 'carlosgonz@gmail.com', '$DsnIs'),
			(UUID(), 'Juan', 'Ramirez', '35689421-8', '7659-1235', 'Juanram@gmail.com', '#fjS@lo'),
			(UUID(), 'Stephanie', 'Galdamez', '32541987-5', '7692-0136', 'StephGal@gmail.com', '@flS7fsd'),
			(UUID(), 'Oswaldo', 'Díaz', '24215637-9', '7982-0123', 'OsDiaz@gmail.com', '$kSh3s'),
			(UUID(), 'Cristian', 'Mena', '20143560-7', '7963-1598', 'Crismena@gmail.com', '#mKi4d2'),
			(UUID(), 'Regina', 'Hernandez', '25631487-0', '7069-2468', 'ReginaHerx@gmail.com', '@mL4n5'),
			(UUID(), 'Lucía', 'Gongora', '25789641-2', '7326-9365', 'LuciGon@gmail.com', 'w3scc0l'),
			(UUID(), 'Zara', 'Alvarado', '36487918-9', '6354-8659', 'Zara.al@gmail.com', '5dh$nsA'),
			(UUID(), 'Adriana', 'Pérez', '21456223-2', '7986-1569', 'Adperez@gmail.com', 'jh@6Sfn'),
			(UUID(), 'Nathaly', 'Saravia', '25447856-3', '7103-6985', 'Nathsaravia@gmail.com', 'skw#bs@2'),
            (UUID(), 'Cristian Fernando', 'Mena Navarro', '01324728-2', '78565465', 'fernandomena3131@gmail.com', '$2a$10$tVR6iw4nemVyBG2d1EfRquXGyuy/7VvWpTDwoVjNFbQqxFH3NvGwy');


INSERT INTO servicios(
	id_servicio, id_tipo_servicio, nombre_servicio, descripcion, precio, existencias, estado)
	VALUES
(UUID(), '8b889475-1f66-11', 'Corte de Cabello', 'Corte de cabello según el cliente', 5.00, 1, 1),
(UUID(), '8b9d3ffc-1f66-11', 'Corte de Barba', 'Corte de cabello según el cliente', 4.00, 1, 1),
(UUID(), '8b889475-1f66-11', 'Alisado', 'Un alisado para resplandecer tu cabello', 6.00, 1, 1),
(UUID(), '8b889475-1f66-11', 'Texturizado', 'Un texturizado  perfecto para moldear', 3.00, 20, 1),
(UUID(), '8b9d3ffc-1f66-11', 'Corte de Barba con Vapor de Ozono', 'Corte con nuestra especialidad de vapor al ozono', 7.00, 1, 2),
(UUID(), '8b9d4416-1f66-11', 'Lavado Spa', 'Un lavado para tu rostro', 6.00, 1, 1),
(UUID(), '8b889475-1f66-11', 'Corte de Cejas', 'Tu corte de cejas que tu rostro luzca bien', 4.00, 1, 2),
(UUID(), '8b889475-1f66-11', 'Diseños en Corte de Cabellos', 'Elige tu mejor corte de cabello', 4.00, 1, 2),
(UUID(), '8b9d4525-1f66-11', 'Mascarilla de Carbón Activado', 'Una mascarilla para tu rostro suave', 6.00, 20, 1),
(UUID(), '8b9d4525-1f66-11', 'Mascarilla con Vapor de Ozono', 'Una mascarilla para tu rostro suave', 6.00, 19, 1),
(UUID(), '8b889475-1f66-11', 'Afeitados', 'Cuida de tu barba, es lo que brilla en ti', 5.00, 1, 2),
(UUID(), '8b9d4525-1f66-11', 'Crema para cabello', 'Deja tu cabello en excelente cuidado', 3.00,50,1),
(UUID(), '8b9d4525-1f66-11', 'Vacelina', 'Da más suavidad a tú cabello', 2.50, 50, 1);


INSERT INTO empleados(
    id_empleado,
    alias,
    nombres,
    apellidos,
    dui,
    telefono,
    correo,
    clave,
    planilla,
    id_sucursal,
    id_horario,
    id_cargo,
    estado
)
VALUES(
    UUID(),
    'Carl',
    'Carlos',
    'Hernandz',
    '32659845-6',
    '7589-3652',
    'Carlosher@gmail.com',
    'ujF*0O60',
    250.00,
    'df5f7cb9-1f68-11',
    'da4c266c-1f67-11',
    '6534d990-1f67-11',
    1
),(
    UUID(),
    'Mon',
    'Monica',
    'Galdamez',
    '25463457-8',
    '7845-8965',
    'Monica@gmail.com',
    'km0P6^13',
    250.00,
    'df5f7cb9-1f68-11',
    'da4c266c-1f67-11',
    '65363baf-1f67-11',
    1
),(
    UUID(),
    'Alej',
    'Alejandro',
    'Gongora',
    '03210065-9',
    '7426-2365',
    'Alej@gmail.com',
    'mX46^91#',
    500.00,
    'df6f64d8-1f68-11',
    'da4c266c-1f67-11',
    '65363baf-1f67-11',
    1
),(
    UUID(),
    'Chamba',
    'Salvador',
    'Saravia',
    '01236547-8',
    '7896-1452',
    'SalSav@gmail.com',
    'b62P*pY8',
    500.00,
    'df6f64d8-1f68-11',
   	'da4c266c-1f67-11',
    '65363baf-1f67-11',
    1
),(
    UUID(),
    'Ferrrr',
    'Fernando',
    'Mena',
    '12345278-9',
    '7142-2546',
    'fernandomena3131@gmail.com',
    '$2a$10$KOdD8nEWmOD2TX7G6z4JfebdRE8FAHEzU5mg9s5sl4X4acyMcoY2K',
    250.00,
    'df6f64d8-1f68-11',
    'da4c266c-1f67-11',
    '6534d990-1f67-11',
    1
);