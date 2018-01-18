# sb223ce-examination-2
Examination assignment 2 for Buttar Sarpreet Singh, WP2017

## How to run

1. `npm install`
2. `npm start`

## API "RESTful"
**Sign up**
----
* **URL** `/api/signup`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**

        {
            "username": "sarpreet",
            "password: "singh"
        }
* **Success Response:**
    * **Code:** 201 <br />
        **Content:** 
                
            { 
                message: "signed up successfully"
            }
* **Error Responses:**
    * **Code:** 400 <br />
        **Content:** 
            
            { 
                "error" : "username/password length must be between 5 and 10" 
            }

         **Content:** 

            {
                "error:" "username/password must be provided"
            }

    * **Code:** 403 <br />
        **Content:** 
    
            { 
                "error" : "username already exist" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
---
**Log in**
----
* **URL** `/api/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**

        {
            "username": "sarpreet",
            "password: "singh"
        }
* **Success Response:**
    * **Code:** 200 <br />
        **Content:**
                
            { 
                "message" : "logged in successfully" 
            }
* **Error Responses:**
    * **Code:** 400 <br />
        **Content:** 
            
            { 
                "error" : "username/password length must be between 5 and 10" 
            }
        **Content:** 

            {
                "error:" "username/password must be provided"
            }

    * **Code:** 401 <br />
        **Content:** 
    
            { 
                "error" : "login failed" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
* **Note:** `It also returns cookie which you need for authorization.`
---
**Log out**
----
* **URL** `/api/logout`
* **Method:** `GET`
* **Success Response:**
    * **Code:** 200 <br />
        **Content:**
                
            { 
                "message": "logged out successfully"
            }
* **Error Responses:**
    * **Code:** 403 <br />
        **Content:** 
    
            { 
                "error" : "forbidden" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
---
**Create a snippet**
----
* **URL** `/api/snippets`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**

        {
            "content": "console.log('hello world')"
        }
* **Success Response:**
    * **Code:** 201 <br />
        **Content:** 
                
            { 
                snippet: {
                    "_id": "5a071f898becbd35e37c943e",
                    "username": "sarpreet",
                    "content": "console.log('hello world')",
                    "__v": 0
                }
            }
* **Error Responses:**
    * **Code:** 400 <br />
        **Content:** 
            
            { 
                "error" : "content length must be between 1 and 1000" 
            }
        
        **Content:** 

            {
                "error:" "content must be provided"
            }

    * **Code:** 403 <br />
        **Content:** 
    
            { 
                "error" : "forbidden" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
---
**Update a snippet**
----
* **URL** `/api/snippets`
* **Method:** `PUT`
* **Headers:** `Content-Type: application/json`
* **Body:**

        { 
            snippet: {
                "_id": "5a071f898becbd35e37c943e",
                "username": "sarpreet",
                "content": "console.log('added tags')",
                "tags": [
                    "js"
                ]
            }
        }
* **Success Response:**
    * **Code:** 200 <br />
        **Content:** 
                
            { 
                snippet: {
                    "_id": "5a071f898becbd35e37c943e",
                    "username": "sarpreet",
                    "content": "console.log('added tags')",
                    "tags": [
                        "js"
                    ],
                    "__v": 0
                }
            }
* **Error Responses:**
    * **Code:** 400 <br />
        **Content:** 
            
            { 
                "error" : "content length must be between 1 and 1000" 
            }
        
        **Content:** 

            {
                "error:" "content must be provided"
            }

    * **Code:** 403 <br />
        **Content:** 
    
            { 
                "error" : "forbidden" 
            }

    * **Code:** 400 <br />
        **Content:** 
    
            { 
                "error" : "not found" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
* **Note:** `tags are optional`
---
**Delete a snippet**
----
* **URL** `/api/snippets/:snippedId`
* **Method:** `DELETE`
* **Success Response:**
    * **Code:** 200 <br />
        **Content:** 
                
            { 
                "message": "deleted successfully"
            }
* **Error Responses:**
    * **Code:** 403 <br />
        **Content:** 
    
            { 
                "error" : "forbidden" 
            }

    * **Code:** 400 <br />
        **Content:** 
    
            { 
                "error" : "not found" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
---
**Get snippets**
----
* **URL** `/api/snippets?{username}{tag}`
* **Method:** `GET`

* **Success Response:**
    * **Code:** 200 <br />
        **Content:** 
                
            { 
                snippets: [
                    {
                        "_id": "5a071f898becbd35e37c943e",
                        "username": "sarpreet",
                        "content": "console.log('sticky snippets')",
                        "__v": 0,
                        "tags": [
                            "js"
                        ]
                    }
                ....
                ]
            }
* **Error Response:**
    * **Code:** 404 <br />
        **Content:** 
    
            { 
                "error" : "not found" 
            }

    * **Code:** 500 <br />
        **Content:** 
    
            { 
                "error" : "internal server error" 
            }
---