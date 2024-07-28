# **Diamond Valuation System**

###### We are creating a website to help customers valuate their diamond, using Reactjs as frontend, Spring Boot as backend and Microsoft SQL Server.

> [!NOTE]  
> **List of project document, database, prototype,...**
> - [Project Idea](https://docs.google.com/spreadsheets/d/1LRaiOdBpciMyHXF5gGKJlupdvQVtT5ZzRIgxi-Kn65k/edit#gid=0)
> - [SRS Template](https://docs.google.com/document/d/12AUL1aJ3ATM5l3I09eTm-cD1GqVroTxQAkFMPD_MalU/edit#heading=h.gjdgxs)
> - [Draw SQL](https://drawsql.app/teams/swp391-6/diagrams/diamond-valuation-system)
> - [Figma Prototype](https://www.figma.com/design/P2hVcvydyJ4b7MRJo3lVPx/Serenity-Jewelry-Landing-Page-(Community)?node-id=0-1&t=uc7QJNoGuJHnrPDV-0)
> - [Draw IO](https://drive.google.com/file/d/1_bWkAalqmsxhNFyRXtQRYdwDi9JMrb18/view?usp=sharing)

>[!IMPORTANT]
> **How to use git command** \
>\
> Pull the project to your computer, run this command in **Terminal**:\
> `git clone https://github.com/NguyenTuan03/Diamond_Shop_System.git`\
>\
>Create a new branch, do your task and push it in your branch:
>1. `git branch <branch-name>` *// If the branch-name hasn't existed, else create a new branch*
>2. `git checkout -b <branch-name>` *// Go to your branch before start coding*
>3. `git add .`
>4. `git commit -m "..."`
>5. `git push origin <branch-name>` *// After finish coding, push your code to your branch*
><!-- end of the list -->
>Merge your branch to main branch:
>1. `git checkout main`
>2. `git merge <branch-name`
><!-- end of the list -->
>Rollback your previous version
>- `git log` *// view previous versions*
>- `git checkout <commit-id>`

>[!TIP]
>**How to use GitHub Desktop**\
>\
>Use GitHub Desktop to commit your code:
>- ![image](https://github.com/NguyenTuan03/Diamond_Shop_System/assets/89993051/724e0ed8-d784-4e0d-a280-1f1e274dccde)
>- This is the basic view of GitHub Desktop when you update your code in your own branch
>- ![image](https://github.com/NguyenTuan03/Diamond_Shop_System/assets/89993051/ea7137db-2bdb-4889-bedb-f491f3f8f567)
>- You must fill in the **Summary** if you want to commit, **Description** is optional
>- ![image](https://github.com/NguyenTuan03/Diamond_Shop_System/assets/89993051/898c3b20-2948-4084-90a6-17d8f9d22474)
>- After fill in **Summary** and **Description** press the **Committ** button
>- ![image](https://github.com/NguyenTuan03/Diamond_Shop_System/assets/89993051/cb75b68d-cab8-42f0-965b-1d15edd9b63a)
>- And then press **Push origin** to push the commit to your branch





>[!TIP]
>**How to write a better commit message**\
>\
>The Anatomy of a Commit Message:
>- **Basic**: `git commit -m <message>`
>- **Detailed**: `git commit -m <title> -m <description>`
><!-- end of the list -->
>Commit type:
>- **feat**: a new feature is introduced with the changes
>- **fix**: a bug fix has occurred
>- **chore**: changes that do not relate to a fix or feature and don't modify src or test files (for example updating dependencies)
>- **refactor**: refactored code that neither fixes a bug nor adds a feature
>- **docs**: updates to documentation such as a the README or other markdown files
>- **style**: changes that do not affect the meaning of the code, likely related to code formatting such as white-space, missing semi-colons, and so on.
>- **test**: including new or correcting previous tests
>- **perf**: performance improvements
>- **ci**: continuous integration related
>- **build**: changes that affect the build system or external dependencies
>- **revert**: reverts a previous commit
><!-- end of the list -->
>Good commits:
>- feat: improve performance with lazy load implementation for images
>- chore: update npm dependency to latest version
>- Fix bug preventing users from submitting the subscribe form
>- Update incorrect client phone number within footer body per client request
><!-- end of the list -->
>Bad commits:
>- fixed bug on landing page
>- Changed style
>- oops
>- I think I fixed it this time?
><!-- end of the list -->
>[More details](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)


> [!WARNING]  
> You can merge your branch into **main** only if you are **authorized**

> [!CAUTION]
> Never write your code in **main** branch
