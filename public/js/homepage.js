window.addEventListener('load',()=>{
    const form=document.getElementById("urlform")
    form.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const url=document.getElementById("url").value;
        const api=location.protocol+"//"+ location.hostname+":"+location.port+"/api/url/shorten";
        console.log(api);
        await axios.post(api,{url:url,},{ withCredentials: true }).then((response)=>{
            console.log(response.data.url,response.data.message);
        },(err)=>{
            console.log(err);
        }).catch((err)=>{
            console.log(err);
        }
    })
});