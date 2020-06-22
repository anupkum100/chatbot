# This application is for chat bot and multiple user chating
* User.tsx is for multiple user chating 
* App.tsx is for Bot chating 

# User Chating (User.tsx)
* npm i
* npm start (this will start client code at localhost:3000 and JSON server at 8080)
* User.tsx has a variable named URL for the API calls
* For local setup Open 2 tabs fill your name and done you can chat now 
* For tunnel install ngork using brew cask install ngrok
* Name are used as unique param for your chat session and is stored in sessionStorage for furthur use
* change the ngork.yml file in your local file system (reference file is in the repository)
* run ngrok start --all
* This will give you 2 url one for client and one for json server 
* Replace the URL variable value from the json server url received in previous point 
* Share the client URL with your friends and you are done. :-) 
* All the chat data will be saved in db.json file


# BOT Chating (App.tsx)
* No login required
* Enter yoour name in the chat input box 
* The bot will respond after 2 second(configurable) of your last message
* For interactive UI bot typing is added for 2 second time(configurable)
* Bot typing can be used for API response timing 
* No chat data is saved