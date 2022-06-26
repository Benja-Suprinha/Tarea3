# Tarea 2: Sistemas Distribuidos

Integrantes del grupo: Guillermo Martínez, Benjamín Ojeda

Tecnologías utilizadas Nodejs y Kafka.

Modulos de Node utilizados:

* express -> utilizado para la api
* Kafkajs -> librería para implementar kafka
* fs -> leer y escribir archivos JSON

## Instrucciones de ejecución

* Clonar el repositorio de github: https://github.com/Benja-Suprinha/tarea1
* Luego de clonarlo, se deben ingresar los siguientes comandos:
```shell
docker-compose build
docker-compose up
```
Con esto se levantan los servicios y podemos utilizar la app en el localhost.

### Preguntas

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

* Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son estos? ¿Cuál es la ventaja de uno sobre otro? ¿Cuál utilizaría usted para en el caso actual y por qué? Justifique
apropiadamente su respuesta.
una gran cantidad de usuarios al mismo tiempo?

Escalar horizontalmente, en este contexto seria replicar las apis para así generar mas instancias y, por ende existirían mas consumers.

### Errores

Haciendo las ultimas pruebas en la apliación, nos surgieron los siguientes errores con el zookeper:

* KafkaJSNumberOfRetriesExceeded
* "error":"There is no leader for this topic-partition as we are in the middle of a leadership election"
* cause: KafkaJSProtocolError: There is no leader for this topic-partition as we are in the middle of a leadership election
