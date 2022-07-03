const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// app.use(express.static('build'));


app.post("/compile", (req, res) => {
    var code = req.body.code;
    var language = req.body.language;
    var input = req.body.input;

    if (language === "C") {
        language="C"
    }

    var data = ({
        "code": code,
        "language": language,
        "input": input
    });
    var config = {
        method: 'post',
        url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    Axios(config)
        .then((response)=>{
            res.send(response.data)
            console.log(response.data)
        }).catch((error)=>{
            console.log(error);
        });
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
