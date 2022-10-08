const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json()); //middleware

app.get("/", (req, res) => {
  res.send("Home pages");
});

// app.get("/posts", (req, res) => {
//     res.send("I am at posts page")
// })



app.post("/posts", (req, res) => {
    // console.log(req.body) //res.body contain whatever the data we post from client(here from postman)
    let received_data = JSON.stringify(req.body)
    fs.writeFileSync("./database.txt", received_data, {encoding: "utf-8"})
    fs.appendFileSync("./database.txt", received_data, {encoding: "utf-8"})
    res.send("Post request is successful") // in respone to post req , if post is succeful , it will send this to client(postman)

})

// app.post("/posts", (req, res) => {
//     // console.log(req.body) //res.body contain whatever the data we post from client(here from postman)
//     let received_data = JSON.stringify(req.body)
//     fs.writeFileSync("./database.txt", received_data, {encoding: "utf-8"})
//     fs.appendFileSync("./database.txt", received_data, {encoding: "utf-8"})
//     res.send("Post request is successful") // in respone to post req , if post is succeful , it will send this to client(postman)

// })

// how to get data ,what client (postman) has send through post and store in
app.get("/posts", (req, res) => {
    //-we have to get the posts data from file and store in var
    // const result = fs.readFileSync("./database.txt", { encoding: "utf-8" });
    //- send tah as response
    let word = ['Rock', 'Paper', 'Scissor','gita','sita'];
    let result = word[Math.floor(Math.random()*word.length)];
    res.send(result);
  });

app.get("/attendance_data", (req, res) => {
    //- read data from db.json and store in variable
    const result = fs.readFileSync("./db.json", {encoding: "utf-8"})
    // console.log(db_data)
    //-perform option what u want
    const parsed_dbData = JSON.parse(result)
    const attendance = parsed_dbData.attendance; // OR {attendance} = parsed_dbData  using destructure
    console.log(attendance)
    //-send the response
    res.send(attendance)
})

app.post("/mark_attendance", (req,res) => {
    //-get the data from client => req.body
    const log = req.body
    //store in db.json
      //1. get attendance data(attendece key from whole data)
      const prev_data = fs.readFileSync("./db.json", {encoding: "utf-8"})
      //2. then add received data to it
      const parsed_prev_data = JSON.parse(prev_data)
      const attendance = parsed_prev_data.attendance;
    //   console.log(attendance)
    attendance.push(log)
    //   console.log(attendance)
      //3. finally store that in db.json
      const latest_data = JSON.stringify(parsed_prev_data)
    //   console.log(latest_data)
    fs.writeFileSync("./db.json", latest_data, "utf-8")
      res.send(log)
})

app.patch("/modify", (req,res) => {
    const {id, new_time} = req.body
    fs.readFile("./db.json", "utf-8", (err,data) => {
        if(err){
            return res.send("Somthing went wrong , try again later")
        }

        const prev_data = JSON.parse(data)
        const new_attend = prev_data.attendance.map((ele) => {
            if(ele.id === id){
                return {...ele, modified_time: new_time}
            }else{
                return ele;
            }
        })
        prev_data.attendance = new_attend;
        fs.writeFileSync("db.json", JSON.stringify(prev_data), "utf-8")
        res.send("done")
    })
})

app.delete("/remove", (req,res) => {
    const {id} = req.body
    fs.readFile("./db.json", "utf-8", (err,data) => {
        if(err){
            return res.send("Somthing went wrong , try again later")
        }

        const prev_data = JSON.parse(data)
        const new_attend = prev_data.attendance.filter((ele) => {
            return ele.id !== id
        })
        
        prev_data.attendance = new_attend;
        console.log(prev_data)
        fs.writeFileSync("db.json", JSON.stringify(prev_data), "utf-8")
        res.send("removed")
    })

})


app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
