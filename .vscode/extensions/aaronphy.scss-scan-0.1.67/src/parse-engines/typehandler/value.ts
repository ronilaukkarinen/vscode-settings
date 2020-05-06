import DIM from './dimension';
function value(obj:any){
    let prop:any;
    if(obj.type!=='value'||obj.content.length === 0){
        console.log('Error:param type is not value');
        return null;
    }
    obj.content.map((item:any)=>{
        if(item.type ==='color'){
           prop = `#${item.content}`;  
        }
        else if (item.type === 'dimension'){
           prop = DIM(item); 
        }
    });
    return prop;
}

export default value;