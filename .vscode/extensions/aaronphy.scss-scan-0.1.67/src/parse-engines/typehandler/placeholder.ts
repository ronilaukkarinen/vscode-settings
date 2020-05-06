function placeholder (obj:any){
    let prop:any
    if(obj.type!=='placeholder'||obj.content.length === 0){
        console.log('Error:param type is not placeholder');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='ident'){
          prop = item.content;
        }
    });
    return prop;
}

export default placeholder;