# Dox

Dox is a automation system for [Telegram](https://telegram.org/).

> [!WARNING]
> This project is in early development state, so there are some bugs and some features are not yet implemented.

## Get started
To get started you need an API_ID and API_HASH from https://core.telegram.org/api/obtaining_api_id

### .env
Create .env file and fill it this way:

```env
API_ID="YOUR_API_ID"
API_HASH="YOUR_API_HASH"
SESSION=
```

### config.json
Create config.json file and fill it. 

Example:

```json
{
    "target": "@ElonMusk", // or ID,
    "messages": [
        {
            "text": ".next",
            "wait_message": { // DOX will wait **forever** until this message is received. Unless use set a timeout option(NOT YET IMPLEMENTED)
                "target": "@all",
                "reply": "Hello",
                "wait_message": {
                    "target": "@yes",
                    "reply": "Are you okay?",
                    "wait_message": {
                        "target": "@no",
                        "reply": "Oh.. Im sorry to hear that. How old are you?",
                        "wait_message": {
                            "target": "@num",
                            "reply": "Oh so you a kid!"
                        }
                    }
                },
                "timeout": 5 // 5 seconds before stop  waiting
            },
            "delay": 1, // 1 second before next message
        }
    ]
}
```

## Keywords
- @all
    - Any images
- @num
    - Any numbers inside the text
- @yes
    - Yes word in different languages
- @no
    - No word in different languages


# Roadmap
- ~~timeout to not wait forever~~
- ~~keywords~~
    - ~~@all, @num, @yes, @no, etc.~~
- Sending media
    - Files
    - Images
    - Photos
    - Videos
    - Audios
    - Stickers
    - Gifs
- Storing the messages
    - Options like google drive, sqlite db, local json file, or posting to channel
- OpenAI API
    - Be able to use OpenAI API to do some actions with the messages
- Group actions
    - Invite Users
    - Ban Users
- Copying
    - Copy all messages from a chat
    - Copy all posts from a channel
    - Copy all messages from a group

# Credits
[gram.js](https://gram.js.org)
