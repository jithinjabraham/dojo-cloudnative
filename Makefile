createDockerContaner:
	docker-compose up

cleanDocker: 
	docker-compose down --remove-orphans