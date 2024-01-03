document.addEventListener('load',()=>{
    let url=document.getElementById("url");
    document.addEventListener('submit',(e)=>{
        e.preventDefault();
        console.log(url.value);
    })
});