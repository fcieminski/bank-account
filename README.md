# Work in progress.

MEVN (mongoDB, express.js, Vue, Node.js) stack app, quite a big project, so it's still in progress. The goal is to make "fake" banking account, with the most of the traditional banking account available options.

## What's done?

- [x] Sign up with passport
- [x] Account view 
	- [x] Newest transfers history
- [x] Transactions history view
	- [x] Advanced search and filtering options
	- [x] Posibility to export transfer confirmations
	- [x] Multiple exports
    - [ ] More options in transfer confirmations
- [x] Transfers view
	- [x] Posibility to make a transfer
	- [x]  Transfer code confirmation coming from backend
	- [x] Disable transfer if there isn't enough money on account  
- [x] Credit cards view
	- [x] Adding cards
	- [x] Removing cards
	- [x] Changing cards limits
	- [x] Blocking cards
- [x] Savings view
	- [x] Making saving goals
	- [x] Updating saving goals
	- [x] Removing saving goals and transfering money back to saving account
	- [x] Making direct transfer from saving account
	- [x] Uploading goal picture
	- [x] Transfering money from saving account to saving goals
	- [x]  Validate account money before making any transfers
- [x] Blik code generator
- [x] Widgets
	- [x] Transaction overall
	- [x] Planned transfers info
- [x] Planned transfers
	- [x] Posibility to set a periodical transfers
	- [x] Sending transfers with agenda package
    - [ ] Fix styles
- [x] Cover all empty value posibilities
- [x] Check app with fresh account

After that, i'll publish version 1.0

Next to do for sure will be code refactor. I was making this app for long time and It's my first ever app using Express and MongoDB, so I need to double check if I did everything right. Also I was thinking about converting passport authentication to JWT, but for now I'll stay with passport because integrating passport was such a pain, so I don't want to waste this code :smile:
