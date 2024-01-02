const generateDate=()=>{
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    let day = currentDate.getDate().toString().padStart(2, '0'); 
    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
module.exports={generateDate};