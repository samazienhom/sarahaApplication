import express from "express"
import startApp from "./src/startApp.js"
import 'dotenv/config'
const app=express()
startApp(app,express)