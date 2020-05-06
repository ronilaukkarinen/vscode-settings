function dimesion (obj:any){
    let prop;
    if(obj.type!=='dimension'||obj.content.length === 0){
        console.log('Error:param type is not dimension');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='number'){
           prop = item.content+'px';  
        }
    });
    return prop;
}

export default dimesion;