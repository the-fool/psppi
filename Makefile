datasets:
	python3 manage.py create_groups
	python3 manage.py create_questions
	python3 manage.py create_demographics
	python3 manage.py create_responses

build:
	docker-compose down
	docker-compose run client npm run build:prod
	docker rmi aa_django
	docker-compose build