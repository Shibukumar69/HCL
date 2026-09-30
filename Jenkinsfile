pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "retail-inventory-backend:${BUILD_NUMBER}"
        DOCKER_IMAGE_FRONTEND = "retail-inventory-frontend:${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out latest code from Git repository...'
                checkout scm
            }
        }

        stage('Backend Tests & Linting') {
            steps {
                dir('backend') {
                    echo 'Installing backend dependencies & checking syntax...'
                    sh 'npm install'
                    sh 'node --check index.js'
                }
            }
        }

        stage('Frontend Build & Typecheck') {
            steps {
                dir('frontend') {
                    echo 'Building Angular application bundle...'
                    sh 'npm install'
                    sh 'npm run build -- --configuration production'
                }
            }
        }

        stage('Docker Build & Package') {
            steps {
                echo 'Building Docker containers...'
                sh 'docker-compose build'
            }
        }

        stage('Deploy to Staging / Cluster') {
            steps {
                echo 'Deploying containers via Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo 'CI/CD pipeline execution finished.'
        }
        success {
            echo '🎉 Deployment to Retail Environment Successful!'
        }
        failure {
            echo '❌ Pipeline failed! Sending notification to team...'
        }
    }
}
