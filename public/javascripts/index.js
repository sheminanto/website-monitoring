const errors = document.getElementsByClassName("error");
document.getElementById('status').style.display = 'none';

function hideError() {
   for(let i=0;i<3;i++){
    errors[i].style.display = 'none';
   }
}
hideError();

function disableUi() {
    document.getElementById('id').disabled=true;
    document.getElementById('siteurl').disabled=true;
    document.getElementById('timeInterval').disabled=true;
    document.getElementById('monitor').disabled=true;

}
      
function handleSubmit() {
    const id = document.getElementById('id').value;
    const url = document.getElementById('siteurl').value;
    const delay = document.getElementById('timeInterval').value;  

    let expression1 = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let expression2 =  /^[A-Za-z]+[\w\-\:\.]*$/;
        
    let regex1 = new RegExp(expression1);
    let regex2 = new RegExp(expression2);
    let validId = id.match(regex2);
    let validUrl = url.match(regex1)
    let res;
    if(validId && validUrl && delay !== "") {
        res = true;
        hideError();
    }
    else{
        res = false;
        if(!validUrl){
            errors[0].style.display = 'block';
        }
        if(!validId){
            errors[1].style.display = 'block';
        }
        if(delay === ""){
            errors[2].style.display = 'block';
        }
     
    }
    
        
    if(res){
        document.getElementById('status').style.display = 'block';
        disableUi();
        const ws = new WebSocket("ws://localhost:8082");
        ws.onmessage = async (event) => {
           console.log(`Server has sent : ${await event.data}`);
        };

        ws.addEventListener("open", () => {
            ws.send(`${url},${id},${delay}`);
            console.log("Now we are connected");
        });
    }


        
}