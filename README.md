# monorepo
This repo has some of the code snippets you need for being able to successfully complete this project.

Some of the work will be split in weeks so that you can easily follow allow and do the work needed.

Week 1: Intro 
Week 2: Project setup 
Week 3: Bridging USDC between ETH and Polygon using Stargate 
Week 4: Bridging USDC between ETH and Polygon using Axelar  
Week 5: Create a simple interface 
Week 6: wrap up 

## Week 1
You can find the break down here: https://openavenuesfoundation.sharepoint.com/:w:/r/_layouts/15/Doc.aspx?sourcedoc=%7BE1D768D4-80C8-4C71-ACDF-8D63553D8003%7D&file=Project%20timeline.docx&action=default&mobileredirect=true

## Week 2 -> Project setup
For this week, the goal is to setup our project so that we can be ready for active development. 

- Install software and get familiar with technical stack
> VSCode
>> We recomnend using VSCode for writing the code. Feel free to use other code editing and development tools you like.
>> You can download and install VSCode from here: https://code.visualstudio.com/download

> Iterm
>> Instead of using the built in terminal, download and install iterm2 terminal for a much better experience.
>> You can download and install iterm2 from here: https://iterm2.com/downloads.html 

> NodeJs
>> For this project, we use NodeJs as our server for running Typescript. 
>> You can download and install NodeJS from here: https://nodejs.org/en/download

> Node Provider 
>> To be able to connect to any blockchain, you need to use a node provider. You should create a test account with either Alchemy, Infura or QuickNode
>> Alchemy : https://www.alchemy.com 
>> Infura : https://www.infura.io 
>> QuickNode: https://www.quicknode.com 

> Docker 
>> We use docker for containers for running databases 
>> You can download docker here: https://www.docker.com

- Create git repo 
> If you do not have a github account, please create one here: https://github.com 
> After that, create a new git repository for this project
>> Feel free to name the repository whatever name you prefer. I called mine bridge-evaluation-backend
>> To learn more about how to create a github repository, follow the steps here: https://docs.github.com/en/get-started/quickstart/create-a-repo

- Start a nodejs project with TS 
> Using the github repository before, start a Typescript project using the followig steps
>> Clone the repostory you created to your local environment. Example is here: https://github.com/git-guides/git-clone
```
git clone <path to remote>
```

> cd into the project folder 
```
cd <repository-name>
```

>> Create a new branch called `starting-a-project` to start creating the new project
```
git checkout -b starting-a-project
```

> create the project
```
npm init -y
```

> install typescript 
```
npm install typescript --save-dev
```

> Install NodeJS types
```
npm install @types/node --save-dev
```

> create a config file `tsconfig.json`
```
npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

> create a src folder and add an `index.ts` file
```
mkdir src && touch src/index.ts
```

> Open the `index.ts` file and add the following print statement
```
console.log('Hello world!')
```

> verify that everything runs as expected using the following
```
ts-node ./src/index.ts
```
>> you should see a `'Hello world!'` output on the terminal


Congratulations, you have a working project. Let's save this project to git before we proceed.

- Make your first pull request (PR)
> Now, we want to our code to git
>> you may need to sign in to git. You can follow the steps here if you run into issues https://docs.github.com/en/get-started/quickstart/set-up-git 

>> if/after we are signed in, let's commit and push our code
```
git commit -am "initializing the project" && git push -u origin starting-a-project
```

> after the branch has been pushed the main, lets create a new PR 
>> follow the steps here: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request 

> after creating a the PR, merge it to main
>> You can follow the steps here: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request


- Add PostgreSql container to the project
> first, let's create a new branch called `adding-pg-containers`
```
git checkout main && git pull && git checkout -b adding-postgresql
```
>> before proceeding, make sure you can see your changes from the setup steps above

> Start your docker
>> go to applications and start the docker application

> copy the compose file I added to this repository to your project.

> start the docker containers
```
docker-compose up -d
```

> connect to your postgresql databse using pgadmin
1. Navigate to localhost:5001 and sign in using credentials in the `compose.yml` file (that is, email: admin@admin.com and password: root)
2. Register a server named evaluating-bridges in pgadmin with the following creds
   1. Host-name/Address: `<Container Name of the service named db in compose.yml>`
   2. Port: `<Container Port of the service named db in compose.yml>`
   3. Username: `<POSTGRES_USER env var of the service named db in compose.yml>`
   4. Password: `<POSTGRES_PASSWORD env var of the service named db  compose.yml>`
3. Create a database named `evaluating_bridges_test`

> Once the following runs, create a PR with the changes and merge it like we did before.

```
git commit -am "initializing the project" && git push -u origin adding-pg-containers
```
> https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request 
> https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request

- Add postgreSql and typeorm to the project
> first, let's create a new branch called `adding-pg-and-typeorm`
```
git checkout main && git pull && git checkout -b adding-pg-and-typeorm
```
>> before proceeding, make sure you can see your changes from the setup steps above

> install postgresql to the project: this it the databases we are going to be using
```
npm install pg
```

> install typeorm
```
npm install typeorm
```

> install reflect-metadata: we need it for typeorm
```
reflect-metadata
```

> copy the `data_source.ts` file I added to this repository to your project.

> copy the `src/index.ts` file I added to this repository to your project.

> run the following to make sure that your database is working
>> make sure you have your docker running and your database is up as well.
```
ts-node ./src/index.ts
```
>> you should get the following output: `"[Success] DB is connected"`

> Once you have everything running, create a PR with the changes and merge it like we did before.

```
git commit -am "initializing the project" && git push -u origin adding-pg-and-typeorm
```
> https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request 
> https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request
