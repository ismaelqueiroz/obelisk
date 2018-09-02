pipeline {

    agent any

    options {

        skipDefaultCheckout()

        // For example, we"d like to make sure we only keep 10 builds at a time, so
        // we don"t fill up our storage!
        buildDiscarder(logRotator(numToKeepStr: "2"))

        // And we"d really like to be sure that this build doesn"t hang forever, so
        // let"s time it out after an hour.
        timeout(time: 25, unit: "MINUTES")

    }

    // global env variables
    environment {
        DATABASE_URL = "mongodb://172.17.0.1:27017/obelisk"
        RSA_PRIVATE_KEY = "obelisk-private.pem"
        RSA_PUBLIC_KEY = "obelisk-public.pem"
        SONAR_SCANNER_VERSION = "3.0.3.778"
        AWS_ECR_DISABLE_CACHE = true
        AWS_ECR_LOGIN = true
        CI = true
    }

    stages {

        stage("Checkout") {

            agent {
                docker {
                    image("node:alpine")
                }
            }

            steps {
                checkout(scm)
            }

        }

        stage("Install dependencies") {

            agent {
                docker {
                    image("node:alpine")
                }
            }

            steps {
                sh "npm install"
            }

        }

        stage("Run unit test") {

            agent {
                docker {
                    image("node:alpine")
                }
            }

            steps {
                sh "npm test"
            }

        }

        stage("Code publish") {

            agent {
                docker {
                    image("node:alpine")
                }
            }

            steps {
                parallel(
                    cobertura: {

                        sh "npm run coverage"

                        // Publish coverage
                        step([
                            $class                    : "CoberturaPublisher",
                            coberturaReportFile       : "**/**coverage.xml",
                            conditionalCoverageTargets: "70, 0, 0",
                            lineCoverageTargets       : "80, 0, 0",
                            methodCoverageTargets     : "80, 0, 0",
                            sourceEncoding            : "UTF_8",
                            autoUpdateHealth          : false,
                            autoUpdateStability       : false,
                            failUnhealthy             : false,
                            failUnstable              : false,
                            zoomCoverageChart         : true,
                            maxNumberOfBuilds         : 0
                        ])

                    },
                    junit: {

                        sh "npm run junit"

                        // Publish test"s
                        step([
                            $class     : "JUnitResultArchiver",
                            testResults: "**/**junit.xml"
                        ])

                    }
                )

            }

        }

        stage("Code analysis") {

            agent {
                docker {
                    image "ismaelqueiroz/sonar-scanner"
                }
            }

            steps {

                withSonarQubeEnv("SonarQube") {
                    sh("/sonarscanner/default/bin/sonar-scanner -Dsonar.login=${env.SONAR_AUTH_TOKEN} " +
                        "-Dsonar.host.url=${env.SONAR_HOST_URL}:9000 " +
                        "-Dsonar.branch=${env.BRANCH_NAME}")
                }

            }

        }

        stage("Code quality") {
            steps {
                script {
                    timeout(time: 1, unit: "HOURS") {
                        def qg = waitForQualityGate()
                        if (qg.status != "OK") {
                            error("Pipeline aborted due to quality gate failure: ${qg.status}")
                        }
                    }
                }
            }
        }

        stage("Development deploy approval") {
            steps {
                script {

                    if (currentBuild.result == null || currentBuild.result == "SUCCESS") {

                        timeout(time: 3, unit: "MINUTES") {
                            input message: "Approve deployment?"
                        }

                        timeout(time: 2, unit: "MINUTES") {
                            echo "build  ${env.BUILD_NUMBER} versions..."
                        }

                    }

                }
            }
        }

        stage("QA release approval and publish artifact") {
            when {
                branch "master"
            }
            steps {
                script {

                    if (currentBuild.result == null || currentBuild.result == "SUCCESS") {
                        timeout(time: 3, unit: "MINUTES") {
                            //input message:"Approve deployment?", submitter: "it-ops"
                            input message: "Approve deployment to QA?"
                        }
                    }

                }
            }
        }

    }

    post {
        always {
            cleanWs()
        }
    }

}
