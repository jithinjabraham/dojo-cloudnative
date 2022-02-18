COMPOSE_RUN_APP = docker-compose up

createDockerContaner:
	$(COMPOSE_RUN_APP)

cleanDocker: 
	docker-compose down --remove-orphans