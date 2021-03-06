# Tarea 3: Sistemas Distribuidos

Integrantes del grupo: Guillermo Martínez, Benjamín Ojeda

Tecnologías utilizadas Nodejs y Cassandra.

Modulos de Node utilizados:

* express -> Para levantar el servicio de la api
* Cassandra-drivers -> Para realizar la conexión de la base de datos

## Instrucciones de ejecución

* Clonar el repositorio de github: https://github.com/Benja-Suprinha/Tarea3
* Luego de clonarlo, se deben ingresar los siguientes comandos:
```shell
docker-compose build
docker-compose up
```
Con esto se levantan los servicios y podemos utilizar la app en el localhost.

Dentro del local host se puede acceder a lo siguiente:

* localhost:3000/recetas -> se "ven" todas las recetas creadas (en formato json).
* localhost:3000/pacientes-> se "ven" todas las pacientes creadas (en formato json).
* localhost:3000/create -> recibe un json por el metodo post con los parametros {nombre, apellido, rut, mail, fecha de nacimiento, comentario, farmacos, doctor}.

En esta sección de create se tiene en cuenta que, si el paciente no exite, se crea al paciente y la receta, pero si el paciente existe se crea solo la receta.

* localhost:3000/edit -> recibe un json por el metodo post con los parametros {id, comentario, farmacos, doctor} -> verifica si existe la receta y si existe la edita.
* localhost:3000/delete -> recibe un json por el metodo post con el parametro {id} -> verifica si existe la receta y si existe la borra.

## Preguntas

### Pregunta 1:

* Explique la arquitectura que Cassandra maneja.
 
Cassandra es una base de datos distribuida NoSql que maneja una arquitectura Peer-2-Peer, por esto los datos son distribuidos a lo largo de todos los nodos del cluster y permite crear replicar para tolerar los fallos, gracias a ésta arquitectura todos los nodos estan intercambiando información entre ellos de manera continua a través de Gossip.

* Cuando se crea el clúster ¿Cómo los nodos se conectan?

Los nodos estan conectados en base a una topología de anillo, en donde cada uno de ellos se comunica con los dos nodos a su alrederor y así se comparten la información

* ¿Qué ocurre cuando un cliente realiza una petición a uno de los nodos?

Cuando un cliente realiza una petición a un nodo, éste actua como coordinador entre el cliente y el resto de los nodos en donde se encuentran los datos afectados por la consulta, el nodo coordinador se encarga de determinar que nodos deben responder a la consulta.

* ¿Qué ocurre cuando uno de los nodos se desconecta?

No ocurre nada malo cuando un nodo se desconecta, puesto que la información que éste contiene está distribuida en todo el data center en los demás nodos, sería algo muy malo si todos los nodos se desactivaran, pero es algo muy improbable.

* ¿La red generada entre los nodos siempre es eficiente?

Se puede decir que es eficiente a la hora de distribuir las réplicas y consultas gracias a su componente Snitch, también es eficiente cuando se realizan escrituras, ya que Cassandra escribe los datos inicialmente en memoria y no en el disco, pero presentas dificultades al momento de la leer, ya que si no se realiza un proceso de compactación, se ejecutan varias lecturas sobre la información de los nodos, lo que genera una menor velocidad de respuesta.

* ¿Existe balanceo de carga? 

Si existe un balanceo de carga ya que la información está distribuida en los diferentes nodos del cluster, una de las estrategias que usa es RandomPartitioner

### Pregunta 2:

* Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son estos? 

SimpleStrategy, que se usa cuando los datos se quieren almacenar en un solo data center, y NetworkTopologyStrategy, se usa cuando se planea desplegar el clúster en múltiples data centers.

* ¿Cuál es la ventaja de uno sobre otro? 

La ventaja que tienen uno sobre el otro está dada por su propia definición, SimpleStrategy tiene grandes ventajas al momento de alamcenar datos en un solo cluster, ya que estos poseen replicas entre sus nodos adyacentes y comparten información de forma mas compacta y rápida, mientras para escalas mayores en cuanto a cantidad de data centers NetworkTopologyStrategy tiene la ventaja, porque las réplicas pueden estar distribuidas en los distinos data centers y así el sistema es más tolerante al fallo o problemas en la red.

* ¿Cuál utilizaría usted para en el caso actual y por qué? Justifique apropiadamente su respuesta.

Para el caso actual utilizariamos el SympleStrategy, porque se tiene un cluster con un único datacenter que  posee 3 nodos, y se busca generar réplicas entre los nodos

### Pregunta 3

* Teniendo en cuenta el contexto del problema ¿Usted cree que la solución propuesta es la correcta?

Si creemos que la solución propuesta es la correcta, porque se logra ejecutar lo solicitado por el problema usando las herramientas distribuidas que posee Cassandra, como generar una base de dato escalable y distribuida gracias a la replicación que existe entre los nodos.

* ¿Qué ocurre cuando se quiere escalar en la solución? 

Cassandra tiene la posibilidad de escalar horizontalmente y de forma lineal, ya que se pueden aumentar los nodos y los data centers, pero para esto se requiere del uso de otra estrategia, la NetworkTopologyStrategy y así adecuarse a los grandes números de consultas que se puedan realizar.

* ¿Qué mejoras implementaría? Oriente su respuesta hacia el Sharding (la replicación/distribución de los datos) y comente una estrategia que podría seguir para ordenar los datos.

Algunas mejoras que implementaría en la solución sería agregar mas nodos, para que la información esté más distribuida y generar un poco de redudancia, pero garantizando una tolerancia a fallos, también se podría considerar el hecho de agregar mas data centers, cambiando la estrategia a NetworkTopologyStrategy y así balancear aún más la carga.
