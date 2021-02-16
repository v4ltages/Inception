// Enables manipulation of the filesystem
const fs = require('fs');

// Enables reading console input 
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// Checks what platform the system is running
let isPlatform = (process.platform)

// Checks if system equals darwin/MacOS or linux/GNU+Linux
if (isPlatform === "darwin" || "linux") {
    
}

