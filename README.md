
## 1.command to start server ##

```
npm install

npm start
```
 ## 2. branches management ##

 since 2021/11/11, start to manage feature branch seperately, here are the procedure you are going to follow:
 - when you are assigned new task, create feature branch from branch 'develop2'
 - pull request to branch ' develop-feature-combine ' when task finished
 - pull request permitted, codes will be merged into branch 'develop2' from 'develop-feature-combine' and trigger Jekins pipeline
 - check your functionality on develp2 environment 
 https://phase2-va2-mvp2-dev2.japaneast.cloudapp.azure.com/apigw/va2roleplay/va2/
- change the status of that tickect in Jira from processing into QA testing and inform our QA
- 
- if issues were raised, fix them on your feature branch and merge into 'develop-feature-combine', repeat this procedure
- if the QA past, your codes will be merged into develop-combine from your feature branch, and then from develop-combine into develop, and trigger the Jekins pipeline
- when the deployment is completed, inform our QA to have a regression test on old develop environment:
https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com/apigw/va2roleplay/va2/

## 3. environment management ##
- 1. we distinguish the enviroment our application running by environment variables:
For develop environment:
npm run build:dev
For stage environment:
npm run build:stage
scripts are maintained in package.json.