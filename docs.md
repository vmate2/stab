# Documentation for the Trefort stáb web page

Made with [NUXT](https://nuxt.com)

## **User management**

username: VARCHAR(30), not unique, firstly generateed then can be set by user

password: VARCHAR(64),firstly generateed then can be set by user ==> HEX ==> bin ==> bitshift ==> sha256 encrypted *(with special key stored in .env)* encryption is done via encrypt.ts API

userid: made from role's first 2 digits + name to hex + roles's last 2 digits ==> sha256 *(with special key stored in .env)* + 1 digit for the role level

accesstoken: 12 randombytes in hex ==> sha256 *(with special key stored in .env)* is used by login auth for automated login


## **Role levels**

**0: stábtag**

**1: kisfőnök**

**2: kampányfőnök**

**3: jelölt**

**4: admin**

